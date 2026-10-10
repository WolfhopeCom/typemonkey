#!/usr/bin/env python3
"""Builds TypeMonkey's public website into docs/ (served by GitHub Pages):

  docs/index.html    short landing page
  docs/privacy.html  Privacy Policy   (App Store "Privacy Policy URL")
  docs/terms.html    Terms of Service
  docs/support.html  Support / FAQ + contact (App Store "Support URL")

The policy text comes from src/legal.js, the same text the app shows, so they never drift apart.
Usage: python3 tools/site.py
"""
import html, json, pathlib, shutil, subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
REPO = "https://github.com/WolfhopeCom/typemonkey"


def legal():
    js = (ROOT / "src" / "legal.js").read_text() + "\nconsole.log(JSON.stringify({info: LEGAL_INFO, legal: LEGAL}));"
    return json.loads(subprocess.run(["node", "-"], input=js, capture_output=True, text=True, check=True).stdout)


CSS = """
:root{--bg:#F2F5F1;--surface:#FFFEFB;--fg:#1B2621;--muted:#5D6E66;--line:#D7E2DB;--accent:#FA7A20;--leaf:#22986A}
@media (prefers-color-scheme:dark){:root{--bg:#111B17;--surface:#182520;--fg:#E3EDE8;--muted:#9BB1A7;--line:#2A3B34}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:720px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;align-items:center;gap:12px;margin-bottom:8px}
header img{width:56px;height:56px;border-radius:14px}
header a{color:inherit;text-decoration:none;font-weight:800;font-size:1.3rem}
nav{display:flex;flex-wrap:wrap;gap:6px 16px;margin:4px 0 24px}
nav a{color:var(--accent);font-weight:700;text-decoration:none}
h1{font-size:2rem;line-height:1.15;margin:8px 0}
h2{font-size:1.15rem;margin:28px 0 6px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px 20px;margin:14px 0}
.muted{color:var(--muted)}
a{color:var(--accent)}
main,p,li{overflow-wrap:break-word}
.btn{display:inline-block;background:var(--accent);color:#2A1300;font-weight:800;padding:12px 18px;border-radius:12px;text-decoration:none}
details{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:8px 0}
summary{font-weight:700;cursor:pointer}
footer{margin-top:40px;color:var(--muted);font-size:.85rem}
"""


def page(title, body, info, desc):
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} · TypeMonkey</title><meta name="description" content="{html.escape(desc)}">
<link rel="icon" href="icon.png"><style>{CSS}</style></head>
<body><main>
<header><img src="icon.png" alt=""><a href="index.html">TypeMonkey</a></header>
<nav><a href="index.html">Home</a><a href="support.html">Support</a><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a></nav>
{body}
<footer>© {info['updated'][-4:]} {html.escape(info['owner'])} · TypeMonkey</footer>
</main></body></html>
"""


def legal_page(doc, info):
    secs = "".join(f"<h2>{html.escape(h)}</h2>{b}" for h, b in doc["sections"])
    return f"<h1>{html.escape(doc['title'])}</h1><p class='muted'>Last updated {html.escape(info['updated'])}</p>{secs}"


def main():
    d = legal()
    info, L = d["info"], d["legal"]
    DOCS.mkdir(exist_ok=True)
    icon = ROOT / "app" / "resources" / "icon.png"
    if icon.exists():
        shutil.copy2(icon, DOCS / "icon.png")
    contact_issue = f"{REPO}/issues/new?title=TypeMonkey%20help&body=What%20happened%3F%20(Which%20device%20and%20which%20lesson%3F)"
    email = info.get("email") or ""
    contact = (f"<p>Email <a href='mailto:{html.escape(email)}'><b>{html.escape(email)}</b></a> and we'll get back to you.</p>" if email else "") + \
        f"<p><a class='btn' href='{contact_issue}'>Send us a message</a></p><p class='muted'>Opens a short form on GitHub (a free account is needed). Please don't include personal details about children.</p>"
    faq = [
        ("I bought the full version. How do I get it on a new phone?",
         "Open TypeMonkey, go to <b>Settings</b> and tap <b>Restore</b>. Use the same Apple ID (or Google account) you bought it with. The purchase is one-time; you never pay again."),
        ("How do I move my progress to another device?",
         "Progress is saved on your device only. In <b>Settings → Progress → Back up</b>, copy your backup code, then paste it on the other device in the same place."),
        ("I can't hear any sounds.",
         "Check that <b>Sounds</b> is On in Settings, the iPhone's silent switch is off, the volume is up, and no Bluetooth headphones or speakers are connected."),
        ("Is TypeMonkey OK for kids?",
         "Yes. TypeMonkey Jr. is made for ages 7–12 and needs no typing. The app has no ads, no accounts, no chat and collects no personal information. Purchases are behind a grown-up check."),
        ("Do I need the internet?",
         "No. Everything, including running your code, works offline on your device."),
        ("How do I start over?",
         "<b>Settings → Progress → Reset…</b> erases lessons, XP, bananas and outfits on this device. Make a backup code first if you might want them back."),
    ]
    support = "<h1>Support</h1><p>Need a hand? Most answers are right here.</p>" + \
        "".join(f"<details><summary>{html.escape(q)}</summary><p>{a}</p></details>" for q, a in faq) + \
        f"<div class='card'><h2 style='margin-top:0'>Contact us</h2>{contact}</div>"
    home = """<h1>Learn to code, one banana at a time.</h1>
<p>TypeMonkey is a friendly coding app for all ages. Bite-size lessons, real code you run yourself, quizzes and mini-games,
with a monkey buddy cheering you on. Learn JavaScript, Python, HTML &amp; CSS, SQL, C#, C++, Java and Swift, build real projects,
and fix broken code in the Bug Lab. Kids aged 7–12 get TypeMonkey Jr.: puzzles, dances and mazes with no typing.</p>
<div class="card"><b>No ads. No accounts. No tracking.</b><br>Works offline. Unit 1 of every course is free; one purchase unlocks everything.</div>
<p class="muted">Coming soon to the App Store.</p>"""
    (DOCS / "index.html").write_text(page("Learn to code", home, info, "TypeMonkey: a friendly coding app for all ages."))
    (DOCS / "privacy.html").write_text(page("Privacy Policy", legal_page(L["privacy"], info), info, "TypeMonkey Privacy Policy"))
    (DOCS / "terms.html").write_text(page("Terms of Service", legal_page(L["terms"], info), info, "TypeMonkey Terms of Service"))
    (DOCS / "support.html").write_text(page("Support", support, info, "Help and contact for TypeMonkey"))
    (DOCS / ".nojekyll").write_text("")
    print("wrote", ", ".join(sorted(p.name for p in DOCS.iterdir())))


if __name__ == "__main__":
    main()
