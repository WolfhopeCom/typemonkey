#!/usr/bin/env python3
"""Phone layout check: nothing may stick out past the screen or out of its own box.

Opens every step of every lesson at iPhone width (390px, touch, so tap tiles show), places all the
tiles, and also checks the Terms and Privacy pages. Flags text that runs past the screen edge
(inline code, tiles, long links) or past its own button/tile. Scrollable areas are allowed.

Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_layout.py [course-or-lesson-id]
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
ONLY = sys.argv[1] if len(sys.argv) > 1 else None
CHECK = r"""() => {
  const W = innerWidth, bad = [];
  if (document.documentElement.scrollWidth > W + 1) bad.push({k: 'page', w: document.documentElement.scrollWidth});
  const clipAnc = el => { for (let a = el.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== 'visible') return a } return null };
  for (const el of document.querySelectorAll('#screen *')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.position === 'fixed') continue;
    if (el.closest('.confetti,.burst,.mfx,.mframe,.fin-stage,.stage')) continue;  // decorations that are clipped on purpose
    if (!el.children.length && el.scrollWidth > el.clientWidth + 2 && cs.overflowX === 'visible' && el.clientWidth > 0 && !['PRE','CODE','TEXTAREA','svg','path'].includes(el.tagName))
      bad.push({k: 'text', tag: el.tagName, txt: (el.textContent || '').slice(0, 50)});
    const a = clipAnc(el);
    if (a && ['auto', 'scroll'].includes(getComputedStyle(a).overflowX)) continue;
    const lim = a ? a.getBoundingClientRect() : {left: 0, right: W};
    if (r.right > lim.right + 2 || r.left < lim.left - 2) bad.push({k: 'edge', tag: el.tagName, txt: (el.textContent || '').slice(0, 50), right: Math.round(r.right), lim: Math.round(lim.right)});
  }
  return bad.slice(0, 4);
}"""
PLACE = """()=>{for(let k=0;k<20;k++){const t=document.querySelector('.ttray .tile:not([disabled])');if(!t)break;t.click()}}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True).new_page()
    errors = []; pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto((ROOT / "index.html").as_uri()); pg.wait_for_timeout(800)
    pg.evaluate("S.pro=true;for(const b of badgeList())S.badges[b.id]=1;save()")
    problems, steps = [], 0
    for kind in ("terms", "privacy"):
        pg.evaluate(f"legalPage('{kind}')"); bad = pg.evaluate(CHECK)
        if bad: problems.append(f"{kind} page: {json.dumps(bad)}")
    lessons = pg.evaluate("""()=>{const r=[];for(const c of COURSES){if(!c.units)continue;for(const u of c.units)for(const l of u.lessons)if(l.steps)r.push([c.id,l.id,l.steps.length])}return r}""")
    if ONLY: lessons = [x for x in lessons if ONLY in (x[0], x[1])]
    for cid, lid, n in lessons:
        for i in range(n):
            pg.evaluate(f"startLesson('{lid}');cur.step={i};renderStep()"); pg.evaluate(PLACE); steps += 1
            bad = pg.evaluate(CHECK)
            if bad: problems.append(f"{lid} step {i} ({pg.evaluate('cur.l.steps[cur.step].type')}): {json.dumps(bad)[:300]}")
    b.close()
for x in problems: print(x)
for e in errors[:5]: print("page error:", e)
print(f"Layout: {steps} lesson steps + 2 legal pages at 390px. {len(problems) + len(errors)} problem(s)")
sys.exit(1 if problems or errors else 0)
