#!/usr/bin/env python3
"""Checks Build Projects and Bug Lab against real python3.

For every code/bug step: the hint (finished or fixed code) must print exactly the expected
lines for every test input, and the starter (broken) code must not.
input() prompts are not printed, matching the app's quiet grading.

Usage: python3 tests/verify_extras.py
"""
import json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from build import COURSE_FILES  # noqa: E402

PRE = "import builtins\n_i = builtins.input\nbuiltins.input = lambda p='': _i()\n"


def load():
    src = "\n".join((ROOT / "src" / "courses" / f).read_text() for f in COURSE_FILES)
    js = src + "\nconsole.log(JSON.stringify([COURSE_PROJECTS, COURSE_BUGLAB], (k, v) => v instanceof RegExp ? {re: v.source, f: v.flags} : v));"
    return json.loads(subprocess.run(["node", "-"], input=js, capture_output=True, text=True, check=True).stdout)


def run(code, stdin):
    try:
        r = subprocess.run([sys.executable, "-I", "-c", PRE + code], capture_output=True, text=True, timeout=5, input=stdin or "")
    except subprocess.TimeoutExpired:
        return None
    if r.returncode:
        return None
    return [l.strip() for l in r.stdout.split("\n") if l.strip()]


def passes(step, code):
    for t in step.get("tests") or [{"input": step.get("input", ""), "out": step.get("out")}]:
        got = run(code, t["input"])
        if got is None:
            return False, "error"
        if t["out"] is not None and got != [o.strip() for o in t["out"]]:
            return False, f"input {t['input']!r}: expected {t['out']} got {got}"
    for u in step.get("use") or []:
        if not re.search(u[0]["re"], code, re.I if "i" in u[0]["f"] else 0):
            return False, f"missing {u[0]['re']}"
    return True, ""


bad = n = 0
for c in load():
    for u in c["units"]:
        for l in u["lessons"]:
            for i, s in enumerate(l.get("steps", [])):
                if s["type"] not in ("code", "bug"):
                    continue
                n += 1
                ok, why = passes(s, s["hint"])
                if not ok:
                    bad += 1
                    print(f"FAIL {l['id']} step {i}: hint {why}")
                ok2, _ = passes(s, s["start"])
                if ok2:
                    bad += 1
                    print(f"FAIL {l['id']} step {i}: starter already passes")
print(f"{n} steps checked against python3, {bad} problems")
sys.exit(1 if bad else 0)
