/* ===== Course map v2 (Duolingo-style path) =====
   Runs right after the core coursePage() has drawn the page and dresses it up, so the core page code stays as it is:
   - every unit gets a colorful banner ("UNIT 2", name, 3/5 ring, Free/Pro). The banner sticks to the top while you scroll its unit.
   - a dotted trail joins the lesson circles along the zigzag (green behind you, grey ahead)
   - a treasure chest waits after the last lesson of each unit; finish the unit, tap it, get bananas + XP (once)
   - finished units get a soft golden look
   Hook points: wraps coursePage (global), uses status/flat/S/save/sfx/toast/bananaBurst/calmMotion from the core. */
const MAP_COLORS=["#E8681A","#7357E8","#138A7E","#D9406F","#2C7FD0","#4E9A2E"];
const MAP_JR_COLORS=["#3E9A45","#1E8FCB","#4F82BE","#C2702A","#3B3970","#D9548F"];   // Jungle, Beach, Snowy peaks, Desert, Space, Candy
const CHEST_REWARD={ban:20,xp:10};
const chestKey=(c,u,ui)=>c.id+":"+((u.lessons[0]&&u.lessons[0].id)||ui);
const mapCalm=()=>calmMotion()||document.documentElement.classList.contains("calm");
function unitInfo(c,L,ui){
  const items=L.filter(x=>x.ui===ui&&x.l.steps),u=c.units[ui];
  const done=items.filter(x=>S.done.includes(x.l.id)).length;
  return {u,items,done,total:items.length,complete:items.length>0&&done===items.length,locked:!u.free&&!S.pro};
}
function chestState(c,ui,info){
  if(!info.total)return null;
  if((S.chests||{})[chestKey(c,info.u,ui)])return "opened";
  if(info.locked)return "pro";
  return info.complete?"ready":"locked";
}
function chestSVG(){
  return `<svg class="chest-svg" viewBox="0 0 72 64" aria-hidden="true">
    <ellipse class="cglow" cx="36" cy="26" rx="34" ry="20"/>
    <g class="cloot"><ellipse cx="36" cy="30" rx="27" ry="6" fill="#5A2E0C"/>
      <circle cx="24" cy="27" r="6" fill="#FFD25C" stroke="#C88A10" stroke-width="1.5"/><circle cx="47" cy="27" r="6" fill="#FFD25C" stroke="#C88A10" stroke-width="1.5"/>
      <path d="M28 27c4 6 14 6 18-4 1 5-2 10-9 11s-10-3-9-7z" fill="#FFE14D" stroke="#B88A00" stroke-width="1.5"/><circle cx="36" cy="23" r="5.5" fill="#FFE07A" stroke="#C88A10" stroke-width="1.5"/></g>
    <g class="cbody"><rect x="6" y="28" width="60" height="30" rx="6" fill="#B06A2B" stroke="#6E3D12" stroke-width="2.5"/>
      <rect x="8" y="30" width="56" height="7" rx="3" fill="#C98143" opacity=".7"/>
      <rect x="15" y="28" width="7" height="30" fill="#F2B632" stroke="#9A6A10" stroke-width="1.5"/><rect x="50" y="28" width="7" height="30" fill="#F2B632" stroke="#9A6A10" stroke-width="1.5"/></g>
    <g class="clid"><path d="M6 30V20C6 9 18 4 36 4S66 9 66 20V30Z" fill="#C47A35" stroke="#6E3D12" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M12 15C18 9 26 8 36 8" stroke="#E7A160" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M15 30V12.5" stroke="#F2B632" stroke-width="7"/><path d="M57 30V12.5" stroke="#F2B632" stroke-width="7"/>
      <rect x="28" y="22" width="16" height="16" rx="3.5" fill="#FFD25C" stroke="#9A6A10" stroke-width="2"/>
      <circle cx="36" cy="28.5" r="2.6" fill="#6E3D12"/><rect x="34.8" y="29" width="2.4" height="5" rx="1" fill="#6E3D12"/></g>
  </svg>`;
}
function chestNodeHTML(c,ui,info,k){
  const st=chestState(c,ui,info);if(!st)return "";
  const sub={locked:`Finish all ${info.total} lessons to open`,pro:"Pro",ready:"Tap to open!",opened:`Opened · +${CHEST_REWARD.ban} 🍌`}[st];
  return `<div class="pnode chest ${st}" style="--off:${[0,1,2,1,0,-1,-2,-1][k%8]}">
    <button class="pbtn chestbtn" data-chest="${ui}" aria-label="Treasure chest for unit ${ui+1}${st==="ready"?": tap to open":st==="opened"?" (opened)":" (locked)"}" ${st==="ready"?"":"disabled"}>${chestSVG()}${st==="locked"||st==="pro"?`<span class="clock">🔒</span>`:""}</button>
    <div class="plabel"><b>${st==="opened"?"Treasure found!":"Treasure chest"}</b><span>${sub}</span></div></div>`;
}
function bannerHTML(c,ui,info){
  const W=c.kids?WORLDS[ui%WORLDS.length]:null,p=info.total?info.done/info.total:0;
  const tag=info.u.free?"Free":S.pro?"Unlocked":"🔒 Pro";
  return `<div class="ub-badge">${W?W.emoji:info.complete?"★":ui+1}</div>
    <div class="ub-txt"><span class="ub-eye">Unit ${ui+1}${W?` · ${W.name}`:""} <span class="ub-tag">${tag}</span></span><h3>${esc(info.u.name)}</h3></div>
    <div class="ub-ring${info.complete?" full":""}" style="--p:${p}" aria-label="${info.done} of ${info.total} lessons done"><b>${info.complete?"✓":`${info.done}/${info.total}`}</b></div>`;
}
/* Trail: one curvy dotted segment between each pair of circles, worked out from layout positions (ignores the pop-in animation) */
function drawTrail(path){
  const btns=[...path.querySelectorAll(":scope > .pnode > .pbtn")];let svg=path.querySelector(":scope > svg.trail");
  if(btns.length<2){if(svg)svg.remove();return}
  const W=path.clientWidth,H=path.scrollHeight;if(!W)return;
  const pts=btns.map(b=>{const pn=b.parentElement;let dx=0;try{dx=new DOMMatrixReadOnly(getComputedStyle(pn).transform).m41}catch(e){}
    return {x:pn.offsetLeft+b.offsetLeft+b.offsetWidth/2+dx,y:pn.offsetTop+b.offsetTop+b.offsetHeight/2,done:pn.classList.contains("done")||pn.classList.contains("opened"),shut:/\b(locked|pro)\b/.test(pn.className)}});
  const seg=pts.slice(1).map((b,i)=>{const a=pts[i],m=(b.y-a.y)*.5;
    return `<path class="${a.done&&!b.shut?"on":""}" d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}C${a.x.toFixed(1)} ${(a.y+m).toFixed(1)} ${b.x.toFixed(1)} ${(b.y-m).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}"/>`}).join("");
  if(!svg){svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("class","trail");svg.setAttribute("aria-hidden","true");path.prepend(svg)}
  svg.setAttribute("width",W);svg.setAttribute("height",H);svg.setAttribute("viewBox",`0 0 ${W} ${H}`);svg.innerHTML=seg;
}
let mapRO=null;
function openChest(c,ui,btn){
  const info=unitInfo(c,flat(c),ui),key=chestKey(c,info.u,ui);
  if(chestState(c,ui,info)!=="ready")return;
  S.chests=S.chests&&typeof S.chests==="object"?S.chests:{};
  S.chests[key]=true;S.bananas+=CHEST_REWARD.ban;S.xp+=CHEST_REWARD.xp;save();renderStats();
  const pn=btn.closest(".pnode");btn.disabled=true;
  const finish=()=>{pn.classList.remove("ready","opening");pn.classList.add("opened");
    btn.setAttribute("aria-label",`Treasure chest for unit ${ui+1} (opened)`);
    pn.querySelector(".plabel").innerHTML=`<b>Treasure found!</b><span>Opened · +${CHEST_REWARD.ban} 🍌</span>`;
    const r=btn.getBoundingClientRect(),f=document.createElement("div");f.className="chest-pop";f.setAttribute("aria-hidden","true");
    f.innerHTML=`+${CHEST_REWARD.ban} 🍌 <span>+${CHEST_REWARD.xp} XP</span>`;f.style.left=(r.left+r.width/2)+"px";f.style.top=(r.top)+"px";document.body.appendChild(f);setTimeout(()=>f.remove(),1600);
    if(typeof bananaBurst==="function"){bananaBurst();const bs=document.querySelectorAll("body > .burst"),bx=bs[bs.length-1];if(bx){bx.style.left=(r.left+r.width/2)+"px";bx.style.top=(r.top+r.height/2)+"px"}}
    sfx("complete");setTimeout(()=>sfx("coins"),350);
    toast(`Treasure! +${CHEST_REWARD.ban} 🍌 bananas and +${CHEST_REWARD.xp} XP`);
    const p=pn.closest(".path");if(p)drawTrail(p)};
  if(mapCalm()){finish();return}
  pn.classList.add("opening");sfx("tap");setTimeout(finish,620);
}
function decorateMap(c){
  const L=flat(c),units=[...document.querySelectorAll("#screen .unit")];if(units.length!==c.units.length)return;
  const tb=document.querySelector(".topbar");document.documentElement.style.setProperty("--tbh",(tb?tb.offsetHeight:0)+"px");
  if(mapRO){mapRO.disconnect();mapRO=null}
  units.forEach((el,ui)=>{
    const info=unitInfo(c,L,ui),pal=c.kids?MAP_JR_COLORS:MAP_COLORS;
    el.classList.add("umap");if(info.complete)el.classList.add("ucomplete");if(info.locked)el.classList.add("ulocked");
    el.style.setProperty("--uc",pal[ui%pal.length]);
    const head=el.querySelector(":scope > .unit-head");if(head){head.classList.add("ubanner");head.innerHTML=bannerHTML(c,ui,info)}
    const path=el.querySelector(":scope > .path");if(!path)return;
    const k=path.querySelectorAll(":scope > .pnode").length;
    path.insertAdjacentHTML("beforeend",chestNodeHTML(c,ui,info,k));
    const cb=path.querySelector(".chestbtn");if(cb)cb.onclick=()=>openChest(c,ui,cb);
    drawTrail(path);
  });
  if(typeof ResizeObserver==="function"){let raf=0;mapRO=new ResizeObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>document.querySelectorAll("#screen .path").forEach(drawTrail))});
    document.querySelectorAll("#screen .path").forEach(p=>mapRO.observe(p))}
}
/* The core page places the hopping TypeMonkey while it draws; hold that until the map is dressed so his hop starts from the final positions */
{const core=coursePage,coreWalk=placeWalker;let held=null;
  placeWalker=function(){held=arguments};
  coursePage=function(cid){held=null;const r=core.apply(this,arguments);
    try{const c=courseById(cid);if(c&&c.units)decorateMap(c)}catch(e){console.error("map",e)}
    if(held){const a=held;held=null;coreWalk.apply(this,a)}return r};}
