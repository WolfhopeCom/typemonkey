/* ---------- 10-onboarding: first-run welcome, daily XP goal ring and streak week strip ----------
   Hooks (all wraps, no edits to app.html):
     save()          -> credits any XP gained since the last save to today's S.xpDays entry (and spots the daily goal being reached)
     renderStats()   -> same bookkeeping, so a Cloud sync that swaps S never counts as "XP earned today"
     home()          -> brand-new users get the onboarding instead; everyone else gets a "Today" card (ring + week)
     finish()        -> adds a "Daily goal reached!" line to the lesson-complete card on the lesson that crosses the goal
     settingsPage()  -> adds a compact "Daily goal" 10/20/30/50 row
   State: S.onboarded, S.profile={why,level,firstCourse}, S.settings.goal, S.xpDays={"Y-M-D":xp}, S.goalHit, S.goalCheered */

const GOALS=[[10,"Casual","about 5 min a day","🌱"],[20,"Regular","about 10 min a day","🍌"],[30,"Serious","about 15 min a day","💪"],[50,"Intense","about 20 min a day","🚀"]];
const goalXp=()=>{const g=+(S.settings&&S.settings.goal);return GOALS.some(x=>x[0]===g)?g:20};
const todayKey=()=>dayStr(new Date());
const xpToday=()=>((S.xpDays||{})[todayKey()]||0);
const ONB_CALM=()=>calmMotion()||!!(S.settings&&S.settings.calm);

/* ---- XP per day ---- */
const XPD={s:S,xp:S.xp,crossed:false};
function keyDate(k){const [y,m,d]=String(k).split("-").map(Number);return new Date(y,(m||1)-1,d||1)}
function trackXp(){
  if(S!==XPD.s){XPD.s=S;XPD.xp=S.xp;return}           // a whole new state (reset, restore, cloud merge): not "earned today"
  const gain=(+S.xp||0)-(+XPD.xp||0);XPD.xp=S.xp;if(gain<=0)return;
  const t=todayKey(),D=S.xpDays=S.xpDays&&typeof S.xpDays==="object"?S.xpDays:{};
  const before=D[t]||0;D[t]=before+gain;
  const old=Date.now()-60*864e5;for(const k of Object.keys(D))if(keyDate(k).getTime()<old)delete D[k];
  const g=goalXp();if(before<g&&D[t]>=g&&S.goalHit!==t){S.goalHit=t;XPD.crossed=true}
}
{const _save=save;save=function(){try{trackXp()}catch(e){}return _save.apply(this,arguments)}}
{const _rs=renderStats;renderStats=function(){try{trackXp()}catch(e){}return _rs.apply(this,arguments)}}

/* ---- Streak week (Mon..Sun) ---- */
function practicedDays(){
  const set=new Set(Object.entries(S.xpDays||{}).filter(([,v])=>v>0).map(([k])=>k));
  if(S.lastDay&&S.streak>0){const L=keyDate(S.lastDay);for(let i=0;i<Math.min(S.streak,14);i++)set.add(dayStr(new Date(L.getFullYear(),L.getMonth(),L.getDate()-i)))}
  return set;
}
function liveStreak(){const t=todayKey(),y=dayStr(new Date(Date.now()-864e5));return S.lastDay===t||S.lastDay===y?S.streak:0}
function weekInfo(){
  const now=new Date(),dow=(now.getDay()+6)%7,P=practicedDays(),N=["M","T","W","T","F","S","S"],F=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return N.map((n,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+i),k=dayStr(d);
    return {n,full:F[i],key:k,on:P.has(k),today:i===dow,future:i>dow}});
}

/* ---- Today card on Home ---- */
const RING_C=2*Math.PI*27;
let ringShown={day:null,frac:0};
function todayCard(){
  const g=goalXp(),x=xpToday(),frac=Math.min(1,x/g),done=x>=g,sk=liveStreak(),W=weekInfo();
  const start=ringShown.day===todayKey()?ringShown.frac:0;
  const head=sk?`🔥 ${sk}-day streak`:W.some(d=>d.on&&!d.future)?"Start a new streak!":"Start your streak!";
  const sub=done?"Goal reached! 🎉":x?`${g-x} XP to go today`:"Do a lesson to fill the ring";
  return `<button class="today ${done?"done":""}" id="todayCard" aria-label="Today: ${x} of ${g} XP. ${sk?sk+" day streak. ":""}Tap to change your daily goal.">
    <span class="tring" aria-hidden="true"><svg viewBox="0 0 64 64"><circle class="trk" cx="32" cy="32" r="27"/><circle class="bar" cx="32" cy="32" r="27" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${(RING_C*(1-start)).toFixed(2)}" data-to="${(RING_C*(1-frac)).toFixed(2)}"/></svg>
      <span class="rin">${done?`<b class="ok">✓</b>`:`<b>${x}</b><small>of ${g}</small>`}</span></span>
    <span class="tbody"><span class="thead"><b>${head}</b><span>${sub}</span></span>
      <span class="week">${W.map(d=>`<span class="wd ${d.on?"on":""} ${d.today?"now":""} ${d.future?"fut":""}" title="${d.full}${d.on?": practiced":""}"><i>${d.on?"🔥":""}</i><small>${d.n}</small></span>`).join("")}</span></span>
  </button>`;
}
function wireToday(){
  const card=$("#todayCard");if(!card)return;
  const bar=card.querySelector(".bar"),to=bar.dataset.to;
  const fin=()=>{bar.setAttribute("stroke-dashoffset",to)};
  if(ONB_CALM())fin();else requestAnimationFrame(()=>requestAnimationFrame(fin));
  ringShown={day:todayKey(),frac:Math.min(1,xpToday()/goalXp())};
  card.onclick=goalSheet;
  const t=todayKey();
  if(S.goalHit===t&&S.goalCheered!==t&&xpToday()>=goalXp()){S.goalCheered=t;save();
    setTimeout(()=>{if(!card.isConnected)return;card.classList.add("cheer");sfx("tada");toast("🎯 Daily goal reached! Great job!");if(!ONB_CALM())confetti(90)},ONB_CALM()?100:900)}
}
function goalSheet(){
  const g=goalXp();const box=document.createElement("div");box.className="gate onb-sheet";box.setAttribute("role","dialog");box.setAttribute("aria-label","Daily goal");
  box.innerHTML=`<div class="card"><div class="sheethead"><h2>Daily goal</h2><button class="x" id="gsx" aria-label="Close">×</button></div>
    <p class="muted">How much XP do you want each day? One lesson is about 30–60 XP.</p>
    <div class="onb-opts">${GOALS.map(([v,n,m,e])=>`<button class="onb-opt ${v===g?"sel":""}" data-g="${v}" aria-pressed="${v===g}"><span class="oe">${e}</span><span class="ot"><b>${n}</b><span>${v} XP · ${m}</span></span></button>`).join("")}</div></div>`;
  document.body.appendChild(box);
  const close=()=>box.remove();
  box.onclick=e=>{if(e.target===box)close()};box.querySelector("#gsx").onclick=close;
  box.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{S.settings.goal=+b.dataset.g;save();close();toast(`Daily goal: ${b.dataset.g} XP a day 🎯`);if(rerender===home)home()});
}

/* ---- Onboarding ---- */
const needsOnboarding=()=>!S.onboarded&&!(S.done||[]).length&&!S.xp&&!Object.keys(S.progress||{}).length;
const ONB={step:0,why:null,level:null,course:null,goal:null};
const WHY=[["fun","🎉","Just for fun","Make cool stuff"],["school","🎒","For school","Classes and homework"],["job","💼","For a job or career","Get job-ready skills"],["kid","🧒","For my kid / I'm a kid","Ages 7 to 12"]];
const LEVEL=[["new","🌱","I'm brand new","Never written code"],["little","🌿","I know a little","I've tried it before"],["code","🌳","I already code","I know another language"]];
function onbCourses(){return COURSES.filter(c=>c.units&&!c.extra&&!c.soon)}
function onbRec(){
  const has=id=>onbCourses().some(c=>c.id===id);
  const r=ONB.why==="kid"?"jr":(ONB.why==="school"||ONB.level==="little")?"py":"js";
  return has(r)?r:onbCourses()[0].id;
}
const REC_WHY={jr:"TypeMonkey Jr. has puzzles made just for kids. No typing needed!",py:"Python reads almost like English. It's a great first language!",js:"JavaScript runs every website. You'll see your code work right away!"};
function onbShell(inner,{mood="happy",say="",anim="",cta="Continue",ctaOff=false,back=true,id=""}){
  const N=5,pct=Math.round(ONB.step/N*100);
  $("#foot").innerHTML="";
  $("#screen").innerHTML=`<div class="onb" data-step="${ONB.step}" id="onb">
    <div class="onb-top">${back&&ONB.step?`<button class="x onb-back" id="onbBack" aria-label="Back">←</button>`:`<span class="onb-gap"></span>`}
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
      <button class="onb-skip" id="onbSkip">Skip</button></div>
    ${say?`<div class="onb-talk"><span class="onb-m ${anim}">${monkey(mood)}</span><div class="bubble">${say}</div></div>`:""}
    <div class="onb-body">${inner}</div>
    <div class="onb-foot"><button class="btn onb-cta" id="onbGo" ${ctaOff?"disabled":""}>${cta}</button></div>
  </div>`;
  $("#onbSkip").onclick=onbSkip;
  if($("#onbBack"))$("#onbBack").onclick=()=>{ONB.step--;onbRender()};
  window.scrollTo(0,0);
}
function onbPick(sel,key,after){
  $$(sel+" [data-v]").forEach(b=>b.onclick=()=>{ONB[key]=b.dataset.v;$$(sel+" [data-v]").forEach(x=>{const on=x===b;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on)});
    $("#onbGo").disabled=false;if(after)after(b.dataset.v)});
}
const optCards=(list,key)=>list.map(([v,e,t,s],i)=>`<button class="onb-opt ${ONB[key]===v?"sel":""}" data-v="${v}" aria-pressed="${ONB[key]===v}" style="--i:${i}"><span class="oe">${e}</span><span class="ot"><b>${t}</b><span>${esc(s)}</span></span></button>`).join("");
function onbRender(){
  const s=ONB.step;
  if(s===0){
    onbShell(`<div class="onb-hello"><div class="onb-big onb-wave">${withPet("cheer")}</div>
      <h1>Hi! I'm TypeMonkey!</h1><p>I'll teach you to code with tiny lessons, games and bananas. It's easy, and it's fun!</p></div>`,{cta:"Let's go!",back:false});
    $("#onbGo").onclick=()=>{ONB.step=1;onbRender()};
  }else if(s===1){
    onbShell(`<h1 class="onb-q">What brings you here?</h1><div class="onb-opts" id="oWhy">${optCards(WHY,"why")}</div>`,{say:"First, a quick question!",anim:"onb-hop",ctaOff:!ONB.why});
    onbPick("#oWhy","why",v=>{const t=$(".onb-talk .bubble");if(t)t.textContent={fun:"Fun is the best reason! 🎉",school:"Great! I can help with school.",job:"Awesome! Let's build real skills.",kid:"Yay! I love coding with kids! 🍌"}[v]});
    $("#onbGo").onclick=()=>{ONB.course=null;ONB.step=2;onbRender()};
  }else if(s===2){
    onbShell(`<h1 class="onb-q">How much coding do you know?</h1><div class="onb-opts" id="oLvl">${optCards(LEVEL,"level")}</div>`,{say:"Any answer is great. We start easy!",mood:"think",anim:"onb-tilt",ctaOff:!ONB.level});
    onbPick("#oLvl","level");
    $("#onbGo").onclick=()=>{ONB.course=null;ONB.step=3;onbRender()};
  }else if(s===3){
    const rec=onbRec();if(!ONB.course)ONB.course=rec;
    const cs=onbCourses().sort((a,b)=>(b.id===rec)-(a.id===rec));
    onbShell(`<h1 class="onb-q">Pick your first course</h1><div class="onb-langs" id="oLang">${cs.map((c,i)=>`<button class="onb-lang ${c.id===rec?"rec":""} ${c.kids?"kids":""} ${ONB.course===c.id?"sel":""}" data-v="${c.id}" aria-pressed="${ONB.course===c.id}" style="--i:${i}">${c.id===rec?`<span class="pill go">⭐ Best for you</span>`:""}<b>${esc(c.name)}</b><span class="tag">${esc(c.tag)}</span></button>`).join("")}</div>
      <p class="onb-note">You can try the others any time.</p>`,{say:REC_WHY[rec]||"This one is a great start!",anim:"onb-hop"});
    onbPick("#oLang","course");
    $("#onbGo").onclick=()=>{ONB.step=4;onbRender()};
  }else if(s===4){
    if(!ONB.goal)ONB.goal=String(goalXp());
    onbShell(`<h1 class="onb-q">Pick a daily goal</h1><div class="onb-opts" id="oGoal">${GOALS.map(([v,n,m,e],i)=>`<button class="onb-opt ${ONB.goal==v?"sel":""}" data-v="${v}" aria-pressed="${ONB.goal==v}" style="--i:${i}"><span class="oe">${e}</span><span class="ot"><b>${n}</b><span>${m}</span></span><span class="oxp">${v} XP</span></button>`).join("")}</div>
      <p class="onb-note">A little every day is the secret! You can change this in Settings.</p>`,{say:"How much do you want to practice each day?",anim:"onb-tilt"});
    onbPick("#oGoal","goal");
    $("#onbGo").onclick=()=>{ONB.step=5;onbSave(true);onbRender()};
  }else{
    const c=courseById(ONB.course)||onbCourses()[0];const g=goalXp();
    onbShell(`<div class="onb-hello"><div class="fin-stage onb-fin" aria-hidden="true"><div class="rays"></div>${monkey("cheer")}</div>
      <h1>You're all set!</h1><p>Your first lesson takes about 3 minutes. Let's write some code!</p>
      <div class="onb-sum"><span>📚 ${esc(c.name)}</span><span>🎯 ${g} XP a day</span></div></div>`,{cta:"Start my first lesson ▶",back:true});
    $("#onbGo").classList.add("onb-cta-big");
    $("#onbGo").onclick=()=>onbStart(c);
    if(!ONB_CALM())setTimeout(()=>confetti(70),250);sfx("complete");
  }
}
function onbSave(done){
  S.profile={...(S.profile||{}),why:ONB.why,level:ONB.level,firstCourse:ONB.course};
  if(ONB.goal)S.settings.goal=+ONB.goal;
  const c=courseById(ONB.course);if(c&&c.units&&!c.extra)S.lastCourse=c.id;
  if(done)S.onboarded=true;save();
}
function onbStart(c){
  onbSave(true);
  const nu=nextUp(c);
  if(nu&&nu.l.steps&&status(c,nu)!=="pro")startLesson(nu.l.id);else coursePage(c.id);
}
function onbSkip(){S.onboarded=true;if(ONB.why||ONB.level)onbSave(true);else save();home()}
function onboarding(){ONB.step=0;rerender=onboarding;try{SFX.stopMusic()}catch(e){}onbRender()}

/* ---- Home wrap: onboarding first, then the Today card ---- */
{const _home=home;home=function(){
  if(needsOnboarding())return onboarding();
  if(!S.onboarded&&((S.done||[]).length||S.xp))S.onboarded=true;   // long-time users: never ask
  const r=_home.apply(this,arguments);
  try{const st=$("#screen>.stack");if(st&&!$("#todayCard")){
    const html=todayCard(),anchor=$("#daily")||(st.querySelector(".continue")||{}).nextElementSibling||st.querySelector(".buddy");
    if(anchor)anchor.insertAdjacentHTML("beforebegin",html);else st.insertAdjacentHTML("afterbegin",html);wireToday()}}catch(e){console.warn(e)}
  return r}}

/* ---- Lesson finish: say so when this lesson reached the daily goal ---- */
{const _finish=finish;finish=function(){XPD.crossed=false;const r=_finish.apply(this,arguments);
  try{if(XPD.crossed){XPD.crossed=false;const card=$("#screen .card");const rw=card&&card.querySelector(".reward");
    if(rw)rw.insertAdjacentHTML("afterend",`<div class="goalhit" role="status"><span>🎯</span><b>Daily goal reached!</b><small>${xpToday()} / ${goalXp()} XP today</small></div>`)}}catch(e){}
  return r}}

/* ---- Settings: daily goal row ---- */
{const _sp=settingsPage;settingsPage=function(){const r=_sp.apply(this,arguments);
  try{const list=$("#screen .setlist");if(list&&!$("#goalSeg")){const g=goalXp();
    list.insertAdjacentHTML("afterbegin",`<div class="setrow"><b>Daily goal <small>XP a day</small></b><div class="seg" role="radiogroup" id="goalSeg" aria-label="Daily goal in XP">${GOALS.map(([v,n])=>`<button role="radio" aria-checked="${v===g}" data-v="${v}" aria-label="${n}: ${v} XP a day">${v}</button>`).join("")}</div></div>`);
    $$("#goalSeg button").forEach(b=>b.onclick=()=>{S.settings.goal=+b.dataset.v;save();settingsPage()})}}catch(e){console.warn(e)}
  return r}}
