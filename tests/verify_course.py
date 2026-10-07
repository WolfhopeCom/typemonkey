#!/usr/bin/env python3
"""Checks every JavaScript lesson by actually running the code.

For each lesson it verifies:
  - every Output Rush snippet prints exactly the answer marked correct (opts[0])
  - every code challenge's hint solution passes the grader, and the starter code does NOT
  - every fill-in-the-blank answer runs without errors
  - every "What does this print?" quiz answer matches the real output

Usage:  pip install playwright && python -m playwright install chromium
        python3 build.py && python3 tests/verify_course.py
Exit code 1 if anything fails.
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
INTENTIONAL_DEMO_ERRORS = {"js4", "js15"}  # demos that show an error on purpose

CHECK = r"""async () => {
  const R = [];
  const c = COURSES.find(c => c.id === "js");
  for (const x of flat(c)) {
    const l = x.l; if (!l.steps) continue;
    for (const [code, opts] of l.pool || []) {
      const out = await runCode(code);
      const got = out.filter(o => o[0] === "log").map(o => o[1]).join(" ");
      const err = out.find(o => o[0] === "err");
      if (err || got !== opts[0]) R.push(`${l.id} game: expected "${opts[0]}" got "${got}" ${err ? err[1] : ""}`);
      if (new Set(opts).size !== opts.length) R.push(`${l.id} game: duplicate options ${opts}`);
    }
    for (const [i, s] of l.steps.entries()) {
      if (s.type === "code") {
        const g = await grade(s, s.hint);
        if (!g[0]) R.push(`${l.id} step ${i}: hint solution fails: ${g[1]} ${g[2] || ""}`);
        const g2 = await grade(s, s.start);
        if (g2[0]) R.push(`${l.id} step ${i}: starter code already passes`);
      }
      if (s.type === "fill") {
        const code = s.code.replace(/\[(\d)\]/g, (m, d) => s.blanks[d]);
        const err = (await runCode(code)).find(o => o[0] === "err");
        if (err) R.push(`${l.id} step ${i}: fill answer errors: ${err[1]}`);
        s.blanks.forEach(b => { if (!s.tokens.includes(b)) R.push(`${l.id} step ${i}: blank "${b}" missing from tokens`) });
      }
      if (s.type === "quiz" && s.code && /print/.test(s.q)) {
        const got = (await runCode(s.code)).filter(o => o[0] === "log").map(o => o[1]);
        const ans = s.opts[s.a];
        const lastOnly = /LAST/.test(s.q) && got[got.length - 1] === ans;
        if (ans !== "Nothing" && !lastOnly && got.join(" ") !== ans) R.push(`${l.id} step ${i}: quiz answer "${ans}" but code prints "${got.join(" ")}"`);
      }
      if (s.type === "talk" && s.demo && !INTENTIONAL.includes(l.id)) {
        const err = (await runCode(s.demo)).find(o => o[0] === "err");
        if (err) R.push(`${l.id} step ${i}: demo errors: ${err[1]}`);
      }
    }
  }
  return R;
}"""


def main():
    page_path = ROOT / "index.html"
    if not page_path.exists():
        sys.exit("index.html not found. Run: python3 build.py")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(page_path.as_uri())
        page.evaluate(f"window.INTENTIONAL = {sorted(INTENTIONAL_DEMO_ERRORS)}")
        problems = page.evaluate(CHECK.replace("INTENTIONAL.includes", "window.INTENTIONAL.includes"))
        browser.close()
    problems += [f"page error: {e}" for e in errors]
    for line in problems:
        print("✖", line)
    print(f"{'All checks passed' if not problems else str(len(problems)) + ' problem(s)'}")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
