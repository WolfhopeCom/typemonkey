/* ===== 20-delight: in-lesson combos, haptics, streak milestones, answer micro-animations =====
   Hooks (no edits to src/app.html):
   - every answer: a MutationObserver on #screen sees each new `.feedback` inside `#fb` (good = right, bad/oops = miss).
     The FIRST feedback of a step decides it, so "solved first try / without a miss" is what counts.
   - shell()        wrapped: adds the small 🔥 combo chip to the lesson bar
   - renderStep()   wrapped: starts the combo record (cur.earned.cmb, so it survives leaving and resuming a lesson)
   - finish()       wrapped: perfect-lesson bonus + combo summary on the finish card, haptics
   - bumpStreak()   wrapped: streak milestones (3, 7, 14, 30, 50, 100 days) -> full-screen celebration once per streak run
   - showBadge()    wrapped: heavy haptic when a badge pops
   - settingsPage() wrapped: compact "Vibration" On/Off row under Sounds
   Public: haptic(kind) / window.haptic(kind) with kind "tap" | "success" | "warning" | "heavy" (never throws). */

/* ---------- Haptics: Capacitor Haptics in the app, navigator.vibrate on the web (Android), else nothing ---------- */
const HAPTIC_PAT={tap:8,success:[14,60,22],warning:[24],heavy:[30,40,60]};
let hapticLast=0;
function hapticPlugin(){try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.Haptics||null}catch(e){return null}}
function hapticsAvailable(){try{return !!hapticPlugin()||typeof navigator.vibrate==="function"}catch(e){return false}}
function haptic(kind="tap"){
  try{
    if(S&&S.settings&&S.settings.haptics===false)return false;
    if(kind==="tap"){const now=Date.now();if(now-hapticLast<40)return false;hapticLast=now}
    const H=hapticPlugin();
    if(H){let p;
      if(kind==="success")p=H.notification({type:"SUCCESS"});
      else if(kind==="warning")p=H.notification({type:"WARNING"});
      else p=H.impact({style:kind==="heavy"?"HEAVY":kind==="medium"?"MEDIUM":"LIGHT"});
      if(p&&typeof p.catch==="function")p.catch(()=>{});return true}
    if(typeof navigator.vibrate==="function")return !!navigator.vibrate(HAPTIC_PAT[kind]||HAPTIC_PAT.tap);
  }catch(e){}
  return false;
}
window.haptic=haptic;
/* light tap when a tile, token, line or Jr. block is placed */
document.addEventListener("click",e=>{try{const t=e.target.closest&&e.target.closest("#ttray .tile,#tbuild .tile,.token,.slot.filled,.lines .ln,.palette .blk,.bin,.repadd,.dchip,.chip");if(t&&!t.disabled&&$(".lessonbar"))haptic("tap")}catch(_){}},true);

/* ---------- Combo: "🔥 3 in a row!" inside a lesson ---------- */
const COMBO_TYPES=new Set(["quiz","fill","order","code","bug","maze","dance","sort","box","predict"]);
const COMBO_AT=n=>n===3||n===5||(n>=10&&n%5===0);
const calmNow=()=>{try{return document.documentElement.classList.contains("calm")||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
function comboRec(){if(!cur||!cur.earned)return null;if(!cur.earned.cmb)cur.earned.cmb={n:0,b:0,m:0,d:[],u:cur.step>0?1:0};return cur.earned.cmb}
window.tmCombo=()=>cur&&cur.earned&&cur.earned.cmb||null;   // for tests and other modules

function comboLine(n){const kid=cur&&cur.c&&cur.c.kids;
  if(n>=10)return kid?"Super coder!":"Unstoppable!";if(n>=5)return kid?"Wow wow wow!":"Amazing!";return kid?"Keep going!":"Nice streak!"}
function comboSound(n){const seq=n>=10?[2,3,4,5,6,7,8]:n>=5?[3,4,5,6,7]:[3,4,5];
  const t0=cur&&cur.c&&cur.c.kids?620:380;   // after the right-answer chime (Jr. plays a longer tada)
  seq.forEach((k,i)=>setTimeout(()=>sfx("ding",k),t0+i*85));}
function comboBanner(n){
  let el=$("#tmCombo");
  if(!el){el=document.createElement("div");el.id="tmCombo";el.className="tm-combo";el.setAttribute("role","status");el.setAttribute("aria-live","polite");document.body.appendChild(el)}
  const lvl=n>=10?3:n>=5?2:1;
  el.className="tm-combo lvl"+lvl;el.innerHTML=`<span class="tc-fire" aria-hidden="true">🔥</span><span class="tc-txt"><b>${n} in a row!</b><small>${comboLine(n)}</small></span>${lvl>1?'<i class="tc-sp s1" aria-hidden="true">✨</i><i class="tc-sp s2" aria-hidden="true">✨</i>':""}`;
  void el.offsetWidth;el.classList.add("show");clearTimeout(el._h);el._h=setTimeout(()=>el.classList.remove("show"),calmNow()?2200:1900);
}
function comboChip(){
  const bar=$(".lessonbar");if(!bar)return;const c=comboRec();let chip=$("#tmChip");
  if(!chip){chip=document.createElement("span");chip.id="tmChip";chip.className="tm-chip";chip.setAttribute("aria-label","Answers in a row");bar.appendChild(chip)}
  const n=c?c.n:0;chip.hidden=n<2;chip.innerHTML=`🔥<b>${n}</b>`;
  const pr=bar.querySelector(".progress");if(pr)pr.classList.toggle("hot",n>=3);
}
function bumpChip(){const chip=$("#tmChip");if(!chip||calmNow())return;chip.classList.remove("bump");void chip.offsetWidth;chip.classList.add("bump")}

/* small motion on the answer itself: a pop on what you got right, a gentle shake on a miss (fills gaps in the motion pack) */
function answerFx(ok){
  if(calmNow())return;
  const sel=ok?".opt.right,.slot.right,#ans .ln.right":".opt.wrong,.slot.wrong,#ans .ln.wrong";
  $$(sel).forEach((el,i)=>{el.classList.remove("tm-pop","tm-shake");void el.offsetWidth;el.style.setProperty("--k",i);el.classList.add(ok?"tm-pop":"tm-shake")});
  const con=$("#out-c");if(con&&cur&&cur.l.steps[cur.step]&&/^(code|bug)$/.test(cur.l.steps[cur.step].type)){con.classList.remove("tm-shine","tm-shake");void con.offsetWidth;con.classList.add(ok?"tm-shine":"tm-shake")}
}

function judge(ok){
  if(!cur||!cur.l||!$(".lessonbar"))return;
  const s=cur.l.steps[cur.step];if(!s||!COMBO_TYPES.has(s.type)||s.sandbox)return;
  const c=comboRec();if(!c)return;
  answerFx(ok);haptic(ok?"success":"warning");
  if(c.d.includes(cur.step))return;              // this step already counted (2nd try, "try with fewer", …)
  if(s.type==="bug"&&!ok)return;                 // Bug Lab asks you to run the broken code first: not a miss
  c.d.push(cur.step);
  if(ok){
    const peek=$("#peek");if(peek&&peek.textContent.trim())return;   // solved with help: fine, but no combo point
    c.n++;c.b=Math.max(c.b,c.n);comboChip();bumpChip();
    if(COMBO_AT(c.n)){comboBanner(c.n);comboSound(c.n);setTimeout(()=>haptic(c.n>=10?"heavy":"success"),cur.c.kids?620:380)}
  }else{c.m++;c.n=0;comboChip();const b=$("#tmCombo");if(b)b.classList.remove("show")}   // quietly back to zero, no message
}
new MutationObserver(muts=>{
  for(const m of muts)for(const n of m.addedNodes){
    if(n.nodeType!==1||!n.classList.contains("feedback")||!n.parentElement||n.parentElement.id!=="fb")continue;
    try{judge(n.classList.contains("good"))}catch(e){}
  }
}).observe($("#screen"),{childList:true,subtree:true});

{const _shell=shell;shell=function(inner){const r=_shell.apply(this,arguments);try{const s=cur&&cur.l&&cur.l.steps[cur.step];if(s&&s.type!=="done")comboChip()}catch(e){}return r}}
{const _rs=renderStep;renderStep=function(){try{comboRec()}catch(e){}return _rs.apply(this,arguments)}}

/* ---------- Lesson complete: perfect lesson + best combo on the existing finish card ---------- */
{const _fin=finish;finish=function(){
  let info=null;
  try{const c=cur&&cur.earned&&cur.earned.cmb;
    if(c){const judged=c.d.length,perfect=!c.u&&judged>=2&&c.m===0;info={perfect,best:c.b,bonus:0,kind:cur.review?"review":cur.daily?"challenge":cur.l.project?"project":"lesson"};
      if(perfect&&!cur.review&&!cur.daily){cur.earned.ban+=5;info.bonus=5}}}catch(e){}
  const r=_fin.apply(this,arguments);
  try{
    if(info&&(info.perfect||info.best>=2)){
      const box=document.createElement("div");box.className="tm-fin";
      box.innerHTML=(info.perfect?`<div class="tm-perfect"><span class="tp-star" aria-hidden="true">⭐</span><span class="tp-t"><b>Perfect ${info.kind}!</b><small>No misses${info.bonus?` · +${info.bonus} 🍌 bonus`:""}</small></span></div>`:"")+
        (info.best>=2?`<div class="tm-best"><span aria-hidden="true">🔥</span> Best combo: <b>${info.best} in a row</b></div>`:"");
      const rw=$("#screen .reward"),h=$("#screen .card h2");
      if(rw)rw.after(box);else if(h)h.after(box);
      if(info.perfect)setTimeout(()=>sfx("badge"),1100);
    }
    const big=info&&info.perfect||!!$("#screen .cert");
    haptic("success");if(big)setTimeout(()=>haptic("heavy"),700);
  }catch(e){}
  return r;
}}

/* ---------- Streak milestones: 3, 7, 14, 30, 50, 100 days in a row ---------- */
const STREAK_MS=[[3,10,"3 days in a row!","You're warming up! 🔥"],[7,25,"7 days in a row!","You're on fire!"],[14,40,"14 days in a row!","Two whole weeks. Unstoppable!"],
  [30,75,"30 days in a row!","A whole month of code. Legendary!"],[50,100,"50 days in a row!","Fifty days! TypeMonkey is amazed."],[100,200,"100 days in a row!","One hundred days! You're a coding legend. 👑"]];
const parseDay=s=>{const [y,m,d]=String(s).split("-").map(Number);return new Date(y,m-1,d)};
function streakRun(){if(!S.lastDay||!S.streak)return null;const d=parseDay(S.lastDay);d.setDate(d.getDate()-(S.streak-1));return dayStr(d)}   // first day of this streak
function msRec(){const run=streakRun();let m=S.streakMs;if(!m||typeof m!=="object"||m.run!==run||!Array.isArray(m.got)){m=S.streakMs={run,got:[]}}return m}
/* first launch with this feature: streaks already reached before don't pop up again */
if(!S.streakMs)S.streakMs={run:streakRun(),got:STREAK_MS.filter(x=>x[0]<=S.streak).map(x=>x[0])};
let msPending=null;
function checkStreakMilestone(){
  const m=msRec();const hit=STREAK_MS.filter(x=>x[0]<=S.streak&&!m.got.includes(x[0]));if(!hit.length)return null;
  hit.forEach(x=>m.got.push(x[0]));const top=hit[hit.length-1];S.bananas+=top[1];   // the caller saves right after bumpStreak()
  msPending=top;setTimeout(showStreakMilestone,1600);return top;
}
function flameSvg(){return `<svg class="tm-flame" viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="tmfo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB13B"/><stop offset="1" stop-color="#F2541B"/></linearGradient><linearGradient id="tmfi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC845"/></linearGradient></defs>
  <path fill="url(#tmfo)" d="M50 3C60 27 86 42 86 76c0 25-17 41-36 41S14 101 14 76c0-19 10-30 17-42 2 14 8 21 15 23-3-20 0-36 4-54z"/>
  <path fill="url(#tmfi)" d="M51 50c6 13 19 21 19 39 0 15-9 23-20 23s-20-8-20-23c0-10 6-17 10-23 1 8 5 12 9 13-2-10-1-20 2-29z"/></svg>`}
function showStreakMilestone(){
  if(!msPending)return;
  if($(".celebrate")||document.hidden){setTimeout(showStreakMilestone,700);return}
  const [days,ban,title,line]=msPending;msPending=null;
  const today=new Date(),wk=[];for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);wk.push([d.toLocaleDateString(undefined,{weekday:"narrow"}),i<Math.min(days,7)])}
  const g=document.createElement("div");g.className="celebrate tm-ms";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label",`${days} day streak`);
  g.innerHTML=`<div class="tm-ms-in">
    <div class="tm-ms-stage" aria-hidden="true"><div class="tm-ms-rays"></div><div class="tm-ms-fl">${flameSvg()}<b class="tm-ms-n">${days}</b></div><div class="tm-ms-mk">${monkey("cheer")}</div></div>
    <div class="tm-ms-label">Streak milestone</div><h2>${title}</h2><p>${line}</p>
    <div class="tm-ms-week" aria-hidden="true">${wk.map(([l,on])=>`<span class="${on?"on":""}"><i>${on?"🔥":""}</i>${l}</span>`).join("")}</div>
    <div class="tm-ms-ban">+${ban} 🍌 bonus bananas</div>
    <button class="btn tm-ms-ok" id="msOk">Continue</button></div>`;
  document.body.appendChild(g);
  sfx("badge");setTimeout(()=>sfx("success"),520);haptic("heavy");setTimeout(()=>haptic("success"),600);
  setTimeout(()=>confetti(110),350);
  const ok=g.querySelector("#msOk");try{ok.focus({preventScroll:true})}catch(e){}
  ok.onclick=()=>{g.classList.add("out");setTimeout(()=>{g.remove();if(typeof showBadge==="function")showBadge()},calmNow()?0:220)};
}
window.tmStreakMilestone=checkStreakMilestone;
{const _bs=bumpStreak;bumpStreak=function(){const r=_bs.apply(this,arguments);try{checkStreakMilestone()}catch(e){}return r}}

/* ---------- Badges: a strong buzz when one pops ---------- */
{const _sb=showBadge;showBadge=function(){const had=!!$(".celebrate"),n=badgeQueue.length;const r=_sb.apply(this,arguments);try{if(!had&&n&&$(".celebrate"))haptic("heavy")}catch(e){}return r}}

/* ---------- Settings: Vibration On/Off (only where the device can buzz) ---------- */
{const _sp=settingsPage;settingsPage=function(){const r=_sp.apply(this,arguments);
  try{const snd=$("#sound");if(!snd||!hapticsAvailable()||$("#haptics"))return r;
    const on=S.settings.haptics!==false,row=document.createElement("div");row.className="setrow";
    row.innerHTML=`<b>Vibration</b><div class="seg" role="radiogroup" id="haptics" aria-label="Vibration">${[["on","On"],["off","Off"]].map(([v,l])=>`<button role="radio" aria-checked="${(on?"on":"off")===v}" data-v="${v}">${l}</button>`).join("")}</div>`;
    snd.closest(".setrow").after(row);
    row.querySelectorAll("button").forEach(b=>b.onclick=()=>{S.settings.haptics=b.dataset.v==="on";save();if(S.settings.haptics)haptic("success");settingsPage()});
  }catch(e){}
  return r}}
