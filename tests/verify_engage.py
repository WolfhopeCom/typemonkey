#!/usr/bin/env python3
"""v1.1 engagement features: Banana Freezes (70-streak), the review prompt (75-review), syntax colors and the
wrong-tile wiggle (80-syntax), naming the monkey (90-name), canvas confetti.
Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_engage.py
"""
import datetime, json, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
fails = []
def ok(c, m):
    if not c: fails.append(m)
def ds(n):
    d = datetime.date.today() - datetime.timedelta(days=n); return f"{d.year}-{d.month}-{d.day}"
FAKE = "window.__asks=0;window.Capacitor={isNativePlatform:()=>true,Plugins:{TMCloud:{requestReview:async()=>{__asks++}," \
       "localGet:async()=>({}),localSet:async()=>{},available:async()=>({available:false}),get:async()=>({}),set:async()=>{},addListener(){}}}};"
with sync_playwright() as p:
    b = p.chromium.launch()
    def page(st, native=False, w=390):
        c = b.new_context(viewport={"width": w, "height": 844}, is_mobile=True, has_touch=True)
        if native: c.add_init_script(FAKE)
        c.add_init_script(f"localStorage.setItem('typemonkey-v1', {json.dumps(json.dumps(st))})")
        pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(700); return pg, errs
    base = {"onboarded": True, "xp": 500, "done": ["js1"]}
    # --- freezes
    pg, errs = page({**base, "streak": 12, "lastDay": ds(2), "freezes": 1})
    st = pg.evaluate("({s:S.streak,l:S.lastDay,f:S.freezes,fz:S.frozen})")
    ok(st["s"] == 12 and st["l"] == ds(1) and st["f"] == 0 and st["fz"] == [ds(1)], f"one missed day + 1 freeze: {st}")
    ok(pg.evaluate("S.freezeNote&&S.freezeNote.used===1"), "freeze notice not queued")
    ok("🧊 0" in pg.inner_text("#todayCard"), "Today card should show the freeze count")
    pg, errs = page({**base, "streak": 12, "lastDay": ds(3), "freezes": 2})
    ok(pg.evaluate("S.streak===12&&S.freezes===0&&S.frozen.length===2"), f"two missed days + 2 freezes: {pg.evaluate('[S.streak,S.freezes,S.frozen]')}")
    pg, errs = page({**base, "streak": 12, "lastDay": ds(4), "freezes": 2})
    ok(pg.evaluate("S.freezes===2&&S.lostStreak&&S.lostStreak.n===12"), "three missed days: freezes must not be wasted, streak counts as lost")
    pg.evaluate("startLesson('js2');finish()"); ok(pg.evaluate("S.streak") == 1, "after a lost streak the next lesson starts at 1")
    pg, errs = page({**base, "streak": 5, "lastDay": ds(1)})
    ok(pg.evaluate("S.freezes") == 1, "everyone starts with 1 freeze")
    pg.evaluate("S.bananas=200;save();shop()")
    ok(pg.locator("#fzcard").count() == 1, "shop: freeze card missing")
    before = pg.evaluate("S.bananas"); pg.evaluate("$('#fzbuy').click()")
    ok(pg.evaluate("S.freezes") == 2 and pg.evaluate("S.bananas") == before - 60, f"buying a freeze: {pg.evaluate('[S.freezes,S.bananas]')} (had {before})")
    ok(pg.is_disabled("#fzbuy"), "shop: can't hold more than 2 freezes")
    # --- daily streak card after the first lesson of the day
    pg.evaluate("startLesson('js2');finish()"); pg.wait_for_timeout(2300)
    ok(pg.evaluate("S.streak") == 6, "lesson should extend the streak")
    ok(pg.locator(".tm-day").count() == 1 or pg.locator(".celebrate").count() >= 1, "daily streak celebration missing")
    ok(not errs, f"page errors: {errs[:3]}")
    # --- review prompt (fake native plugin)
    pg, errs = page({"onboarded": True, "xp": 300, "done": ["js1", "js2", "js3", "js4"]}, native=True)
    def settle(ms=12000):
        for _ in range(ms // 1500):
            pg.wait_for_timeout(1500); pg.evaluate("document.querySelectorAll('.celebrate').forEach(x=>x.remove())")
    pg.evaluate("startLesson('js5');finish()"); settle()
    ok(pg.evaluate("__asks") == 1, f"review prompt after the 5th lesson: {pg.evaluate('__asks')}")
    pg.evaluate("S.done=S.done.concat(['py2','py3','py4','py5','py6','py7','py8','py9','sql1']);startLesson('py1');finish()"); settle()
    ok(pg.evaluate("S.done.length") == 15, f"setup: {pg.evaluate('S.done.length')} lessons")
    ok(pg.evaluate("__asks") == 1, "review prompt must wait 3 weeks between asks")
    pg, errs = page({"onboarded": True, "xp": 300, "done": ["jr1", "jr2", "jr3", "jr4"]}, native=True)
    pg.evaluate("startLesson('jr5');finish()"); pg.wait_for_timeout(4500)
    ok(pg.evaluate("__asks") == 0, "never ask in TypeMonkey Jr.")
    # --- syntax colors + wrong tile
    pg, errs = page({**base, "profile": {"level": "code"}})
    pg.evaluate("startLesson('js1');cur.step=cur.l.steps.findIndex(s=>s.type==='code');renderStep()"); pg.wait_for_timeout(300)
    ok(pg.locator("#ttray .tile .sy-k").count() >= 1 and pg.locator("#ttray .tile .sy-s").count() >= 1, "tiles should be syntax colored")
    want = pg.evaluate("TILE_PLAN.pieces.map(x=>x.trim())")
    for w in reversed(want): pg.locator("#ttray .tile", has_text=w).first.click(force=True)
    ok(pg.evaluate("tileCode(TILE_PLAN,[1,0])") is not None, "")
    pg.evaluate("$('#trun')&&!$('#trun').hidden?$('#trun').click():$('#run-c').click()"); pg.wait_for_timeout(900)
    ok(pg.locator("#fb .feedback.bad").count() == 1, "reversed lines should not pass")
    ok(pg.locator("#tbuild .tile.tilewrong").count() == 1, "the out-of-place tile should wiggle")
    ok(pg.evaluate("[...document.querySelectorAll('#tbuild .tile.on')].map(t=>t.textContent.trim())") == list(reversed(want)), "coloring must not change tile text")
    ok(not errs, f"page errors: {errs[:3]}")
    # --- name + confetti
    pg, errs = page(base)
    pg.evaluate("profilePage()"); pg.evaluate("$('#nmTag').click();$('#nmIn').value='Bongo<b>';$('#nmOk').click()")
    ok(pg.evaluate("S.monkeyName") == "Bongob", f"name saved and cleaned: {pg.evaluate('S.monkeyName')!r}")
    pg.evaluate("home()"); ok("Bongob · " in pg.inner_text("#lvcard"), "name should show on the level card")
    pg.evaluate("confetti(50)"); pg.wait_for_timeout(100)
    ok(pg.evaluate("document.querySelector('canvas.confetti')!==null&&document.querySelectorAll('.confetti i').length===0"), "confetti should be one canvas")
    pg.wait_for_timeout(6200); ok(pg.locator("canvas.confetti").count() == 0, "confetti canvas should clean itself up")
    ok(not errs, f"page errors: {errs[:3]}")
    b.close()
for x in fails: print("FAIL:", x)
print(f"Engagement features: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
