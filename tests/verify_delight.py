#!/usr/bin/env python3
"""Checks the v1.1 delight module (src/features/20-delight.js):

- haptic(kind): uses Capacitor Haptics when native, else navigator.vibrate, respects Settings > Vibration, never throws
- in-lesson combo: right-first-try answers count (quiz, fill, order, code, Jr. sorter), a miss resets quietly,
  a second try never counts, Bug Lab's "run the broken code first" is not a miss, banner at 3 and 5, flame chip
- finish card: "Perfect lesson!" (+5 bananas) only without misses; best combo shown
- streak milestones: one full-screen celebration per milestone per streak run, bonus bananas, old streaks don't pop up
- Settings: Vibration row toggles S.settings.haptics, page still fits a 390x844 phone
- Calm mode: the combo banner still shows (no motion)
Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_delight.py
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HELP = r"""
window.T = {
  steps(type, cid, n){ const out=[]; for(const c of COURSES.filter(c=>!cid||c.id===cid)) for(const x of flat(c)) for(const s of (x.l.steps||[]))
      if(s.type===type&&out.length<n&&!s.sandbox) out.push({...s,_course:c}); return out },
  lesson(steps){ const c=courseById('js'); const id=flat(c)[1].l.id; delete S.progress[id]; startLesson(id);
      cur.l={...cur.l,steps:[...steps,{type:'done'}]}; cur.step=0; cur.earned={xp:0,ban:0,right:0,total:0}; renderStep() },
  async right(){ const s=cur.l.steps[cur.step];
    if(s.type==='quiz') document.querySelector(`.opt[data-i="${s.a}"]`).click();
    else if(s.type==='fill'){ const used=new Set(); for(const bl of s.blanks){ const t=[...document.querySelectorAll('.token')].find(b=>!used.has(b.dataset.t)&&s.tokens[+b.dataset.t]===bl); used.add(t.dataset.t); t.click() } document.querySelector('#check').click() }
    else if(s.type==='order'){ for(let k=0;k<s.lines.length;k++) document.querySelector(`#pool .ln[data-i="${k}"]`).click(); document.querySelector('#check').click() }
    else if(s.type==='code'||s.type==='bug'){ const ta=document.querySelector('#code-c'); ta.value=s.hint; document.querySelector('#run-c').click(); for(let i=0;i<100&&!document.querySelector('#fb .feedback');i++) await new Promise(r=>setTimeout(r,50)) }
    else if(s.type==='sort'){ for(let k=0;k<s.items.length;k++){ const ic=document.querySelector('#item span').textContent, nm=(document.querySelector('#item small')||{}).textContent;
        const it=s.items.find(x=>x.icon===ic&&(!x.name||x.name===nm)); document.querySelector(`.bin[data-k="${it.bin}"]`).click() } }
    await new Promise(r=>setTimeout(r,30)) },
  async wrong(){ const s=cur.l.steps[cur.step];
    if(s.type==='quiz') document.querySelector(`.opt:not([data-i="${s.a}"])`).click();
    else if(s.type==='order'){ for(let k=s.lines.length-1;k>=0;k--) document.querySelector(`#pool .ln[data-i="${k}"]`).click(); document.querySelector('#check').click() }
    else if(s.type==='code'||s.type==='bug'){ document.querySelector('#run-c').click(); for(let i=0;i<100&&!document.querySelector('#fb .feedback');i++) await new Promise(r=>setTimeout(r,50)) }
    await new Promise(r=>setTimeout(r,30)) },
  go(){ document.querySelector('#go').click() },
  cmb(){ return JSON.parse(JSON.stringify(tmCombo())) },
  banner(){ const b=document.querySelector('#tmCombo'); return b&&b.classList.contains('show')?b.textContent:'' },
  chip(){ const c=document.querySelector('#tmChip'); return c&&!c.hidden?c.textContent:'' },
};
"""

fails = []
def check(cond, msg):
    if not cond: fails.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    pg = ctx.new_page(); errors = []; pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.add_init_script("window.__vib=[];navigator.vibrate=p=>{window.__vib.push(p);return true}")
    pg.goto((ROOT / "index.html").as_uri()); pg.wait_for_timeout(800)
    pg.evaluate(HELP)
    pg.evaluate("S.pro=true;S.settings.codeInput='type';for(const b of badgeList())S.badges[b.id]=1;save()")

    # --- haptics ---
    r = pg.evaluate("""()=>{const o={};__vib.length=0;o.web=haptic('success');o.pat=JSON.stringify(__vib[0]);
      S.settings.haptics=false;o.off=haptic('heavy');o.offCalls=__vib.length;S.settings.haptics=true;
      const calls=[];window.Capacitor={isNativePlatform:()=>true,Plugins:{Haptics:{impact:a=>{calls.push('i'+a.style);return Promise.resolve()},notification:a=>{calls.push('n'+a.type);return Promise.reject(new Error('x'))}}}};
      haptic('tap');haptic('success');haptic('warning');haptic('heavy');o.native=calls.join(',');o.webCalls=__vib.length;
      window.Capacitor.Plugins.Haptics.impact=()=>{throw new Error('boom')};let threw=false;try{haptic('heavy')}catch(e){threw=true}o.threw=threw;
      delete window.Capacitor;const v=navigator.vibrate;navigator.vibrate=undefined;o.none=haptic('tap');navigator.vibrate=v;return o}""")
    check(r["web"] and r["pat"] == "[14,60,22]", f"web haptic should vibrate the success pattern: {r}")
    check(r["off"] is False and r["offCalls"] == 1, f"Vibration Off must stop haptics: {r}")
    check(r["native"] == "iLIGHT,nSUCCESS,nWARNING,iHEAVY" and r["webCalls"] == 1, f"native haptics should use the Capacitor plugin only: {r}")
    check(not r["threw"] and r["none"] is False, f"haptic must never throw and do nothing without support: {r}")

    # --- combo across step types ---
    pg.evaluate("T.lesson([...T.steps('quiz','js',4),...T.steps('fill','js',1),...T.steps('order','js',1),...T.steps('code','js',1),...T.steps('quiz','js',6).slice(4)])")
    seen3 = seen5 = ""
    for i in range(7):
        pg.evaluate("T.right()"); pg.wait_for_timeout(60)
        if i == 2: seen3 = pg.evaluate("T.banner()")
        if i == 4: seen5 = pg.evaluate("T.banner()")
        pg.evaluate("T.go()"); pg.wait_for_timeout(40)
    c = pg.evaluate("T.cmb()")
    check(c["n"] == 7 and c["m"] == 0, f"7 right answers (quiz, fill, order, code) should make a 7 combo: {c}")
    check("3 in a row" in seen3, f"banner at 3 in a row, got {seen3!r}")
    check("5 in a row" in seen5, f"banner at 5 in a row, got {seen5!r}")
    check(pg.evaluate("T.chip()") == "🔥7", f"flame chip should show 7, got {pg.evaluate('T.chip()')!r}")
    check(pg.evaluate("document.querySelector('.lessonbar .progress').classList.contains('hot')"), "progress bar should glow at 3+")
    pg.evaluate("T.wrong()"); pg.wait_for_timeout(60)
    c = pg.evaluate("T.cmb()")
    check(c["n"] == 0 and c["m"] == 1 and c["b"] == 7, f"a miss resets the combo quietly: {c}")
    check(pg.evaluate("T.chip()") == "" and pg.evaluate("T.banner()") == "", "no chip/banner after a miss")
    pg.evaluate("T.go()"); pg.evaluate("T.right()"); pg.evaluate("T.go()"); pg.wait_for_timeout(2600)
    check(pg.evaluate("!!document.querySelector('.tm-best')") and not pg.evaluate("!!document.querySelector('.tm-perfect')"), "finish with a miss: best combo but no Perfect lesson")
    check("7 in a row" in pg.evaluate("(document.querySelector('.tm-best')||{}).textContent||''"), "best combo 7 on the finish card")
    pg.evaluate("document.querySelectorAll('.celebrate').forEach(x=>x.remove())")

    # --- second try never counts; order wrong then right ---
    pg.evaluate("T.lesson([...T.steps('order','js',1),...T.steps('quiz','js',1)])")
    pg.evaluate("T.wrong()"); pg.wait_for_timeout(60)
    pg.evaluate("document.querySelectorAll('#ans .ln').forEach(()=>{const x=document.querySelector('#ans .ln');x&&x.click()})")
    pg.evaluate("for(let k=0;k<cur.l.steps[0].lines.length;k++)document.querySelector(`#pool .ln[data-i=\"${k}\"]`).click();document.querySelector('#check').click()"); pg.wait_for_timeout(60)
    c = pg.evaluate("T.cmb()")
    check(c["n"] == 0 and c["m"] == 1 and c["d"] == [0], f"right on the 2nd try must not count: {c}")
    check(pg.evaluate("document.querySelectorAll('#ans .ln.tm-pop').length") > 0, "right order lines should pop")

    # --- Bug Lab: running the broken code first is not a miss ---
    bug = pg.evaluate("T.steps('bug',null,1).length")
    check(bug, "expected a Bug Lab step")
    if bug:
        pg.evaluate("T.lesson(T.steps('bug',null,1))")
        check(pg.evaluate("!!document.querySelector('#code-c')"), "Bug Lab step should have an editor")
        if True:
            pg.evaluate("T.wrong()"); pg.wait_for_timeout(60); c1 = pg.evaluate("T.cmb()")
            pg.evaluate("T.right()"); pg.wait_for_timeout(60); c2 = pg.evaluate("T.cmb()")
            check(c1["m"] == 0 and c2["n"] == 1, f"Bug Lab: broken run is not a miss, fix counts: {c1} {c2}")

    # --- Jr. sorter + quiz micro animation + perfect lesson bonus ---
    pg.evaluate("T.lesson([...T.steps('quiz','js',2),...T.steps('sort','jr',1)])")
    pg.evaluate("T.right()"); pg.wait_for_timeout(60)
    check(pg.evaluate("document.querySelector('.opt.right').classList.contains('tm-pop')"), "right quiz option should pop")
    pg.evaluate("T.go()"); pg.evaluate("T.right()"); pg.evaluate("T.go()"); pg.wait_for_timeout(60)
    pg.evaluate("T.right()"); pg.wait_for_timeout(60)
    c = pg.evaluate("T.cmb()")
    check(c["n"] == 3, f"Jr. sorter solved without a miss counts: {c}")
    ban0 = pg.evaluate("S.bananas"); earned = pg.evaluate("cur.earned.ban")
    pg.evaluate("T.go()"); pg.wait_for_timeout(300)
    check(pg.evaluate("!!document.querySelector('.tm-perfect')"), "no-miss lesson should show Perfect lesson!")
    got = pg.evaluate("S.bananas") - ban0
    check(got >= earned + 5, f"perfect lesson should add +5 bananas (earned {earned}, got {got})")
    pg.wait_for_timeout(2000); pg.evaluate("document.querySelectorAll('.celebrate').forEach(x=>x.remove())")

    # --- wrong quiz shakes ---
    pg.evaluate("T.lesson(T.steps('quiz','js',1))"); pg.evaluate("T.wrong()"); pg.wait_for_timeout(60)
    check(pg.evaluate("document.querySelector('.opt.wrong').classList.contains('tm-shake')"), "wrong quiz option should shake")

    # --- streak milestones ---
    pg.evaluate("S.streak=2;S.lastDay=dayStr(new Date(Date.now()-864e5));S.streakMs=null;msRec();save()")
    ban0 = pg.evaluate("S.bananas")
    pg.evaluate("T.lesson(T.steps('quiz','js',1))"); pg.evaluate("T.right()"); pg.evaluate("T.go()"); pg.wait_for_timeout(2000)
    check(pg.evaluate("S.streak") == 3, "streak should be 3")
    ms = pg.evaluate("(document.querySelector('.tm-ms')||{}).textContent||''")
    check("3 days in a row" in ms and "+10" in ms, f"3-day milestone screen, got {ms[:80]!r}")
    check(pg.evaluate("JSON.parse(localStorage.getItem(KEY)).streakMs.got.includes(3)"), "shown milestones are saved in S")
    pg.evaluate("document.querySelector('#msOk').click()"); pg.wait_for_timeout(400)
    check(not pg.evaluate("!!document.querySelector('.tm-ms')"), "Continue closes the milestone screen")
    pg.evaluate("T.lesson(T.steps('quiz','js',1))"); pg.evaluate("T.right()"); pg.evaluate("T.go()"); pg.wait_for_timeout(2000)
    check(not pg.evaluate("!!document.querySelector('.tm-ms')"), "milestone shows only once")
    pg.evaluate("document.querySelectorAll('.celebrate').forEach(x=>x.remove())")
    # a new streak run celebrates 3 again; jumping past several milestones only shows the top one
    pg.evaluate("S.streak=6;S.lastDay=dayStr(new Date(Date.now()-864e5));save()")
    r = pg.evaluate("(()=>{const b=S.bananas;bumpStreak();return [S.streak,S.bananas-b,JSON.stringify(S.streakMs.got)]})()")
    check(r[0] == 7 and r[1] == 25, f"new run reaching 7 days: +25 bananas once, got {r}")
    pg.wait_for_timeout(1900)
    check("7 days in a row" in pg.evaluate("(document.querySelector('.tm-ms')||{}).textContent||''"), "7-day milestone screen")
    pg.evaluate("document.querySelectorAll('.celebrate').forEach(x=>x.remove())")

    # --- Settings: Vibration row, still fits the phone ---
    pg.evaluate("settingsPage()"); pg.wait_for_timeout(200)
    check(pg.evaluate("!!document.querySelector('#haptics')"), "Settings should have a Vibration row")
    pg.evaluate("document.querySelector('#haptics [data-v=off]').click()")
    check(pg.evaluate("S.settings.haptics===false&&document.querySelector('#haptics [data-v=off]').getAttribute('aria-checked')==='true'"), "Vibration Off should stick")
    pg.evaluate("document.querySelector('#haptics [data-v=on]').click()")
    h = pg.evaluate("document.querySelector('.setfoot').getBoundingClientRect().bottom")
    check(h <= 844, f"Settings should fit on a 390x844 screen (bottom {h})")

    # --- old saves: existing streaks don't pop up; Calm mode banner still visible ---
    pg2 = ctx.new_page(); pg2.on("pageerror", lambda e: errors.append(str(e)))
    pg2.add_init_script("""try{const s=JSON.parse(localStorage.getItem('typemonkey-v1')||'{}');s.streak=8;s.lastDay=(d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate())(new Date());delete s.streakMs;s.settings=s.settings||{};s.settings.calm=true;localStorage.setItem('typemonkey-v1',JSON.stringify(s))}catch(e){}""")
    pg2.goto((ROOT / "index.html").as_uri()); pg2.wait_for_timeout(800); pg2.evaluate(HELP)
    check(pg2.evaluate("JSON.stringify(S.streakMs.got)") == "[3,7]", f"existing 8-day streak marks 3 and 7 as seen: {pg2.evaluate('JSON.stringify(S.streakMs)')}")
    pg2.evaluate("T.lesson(T.steps('quiz','js',3))")
    for i in range(3):
        pg2.evaluate("T.right()")
        if i < 2: pg2.evaluate("T.go()")
    pg2.wait_for_timeout(100)
    op = pg2.evaluate("getComputedStyle(document.querySelector('#tmCombo')).opacity")
    check(op == "1", f"Calm mode: combo banner should be visible without motion (opacity {op})")
    b.close()

for e in errors[:5]: fails.append("page error: " + e)
for f in fails: print("FAIL", f)
print(f"Delight: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
