#!/usr/bin/env python3
"""Runs every Python snippet in the course through the app's bundled Python (Brython) and through
real python3, and checks they print the same thing. Also checks challenge solutions pass the grader.
Usage: python3 build.py && python3 tests/verify_python_engine.py
"""
import json, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
from verify_compiled import load_courses, run_py, norm  # noqa: E402

EXTRA = [
    'print(f"{3.14159:.2f} {1/3} {10/5} {2**10} {7//2} {-7//2} {7 % -3}")',
    'print([1, 2] + [3], (1, 2), {"a": [1, {"b": None}]}, {1, 2} if False else "set")',
    'x = 0\nwhile True:\n    x += 1\n    if x > 3:\n        break\nprint(x)',
    'def f(n):\n    return n if n < 2 else f(n - 1) + f(n - 2)\nprint([f(i) for i in range(10)])',
    'words = "the cat the dog".split()\nprint(sorted(set(words)), len(words), words.count("the"))',
    'class A:\n    def __init__(self, v):\n        self.v = v\n    def __repr__(self):\n        return f"A({self.v})"\nprint([A(1), A(2)])',
    'print("ook".center(9, "*"), "Banana".lower().startswith("ban"), " x ".strip(), "a,b".split(","))',
    'try:\n    [1, 2][5]\nexcept IndexError as e:\n    print("caught", e)',
    'print(round(2.675, 2), round(3.5), round(4.5), abs(-3), max([4, 9, 2]), sum(range(5)))',
    'print(round(1.005, 2), round(0.125, 2), round(2.5), round(-1.5), round(17, -1), round(15, -1), round(25, -1), round(1234.5, -2), f"{2.675:.2f}", round(91.66666, 1))',
    'd = {"b": 2, "a": 1}\nfor k in sorted(d):\n    print(k, d[k])\nprint(list(d.items()))',
    'print(True + True, 3 == 3.0, "5" * 2, [0] * 3, bool(""), bool("x"))',
    'nums = [5, 3, 8]\nnums.sort(reverse=True)\nprint(nums, nums[::-1], nums.index(3))',
    'print(enumerate.__name__, list(zip([1, 2], "ab")), list(map(str, [1, 2])))',
]
ERRORS = [  # (code, expected start of the error shown to the learner)
    ('print(x)', "NameError"),
    ('print("hi"', "SyntaxError"),
    ('n = int("abc")', "ValueError"),
    ('print(1 / 0)', "ZeroDivisionError"),
    ('while True:\n    pass', "RuntimeError: Your loop ran 100,000 times"),
    ('name = input("Name? ")', "RuntimeError: input() can't read typing"),
    ('if True:\nprint("x")', "IndentationError"),
]


def snippets(course):
    for unit in course["units"]:
        for l in unit["lessons"]:
            for code, opts in l.get("pool", []):
                yield l["id"], "game", code
            for i, s in enumerate(l.get("steps", [])):
                if s["type"] == "talk" and s.get("demo"):
                    yield l["id"], f"step {i} demo", s["demo"]
                if s["type"] == "quiz" and s.get("code"):
                    yield l["id"], f"step {i} quiz", s["code"]
                if s["type"] == "fill":
                    yield l["id"], f"step {i} fill", re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"])
                if s["type"] == "order":
                    yield l["id"], f"step {i} order", "\n".join(s["lines"])
                if s["type"] == "code":
                    yield l["id"], f"step {i} hint", s["hint"]


def main():
    py = load_courses()["py"]
    items = list(snippets(py)) + [("extra", f"extra {i}", c) for i, c in enumerate(EXTRA)]
    problems = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((ROOT / "index.html").as_uri())
        ours = pg.evaluate("async (codes) => { const r = []; for (const c of codes) r.push(await runPython(c)); return r }", [c for _, _, c in items])
        bad = pg.evaluate("async (cases) => { const r = []; for (const c of cases) r.push(await runPython(c)); return r }", [c for c, _ in ERRORS])
        graded = pg.evaluate("""async () => { const R = []; const c = COURSES.find(c => c.id === "py");
            for (const x of flat(c)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "code") {
              const g = await grade(s, s.hint, "py"); if (!g[0]) R.push(`${x.l.id} step ${i}: hint fails: ${g[1]} ${g[2] || ""}`);
              const g2 = await grade(s, s.start, "py"); if (g2[0]) R.push(`${x.l.id} step ${i}: starter already passes`);
            } return R }""")
        b.close()
    for (lid, what, code), mine in zip(items, ours):
        out = "\n".join(v for k, v in mine if k == "log")
        err = next((v for k, v in mine if k == "err"), None)
        ok, real = run_py(code)
        if not ok:
            if not err:
                problems.append(f"{lid} {what}: python3 raises {real} but the app ran it without an error")
            continue
        if err or norm(out) != norm(real):
            problems.append(f"{lid} {what}: python3 prints {norm(real)!r}\n    app prints {norm(out)!r} {err or ''}")
    for (code, want), mine in zip(ERRORS, bad):
        err = next((v for k, v in mine if k == "err"), "")
        if not err.startswith(want):
            problems.append(f"error case {code!r}: expected {want!r}, got {err!r}")
    problems += graded + [f"page error: {e}" for e in errs]
    for x in problems:
        print("✖", x)
    print(f"{len(items)} Python snippets compared with python3, {len(ERRORS)} error cases. {len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
