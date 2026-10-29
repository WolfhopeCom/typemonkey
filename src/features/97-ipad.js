/* ---------- 97-ipad: Home in two columns on wide screens (iPad landscape, 1024px+) ----------
   Left: the monkey's greeting, level, Continue, streak ring and daily challenge. Right: courses, practice tools and
   rewards. Below 1024px nothing changes. Turning the iPad redraws Home in the right layout. */
const WIDE=()=>innerWidth>=1024;
const SPLIT_LEFT=[".hero",":scope>.buddy","#lvcard",".continue","#todayCard","#daily"];
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{const st=$("#screen>.stack");if(st&&WIDE()&&!st.querySelector(".tm-col")){
    const L=document.createElement("div"),R=document.createElement("div");L.className="tm-col l";R.className="tm-col r";
    const left=new Set(SPLIT_LEFT.map(q=>st.querySelector(q)).filter(Boolean));
    [...st.children].forEach(el=>(left.has(el)?L:R).appendChild(el));
    st.append(L,R);st.classList.add("tm-split")}}catch(e){console.warn(e)}
  return r}}
{let t=null,was=WIDE();addEventListener("resize",()=>{clearTimeout(t);t=setTimeout(()=>{const w=WIDE();if(w!==was){was=w;try{if(rerender===home&&!document.querySelector(".celebrate,.gate"))home()}catch(e){}}},200)})}
