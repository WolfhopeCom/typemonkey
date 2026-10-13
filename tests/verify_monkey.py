#!/usr/bin/env python3
"""TypeMonkey grows with you: level math, top-bar level chip, level-up celebration (once per level, waits for
badges, gifts), the Profile page (opened from the top-bar mascot), mascot polish (blink group, curious think face,
tap hop off in Calm mode) and phone layout of the profile at 390px and 375px, light and dark.

Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_monkey.py
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
KEY = "typemonkey-v1"
fails = []
def ok(cond, msg):
    if not cond: fails.append(msg)

OVERFLOW = r"""() => {const W=innerWidth,bad=[];if(document.documentElement.scrollWidth>W+1)bad.push('page '+document.documentElement.scrollWidth);
  for(const el of document.querySelectorAll('#screen *')){const r=el.getBoundingClientRect();if(!r.width)continue;
    let a=el.parentElement,clip=null;for(;a;a=a.parentElement){const o=getComputedStyle(a).overflowX;if(o!=='visible'){clip=a;break}}
    if(clip&&['auto','scroll','hidden'].includes(getComputedStyle(clip).overflowX))continue;
    if(r.right>W+1||r.left<-1)bad.push(el.className+':'+Math.round(r.right))}
  return bad.slice(0,5)}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    def page(w=390, h=844, scheme="light", state=None):
        ctx = b.new_context(viewport={"width": w, "height": h}, color_scheme=scheme, has_touch=True, is_mobile=True)
        state = {"onboarded": True, **(state or {})}
        if state is not None:
            ctx.add_init_script(f"localStorage.setItem({json.dumps(KEY)}, {json.dumps(json.dumps(state))})")
        pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(700)
        return pg, errs

    # 1. level math
    pg, errs = page()
    m = pg.evaluate("""()=>({n2:TMLevel.need(2),n3:TMLevel.need(3),t:TMLevel.TITLES.length,l0:TMLevel.info(0).lvl,l49:TMLevel.info(49).lvl,l50:TMLevel.info(50).lvl,
      top:TMLevel.info(9570).lvl,big:TMLevel.info(1e7),t5:TMLevel.info(320).title})""")
    ok(m["n2"] == 50 and m["n3"] == 120, f"curve: {m}")
    ok(m["t"] == 30 and m["t5"] == "Bug Squasher", f"titles: {m}")
    ok(m["l0"] == 1 and m["l49"] == 1 and m["l50"] == 2 and m["top"] == 30, f"levels: {m}")
    ok(m["big"]["lvl"] == 30 and m["big"]["max"] and m["big"]["pct"] == 100, f"max level: {m['big']}")
    ok(pg.inner_text("#brandMonkey .tm-lvl") == "1", "top-bar level chip missing on a fresh start")
    ok(pg.locator("#lvcard").count() == 1, "home level card missing")

    # 2. mascot polish
    f = pg.evaluate("""()=>{const t=monkey('think'),h=monkey('happy');return {eyes:h.includes('tm-eyes'),brow:t.includes('tm-brow'),
      oldMouth:t.includes('M52 79 Q60 77 69 80'),sunEyes:monkey('happy',{...DEFAULT_LOOK,eyes:'sun'}).includes('tm-eyes')}}""")
    ok(f["eyes"], "blink group missing from monkey()")
    ok(f["brow"] and not f["oldMouth"], "think face is not the curious version")
    ok(not f["sunEyes"], "blink group should not exist when eyes are hidden by sunglasses")
    anim = pg.evaluate("getComputedStyle(document.querySelector('.buddy .tm .tm-eyes')).animationName")
    ok(anim == "tmBlink", f"eyes do not blink ({anim})")
    pg.click(".buddy .tm", force=True); ok(pg.evaluate("document.querySelector('.buddy .tm').classList.contains('tm-hop')"), "no hop on tap")
    pg.evaluate("S.settings.calm=true;save();applySettings();home()"); pg.click(".buddy .tm", force=True)
    ok(not pg.evaluate("document.querySelector('.buddy .tm').classList.contains('tm-hop')"), "hop should be off in Calm mode")
    ok(pg.evaluate("getComputedStyle(document.querySelector('.buddy .tm .tm-eyes')).animationName") == "none", "blink should be off in Calm mode")
    pg.evaluate("S.settings.calm=false;save();applySettings();home()")

    # 3. level up: celebrated once, gifts + bananas, then queued badges still show
    pg.evaluate("S.xp=40;S.bananas=0;save()"); pg.wait_for_timeout(1900)
    ok(pg.locator(".lvlup").count() == 0, "level-up shown without a level change")
    pg.evaluate("S.xp=330;save()"); pg.wait_for_timeout(2200)
    ok(pg.locator(".celebrate.lvlup").count() == 1, "no level-up celebration after reaching level 5")
    ok("Level 5" in pg.inner_text(".lvlup") and "Bug Squasher" in pg.inner_text(".lvlup"), "level-up text wrong")
    st = pg.evaluate("({m:S.mlevel,ban:S.bananas,hat:S.owned.hat.includes('party'),neck:S.owned.neck.includes('bowtie')})")
    ok(st["m"] == 5 and st["hat"] and st["neck"], f"level rewards not granted: {st}")
    ok(st["ban"] >= 4 * 10, f"level bananas missing: {st}")
    ok(pg.inner_text("#brandMonkey .tm-lvl") == "5", "chip did not update")
    # a badge earned while the level-up is open waits its turn
    pg.evaluate("delete S.badges.first_lesson;S.stats.lessons=1;save()"); pg.wait_for_timeout(300)
    ok(pg.locator(".celebrate").count() == 1, "badge overlay stacked on top of the level-up")
    pg.click("#lv-wear"); pg.wait_for_timeout(300)
    ok(pg.evaluate("S.look.neck") == "bowtie", "Wear it did not dress TypeMonkey")
    ok(pg.locator(".celebrate:not(.lvlup)").count() == 1, "badge overlay did not follow the level-up")
    pg.click("#cel-ok")
    pg.evaluate("save();save()"); pg.wait_for_timeout(2000)
    ok(pg.locator(".lvlup").count() == 0, "level-up shown twice for the same level")
    ok(not errs, f"page errors: {errs[:3]}")

    # 4. existing players: no surprise celebration on first load with lots of XP; best streak tracked
    pg, errs = page(state={"xp": 5000, "streak": 6, "bananas": 10, "done": [], "badges": {}, "stats": {}})
    pg.wait_for_timeout(2500)
    ok(pg.locator(".lvlup").count() == 0, "level-up popped on first load for an existing player")
    lv = pg.evaluate("TMLevel.info(5000).lvl")
    ok(pg.evaluate("S.mlevel") == lv, "mlevel not initialised silently")
    pg.evaluate("save();S.streak=2;save()")
    ok(pg.evaluate("S.bestStreak") == 6, "best streak not tracked")
    ok(not errs, f"page errors: {errs[:3]}")

    # 5. profile: opened from the top-bar mascot, works with and without S.xpDays, back returns
    pg.click("#brandMonkey", force=True); pg.wait_for_timeout(300)
    ok(pg.locator(".prof").count() == 1, "tapping the top-bar mascot did not open the profile")
    txt = pg.inner_text("#screen").lower()
    for want in ("Total XP", "Day streak", "Best streak", "Lessons done", "Bananas", "Badges", "Your courses", "Level rewards"):
        ok(want.lower() in txt, f"profile missing '{want}'")
    ok(pg.locator(".prof-week").count() == 0, "week chart should hide without S.xpDays")
    pg.evaluate("S.xpDays={[dayStr(new Date())]:42};profilePage()")
    ok(pg.locator(".pw-col").count() == 7 and "42" in pg.inner_text(".prof-week"), "week chart wrong")
    pg.click("#back"); pg.wait_for_timeout(200)
    ok(pg.locator("#lvcard").count() == 1, "profile Back did not return home")
    pg.click("#lvcard"); ok(pg.locator(".prof").count() == 1, "home level card does not open the profile")
    pg.click("#pshop"); ok(pg.locator(".shopgrid .shopitem").count() > 3, "shop broke")
    ok(not errs, f"page errors: {errs[:3]}")

    # 6. layout at phone sizes, light and dark
    for w, h in ((390, 844), (375, 667)):
        for scheme in ("light", "dark"):
            pg, errs = page(w, h, scheme)
            pg.evaluate("""S.xp=2345;S.streak=12;S.bestStreak=30;S.bananas=12345;S.done=['js1'];S.lastCourse='js';
              S.xpDays={};for(let i=0;i<7;i++){const t=new Date();t.setDate(t.getDate()-i);S.xpDays[dayStr(t)]=i*37}save();profilePage()""")
            bad = pg.evaluate(OVERFLOW); ok(not bad, f"profile overflow {w}px {scheme}: {bad}")
            pg.evaluate("home()"); bad = pg.evaluate(OVERFLOW); ok(not bad, f"home overflow {w}px {scheme}: {bad}")
            tb = pg.evaluate("document.querySelector('.topbar').scrollWidth<=innerWidth")
            ok(tb, f"top bar overflows at {w}px")
            ok(not errs, f"page errors {w} {scheme}: {errs[:3]}")
    b.close()

for x in fails: print("FAIL:", x)
print(f"Monkey levels + profile: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
