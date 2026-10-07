#!/usr/bin/env python3
"""Checks the courses whose code can't run inside the app, using real tools.

  C++    -> compiled and run with g++
  Python -> run with python3
  SQL    -> run against SQLite

For every game snippet the printed output must equal the answer marked correct (opts[0]);
"What does this print?" quizzes must match; fill/order steps with an `out` must produce it;
every demo must compile/run without errors (its output is listed so a human can compare it
with what TypeMonkey says).

Usage: python3 tests/verify_compiled.py [cpp] [py] [sql] [-v]
Needs node, g++ and python3 on PATH.
"""
import json, os, pathlib, re, sqlite3, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from build import COURSE_FILES  # noqa: E402

VERBOSE = "-v" in sys.argv


def load_courses(extra=False):
    src = "\n".join((ROOT / "src" / "courses" / f).read_text() for f in COURSE_FILES)
    js = src + "\nconsole.log(JSON.stringify({cpp: typeof COURSE_CPP!=='undefined'?COURSE_CPP:null, py: typeof COURSE_PY!=='undefined'?COURSE_PY:null, sql: typeof COURSE_SQL!=='undefined'?COURSE_SQL:null, cs: typeof COURSE_CS!=='undefined'?COURSE_CS:null}));"
    out = subprocess.run(["node", "-"], input=js, capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def norm(text):
    lines = [l.rstrip() for l in str(text).strip("\n").split("\n")]
    return " ".join(l for l in lines if l != "").strip()


# ---------- C++ ----------
CPP_HEAD = "#include <iostream>\n#include <string>\n#include <vector>\n#include <utility>\n"


def run_cpp(code):
    """Returns (ok, output_or_error). Snippets without main() are wrapped in one."""
    attempts = [CPP_HEAD + code] if "int main" in code else [CPP_HEAD + "int main() {\n" + code + "\n}", CPP_HEAD + code + "\nint main() {}"]
    last = ""
    for prog in attempts:
        with tempfile.TemporaryDirectory() as d:
            src, exe = os.path.join(d, "t.cpp"), os.path.join(d, "t")
            pathlib.Path(src).write_text(prog)
            c = subprocess.run(["g++", "-std=c++17", "-w", src, "-o", exe], capture_output=True, text=True)
            if c.returncode:
                last = c.stderr.strip().splitlines()[0] if c.stderr.strip() else "compile error"
                continue
            r = subprocess.run([exe], capture_output=True, text=True, timeout=5, input="")
            return True, r.stdout
    return False, last


# ---------- Python ----------
def run_py(code):
    r = subprocess.run([sys.executable, "-I", "-c", code], capture_output=True, text=True, timeout=5, input="")
    if r.returncode:
        err = r.stderr.strip().splitlines()
        return False, err[-1] if err else "error"
    return True, r.stdout


# ---------- SQL ----------
def run_sql(code, setup):
    db = sqlite3.connect(":memory:")
    try:
        db.executescript(setup or "")
        cur = None
        for stmt in [s for s in code.split(";") if s.strip()]:
            cur = db.execute(stmt)
        rows = cur.fetchall() if cur and cur.description else []
        if not rows:
            return True, "(no rows)"
        return True, "\n".join(" | ".join("NULL" if v is None else str(v) for v in row) for row in rows)
    except Exception as e:  # noqa: BLE001
        return False, str(e)
    finally:
        db.close()


def sql_setup(tables):
    """Builds CREATE TABLE + INSERT statements from the course's table data."""
    out = []
    for name, t in tables.items():
        types = ["INTEGER" if all(isinstance(r[i], int) or r[i] is None for r in t["rows"]) else "TEXT" for i in range(len(t["cols"]))]
        out.append(f"CREATE TABLE {name} ({', '.join(f'{c} {ty}' for c, ty in zip(t['cols'], types))});")
        for r in t["rows"]:
            vals = ", ".join("NULL" if v is None else str(v) if isinstance(v, int) else "'" + v.replace("'", "''") + "'" for v in r)
            out.append(f"INSERT INTO {name} VALUES ({vals});")
    return "\n".join(out)


def check_course(course, runner, setups=None):
    problems = []
    if not course:
        return problems

    def run(code, lesson):
        if setups is not None:
            return runner(code, setups)
        return runner(code)

    for unit in course["units"]:
        for l in unit["lessons"]:
            if not l.get("steps"):
                problems.append(f"{l['id']}: lesson has no steps")
                continue
            for code, opts in l.get("pool", []):
                ok, out = run(code, l)
                if not ok or norm(out) != norm(opts[0]):
                    problems.append(f"{l['id']} game: expected {opts[0]!r} got {norm(out)!r} {'' if ok else '(error)'}\n    {code!r}")
                if len(set(opts)) != len(opts):
                    problems.append(f"{l['id']} game: duplicate options {opts}")
            for i, s in enumerate(l["steps"]):
                t = s["type"]
                if t == "talk" and s.get("demo") and not s.get("noRun"):
                    ok, out = run(s["demo"], l)
                    if not ok:
                        problems.append(f"{l['id']} step {i} demo fails: {out}")
                    elif VERBOSE:
                        print(f"  {l['id']} step {i} demo output: {norm(out)[:160]!r}")
                if t == "quiz" and s.get("code") and "print" in s["q"] and not s.get("noRun"):
                    ok, out = run(s["code"], l)
                    ans = s["opts"][s["a"]]
                    if not ok or norm(out) != norm(ans):
                        problems.append(f"{l['id']} step {i} quiz: answer {ans!r} but output {norm(out)!r}")
                if t == "fill":
                    code = re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"])
                    for b in s["blanks"]:
                        if b not in s["tokens"]:
                            problems.append(f"{l['id']} step {i} fill: blank {b!r} missing from tokens")
                    if not s.get("noRun"):
                        ok, out = run(code, l)
                        if not ok:
                            problems.append(f"{l['id']} step {i} fill doesn't run: {out}")
                        elif "out" in s and norm(out) != norm(s["out"]):
                            problems.append(f"{l['id']} step {i} fill: expected {s['out']!r} got {norm(out)!r}")
                if t == "order" and not s.get("noRun"):
                    ok, out = run("\n".join(s["lines"]), l)
                    if not ok:
                        problems.append(f"{l['id']} step {i} order doesn't run: {out}")
                    elif "out" in s and norm(out) != norm(s["out"]):
                        problems.append(f"{l['id']} step {i} order: expected {s['out']!r} got {norm(out)!r}")
    return problems


def main():
    want = [a for a in sys.argv[1:] if not a.startswith("-")] or ["cpp", "py", "sql"]
    courses = load_courses()
    problems = []
    if "cpp" in want:
        problems += check_course(courses["cpp"], run_cpp)
    if "py" in want:
        problems += check_course(courses["py"], run_py)
    if "sql" in want and courses["sql"]:
        problems += check_course(courses["sql"], run_sql, setups=sql_setup(courses["sql"]["tables"]))
    for p in problems:
        print("✖", p)
    print("All compiled-language checks passed" if not problems else f"{len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
