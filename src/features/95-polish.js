/* ---------- 95-polish: small behaviours for the 1.2 look (styles are in 95-polish.css) ----------
   - A short rise when the screen changes (not in Calm mode or with Reduce Motion).
   - Returning players get a compact Home: the big "Learn to code" tagline is only for first visits. */
(()=>{
  const scr=document.getElementById("screen");if(!scr)return;
  const calm=()=>{try{return calmMotion()||!!(S.settings&&S.settings.calm)}catch(e){return false}};
  let last=null;
  new MutationObserver(()=>{const el=scr.firstElementChild;if(!el||el===last)return;last=el;if(calm())return;
    el.classList.add("tm-enter");el.addEventListener("animationend",()=>el.classList.remove("tm-enter"),{once:true});
    setTimeout(()=>el.classList.remove("tm-enter"),400)}).observe(scr,{childList:true});
})();
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{const st=$("#screen>.stack");if(st&&((S.done||[]).length||S.xp))st.classList.add("tm-returning")}catch(e){}
  return r}}
