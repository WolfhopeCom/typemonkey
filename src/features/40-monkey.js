/* ===== 40-monkey: TypeMonkey grows with you (levels from XP), a livelier mascot, and a Profile page =====
   Everything lives in this IIFE so names never clash with other feature files. Public bits are on window:
   TMLevel (level math + titles), profilePage. Core functions are wrapped chain-safely (call the previous one first). */
(function(){
  /* ---------- Levels: gentle curve, L2 at 50 XP, L3 at 120, ... L30 at 9,570 ---------- */
  const MAX=30;
  const TITLES=["Baby Banana","Banana Sprout","Curious Climber","Loop Swinger","Bug Squasher","Variable Wrangler","Function Friend","Treetop Tinkerer","String Juggler","Code Captain",
    "Array Acrobat","Logic Explorer","Debug Detective","Loop Master","Jungle Engineer","Class Climber","Algorithm Ace","Recursion Ranger","Canopy Coder","Code Wizard",
    "Byte Boss","Data Dynamo","Syntax Sensei","Pixel Pioneer","Jungle Architect","Silverback Coder","Compiler Whisperer","Galaxy Brain","Grand Banana","Banana Legend"];
  /* free shop items at milestone levels (if already owned you get its price in bananas instead) */
  const GIFTS={3:["hat","party"],5:["neck","bowtie"],10:["hat","grad"],15:["hat","headphones"],20:["hat","wizard"],25:["neck","cape"],30:["hat","crown"]};
  const need=L=>{const k=Math.max(0,L-1);return 40*k+10*k*k};
  const bananasFor=L=>10+2*L;
  function info(xp){
    xp=Math.max(0,Math.floor(+xp||0));let L=1;while(L<MAX&&xp>=need(L+1))L++;
    const base=need(L),next=L<MAX?need(L+1):base,span=Math.max(1,next-base);
    return {lvl:L,title:TITLES[L-1],xp,base,next,into:xp-base,span,toGo:Math.max(0,next-xp),pct:L>=MAX?100:Math.min(100,(xp-base)/span*100),max:L>=MAX};
  }
  const slotTable=slot=>({fur:FURS,hat:HATS,eyes:EYES,neck:NECKS,pet:typeof PETS!=="undefined"?PETS:{}})[slot]||{};
  const giftItem=L=>{const g=GIFTS[L];if(!g)return null;const it=slotTable(g[0])[g[1]];return it?{slot:g[0],id:g[1],name:it.name,price:it.price}:null};
  const stage=L=>L>=30?"Legend":L>=20?"Grown-up":L>=10?"Big kid":L>=5?"Little monkey":"Baby";
  window.TMLevel={MAX,TITLES,GIFTS,need,info,bananasFor,giftItem,stage};
  const calm=()=>{try{return !!(S.settings&&S.settings.calm)||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
  const fmt=n=>Number(n).toLocaleString("en-US");

  /* ---------- Mascot polish: blinking eyes, a curious (not sad) "think" face, a hop when tapped ---------- */
  const _monkey=monkey;
  monkey=function(mood,look){
    let s=_monkey.apply(this,arguments);
    try{
      s=s.replace(/(<circle cx="47" cy="[-\d.]+" r="4\.6"[\s\S]*?<circle cx="74\.6"[^>]*\/>)/,(m)=>{
        if(mood==="think")m=m.replace(/cx="47"/,'cx="48.6"').replace(/cx="73"/,'cx="74.6"').replace(/cx="48\.6" cy="([-\d.]+)" r="1\.5"/,'cx="50.2" cy="$1" r="1.5"').replace(/cx="74\.6" cy="([-\d.]+)" r="1\.5"/,'cx="76.2" cy="$1" r="1.5"');
        return `<g class="tm-eyes" style="animation-delay:${(-Math.random()*5).toFixed(2)}s">${m}</g>`});
      if(mood==="think"){
        s=s.replace('<path d="M52 79 Q60 77 69 80" stroke="#3A1A05" stroke-width="3" fill="none" stroke-linecap="round"/>',
          '<path d="M52 78 Q60 85.5 69 77" stroke="#3A1A05" stroke-width="3.1" fill="none" stroke-linecap="round"/>');
        // raised, curious eyebrows (right one higher), drawn just before the nose
        s=s.replace('<circle cx="56" cy="68"','<path class="tm-brow" d="M39 39.5 Q46 35.5 53 38.5" stroke="#3A1A05" stroke-width="2.6" fill="none" stroke-linecap="round"/><path class="tm-brow" d="M67 35.5 Q74 30 81 34" stroke="#3A1A05" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="56" cy="68"');
      }
    }catch(e){}
    return s;
  };
  const HOPPABLE=".buddy .tm,.mwrap .tm,#brandMonkey .tm,.prof-stage .tm,.stage-monkey .tm,.fin-stage .tm,.lvup-stage .tm";
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest(".tm");if(!t||!t.matches(HOPPABLE)||t.closest(".shopitem"))return;
    if(calm())return;t.classList.remove("tm-hop");void t.getBoundingClientRect();t.classList.add("tm-hop");
    t.addEventListener("animationend",function f(ev){if(ev.animationName==="tmHop"){t.classList.remove("tm-hop");t.removeEventListener("animationend",f)}});
    if(!t.closest("#brandMonkey"))try{sfx("tap")}catch(_){}
  });

  /* ---------- Top bar: level chip on the mascot; tapping the mascot opens the Profile ---------- */
  const _renderStats=renderStats;
  renderStats=function(){
    _renderStats.apply(this,arguments);
    try{const bm=$("#brandMonkey");if(!bm)return;const I=info(S.xp);
      let chip=bm.querySelector(".tm-lvl");if(!chip){chip=document.createElement("span");chip.className="tm-lvl";chip.setAttribute("aria-hidden","true");bm.appendChild(chip)}
      chip.textContent=I.lvl;chip.classList.toggle("gold",I.lvl>=10);chip.classList.toggle("legend",I.max);
      bm.title=`Level ${I.lvl} · ${I.title}. Tap for your profile`;
      const hb=$("#homeBtn");if(hb)hb.setAttribute("aria-label",`TypeMonkey, level ${I.lvl}. Open your profile`);
    }catch(e){}
  };
  (function wireBrand(){const bm=document.getElementById("brandMonkey");if(!bm)return;
    bm.addEventListener("click",e=>{e.stopPropagation();sfx("tap");profilePage()});
    // keyboard: the brand button itself (Enter/Space) also opens the profile; the "TypeMonkey" word still goes home on a mouse click
    const hb=document.getElementById("homeBtn");if(hb)hb.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();profilePage()}});
  })();

  /* ---------- Save hook: best streak + level-up detection (chain-safe wrapper) ---------- */
  let granting=false,pendingTimer=null;
  const _save=save;
  save=function(){
    try{if(!granting){S.bestStreak=Math.max(+S.bestStreak||0,+S.streak||0);
      const L=info(S.xp).lvl;if(typeof S.mlevel!=="number"||S.mlevel>L)S.mlevel=L;}}catch(e){}
    _save.apply(this,arguments);
    try{if(!granting&&info(S.xp).lvl>S.mlevel)queueLevelUp(1500)}catch(e){}
  };
  function queueLevelUp(ms){clearTimeout(pendingTimer);pendingTimer=setTimeout(tryShow,ms)}
  function tryShow(){
    if(info(S.xp).lvl<=S.mlevel)return;
    if(document.querySelector(".celebrate,.gate")){queueLevelUp(800);return}   // wait for badges / grown-up gate
    showLevelUp();
  }
  function showLevelUp(){
    const from=S.mlevel,I=info(S.xp),to=I.lvl;let ban=0;const gifts=[];
    for(let L=from+1;L<=to;L++){ban+=bananasFor(L);const g=giftItem(L);
      if(g){if(S.owned[g.slot]&&!S.owned[g.slot].includes(g.id)){S.owned[g.slot].push(g.id);gifts.push(g)}else ban+=g.price||0}}
    S.bananas+=ban;S.mlevel=to;granting=true;try{save()}finally{granting=false}
    const gift=gifts[gifts.length-1];
    const g=document.createElement("div");g.className="celebrate lvlup";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label",`Level ${to}: ${I.title}`);
    const sparks=Array.from({length:14},(_,i)=>`<i style="--a:${i*360/14}deg;--r:${80+(i%3)*22}px;--d:${(i%5)*.12}s">${["✨","⭐","🍌","✨","💫"][i%5]}</i>`).join("");
    g.innerHTML=`<div class="card lvup-card">
      <div class="lvup-stage" aria-hidden="true"><div class="rays"></div><div class="lvup-sparks">${sparks}</div>${monkey("cheer")}</div>
      <div class="label">Level up!${to-from>1?` · +${to-from} levels`:""}</div>
      <h2 class="lvup-num">Level ${to}!</h2>
      <div class="lvup-title">${esc(I.title)}</div>
      <p class="muted">${to>=MAX?"You reached the top. TypeMonkey is a true legend, thanks to you!":`TypeMonkey grew a little! ${stage(to)!==stage(from)?`Now a <b>${stage(to)}</b>. `:""}${fmt(I.toGo)} XP to Level ${to+1}.`}</p>
      <div class="lvup-rewards"><span class="pill kid">+${ban} 🍌</span>${gifts.map(x=>`<span class="pill ok">🎁 ${esc(x.name)}</span>`).join("")}</div>
      ${gift?`<div class="lvup-gift"><div class="mini-monkey">${withPet("happy",{...S.look,[gift.slot]:gift.id})}</div><div><b>⭐ Rare reward: ${esc(gift.name)}</b><span>You can only get this by levelling up. Want TypeMonkey to wear it?</span></div></div>`:""}
      <div class="row" style="justify-content:center">${gift?`<button class="btn banana" id="lv-wear">Wear it!</button>`:""}<button class="btn${gift?" ghost":""}" id="lv-ok">${gift?"Later":"Yay!"}</button></div>
    </div>`;
    document.body.appendChild(g);
    try{sfx("complete");setTimeout(()=>sfx("badge"),500)}catch(e){}
    if(!calm())setTimeout(()=>confetti(90),200);
    const close=()=>{g.remove();try{if(typeof rerender==="function"&&rerender===profilePage)profilePage()}catch(e){}if(typeof showBadge==="function")showBadge()};
    g.querySelector("#lv-ok").onclick=close;
    if(gift)g.querySelector("#lv-wear").onclick=()=>{S.look[gift.slot]=gift.id;save();toast(`TypeMonkey is wearing: ${gift.name}`);close()};
    setTimeout(()=>{try{g.querySelector(gift?"#lv-wear":"#lv-ok").focus()}catch(e){}},60);
  }
  // celebrate a level reached while the app was closed (never on a first load: S.mlevel starts at the current level)
  setTimeout(()=>{try{if(typeof S.mlevel!=="number"){S.mlevel=info(S.xp).lvl;S.bestStreak=Math.max(+S.bestStreak||0,+S.streak||0)}else if(info(S.xp).lvl>S.mlevel)queueLevelUp(1200)}catch(e){}},0);

  /* ---------- Home: a slim level card under TypeMonkey's greeting ---------- */
  const levelCard=()=>{const I=info(S.xp);return `<button class="lvcard" id="lvcard" aria-label="Level ${I.lvl}, ${esc(I.title)}. Open your profile">
    <span class="lvnum"><small>LV</small>${I.lvl}</span>
    <span class="lvtext"><b>${esc(I.title)}</b><span class="lvbar"><span style="width:${I.pct}%"></span></span><span class="lvsub">${I.max?"Max level reached!":`${fmt(I.toGo)} XP to Level ${I.lvl+1}`}</span></span>
    <span class="lvgo" aria-hidden="true">Profile ›</span></button>`};
  const _home=home;
  home=function(){
    _home.apply(this,arguments);
    try{if($("#lvcard"))return;const st=$("#screen .stack");if(!st)return;const anchor=st.querySelector(":scope > .buddy");
      const tmp=document.createElement("div");tmp.innerHTML=levelCard();const el=tmp.firstElementChild;
      if(anchor)anchor.after(el);else st.prepend(el);el.onclick=profilePage}catch(e){}
  };

  /* ---------- Profile page ---------- */
  function weekXp(){
    const d=S.xpDays;if(!d||typeof d!=="object")return null;
    const out=[];for(let i=6;i>=0;i--){const t=new Date();t.setHours(12,0,0,0);t.setDate(t.getDate()-i);
      out.push({k:dayStr(t),lab:t.toLocaleDateString("en-US",{weekday:"short"}),full:t.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),xp:Math.max(0,Math.floor(+d[dayStr(t)]||0)),today:i===0})}
    return out;
  }
  function chart(days){
    const max=Math.max(...days.map(x=>x.xp)),tot=days.reduce((n,x)=>n+x.xp,0);const top=days.findIndex(x=>x.xp===max&&max>0);
    return `<div class="card prof-week"><div class="pw-head"><div><div class="label">This week</div><h3>${fmt(tot)} XP</h3></div><span class="muted">last 7 days</span></div>
      <div class="pw-bars" role="img" aria-label="XP per day, last 7 days: ${days.map(x=>`${x.lab} ${x.xp}`).join(", ")}">${days.map((x,i)=>`<div class="pw-col${x.today?" today":""}" title="${x.full}: ${fmt(x.xp)} XP">
        <span class="pw-val">${(x.today||i===top)&&x.xp?fmt(x.xp):""}</span><span class="pw-bar" style="height:${max?Math.max(x.xp?6:0,x.xp/max*100):0}%"></span><span class="pw-lab">${x.today?"Today":x.lab}</span></div>`).join("")}</div>
      ${max?"":`<p class="muted pw-empty">No XP yet this week. One lesson fills the first bar!</p>`}</div>`;
  }
  function startedCourses(){
    try{return COURSES.filter(c=>c.units&&!c.soon).map(c=>{const [d,n]=countLessons(c);const inProg=flat(c).some(x=>S.progress[x.l.id]);return {c,d,n,go:d>0||inProg}}).filter(x=>x.go).sort((a,b)=>(b.c.id===S.lastCourse)-(a.c.id===S.lastCourse)||b.d/b.n-a.d/a.n)}catch(e){return []}
  }
  function profilePage(){
    try{SFX.stopMusic()}catch(e){}
    const back=rerender===profilePage?home:rerender;rerender=profilePage;try{setMode(false)}catch(e){}
    if(typeof S.mlevel!=="number")S.mlevel=info(S.xp).lvl;
    const I=info(S.xp),list=badgeList(),got=list.filter(b=>S.badges[b.id]).length,best=Math.max(+S.bestStreak||0,S.streak);
    const days=weekXp(),courses=startedCourses();
    const size=Math.round(118+Math.min(I.lvl,MAX)/MAX*38);   // TypeMonkey literally grows on the profile stage
    const nextGift=Object.keys(GIFTS).map(Number).find(L=>L>I.lvl);
    const tile=(icon,val,lab,cls="")=>`<div class="ptile ${cls}"><span class="pt-ic" aria-hidden="true">${icon}</span><b>${val}</b><span>${lab}</span></div>`;
    $("#screen").innerHTML=`<div class="stack prof">
      <div class="row prof-top"><button class="btn ghost sm" id="back">← Back</button><span class="label">Your profile</span></div>
      <section class="card prof-hero">
        <div class="prof-stage" style="--ms:${size}px"><div class="rays" aria-hidden="true"></div>${withPet("happy")}</div>
        <div class="prof-id">
          <span class="prof-lv">Level ${I.lvl} · ${stage(I.lvl)}</span>
          <h1>${esc(I.title)}</h1>
          <div class="prof-bar" role="progressbar" aria-label="XP to next level" aria-valuemin="0" aria-valuemax="${I.span}" aria-valuenow="${I.max?I.span:I.into}"><span style="width:${I.pct}%"></span></div>
          <div class="prof-xp"><span>${I.max?`${fmt(S.xp)} XP`:`${fmt(I.into)} / ${fmt(I.span)} XP`}</span><span>${I.max?"Max level 🏆":`${fmt(I.toGo)} XP to Lv ${I.lvl+1}`}</span></div>
        </div>
      </section>
      <div class="ptiles">
        ${tile("⚡",fmt(S.xp),"Total XP")}
        ${tile("🔥",S.streak,`Day streak`,S.streak?"hot":"")}
        ${tile("🏔️",best,"Best streak")}
        ${tile("📚",S.done.length,"Lessons done")}
        ${tile("🍌",fmt(S.bananas),"Bananas")}
        ${tile("🏆",`${got}<small>/${list.length}</small>`,"Badges")}
      </div>
      ${days?chart(days):""}
      <div class="card prof-road"><div class="pw-head"><div><div class="label">⭐ Rare level rewards</div><h3>${nextGift?`Next gift at Level ${nextGift}`:"Every gift unlocked!"}</h3><p class="muted" style="margin:2px 0 0">Not sold in the shop. The only way to get them is to level up.</p></div></div>
        <div class="road">${Object.keys(GIFTS).map(Number).map(L=>{const gi=giftItem(L);if(!gi)return "";const on=I.lvl>=L;
          return `<div class="road-i ${on?"on":""} ${L===nextGift?"next":""}"><div class="mini-monkey">${withPet("happy",{...S.look,[gi.slot]:gi.id})}</div><b>${esc(gi.name)}</b><span class="pill ${on?"ok":L===nextGift?"go":""}">${on?"✓ Lv "+L:"Lv "+L}</span></div>`}).join("")}</div></div>
      <div class="card prof-courses"><div class="label">Your courses</div>
        ${courses.length?courses.map(x=>`<button class="pcourse" data-c="${x.c.id}"><span class="pc-t"><b>${esc(x.c.name)}</b><span>${x.d} of ${x.n} lessons${x.d===x.n&&x.n?" · complete 🎉":""}</span></span><span class="pc-bar"><span style="width:${x.n?x.d/x.n*100:0}%"></span></span></button>`).join("")
          :`<p class="muted">No courses started yet. Pick one on Home and TypeMonkey starts growing!</p>`}
      </div>
      <div class="pbtns"><button class="tool" id="pshop"><b>🛍️ Shop</b><span>Outfits for TypeMonkey</span></button><button class="tool" id="pbadges"><b>🏆 Badges</b><span>${got} of ${list.length} earned</span></button></div>
    </div>`;
    $("#back").onclick=()=>back();$("#pshop").onclick=()=>shop();$("#pbadges").onclick=badgesPage;
    $$(".pcourse").forEach(b=>b.onclick=()=>coursePage(b.dataset.c));
    try{foot()}catch(e){}window.scrollTo(0,0);
    (window.tmProfileHooks||[]).forEach(f=>{try{f()}catch(e){console.warn(e)}});   // later modules add to the profile here
  }
  window.profilePage=profilePage;
})();
