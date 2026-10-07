/* TypeMonkey Swift runner: an in-house interpreter for the parts of Swift that TypeMonkey teaches.
   TMSwift.run(code) -> {out: "printed text", error: null | "message"}
   Covers: let/var with type annotations and inference, Int/Double/String/Bool/Character, optionals
   (if let, guard let, ??, ?., !), string interpolation, ranges, if/guard/switch (with patterns), for-in,
   while, repeat-while, functions with argument labels and defaults, closures (incl. $0 and trailing
   closures), arrays, dictionaries, sets, tuples, structs (value semantics, mutating, memberwise init),
   classes (reference semantics, inheritance, override, super), enums (raw values, CaseIterable,
   associated values), protocols and extensions, errors (throw/try/do-catch).
   Swift isn't installed where TypeMonkey is built, so this follows the Swift language reference;
   anything outside the subset reports a friendly "not supported yet" error. */
const TMSwift=(()=>{
  class SErr extends Error{constructor(m,kind){super(m);this.kind=kind}}
  const fail=(m,k="CompileError")=>{throw new SErr(m,k)};
  const fatal=m=>{throw new SErr(m,"Fatal")};
  /* ---------- values ---------- */
  class D{constructor(v){this.v=v}}                         // Double
  class Chr{constructor(s){this.s=s}}                       // Character
  class Some{constructor(v){this.v=v}}                      // Optional with a value
  const NIL={nil:true};                                     // Optional without a value
  class Arr{constructor(items,et){this.items=items;this.et=et}}
  class Dict{constructor(kt,vt){this.m=new Map();this.kt=kt;this.vt=vt}}
  class SetV{constructor(et){this.m=new Map();this.et=et}}
  class Tup{constructor(items,labels){this.items=items;this.labels=labels||[]}}
  class Range{constructor(lo,hi,closed){this.lo=lo;this.hi=hi;this.closed=closed}}
  class Obj{constructor(type){this.type=type;this.f=Object.create(null)}}
  class ECase{constructor(type,name,vals){this.type=type;this.name=name;this.vals=vals||null}}
  class Fn{constructor(o){Object.assign(this,o)}}
  class SIdx{constructor(i){this.i=i}}                     // String.Index (counted in Characters)
  class Thrown{constructor(v){this.v=v}}
  class Ret{constructor(v){this.v=v}}
  const BRK={brk:1},CNT={cnt:1};
  class Brk{constructor(label){this.label=label}}
  const isInt=v=>typeof v==="number";
  const isNumV=v=>typeof v==="number"||v instanceof D;
  const num=v=>v instanceof D?v.v:v;
  const F32=x=>{const d=new D(Math.fround(x));d.f32=true;return d};   // Float

  /* ---------- lexer ---------- */
  const KW=new Set(["let","var","func","if","else","guard","switch","case","default","for","in","while","repeat","return","break","continue","struct","class","enum","protocol","extension","init","self","super","true","false","nil","import","throw","throws","try","do","catch","mutating","static","override","inout","where","as","is","fallthrough","private","public","fileprivate","internal","final","lazy","weak","required","convenience","rethrows","deinit","typealias","defer","some","any","nonmutating","indirect","get","set","willSet","didSet"]);
  function lex(src){
    const t=[];let i=0,line=1,nl=true,space=true;
    const push=(k,v,extra)=>{t.push({k,v,line,nl,space,...extra});nl=false;space=false};
    while(i<src.length){
      const c=src[i];
      if(c==="\n"){line++;i++;nl=true;space=true;continue}
      if(c===" "||c==="\t"||c==="\r"){i++;space=true;continue}
      if(c==="/"&&src[i+1]==="/"){while(i<src.length&&src[i]!=="\n")i++;continue}
      if(c==="/"&&src[i+1]==="*"){let d=1;i+=2;while(i<src.length&&d){if(src[i]==="/"&&src[i+1]==="*"){d++;i+=2;continue}if(src[i]==="*"&&src[i+1]==="/"){d--;i+=2;continue}if(src[i]==="\n")line++;i++}space=true;continue}
      if(c==='"'){
        const multi=src.slice(i,i+3)==='"""';
        if(multi){i+=3;if(src[i]==="\n"){i++;line++}let raw="";while(i<src.length&&src.slice(i,i+3)!=='"""'){if(src[i]==="\n")line++;raw+=src[i++]}
          if(i>=src.length)fail(`line ${line}: this multi-line string is missing its closing """`);i+=3;
          const lines=raw.split("\n");const last=lines[lines.length-1];const ind=/^\s*$/.test(last)?last.length:0;if(ind||/^\s*$/.test(last))lines.pop();
          push("str",strParts(lines.map(l=>l.slice(ind)).join("\n"),line));continue}
        i++;let raw="";
        while(i<src.length&&src[i]!=='"'){
          if(src[i]==="\n")fail(`line ${line}: this string is missing its closing "`);
          if(src[i]==="\\"&&src[i+1]==="("){let d=0,j=i+1;for(;j<src.length;j++){if(src[j]==="(")d++;else if(src[j]===")"){d--;if(!d)break}else if(src[j]==='"'){j++;while(j<src.length&&src[j]!=='"'){if(src[j]==="\\")j++;j++}}}raw+=src.slice(i,j+1);i=j+1;continue}
          if(src[i]==="\\"){raw+=src[i]+src[i+1];i+=2;continue}
          raw+=src[i++];
        }
        if(src[i]!=='"')fail(`line ${line}: this string is missing its closing "`);
        i++;push("str",strParts(raw,line));continue;
      }
      if(/[0-9]/.test(c)){
        let j=i;while(/[0-9_]/.test(src[j]))j++;let dbl=false;
        if(src[j]==="."&&/[0-9]/.test(src[j+1])){dbl=true;j++;while(/[0-9_]/.test(src[j]))j++}
        if(/[eE]/.test(src[j]||"")&&/[-+0-9]/.test(src[j+1]||"")){dbl=true;j++;if(/[-+]/.test(src[j]))j++;while(/[0-9]/.test(src[j]))j++}
        const s=src.slice(i,j).replace(/_/g,"");push("num",dbl?new D(parseFloat(s)):parseInt(s,10));i=j;continue;
      }
      if(/[A-Za-z_$]/.test(c)){let j=i+1;while(j<src.length&&/[A-Za-z0-9_]/.test(src[j]))j++;const w=src.slice(i,j);i=j;push(KW.has(w)?"kw":"id",w);continue}
      if(c==="\\"&&(src[i+1]==="."||/[A-Z]/.test(src[i+1]||""))){push("op","\\");i++;continue}
      if(c==="`"){const j=src.indexOf("`",i+1);push("id",src.slice(i+1,j));i=j+1;continue}
      const ops=["...","..<","===","!==","&&","||","==","!=","<=",">=","+=","-=","*=","/=","%=","->","??","<<",">>"];
      const op=ops.find(o=>src.startsWith(o,i));
      if(op){push("op",op);i+=op.length;continue}
      if("+-*/%=<>!&|^~?:;,.(){}[]@#".includes(c)){push("op",c);i++;continue}
      fail(`line ${line}: unexpected character "${c}"`);
    }
    t.push({k:"eof",v:"",line,nl:true,space:true});return t;
  }
  function strParts(raw,line){
    const parts=[];let s="",i=0;
    while(i<raw.length){
      if(raw[i]==="\\"){const n=raw[i+1];
        if(n==="("){let d=0,j=i+1;for(;j<raw.length;j++){if(raw[j]==="(")d++;else if(raw[j]===")"){d--;if(!d)break}else if(raw[j]==='"'){j++;while(j<raw.length&&raw[j]!=='"'){if(raw[j]==="\\")j++;j++}}}
          if(s)parts.push(s),s="";parts.push({src:raw.slice(i+2,j),line});i=j+1;continue}
        const m={n:"\n",t:"\t",r:"\r",'"':'"',"\\":"\\","'":"'","0":"\0"}[n];
        if(m===undefined)fail(`line ${line}: invalid escape sequence \\${n} in a string`);
        s+=m;i+=2;continue}
      s+=raw[i++];
    }
    if(s||!parts.length)parts.push(s);
    return parts;
  }

  const OPFNS=["+","-","*","/","%","<",">","<=",">=","==","!=","&&","||"];
  /* ---------- parser ---------- */
  function parse(tokens){
    let p=0;
    const peek=(o=0)=>tokens[Math.min(p+o,tokens.length-1)];
    const is=(v,o=0)=>{const t=peek(o);return (t.k==="op"||t.k==="kw")&&t.v===v};
    const accept=v=>{if(is(v)){p++;return true}return false};
    const near=()=>peek().k==="eof"?"the end of the code":`"${peek().v instanceof D?peek().v.v:peek().v}"`;
    const expect=v=>{if(!is(v))fail(`line ${peek().line}: expected "${v}" near ${near()}`);p++};
    const ident=()=>{const t=peek();if(t.k!=="id"&&!(t.k==="kw"&&["get","set","some","any","didSet","willSet"].includes(t.v)))fail(`line ${t.line}: expected a name near ${near()}`);p++;return t.v};
    const skipSemis=()=>{while(accept(";"));};
    let noTrailing=0;const aliases=Object.create(null);

    function program(){const body=[];while(peek().k!=="eof"){skipSemis();if(peek().k==="eof")break;body.push(statement())}return body}
    function block(){expect("{");const body=[];noTrailing++;const save=noTrailing;noTrailing=0;while(!is("}")){skipSemis();if(is("}"))break;if(peek().k==="eof")fail("a { block is missing its closing }");body.push(statement())}noTrailing=save-1;expect("}");return body}
    function endStmt(){if(accept(";"))return;const t=peek();if(t.nl||t.k==="eof"||is("}"))return;fail(`line ${t.line}: put each statement on its own line (or separate them with ;) near ${near()}`)}

    function statement(){
      const t=peek(),line=t.line;
      while(is("@")){p++;ident()}
      const mods=[];while(peek().k==="kw"&&["private","public","fileprivate","internal","final","static","override","mutating","lazy","weak","open","required","convenience","nonmutating","indirect"].includes(peek().v)){mods.push(peek().v);p++;if(is("(")&&(is("set",1))&&is(")",2))p+=3}
      if(peek().k==="id"&&is(":",1)&&["for","while","repeat"].includes(peek(2).v)){const label=ident();p++;const s=statement();s.label=label;return s}
      if(t.k==="kw")switch(peek().v){
        case "import":p++;while(!peek().nl&&peek().k!=="eof")p++;return {k:"empty"};
        case "let":case "var":return varDecl(mods);
        case "func":return funcDecl(mods);
        case "struct":case "class":case "enum":case "protocol":case "extension":return typeDecl();
        case "init":return funcDecl(mods);
        case "if":return ifStmt();
        case "guard":{p++;const conds=condList();expect("else");const body=block();return {k:"guard",conds,body,line}}
        case "switch":return switchStmt();
        case "for":{p++;
          let casePat=null;if(accept("case")){noTrailing++;casePat=casePattern();noTrailing--}
          const pat=casePat?{k:"wild"}:pattern();expect("in");noTrailing++;const seq=expr();noTrailing--;let where=null;if(accept("where")){noTrailing++;where=expr();noTrailing--}const body=block();return {k:"for",pat,seq,where,body,line,casePat}}
        case "while":{p++;const conds=condList();const body=block();return {k:"while",conds,body,line}}
        case "repeat":{p++;const body=block();expect("while");const c=expr();endStmt();return {k:"repeat",c,body,line}}
        case "return":{p++;let e=null;if(!peek().nl&&!is("}")&&!is(";")&&peek().k!=="eof")e=expr();endStmt();return {k:"return",e,line}}
        case "break":{p++;let label=null;if(peek().k==="id"&&!peek().nl)label=ident();endStmt();return {k:"break",label}}
        case "continue":{p++;let label=null;if(peek().k==="id"&&!peek().nl)label=ident();endStmt();return {k:"continue",label}}
        case "fallthrough":p++;endStmt();return {k:"fallthrough"};
        case "throw":{p++;const e=expr();endStmt();return {k:"throw",e,line}}
        case "do":{p++;const body=block();const catches=[];while(accept("catch")){let pat=null,where=null;if(!is("{")){noTrailing++;pat=catchPattern();if(accept("where"))where=expr();noTrailing--}catches.push({pat,where,body:block()})}return {k:"do",body,catches,line}}
        case "defer":{p++;return {k:"defer",body:block()}}
        case "typealias":{p++;const n=ident();skipGenerics();expect("=");aliases[n]=parseType();endStmt();return {k:"empty"}}
      }
      if(peek().k==="id"&&peek().v==="subscript"&&is("(",1)){p++;const params=paramList();params.forEach(q=>{if(!q.twoNames)q.label=null});expect("->");const ret=parseType();
        let acc;const save=p;p++;if(is("get")||is("set")){p=save;acc=accessorBlock()}else{p=save;acc={get:block()}}
        return {k:"subscript",params,ret,get:acc.get,set:acc.set,setName:acc.setName||"newValue",line,mods}}
      const e=expr();
      const op=peek();
      if(op.k==="op"&&["=","+=","-=","*=","/=","%="].includes(op.v)){p++;const r=expr();endStmt();return {k:"assign",op:op.v,l:e,r,line}}
      endStmt();return {k:"expr",e,line};
    }
    function catchPattern(){
      if(is("let")||is("var")){p++;const name=ident();let type=null;if(accept("as"))type=parseType();return {k:"bind",name,type}}
      return casePattern();
    }
    function postfixOnly(){return postfix(primary())}
    function varDecl(mods){
      const isLet=peek().v==="let";const line=peek().line;p++;
      const decls=[];
      do{
        const pat=pattern(true);let type=null,init=null,getter=null,observers=null;
        if(accept(":"))type=parseType();
        if(accept("=")){init=expr();if(is("{")&&(is("didSet",1)||is("willSet",1)))observers=observerBlock()}
        else if(is("{")&&!isLet){ // computed property or observers
          const save=p;p++;
          if(is("get")||is("set")){p=save;getter=accessorBlock()}
          else if(is("didSet")||is("willSet")){p=save;observers=observerBlock()}
          else{p=save;getter={get:block()}}
        }
        decls.push({pat,type,init,getter,observers});
      }while(accept(","));
      endStmt();
      return {k:"var",isLet,decls,mods,line};
    }
    function accessorBlock(){expect("{");const r={};while(!accept("}")){if(accept("get"))r.get=block();else if(accept("set")){let n="newValue";if(accept("(")){n=ident();expect(")")}r.set=block();r.setName=n}else fail(`line ${peek().line}: expected get or set`)}return r}
    function observerBlock(){expect("{");const r={};while(!accept("}")){const w=ident();let n=w==="didSet"?"oldValue":"newValue";if(accept("(")){n=ident();expect(")")}r[w]={body:block(),name:n}}return r}
    function pattern(top){
      if(accept("(")){const items=[];if(!is(")"))do items.push(pattern(top));while(accept(","));expect(")");return {k:"tuple",items}}
      if(peek().k==="id"&&peek().v==="_"){p++;return {k:"wild"}}
      if(is("let")||is("var")){p++;return pattern(top)}
      return {k:"name",name:ident()};
    }
    function funcDecl(mods){
      const line=peek().line;let name;
      if(accept("init")){name="init";if(accept("?"))fail(`line ${line}: failable initializers (init?) aren't supported in TypeMonkey's runner yet`,"NotSupported")}
      else{p++;if(peek().k==="op"){name=peek().v;p++}else name=ident()}
      skipGenerics();
      const params=paramList();if(!/^[A-Za-z_]/.test(name))params.forEach(q=>q.label=null);  // operators take their values without labels
      let throws=false;if(accept("throws"))throws=true;else accept("rethrows");
      let ret=null;if(accept("->"))ret=parseType();
      skipWhere();
      let body=null;if(is("{"))body=block();
      return {k:"func",name,params,ret,body,throws,mods,line};
    }
    // generics are checked by the Swift compiler, not by TypeMonkey: <T: Comparable> and where clauses are skipped
    function skipGenerics(){if(!is("<"))return;let d=0;do{if(is("<"))d++;else if(is(">"))d--;else if(is(">>"))d-=2;else if(peek().k==="eof")fail("a < is missing its closing >");p++}while(d>0)}
    function skipWhere(){if(!accept("where"))return;while(!is("{")&&peek().k!=="eof")p++}
    function paramList(){
      expect("(");const ps=[];
      if(!is(")"))do{
        let a;if(peek().k==="kw"&&!is("inout")){a=peek().v;p++}else a=ident();let b=null;if(peek().k==="id")b=ident();
        expect(":");let inout=false;if(accept("inout"))inout=true;
        const type=parseType();let variadic=false;if(accept("..."))variadic=true;
        let def=null;if(accept("="))def=expr();
        ps.push({label:a==="_"?null:a,name:b||a,type,def,inout,variadic,twoNames:!!b});
      }while(accept(","));
      expect(")");return ps;
    }
    function parseType(){
      let t;while(is("@")){p++;ident()}
      if(accept("[")){const a=parseType();if(accept(":")){const b=parseType();expect("]");t={k:"dict",key:a,val:b}}else{expect("]");t={k:"arr",el:a}}}
      else if(accept("(")){const items=[],labels=[];if(!is(")"))do{let lb=null;if(peek().k==="id"&&is(":",1)){lb=peek().v;p+=2}labels.push(lb);items.push(parseType())}while(accept(","));expect(")");
        if(accept("throws")){}
        if(accept("->")){const r=parseType();t={k:"fn",params:items,ret:r}}else t=items.length===1?items[0]:{k:"tuple",items,labels}}
      else{if(accept("some")||accept("any")){}
        let name=ident();while(is(".")&&peek(1).k==="id"){p++;name+="."+ident()}
        const args=[];if(is("<")&&!peek().space){p++;do args.push(parseType());while(accept(","));if(is(">>")){tokens[p]={...tokens[p],v:">"};tokens.splice(p,0,{...tokens[p]})}expect(">")}
        t={k:"name",name,args};
        if(aliases[name])t=aliases[name];
        if(name==="Array"&&args.length)t={k:"arr",el:args[0]};
        if(name==="Dictionary"&&args.length===2)t={k:"dict",key:args[0],val:args[1]};
        if(name==="Optional"&&args.length)t={k:"opt",of:args[0]};
      }
      while((is("?")||is("!")||is("??"))&&!peek().space){if(is("??"))t={k:"opt",of:t};p++;t={k:"opt",of:t}}
      return t;
    }
    function typeDecl(){
      const kind=peek().v;const line=peek().line;p++;const name=ident();
      const generics=[];if(is("<")){const save=p;p++;let d=1;while(d>0&&peek().k!=="eof"){if(d===1&&peek().k==="id"&&(is(",",-1)||is("<",-1)))generics.push(peek().v);if(is("<"))d++;else if(is(">"))d--;else if(is(">>"))d-=2;p++}if(d>0)p=save}
      const inherits=[];if(accept(":"))do{let n=ident();while(accept("."))n+="."+ident();skipGenerics();inherits.push(n)}while(accept(","));
      skipWhere();
      expect("{");
      const d={k:"type",kind,name,inherits,members:[],cases:[],line,generics};
      while(!is("}")){
        skipSemis();if(is("}"))break;
        if(peek().k==="eof")fail(`the ${kind} ${name} is missing its closing }`);
        if(kind==="enum"&&(is("case")||(is("indirect")&&is("case",1)))){if(is("indirect"))p++;p++;
          do{const cn=ident();let assoc=null,raw=null;
            if(accept("(")){assoc=[];if(!is(")"))do{let label=null;if(peek().k==="id"&&is(":",1)){label=ident();p++}assoc.push({label,type:parseType()})}while(accept(","));expect(")")}
            if(accept("="))raw=expr();
            d.cases.push({name:cn,assoc,raw})}while(accept(","));
          endStmt();continue}
        if(kind==="protocol"){ // requirements: skip, but keep default-free
          let first=true;while((first||!peek().nl)&&!is("}")&&peek().k!=="eof"){first=false;if(is("{")){let dd=0;do{if(is("{"))dd++;if(is("}"))dd--;p++}while(dd>0)}else p++}
          continue}
        d.members.push(statement());
      }
      expect("}");
      return d;
    }
    function ifStmt(){
      const line=peek().line;p++;const conds=condList();const body=block();let els=null;
      if(accept("else")){if(is("if"))els=[ifStmt()];else els=block()}
      return {k:"if",conds,body,els,line};
    }
    function condList(){
      noTrailing++;const conds=[];
      do{
        if(is("let")||is("var")){const isVar=is("var");p++;
          const pat=pattern();let init=null;if(accept("="))init=expr();else if(pat.k==="name")init={k:"name",v:pat.name,line:peek().line};
          conds.push({k:"bind",pat,init,isVar})}
        else if(is("case")){p++;const pat=casePattern();expect("=");conds.push({k:"case",pat,e:expr()})}
        else conds.push({k:"bool",e:expr()});
      }while(accept(","));
      noTrailing--;return conds;
    }
    function switchStmt(){
      const line=peek().line;p++;noTrailing++;const subject=expr();noTrailing--;expect("{");const cases=[];
      while(!accept("}")){
        if(peek().k==="eof")fail("switch is missing its closing }");
        if(accept("default")){expect(":");cases.push({def:true,body:caseBody(),line:peek().line})}
        else if(accept("case")){const pats=[];do pats.push(casePattern());while(accept(","));let where=null;if(accept("where"))where=expr();expect(":");cases.push({pats,where,body:caseBody()})}
        else fail(`line ${peek().line}: expected case or default inside switch near ${near()}`);
      }
      return {k:"switch",subject,cases,line};
    }
    function caseBody(){const body=[];const line=peek().line;while(!is("case")&&!is("default")&&!is("}")){skipSemis();if(is("case")||is("default")||is("}"))break;body.push(statement())}if(!body.length)fail(`line ${line}: 'case' label in a 'switch' must have at least one executable statement (use break)`);return body}
    function casePattern(){
      if(peek().k==="id"&&peek().v==="_"&&!is(".",1)){p++;return {k:"wild"}}
      if(is("let")||is("var")){p++;
        if(is("(")){p++;const items=[];if(!is(")"))do items.push(peek().v==="_"?(p++,{k:"wild"}):{k:"bind",name:ident()});while(accept(","));expect(")");return {k:"tuple",items}}
        if(is(".")){const cp=casePattern();markBind(cp);return cp}
        const name=ident();
        if(is("?")&&!peek().space){p++;return {k:"some",inner:{k:"bind",name}}}   // case let x?
        if(accept("as"))return {k:"bindas",name,type:parseType()};                // case let n as Int
        return {k:"bind",name}}
      if(is("(")){const save=p;p++;const items=[];let ok=true;
        try{if(!is(")"))do items.push(casePattern());while(accept(","));expect(")")}catch(e){ok=false}
        if(ok&&items.length>1&&(is(":")||is(",")||is("where")||is("=")||is("in")))return {k:"tuple",items};
        p=save}
      if(peek().k==="id"&&/^[A-Z]/.test(peek().v)&&is(".",1)&&peek(2).k==="id"&&is("(",3)){const tyName=peek().v;p++;const cp=casePattern();cp.tyName=tyName;return cp}
      if(is(".")&&(peek(1).k==="id"||is("some",1))){p++;const name=ident();
        if(is("(")){p++;const items=[];if(!is(")"))do{if(peek().k==="id"&&is(":",1))p+=2;items.push(casePattern())}while(accept(","));expect(")");return {k:"enum",name,items}}
        return {k:"enum",name,items:null}}
      if(is("is")){p++;return {k:"is",type:parseType()}}
      const e=expr(true);
      if(is("as")){p++;parseType()}
      return {k:"expr",e};
    }
    function markBind(cp){if(cp.items)cp.items=cp.items.map(x=>x.k==="expr"&&x.e.k==="name"?{k:"bind",name:x.e.v}:x)}

    /* ---- expressions ---- */
    function expr(noColon){return ternary(noColon)}
    function ternary(noColon){
      const c=binary(0);
      if(is("?")&&peek().space){p++;const a=ternary();expect(":");const b=ternary();return {k:"cond",c,a,b}}
      return c;
    }
    const LEVELS=[["||"],["&&"],["==","!=","<",">","<=",">=","===","!=="],["??"],["is","as"],["...","..<"],["+","-","|","^"],["*","/","%","&"],["<<",">>"]];
    function binary(lvl){
      if(lvl>=LEVELS.length)return prefix();
      let l=binary(lvl+1);
      for(;;){
        const t=peek();
        if((t.k==="op"||t.k==="kw")&&LEVELS[lvl].includes(t.v)){
          if(t.v==="&"&&!t.space)return l;
          p++;
          if(t.v==="is"){l={k:"is",e:l,type:parseType(),line:t.line};continue}
          if(t.v==="as"){let mode="as";if(is("?")){p++;mode="as?"}else if(is("!")){p++;mode="as!"}l={k:"as",e:l,type:parseType(),mode,line:t.line};continue}
          if(t.v==="??"){const r=binary(lvl);l={k:"bin",op:"??",l,r,line:t.line};continue}
          if((t.v==="..."||t.v==="..<")&&(peek().nl||is(")")||is("]")||is(",")||is("{")||is(":"))){l={k:"range",lo:l,hi:null,closed:t.v==="...",line:t.line};continue}
          const r=binary(lvl+1);
          l=(t.v==="..."||t.v==="..<")?{k:"range",lo:l,hi:r,closed:t.v==="...",line:t.line}:{k:"bin",op:t.v,l,r,line:t.line};
          continue;
        }
        return l;
      }
    }
    function prefix(){
      const t=peek();
      if(t.k==="op"&&(t.v==="-"||t.v==="!"||t.v==="+"||t.v==="~")&&!(peek(1).space)){p++;const e=prefix();if(t.v==="-"&&e.k==="lit"&&isNumV(e.v))return {k:"lit",v:e.v instanceof D?new D(-e.v.v):-e.v,lit:true};return {k:"un",op:t.v,e,line:t.line}}
      if(t.k==="op"&&(t.v==="..<"||t.v==="...")){p++;return {k:"range",lo:null,hi:prefix(),closed:t.v==="...",line:t.line}}
      if(t.k==="op"&&t.v==="&"){p++;return {k:"inout",e:prefix()}}
      if(is("try")){p++;let mode="try";if(is("?")&&!peek().space){p++;mode="try?"}else if(is("!")&&!peek().space){p++;mode="try!"}return {k:"try",mode,e:prefix()}}
      if(is("await"))fail(`line ${t.line}: async/await isn't supported in TypeMonkey's runner yet`,"NotSupported");
      return postfix(primary());
    }
    function postfix(e){
      for(;;){
        const t=peek();
        if(t.k==="op"&&t.v==="("&&!t.nl){p++;const a=callArgs(")");e={k:"call",f:e,args:a,line:t.line};
          if(is("{")&&!noTrailing&&!peek().nl)e.args.push({label:null,e:closure(),trailing:true});continue}
        if(t.k==="op"&&t.v==="["&&!t.nl&&!t.space){p++;const a=callArgs("]");e={k:"index",e,args:a,line:t.line};continue}
        if(t.k==="op"&&t.v==="."&&(peek(1).k==="id"||peek(1).k==="kw"||peek(1).k==="num")){p++;
          if(peek().k==="num"){const n=peek().v;p++;if(n instanceof D){const [a,b]=String(n.v).split(".");e={k:"member",e:{k:"member",e,name:a,line:t.line},name:b,line:t.line}}else e={k:"member",e,name:String(n),line:t.line};continue}
          const name=peek().v;p++;e={k:"member",e,name,line:t.line};continue}
        if(t.k==="op"&&t.v==="!"&&!t.space){p++;e={k:"force",e,line:t.line};continue}
        if(t.k==="op"&&t.v==="?"&&!t.space&&(is(".",1)||is("[",1)||is("(",1)&&!peek(1).space||peek(1).k==="op"&&["=","+=","-=","*=","/=","%="].includes(peek(1).v))){p++;e={k:"optchain",e,line:t.line};continue}
        if(t.k==="op"&&t.v==="{"&&!noTrailing&&!t.nl&&(e.k==="name"||e.k==="member")){e={k:"call",f:e,args:[{label:null,e:closure(),trailing:true}],line:t.line};continue}
        return e;
      }
    }
    function callArgs(close){
      const a=[];noTrailing++;const save=noTrailing;noTrailing=0;
      if(!is(close))do{
        let label=null;if((peek().k==="id"||peek().k==="kw")&&is(":",1)&&!is("::",1)){label=peek().v;p+=2}
        const t=peek();
        if(t.k==="op"&&OPFNS.includes(t.v)&&(is(",",1)||is(close,1))){p++;a.push({label,e:{k:"opfn",op:t.v}});continue}
        a.push({label,e:expr()});
      }while(accept(","));
      noTrailing=save-1;expect(close);return a;
    }
    function closure(){
      const line=peek().line;expect("{");
      const save=p;let params=null;
      // try: (a, b) in   |   a, b in   |   (a: Int) -> Int in
      try{
        const ps=[];let paren=accept("(");
        if(!(paren&&is(")")))do{const n=peek().v==="_"?(p++,"_"):ident();if(accept(":"))parseType();ps.push(n)}while(accept(","));
        if(paren)expect(")");
        if(accept("throws")){}
        if(accept("->"))parseType();
        if(accept("in"))params=ps;else p=save;
      }catch(e){p=save}
      const body=[];const sv=noTrailing;noTrailing=0;const from=p;
      while(!is("}")){skipSemis();if(is("}"))break;if(peek().k==="eof")fail(`line ${line}: a closure { is missing its closing }`);body.push(statement())}
      // the highest $n the closure uses, so { "\($0):\($1)" } can take a tuple apart
      let dollars=0;for(let q=from;q<p;q++){const tk=tokens[q];if(tk.k==="id"&&/^\$\d+$/.test(tk.v))dollars=Math.max(dollars,+tk.v.slice(1)+1);if(tk.k==="str")for(const x of tk.v)if(typeof x!=="string")for(const m of x.src.matchAll(/\$(\d+)/g))dollars=Math.max(dollars,+m[1]+1)}
      noTrailing=sv;expect("}");
      return {k:"closure",params,body,line,dollars};
    }
    function primary(){
      const t=peek();
      if(t.k==="num"){p++;return {k:"lit",v:t.v,lit:true}}
      if(t.k==="str"){p++;return {k:"str",parts:t.v.map(x=>typeof x==="string"?x:{e:subExpr(x.src,x.line)}),line:t.line}}
      if(t.k==="kw"){
        if(t.v==="true"||t.v==="false"){p++;return {k:"lit",v:t.v==="true"}}
        if(t.v==="nil"){p++;return {k:"lit",v:NIL}}
        if(t.v==="self"){p++;return {k:"self",line:t.line}}
        if(t.v==="super"){p++;return {k:"super",line:t.line}}
        if(t.v==="init"){p++;return {k:"name",v:"init",line:t.line}}
      }
      if(t.k==="op"&&t.v==="("&&peek(1).k==="op"&&OPFNS.includes(peek(1).v)&&is(")",2)){p+=3;return {k:"opfn",op:peek(-2).v}}
      if(t.k==="op"&&t.v==="("){p++;
        if(accept(")"))return {k:"tuple",items:[],labels:[]};
        const items=[],labels=[];
        do{let label=null;if(peek().k==="id"&&is(":",1)){label=ident();p++}labels.push(label);items.push(expr())}while(accept(","));
        expect(")");
        if(items.length===1&&!labels[0])return {k:"paren",e:items[0]};
        return {k:"tuple",items,labels};
      }
      if(t.k==="op"&&t.v==="["){p++;
        const sv=noTrailing;noTrailing=0;
        if(accept(":")){expect("]");noTrailing=sv;return {k:"dictlit",pairs:[],line:t.line}}
        if(accept("]")){noTrailing=sv;
          return {k:"arrlit",items:[],line:t.line}}
        // type-call like [Int]() or [String: Int]()
        const save=p;
        try{const ty=parseType();
          if(accept(":")){const v=parseType();if(accept("]")&&is("(")&&is(")",1)){p+=2;noTrailing=sv;return {k:"emptyof",type:{k:"dict",key:ty,val:v}}}}
          else if(accept("]")&&is("(")&&is(")",1)){p+=2;noTrailing=sv;return {k:"emptyof",type:{k:"arr",el:ty}}}
          else if(is("(")&&peek(-1).v==="]"&&tokens[p-1]&&tokens[p-1].k==="op"){noTrailing=sv;return {k:"name",v:"Array",line:t.line}}
        }catch(e){}
        p=save;
        const first=expr();
        if(accept(":")){const pairs=[[first,expr()]];while(accept(",")){if(is("]"))break;const k=expr();expect(":");pairs.push([k,expr()])}expect("]");noTrailing=sv;return {k:"dictlit",pairs,line:t.line}}
        const items=[first];while(accept(",")){if(is("]"))break;items.push(expr())}
        expect("]");noTrailing=sv;return {k:"arrlit",items,line:t.line};
      }
      if(t.k==="op"&&t.v==="{")return closure();
      // key paths: \.name, \.1, \Item.price
      if(t.k==="op"&&t.v==="\\"){p++;const path=[];if(peek().k==="id")path.push(ident());while(is(".")&&(peek(1).k==="id"||peek(1).k==="num"||peek(1).k==="kw")){p++;const tk=peek();p++;path.push(tk.v instanceof D?String(tk.v.v):String(tk.v))}
        while(path.length>1&&/^[A-Z]/.test(path[0]))path.shift();return {k:"keypath",path,line:t.line}}
      // if and switch can give a value: let x = if a { 1 } else { 2 }
      if(t.k==="kw"&&t.v==="switch")return {k:"switchx",s:switchStmt(),line:t.line};
      if(t.k==="kw"&&t.v==="if")return {k:"ifx",s:ifStmt(),line:t.line};
      if(t.k==="op"&&t.v==="."&&(peek(1).k==="id"||is("some",1))){p++;return {k:"implicit",name:ident(),line:t.line}}
      if(t.k==="id"){p++;
        if(is("<")&&!peek().space&&/^[A-Z]/.test(t.v)){const save=p;try{p++;const args=[];do args.push(parseType());while(accept(","));expect(">");if(is("(")){if(t.v==="Array"&&is(")",1)){p+=2;return {k:"emptyof",type:{k:"arr",el:args[0]}}}if(t.v==="Dictionary"&&is(")",1)){p+=2;return {k:"emptyof",type:{k:"dict",key:args[0],val:args[1]}}}if(t.v==="Set"&&is(")",1)){p+=2;return {k:"emptyof",type:{k:"set",el:args[0]}}}return {k:"name",v:t.v,line:t.line,targs:args}}if(is(".")&&!["Array","Dictionary","Set"].includes(t.v))return {k:"name",v:t.v,line:t.line}}catch(e){}p=save}
        return {k:"name",v:t.v,line:t.line};
      }
      if(t.k==="op"&&t.v==="#")fail(`line ${t.line}: # directives aren't supported in TypeMonkey's runner yet`,"NotSupported");
      fail(`line ${t.line}: unexpected ${near()}`);
    }
    function subExpr(src,line){const sub=parse(lex(src).map(x=>({...x,line})));const e=sub.exprOnly();return e}
    function exprOnly(){const e=expr();if(peek().k!=="eof")fail(`unexpected ${near()} inside \\( ) in a string`);return e}
    return {program,exprOnly};
  }

  /* ---------- runtime ---------- */
  function run(code,input,quiet){
      // Foundation (or UIKit/SwiftUI) adds String(format:), sqrt, pow, .components(separatedBy:) and more
      const foundation=/^\s*import\s+(Foundation|UIKit|SwiftUI|Cocoa|AppKit)\b/m.test(code),mathOK=foundation||/^\s*import\s+(Darwin|Glibc)\b/m.test(code);
      const needF=(line,what)=>{if(!foundation)fail(`line ${line}: ${what} comes from Foundation. Add import Foundation at the top of your program to use it`)};
    let out="",steps=0,depth=0,tryDepth=0;const IN=input==null?"":String(input).replace(/\r/g,"");let inPos=0;
    const W=s=>{out+=s;if(out.length>200000)fail("Your program printed too much, so I stopped it.","Timeout")};
    const t0=Date.now();  // a loop that never ends is stopped after about 3 seconds (or 20 million steps)
    const tick=()=>{if(++steps>20000000||(steps&8191)===0&&Date.now()-t0>3000)fail("Your program ran too long, so I stopped it. Check for a loop that never ends.","Timeout")};
    const types=Object.create(null);     // user types
    const protoDefaults=Object.create(null);
    const globals=new Env(null);

    function Env(parent){this.vars=new Map();this.parent=parent;this.self=parent?parent.self:null;this.selfType=parent?parent.selfType:null;this.mutSelf=parent?parent.mutSelf:false;this.inInit=parent?parent.inInit:false;this.selfRef=parent?parent.selfRef:null}
    Env.prototype.find=function(n){let e=this;while(e){if(e.vars.has(n))return e.vars.get(n);e=e.parent}return null};
    Env.prototype.def=function(n,cell,line){if(this.vars.has(n)&&!(this.vars.get(n).fn))fail(`line ${line}: invalid redeclaration of '${n}'`);this.vars.set(n,cell)};
    const cell=(v,type,isLet)=>({v,type,isLet,set:false});

    /* ----- types ----- */
    function tname(t){if(!t)return "?";switch(t.k){case "name":return t.name;case "arr":return "["+tname(t.el)+"]";case "dict":return "["+tname(t.key)+": "+tname(t.val)+"]";case "opt":return tname(t.of)+"?";case "tuple":return "("+t.items.map(tname).join(", ")+")";case "fn":return "("+t.params.map(tname).join(", ")+") -> "+tname(t.ret);case "set":return "Set<"+tname(t.el)+">"}return "?"}
    function typeOfV(v){
      if(typeof v==="number")return "Int";if(v instanceof D)return v.f32?"Float":"Double";if(typeof v==="string")return "String";if(typeof v==="boolean")return "Bool";if(v instanceof Chr)return "Character";
      if(v===NIL)return "nil";if(v instanceof Some)return typeOfV(v.v)+"?";
      if(v instanceof Arr)return "["+(v.et?tname(v.et):v.items.length?typeOfV(v.items[0]):"Any")+"]";
      if(v instanceof Dict)return "["+(v.kt?tname(v.kt):"Any")+": "+(v.vt?tname(v.vt):"Any")+"]";
      if(v instanceof SetV)return "Set<"+(v.et?tname(v.et):"Any")+">";
      if(v instanceof Obj)return v.type.name;if(v instanceof ECase)return v.type.name;if(v instanceof Tup)return "("+v.items.map(typeOfV).join(", ")+")";
      if(v instanceof Range)return v.closed?"ClosedRange<Int>":"Range<Int>";if(v instanceof Fn)return "function";return "Any"}
    const typeFromV=v=>typeof v==="number"?{k:"name",name:"Int"}:v instanceof D?{k:"name",name:"Double"}:typeof v==="string"?{k:"name",name:"String"}:typeof v==="boolean"?{k:"name",name:"Bool"}:v instanceof Chr?{k:"name",name:"Character"}:v instanceof Obj?{k:"name",name:v.type.name}:v instanceof Arr?{k:"arr",el:v.et}:v instanceof Dict?{k:"dict",key:v.kt,val:v.vt}:null;
    // convert a value to a declared type. lit: the value came straight from a literal
    function conform(v,t,line,lit,what){
      if(!t)return v;
      const mism=()=>fail(`line ${line}: cannot ${what||"convert value"} of type '${typeOfV(v)}' to ${what?"type":"specified type"} '${tname(t)}'`);
      if(t.k==="opt"){if(v===NIL)return NIL;if(v instanceof Some)return new Some(conform(v.v,t.of,line,lit,what));return new Some(conform(v,t.of,line,lit,what))}
      if(v===NIL){if(t.k==="name"&&["Any","AnyObject"].includes(t.name))return v;fail(`line ${line}: 'nil' cannot be assigned to type '${tname(t)}' (only optionals like ${tname(t)}? can hold nil)`)}
      if(v instanceof Some){if(t.k==="name"&&t.name==="Any")return v;fail(`line ${line}: value of optional type '${typeOfV(v)}' must be unwrapped to a value of type '${tname(t)}'. Use if let, ?? or !`)}
      if(t.k==="tuple"){if(!(v instanceof Tup)||v.items.length!==t.items.length)mism();return new Tup(v.items.map((x,i)=>conform(x,t.items[i],line,lit,what)),t.labels.map((l,i)=>l||v.labels[i]||null))}
      if(t.k==="name"&&t.name==="Set"){if(v instanceof SetV)return v;if(v instanceof Arr){const st=new SetV(t.args[0]||v.et);for(const x of v.items)st.m.set(hkey(x),conform(x,t.args[0],line,lit,what));return st}mism()}
      if(t.k==="name"){
        if(IRANGE[t.name]){if(typeof v!=="number")mism();const [lo,hi]=IRANGE[t.name];if(v<lo||v>hi){if(lit)fail(`line ${line}: integer literal '${v}' overflows when stored into '${t.name}'`);fatal("arithmetic overflow")}return v}
        switch(t.name){
          case "Int":if(typeof v==="number")return v;if(v instanceof D&&lit)fail(`line ${line}: cannot convert value of type 'Double' to specified type 'Int'`);mism();
          case "Float":if(v instanceof D)return v.f32?v:F32(v.v);if(typeof v==="number"&&lit)return F32(v);mism();
          case "Double":case "CGFloat":if(v instanceof D)return v.f32?new D(v.v):v;if(typeof v==="number"&&lit)return new D(v);mism();
          case "String":if(typeof v==="string")return v;mism();
          case "Bool":if(typeof v==="boolean")return v;mism();
          case "Character":if(v instanceof Chr)return v;if(typeof v==="string"&&lit&&[...v].length===1)return new Chr(v);mism();
          case "Any":case "AnyObject":return v;
        }
        if(types[t.name]){const ty=types[t.name];
          if(ty.kind==="protocol"){if((v instanceof Obj||v instanceof ECase)&&conforms(v.type,t.name))return v;mism()}
          if(v instanceof Obj&&(v.type===ty||isSub(v.type,ty)))return v;if(v instanceof ECase&&v.type===ty)return v;mism()}
        return v;
      }
      if(t.k==="arr"){if(!(v instanceof Arr))mism();const a=new Arr(v.items.map(x=>conform(x,t.el,line,lit||v.lit,what)),t.el);return a}
      if(t.k==="dict"){if(!(v instanceof Dict))mism();const d=new Dict(t.key,t.val);for(const [k,[kk,vv]] of v.m)d.m.set(k,[kk,conform(vv,t.val,line,lit||v.lit,what)]);return d}
      if(t.k==="name"&&t.name==="Set"){return v}
      return v;
    }
    function isSub(a,b){for(let t=a.sup;t;t=t.sup)if(t===b)return true;return false}
    function conforms(ty,proto){for(let t=ty;t;t=t.sup)if(t.inherits.includes(proto))return true;return false}

    /* ----- copying (value semantics) ----- */
    function copy(v){
      if(v instanceof Arr){const a=new Arr(v.items.map(copy),v.et);if(v.off)a.off=v.off;if(v.rev)a.rev=v.rev;if(v.revStr)a.revStr=v.revStr;return a}
      if(v instanceof Dict){const d=new Dict(v.kt,v.vt);for(const [k,[a,b]] of v.m)d.m.set(k,[a,copy(b)]);return d}
      if(v instanceof SetV){const s=new SetV(v.et);for(const [k,x] of v.m)s.m.set(k,x);return s}
      if(v instanceof Obj&&v.type.kind==="struct"){const o=new Obj(v.type);for(const k in v.f)o.f[k]=copy(v.f[k]);return o}
      if(v instanceof Tup)return new Tup(v.items.map(copy),v.labels);
      if(v instanceof Some)return new Some(copy(v.v));
      return v;
    }

    /* ----- printing ----- */
    // Swift prints the shortest digits that read back as the same value; big and tiny values use e+XX
    function dbl(x,f32){
      if(isNaN(x))return "nan";if(!isFinite(x))return x>0?"inf":"-inf";
      if(x===0)return Object.is(x,-0)?"-0.0":"0.0";
      if(f32){for(let p=1;p<=9;p++){const y=+x.toPrecision(p);if(Math.fround(y)===x){x=y;break}}}
      const a=Math.abs(x);
      if(a<(f32?16777216:9007199254740992)&&a>=1e-4){let s=String(x);if(/e/.test(s)){s=x.toFixed(20).replace(/0+$/,"")}if(!s.includes("."))s+=".0";return s}
      let [m,ex]=x.toExponential().split("e");const n=parseInt(ex);return m+"e"+(n<0?"-":"+")+String(Math.abs(n)).padStart(2,"0");
    }
    function desc(v,inner){
      if(v===undefined||v===null)return "()";
      if(v&&v.isTypeName&&!v.ns)return v.isTypeName;if(v&&v.isType)return v.ty.name;
      if(typeof v==="string")return inner?JSON.stringify(v):v;
      if(typeof v==="number")return v>=9223372036854775807?"9223372036854775807":v<=-9223372036854775808?"-9223372036854775808":Number.isSafeInteger(v)?String(v):BigInt(v).toString();
      if(v instanceof D)return dbl(v.v,v.f32);
      if(typeof v==="boolean")return v?"true":"false";
      if(v instanceof Chr)return inner?JSON.stringify(v.s):v.s;
      if(v instanceof Arr&&v.revStr)return `ReversedCollection<String>(_base: ${JSON.stringify(v.items.map(c=>c.s).reverse().join(""))})`;
      if(v instanceof Arr&&v.rev)return `ReversedCollection<Array<${v.et?tname(v.et):v.items.length?typeOfV(v.items[0]):"Int"}>>(_base: [${v.items.slice().reverse().map(x=>desc(x,true)).join(", ")}])`;
      if(v===NIL)return "nil";
      if(v instanceof Some)return "Optional("+desc(v.v,true)+")";
      if(v instanceof Arr)return "["+v.items.map(x=>desc(x,true)).join(", ")+"]";
      if(v instanceof Dict)return v.m.size?"["+[...v.m.values()].map(([k,x])=>desc(k,true)+": "+desc(x,true)).join(", ")+"]":"[:]";
      if(v instanceof SetV)return "["+[...v.m.values()].map(x=>desc(x,true)).join(", ")+"]";
      if(v instanceof Tup)return "("+v.items.map((x,i)=>(v.labels[i]?v.labels[i]+": ":"")+desc(x,true)).join(", ")+")";
      if(v instanceof Range)return desc(v.lo)+(v.closed?"...":"..<")+desc(v.hi);
      if(v instanceof ECase){
        // inside an array, optional, tuple or struct Swift writes the full name: main.Dir.north
        const d=findDesc(v);if(d!==null)return d;
        const q=inner?"main."+(v.type.qname||v.type.name)+".":"";
        if(v.vals){const cd=v.type.cases.find(c=>c.name===v.name);const lab=i=>cd.assoc[i]&&cd.assoc[i].label?cd.assoc[i].label+": ":"";
          if(v.vals.length===1&&!lab(0)&&v.vals[0] instanceof Tup)return q+v.name+desc(v.vals[0],true);
          return q+v.name+"("+v.vals.map((x,i)=>lab(i)+desc(x,true)).join(", ")+")"}
        return q+v.name}
      if(v instanceof Obj){
        const d=findDesc(v);if(d!==null)return d;
        if(v.type.kind==="struct")return (inner?"main."+(v.type.qname||v.type.name):v.type.name)+genArgs(v)+"("+v.type.stored.map(f=>f.name+": "+desc(v.f[f.name],true)).join(", ")+")";
        return "main."+v.type.name;
      }
      if(v instanceof Fn)return "(Function)";
      return String(v);
    }
    function findDesc(o){
      if(!conformsAny(o.type,["CustomStringConvertible"]))return null;
      const pr=findProp(o.type,"description");if(!pr)return null;
      if(o instanceof ECase){if(!pr.computed)return null;const ce=new Env(globals);ce.self=o;ce.selfType=o.type;return desc(runBody(pr.computed.get,ce,true))}
      return desc(getProp(o,"description",0));
    }
    // Pair<Int, String>(first: 1, second: "one"): a generic struct prints its type arguments
    function genArgs(o){const g=o.type.generics;if(!g||!g.length)return "";
      return "<"+g.map((G,i)=>{if(o.targs&&o.targs[i])return tyName(o.targs[i]);
        for(const s of storedAll(o.type)){const t=s.type,v=o.f[s.name];if(!t||v===undefined)continue;
          if(t.k==="name"&&t.name===G)return runtimeType(v);
          if(t.k==="opt"&&t.of.k==="name"&&t.of.name===G&&v instanceof Some)return runtimeType(v.v);
          if(t.k==="arr"&&t.el.k==="name"&&t.el.name===G&&v instanceof Arr&&v.items.length)return runtimeType(v.items[0])}
        return "Any"}).join(", ")+">"}
    function conformsAny(ty,names){for(let t=ty;t;t=t.sup)if(t.inherits.some(n=>names.includes(n)))return true;return false}

    /* ----- user types ----- */
    function declareType(d){
      if(d.kind==="extension"){
        const target=types[d.name];
        if(!target){const bn=BEXT[d.name];
          if(bn){const t=bext[bn]||(bext[bn]=newTy(bn,"builtin",[],d.line));t.inherits.push(...d.inherits);addMembers(t,d.members,true);return}
          fail(`line ${d.line}: cannot find type '${d.name}' in scope`)}
        target.inherits.push(...d.inherits);
        addMembers(target,d.members,true);return;
      }
      if(types[d.name])fail(`line ${d.line}: invalid redeclaration of '${d.name}'`);
      const ty=newTy(d.name,d.kind,d.cases,d.line);ty.inherits=d.inherits.slice();ty.generics=d.generics;
      types[d.name]=ty;
      addMembers(ty,d.members,false);
    }
    function newTy(name,kind,cases,line){return {name,kind,inherits:[],stored:[],computed:Object.create(null),methods:Object.create(null),statics:Object.create(null),staticMethods:Object.create(null),inits:[],cases,line,sup:null,observers:Object.create(null)}}
    // extensions on built-in types: extension Int { ... } is kept in bext.Int
    const BEXT={Int:"Int",Double:"Double",Float:"Double",String:"String",Bool:"Bool",Character:"Character",Array:"Array",Collection:"Array",Sequence:"Array",Dictionary:"Dictionary",Set:"Set"};
    const bext=Object.create(null);
    const extOf=b=>typeof b==="number"?bext.Int:b instanceof D?bext.Double:typeof b==="string"?bext.String:typeof b==="boolean"?bext.Bool:b instanceof Chr?bext.Character:b instanceof Arr?bext.Array:b instanceof Dict?bext.Dictionary:b instanceof SetV?bext.Set:undefined;
    function addMembers(ty,members,isExt){
      for(const m of members){
        if(m.k==="var"){
          const isStatic=m.mods.includes("static")||m.mods.includes("class");
          for(const dd of m.decls){
            const name=dd.pat.name;
            if(isStatic){ty.statics[name]={decl:dd,isLet:m.isLet,ready:false};continue}
            if(dd.getter){ty.computed[name]=dd.getter;continue}
            if(isExt)fail(`line ${m.line}: extensions can't add stored properties (only computed ones)`);
            ty.stored.push({name,type:dd.type,init:dd.init,isLet:m.isLet,lazy:m.mods.includes("lazy")});
            if(dd.observers)ty.observers[name]=dd.observers;
          }
        }else if(m.k==="func"){
          const isStatic=m.mods.includes("static")||m.mods.includes("class");
          const f={...m,isStatic,mutating:m.mods.includes("mutating"),owner:ty};
          if(m.name==="init"){f.fromExt=isExt;ty.inits.push(f);continue}
          const bag=isStatic?ty.staticMethods:ty.kind==="protocol"?(protoDefaults[ty.name]||(protoDefaults[ty.name]=Object.create(null))):ty.methods;
          if(bag[m.name]){(bag[m.name].overloads||(bag[m.name].overloads=[bag[m.name]])).push(f)}else bag[m.name]=f;
        }else if(m.k==="type"){declareType(m);types[m.name].qname=(ty.qname||ty.name)+"."+m.name;(ty.nested||(ty.nested=Object.create(null)))[m.name]=true}
        else if(m.k==="empty"){}
        else if(m.k==="subscript"){ty.subscript={...m,owner:ty}}
        else fail(`line ${m.line||"?"}: only properties, methods and initializers can go inside a type here`);
      }
    }
    // checks Swift's compiler makes on a type before anything runs
    function checkType(ty){
      if(ty.kind==="class")for(const n in ty.methods){const fs=ty.methods[n].overloads||[ty.methods[n]];for(const f of fs){
        const parent=ty.sup&&findMethod(ty.sup,n);const has=parent&&parent.owner&&parent.owner.kind==="class";
        if(has&&!f.mods.includes("override"))fail(`line ${f.line}: overriding declaration requires an 'override' keyword (write override func ${n})`);
        if(!has&&f.mods.includes("override"))fail(`line ${f.line}: method does not override any method from its superclass`)}}
      if(ty.kind==="struct"||ty.kind==="enum")for(const n in ty.methods)for(const f of ty.methods[n].overloads||[ty.methods[n]]){
        if(f.mutating||f.isStatic||!f.body)continue;
        const props=new Set(ty.stored.map(x=>x.name));const locals=new Set(f.params.map(q=>q.name));
        const bad=findSelfAssign(f.body,props,locals);
        if(bad)fail(`line ${bad}: cannot assign to property: 'self' is immutable. Mark the method 'mutating' (mutating func ${n})`)}
    }
    function findSelfAssign(list,props,locals){
      for(const st of list)if(st.k==="var")for(const d of st.decls){const walk=p2=>{if(p2.k==="name")locals.add(p2.name);else if(p2.k==="tuple")p2.items.forEach(walk)};walk(d.pat)}
      for(const st of list){
        if(st.k==="assign"){let l=st.l;while(l.k==="member"||l.k==="index"||l.k==="paren")l=l.e;
          if(l.k==="self"||l.k==="name"&&props.has(l.v)&&!locals.has(l.v))return st.line}
        const subs=[st.body,st.els,...(st.cases||[]).map(c=>c.body),...(st.catches||[]).map(c=>c.body)].filter(Array.isArray);
        for(const b of subs){const r=findSelfAssign(b,props,new Set(locals));if(r)return r}
      }
      return 0;
    }
    function linkTypes(){
      for(const ty of Object.values(types)){
        if(ty.kind==="class"&&!ty.inits.length&&ty.stored.some(s=>!s.init&&!s.lazy&&!(s.type&&s.type.k==="opt")))fail(`line ${ty.line}: class '${ty.name}' has no initializers. Give every property a starting value, or write an init`);
        if(ty.kind==="class"&&ty.inherits.length&&types[ty.inherits[0]]&&types[ty.inherits[0]].kind==="class")ty.sup=types[ty.inherits[0]];
        if(ty.kind==="struct"&&ty.inherits.some(n=>types[n]&&types[n].kind==="class"))fail(`line ${ty.line}: a struct can't inherit from a class (only classes can)`);
        if(ty.kind==="enum"){
          const rawT=ty.inherits.find(n=>["Int","String","Double","Character"].includes(n));ty.rawType=rawT||null;let next=0;
          ty.caseVals=ty.cases.map(c=>{let raw=null;if(rawT){if(c.raw)raw=ev(c.raw,globals);else if(rawT==="Int")raw=next;else if(rawT==="String")raw=c.name;if(rawT==="Int")next=raw+1}
            const v=new ECase(ty,c.name,null);v.raw=raw;return v});
        }
      }
      for(const ty of Object.values(types))checkType(ty);
    }
    function findMethod(ty,n){for(let t=ty;t;t=t.sup){if(t.methods[n])return t.methods[n]}
      for(let t=ty;t;t=t.sup)for(const pn of t.inherits){const pd=protoDefaults[pn];if(pd&&pd[n])return pd[n];const pt=types[pn];if(pt&&pt.kind==="protocol"){const r=protoInherit(pt,n);if(r)return r}}
      return null}
    function protoInherit(pt,n){for(const pn of pt.inherits){const pd=protoDefaults[pn];if(pd&&pd[n])return pd[n]}return null}
    function findProp(ty,n){for(let t=ty;t;t=t.sup){if(t.computed[n])return {computed:t.computed[n],owner:t};if(t.stored.some(s=>s.name===n))return {stored:true,owner:t}}
      for(let t=ty;t;t=t.sup)for(const pn of t.inherits){const pt=types[pn];if(pt&&pt.computed[n])return {computed:pt.computed[n],owner:t}}return null}
    function getProp(o,n,line){
      if(n in o.f)return o.f[n];
      const pr=findProp(o.type,n);
      if(pr&&pr.computed){const e=new Env(globals);e.self=o;e.selfType=pr.owner;return runBody(pr.computed.get,e,true)}
      // lazy var: worked out the first time it's used
      const lz=storedAll(o.type).find(s=>s.name===n&&s.lazy);
      if(lz){const e=new Env(globals);e.self=o;e.selfType=o.type;return o.f[n]=conform(copy(ev(lz.init,e)),lz.type,line,isLitE(lz.init))}
      return undefined;
    }
    function staticGet(ty,n,line){
      for(let t=ty;t;t=t.sup){const s=t.statics[n];if(s){if(!s.ready){s.ready=true;const e=new Env(globals);e.selfType=t;s.v=s.decl.init?conform(ev(s.decl.init,e),s.decl.type,line,isLitE(s.decl.init)):NIL;if(s.decl.getter){s.computed=s.decl.getter}}if(s.computed){const e=new Env(globals);e.selfType=t;return {v:runBody(s.computed.get,e,true),isLet:true}}return s}}
      return null;
    }
    function construct(ty,args,line){
      if(ty.kind==="protocol")fail(`line ${line}: '${ty.name}' is a protocol, so you can't make one directly. Make a type that conforms to it`);
      if(ty.kind==="enum"){if(ty.rawType&&args.length===1&&args[0].label==="rawValue"){const v=ty.caseVals.find(c=>equal(c.raw,args[0].v));return v?new Some(v):NIL}fail(`line ${line}: enums are made with a dot, like ${ty.name}.${ty.cases[0]?ty.cases[0].name:"someCase"}`)}
      const o=new Obj(ty);
      const inits=allInits(ty);
      // a struct keeps its memberwise init when its own inits all come from extensions
      if(!inits.length||ty.kind==="struct"&&inits.every(f=>f.fromExt)&&!inits.some(f=>labelsFit(f.params,args))){
        if(ty.kind==="class"){
          if(args.length)fail(`line ${line}: argument passed to call that takes no arguments (give ${ty.name} an init)`);
          initStored(o,ty,line);
          for(const s of storedAll(ty))if(!(s.name in o.f)&&!s.lazy)fail(`line ${ty.line}: class '${ty.name}' has no initializers (property '${s.name}' needs a default value or an init)`);
          return o;
        }
        memberwise(o,ty,args,line);
        return o;
      }
      const init=pickFn(inits,args,line,`${ty.name}(`);
      initStored(o,ty,line);
      callInit(o,init,args,line);
      return o;
    }
    function memberwise(o,ty,args,line){
      initStored(o,ty,line,true);
      const need=ty.stored.filter(s=>!(s.isLet&&s.init));let ai=0;
      for(const s of need){
        const a=args[ai];
        if(a&&a.label===s.name){o.f[s.name]=conform(copy(a.v),s.type||typeFromV(o.f[s.name]),line,a.lit,"convert value");ai++}
        else if(s.init||s.type&&s.type.k==="opt"&&!s.isLet){}
        else fail(`line ${line}: missing argument for parameter '${s.name}' in call`);
      }
      if(ai<args.length){const a=args[ai];fail(`line ${line}: ${a.label?`extra argument '${a.label}' in call`:"extra argument in call"}${a.label&&need.some(s=>s.name===a.label)?` (arguments go in the order the properties are listed)`:""}`)}
    }
    function allInits(ty){for(let t=ty;t;t=t.sup){if(t.inits.length)return t.inits;if(t!==ty&&false)break;if(t.stored.some(x=>!x.init&&!(x.type&&x.type.k==="opt"))&&t!==ty)break}return []}
    function storedAll(ty){const r=[];for(let t=ty;t;t=t.sup)r.push(...t.stored);return r}
    function initStored(o,ty,line,memberwise){
      const chain=[];for(let t=ty;t;t=t.sup)chain.unshift(t);
      for(const t of chain)for(const s of t.stored){
        if(s.lazy)continue;
        if(s.init){const e=new Env(globals);o.f[s.name]=conform(copy(ev(s.init,e)),s.type,line,isLitE(s.init));}
        else if(s.type&&s.type.k==="opt")o.f[s.name]=NIL;
      }
    }
    function callInit(o,init,args,line){
      const e=new Env(globals);e.self=o;e.selfType=init.owner;e.mutSelf=true;e.inInit=true;
      bindArgs(init,args,e,line);
      runBody(init.body,e,false);
      for(const s of storedAll(o.type))if(!(s.name in o.f)&&!s.lazy)fail(`line ${init.line}: return from initializer without initializing all stored properties (self.${s.name} isn't set)`);
    }

    /* ----- functions ----- */
    function pickFn(list,args,line,what){
      if(list.length===1&&!list[0].overloads)return list[0];
      const all=list.flatMap(f=>f.overloads||[f]);
      const fits=all.filter(f=>labelsFit(f.params,args));
      if(!fits.length)return all[0];
      if(fits.length===1)return fits[0];
      const score=f=>f.params.reduce((s,pr,i)=>{const a=args[i];if(!a)return s;const tn=pr.type&&pr.type.k==="name"?pr.type.name:null;const at=typeOfV(a.v);return s+(tn===at?2:tn==="Double"&&at==="Int"&&a.lit?1:tn&&tn!==at?-5:0)},0);
      return fits.sort((a,b)=>score(b)-score(a))[0];
    }
    // a trailing closure { ... } fills the next parameter that takes a function, whatever its label
    const trailFits=(a,pr)=>a&&a.trailing&&!a.label&&(!pr.type||pr.type.k==="fn"||pr.type.k==="opt"&&pr.type.of.k==="fn");
    function labelsFit(params,args){let i=0;for(const pr of params){if(pr.variadic)return true;const a=args[i];if(a&&((a.label||null)===pr.label||trailFits(a,pr))){i++;continue}if(pr.def)continue;return false}return i===args.length}
    function bindArgs(f,args,env,line){
      let i=0;const ps=f.params;
      for(const pr of ps){
        const a=args[i];
        if(pr.variadic){const rest=args.slice(i).map(x=>conform(x.v,pr.type,line,x.lit,"convert value"));env.vars.set(pr.name,cell(new Arr(rest,pr.type),{k:"arr",el:pr.type},true));i=args.length;continue}
        if(a&&((a.label||null)===pr.label||trailFits(a,pr))){
          let v;
          if(pr.inout){if(!a.ref)fail(`line ${line}: passing value of type '${typeOfV(a.v)}' to an inout parameter requires an explicit '&'`);env.vars.set(pr.name,a.ref);i++;continue}
          if(a.ref)fail(`line ${line}: '&' can only be used with inout parameters`);
          v=conform(copy(a.v),pr.type,line,a.lit,"convert value");
          env.vars.set(pr.name,cell(v,pr.type,true));i++;continue}
        if(pr.def){env.vars.set(pr.name,cell(conform(ev(pr.def,env),pr.type,line,isLitE(pr.def)),pr.type,true));continue}
        if(a&&a.label&&!pr.label)fail(`line ${line}: extraneous argument label '${a.label}:' in call`);
        if(a&&!a.label&&pr.label)fail(`line ${line}: missing argument label '${pr.label}:' in call`);
        if(a&&a.label!==pr.label)fail(`line ${line}: incorrect argument label in call (have '${a.label}:', expected '${pr.label}:')`);
        fail(`line ${line}: missing argument for parameter ${pr.label?`'${pr.label}'`:"#"+(i+1)} in call`);
      }
      if(i<args.length)fail(`line ${line}: extra argument${args[i].label?` '${args[i].label}'`:""} in call`);
    }
    function callFn(f,args,line,self,selfType){
      tick();
      if(f.builtin)return f.builtin(args.map(a=>a.v),args,line);
      if(f.closure)return callClosure(f,args,line);
      return callDecl(f,args,line,self,selfType);
    }
    const MAXDEPTH=20000;
    function tooDeep(){depth=0;fatal("stack overflow (a function keeps calling itself). Check your stopping case.")}
    function callClosure(f,args,line){
      const e=new Env(f.env);
      if(f.params){
        // { (a, b) in ... } called with one tuple (like a dictionary entry) takes the tuple apart
        if(f.params.length>1&&args.length===1&&args[0].v instanceof Tup&&args[0].v.items.length===f.params.length)args=args[0].v.items.map(v=>({v}));
        if(f.params.length!==args.length&&!(f.params.length===1&&args.length>1))fail(`line ${line}: this closure takes ${f.params.length} argument(s) but got ${args.length}`);
        if(f.params.length===1&&args.length>1)e.vars.set(f.params[0],cell(new Tup(args.map(a=>a.v)),null,true));
        else f.params.forEach((n,i)=>{if(n!=="_")e.vars.set(n,args[i].ref||cell(args[i].v,null,true))})}
      else{
        if(f.dollars>1&&args.length===1&&args[0].v instanceof Tup)args=args[0].v.items.map(v=>({v}));
        for(let i=0;i<args.length;i++)e.vars.set("$"+i,args[i].ref||cell(args[i].v,null,true));
      }
      if(++depth>MAXDEPTH)tooDeep();
      // no try/finally here (it would make the frame bigger): code that catches a thrown error puts depth and tryDepth back
      const td=tryDepth;tryDepth=0;
      const r=runBody(f.body,e,true);depth--;tryDepth=td;return r;
    }
    // callDecl, binop, exec and ev keep few local variables: their JavaScript frames stay small, so a learner's
    // recursive function can go thousands of calls deep
    function callDecl(f,args,line,self,selfType){
      const fn=f.decl,e=declEnv(f,fn,args,line,self,selfType),td=tryDepth;
      tryDepth=0;
      const r=finishCall(fn,runBody(fn.body,e,true,fn.ret===null));depth--;tryDepth=td;return r;
    }
    function declEnv(f,fn,args,line,self,selfType){
      if(fn.throws&&!tryDepth)fail(`line ${line}: call can throw but is not marked with 'try'. Write try in front of the call (inside do { } catch { })`);const sf=f.self!==undefined?f.self:self;
      const e=new Env(f.env||globals);e.self=sf;e.selfType=f.selfType||selfType||null;e.mutSelf=!!(fn.mutating&&f.mutable)||(sf instanceof Obj&&sf.type.kind==="class");
      if(f.selfRef)e.selfRef=f.selfRef;
      if(f.selfType&&(f.selfType.kind==="struct"||f.selfType.kind==="builtin")&&!fn.mutating)e.mutSelf=false;
      bindArgs(fn,args,e,line);
      if(++depth>MAXDEPTH)tooDeep();
      return e;
    }
    function finishCall(fn,r){
      if(fn.ret){if(r===undefined)fail(`line ${fn.line}: missing return in a function expected to return '${tname(fn.ret)}'`);return conform(r,fn.ret,fn.line,false,"convert return expression")}
      if(r!==undefined&&r!==null&&!(r instanceof Tup&&!r.items.length)&&fn.body.length>0&&!fn.implicitVoid)fail(`line ${fn.line}: unexpected non-void return value in void function`);
      return r;
    }
    function findSub(ty){for(let t=ty;t;t=t.sup)if(t.subscript)return t.subscript;return null}
    // if / switch used as a value: each branch is a single expression
    function exprSwitch(s,env){const v=ev(s.subject,env);for(const c of s.cases){if(c.def)continue;const e2=new Env(env);if(c.pats.some(p2=>match(p2,v,e2))&&(!c.where||truth(ev(c.where,e2))))return branchVal(c.body,e2,s.line)}
      const d=s.cases.find(c=>c.def);if(d)return branchVal(d.body,new Env(env),s.line);fail(`line ${s.line}: switch must be exhaustive. Add a default: case`)}
    function exprIf(s,env){const e2=new Env(env);if(conds(s.conds,e2,s.line))return branchVal(s.body,e2,s.line);if(!s.els)fail(`line ${s.line}: 'if' must have an unconditional 'else' to be used as an expression`);
      if(s.els.length===1&&s.els[0].k==="if")return exprIf(s.els[0],env);return branchVal(s.els,new Env(env),s.line)}
    function branchVal(body,env,line){if(body.length===1){const st=body[0];if(st.k==="expr")return ev(st.e,env);if(st.k==="if")return exprIf(st,env);if(st.k==="switch")return exprSwitch(st,env);if(st.k==="throw")exec(st,env)}
      fail(`line ${line}: each branch of an if or switch that gives a value must be a single value`)}
    const exprBranches=st=>st.k==="expr"||st.k==="throw"||st.k==="if"&&st.els&&st.body.length===1&&exprBranches(st.body[0])&&st.els.length===1&&exprBranches(st.els[0])||st.k==="switch"&&st.cases.every(c=>c.body.length===1&&exprBranches(c.body[0]));
    function runBody(body,env,implicit,voidFn){
      // a single expression is returned automatically (closures, functions, getters)
      try{
        if(implicit&&body.length===1){const st=body[0];
          if(st.k==="expr"){const v=ev(st.e,env);return voidFn?undefined:v}
          if(!voidFn&&(st.k==="if"||st.k==="switch")&&exprBranches(st))return st.k==="if"?exprIf(st,env):exprSwitch(st,env)}
        if(body.plain===undefined)body.plain=isPlain(body);
        if(!body.plain){execListFull(body,env);return undefined}
        for(let i=0;i<body.length;i++)exec(body[i],env);
        return undefined;
      }catch(x){if(x instanceof Ret)return x.v;throw x}
    }

    /* ----- equality and comparison ----- */
    function equal(a,b){
      if(a instanceof Some&&b instanceof Some)return equal(a.v,b.v);
      if(a===NIL||b===NIL)return a===b;
      if(a instanceof Some)return equal(a.v,b);if(b instanceof Some)return equal(a,b.v);
      if(isNumV(a)&&isNumV(b))return num(a)===num(b);
      if(a instanceof Chr&&b instanceof Chr)return a.s===b.s;
      if(a instanceof SIdx&&b instanceof SIdx)return a.i===b.i;
      if(a instanceof Chr&&typeof b==="string")return a.s===b;if(b instanceof Chr&&typeof a==="string")return a===b.s;
      if(a instanceof Arr&&b instanceof Arr)return a.items.length===b.items.length&&a.items.every((x,i)=>equal(x,b.items[i]));
      if(a instanceof Dict&&b instanceof Dict)return a.m.size===b.m.size&&[...a.m].every(([k,[,v]])=>b.m.has(k)&&equal(v,b.m.get(k)[1]));
      if(a instanceof SetV&&b instanceof SetV)return a.m.size===b.m.size&&[...a.m.keys()].every(k=>b.m.has(k));
      if(a instanceof Tup&&b instanceof Tup)return a.items.length===b.items.length&&a.items.every((x,i)=>equal(x,b.items[i]));
      if(a instanceof ECase&&b instanceof ECase)return a.type===b.type&&a.name===b.name&&(!a.vals||a.vals.every((x,i)=>equal(x,b.vals[i])));
      if(a instanceof Obj&&b instanceof Obj){
        const m=findOp(a.type,"==");if(m)return truth(callFn({decl:m,selfType:a.type},[{v:a},{v:b}],0));
        if(a.type.kind==="struct"&&conformsAny(a.type,["Equatable","Hashable","Comparable"]))return a.type===b.type&&storedAll(a.type).every(s=>equal(a.f[s.name],b.f[s.name]));
        fail(`binary operator '==' cannot be applied to two '${a.type.name}' operands (add : Equatable to the type)`);
      }
      return a===b;
    }
    function cmp(a,b,line){
      if(isNumV(a)&&isNumV(b))return num(a)<num(b)?-1:num(a)>num(b)?1:0;
      if(typeof a==="string"&&typeof b==="string")return a<b?-1:a>b?1:0;
      if(a instanceof Chr&&b instanceof Chr)return a.s<b.s?-1:a.s>b.s?1:0;
      if(a instanceof SIdx&&b instanceof SIdx)return a.i-b.i;
      if(a instanceof Tup&&b instanceof Tup){for(let i=0;i<a.items.length;i++){const c=cmp(a.items[i],b.items[i],line);if(c)return c}return 0}
      if(a instanceof ECase&&b instanceof ECase&&a.type===b.type)return a.type.cases.findIndex(c=>c.name===a.name)-a.type.cases.findIndex(c=>c.name===b.name);
      if(a instanceof Obj&&b instanceof Obj){const m=findOp(a.type,"<");if(m)return truth(callFn({decl:m,selfType:a.type},[{v:a},{v:b}],line))?-1:truth(callFn({decl:m,selfType:a.type},[{v:b},{v:a}],line))?1:0}
      if(a instanceof Some||b instanceof Some)fail(`line ${line}: value of optional type '${typeOfV(a instanceof Some?a:b)}' must be unwrapped before comparing`);
      fail(`line ${line}: binary operator '<' cannot be applied to operands of type '${typeOfV(a)}' and '${typeOfV(b)}'`);
    }
    const truth=v=>{if(typeof v==="boolean")return v;fail(`type '${typeOfV(v)}' cannot be used as a boolean; test for '!= nil' or use a comparison`)};
    function hkey(v){if(typeof v==="string")return "s:"+v;if(typeof v==="number")return "i:"+v;if(v instanceof D)return "d:"+v.v;if(typeof v==="boolean")return "b:"+v;if(v instanceof Chr)return "s:"+v.s;if(v instanceof ECase)return "e:"+v.type.name+"."+v.name+(v.vals?JSON.stringify(v.vals.map(hkey)):"");if(v instanceof Tup)return "t:"+v.items.map(hkey).join("|");
      if(v instanceof Obj&&conformsAny(v.type,["Hashable"]))return "o:"+v.type.name+storedAll(v.type).map(s=>hkey(v.f[s.name])).join("|");
      if(v instanceof Some)return hkey(v.v);if(v===NIL)return "nil";fail(`type '${typeOfV(v)}' can't be used as a dictionary key or in a Set (it isn't Hashable)`)}

    /* ----- arithmetic ----- */
    function isLitE(e){return e&&(e.k==="lit"&&isNumV(e.v)||isStrLit(e)||e.k==="paren"&&isLitE(e.e)||(e.k==="bin"&&["+","-","*","/"].includes(e.op)&&isLitE(e.l)&&isLitE(e.r))||(e.k==="un"&&e.op==="-"&&isLitE(e.e))||(e.k==="arrlit"&&e.items.every(isLitE)))}
    function arith(op,a,b,e,line){
      if(a instanceof Some||b instanceof Some||a===NIL||b===NIL)fail(`line ${line}: value of optional type '${typeOfV(a instanceof Some||a===NIL?a:b)}' must be unwrapped to use ${op}. Use if let, ?? or !`);
      if(op==="+"){
        if(typeof a==="string"&&typeof b==="string")return a+b;
        if(a instanceof Arr&&b instanceof Arr)return new Arr([...a.items.map(copy),...b.items.map(copy)],a.et||b.et);
        if(typeof a==="string"||typeof b==="string"){if(a instanceof Chr||b instanceof Chr)fail(`line ${line}: binary operator '+' cannot be applied to operands of type '${typeOfV(a)}' and '${typeOfV(b)}'. Use String(c) to turn a Character into a String`);
          fail(`line ${line}: binary operator '+' cannot be applied to operands of type '${typeOfV(a)}' and '${typeOfV(b)}'. Use String(...) or "\\(...)" to turn a number into text`)}
      }
      if(!isNumV(a)||!isNumV(b))fail(`line ${line}: binary operator '${op}' cannot be applied to operands of type '${typeOfV(a)}' and '${typeOfV(b)}'`);
      if((a instanceof D)!==(b instanceof D)){
        const intSide=a instanceof D?e.r:e.l;
        if(isLitE(intSide)){if(!(a instanceof D))a=new D(a);if(!(b instanceof D))b=new D(b)}
        else{const dSide=a instanceof D?e.l:e.r;if(isLitE(dSide)&&Number.isInteger(num(a instanceof D?a:b))&&!String(dSide.v&&dSide.v.v).includes(".")){}
          fail(`line ${line}: binary operator '${op}' cannot be applied to operands of type '${typeOfV(a)}' and '${typeOfV(b)}'. Convert one with Double(...) or Int(...)`)}
      }
      if(a instanceof D&&(a.f32||b.f32)){const x=a.v,y=b.v;switch(op){case "+":return F32(x+y);case "-":return F32(x-y);case "*":return F32(x*y);case "/":return F32(x/y)}}
      if(a instanceof D){const x=a.v,y=b.v;switch(op){case "+":return new D(x+y);case "-":return new D(x-y);case "*":return new D(x*y);case "/":return new D(x/y);case "%":fail(`line ${line}: '%' is unavailable for Double. Use .truncatingRemainder(dividingBy:)`)}fail(`line ${line}: '${op}' can't be used with Double`)}
      let r;
      switch(op){
        case "+":r=a+b;break;case "-":r=a-b;break;case "*":r=a*b;break;
        case "/":if(b===0){if(e&&isLitE(e.r)&&isLitE(e.l))fail(`line ${line}: division by zero`);fatal("Division by zero")}r=Math.trunc(a/b);break;
        case "%":if(b===0)fatal("Division by zero in remainder operation");r=a%b;if(Object.is(r,-0))r=0;break;
        case "&":return Number(BigInt(a)&BigInt(b));case "|":return Number(BigInt(a)|BigInt(b));case "^":return Number(BigInt(a)^BigInt(b));
        case "<<":return b>=64?0:Number(BigInt.asIntN(64,BigInt(a)<<BigInt(b)));case ">>":return Number(BigInt(a)>>BigInt(Math.min(b,64)));
      }
      // Int is 64-bit: going past Int.max crashes (JavaScript numbers are inexact up there, so Int.max itself is 2^63)
      if((r>=9223372036854775807||r<-9223372036854775808)&&e&&isLitE(e.l)&&isLitE(e.r))fail(`line ${line}: arithmetic operation '${a} ${op} ${b}' (on type 'Int') results in an overflow`);
      if(r>=9223372036854775807&&!(r===a&&b===0)&&!(r===b&&(a===0||op==="*"&&a===1))&&!(op==="*"&&b===1)||r<-9223372036854775808)fatal("arithmetic overflow");
      if(!Number.isSafeInteger(r)&&Number.isSafeInteger(a)&&Number.isSafeInteger(b)){const R=op==="+"?BigInt(a)+BigInt(b):op==="-"?BigInt(a)-BigInt(b):op==="*"?BigInt(a)*BigInt(b):null;if(R!==null&&(R>9223372036854775807n||R< -9223372036854775808n))fatal("arithmetic overflow")}
      return r;
    }

    /* ----- lvalues ----- */
    // returns {get,set,root} where root is the variable cell the chain starts from
    function lval(e,env){
      switch(e.k){
        case "name":{
          const c=env.find(e.v);
          if(c){if(c.fn)fail(`line ${e.line}: cannot assign to '${e.v}' (it's a function)`);return {get:()=>{if(c.unset)fail(`line ${e.line}: variable '${e.v}' used before being initialized`);return c.v},set:v=>{c.v=v;c.unset=false},cell:c,root:c,name:e.v}}
          if(env.self instanceof Obj&&(e.v in env.self.f||findProp(env.self.type,e.v)||(env.inInit&&storedAll(env.self.type).some(s=>s.name===e.v))))return lval({k:"member",e:{k:"self",line:e.line},name:e.v,line:e.line},env);
          if(env.selfType){const s=staticGet(env.selfType,e.v,e.line);if(s)return {get:()=>s.v,set:v=>{if(s.isLet)fail(`line ${e.line}: cannot assign to property: '${e.v}' is a 'let' constant`);s.v=v},root:null,name:e.v}}
          notFound(e.v,e.line);
        }
        case "self":{if(env.self==null)fail(`line ${e.line}: 'self' is only available inside a type's methods`);
          return {get:()=>env.selfRef?env.selfRef.get():env.self,set:v=>{if(!env.mutSelf)fail(`line ${e.line}: cannot assign to value: 'self' is immutable`);if(env.selfRef){env.selfRef.set(v);return}if(env.self instanceof Obj&&v instanceof Obj)Object.assign(env.self.f,v.f);else fail(`line ${e.line}: assigning to self here isn't supported yet`,"NotSupported")},root:{isLet:!env.mutSelf,selfRoot:true},name:"self"}}
        case "paren":return lval(e.e,env);
        case "member":{
          if(e.e.k==="name"&&types[e.e.v]&&!env.find(e.e.v)){const ty=types[e.e.v];const s=staticGet(ty,e.name,e.line);if(s)return {get:()=>s.v,set:v=>{if(s.isLet)fail(`line ${e.line}: cannot assign to property: '${e.name}' is a 'let' constant`);s.v=v},root:null,name:e.name}}
          const base=lval(e.e,env);
          if(base.optional&&base.get()===NIL)return NILCHAIN;
          const getBase=()=>{const b=base.get();if(b===NIL)fatal("Unexpectedly found nil while unwrapping an Optional value");return b instanceof Some?b.v:b};
          const b=getBase();
          const viaClass=b instanceof Obj&&b.type.kind==="class";
          if(b instanceof Obj){
            const ty=b.type;const st=storedAll(ty).find(s=>s.name===e.name);const pr=findProp(ty,e.name);
            if(!st&&!(pr&&pr.computed))fail(`line ${e.line}: value of type '${ty.name}' has no member '${e.name}'`);
            return {get:()=>getProp(getBase(),e.name,e.line),set:v=>{
              const o=getBase();
              if(st){if(st.isLet&&!(env.inInit&&o===env.self))fail(`line ${e.line}: cannot assign to property: '${e.name}' is a 'let' constant`);
                if(!viaClass)checkMutable(base,e.line,e.name);
                const old=o.f[e.name];const nv=conform(v,st.type||typeFromV(old),e.line,false,"assign value");
                // willSet / didSet (not while one of them is already running for this property)
                const obs=ty.observers[e.name];const busy=o.obsBusy||(o.obsBusy=new Set());const runObs=obs&&!(env.inInit&&o===env.self)&&!busy.has(e.name);
                if(!runObs){o.f[e.name]=nv;return}
                busy.add(e.name);
                try{
                  if(obs.willSet){const oe=new Env(globals);oe.self=o;oe.selfType=ty;oe.mutSelf=true;oe.vars.set(obs.willSet.name,cell(nv,null,true));execList(obs.willSet.body,oe)}
                  o.f[e.name]=nv;
                  if(obs.didSet){const oe=new Env(globals);oe.self=o;oe.selfType=ty;oe.mutSelf=true;oe.vars.set(obs.didSet.name,cell(old,null,true));execList(obs.didSet.body,oe)}
                }finally{busy.delete(e.name)}
                return}
              const comp=pr.computed;if(!comp.set)fail(`line ${e.line}: cannot assign to property: '${e.name}' is a get-only property`);
              const ce=new Env(globals);ce.self=o;ce.selfType=pr.owner;ce.mutSelf=true;ce.vars.set(comp.setName,cell(v,null,true));execList(comp.set,ce)},
              root:viaClass?null:base.root,name:e.name,viaClass:viaClass||base.viaClass,parent:base,optional:base.optional};
          }
          if(b instanceof Tup){const idx=/^\d+$/.test(e.name)?+e.name:b.labels.indexOf(e.name);if(idx<0)fail(`line ${e.line}: tuple has no member '${e.name}'`);return {get:()=>getBase().items[idx],set:v=>{checkMutable(base,e.line);getBase().items[idx]=v},root:base.root}}
          return {get:()=>memberOf(getBase(),e.name,e,env),set:()=>fail(`line ${e.line}: cannot assign to property: '${e.name}' is a get-only property`),root:base.root,parent:base};
        }
        case "index":{
          const base=lval(e.e,env);
          if(base.optional&&base.get()===NIL)return NILCHAIN;
          const b=base.get();
          const args=e.args.map(a=>({label:a.label,v:ev(a.e,env)}));
          // subscript(...) written in your own type
          if((b instanceof Obj||b instanceof ECase)&&findSub(b.type)){const sub=findSub(b.type);
            const subEnv=()=>{const se=new Env(globals);se.self=base.get();se.selfType=sub.owner;se.mutSelf=true;bindArgs(sub,args,se,e.line);return se};
            return {get:()=>conform(runBody(sub.get,subEnv(),true),sub.ret,e.line,false,"convert return expression"),
              set:v=>{if(!sub.set)fail(`line ${e.line}: cannot assign through subscript: it is get-only`);if(!(b instanceof Obj&&b.type.kind==="class"))checkMutable(base,e.line);const se=subEnv();se.vars.set(sub.setName,cell(v,null,true));execList(sub.set,se)},root:base.root,parent:base}}
          if(b instanceof Arr){const i=args[0].v;const off=b.off||0;
            // a slice (a[2...]) keeps the indexes of the array it came from
            if(i instanceof Range){const lo=i.lo===null?off:i.lo,hi=i.hi===null?off+b.items.length:i.closed?i.hi+1:i.hi;
              return {get:()=>{if(lo<off||hi>off+b.items.length||lo>hi)fatal("Array index is out of range");const r=new Arr(b.items.slice(lo-off,hi-off),b.et);r.off=lo;return r},set:()=>fail(`line ${e.line}: assigning to a range of an array isn't supported yet`,"NotSupported"),root:base.root}}
            if(!isInt(i))fail(`line ${e.line}: cannot subscript a value of type '${typeOfV(b)}' with an argument of type '${typeOfV(i)}'`);
            return {get:()=>{const a=base.get();const k=i-(a.off||0);if(k<0||k>=a.items.length)fatal("Index out of range");return a.items[k]},set:v=>{checkMutable(base,e.line);const a=base.get();const k=i-(a.off||0);if(k<0||k>=a.items.length)fatal("Index out of range");a.items[k]=conform(copy(v),a.et,e.line,false,"assign value")},root:base.root,parent:base,optional:base.optional};
          }
          if(b instanceof Dict){const k=args[0].v;const def=args.find(a=>a.label==="default");
            return {get:()=>{const d=base.get();const hit=d.m.get(hkey(k));if(def)return hit?hit[1]:def.v;return hit?new Some(hit[1]):NIL},
              set:v=>{checkMutable(base,e.line);const d=base.get();if(v===NIL&&!def){d.m.delete(hkey(k));return}if(v instanceof Some)v=v.v;d.m.set(hkey(k),[k,conform(copy(v),d.vt,e.line,false,"assign value")])},root:base.root,parent:base,dictDefault:!!def,optional:base.optional,
              ensure:def?()=>{checkMutable(base,e.line);const d=base.get();if(!d.m.has(hkey(k)))d.m.set(hkey(k),[k,copy(def.v)])}:null};
          }
          if(typeof b==="string"&&(args[0].v instanceof SIdx||args[0].v instanceof Range&&(args[0].v.lo instanceof SIdx||args[0].v.hi instanceof SIdx))){const i=args[0].v;
            return {get:()=>{const cs=chars(base.get());
              if(i instanceof SIdx){if(i.i<0||i.i>=cs.length)fatal("String index is out of bounds");return new Chr(cs[i.i])}
              const lo=i.lo?i.lo.i:0,hi=i.hi?(i.closed?i.hi.i+1:i.hi.i):cs.length;if(lo<0||hi>cs.length||lo>hi)fatal("String index range is out of bounds");return cs.slice(lo,hi).join("")},
              set:()=>fail(`line ${e.line}: cannot assign through subscript: subscript is get-only`),root:base.root}}
          if(typeof b==="string")fail(`line ${e.line}: Swift strings can't be indexed with numbers like s[0]. Use Array(s)[0], s.first, or s.prefix(n)`);
          fail(`line ${e.line}: value of type '${typeOfV(b)}' has no subscripts`);
        }
        case "force":{const base=lval(e.e,env);return {get:()=>{const v=base.get();if(v===NIL)fatal("Unexpectedly found nil while unwrapping an Optional value");return v instanceof Some?v.v:v},set:v=>{const cur=base.get();if(cur===NIL)fatal("Unexpectedly found nil while unwrapping an Optional value");base.set(new Some(v))},root:base.root}}
        case "optchain":{const base=lval(e.e,env);return {get:()=>{const v=base.get();return v===NIL?NIL:v instanceof Some?v.v:v},set:v=>{const cur=base.get();if(cur!==NIL)base.set(new Some(v))},root:base.root,optional:true,isNil:()=>base.get()===NIL}}
      }
      // not assignable: evaluate as a temporary
      const v=ev(e,env);return {get:()=>v,set:()=>fail(`line ${e.line||"?"}: cannot assign to this expression`),root:{isLet:true,temp:true}};
    }
    // assigning through a?.b when a is nil does nothing
    const NILCHAIN={get:()=>NIL,set:()=>{},isNil:()=>true,optional:true,root:null};
    function checkMutable(lv,line,prop){
      for(let x=lv;x;x=x.parent){if(x.viaClass)return}
      const r=lv.root;if(!r)return;
      if(r.temp)fail(`line ${line}: cannot assign to this value (it's a temporary copy)`);
      if(r.selfRoot&&r.isLet)fail(`line ${line}: cannot assign to property: 'self' is immutable. Mark the method 'mutating'`);
      if(r.isLet)fail(`line ${line}: cannot ${prop?`assign to property: '${lvName(lv)}' is a 'let' constant`:`change '${lvName(lv)}' because it's a 'let' constant. Use var`}`);
    }
    function lvName(lv){let x=lv;while(x.parent)x=x.parent;return x.name||"value"}
    function notFound(n,line){fail(`line ${line}: cannot find '${n}' in scope`)}
    function rangeBounds(r,len){const lo=r.lo===null?0:r.lo;const hi=r.hi===null?len:r.closed?r.hi+1:r.hi;return [lo,hi]}

    /* ----- expressions ----- */
    // ev stays tiny for the common cases: deep recursion in a learner's program uses less of JavaScript's stack
    function ev(e,env){
      switch(e.k){
        case "lit":return e.v;case "name":return nameVal(e,env);case "bin":return binop(e,env);case "call":return call(e,env);
        case "paren":return ev(e.e,env);case "cond":return truth(ev(e.c,env))?ev(e.a,env):ev(e.b,env);case "member":return memberGet(e,env);
      }
      return evMore(e,env);
    }
    function evMore(e,env){
      switch(e.k){
        case "lit":return e.v;
        case "str":return e.parts.map(pt=>typeof pt==="string"?pt:desc(ev(pt.e,env))).join("");
        case "paren":return ev(e.e,env);
        case "name":return nameVal(e,env);
        case "self":{const sv=env.selfRef?env.selfRef.get():env.self;if(sv==null){if(env.selfType)return {isType:true,ty:env.selfType};fail(`line ${e.line}: 'self' is only available inside a type's methods`)}return sv}
        case "super":fail(`line ${e.line}: use super.method() or super.init(...)`);
        case "tuple":return new Tup(e.items.map(x=>copy(ev(x,env))),e.labels);
        case "arrlit":{
          if(!e.items.length)return new Arr([],null);
          let items=e.items.map(x=>copy(ev(x,env)));
          if(e.anyOK){const a=new Arr(items,{k:"name",name:"Any"});return a}
          if(items.some(x=>x instanceof Chr)&&items.some(x=>typeof x==="string"))items=items.map((x,i)=>typeof x==="string"&&isStrLit(e.items[i])&&[...x].length===1?new Chr(x):x);
          if(items.some(x=>x instanceof D)&&items.some(x=>typeof x==="number")){items=items.map((x,i)=>{if(typeof x==="number"){if(!isLitE(e.items[i]))fail(`line ${e.line}: an array can only hold one type. Mixing Int and Double values needs Double(...)`);return new D(x)}return x})}
          const t0=typeOfV(items[0]);if(items.some(x=>typeOfV(x)!==t0&&!(x instanceof Some||x===NIL)&&!((x instanceof Obj||x instanceof ECase)&&(items[0] instanceof Obj||items[0] instanceof ECase))))fail(`line ${e.line}: heterogeneous collection literal could only be inferred to '[Any]'; all items in an array must be the same type`);
          const a=new Arr(items,typeFromV(items[0]));a.lit=isLitE(e);return a}
        case "dictlit":{const d=new Dict(null,null);for(const [k,v] of e.pairs){const kv=ev(k,env);const vv=copy(ev(v,env));if(d.m.has(hkey(kv)))fatal(`Dictionary literal contains duplicate keys`);d.m.set(hkey(kv),[kv,vv])}const first=[...d.m.values()][0];if(first){d.kt=typeFromV(first[0]);d.vt=typeFromV(first[1])}return d}
        case "emptyof":{const t=e.type;if(t.k==="arr")return new Arr([],t.el);if(t.k==="dict")return new Dict(t.key,t.val);return new SetV(t.el)}
        case "cond":{const c=ev(e.c,env);return truth(c)?ev(e.a,env):ev(e.b,env)}
        case "un":{const v=ev(e.e,env);
          if(e.op==="!"){if(typeof v!=="boolean")fail(`line ${e.line}: ! needs a true/false value (a Bool)`);return !v}
          if(e.op==="-"){if(!isNumV(v))fail(`line ${e.line}: unary operator '-' cannot be applied to an operand of type '${typeOfV(v)}'`);return v instanceof D?new D(-v.v):-v}
          if(e.op==="~"){if(!isInt(v))fail(`line ${e.line}: unary operator '~' cannot be applied to an operand of type '${typeOfV(v)}'`);return -v-1}
          return v}
        case "bin":return binop(e,env);
        case "range":{const lo=e.lo?ev(e.lo,env):null,hi=e.hi?ev(e.hi,env):null;
          if(lo!==null&&hi!==null&&isInt(lo)&&isInt(hi)&&(e.closed?lo>hi:lo>hi))fatal("Range requires lowerBound <= upperBound");
          return new Range(lo,hi,e.closed)}
        case "is":{const v=ev(e.e,env);return isType(v,e.type)}
        case "as":{const v=ev(e.e,env);const ok=isType(v,e.type);
          if(e.mode==="as?")return ok?new Some(v):NIL;
          if(e.mode==="as!"){if(!ok)fatal(`Could not cast value of type '${typeOfV(v)}' to '${tname(e.type)}'`);return v}
          if(e.type.k==="name"&&e.type.name==="Double"&&typeof v==="number"&&isLitE(e.e))return new D(v);
          return conform(v,e.type,e.line,isLitE(e.e))}
        case "member":return memberGet(e,env);
        case "index":return lval(e,env).get();
        case "force":{const v=ev(e.e,env);if(v===NIL)fatal("Unexpectedly found nil while unwrapping an Optional value");if(!(v instanceof Some))fail(`line ${e.line}: cannot force unwrap value of non-optional type '${typeOfV(v)}'`);return v.v}
        case "optchain":{const v=ev(e.e,env);if(v===NIL)return NIL;if(!(v instanceof Some))fail(`line ${e.line}: cannot use optional chaining on non-optional value of type '${typeOfV(v)}'`);return v.v}
        case "call":return call(e,env);
        case "closure":return new Fn({closure:true,params:e.params,body:e.body,env,dollars:e.dollars});
        case "keypath":return new Fn({builtin:([v],args,line)=>e.path.reduce((acc,n)=>n==="self"?acc:memberOf(acc,n,{line:e.line,e:{k:"lit",v:acc}},env),v)});
        case "switchx":return exprSwitch(e.s,env);
        case "ifx":return exprIf(e.s,env);
        case "implicit":return implicitMember(e.name,e.line);
        case "try":return evTry(e,env);
        case "opfn":return new Fn({builtin:([a,b],args,line)=>{const fake={k:"bin",op:e.op,l:{k:"x"},r:{k:"x"},line};return binv(e.op,a,b,fake,line)}});
        case "inout":fail(`line ${e.line||"?"}: & only goes in front of an inout argument`);
      }
      fail(`unsupported expression (${e.k})`,"NotSupported");
    }
    function evTry(e,env){
      const d0=depth,t0=tryDepth;tryDepth++;
      try{return evTry2(e,env)}finally{depth=d0;tryDepth=t0}
    }
    function evTry2(e,env){
          if(e.mode==="try?"){try{const v=ev(e.e,env);return v instanceof Some||v===NIL?v:new Some(v)}catch(x){if(x instanceof Thrown)return NIL;throw x}}
          if(e.mode==="try!"){try{return ev(e.e,env)}catch(x){if(x instanceof Thrown)fatal(`'try!' expression unexpectedly raised an error: main.${desc(x.v.type?x.v.type.name:"Error")}.${desc(x.v)}`);throw x}}
          return ev(e.e,env)}
    // .circle(radius: 2): checks the values against the case's types (so 2 becomes 2.0 for a Double)
    function caseMaker(ty,cd){return new Fn({builtin:(vals,args,line)=>{if(vals.length!==cd.assoc.length)fail(`line ${line}: ${ty.name}.${cd.name} takes ${cd.assoc.length} value(s) but got ${vals.length}`);
      return new ECase(ty,cd.name,args.map((a,i)=>conform(copy(a.v),cd.assoc[i].type,line,a.lit,"convert value")))}})}
    const CHARSETS=["whitespaces","whitespacesAndNewlines","newlines","punctuationCharacters","decimalDigits","letters"];
    function implicitMember(name,line){
      if(["up","down","towardZero","awayFromZero","toNearestOrEven","toNearestOrAwayFromZero"].includes(name)&&!Object.values(types).some(t=>t.kind==="enum"&&t.cases.some(c=>c.name===name)))return {rule:name};
      if(CHARSETS.includes(name)&&!Object.values(types).some(t=>t.kind==="enum"&&t.cases.some(c=>c.name===name)))return {charset:name};
      const hits=Object.values(types).filter(t=>t.kind==="enum"&&t.caseVals&&t.caseVals.some(c=>c.name===name));
      if(hits.length){const ty=hits[0];const c=ty.caseVals.find(c=>c.name===name);const cd=ty.cases.find(x=>x.name===name);if(cd.assoc)return caseMaker(ty,cd);return c}
      fail(`line ${line}: cannot infer the type for '.${name}'. Write the type name in front, like Direction.${name}`);
    }
    function isType(v,t){
      if(t.k==="opt")return v===NIL||isType(v instanceof Some?v.v:v,t.of);
      if(v instanceof Some)v=v.v;
      if(t.k==="name"){const n=t.name;
        if(n==="Int")return typeof v==="number";if(n==="Double")return v instanceof D;if(n==="String")return typeof v==="string";if(n==="Bool")return typeof v==="boolean";if(n==="Any")return true;
        if(v instanceof Obj){const ty=types[n];if(!ty)return false;if(ty.kind==="protocol")return conforms(v.type,n);return v.type===ty||isSub(v.type,ty)}
        if(v instanceof ECase)return v.type.name===n||conforms(v.type,n);
        return false}
      if(t.k==="arr")return v instanceof Arr;if(t.k==="dict")return v instanceof Dict;
      return false;
    }
    function binop(e,env){
      if(e.op==="&&")return logicR(e,env,boolL(e,env)?null:false);
      if(e.op==="||")return logicR(e,env,boolL(e,env)?true:null);
      if(e.op==="??")return coalesce(ev(e.l,env),e,env);
      return binop2(ev(e.l,env),e.r.k==="call"?call(e.r,env):ev(e.r,env),e,env);
    }
    function boolL(e,env){const l=ev(e.l,env);if(typeof l!=="boolean")fail(`line ${e.line}: ${e.op} needs true/false values on both sides`);return l}
    function logicR(e,env,known){if(known!==null)return known;const r=ev(e.r,env);if(typeof r!=="boolean")fail(`line ${e.line}: ${e.op} needs true/false values on both sides`);return r}
    function coalesce(l,e,env){if(!(l instanceof Some||l===NIL))return l;if(l instanceof Some)return l.v;return ev(e.r,env)}
    function binop2(l,r,e,env){
      if(l instanceof Obj||l instanceof ECase||r instanceof Obj||r instanceof ECase){const u=userOp(e.op,l,r,env,e.line);if(u!==undefined)return u}
      return binv(e.op,l,r,e,e.line);
    }
    // operators you write yourself: static func + (a: Vec, b: Vec) -> Vec, or a global func +
    function findOp(ty,op){for(let t=ty;t;t=t.sup){const m=t.staticMethods[op]||t.methods[op];if(m)return m}return findMethod(ty,op)}
    function userOp(op,l,r,env,line){
      const ty=l instanceof Obj||l instanceof ECase?l.type:r.type;
      if(!["==","!=","<",">","<=",">="].includes(op)){const m=findOp(ty,op)||(r&&r.type&&r.type!==ty?findOp(r.type,op):null);if(m)return callFn({decl:m,selfType:m.owner},[{v:l},{v:r}],line)}
      const c=env.find(op);if(c&&c.fn)return callFn(c.fn,[{v:l},{v:r}],line);
      return undefined;
    }
    function binv(op,l,r,e,line){
      switch(op){
        case "==":case "!=":{
          if(!(l===NIL||r===NIL||l instanceof Some||r instanceof Some)){const lt=typeOfV(l),rt=typeOfV(r);
            if(lt!==rt&&!(isNumV(l)&&isNumV(r)&&(isLitE(e.l)||isLitE(e.r)))&&!(l instanceof Chr&&typeof r==="string"&&isStrLit(e.r))&&!(r instanceof Chr&&typeof l==="string"&&isStrLit(e.l))&&!(l instanceof Obj&&r instanceof Obj))fail(`line ${line}: binary operator '${op}' cannot be applied to operands of type '${lt}' and '${rt}'`)}
          const q=equal(l,r);return op==="=="?q:!q}
        case "===":case "!==":{const q=l===r;return op==="==="?q:!q}
        case "<":case ">":case "<=":case ">=":{
          if((l instanceof D)!==(r instanceof D)&&isNumV(l)&&isNumV(r)&&!isLitE(e.l)&&!isLitE(e.r))fail(`line ${line}: binary operator '${op}' cannot be applied to operands of type '${typeOfV(l)}' and '${typeOfV(r)}'`);
          if(typeOfV(l)!==typeOfV(r)&&!(isNumV(l)&&isNumV(r))&&!(l instanceof Obj&&r instanceof Obj)&&!(l instanceof Chr&&typeof r==="string"))fail(`line ${line}: binary operator '${op}' cannot be applied to operands of type '${typeOfV(l)}' and '${typeOfV(r)}'`);
          if(l instanceof Chr&&typeof r==="string")r=new Chr(r);
          const c=cmp(l,r,line);return op==="<"?c<0:op===">"?c>0:op==="<="?c<=0:c>=0}
      }
      return arith(op,l,r,e,line);
    }
    const isStrLit=e=>e&&e.k==="str"&&e.parts.length===1&&typeof e.parts[0]==="string";
    function nameVal(e,env){
      const c=env.find(e.v);
      if(c){if(c.fn)return c.fn;if(c.unset)fail(`line ${e.line}: variable '${e.v}' used before being initialized`);return c.v}
      if(env.self instanceof ECase){const sv=env.selfRef?env.selfRef.get():env.self;if(e.v==="rawValue")return sv.raw;const m=findMethod(sv.type,e.v);if(m)return new Fn({decl:m,self:sv,selfType:sv.type,mutable:env.mutSelf,selfRef:env.selfRef});const pr=findProp(sv.type,e.v);if(pr&&pr.computed){const ce=new Env(globals);ce.self=sv;ce.selfType=sv.type;return runBody(pr.computed.get,ce,true)}}
      if(env.self instanceof Obj){const o=env.self;
        if(e.v in o.f)return o.f[e.v];
        const pr=findProp(o.type,e.v);if(pr&&pr.computed)return getProp(o,e.v,e.line);
        const m=findMethod(o.type,e.v);if(m)return new Fn({decl:m,self:o,selfType:o.type,mutable:env.mutSelf});
        if(env.inInit&&storedAll(o.type).some(s=>s.name===e.v))fail(`line ${e.line}: 'self.${e.v}' used before being initialized`);
      }
      if(env.selfType){const s=staticGet(env.selfType,e.v,e.line);if(s)return s.v;for(let t=env.selfType;t;t=t.sup){const sm=t.staticMethods[e.v];if(sm)return new Fn({decl:sm,self:null,selfType:t})}
        if(env.selfType.kind==="enum"&&!env.self){}}
      // inside an extension on a built-in type: count, append(...) and friends mean self.count, self.append(...)
      if(env.selfType&&env.selfType.kind==="builtin"&&env.self!=null){const sv=env.selfRef?env.selfRef.get():env.self;
        try{return memberOf(sv,e.v,{k:"member",e:{k:"self",line:e.line},name:e.v,line:e.line},env)}catch(x){if(!(x instanceof SErr&&/has no member/.test(x.message)))throw x}}
      if(types[e.v])return {isType:true,ty:types[e.v]};
      const b=BUILTINS[e.v];if(b!==undefined){if(MATHF.has(e.v)&&!mathOK)fail(`line ${e.line}: cannot find '${e.v}' in scope. Add import Foundation at the top of your program to use it`);return b}
      notFound(e.v,e.line);
    }
    function memberGet(e,env){
      if(e.e.k==="super"){
        const st=env.selfType&&env.selfType.sup;if(!st)fail(`line ${e.line}: 'super' only works in a class that inherits from another class`);
        if(e.name==="init")return new Fn({superInit:true,ty:st,self:env.self});
        const m=findMethod(st,e.name);if(m)return new Fn({decl:m,self:env.self,selfType:m.owner});
        const pr=findProp(st,e.name);if(pr&&pr.computed){const ce=new Env(globals);ce.self=env.self;ce.selfType=pr.owner;return runBody(pr.computed.get,ce,true)}
        fail(`line ${e.line}: the parent class has no member '${e.name}'`)}
      if(e.e.k==="optchain"){const b=ev(e.e,env);if(b===NIL)return NIL;const r=memberOf(b,e.name,e,env);if(r instanceof Fn)return Object.assign(new Fn(r),{optWrap:true});return r instanceof Some||r===NIL?r:new Some(r)}
      const base=ev(e.e,env);
      return memberOf(base,e.name,e,env);
    }
    function memberOf(b,n,e,env){
      const line=e.line;
      if(b&&b.isType){const ty=b.ty;
        if(ty.kind==="enum"){const c=ty.caseVals.find(c=>c.name===n);if(c){const cd=ty.cases.find(x=>x.name===n);if(cd.assoc)return caseMaker(ty,cd);return c}
          if(n==="allCases"){if(!ty.inherits.includes("CaseIterable"))fail(`line ${line}: type '${ty.name}' has no member 'allCases' (add : CaseIterable)`);return new Arr(ty.caseVals.slice(),{k:"name",name:ty.name})}}
        if(ty.nested&&ty.nested[n])return {isType:true,ty:types[n]};
        const s=staticGet(ty,n,line);if(s)return s.v;
        for(let t=ty;t;t=t.sup){const sm=t.staticMethods[n];if(sm)return new Fn({decl:sm,self:null,selfType:t})}
        if(n==="init")return new Fn({builtin:(vals,args,ln)=>construct(ty,ty.kind==="enum"&&args.length===1&&!args[0].label?[{...args[0],label:"rawValue"}]:args,ln)});
        fail(`line ${line}: type '${ty.name}' has no member '${n}'`)}
      if(b===NIL||b instanceof Some){
        if(n==="map")return new Fn({builtin:([f])=>b===NIL?NIL:new Some(callFn(f,[{v:b.v}],line))});
        if(n==="flatMap")return new Fn({builtin:([f])=>{if(b===NIL)return NIL;const r=callFn(f,[{v:b.v}],line);return r instanceof Some||r===NIL?r:new Some(r)}});
        fail(`line ${line}: value of optional type '${typeOfV(b)}' must be unwrapped to refer to member '${n}'. Use ?. or if let`)}
      if(b instanceof Obj){
        if(n in b.f)return b.f[n];
        const pr=findProp(b.type,n);if(pr&&pr.computed)return getProp(b,n,line);
        const m=findMethod(b.type,n);
        if(m){let mutable=true;if(b.type.kind==="struct"&&m.mutating){try{const lv=lval(e.e,env);checkMutable(lv,line);mutable=true}catch(x){if(x instanceof SErr&&x.kind==="CompileError")fail(`line ${line}: cannot use mutating member on immutable value: '${e.e.k==="name"?e.e.v:"value"}' is a 'let' constant`);throw x}}
          return new Fn({decl:m,self:b,selfType:m.owner.kind==="protocol"?b.type:m.owner,mutable})}
        if(storedAll(b.type).some(s=>s.name===n&&s.lazy))return getProp(b,n,line);
        if(storedAll(b.type).some(s=>s.name===n))fail(`line ${line}: '${n}' used before being initialized`);
        fail(`line ${line}: value of type '${b.type.name}' has no member '${n}'`)}
      if(b instanceof ECase){
        if(n==="rawValue"){if(!b.type.rawType)fail(`line ${line}: enum '${b.type.name}' has no raw values (write enum ${b.type.name}: Int or : String)`);return b.raw}
        const m=findMethod(b.type,n);
        if(m&&m.mutating){let lv;try{lv=lval(e.e,env);checkMutable(lv,line)}catch(x){if(x instanceof SErr&&x.kind==="CompileError")fail(`line ${line}: cannot use mutating member on immutable value: '${e.e.k==="name"?e.e.v:"value"}' is a 'let' constant`);throw x}return new Fn({decl:m,self:b,selfType:b.type,mutable:true,selfRef:lv})}
        if(m)return new Fn({decl:m,self:b,selfType:b.type});
        const pr=findProp(b.type,n);if(pr&&pr.computed){const ce=new Env(globals);ce.self=b;ce.selfType=b.type;return runBody(pr.computed.get,ce,true)}
        fail(`line ${line}: value of type '${b.type.name}' has no member '${n}'`)}
      if(b instanceof Tup){const idx=/^\d+$/.test(n)?+n:b.labels.indexOf(n);if(idx<0||idx>=b.items.length)fail(`line ${line}: value of tuple type has no member '${n}'`);return b.items[idx]}
      const xt=extOf(b);
      if(xt){const m=findMethod(xt,n);
        if(m){let ref=null;if(m.mutating){ref=lval(e.e,env);checkMutable(ref,line)}return new Fn({decl:m,self:b,selfType:xt,mutable:true,selfRef:ref})}
        const pr=findProp(xt,n);if(pr&&pr.computed){const ce=new Env(globals);ce.self=b;ce.selfType=xt;return runBody(pr.computed.get,ce,true)}}
      if(b&&b.isTypeName&&bext[b.isTypeName]){const s=staticGet(bext[b.isTypeName],n,line);if(s)return s.v;const sm=bext[b.isTypeName].staticMethods[n];if(sm)return new Fn({decl:sm,self:null,selfType:bext[b.isTypeName]})}
      return builtinMember(b,n,e,env);
    }

    /* ----- calls ----- */
    function argList(e,env){
      return e.args.map(a=>{
        if(a.e.k==="inout"){const lv=lval(a.e.e,env);checkMutable(lv,e.line);const ref={get v(){return lv.get()},set v(x){lv.set(x)},isLet:false};return {label:a.label,v:lv.get(),ref,lit:false}}
        const v=ev(a.e,env);
        return {label:a.label,trailing:a.trailing,v:e.args.length>1&&(v instanceof Arr||v instanceof Dict||v instanceof SetV||v instanceof Obj&&v.type.kind==="struct")?copy(v):v,lit:isLitE(a.e)||a.e.k==="lit"};
      });
    }
    function call(e,env){
      // fast path: calling a function or closure stored under a name
      const f=e.f;
      if(f.k==="name"){const c=env.find(f.v);const fv=c&&(c.fn||!c.computed&&c.v);
        if(fv instanceof Fn&&fv.decl&&!fv.decl.overloads&&!fv.superInit){tick();
          const fn=fv.decl,e2=declEnv(fv,fn,argList(e,env),e.line),td=tryDepth;tryDepth=0;
          const r=finishCall(fn,runBody(fn.body,e2,true,fn.ret===null));depth--;tryDepth=td;return r}
        if(fv instanceof Fn&&fv.closure){tick();return callClosure(fv,argList(e,env),e.line)}}
      const r=callSpecial(e,env);
      return r!==NOSPECIAL?r:callValue(e,env);
    }
    function callMore(e,env){
      const r=callSpecial(e,env);
      return r!==NOSPECIAL?r:callValue(e,env);
    }
    const NOSPECIAL={};
    function callSpecial(e,env){
      const f=e.f;
      // super.init(...)
      if(f.k==="member"&&f.e.k==="super"&&f.name==="init"){
        const st=env.selfType&&env.selfType.sup;if(!st)fail(`line ${e.line}: super.init only works in a class that inherits from another class`);
        const args=argList(e,env);const inits=allInits(st);
        if(!inits.length){if(args.length)fail(`line ${e.line}: argument passed to call that takes no arguments`);return undefined}
        callInit(env.self,pickFn(inits,args,e.line),args,e.line);return undefined}
      if((f.k==="name"&&f.v==="init"||f.k==="member"&&f.e.k==="self"&&f.name==="init")&&env.self){const args=argList(e,env);const inits=allInits(env.selfType);
        if(env.selfType.kind==="struct"&&inits.every(x=>x.fromExt)&&!inits.some(x=>labelsFit(x.params,args))){memberwise(env.self,env.selfType,args,e.line);return undefined}
        callInit(env.self,pickFn(inits,args,e.line),args,e.line);return undefined}
      // optional call: f?(1, 2)
      if(f.k==="optchain"){const fv=ev(f,env);if(fv===NIL)return NIL;if(!(fv instanceof Fn))fail(`line ${e.line}: cannot call value of non-function type '${typeOfV(fv)}'`);
        const r=callFn(fv,argList(e,env),e.line);return r===undefined?new Some(new Tup([])):r instanceof Some||r===NIL?r:new Some(r)}
      if(f.k==="member"&&f.name==="count"&&e.args.length===1&&e.args[0].label==="where"){const b=ev(f.e,env);const fn=ev(e.args[0].e,env);let n=0;for(const x of iterate(b,e.line))if(truth(callFn(fn,[{v:x}],e.line)))n++;return n}
      // first(where:) and last(where:), also with a trailing closure
      if(f.k==="member"&&(f.name==="first"||f.name==="last")&&e.args.length===1&&(e.args[0].label==="where"||!e.args[0].label&&e.args[0].e.k==="closure")){
        const b=ev(f.e,env);const fn=ev(e.args[0].e,env);const items=[...iterate(b,e.line)];if(f.name==="last")items.reverse();
        for(const x of items)if(truth(callFn(fn,[{v:x}],e.line)))return new Some(x);return NIL}
      // Type(...) construct, or a builtin conversion
      if(f.k==="name"&&!env.find(f.v)&&!(env.self&&findMethod(env.self.type,f.v))){
        if(types[f.v]){const o=construct(types[f.v],argList(e,env),e.line);if(f.targs&&o instanceof Obj)o.targs=f.targs;return o}
        const conv=CONV[f.v];if(conv)return conv(argList(e,env),e.line,e);
      }
      if(f.k==="member"&&f.e.k==="name"&&types[f.e.v]&&f.name==="init"&&!env.find(f.e.v))return construct(types[f.e.v],argList(e,env),e.line);
      return NOSPECIAL;
    }
    function callValue(e,env){
      const fv=ev(e.f,env),args=argList(e,env);
      if(fv instanceof Fn&&fv.decl&&!fv.decl.overloads&&!fv.superInit&&!fv.optWrap){tick();
        const fn=fv.decl,e2=declEnv(fv,fn,args,e.line),td=tryDepth;tryDepth=0;
        const r=finishCall(fn,runBody(fn.body,e2,true,fn.ret===null));depth--;tryDepth=td;return r}
      return callValue2(fv,args,e);
    }
    function callValue2(fv,args,e){
      if(fv&&fv.isType)return construct(fv.ty,args,e.line);
      if(!(fv instanceof Fn))fail(`line ${e.line}: cannot call value of non-function type '${typeOfV(fv)}'`);
      if(fv.superInit)return callInit(fv.self,pickFn(allInits(fv.ty),args,e.line),args,e.line);
      let fn=fv;
      if(fv.decl&&fv.decl.overloads)fn=Object.assign(new Fn(fv),{decl:pickFn([fv.decl],args,e.line)});
      const r=callFn(fn,args,e.line);
      if(fv.optWrap)return r===undefined?new Some(new Tup([])):r instanceof Some||r===NIL?r:new Some(r);
      return r;
    }

    /* ----- statements ----- */
    const isPlain=list=>!list.some(s=>s.k==="func"||s.k==="defer");
    function execList(list,env){
      if(list.plain===undefined)list.plain=isPlain(list);
      if(list.plain){for(let i=0;i<list.length;i++)exec(list[i],env);return}
      execListFull(list,env);
    }
    function execListFull(list,env){
      // functions declared in a block can be called before their line (like Swift's top level)
      for(const s of list)if(s.k==="func")env.vars.set(s.name,{fn:new Fn({decl:s,env,self:env.self,selfType:env.selfType})});
      const defers=[];
      try{for(const s of list){if(s.k==="defer"){defers.unshift(s.body);continue}exec(s,env)}}
      finally{for(const d of defers)execList(d,new Env(env))}
    }
    // exec only dispatches (a small JavaScript frame), so deep recursion in a learner's program fits on the stack
    function exec(s,env){
      tick();
      switch(s.k){
        case "empty":case "func":case "type":case "defer":return;
        case "expr":if(s.e.k==="call"){call(s.e,env);return}return execExpr(s,env);
        case "var":return declVar(s,env);
        case "assign":return assign(s,env);
        case "if":return execIf(s,env);
        case "return":throw new Ret(s.e?(s.e.k==="bin"?binop(s.e,env):ev(s.e,env)):undefined);
        case "switch":return doSwitch(s,env);
      }
      return execMore(s,env);
    }
    function execExpr(s,env){
      const e=s.e;const v=ev(e,env);
      if(e.k!=="call"&&e.k!=="try"&&!(e.k==="optchain")&&!(e.k==="member"&&v instanceof Fn)&&v!==undefined&&!(e.k==="lit"&&v===undefined)&&!(e.k==="member"&&e.e.k==="optchain")){
        if(e.k==="closure")fail(`line ${s.line}: closure expression is unused`);
        if(e.k==="name"||e.k==="bin"||e.k==="lit"||e.k==="str"||e.k==="member"||e.k==="index")fail(`line ${s.line}: expression of type '${typeOfV(v)}' is unused. Did you mean to print it or store it?`);
      }
      if(v instanceof Fn&&e.k!=="call")fail(`line ${s.line}: function is unused. Did you forget the () to call it?`);
    }
    function execIf(s,env){
      const e2=new Env(env),b=conds(s.conds,e2,s.line)?s.body:s.els;if(!b)return;
      const en=b===s.body?e2:new Env(env);
      if(b.plain===undefined)b.plain=isPlain(b);
      if(!b.plain)return execListFull(b,en);
      for(let i=0;i<b.length;i++)exec(b[i],en);
    }
    function execMore(s,env){
      switch(s.k){
        case "guard":{const e2=new Env(env);if(conds(s.conds,env,s.line,true))return;
          execList(s.body,e2);
          fail(`line ${s.line}: 'guard' body must not fall through; it needs return, break, continue or throw`)}
        case "while":{for(;;){tick();const e2=new Env(env);if(!conds(s.conds,e2,s.line))break;try{execList(s.body,e2)}catch(x){if(isBreak(x,s))break;if(isCont(x,s))continue;throw x}}return}
        case "repeat":{for(;;){tick();try{execList(s.body,new Env(env))}catch(x){if(isBreak(x,s))break;if(!isCont(x,s))throw x}const c=ev(s.c,env);if(typeof c!=="boolean")fail(`line ${s.line}: the repeat-while condition must be true or false`);if(!c)break}return}
        case "for":{
          const seq=ev(s.seq,env);const items=iterate(seq,s.line);
          for(const it of items){tick();const e2=new Env(env);if(s.casePat){if(!match(s.casePat,it,e2))continue}else bindPattern(s.pat,it,e2,true,s.line);
            if(s.where&&!truth(ev(s.where,e2)))continue;
            try{execList(s.body,e2)}catch(x){if(isBreak(x,s))break;if(isCont(x,s))continue;throw x}}
          return}
        case "break":throw s.label?new Brk(s.label):BRK;
        case "continue":throw s.label?{cont:s.label}:CNT;
        case "fallthrough":throw {fallthrough:true};
        case "throw":{const v=ev(s.e,env);if(!(v instanceof ECase&&conformsAny(v.type,["Error","LocalizedError"]))&&!(v instanceof Obj&&conformsAny(v.type,["Error","LocalizedError"])))fail(`line ${s.line}: thrown expression type '${typeOfV(v)}' does not conform to 'Error'`);throw new Thrown(v)}
        case "do":{const d0=depth,t0=tryDepth;
          try{execList(s.body,new Env(env))}
          catch(x){
            if(!(x instanceof Thrown))throw x;
            depth=d0;tryDepth=t0;
            for(const c of s.catches){
              const ce=new Env(env);const p=c.pat;
              if(!p)ce.vars.set("error",cell(x.v,null,true));
              else if(p.k==="bind"){if(p.type&&!isType(x.v,p.type))continue;ce.vars.set(p.name,cell(x.v,null,true))}
              else if(p.k==="expr"){const pv=ev(p.e,ce);if(pv&&pv.isType){if(!isType(x.v,{k:"name",name:pv.ty.name}))continue}else if(!equal(pv,x.v))continue}
              else if(!match(p,x.v,ce))continue;
              if(c.where&&!truth(ev(c.where,ce)))continue;
              execList(c.body,ce);return;
            }
            throw x;
          }
          return}
      }
      fail(`unsupported statement (${s.k})`,"NotSupported");
    }
    const isBreak=(x,s)=>x===BRK||(x instanceof Brk&&x.label===s.label);
    const isCont=(x,s)=>x===CNT||(x&&x.cont&&x.cont===s.label);
    function conds(list,env,line,isGuard){
      for(const c of list){
        if(c.k==="bool"){const v=ev(c.e,env);if(typeof v!=="boolean")fail(`line ${line}: optional type '${typeOfV(v)}' cannot be used as a boolean; use 'if let' or test for '!= nil'`);if(!v)return false;continue}
        if(c.k==="case"){const v=ev(c.e,env);if(!match(c.pat,v,env))return false;continue}
        const v=ev(c.init,env);
        if(!(v instanceof Some||v===NIL))fail(`line ${line}: initializer for conditional binding must have Optional type, not '${typeOfV(v)}'`);
        if(v===NIL)return false;
        bindPattern(c.pat,copy(v.v),env,!c.isVar,line,isGuard);
      }
      return true;
    }
    function bindPattern(pat,v,env,isLet,line,shadowOk){
      if(pat.k==="wild")return;
      if(pat.k==="name"){if(env.vars.has(pat.name)&&!shadowOk)fail(`line ${line}: invalid redeclaration of '${pat.name}'`);env.vars.set(pat.name,cell(v,null,isLet));return}
      if(pat.k==="tuple"){if(!(v instanceof Tup)||v.items.length!==pat.items.length)fail(`line ${line}: the tuple pattern doesn't match a value with ${v instanceof Tup?v.items.length:1} part(s)`);pat.items.forEach((p2,i)=>bindPattern(p2,v.items[i],env,isLet,line,shadowOk))}
    }
    function* iterate(v,line){
      if(v instanceof Range){if(v.hi===null)fail(`line ${line}: a loop over a range needs an end`);if(!isInt(v.lo))fail(`line ${line}: for-in over a range needs whole numbers (Int). For decimals use stride(from:to:by:)`);const end=v.closed?v.hi:v.hi-1;for(let i=v.lo;i<=end;i++)yield i;return}
      if(v instanceof Arr){const items=v.items.slice();for(const x of items)yield x;return}
      if(typeof v==="string"){for(const c of chars(v))yield new Chr(c);return}
      if(v instanceof Dict){for(const [,[k,x]] of v.m)yield new Tup([k,x],["key","value"]);return}
      if(v instanceof SetV){for(const x of v.m.values())yield x;return}
      if(v&&v.seq){yield* v.seq;return}
      fail(`line ${line}: for-in loop requires a sequence like an array or range, not '${typeOfV(v)}'`);
    }
    function doSwitch(s,env){
      const v=ev(s.subject,env);
      if(!s.cases.some(c=>c.def)){
        const plain=p2=>p2.k==="wild"||p2.k==="bind";
        const exhaustive=(v instanceof Some||v===NIL)?s.cases.some(c=>!c.where&&c.pats.some(plain))||
            s.cases.some(c=>!c.where&&c.pats.some(p2=>p2.k==="some"&&plain(p2.inner)||p2.k==="enum"&&p2.name==="some"&&(!p2.items||p2.items.every(plain))))&&
            s.cases.some(c=>c.pats.some(p2=>p2.k==="enum"&&p2.name==="none"||p2.k==="expr"&&p2.e.k==="lit"&&p2.e.v===NIL)):
          v instanceof ECase?v.type.cases.every(cd=>s.cases.some(c=>!c.where&&c.pats.some(p2=>p2.k==="wild"||(p2.k==="enum"&&p2.name===cd.name&&(!p2.items||p2.items.every(x=>x.k==="wild"||x.k==="bind")))||(p2.k==="bind")))):
          typeof v==="boolean"?[true,false].every(b=>s.cases.some(c=>!c.where&&c.pats.some(p2=>p2.k==="wild"||p2.k==="expr"&&p2.e.k==="lit"&&p2.e.v===b))):
          s.cases.some(c=>!c.where&&c.pats.some(p2=>p2.k==="wild"||p2.k==="bind"||(p2.k==="tuple"&&p2.items.every(x=>x.k==="wild"||x.k==="bind"))));
        if(!exhaustive)fail(`line ${s.line}: switch must be exhaustive. Add a default: case`);
      }
      let i=s.cases.findIndex(c=>{if(c.def)return false;const e2=new Env(env);c._env=e2;return c.pats.some(p2=>match(p2,v,e2))&&(!c.where||truth(ev(c.where,e2)))});
      if(i<0)i=s.cases.findIndex(c=>c.def);
      if(i<0)return;
      for(;i<s.cases.length;i++){
        const c=s.cases[i];const e2=c._env&&!c.def?c._env:new Env(env);
        try{execList(c.body,e2);return}
        catch(x){if(x===BRK)return;if(x&&x.fallthrough){s.cases[i+1]&&(s.cases[i+1]._env=new Env(env));continue}throw x}
      }
    }
    function match(pat,v,env){
      switch(pat.k){
        case "wild":return true;
        case "bind":env.vars.set(pat.name,cell(v,null,true));return true;
        case "tuple":return v instanceof Tup&&v.items.length===pat.items.length&&pat.items.every((p2,i)=>match(p2,v.items[i],env));
        case "some":return v instanceof Some&&match(pat.inner,v.v,env);
        case "bindas":{const x=v instanceof Some?v.v:v;if(!isType(x,pat.type))return false;env.vars.set(pat.name,cell(x,null,true));return true}
        case "enum":{
          if(pat.name==="some"&&!pat.tyName&&(v instanceof Some||v===NIL)&&!(v instanceof Some&&v.v instanceof ECase&&v.v.type.cases.some(c=>c.name==="some")))return v instanceof Some&&(!pat.items||match(pat.items[0],v.v,env));
          if(pat.name==="none"&&!pat.tyName&&(v===NIL||v instanceof Some&&!(v.v instanceof ECase&&v.v.type.cases.some(c=>c.name==="none"))))return v===NIL;
          if(v instanceof Some)v=v.v;
          if(!(v instanceof ECase))return false;
          if(v.name!==pat.name||pat.tyName&&v.type.name!==pat.tyName)return false;
          if(pat.items){if(!v.vals)return false;return pat.items.every((p2,i)=>match(p2,v.vals[i],env))}
          return true}
        case "is":return isType(v,pat.type);
        case "expr":{
          const pv=ev(pat.e,env);
          if(pv instanceof Range&&(v instanceof Chr||typeof v==="string")){const x=v instanceof Chr?v.s:v;const s=y=>y instanceof Chr?y.s:y;return (pv.lo===null||x>=s(pv.lo))&&(pv.hi===null||(pv.closed?x<=s(pv.hi):x<s(pv.hi)))}
          if(pv instanceof Range){if(!isNumV(v))return false;const x=num(v);const lo=pv.lo===null?-Infinity:num(pv.lo),hi=pv.hi===null?Infinity:num(pv.hi);return x>=lo&&(pv.closed?x<=hi:x<hi)}
          if(v instanceof Chr&&typeof pv==="string")return v.s===pv;
          return equal(pv,v);
        }
      }
      return false;
    }
    function declVar(s,env){
      for(const d of s.decls){
        if(d.getter){if(d.pat.k!=="name")fail(`line ${s.line}: computed variables need a single name`);const g=d.getter;env.def(d.pat.name,{get v(){return runBody(g.get,new Env(env),true)},set v(x){fail(`line ${s.line}: cannot assign to value: '${d.pat.name}' is a get-only property`)},isLet:true,computed:true},s.line);continue}
        if(!d.init){
          if(!d.type)fail(`line ${s.line}: type annotation missing in pattern. Write a type like var x: Int, or give it a value`);
          const c=cell(d.type.k==="opt"&&!s.isLet?NIL:undefined,d.type,s.isLet);if(!(d.type.k==="opt"&&!s.isLet))c.unset=true;
          env.def(d.pat.name,c,s.line);continue}
        if(d.type&&d.type.k==="arr"&&d.type.el.k==="name"&&(d.type.el.name==="Any"||types[d.type.el.name]&&types[d.type.el.name].kind==="protocol")&&d.init.k==="arrlit")d.init.anyOK=true;
        let v=ev(d.init,env);
        if(v===undefined)fail(`line ${s.line}: this doesn't give back a value (it returns Void), so it can't be stored`);
        if(v instanceof Fn&&d.init.k==="name")v=v;
        if(!d.type&&v===NIL&&d.init.k==="lit")fail(`line ${s.line}: 'nil' requires a contextual type. Write the type, like var x: Int? = nil`);
        if(!d.type&&v instanceof Arr&&!v.items.length&&!v.et&&d.init.k==="arrlit")fail(`line ${s.line}: empty collection literal requires an explicit type, like var items: [String] = []`);
        if(!d.type&&v instanceof Dict&&!v.m.size&&!v.kt&&d.init.k==="dictlit")fail(`line ${s.line}: empty collection literal requires an explicit type, like var d: [String: Int] = [:]`);
        v=copy(v);
        if(d.type)v=conform(v,d.type,s.line,isLitE(d.init)||(v instanceof Arr&&v.lit));
        const type=d.type||typeFromV(v);
        if(d.pat.k==="name")env.def(d.pat.name,cell(v,type,s.isLet),s.line);
        else bindPattern(d.pat,v,env,s.isLet,s.line);
      }
    }
    function assign(s,env){
      if(s.l.k==="name"&&s.l.v==="_"&&s.op==="="){ev(s.r,env);return}
      if(s.l.k==="tuple"&&s.op==="="){const r=ev(s.r,env);if(!(r instanceof Tup)||r.items.length!==s.l.items.length)fail(`line ${s.line}: the tuples on each side of = must have the same number of parts`);const vals=r.items.map(copy);s.l.items.forEach((le,i)=>assign({k:"assign",op:"=",l:le,r:{k:"lit",v:vals[i]},line:s.line},env));return}
      const lv=lval(s.l,env);
      if(lv.isNil&&lv.isNil())return;
      if(lv.cell){if(lv.cell.isLet&&!lv.cell.unset)fail(`line ${s.line}: cannot assign to value: '${lv.name}' is a 'let' constant`);
        if(lv.cell.isLet&&lv.cell.unset&&s.op!=="=")fail(`line ${s.line}: constant '${lv.name}' used before being initialized`)}
      else if(s.l.k==="index"||s.l.k==="member"){}
      let r=ev(s.r,env);
      if(r===undefined)fail(`line ${s.line}: cannot assign a value that doesn't exist (the right side returns Void)`);
      if(s.op!=="="){
        const cur=lv.get();
        if(s.op==="+="&&cur instanceof Arr){if(!(r instanceof Arr))fail(`line ${s.line}: use .append(x) to add one item, or += [x]`);checkMutable(lv,s.line);for(const x of r.items)cur.items.push(conform(copy(x),cur.et,s.line,r.lit,"append value"));return}
        const u=cur instanceof Obj||cur instanceof ECase?userOp(s.op[0],cur,r,env,s.line):undefined;
        r=u!==undefined?u:arith(s.op[0],cur,r,{l:{k:"x"},r:s.r},s.line);
        if(lv.cell&&lv.cell.type&&lv.cell.type.k==="name"&&lv.cell.type.name==="Int"&&r instanceof D)fail(`line ${s.line}: cannot assign a Double to an Int variable`);
      }
      r=copy(r);
      if(lv.cell){const t=lv.cell.type;if(t)r=conform(r,t,s.line,s.op==="="&&isLitE(s.r)||(r instanceof Arr&&r.lit),"assign value");else if(lv.cell.v!==undefined&&!lv.cell.unset){const old=lv.cell.v;if(old!==null&&!(old instanceof Fn)&&typeOfV(old)!==typeOfV(r)&&!(isNumV(old)&&isNumV(r))&&!(old instanceof Some||old===NIL))fail(`line ${s.line}: cannot assign value of type '${typeOfV(r)}' to type '${typeOfV(old)}'`);if(old instanceof D&&typeof r==="number"&&isLitE(s.r))r=new D(r);else if(isNumV(old)&&isNumV(r)&&(old instanceof D)!==(r instanceof D))fail(`line ${s.line}: cannot assign value of type '${typeOfV(r)}' to type '${typeOfV(old)}'`);if((old instanceof Some||old===NIL)&&!(r instanceof Some||r===NIL))r=new Some(r)}
        lv.set(r);return}
      if(s.l.k==="member"||s.l.k==="name"||s.l.k==="index"||s.l.k==="force"||s.l.k==="optchain"){
        if((s.l.k==="member"||s.l.k==="name")&&isLitE(s.r)&&typeof r==="number"){const cur=(()=>{try{return lv.get()}catch(e){return undefined}})();if(cur instanceof D)r=new D(r);else if(cur instanceof Some&&cur.v instanceof D)r=new D(r)}
        if(s.l.k==="index"&&isLitE(s.r)&&typeof r==="number"){const b=lval(s.l.e,env).get();if(b instanceof Arr&&b.et&&b.et.k==="name"&&b.et.name==="Double")r=new D(r);if(b instanceof Dict&&b.vt&&b.vt.k==="name"&&b.vt.name==="Double")r=new D(r)}
        if(s.l.k==="member"||s.l.k==="name"){const cur=(()=>{try{return lv.get()}catch(e){return undefined}})();if((cur instanceof Some||cur===NIL)&&!(r instanceof Some||r===NIL))r=new Some(r)}
        lv.set(r);return}
      lv.set(r);
    }

    /* ----- built-ins ----- */
    const B=fn=>new Fn({builtin:fn});
    function printArgs(vals,args,debug){let sep=" ",term="\n";const items=[];for(const a of args){if(a.label==="separator")sep=a.v;else if(a.label==="terminator")term=a.v;else items.push(desc(a.v,debug))}return items.join(sep)+term}
    // Int8, UInt8, ... are kept as plain numbers, checked against their range when stored
    const IRANGE={Int8:[-128,127],Int16:[-32768,32767],Int32:[-2147483648,2147483647],Int64:[-9223372036854775808,9223372036854775807],UInt:[0,18446744073709551615],UInt8:[0,255],UInt16:[0,65535],UInt32:[0,4294967295],UInt64:[0,18446744073709551615]};
    function intN(name,line){return (args)=>{const a=args[0];let v=a.v;
      if(typeof v==="string"){if(!/^[+-]?\d+$/.test(v))return NIL;v=parseInt(v,10);return v<IRANGE[name][0]||v>IRANGE[name][1]?NIL:new Some(v)}
      v=CONV.Int(args,line);if(v<IRANGE[name][0]||v>IRANGE[name][1])fatal("Not enough bits to represent the passed value");return v}}
    function toInt(v,line){if(v instanceof D){if(!isFinite(v.v))fatal("Double value cannot be converted to Int because it is either infinite or NaN");return Math.trunc(v.v)}if(typeof v==="number")return v;fail(`line ${line}: no exact matches in call to initializer Int(...)`)}
    const CONV={
      Int:(args,line)=>{const v=args[0].v;if(typeof v==="string"){const t=v;return /^[+-]?\d+$/.test(t)?new Some(parseInt(t,10)):NIL}if(v instanceof Chr)fail(`line ${line}: use c.wholeNumberValue to turn a Character digit into a number`);if(v instanceof Some||v===NIL)fail(`line ${line}: value of optional type '${typeOfV(v)}' must be unwrapped first`);return toInt(v,line)},
      Double:(args,line)=>{const v=args[0].v;if(typeof v==="string"){const t=v;return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)?new Some(new D(parseFloat(t))):NIL}if(isNumV(v))return new D(num(v));fail(`line ${line}: no exact matches in call to initializer Double(...)`)},
      String:(args,line)=>{
        if(!args.length)return "";const a=args[0];
        if(a.label==="repeating"){const c=args.find(x=>x.label==="count").v;return desc(a.v).repeat(c)}
        if(a.label==="format"){needF(line,"String(format:)");return cformat(a.v,args.slice(1).map(x=>x.v),line)}
        if(a.label==="describing")return desc(a.v);
        if(a.v instanceof Arr)return a.v.items.map(x=>x instanceof Chr?x.s:desc(x)).join("");
        if(a.v instanceof Some||a.v===NIL)fail(`line ${line}: value of optional type '${typeOfV(a.v)}' must be unwrapped before turning it into a String (or use String(describing:))`);
        if(a.v&&a.v.substr)return a.v;
        return desc(a.v)},
      Character:(args,line)=>{const v=args[0].v;if(v instanceof Chr)return new Chr(v.s);if(typeof v!=="string"||[...v].length!==1)fail(`line ${line}: Character(...) needs exactly one character`);return new Chr(v)},
      UnicodeScalar:(args,line)=>{const v=args[0].v;let c;if(isInt(v)){if(v<0||v>0x10FFFF||v>=0xD800&&v<=0xDFFF)return NIL;c=new Chr(String.fromCodePoint(v));c.scalar=true;return args[0].lit||v<256?c:new Some(c)}
        const s=v instanceof Chr?v.s:v;if(typeof s!=="string"||[...s].length!==1)fail(`line ${line}: UnicodeScalar(...) needs exactly one character`);c=new Chr(s);c.scalar=true;return c},
      Optional:(args)=>{const v=args[0].v;return v instanceof Some||v===NIL?v:new Some(v)},
      Float:(args,line)=>{const v=CONV.Double(args,line);return v instanceof Some?new Some(F32(v.v.v)):v instanceof D?F32(v.v):v},
      Bool:(args)=>{const v=args[0].v;if(typeof v==="string")return v==="true"?new Some(true):v==="false"?new Some(false):NIL;return v},
      Array:(args,line)=>{const a=args[0];if(!a)return new Arr([],null);if(a.label==="repeating"){const n=args.find(x=>x.label==="count").v;return new Arr(Array.from({length:n},()=>copy(a.v)),typeFromV(a.v))}const items=[...iterate(a.v,line)];return new Arr(items,items.length?typeFromV(items[0]):null)},
      Set:(args,line)=>{const s=new SetV(null);if(args[0])for(const x of iterate(args[0].v,line))s.m.set(hkey(x),x);return s},
      Dictionary:(args,line)=>{const d=new Dict(null,null);const a=args.find(x=>x.label==="uniqueKeysWithValues");if(a){for(const t of iterate(a.v,line)){if(d.m.has(hkey(t.items[0])))fatal(`Duplicate values for key: '${desc(t.items[0])}'`);d.m.set(hkey(t.items[0]),[t.items[0],t.items[1]])}}
        const g=args.find(x=>x.label==="grouping");
        if(g){const by=args.find(x=>x.label==="by").v;for(const x of iterate(g.v,line)){const k=callFn(by,[{v:x}],line);const h=hkey(k);if(!d.m.has(h))d.m.set(h,[k,new Arr([],typeFromV(x))]);d.m.get(h)[1].items.push(x)}}
        const u=args.find(x=>x.label==="uniquingKeysWith");
        if(u&&args[0]&&!args[0].label){for(const t of iterate(args[0].v,line)){const h=hkey(t.items[0]);const old=d.m.get(h);d.m.set(h,[t.items[0],old?callFn(u.v,[{v:old[1]},{v:t.items[1]}],line):t.items[1]])}}
        const first=[...d.m.values()][0];if(first){d.kt=typeFromV(first[0]);d.vt=typeFromV(first[1])}
        return d},
    };
    for(const n in IRANGE)CONV[n]=(args,line)=>intN(n,line)(args);
    function cformat(f,vals,line){let i=0;return String(f).replace(/%(-?)(\+?)(0?)(\d*)(?:\.(\d+))?(lld|ld|lu|u|d|i|f|e|E|g|G|s|@|x|X|o|c|%)/g,(m,left,plus,zero,w,pr,k)=>{if(k==="%")return "%";const v=vals[i++];let s;
      const expo=(x,p)=>x.toExponential(p).replace(/e([+-])(\d)$/,"e$10$2");
      if(k==="f"){s=num(v).toFixed(pr===undefined?6:+pr)}
      else if(k==="e"||k==="E"){s=expo(num(v),pr===undefined?6:+pr);if(k==="E")s=s.toUpperCase()}
      else if(k==="g"||k==="G"){const x=num(v),P=pr===undefined?6:Math.max(1,+pr);const ex=x===0?0:Math.floor(Math.log10(Math.abs(x)));
        if(ex<-4||ex>=P)s=expo(x,P-1).replace(/\.?0+e/,"e");else{s=x.toFixed(Math.max(0,P-1-ex));if(s.includes("."))s=s.replace(/\.?0+$/,"")}if(k==="G")s=s.toUpperCase()}
      else if(k==="x"||k==="X"){s=num(v).toString(16);if(k==="X")s=s.toUpperCase()}else if(k==="o")s=num(v).toString(8);else if(k==="c")s=String.fromCharCode(num(v));else if(k==="@"||k==="s")s=desc(v);else s=String(Math.trunc(num(v)));
      if(plus&&/^[0-9]/.test(s))s="+"+s;
      if(w){const n=+w;s=left?s.padEnd(n):zero?s.padStart(n,"0"):s.padStart(n)}return s})}
    // min(3.5, 2): the 2 is read as 2.0
    const numMix=(r,args)=>typeof r==="number"&&args.some(a=>a.v instanceof D)?new D(r):r;
    const MATHF=new Set(["sqrt","pow","floor","ceil","round","log","log2","log10","exp","sin","cos","tan","atan","asin","acos","atan2","hypot","trunc"]);
    const BUILTINS={
      print:B((vals,args)=>{W(printArgs(vals,args));return undefined}),
      debugPrint:B((vals,args)=>{W(printArgs(vals,args,true));return undefined}),
      abs:B(([x])=>x instanceof D?new D(Math.abs(x.v)):Math.abs(x)),
      min:B((vs,args,line)=>numMix(vs.reduce((a,b)=>cmp(b,a,line)<0?b:a),args)),
      max:B((vs,args,line)=>numMix(vs.reduce((a,b)=>cmp(b,a,line)>0?b:a),args)),
      sqrt:B(([x])=>new D(Math.sqrt(num(x)))),pow:B(([x,y])=>new D(Math.pow(num(x),num(y)))),
      log:B(([x])=>new D(Math.log(num(x)))),log2:B(([x])=>new D(Math.log2(num(x)))),log10:B(([x])=>new D(Math.log10(num(x)))),exp:B(([x])=>new D(Math.exp(num(x)))),
      sin:B(([x])=>new D(Math.sin(num(x)))),cos:B(([x])=>new D(Math.cos(num(x)))),tan:B(([x])=>new D(Math.tan(num(x)))),atan:B(([x])=>new D(Math.atan(num(x)))),asin:B(([x])=>new D(Math.asin(num(x)))),acos:B(([x])=>new D(Math.acos(num(x)))),
      atan2:B(([y,x])=>new D(Math.atan2(num(y),num(x)))),hypot:B(([x,y])=>new D(Math.hypot(num(x),num(y)))),trunc:B(([x])=>new D(Math.trunc(num(x)))),
      floor:B(([x])=>new D(Math.floor(num(x)))),ceil:B(([x])=>new D(Math.ceil(num(x)))),round:B(([x])=>new D(swiftRound(num(x)))),
      stride:B((vals,args,line)=>{const g=n=>args.find(a=>a.label===n);const from=g("from").v,by=g("by").v;const to=g("to"),through=g("through");const end=(to||through).v;
        if(num(by)===0)fatal("Stride size must not be zero");
        const dblMode=from instanceof D||end instanceof D||by instanceof D;
        const seq=function*(){const step=num(by);for(let i=num(from),k=0;;k++){const x=dblMode?num(from)+k*step:i;if(step>0?(to?x>=num(end):x>num(end)):(to?x<=num(end):x<num(end)))return;yield dblMode?new D(x):x;i+=step}}();
        return {seq,stride:true}}),
      zip:B(([a,b],args,line)=>{const x=[...iterate(a,line)],y=[...iterate(b,line)];return new Arr(x.slice(0,Math.min(x.length,y.length)).map((v,i)=>new Tup([v,y[i]])),null)}),
      type:B(([v])=>({isTypeName:runtimeType(v)})),
      readLine:B(()=>{if(inPos>=IN.length)return NIL;const e2=IN.indexOf("\n",inPos);const end=e2<0?IN.length:e2;const line=IN.slice(inPos,end);inPos=end+1;if(!quiet)W(line+"\n");return new Some(line)}),
      fatalError:B(([m])=>fatal(m===undefined?"":desc(m))),
      precondition:B(([c,m])=>{if(!c)fatal(m===undefined?"Precondition failed":"Precondition failed: "+desc(m));return undefined}),
      assert:B(([c,m])=>{if(!c)fatal(m===undefined?"Assertion failed":"Assertion failed: "+desc(m));return undefined}),
      swap:B((vals,args,line)=>{if(args.length!==2||!args[0].ref||!args[1].ref)fail(`line ${line}: use swap(&a, &b)`);const t=args[0].ref.v;args[0].ref.v=args[1].ref.v;args[1].ref.v=t;return undefined}),
      Int:{isTypeName:"Int",ns:{max:9223372036854775807,min:-9223372036854775808,random:B((vals,args,line)=>{const r=args[0].v;const lo=r.lo,hi=r.closed?r.hi:r.hi-1;return lo+Math.floor(Math.random()*(hi-lo+1))})}},
      Double:{isTypeName:"Double",ns:{pi:new D(Math.PI),infinity:new D(Infinity),nan:new D(NaN),greatestFiniteMagnitude:new D(Number.MAX_VALUE),leastNonzeroMagnitude:new D(5e-324),ulpOfOne:new D(Number.EPSILON),random:B((vals,args)=>{const r=args[0].v;return new D(num(r.lo)+Math.random()*(num(r.hi)-num(r.lo)))})}},
      Bool:{isTypeName:"Bool",ns:{random:B(()=>Math.random()<0.5)}},
      Float:{isTypeName:"Float",ns:{pi:F32(Math.PI),infinity:F32(Infinity),nan:F32(NaN),greatestFiniteMagnitude:F32(3.4028234663852886e38)}},
      Character:{isTypeName:"Character",ns:{}},
      String:{isTypeName:"String",ns:{}},
    };
    for(const n in IRANGE)BUILTINS[n]={isTypeName:n,ns:{max:IRANGE[n][1],min:IRANGE[n][0]}};
    // the names type(of:) prints: Array<Int>, Optional<String>, Dictionary<String, Int>
    function tyName(t){if(!t)return "Any";switch(t.k){case "name":return t.args&&t.args.length?t.name+"<"+t.args.map(tyName).join(", ")+">":t.name;case "arr":return "Array<"+tyName(t.el)+">";case "dict":return "Dictionary<"+tyName(t.key)+", "+tyName(t.val)+">";case "opt":return "Optional<"+tyName(t.of)+">";case "set":return "Set<"+tyName(t.el)+">";case "tuple":return "("+t.items.map(tyName).join(", ")+")"}return "Any"}
    function runtimeType(v){
      const T=tyName;
      if(v instanceof Obj)return v.type.name+genArgs(v);
      if(v instanceof Fn&&v.decl)return "("+v.decl.params.map(q=>tyName(q.type)).join(", ")+") -> "+(v.decl.ret?tyName(v.decl.ret):"()");
      if(v instanceof Some)return "Optional<"+runtimeType(v.v)+">";
      if(v instanceof Arr)return "Array<"+(v.et?T(v.et):v.items.length?runtimeType(v.items[0]):"Any")+">";
      if(v instanceof Dict)return "Dictionary<"+(v.kt?T(v.kt):"Any")+", "+(v.vt?T(v.vt):"Any")+">";
      if(v instanceof SetV)return "Set<"+(v.et?T(v.et):v.m.size?runtimeType([...v.m.values()][0]):"Any")+">";
      if(v instanceof Tup)return "("+v.items.map((x,i)=>(v.labels[i]?v.labels[i]+": ":"")+runtimeType(x)).join(", ")+")";
      return typeOfV(v);
    }
    function swiftRound(x){return x<0?-Math.round(-x):Math.round(x)}  // rounds halves away from zero
    function builtinMember(b,n,e,env){
      const line=e.line;
      const M=fn=>new Fn({builtin:fn});
      const mut=()=>{const lv=lval(e.e,env);if(lv.ensure)lv.ensure();checkMutable(lv,line);return lv};
      if(b&&b.ns){const v=b.ns[n];if(v!==undefined)return v;
        if(n==="init"&&CONV[b.isTypeName])return M((vals,args,ln)=>CONV[b.isTypeName](args.map(a=>({...a,label:null})),ln));
        if(n==="self")return b;
        fail(`line ${line}: type '${b.isTypeName}' has no member '${n}'`)}
      if(b&&b.isTypeName&&n==="self")return b;
      if(isNumV(b)){
        switch(n){
          case "isMultiple":return M(([x],args)=>{if(args[0].label!=="of")fail(`line ${line}: use isMultiple(of:)`);return b%x===0});
          case "description":return desc(b);
          case "rounded":return M(([rule])=>{const x=num(b);const r=rule&&(rule.rule||rule.name);
            const v=r==="up"?Math.ceil(x):r==="down"?Math.floor(x):r==="towardZero"?Math.trunc(x):r==="toNearestOrEven"?(Math.abs(x%1)===0.5?2*Math.round(x/2):Math.round(x)):swiftRound(x);return new D(v)});
          case "squareRoot":return M(()=>new D(Math.sqrt(num(b))));
          case "truncatingRemainder":return M(([x])=>new D(num(b)%num(x)));
          case "magnitude":return b instanceof D?new D(Math.abs(b.v)):Math.abs(b);
          case "isEven":case "isOdd":break;
          case "isNaN":return b instanceof D&&isNaN(b.v);case "isInfinite":return b instanceof D&&!isNaN(b.v)&&!isFinite(b.v);case "isFinite":return !(b instanceof D)||isFinite(b.v);
          case "isZero":return num(b)===0;
          case "squared":break;
          case "advanced":return M(([x])=>b instanceof D?new D(b.v+num(x)):b+x);
          case "distance":return M(([x])=>x-b);
          case "signum":return M(()=>Math.sign(b));
          case "quotientAndRemainder":return M(([x])=>new Tup([Math.trunc(b/x),b%x],["quotient","remainder"]));
          case "formatted":needF(line,".formatted()");return M(()=>b instanceof D?String(b.v):String(b).replace(/\B(?=(\d{3})+(?!\d))/g,","));
        }
        fail(`line ${line}: value of type '${typeOfV(b)}' has no member '${n}'`);
      }
      if(typeof b==="string")return strMember(b,n,e,env,mut);
      if(typeof b==="boolean"){if(n==="toggle")return M(()=>{const lv=mut();lv.set(!lv.get());return undefined});if(n==="description")return String(b);fail(`line ${line}: value of type 'Bool' has no member '${n}'`)}
      if(b instanceof Chr){
        const c=b.s;
        switch(n){
          case "isLetter":return /\p{L}/u.test(c);case "isNumber":return /\p{N}/u.test(c);case "isUppercase":return c!==c.toLowerCase();case "isLowercase":return c!==c.toUpperCase();
          case "isWhitespace":return /\s/.test(c);case "isPunctuation":return /\p{P}/u.test(c);
          case "uppercased":return M(()=>c.toUpperCase());case "lowercased":return M(()=>c.toLowerCase());
          case "wholeNumberValue":return /[0-9]/.test(c)?new Some(+c):NIL;
          case "asciiValue":return c.charCodeAt(0)<128?new Some(c.charCodeAt(0)):NIL;
          case "description":return c;
          case "value":if(b.scalar)return c.codePointAt(0);break;
          case "isASCII":return c.codePointAt(0)<128;
          case "isHexDigit":return /^[0-9a-fA-F]$/.test(c);case "hexDigitValue":return /^[0-9a-fA-F]$/.test(c)?new Some(parseInt(c,16)):NIL;
          case "isSymbol":return /\p{S}/u.test(c);case "isMathSymbol":return /\p{Sm}/u.test(c);
          case "isCased":return c!==c.toLowerCase()||c!==c.toUpperCase();
          case "unicodeScalars":return new Arr([...c].map(x=>{const r=new Chr(x);r.scalar=true;return r}),{k:"name",name:"Unicode.Scalar"});
          case "utf8":return new Arr([...new TextEncoder().encode(c)],{k:"name",name:"UInt8"});
          case "properties":break;
        }
        fail(`line ${line}: value of type 'Character' has no member '${n}'`);
      }
      if(b instanceof Arr)return arrMember(b,n,e,env,mut);
      if(b instanceof Dict)return dictMember(b,n,e,env,mut);
      if(b instanceof SetV)return setMember(b,n,e,env,mut);
      if(b instanceof Range){
        switch(n){
          case "contains":return M(([x])=>{if(x instanceof Chr||typeof x==="string"){const s=y=>y instanceof Chr?y.s:y;const v=s(x);return (b.lo===null||v>=s(b.lo))&&(b.hi===null||(b.closed?v<=s(b.hi):v<s(b.hi)))}const v=num(x);return (b.lo===null||v>=num(b.lo))&&(b.hi===null||(b.closed?v<=num(b.hi):v<num(b.hi)))});
          case "count":return b.closed?b.hi-b.lo+1:b.hi-b.lo;
          case "lowerBound":return b.lo;case "upperBound":return b.hi;
          case "reversed":return M(()=>new Arr([...iterate(b,line)].reverse(),{k:"name",name:"Int"}));
          case "map":case "filter":case "reduce":case "forEach":case "shuffled":case "randomElement":case "sorted":case "contains(where:)":case "allSatisfy":return arrMember(new Arr([...iterate(b,line)],{k:"name",name:"Int"}),n,e,env,mut);
        }
        fail(`line ${line}: value of type 'Range' has no member '${n}'`);
      }
      if(b&&b.stride){if(n==="map"||n==="filter"||n==="reduce"||n==="forEach")return arrMember(new Arr([...b.seq],null),n,e,env,mut)}
      if(b instanceof Tup&&n==="count")fail(`line ${line}: tuples don't have a count`);
      fail(`line ${line}: value of type '${typeOfV(b)}' has no member '${n}'`);
    }
    // a Character is what a reader sees as one letter (an emoji with a skin tone is one Character)
    const SEG=typeof Intl!=="undefined"&&Intl.Segmenter?new Intl.Segmenter("en",{granularity:"grapheme"}):null;
    const chars=s=>SEG&&/[^\x00-\x7f]/.test(s)?Array.from(SEG.segment(s),x=>x.segment):[...s];
    function strMember(s,n,e,env,mut){
      const line=e.line;const M=fn=>new Fn({builtin:fn});const cs=chars(s);
      switch(n){
        case "count":return cs.length;case "isEmpty":return s.length===0;
        case "uppercased":return M(()=>s.toUpperCase());case "lowercased":return M(()=>s.toLowerCase());
        case "capitalized":needF(line,".capitalized");return s.toLowerCase().replace(/(^|[^\p{L}\p{N}'])(\p{L})/gu,(m,a,x)=>a+x.toUpperCase());
        case "range":needF(line,".range(of:)");return M(([x])=>{const k=s.indexOf(x instanceof Chr?x.s:x);if(k<0)return NIL;const a=chars(s.slice(0,k)).length;return new Some(new Range(new SIdx(a),new SIdx(a+chars(x instanceof Chr?x.s:x).length),false))});
        case "first":return cs.length?new Some(new Chr(cs[0])):NIL;case "last":return cs.length?new Some(new Chr(cs[cs.length-1])):NIL;
        case "hasPrefix":return M(([x])=>s.startsWith(x));case "hasSuffix":return M(([x])=>s.endsWith(x));
        case "contains":return M(([x],args)=>{if(args[0].label==="where"){const f=x;return cs.some(c=>truth(callFn(f,[{v:new Chr(c)}],line)))}return s.includes(x instanceof Chr?x.s:x)});
        case "reversed":return M(()=>{const r=new Arr(cs.reverse().map(c=>new Chr(c)),{k:"name",name:"Character"});r.revStr=true;return r});
        case "split":return M((vals,args)=>{const g=k=>args.find(a=>a.label===k);
          const sa=g("separator")||(args[0]&&!args[0].label&&!(args[0].v instanceof Fn)?args[0]:null),ws=g("whereSeparator")||(args.length&&!args[args.length-1].label&&args[args.length-1].v instanceof Fn?args[args.length-1]:null);
          const maxS=g("maxSplits")?g("maxSplits").v:Infinity,omit=g("omittingEmptySubsequences")?g("omittingEmptySubsequences").v:true;
          let parts=[];
          if(sa&&[...(sa.v instanceof Chr?sa.v.s:sa.v)].length>1){const sep=sa.v;let rest=s;while(parts.length<maxS){const k=rest.indexOf(sep);if(k<0)break;const piece=rest.slice(0,k);rest=rest.slice(k+sep.length);if(!(omit&&piece===""))parts.push(piece)}if(!(omit&&rest===""))parts.push(rest);return new Arr(parts,{k:"name",name:"String"})}
          if(!sa&&!ws)fail(`line ${line}: use split(separator: " ")`);
          const isSep=sa?(c=>c===(sa.v instanceof Chr?sa.v.s:sa.v)):(c=>truth(callFn(ws.v,[{v:new Chr(c)}],line)));
          if(maxS===0)return new Arr(omit&&s===""?[]:[s],{k:"name",name:"String"});
          let cur="",i=0,done=false;
          for(;i<cs.length;i++){const c=cs[i];if(isSep(c)){const added=!(omit&&cur==="");if(added)parts.push(cur);cur="";if(added&&parts.length===maxS){i++;done=true;break}}else cur+=c}
          if(done)cur=cs.slice(i).join("");
          if(cur!==""||!omit)parts.push(cur);
          return new Arr(parts,{k:"name",name:"String"})});
        case "components":needF(line,".components(separatedBy:)");return M((vals,args)=>{const sep=args[0].v;return new Arr(s.split(sep instanceof Chr?sep.s:sep),{k:"name",name:"String"})});
        case "replacingOccurrences":needF(line,".replacingOccurrences(of:with:)");return M((vals,args)=>{const of=args.find(a=>a.label==="of").v,w=args.find(a=>a.label==="with").v;return s.split(of).join(w)});
        case "trimmingCharacters":needF(line,".trimmingCharacters(in:)");return M(([cs2])=>{const k=cs2&&cs2.charset;const re=k==="whitespaces"?/^[ \t]+|[ \t]+$/g:k==="newlines"?/^\n+|\n+$/g:k==="punctuationCharacters"?/^\p{P}+|\p{P}+$/gu:/^\s+|\s+$/g;return s.replace(re,"")});
        case "prefix":return M(([k])=>{if(k instanceof Fn)fail("prefix(while:) isn't supported yet","NotSupported");return cs.slice(0,k).join("")});
        case "suffix":return M(([k])=>cs.slice(Math.max(0,cs.length-k)).join(""));
        case "dropFirst":return M(([k])=>cs.slice(k===undefined?1:k).join(""));
        case "dropLast":return M(([k])=>cs.slice(0,cs.length-(k===undefined?1:k)).join(""));
        case "append":return M(([x])=>{const lv=mut();lv.set(lv.get()+(x instanceof Chr?x.s:x));return undefined});
        case "removeLast":return M(()=>{const lv=mut();const c=chars(lv.get());if(!c.length)fatal("Can't remove last element from an empty collection");const r=c.pop();lv.set(c.join(""));return new Chr(r)});
        case "removeFirst":return M(()=>{const lv=mut();const c=chars(lv.get());if(!c.length)fatal("Can't remove first element from an empty collection");const r=c.shift();lv.set(c.join(""));return new Chr(r)});
        case "insert":return M((vals,args)=>{const at=args.find(a=>a.label==="at");if(!at||!(at.v instanceof SIdx))fail(`line ${line}: use insert(c, at: index) with a String index like s.startIndex`);
          const lv=mut();const c=chars(lv.get());if(at.v.i<0||at.v.i>c.length)fatal("String index is out of bounds");const x=args[0].v;c.splice(at.v.i,0,x instanceof Chr?x.s:x);lv.set(c.join(""));return undefined});
        case "startIndex":return new SIdx(0);case "endIndex":return new SIdx(cs.length);
        case "indices":return new Arr(cs.map((c,i)=>new SIdx(i)),null);
        case "index":return M((vals,args)=>{const a=args[0];const lim=args.find(x=>x.label==="limitedBy");
          let r;if(a.label==="after")r=a.v.i+1;else if(a.label==="before")r=a.v.i-1;else{const by=args.find(x=>x.label==="offsetBy");r=a.v.i+by.v;if(lim){if(by.v>=0?r>lim.v.i:r<lim.v.i)return NIL;return new Some(new SIdx(r))}}
          if(r<0||r>cs.length)fatal("String index is out of bounds");return new SIdx(r)});
        case "distance":return M((vals,args)=>args[1].v.i-args[0].v.i);
        case "firstIndex":case "lastIndex":return M((vals,args)=>{const r=callFn(arrMember(new Arr(cs.map(c=>new Chr(c)),null),n,e,env,mut),args,line);return r instanceof Some?new Some(new SIdx(r.v)):r});
        case "remove":return M((vals,args)=>{const at=args.find(a=>a.label==="at");if(!at||!(at.v instanceof SIdx))fail(`line ${line}: use remove(at: index) with a String index`);const lv=mut();const c=chars(lv.get());if(at.v.i<0||at.v.i>=c.length)fatal("String index is out of bounds");const r=c.splice(at.v.i,1)[0];lv.set(c.join(""));return new Chr(r)});
        case "filter":return M((vals,args)=>{const f=args[0].v;return cs.filter(c=>truth(callFn(f,[{v:new Chr(c)}],line))).join("")});
        case "removeAll":return M((vals,args)=>{const lv=mut();if(!args.length){lv.set("");return undefined}const f=args[0].v;lv.set(chars(lv.get()).filter(c=>!truth(callFn(f,[{v:new Chr(c)}],line))).join(""));return undefined});
        case "map":case "forEach":case "sorted":case "allSatisfy":case "enumerated":case "reduce":case "compactMap":case "firstIndex":case "lastIndex":case "flatMap":case "min":case "max":case "shuffled":case "randomElement":case "starts":case "elementsEqual":return arrMember(new Arr(cs.map(c=>new Chr(c)),{k:"name",name:"Character"}),n,e,env,mut);
        case "description":return s;case "debugDescription":return JSON.stringify(s);
        case "lowercasedFirst":break;
        case "isNumber":break;
        case "utf8":return new Arr([...new TextEncoder().encode(s)],{k:"name",name:"UInt8"});
        case "unicodeScalars":return new Arr(cs.map(x=>{const r=new Chr(x);r.scalar=true;return r}),{k:"name",name:"Unicode.Scalar"});
        case "isNumber":break;
      }
      fail(`line ${line}: value of type 'String' has no member '${n}'`);
    }
    function sortCmp(f,line){return f?(a,b)=>truth(callFn(f,[{v:a},{v:b}],line))?-1:truth(callFn(f,[{v:b},{v:a}],line))?1:0:(a,b)=>cmp(a,b,line)}
    function stableSort(items,c){return items.map((x,i)=>[x,i]).sort((a,b)=>c(a[0],b[0])||a[1]-b[1]).map(x=>x[0])}
    function arrMember(a,n,e,env,mut){
      const line=e.line;const M=fn=>new Fn({builtin:fn});const it=a.items;
      const slc=(items,start)=>{const r=new Arr(items,a.et);const o=(a.off||0)+start;if(o)r.off=o;return r};
      const C=(v,lit)=>conform(copy(v),a.et,line,lit,"convert value");
      const fnArg=(args,i=0)=>{const x=args[i];if(!x||!(x.v instanceof Fn))fail(`line ${line}: .${n} needs a closure like { $0 ... }`);return x.v};
      switch(n){
        case "count":return it.length;case "isEmpty":return it.length===0;
        case "first":return it.length?new Some(it[0]):NIL;case "last":return it.length?new Some(it[it.length-1]):NIL;
        case "indices":return new Range(a.off||0,(a.off||0)+it.length,false);
        case "startIndex":return a.off||0;case "endIndex":return (a.off||0)+it.length;
        case "append":return M((vals,args)=>{const lv=mut();const arr=lv.get();if(args[0].label==="contentsOf"){for(const x of iterate(args[0].v,line))arr.items.push(C(x,args[0].lit))}else{if(args[0].label)fail(`line ${line}: extraneous argument label '${args[0].label}:' in call`);arr.items.push(C(args[0].v,args[0].lit))}return undefined});
        case "insert":return M((vals,args)=>{const lv=mut();const arr=lv.get();const at=args.find(x=>x.label==="at");if(!at)fail(`line ${line}: use insert(x, at: index)`);if(at.v<0||at.v>arr.items.length)fatal("Array index is out of range");arr.items.splice(at.v,0,C(args[0].v,args[0].lit));return undefined});
        case "remove":return M((vals,args)=>{const lv=mut();const arr=lv.get();const at=args.find(x=>x.label==="at");if(!at)fail(`line ${line}: use remove(at: index)`);if(at.v<0||at.v>=arr.items.length)fatal("Index out of range");return arr.items.splice(at.v,1)[0]});
        case "removeLast":return M(()=>{const lv=mut();const arr=lv.get();if(!arr.items.length)fatal("Can't remove last element from an empty collection");return arr.items.pop()});
        case "removeFirst":return M(()=>{const lv=mut();const arr=lv.get();if(!arr.items.length)fatal("Can't remove first element from an empty collection");return arr.items.shift()});
        case "popLast":return M(()=>{const lv=mut();const arr=lv.get();return arr.items.length?new Some(arr.items.pop()):NIL});
        case "removeAll":return M((vals,args)=>{const lv=mut();const arr=lv.get();if(args.length&&(args[0].label==="where"||args[0].v instanceof Fn)){const f=args[0].v;arr.items=arr.items.filter(x=>!truth(callFn(f,[{v:x}],line)))}else arr.items=[];return undefined});
        case "contains":return M((vals,args)=>{if(args[0].label==="where"||args[0].v instanceof Fn){const f=args[0].v;return it.some(x=>truth(callFn(f,[{v:x}],line)))}return it.some(x=>equal(x,args[0].v))});
        case "allSatisfy":return M((vals,args)=>{const f=fnArg(args);return it.every(x=>truth(callFn(f,[{v:x}],line)))});
        case "firstIndex":return M((vals,args)=>{let i;if(args[0].label==="where"||args[0].v instanceof Fn){const f=args[0].v;i=it.findIndex(x=>truth(callFn(f,[{v:x}],line)))}else i=it.findIndex(x=>equal(x,args[0].v));return i<0?NIL:new Some(i+(a.off||0))});
        case "lastIndex":return M((vals,args)=>{let i=-1;for(let k=it.length-1;k>=0;k--)if(args[0].label==="where"||args[0].v instanceof Fn?truth(callFn(args[0].v,[{v:it[k]}],line)):equal(it[k],args[0].v)){i=k;break}return i<0?NIL:new Some(i+(a.off||0))});
        case "starts":return M(([x])=>{const o=[...iterate(x,line)];return o.length<=it.length&&o.every((y,i)=>equal(it[i],y))});
        case "elementsEqual":return M(([x])=>{const o=[...iterate(x,line)];return o.length===it.length&&o.every((y,i)=>equal(it[i],y))});
        case "count(where:)":break;
        case "first(where:)":break;
        case "sorted":return M((vals,args)=>{const f=args.length?args[0].v:null;const r=new Arr(stableSort(it,sortCmp(f,line)),a.et);return r});
        case "sort":return M((vals,args)=>{const lv=mut();const arr=lv.get();const f=args.length?args[0].v:null;arr.items=stableSort(arr.items,sortCmp(f,line));return undefined});
        case "reversed":return M(()=>{const r=new Arr(it.slice().reverse(),a.et);if(!a.revStr&&!a.rev)r.rev=true;return r});
        case "reverse":return M(()=>{const lv=mut();lv.get().items.reverse();return undefined});
        case "shuffled":return M(()=>{const r=it.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return new Arr(r,a.et)});
        case "shuffle":return M(()=>{const lv=mut();const r=lv.get().items;for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return undefined});
        case "randomElement":return M(()=>it.length?new Some(it[Math.floor(Math.random()*it.length)]):NIL);
        case "map":return M((vals,args)=>{const f=fnArg(args);const r=it.map(x=>callFn(f,[{v:x}],line));return new Arr(r,r.length?typeFromV(r[0]):null)});
        case "compactMap":return M((vals,args)=>{const f=fnArg(args);const r=[];for(const x of it){const y=callFn(f,[{v:x}],line);if(y===NIL)continue;r.push(y instanceof Some?y.v:y)}return new Arr(r,r.length?typeFromV(r[0]):null)});
        case "flatMap":return M((vals,args)=>{const f=fnArg(args);const r=[];for(const x of it){const y=callFn(f,[{v:x}],line);if(y===NIL)continue;if(y instanceof Some){r.push(y.v);continue}r.push(...iterate(y,line))}return new Arr(r,null)});
        case "filter":return M((vals,args)=>{const f=fnArg(args);const r=new Arr(it.filter(x=>truth(callFn(f,[{v:x}],line))),a.et);return r});
        case "reduce":return M((vals,args)=>{const f=args[1].v;let acc=args[0].v;if(typeof acc==="number"&&args[0].lit&&it.some(x=>x instanceof D))acc=new D(acc);
          // reduce(into:) hands the closure an inout accumulator
          if(args[0].label==="into"){const c=cell(copy(acc),null,false);for(const x of it)callFn(f,[{v:c.v,ref:c},{v:x}],line);return c.v}
          // reduce(0) { $0 + $1.price }: Swift reads the 0 as 0.0 when the closure works with Doubles
          if(typeof acc==="number"&&args[0].lit&&it.length){const d0=depth,t0=tryDepth;try{acc=callFn(f,[{v:acc},{v:it[0]}],line)}catch(x){if(!(x instanceof SErr&&x.kind==="CompileError"&&/'Int' and 'Double'|'Double' and 'Int'/.test(x.message)))throw x;depth=d0;tryDepth=t0;acc=callFn(f,[{v:new D(acc)},{v:it[0]}],line)}
            for(let i=1;i<it.length;i++)acc=callFn(f,[{v:acc},{v:it[i]}],line);return acc}
          for(const x of it){acc=callFn(f,[{v:acc},{v:x}],line)}return acc});
        case "forEach":return M((vals,args)=>{const f=fnArg(args);for(const x of it)callFn(f,[{v:x}],line);return undefined});
        case "enumerated":return M(()=>new Arr(it.map((x,i)=>new Tup([i,x],["offset","element"])),null));
        case "min":return M((vals,args)=>{if(!it.length)return NIL;const c=sortCmp(args.length?args[0].v:null,line);return new Some(it.reduce((m,x)=>c(x,m)<0?x:m))});
        case "max":return M((vals,args)=>{if(!it.length)return NIL;const c=sortCmp(args.length?args[0].v:null,line);return new Some(it.reduce((m,x)=>c(x,m)>0?x:m))});
        case "joined":return M((vals,args)=>{if(args.length&&args[0].label!=="separator")fail(`line ${line}: missing argument label 'separator:' in call`);const sep=args.length?args[0].v:"";
          if(it.length&&it.every(x=>x instanceof Arr)){const r=[];it.forEach((x,i)=>{if(i&&sep instanceof Arr)r.push(...sep.items);r.push(...x.items)});return new Arr(r,it[0].et)}
          return it.map(x=>x instanceof Chr?x.s:typeof x==="string"?x:fail(`line ${line}: joined() only works on an array of Strings. Use .map { String($0) } first`)).join(sep instanceof Chr?sep.s:sep)});
        case "swapAt":return M(([i,j])=>{const lv=mut();const r=lv.get().items;if(i<0||j<0||i>=r.length||j>=r.length)fatal("Index out of range");[r[i],r[j]]=[r[j],r[i]];return undefined});
        case "prefix":return M(([k])=>{if(k instanceof Fn){const r=[];for(const x of it){if(!truth(callFn(k,[{v:x}],line)))break;r.push(x)}return slc(r,0)}return slc(it.slice(0,k),0)});
        case "suffix":return M(([k])=>slc(it.slice(Math.max(0,it.length-k)),Math.max(0,it.length-k)));
        case "dropFirst":return M(([k])=>{const n2=Math.min(it.length,k===undefined?1:k);return slc(it.slice(n2),n2)});
        case "dropLast":return M(([k])=>slc(it.slice(0,Math.max(0,it.length-(k===undefined?1:k))),0));
        case "drop":return M(([k])=>{let i=0;while(i<it.length&&truth(callFn(k,[{v:it[i]}],line)))i++;return slc(it.slice(i),i)});
        case "description":return desc(a);
        case "lazy":return a;
      }
      if(n==="first"||n==="last"){}
      fail(`line ${line}: value of type '${typeOfV(a)}' has no member '${n}'`);
    }
    function dictMember(d,n,e,env,mut){
      const line=e.line;const M=fn=>new Fn({builtin:fn});const vals=[...d.m.values()];
      switch(n){
        case "count":return d.m.size;case "isEmpty":return d.m.size===0;
        case "keys":{const a=new Arr(vals.map(x=>x[0]),d.kt);return a}
        case "values":return new Arr(vals.map(x=>x[1]),d.vt);
        case "removeValue":return M(([k])=>{const lv=mut();const dd=lv.get();const h=dd.m.get(hkey(k));dd.m.delete(hkey(k));return h?new Some(h[1]):NIL});
        case "removeAll":return M(()=>{const lv=mut();lv.get().m.clear();return undefined});
        case "updateValue":return M((v,args)=>{const lv=mut();const dd=lv.get();const k=args.find(a=>a.label==="forKey").v;const h=dd.m.get(hkey(k));dd.m.set(hkey(k),[k,copy(args[0].v)]);return h?new Some(h[1]):NIL});
        case "sorted":return M((v,args)=>{const items=vals.map(([k,x])=>new Tup([k,x],["key","value"]));return new Arr(stableSort(items,sortCmp(args.length?args[0].v:null,line)),null)});
        case "map":case "filter":case "forEach":case "reduce":case "contains":case "first":case "min":case "max":case "compactMap":case "allSatisfy":{const arr=new Arr(vals.map(([k,x])=>new Tup([k,x],["key","value"])),null);
          if(n==="filter")return M((v,args)=>{const f=args[0].v;const r=new Dict(d.kt,d.vt);for(const [h,[k,x]] of d.m)if(truth(callFn(f,[{v:new Tup([k,x],["key","value"])}],line)))r.m.set(h,[k,x]);return r});
          return arrMember(arr,n,e,env,mut)}
        case "mapValues":return M((v,args)=>{const f=args[0].v;const r=new Dict(d.kt,null);for(const [h,[k,x]] of d.m)r.m.set(h,[k,callFn(f,[{v:x}],line)]);return r});
        case "description":return desc(d);
      }
      fail(`line ${line}: value of type '${typeOfV(d)}' has no member '${n}'`);
    }
    function setMember(s,n,e,env,mut){
      const line=e.line;const M=fn=>new Fn({builtin:fn});const items=[...s.m.values()];
      const other=v=>{const r=new SetV(s.et);for(const x of iterate(v,line))r.m.set(hkey(x),x);return r};
      switch(n){
        case "count":return s.m.size;case "isEmpty":return s.m.size===0;
        case "insert":return M(([x])=>{const lv=mut();const ss=lv.get();const had=ss.m.has(hkey(x));if(!had)ss.m.set(hkey(x),copy(x));return new Tup([!had,x],["inserted","memberAfterInsert"])});
        case "remove":return M(([x])=>{const lv=mut();const ss=lv.get();const had=ss.m.get(hkey(x));ss.m.delete(hkey(x));return had!==undefined?new Some(had):NIL});
        case "contains":return M(([x])=>s.m.has(hkey(x)));
        case "union":return M(([o])=>{const r=new SetV(s.et);for(const [k,x] of s.m)r.m.set(k,x);for(const [k,x] of other(o).m)r.m.set(k,x);return r});
        case "intersection":return M(([o])=>{const ot=other(o);const r=new SetV(s.et);for(const [k,x] of s.m)if(ot.m.has(k))r.m.set(k,x);return r});
        case "subtracting":return M(([o])=>{const ot=other(o);const r=new SetV(s.et);for(const [k,x] of s.m)if(!ot.m.has(k))r.m.set(k,x);return r});
        case "isSubset":return M(([o])=>{const ot=other(o);return [...s.m.keys()].every(k=>ot.m.has(k))});
        case "symmetricDifference":return M(([o])=>{const ot=other(o);const r=new SetV(s.et);for(const [k,x] of s.m)if(!ot.m.has(k))r.m.set(k,x);for(const [k,x] of ot.m)if(!s.m.has(k))r.m.set(k,x);return r});
        case "isSuperset":return M(([o])=>[...other(o).m.keys()].every(k=>s.m.has(k)));
        case "isDisjoint":return M(([o])=>[...other(o).m.keys()].every(k=>!s.m.has(k)));
        case "isStrictSubset":return M(([o])=>{const ot=other(o);return s.m.size<ot.m.size&&[...s.m.keys()].every(k=>ot.m.has(k))});
        case "formUnion":return M(([o])=>{const ss=mut().get();for(const [k,x] of other(o).m)ss.m.set(k,x);return undefined});
        case "formIntersection":return M(([o])=>{const ss=mut().get();const ot=other(o);for(const k of [...ss.m.keys()])if(!ot.m.has(k))ss.m.delete(k);return undefined});
        case "subtract":return M(([o])=>{const ss=mut().get();for(const k of other(o).m.keys())ss.m.delete(k);return undefined});
        case "removeAll":return M(()=>{mut().get().m.clear();return undefined});
        case "filter":return M(([f])=>{const r=new SetV(s.et);for(const [k,x] of s.m)if(truth(callFn(f,[{v:x}],line)))r.m.set(k,x);return r});
        case "sorted":case "map":case "forEach":case "reduce":case "min":case "max":case "first":case "allSatisfy":case "compactMap":case "flatMap":case "contains(where:)":case "randomElement":case "enumerated":return arrMember(new Arr(items,s.et),n,e,env,mut);
      }
      fail(`line ${line}: value of type 'Set' has no member '${n}'`);
    }

    /* ----- program ----- */
    try{
      const prog=parse(lex(code)).program();
      const hoist=list=>{for(const s of list){if(s.k==="type")declareType(s)}};
      hoist(prog);
      for(const s of prog)if(s.k==="type"&&s.kind!=="extension"){}
      linkTypes();
      execList(prog,globals);
      return {out,error:null};
    }catch(x){
      if(x instanceof Ret)return {out,error:null};
      if(x instanceof Thrown){const v=x.v;return {out,error:`Fatal error: Error raised at top level: main.${v.type?v.type.name+".":""}${desc(v)}`}}
      if(x===BRK||x===CNT||x instanceof Brk)return {out:"",error:"error: 'break' is only allowed inside a loop, if, do, or switch"};
      if(x instanceof SErr){
        if(x.kind==="CompileError")return {out:"",error:"error: "+x.message};
        if(x.kind==="NotSupported")return {out:"",error:"Not supported yet: "+x.message};
        if(x.kind==="Timeout")return {out,error:"Stopped: "+x.message};
        if(x.kind==="Fatal")return {out,error:"Fatal error: "+x.message};
      }
      if(x instanceof RangeError)return {out,error:"Fatal error: stack overflow (a function keeps calling itself). Check your stopping case."};
      return {out,error:"Something went wrong inside TypeMonkey's runner: "+(x&&x.message)};
    }
  }
  return {run};
})();
if(typeof module!=="undefined")module.exports=TMSwift;
