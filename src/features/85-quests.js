/* ---------- 85-quests: three small daily quests ----------
   A fresh set of 3 every day (the same 3 all day), shown on Home under the Today card. Each one done gives
   +10 bananas; all three done gives a +25 banana bonus and a little celebration. Everything is counted on the
   device. Hooks: finish, dailyDone, answered, Run buttons, home. State: S.quests={day,p:{lessons,right,runs},done:[],all}. */
const QUESTS={
  lesson1:{t:"Finish a lesson",n:1,get:p=>p.lessons},
  lesson2:{t:"Finish 2 lessons",n:2,get:p=>p.lessons},
  xp30:{t:"Earn 30 XP",n:30,get:()=>xpToday()},
  xp60:{t:"Earn 60 XP",n:60,get:()=>xpToday()},
  right8:{t:"Get 8 answers right",n:8,get:p=>p.right},
  right15:{t:"Get 15 answers right",n:15,get:p=>p.right},
  runs3:{t:"Run your code 3 times",n:3,get:p=>p.runs},
  daily:{t:"Do the daily challenge",n:1,get:()=>dailyDoneToday()?1:0}
};
const QUEST_ICON={lesson1:"📘",lesson2:"📚",xp30:"⚡",xp60:"⚡",right8:"💡",right15:"💡",runs3:"▶️",daily:"🎯"};
const QUEST_BAN=10,QUEST_ALL=25;
function questDay(){
  const t=dayStr(new Date());let Q=S.quests;
  if(!Q||Q.day!==t){
    const [y,m,d]=t.split("-").map(Number),seed=y*372+m*31+d,pick=(a,k)=>a[(seed*(k+7)+k)%a.length];
    const kid=!!(S.profile&&S.profile.why==="kid");
    const ids=[pick(["lesson1","lesson1","lesson2"],1),pick(kid?["right8","xp30"]:["xp30","right8","xp60","right15"],2),pick(kid?["daily","right8"]:["runs3","daily"],3)];
    if(ids[1]===ids[2])ids[2]="daily";
    Q=S.quests={day:t,ids,p:{lessons:0,right:0,runs:0},done:[],all:false};
  }
  return Q;
}
function questCheck(quiet){
  const Q=questDay();let got=[];
  for(const id of Q.ids){const q=QUESTS[id];if(!q||Q.done.includes(id))continue;if(q.get(Q.p)>=q.n){Q.done.push(id);got.push(id)}}
  if(!got.length)return;
  S.bananas+=QUEST_BAN*got.length;
  const all=!Q.all&&Q.done.length>=Q.ids.length;if(all){Q.all=true;S.bananas+=QUEST_ALL}
  save();renderStats();
  if(quiet)return;
  setTimeout(()=>{try{
    if(all){toast(`🏆 All 3 daily quests done! +${QUEST_ALL} bonus bananas`);sfx("badge");haptic("success");if(!calmNow())confetti(60)}
    else{toast(`✅ Quest done: ${QUESTS[got[0]].t} · +${QUEST_BAN} 🍌`);sfx("coins")}
  }catch(e){}},1200);
}
function questCard(){
  const Q=questDay();
  const rows=Q.ids.map(id=>{const q=QUESTS[id];if(!q)return "";const v=Math.min(q.n,q.get(Q.p)),done=Q.done.includes(id);
    return `<div class="qrow ${done?"done":""}"><span class="qic" aria-hidden="true">${done?"✔️":QUEST_ICON[id]||"⭐"}</span>
      <span class="qt"><b>${q.t}</b><span class="qbar"><i style="width:${Math.round(v/q.n*100)}%"></i></span></span>
      <span class="qn">${done?`+${QUEST_BAN} 🍌`:`${v}/${q.n}`}</span></div>`}).join("");
  return `<section class="card quests" id="quests" aria-label="Daily quests"><div class="qhead"><div><div class="label">Daily quests</div><h3>${Q.all?"All done! 🏆":`${Q.done.length} of 3 done`}</h3></div>
    <span class="qbonus ${Q.all?"got":""}" title="Bonus for all three">🎁 +${QUEST_ALL}</span></div>${rows}</section>`;
}
{const _fin=finish;finish=function(){const counts=!!(cur&&!cur.daily);const r=_fin.apply(this,arguments);
  try{if(counts){questDay().p.lessons++;questCheck()}}catch(e){}return r}}
{const _dd=dailyDone;dailyDone=function(){const r=_dd.apply(this,arguments);try{questCheck()}catch(e){}return r}}
{const _an=answered;answered=function(ok){const r=_an.apply(this,arguments);try{if(ok){questDay().p.right++;questCheck()}}catch(e){}return r}}
document.addEventListener("click",e=>{try{const b=e.target.closest&&e.target.closest("button.run,#trun,#trund");if(!b||!$("#quit"))return;
  questDay().p.runs++;setTimeout(()=>questCheck(),900)}catch(_){}},true);
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{questCheck(true);if(!$("#quests")){const anchor=$("#todayCard")||$("#daily");if(anchor)anchor.insertAdjacentHTML("afterend",questCard())}}catch(e){console.warn(e)}
  return r}}
