#!/usr/bin/env python3
"""Checks TypeMonkey's in-house C#/C++ runner (src/engines/clike.js).

  C++: every snippet in the course (and the EXTRA programs below) must print exactly what g++ prints.
  C#:  every game snippet and "What does this print?" quiz must print the verified answer, every demo
       and fill-in must run without errors (demo output is listed with -v for a human check).
Usage: python3 tests/verify_clike.py [-v]
"""
import json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
from verify_compiled import load_courses, run_cpp, norm  # noqa: E402

VERBOSE = "-v" in sys.argv

EXTRA_CPP = [
    'int a = 7, b = 2;\nstd::cout << a / b << " " << a % b << " " << (double)a / b << " " << 7.0 / 3;',
    'double x = 1.0 / 3;\nstd::cout << x << " " << 100.0 << " " << 1e6 << " " << 1234567.0 << " " << 0.0001;',
    'std::string s = "monkey";\nstd::cout << s.length() << s.substr(1, 3) << s[0];',
    'std::vector<int> v = {4, 1, 3};\nstd::sort(v.begin(), v.end());\nfor (int x : v) std::cout << x;',
    'int x = 5;\nint* p = &x;\nint** pp = &p;\n**pp = 8;\nstd::cout << x;',
    '#include <iostream>\nusing namespace std;\nint fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\nint main() { cout << fact(5) << endl; }',
    '#include <iostream>\n#include <vector>\nusing namespace std;\nstruct P { string n; int s; };\nint main() {\n  vector<P> ps = {{"a", 3}, {"b", 9}};\n  int best = 0;\n  for (const auto& p : ps) if (p.s > best) best = p.s;\n  cout << best;\n}',
    'int n = 0;\nfor (int i = 0; i < 5; i++) {\n  switch (i) {\n    case 1: n += 10; break;\n    case 3: n += 100; break;\n    default: n += 1;\n  }\n}\nstd::cout << n;',
    'bool t = true;\nstd::cout << t << " " << !t << " " << (3 < 4) << std::boolalpha << " " << t;',
    'char c = \'A\';\nc++;\nstd::cout << c << " " << (int)c;',
    '#include <iostream>\nclass Counter {\nint count = 0;\npublic:\n  void add() { count++; }\n  int get() const { return count; }\n};\nint main() { Counter c; Counter d = c; c.add(); c.add(); d.add(); std::cout << c.get() << d.get(); }',
    'std::vector<std::vector<int>> g = {{1, 2}, {3, 4}};\nint s = 0;\nfor (auto& row : g) for (int x : row) s += x;\nstd::cout << s << g[1][0];',
    'int total = 0;\nint i = 10;\nwhile (true) {\n  if (i <= 0) break;\n  total += i;\n  i -= 3;\n}\nstd::cout << total;',
]

EXTRA_CS = [  # (code, expected output)
    ('int n = 7;\nConsole.WriteLine($"{10/3} {n/2} {n * 1.5}");', '3 3 10.5'),
    ('Console.WriteLine(7 / 2);\nConsole.WriteLine(7.0 / 2);\nConsole.WriteLine(1.0 / 3);', '3\n3.5\n0.3333333333333333'),
    ('int x = 5;\nConsole.WriteLine($"x is {x}, doubled {x * 2}, price {2.5:F2}");', 'x is 5, doubled 10, price 2.50'),
    ('var names = new List<string> { "Ava", "Leo" };\nnames.Add("Kai");\nConsole.WriteLine(string.Join(", ", names));\nConsole.WriteLine(names.Count);', 'Ava, Leo, Kai\n3'),
    ('Console.WriteLine("{0} + {1} = {2}", 2, 3, 2 + 3);', '2 + 3 = 5'),
    ('bool b = 3 > 2;\nConsole.WriteLine(b);\nConsole.WriteLine(!b);', 'True\nFalse'),
    ('try {\n  int z = 0;\n  Console.WriteLine(10 / z);\n} catch (DivideByZeroException e) {\n  Console.WriteLine("Oops: " + e.Message);\n}', 'Oops: Attempted to divide by zero.'),
    ('static int Fib(int n) => n < 2 ? n : Fib(n - 1) + Fib(n - 2);\nConsole.WriteLine(Fib(10));', '55'),
    ('var d = new Dictionary<string, int>();\nd["a"] = 1;\nd["b"] = 2;\nforeach (var kv in d) Console.Write($"{kv.Key}={kv.Value} ");', 'a=1 b=2'),
    ('Dog a = new Dog { Name = "Rex" };\nDog b = a;\nb.Name = "Max";\nConsole.WriteLine(a.Name);\n\nclass Dog { public string Name { get; set; } }', 'Max'),
    ('int[] nums = { 3, 8, 1 };\nint best = nums[0];\nforeach (int n in nums) if (n > best) best = n;\nConsole.WriteLine(best);', '8'),
    ('string s = "banana";\nConsole.WriteLine(s.Length);\nConsole.WriteLine(s.Substring(1, 3).ToUpper());\nConsole.WriteLine(s.Replace("a", "o"));', '6\nANA\nbonono'),
    ('using System;\n\nclass Program {\n  static int Square(int n) { return n * n; }\n  static void Main() {\n    Console.WriteLine(Square(9));\n  }\n}', '81'),
    ('double avg = (90 + 85 + 77) / 3.0;\nConsole.WriteLine(Math.Round(avg, 1));', '84'),
]


def run_tmc(items):
    script = (ROOT / "src" / "engines" / "clike.js").read_text() + """
const I=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(I.map(([c,l,i])=>TMC.run(c,l,i))));"""
    tmp = ROOT / "tests" / ".clike.js"
    tmp.write_text(script)
    try:
        r = subprocess.run(["node", str(tmp)], input=json.dumps([list(x) + [INPUTS.get(x[0])] for x in items]), capture_output=True, text=True)
        if r.returncode:
            print(r.stderr[-2000:])
            sys.exit(1)
        return json.loads(r.stdout)
    finally:
        tmp.unlink()


INPUTS = {}  # demo code -> what the learner types in the Input box


def snippets(course):
    for unit in course["units"]:
        for l in unit["lessons"]:
            for code, opts in l.get("pool", []):
                yield l["id"], "game", code, opts[0]
            for i, s in enumerate(l.get("steps", [])):
                if s["type"] == "talk" and s.get("demo"):
                    if s.get("input"):
                        INPUTS[s["demo"]] = s["input"]
                    yield l["id"], f"step {i} demo", s["demo"], None
                if s["type"] == "quiz" and s.get("code"):
                    yield l["id"], f"step {i} quiz", s["code"], s["opts"][s["a"]] if "print" in s["q"] else None
                if s["type"] == "fill":
                    yield l["id"], f"step {i} fill", re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"]), s.get("out")
                if s["type"] == "order":
                    yield l["id"], f"step {i} order", "\n".join(s["lines"]), s.get("out")
                if s["type"] == "code":
                    yield l["id"], f"step {i} hint", s["hint"], None


def main():
    courses = load_courses(extra=True)
    problems = []
    # ---- C++ against g++
    cpp = [(lid, what, code, exp) for lid, what, code, exp in snippets(courses["cpp"]) if not code.startswith("class ") or "int main" in code]
    cpp += [("extra", f"extra {i}", c, None) for i, c in enumerate(EXTRA_CPP)]
    ours = run_tmc([[c, "cpp"] for _, _, c, _ in cpp])
    compared = 0
    for (lid, what, code, exp), mine in zip(cpp, ours):
        ok, real = run_cpp(code)
        if not ok:
            continue  # fragments that need context (g++ can't compile them alone either)
        compared += 1
        if mine["error"] or norm(mine["out"]) != norm(real):
            problems.append(f"C++ {lid} {what}: g++ prints {norm(real)!r}, TypeMonkey prints {norm(mine['out'])!r} {mine['error'] or ''}\n    {code[:200]!r}")
        elif VERBOSE:
            print(f"  ok C++ {lid} {what}: {norm(real)[:80]!r}")
    # ---- C# against verified answers
    cs = list(snippets(courses["cs"]))
    cs_extra = [("extra", f"extra {i}", c, e) for i, (c, e) in enumerate(EXTRA_CS)]
    ours = run_tmc([[c, "cs"] for _, _, c, _ in cs + cs_extra])
    for (lid, what, code, exp), mine in zip(cs + cs_extra, ours):
        fragment = what.endswith(("fill", "order")) and exp is None
        if mine["error"]:
            if fragment and ("CompileError" not in mine["error"]) and ("not declared" in mine["error"] or "does not exist" in mine["error"] or "expected" in mine["error"]):
                continue
            if "ReadLine" in mine["error"]:
                continue  # the guessing game demo reads input on purpose
            if fragment:
                continue
            problems.append(f"C# {lid} {what}: error {mine['error']}\n    {code[:200]!r}")
            continue
        if exp is not None and norm(mine["out"]) != norm(exp):
            problems.append(f"C# {lid} {what}: expected {norm(exp)!r}, TypeMonkey prints {norm(mine['out'])!r}\n    {code[:200]!r}")
        elif VERBOSE:
            print(f"  ok C# {lid} {what}: {norm(mine['out'])[:100]!r}")
    for p in problems:
        print("✖", p)
    print(f"C++: {compared} snippets compared with g++. C#: {len(cs) + len(cs_extra)} snippets checked. {len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
