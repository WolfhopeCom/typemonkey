#!/usr/bin/env python3
"""Build TypeMonkey into a single self-contained page.

  python3 build.py              -> index.html            (full web page: GitHub Pages, browsers, app wrappers)
  python3 build.py --artifact   -> dist/artifact.html    (body-only version for publishing as a Claude artifact)

Course content lives in src/courses/*.js and is inlined in the order listed below.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).parent
COURSE_FILES = [  # order matters: later files can reference earlier ones
    "javascript-units-1-2.js",
    "javascript-units-3-4.js",
    "javascript-units-5-6.js",
    "csharp-units-2-4.js",
    "csharp.js",
    "cpp-units-2-4.js",
    "cpp.js",
    "python-units-1-3.js",
    "python-units-4-6.js",
    "sql.js",
    "web.js",
    "jr.js",
    "challenges.js",  # code challenges for Python, SQL, C#, C++ (attaches to lessons above)
    "pools-extra.js",  # extra Output Rush rounds (attaches to lessons above)
    "more-js-py.js",  # JavaScript Unit 7, Python Unit 7
    "more-web-sql-cs-cpp.js",  # HTML & CSS, SQL, C#, C++ Unit 5
]

ENGINE_FILES = ["sql.js", "clike.js"]  # in-house SQL engine and C#/C++ runner; Python is Brython (src/vendor)

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FF7A1A">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
"""


def build(artifact: bool) -> pathlib.Path:
    app = (ROOT / "src" / "app.html").read_text()
    data = "\n".join((ROOT / "src" / "courses" / f).read_text() for f in COURSE_FILES) + "\n" + (ROOT / "src" / "legal.js").read_text()
    data += "\n" + "\n".join((ROOT / "src" / "engines" / f).read_text() for f in ENGINE_FILES)
    vendor = (ROOT / "src" / "vendor" / "brython.js").read_text().replace("</script", "<\\/script")
    assert "/*VENDOR*/" in app, "vendor placeholder missing from src/app.html"
    app = app.replace("/*VENDOR*/", vendor)
    assert "/*COURSE_DATA*/" in app, "placeholder missing from src/app.html"
    page = app.replace("/*COURSE_DATA*/", data)
    if artifact:
        out = ROOT / "dist" / "artifact.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(page)
    else:
        head, sep, body = page.partition("</style>")
        out = ROOT / "index.html"
        out.write_text(HEAD + head + sep + "\n</head>\n<body>\n" + body + "\n</body>\n</html>\n")
    print(f"built {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")
    return out


if __name__ == "__main__":
    build("--artifact" in sys.argv)
