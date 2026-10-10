#!/usr/bin/env python3
"""Checks the generated daily challenges for 120 different days at every level.

- JavaScript "what prints" puzzles: the marked answer equals what the app's JS runner prints
- Python puzzles: the marked answer equals real python3 output
- daily code tasks (JS and Python): the solution passes grading and the starter fails
- Jr. daily mazes are solvable, dances and banana boxes have valid solutions
Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_daily.py
"""
import asyncio, json, pathlib, subprocess, sys
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GEN = r"""async () => {
  const out = {py: [], bad: []};
  for (let d = 0; d < 120; d++) for (const L of [1, 2, 3]) {
    const r = seeded("t" + d + "-" + L);
    // force a level by faking how many lessons are done
    const fake = c => ({...c});
    for (const cid of ["js", "py"]) {
      const c = courseById(cid);
      const keep = S.done; S.done = flat(c).slice(0, L === 1 ? 0 : L === 2 ? 5 : 12).map(x => x.l.id);
      const steps = dailyCoder(r, c); S.done = keep;
      for (const s of steps) {
        if (s.type === "quiz") {
          if (new Set(s.opts).size !== s.opts.length || s.opts.length < 3) out.bad.push(`${cid} L${L} d${d}: bad options ${s.opts}`);
          if (cid === "js") { const got = (await runCode(s.code)).filter(o => o[0] === "log").map(o => o[1]).join("\n");
            if (got !== s.opts[0]) out.bad.push(`js L${L} d${d}: answer ${s.opts[0]} but prints ${got}\n${s.code}`); }
          else out.py.push([s.code, s.opts[0]]);
        } else {
          const g = await grade(s, s.hint, cid === "py" ? "py" : "js"); if (!g[0]) out.bad.push(`${cid} L${L} d${d}: code hint fails ${g[1]} ${g[2] || ""}\n${s.hint}`);
          const g2 = await grade(s, s.start, cid === "py" ? "py" : "js"); if (g2[0]) out.bad.push(`${cid} L${L} d${d}: starter passes`);
        }
      }
    }
    const jr = courseById("jr"); const keep = S.done; S.done = flat(jr).slice(0, L === 1 ? 0 : L === 2 ? 5 : 12).map(x => x.l.id);
    const [mz, dn, bx] = dailyJr(r, jr); S.done = keep;
    const sim = simulate(mz.grid, mz.dir, mz.solution, []);
    if (sim.result !== "win") out.bad.push(`jr L${L} d${d}: maze not solved (${sim.result}) ${JSON.stringify(mz.grid)}`);
    if (L === 1 && mz.solution.filter(b => b !== "fwd").length > 1) out.bad.push(`jr L1 d${d}: maze has more than one turn`);
    const fl = Array.from({length: dn.solution.times || 1}, () => dn.solution.pattern).flat();
    if (JSON.stringify(fl) !== JSON.stringify(dn.target) || dn.target.some(m => !dn.moves.includes(m))) out.bad.push(`jr L${L} d${d}: dance bad`);
    const v = bx.solution.reduce((n, o) => BOXOPS[o](n), bx.startVal);
    if (v !== bx.goal || (bx.max && bx.solution.length > bx.max) || bx.goal <= bx.startVal) out.bad.push(`jr L${L} d${d}: box bad`);
    { const best = boxShortest(bx.startVal, bx.goal, bx.ops); if (bx.max && best && best.length < bx.max) out.bad.push(`jr L${L} d${d}: box says ${bx.max} taps but ${best.length} is enough`); }
  }
  return out;
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        await pg.goto((ROOT / "index.html").as_uri()); await pg.wait_for_timeout(800)
        res = await pg.evaluate(GEN); await b.close()
    bad = res["bad"]
    for code, ans in res["py"]:
        got = subprocess.run([sys.executable, "-I", "-c", code], capture_output=True, text=True, timeout=5).stdout.strip()
        if got != ans: bad.append(f"py: answer {ans} but python3 prints {got}\n{code}")
    for x in bad[:20]: print("FAIL", x)
    print(f"Daily: 360 generated days x (JS, Python, Jr.) checked, {len(res['py'])} Python puzzles vs python3. {len(bad)} problem(s)")
    sys.exit(1 if bad else 0)
asyncio.run(main())
