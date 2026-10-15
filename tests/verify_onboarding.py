#!/usr/bin/env python3
"""First-run onboarding, daily XP goal ring and streak week strip (src/features/10-onboarding.*).

Checks: a brand-new user gets the onboarding (and the recommended course follows the answers), finishing it
saves the profile + goal and starts the first lesson of the chosen course; Skip works; existing users never
see it; XP is counted per day (and a state swap is not counted); the goal ring math; the Mon-Sun week strip;
the Settings goal row; no page errors; no sideways overflow at 375px.

Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_onboarding.py
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
fails = []
def check(ok, msg):
    if not ok: fails.append(msg)
OVER = "()=>document.documentElement.scrollWidth-innerWidth"

with sync_playwright() as p:
    b = p.chromium.launch()
    errors = []
    def page(state=None, w=375, h=667):
        ctx = b.new_context(viewport={"width": w, "height": h}, has_touch=True, is_mobile=True)
        if state is not None:
            ctx.add_init_script(f"localStorage.setItem('typemonkey-v1', {json.dumps(json.dumps(state))})")
        pg = ctx.new_page(); pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(600)
        return pg

    # 1. Brand-new user: full flow
    pg = page()
    check(pg.is_visible("#onb"), "fresh user: onboarding not shown")
    check(not pg.is_visible(".topbar"), "onboarding: top bar should be hidden")
    def step(name):
        o = pg.evaluate(OVER); check(o <= 1, f"onboarding {name}: page is {o}px too wide at 375px")
        small = pg.evaluate("""()=>[...document.querySelectorAll('.onb-opt,.onb-lang,#onbGo,#onbSkip,#onbBack')].filter(e=>{const r=e.getBoundingClientRect();return r.height<44||r.width<44}).map(e=>e.id||e.className)""")
        check(not small, f"onboarding {name}: tap targets under 44px: {small}")
    step("welcome"); pg.click("#onbGo")
    check(pg.is_disabled("#onbGo"), "why: Continue should wait for an answer")
    step("why"); pg.click("[data-v=kid]"); pg.click("#onbGo")
    step("level"); check(pg.inner_text("#onbGo").strip() == "Done!", "last question should say Done!")
    pg.click("[data-v=new]"); pg.click("#onbGo"); pg.wait_for_timeout(300)
    st = pg.evaluate("({onb:!!document.querySelector('#onb'),home:!!document.querySelector('#todayCard'),lc:S.lastCourse,p:S.profile,on:S.onboarded,lesson:!!document.querySelector('#quit')})")
    check(not st["onb"] and st["home"] and not st["lesson"], f"kid: two questions should land on Home, not a lesson ({st})")
    check(st["lc"] == "jr" and st["p"]["firstCourse"] == "jr", f"kid: TypeMonkey Jr. should be the Continue course ({st})")
    def answers(why, lvl):
        q = page(); q.click("#onbGo"); q.click(f"[data-v={why}]"); q.click("#onbGo"); q.click(f"[data-v={lvl}]"); q.click("#onbGo"); q.wait_for_timeout(200)
        return q, q.evaluate("S.lastCourse")
    _, lc = answers("fun", "new"); check(lc == "js", f"fun + brand new: recommended should be JavaScript, got {lc}")
    pg, lc = answers("school", "new"); check(lc == "py", f"school: recommended should be Python, got {lc}")
    st = pg.evaluate("({on:S.onboarded,p:S.profile,g:S.settings.goal,saved:JSON.parse(localStorage.getItem('typemonkey-v1')).onboarded,cont:(document.querySelector('.continue')||{}).innerText||''})")
    check(st["on"] and st["saved"], "finish: S.onboarded not saved")
    check(st["p"] == {"why": "school", "level": "new", "firstCourse": "py"}, f"finish: profile {st['p']}")
    check(st["g"] in (None, 20) or st["g"] == 20, f"finish: default goal {st['g']}")
    check("PYTHON" in st["cont"].upper(), f"Home Continue card should be Python: {st['cont'][:80]!r}")
    pg.evaluate("home()")
    check("Python" in (pg.text_content("#cont") or ""), "home: Continue should point at Python")
    check(pg.is_visible("#todayCard"), "home: Today card missing")
    o = pg.evaluate(OVER); check(o <= 1, f"home: {o}px too wide at 375px")

    # 2. XP per day + goal ring math
    C = pg.evaluate("RING_C")
    pg.evaluate("S.settings.goal=20;S.xpDays={};S.goalHit=null;S.goalCheered=null;save();for(const b of badgeList())S.badges[b.id]=1")
    pg.evaluate("S.xp+=5;save();home()")
    check(pg.evaluate("xpToday()") == 5, "xpDays: 5 XP not counted for today")
    to = float(pg.get_attribute("#todayCard .bar", "data-to"))
    check(abs(to - C * 0.75) < 0.05, f"ring: 5/20 should leave 75% of the ring empty (got {to} of {C})")
    check("5" in pg.text_content(".rin") and "20" in pg.text_content(".rin"), "ring: label should read 5 of 20")
    check(not pg.evaluate("document.querySelector('#todayCard').classList.contains('done')"), "ring: not done at 5/20")
    pg.evaluate("S.xp+=40;save();home()"); pg.wait_for_timeout(200)
    check(pg.evaluate("xpToday()") == 45, "xpDays: should add up to 45")
    check(pg.evaluate("S.goalHit===dayStr(new Date())"), "goal crossing not recorded")
    check(pg.evaluate("document.querySelector('#todayCard').classList.contains('done')"), "ring: done state at 45/20")
    check(float(pg.get_attribute("#todayCard .bar", "data-to")) < 0.01, "ring: should be full past the goal")
    pg.wait_for_timeout(1300)
    check(pg.evaluate("S.goalCheered===dayStr(new Date())"), "goal celebration did not run")
    check("goal" in (pg.text_content("#toast") or "").lower(), "goal celebration toast missing")
    pg.evaluate("S={...S,xp:S.xp+500};save()")   # a restored backup / cloud merge is a new state object: not today's XP
    check(pg.evaluate("xpToday()") == 45, "a state swap must not count as XP earned today")
    pg.evaluate("S.xpDays['2000-1-1']=9;S.xp+=1;save()")
    check(pg.evaluate("!('2000-1-1' in S.xpDays)"), "xpDays: old days should be pruned")

    # 3. Week strip
    pg.evaluate("const d=new Date();S.xpDays={};S.xpDays[dayStr(d)]=12;S.lastDay=dayStr(d);S.streak=1;save();home()")
    wk = pg.evaluate("""()=>[...document.querySelectorAll('#todayCard .wd')].map(e=>({n:e.querySelector('small').textContent,on:e.classList.contains('on'),now:e.classList.contains('now'),fut:e.classList.contains('fut')}))""")
    dow = pg.evaluate("(new Date().getDay()+6)%7")
    check([x["n"] for x in wk] == list("MTWTFSS"), f"week: labels {[x['n'] for x in wk]}")
    check([i for i, x in enumerate(wk) if x["now"]] == [dow], "week: today should be highlighted once")
    check(wk[dow]["on"] and sum(x["on"] for x in wk) == 1, "week: only today practiced")
    check(all(x["fut"] == (i > dow) for i, x in enumerate(wk)), "week: future days marked wrong")
    check("1-day streak" in pg.text_content("#todayCard"), "week: streak number missing")
    pg.evaluate("S.lastDay=dayStr(new Date(Date.now()-3*864e5));S.streak=5;home()")
    check("Start" in pg.text_content("#todayCard .thead b"), "week: a broken streak should not show as live")

    # 4. Settings goal row + goal sheet
    pg.evaluate("settingsPage()"); pg.click("#goalSeg [data-v='50']")
    check(pg.evaluate("S.settings.goal") == 50, "settings: goal not changed")
    check(pg.get_attribute("#goalSeg [data-v='50']", "aria-checked") == "true", "settings: goal row not re-rendered")
    o = pg.evaluate(OVER); check(o <= 1, f"settings: {o}px too wide at 375px")
    pg.evaluate("home()"); pg.click("#todayCard"); pg.click(".onb-sheet [data-g='10']")
    check(pg.evaluate("S.settings.goal") == 10 and not pg.is_visible(".onb-sheet"), "goal sheet: pick 10 failed")

    # 5. Reload: onboarded user goes straight home
    pg.reload(); pg.wait_for_timeout(600)
    check(not pg.is_visible("#onb") and pg.is_visible("#todayCard"), "reload: onboarded user should land on Home")

    # 6. Skip
    pg = page()
    pg.click("#onbGo"); pg.click("#onbSkip")
    check(pg.evaluate("S.onboarded===true") and pg.is_visible("#todayCard"), "skip: should go Home and remember")
    pg.reload(); pg.wait_for_timeout(600)
    check(not pg.is_visible("#onb"), "skip: onboarding came back after reload")

    # 7. Existing user from v1.0 (no onboarded flag) never sees it; Continue stays above the fold at 390x844
    old = {"xp": 140, "bananas": 30, "streak": 2, "lastDay": None, "done": ["js1"], "progress": {}, "settings": {"theme": "system"}}
    pg = page(old, 390, 844)
    check(not pg.is_visible("#onb") and pg.is_visible("#todayCard"), "existing user: should not see onboarding")
    check(pg.evaluate("xpToday()") == 0, "existing user: old XP must not count as today's XP")
    box = pg.evaluate("(()=>{const r=document.querySelector('#cont').getBoundingClientRect();return r.bottom})()")
    check(box <= 844, f"home: Continue button below the fold ({box}px)")
    pg = page({**old, "settings": {"theme": "dark"}}, 375, 667)
    o = pg.evaluate(OVER); check(o <= 1, f"home dark: {o}px too wide at 375px")
    b.close()

for e in errors[:5]: fails.append("page error: " + e)
for f in fails: print("FAIL", f)
print(f"Onboarding + daily goal + week strip: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
