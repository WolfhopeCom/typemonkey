/* ---------- 50-beginner: help for people who have never coded ----------
   1. Word helper: coding words in lesson text (bold words and inline code like console.log()) get a dotted
      underline. Tap one for a plain-English meaning. Works in every course.
   2. Tap coach: the first few times you meet a demo, a fill-in-the-gap puzzle or a tile puzzle, a bouncing
      hand points at exactly what to tap next (the right piece, then Check / Run, then Continue), with a
      short "do this" line. Wrong piece placed? The hand points at it to take it back. Skipped for people
      who told onboarding "I already code".
   Hooks: renderStep (decorate words, start the coach), wireTiles (remembers the tile plan).
   State: S.coach={demo,fill,tiles} (times shown), S.glossTip (the one-time "tap a word" tip was shown). */

const GLOSS={
  "code":["Code","Instructions for a computer, written in a coding language. Like a recipe the computer follows step by step."],
  "program":["Program","A set of code instructions that does something, like a game or an app."],
  "javascript":["JavaScript","A coding language. It runs inside every web browser, so websites and web games use it."],
  "python":["Python","A coding language that reads almost like English. Used for AI, games, science and more."],
  "console":["The console","The box under your code where the computer shows its answers and messages."],
  "console.log":["console.log( )","JavaScript's way to say “show this message”. Whatever is inside the ( ) appears in the console."],
  "print":["print( )","Python's way to say “show this on the screen”. Whatever is inside the ( ) appears in the output box."],
  "output":["Output","What your code shows when it runs. It appears in the box under the code."],
  "( )":["Parentheses ( )","Round brackets. The thing inside them is what the instruction works with. print(\"hi\") shows hi."],
  "\" \"":["Quotes \" \"","Quotes go around words so the computer knows they're text to show, not instructions to follow."],
  "string":["String","Text, like a word or a sentence. Strings go inside quotes: \"banana\"."],
  "strings":["String","Text, like a word or a sentence. Strings go inside quotes: \"banana\"."],
  "str":["str (string)","Python's name for text, like \"banana\". It goes inside quotes."],
  "variable":["Variable","A box with a name on it. You put something in it, then use the name to get it back later."],
  "const":["const","Makes a new named box (a variable) in JavaScript. A const box keeps the same thing inside."],
  "let":["let","Makes a new named box (a variable) in JavaScript that you can change later."],
  "var":["var","An old way to make a variable. let and const are the modern ways."],
  "value":["Value","The thing stored in a box, like 3, \"banana\" or True."],
  "number":["Number","A number the computer can do math with, like 7 or 3.5. Numbers don't need quotes."],
  "int":["int","A whole number, like 3 or 100. No decimal point."],
  "float":["float","A number with a decimal point, like 3.5."],
  "bool":["bool (true or false)","A value that's only ever yes or no: True or False."],
  "boolean":["Boolean","A value that's only ever yes or no: true or false."],
  "comment":["Comment","A note for people. The computer skips it. Starts with # in Python or // in JavaScript."],
  "#":["# (comment)","In Python, everything after # on a line is a note for people. The computer skips it."],
  "=":["= (equals sign)","Puts a value into a box. snack = \"banana\" puts banana in the box called snack."],
  "==":["== (double equals)","Asks a question: are these two the same? The answer is true or false."],
  "+":["+ (plus)","Adds numbers (2 + 3 is 5). With text, it glues words together (\"Ty\" + \"pe\" is \"Type\")."],
  "operator":["Operator","A symbol that does something with values, like + to add or > to compare."],
  "if":["if","Lets the code make a choice: do this part only if something is true."],
  "else":["else","Goes with if: what to do when the if part is not true."],
  "elif":["elif","Short for “else if”: check another choice when the first if wasn't true."],
  "loop":["Loop","Code that repeats. Instead of writing the same thing 10 times, a loop does it for you."],
  "for":["for","Starts a loop: do something once for each item, or a set number of times."],
  "while":["while","Starts a loop that keeps repeating while something stays true."],
  "function":["Function","A named set of instructions you can use again and again, like a recipe card with a title."],
  "def":["def","Python's word for making a new function (a reusable set of instructions)."],
  "return":["return","Sends an answer back out of a function to whoever used it."],
  "parameter":["Parameter","A named input a function asks for, like the size in “make a pizza of size large”."],
  "argument":["Argument","The actual value you hand to a function when you use it."],
  "list":["List","A box that holds many things in order, like a shopping list: [\"apple\", \"banana\"]."],
  "array":["Array","A box that holds many things in order, like a shopping list: [\"apple\", \"banana\"]."],
  "index":["Index","An item's position in a list. Computers start counting at 0, so the first item is index 0."],
  "dictionary":["Dictionary","A box of labeled values: each label (key) points to a value, like a real dictionary."],
  "key":["Key","The label used to look up a value, like a word you look up in a dictionary."],
  "object":["Object","A bundle of related values with names, like a pet with a name, age and favorite food."],
  "class":["Class","A blueprint for making objects. One Pet class can make lots of different pets."],
  "method":["Method","A function that belongs to something, like a list's append() that adds an item to it."],
  "input":["Input","Information the user types in while the program runs."],
  "error":["Error","The computer couldn't follow an instruction. It's normal! The message gives a clue about what to fix."],
  "bug":["Bug","A mistake in code that makes it do the wrong thing. Fixing it is called debugging."],
  "syntax":["Syntax","The spelling and grammar rules of a coding language."],
  "keyword":["Keyword","A special word the language already knows, like if, for or print."],
  "html":["HTML","The language that builds the parts of a web page: headings, text, pictures and buttons."],
  "css":["CSS","The language that styles a web page: colors, sizes and layout."],
  "tag":["Tag","An HTML label in angle brackets, like <h1>, that tells the browser what something is."],
  "sql":["SQL","A language for asking questions to a database, like “show me every player with over 100 points”."],
  "query":["Query","A question you ask a database with SQL."],
  "table":["Table","Data in rows and columns, like a spreadsheet."],
  "database":["Database","An organized place that stores lots of information, made of tables."],
  "run":["Run","Tell the computer to follow your code now. Press ▶ Run to see what it does."]
};
function glossKey(t){
  let k=String(t||"").replace(/\s+/g," ").trim().toLowerCase();
  if(GLOSS[k])return k;
  const n=k.replace(/\(\s*[^)]*\)\s*;?$/,"").replace(/[;:,.!]+$/,"").trim();
  if(GLOSS[n])return n;
  if(n.endsWith("s")&&GLOSS[n.slice(0,-1)])return n.slice(0,-1);
  return null;
}
function glossDecorate(){
  const els=$$("#screen .card p b, #screen .card p code.i, #screen .card li b, #screen .card li code.i, #screen .card h2 code.i");
  let any=false;
  for(const el of els){if(el.classList.contains("term")||el.closest("button"))continue;
    const k=glossKey(el.textContent);if(!k)continue;
    el.classList.add("term");el.dataset.term=k;el.setAttribute("role","button");el.tabIndex=0;el.setAttribute("aria-label",`${el.textContent}: what does this mean?`);
    el.onclick=e=>{e.stopPropagation();glossShow(el)};el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();glossShow(el)}};any=true}
  if(any&&!S.glossTip&&!(S.profile&&S.profile.level==="code")){
    const card=$("#screen .card");if(card&&!card.querySelector(".gloss-tip")){
      const tip=document.createElement("p");tip.className="gloss-tip";tip.innerHTML=`💬 New word? Tap any <span class="term-demo">underlined word</span> to see what it means.`;
      const h=card.querySelector("h2");(h||card.firstChild)&&card.insertBefore(tip,h?h.nextSibling:card.firstChild);
      S.glossTip=true;save()}}
}
function glossClose(){const p=$("#glossPop");if(p)p.remove();document.removeEventListener("pointerdown",glossOutside,true)}
function glossOutside(e){const p=$("#glossPop");if(p&&!p.contains(e.target)&&!e.target.classList.contains("term"))glossClose()}
function glossShow(el){
  glossClose();const [title,text]=GLOSS[el.dataset.term]||[];if(!title)return;
  try{sfx("tap")}catch(e){}
  const p=document.createElement("div");p.id="glossPop";p.className="gloss-pop";p.setAttribute("role","dialog");p.setAttribute("aria-label",title);
  p.innerHTML=`<div class="gp-head"><b>${esc(title)}</b><button class="x" aria-label="Close">×</button></div><p>${esc(text)}</p>`;
  document.body.appendChild(p);glossY=scrollY;
  const r=el.getBoundingClientRect(),W=innerWidth,pw=Math.min(320,W-24);p.style.width=pw+"px";
  const left=Math.max(12,Math.min(W-pw-12,r.left+r.width/2-pw/2));p.style.left=left+"px";
  const h=p.offsetHeight,below=r.bottom+10+h<innerHeight-8;
  p.style.top=(below?r.bottom+10:Math.max(8,r.top-10-h))+"px";p.classList.add(below?"below":"above");
  p.style.setProperty("--ax",Math.max(16,Math.min(pw-16,r.left+r.width/2-left))+"px");
  p.querySelector(".x").onclick=glossClose;
  setTimeout(()=>document.addEventListener("pointerdown",glossOutside,true),0);
}
let glossY=0;addEventListener("scroll",()=>{if($("#glossPop")&&Math.abs(scrollY-glossY)>40)glossClose()},{passive:true});

/* ---- Tap coach ---- */
const COACH_TIMES=3;
const COACH={on:false,kind:null,s:null,hand:null,raf:0,ran:false,lastMsg:""};
let TILE_PLAN=null;
{const _wt=wireTiles;wireTiles=function(s,p){TILE_PLAN=p;return _wt.apply(this,arguments)}}
const coachWanted=kind=>{if(S.profile&&S.profile.level==="code")return false;if(cur&&(cur.review||cur.daily))return false;
  const C=S.coach=S.coach&&typeof S.coach==="object"?S.coach:{};return (C[kind]||0)<COACH_TIMES};
const visible=el=>{if(!el||el.hidden||el.disabled)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=="hidden"};
const txt=el=>(el.textContent||"").trim();
function coachStop(){COACH.on=false;cancelAnimationFrame(COACH.raf);if(COACH.hand)COACH.hand.remove();COACH.hand=null;$$(".coach-glow").forEach(e=>e.classList.remove("coach-glow"))}
function coachTarget(){
  const s=COACH.s;
  if(COACH.kind==="demo"){
    if(!COACH.ran&&visible($("#trund")))return [$("#trund"),"Tap ▶ Run to see what this code does"];
    return [$("#go"),"Now tap Continue"];
  }
  if(COACH.kind==="fill"){
    if(visible($("#go")))return [$("#go"),"Great job! Tap Continue"];
    const slots=$$(".slot");
    const wrong=slots.find(b=>b.classList.contains("filled")&&!b.classList.contains("right")&&txt(b)!==s.blanks[+b.dataset.s]);
    if(wrong)return [wrong,"Oops! Tap this piece to take it back"];
    const empty=slots.find(b=>!b.classList.contains("filled"));
    if(empty){const want=s.blanks[+empty.dataset.s];const tok=$$(".token").find(b=>!b.disabled&&txt(b)===want);
      if(tok)return [tok,`Tap <b>${esc(want)}</b> to drop it into the gap`]}
    return [$("#check"),"All filled in! Tap Check"];
  }
  if(COACH.kind==="tiles"){
    const p=TILE_PLAN;if(!p||!$("#screen").classList.contains("tapmode"))return [null,""];
    if(visible($("#go"))&&!$("#go").disabled)return [$("#go"),"You did it! Tap Continue"];
    const placed=$$("#tbuild .tile.on"),want=p.pieces.map(x=>x.trim());
    for(let k=0;k<placed.length;k++)if(txt(placed[k])!==want[k])return [placed[k],"Oops! Tap this one to take it back"];
    if(placed.length<want.length){const t=$$("#ttray .tile").find(b=>txt(b)===want[placed.length]);
      if(t)return [t,placed.length?"Now tap this piece next":`These are puzzle pieces of code. Tap this one first`]}
    const run=[$("#trun"),$("#run-c")].find(visible);
    return [run,"All pieces in place! Tap ▶ Run to try your code"];
  }
  return [null,""];
}
function coachTick(){
  if(!COACH.on)return;
  if(!COACH.hand||!COACH.card||!COACH.card.isConnected){coachStop();return}
  const [el,msg]=coachTarget();
  $$(".coach-glow").forEach(e=>{if(e!==el)e.classList.remove("coach-glow")});
  if(el&&visible(el)){
    el.classList.add("coach-glow");
    const r=el.getBoundingClientRect(),H=COACH.hand;H.hidden=false;
    const x=Math.min(innerWidth-40,Math.max(4,r.right-Math.min(34,r.width/2))),y=Math.min(innerHeight-40,r.bottom-20);
    H.style.transform=`translate(${x}px,${y}px)`;
    if(msg!==COACH.lastMsg){COACH.lastMsg=msg;const t=$("#screen .card .todo span");if(t)t.innerHTML="👉 "+msg;}
  }else if(COACH.hand)COACH.hand.hidden=true;
  COACH.raf=requestAnimationFrame(coachTick);
}
function coachStart(kind,s){
  coachStop();if(!coachWanted(kind))return;
  S.coach[kind]=(S.coach[kind]||0)+1;save();
  Object.assign(COACH,{on:true,kind,s,ran:false,lastMsg:""});
  const H=document.createElement("div");H.className="coach-hand";H.setAttribute("aria-hidden","true");H.hidden=true;
  H.innerHTML=`<span class="ch-f">👆</span>`;
  document.body.appendChild(H);COACH.hand=H;COACH.card=$("#screen .card");
  if(kind==="demo"){const b=$("#trund");if(b)b.addEventListener("click",()=>{COACH.ran=true},{once:true})}
  COACH.raf=requestAnimationFrame(coachTick);
}

{const _rs=renderStep;renderStep=function(){
  coachStop();glossClose();TILE_PLAN=null;
  const r=_rs.apply(this,arguments);
  try{const s=cur&&cur.l&&cur.l.steps[cur.step];
    glossDecorate();
    if(s&&!(cur.c&&cur.c.kids)){
      if(s.type==="talk"&&s.demo&&cur.c.runnable&&$("#trund"))coachStart("demo",s);
      else if(s.type==="fill"&&!s.auto)coachStart("fill",s);
      else if(s.type==="code"&&TILE_PLAN&&$("#screen").classList.contains("tapmode"))coachStart("tiles",s);
    }}catch(e){console.warn(e)}
  return r}}
