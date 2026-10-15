#!/usr/bin/env python3
"""Beginner helpers (src/features/50-beginner.*): tap-a-word meanings and the tap coach.

Checks: coding words in lesson text become tappable and open a plain-English popup; the coach points at the
right fill-in piece, at a wrong piece to take back, then Check and Continue; it points at the right tile in
order and then Run; it shows only the first few times; it is off for people who already code; no page errors.

Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_beginner.py
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
fails = []
def ok(c, m):
    if not c: fails.append(m)
GLOW = "(document.querySelector('.coach-glow')||{}).textContent||''"

with sync_playwright() as p:
    b = p.chromium.launch()
    def page(state):
        ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
        ctx.add_init_script(f"localStorage.setItem('typemonkey-v1', {json.dumps(json.dumps(state))})")
        pg = ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(500); return pg, errs
    pg, errs = page({"onboarded": True, "profile": {"level": "new"}})
    pg.evaluate("startLesson('js1')"); pg.wait_for_timeout(300)
    ok(pg.locator(".gloss-tip").count() == 1, "first lesson: 'tap a word' tip missing")
    pg.click("#go"); pg.wait_for_timeout(300)
    terms = pg.evaluate("[...document.querySelectorAll('#screen .term')].map(e=>e.dataset.term)")
    ok("console.log" in terms and "console" in terms, f"demo step terms: {terms}")
    pg.click(".term[data-term='console']"); pg.wait_for_timeout(100)
    ok(pg.is_visible("#glossPop") and "box under your code" in pg.inner_text("#glossPop"), "word popup did not open")
    r = pg.evaluate("(()=>{const p=document.querySelector('#glossPop').getBoundingClientRect();return p.left>=0&&p.right<=innerWidth})()")
    ok(r, "word popup goes off screen")
    pg.click(".gloss-pop .x"); ok(pg.locator("#glossPop").count() == 0, "word popup did not close")
    pg.wait_for_timeout(200); ok(pg.evaluate("document.querySelector('.coach-glow')&&document.querySelector('.coach-glow').id") == "trund", "demo: coach should point at Run the example")
    pg.click("#trund"); pg.wait_for_timeout(300); ok(pg.evaluate("document.querySelector('.coach-glow').id") == "go", "demo: after Run, coach should point at Continue")
    # quiz, then fill
    pg.click("#go"); pg.wait_for_timeout(200); pg.click(".opt[data-i='0']"); pg.click("#go"); pg.wait_for_timeout(300)
    ok(pg.evaluate(GLOW).strip() == "console.log", f"fill: coach should point at console.log, got {pg.evaluate(GLOW)!r}")
    pg.click(".token:text-is('hello')"); pg.wait_for_timeout(200)
    ok(pg.evaluate("document.querySelector('.coach-glow').classList.contains('slot')"), "fill: wrong piece should be pointed at to take back")
    ok("take it back" in pg.inner_text(".todo"), "fill: take-back message missing")
    pg.click(".slot"); pg.wait_for_timeout(200); pg.click(".token:text-is('console.log')"); pg.wait_for_timeout(200)
    ok(pg.evaluate("document.querySelector('.coach-glow').id") == "check", "fill: coach should point at Check")
    pg.click("#check"); pg.wait_for_timeout(200); ok(pg.evaluate("document.querySelector('.coach-glow').id") == "go", "fill: coach should point at Continue")
    # tiles
    pg.evaluate("cur.step=cur.l.steps.findIndex(s=>s.type==='code');renderStep()"); pg.wait_for_timeout(300)
    want = pg.evaluate("TILE_PLAN.pieces.map(x=>x.trim())")
    for w in want:
        g = pg.evaluate(GLOW).strip(); ok(g == w, f"tiles: coach pointed at {g!r}, wanted {w!r}")
        pg.locator("#ttray .tile", has_text=w).first.click(force=True); pg.wait_for_timeout(150)
    ok(pg.evaluate("['trun','run-c'].includes(document.querySelector('.coach-glow').id)"), "tiles: coach should point at Run")
    ok(pg.evaluate("S.coach.demo===1&&S.coach.fill===1&&S.coach.tiles===1"), f"coach counts {pg.evaluate('S.coach')}")
    ok(not errs, f"page errors: {errs[:3]}")
    # shown only a few times, and never for people who already code
    pg, errs = page({"onboarded": True, "coach": {"fill": 3, "demo": 3, "tiles": 3}})
    pg.evaluate("startLesson('js1');cur.step=3;renderStep()"); pg.wait_for_timeout(200)
    ok(pg.locator(".coach-hand").count() == 0, "coach should stop after 3 times")
    pg, errs = page({"onboarded": True, "profile": {"level": "code"}})
    pg.evaluate("startLesson('js1');cur.step=3;renderStep()"); pg.wait_for_timeout(200)
    ok(pg.locator(".coach-hand").count() == 0, "coach should be off for people who already code")
    pg.evaluate("cur.step=1;renderStep()"); pg.wait_for_timeout(100)
    ok(pg.locator("#screen .term").count() > 0, "word meanings should still work for everyone")
    pg.evaluate("home()"); pg.wait_for_timeout(100); ok(pg.locator(".coach-hand").count() == 0, "coach hand left behind on Home")
    ok(not errs, f"page errors: {errs[:3]}")
    b.close()
for x in fails: print("FAIL:", x)
print(f"Beginner helpers: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
