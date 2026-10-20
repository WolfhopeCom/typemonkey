/* ---------- 80-syntax: code that looks like real code ----------
   - Syntax colors (keywords, text in quotes, numbers, comments, function names) on code tiles, the line you are
     building, read-only code examples and quiz code. The editor box itself stays plain (it's a text field).
   - After a run that doesn't pass in tap mode, the first tile that's out of place wiggles with a red outline, so you
     can see exactly what to fix (Grasshopper-style), instead of just "not quite".
   Purely visual: the text of every tile stays exactly the same. */
const SYN_KW=new Set(("if else elif for while do return function def class const let var new this self import from as in of not and or is "+
  "True False None true false null undefined print try catch except finally raise throw break continue switch case default "+
  "public private static void int float double bool boolean string String char long using namespace struct func guard "+
  "SELECT FROM WHERE ORDER BY GROUP JOIN ON AS INSERT INTO VALUES UPDATE SET DELETE LIMIT DESC ASC COUNT SUM AVG AND OR NOT LEFT HAVING DISTINCT "+
  "lambda with yield async await interface extends implements override virtual auto std cout cin endl include println Console WriteLine").split(" "));
function synHTML(src){
  const re=/(#(?![a-z]*include)[^\n]*|\/\/[^\n]*|--\s[^\n]*)|("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|`[^`]*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;
  let out="",i=0,m;
  while((m=re.exec(src))){out+=esc(src.slice(i,m.index));const t=esc(m[0]);
    if(m[1])out+=`<span class="sy-c">${t}</span>`;
    else if(m[2])out+=`<span class="sy-s">${t}</span>`;
    else if(m[3])out+=`<span class="sy-n">${t}</span>`;
    else if(m[4])out+=SYN_KW.has(m[4])?`<span class="sy-k">${t}</span>`:`<span class="sy-f">${t}</span>`;
    else out+=SYN_KW.has(m[5])?`<span class="sy-k">${t}</span>`:t;
    i=m.index+m[0].length}
  return out+esc(src.slice(i));
}
function synPaint(root){
  if(!root)return;
  const lang=(cur&&cur.c&&kindOf(cur.c))||"";if(lang==="web"||(cur&&cur.c&&cur.c.kids))return;   // HTML/CSS and Jr. blocks: leave as they are
  root.querySelectorAll(".tile:not([data-sy]),.editor pre:not([data-sy]):not(#fcode)").forEach(el=>{
    if(el.children.length)return;const t=el.textContent;if(!t.trim())return;
    el.innerHTML=synHTML(t);el.dataset.sy="1"});
}
const synObs=new MutationObserver(()=>{try{synPaint($("#screen"));synPaint($(".actionbar"))}catch(e){}});
try{synObs.observe(document.getElementById("screen"),{childList:true,subtree:true})}catch(e){}

/* wrong tile after a run that didn't pass */
const wrongObs=new MutationObserver(()=>{try{
  const fb=$("#fb .feedback.bad");if(!fb||fb.dataset.tw)return;fb.dataset.tw="1";
  if(!$("#screen").classList.contains("tapmode")||typeof TILE_PLAN==="undefined"||!TILE_PLAN)return;
  const want=TILE_PLAN.pieces.map(x=>x.trim()),placed=$$("#tbuild .tile.on");
  const k=placed.findIndex((el,i)=>el.textContent.trim()!==want[i]);
  if(k<0)return;const el=placed[k];el.classList.remove("tilewrong");void el.offsetWidth;el.classList.add("tilewrong");
  setTimeout(()=>{try{el.classList.remove("tilewrong")}catch(e){}},2600);
  try{haptic("warning")}catch(e){}
}catch(e){}});
try{wrongObs.observe(document.getElementById("screen"),{childList:true,subtree:true})}catch(e){}
