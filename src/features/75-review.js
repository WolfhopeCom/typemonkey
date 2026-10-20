/* ---------- 75-review: Apple's own rating prompt, only after a happy moment ----------
   Apple's rules: use the system prompt only (no custom "rate us" screens), and iOS shows it at most 3 times a year.
   Best practice: ask after a success, never at launch, mid-task, in the kids section or right after a purchase.
   TypeMonkey asks after finishing the 5th, 15th and 40th lesson (and after a 7- or 30-day streak), at most once every
   3 weeks and 3 times a year, once any celebration on screen has closed. Native app only (TMCloud.requestReview).
   State: S.reviewAsks=[timestamps]. */
const Review={
  plugin(){try{const C=window.Capacitor,P=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.TMCloud;return P&&P.requestReview?P:null}catch(e){return null}},
  okNow(){
    const now=Date.now(),A=(S.reviewAsks||[]).filter(t=>now-t<365*864e5);
    if(A.length>=3)return false;if(A.length&&now-Math.max(...A)<21*864e5)return false;
    if(S.boughtAt&&now-S.boughtAt<2*864e5)return false;
    return true},
  ask(){if(!Review.plugin()||!Review.okNow())return false;
    let tries=0;const go=()=>{if(++tries>40)return;if($(".celebrate")||document.hidden||($("#quit")&&!$("#screen .reward"))){setTimeout(go,1500);return}
      S.reviewAsks=[...(S.reviewAsks||[]).filter(t=>Date.now()-t<365*864e5),Date.now()];save();
      try{Review.plugin().requestReview().catch(()=>{})}catch(e){}};
    setTimeout(go,2500);return true}
};
const REVIEW_AT=[5,15,40];
{const _fin=finish;finish=function(){
  const kid=!!(cur&&cur.c&&cur.c.kids),special=!!(cur&&(cur.daily||cur.review)),before=(S.done||[]).length;
  const r=_fin.apply(this,arguments);
  try{const n=(S.done||[]).length;
    if(!kid&&!special&&n>before&&REVIEW_AT.includes(n))Review.ask();
    else if(!kid&&!special&&(S.streak===7||S.streak===30)&&S.lastDay===dayStr(new Date())&&!(S.reviewStreaks||[]).includes(S.streak)){
      S.reviewStreaks=[...(S.reviewStreaks||[]),S.streak];if(Review.ask())save()}
  }catch(e){}
  return r}}
/* remember when the full version was bought, so we never ask right after paying */
{const _u=unlockFull;unlockFull=function(after){return _u.call(this,function(){try{S.boughtAt=Date.now();save()}catch(e){}if(after)return after.apply(this,arguments)})}}
