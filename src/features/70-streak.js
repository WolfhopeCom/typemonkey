/* ---------- 70-streak: a forgiving streak ----------
   Duolingo's published streak experiments show that a streak which is easy to keep and hard to lose keeps people
   coming back. So:
   - Banana Freezes 🧊: hold up to 2. If you miss a day, one is used automatically and your streak is kept. Everyone
     starts with 1; more cost bananas in the Shop.
   - A short "🔥 N day streak!" celebration after the first lesson of each day (milestone days keep their big one).
   - Missed days the freeze covered show as 🧊 in the week strip.
   - Lost a streak anyway? A kind welcome-back (your best streak is never lost) instead of a scolding.
   Hooks: bumpStreak (daily celebration), home (freeze/welcome notices, 🧊 chip and frozen days), shop (Freeze card),
   goalSheet (explains freezes). State: S.freezes, S.frozen=[days], S.freezeNote, S.lostStreak. */
const FREEZE_MAX=2,FREEZE_PRICE=60;
if(typeof S.freezes!=="number")S.freezes=1;
if(!Array.isArray(S.frozen))S.frozen=[];
function dayDiff(a,b){return Math.round((parseDay(b)-parseDay(a))/864e5)}
function applyFreezes(){
  if(!S.streak||!S.lastDay)return;
  const now=new Date(),today=dayStr(now),y=dayStr(new Date(now.getFullYear(),now.getMonth(),now.getDate()-1));
  if(S.lastDay===today||S.lastDay===y)return;
  const missed=dayDiff(S.lastDay,today)-1;if(missed<1)return;
  if(missed<=(S.freezes||0)){
    const L=parseDay(S.lastDay);
    for(let i=1;i<=missed;i++)S.frozen.push(dayStr(new Date(L.getFullYear(),L.getMonth(),L.getDate()+i)));
    S.frozen=S.frozen.slice(-30);S.freezes-=missed;S.lastDay=y;
    try{if(S.streakMs&&typeof streakRun==="function")S.streakMs.run=streakRun()}catch(e){}   // same streak: milestones already won stay won
    S.freezeNote={used:missed,streak:S.streak,day:today};save();
  }else if(!S.lostStreak||S.lostStreak.day!==S.lastDay){
    S.lostStreak={n:S.streak,day:S.lastDay,shown:false};save();
  }
}
applyFreezes();
document.addEventListener("visibilitychange",()=>{if(!document.hidden){const b=S.freezeNote;applyFreezes();if(S.freezeNote!==b&&typeof rerender==="function"&&rerender===home)home()}});

/* ---- little overlays (reuse the milestone look) ---- */
function streakCard({label,title,line,days,extra="",mood="cheer",big=false}){
  if($(".celebrate")||document.hidden){setTimeout(()=>streakCard(...arguments),700);return}
  const now=new Date(),dow=(now.getDay()+6)%7,P=typeof practicedDays==="function"?practicedDays():new Set(),FZ=new Set(S.frozen||[]);
  const wk=[...Array(7)].map((_,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+i),k=dayStr(d);
    return [["M","T","W","T","F","S","S"][i],FZ.has(k)?"fz":P.has(k)?"on":"",i===dow]});
  const g=document.createElement("div");g.className="celebrate tm-ms tm-day";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label",title);
  g.innerHTML=`<div class="tm-ms-in">
    <div class="tm-ms-stage" aria-hidden="true">${big?`<div class="tm-ms-rays"></div>`:""}<div class="tm-ms-fl">${label==="Banana Freeze"?`<span class="tm-ice">🧊</span>`:flameSvg()}${days!=null?`<b class="tm-ms-n">${days}</b>`:""}</div><div class="tm-ms-mk">${monkey(mood)}</div></div>
    <div class="tm-ms-label">${label}</div><h2>${title}</h2><p>${line}</p>
    <div class="tm-ms-week" aria-hidden="true">${wk.map(([l,k,t])=>`<span class="${k==="on"?"on":""} ${k==="fz"?"fz":""} ${t?"now":""}"><i>${k==="on"?"🔥":k==="fz"?"🧊":""}</i>${l}</span>`).join("")}</div>
    ${extra}<button class="btn tm-ms-ok" id="dsOk">Continue</button></div>`;
  document.body.appendChild(g);
  try{sfx(label==="Banana Freeze"?"hint":"success");haptic("success")}catch(e){}
  const ok=g.querySelector("#dsOk");try{ok.focus({preventScroll:true})}catch(e){}
  ok.onclick=()=>{g.classList.add("out");setTimeout(()=>{g.remove();if(typeof showBadge==="function")showBadge()},calmNow()?0:220)};
}
const DAY_LINES=["One lesson a day keeps the bananas coming!","TypeMonkey is doing a happy dance.","Come back tomorrow to keep it going!","Your coding brain is growing!","Little steps every day add up."];

/* first lesson of the day: celebrate the streak (unless a milestone celebration is already coming) */
{const _bs=bumpStreak;bumpStreak=function(){
  const before=S.lastDay;const r=_bs.apply(this,arguments);
  try{if(S.lastDay!==before&&!msPending&&!(cur&&cur.review)){const n=S.streak;
    setTimeout(()=>streakCard({label:"Daily streak",title:n===1?"You started a streak!":`${n} day streak!`,
      line:n===1?"Do a lesson tomorrow to make it 2. 🔥":DAY_LINES[n%DAY_LINES.length],days:n,mood:"cheer"}),1700)}}catch(e){}
  return r}}

/* ---- Home: notices, the 🧊 chip and frozen days in the week strip ---- */
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{
    const card=$("#todayCard");
    if(card){
      const head=card.querySelector(".thead b");if(head&&!card.querySelector(".fzchip"))head.insertAdjacentHTML("beforeend",`<span class="fzchip" title="Banana Freezes">🧊 ${S.freezes||0}</span>`);
      const now=new Date(),dow=(now.getDay()+6)%7,FZ=new Set(S.frozen||[]);
      card.querySelectorAll(".week .wd").forEach((el,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+i);
        if(FZ.has(dayStr(d))){el.classList.add("fz");const ic=el.querySelector("i");if(ic)ic.textContent="🧊"}});
    }
    const N=S.freezeNote;
    if(N&&N.day===dayStr(new Date())&&!N.shown){N.shown=true;save();
      setTimeout(()=>streakCard({label:"Banana Freeze",title:"Your streak is safe!",
        line:`You missed ${N.used===1?"a day":N.used+" days"}, so ${N.used===1?"a Banana Freeze was":"Banana Freezes were"} used. Your ${N.streak}-day streak is still going!`,
        days:null,mood:"happy",extra:`<div class="tm-ms-ban">🧊 ${S.freezes||0} left · get more in the Shop</div>`}),500)}
    const L=S.lostStreak;
    if(L&&!L.shown&&L.n>=2&&S.lastDay===L.day){L.shown=true;save();
      setTimeout(()=>{toast(`Welcome back! 🐵 Your best streak is still ${Math.max(S.bestStreak||0,L.n)} days. Do a lesson to start a new one!`)},600)}
  }catch(e){console.warn(e)}
  return r}}

/* ---- Shop: Banana Freeze card ---- */
{const _shop=shop;shop=function(){const r=_shop.apply(this,arguments);
  try{const stage=$(".shopstage");if(stage&&!$("#fzcard")){
    const n=S.freezes||0,full=n>=FREEZE_MAX,can=S.bananas>=FREEZE_PRICE;
    stage.insertAdjacentHTML("afterend",`<div class="fzcard" id="fzcard"><span class="fz-ic" aria-hidden="true">🧊</span>
      <div class="fz-t"><b>Banana Freeze</b><span>Miss a day and keep your streak. Used automatically. You have ${n} of ${FREEZE_MAX}.</span></div>
      <button class="btn banana sm" id="fzbuy" ${full||!can?"disabled":""}>${full?"Full":`🍌 ${FREEZE_PRICE}`}</button></div>`);
    $("#fzbuy").onclick=()=>{if((S.freezes||0)>=FREEZE_MAX||S.bananas<FREEZE_PRICE)return;S.bananas-=FREEZE_PRICE;S.freezes=(S.freezes||0)+1;
      try{sfx("coins");haptic("success")}catch(e){}save();toast(`🧊 Banana Freeze ready! You have ${S.freezes}.`);shop.apply(this,arguments)};
  }}catch(e){console.warn(e)}
  return r}}

/* ---- Daily goal sheet: explain freezes ---- */
if(typeof goalSheet==="function"){const _gs=goalSheet;goalSheet=function(){const r=_gs.apply(this,arguments);
  try{const c=$(".onb-sheet .card");if(c&&!c.querySelector(".fznote"))c.insertAdjacentHTML("beforeend",`<p class="fznote">🧊 <b>Banana Freezes: ${S.freezes||0}</b>. Miss a day and one is used automatically, so your streak stays. Get more in the Shop.</p>`)}catch(e){}
  return r}}
