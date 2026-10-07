#!/usr/bin/env python3
"""Renders the TypeMonkey app icons from the mascot drawn in src/app.html.

  python3 build.py && python3 tools/make_icons.py

Writes icons/ (web + PWA) and resources/icon.png + resources/splash.png (inputs for
`npx @capacitor/assets generate`, which makes every iOS and Android size).
Needs: pip install playwright && python -m playwright install chromium
"""
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
BG = "#14201B"      # deep jungle green (the app's code-editor color)
GLOW = "#1F3A30"

ICONS = [  # (file, size, monkey scale, rounded corners)
    ("icons/icon-192.png", 192, 0.78, False),
    ("icons/icon-512.png", 512, 0.78, False),
    ("icons/icon-maskable-512.png", 512, 0.60, False),   # Android safe zone
    ("icons/apple-touch-icon.png", 180, 0.78, False),
    ("icons/favicon-32.png", 32, 0.92, False),
    ("resources/icon.png", 1024, 0.74, False),           # App Store / Play Store master icon
]


def page_html(svg, size, scale, splash=False):
    w, h = (2732, 2732) if splash else (size, size)
    m = int((min(w, h) * (0.32 if splash else scale)))
    title = '<div style="font:800 150px Trebuchet MS,system-ui,sans-serif;color:#fff;margin-top:40px">Type<span style="color:#FF7A1A">Monkey</span></div>' if splash else ""
    return f"""<html><body style="margin:0">
<div id="c" style="width:{w}px;height:{h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;
background:radial-gradient(circle at 50% 42%, {GLOW} 0%, {BG} 62%)">
<div style="width:{m}px;height:{m}px">{svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>{title}</div></body></html>"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto((ROOT / "index.html").as_uri())
        svg = pg.evaluate("monkey('happy')")
        for path, size, scale, _ in ICONS:
            out = ROOT / path
            out.parent.mkdir(parents=True, exist_ok=True)
            pg.set_viewport_size({"width": size, "height": size})
            pg.set_content(page_html(svg, size, scale))
            pg.locator("#c").screenshot(path=str(out))
            print("wrote", path)
        pg.set_viewport_size({"width": 2732, "height": 2732})
        pg.set_content(page_html(svg, 0, 0, splash=True))
        pg.locator("#c").screenshot(path=str(ROOT / "resources" / "splash.png"))
        print("wrote resources/splash.png")
        (ROOT / "icons" / "favicon.svg").write_text(svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '))
        print("wrote icons/favicon.svg")
        b.close()


if __name__ == "__main__":
    main()
