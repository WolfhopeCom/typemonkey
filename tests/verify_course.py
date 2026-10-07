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
  for (const c of COURSES.filter(c => c.id === "js" || c.id === "game"))
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
  // Python, SQL, C#, C++: every challenge's solution passes and its starter code doesn't
  for (const c of COURSES.filter(c => ["py", "sql", "cs", "cpp", "java", "swift"].includes(c.runnable)))
    for (const x of flat(c)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "code") {
      const g = await grade(s, s.hint, c.runnable); if (!g[0]) R.push(`${x.l.id} step ${i}: hint fails: ${g[1]} ${g[2] || ""}`);
      const g2 = await grade(s, s.start, c.runnable); if (g2[0]) R.push(`${x.l.id} step ${i}: starter already passes`);
    }
  // HTML & CSS: every challenge's hint must pass, and the starter must not
  const web = COURSES.find(c => c.id === "web");
  for (const x of flat(web)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "code") {
    const g = gradeWebNow(s, s.hint); if (!g[0]) R.push(`${x.l.id} step ${i}: hint fails: ${g[1]}`);
    const g2 = gradeWebNow(s, s.start); if (g2[0]) R.push(`${x.l.id} step ${i}: starter already passes`);
  }
  // TypeMonkey Jr.: every maze is well-formed, the solution wins within max, buggy starters fail
  const jr = COURSES.find(c => c.id === "jr");
  for (const x of flat(jr)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "maze") {
    const w = s.grid[0].length;
    if (!s.grid.every(r => r.length === w)) R.push(`${x.l.id} step ${i}: grid rows differ in length`);
    const m = mazeInfo(s.grid); if (!m.start || !m.goals.length) { R.push(`${x.l.id} step ${i}: missing S or B`); continue; }
    const main = s.func ? s.solution.main : s.solution, fnb = s.func ? s.solution.fn : [];
    const sol = simulate(s.grid, s.dir, main, fnb);
    if (sol.result !== "win") R.push(`${x.l.id} step ${i}: solution doesn't reach the banana (${sol.result})`);
    const nBlocks = blockCount(main) + fnb.length;
    if (s.max && nBlocks > s.max) R.push(`${x.l.id} step ${i}: solution uses ${nBlocks} blocks, max ${s.max}`);
    const js = JSON.stringify(main) + JSON.stringify(fnb); const used = new Set((js.match(/"(fwd|left|right|ifR|ifL|call)"/g) || []).map(t => t.slice(1, -1))); if (js.includes('"rep"')) used.add("rep"); if (js.includes('"until"')) used.add("until");
    for (const b of used) if (!s.blocks.includes(b)) R.push(`${x.l.id} step ${i}: solution needs block ${b} that isn't offered`);
    for (const p of JSON.stringify(s.solution).match(/"rep":(\d+)/g) || []) { const n = +p.split(":")[1]; if (n < 2 || n > 5) R.push(`${x.l.id} step ${i}: repeat ${n} is outside 2–5`); }
    if (s.start && simulate(s.grid, s.dir, s.start, s.startFn || []).result === "win") R.push(`${x.l.id} step ${i}: buggy starter already wins`);
    if (simulate(s.grid, s.dir, [...main, "fwd"], fnb).result === "win") R.push(`${x.l.id} step ${i}: adding an extra Forward still wins`);
    if (simulate(s.grid, s.dir, [...main, "left"], fnb).result === "win") R.push(`${x.l.id} step ${i}: adding an extra turn still wins`);
    if (s.func && simulate(s.grid, s.dir, [...main, "call"], fnb).result === "win") R.push(`${x.l.id} step ${i}: an extra My move still wins`);
  }
  // Every course: structure sanity
  for (const c of COURSES) for (const x of flat(c)) {
    if (!x.l.steps) { R.push(`${c.id}/${x.l.id}: no steps`); continue; }
    if (x.l.steps[x.l.steps.length - 1].type !== "done") R.push(`${x.l.id}: last step isn't done`);
    for (const [i, s] of x.l.steps.entries()) {
      if (s.type === "quiz" && !(s.a >= 0 && s.a < s.opts.length)) R.push(`${x.l.id} step ${i}: quiz answer index out of range`);
      if (s.type === "fill") { const n = (s.code.match(/\[(\d)\]/g) || []).length; if (n !== s.blanks.length) R.push(`${x.l.id} step ${i}: ${n} blanks in code but ${s.blanks.length} answers`); }
    }
    if (x.l.steps.some(s => s.type === "game") && !(x.l.pool || []).length) R.push(`${x.l.id}: has a game step but no pool`);
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
