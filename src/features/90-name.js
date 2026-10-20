/* ---------- 90-name: name your monkey ----------
   Finch's players name their pet, and that small choice is a big part of why they care about it. On the Profile,
   a name tag under the monkey ("Name your monkey ✏️") opens a little sheet with ideas and a text box. The name then
   shows on the Profile and on the Home level card. State: S.monkeyName (empty = not named yet). */
const NAME_IDEAS=["Bongo","Coco","Pixel","Byte","Mango","Ziggy","Loop","Nana"];
const monkeyName=()=>String(S.monkeyName||"").trim();
function nameSheet(){
  const box=document.createElement("div");box.className="gate onb-sheet";box.setAttribute("role","dialog");box.setAttribute("aria-label","Name your monkey");
  const nm=monkeyName();
  box.innerHTML=`<div class="card"><div class="sheethead"><h2>Name your monkey</h2><button class="x" id="nmx" aria-label="Close">×</button></div>
    <div class="nm-stage" aria-hidden="true">${withPet("cheer")}</div>
    <div class="nm-ideas">${NAME_IDEAS.map(n=>`<button class="lang nm-idea" data-n="${n}" aria-pressed="${n===nm}">${n}</button>`).join("")}</div>
    <input class="nm-in" id="nmIn" maxlength="14" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Or type a name" value="${esc(nm)}" aria-label="Monkey name">
    <div class="row"><button class="btn" id="nmOk">Save name</button>${nm?`<button class="btn ghost" id="nmClear">No name</button>`:""}</div></div>`;
  document.body.appendChild(box);
  const close=()=>box.remove(),inp=box.querySelector("#nmIn");
  box.onclick=e=>{if(e.target===box)close()};box.querySelector("#nmx").onclick=close;
  box.querySelectorAll(".nm-idea").forEach(b=>b.onclick=()=>{inp.value=b.dataset.n;box.querySelectorAll(".nm-idea").forEach(x=>x.setAttribute("aria-pressed",x===b));try{sfx("tap")}catch(e){}});
  const done=v=>{S.monkeyName=v;save();close();if(v){toast(`Hi, ${v}! 🐵`);try{sfx("success");haptic("success")}catch(e){}}if(typeof window.profilePage==="function"&&$(".prof"))window.profilePage()};
  box.querySelector("#nmOk").onclick=()=>done(inp.value.replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,14));
  inp.onkeydown=e=>{if(e.key==="Enter")box.querySelector("#nmOk").click()};
  const c=box.querySelector("#nmClear");if(c)c.onclick=()=>done("");
}
(window.tmProfileHooks=window.tmProfileHooks||[]).push(()=>{
  const id=$(".prof-id");if(!id||$("#nmTag"))return;const nm=monkeyName();
  id.insertAdjacentHTML("afterbegin",`<button class="nm-tag ${nm?"":"empty"}" id="nmTag" type="button">${nm?`🐵 ${esc(nm)} <span aria-hidden="true">✏️</span>`:"Name your monkey ✏️"}</button>`);
  $("#nmTag").onclick=nameSheet});
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{const nm=monkeyName(),t=$("#lvcard b");if(nm&&t&&!t.dataset.nm){t.dataset.nm="1";t.insertAdjacentHTML("afterbegin",`<span class="nm-on">${esc(nm)} · </span>`)}}catch(e){}
  return r}}
