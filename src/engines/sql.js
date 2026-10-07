/* TypeMonkey SQL: a small in-house SQL engine with SQLite-style behavior.
   Supports CREATE TABLE, INSERT, UPDATE, DELETE and SELECT with DISTINCT, joins (INNER/LEFT),
   WHERE, GROUP BY, HAVING, ORDER BY, LIMIT/OFFSET, subqueries (incl. EXISTS), WITH, CASE, aggregates and common functions.
   TMSQL.run(sql, tables) -> {ok, columns, rows, error}. Tables: {name:{cols:[...], rows:[[...]]}} (copied, never mutated). */
const TMSQL=(()=>{
  class Real{constructor(x){this.x=x}}           // REAL values (so 4.0 prints as 4.0, like SQLite)
  const num=v=>v instanceof Real?v.x:v;
  const isNum=v=>typeof v==="number"||v instanceof Real;
  const mk=(x,real)=>real||!Number.isInteger(x)?new Real(x):x;
  class SqlError extends Error{}
  const fail=m=>{throw new SqlError(m)};

  /* ---------- tokenizer ---------- */
  const KW=new Set("SELECT FROM WHERE AND OR NOT AS ORDER BY GROUP HAVING LIMIT OFFSET ASC DESC DISTINCT JOIN INNER LEFT OUTER ON IS NULL IN LIKE BETWEEN INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE PRIMARY KEY CASE WHEN THEN ELSE END TRUE FALSE UNIQUE DEFAULT CROSS ALL DROP IF EXISTS".split(" "));
  function lex(src){
    const t=[];let i=0;
    while(i<src.length){
      const c=src[i];
      if(/\s/.test(c)){i++;continue}
      if(c==="-"&&src[i+1]==="-"){while(i<src.length&&src[i]!=="\n")i++;continue}
      if(c==="/"&&src[i+1]==="*"){const j=src.indexOf("*/",i+2);i=j<0?src.length:j+2;continue}
      if(c==="'"){let s="";i++;for(;;){if(i>=src.length)fail("unfinished text: a ' is missing");if(src[i]==="'"){if(src[i+1]==="'"){s+="'";i+=2;continue}i++;break}s+=src[i++]}t.push({k:"str",v:s});continue}
      if(c==='"'||c==="`"||c==="["){const close=c==="["?"]":c;const j=src.indexOf(close,i+1);if(j<0)fail("unfinished name");t.push({k:"id",v:src.slice(i+1,j)});i=j+1;continue}
      if(/[0-9]/.test(c)||(c==="."&&/[0-9]/.test(src[i+1]))){let j=i;while(/[0-9.]/.test(src[j]))j++;const s=src.slice(i,j);t.push({k:"num",v:s.includes(".")?new Real(parseFloat(s)):parseInt(s,10)});i=j;continue}
      if(/[A-Za-z_]/.test(c)){let j=i;while(j<src.length&&/[A-Za-z0-9_]/.test(src[j]))j++;const w=src.slice(i,j);const u=w.toUpperCase();t.push(KW.has(u)?{k:"kw",v:u}:{k:"id",v:w});i=j;continue}
      const two=src.slice(i,i+2);
      if(["<=",">=","<>","!=","==","||"].includes(two)){t.push({k:"op",v:two});i+=2;continue}
      if("=<>+-*/%(),.;".includes(c)){t.push({k:"op",v:c});i++;continue}
      fail(`unexpected character "${c}"`);
    }
    t.push({k:"eof",v:""});return t;
  }

  /* ---------- parser ---------- */
  function parser(tokens){
    let p=0;
    const peek=(o=0)=>tokens[p+o];
    const isKw=(v,o=0)=>peek(o).k==="kw"&&peek(o).v===v;
    const isOp=(v,o=0)=>peek(o).k==="op"&&peek(o).v===v;
    const near=()=>peek().k==="eof"?"the end":`"${peek().v instanceof Real?peek().v.x:peek().v}"`;
    const kw=v=>{if(!isKw(v))fail(`expected ${v} near ${near()}`);p++};
    const op=v=>{if(!isOp(v))fail(`expected "${v}" near ${near()}`);p++};
    const acceptKw=v=>{if(isKw(v)){p++;return true}return false};
    const acceptOp=v=>{if(isOp(v)){p++;return true}return false};
    const ident=()=>{const t=peek();if(t.k==="id"||(t.k==="kw"&&["KEY","DEFAULT"].includes(t.v))){p++;return t.v}fail(`expected a name near ${near()}`)};

    function statement(){
      if(isKw("SELECT"))return select();
      if(isKw("INSERT"))return insert();
      if(isKw("UPDATE"))return update();
      if(isKw("DELETE"))return del();
      if(isKw("CREATE"))return create();
      if(isKw("DROP")){p++;kw("TABLE");let ie=false;if(acceptKw("IF")){kw("EXISTS");ie=true}return {type:"drop",table:ident(),ifExists:ie}}
      fail(`near ${near()}: syntax error. Statements start with SELECT, INSERT, UPDATE, DELETE or CREATE`);
    }
    function select(){
      kw("SELECT");const distinct=acceptKw("DISTINCT");acceptKw("ALL");
      const items=[];
      do{
        if(isOp("*")){p++;items.push({star:true});continue}
        if(peek().k==="id"&&isOp(".",1)&&isOp("*",2)){const t=ident();p+=2;items.push({star:true,table:t});continue}
        const e=expr();let alias=null;
        if(acceptKw("AS"))alias=ident();else if(peek().k==="id"||peek().k==="str")alias=peek().v,p++;
        items.push({e,alias});
      }while(acceptOp(","));
      let from=null;const joins=[];
      if(acceptKw("FROM")){
        from=source();
        for(;;){
          if(acceptOp(",")){joins.push({kind:"inner",src:source(),on:null});continue}
          let kind=null;
          if(isKw("JOIN")||isKw("INNER")){acceptKw("INNER");kw("JOIN");kind="inner"}
          else if(isKw("LEFT")){p++;acceptKw("OUTER");kw("JOIN");kind="left"}
          else if(isKw("CROSS")){p++;kw("JOIN");kind="inner"}
          if(!kind)break;
          const src=source();let on=null;if(acceptKw("ON"))on=expr();
          joins.push({kind,src,on});
        }
      }
      const where=acceptKw("WHERE")?expr():null;
      let group=null,having=null,order=null,limit=null,offset=null;
      if(acceptKw("GROUP")){kw("BY");group=[];do group.push(expr());while(acceptOp(","))}
      if(acceptKw("HAVING"))having=expr();
      if(acceptKw("ORDER")){kw("BY");order=[];do{const e=expr();let desc=false;if(acceptKw("DESC"))desc=true;else acceptKw("ASC");order.push({e,desc})}while(acceptOp(","))}
      if(acceptKw("LIMIT")){limit=expr();if(acceptKw("OFFSET"))offset=expr();else if(acceptOp(",")){offset=limit;limit=expr()}}
      return {type:"select",distinct,items,from,joins,where,group,having,order,limit,offset};
    }
    function source(){
      if(acceptOp("(")){const q=select();op(")");acceptKw("AS");let alias=null;if(peek().k==="id")alias=ident();return {sub:q,alias:alias||"subquery"}}
      const name=ident();let alias=name;
      if(acceptKw("AS"))alias=ident();else if(peek().k==="id")alias=ident();
      return {table:name,alias};
    }
    function insert(){
      kw("INSERT");kw("INTO");const table=ident();let cols=null;
      if(acceptOp("(")){cols=[];do cols.push(ident());while(acceptOp(","));op(")")}
      if(isKw("SELECT"))return {type:"insert",table,cols,select:select()};
      kw("VALUES");const rows=[];
      do{op("(");const r=[];do r.push(expr());while(acceptOp(","));op(")");rows.push(r)}while(acceptOp(","));
      return {type:"insert",table,cols,rows};
    }
    function update(){
      kw("UPDATE");const table=ident();kw("SET");const sets=[];
      do{const c=ident();op("=");sets.push([c,expr()])}while(acceptOp(","));
      return {type:"update",table,sets,where:acceptKw("WHERE")?expr():null};
    }
    function del(){kw("DELETE");kw("FROM");const table=ident();return {type:"delete",table,where:acceptKw("WHERE")?expr():null}}
    function create(){
      kw("CREATE");kw("TABLE");let ine=false;if(acceptKw("IF")){kw("NOT");kw("EXISTS");ine=true}
      const table=ident();op("(");const cols=[],notNull=[],pk=[];
      do{
        if(isKw("PRIMARY")){p++;kw("KEY");op("(");do pk.push(ident());while(acceptOp(","));op(")");continue}
        const name=ident();cols.push(name);let nn=false;
        while(!isOp(",")&&!isOp(")")&&peek().k!=="eof"){
          if(acceptKw("NOT")){kw("NULL");nn=true;continue}
          if(acceptKw("PRIMARY")){kw("KEY");pk.push(name);continue}
          if(acceptKw("DEFAULT")){primary();continue}
          if(acceptOp("(")){let d=1;while(d&&peek().k!=="eof"){if(isOp("("))d++;if(isOp(")"))d--;p++}continue}
          p++;
        }
        notNull.push(nn);
      }while(acceptOp(","));
      op(")");return {type:"create",table,cols,notNull,pk,ifNotExists:ine};
    }
    /* expressions, lowest precedence first */
    function expr(){return orE()}
    function orE(){let l=andE();while(acceptKw("OR"))l={op:"or",l,r:andE()};return l}
    function andE(){let l=notE();while(acceptKw("AND"))l={op:"and",l,r:notE()};return l}
    function notE(){if(acceptKw("NOT"))return {op:"not",e:notE()};return cmp()}
    function cmp(){
      let l=add();
      for(;;){
        const t=peek();
        if(t.k==="op"&&["=","==","<>","!=","<","<=",">",">="].includes(t.v)){p++;l={op:t.v==="=="?"=":t.v==="!="?"<>":t.v,l,r:add()};continue}
        if(isKw("IS")){p++;const neg=acceptKw("NOT");kw("NULL");l={op:"isnull",e:l,neg};continue}
        let neg=false;
        if(isKw("NOT")&&(isKw("IN",1)||isKw("LIKE",1)||isKw("BETWEEN",1))){p++;neg=true}
        if(acceptKw("IN")){op("(");let list;if(isKw("SELECT"))list={sub:select()};else{list=[];if(!isOp(")"))do list.push(expr());while(acceptOp(","))}op(")");l={op:"in",e:l,list,neg};continue}
        if(acceptKw("LIKE")){l={op:"like",l,r:add(),neg};continue}
        if(acceptKw("BETWEEN")){const lo=add();kw("AND");const hi=add();l={op:"between",e:l,lo,hi,neg};continue}
        if(neg)fail(`near ${near()}: syntax error`);
        return l;
      }
    }
    function add(){let l=mul();for(;;){if(isOp("+")||isOp("-")||isOp("||")){const o=peek().v;p++;l={op:o,l,r:mul()}}else return l}}
    function mul(){let l=unary();for(;;){if(isOp("*")||isOp("/")||isOp("%")){const o=peek().v;p++;l={op:o,l,r:unary()}}else return l}}
    function unary(){if(acceptOp("-"))return {op:"neg",e:unary()};if(acceptOp("+"))return unary();return primary()}
    function primary(){
      const t=peek();
      if(t.k==="num"){p++;return {lit:t.v}}
      if(t.k==="str"){p++;return {lit:t.v}}
      if(isKw("NULL")){p++;return {lit:null}}
      if(isKw("TRUE")){p++;return {lit:1}}
      if(isKw("FALSE")){p++;return {lit:0}}
      if(acceptOp("(")){if(isKw("SELECT")){const q=select();op(")");return {scalar:q}}const e=expr();op(")");return e}
      if(isKw("EXISTS")){p++;op("(");if(!isKw("SELECT"))fail("EXISTS needs a query, like EXISTS (SELECT ...)");const q=select();op(")");return {exists:q}}
      if(isKw("CASE")){
        p++;let base=null;if(!isKw("WHEN"))base=expr();const whens=[];
        while(acceptKw("WHEN")){const w=expr();kw("THEN");whens.push([w,expr()])}
        const els=acceptKw("ELSE")?expr():null;kw("END");return {cas:true,base,whens,els};
      }
      if(t.k==="id"){
        p++;
        if(isOp("(")){
          p++;const fn=t.v.toUpperCase();
          if(fn==="COUNT"&&isOp("*")){p++;op(")");return {fn,star:true}}
          const distinct=acceptKw("DISTINCT");const args=[];
          if(!isOp(")"))do args.push(expr());while(acceptOp(","));
          op(")");return {fn,args,distinct};
        }
        if(acceptOp("."))return {col:ident(),table:t.v};
        return {col:t.v};
      }
      fail(`near ${near()}: syntax error`);
    }
    function all(){
      const out=[];
      while(peek().k!=="eof"){if(acceptOp(";"))continue;out.push(statement());if(!acceptOp(";")&&peek().k!=="eof")fail(`near ${near()}: syntax error (missing a ; between statements?)`)}
      return out;
    }
    return {all};
  }

  /* ---------- evaluation ---------- */
  const AGG=new Set(["COUNT","SUM","AVG","MIN","MAX","TOTAL","GROUP_CONCAT"]);
  const hasAgg=e=>!!e&&typeof e==="object"&&(e.fn&&AGG.has(e.fn)&&!(e.fn==="MIN"&&e.args&&e.args.length>1)&&!(e.fn==="MAX"&&e.args&&e.args.length>1)||["l","r","e","lo","hi","base","els"].some(k=>hasAgg(e[k]))||(e.args||[]).some(hasAgg)||(Array.isArray(e.list)&&e.list.some(hasAgg))||(e.whens||[]).some(w=>hasAgg(w[0])||hasAgg(w[1])));
  const truthy=v=>v!==null&&num(typeof v==="string"?(parseFloat(v)||0):v)!==0;
  function compare(a,b){  // SQLite ordering: NULL < numbers < text
    if(a===null||b===null)return a===null&&b===null?0:a===null?-1:1;
    const an=isNum(a),bn=isNum(b);
    if(an&&bn)return num(a)-num(b);
    if(an)return -1;if(bn)return 1;
    return a<b?-1:a>b?1:0;
  }
  const likeRe=pat=>new RegExp("^"+[...pat].map(ch=>ch==="%"?"[\\s\\S]*":ch==="_"?"[\\s\\S]":ch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("")+"$","i");
  function arith(o,a,b){
    if(a===null||b===null)return null;
    if(typeof a==="string")a=parseFloat(a)||0;if(typeof b==="string")b=parseFloat(b)||0;
    const real=a instanceof Real||b instanceof Real;const x=num(a),y=num(b);
    if(o==="+")return mk(x+y,real);if(o==="-")return mk(x-y,real);if(o==="*")return mk(x*y,real);
    if(o==="/"){if(y===0)return null;return real?new Real(x/y):Math.trunc(x/y)}
    if(o==="%"){if(y===0)return null;return real?new Real(x%y):x%y}
  }
  const show=v=>v===null?"NULL":v instanceof Real?(Number.isInteger(v.x)?v.x.toFixed(1):String(v.x)):String(v);

  function makeDB(tables){
    const db={};
    for(const [n,t] of Object.entries(tables||{}))db[n.toLowerCase()]={name:n,cols:[...t.cols],rows:t.rows.map(r=>[...r]),notNull:t.cols.map(()=>false)};
    return db;
  }
  function getTable(db,name){const t=db[name.toLowerCase()];if(!t)fail(`no such table: ${name}`);return t}

  // A row context is a list of {alias, cols, vals}; lookup finds a column by name (and optional table alias)
  function lookup(ctx,ref){
    let found=null;
    for(const f of ctx.frames){
      if(ref.table&&f.alias.toLowerCase()!==ref.table.toLowerCase())continue;
      const i=f.cols.findIndex(c=>c.toLowerCase()===ref.col.toLowerCase());
      if(i>=0){if(found&&!ref.table)fail(`ambiguous column name: ${ref.col}. Add the table name, like table.${ref.col}`);found={v:f.vals?f.vals[i]:null}}
    }
    if(found)return found.v;
    if(ctx.outer)return lookup(ctx.outer,ref);
    if(ref.table&&!ctx.frames.some(f=>f.alias.toLowerCase()===ref.table.toLowerCase()))fail(`no such table or alias: ${ref.table}`);
    fail(`no such column: ${ref.table?ref.table+".":""}${ref.col}`);
  }

  function evalE(e,ctx,db){
    if("lit" in e)return e.lit;
    if(e.col!==undefined){
      if(!e.table&&ctx.aliases&&ctx.aliases.has(e.col.toLowerCase())&&!ctx.frames.some(f=>f.cols.some(c=>c.toLowerCase()===e.col.toLowerCase())))return ctx.aliases.get(e.col.toLowerCase());
      return lookup(ctx,e);
    }
    if(e.scalar){const r=runSelect(e.scalar,db,ctx);return r.rows.length?r.rows[0][0]:null}
    if(e.exists)return runSelect(e.exists,db,ctx).rows.length?1:0;
    if(e.cas){
      const base=e.base?evalE(e.base,ctx,db):undefined;
      for(const [w,t] of e.whens){const wv=evalE(w,ctx,db);if(base!==undefined?(base!==null&&wv!==null&&compare(base,wv)===0):truthy(wv))return evalE(t,ctx,db)}
      return e.els?evalE(e.els,ctx,db):null;
    }
    if(e.fn){
      if(AGG.has(e.fn)&&!((e.fn==="MIN"||e.fn==="MAX")&&e.args&&e.args.length>1)){
        if(!ctx.group)fail(`misuse of aggregate function ${e.fn}()`);
        const rows=ctx.group;
        if(e.star)return rows.length;
        let vals=rows.map(r=>evalE(e.args[0],r,db)).filter(v=>v!==null);
        if(e.distinct){const seen=[];vals=vals.filter(v=>{if(seen.some(s=>compare(s,v)===0&&typeof s===typeof v))return false;seen.push(v);return true})}
        if(e.fn==="COUNT")return vals.length;
        if(e.fn==="GROUP_CONCAT")return vals.length?vals.map(show).join(e.args[1]?show(evalE(e.args[1],rows[0],db)):","):null;
        if(e.fn==="MIN"||e.fn==="MAX"){if(!vals.length)return null;return vals.reduce((a,b)=>(e.fn==="MIN"?compare(b,a)<0:compare(b,a)>0)?b:a)}
        const nums=vals.map(v=>typeof v==="string"?(parseFloat(v)||0):v);
        const real=nums.some(v=>v instanceof Real);const sum=nums.reduce((a,b)=>a+num(b),0);
        if(e.fn==="TOTAL")return new Real(sum);
        if(e.fn==="SUM")return nums.length?mk(sum,real):null;
        if(e.fn==="AVG")return nums.length?new Real(sum/nums.length):null;
      }
      const a=(e.args||[]).map(x=>evalE(x,ctx,db));
      switch(e.fn){
        case "COALESCE":case "IFNULL":return a.find(v=>v!==null)??null;
        case "UPPER":return a[0]===null?null:show(a[0]).toUpperCase();
        case "LOWER":return a[0]===null?null:show(a[0]).toLowerCase();
        case "LENGTH":return a[0]===null?null:show(a[0]).length;
        case "ABS":return a[0]===null?null:mk(Math.abs(num(a[0])),a[0] instanceof Real);
        case "ROUND":{if(a[0]===null)return null;const d=a[1]?num(a[1]):0;const f=10**d;return new Real(Math.round(num(a[0])*f+(num(a[0])>=0?1e-9:-1e-9))/f)}
        case "MIN":return a.includes(null)?null:a.reduce((x,y)=>compare(y,x)<0?y:x);
        case "MAX":return a.includes(null)?null:a.reduce((x,y)=>compare(y,x)>0?y:x);
        case "SUBSTR":case "SUBSTRING":{if(a[0]===null)return null;const s=show(a[0]);const st=num(a[1]);const len=a[2]===undefined?undefined:num(a[2]);const from=st>0?st-1:Math.max(0,s.length+st);return len===undefined?s.slice(from):s.substr(from,len)}
        case "TRIM":return a[0]===null?null:show(a[0]).trim();
        case "REPLACE":return a[0]===null?null:show(a[0]).split(show(a[1])).join(show(a[2]));
        case "NULLIF":return compare(a[0],a[1])===0?null:a[0];
        default:fail(`no such function: ${e.fn}`);
      }
    }
    switch(e.op){
      case "or":{const l=evalE(e.l,ctx,db);if(l!==null&&truthy(l))return 1;const r=evalE(e.r,ctx,db);if(r!==null&&truthy(r))return 1;return l===null||r===null?null:0}
      case "and":{const l=evalE(e.l,ctx,db);if(l!==null&&!truthy(l))return 0;const r=evalE(e.r,ctx,db);if(r!==null&&!truthy(r))return 0;return l===null||r===null?null:1}
      case "not":{const v=evalE(e.e,ctx,db);return v===null?null:truthy(v)?0:1}
      case "neg":{const v=evalE(e.e,ctx,db);return v===null?null:mk(-num(v),v instanceof Real)}
      case "isnull":{const v=evalE(e.e,ctx,db);return (v===null)!==e.neg?1:0}
      case "in":{
        const v=evalE(e.e,ctx,db);if(v===null)return null;
        const list=e.list.sub?runSelect(e.list.sub,db,ctx).rows.map(r=>r[0]):e.list.map(x=>evalE(x,ctx,db));
        const hit=list.some(x=>x!==null&&compare(x,v)===0&&isNum(x)===isNum(v));return hit!==e.neg?1:0;
      }
      case "like":{const l=evalE(e.l,ctx,db),r=evalE(e.r,ctx,db);if(l===null||r===null)return null;return likeRe(show(r)).test(show(l))!==e.neg?1:0}
      case "between":{const v=evalE(e.e,ctx,db),lo=evalE(e.lo,ctx,db),hi=evalE(e.hi,ctx,db);if(v===null||lo===null||hi===null)return null;return (compare(v,lo)>=0&&compare(v,hi)<=0)!==e.neg?1:0}
      case "||":{const l=evalE(e.l,ctx,db),r=evalE(e.r,ctx,db);return l===null||r===null?null:show(l)+show(r)}
      case "+":case "-":case "*":case "/":case "%":return arith(e.op,evalE(e.l,ctx,db),evalE(e.r,ctx,db));
      default:{
        const l=evalE(e.l,ctx,db),r=evalE(e.r,ctx,db);if(l===null||r===null)return null;
        let c;
        if(isNum(l)!==isNum(r)){const ln=typeof l==="string"&&l.trim()!==""&&!isNaN(+l),rn=typeof r==="string"&&r.trim()!==""&&!isNaN(+r);c=ln?num(+l)-num(r):rn?num(l)-(+r):compare(l,r)}
        else c=compare(l,r);
        return ({"=":c===0,"<>":c!==0,"<":c<0,"<=":c<=0,">":c>0,">=":c>=0})[e.op]?1:0;
      }
    }
  }

  function sourceRows(src,db,outer){
    if(src.sub){const r=runSelect(src.sub,db,outer);return {alias:src.alias,cols:r.columns,rows:r.rows}}
    const t=getTable(db,src.table);return {alias:src.alias,cols:t.cols,rows:t.rows};
  }
  function exprName(e){
    if(e.col!==undefined)return e.col;
    if(e.fn)return e.fn.toLowerCase().replace(/^./,c=>c.toUpperCase()).replace(/^(\w+)$/,s=>e.fn)+"("+(e.star?"*":(e.distinct?"DISTINCT ":"")+(e.args||[]).map(exprName).join(", "))+")";
    if("lit" in e)return show(e.lit);
    if(e.op&&e.l)return exprName(e.l)+" "+e.op+" "+exprName(e.r);
    return "?";
  }

  function runSelect(q,db,outer){
    // FROM + joins
    let rows=[{frames:[],outer}];
    if(q.from){
      const s=sourceRows(q.from,db,outer);
      rows=s.rows.map(v=>({frames:[{alias:s.alias,cols:s.cols,vals:v}],outer}));
      for(const j of q.joins){
        const s2=sourceRows(j.src,db,outer);const next=[];
        for(const r of rows){
          let matched=false;
          for(const v of s2.rows){
            const ctx={frames:[...r.frames,{alias:s2.alias,cols:s2.cols,vals:v}],outer};
            if(!j.on||truthy(evalE(j.on,ctx,db))){next.push(ctx);matched=true}
          }
          if(!matched&&j.kind==="left")next.push({frames:[...r.frames,{alias:s2.alias,cols:s2.cols,vals:s2.cols.map(()=>null)}],outer});
        }
        rows=next;
      }
    }
    if(q.where)rows=rows.filter(r=>{const v=evalE(q.where,r,db);return v!==null&&truthy(v)});
    // columns
    const allFrames=rows[0]?rows[0].frames:(q.from?[sourceRows(q.from,db,outer),...q.joins.map(j=>sourceRows(j.src,db,outer))].map(s=>({alias:s.alias,cols:s.cols})):[]);
    const cols=[],getters=[];
    for(const it of q.items){
      if(it.star){
        const fr=allFrames.filter(f=>!it.table||f.alias.toLowerCase()===it.table.toLowerCase());
        if(it.table&&!fr.length)fail(`no such table: ${it.table}`);
        if(!q.from)fail("SELECT * needs a FROM table");
        fr.forEach(f=>{const fi=allFrames.indexOf(f);f.cols.forEach((c,ci)=>{cols.push(c);getters.push(ctx=>ctx.frames[fi].vals[ci])})});
      }else{cols.push(it.alias||exprName(it.e));getters.push(ctx=>evalE(it.e,ctx,db))}
    }
    const aggregate=q.group||q.items.some(it=>it.e&&hasAgg(it.e))||(q.having&&hasAgg(q.having));
    let out=[];  // {vals, ctx}
    const aliasMap=vals=>new Map(q.items.map((it,i)=>[it.alias?it.alias.toLowerCase():null,vals[i]]).filter(([k])=>k));
    if(aggregate){
      let groups;
      if(q.group){
        const m=new Map();
        const gexprs=q.group.map(g=>{if(g.col!==undefined&&!g.table){const it=q.items.find(it=>it.alias&&it.alias.toLowerCase()===g.col.toLowerCase());
          if(it&&!(rows[0]&&rows[0].frames.some(f=>f.cols.some(c=>c.toLowerCase()===g.col.toLowerCase()))))return it.e}
          if("lit" in g&&typeof g.lit==="number"&&q.items[g.lit-1]&&q.items[g.lit-1].e)return q.items[g.lit-1].e;return g});
        for(const r of rows){const key=gexprs.map(g=>evalE(g,{...r,aliases:null},db));const k=JSON.stringify(key.map(v=>v instanceof Real?["r",v.x]:v));if(!m.has(k))m.set(k,{key,rows:[]});m.get(k).rows.push(r)}
        groups=[...m.values()];
        groups.sort((a,b)=>{for(let i=0;i<a.key.length;i++){const c=compare(a.key[i],b.key[i]);if(c)return c}return 0});
      }else groups=[{rows}];
      for(const g of groups){
        const base=g.rows[0]||{frames:allFrames.map(f=>({...f,vals:f.cols.map(()=>null)})),outer};
        const ctx={...base,group:g.rows};
        const vals=getters.map(f=>f(ctx));ctx.aliases=aliasMap(vals);
        if(q.having){const h=evalE(q.having,ctx,db);if(h===null||!truthy(h))continue}
        out.push({vals,ctx});
      }
    }else{
      for(const r of rows){const vals=getters.map(f=>f(r));out.push({vals,ctx:{...r,aliases:aliasMap(vals)}})}
    }
    if(q.distinct){const seen=new Set();out=out.filter(o=>{const k=JSON.stringify(o.vals.map(v=>v instanceof Real?["r",v.x]:v));if(seen.has(k))return false;seen.add(k);return true})}
    if(q.order){
      const keyOf=(o,e)=>{if("lit" in e&&typeof e.lit==="number"){const i=e.lit-1;if(i<0||i>=o.vals.length)fail(`ORDER BY column number ${e.lit} is out of range`);return o.vals[i]}return evalE(e,o.ctx,db)};
      const keyed=out.map((o,i)=>({o,i,k:q.order.map(x=>keyOf(o,x.e))}));
      keyed.sort((a,b)=>{for(let i=0;i<q.order.length;i++){let c=compare(a.k[i],b.k[i]);if(q.order[i].desc)c=-c;if(c)return c}return a.i-b.i});
      out=keyed.map(x=>x.o);
    }
    if(q.limit){const n=num(evalE(q.limit,{frames:[]},db));const off=q.offset?num(evalE(q.offset,{frames:[]},db)):0;out=out.slice(off,n<0?undefined:off+n)}
    return {columns:cols,rows:out.map(o=>o.vals)};
  }

  function exec(st,db){
    if(st.type==="select")return runSelect(st,db,null);
    if(st.type==="create"){
      const key=st.table.toLowerCase();
      if(db[key]){if(st.ifNotExists)return null;fail(`table ${st.table} already exists`)}
      db[key]={name:st.table,cols:st.cols,rows:[],notNull:st.notNull,pk:st.pk};return null;
    }
    if(st.type==="drop"){const key=st.table.toLowerCase();if(!db[key]){if(st.ifExists)return null;fail(`no such table: ${st.table}`)}delete db[key];return null}
    const t=getTable(db,st.table);
    const ctxFor=vals=>({frames:[{alias:t.name,cols:t.cols,vals}]});
    const check=row=>{t.cols.forEach((c,i)=>{if(t.notNull&&t.notNull[i]&&row[i]===null)fail(`NOT NULL constraint failed: ${t.name}.${c}`)});
      (t.pk||[]).forEach(pk=>{const i=t.cols.findIndex(c=>c.toLowerCase()===pk.toLowerCase());if(i>=0&&row[i]!==null&&t.rows.some(r=>r!==row&&compare(r[i],row[i])===0))fail(`UNIQUE constraint failed: ${t.name}.${pk}`)})};
    if(st.type==="insert"){
      const idx=st.cols?st.cols.map(c=>{const i=t.cols.findIndex(x=>x.toLowerCase()===c.toLowerCase());if(i<0)fail(`table ${t.name} has no column named ${c}`);return i}):t.cols.map((c,i)=>i);
      const vals=st.select?runSelect(st.select,db,null).rows:st.rows.map(r=>r.map(e=>evalE(e,{frames:[]},db)));
      for(const v of vals){
        if(v.length!==idx.length)fail(`${idx.length} values were expected but ${v.length} were given`);
        const row=t.cols.map(()=>null);idx.forEach((ci,k)=>row[ci]=v[k]);
        (t.pk||[]).forEach(pk=>{const i=t.cols.findIndex(c=>c.toLowerCase()===pk.toLowerCase());if(i>=0&&row[i]===null&&t.pk.length===1)row[i]=Math.max(0,...t.rows.map(r=>num(r[i])||0))+1});
        t.rows.push(row);check(row);
      }
      return null;
    }
    if(st.type==="update"){
      const idx=st.sets.map(([c])=>{const i=t.cols.findIndex(x=>x.toLowerCase()===c.toLowerCase());if(i<0)fail(`no such column: ${c}`);return i});
      for(const r of t.rows){
        if(st.where){const v=evalE(st.where,ctxFor(r),db);if(v===null||!truthy(v))continue}
        const nv=st.sets.map(([,e])=>evalE(e,ctxFor(r),db));idx.forEach((ci,k)=>r[ci]=nv[k]);check(r);
      }
      return null;
    }
    if(st.type==="delete"){t.rows=t.rows.filter(r=>{if(!st.where)return false;const v=evalE(st.where,ctxFor(r),db);return !(v!==null&&truthy(v))});return null}
  }

  // WITH name AS (SELECT ...) main query  ->  main query with FROM (SELECT ...) AS name
  const KEYW=/^(WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|ON|GROUP|ORDER|LIMIT|HAVING|UNION|OFFSET)$/i;
  function expandWith(sql){
    const m=sql.match(/^\s*WITH\s+/i);if(!m)return sql;
    let i=m[0].length;const ctes=[];
    for(;;){
      const nm=sql.slice(i).match(/^([A-Za-z_]\w*)\s+AS\s*\(/i);if(!nm)throw new SqlError('near "WITH": write it like WITH name AS (SELECT ...) SELECT ...');
      i+=nm[0].length;let d=1,j=i,q=null;
      for(;j<sql.length&&d;j++){const c=sql[j];if(q){if(c===q)q=null;continue}if(c==="'"||c==='"'){q=c;continue}if(c==="(")d++;else if(c===")")d--}
      if(d)throw new SqlError("a WITH query is missing its closing )");
      let body=sql.slice(i,j-1);for(const c of ctes)body=subst(body,c);
      ctes.push({name:nm[1],body});i=j;
      const rest=sql.slice(i).match(/^\s*,\s*/);if(rest){i+=rest[0].length;continue}break;
    }
    let main=sql.slice(i);for(const c of ctes)main=subst(main,c);return main;
  }
  function subst(text,c){
    return text.replace(new RegExp("\\b(FROM|JOIN)\\s+"+c.name+"\\b(\\s+(?:AS\\s+)?([A-Za-z_]\\w*))?","gi"),(all,kw,aliasPart,alias)=>{
      if(alias&&!KEYW.test(alias))return `${kw} (${c.body}) AS ${alias}`;
      return `${kw} (${c.body}) AS ${c.name}${aliasPart||""}`});
  }
  function run(sql,tables){
    try{
      sql=expandWith(sql);
      const db=makeDB(tables);
      const sts=parser(lex(sql)).all();
      if(!sts.length)return {ok:true,columns:[],rows:[],empty:true};
      let last=null;
      for(const s of sts){const r=exec(s,db);if(r)last=r}
      if(!last)return {ok:true,columns:[],rows:[],message:"Done. (No SELECT, so there are no rows to show.)",db};
      return {ok:true,columns:last.columns,rows:last.rows,db};
    }catch(e){
      if(e instanceof SqlError)return {ok:false,error:e.message};
      return {ok:false,error:"Something went wrong running that query: "+e.message};
    }
  }
  const text=r=>!r.ok?null:r.rows.length?r.rows.map(row=>row.map(show).join(" | ")).join("\n"):(r.message||"(no rows)");
  return {run,text,show};
})();
if(typeof module!=="undefined")module.exports=TMSQL;
