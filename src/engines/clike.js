/* TypeMonkey C# / C++ runner: an in-house interpreter for the parts of C# and C++ that TypeMonkey teaches.
   TMC.run(code, "cs" | "cpp") -> {out: "printed text", error: null | "message"}
   Covers: variables and types (int/double/bool/string/char/var/auto), operators with integer division,
   if/else, switch, loops (for, while, do-while, foreach, range-for), break/continue, functions and local
   functions, lambdas, classes/structs (fields, properties, constructors, methods, initializer lists),
   C++ references, pointers and value-copy semantics, C# reference semantics, arrays, List, Dictionary,
   std::vector, string methods, Console.Write/WriteLine (with $"" interpolation), std::cout, Math,
   try/catch/throw. Anything else reports a friendly "not supported yet" error. */
const TMC=(()=>{
  class RunError extends Error{constructor(m,kind){super(m);this.kind=kind||"Error"}}
  class Throw{constructor(v){this.v=v}}
  const BRK={},CNT={};class Ret{constructor(v){this.v=v}}
  const fail=(m,k)=>{throw new RunError(m,k)};

  /* ---------- values ---------- */
  class D{constructor(v){this.v=v}}                 // double
  class Ch{constructor(c){this.c=c}}                // char (code point)
  class Obj{constructor(cls){this.cls=cls;this.f=Object.create(null)}}
  class Arr{constructor(kind,items,elem){this.kind=kind;this.items=items;this.elem=elem}}   // array | list | vector
  class Dict{constructor(){this.m=new Map()}}
  class KV{constructor(k,v){this.k=k;this.v=v}}
  class Ptr{constructor(ref){this.ref=ref}}         // ref is an LValue or null
  class Func{constructor(o){Object.assign(this,o)}}
  class InitList{constructor(items){this.items=items}}
  class Cell{constructor(v,type){this.v=v;this.type=type}get(){return this.v}set(v){this.v=v}}
  class LV{constructor(get,set){this.get=get;this.set=set}}
  const STREAM={stream:true};
  const isNum=v=>typeof v==="number"||v instanceof D||v instanceof Ch;
  const nv=v=>v instanceof D?v.v:v instanceof Ch?v.c:typeof v==="boolean"?(v?1:0):v;

  const INT_T=new Set(["int","long","short","unsigned","size_t","byte","uint","ulong","sbyte","ushort","signed"]);
  const DBL_T=new Set(["double","float","decimal"]);
  const BASE_T=new Set([...INT_T,...DBL_T,"char","bool","string","void","var","auto","object","dynamic"]);

  /* ---------- lexer ---------- */
  function lex(src,lang){
    const t=[];let i=0,line=1;
    const push=(k,v)=>t.push({k,v,line});
    while(i<src.length){
      const c=src[i];
      if(c==="\n"){line++;i++;continue}
      if(/\s/.test(c)){i++;continue}
      if(c==="/"&&src[i+1]==="/"){while(i<src.length&&src[i]!=="\n")i++;continue}
      if(c==="/"&&src[i+1]==="*"){const j=src.indexOf("*/",i+2);const e=j<0?src.length:j+2;line+=(src.slice(i,e).match(/\n/g)||[]).length;i=e;continue}
      if(c==="#"){while(i<src.length&&src[i]!=="\n")i++;continue}      // #include and friends
      if((c==="$"&&(src[i+1]==='"'||(src[i+1]==="@"&&src[i+2]==='"')))||(c==="@"&&src[i+1]==="$"&&src[i+2]==='"')){
        i+=src[i+1]==='"'?2:3;let s="";let depth=0;
        while(i<src.length){const ch=src[i];if(ch==="\\"&&depth===0){s+=ch+src[i+1];i+=2;continue}if(ch==="{")depth++;if(ch==="}")depth=Math.max(0,depth-1);if(ch==='"'&&depth===0)break;if(ch==="\n")line++;s+=ch;i++}
        if(src[i]!=='"')fail(`line ${line}: this string is missing its closing "`,"SyntaxError");
        i++;push("istr",s);continue;
      }
      if(c==='"'||(c==="@"&&src[i+1]==='"')){
        const verbatim=c==="@";i+=verbatim?2:1;let s="";
        while(i<src.length&&src[i]!=='"'){if(src[i]==="\n"){if(!verbatim)fail(`line ${line}: this string is missing its closing "`,"SyntaxError");line++}
          if(src[i]==="\\"&&!verbatim){s+=unesc(src[i+1]);i+=2;continue}s+=src[i++]}
        if(src[i]!=='"')fail(`line ${line}: this string is missing its closing "`,"SyntaxError");
        i++;push("str",s);continue;
      }
      if(c==="'"){let ch=src[i+1],j=i+2;if(ch==="\\"){ch=unesc(src[i+2]);j=i+3}if(src[j]!=="'")fail(`line ${line}: a character in single quotes must be one character`,"SyntaxError");push("char",ch);i=j+1;continue}
      if(/[0-9]/.test(c)||(c==="."&&/[0-9]/.test(src[i+1]))){
        let j=i;while(/[0-9_]/.test(src[j]))j++;let isD=false;
        if(src[j]==="."&&/[0-9]/.test(src[j+1])){isD=true;j++;while(/[0-9]/.test(src[j]))j++}
        if(/[eE]/.test(src[j])&&/[-+0-9]/.test(src[j+1])){isD=true;j++;if(/[-+]/.test(src[j]))j++;while(/[0-9]/.test(src[j]))j++}
        const s=src.slice(i,j).replace(/_/g,"");
        if(/[fFdDmM]/.test(src[j])){isD=true;j++}else while(/[lLuU]/.test(src[j]))j++;
        push("num",isD?new D(parseFloat(s)):parseInt(s,10));i=j;continue;
      }
      if(/[A-Za-z_]/.test(c)){
        let j=i;while(j<src.length&&/[A-Za-z0-9_]/.test(src[j]))j++;let w=src.slice(i,j);i=j;
        if(w==="std"&&src.slice(i,i+2)==="::"){i+=2;while(/\s/.test(src[i]))i++;let k=i;while(k<src.length&&/[A-Za-z0-9_]/.test(src[k]))k++;w=src.slice(i,k);i=k}
        push("id",w);continue;
      }
      const three=src.slice(i,i+3),two=src.slice(i,i+2);
      if(["<<=",">>="].includes(three)){push("op",three);i+=3;continue}
      if(["++","--","+=","-=","*=","/=","%=","==","!=","<=",">=","&&","||","<<",">>","::","->","=>","??","&=","|="].includes(two)){push("op",two);i+=2;continue}
      if("+-*/%=<>!&|^~?:;,.(){}[]".includes(c)){push("op",c);i++;continue}
      fail(`line ${line}: unexpected character "${c}"`,"SyntaxError");
    }
    push("eof","");return t;
    function unesc(ch){return ({n:"\n",t:"\t",r:"\r","0":"\0","\\":"\\","'":"'",'"':'"'})[ch]??ch}
  }

  /* ---------- parser ---------- */
  function parse(tokens,lang,classNames){
    let p=0;
    const peek=(o=0)=>tokens[Math.min(p+o,tokens.length-1)];
    const is=(v,o=0)=>{const t=peek(o);return (t.k==="op"||t.k==="id")&&t.v===v};
    const isOp=(v,o=0)=>peek(o).k==="op"&&peek(o).v===v;
    const accept=v=>{if(is(v)){p++;return true}return false};
    const near=()=>{const t=peek();return t.k==="eof"?"the end of the code":`"${t.v instanceof D?t.v.v:t.v}"`};
    const expect=v=>{if(!is(v))fail(`line ${peek().line}: expected "${v}" near ${near()}${v===";"?". Did you forget a semicolon?":""}`,"SyntaxError");p++};
    const ident=()=>{const t=peek();if(t.k!=="id")fail(`line ${t.line}: expected a name near ${near()}`,"SyntaxError");p++;return t.v};
    const MODS=new Set(["public","private","protected","internal","static","const","readonly","virtual","override","sealed","abstract","inline","constexpr","extern","unsafe","async","explicit","partial","new_"]);

    // type: [const] Name[<T,...>][::Name][*|&|[]]...
    function tryType(){
      const save=p;let isConst=false;
      while(is("const")||is("unsigned")&&isType(peek(1))||is("signed")){if(peek().v==="const")isConst=true;p++}
      const t=peek();
      if(t.k!=="id"||!isTypeName(t.v)){p=save;return null}
      p++;let name=t.v;const args=[];
      if(name==="unsigned"||name==="long"&&is("long")){if(peek().k==="id"&&INT_T.has(peek().v))p++}
      if(isOp("<")&&(isGeneric(name))){
        p++;
        for(;;){const a=tryType();if(!a){p=save;return null}args.push(a);if(accept(","))continue;
          if(isOp(">>")){tokens[p]={...tokens[p],v:">"};tokens.splice(p,0,{...tokens[p],v:">"})}
          if(!accept(">")){p=save;return null}break}
      }
      let type={name,args,ref:false,ptr:0,arr:0,isConst};
      while(is("const"))p++;
      for(;;){
        if(isOp("*")){type.ptr++;p++;continue}
        if(isOp("&")){type.ref=true;p++;continue}
        if(isOp("&&")){type.ref=true;p++;continue}
        if(isOp("[")&&isOp("]",1)){type.arr++;p+=2;continue}
        if(isOp("?")&&lang==="cs"&&(peek(1).k==="id")){p++;continue}   // nullable int?
        break;
      }
      while(is("const"))p++;
      return type;
    }
    function isType(t){return t.k==="id"&&isTypeName(t.v)}
    function isTypeName(n){return BASE_T.has(n)||classNames.has(n)||["List","Dictionary","vector","map","pair","HashSet","string","Random","Exception","KeyValuePair","Func","Action","unordered_map"].includes(n)}
    function isGeneric(n){return ["List","Dictionary","vector","map","pair","HashSet","KeyValuePair","Func","Action","unordered_map"].includes(n)||classNames.has(n)}

    function program(){
      const items=[];
      while(peek().k!=="eof"){
        if(accept(";"))continue;
        if(is("using")){while(!isOp(";")&&peek().k!=="eof")p++;accept(";");continue}
        if(is("namespace")){p++;while(peek().k==="id"||isOp("."))p++;if(accept("{")){/* flatten */}continue}
        if(isOp("}")){p++;continue}  // closing namespace
        items.push(topItem());
      }
      return items;
    }
    function topItem(){
      let save=p;
      while(peek().k==="id"&&MODS.has(peek().v))p++;
      if(is("class")||is("struct")){return classDef()}
      if(is("enum"))fail(`line ${peek().line}: enums aren't supported in TypeMonkey's runner yet`,"NotSupported");
      p=save;return statement(true);
    }
    function classDef(){
      const kind=ident();const name=ident();
      if(accept(":")){fail(`line ${peek().line}: inheritance (class ${name} : ...) isn't supported in TypeMonkey's runner yet`,"NotSupported")}
      expect("{");
      const cls={name,fields:[],methods:Object.create(null),ctors:[],statics:[],isStruct:kind==="struct",props:Object.create(null)};
      while(!accept("}")){
        if(peek().k==="eof")fail(`the class ${name} is missing its closing }`,"SyntaxError");
        if((is("public")||is("private")||is("protected"))&&isOp(":",1)){p+=2;continue}
        let isStatic=false;
        while(peek().k==="id"&&MODS.has(peek().v)){if(peek().v==="static")isStatic=true;p++}
        if(accept(";"))continue;
        // constructor
        if(peek().v===name&&isOp("(",1)){p++;const params=paramList();const init=[];
          if(accept(":")){do{const f=ident();if(accept("{")){const a=isOp("}")?[]:args("}");expect("}");init.push([f,a])}else{expect("(");const a=isOp(")")?[]:args(")");expect(")");init.push([f,a])}}while(accept(","))}
          let body;if(accept("=>")){body={k:"block",body:[{k:"expr",e:expr()}]};expect(";")}else body=block();
          cls.ctors.push({params,init,body});continue}
        if(isOp("~"))fail("destructors aren't supported in TypeMonkey's runner yet","NotSupported");
        const type=tryType();if(!type)fail(`line ${peek().line}: expected a type near ${near()}`,"SyntaxError");
        if(is("operator"))fail("operator overloading isn't supported in TypeMonkey's runner yet","NotSupported");
        const mname=ident();
        if(isOp("(")){
          const params=paramList();while(is("const")||is("override"))p++;
          let body;if(accept("=>")){body={k:"block",body:[{k:"return",e:expr()}]};expect(";")}else body=block();
          (isStatic?cls.statics:cls.fields);cls.methods[mname]={params,body,ret:type,isStatic,name:mname};continue;
        }
        if(isOp("{")&&lang==="cs"){  // property
          p++;let getOnly=true,privSet=false;
          while(!accept("}")){if(peek().v==="private"||peek().v==="protected"){privSet=true;p++;continue}
            if(accept("get")){if(accept("=>")){fail("property getters with bodies aren't supported yet; use a method instead","NotSupported")}accept(";");continue}
            if(accept("set")||accept("init")){getOnly=false;accept(";");continue}
            fail(`line ${peek().line}: unexpected ${near()} in property`,"SyntaxError")}
          let init=null;if(accept("=")){init=expr();expect(";")}
          (isStatic?cls.statics:cls.fields).push({name:mname,type,init});continue;
        }
        if(accept("=>")){const e=expr();expect(";");cls.methods[mname]={params:[],body:{k:"block",body:[{k:"return",e}]},ret:type,isProp:true,name:mname};continue}
        // field(s)
        let names=[[mname,null]];
        for(;;){
          if(accept("=")){names[names.length-1][1]=expr()}
          else if(isOp("{")&&lang==="cpp"){p++;const a=isOp("}")?[]:args("}");expect("}");names[names.length-1][1]={k:"init",items:a}}
          if(accept(",")){names.push([ident(),null]);continue}
          break;
        }
        expect(";");
        for(const [n,init] of names)(isStatic?cls.statics:cls.fields).push({name:n,type,init});
      }
      accept(";");
      return {k:"class",cls};
    }
    function paramList(){
      expect("(");const ps=[];
      if(!isOp(")"))do{
        while(is("ref")||is("out")||is("in")||is("params")||is("this")){if(peek().v==="out")fail("out parameters aren't supported in TypeMonkey's runner yet","NotSupported");p++}
        const type=tryType();if(!type)fail(`line ${peek().line}: expected a parameter type near ${near()}`,"SyntaxError");
        const name=peek().k==="id"?ident():"_";let def=null;if(accept("="))def=expr();ps.push({type,name,def})}while(accept(","));
      expect(")");return ps;
    }
    function block(){expect("{");const body=[];while(!accept("}")){if(peek().k==="eof")fail("a { block is missing its closing }","SyntaxError");body.push(statement(false))}return {k:"block",body}}

    function statement(top){
      const t=peek();const line=t.line;
      if(isOp("{"))return block();
      if(accept(";"))return {k:"empty"};
      if(t.k==="id"){
        switch(t.v){
          case "if":{p++;expect("(");const c=expr();expect(")");const a=statement();let b=null;if(accept("else"))b=statement();return {k:"if",c,a,b,line}}
          case "while":{p++;expect("(");const c=expr();expect(")");return {k:"while",c,body:statement(),line}}
          case "do":{p++;const body=statement();expect("while");expect("(");const c=expr();expect(")");expect(";");return {k:"do",c,body,line}}
          case "for":{
            p++;expect("(");const save=p;
            const ty=tryType();
            if(ty&&peek().k==="id"&&isOp(":",1)){const name=ident();p++;const coll=expr();expect(")");return {k:"forin",type:ty,name,coll,body:statement(),line}}
            p=save;
            let init=null;if(!isOp(";"))init=declOrExpr(true);expect(";");
            const c=isOp(";")?null:expr();expect(";");
            const steps=[];if(!isOp(")"))do steps.push(expr());while(accept(","));expect(")");
            return {k:"for",init,c,steps,body:statement(),line};
          }
          case "foreach":{p++;expect("(");const ty=tryType();const name=ident();expect("in");const coll=expr();expect(")");return {k:"forin",type:ty,name,coll,body:statement(),line}}
          case "break":p++;expect(";");return {k:"break"};
          case "continue":p++;expect(";");return {k:"continue"};
          case "return":{p++;const e=isOp(";")?null:expr();expect(";");return {k:"return",e,line}}
          case "switch":{p++;expect("(");const e=expr();expect(")");expect("{");const cases=[];
            while(!accept("}")){if(accept("case")){const v=expr();expect(":");cases.push({v,body:[]})}else if(accept("default")){expect(":");cases.push({def:true,body:[]})}else{if(!cases.length)fail("expected case inside switch","SyntaxError");cases[cases.length-1].body.push(statement())}}
            return {k:"switch",e,cases,line}}
          case "try":{p++;const body=block();const catches=[];
            while(accept("catch")){let type=null,name=null;if(accept("(")){if(isOp("."))p+=3;else{type=tryType()||(peek().k==="id"?{name:ident(),args:[]}:null);if(type&&isOp("&"))p++;if(peek().k==="id")name=ident()}expect(")")}catches.push({type,name,body:block()})}
            let fin=null;if(accept("finally"))fin=block();return {k:"try",body,catches,fin}}
          case "throw":{p++;const e=isOp(";")?null:expr();expect(";");return {k:"throw",e,line}}
          case "delete":{p++;if(isOp("["))p+=2;expr();expect(";");return {k:"empty"}}
          case "class":case "struct":if(top||lang==="cs")return classDef();break;
        }
        if(t.v==="goto")fail("goto isn't supported in TypeMonkey's runner","NotSupported");
      }
      const s=declOrExpr(false);if(s.k!=="func")expect(";");return s;
    }
    // declaration (variables or local function) or expression statement
    function declOrExpr(inFor){
      const save=p;
      let isStatic=false;
      while(peek().k==="id"&&MODS.has(peek().v)&&!(peek().v==="new_")){if(peek().v==="static")isStatic=true;p++}
      const type=tryType();
      if(type&&peek().k==="id"&&!(peek(1).k==="op"&&["++","--",".","->","[","::"].includes(peek(1).v)&&peek(1).v!=="[")){
        const name=peek().v;const line=peek().line;
        // function definition?
        if(isOp("(",1)&&!inFor){
          const s2=p;p++;
          let params=null;try{params=paramList()}catch(e){params=null}
          if(params&&(isOp("{")||isOp("=>")||is("const"))){
            while(is("const"))p++;
            let body;if(accept("=>")){body={k:"block",body:[{k:"return",e:expr()}]};expect(";")}else body=block();
            return {k:"func",name,params,body,ret:type,line};
          }
          p=s2;
        }
        p++;
        const decls=[];
        let cur={name,type,init:null,line,ctorArgs:null};
        for(;;){
          if(isOp("[")&&lang==="cpp"){p++;const n=isOp("]")?null:expr();expect("]");cur.type={...cur.type,arr:(cur.type.arr||0)+1};cur.fixedLen=n}
          if(accept("=")){cur.init=isOp("{")?initList():expr()}
          else if(isOp("{")){cur.init=initList()}
          else if(isOp("(")&&lang==="cpp"){p++;cur.ctorArgs=isOp(")")?[]:args(")");expect(")")}
          decls.push(cur);
          if(accept(",")){
            const ptr=isOp("*")?(p++,1):0;const ref=isOp("&")?(p++,true):false;
            cur={name:ident(),type:{...type,ptr,ref:ref||false},init:null,line:peek().line};continue}
          break;
        }
        return {k:"decl",decls};
      }
      p=save;
      return {k:"expr",e:expr(),line:peek().line};
    }
    function initList(){expect("{");const items=isOp("}")?[]:args("}");expect("}");return {k:"init",items}}
    function args(close){const a=[];do{if(isOp(close))break;a.push(isOp("{")?initList():expr())}while(accept(","));return a}

    /* expressions (precedence climbing) */
    const BIN=[["??"],["||"],["&&"],["|"],["^"],["&"],["==","!="],["<","<=",">",">="],["<<",">>"],["+","-"],["*","/","%"]];
    function expr(){return assign()}
    function assign(){
      const l=ternary();
      const t=peek();
      if(t.k==="op"&&["=","+=","-=","*=","/=","%=","<<=",">>=","&=","|="].includes(t.v)){p++;const r=isOp("{")?initList():assign();return {k:"assign",op:t.v,l,r,line:t.line}}
      return l;
    }
    function ternary(){const c=bin(0);if(accept("?")){const a=assign();expect(":");const b=assign();return {k:"cond",c,a,b}}return c}
    function bin(lvl){
      if(lvl>=BIN.length)return unary();
      let l=bin(lvl+1);
      for(;;){const t=peek();if(t.k==="op"&&BIN[lvl].includes(t.v)){p++;const r=bin(lvl+1);l={k:"bin",op:t.v,l,r,line:t.line}}
        else if(lvl===7&&lang==="cs"&&t.k==="id"&&t.v==="is"){p++;const ty=tryType();l={k:"is",e:l,type:ty}}
        else return l}
    }
    function unary(){
      const t=peek();
      if(t.k==="op"){
        if(["!","-","+","~"].includes(t.v)){p++;return {k:"un",op:t.v,e:unary(),line:t.line}}
        if(t.v==="++"||t.v==="--"){p++;return {k:"pre",op:t.v,e:unary(),line:t.line}}
        if(t.v==="*"&&lang==="cpp"){p++;return {k:"deref",e:unary(),line:t.line}}
        if(t.v==="&"&&lang==="cpp"){p++;return {k:"addr",e:unary(),line:t.line}}
        if(t.v==="("){ // cast
          const save=p;p++;const ty=tryType();
          if(ty&&accept(")")&&(BASE_T.has(ty.name)||ty.ptr)&&!(peek().k==="op"&&[")",";",",","+","-","*","/"].includes(peek().v)&&peek().v!=="("&&peek().v!=="-")){return {k:"cast",type:ty,e:unary()}}
          if(ty&&tokens[p-1].v===")"&&BASE_T.has(ty.name)&&(peek().k!=="op"||["(","-","!"].includes(peek().v))){return {k:"cast",type:ty,e:unary()}}
          p=save;
        }
      }
      if(t.k==="id"&&t.v==="new")return postfix(newExpr());
      if(t.k==="id"&&(t.v==="sizeof"))fail("sizeof isn't supported in TypeMonkey's runner yet","NotSupported");
      return postfix(primary());
    }
    function newExpr(){
      const line=peek().line;p++;
      if(isOp("[")){p++;expect("]");const il=initList();return {k:"newarr",type:null,items:il.items,line}}
      const type=tryTypeNoArr();if(!type)fail(`line ${line}: expected a type after new`,"SyntaxError");
      if(isOp("[")){p++;const n=isOp("]")?null:expr();expect("]");let items=null;if(isOp("{"))items=initList().items;return {k:"newarr",type,len:n,items,line}}
      let a=[];if(accept("(")){a=isOp(")")?[]:args(")");expect(")")}
      let init=null;
      if(isOp("{")){p++;init=[];
        while(!accept("}")){
          if(isOp("[")){p++;const key=expr();expect("]");expect("=");init.push({key,val:expr()})}
          else if(isOp("{")){p++;const key=expr();expect(",");const val=expr();expect("}");init.push({key,val})}
          else if(peek().k==="id"&&isOp("=",1)){const f=ident();p++;init.push({field:f,val:isOp("{")?initList():expr()})}
          else init.push({val:isOp("{")?initList():expr()});
          if(!accept(","))if(!isOp("}"))fail(`line ${line}: expected , or } in the initializer`,"SyntaxError");
        }
      }
      return {k:"new",type,args:a,init,line};
    }
    function tryTypeNoArr(){const save=p;const t=tryType();if(!t){p=save;return null}if(t.arr){/* new int[] {...} */p-=2*t.arr;t.arr=0}return t}
    function postfix(e){
      for(;;){
        const t=peek();
        if(isOp("(")){p++;const a=isOp(")")?[]:args(")");expect(")");e={k:"call",f:e,args:a,line:t.line};continue}
        if(isOp("[")){p++;const i=expr();expect("]");e={k:"index",e,i,line:t.line};continue}
        if(isOp(".")||isOp("->")||isOp("::")||(isOp("?")&&isOp(".",1))){if(isOp("?"))p++;const arrow=peek().v==="->";p++;const name=ident();
          if(isOp("<")&&lang==="cs"&&name.match(/^(Cast|OfType|Select|Where)$/))fail(`LINQ (.${name}) isn't supported in TypeMonkey's runner yet`,"NotSupported");
          e={k:"member",e,name,arrow,line:t.line};continue}
        if(isOp("++")||isOp("--")){p++;e={k:"post",op:t.v,e,line:t.line};continue}
        return e;
      }
    }
    function lambdaAhead(){ // (a, b) => or (int a) =>
      if(!isOp("("))return false;let d=0,j=p;
      for(;j<tokens.length;j++){const v=tokens[j];if(v.k==="op"&&v.v==="(")d++;else if(v.k==="op"&&v.v===")"){d--;if(!d)break}}
      return tokens[j+1]&&tokens[j+1].k==="op"&&tokens[j+1].v==="=>";
    }
    function lambdaBody(){if(isOp("{"))return block();return {k:"block",body:[{k:"return",e:expr()}]}}
    function primary(){
      const t=peek();
      if(t.k==="num"){p++;return {k:"lit",v:t.v}}
      if(t.k==="str"){p++;return {k:"lit",v:t.v}}
      if(t.k==="char"){p++;return {k:"lit",v:new Ch(t.v.codePointAt(0))}}
      if(t.k==="istr"){p++;return {k:"istr",parts:interp(t.v,t.line)}}
      if(lang==="cs"&&lambdaAhead()){p++;const ps=[];if(!isOp(")"))do{const ty=peek().k==="id"&&peek(1).k==="id"?tryType():null;ps.push({type:ty,name:ident()})}while(accept(","));expect(")");expect("=>");return {k:"lambda",params:ps,body:lambdaBody()}}
      if(lang==="cpp"&&isOp("[")){ // lambda
        p++;while(!accept("]"))p++;let ps=[];if(isOp("("))ps=paramList();while(is("mutable"))p++;if(accept("->"))tryType();return {k:"lambda",params:ps,body:block()}}
      if(isOp("(")){p++;const e=expr();expect(")");return e}
      if(t.k==="id"){
        if(lang==="cs"&&isOp("=>",1)){const n=ident();p++;return {k:"lambda",params:[{name:n}],body:lambdaBody()}}
        p++;
        if(t.v==="true")return {k:"lit",v:true};
        if(t.v==="false")return {k:"lit",v:false};
        if(t.v==="null"||t.v==="nullptr"||t.v==="NULL")return {k:"lit",v:null};
        if(t.v==="this")return {k:"this"};
        if(isOp("<")&&isGeneric(t.v)){const save=p;p--;const ty=tryType();if(ty&&(isOp("(")||isOp("{"))){return {k:"typeval",type:ty}}p=save}
        return {k:"name",v:t.v,line:t.line};
      }
      fail(`line ${t.line}: unexpected ${near()}`,"SyntaxError");
    }
    function interp(s,line){
      const parts=[];let i=0,lit="";
      while(i<s.length){
        if(s[i]==="{"&&s[i+1]==="{"){lit+="{";i+=2;continue}
        if(s[i]==="}"&&s[i+1]==="}"){lit+="}";i+=2;continue}
        if(s[i]==="\\"){lit+=({n:"\n",t:"\t","\\":"\\",'"':'"'})[s[i+1]]??s[i+1];i+=2;continue}
        if(s[i]==="{"){
          let d=1,j=i+1,inStr=false;for(;j<s.length;j++){if(s[j]==='"')inStr=!inStr;if(inStr)continue;if(s[j]==="{")d++;if(s[j]==="}"){d--;if(!d)break}}
          if(lit)parts.push(lit),lit="";
          let inner=s.slice(i+1,j),fmt=null,align=null;
          let dd=0,cut=-1;for(let k=0;k<inner.length;k++){const ch=inner[k];if("([{".includes(ch))dd++;else if(")]}".includes(ch))dd--;else if(ch==='"'){k=inner.indexOf('"',k+1);if(k<0)break}else if(ch===":"&&dd===0&&inner[k+1]!==":"&&inner[k-1]!==":"){
            // a ? b : c inside holes needs parentheses in C#, so the first top-level : is a format
            cut=k;break}}
          if(cut>=0){fmt=inner.slice(cut+1);inner=inner.slice(0,cut)}
          const ac=inner.lastIndexOf(",");if(ac>0&&/^\s*-?\d+\s*$/.test(inner.slice(ac+1))){align=parseInt(inner.slice(ac+1));inner=inner.slice(0,ac)}
          const sub=parse(lex(inner,lang),lang,classNames);parts.push({e:sub.exprOnly(),fmt,align});
          i=j+1;continue;
        }
        lit+=s[i++];
      }
      if(lit)parts.push(lit);
      return parts;
    }
    function exprOnly(){const e=expr();if(peek().k!=="eof")fail(`unexpected ${near()} inside { } in the string`,"SyntaxError");return e}
    return {program,exprOnly};
  }

  /* ---------- runtime ---------- */
  function run(code,lang){
    let out="";let steps=0;
    const tick=()=>{if(++steps>300000)fail("Your program ran too long, so I stopped it. Check for a loop that never ends.","Timeout")};
    const classNames=new Set([...code.matchAll(/\b(?:class|struct)\s+([A-Za-z_]\w*)/g)].map(m=>m[1]));
    const classes=Object.create(null);
    const globalEnv=new Env(null);
    const funcs=Object.create(null);
    const W=s=>{out+=s;if(out.length>200000)fail("Your program printed too much, so I stopped it.","Timeout")};

    function Env(parent){this.vars=new Map();this.parent=parent;this.self=parent?parent.self:null;this.cls=parent?parent.cls:null}
    Env.prototype.find=function(n){let e=this;while(e){if(e.vars.has(n))return e.vars.get(n);e=e.parent}return null};
    Env.prototype.def=function(n,cell,line){if(this.vars.has(n)&&!(this.vars.get(n) instanceof Func))fail(`line ${line||"?"}: ${lang==="cs"?`A local variable named '${n}' is already defined here`:`redeclaration of '${n}'`}`,"CompileError");this.vars.set(n,cell)};

    /* type conversions */
    function tname(t){return t?t.name:"var"}
    function isClassT(t){return t&&classes[t.name]&&!t.ptr&&!t.ref}
    function defaultFor(t){
      if(!t)return null;if(t.ptr)return null;if(t.arr)return null;
      if(INT_T.has(t.name))return 0;if(DBL_T.has(t.name))return new D(0);if(t.name==="bool")return false;if(t.name==="char")return new Ch(0);
      if(t.name==="string")return lang==="cpp"?"":null;
      if(lang==="cpp"){if(t.name==="vector")return new Arr("vector",[],t.args[0]);if(classes[t.name])return construct(classes[t.name],[],0)}
      if(classes[t.name]&&classes[t.name].isStruct)return construct(classes[t.name],[],0);
      return null;
    }
    function coerce(v,t,line){
      if(!t||t.name==="var"||t.name==="auto"||t.name==="object"||t.name==="dynamic"){if(v instanceof InitList)return new Arr(lang==="cpp"?"vector":"array",v.items,null);return lang==="cpp"&&!(t&&t.ref)?copy(v):v}
      if(t.ptr)return v;
      if(t.arr){if(v instanceof InitList)return new Arr("array",v.items.map(x=>coerce(x,{...t,arr:t.arr-1},line)),{...t,arr:t.arr-1});return v}
      if(v instanceof InitList){
        if(t.name==="vector"||t.name==="List"||t.name==="HashSet")return new Arr(t.name==="vector"?"vector":"list",v.items.map(x=>coerce(x,t.args[0],line)),t.args[0]);
        if(classes[t.name])return lang==="cpp"&&classes[t.name].ctors.length?construct(classes[t.name],v.items,line):aggregate(classes[t.name],v.items,line);
        if(v.items.length===1)return coerce(v.items[0],t,line);
        if(!v.items.length)return defaultFor(t);
        fail(`line ${line}: can't use { } to make a ${tname(t)}`,"CompileError");
      }
      if(INT_T.has(t.name)){
        if(typeof v==="string")fail(`line ${line}: ${lang==="cs"?`Cannot implicitly convert type 'string' to '${t.name}'`:`invalid conversion from text to '${t.name}'`}`,"CompileError");
        if(v instanceof D){if(lang==="cs"&&t.name!=="var")fail(`line ${line}: Cannot implicitly convert type 'double' to 'int'. Use (int) to convert on purpose.`,"CompileError");return Math.trunc(v.v)}
        if(v instanceof Ch)return v.c;if(typeof v==="boolean"){if(lang==="cs")fail(`line ${line}: Cannot implicitly convert type 'bool' to 'int'`,"CompileError");return v?1:0}
        return v;
      }
      if(DBL_T.has(t.name)){if(typeof v==="string")fail(`line ${line}: Cannot convert text to '${t.name}'`,"CompileError");return v===null?v:new D(nv(v))}
      if(t.name==="bool"){if(lang==="cs"&&typeof v!=="boolean")fail(`line ${line}: Cannot implicitly convert type '${typeOf(v)}' to 'bool'`,"CompileError");return typeof v==="boolean"?v:!!nv(v)}
      if(t.name==="char"){return typeof v==="number"?new Ch(v):v}
      if(t.name==="string"){if(lang==="cs"&&v!==null&&typeof v!=="string")fail(`line ${line}: Cannot implicitly convert type '${typeOf(v)}' to 'string'`,"CompileError");if(v instanceof Ch)return String.fromCodePoint(v.c);return v}
      if(lang==="cpp"&&!t.ref)return copy(v);
      return v;
    }
    function typeOf(v){return typeof v==="number"?"int":v instanceof D?"double":typeof v==="boolean"?"bool":typeof v==="string"?"string":v instanceof Ch?"char":v instanceof Obj?v.cls.name:v===null?"null":"object"}
    function copy(v){  // C++ value semantics
      if(v instanceof Obj){const o=new Obj(v.cls);for(const k in v.f)o.f[k]=copy(v.f[k]);return o}
      if(v instanceof Arr&&(v.kind==="vector"||v.kind==="array"))return new Arr(v.kind,v.items.map(copy),v.elem);
      if(v instanceof Dict&&lang==="cpp"){const d=new Dict();for(const [k,x] of v.m)d.m.set(k,[x[0],copy(x[1])]);return d}
      return v;
    }
    function construct(cls,argVals,line,inits,env){
      const o=new Obj(cls);
      const fenv=new Env(globalEnv);fenv.self=o;fenv.cls=cls;
      for(const f of cls.fields)o.f[f.name]=f.init?coerce(f.init.k==="init"?new InitList(f.init.items.map(x=>ev(x,fenv))):ev(f.init,fenv),f.type,line):defaultFor(f.type);
      if(cls.ctors.length){
        const c=pickOverload(cls.ctors,argVals.length);
        if(!c){if(argVals.length===0&&!cls.ctors.some(x=>x.params.length===0)&&lang==="cs"&&!inits){fail(`line ${line}: ${cls.name} needs ${cls.ctors[0].params.length} argument(s) when you create it with new`,"CompileError")}}
        if(c){
          const cenv=new Env(globalEnv);cenv.self=o;cenv.cls=cls;bindParams(c.params,argVals,cenv,line);
          for(const [fname,a] of c.init){const f=cls.fields.find(x=>x.name===fname);o.f[fname]=coerce(a.length===1?ev(a[0],cenv):new InitList(a.map(x=>ev(x,cenv))),f?f.type:null,line)}
          execBlock(c.body,cenv,true);
        }
      }else if(argVals.length&&lang==="cpp")return aggregate(cls,argVals.map(v=>({k:"val",v})),line);
      else if(argVals.length)fail(`line ${line}: ${cls.name} doesn't have a constructor that takes ${argVals.length} argument(s)`,"CompileError");
      if(inits)for(const it of inits){if(!it.field)fail(`line ${line}: use Name = value in an object initializer`,"SyntaxError");if(!(it.field in o.f))fail(`line ${line}: '${cls.name}' does not contain a definition for '${it.field}'`,"CompileError");const f=cls.fields.find(x=>x.name===it.field);o.f[it.field]=coerce(it.val.k==="init"?new InitList(it.val.items.map(x=>ev(x,env))):ev(it.val,env),f.type,line)}
      return o;
    }
    function aggregate(cls,items,line){
      const o=new Obj(cls);const fenv=new Env(globalEnv);fenv.self=o;fenv.cls=cls;
      cls.fields.forEach((f,i)=>{o.f[f.name]=i<items.length?coerce(items[i] instanceof Object&&items[i].k==="val"?items[i].v:items[i],f.type,line):(f.init?coerce(ev(f.init,fenv),f.type,line):defaultFor(f.type))});
      return o;
    }
    function pickOverload(list,n){return list.find(c=>c.params.length===n)||list.find(c=>c.params.length>n&&c.params.slice(n).every(p=>p.def))}
    function bindParams(params,argVals,env,line,argRefs){
      params.forEach((pr,i)=>{
        let v=i<argVals.length?argVals[i]:pr.def?ev(pr.def,env):fail(`line ${line}: missing an argument for '${pr.name}'`,"CompileError");
        if(pr.type&&pr.type.ref&&lang==="cpp"){const r=argRefs&&argRefs[i];if(!r&&pr.type.isConst){env.vars.set(pr.name,new Cell(v,pr.type));return}if(!r)fail(`line ${line}: '${pr.name}' is a reference (&), so you have to pass a variable, not a value`,"CompileError");env.vars.set(pr.name,r);return}
        env.vars.set(pr.name,new Cell(coerce(v,pr.type,line),pr.type));
      });
    }

    /* printing */
    function fmtG(x,prec=6){
      if(!isFinite(x))return isNaN(x)?(lang==="cpp"?"nan":"NaN"):(x<0?"-":"")+(lang==="cpp"?"inf":"∞");
      if(x===0)return Object.is(x,-0)?"-0":"0";
      const e=Math.floor(Math.log10(Math.abs(x)));
      let s;
      if(e<-5||e>=prec){s=x.toExponential(prec-1);let [m,ex]=s.split("e");if(m.includes("."))m=m.replace(/0+$/,"").replace(/\.$/,"");const n=parseInt(ex);s=m+"e"+(n<0?"-":"+")+String(Math.abs(n)).padStart(2,"0")}
      else{s=x.toPrecision(prec);if(s.includes(".")&&!s.includes("e"))s=s.replace(/0+$/,"").replace(/\.$/,"");if(s.includes("e"))s=String(parseFloat(s))}
      return s;
    }
    function str(v,ctx){  // ctx: "cs" | "cpp"
      if(v===null||v===undefined)return lang==="cs"?"":"0";
      if(typeof v==="string")return v;
      if(typeof v==="number")return String(v);
      if(v instanceof D){if(lang==="cpp")return fmtG(v.v);if(!isFinite(v.v))return isNaN(v.v)?"NaN":v.v>0?"∞":"-∞";let s=String(v.v);if(/e/.test(s)){s=s.replace(/e\+?/,"E+").replace("E+-","E-");if(!/E-/.test(s)&&!/E\+/.test(s))s=s.replace("E","E+")}return s}
      if(typeof v==="boolean")return lang==="cs"?(v?"True":"False"):(v?"1":"0");
      if(v instanceof Ch)return String.fromCodePoint(v.c);
      if(v instanceof Obj){if(v.cls.methods.ToString&&lang==="cs")return str(callMethod(v,"ToString",[],0));return lang==="cs"?v.cls.name:`[${v.cls.name} object]`}
      if(v instanceof Arr)return lang==="cs"?(v.kind==="list"?`System.Collections.Generic.List\`1[${netName(v.elem)}]`:`${netName(v.elem)}[]`):fail("you can't print a whole vector with cout. Loop over it and print each item.","CompileError");
      if(v instanceof Dict)return `System.Collections.Generic.Dictionary\`2[System.String,System.Int32]`;
      if(v instanceof KV)return `[${str(v.k)}, ${str(v.v)}]`;
      if(v instanceof Ptr)return v.ref?"0x7ffd"+((addrOf(v.ref)).toString(16).padStart(8,"0")):"0";
      if(v===STREAM)return "";
      if(v instanceof Func)return lang==="cs"?"System.Func":"1";
      return String(v);
    }
    const addrs=new WeakMap();let nextAddr=0x5a3c10;
    function addrOf(r){const key=r instanceof Cell?r:r.key||r;if(!addrs.has(key)){addrs.set(key,nextAddr);nextAddr+=16}return addrs.get(key)}
    function netName(t){if(!t)return "System.Object";return ({int:"System.Int32",string:"System.String",double:"System.Double",bool:"System.Boolean",char:"System.Char"})[t.name]||t.name}
    function fmtNum(v,fmt){
      if(!fmt)return str(v);
      const m=fmt.match(/^([A-Za-z])(\d*)$/);
      if(m&&isNum(v)){const k=m[1].toUpperCase(),d=m[2]===""?2:parseInt(m[2]);const x=nv(v);
        if(k==="F")return x.toFixed(m[2]===""?2:d);
        if(k==="N")return x.toLocaleString("en-US",{minimumFractionDigits:m[2]===""?2:d,maximumFractionDigits:m[2]===""?2:d});
        if(k==="C")return "$"+x.toLocaleString("en-US",{minimumFractionDigits:m[2]===""?2:d,maximumFractionDigits:m[2]===""?2:d});
        if(k==="P")return (x*100).toLocaleString("en-US",{minimumFractionDigits:m[2]===""?2:d,maximumFractionDigits:m[2]===""?2:d})+" %";
        if(k==="D")return String(Math.trunc(x)).padStart(m[2]===""?0:d,"0");
        if(k==="X")return Math.trunc(x).toString(16).toUpperCase().padStart(m[2]===""?0:d,"0");
      }
      if(/^0+(\.0+)?$/.test(fmt)&&isNum(v)){const dec=(fmt.split(".")[1]||"").length;return nv(v).toFixed(dec).padStart(fmt.split(".")[0].length+(dec?dec+1:0),"0")}
      return str(v);
    }
    function formatString(f,args){return String(f).replace(/\{(\d+)(?:,(-?\d+))?(?::([^}]+))?\}/g,(m,i,al,fm)=>{let s=fmtNum(args[+i],fm);if(al){const n=parseInt(al);s=n<0?s.padEnd(-n):s.padStart(n)}return s}).replace(/\{\{/g,"{").replace(/\}\}/g,"}")}

    /* lvalues */
    function lval(e,env){
      if(e.k==="name"){
        const c=env.find(e.v);if(c&&!(c instanceof Func))return c instanceof Cell||c instanceof LV?c:fail(`line ${e.line}: can't assign to ${e.v}`,"CompileError");
        if(env.self&&e.v in env.self.f){const o=env.self,n=e.v;return lvField(o,n)}
        if(env.cls&&classes[env.cls.name].staticVals&&e.v in classes[env.cls.name].staticVals){const st=classes[env.cls.name].staticVals;return new LV(()=>st[e.v],v=>st[e.v]=v)}
        notDeclared(e.v,e.line);
      }
      if(e.k==="member"){
        const base=e.arrow?derefVal(ev(e.e,env),e.line):ev(e.e,env);
        if(base instanceof Obj){if(!(e.name in base.f))fail(`line ${e.line}: '${base.cls.name}' does not have a member named '${e.name}'`,"CompileError");return lvField(base,e.name)}
        if(base&&base.isClass){const st=base.cls.staticVals;if(e.name in st)return new LV(()=>st[e.name],v=>st[e.name]=v)}
        if(base instanceof KV)fail(`line ${e.line}: you can't change ${e.name} while looping over a dictionary`,"CompileError");
        fail(`line ${e.line}: can't assign to .${e.name}`,"CompileError");
      }
      if(e.k==="index"){
        const base=ev(e.e,env);const i=ev(e.i,env);
        if(base instanceof Arr){const idx=nv(i);checkIdx(base,idx,e.line);return new LV(()=>base.items[idx],v=>{base.items[idx]=v})}
        if(base instanceof Dict){const k=dkey(i);return new LV(()=>{if(!base.m.has(k))return lang==="cpp"?(base.m.set(k,[i,0]),0):dictMissing(i,e.line);return base.m.get(k)[1]},v=>base.m.set(k,[i,v]))}
        if(typeof base==="string"){if(lang==="cs")fail(`line ${e.line}: strings can't be changed in C#. Build a new string instead.`,"CompileError");
          const c=lval(e.e,env);const idx=nv(i);return new LV(()=>new Ch(c.get().codePointAt(idx)),v=>{const s=c.get();c.set(s.slice(0,idx)+str(v)+s.slice(idx+1))})}
        if(base instanceof Ptr)fail(`line ${e.line}: pointer arithmetic isn't supported in TypeMonkey's runner yet`,"NotSupported");
        fail(`line ${e.line}: can't use [ ] here`,"CompileError");
      }
      if(e.k==="deref"){const pv=ev(e.e,env);if(pv===null)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");if(!(pv instanceof Ptr))fail(`line ${e.line}: * needs a pointer`,"CompileError");if(!pv.ref)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");return pv.ref}
      if(e.k==="pre"&&lang==="cpp"){ev(e,env);return lval(e.e,env)}
      if(e.k==="cond"&&lang==="cpp")return truth(ev(e.c,env))?lval(e.a,env):lval(e.b,env);
      if(e.k==="assign"&&lang==="cpp"){ev(e,env);return lval(e.l,env)}
      return null;
    }
    function lvField(o,n){const key=o.f;return Object.assign(new LV(()=>o.f[n],v=>{o.f[n]=v}),{key:{o,n}})}
    function notDeclared(n,line){fail(lang==="cs"?`line ${line}: The name '${n}' does not exist in the current context`:`line ${line}: '${n}' was not declared in this scope`,"CompileError")}
    function checkIdx(a,i,line){if(!Number.isInteger(i)||i<0||i>=a.items.length){
      if(lang==="cs")fail(`line ${line}: Index was outside the bounds of the ${a.kind==="list"?"list":"array"} (index ${i}, but there are ${a.items.length} items).`,"IndexOutOfRangeException");
      fail(`line ${line}: index ${i} is out of range (the vector has ${a.items.length} items). In real C++ this is undefined behavior and could crash.`,"RuntimeError")}}
    function dkey(k){return (typeof k)+":"+(k instanceof D?k.v:k instanceof Ch?k.c:k)}
    function dictMissing(k,line){fail(`line ${line}: The given key '${str(k)}' was not present in the dictionary. Check with ContainsKey first.`,"KeyNotFoundException")}
    function derefVal(v,line){if(v instanceof Ptr){if(!v.ref)fail(`line ${line}: crash! You used -> on a null pointer.`,"RuntimeError");return v.ref.get()}return v}
    const truth=v=>{if(typeof v==="boolean")return v;if(v===null)return false;if(v instanceof Ptr)return !!v.ref;if(lang==="cs")fail("a condition must be true or false (a bool) in C#","CompileError");return !!nv(v)};

    /* expressions */
    function arith(op,a,b,line){
      if(op==="+"&&(typeof a==="string"||typeof b==="string")){
        if(lang==="cpp"&&typeof a==="string"&&typeof b==="string"&&a.__lit&&b.__lit)fail(`line ${line}: you can't add two "text" literals in C++. Use std::string or <<.`,"CompileError");
        if(lang==="cpp"&&(typeof a==="number"||typeof b==="number")&&!(a instanceof Ch||b instanceof Ch))fail(`line ${line}: you can't add a number to a string in C++. Use std::to_string(n).`,"CompileError");
        return str(a)+str(b);
      }
      if(op==="+"&&lang==="cpp"&&(a instanceof Ch&&typeof b==="string"))return String.fromCodePoint(a.c)+b;
      if(op==="+"&&lang==="cs"&&(a instanceof Ch||b instanceof Ch)&&(typeof a==="string"||typeof b==="string"))return str(a)+str(b);
      if(!isNum(a)&&typeof a!=="boolean"||!isNum(b)&&typeof b!=="boolean"){
        if(op==="=="||op==="!=")return null;
        fail(`line ${line}: can't use ${op} with ${typeOf(a)} and ${typeOf(b)}`,"CompileError");
      }
      const dbl=a instanceof D||b instanceof D;const x=nv(a),y=nv(b);
      switch(op){
        case "+":return dbl?new D(x+y):x+y;
        case "-":return dbl?new D(x-y):x-y;
        case "*":return dbl?new D(x*y):x*y;
        case "/":if(!dbl&&y===0)fail(`line ${line}: ${lang==="cs"?"Attempted to divide by zero.":"division by zero! In real C++ this crashes."}`,lang==="cs"?"DivideByZeroException":"RuntimeError");return dbl?new D(x/y):Math.trunc(x/y);
        case "%":if(!dbl&&y===0)fail(`line ${line}: division by zero with %`,lang==="cs"?"DivideByZeroException":"RuntimeError");return dbl?new D(x%y):x%y;
        case "<<":return x<<y;case ">>":return x>>y;case "&":return x&y;case "|":return x|y;case "^":return x^y;
      }
    }
    function equal(a,b){
      if(a===null||b===null)return a===b||(a instanceof Ptr&&!a.ref)||(b instanceof Ptr&&!b.ref);
      if(a instanceof Ptr&&b instanceof Ptr)return a.ref===b.ref||(a.ref&&b.ref&&a.ref.key&&b.ref.key&&a.ref.key.o===b.ref.key.o&&a.ref.key.n===b.ref.key.n);
      if(isNum(a)&&isNum(b))return nv(a)===nv(b);
      if(typeof a==="boolean"||typeof b==="boolean")return nv(a)===nv(b);
      return a===b;
    }
    function compare(op,a,b,line){
      if(typeof a==="string"&&typeof b==="string"){if(lang==="cs")fail(`line ${line}: use string.Compare to compare text with ${op} in C#`,"CompileError");return ({"<":a<b,"<=":a<=b,">":a>b,">=":a>=b})[op]}
      if(!isNum(a)&&typeof a!=="boolean"||!isNum(b)&&typeof b!=="boolean")fail(`line ${line}: can't compare ${typeOf(a)} and ${typeOf(b)} with ${op}`,"CompileError");
      const x=nv(a),y=nv(b);return ({"<":x<y,"<=":x<=y,">":x>y,">=":x>=y})[op];
    }
    function ev(e,env){
      switch(e.k){
        case "lit":{if(typeof e.v==="string"){const s=new String(e.v);return e.v}return e.v}
        case "istr":return e.parts.map(pt=>{if(typeof pt==="string")return pt;let s=fmtNum(ev(pt.e,env),pt.fmt);if(pt.align)s=pt.align<0?s.padEnd(-pt.align):s.padStart(pt.align);return s}).join("");
        case "name":return nameVal(e,env);
        case "this":if(!env.self)fail("'this' only works inside a class","CompileError");return lang==="cpp"?new Ptr(new LV(()=>env.self,()=>{})):env.self;
        case "typeval":return {isTypeval:true,type:e.type};
        case "init":return new InitList(e.items.map(x=>ev(x,env)));
        case "cond":return truth(ev(e.c,env))?ev(e.a,env):ev(e.b,env);
        case "assign":return assignE(e,env);
        case "un":{const v=ev(e.e,env);
          if(e.op==="!"){if(lang==="cs"&&typeof v!=="boolean")fail(`line ${e.line}: ! needs a true/false value`,"CompileError");return !truth(v)}
          if(e.op==="-"){if(!isNum(v))fail(`line ${e.line}: can't make ${typeOf(v)} negative`,"CompileError");return v instanceof D?new D(-v.v):-nv(v)}
          if(e.op==="~")return ~nv(v);return v}
        case "pre":case "post":{
          const lv=lval(e.e,env);if(!lv)fail(`line ${e.line}: ${e.op} needs a variable`,"CompileError");
          const old=lv.get();if(!isNum(old))fail(`line ${e.line}: can't use ${e.op} on ${typeOf(old)}`,"CompileError");
          const nw=old instanceof D?new D(old.v+(e.op==="++"?1:-1)):old instanceof Ch?new Ch(old.c+(e.op==="++"?1:-1)):old+(e.op==="++"?1:-1);
          lv.set(nw);return e.k==="pre"?nw:old}
        case "bin":{
          if(e.op==="&&"){const l=ev(e.l,env);if(!truth(l))return false;return truth(ev(e.r,env))}
          if(e.op==="||"){const l=ev(e.l,env);if(truth(l))return true;return truth(ev(e.r,env))}
          if(e.op==="??"){const l=ev(e.l,env);return l===null?ev(e.r,env):l}
          const l=ev(e.l,env);
          if(e.op==="<<"&&l===STREAM){const r=ev(e.r,env);if(r instanceof Func&&r.endl){W("\n")}else if(r&&r.manip){manip[r.manip]=true}else W(cppOut(r));return STREAM}
          if(e.op===">>"&&l&&l.cin)fail(`line ${e.line}: std::cin (reading typed input) isn't available in TypeMonkey yet`,"NotSupported");
          const r=ev(e.r,env);
          if(e.op==="=="||e.op==="!="){
            if(lang==="cs"&&(typeof l==="string")!==(typeof r==="string")&&l!==null&&r!==null)fail(`line ${e.line}: Operator '${e.op}' cannot be applied to operands of type '${typeOf(l)}' and '${typeOf(r)}'`,"CompileError");
            const q=equal(l,r);return e.op==="=="?q:!q}
          if(["<","<=",">",">="].includes(e.op))return compare(e.op,l,r,e.line);
          return arith(e.op,l,r,e.line);
        }
        case "is":{const v=ev(e.e,env);return v instanceof Obj&&v.cls.name===e.type.name||(e.type.name==="int"&&typeof v==="number")||(e.type.name==="string"&&typeof v==="string")}
        case "cast":{const v=ev(e.e,env);const t=e.type;
          if(INT_T.has(t.name)){if(typeof v==="string")fail(`line ${e.line||"?"}: can't cast text to a number. Use int.Parse()`,"CompileError");return Math.trunc(nv(v))}
          if(DBL_T.has(t.name))return new D(nv(v));
          if(t.name==="char")return new Ch(nv(v));if(t.name==="bool")return !!nv(v);if(t.name==="string")return str(v);return v}
        case "addr":{const lv=lval(e.e,env);if(!lv)fail(`line ${e.line}: & needs a variable to take the address of`,"CompileError");return new Ptr(lv)}
        case "deref":{const pv=ev(e.e,env);if(pv===null)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");if(!(pv instanceof Ptr))fail(`line ${e.line}: * needs a pointer`,"CompileError");if(!pv.ref)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");return pv.ref.get()}
        case "index":{const lv=lval(e,env);return lv.get()}
        case "member":return memberGet(e,env);
        case "call":return call(e,env);
        case "new":return newE(e,env);
        case "newarr":{
          const et=e.type;let items;
          if(e.items)items=e.items.map(x=>coerce(ev(x,env),et,e.line));
          else{const n=nv(ev(e.len,env));items=Array.from({length:n},()=>defaultFor(et))}
          const a=new Arr("array",items,et);return lang==="cpp"?new Ptr(new LV(()=>a,()=>{})):a}
        case "lambda":return new Func({params:e.params,body:e.body,closure:env,lambda:true});
      }
      fail("unsupported expression","NotSupported");
    }
    const manip={};
    function cppOut(v){if(typeof v==="boolean"&&manip.boolalpha)return v?"true":"false";if(v instanceof D&&manip.fixed)return v.v.toFixed(manip.prec??6);if(v instanceof D&&manip.prec)return fmtG(v.v,manip.prec);return str(v)}
    function nameVal(e,env){
      const c=env.find(e.v);
      if(c){if(c instanceof Func)return c;return c.get()}
      if(env.self&&e.v in env.self.f)return env.self.f[e.v];
      if(env.self&&env.self.cls.methods[e.v]&&env.self.cls.methods[e.v].isProp)return callMethod(env.self,e.v,[],e.line);
      if(env.cls){const sc=classes[env.cls.name];if(sc.staticVals&&e.v in sc.staticVals)return sc.staticVals[e.v];if(sc.methods[e.v])return new Func({method:sc.methods[e.v],self:env.self,cls:sc})}
      if(funcs[e.v])return funcs[e.v];
      if(classes[e.v])return {isClass:true,cls:classes[e.v]};
      const b=BUILTIN[e.v];if(b!==undefined)return b;
      notDeclared(e.v,e.line);
    }
    function assignE(e,env){
      const lv=lval(e.l,env);if(!lv)fail(`line ${e.line}: the left side of ${e.op} must be a variable`,"CompileError");
      let r=e.r.k==="init"?new InitList(e.r.items.map(x=>ev(x,env))):ev(e.r,env);
      const type=lv instanceof Cell?lv.type:null;
      if(e.op!=="="){const cur=lv.get();r=arith(e.op.slice(0,-1),cur,r,e.line);if(type&&INT_T.has(type.name)&&r instanceof D)r=Math.trunc(r.v)}
      if(e.op==="="&&type&&type.ptr===0&&type.arr===0)r=coerce(r,type,e.line);
      else if(e.op==="="&&lang==="cpp"&&(r instanceof Obj||r instanceof Arr))r=copy(r);
      else if(e.op==="="&&lv instanceof Cell&&lv.v instanceof D&&isNum(r))r=new D(nv(r));
      if(r instanceof InitList)r=new Arr(lang==="cpp"?"vector":"array",r.items,null);
      lv.set(r);return r;
    }
    function newE(e,env){
      const t=e.type;
      if(classes[t.name]){const cls=classes[t.name];const o=construct(cls,e.args.map(a=>ev(a,env)),e.line,e.init,env);return lang==="cpp"?new Ptr(new LV(()=>o,()=>{})):o}
      if(t.name==="List"||t.name==="HashSet"||t.name==="vector"){const a=new Arr(t.name==="vector"?"vector":"list",[],t.args[0]);
        if(e.args.length===1&&!(isNum(ev(e.args[0],env))))a.items=[...iterate(ev(e.args[0],env),e.line)];
        if(e.init)for(const it of e.init)a.items.push(coerce(ev(it.val,env),t.args[0],e.line));if(t.name==="HashSet")a.items=a.items.filter((x,i)=>a.items.findIndex(y=>equal(x,y))===i);return a}
      if(t.name==="Dictionary"||t.name==="map"||t.name==="unordered_map"){const d=new Dict();d.kt=t.args[0];d.vt=t.args[1];if(e.init)for(const it of e.init){if(!it.key)fail(`line ${e.line}: use ["key"] = value or { "key", value } in a dictionary initializer`,"SyntaxError");const k=ev(it.key,env);d.m.set(dkey(k),[k,coerce(ev(it.val,env),t.args[1],e.line)])}return d}
      if(t.name==="Random")return {random:true};
      if(t.name==="Exception")return new Obj({name:"Exception",fields:[],methods:{},ctors:[]}).f?Object.assign(new Obj({name:"Exception",fields:[],methods:Object.create(null),ctors:[]}),{msg:e.args.length?str(ev(e.args[0],env)):"Exception of type 'System.Exception' was thrown."}):null;
      if(t.name==="string")return e.args.length===2?str(ev(e.args[1],env)).repeat(nv(ev(e.args[0],env))):"";
      if(BASE_T.has(t.name)&&lang==="cpp"){const v=e.args.length?coerce(ev(e.args[0],env),t,e.line):defaultFor(t);const c=new Cell(v,t);return new Ptr(c)}
      fail(`line ${e.line}: TypeMonkey's runner doesn't know how to make a new ${t.name} yet`,"NotSupported");
    }
    function* iterate(v,line){
      if(v instanceof Arr){for(let i=0;i<v.items.length;i++)yield v.items[i];return}
      if(v instanceof Dict){for(const [,x] of v.m)yield new KV(x[0],x[1]);return}
      if(typeof v==="string"){for(const ch of v)yield new Ch(ch.codePointAt(0));return}
      if(v&&v.keysOf){yield* v.keysOf;return}
      fail(`line ${line}: you can only loop over a list, array, vector, dictionary or string`,"CompileError");
    }

    /* member access */
    function memberGet(e,env){
      const base=e.arrow?derefVal(ev(e.e,env),e.line):ev(e.e,env);
      const n=e.name;
      if(base===null)fail(`line ${e.line}: ${lang==="cs"?"Object reference not set to an instance of an object (it's null).":"crash! that pointer is null."}`,lang==="cs"?"NullReferenceException":"RuntimeError");
      if(base&&base.msg!==undefined&&(n==="Message"||n==="what"))return n==="what"?new Func({builtin:()=>base.msg}):base.msg;
      if(base instanceof Obj){
        if(n in base.f)return base.f[n];
        const m=base.cls.methods[n];if(m){if(m.isProp)return callMethod(base,n,[],e.line);return new Func({method:m,self:base,cls:base.cls})}
        fail(`line ${e.line}: '${base.cls.name}' does not have a member named '${n}'`,"CompileError");
      }
      if(base&&base.isClass){const st=base.cls.staticVals;if(st&&n in st)return st[n];const m=base.cls.methods[n];if(m)return new Func({method:m,self:null,cls:base.cls});fail(`line ${e.line}: '${base.cls.name}' does not have a static member named '${n}'`,"CompileError")}
      if(typeof base==="string"){
        if(n==="Length"&&lang==="cs")return [...base].length;
        if(n==="length"||n==="size")return new Func({builtin:()=>base.length,bound:true});
      }
      if(base instanceof Arr){
        if(n==="Length"&&base.kind==="array")return base.items.length;
        if(n==="Count"&&base.kind==="list")return base.items.length;
        if((n==="Length"||n==="Count")&&lang==="cs")fail(`line ${e.line}: ${base.kind==="array"?"arrays use .Length":"Lists use .Count"}, not .${n}`,"CompileError");
      }
      if(base instanceof Dict){if(n==="Count")return base.m.size;if(n==="Keys")return new Arr("list",[...base.m.values()].map(x=>x[0]),base.kt);if(n==="Values")return new Arr("list",[...base.m.values()].map(x=>x[1]),base.vt)}
      if(base instanceof KV){if(n==="Key"||n==="first")return base.k;if(n==="Value"||n==="second")return base.v}
      if(base&&base.msg!==undefined&&n==="Message")return base.msg;
      if(base&&base.ns){const v=base.ns[n];if(v!==undefined)return v}
      return new Func({builtin:(...a)=>builtinMethod(base,n,a,e.line,e.e,env),bound:true,name:n});
    }
    function callMethod(o,name,args,line){const m=o.cls.methods[name];return invoke({method:m,self:o,cls:o.cls},args,line)}

    /* calls */
    function call(e,env){
      const f=e.f;
      // argument references (for C++ & params and std::swap)
      const argExprs=e.args;
      let fn;
      if(f.k==="typeval"){  // C++ temporary like Monster("Grub", 3)
        const t=f.type;if(classes[t.name])return construct(classes[t.name],argExprs.map(a=>ev(a,env)),e.line);
        if(t.name==="vector")return new Arr("vector",[],t.args[0]);
      }
      if(f.k==="name"&&classes[f.v]&&!env.find(f.v)){return construct(classes[f.v],argExprs.map(a=>ev(a,env)),e.line)}
      if(f.k==="name"&&BASE_T.has(f.v)&&lang==="cpp"){const v=ev(argExprs[0],env);return ev({k:"cast",type:{name:f.v},e:{k:"lit",v}},env)}
      fn=ev(f,env);
      if(!(fn instanceof Func))fail(`line ${e.line}: that isn't something you can call with ( )`,"CompileError");
      if(fn.swap){const a=lval(argExprs[0],env),b=lval(argExprs[1],env);const t=a.get();a.set(b.get());b.set(t);return null}
      const argVals=argExprs.map(a=>a.k==="init"?new InitList(a.items.map(x=>ev(x,env))):ev(a,env));
      const refs=lang==="cpp"?argExprs.map(a=>{try{return lval(a,env)}catch(err){return null}}):null;
      return invoke(fn,argVals,e.line,refs);
    }
    function invoke(fn,argVals,line,refs){
      if(fn.builtin)return fn.builtin(...argVals);
      tick();
      if(fn.method){
        const m=fn.method;const fenv=new Env(globalEnv);fenv.self=fn.self;fenv.cls=fn.cls;
        if(m.params.length!==argVals.length&&!(argVals.length<m.params.length&&m.params.slice(argVals.length).every(p=>p.def)))fail(`line ${line}: ${m.name} needs ${m.params.length} argument(s) but got ${argVals.length}`,"CompileError");
        bindParams(m.params,argVals,fenv,line,refs);
        const r=execBody(m.body,fenv);return m.ret?coerce(r,m.ret,line):r;
      }
      const fenv=new Env(fn.closure||globalEnv);
      if(fn.closure&&fn.closure.self)fenv.self=fn.closure.self;
      if(!fn.lambda&&fn.params.length!==argVals.length&&!(argVals.length<fn.params.length&&fn.params.slice(argVals.length).every(p=>p.def)))fail(`line ${line}: ${fn.name} needs ${fn.params.length} argument(s) but got ${argVals.length}`,"CompileError");
      bindParams(fn.params,argVals,fenv,line,refs);
      depth++;if(depth>2000){depth=0;fail(`line ${line}: too much recursion (a function keeps calling itself). Check your stopping case.`,lang==="cs"?"StackOverflowException":"RuntimeError")}
      try{const r=execBody(fn.body,fenv);return fn.ret&&fn.ret.name!=="void"?coerce(r,fn.ret,line):r}finally{depth--}
    }
    let depth=0;
    function execBody(body,env){try{execBlock(body,env,true)}catch(x){if(x instanceof Ret)return x.v;throw x}return null}

    function builtinMethod(base,n,a,line,baseExpr,env){
      if(base===STREAM)fail("use << to print with cout","CompileError");
      if(typeof base==="string"){
        const s=base;
        switch(n){
          case "ToUpper":case "toUpperCase":return s.toUpperCase();
          case "ToLower":return s.toLowerCase();
          case "Contains":return s.includes(str(a[0]));
          case "StartsWith":return s.startsWith(str(a[0]));
          case "EndsWith":return s.endsWith(str(a[0]));
          case "IndexOf":return s.indexOf(str(a[0]));
          case "Replace":return s.split(str(a[0])).join(str(a[1]));
          case "Substring":{const st=nv(a[0]);if(st>s.length)fail(`line ${line}: Substring start is past the end of the string`,"ArgumentOutOfRangeException");return a.length>1?s.substr(st,nv(a[1])):s.slice(st)}
          case "Trim":return s.trim();case "TrimStart":return s.trimStart();case "TrimEnd":return s.trimEnd();
          case "Split":return new Arr("array",s.split(a.length?str(a[0]):" "),{name:"string"});
          case "ToString":return s;
          case "PadLeft":return s.padStart(nv(a[0]),a[1]?str(a[1]):" ");case "PadRight":return s.padEnd(nv(a[0]),a[1]?str(a[1]):" ");
          case "Equals":return s===a[0];
          case "ToCharArray":return new Arr("array",[...s].map(c=>new Ch(c.codePointAt(0))),{name:"char"});
          case "substr":{const st=nv(a[0]);if(st>s.length)fail(`line ${line}: substr start is past the end of the string (std::out_of_range)`,"RuntimeError");return a.length>1?s.substr(st,nv(a[1])):s.slice(st)}
          case "find":{const i=s.indexOf(str(a[0]));return i<0?-1:i}
          case "empty":return s.length===0;
          case "at":{const i=nv(a[0]);if(i<0||i>=s.length)fail(`line ${line}: std::out_of_range: string index ${i}`,"RuntimeError");return new Ch(s.codePointAt(i))}
          case "push_back":case "append":case "insert":{const lv=lval(baseExpr,env);if(n==="insert"){lv.set(s.slice(0,nv(a[0]))+str(a[1])+s.slice(nv(a[0])))}else lv.set(s+str(a[0]));return null}
          case "pop_back":{const lv=lval(baseExpr,env);lv.set(s.slice(0,-1));return null}
          case "c_str":return s;
        }
      }
      if(base instanceof Arr){
        const it=base.items;const T=base.elem;
        const C=v=>coerce(v,T,line);
        switch(n){
          case "Add":case "push_back":case "emplace_back":if(base.kind==="array")fail(`line ${line}: arrays can't grow. Use a List<T> instead.`,"CompileError");if(lang==="cs"&&T&&typeof a[0]==="string"&&INT_T.has(T.name))fail(`line ${line}: Argument 1: cannot convert from 'string' to '${T.name}'`,"CompileError");it.push(C(a[0]));return null;
          case "pop_back":if(!it.length)fail(`line ${line}: pop_back on an empty vector. In real C++ this is undefined behavior.`,"RuntimeError");it.pop();return null;
          case "Remove":{const i=it.findIndex(x=>equal(x,a[0]));if(i>=0){it.splice(i,1);return true}return false}
          case "RemoveAt":checkIdx(base,nv(a[0]),line);it.splice(nv(a[0]),1);return null;
          case "Insert":it.splice(nv(a[0]),0,C(a[1]));return null;
          case "Contains":return it.some(x=>equal(x,a[0]));
          case "IndexOf":return it.findIndex(x=>equal(x,a[0]));
          case "Clear":case "clear":it.length=0;return null;
          case "size":return it.length;
          case "empty":return it.length===0;
          case "back":if(!it.length)fail(`line ${line}: back() on an empty vector`,"RuntimeError");return it[it.length-1];
          case "front":if(!it.length)fail(`line ${line}: front() on an empty vector`,"RuntimeError");return it[0];
          case "at":{const i=nv(a[0]);if(i<0||i>=it.length)fail(`line ${line}: std::out_of_range: vector index ${i} is out of range (size ${it.length})`,"RuntimeError");return it[i]}
          case "Sort":{if(a[0] instanceof Func)it.sort((x,y)=>nv(invoke(a[0],[x,y],line)));else it.sort(cmpVals);return null}
          case "Reverse":it.reverse();return null;
          case "ToArray":return new Arr("array",[...it],T);
          case "ToList":return new Arr("list",[...it],T);
          case "Sum":return it.reduce((s,x)=>arith("+",s,a[0]?invoke(a[0],[x],line):x,line),0);
          case "Max":return it.reduce((m,x)=>compare(">",x,m,line)?x:m);
          case "Min":return it.reduce((m,x)=>compare("<",x,m,line)?x:m);
          case "Average":return new D(it.reduce((s,x)=>s+nv(x),0)/it.length);
          case "Count":if(a[0])return it.filter(x=>truth(invoke(a[0],[x],line))).length;return it.length;
          case "Exists":case "Any":return a[0]?it.some(x=>truth(invoke(a[0],[x],line))):it.length>0;
          case "Find":{const r=it.find(x=>truth(invoke(a[0],[x],line)));return r===undefined?defaultFor(T):r}
          case "FindAll":case "Where":return new Arr("list",it.filter(x=>truth(invoke(a[0],[x],line))),T);
          case "ForEach":it.forEach(x=>invoke(a[0],[x],line));return null;
          case "Select":case "ConvertAll":return new Arr("list",it.map(x=>invoke(a[0],[x],line)),null);
          case "begin":return {iter:base,pos:0};case "end":return {iter:base,pos:it.length};
          case "resize":{const k=nv(a[0]);while(it.length<k)it.push(a.length>1?a[1]:defaultFor(T));it.length=k;return null}
          case "erase":{const s=a[0].pos;const e2=a[1]?a[1].pos:s+1;it.splice(s,e2-s);return null}
        }
      }
      if(base instanceof Dict){
        switch(n){
          case "ContainsKey":case "count":return n==="count"?(base.m.has(dkey(a[0]))?1:0):base.m.has(dkey(a[0]));
          case "Add":if(base.m.has(dkey(a[0])))fail(`line ${line}: An item with the same key has already been added. Key: ${str(a[0])}`,"ArgumentException");base.m.set(dkey(a[0]),[a[0],coerce(a[1],base.vt,line)]);return null;
          case "Remove":case "erase":return base.m.delete(dkey(a[0]));
          case "ContainsValue":return [...base.m.values()].some(x=>equal(x[1],a[0]));
          case "Clear":case "clear":base.m.clear();return null;
          case "size":return base.m.size;
          case "GetValueOrDefault":return base.m.has(dkey(a[0]))?base.m.get(dkey(a[0]))[1]:(a[1]??defaultFor(base.vt));
        }
      }
      if(base&&base.random&&n==="Next"){const lo=a.length>1?nv(a[0]):0,hi=a.length>1?nv(a[1]):nv(a[0]);return lo+Math.floor(Math.random()*(hi-lo))}
      if(base&&base.random&&n==="NextDouble")return new D(Math.random());
      if(isNum(base)&&n==="ToString")return a.length?fmtNum(base,str(a[0])):str(base);
      if(typeof base==="boolean"&&n==="ToString")return str(base);
      if(base instanceof Obj&&n==="ToString")return str(base);
      fail(`line ${line}: TypeMonkey's runner doesn't know .${n}() on a ${typeOf(base)} yet`,"NotSupported");
    }
    const cmpVals=(x,y)=>typeof x==="string"&&typeof y==="string"?(x<y?-1:x>y?1:0):nv(x)-nv(y);

    /* built-in names */
    const B=fn=>new Func({builtin:fn});
    const BUILTIN={
      Console:{ns:{
        WriteLine:B((...a)=>{W((a.length>1&&typeof a[0]==="string"?formatString(a[0],a.slice(1)):a.length?str(a[0]):"")+"\n");return null}),
        Write:B((...a)=>{W(a.length>1&&typeof a[0]==="string"?formatString(a[0],a.slice(1)):str(a[0]));return null}),
        ReadLine:B(()=>fail("Console.ReadLine() can't read typing in TypeMonkey yet. Set the value in your code instead, like: string input = \"7\";","NotSupported")),
        ReadKey:B(()=>null),Clear:B(()=>null)}},
      Math:{ns:{Max:B((x,y)=>compare(">",x,y)?x:y),Min:B((x,y)=>compare("<",x,y)?x:y),Abs:B(x=>x instanceof D?new D(Math.abs(x.v)):Math.abs(x)),
        Sqrt:B(x=>new D(Math.sqrt(nv(x)))),Pow:B((x,y)=>new D(nv(x)**nv(y))),Round:B((x,d)=>{const f=10**(d?nv(d):0);const v=nv(x)*f;const r=Math.abs(v%1)===0.5?2*Math.round(v/2):Math.round(v);return new D(r/f)}),
        Floor:B(x=>new D(Math.floor(nv(x)))),Ceiling:B(x=>new D(Math.ceil(nv(x)))),PI:new D(Math.PI),Clamp:B((x,lo,hi)=>compare("<",x,lo)?lo:compare(">",x,hi)?hi:x)}},
      int:{ns:{Parse:B(s=>{if(s===null)fail("int.Parse got null","ArgumentNullException");const t=str(s).trim();if(!/^[-+]?\d+$/.test(t))fail(`Input string was not in a correct format: "${str(s)}"`,"FormatException");return parseInt(t)}),
        TryParse:B(()=>fail("int.TryParse uses an out parameter, which isn't supported yet. Use int.Parse inside try/catch.","NotSupported")),MaxValue:2147483647,MinValue:-2147483648}},
      double:{ns:{Parse:B(s=>{const t=str(s).trim();if(t===""||isNaN(+t))fail(`Input string was not in a correct format: "${str(s)}"`,"FormatException");return new D(+t)})}},
      string:{ns:{Join:B((sep,coll)=>[...iterate(coll,0)].map(x=>str(x)).join(str(sep))),IsNullOrEmpty:B(s=>s===null||s===""),Empty:"",Concat:B((...a)=>a.map(x=>str(x)).join(""))}},
      Convert:{ns:{ToInt32:B(v=>typeof v==="string"?BUILTIN.int.ns.Parse.builtin(v):Math.round(nv(v))),ToDouble:B(v=>new D(typeof v==="string"?+v:nv(v))),ToString:B(v=>str(v))}},
      cout:STREAM,cerr:STREAM,endl:new Func({builtin:()=>null,endl:true}),
      boolalpha:{manip:"boolalpha"},fixed:{manip:"fixed"},
      setprecision:B(n=>{manip.prec=nv(n);return {manip:"prec_set"}}),
      cin:{cin:true},
      to_string:B(v=>v instanceof D?v.v.toFixed(6):str(v)),
      stoi:B(s=>{const n=parseInt(str(s));if(isNaN(n))fail(`std::invalid_argument: stoi("${str(s)}")`,"RuntimeError");return n}),
      stod:B(s=>new D(parseFloat(str(s)))),
      max:B((x,y)=>compare(">",y,x)?y:x),min:B((x,y)=>compare("<",y,x)?y:x),
      abs:B(x=>x instanceof D?new D(Math.abs(x.v)):Math.abs(x)),sqrt:B(x=>new D(Math.sqrt(nv(x)))),pow:B((x,y)=>new D(nv(x)**nv(y))),
      swap:new Func({swap:true}),
      sort:B((b,e,cmp)=>{const arr=b.iter;const part=arr.items.slice(b.pos,e.pos);part.sort(cmp?(x,y)=>truth(invoke(cmp,[x,y],0))?-1:truth(invoke(cmp,[y,x],0))?1:0:cmpVals);arr.items.splice(b.pos,part.length,...part);return null}),
      reverse:B((b,e)=>{const arr=b.iter;const part=arr.items.slice(b.pos,e.pos).reverse();arr.items.splice(b.pos,part.length,...part);return null}),
      rand:B(()=>Math.floor(Math.random()*32768)),srand:B(()=>null),time:B(()=>0),
      printf:B((f,...a)=>{let i=0;W(str(f).replace(/%(-?\d*)(?:\.(\d+))?([dfsci%])/g,(m,w,pr,k)=>{if(k==="%")return "%";const v=a[i++];let s=k==="f"?nv(v).toFixed(pr?+pr:6):k==="c"?String.fromCodePoint(nv(v)):str(v);if(w){const n=+w;s=n<0?s.padEnd(-n):s.padStart(n)}return s}));return null}),
      npos:-1,
      Exception:{isClass:true,cls:{name:"Exception",methods:Object.create(null),staticVals:{}}},
    };

    /* statements */
    function execBlock(b,env,noNew){const e=noNew?env:new Env(env);hoist(b.body,e);for(const s of b.body)exec(s,e)}
    function hoist(list,env){for(const s of list)if(s.k==="func")env.vars.set(s.name,new Func({name:s.name,params:s.params,body:s.body,ret:s.ret,closure:env}))}
    function exec(s,env){
      tick();
      switch(s.k){
        case "empty":case "func":case "class":return;
        case "block":return execBlock(s,env);
        case "expr":{
          const e=s.e;
          if(lang==="cs"&&!["assign","call","pre","post","new"].includes(e.k))fail(`line ${s.line||"?"}: Only assignment, call, increment, decrement and new can be used as a statement`,"CompileError");
          ev(e,env);return}
        case "decl":for(const d of s.decls)declare(d,env);return;
        case "if":if(truth(ev(s.c,env)))exec(s.a,new Env(env));else if(s.b)exec(s.b,new Env(env));return;
        case "while":while(truth(ev(s.c,env))){tick();try{exec(s.body,new Env(env))}catch(x){if(x===BRK)break;if(x===CNT)continue;throw x}}return;
        case "do":do{tick();try{exec(s.body,new Env(env))}catch(x){if(x===BRK)break;if(x===CNT)continue;throw x}}while(truth(ev(s.c,env)));return;
        case "for":{const fe=new Env(env);if(s.init){if(s.init.k==="decl")for(const d of s.init.decls)declare(d,fe);else ev(s.init.e,fe)}
          for(;;){if(s.c&&!truth(ev(s.c,fe)))break;tick();try{exec(s.body,new Env(fe))}catch(x){if(x===BRK)break;if(x!==CNT)throw x}for(const st of s.steps)ev(st,fe)}return}
        case "forin":{
          const coll=ev(s.coll,env);
          if(s.type&&s.type.ref&&lang==="cpp"&&coll instanceof Arr){
            for(let i=0;i<coll.items.length;i++){tick();const fe=new Env(env);const idx=i;fe.vars.set(s.name,new LV(()=>coll.items[idx],v=>coll.items[idx]=v));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}}return}
          const items=[...iterate(coll,s.line)];
          if(lang==="cs"&&coll instanceof Arr){const n=coll.items.length;for(const v of items){tick();const fe=new Env(env);fe.vars.set(s.name,new Cell(coerce(v,s.type,s.line),s.type));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}if(coll.items.length!==n)fail(`line ${s.line}: Collection was modified; you can't add or remove items while looping with foreach.`,"InvalidOperationException")}return}
          for(const v of items){tick();const fe=new Env(env);fe.vars.set(s.name,new Cell(coerce(v,s.type,s.line),s.type));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}}return}
        case "break":throw BRK;
        case "continue":throw CNT;
        case "return":throw new Ret(s.e?ev(s.e,env):null);
        case "switch":{const v=ev(s.e,env);let on=false;
          try{for(const c of s.cases){if(!on&&(c.def||equal(ev(c.v,env),v)))on=true;if(on)for(const st of c.body)exec(st,env)}
            if(!on){const d=s.cases.find(c=>c.def);if(d){let go=false;for(const c of s.cases){if(c===d)go=true;if(go)for(const st of c.body)exec(st,env)}}}}
          catch(x){if(x!==BRK)throw x}return}
        case "throw":throw new Throw(s.e?ev(s.e,env):null);
        case "try":{
          try{execBlock(s.body,env)}
          catch(x){
            if(x===BRK||x===CNT||x instanceof Ret)throw x;
            let val,kind;
            if(x instanceof Throw){val=x.v;kind=val&&val.cls?val.cls.name:"Exception"}
            else if(x instanceof RunError&&!["CompileError","SyntaxError","NotSupported","Timeout"].includes(x.kind)){kind=x.kind;val=Object.assign(new Obj({name:kind,methods:Object.create(null),fields:[]}),{msg:x.message.replace(/^line \d+: /,"")})}
            else throw x;
            const c=s.catches.find(c=>!c.type||["Exception","exception"].includes(c.type.name)||c.type.name===kind||(lang==="cpp"&&c.type.name!=="Exception"));
            if(!c)throw x;
            const ce=new Env(env);if(c.name)ce.vars.set(c.name,new Cell(val,c.type));execBlock(c.body,ce);
          }finally{if(s.fin)execBlock(s.fin,env)}
          return}
      }
      fail("unsupported statement","NotSupported");
    }
    function declare(d,env){
      const t=d.type;let v;
      if(t.ref&&lang==="cpp"){
        if(!d.init)fail(`line ${d.line}: a reference (&) must be set to a variable when you create it`,"CompileError");
        const lv=lval(d.init,env);if(!lv)fail(`line ${d.line}: a reference must refer to a variable, not a value`,"CompileError");
        env.def(d.name,lv,d.line);return;
      }
      if(d.ctorArgs){const cls=classes[t.name];const av=d.ctorArgs.map(a=>ev(a,env));
        if(cls)v=construct(cls,av,d.line);else if(t.name==="vector")v=new Arr("vector",Array.from({length:nv(av[0])},()=>av.length>1?copy(av[1]):defaultFor(t.args[0])),t.args[0]);else if(t.name==="string")v=av.length===2?str(av[1]).repeat(nv(av[0])):str(av[0]);else v=coerce(av[0],t,d.line)}
      else if(d.init){const iv=d.init.k==="init"?new InitList(d.init.items.map(x=>ev(x,env))):ev(d.init,env);
        if(t.name==="var"&&iv===null&&lang==="cs")fail(`line ${d.line}: Cannot assign null to an implicitly-typed variable (var)`,"CompileError");
        v=coerce(iv,t,d.line)}
      else if(d.fixedLen){v=new Arr("array",Array.from({length:nv(ev(d.fixedLen,env))},()=>defaultFor({...t,arr:0})),{...t,arr:0})}
      else v=lang==="cs"&&!classes[t.name]?undefined:defaultFor(t);
      if(v===undefined){const c=new Cell(null,t);c.unassigned=true;env.def(d.name,new LV(()=>{if(c.unassigned)fail(`line ${d.line}: Use of unassigned local variable '${d.name}'`,"CompileError");return c.v},x=>{c.unassigned=false;c.v=x}),d.line);env.vars.get(d.name).type=t;return}
      env.def(d.name,new Cell(v,t),d.line);
    }

    /* program */
    try{
      const prog=parse(lex(code,lang),lang,classNames).program();
      for(const it of prog)if(it.k==="class"){classes[it.cls.name]=it.cls}
      for(const it of prog)if(it.k==="class"){const c=it.cls;c.staticVals={};const se=new Env(globalEnv);se.cls=c;for(const f of c.statics)c.staticVals[f.name]=f.init?coerce(ev(f.init,se),f.type,0):defaultFor(f.type)}
      for(const it of prog)if(it.k==="func")funcs[it.name]=new Func({name:it.name,params:it.params,body:it.body,ret:it.ret,closure:globalEnv});
      const mainCls=Object.values(classes).find(c=>c.methods.Main&&c.methods.Main.isStatic);
      if(lang==="cs"&&mainCls){invoke({method:mainCls.methods.Main,self:null,cls:mainCls},[],0)}
      else if(lang==="cpp"&&funcs.main){
        for(const it of prog)if(it.k==="decl")exec(it,globalEnv);
        invoke(funcs.main,[],0);
      }else{
        if(lang==="cs"&&Object.values(classes).some(c=>c.methods.Main&&!c.methods.Main.isStatic))fail("Main must be static: static void Main()","CompileError");
        for(const it of prog)if(it.k!=="class"&&it.k!=="func")exec(it,globalEnv);
      }
      return {out,error:null};
    }catch(x){
      if(x instanceof Ret)return {out,error:null};
      if(x instanceof Throw){const v=x.v;const msg=v&&v.msg!==undefined?v.msg:str(v);return {out,error:lang==="cs"?`Unhandled exception. ${v&&v.cls?v.cls.name:"System.Exception"}: ${msg}`:`terminate called after throwing an exception: ${msg}`}}
      if(x===BRK||x===CNT)return {out,error:"break or continue was used outside of a loop"};
      if(x instanceof RunError){
        const label={CompileError:lang==="cs"?"error":"error",SyntaxError:"error",NotSupported:"Not supported yet",Timeout:"Stopped",RuntimeError:"Runtime error"}[x.kind];
        return {out,error:label?`${label}: ${x.message}`:`Unhandled exception. System.${x.kind}: ${x.message.replace(/^line \d+: /,m=>m)}`};
      }
      if(x instanceof RangeError)return {out,error:"Stopped: too much recursion (a function keeps calling itself). Check your stopping case."};
      return {out,error:"Something went wrong inside TypeMonkey's runner: "+x.message};
    }
  }
  return {run};
})();
if(typeof module!=="undefined")module.exports=TMC;
