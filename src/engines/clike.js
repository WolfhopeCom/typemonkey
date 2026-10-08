/* TypeMonkey C# / C++ runner: an in-house interpreter for the parts of C# and C++ that TypeMonkey teaches.
   TMC.run(code, "cs" | "cpp") -> {out: "printed text", error: null | "message"}
   Covers: variables and types (int/double/bool/string/char/var/auto), operators with integer division,
   if/else, switch, loops (for, while, do-while, foreach, range-for), break/continue, functions and local
   functions, lambdas, classes/structs (fields, properties, constructors, methods, initializer lists),
   inheritance (C#: class B : A, : base(...), virtual/override/abstract, base.M(), is/as; C++: class B : public A,
   A(x) in the init list, virtual/override/= 0, A::m(), calls through A& / A* use virtual dispatch, others the static type),
   C++ references, pointers and value-copy semantics, C# reference semantics, arrays, List, Dictionary,
   std::vector, string methods, Console.Write/WriteLine (with $"" interpolation), std::cout, Math,
   try/catch/throw. Anything else reports a friendly "not supported yet" error. */
const TMC=(()=>{
  class RunError extends Error{constructor(m,kind){super(m);this.kind=kind||"Error"}}
  class Throw{constructor(v){this.v=v}}
  const BRK={},CNT={};class Ret{constructor(v){this.v=v}}class Yield{constructor(v){this.v=v}}
  const fail=(m,k)=>{throw new RunError(m,k)};
  const EXIT={exit:true};

  /* ---------- values ---------- */
  class D{constructor(v){this.v=v}}                 // double
  class Ch{constructor(c){this.c=c}}                // char (code point)
  class Lg{constructor(v){this.v=v}}                // Java long
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
  const isNum=v=>typeof v==="number"||v instanceof D||v instanceof Ch||v instanceof Lg;
  const nv=v=>v instanceof D?v.v:v instanceof Ch?v.c:v instanceof Lg?v.v:typeof v==="boolean"?(v?1:0):v;

  const INT_T=new Set(["int","long","short","unsigned","size_t","byte","uint","ulong","sbyte","ushort","signed"]);
  const DBL_T=new Set(["double","float","decimal"]);
  const BASE_T=new Set([...INT_T,...DBL_T,"char","bool","string","void","var","auto","object","dynamic"]);
  const JAVA_T={boolean:"bool",String:"string",Integer:"int",Double:"double",Boolean:"bool",Character:"char",Long:"long",Float:"float",Short:"short",Byte:"byte",Object:"object",
    ArrayList:"List",List:"List",LinkedList:"List",HashMap:"Dictionary",Map:"Dictionary",LinkedHashMap:"Dictionary",TreeMap:"Dictionary",HashSet:"HashSet",Set:"HashSet",LinkedHashSet:"HashSet",TreeSet:"HashSet",Scanner:"Scanner",
    Function:"Func",BiFunction:"Func",Predicate:"Func",BiPredicate:"Func",Supplier:"Func",Consumer:"Func",BiConsumer:"Func",UnaryOperator:"Func",BinaryOperator:"Func",Runnable:"Func",Comparator:"Func",IntBinaryOperator:"Func",IntUnaryOperator:"Func",IntPredicate:"Func",
    StringBuilder:"StringBuilder",Random:"Random"};
  const JAVA_GEN=new Set(["ArrayList","List","LinkedList","HashMap","Map","LinkedHashMap","TreeMap","HashSet","Set","LinkedHashSet","TreeSet","Function","BiFunction","Predicate","BiPredicate","Supplier","Consumer","BiConsumer","UnaryOperator","BinaryOperator","Comparator"]);
  const JEXC=n=>/^([A-Z]\w*)?(Exception|Error)$/.test(n)||n==="Throwable";

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
      if(c==="@"&&lang==="java"&&/[A-Za-z]/.test(src[i+1])){i++;while(/[A-Za-z0-9_.]/.test(src[i]))i++;if(src[i]==="("){let d=0;do{if(src[i]==="(")d++;if(src[i]===")")d--;i++}while(d&&i<src.length)}continue}
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
        if(/[eE]/.test(src[j]||"")&&/[-+0-9]/.test(src[j+1]||"")){isD=true;j++;if(/[-+]/.test(src[j]))j++;while(/[0-9]/.test(src[j]))j++}
        const s=src.slice(i,j).replace(/_/g,"");
        let isL=false;if(/[fFdDmM]/.test(src[j]||"")){isD=true;j++}else while(/[lLuU]/.test(src[j]||"")){if(/[lL]/.test(src[j]))isL=true;j++}
        push("num",isD?new D(parseFloat(s)):isL&&lang==="java"?new Lg(parseInt(s,10)):parseInt(s,10));i=j;continue;
      }
      if(/[A-Za-z_]/.test(c)){
        let j=i;while(j<src.length&&/[A-Za-z0-9_]/.test(src[j]))j++;let w=src.slice(i,j);i=j;
        if(w==="std"&&src.slice(i,i+2)==="::"){i+=2;while(/\s/.test(src[i]))i++;let k=i;while(k<src.length&&/[A-Za-z0-9_]/.test(src[k]))k++;w=src.slice(i,k);i=k}
        push("id",w);continue;
      }
      const three=src.slice(i,i+3),two=src.slice(i,i+2);
      if(three===">>>"&&lang==="java"){push("op",">>>");i+=3;continue}
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
    const near=()=>{const t=peek();return t.k==="eof"?"the end of the code":`"${t.v instanceof D||t.v instanceof Lg?t.v.v:t.v}"`};
    const expect=v=>{if(!is(v))fail(`line ${peek().line}: expected "${v}" near ${near()}${v===";"?". Did you forget a semicolon?":""}`,"SyntaxError");p++};
    const ident=()=>{const t=peek();if(t.k!=="id")fail(`line ${t.line}: expected a name near ${near()}`,"SyntaxError");p++;return t.v};
    const MODS=new Set(["public","private","protected","internal","static","const","readonly","virtual","override","sealed","abstract","inline","constexpr","extern","unsafe","async","explicit","partial","new_","final","synchronized","transient","volatile","native","strictfp"]);

    // type: [const] Name[<T,...>][::Name][*|&|[]]...
    function tryType(){
      const save=p;let isConst=false;
      while(is("const")||is("unsigned")&&isType(peek(1))||is("signed")){if(peek().v==="const")isConst=true;p++}
      const t=peek();
      if(t.k!=="id"||!isTypeName(t.v)){p=save;return null}
      p++;let name=t.v;const args=[];let jname=null;
      if(name==="unsigned"||name==="long"&&is("long")){if(peek().k==="id"&&INT_T.has(peek().v))p++}
      if(lang==="java"&&name==="Map"&&isOp(".")&&peek(1).v==="Entry"){p+=2;name="KV"}
      if(lang==="java"&&JAVA_T[name]!==undefined){jname=name;name=JAVA_T[name]}
      if(isOp("<")&&(isGeneric(jname||name)||name==="KV")){
        p++;
        if(isOp(">"))p++;   // Java diamond: new ArrayList<>()
        else for(;;){const a=tryType();if(!a){p=save;return null}args.push(a);if(accept(","))continue;
          if(isOp(">>")){tokens[p]={...tokens[p],v:">"};tokens.splice(p,0,{...tokens[p],v:">"})}
          if(!accept(">")){p=save;return null}break}
      }
      let type={name,args,ref:false,ptr:0,arr:0,isConst,jname};
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
    function isTypeName(n){return BASE_T.has(n)||classNames.has(n)||(lang==="java"&&(JAVA_T[n]!==undefined||JEXC(n)))||["List","Dictionary","vector","map","pair","HashSet","string","Random","Exception","KeyValuePair","Func","Action","unordered_map"].includes(n)}
    function isGeneric(n){return (lang==="java"&&JAVA_GEN.has(n))||["List","Dictionary","vector","map","pair","HashSet","KeyValuePair","Func","Action","unordered_map"].includes(n)||classNames.has(n)}

    const nested=[];
    function program(){
      const items=nested;
      while(peek().k!=="eof"){
        if(accept(";"))continue;
        if(is("using")||(lang==="java"&&(is("import")||is("package")))){while(!isOp(";")&&peek().k!=="eof")p++;accept(";");continue}
        if(is("namespace")){p++;while(peek().k==="id"||isOp("."))p++;if(accept("{")){/* flatten */}continue}
        if(isOp("}")){p++;continue}  // closing namespace
        items.push(topItem());
      }
      return items;
    }
    function topItem(){
      let save=p;
      let abs=false;while(peek().k==="id"&&MODS.has(peek().v)){if(peek().v==="abstract")abs=true;p++}
      if(is("class")||is("struct")){const c=classDef();if(abs)c.cls.isAbstractClass=true;return c}
      if(lang==="java"&&(is("interface")||is("enum")))return is("enum")?enumDef():classDef();
      if(is("interface")||is("record"))fail(`line ${peek().line}: ${peek().v}s aren't supported in TypeMonkey's runner yet`,"NotSupported");
      if(is("enum"))fail(`line ${peek().line}: enums aren't supported in TypeMonkey's runner yet`,"NotSupported");
      p=save;return statement(true);
    }
    function enumDef(){
      p++;const name=ident();expect("{");const vals=[];
      while(!isOp("}")&&!isOp(";")){vals.push(ident());if(isOp("("))fail(`line ${peek().line}: enums with constructors aren't supported in TypeMonkey's runner yet`,"NotSupported");if(!accept(","))break}
      if(accept(";")&&!isOp("}"))fail(`line ${peek().line}: enums with fields or methods aren't supported in TypeMonkey's runner yet`,"NotSupported");
      expect("}");
      return {k:"class",cls:{name,isEnum:true,vals,fields:[],methods:Object.create(null),ctors:[],statics:[],props:Object.create(null)}};
    }
    function classDef(){
      const kind=ident();const name=ident();let parent=null;const ifaces=[];
      if(lang==="java"&&isOp("<"))fail(`line ${peek().line}: generic classes (class ${name}<T>) aren't supported in TypeMonkey's runner yet`,"NotSupported");
      const skipGen=()=>{if(isOp("<")){let d=0;do{if(isOp("<"))d++;else if(isOp(">"))d--;else if(isOp(">>"))d-=2;p++}while(d>0&&peek().k!=="eof")}};
      if(lang==="java"&&accept("extends")){parent=ident();skipGen();if(kind==="interface"){ifaces.push(parent);parent=null;while(accept(",")){ifaces.push(ident());skipGen()}}}
      if(lang==="java"&&accept("implements")){do{ifaces.push(ident());skipGen()}while(accept(","))}
      if(lang!=="java"&&accept(":")){
        while(is("public")||is("private")||is("protected")||is("virtual"))p++;
        parent=ident();skipGen();
        while(accept(",")){if(lang==="cpp")fail(`line ${peek().line}: inheriting from more than one class isn't supported in TypeMonkey's runner yet`,"NotSupported");ifaces.push(ident());skipGen()}}
      else if(accept(":"))fail(`line ${peek().line}: in Java, write class ${name} extends ... instead of :`,"CompileError");
      expect("{");
      const cls={name,parent,ifaces,isInterface:kind==="interface",fields:[],methods:Object.create(null),ctors:[],statics:[],isStruct:kind==="struct",props:Object.create(null)};
      while(!accept("}")){
        if(peek().k==="eof")fail(`the class ${name} is missing its closing }`,"SyntaxError");
        if((is("public")||is("private")||is("protected"))&&isOp(":",1)){p+=2;continue}
        let isStatic=false,isAbstract=false,isVirtual=false,isOverride=false;
        while(peek().k==="id"&&(MODS.has(peek().v)||(lang==="cs"&&peek().v==="new"&&peek(1).k==="id"))){const v=peek().v;if(v==="static")isStatic=true;if(v==="abstract")isAbstract=true;if(v==="virtual")isVirtual=true;if(v==="override")isOverride=true;p++}
        if(accept(";"))continue;
        if((lang==="java"&&(is("class")||is("interface")))||(lang==="cs"&&(is("class")||is("struct")))){const c=classDef();if(isAbstract)c.cls.isAbstractClass=true;nested.push(c);continue}
        if(lang==="java"&&is("enum")){nested.push(enumDef());continue}
        if(lang==="java"&&is("default")){p++}
        // constructor
        if(peek().v===name&&isOp("(",1)){p++;const params=paramList();const init=[];
          if(lang==="java"&&accept("throws")){do ident();while(accept(","))}
          if(accept(":")){do{const f=ident();if(accept("{")){const a=isOp("}")?[]:args("}");expect("}");init.push([f,a])}else{expect("(");const a=isOp(")")?[]:args(")");expect(")");init.push([f,a])}}while(accept(","))}
          let body;if(accept("=>")){body={k:"block",body:[{k:"expr",e:expr()}]};expect(";")}else if(lang==="cpp"&&accept("=")){p++;expect(";");body={k:"block",body:[]}}else body=block();
          cls.ctors.push({params,init,body});continue}
        if(isOp("~")&&lang==="cpp"&&peek(1).v===name){p+=2;paramList();while(is("noexcept")||is("override"))p++;
          if(accept("=")){p++;expect(";")}else{const b=block();if(b.body.length)fail(`line ${peek().line}: destructors (~${name}) that do something aren't supported in TypeMonkey's runner yet`,"NotSupported")}continue}
        if(isOp("~"))fail("destructors aren't supported in TypeMonkey's runner yet","NotSupported");
        const type=tryType();if(!type)fail(`line ${peek().line}: expected a type near ${near()}`,"SyntaxError");
        if(is("operator"))fail("operator overloading isn't supported in TypeMonkey's runner yet","NotSupported");
        const mname=ident();
        if(isOp("(")){
          const params=paramList();while(is("const")||is("override")||is("final")||is("noexcept")){if(peek().v==="override")isOverride=true;p++}
          if(lang==="java"&&accept("throws")){do ident();while(accept(","))}
          let body;if(accept(";"))body=null;
          else if(lang==="cpp"&&accept("=")){if(peek().v===0)isAbstract=true;else if(!is("default")&&!is("delete"))fail(`line ${peek().line}: expected = 0 here`,"SyntaxError");p++;expect(";");body=null}
          else if(accept("=>")){body={k:"block",body:[{k:"return",e:expr()}]};expect(";")}else body=block();
          if(!body&&lang==="cpp"&&!isAbstract)fail(`line ${peek().line}: ${name}::${mname} needs a body { } (TypeMonkey's runner doesn't support defining methods outside the class yet)`,"NotSupported");
          const m={params,body,ret:type,isStatic,name:mname,owner:name,isAbstract:isAbstract||!body,isVirtual,isOverride,line:tokens[p-1].line};const prev=cls.methods[mname];
          if(prev&&!prev.isProp){(prev.overloads||(prev.overloads=[prev])).push(m)}else cls.methods[mname]=m;continue;
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
        if(accept("=>")){const e=expr();expect(";");cls.methods[mname]={params:[],body:{k:"block",body:[{k:"return",e}]},ret:type,isProp:true,name:mname,owner:name,isVirtual,isOverride,isAbstract:false};continue}
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
          case "return":{p++;const e=isOp(";")?null:isOp("{")?initList():expr();expect(";");return {k:"return",e,line}}
          case "switch":{p++;return switchParse(false,line)}
          case "yield":if(lang==="java"){p++;const e=expr();expect(";");return {k:"yield",e}}break;
          case "try":{p++;const body=block();const catches=[];
            while(accept("catch")){let type=null,name=null;const types=[];if(accept("(")){while(is("final"))p++;if(isOp("."))p+=3;else{type=tryType()||(peek().k==="id"?{name:ident(),args:[]}:null);if(type)types.push(type.jname||type.name);while(lang==="java"&&accept("|")){const t2=tryType()||{name:ident()};types.push(t2.jname||t2.name)}if(type&&isOp("&"))p++;if(peek().k==="id")name=ident()}expect(")")}catches.push({type,types,name,body:block()})}
            let fin=null;if(accept("finally"))fin=block();return {k:"try",body,catches,fin}}
          case "throw":{p++;const e=isOp(";")?null:expr();expect(";");return {k:"throw",e,line}}
          case "delete":{p++;if(isOp("["))p+=2;expr();expect(";");return {k:"empty"}}
          case "class":case "struct":if(top||lang==="cs")return classDef();break;
        }
        if(t.v==="goto")fail("goto isn't supported in TypeMonkey's runner","NotSupported");
      }
      const s=declOrExpr(false);if(s.k!=="func")expect(";");return s;
    }
    function caseVal(){if(lang==="java"&&peek().k==="id"&&isOp("->",1)){return {k:"name",v:ident(),line:peek().line}}return ternary()}
    function switchParse(asExpr,line){
      expect("(");const e=expr();expect(")");expect("{");const cases=[];let arrows=false;
      while(!accept("}")){
        let c=null;
        if(accept("case")){const vals=[caseVal()];while(accept(","))vals.push(caseVal());c={vals,body:[]}}
        else if(accept("default")){c={def:true,body:[]}}
        if(c){
          if(lang==="java"&&accept("->")){arrows=true;
            if(isOp("{"))c.body=[block()];
            else if(is("throw"))c.body=[statement()];
            else{const x=expr();expect(";");c.body=[asExpr?{k:"yield",e:x}:{k:"expr",e:x,line:peek().line}]}
            c.arrow=true}
          else expect(":");
          cases.push(c);continue}
        if(!cases.length)fail("expected case inside switch","SyntaxError");cases[cases.length-1].body.push(statement());
      }
      return {k:asExpr?"switchx":"switch",e,cases,arrows,line};
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
          if(params&&lang==="java"&&is("throws")){p++;do ident();while(accept(","))}
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
    const BIN=[["??"],["||"],["&&"],["|"],["^"],["&"],["==","!="],["<","<=",">",">="],["<<",">>",">>>"],["+","-"],["*","/","%"]];
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
        else if(lvl===7&&lang==="cs"&&t.k==="id"&&t.v==="is"){p++;const ty=tryType();if(!ty)fail(`line ${t.line}: expected a type after is`,"SyntaxError");let bind=null;if(peek().k==="id"&&!["and","or","when","is","as"].includes(peek().v))bind=ident();l={k:"is",e:l,type:ty,bind}}
        else if(lvl===7&&lang==="cs"&&t.k==="id"&&t.v==="as"){p++;const ty=tryType();if(!ty)fail(`line ${t.line}: expected a type after as`,"SyntaxError");l={k:"as",e:l,type:ty,line:t.line}}
        else if(lvl===7&&lang==="java"&&t.k==="id"&&t.v==="instanceof"){p++;const ty=tryType()||{name:ident(),args:[]};let bind=null;if(peek().k==="id"&&!["instanceof"].includes(peek().v))bind=ident();l={k:"is",e:l,type:ty,bind}}
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
          if(ty&&(lang==="java"||(lang==="cs"&&classNames.has(ty.name)))&&!BASE_T.has(ty.name)&&tokens[p]&&tokens[p].v===")"&&(classNames.has(ty.name)||ty.jname)&&(peek(1).k==="id"||peek(1).v==="(")){p++;return {k:"cast",type:ty,e:unary()}}
          if(ty&&accept(")")&&(BASE_T.has(ty.name)||ty.ptr)&&!(peek().k==="op"&&[")",";",",","+","-","*","/"].includes(peek().v)&&peek().v!=="("&&peek().v!=="-")){return {k:"cast",type:ty,e:unary()}}
          if(ty&&tokens[p-1].v===")"&&BASE_T.has(ty.name)&&(peek().k!=="op"||["(","-","!"].includes(peek().v))){return {k:"cast",type:ty,e:unary()}}
          p=save;
        }
      }
      if(t.k==="id"&&t.v==="new")return postfix(newExpr());
      if(lang==="java"&&t.k==="id"&&t.v==="switch"){p++;return switchParse(true,t.line)}
      if(lang==="cpp"&&t.k==="id"&&/^(static|dynamic)_cast$/.test(t.v)&&isOp("<",1)){p+=2;const ty=tryType();if(!ty)fail(`line ${t.line}: expected a type inside ${t.v}< >`,"SyntaxError");expect(">");expect("(");const x=expr();expect(")");return postfix({k:"cast",type:ty,e:x,dyn:t.v==="dynamic_cast",line:t.line})}
      if(t.k==="id"&&(t.v==="sizeof"))fail("sizeof isn't supported in TypeMonkey's runner yet","NotSupported");
      return postfix(primary());
    }
    function newExpr(){
      const line=peek().line;p++;
      if(isOp("[")){p++;expect("]");const il=initList();return {k:"newarr",type:null,items:il.items,line}}
      const type=tryTypeNoArr();if(!type)fail(`line ${line}: expected a type after new`,"SyntaxError");
      if(isOp("[")){p++;const n=isOp("]")?null:expr();expect("]");const dims=[n];while(isOp("[")){p++;dims.push(isOp("]")?null:expr());expect("]")}
        let items=null;if(isOp("{"))items=initList().items;return {k:"newarr",type,len:n,dims,items,line}}
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
        if(lang==="java"&&isOp("::"))fail(`line ${t.line}: method references (::) aren't supported in TypeMonkey's runner yet. Use a lambda like x -> ...`,"NotSupported");
        if(isOp(".")||(isOp("->")&&lang!=="java")||isOp("::")||(isOp("?")&&isOp(".",1))){if(isOp("?"))p++;const arrow=peek().v==="->";p++;const name=ident();
          if(isOp("<")&&lang==="cs"&&name.match(/^(Cast|OfType|Select|Where)$/))fail(`LINQ (.${name}) isn't supported in TypeMonkey's runner yet`,"NotSupported");
          e={k:"member",e,name,arrow,line:t.line};continue}
        if(isOp("++")||isOp("--")){p++;e={k:"post",op:t.v,e,line:t.line};continue}
        return e;
      }
    }
    const ARROW=lang==="java"?"->":"=>";
    function lambdaAhead(){ // (a, b) => or (int a) =>   (Java: ->)
      if(!isOp("("))return false;let d=0,j=p;
      for(;j<tokens.length;j++){const v=tokens[j];if(v.k==="op"&&v.v==="(")d++;else if(v.k==="op"&&v.v===")"){d--;if(!d)break}}
      return tokens[j+1]&&tokens[j+1].k==="op"&&tokens[j+1].v===ARROW;
    }
    function lambdaBody(){if(isOp("{"))return block();return {k:"block",body:[{k:"return",e:expr()}]}}
    function primary(){
      const t=peek();
      if(t.k==="num"){p++;return {k:"lit",v:t.v}}
      if(t.k==="str"){p++;return {k:"lit",v:t.v}}
      if(t.k==="char"){p++;return {k:"lit",v:new Ch(t.v.codePointAt(0))}}
      if(t.k==="istr"){p++;return {k:"istr",parts:interp(t.v,t.line)}}
      if((lang==="cs"||lang==="java")&&lambdaAhead()){p++;const ps=[];if(!isOp(")"))do{const ty=peek().k==="id"&&peek(1).k==="id"?tryType():null;ps.push({type:ty,name:ident()})}while(accept(","));expect(")");expect(ARROW);return {k:"lambda",params:ps,body:lambdaBody()}}
      if(lang==="java"&&t.k==="id"&&isOp("->",1)){const n=ident();p++;return {k:"lambda",params:[{name:n}],body:lambdaBody()}}
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
        if(lang==="cpp"&&classNames.has(t.v)&&isOp("{")){const il=initList();return {k:"tinit",type:{name:t.v,args:[],ptr:0,arr:0},items:il.items,line:t.line}}  // Item{"fig", 3}
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
  function run(code,lang,input,quiet){
    let out="";let steps=0;
    /* typed input from TypeMonkey's ⌨️ Input box: read by lines or by words, echoed like a terminal would show it */
    const IN=input==null?"":String(input).replace(/\r/g,"");let inPos=0,echoed=0;const hasIn=input!=null&&IN.length>0;
    const echoFrom=at=>{if(quiet)return;if(at>=echoed){const e=IN.indexOf("\n",at);const end=e<0?IN.length:e;W(IN.slice(at,end)+"\n");echoed=end+1}};
    const readLineIn=()=>{if(inPos>=IN.length)return null;echoFrom(inPos);const e=IN.indexOf("\n",inPos);const end=e<0?IN.length:e;const line=IN.slice(inPos,end);inPos=end+1;return line};
    const readTok=()=>{while(inPos<IN.length&&/\s/.test(IN[inPos]))inPos++;if(inPos>=IN.length)return null;echoFrom(inPos);let j=inPos;while(j<IN.length&&!/\s/.test(IN[j]))j++;const t=IN.slice(inPos,j);inPos=j;return t};
    const peekTok=()=>{let k=inPos;while(k<IN.length&&/\s/.test(IN[k]))k++;if(k>=IN.length)return null;let j=k;while(j<IN.length&&!/\s/.test(IN[j]))j++;return IN.slice(k,j)};
    const noInput=what=>`${what}: there's no more input. Type your answers in the ⌨️ Input box under the code, one per line.`;
    const tick=()=>{if(++steps>300000)fail("Your program ran too long, so I stopped it. Check for a loop that never ends.","Timeout")};
    const classNames=new Set([...code.matchAll(lang==="java"?/\b(?:class|interface|enum)\s+([A-Za-z_]\w*)/g:/\b(?:class|struct)\s+([A-Za-z_]\w*)/g)].map(m=>m[1]));
    const classes=Object.create(null);
    const globalEnv=new Env(null);
    const funcs=Object.create(null);
    const W=s=>{out+=s;if(out.length>200000)fail("Your program printed too much, so I stopped it.","Timeout")};

    function Env(parent){this.vars=new Map();this.parent=parent;this.self=parent?parent.self:null;this.cls=parent?parent.cls:null}
    Env.prototype.find=function(n){let e=this;while(e){if(e.vars.has(n))return e.vars.get(n);e=e.parent}return null};
    Env.prototype.def=function(n,cell,line){if(this.vars.has(n)&&!(this.vars.get(n) instanceof Func))fail(`line ${line||"?"}: ${lang==="cs"?`A local variable named '${n}' is already defined here`:lang==="java"?`variable ${n} is already defined`:`redeclaration of '${n}'`}`,"CompileError");this.vars.set(n,cell)};

    /* type conversions */
    function tname(t){return t?t.name:"var"}
    function isClassT(t){return t&&classes[t.name]&&!t.ptr&&!t.ref}
    function defaultFor(t){
      if(!t)return null;if(t.ptr)return null;if(t.arr)return null;
      if(INT_T.has(t.name))return 0;if(DBL_T.has(t.name))return new D(0);if(t.name==="bool")return false;if(t.name==="char")return new Ch(0);
      if(t.name==="string")return lang==="cpp"?"":null;
      if(lang==="cpp"){if(t.name==="vector")return new Arr("vector",[],t.args[0]);if(t.name==="map"||t.name==="unordered_map"){const d=new Dict();d.kt=t.args[0];d.vt=t.args[1];d.sorted=t.name==="map";return d}if(classes[t.name])return construct(classes[t.name],[],0)}
      if(classes[t.name]&&classes[t.name].isStruct)return construct(classes[t.name],[],0);
      return null;
    }
    function coerce(v,t,line){
      if(!t||t.name==="var"||t.name==="auto"||t.name==="object"||t.name==="dynamic"){if(v instanceof InitList)return new Arr(lang==="cpp"?"vector":"array",v.items,null);return lang==="cpp"&&!(t&&t.ref)?copy(v):v}
      if(t.ptr&&!t.arr)return v;
      if(t.arr){if(v instanceof InitList)return new Arr("array",v.items.map(x=>coerce(x,{...t,arr:t.arr-1},line)),{...t,arr:t.arr-1});return v}
      if(v instanceof InitList){
        if(t.name==="vector"||t.name==="List"||t.name==="HashSet")return new Arr(t.name==="vector"?"vector":"list",v.items.map(x=>coerce(x,t.args[0],line)),t.args[0]);
        if(lang==="cpp"&&(t.name==="map"||t.name==="unordered_map")){const d=new Dict();d.kt=t.args[0];d.vt=t.args[1];d.sorted=t.name==="map";
          for(const it of v.items){if(!(it instanceof InitList)||it.items.length!==2)fail(`line ${line}: each map entry needs a key and a value, like {"banana", 2}`,"CompileError");const k=coerce(it.items[0],t.args[0],line);d.m.set(dkey(k),[k,coerce(it.items[1],t.args[1],line)])}return d}
        if(classes[t.name])return lang==="cpp"&&classes[t.name].ctors.length?construct(classes[t.name],v.items,line):aggregate(classes[t.name],v.items,line);
        if(v.items.length===1)return coerce(v.items[0],t,line);
        if(!v.items.length)return defaultFor(t);
        fail(`line ${line}: can't use { } to make a ${tname(t)}`,"CompileError");
      }
      if(lang==="java"&&(INT_T.has(t.name)||DBL_T.has(t.name)||t.name==="bool"||t.name==="char"||t.name==="string"))return jcoerce(v,t,line);
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
      if(lang==="cpp"&&!t.ref&&v instanceof Obj&&classes[t.name]&&v.cls!==classes[t.name]&&isA(v.cls,t.name)){  // object slicing: only the base part is copied
        const o=new Obj(classes[t.name]);for(const k of allFields(classes[t.name]))o.f[k]=copy(v.f[k]);return o}
      if(lang==="cpp"&&!t.ref)return copy(v);
      return v;
    }
    function allFields(c){const r=[];for(;c;c=c.sup)for(const f of c.fields||[])r.push(f.name);return r}
    function jtype(v){return typeof v==="number"?"int":v instanceof D?"double":v instanceof Lg?"long":typeof v==="boolean"?"boolean":typeof v==="string"?"String":v instanceof Ch?"char":v instanceof Obj?v.cls.name:v===null?"null":v instanceof Arr?(v.kind==="array"?jtname(v.elem)+"[]":"ArrayList"):v instanceof Dict?(v.isSet?"HashSet":"HashMap"):"Object"}
    function jtname(t){if(!t)return "Object";return t.jname||({int:"int",double:"double",bool:"boolean",string:"String",char:"char",long:"long"})[t.name]||t.name}
    function jcoerce(v,t,line){
      const tn=jtname(t),boxed=t.jname&&t.jname!==t.name&&!["boolean"].includes(t.jname)&&t.jname!=="String";
      const bad=()=>fail(`line ${line}: incompatible types: ${jtype(v)} cannot be converted to ${tn}`,"CompileError");
      if(v===null){if(boxed||t.name==="string")return null;if(t.arr)return null;fail(`line ${line}: Cannot unbox a null value into ${tn} (it's null)`,"NullPointerException")}
      if(v instanceof InitList){if(v.items.length===1)return jcoerce(v.items[0],t,line);bad()}
      if(INT_T.has(t.name)){
        if(t.name==="long"){if(v instanceof D)fail(`line ${line}: incompatible types: possible lossy conversion from double to long`,"CompileError");if(isNum(v))return new Lg(nv(v));bad()}
        if(v instanceof D)fail(`line ${line}: incompatible types: possible lossy conversion from double to ${tn}`,"CompileError");
        if(v instanceof Lg)fail(`line ${line}: incompatible types: possible lossy conversion from long to ${tn}`,"CompileError");
        if(v instanceof Ch)return v.c;if(typeof v==="number")return v;bad()}
      if(DBL_T.has(t.name)){if(isNum(v))return new D(nv(v));bad()}
      if(t.name==="bool"){if(typeof v==="boolean")return v;bad()}
      if(t.name==="char"){if(v instanceof Ch)return v;if(typeof v==="number")return new Ch(v);bad()}
      if(t.name==="string"){if(typeof v==="string")return v;bad()}
      return v;
    }
    function typeOf(v){if(lang==="java")return jtype(v);return typeof v==="number"?"int":v instanceof D?"double":typeof v==="boolean"?"bool":typeof v==="string"?"string":v instanceof Ch?"char":v instanceof Obj?v.cls.name:v===null?"null":"object"}
    function copy(v){  // C++ value semantics
      if(v instanceof Obj){const o=new Obj(v.cls);for(const k in v.f)o.f[k]=copy(v.f[k]);return o}
      if(v instanceof Arr&&(v.kind==="vector"||v.kind==="array"))return new Arr(v.kind,v.items.map(copy),v.elem);
      if(v instanceof Dict&&lang==="cpp"){const d=new Dict();d.kt=v.kt;d.vt=v.vt;d.sorted=v.sorted;for(const [k,x] of v.m)d.m.set(k,[x[0],copy(x[1])]);return d}
      return v;
    }
    const JPARENT={Throwable:null,Exception:"Throwable",Error:"Throwable",RuntimeException:"Exception",StackOverflowError:"Error",
      ArithmeticException:"RuntimeException",IndexOutOfBoundsException:"RuntimeException",ArrayIndexOutOfBoundsException:"IndexOutOfBoundsException",StringIndexOutOfBoundsException:"IndexOutOfBoundsException",
      NullPointerException:"RuntimeException",IllegalArgumentException:"RuntimeException",NumberFormatException:"IllegalArgumentException",IllegalStateException:"RuntimeException",
      UnsupportedOperationException:"RuntimeException",ClassCastException:"RuntimeException",NegativeArraySizeException:"RuntimeException",ConcurrentModificationException:"RuntimeException",
      NoSuchElementException:"RuntimeException",InputMismatchException:"NoSuchElementException",IllegalFormatConversionException:"IllegalArgumentException",MissingFormatArgumentException:"IllegalArgumentException",
      UnknownFormatConversionException:"IllegalArgumentException",PatternSyntaxException:"IllegalArgumentException",InterruptedException:"Exception",IOException:"Exception",FileNotFoundException:"IOException"};
    function jexcIs(kind,name){if(name==="Exception"&&!(kind in JPARENT)&&!/Error$/.test(kind)&&!classes[kind])return true;for(let k=kind;k;k=JPARENT[k]){if(k===name)return true;if(!(k in JPARENT)&&k!==kind)break;if(!(k in JPARENT))return name==="Exception"||name==="Throwable"}return false}
    function findMethod(cls,n){for(let c=cls;c;c=c.sup){const m=c.methods&&c.methods[n];if(m&&!m.isAbstract)return m}
      for(let c=cls;c;c=c.sup)for(const i of c.ifaces||[]){const ic=classes[i];if(ic){const m=findMethod(ic,n);if(m&&!m.isAbstract)return m}}
      for(let c=cls;c;c=c.sup){const m=c.methods&&c.methods[n];if(m)return m}
      for(let c=cls;c;c=c.sup)for(const i of c.ifaces||[]){const ic=classes[i];if(ic){const m=findMethod(ic,n);if(m)return m}}
      return null}
    function isA(cls,name){const seen=new Set();const walk=c=>{if(!c||seen.has(c))return false;seen.add(c);if(c.name===name)return true;if(c.excBase&&jexcIs(c.excBase,name))return true;if((c.ifaces||[]).some(i=>i===name||walk(classes[i])))return true;return walk(c.sup)};return walk(cls)}
    function jconstruct(cls,argVals,line){
      if(cls.isInterface||cls.isAbstractClass)fail(`line ${line}: ${cls.name} is abstract; cannot be instantiated`,"CompileError");
      const o=new Obj(cls);if(cls.excChain)o.msg=null;
      initChain(cls,o,argVals,line);return o;
    }
    function initChain(cls,o,argVals,line){
      const fenv=new Env(globalEnv);fenv.self=o;fenv.cls=cls;
      const c=cls.ctors.length?pickOverload(cls.ctors,argVals.length,argVals):null;
      if(cls.ctors.length&&!c)fail(`line ${line}: constructor ${cls.name} can't take ${argVals.length} argument(s)`,"CompileError");
      if(!cls.ctors.length&&argVals.length&&!cls.sup&&!cls.excBase)fail(`line ${line}: constructor ${cls.name} in class ${cls.name} cannot be applied to given types (it takes no arguments)`,"CompileError");
      const cenv=new Env(globalEnv);cenv.self=o;cenv.cls=cls;
      if(c)bindParams(c.params,argVals,cenv,line);
      let body=c?c.body.body:[];
      const first=body[0];const isSuper=first&&first.k==="expr"&&first.e.k==="call"&&first.e.f.k==="name"&&first.e.f.v==="super";
      const isThis=first&&first.k==="expr"&&first.e.k==="call"&&first.e.f.k==="this";
      if(isThis){initChain(cls,o,first.e.args.map(a=>ev(a,cenv)),line);execBlock({k:"block",body:body.slice(1)},cenv,true);return}
      const superArgs=isSuper?first.e.args.map(a=>ev(a,cenv)):[];
      if(isSuper)body=body.slice(1);
      if(cls.sup)initChain(cls.sup,o,superArgs,line);
      else if(cls.excBase){o.msg=superArgs.length?str(superArgs[0]):null}
      else if(isSuper&&superArgs.length)fail(`line ${line}: ${cls.name} has no parent class to pass arguments to`,"CompileError");
      for(const f of cls.fields)o.f[f.name]=f.init?coerce(ev(f.init,fenv),f.type,line):defaultFor(f.type);
      if(c)execBlock({k:"block",body},cenv,true);
    }
    function construct(cls,argVals,line,inits,env){
      if(lang==="java")return jconstruct(cls,argVals,line);
      if(lang==="cs"&&cls.isAbstractClass)fail(`line ${line}: Cannot create an instance of the abstract type or interface '${cls.name}'`,"CompileError");
      if(lang==="cpp"){const pv=pureLeft(cls);if(pv)fail(`line ${line}: cannot create an object of abstract type '${cls.name}': '${pv.owner}::${pv.name}' is pure virtual (= 0) and ${cls.name} doesn't override it`,"CompileError")}
      const o=new Obj(cls);
      initObj(cls,o,argVals,line,!!inits);
      if(inits)for(const it of inits){if(!it.field)fail(`line ${line}: use Name = value in an object initializer`,"SyntaxError");if(!(it.field in o.f))fail(`line ${line}: '${cls.name}' does not contain a definition for '${it.field}'`,"CompileError");o.f[it.field]=coerce(it.val.k==="init"?new InitList(it.val.items.map(x=>ev(x,env))):ev(it.val,env),fieldType(cls,it.field),line)}
      return o;
    }
    // runs the constructor chain: base class first (: base(...) in C#, : Parent(...) in C++), then this class's fields and body
    function initObj(cls,o,argVals,line,hasInits){
      const fenv=new Env(globalEnv);fenv.self=o;fenv.cls=cls;
      let c=null;
      if(cls.ctors.length){
        c=pickOverload(cls.ctors,argVals.length,argVals);
        if(!c&&!(lang==="cs"&&hasInits&&!argVals.length))fail(`line ${line}: ${lang==="cs"?`${cls.name} doesn't have a constructor that takes ${argVals.length} argument(s)`:`no matching constructor for ${cls.name} with ${argVals.length} argument(s)`}`,"CompileError");
      }else if(argVals.length){
        if(lang==="cpp"){aggregateInto(cls,o,argVals.map(v=>({k:"val",v})),line);return}
        fail(`line ${line}: ${cls.name} doesn't have a constructor that takes ${argVals.length} argument(s)`,"CompileError");
      }
      const cenv=new Env(globalEnv);cenv.self=o;cenv.cls=cls;
      if(c)bindParams(c.params,argVals,cenv,line);
      const init=c?c.init:[];
      const selfI=init.find(x=>x[0]==="this"||(lang==="cpp"&&x[0]===cls.name));
      if(selfI){initObj(cls,o,selfI[1].map(a=>ev(a,cenv)),line);execBlock(c.body,cenv,true);return}
      const baseI=init.find(x=>(lang==="cs"&&x[0]==="base")||(lang==="cpp"&&cls.sup&&x[0]===cls.sup.name));
      if(cls.sup){
        const sup=cls.sup;const ba=baseI?baseI[1].map(a=>ev(a,cenv)):[];
        if(!baseI&&sup.ctors.length&&!sup.ctors.some(x=>x.params.every(pr=>pr.def))){const need=sup.ctors[0].params;
          fail(`line ${line}: ${lang==="cs"?`There is no argument given that corresponds to the required parameter '${need[0].name}' of '${sup.name}.${sup.name}(...)'. ${c?`Add : base(...) after ${cls.name}'s constructor`:`Give ${cls.name} a constructor that calls : base(...)`}`:`no matching function for call to '${sup.name}::${sup.name}()'. Call ${sup.name}(...) in ${cls.name}'s initializer list, like ${cls.name}(...) : ${sup.name}(...) { }`}`,"CompileError")}
        initObj(sup,o,ba,line);
      }else if(cls.isExc){const ba=baseI?baseI[1].map(a=>ev(a,cenv)):[];o.msg=ba.length?str(ba[0]):`Exception of type '${o.cls.name}' was thrown.`}
      else if(baseI)fail(`line ${line}: ${cls.name} has no base class to pass arguments to`,"CompileError");
      for(const f of cls.fields)o.f[f.name]=f.init?coerce(f.init.k==="init"?new InitList(f.init.items.map(x=>ev(x,fenv))):ev(f.init,fenv),f.type,line):defaultFor(f.type);
      for(const ent of init){if(ent===baseI)continue;const [fname,a]=ent;const f=cls.fields.find(x=>x.name===fname);
        if(!f&&lang==="cpp"&&classes[fname])fail(`line ${line}: ${fname} isn't a direct base class of ${cls.name}`,"CompileError");
        o.f[fname]=coerce(a.length===1?ev(a[0],cenv):new InitList(a.map(x=>ev(x,cenv))),f?f.type:null,line)}
      if(c)execBlock(c.body,cenv,true);
    }
    function aggregate(cls,items,line){const o=new Obj(cls);aggregateInto(cls,o,items,line);return o}
    function aggregateInto(cls,o,items,line){
      const fenv=new Env(globalEnv);fenv.self=o;fenv.cls=cls;
      const val=x=>x instanceof Object&&x.k==="val"?x.v:x;
      if(cls.sup){const b=items.length?val(items[0]):undefined;items=items.slice(1);
        if(b instanceof InitList){if(cls.sup.ctors.length)initObj(cls.sup,o,b.items,line);else aggregateInto(cls.sup,o,b.items,line)}
        else if(b instanceof Obj&&isA(b.cls,cls.sup.name)){for(const k of allFields(cls.sup))o.f[k]=copy(b.f[k])}
        else initObj(cls.sup,o,b===undefined?[]:[b],line)}
      cls.fields.forEach((f,i)=>{o.f[f.name]=i<items.length?coerce(val(items[i]),f.type,line):(f.init?coerce(f.init.k==="init"?new InitList(f.init.items.map(x=>ev(x,fenv))):ev(f.init,fenv),f.type,line):defaultFor(f.type))});
    }
    /* inheritance helpers (C# and C++) */
    function fieldType(c,n){for(;c;c=c.sup){const f=(c.fields||[]).find(x=>x.name===n);if(f)return f.type}return null}
    const own=(c,n)=>c&&c.methods&&Object.prototype.hasOwnProperty.call(c.methods,n)?c.methods[n]:null;
    function findDecl(cls,n){for(let c=cls;c;c=c.sup){const m=own(c,n);if(m)return m}return null}
    const ovs=m=>m.overloads||[m];
    function virtIn(cls,n){for(let c=cls;c;c=c.sup){const m=own(c,n);if(m&&ovs(m).some(x=>x.isVirtual||x.isAbstract))return true}return false}
    function pureLeft(cls){const seen=new Set();for(let c=cls;c;c=c.sup)for(const n in c.methods){if(seen.has(n))continue;seen.add(n);const m=c.methods[n];if(ovs(m).some(x=>x.isAbstract))return m}return null}
    // which method runs for o.n() when the variable's declared (static) class is scls
    function dispatch(o,n,scls){
      const start=scls&&scls!==o.cls&&isA(o.cls,scls.name)?scls:o.cls;
      const m0=findDecl(start,n);if(!m0||start===o.cls)return m0;
      const virt=lang==="cpp"?virtIn(classes[m0.owner]||start,n):ovs(m0).some(x=>x.isVirtual||x.isAbstract||x.isOverride);
      if(!virt)return m0;
      for(let c=o.cls;c&&c!==start;c=c.sup){const m=own(c,n);if(m&&(lang==="cpp"||ovs(m).some(x=>x.isOverride)))return m}
      return m0;
    }
    function boundM(o,m,fallback){return new Func({method:m,self:o,cls:classes[m.owner]||fallback||(o&&o.cls)})}
    // the declared type of an expression, when we can tell without running it (used for non-virtual calls)
    function setSt(env,n,t){if(t)(env.st||(env.st=new Map())).set(n,t)}
    function declSt(t,initE,env){if(!t)return null;if(t.name==="var"||t.name==="auto"){const st=initE?staticType(initE,env):null;return st||null}return t}
    function staticType(e,env){
      switch(e&&e.k){
        case "name":{for(let x=env;x;x=x.parent)if(x.vars.has(e.v))return x.st&&x.st.get(e.v)||null;
          if(env.self&&e.v in env.self.f)return fieldType(env.cls||env.self.cls,e.v);return null}
        case "this":return env.cls?{name:env.cls.name,args:[],ptr:lang==="cpp"?1:0}:null;
        case "index":{const t=staticType(e.e,env);if(!t)return null;if(t.arr)return {...t,arr:t.arr-1};if(t.args&&t.args.length)return ["Dictionary","map","unordered_map"].includes(t.name)?t.args[1]:t.args[0];return null}
        case "deref":{const t=staticType(e.e,env);return t&&t.ptr?{...t,ptr:t.ptr-1}:null}
        case "member":{const t=staticType(e.e,env);const c=t&&classes[t.name];return c?fieldType(c,e.name):null}
        case "cast":case "tinit":return e.type;
        case "new":return e.type?{...e.type,ptr:lang==="cpp"?1:0}:null;
        case "addr":{const t=staticType(e.e,env);return t?{...t,ptr:(t.ptr||0)+1}:null}
      }
      return null;
    }
    function staticCls(e,env){const t=staticType(e,env);return t&&classes[t.name]||null}
    function fits(t,v){if(!t)return 1;if(t.arr)return v instanceof Arr&&v.kind==="array"?2:v===null?1:0;if(INT_T.has(t.name))return t.name==="long"?(v instanceof Lg?3:typeof v==="number"||v instanceof Ch?2:0):(typeof v==="number"?3:v instanceof Ch?2:0);if(DBL_T.has(t.name))return v instanceof D?3:isNum(v)?1:0;if(t.name==="bool")return typeof v==="boolean"?3:0;if(t.name==="char")return v instanceof Ch?3:0;if(t.name==="string")return typeof v==="string"?3:v===null?1:0;if(classes[t.name])return v instanceof Obj&&isA(v.cls,t.name)?3:v===null?1:0;return 1}
    function pickOverload(list,n,vals){const same=list.filter(c=>c.params.length===n);
      if(same.length>1&&vals){let best=null,bs=-1;for(const c of same){let sc=0,ok=true;c.params.forEach((pr,i)=>{const f=fits(pr.type,vals[i]);if(!f)ok=false;sc+=f});if(ok&&sc>bs){bs=sc;best=c}}if(best)return best}
      return same[0]||list.find(c=>c.params.length>n&&c.params.slice(n).every(p=>p.def))}
    function bindParams(params,argVals,env,line,argRefs){
      params.forEach((pr,i)=>{
        let v=i<argVals.length?argVals[i]:pr.def?ev(pr.def,env):fail(`line ${line}: missing an argument for '${pr.name}'`,"CompileError");
        setSt(env,pr.name,pr.type);
        if(pr.type&&pr.type.ref&&lang==="cpp"){const r=argRefs&&argRefs[i];if(!r&&pr.type.isConst){env.vars.set(pr.name,new Cell(coerce(v,{...pr.type,ref:false},line),pr.type));return}if(!r)fail(`line ${line}: '${pr.name}' is a reference (&), so you have to pass a variable, not a value`,"CompileError");env.vars.set(pr.name,r);return}
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
    let nextHash=0x1b6d3586;const hashes=new WeakMap();
    function idHash(o){if(!hashes.has(o)){hashes.set(o,nextHash);nextHash=(Math.imul(nextHash,1103515245)+12345)>>>1}return hashes.get(o)}
    function jdbl(x){
      if(isNaN(x))return "NaN";if(!isFinite(x))return x>0?"Infinity":"-Infinity";
      if(x===0)return Object.is(x,-0)?"-0.0":"0.0";
      const a=Math.abs(x);
      if(a>=1e-3&&a<1e7){let s=String(x);if(!s.includes("."))s+=".0";return s}
      let [m,e]=x.toExponential().split("e");if(!m.includes("."))m+=".0";return m+"E"+(e[0]==="+"?e.slice(1):e);
    }
    function jexcName(n){return ["ArithmeticException","ArrayIndexOutOfBoundsException","IndexOutOfBoundsException","StringIndexOutOfBoundsException","NullPointerException","NumberFormatException","IllegalArgumentException","IllegalStateException","RuntimeException","Exception","UnsupportedOperationException","ClassCastException","StackOverflowError","Error","Throwable","NegativeArraySizeException","ArrayStoreException","CloneNotSupportedException","InterruptedException"].includes(n)?"java.lang."+n:["NoSuchElementException","InputMismatchException","ConcurrentModificationException","EmptyStackException"].includes(n)?"java.util."+n:n}
    function jstr(v){
      if(v===null||v===undefined)return "null";
      if(typeof v==="string")return v;
      if(typeof v==="number")return String(v);
      if(v instanceof Lg)return String(v.v);
      if(v instanceof D)return jdbl(v.v);
      if(typeof v==="boolean")return v?"true":"false";
      if(v instanceof Ch)return String.fromCharCode(v.c);
      if(v instanceof Obj){
        if(v.cls.isEnumVal)return v.ev.name;
        const m=findMethod(v.cls,"toString");if(m&&!m.isAbstract)return str(invoke({method:m,self:v,cls:v.cls},[],0));
        if(v.msg!==undefined){const q=v.cls.excChain||!classes[v.cls.name]?jexcName(v.cls.name):v.cls.name;return v.msg===null?q:`${q}: ${v.msg}`}
        return `${v.cls.name}@${idHash(v).toString(16)}`}
      if(v instanceof Arr){
        if(v.kind==="array"){const code=({int:"I",double:"D",char:"C",bool:"Z",long:"J"})[v.elem&&!v.elem.arr?v.elem.name:""];return (v.elem&&v.elem.arr?"[".repeat(v.elem.arr):"")+(code?`[${code}`:`[L${v.elem&&v.elem.name==="string"?"java.lang.String":v.elem?v.elem.name:"java.lang.Object"};`)+"@"+idHash(v).toString(16)}
        return "["+v.items.map(x=>x===v?"(this Collection)":jstr(x)).join(", ")+"]"}
      if(v instanceof Dict){if(v.isSet)return "["+jkeys(v).map(jstr).join(", ")+"]";return "{"+jentries(v).map(([k,x])=>jstr(k)+"="+jstr(x)).join(", ")+"}"}
      if(v instanceof KV)return jstr(v.k)+"="+jstr(v.v);
      if(v&&v.sb)return v.s;
      if(v instanceof Func)return "Main$$Lambda@"+idHash(v).toString(16);
      if(v&&v.random)return "java.util.Random@"+idHash(v).toString(16);
      return String(v);
    }
    /* Java HashMap / HashSet iteration order */
    function jhash(k){
      if(typeof k==="string"){let h=0;for(let i=0;i<k.length;i++)h=(Math.imul(31,h)+k.charCodeAt(i))|0;return h}
      if(typeof k==="number")return k|0;if(k instanceof Ch)return k.c;if(typeof k==="boolean")return k?1231:1237;
      if(k instanceof Lg)return (k.v|0)^(Math.floor(k.v/4294967296)|0);
      if(k instanceof D){const b=new DataView(new ArrayBuffer(8));b.setFloat64(0,k.v===0?0:k.v);return b.getInt32(0)^b.getInt32(4)}
      if(k===null)return 0;
      if(k instanceof Obj){if(k.cls.isEnumVal)return idHash(k);const m=findMethod(k.cls,"hashCode");if(m)return nv(invoke({method:m,self:k,cls:k.cls},[],0))|0;return idHash(k)}
      return 0;
    }
    function jcap(d){let c=d.cap0||16;while(d.maxSize>c*0.75)c*=2;return c}
    function jentries(d){
      const list=[...d.m.values()];const kind=d.jk||"HashMap";
      if(/^Linked/.test(kind))return list;
      if(/^Tree/.test(kind))return list.sort((a,b)=>jcmp(a[0],b[0]));
      const cap=jcap(d);const idx=new Map();list.forEach((e,i)=>{const h=jhash(e[0]);idx.set(e,[((h^(h>>>16))&(cap-1)),i])});
      return list.sort((a,b)=>{const x=idx.get(a),y=idx.get(b);return x[0]-y[0]||x[1]-y[1]});
    }
    function jkeys(d){return jentries(d).map(e=>e[0])}
    function jput(d,k,v){const key=dkey(k);const had=d.m.get(key);if(had){const old=had[1];had[1]=v;return old}d.m.set(key,[k,v]);d.maxSize=Math.max(d.maxSize||0,d.m.size);return null}
    function jcmp(a,b){
      if(typeof a==="string"&&typeof b==="string"){const n=Math.min(a.length,b.length);for(let i=0;i<n;i++){const x=a.charCodeAt(i),y=b.charCodeAt(i);if(x!==y)return x-y}return a.length-b.length}
      if(a instanceof Obj&&a.cls.isEnumVal&&b instanceof Obj)return a.ev.ordinal-b.ev.ordinal;
      if(a instanceof Obj){const m=findMethod(a.cls,"compareTo");if(m)return nv(invoke({method:m,self:a,cls:a.cls},[b],0));fail(`class ${a.cls.name} cannot be cast to class java.lang.Comparable (it has no compareTo method)`,"ClassCastException")}
      if(typeof a==="boolean")return (a?1:0)-(b?1:0);
      const x=nv(a),y=nv(b);return x<y?-1:x>y?1:0;
    }
    function str(v,ctx){  // ctx: "cs" | "cpp"
      if(lang==="java")return jstr(v);
      if(v===null||v===undefined)return lang==="cs"?"":"0";
      if(typeof v==="string")return v;
      if(typeof v==="number")return String(v);
      if(v instanceof D){if(lang==="cpp")return fmtG(v.v);if(!isFinite(v.v))return isNaN(v.v)?"NaN":v.v>0?"∞":"-∞";let s=String(v.v);if(/e/.test(s)){s=s.replace(/e\+?/,"E+").replace("E+-","E-");if(!/E-/.test(s)&&!/E\+/.test(s))s=s.replace("E","E+")}return s}
      if(typeof v==="boolean")return lang==="cs"?(v?"True":"False"):(v?"1":"0");
      if(v instanceof Ch)return String.fromCodePoint(v.c);
      if(v instanceof Obj){if(lang==="cs"&&findDecl(v.cls,"ToString"))return str(callMethod(v,"ToString",[],0));return lang==="cs"?v.cls.name:`[${v.cls.name} object]`}
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
        if(env.cls&&classes[env.cls.name]){for(let c=classes[env.cls.name];c;c=c.sup)if(c.staticVals&&e.v in c.staticVals){const st=c.staticVals;return new LV(()=>st[e.v],v=>st[e.v]=v)}}
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
        if(lang==="java"&&!(base instanceof Arr&&base.kind==="array")){if(base===null)fail(`line ${e.line}: Cannot load from array because it is null`,"NullPointerException");fail(`line ${e.line}: array required, but ${jtype(base)} found. ${base instanceof Arr?"Use .get(i) on a List.":base instanceof Dict?"Use .get(key) on a Map.":typeof base==="string"?"Use .charAt(i) on a String.":""}`,"CompileError")}
        if(lang==="java"&&!(typeof i==="number"||i instanceof Ch))fail(`line ${e.line}: incompatible types: ${jtype(i)} cannot be converted to int`,"CompileError");
        if(base instanceof Arr){const idx=nv(i);checkIdx(base,idx,e.line);return new LV(()=>base.items[idx],v=>{base.items[idx]=v})}
        if(base instanceof Dict){const k=dkey(i);return new LV(()=>{if(!base.m.has(k)){if(lang==="cpp"){const d0=base.vt?defaultFor(base.vt):0;base.m.set(k,[i,d0]);return d0}return dictMissing(i,e.line)}return base.m.get(k)[1]},v=>base.m.set(k,[i,v]))}
        if(typeof base==="string"){if(lang==="cs")fail(`line ${e.line}: strings can't be changed in C#. Build a new string instead.`,"CompileError");
          const c=lval(e.e,env);const idx=nv(i);return new LV(()=>new Ch(c.get().codePointAt(idx)),v=>{const s=c.get();c.set(s.slice(0,idx)+(typeof v==="number"?String.fromCodePoint(v):str(v))+s.slice(idx+1))})}
        if(base instanceof Ptr)fail(`line ${e.line}: pointer arithmetic isn't supported in TypeMonkey's runner yet`,"NotSupported");
        fail(`line ${e.line}: can't use [ ] here`,"CompileError");
      }
      if(e.k==="deref"){const pv=ev(e.e,env);if(pv===null)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");if(!(pv instanceof Ptr))fail(`line ${e.line}: * needs a pointer`,"CompileError");if(!pv.ref)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");return pv.ref}
      if(e.k==="pre"&&lang==="cpp"){ev(e,env);return lval(e.e,env)}
      if(e.k==="cond"&&lang==="cpp")return truth(ev(e.c,env))?lval(e.a,env):lval(e.b,env);
      if(e.k==="assign"&&lang==="cpp"){ev(e,env);return lval(e.l,env)}
      return null;
    }
    function lvField(o,n){const lv=Object.assign(new LV(()=>o.f[n],v=>{o.f[n]=v}),{key:{o,n}});if(lang==="java")for(let c=o.cls;c;c=c.sup){const f=(c.fields||[]).find(x=>x.name===n);if(f){lv.type=f.type;break}}return lv}
    function notDeclared(n,line){fail(lang==="cs"?`line ${line}: The name '${n}' does not exist in the current context`:`line ${line}: '${n}' was not declared in this scope`,"CompileError")}
    function checkIdx(a,i,line){if(!Number.isInteger(i)||i<0||i>=a.items.length){
      if(lang==="java")fail(`line ${line}: Index ${i} out of bounds for length ${a.items.length}`,a.kind==="array"?"ArrayIndexOutOfBoundsException":"IndexOutOfBoundsException");
      if(lang==="cs")fail(`line ${line}: Index was outside the bounds of the ${a.kind==="list"?"list":"array"} (index ${i}, but there are ${a.items.length} items).`,"IndexOutOfRangeException");
      fail(`line ${line}: index ${i} is out of range (the vector has ${a.items.length} items). In real C++ this is undefined behavior and could crash.`,"RuntimeError")}}
    function dkey(k){if(lang==="java"&&k instanceof Obj)return k.cls.isEnumVal?"e:"+k.cls.name+"."+k.ev.name:findMethod(k.cls,"equals")?"o:"+jhash(k):"o#"+idHash(k);
      if(lang==="java"&&k instanceof Lg)return "number:"+k.v;
      return (typeof k)+":"+(k instanceof D?k.v:k instanceof Ch?k.c:k)}
    function dictMissing(k,line){fail(`line ${line}: The given key '${str(k)}' was not present in the dictionary. Check with ContainsKey first.`,"KeyNotFoundException")}
    function derefVal(v,line){if(v instanceof Ptr){if(!v.ref)fail(`line ${line}: crash! You used -> on a null pointer.`,"RuntimeError");return v.ref.get()}return v}
    const truth=v=>{if(typeof v==="boolean")return v;if(v&&v.cin)return !v.fail;if(lang==="java")fail(`incompatible types: ${jtype(v)} cannot be converted to boolean (a condition must be true or false)`,"CompileError");if(v===null)return false;if(v instanceof Ptr)return !!v.ref;if(lang==="cs")fail("a condition must be true or false (a bool) in C#","CompileError");return !!nv(v)};

    /* expressions */
    function jarith(op,a,b,line){
      if(op==="+"&&(typeof a==="string"||typeof b==="string"))return jstr(a)+jstr(b);
      if(!isNum(a)||!isNum(b)){if(typeof a==="boolean"&&typeof b==="boolean"&&["&","|","^"].includes(op))return op==="&"?a&&b:op==="|"?a||b:a!==b;
        fail(`line ${line}: bad operand types for binary operator '${op}' (${jtype(a)} and ${jtype(b)})`,"CompileError")}
      const dbl=a instanceof D||b instanceof D,lng=a instanceof Lg||b instanceof Lg;const x=nv(a),y=nv(b);
      if(dbl){switch(op){case "+":return new D(x+y);case "-":return new D(x-y);case "*":return new D(x*y);case "/":return new D(x/y);case "%":return new D(x%y)}
        fail(`line ${line}: bad operand types for binary operator '${op}' (double)`,"CompileError")}
      if((op==="/"||op==="%")&&y===0)fail(`line ${line}: / by zero`,"ArithmeticException");
      if(lng){const r=({"+":()=>x+y,"-":()=>x-y,"*":()=>x*y,"/":()=>Math.trunc(x/y),"%":()=>x%y,"&":()=>Number(BigInt(x)&BigInt(y)),"|":()=>Number(BigInt(x)|BigInt(y)),"^":()=>Number(BigInt(x)^BigInt(y)),"<<":()=>x*2**y,">>":()=>Math.floor(x/2**y)})[op];if(!r)fail(`line ${line}: ${op} isn't supported on long values yet`,"NotSupported");return new Lg(r())}
      switch(op){
        case "+":return (x+y)|0;case "-":return (x-y)|0;case "*":return Math.imul(x,y);
        case "/":return (x/y)|0;case "%":return x%y;
        case "<<":return x<<y;case ">>":return x>>y;case ">>>":return (x>>>y)|0;case "&":return x&y;case "|":return x|y;case "^":return x^y;
      }
    }
    function arith(op,a,b,line){
      if(lang==="java")return jarith(op,a,b,line);
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
      if(lang==="java"&&!(isNum(a)&&isNum(b)))fail(`line ${line}: bad operand types for binary operator '${op}' (${jtype(a)} and ${jtype(b)})${typeof a==="string"?". Compare text with .compareTo() or .equals()":""}`,"CompileError");
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
        case "tinit":return coerce(new InitList(e.items.map(x=>ev(x,env))),e.type,e.line);
        case "cond":return truth(ev(e.c,env))?ev(e.a,env):ev(e.b,env);
        case "assign":return assignE(e,env);
        case "un":{const v=ev(e.e,env);
          if(e.op==="!"){if((lang==="cs"||lang==="java")&&typeof v!=="boolean")fail(`line ${e.line}: ! needs a true/false value`,"CompileError");return !truth(v)}
          if(e.op==="-"){if(!isNum(v))fail(`line ${e.line}: can't make ${typeOf(v)} negative`,"CompileError");return v instanceof D?new D(-v.v):v instanceof Lg?new Lg(-v.v):lang==="java"?(-nv(v))|0:-nv(v)}
          if(e.op==="~")return ~nv(v);return v}
        case "pre":case "post":{
          const lv=lval(e.e,env);if(!lv)fail(`line ${e.line}: ${e.op} needs a variable`,"CompileError");
          const old=lv.get();if(!isNum(old))fail(`line ${e.line}: can't use ${e.op} on ${typeOf(old)}`,"CompileError");
          const nw=old instanceof D?new D(old.v+(e.op==="++"?1:-1)):old instanceof Ch?new Ch(old.c+(e.op==="++"?1:-1)):old instanceof Lg?new Lg(old.v+(e.op==="++"?1:-1)):lang==="java"?(old+(e.op==="++"?1:-1))|0:old+(e.op==="++"?1:-1);
          lv.set(nw);return e.k==="pre"?nw:old}
        case "bin":{
          if(e.op==="&&"){const l=ev(e.l,env);if(!truth(l))return false;return truth(ev(e.r,env))}
          if(e.op==="||"){const l=ev(e.l,env);if(truth(l))return true;return truth(ev(e.r,env))}
          if(e.op==="??"){const l=ev(e.l,env);return l===null?ev(e.r,env):l}
          const l=ev(e.l,env);
          if(e.op==="<<"&&l===STREAM){const r=ev(e.r,env);if(r instanceof Func&&r.endl){W("\n")}else if(r&&r.manip){manip[r.manip]=true}else W(cppOut(r));return STREAM}
          if(e.op===">>"&&l&&l.cin){
            const lv=lval(e.r,env);if(!lv)fail(`line ${e.line}: cin >> needs a variable on the right`,"CompileError");
            if(l.fail)return l;const cur0=lv.get();
            if(cur0 instanceof Ch){while(inPos<IN.length&&/\s/.test(IN[inPos]))inPos++;if(inPos>=IN.length){l.fail=true;return l}echoFrom(inPos);lv.set(new Ch(IN.charCodeAt(inPos)));inPos++;return l}
            const tok=readTok();if(tok===null){l.fail=true;return l}
            if(typeof cur0==="string")lv.set(tok);
            else if(cur0 instanceof D){const v=parseFloat(tok);if(isNaN(v)){l.fail=true;lv.set(new D(0))}else lv.set(new D(v))}
            else{const m=tok.match(/^[-+]?\d+/);if(!m){l.fail=true;lv.set(0)}else lv.set(parseInt(m[0],10))}
            return l}
          const r=ev(e.r,env);
          if(e.op==="=="||e.op==="!="){
            if(lang==="java"&&l!==null&&r!==null&&(isNum(l)!==isNum(r)||(typeof l==="boolean")!==(typeof r==="boolean")||(typeof l==="string")!==(typeof r==="string")))fail(`line ${e.line}: incomparable types: ${jtype(l)} and ${jtype(r)}`,"CompileError");
            if(lang==="cs"&&(typeof l==="string")!==(typeof r==="string")&&l!==null&&r!==null)fail(`line ${e.line}: Operator '${e.op}' cannot be applied to operands of type '${typeOf(l)}' and '${typeOf(r)}'`,"CompileError");
            const q=equal(l,r);return e.op==="=="?q:!q}
          if(["<","<=",">",">="].includes(e.op))return compare(e.op,l,r,e.line);
          return arith(e.op,l,r,e.line);
        }
        case "is":{const v=ev(e.e,env);if(lang==="java"){const n=e.type.jname||e.type.name;const ok=v instanceof Obj?isA(v.cls,n)||n==="Object":v===null?false:n==="Object"||(n==="String"&&typeof v==="string")||(n==="Integer"&&typeof v==="number")||(n==="Double"&&v instanceof D);if(ok&&e.bind)env.vars.set(e.bind,new Cell(v,e.type));return ok}
          const tn=e.type.name;const ok=v instanceof Obj?isA(v.cls,tn)||tn==="object"||(v.msg!==undefined&&tn==="Exception"):v===null||v===undefined?false:tn==="object"||(tn==="int"&&typeof v==="number")||(tn==="string"&&typeof v==="string")||(tn==="double"&&v instanceof D)||(tn==="bool"&&typeof v==="boolean")||(tn==="char"&&v instanceof Ch);
          if(ok&&e.bind){env.vars.set(e.bind,new Cell(v,e.type));setSt(env,e.bind,e.type)}return ok}
        case "as":{const v=ev(e.e,env);if(!classes[e.type.name]&&e.type.name!=="string"&&e.type.name!=="object")fail(`line ${e.line}: as only works with class types (and string). Use a cast like (int)x for numbers`,"CompileError");return v instanceof Obj&&isA(v.cls,e.type.name)||e.type.name==="object"||(e.type.name==="string"&&typeof v==="string")?v:null}
        case "cast":{const v=ev(e.e,env);const t=e.type;
          if(lang==="cpp"&&classes[t.name]&&(t.ptr||t.ref)){const o=t.ptr?(v instanceof Ptr&&v.ref?v.ref.get():null):v;const ok=o instanceof Obj&&isA(o.cls,t.name);
            if(e.dyn&&!ok){if(t.ptr)return null;fail(`line ${e.line}: std::bad_cast (that object isn't a ${t.name})`,"RuntimeError")}return v}
          if(lang==="cs"&&classes[t.name]){if(v instanceof Obj&&!isA(v.cls,t.name))fail(`line ${e.line||"?"}: Unable to cast object of type '${v.cls.name}' to type '${t.name}'.`,"InvalidCastException");return v}
          if(lang==="java"&&(INT_T.has(t.name)||DBL_T.has(t.name)||t.name==="char")&&!isNum(v))fail(`line ${e.line||"?"}: incompatible types: ${jtype(v)} cannot be converted to ${jtname(t)}${typeof v==="string"?". Use Integer.parseInt() to turn text into a number":""}`,"CompileError");
          if(lang==="java"&&t.name==="long")return new Lg(Math.trunc(nv(v)));
          if(lang==="java"&&INT_T.has(t.name)){const x=nv(v);if(v instanceof D){if(isNaN(x))return 0;if(x>=2147483647)return 2147483647;if(x<=-2147483648)return -2147483648;return Math.trunc(x)}return x|0}
          if(INT_T.has(t.name)){if(typeof v==="string")fail(`line ${e.line||"?"}: can't cast text to a number. Use int.Parse()`,"CompileError");return Math.trunc(nv(v))}
          if(DBL_T.has(t.name))return new D(nv(v));
          if(t.name==="char")return new Ch(nv(v)&0xffff);if(t.name==="bool")return !!nv(v);if(t.name==="string")return str(v);
          if(lang==="java"&&classes[t.name]&&v instanceof Obj&&!isA(v.cls,t.name))fail(`line ${e.line||"?"}: class ${v.cls.name} cannot be cast to class ${t.name}`,"ClassCastException");return v}
        case "addr":{const lv=lval(e.e,env);if(!lv)fail(`line ${e.line}: & needs a variable to take the address of`,"CompileError");return new Ptr(lv)}
        case "deref":{const pv=ev(e.e,env);if(pv===null)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");if(!(pv instanceof Ptr))fail(`line ${e.line}: * needs a pointer`,"CompileError");if(!pv.ref)fail(`line ${e.line}: crash! You used * on a null pointer (nullptr). Always check a pointer before using it.`,"RuntimeError");return pv.ref.get()}
        case "index":{if(lang==="cs"&&(e.e.k==="name"||e.e.k==="member")){const b0=ev(e.e,env);if(typeof b0==="string"){const i=nv(ev(e.i,env));if(i<0||i>=b0.length)fail(`line ${e.line}: Index was outside the bounds of the array.`,"IndexOutOfRangeException");return new Ch(b0.charCodeAt(i))}}const lv=lval(e,env);return lv.get()}
        case "member":return memberGet(e,env);
        case "call":return call(e,env);
        case "new":return newE(e,env);
        case "newarr":{
          const et=e.type;let items;
          if(e.items)items=e.items.map(x=>coerce(ev(x,env),et,e.line));
          else if(e.dims&&e.dims.length>1){const ds=e.dims.map(d=>d===null?null:nv(ev(d,env)));const mk=k=>{const n=ds[k];if(n<0)fail(`line ${e.line}: ${n}`,"NegativeArraySizeException");const et2={...et,arr:ds.length-k-1};return new Arr("array",Array.from({length:n},()=>k+1<ds.length?(ds[k+1]===null?null:mk(k+1)):defaultFor(et)),et2)};return mk(0)}
          else{const n=nv(ev(e.len,env));if(n<0)fail(`line ${e.line}: ${n}`,lang==="java"?"NegativeArraySizeException":"RuntimeError");items=Array.from({length:n},()=>defaultFor(et))}
          const a=new Arr("array",items,et);return lang==="cpp"?new Ptr(new LV(()=>a,()=>{})):a}
        case "lambda":return new Func({params:e.params,body:e.body,closure:env,lambda:true});
        case "switchx":{try{runSwitch(e,env)}catch(x){if(x instanceof Yield)return x.v;throw x}fail(`line ${e.line}: the switch expression does not have any result value for this input`,"CompileError")}
      }
      fail("unsupported expression","NotSupported");
    }
    const manip={};
    function cppOut(v){if(typeof v==="boolean"&&manip.boolalpha)return v?"true":"false";if(v instanceof D&&manip.fixed)return v.v.toFixed(manip.prec??6);if(v instanceof D&&manip.prec)return fmtG(v.v,manip.prec);return str(v)}
    function nameVal(e,env){
      const c=env.find(e.v);
      if(c){if(c instanceof Func)return c;return c.get()}
      if(env.self&&e.v in env.self.f)return env.self.f[e.v];
      if(env.self&&lang!=="java"){const pm=findDecl(env.cls||env.self.cls,e.v)||findDecl(env.self.cls,e.v);if(pm&&pm.isProp)return invoke(boundM(env.self,dispatch(env.self,e.v,env.cls)||pm),[],e.line)}
      else if(env.self&&env.self.cls.methods[e.v]&&env.self.cls.methods[e.v].isProp)return callMethod(env.self,e.v,[],e.line);
      if(env.cls){let sc=classes[env.cls.name];
        if(lang==="java"){for(let c=sc;c;c=c.sup)if(c.staticVals&&e.v in c.staticVals)return c.staticVals[e.v];const m=env.self?findMethod(env.self.cls,e.v):findMethod(sc,e.v);if(m)return new Func({method:m,self:env.self,cls:env.self?env.self.cls:sc})}
        else{for(let c=sc;c;c=c.sup)if(c.staticVals&&e.v in c.staticVals)return c.staticVals[e.v];
          const m0=findDecl(sc,e.v);if(m0){const m=env.self&&!m0.isStatic?dispatch(env.self,e.v,sc)||m0:m0;return boundM(m.isStatic?null:env.self,m,sc)}}}
      if(funcs[e.v])return funcs[e.v];
      if(lang==="java"&&env.self&&["getClass","toString","hashCode","equals"].includes(e.v)){const o=env.self;return new Func({builtin:(...a)=>javaMethod(o,e.v,a,e.line,null,env)})}
      if(classes[e.v])return {isClass:true,cls:classes[e.v]};
      const b=BUILTIN[e.v];if(b!==undefined)return b;
      notDeclared(e.v,e.line);
    }
    function assignE(e,env){
      const lv=lval(e.l,env);if(!lv)fail(`line ${e.line}: the left side of ${e.op} must be a variable`,"CompileError");
      let r=e.r.k==="init"?new InitList(e.r.items.map(x=>ev(x,env))):ev(e.r,env);
      const type=lv instanceof Cell||lv.type?lv.type:null;
      if(e.op!=="="){const cur=lv.get();r=arith(e.op.slice(0,-1),cur,r,e.line);
        if(lang==="java"&&type){if(type.name==="long"&&isNum(r))r=new Lg(Math.trunc(nv(r)));else if(INT_T.has(type.name)&&isNum(r))r=Math.trunc(nv(r))|0;else if(type.name==="char"&&isNum(r))r=new Ch(Math.trunc(nv(r))&0xffff);else if(DBL_T.has(type.name)&&isNum(r))r=new D(nv(r))}
        else if(type&&INT_T.has(type.name)&&r instanceof D)r=Math.trunc(r.v)}
      if(e.op==="="&&type&&type.ptr===0&&type.arr===0)r=coerce(r,type,e.line);
      else if(e.op==="="&&lang==="cpp"&&(r instanceof Obj||r instanceof Arr))r=copy(r);
      else if(e.op==="="&&lv instanceof Cell&&lv.v instanceof D&&isNum(r))r=new D(nv(r));
      if(r instanceof InitList)r=new Arr(lang==="cpp"?"vector":"array",r.items,null);
      lv.set(r);return r;
    }
    function jnewE(e,env,t){
      const av=e.args.map(a=>ev(a,env));
      if(t.name==="List"){if(t.jname==="List")fail(`line ${e.line}: List is abstract; cannot be instantiated. Use new ArrayList<>()`,"CompileError");const a=new Arr("list",[],t.args[0]);if(av.length&&!isNum(av[0]))a.items=[...iterate(av[0],e.line)];return a}
      if(t.name==="Dictionary"){if(t.jname==="Map")fail(`line ${e.line}: Map is abstract; cannot be instantiated. Use new HashMap<>()`,"CompileError");const d=new Dict();d.jk=t.jname||"HashMap";d.kt=t.args[0];d.vt=t.args[1];d.maxSize=0;
        if(av.length&&av[0] instanceof Dict){const n=av[0].m.size;d.cap0=tableSizeFor(Math.floor(n/0.75+1));for(const [k,v] of jentries(av[0]))jput(d,k,v)}return d}
      if(t.name==="HashSet"){if(t.jname==="Set")fail(`line ${e.line}: Set is abstract; cannot be instantiated. Use new HashSet<>()`,"CompileError");const d=new Dict();d.isSet=true;d.jk=(t.jname||"HashSet").replace("Set","Map");d.kt=t.args[0];d.maxSize=0;
        if(av.length&&!isNum(av[0])){const items=[...iterate(av[0],e.line)];d.cap0=tableSizeFor(Math.max(Math.floor(items.length/0.75)+1,16));for(const x of items)jput(d,x,true)}return d}
      if(t.name==="StringBuilder")return {sb:true,s:av.length&&!isNum(av[0])?str(av[0]):""};
      if(t.name==="Random")return {random:true};
      if(t.name==="Scanner")return {scanner:true};
      if(t.name==="string")return av.length?(av[0] instanceof Arr?av[0].items.map(str).join(""):str(av[0])):"";
      if(t.name==="object")return new Obj({name:"Object",methods:Object.create(null),fields:[]});
      if(JEXC(t.name)){const o=new Obj({name:t.name,methods:Object.create(null),fields:[],excChain:true});o.msg=av.length?(av[0]===null?null:str(av[0])):null;return o}
      if(BASE_T.has(t.name)||["Integer","Double"].includes(t.jname))fail(`line ${e.line}: you don't need new for a ${jtname(t)}. Just write the value, like int n = 5;`,"CompileError");
      fail(`line ${e.line}: TypeMonkey's runner doesn't know how to make a new ${t.jname||t.name} yet`,"NotSupported");
    }
    function tableSizeFor(c){let n=1;while(n<c)n*=2;return Math.max(n,1)}
    function newE(e,env){
      const t=e.type;
      if(lang==="java"&&!classes[t.name])return jnewE(e,env,t);
      if(classes[t.name]){const cls=classes[t.name];const o=construct(cls,e.args.map(a=>ev(a,env)),e.line,e.init,env);return lang==="cpp"?new Ptr(new LV(()=>o,()=>{})):o}
      if(t.name==="List"||t.name==="HashSet"||t.name==="vector"){const a=new Arr(t.name==="vector"?"vector":"list",[],t.args[0]);
        if(e.args.length===1&&!(isNum(ev(e.args[0],env))))a.items=[...iterate(ev(e.args[0],env),e.line)];
        if(e.init)for(const it of e.init)a.items.push(coerce(ev(it.val,env),t.args[0],e.line));if(t.name==="HashSet")a.items=a.items.filter((x,i)=>a.items.findIndex(y=>equal(x,y))===i);return a}
      if(t.name==="Dictionary"||t.name==="map"||t.name==="unordered_map"){const d=new Dict();d.kt=t.args[0];d.vt=t.args[1];d.sorted=lang==="cpp"&&t.name==="map";if(e.init)for(const it of e.init){if(!it.key)fail(`line ${e.line}: use ["key"] = value or { "key", value } in a dictionary initializer`,"SyntaxError");const k=ev(it.key,env);d.m.set(dkey(k),[k,coerce(ev(it.val,env),t.args[1],e.line)])}return d}
      if(t.name==="Random")return {random:true};
      if(t.name==="Exception")return new Obj({name:"Exception",fields:[],methods:{},ctors:[]}).f?Object.assign(new Obj({name:"Exception",fields:[],methods:Object.create(null),ctors:[]}),{msg:e.args.length?str(ev(e.args[0],env)):"Exception of type 'System.Exception' was thrown."}):null;
      if(t.name==="string")return e.args.length===2?str(ev(e.args[1],env)).repeat(nv(ev(e.args[0],env))):"";
      if(BASE_T.has(t.name)&&lang==="cpp"){const v=e.args.length?coerce(ev(e.args[0],env),t,e.line):defaultFor(t);const c=new Cell(v,t);return new Ptr(c)}
      fail(`line ${e.line}: TypeMonkey's runner doesn't know how to make a new ${t.name} yet`,"NotSupported");
    }
    function* iterate(v,line){
      if(lang==="java"){if(v===null)fail(`line ${line}: Cannot iterate because the value is null`,"NullPointerException");
        if(v instanceof Dict){if(v.isSet){yield* jkeys(v);return}fail(`line ${line}: for-each not applicable to a Map. Loop over map.keySet(), map.values() or map.entrySet()`,"CompileError")}
        if(typeof v==="string")fail(`line ${line}: for-each not applicable to a String. Use s.toCharArray()`,"CompileError")}
      if(v instanceof Arr){for(let i=0;i<v.items.length;i++)yield v.items[i];return}
      if(v instanceof Dict){const es=[...v.m.values()];if(v.sorted)es.sort((x,y)=>cmpVals(x[0],y[0]));for(const x of es)yield new KV(x[0],x[1]);return}
      if(typeof v==="string"){for(const ch of v)yield new Ch(ch.codePointAt(0));return}
      if(v&&v.keysOf){yield* v.keysOf;return}
      fail(`line ${line}: you can only loop over a list, array, vector, dictionary or string`,"CompileError");
    }

    /* member access */
    function memberGet(e,env){
      if(lang==="java"&&e.e.k==="name"&&e.e.v==="super"){const sup=env.cls&&classes[env.cls.name].sup;const m=sup&&findMethod(sup,e.name);if(!m)fail(`line ${e.line}: the parent class has no method ${e.name}`,"CompileError");return new Func({method:m,self:env.self,cls:sup})}
      if(lang==="cs"&&e.e.k==="name"&&e.e.v==="base"&&!env.find("base")){
        const sup=env.cls&&env.cls.sup;if(!sup||!env.self)fail(`line ${e.line}: base.${e.name} only works inside a class that inherits from another class (class Dog : Animal)`,"CompileError");
        const m=findDecl(sup,e.name);
        if(!m){if(e.name in env.self.f)return env.self.f[e.name];fail(`line ${e.line}: '${sup.name}' does not contain a definition for '${e.name}'`,"CompileError")}
        if(ovs(m).every(x=>x.isAbstract))fail(`line ${e.line}: Cannot call an abstract base member: '${sup.name}.${e.name}()'`,"CompileError");
        if(m.isProp)return invoke(boundM(env.self,m,sup),[],e.line);
        return boundM(env.self,m,sup)}
      const base=e.arrow?derefVal(ev(e.e,env),e.line):ev(e.e,env);
      const n=e.name;
      if(lang==="java")return jmemberGet(base,n,e,env);
      if(base===null)fail(`line ${e.line}: ${lang==="cs"?"Object reference not set to an instance of an object (it's null).":"crash! that pointer is null."}`,lang==="cs"?"NullReferenceException":"RuntimeError");
      if(base&&base.msg!==undefined&&(n==="Message"||n==="what"))return n==="what"?new Func({builtin:()=>base.msg}):base.msg;
      if(base instanceof Obj){
        if(n in base.f)return base.f[n];
        const m=dispatch(base,n,staticCls(e.e,env));if(m){if(m.isProp)return invoke(boundM(base,m),[],e.line);return boundM(base,m)}
        fail(`line ${e.line}: '${base.cls.name}' does not have a member named '${n}'`,"CompileError");
      }
      if(base&&base.isClass){for(let k=base.cls;k;k=k.sup){const st=k.staticVals;if(st&&n in st)return st[n]}const m=findDecl(base.cls,n);
        if(m){if(lang==="cpp"&&!m.isStatic&&env.self&&isA(env.self.cls,base.cls.name))return boundM(env.self,m,base.cls);  // Animal::speak() from inside Dog
          return new Func({method:m,self:null,cls:classes[m.owner]||base.cls})}fail(`line ${e.line}: '${base.cls.name}' does not have a static member named '${n}'`,"CompileError")}
      if(typeof base==="string"){
        if(n==="Length"&&lang==="cs")return [...base].length;
        if(n==="length"||n==="size")return new Func({builtin:()=>base.length,bound:true});
      }
      if(base instanceof Arr){
        if(n==="Length"&&base.kind==="array")return base.items.length;
        if(n==="Count"&&base.kind==="list"&&!e.isCall)return base.items.length;
        if((n==="Length"||n==="Count")&&lang==="cs"&&!e.isCall)fail(`line ${e.line}: ${base.kind==="array"?"arrays use .Length":"Lists use .Count"}, not .${n}`,"CompileError");
      }
      if(base instanceof Dict){if(n==="Count")return base.m.size;if(n==="Keys")return new Arr("list",[...base.m.values()].map(x=>x[0]),base.kt);if(n==="Values")return new Arr("list",[...base.m.values()].map(x=>x[1]),base.vt)}
      if(base instanceof KV){if(n==="Key"||n==="first")return base.k;if(n==="Value"||n==="second")return base.v}
      if(base&&base.msg!==undefined&&n==="Message")return base.msg;
      if(base&&base.ns){const v=base.ns[n];if(v!==undefined)return v}
      return new Func({builtin:(...a)=>builtinMethod(base,n,a,e.line,e.e,env),bound:true,name:n});
    }
    function jmemberGet(base,n,e,env){
      if(base===null||base===undefined){const who=e.e.k==="name"?`"${e.e.v}"`:"the value";fail(`line ${e.line}: ${e.isCall?`Cannot invoke "${n}()"`:`Cannot read field "${n}"`} because ${who} is null`,"NullPointerException")}
      if(base instanceof Obj){
        if(base.msg!==undefined&&(n==="getMessage"||n==="toString"&&!findMethod(base.cls,"toString")))return new Func({builtin:()=>n==="getMessage"?base.msg:jstr(base)});
        if(n in base.f)return base.f[n];
        const m=findMethod(base.cls,n);if(m)return new Func({method:m,self:base,cls:base.cls});
      }
      if(base&&base.isClass){const c=base.cls;
        if(c.isEnum){if(n==="values")return new Func({builtin:()=>new Arr("array",[...c.enumVals],{name:c.name})});if(n==="valueOf")return new Func({builtin:x=>{const v=c.enumVals.find(o=>o.ev.name===x);if(!v)fail(`No enum constant ${c.name}.${x}`,"IllegalArgumentException");return v}})}
        for(let k=c;k;k=k.sup){const st=k.staticVals;if(st&&n in st)return st[n]}
        const m=findMethod(c,n);if(m){if(!m.isStatic&&!(m.overloads||[]).some(x=>x.isStatic))fail(`line ${e.line}: non-static method ${n}() cannot be referenced from a static context. Make an object first with new ${c.name}(...)`,"CompileError");return new Func({method:m,self:null,cls:c})}
        fail(`line ${e.line}: cannot find symbol: ${c.name}.${n}`,"CompileError")}
      if(base instanceof Arr&&base.kind==="array"&&n==="length")return base.items.length;
      if(base&&base.ns){const v=base.ns[n];if(v!==undefined)return v;fail(`line ${e.line}: cannot find symbol: ${n}`,"CompileError")}
      if(base instanceof Obj&&!["equals","hashCode","toString","getClass","compareTo","name","ordinal"].includes(n))fail(`line ${e.line}: cannot find symbol: ${n} in class ${base.cls.name}`,"CompileError");
      return new Func({builtin:(...a)=>javaMethod(base,n,a,e.line,e.e,env),bound:true,name:n});
    }
    function callMethod(o,name,args,line){if(lang==="java")return invoke({method:findMethod(o.cls,name),self:o,cls:o.cls},args,line);const m=findDecl(o.cls,name);return invoke(boundM(o,m),args,line)}

    /* calls */
    function call(e,env){
      if(lang==="cpp"&&e.f.k==="name"&&e.f.v==="getline"&&e.args.length>=2){const c=ev(e.args[0],env);const lv=lval(e.args[1],env);if(c.fail)return c;const line=readLineIn();if(line===null){c.fail=true;return c}lv.set(line);return c}
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
      if(f.k==="member")f.isCall=true;
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
        let m=fn.method;if(m.overloads)m=pickOverload(m.overloads,argVals.length,argVals)||m;
        if(lang==="java"){if(m.isAbstract)fail(`line ${line}: ${m.name}() has no body here (it's abstract)`,"CompileError");if(fn.self&&!m.isStatic&&fn.self.cls!==fn.cls&&fn.cls&&fn.cls.methods[m.name]!==fn.method){}}
        if(lang!=="java"&&!m.body)fail(`line ${line}: ${m.name} is abstract, so it has no body to run`,"CompileError");
        const fenv=new Env(globalEnv);fenv.self=fn.self;fenv.cls=m.owner&&classes[m.owner]?classes[m.owner]:fn.cls;
        if(lang==="java"&&!fn.self&&!m.isStatic&&m.owner)fail(`line ${line}: non-static method ${m.name}() cannot be referenced from a static context`,"CompileError");
        if(m.params.length!==argVals.length&&!(argVals.length<m.params.length&&m.params.slice(argVals.length).every(p=>p.def)))fail(`line ${line}: ${m.name} needs ${m.params.length} argument(s) but got ${argVals.length}`,"CompileError");
        bindParams(m.params,argVals,fenv,line,refs);
        depth++;if(depth>2000){depth=0;fail(lang==="java"?"(a method keeps calling itself. Check your stopping case.)":`line ${line}: too much recursion (a method keeps calling itself). Check your stopping case.`,lang==="cs"?"StackOverflowException":lang==="java"?"StackOverflowError":"RuntimeError")}
        try{const r=execBody(m.body,fenv);return m.ret&&m.ret.name!=="void"?coerce(r,m.ret,line):r}finally{depth--}
      }
      if(fn.overloads){const pick=pickOverload(fn.overloads,argVals.length,argVals);if(pick&&pick!==fn)return invoke(pick,argVals,line,refs)}
      const fenv=new Env(fn.closure||globalEnv);
      if(fn.closure&&fn.closure.self)fenv.self=fn.closure.self;
      if(!fn.lambda&&fn.params.length!==argVals.length&&!(argVals.length<fn.params.length&&fn.params.slice(argVals.length).every(p=>p.def)))fail(`line ${line}: ${fn.name} needs ${fn.params.length} argument(s) but got ${argVals.length}`,"CompileError");
      bindParams(fn.params,argVals,fenv,line,refs);
      depth++;if(depth>2000){depth=0;fail(lang==="java"?"(a method keeps calling itself. Check your stopping case.)":`line ${line}: too much recursion (a function keeps calling itself). Check your stopping case.`,lang==="cs"?"StackOverflowException":lang==="java"?"StackOverflowError":"RuntimeError")}
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
          case "emplace_back":if(T&&!T.ptr&&classes[T.name]&&!(a.length===1&&a[0] instanceof Obj)){it.push(construct(classes[T.name],a,line));return null}
          case "Add":case "push_back":if(base.kind==="array")fail(`line ${line}: arrays can't grow. Use a List<T> instead.`,"CompileError");if(lang==="cs"&&T&&typeof a[0]==="string"&&INT_T.has(T.name))fail(`line ${line}: Argument 1: cannot convert from 'string' to '${T.name}'`,"CompileError");it.push(C(a[0]));return null;
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
          case "Max":case "Min":case "Average":{const xs=a[0]&&lang==="cs"?it.map(x=>invoke(a[0],[x],line)):it;if(!xs.length&&lang==="cs")fail(`line ${line}: Sequence contains no elements`,"InvalidOperationException");
            if(n==="Average")return new D(xs.reduce((s,x)=>s+nv(x),0)/xs.length);return xs.reduce((m,x)=>compare(n==="Max"?">":"<",x,m,line)?x:m)}
          case "Count":if(a[0])return it.filter(x=>truth(invoke(a[0],[x],line))).length;return it.length;
          case "Exists":case "Any":return a[0]?it.some(x=>truth(invoke(a[0],[x],line))):it.length>0;
          case "Find":{const r=it.find(x=>truth(invoke(a[0],[x],line)));return r===undefined?defaultFor(T):r}
          case "FindAll":case "Where":return new Arr("list",it.filter(x=>truth(invoke(a[0],[x],line))),T);
          case "ForEach":it.forEach(x=>invoke(a[0],[x],line));return null;
          case "OrderBy":case "OrderByDescending":{const key=x=>a[0]?invoke(a[0],[x],line):x;const sg=n==="OrderBy"?1:-1;const r=[...it].sort((x,y)=>sg*cmpVals(key(x),key(y)));return new Arr("list",r,T)}
          case "First":case "Last":{const r=a[0]?it.filter(x=>truth(invoke(a[0],[x],line))):it;if(!r.length)fail(`line ${line}: Sequence contains no matching element`,"InvalidOperationException");return n==="First"?r[0]:r[r.length-1]}
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
        ReadLine:B(()=>readLineIn()),
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
      cin:{cin:true,fail:false},
      getline:B(()=>fail("getline needs a variable: getline(std::cin, line)","CompileError")),
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
      toupper:B(c=>String.fromCodePoint(nv(c)).toUpperCase().codePointAt(0)),tolower:B(c=>String.fromCodePoint(nv(c)).toLowerCase().codePointAt(0)),
      isdigit:B(c=>/[0-9]/.test(String.fromCodePoint(nv(c)))?1:0),isalpha:B(c=>/[A-Za-z]/.test(String.fromCodePoint(nv(c)))?1:0),
      isalnum:B(c=>/[A-Za-z0-9]/.test(String.fromCodePoint(nv(c)))?1:0),isupper:B(c=>/[A-Z]/.test(String.fromCodePoint(nv(c)))?1:0),
      islower:B(c=>/[a-z]/.test(String.fromCodePoint(nv(c)))?1:0),isspace:B(c=>/\s/.test(String.fromCodePoint(nv(c)))?1:0),
      Exception:{isClass:true,cls:{name:"Exception",methods:Object.create(null),staticVals:{}}},
    };


    /* ---------- Java library methods ---------- */
    const UNSUP=()=>fail("","UnsupportedOperationException");
    const boxedArg={v:null,t:-1};
    function jidx(i,len,line,kind){if(typeof i!=="number"||i<0||i>=len)fail(`line ${line}: Index ${nv(i)} out of bounds for length ${len}`,kind||"IndexOutOfBoundsException")}
    function jre(r){try{return new RegExp(str(r).replace(/\\p\{Punct\}/g,"[!-\\/:-@\\[-`{-~]").replace(/\(\?<([a-zA-Z])/g,"(?<$1"),"g")}catch(x){fail(`bad regular expression: ${str(r)}`,"PatternSyntaxException")}}
    function jeq(a,b){if(a instanceof Obj&&b instanceof Obj){const m=findMethod(a.cls,"equals");if(m)return truth(invoke({method:m,self:a,cls:a.cls},[b],0));return a===b}
      if(a instanceof Arr&&b instanceof Arr&&a.kind!=="array"&&b.kind!=="array")return a.items.length===b.items.length&&a.items.every((x,i)=>jeq(x,b.items[i]));
      if(a instanceof Dict&&b instanceof Dict)return a.m.size===b.m.size&&[...a.m.entries()].every(([k,x])=>b.m.has(k)&&jeq(x[1],b.m.get(k)[1]));
      if(isNum(a)&&isNum(b))return (a instanceof D)===(b instanceof D)&&nv(a)===nv(b);
      return a===b}
    function jsortCmp(cmp,line){return cmp instanceof Func?(x,y)=>nv(invoke(cmp,[x,y],line)):(x,y)=>jcmp(x,y)}
    function javaMethod(base,n,a,line,baseExpr,env){
      const A0=a[0];
      if(n==="equals"&&a.length===1&&!(base&&base.sb))return jeq(base,A0);
      if(n==="hashCode"&&!a.length)return jhash(base);
      if(n==="toString"&&!a.length&&!(base&&base.sb))return jstr(base);
      if(n==="getClass"){const nm=typeof base==="string"?"String":jtype(base);return {ns:{getSimpleName:B(()=>nm),getName:B(()=>base instanceof Obj?nm:"java.lang."+nm)}}}
      if(typeof base==="string"){
        const s=base,L=s.length;
        const sarg=x=>x instanceof Ch?String.fromCharCode(x.c):x===null?fail(`line ${line}: argument is null`,"NullPointerException"):str(x);
        switch(n){
          case "length":return L;
          case "charAt":{const i=nv(A0);if(i<0||i>=L)fail(`line ${line}: Index ${i} out of bounds for length ${L}`,"StringIndexOutOfBoundsException");return new Ch(s.charCodeAt(i))}
          case "substring":{const b=nv(A0),en=a.length>1?nv(a[1]):L;if(b<0||en>L||b>en)fail(`line ${line}: begin ${b}, end ${en}, length ${L}`,"StringIndexOutOfBoundsException");return s.slice(b,en)}
          case "indexOf":return s.indexOf(sarg(A0),a.length>1?nv(a[1]):0);
          case "lastIndexOf":return s.lastIndexOf(sarg(A0));
          case "contains":return s.includes(sarg(A0));
          case "toUpperCase":return s.toUpperCase();case "toLowerCase":return s.toLowerCase();
          case "equalsIgnoreCase":return typeof A0==="string"&&s.toLowerCase()===A0.toLowerCase();
          case "isEmpty":return L===0;case "isBlank":return s.trim()==="";
          case "trim":return s.replace(/^[\x00-\x20]+|[\x00-\x20]+$/g,"");case "strip":return s.trim();
          case "replace":return s.split(sarg(A0)).join(sarg(a[1]));
          case "replaceAll":return s.replace(jre(A0),str(a[1]));
          case "replaceFirst":{const r=jre(A0);return s.replace(new RegExp(r.source),str(a[1]))}
          case "matches":return new RegExp("^(?:"+jre(A0).source+")$").test(s);
          case "split":{let parts;const sep=str(A0);if(sep==="")parts=[...s];else parts=s.split(jre(sep));if(a.length>1&&nv(a[1])>0){const lim=nv(a[1]);const all=s.split(jre(sep));parts=[];let rest=s;const re=jre(sep);let m,last=0,cnt=0;re.lastIndex=0;while(cnt<lim-1&&(m=re.exec(s))){parts.push(s.slice(last,m.index));last=m.index+m[0].length;cnt++;if(!m[0].length)re.lastIndex++}parts.push(s.slice(last))}else{while(parts.length>1&&parts[parts.length-1]==="")parts.pop();if(L===0)parts=[""];if(parts.length>1&&parts[0]===""&&sep!==""&&new RegExp("^(?:"+jre(sep).source+")").exec(s)?.[0]==="")parts.shift()}
            return new Arr("array",parts,{name:"string",jname:"String"})}
          case "startsWith":return s.startsWith(sarg(A0),a.length>1?nv(a[1]):0);case "endsWith":return s.endsWith(sarg(A0));
          case "compareTo":return jcmp(s,str(A0));case "compareToIgnoreCase":return jcmp(s.toLowerCase(),str(A0).toLowerCase());
          case "repeat":{const k=nv(A0);if(k<0)fail(`line ${line}: count is negative: ${k}`,"IllegalArgumentException");return s.repeat(k)}
          case "toCharArray":return new Arr("array",[...s].flatMap(c=>c.length>1?[...c].map(x=>x):[c]).map(c=>new Ch(c.charCodeAt(0))),{name:"char"});
          case "chars":fail("streams (.chars()) aren't supported in TypeMonkey's runner yet. Loop over s.toCharArray() instead","NotSupported");
          case "concat":return s+str(A0);
          case "intern":return s;
          case "format":case "formatted":return jformat(s,a);
        }
        fail(`line ${line}: cannot find symbol: method ${n}() on a String`,"CompileError");
      }
      if(base&&base.sb){
        switch(n){
          case "append":base.s+=str(A0);return base;
          case "toString":return base.s;case "length":return base.s.length;
          case "reverse":base.s=[...base.s].reverse().join("");return base;
          case "insert":base.s=base.s.slice(0,nv(A0))+str(a[1])+base.s.slice(nv(A0));return base;
          case "charAt":{const i=nv(A0);if(i<0||i>=base.s.length)fail(`line ${line}: index ${i},length ${base.s.length}`,"StringIndexOutOfBoundsException");return new Ch(base.s.charCodeAt(i))}
          case "setCharAt":{const i=nv(A0);base.s=base.s.slice(0,i)+str(a[1])+base.s.slice(i+1);return null}
          case "deleteCharAt":{const i=nv(A0);if(i<0||i>=base.s.length)fail(`line ${line}: index ${i},length ${base.s.length}`,"StringIndexOutOfBoundsException");base.s=base.s.slice(0,i)+base.s.slice(i+1);return base}
          case "delete":base.s=base.s.slice(0,nv(A0))+base.s.slice(Math.min(nv(a[1]),base.s.length));return base;
          case "indexOf":return base.s.indexOf(str(A0));
          case "isEmpty":return base.s.length===0;
          case "setLength":base.s=base.s.slice(0,nv(A0)).padEnd(nv(A0),"\0");return null;
          case "equals":return base===A0;
        }
      }
      if(base instanceof Arr&&base.kind!=="array"){
        const it=base.items;const T=base.elem;const C=v=>T?coerce(v,T,line):v;
        const mut=()=>{if(base.immutable)UNSUP()};const grow=()=>{if(base.immutable||base.fixed)UNSUP()};
        switch(n){
          case "add":grow();if(a.length===2){const i=nv(A0);if(i<0||i>it.length)fail(`line ${line}: Index: ${i}, Size: ${it.length}`,"IndexOutOfBoundsException");it.splice(i,0,C(a[1]));return null}it.push(C(A0));return true;
          case "addAll":grow();{const src=[...iterate(A0,line)];it.push(...src);return src.length>0}
          case "get":jidx(A0,it.length,line);return it[A0];
          case "set":{mut();jidx(A0,it.length,line);const old=it[A0];it[A0]=C(a[1]);return old}
          case "size":return it.length;
          case "isEmpty":return it.length===0;
          case "contains":return it.some(x=>jeq(x,A0));
          case "indexOf":return it.findIndex(x=>jeq(x,A0));
          case "lastIndexOf":{for(let i=it.length-1;i>=0;i--)if(jeq(it[i],A0))return i;return -1}
          case "remove":grow();if(typeof A0==="number"&&!(boxedArg.v===A0&&boxedArg.t===steps)){jidx(A0,it.length,line);return it.splice(A0,1)[0]}{const i=it.findIndex(x=>jeq(x,A0));if(i>=0){it.splice(i,1);return true}return false}
          case "removeIf":{grow();const before=it.length;const keep=it.filter(x=>!truth(invoke(A0,[x],line)));it.length=0;it.push(...keep);return keep.length!==before}
          case "removeAll":{grow();const rm=[...iterate(A0,line)];const keep=it.filter(x=>!rm.some(y=>jeq(x,y)));const ch=keep.length!==it.length;it.length=0;it.push(...keep);return ch}
          case "retainAll":{grow();const ks=[...iterate(A0,line)];const keep=it.filter(x=>ks.some(y=>jeq(x,y)));const ch=keep.length!==it.length;it.length=0;it.push(...keep);return ch}
          case "clear":grow();it.length=0;return null;
          case "sort":mut();it.sort(jsortCmp(A0,line));return null;
          case "forEach":it.forEach(x=>invoke(A0,[x],line));return null;
          case "replaceAll":mut();for(let i=0;i<it.length;i++)it[i]=invoke(A0,[it[i]],line);return null;
          case "subList":{const b=nv(A0),en=nv(a[1]);if(b<0||en>it.length||b>en)fail(`line ${line}: fromIndex ${b}, toIndex ${en}, size ${it.length}`,"IndexOutOfBoundsException");return new Arr("list",it.slice(b,en),T)}
          case "getFirst":if(!it.length)fail("","NoSuchElementException");return it[0];
          case "getLast":if(!it.length)fail("","NoSuchElementException");return it[it.length-1];
          case "reversed":return new Arr("list",[...it].reverse(),T);
          case "containsAll":return [...iterate(A0,line)].every(y=>it.some(x=>jeq(x,y)));
          case "toArray":return new Arr("array",[...it],T);
          case "stream":fail("streams (.stream()) aren't supported in TypeMonkey's runner yet. Use a for-each loop instead","NotSupported");
          case "iterator":fail("iterators aren't supported in TypeMonkey's runner yet. Use a for-each loop or removeIf instead","NotSupported");
        }
        fail(`line ${line}: cannot find symbol: method ${n}() on a List`,"CompileError");
      }
      if(base instanceof Arr&&base.kind==="array"){
        if(n==="clone")return new Arr("array",[...base.items],base.elem);
        if(n==="length")fail(`line ${line}: arrays use .length without ( ). Write arr.length`,"CompileError");
        fail(`line ${line}: cannot find symbol: method ${n}() on an array`,"CompileError");
      }
      if(base instanceof Dict&&base.isSet){
        const has=x=>base.m.has(dkey(x));
        switch(n){
          case "add":if(base.immutable)UNSUP();if(has(A0))return false;jput(base,A0,true);return true;
          case "addAll":{let ch=false;for(const x of iterate(A0,line))if(!has(x)){jput(base,x,true);ch=true}return ch}
          case "contains":return has(A0);
          case "remove":if(base.immutable)UNSUP();return base.m.delete(dkey(A0));
          case "size":return base.m.size;case "isEmpty":return base.m.size===0;
          case "clear":base.m.clear();return null;
          case "containsAll":return [...iterate(A0,line)].every(has);
          case "removeAll":{let ch=false;for(const x of iterate(A0,line))if(base.m.delete(dkey(x)))ch=true;return ch}
          case "retainAll":{const ks=new Set([...iterate(A0,line)].map(dkey));let ch=false;for(const k of [...base.m.keys()])if(!ks.has(k)){base.m.delete(k);ch=true}return ch}
          case "forEach":jkeys(base).forEach(x=>invoke(A0,[x],line));return null;
          case "removeIf":{let ch=false;for(const x of jkeys(base))if(truth(invoke(A0,[x],line))){base.m.delete(dkey(x));ch=true}return ch}
          case "first":{const k=jkeys(base);if(!k.length)fail("","NoSuchElementException");return k[0]}
          case "last":{const k=jkeys(base);if(!k.length)fail("","NoSuchElementException");return k[k.length-1]}
          case "stream":fail("streams (.stream()) aren't supported in TypeMonkey's runner yet. Use a for-each loop instead","NotSupported");
        }
        fail(`line ${line}: cannot find symbol: method ${n}() on a Set`,"CompileError");
      }
      if(base instanceof Dict){
        const k=dkey(A0);const V=base.vt;
        switch(n){
          case "put":if(base.immutable)UNSUP();return jput(base,A0,V?coerce(a[1],V,line):a[1]);
          case "get":return base.m.has(k)?base.m.get(k)[1]:null;
          case "getOrDefault":return base.m.has(k)?base.m.get(k)[1]:a[1];
          case "containsKey":return base.m.has(k);
          case "containsValue":return [...base.m.values()].some(x=>jeq(x[1],A0));
          case "remove":{if(base.immutable)UNSUP();const had=base.m.get(k);base.m.delete(k);return had?had[1]:null}
          case "size":return base.m.size;case "isEmpty":return base.m.size===0;
          case "clear":base.m.clear();return null;
          case "putIfAbsent":{if(base.m.has(k)&&base.m.get(k)[1]!==null)return base.m.get(k)[1];jput(base,A0,a[1]);return null}
          case "merge":{const old=base.m.has(k)?base.m.get(k)[1]:null;const nw=old===null?a[1]:invoke(a[2],[old,a[1]],line);if(nw===null)base.m.delete(k);else jput(base,A0,nw);return nw}
          case "keySet":{const d=new Dict();d.isSet=true;d.jk="LinkedHashMap";for(const x of jkeys(base))jput(d,x,true);d.view=true;return d}
          case "values":return new Arr("list",jentries(base).map(e=>e[1]),V);
          case "entrySet":return new Arr("list",jentries(base).map(e=>new KV(e[0],e[1])),null);
          case "forEach":for(const [kk,vv] of jentries(base))invoke(A0,[kk,vv],line);return null;
          case "firstKey":{const ks=jkeys(base);if(!ks.length)fail("","NoSuchElementException");return ks[0]}
          case "lastKey":{const ks=jkeys(base);if(!ks.length)fail("","NoSuchElementException");return ks[ks.length-1]}
          case "computeIfAbsent":{if(base.m.has(k)&&base.m.get(k)[1]!==null)return base.m.get(k)[1];const v=invoke(a[1],[A0],line);if(v!==null)jput(base,A0,v);return v}
        }
        fail(`line ${line}: cannot find symbol: method ${n}() on a Map`,"CompileError");
      }
      if(base instanceof KV){if(n==="getKey")return base.k;if(n==="getValue")return base.v;if(n==="setValue"){const o=base.v;base.v=A0;return o}}
      if(base instanceof Func){if(["apply","test","accept","get","run","applyAsInt","applyAsDouble","compare"].includes(n))return invoke(base,a,line);
        if(n==="andThen"||n==="compose"){const f=base,g=A0;return new Func({builtin:(...x)=>n==="andThen"?invoke(g,[invoke(f,x,line)],line):invoke(f,[invoke(g,x,line)],line)})}
        if(n==="negate")return new Func({builtin:(...x)=>!truth(invoke(base,x,line))});
        if(n==="reversed")return new Func({builtin:(x,y)=>-nv(invoke(base,[x,y],line))});}
      if(base&&base.scanner){
        const need=(v,what)=>{if(v===null)fail(hasIn?"":noInput(what),"NoSuchElementException");return v};
        switch(n){
          case "nextLine":return need(readLineIn(),"nextLine()");
          case "next":return need(readTok(),"next()");
          case "nextInt":case "nextLong":{const p=peekTok();if(p===null)need(null,n+"()");if(!/^[-+]?\d+$/.test(p))fail(`For input string: "${p}"`,"InputMismatchException");const v=parseInt(readTok(),10);return n==="nextLong"?new Lg(v):v}
          case "nextDouble":{const p=peekTok();if(p===null)need(null,"nextDouble()");if(isNaN(parseFloat(p)))fail(`For input string: "${p}"`,"InputMismatchException");return new D(parseFloat(readTok()))}
          case "nextBoolean":{const p=peekTok();if(p===null)need(null,"nextBoolean()");if(!/^(true|false)$/i.test(p))fail(`For input string: "${p}"`,"InputMismatchException");return readTok().toLowerCase()==="true"}
          case "hasNext":return peekTok()!==null;case "hasNextLine":return inPos<IN.length;
          case "hasNextInt":{const p=peekTok();return p!==null&&/^[-+]?\d+$/.test(p)}
          case "close":return null;
        }
      }
      if(base&&base.random){
        if(n==="nextInt"){if(!a.length)return (Math.random()*4294967296|0);const lo=a.length>1?nv(A0):0,hi=a.length>1?nv(a[1]):nv(A0);if(hi<=lo)fail(`line ${line}: bound must be positive`,"IllegalArgumentException");return lo+Math.floor(Math.random()*(hi-lo))}
        if(n==="nextDouble")return new D(Math.random());if(n==="nextBoolean")return Math.random()<0.5;
      }
      if(base instanceof Obj&&base.cls.isEnumVal){if(n==="name")return base.ev.name;if(n==="ordinal")return base.ev.ordinal;if(n==="compareTo")return base.ev.ordinal-A0.ev.ordinal}
      if(base instanceof Obj&&n==="compareTo")return jcmp(base,A0);
      if(isNum(base)||typeof base==="boolean"){
        if(n==="compareTo")return jcmp(base,A0);if(n==="intValue")return Math.trunc(nv(base))|0;if(n==="doubleValue")return new D(nv(base));
        fail(`line ${line}: ${jtype(base)} is a primitive type, so it has no methods like .${n}()`,"CompileError");
      }
      fail(`line ${line}: TypeMonkey's runner doesn't know .${n}() on a ${jtype(base)} yet`,"NotSupported");
    }
    function jgroup(s){const [i,d]=s.split(".");return i.replace(/\B(?=(\d{3})+(?!\d))/g,",")+(d!==undefined?"."+d:"")}
    function jfixed(x,prec){  // Java rounds HALF_UP from the shortest decimal form
      if(!isFinite(x))return isNaN(x)?"NaN":x>0?"Infinity":"-Infinity";
      const neg=x<0||Object.is(x,-0);let a=Math.abs(x);
      let [m,e]=a.toExponential().split("e");let ex=+e;let digits=m.replace(".","");
      // digits d0.d1d2... * 10^ex  -> integer string with prec decimals
      let pos=ex+1; // number of digits before the point
      let all=digits;if(pos<=0){all="0".repeat(1-pos)+all;pos=1}
      if(all.length<pos+prec)all=all.padEnd(pos+prec,"0");
      let keep=all.slice(0,pos+prec);const next=all[pos+prec];
      if(next!==undefined&&+next>=5){let arr=keep.split("").map(Number);let i=arr.length-1;while(i>=0){arr[i]++;if(arr[i]<10)break;arr[i]=0;i--}if(i<0){arr.unshift(1);pos++}keep=arr.join("")}
      let out=keep.slice(0,pos)+(prec?"."+keep.slice(pos):"");out=out.replace(/^0+(?=\d)/,"");
      return (neg&&/[1-9]/.test(out)?"-":neg&&x<0?"-":"")+out;
    }
    function jformat(f,args){
      let i=0;f=str(f);
      return f.replace(/%(\d+\$)?([-#+ 0,(]*)(\d+)?(?:\.(\d+))?([a-zA-Z%])/g,(m,pos,flags,w,pr,k)=>{
        if(k==="n")return "\n";if(k==="%")return "%";
        const v=pos?args[parseInt(pos)-1]:args[i++];
        if(v===undefined&&!pos)fail(`Format specifier '${m}'`,"MissingFormatArgumentException");
        const bad=()=>fail(`${k} != ${v instanceof D?"java.lang.Double":v instanceof Lg?"java.lang.Long":typeof v==="number"?"java.lang.Integer":typeof v==="string"?"java.lang.String":v instanceof Ch?"java.lang.Character":typeof v==="boolean"?"java.lang.Boolean":"java.lang.Object"}`,"IllegalFormatConversionException");
        let s;
        switch(k){
          case "d":if(!(typeof v==="number"||v instanceof Lg))bad();s=String(nv(v));if(flags.includes(","))s=jgroup(s);if(flags.includes("+")&&nv(v)>=0)s="+"+s;break;
          case "f":if(!(v instanceof D))bad();s=jfixed(v.v,pr===undefined?6:+pr);if(flags.includes(","))s=(s[0]==="-"?"-":"")+jgroup(s.replace("-",""));if(flags.includes("+")&&v.v>=0)s="+"+s;break;
          case "e":case "E":if(!(v instanceof D))bad();{let [mm,ee]=v.v.toExponential(pr===undefined?6:+pr).split("e");s=mm+"e"+(ee[0]==="-"?"-":"+")+ee.replace(/[-+]/,"").padStart(2,"0");if(k==="E")s=s.toUpperCase()}break;
          case "s":case "S":s=v===null?"null":jstr(v);if(pr!==undefined)s=s.slice(0,+pr);if(k==="S")s=s.toUpperCase();break;
          case "c":s=v instanceof Ch?String.fromCharCode(v.c):typeof v==="number"?String.fromCharCode(v):bad();break;
          case "b":case "B":s=v===null?"false":typeof v==="boolean"?String(v):"true";if(k==="B")s=s.toUpperCase();break;
          case "x":case "X":if(!(typeof v==="number"||v instanceof Lg))bad();s=(nv(v)>>>0).toString(16);if(k==="X")s=s.toUpperCase();break;
          default:fail(`Conversion = '${k}'`,"UnknownFormatConversionException");
        }
        if(w){const n=+w;if(flags.includes("-"))s=s.padEnd(n);else if(flags.includes("0")&&/[dfxXeE]/.test(k)){const neg=s[0]==="-"||s[0]==="+";s=neg?s[0]+s.slice(1).padStart(n-1,"0"):s.padStart(n,"0")}else s=s.padStart(n)}
        return s;
      });
    }
    function jparseInt(s0){if(s0===null)fail('Cannot parse null string: null',"NumberFormatException");const s=str(s0);if(!/^[-+]?\d+$/.test(s))fail(`For input string: "${s}"`,"NumberFormatException");const n=parseInt(s,10);if(n>2147483647||n<-2147483648)fail(`For input string: "${s}"`,"NumberFormatException");return n}
    function jparseDouble(s0){if(s0===null)fail("","NullPointerException");const s=str(s0).trim();if(s==="")fail("empty String","NumberFormatException");if(!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?[dDfF]?$/.test(s)&&!/^[-+]?(NaN|Infinity)$/.test(s))fail(`For input string: "${str(s0)}"`,"NumberFormatException");return new D(parseFloat(s.replace(/[dDfF]$/,"")))}
    const jch=f=>B(c=>f(String.fromCharCode(nv(c))));
    const jmm=(f,g)=>B((x,y)=>{if(x instanceof D||y instanceof D)return new D(f(nv(x),nv(y)));if(x instanceof Lg||y instanceof Lg)return new Lg(f(nv(x),nv(y)));return f(x,y)});
    const JB={
      System:{ns:{
        out:{ns:{println:B((...a)=>{const v=a[0];W((a.length?(v instanceof Arr&&v.kind==="array"&&v.elem&&v.elem.name==="char"&&!v.elem.arr?v.items.map(str).join(""):str(v)):"")+"\n");return null}),
          print:B(v=>{W(v instanceof Arr&&v.kind==="array"&&v.elem&&v.elem.name==="char"?v.items.map(str).join(""):str(v));return null}),
          printf:B((f,...a)=>{W(jformat(f,a));return null}),format:B((f,...a)=>{W(jformat(f,a));return null})}},
        err:{ns:{println:B(()=>null),print:B(()=>null),printf:B(()=>null)}},
        currentTimeMillis:B(()=>new Lg(Date.now())),nanoTime:B(()=>new Lg(Math.round(performance.now()*1e6))),
        exit:B(()=>{throw EXIT}),
        in:{ns:{}}}},
      String:{ns:{valueOf:B(x=>x instanceof Arr&&x.kind==="array"?x.items.map(str).join(""):str(x)),format:B((f,...a)=>jformat(f,a)),
        join:B((sep,...rest)=>{const items=rest.length===1&&(rest[0] instanceof Arr||rest[0] instanceof Dict)?[...iterate(rest[0],0)]:rest;return items.map(x=>str(x)).join(str(sep))})}},
      Integer:{ns:{parseInt:B(jparseInt),valueOf:B(x=>{const v=typeof x==="string"?jparseInt(x):x;boxedArg.v=v;boxedArg.t=steps;return v}),MAX_VALUE:2147483647,MIN_VALUE:-2147483648,
        toString:B(x=>str(x)),toBinaryString:B(x=>(nv(x)>>>0).toString(2)),toHexString:B(x=>(nv(x)>>>0).toString(16)),
        sum:B((x,y)=>(x+y)|0),max:B((x,y)=>Math.max(x,y)),min:B((x,y)=>Math.min(x,y)),compare:B((x,y)=>x<y?-1:x>y?1:0),signum:B(x=>Math.sign(x))}},
      Long:{ns:{parseLong:B(s=>{const t=str(s);if(!/^[-+]?\d+$/.test(t))fail(`For input string: "${t}"`,"NumberFormatException");return new Lg(parseInt(t,10))}),MAX_VALUE:new Lg(9223372036854775807),MIN_VALUE:new Lg(-9223372036854775808)}},
      Double:{ns:{parseDouble:B(jparseDouble),valueOf:B(x=>typeof x==="string"?jparseDouble(x):new D(nv(x))),toString:B(x=>jdbl(nv(x))),
        MAX_VALUE:new D(Number.MAX_VALUE),MIN_VALUE:new D(Number.MIN_VALUE),POSITIVE_INFINITY:new D(Infinity),NEGATIVE_INFINITY:new D(-Infinity),NaN:new D(NaN),
        isNaN:B(x=>isNaN(nv(x))),compare:B((x,y)=>jcmp(new D(nv(x)),new D(nv(y))))}},
      Boolean:{ns:{parseBoolean:B(s=>s!==null&&str(s).toLowerCase()==="true"),toString:B(x=>str(x))}},
      Character:{ns:{isDigit:jch(c=>/[0-9]/.test(c)),isLetter:jch(c=>/\p{L}/u.test(c)),isLetterOrDigit:jch(c=>/[\p{L}0-9]/u.test(c)),
        isUpperCase:jch(c=>c!==c.toLowerCase()),isLowerCase:jch(c=>c!==c.toUpperCase()),isWhitespace:jch(c=>/[\s]/.test(c)),isAlphabetic:jch(c=>/\p{L}/u.test(c)),
        toUpperCase:B(c=>c instanceof Ch?new Ch(String.fromCharCode(c.c).toUpperCase().charCodeAt(0)):String.fromCharCode(nv(c)).toUpperCase().charCodeAt(0)),
        toLowerCase:B(c=>c instanceof Ch?new Ch(String.fromCharCode(c.c).toLowerCase().charCodeAt(0)):String.fromCharCode(nv(c)).toLowerCase().charCodeAt(0)),
        getNumericValue:jch(c=>/[0-9]/.test(c)?+c:/[a-z]/i.test(c)?c.toLowerCase().charCodeAt(0)-87:-1),toString:B(c=>str(c)),valueOf:B(c=>c),
        MAX_VALUE:new Ch(0xffff),MIN_VALUE:new Ch(0)}},
      Math:{ns:{max:jmm(Math.max),min:jmm(Math.min),abs:B(x=>x instanceof D?new D(Math.abs(x.v)):x instanceof Lg?new Lg(Math.abs(x.v)):Math.abs(nv(x))|0),
        pow:B((x,y)=>new D(nv(x)**nv(y))),sqrt:B(x=>new D(Math.sqrt(nv(x)))),cbrt:B(x=>new D(Math.cbrt(nv(x)))),
        round:B(x=>x instanceof D?(()=>{const r=Math.floor(x.v+0.5);return new Lg(isNaN(r)?0:r)})():x),
        floor:B(x=>new D(Math.floor(nv(x)))),ceil:B(x=>new D(Math.ceil(nv(x)))),random:B(()=>new D(Math.random())),
        hypot:B((x,y)=>new D(Math.hypot(nv(x),nv(y)))),floorDiv:B((x,y)=>{if(nv(y)===0)fail("/ by zero","ArithmeticException");return Math.floor(nv(x)/nv(y))}),floorMod:B((x,y)=>{if(nv(y)===0)fail("/ by zero","ArithmeticException");return ((nv(x)%nv(y))+nv(y))%nv(y)}),
        log:B(x=>new D(Math.log(nv(x)))),log10:B(x=>new D(Math.log10(nv(x)))),exp:B(x=>new D(Math.exp(nv(x)))),signum:B(x=>new D(Math.sign(nv(x)))),
        sin:B(x=>new D(Math.sin(nv(x)))),cos:B(x=>new D(Math.cos(nv(x)))),toRadians:B(x=>new D(nv(x)/180*Math.PI)),
        addExact:B((x,y)=>{const r=x+y;if(r>2147483647||r<-2147483648)fail("integer overflow","ArithmeticException");return r}),
        PI:new D(Math.PI),E:new D(Math.E)}},
      Arrays:{ns:{toString:B(x=>x===null?"null":"["+x.items.map(v=>str(v)).join(", ")+"]"),
        deepToString:B(x=>{const f=v=>v instanceof Arr&&v.kind==="array"?"["+v.items.map(f).join(", ")+"]":str(v);return f(x)}),
        sort:B((x,c,d,cmp)=>{const fn=c instanceof Func?c:cmp;if(typeof c==="number"){const part=x.items.slice(c,d).sort(jsortCmp(fn,0));x.items.splice(c,part.length,...part);return null}x.items.sort(jsortCmp(fn,0));return null}),
        fill:B((x,v)=>{x.items.fill(v);return null}),asList:B((...x)=>{const l=new Arr("list",x.length===1&&x[0] instanceof Arr&&x[0].kind==="array"?x[0].items:x,null);l.fixed=true;return l}),
        copyOf:B((x,n)=>new Arr("array",Array.from({length:n},(_,i)=>i<x.items.length?x.items[i]:defaultFor(x.elem)),x.elem)),
        copyOfRange:B((x,b,en)=>new Arr("array",x.items.slice(b,en),x.elem)),
        equals:B((x,y)=>x.items.length===y.items.length&&x.items.every((v,i)=>jeq(v,y.items[i]))),
        stream:B(()=>fail("streams (Arrays.stream) aren't supported in TypeMonkey's runner yet. Use a for-each loop instead","NotSupported"))}},
      List:{ns:{of:B((...x)=>{if(x.some(v=>v===null))fail("","NullPointerException");const l=new Arr("list",x,null);l.immutable=true;return l}),
        copyOf:B(x=>{const l=new Arr("list",[...iterate(x,0)],null);l.immutable=true;return l})}},
      Collections:{ns:{sort:B((l,c)=>{l.items.sort(jsortCmp(c,0));return null}),reverse:B(l=>{l.items.reverse();return null}),
        max:B((l,c)=>{const it=[...iterate(l,0)];if(!it.length)fail("","NoSuchElementException");const f=jsortCmp(c,0);return it.reduce((m,x)=>f(x,m)>0?x:m)}),
        min:B((l,c)=>{const it=[...iterate(l,0)];if(!it.length)fail("","NoSuchElementException");const f=jsortCmp(c,0);return it.reduce((m,x)=>f(x,m)<0?x:m)}),
        frequency:B((l,x)=>[...iterate(l,0)].filter(v=>jeq(v,x)).length),swap:B((l,i,j)=>{const t=l.items[i];l.items[i]=l.items[j];l.items[j]=t;return null}),
        shuffle:B(l=>{const a=l.items;for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return null}),
        unmodifiableList:B(l=>{const c=new Arr("list",l.items,l.elem);c.immutable=true;return c}),
        emptyList:B(()=>{const l=new Arr("list",[],null);l.immutable=true;return l}),nCopies:B((n,v)=>{const l=new Arr("list",Array(n).fill(v),null);l.immutable=true;return l})}},
      Objects:{ns:{equals:B((x,y)=>x===null?y===null:jeq(x,y)),hash:B((...a)=>a.reduce((h,x)=>(Math.imul(31,h)+jhash(x))|0,1)),isNull:B(x=>x===null),toString:B(x=>str(x)),requireNonNull:B(x=>{if(x===null)fail("","NullPointerException");return x})}},
      Thread:{ns:{sleep:B(()=>null)}},
    };

    if(lang==="java")Object.assign(BUILTIN,JB);
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
          if(lang==="java"&&!["assign","call","pre","post","new"].includes(e.k))fail(`line ${s.line||"?"}: not a statement`,"CompileError");
          ev(e,env);return}
        case "decl":for(const d of s.decls)declare(d,env);return;
        case "if":if(truth(ev(s.c,env)))exec(s.a,new Env(env));else if(s.b)exec(s.b,new Env(env));return;
        case "while":while(truth(ev(s.c,env))){tick();try{exec(s.body,new Env(env))}catch(x){if(x===BRK)break;if(x===CNT)continue;throw x}}return;
        case "do":do{tick();try{exec(s.body,new Env(env))}catch(x){if(x===BRK)break;if(x===CNT)continue;throw x}}while(truth(ev(s.c,env)));return;
        case "for":{const fe=new Env(env);if(s.init){if(s.init.k==="decl")for(const d of s.init.decls)declare(d,fe);else ev(s.init.e,fe)}
          for(;;){if(s.c&&!truth(ev(s.c,fe)))break;tick();try{exec(s.body,new Env(fe))}catch(x){if(x===BRK)break;if(x!==CNT)throw x}for(const st of s.steps)ev(st,fe)}return}
        case "forin":{
          const coll=ev(s.coll,env);
          let fst=s.type;if(!fst||fst.name==="var"||fst.name==="auto"){const ct=staticType(s.coll,env);fst=ct&&ct.arr?{...ct,arr:ct.arr-1}:ct&&ct.args&&ct.args.length&&!["Dictionary","map","unordered_map"].includes(ct.name)?ct.args[0]:null}
          if(s.type&&s.type.ref&&lang==="cpp"&&coll instanceof Arr){
            for(let i=0;i<coll.items.length;i++){tick();const fe=new Env(env);const idx=i;setSt(fe,s.name,fst);fe.vars.set(s.name,new LV(()=>coll.items[idx],v=>coll.items[idx]=v));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}}return}
          if(lang==="java"&&coll instanceof Arr&&coll.kind!=="array"){const it=coll.items;const n0=it.length;let cur=0;
            while(cur!==it.length){tick();if(it.length!==n0)fail(`line ${s.line}: (you changed the list while looping over it with for-each. Use removeIf, or loop over a copy)`,"ConcurrentModificationException");const v=it[cur++];const fe=new Env(env);setSt(fe,s.name,fst);fe.vars.set(s.name,new Cell(coerce(v,s.type,s.line),s.type));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}}return}
          const items=[...iterate(coll,s.line)];
          if(lang==="cs"&&coll instanceof Arr){const n=coll.items.length;for(const v of items){tick();const fe=new Env(env);setSt(fe,s.name,fst);fe.vars.set(s.name,new Cell(coerce(v,s.type,s.line),s.type));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}if(coll.items.length!==n)fail(`line ${s.line}: Collection was modified; you can't add or remove items while looping with foreach.`,"InvalidOperationException")}return}
          for(const v of items){tick();const fe=new Env(env);setSt(fe,s.name,fst);fe.vars.set(s.name,new Cell(coerce(v,s.type,s.line),s.type));try{exec(s.body,fe)}catch(x){if(x===BRK)break;if(x!==CNT)throw x}}return}
        case "break":throw BRK;
        case "continue":throw CNT;
        case "return":throw new Ret(s.e?ev(s.e,env):null);
        case "switch":try{runSwitch(s,env)}catch(x){if(x!==BRK)throw x}return;
        case "yield":throw new Yield(ev(s.e,env));
        case "throw":throw new Throw(s.e?ev(s.e,env):null);
        case "try":{
          try{execBlock(s.body,env)}
          catch(x){
            if(x===BRK||x===CNT||x instanceof Ret)throw x;
            let val,kind;
            if(x instanceof Throw){val=x.v;kind=val&&val.cls?val.cls.name:"Exception"}
            else if(x instanceof RunError&&!["CompileError","SyntaxError","NotSupported","Timeout"].includes(x.kind)){kind=x.kind;val=Object.assign(new Obj({name:kind,methods:Object.create(null),fields:[],excChain:lang==="java"}),{msg:lang==="java"&&(x.message===""||/^(line \d+: )?\(/.test(x.message))?null:x.message.replace(/^line \d+: /,"")})}
            else throw x;
            const c=lang==="java"?s.catches.find(c=>c.types.some(t=>val instanceof Obj&&classes[val.cls.name]?isA(val.cls,t):jexcIs(kind,t))):s.catches.find(c=>!c.type||["Exception","exception"].includes(c.type.name)||c.type.name===kind||(lang==="cs"&&csExcIs(kind,c.type.name))||(lang==="cpp"&&c.type.name!=="Exception"));
            if(!c)throw x;
            const ce=new Env(env);if(c.name)ce.vars.set(c.name,new Cell(val,c.type));execBlock(c.body,ce);
          }finally{if(s.fin)execBlock(s.fin,env)}
          return}
      }
      fail("unsupported statement","NotSupported");
    }
    function csExcIs(kind,name){const k=classes[kind];if(!k)return false;if(isA(k,name))return true;for(let c=k;c;c=c.sup)if(c.excBase===name)return true;return false}
    function caseMatch(c,v,env){return c.vals.some(x=>{if(v instanceof Obj&&v.cls.isEnumVal&&x.k==="name")return x.v===v.ev.name;const cv=ev(x,env);return lang==="java"&&typeof v==="string"?v===cv:equal(cv,v)})}
    function runSwitch(s,env){
      const v=ev(s.e,env);
      if(lang==="java"&&v===null)fail(`line ${s.line}: Cannot switch on a null value`,"NullPointerException");
      const se=new Env(env);
      if(s.arrows){const c=s.cases.find(c=>!c.def&&caseMatch(c,v,env))||s.cases.find(c=>c.def);if(c)for(const st of c.body)exec(st,se);return}
      let on=false;
      for(const c of s.cases){if(!on&&!c.def&&caseMatch(c,v,env))on=true;if(on)for(const st of c.body)exec(st,se)}
      if(!on){const d=s.cases.find(c=>c.def);if(d){let go=false;for(const c of s.cases){if(c===d)go=true;if(go)for(const st of c.body)exec(st,se)}}}
    }
    function declare(d,env){
      const t=d.type;let v;
      if(t.ref&&lang==="cpp"){
        if(!d.init)fail(`line ${d.line}: a reference (&) must be set to a variable when you create it`,"CompileError");
        const lv=lval(d.init,env);if(!lv)fail(`line ${d.line}: a reference must refer to a variable, not a value`,"CompileError");
        env.def(d.name,lv,d.line);setSt(env,d.name,declSt(t,d.init,env));return;
      }
      if(d.ctorArgs){const cls=classes[t.name];const av=d.ctorArgs.map(a=>ev(a,env));
        if(cls)v=construct(cls,av,d.line);else if(t.name==="vector")v=new Arr("vector",Array.from({length:nv(av[0])},()=>av.length>1?copy(av[1]):defaultFor(t.args[0])),t.args[0]);else if(t.name==="string")v=av.length===2?str(av[1]).repeat(nv(av[0])):str(av[0]);else v=coerce(av[0],t,d.line)}
      else if(d.init){const iv=d.init.k==="init"?new InitList(d.init.items.map(x=>ev(x,env))):ev(d.init,env);
        if(t.name==="var"&&iv===null&&lang==="cs")fail(`line ${d.line}: Cannot assign null to an implicitly-typed variable (var)`,"CompileError");
        v=coerce(iv,t,d.line)}
      else if(d.fixedLen){v=new Arr("array",Array.from({length:nv(ev(d.fixedLen,env))},()=>defaultFor({...t,arr:0})),{...t,arr:0})}
      else v=(lang==="cs"&&!classes[t.name])||lang==="java"?undefined:lang==="cpp"&&classes[t.name]&&!t.ptr&&!t.arr?construct(classes[t.name],[],d.line):defaultFor(t);
      if(v===undefined){const c=new Cell(null,t);c.unassigned=true;const lv=new LV(()=>{if(c.unassigned)fail(`line ${d.line}: ${lang==="java"?`variable ${d.name} might not have been initialized`:`Use of unassigned local variable '${d.name}'`}`,"CompileError");return c.v},x=>{c.unassigned=false;c.v=x});lv.type=t;env.def(d.name,lv,d.line);setSt(env,d.name,t);return}
      env.def(d.name,new Cell(v,t),d.line);setSt(env,d.name,declSt(t,d.init,env));
    }

    function resolveClasses(){
      const all=Object.values(classes);
      for(const c of all)if(c.parent){
        if(classes[c.parent])c.sup=classes[c.parent];
        else if(lang==="cs"&&/Exception$/.test(c.parent)){c.isExc=true;c.excBase=c.parent}
        else if(lang==="cs"&&/^I[A-Z]/.test(c.parent))fail(`interfaces (like ${c.parent}) aren't supported in TypeMonkey's runner yet`,"NotSupported");
        else fail(lang==="cs"?`The type or namespace name '${c.parent}' could not be found (class ${c.name} : ${c.parent})`:`expected class-name: '${c.parent}' isn't a class or struct in your code (class ${c.name} : ${c.parent})`,"CompileError");
        if(c.ifaces.length)fail(`interfaces (like ${c.ifaces[0]}) aren't supported in TypeMonkey's runner yet`,"NotSupported");
      }
      for(const c of all){for(let k=c.sup;k;k=k.sup){if(k===c)fail(`circular base class: ${c.name} inherits from itself`,"CompileError");if(k.isExc){c.isExc=true}}}
      for(const c of all)for(const n in c.methods)for(const m of ovs(c.methods[n])){
        const above=c.sup?findDecl(c.sup,n):null;
        if(lang==="cs"&&m.isOverride&&!(above&&ovs(above).some(x=>x.isVirtual||x.isAbstract||x.isOverride))&&!(["ToString","Equals","GetHashCode"].includes(n)&&!above))
          fail(`line ${m.line||"?"}: '${c.name}.${n}()': no suitable method found to override. ${above?`Mark ${c.sup.name}.${n} as virtual (or abstract) first`:`${c.name} doesn't inherit a ${n} method`}`,"CompileError");
        if(lang==="cpp"&&m.isOverride&&!(c.sup&&virtIn(c.sup,n)))fail(`line ${m.line||"?"}: '${c.name}::${n}' marked 'override', but does not override${above?` (make ${c.sup.name}::${n} virtual)`:""}`,"CompileError");
        if(lang==="cs"&&m.isAbstract&&!c.isAbstractClass)fail(`line ${m.line||"?"}: '${c.name}.${n}()' is abstract but it is contained in non-abstract type '${c.name}'. Write abstract class ${c.name}`,"CompileError");
      }
      if(lang==="cs")for(const c of all)if(!c.isAbstractClass){const m=pureLeft(c);if(m)fail(`'${c.name}' does not implement inherited abstract member '${m.owner}.${m.name}()'. Add public override ... ${m.name}(...) to ${c.name}`,"CompileError")}
    }

    /* program */
    try{
      const prog=parse(lex(code,lang),lang,classNames).program();
      for(const it of prog)if(it.k==="class"){if(classes[it.cls.name])fail(`duplicate class: ${it.cls.name}`,"CompileError");classes[it.cls.name]=it.cls}
      if(lang==="java")for(const c of Object.values(classes)){
        if(c.parent){if(classes[c.parent])c.sup=classes[c.parent];else if(JEXC(c.parent)){c.excBase=c.parent;c.excChain=true}else fail(`cannot find symbol: class ${c.parent}`,"CompileError")}
        for(const i of c.ifaces||[])if(!classes[i]&&!["Comparable","Runnable","Cloneable"].includes(i))fail(`cannot find symbol: class ${i}`,"CompileError");
        if(c.isEnum){c.enumVals=c.vals.map((v,i)=>{const o=new Obj({name:c.name,isEnumVal:true,methods:Object.create(null),fields:[]});o.ev={name:v,ordinal:i};return o});c.statics=[];c.staticVals={}}
      }
      if(lang==="java")for(const c of Object.values(classes)){for(let k=c.sup;k;k=k.sup){if(k===c)fail(`cyclic inheritance involving ${c.name}`,"CompileError");if(k.excChain)c.excChain=true}
}
      if(lang!=="java")resolveClasses();
      for(const it of prog)if(it.k==="class"){const c=it.cls;if(c.isEnum){c.enumVals.forEach(o=>c.staticVals[o.ev.name]=o);continue}c.staticVals={};const se=new Env(globalEnv);se.cls=c;for(const f of c.statics)c.staticVals[f.name]=f.init?coerce(ev(f.init,se),f.type,0):defaultFor(f.type)}
      for(const it of prog)if(it.k==="func"){const f=new Func({name:it.name,params:it.params,body:it.body,ret:it.ret,closure:globalEnv});if(lang==="java"&&funcs[it.name]){const pr=funcs[it.name];(pr.overloads||(pr.overloads=[pr])).push(f)}else funcs[it.name]=f}
      const mainCls=Object.values(classes).find(c=>c.methods.Main&&c.methods.Main.isStatic);
      const jmain=lang==="java"&&Object.values(classes).find(c=>c.methods.main&&c.methods.main.isStatic);
      if(lang==="java"&&jmain){if(prog.some(it=>it.k!=="class"&&it.k!=="empty"))fail("Your code has statements outside of a class. In a full Java file, everything goes inside class Main { ... }","CompileError");
        const m=jmain.methods.main;invoke({method:m,self:null,cls:jmain},m.params.length?[new Arr("array",[],{name:"string",jname:"String"})]:[],0)}
      else if(lang==="java"&&Object.values(classes).some(c=>c.methods.main&&!c.methods.main.isStatic)&&!prog.some(it=>it.k!=="class"))fail("main must be static: public static void main(String[] args)","CompileError");
      else if(lang==="cs"&&mainCls){invoke({method:mainCls.methods.Main,self:null,cls:mainCls},[],0)}
      else if(lang==="cpp"&&funcs.main){
        for(const it of prog)if(it.k==="decl")exec(it,globalEnv);
        invoke(funcs.main,[],0);
      }else{
        if(lang==="cs"&&Object.values(classes).some(c=>c.methods.Main&&!c.methods.Main.isStatic))fail("Main must be static: static void Main()","CompileError");
        for(const it of prog)if(it.k!=="class"&&it.k!=="func")exec(it,globalEnv);
      }
      return {out,error:null};
    }catch(x){
      if(x instanceof Ret||x===EXIT)return {out,error:null};
      if(lang==="java"){
        if(x instanceof Throw){const v=x.v;return {out,error:`Exception in thread "main" ${v instanceof Obj?jstr(v):"java.lang.Exception"}`}}
        if(x instanceof RunError&&!["CompileError","SyntaxError","NotSupported","Timeout"].includes(x.kind)){const m=x.message.replace(/^line \d+: /,"");return {out,error:`Exception in thread "main" ${jexcName(x.kind)}${m?(m[0]==="("?" ":": ")+m:""}`}}
        if(x instanceof RangeError)return {out,error:'Exception in thread "main" java.lang.StackOverflowError (a method keeps calling itself. Check your stopping case.)'};
        if(x instanceof Yield)return {out,error:"error: yield outside of a switch expression"};
      }
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
