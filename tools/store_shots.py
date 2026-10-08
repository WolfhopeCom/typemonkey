#!/usr/bin/env python3
"""Makes App Store screenshots (iPhone 6.9": 1290x2796) into app/store/screenshots/.
Each one is a real screen of the app with a short headline on top.
Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tools/store_shots.py"""
import asyncio, base64, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "app" / "store" / "screenshots"
SETUP = """S.done=['js1','js2','js3','py1','py2','jr1','jr2'];S.xp=860;S.bananas=145;S.streak=6;S.lastDay=dayStr(new Date());
S.settings.codeInput='tap';S.daily={};save();renderStats();"""
SHOTS = [
  ("01-home", "Learn to code,<br>one banana at a time", "home()"),
  ("02-path", "Bite-size lessons<br>on a fun path", "coursePage('py');window.scrollTo(0,330)"),
  ("03-tiles", "Tap to build real code.<br>No heavy typing.", "startLesson('py2');cur.step=cur.l.steps.findIndex(s=>s.type==='code');renderStep();(()=>{const t=[...document.querySelectorAll('#ttray .tile')];if(t[0])t[0].click()})()"),
  ("04-jr", "TypeMonkey Jr.<br>for ages 7–12", "startLesson('jr1');cur.step=cur.l.steps.findIndex(s=>s.type==='dance');renderStep()"),
  ("05-projects", "Build real games<br>and apps", "coursePage('projects')"),
  ("06-courses", "9 languages, from<br>JavaScript to Swift", "home();setTimeout(()=>{const c=document.querySelector('.courses');if(c)c.scrollIntoView({block:'start'});window.scrollBy(0,-20)},50)"),
]
FRAME = """<html><body style="margin:0;width:1290px;height:2796px;background:linear-gradient(170deg,#FF8A2A,#F2642A);font-family:system-ui,-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;overflow:hidden">
<h1 style="color:#fff;font-size:104px;line-height:1.08;text-align:center;margin:150px 60px 80px;font-weight:900;letter-spacing:-1px;text-shadow:0 4px 0 #0002">{title}</h1>
<div style="width:1080px;height:2330px;border-radius:90px;overflow:hidden;border:14px solid #1B2621;box-shadow:0 40px 80px #0005;background:#F2F5F1">
<img src="data:image/png;base64,{img}" style="width:100%;display:block"></div></body></html>"""
async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 390, "height": 842}, device_scale_factor=3, is_mobile=True, has_touch=True)
        pg = await ctx.new_page()
        await pg.goto((ROOT / "index.html").as_uri()); await pg.wait_for_timeout(800)
        await pg.evaluate(SETUP)
        fr = await (await b.new_context(viewport={"width": 1290, "height": 2796})).new_page()
        for name, title, js in SHOTS:
            await pg.evaluate(js); await pg.wait_for_timeout(700)
            await pg.evaluate("document.querySelectorAll('.celebrate,.burst,.toast').forEach(e=>e.remove())")
            png = await pg.screenshot()
            await fr.set_content(FRAME.format(title=title, img=base64.b64encode(png).decode())); await fr.wait_for_timeout(200)
            await fr.screenshot(path=str(OUT / f"{name}.png"))
            print("wrote", name)
        await b.close()
asyncio.run(main())
