#!/usr/bin/env python3
"""Course map v2 check (src/features/30-map.js|css).

Renders every course page at 375px (light and dark), with no progress, some progress and everything done, and checks:
  - no page errors, nothing sticks out past the screen (no horizontal scroll)
  - every unit has a banner; every path unit has a dotted trail and a treasure chest after its last lesson
  - chests: locked until the unit is done, Pro units stay locked, a ready chest opens once and pays once
  - the little TypeMonkey still sits by the next lesson (and hops there after a lesson), START tag still there
  - tapping a lesson circle still starts that lesson; Build Projects keeps its list (no chests, no trail)

Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_map.py
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
problems = []
def check(ok, msg):
    if not ok: problems.append(msg)

EDGE = r"""() => { const W = innerWidth, bad = [];
  if (document.documentElement.scrollWidth > W + 1) bad.push('page scrolls sideways: ' + document.documentElement.scrollWidth);
  for (const el of document.querySelectorAll('#screen *')) { const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (el.closest('svg')) continue;
    if (r.right > W + 2 || r.left < -2) bad.push(el.tagName + '.' + el.className + ' ' + Math.round(r.left) + '..' + Math.round(r.right)) }
  return bad.slice(0, 3) }"""

SHAPE = r"""(cid) => { const c = courseById(cid), units = [...document.querySelectorAll('#screen .unit')], R = [];
  if (units.length !== c.units.length) R.push('unit count');
  units.forEach((u, ui) => {
    if (!u.querySelector('.unit-head.ubanner .ub-ring')) R.push('unit ' + ui + ' has no banner');
    const p = u.querySelector(':scope > .path');
    if (c.pickAny) { if (p || u.querySelector('.chest')) R.push('projects list changed'); return }
    if (!p) { R.push('unit ' + ui + ' no path'); return }
    const nodes = p.querySelectorAll(':scope > .pnode'), last = nodes[nodes.length - 1];
    if (!last || !last.classList.contains('chest')) R.push('unit ' + ui + ' chest is not last');
    const segs = p.querySelectorAll('svg.trail path').length;
    if (segs !== nodes.length - 1) R.push('unit ' + ui + ' trail segments ' + segs + ' for ' + nodes.length + ' nodes');
    for (const b of p.querySelectorAll('.pbtn')) { const r = b.getBoundingClientRect(); if (r.width < 44 || r.height < 44) R.push('small tap target in unit ' + ui) }
  });
  return R }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    errors = []
    for theme in ("light", "dark"):
        ctx = b.new_context(viewport={"width": 375, "height": 667}, has_touch=True, is_mobile=True, color_scheme=theme)
        pg = ctx.new_page(); pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto((ROOT / "index.html").as_uri()); pg.wait_for_timeout(600)
        pg.evaluate("for(const b of badgeList())S.badges[b.id]=1;S.settings.sound=false;save()")
        cids = pg.evaluate("COURSES.filter(c=>c.units).map(c=>c.id)")
        for pro in (False, True):
            for fill in ("none", "some", "all"):
                for cid in cids:
                    pg.evaluate(f"""S.pro={'true' if pro else 'false'};S.chests={{}};S.progress={{}};const L=flat(courseById('{cid}')).filter(x=>x.l.steps);
                      S.done={{none:[],some:L.slice(0,Math.ceil(L.length/3)).map(x=>x.l.id),all:L.map(x=>x.l.id)}}['{fill}'];save();coursePage('{cid}')""")
                    tag = f"{theme} {cid} pro={pro} {fill}"
                    for m in pg.evaluate(SHAPE, cid): check(False, f"{tag}: {m}")
                    bad = pg.evaluate(EDGE)
                    check(not bad, f"{tag}: overflow {bad}")
                    st = pg.evaluate("""(cid)=>{const c=courseById(cid),L=flat(c);return c.units.map((u,ui)=>{const ch=document.querySelectorAll('#screen .unit')[ui].querySelector('.pnode.chest');
                      const it=L.filter(x=>x.ui===ui&&x.l.steps);return [ch?ch.className.replace(/pnode|chest/g,'').trim():null,ch?ch.querySelector('button').disabled:null,it.every(x=>S.done.includes(x.l.id)),u.free||S.pro]})}""", cid)
                    for ui, (cls, dis, complete, open_) in enumerate(st):
                        if cls is None: continue
                        want = "ready" if complete and open_ else "pro" if not open_ else "locked"
                        check(cls == want, f"{tag}: unit {ui} chest is '{cls}', want '{want}'")
                        check(dis == (want != "ready"), f"{tag}: unit {ui} chest disabled={dis}")
                    if fill != "all" and not pg.evaluate(f"!!courseById('{cid}').pickAny"):
                        nu = pg.evaluate(f"(()=>{{const c=courseById('{cid}'),n=nextUp(c);return n&&status(c,n)!=='pro'?n.l.id:null}})()")
                        if nu:
                            check(pg.evaluate(f"!!document.querySelector('.pnode .pbtn[data-l=\"{nu}\"]').closest('.pnode').querySelector('.pwalker')"), f"{tag}: no TypeMonkey by next lesson")
                            check(pg.evaluate(f"!!document.querySelector('.pbtn[data-l=\"{nu}\"] .pstart')"), f"{tag}: no START tag")
        # chest opens once, pays once
        pg.evaluate("S.pro=false;S.chests={};S.bananas=0;S.xp=0;S.done=flat(courseById('js')).filter(x=>x.ui===0).map(x=>x.l.id);save();coursePage('js')")
        pg.click(".pnode.chest.ready .chestbtn", timeout=5000); pg.wait_for_timeout(900)
        r = pg.evaluate("[S.bananas,S.xp,Object.keys(S.chests).length,!!document.querySelector('.pnode.chest.opened'),$('#sBan').textContent]")
        check(r == [20, 10, 1, True, "20"], f"{theme}: chest open result {r}")
        pg.evaluate("coursePage('js')")
        r2 = pg.evaluate("[document.querySelector('.pnode.chest').className.includes('opened'),document.querySelector('.pnode.chest button').disabled]")
        check(r2 == [True, True], f"{theme}: opened chest after re-render {r2}")
        pg.evaluate("openChest(courseById('js'),0,document.querySelector('.chestbtn'))")
        check(pg.evaluate("S.bananas") == 20, f"{theme}: chest paid twice")
        # calm mode: opens right away
        pg.evaluate("S.settings.calm=true;applySettings();S.chests={};save();coursePage('js')")
        pg.click(".pnode.chest.ready .chestbtn", timeout=5000)
        check(pg.evaluate("!!document.querySelector('.pnode.chest.opened')"), f"{theme}: calm mode chest did not open at once")
        pg.evaluate("S.settings.calm=false;applySettings();save()")
        # the hop after a lesson still runs
        pg.evaluate("S.done=flat(courseById('js')).slice(0,2).map(x=>x.l.id);mapWalk={cid:'js',from:S.done[1]};save();coursePage('js')"); pg.wait_for_timeout(300)
        check(pg.evaluate("!!document.querySelector('.pwalker.walking,.pwalker.arrived')"), f"{theme}: TypeMonkey did not hop")
        # tapping lesson circles still starts lessons
        for cid in ("js", "jr", "py"):
            pg.evaluate(f"S.done=[];S.progress={{}};save();coursePage('{cid}')"); pg.wait_for_timeout(350)  # let the screen finish sliding in
            lid = pg.evaluate("document.querySelector('.pnode.open .pbtn').dataset.l")
            pg.click(f".pbtn[data-l='{lid}']", timeout=5000, force=True)  # the next circle gently bobs, so skip the 'stable' wait
            check(pg.evaluate("cur&&cur.l.id") == lid and pg.evaluate("!!document.querySelector('.lessonbar')"), f"{theme}: tapping {lid} did not start it")
        ctx.close()
    b.close()
for x in problems[:40]: print(x)
for e in errors[:5]: print("page error:", e)
print(f"Map: {len(problems) + len(errors)} problem(s)")
sys.exit(1 if problems or errors else 0)
