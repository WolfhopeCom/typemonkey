#!/usr/bin/env python3
"""Device safety copy of progress (src/features/60-safekeep.js), with a fake iPhone plugin.

Checks: saves are mirrored to the device copy; if the web view's storage is wiped, progress comes back from the
device copy at launch; "Erase everything" is not undone by the device copy; nothing happens on the web.
Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_safekeep.py
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
fails = []
def ok(c, m):
    if not c: fails.append(m)
DEV = {}   # the fake device storage lives here in the test, so it survives page reloads like the real one
FAKE = """
window.Capacitor={isNativePlatform:()=>true,Plugins:{TMCloud:{
  localGet:async({key})=>{const v=await window.devGet(key);return v?{value:v}:{}},
  localSet:async({key,value})=>{await window.devSet(key,value)},
  available:async()=>({available:false}),get:async()=>({}),set:async()=>{},addListener(){}}}};"""
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    ctx.expose_function("devGet", lambda k: DEV.get(k))
    ctx.expose_function("devSet", lambda k, v: DEV.__setitem__(k, v))
    ctx.add_init_script(FAKE)
    pg = ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(600)
    pg.evaluate("S.onboarded=true;S.xp=777;S.streak=12;S.done=['js1','js2'];save()"); pg.wait_for_timeout(1600)
    dev = json.loads(DEV.get("progress") or "{}")
    ok(dev.get("xp") == 777 and dev.get("streak") == 12, f"save not mirrored to the device copy: {dev.get('xp')}")
    # the web view's storage is wiped by the system
    pg.evaluate("localStorage.clear()"); pg.reload()
    try: pg.wait_for_function("S&&S.xp===777&&!!localStorage.getItem('typemonkey-v1')", timeout=8000)
    except Exception: pass
    pg.wait_for_timeout(300)
    st = pg.evaluate("({xp:S.xp,streak:S.streak,done:S.done,onb:S.onboarded,home:!!document.querySelector('#todayCard')})")
    ok(st["xp"] == 777 and st["streak"] == 12 and st["done"] == ["js1", "js2"] and st["onb"], f"progress not restored after a wipe: {st}")
    ok(st["home"], "should land on Home (not the welcome) after restoring")
    ok(pg.evaluate("(JSON.parse(localStorage.getItem('typemonkey-v1'))||{}).xp") == 777, "restored progress not written back to storage")
    # Erase everything must stick
    pg.evaluate("settingsPage()"); pg.evaluate("$('#reset').click()"); pg.evaluate("$('#yes').click()"); pg.wait_for_timeout(300)
    pg.reload(); pg.wait_for_timeout(1200)
    ok(pg.evaluate("S.xp") == 0 and json.loads(DEV.get("progress") or "{}").get("xp") == 0, f"Erase everything was undone: xp {pg.evaluate('S.xp')}")
    ok(not errs, f"page errors: {errs[:3]}")
    # the web: no plugin, nothing happens
    w = b.new_page(); w.goto(URL); w.wait_for_timeout(600)
    ok(w.evaluate("Safe.plugin()") is None, "web: device copy should be off")
    b.close()
for x in fails: print("FAIL:", x)
print(f"Safe-keeping: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
