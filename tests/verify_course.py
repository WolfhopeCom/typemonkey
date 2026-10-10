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
    for (const x of flat(c)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "code" || s.type === "bug") {
      const g = await grade(s, s.hint, c.runnable); if (!g[0]) R.push(`${x.l.id} step ${i}: hint fails: ${g[1]} ${g[2] || ""}`);
      const g2 = await grade(s, s.start, c.runnable); if (g2[0]) R.push(`${x.l.id} step ${i}: starter already passes`);
    }
  // Tap mode: for every challenge that offers tiles, the tiles in the right order must pass too
  let tileSteps = 0;
  for (const c of COURSES.filter(c => c.units && !c.kids)) for (const x of flat(c)) for (const [i, s] of (x.l.steps || []).entries()) {
    const p = typeof tilePlan === "function" ? tilePlan(s) : null; if (!p) continue; tileSteps++;
    const code = tileCode(p, p.pieces.map((_, k) => k));
    const g = c.runnable === "web" ? gradeWebNow(s, code) : await grade(s, code, kindOf(c));
    if (!g[0]) R.push(`${x.l.id} step ${i}: tiles in order fail: ${g[1]} ${g[2] || ""}\n${code}`);
  }
  if (tileSteps < 100) R.push(`only ${tileSteps} steps offer tap tiles`);
  console.log("tile steps", tileSteps);
  // HTML & CSS: every challenge's hint must pass, and the starter must not
  const web = COURSES.find(c => c.id === "web");
  for (const x of flat(web)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "code") {
    const g = gradeWebNow(s, s.hint); if (!g[0]) R.push(`${x.l.id} step ${i}: hint fails: ${g[1]}`);
    const g2 = gradeWebNow(s, s.start); if (g2[0]) R.push(`${x.l.id} step ${i}: starter already passes`);
  }
  // TypeMonkey Jr.: every maze is well-formed, the solution wins within max, buggy starters fail
  const jr = COURSES.find(c => c.id === "jr");
  for (const x of flat(jr)) for (const [i, s] of (x.l.steps || []).entries()) {
    if (s.type === "dance") {
      const p = s.solution.pattern, t = s.solution.times || 1, flatP = Array.from({ length: t }, () => p).flat();
      if (JSON.stringify(flatP) !== JSON.stringify(s.target)) R.push(`${x.l.id} step ${i}: dance solution doesn't match target`);
      if (!s.loop && t !== 1) R.push(`${x.l.id} step ${i}: non-loop dance with times`);
      if ([...s.target, ...(s.start || [])].some(m => !s.moves.includes(m) || !DMOVES[m])) R.push(`${x.l.id} step ${i}: dance uses a move not offered`);
      if (s.start && JSON.stringify(s.start) === JSON.stringify(s.target)) R.push(`${x.l.id} step ${i}: buggy dance already correct`);
    }
    if (s.type === "box") {
      const v = s.solution.reduce((n, o) => BOXOPS[o](n), s.startVal || 0);
      if (v !== s.goal) R.push(`${x.l.id} step ${i}: box solution gives ${v}, goal ${s.goal}`);
      if (s.max && s.solution.length > s.max) R.push(`${x.l.id} step ${i}: box solution too long`);
      { const best = boxShortest(s.startVal || 0, s.goal, s.ops); const say = (s.body || "") + " " + (s.say || "");
        if (s.max && best && best.length < s.max) R.push(`${x.l.id} step ${i}: "${s.title}" allows ${s.max} taps but ${best.length} is enough`);
        const m = say.match(/(\d+)\s*(?:<\/b>\s*)?taps?/); if (s.max && m && +m[1] !== s.max) R.push(`${x.l.id} step ${i}: "${s.title}" text says ${m[1]} taps but max is ${s.max}`); }
      if (s.solution.some(o => !s.ops.includes(o))) R.push(`${x.l.id} step ${i}: box solution uses an op not offered`);
    }
    if (s.type === "sort") {
      if (!s.items.length || s.items.some(it => !(it.bin >= 0 && it.bin < s.bins.length))) R.push(`${x.l.id} step ${i}: sort item with bad bin`);
      if (s.bins.some((b, k) => !s.items.some(it => it.bin === k))) R.push(`${x.l.id} step ${i}: a sort bin gets nothing`);
    }
  }
  // "Tree ahead?" must always mean a tree you can SEE: the answer may not rely on the edge of the map as a wall
  for (const x of flat(jr)) for (const [i, s] of (x.l.steps || []).entries()) if ((s.type === "maze" || s.type === "predict") && s.solution) {
    const sol = s.solution.main ? s.solution : {main: s.solution, fn: []}; if (!Array.isArray(sol.main)) continue;
    const ifs = b => typeof b === "object" ? b.body.some(ifs) : (b === "ifR" || b === "ifL");
    if (![...sol.main, ...(sol.fn || [])].some(ifs)) continue;
    const run = g => { const r = simulate(g, s.dir, sol.main, sol.fn || []); return r.result + ":" + r.path.length };
    const pads = {right: g => g.map(r => r + "."), left: g => g.map(r => "." + r), top: g => [".".repeat(g[0].length), ...g], bottom: g => [...g, ".".repeat(g[0].length)]};
    for (const [side, f] of Object.entries(pads)) if (run(f(s.grid)) !== run(s.grid)) R.push(`${x.l.id} step ${i}: "${s.title}" uses the ${side} edge of the map as a tree; draw real # there`);
  }
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
    if (s.startFn && s.startFn.some(b => !s.blocks.includes(b))) R.push(`${x.l.id} step ${i}: startFn uses a block that isn't offered`);
    // the helping hand must lead to the answer: following "next block" hints from an empty program rebuilds the solution
    let hp = [], hf = jrClone(s.startFn || []), guard = 0, h;
    while ((h = mazeHint(hp, hf, s, null)) && !h.glow.go && guard++ < 60) {
      const g = h.glow, solM = s.func ? s.solution.main : s.solution;
      if (g.f !== undefined || g.lane === "fn" && g.pal) { hf = s.solution.fn.slice(0, (g.f !== undefined ? g.f : hf.length) + 1); continue; }
      if (g.pal) { const k = hp.length; hp.push(jrClone(solM[k])); continue; }
      R.push(`${x.l.id} step ${i}: hint from scratch got stuck: ${h.msg}`); break;
    }
    if (!h || !h.glow.go || simulate(s.grid, s.dir, hp, hf).result !== "win") R.push(`${x.l.id} step ${i}: following the hints doesn't solve the maze`);
    if (!s.func && mazeHint([...(s.solution), "fwd"], [], s, null).glow.i !== s.solution.length) R.push(`${x.l.id} step ${i}: hint doesn't spot an extra block`);
  }
  // Every Jr. puzzle has a big goal line, and the first puzzle in each lesson needs 3 blocks or fewer (gentle ramp)
  const PUZ = ["maze", "dance", "box", "sort", "order", "predict", "build"];
  for (const x of flat(jr)) {
    let first = true;
    for (const [i, s] of (x.l.steps || []).entries()) {
      if (!PUZ.includes(s.type)) continue;
      if (!/\S/.test(jrAim(s)) || !/^\P{L}/u.test(jrAim(s))) R.push(`${x.l.id} step ${i}: puzzle has no emoji goal line`);
      if (first && ["maze", "dance", "box", "order"].includes(s.type) && !s.start) {
        const need = s.type === "maze" ? (s.func ? blockCount(s.solution.main) + (s.startFn ? 0 : s.solution.fn.length) : blockCount(s.solution))
          : s.type === "dance" ? s.solution.pattern.length : s.type === "order" ? s.lines.length : s.solution.length;
        if (need > 3) R.push(`${x.l.id} step ${i}: first puzzle of the lesson needs ${need} blocks (max 3)`);
      }
      if (s.type !== "predict") first = false;
    }
  }
  // Predict puzzles: the program runs cleanly and stops somewhere other than the start
  for (const x of flat(jr)) for (const [i, s] of (x.l.steps || []).entries()) if (s.type === "predict") {
    if (s.dance) {
      const seq = Array.from({ length: s.dance.times || 1 }, () => s.dance.pattern).flat();
      if (!(s.ask > 0 && s.ask < seq.length)) R.push(`${x.l.id} step ${i}: predict ask out of range`);
      if (!s.moves.includes(seq[s.ask]) || seq.some(m => !DMOVES[m])) R.push(`${x.l.id} step ${i}: predict answer isn't offered`);
      if (new Set(s.moves).size < 2) R.push(`${x.l.id} step ${i}: predict needs at least 2 choices`);
      continue;
    }
    const m = mazeInfo(s.grid); if (!m.start) { R.push(`${x.l.id} step ${i}: predict grid has no S`); continue; }
    const E = predictEnd(s);
    if (["wall", "loop", "extra"].includes(E.r.result)) R.push(`${x.l.id} step ${i}: predict program ends with ${E.r.result}`);
    if (E.x === m.start[0] && E.y === m.start[1]) R.push(`${x.l.id} step ${i}: predict ends on the start square`);
    if (s.grid[E.y][E.x] === "#") R.push(`${x.l.id} step ${i}: predict ends on a tree`);
    for (const p of JSON.stringify(s.prog).match(/"rep":(\d+)/g) || []) { const n = +p.split(":")[1]; if (n < 2 || n > 5) R.push(`${x.l.id} step ${i}: predict repeat ${n} outside 2–5`); }
  }
  // Free play: the level maker's solver must solve every reachable layout, and say "no" when a banana is walled off
  if (!flat(jr).some(x => (x.l.steps || []).some(s => s.type === "build"))) R.push("jr: no free-play puzzle maker");
  if (!jrSolve(BUILD_START, "E") || simulate(BUILD_START, "E", jrSolve(BUILD_START, "E"), []).result !== "win") R.push("jr build: starter layout isn't solvable");
  let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let t = 0; t < 400; t++) {
    const cells = Array.from({ length: 25 }, () => rnd() < 0.3 ? "#" : "."); const sIdx = Math.floor(rnd() * 25); cells[sIdx] = "S";
    const nb = 1 + Math.floor(rnd() * 4); for (let b = 0; b < nb; b++) { const k = Math.floor(rnd() * 25); if (k !== sIdx) cells[k] = "B"; }
    if (!cells.includes("B")) continue;
    const grid = [0, 1, 2, 3, 4].map(r => cells.slice(r * 5, r * 5 + 5).join("")), dir = "NESW"[t % 4];
    const sol = jrSolve(grid, dir);
    // reachability by flood fill
    const seen = new Set([sIdx]), q = [sIdx];
    while (q.length) { const c = q.shift(), cx = c % 5, cy = (c - cx) / 5; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy, n = ny * 5 + nx; if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5 && cells[n] !== "#" && !seen.has(n)) { seen.add(n); q.push(n); } } }
    const reachable = cells.every((c, k) => c !== "B" || seen.has(k));
    if (reachable !== !!sol) R.push(`jr build: solver says ${!!sol} but reachable is ${reachable} for ${grid.join("/")}`);
    if (sol && simulate(grid, dir, sol, []).result !== "win") R.push(`jr build: solver's program fails on ${grid.join("/")} ${dir}`);
    if (sol && (JSON.stringify(sol).match(/"rep":(\d+)/g) || []).some(p => +p.split(":")[1] < 2 || +p.split(":")[1] > 5)) R.push(`jr build: solver repeat outside 2–5`);
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
