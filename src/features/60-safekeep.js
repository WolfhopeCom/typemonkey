/* ---------- 60-safekeep: a second copy of progress on the device (iPhone/iPad app only) ----------
   iOS treats a web view's localStorage as "best effort": the system may clear it. Losing a long streak is the thing
   players of streak apps get angriest about, so every save is also written to the app's own settings storage
   (UserDefaults, via the TMCloud plugin's localGet/localSet). At launch, if that copy is newer than what the web view
   has (for example the web view's storage was wiped), it is merged back in with mergeState() (newest wins, and a
   newer "Erase everything" still wins). Does nothing on the web. */
const Safe={
  KEY:"progress",timer:null,last:null,s:null,
  plugin(){try{const C=window.Capacitor,P=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.TMCloud;return P&&P.localSet?P:null}catch(e){return null}},
  write(){const P=Safe.plugin();if(!P)return;clearTimeout(Safe.timer);Safe.timer=null;
    try{const v=JSON.stringify(S);if(v===Safe.last)return;Safe.last=v;P.localSet({key:Safe.KEY,value:v}).catch(()=>{})}catch(e){}},
  queue(){if(!Safe.plugin())return;
    if(S!==Safe.s){Safe.s=S;Safe.write();return}          // a whole new state (erase, restore, sync): write right away
    clearTimeout(Safe.timer);Safe.timer=setTimeout(Safe.write,1200)},
  async restore(){const P=Safe.plugin();if(!P)return;
    try{const r=await P.localGet({key:Safe.KEY});if(!r||!r.value)return Safe.write();
      const got=JSON.parse(r.value);if(!got||typeof got!=="object")return;
      if((+got.savedAt||0)<=(+S.savedAt||0)+1000)return Safe.write();
      S=mergeState(S,normState({...got,settings:{...(got.settings||{}),...(S.savedAt?S.settings:{})}}));
      try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
      Safe.s=S;renderStats();
      if($("#onb")&&S.onboarded)home();else if(!$("#quit")&&typeof rerender==="function")rerender();
      Safe.write();
    }catch(e){}}
};
{const _save=save;save=function(){const r=_save.apply(this,arguments);try{Safe.queue()}catch(e){}return r}}
document.addEventListener("visibilitychange",()=>{if(document.hidden&&Safe.timer)Safe.write()});
Safe.s=S;setTimeout(()=>Safe.restore(),300);
