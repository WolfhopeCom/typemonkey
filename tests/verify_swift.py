#!/usr/bin/env python3
"""Checks the Swift course against TypeMonkey's in-house Swift runner (src/engines/swift.js).

Swift can't be installed where TypeMonkey is built, so this can't compare with real Swift. Instead:
  - every Output Rush round and "What does this print?" quiz must print the answer marked correct
  - every code challenge's answer must print exactly its expected lines (and each variant too),
    and its starter code must NOT already pass
  - fill-ins and order puzzles must run (and match their expected output when they have one)
  - demos must run without errors, except the ones that show a crash on purpose
  - the EXTRA programs below, whose output was written from the Swift language reference,
    must print exactly that
Usage: python3 tests/verify_swift.py [-v]
"""
import json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VERBOSE = "-v" in sys.argv
INTENTIONAL_CRASH = {"sw9", "sw13"}  # demos that show "Index out of range" / a nil unwrap on purpose

EXTRA = [
    ('var d: [String: [Int]] = [:]\nd["a", default: []].append(1)\nd["a", default: []].append(2)\nprint(d)\nprint(type(of: 5), type(of: "x"))\nvar c: [String: Int] = [:]\nprint(c["z", default: 0], c.count)', '["a": [1, 2]]\nInt String\n0 0'),
    ('print("Hello, world!")\nlet name = "Mo"\nvar age = 4\nage += 1\nprint("\\(name) is \\(age)")\nprint(7 / 2, 7 % 2, 7.0 / 2)\nprint(3.14159)\nprint(10.0 / 4)', "Hello, world!\nMo is 5\n3 1 3.5\n3.14159\n2.5"),
    ('print(0.1 + 0.2)\nprint(10.0 / 3)\nprint(1.0)\nprint(100.0 * 3)\nprint(-7 / 2, -7 % 2)\nprint(Double(7) / 2)', "0.30000000000000004\n3.3333333333333335\n1.0\n300.0\n-3 -1\n3.5"),
    ('var nums = [3, 1, 2]\nnums.append(5)\nprint(nums)\nprint(nums.count, nums.sorted(), nums.first!)\nprint(nums.map { $0 * 2 })\nprint(nums.filter { $0 > 2 }.reduce(0, +))', "[3, 1, 2, 5]\n4 [1, 2, 3, 5] 3\n[6, 2, 4, 10]\n8"),
    ('let n: Int? = Int("42")\nprint(n)\nif let x = n { print(x + 1) }\nprint(Int("x") ?? 0)\nvar d = ["a": 1]\nd["b"] = 2\nprint(d["a"], d["z"])\nprint(d["b"] ?? 0)', "Optional(42)\n43\n0\nOptional(1) nil\n2"),
    ('func greet(_ name: String, times: Int = 1) -> String {\n    return String(repeating: "Hi \\(name)! ", count: times)\n}\nprint(greet("Mo", times: 2))\nfunc add(a: Int, b: Int) -> Int { a + b }\nprint(add(a: 2, b: 3))', "Hi Mo! Hi Mo! \n5"),
    ('struct Point {\n    var x: Int\n    var y: Int\n    mutating func move(by d: Int) { x += d; y += d }\n}\nvar p = Point(x: 1, y: 2)\nvar q = p\nq.move(by: 5)\nprint(p, q)', "Point(x: 1, y: 2) Point(x: 6, y: 7)"),
    ('class Animal {\n    var name: String\n    init(name: String) { self.name = name }\n    func speak() -> String { "..." }\n}\nclass Dog: Animal {\n    override func speak() -> String { "Woof" }\n}\nlet a: [Animal] = [Animal(name: "x"), Dog(name: "Rex")]\nfor an in a { print(an.name, an.speak()) }\nlet d1 = Dog(name: "A")\nlet d2 = d1\nd2.name = "B"\nprint(d1.name)', "x ...\nRex Woof\nB"),
    ('enum Dir: CaseIterable { case north, south, east, west }\nlet d = Dir.east\nswitch d {\ncase .north, .south: print("vertical")\ncase .east, .west: print("horizontal")\n}\nprint(Dir.allCases.count, d)\nlet score = 85\nswitch score {\ncase 90...100: print("A")\ncase 80..<90: print("B")\ndefault: print("C")\n}', "horizontal\n4 east\nB"),
    ('for i in 1...3 { print(i, terminator: " ") }\nprint()\nfor i in stride(from: 10, to: 0, by: -3) { print(i) }\nvar k = 0\nwhile k < 3 { k += 1 }\nrepeat { k -= 1 } while k > 0\nprint(k)', "1 2 3 \n10\n7\n4\n1\n0"),
    ('enum BankError: Error { case insufficient }\nfunc withdraw(_ amt: Int, from bal: Int) throws -> Int {\n    guard amt <= bal else { throw BankError.insufficient }\n    return bal - amt\n}\ndo {\n    print(try withdraw(5, from: 10))\n    print(try withdraw(50, from: 10))\n} catch BankError.insufficient {\n    print("Not enough")\n}\nlet r = try? withdraw(1, from: 0)\nprint(r)', "5\nNot enough\nnil"),
    ('let s = "Hello"\nprint(s.count, s.uppercased(), s.hasPrefix("He"))\nprint(String(s.reversed()))\nfor c in "ab" { print(c) }\nlet words = "a b c".split(separator: " ")\nprint(words)\nprint(words.joined(separator: "-"))', '5 HELLO true\nolleH\na\nb\n["a", "b", "c"]\na-b-c'),
    ('protocol Shape { var area: Double { get } }\nstruct Sq: Shape {\n    var side: Double\n    var area: Double { side * side }\n}\nlet shapes: [Shape] = [Sq(side: 2), Sq(side: 3)]\nfor s in shapes { print(s.area) }\nlet t = (1, "a")\nprint(t, t.0)\nlet (aa, bb) = t\nprint(aa, bb)', '4.0\n9.0\n(1, "a") 1\n1 a'),
    ('let words = ["apple", "fig", "banana"]\nprint(words.sorted { $0.count < $1.count })\nprint(words.map { $0.count })\nprint(words.contains("fig"), words.firstIndex(of: "banana") ?? -1)\nprint(words.joined(separator: ", "))', '["fig", "apple", "banana"]\n[5, 3, 6]\ntrue 2\napple, fig, banana'),
    ('var scores = ["Mo": 3]\nscores["Mo", default: 0] += 2\nscores["Kiki", default: 0] += 1\nfor k in scores.keys.sorted() { print(k, scores[k]!) }', "Kiki 1\nMo 5"),
    ('let x: Int? = nil\nprint(x ?? 5)\nlet names: [String] = []\nprint(names.first ?? "none")\nprint(names.first?.count)\nlet s: String? = "hey"\nprint(s?.uppercased() ?? "")', "5\nnone\nnil\nHEY"),
    ('func describe(_ v: Int) -> String {\n    switch v {\n    case ..<0: return "negative"\n    case 0: return "zero"\n    case 1...9: return "small"\n    default: return "big"\n    }\n}\nprint(describe(-4), describe(0), describe(5), describe(50))', "negative zero small big"),
    ('struct Temp {\n    var celsius: Double\n    var fahrenheit: Double { celsius * 9 / 5 + 32 }\n}\nvar t = Temp(celsius: 100)\nprint(t.fahrenheit)\nt.celsius = 0\nprint(t.fahrenheit)', "212.0\n32.0"),
    ('enum Planet: Int { case mercury = 1, venus, earth }\nprint(Planet.earth.rawValue)\nprint(Planet(rawValue: 2) ?? .mercury)\nprint(Planet(rawValue: 9))', "3\nvenus\nnil"),
    ('var total = 0\nfor (i, v) in [10, 20, 30].enumerated() { total += i * v }\nprint(total)\nlet pairs = zip([1, 2, 3], ["a", "b", "c"])\nfor (n, l) in pairs { print(n, l, terminator: "; ") }\nprint()', "80\n1 a; 2 b; 3 c; "),
    ('let x = 5\nx = 6', "ERROR"),
    ('let a = 3\nlet b = 0.5\nprint(a + b)', "ERROR"),
    ('print("Total: " + 5)', "ERROR"),
    ('let n = 3\nswitch n {\ncase 1: print("one")\n}', "ERROR"),
    ('let arr = [1, 2]\nprint(arr[5])', "CRASH"),
    ('let v: Int? = nil\nprint(v!)', "CRASH"),
    ('let nums = [1, 2]\nnums.append(3)', "ERROR"),
    ('struct P { var x = 0 }\nlet p = P()\np.x = 3', "ERROR"),
    ('print(1 + 0.5, 2 * 1.5)\nlet d: Double = 3\nprint(d)\nvar e = 2.0\ne += 1\nprint(e)', "1.5 3.0\n3.0\n3.0"),
    ('print((2.5).rounded(), (-2.5).rounded(), (2.4).rounded())\nprint(Int(-3.9))\nprint(abs(-3), max(1, 9, 4))', "3.0 -3.0 2.0\n-3\n3 9"),
    ('class Counter {\n    static var made = 0\n    var n = 0\n    init() { Counter.made += 1 }\n    func up() { n += 1 }\n}\nlet c = Counter()\nc.up()\nc.up()\n_ = Counter()\nprint(c.n, Counter.made)', "2 2"),
    ('var stack: [String] = []\nstack.append("a")\nstack.append("b")\nlet top = stack.removeLast()\nprint(top, stack, stack.isEmpty)', 'b ["a"] false'),
    ('let grid = [[1, 2], [3, 4]]\nprint(grid[1][0])\nvar g = grid\ng[0][0] = 9\nprint(grid[0][0], g[0][0])', "3\n1 9"),
    ('func swapped(_ t: (Int, Int)) -> (Int, Int) { (t.1, t.0) }\nprint(swapped((1, 2)))\nvar a = 1, b = 2\n(a, b) = (b, a)\nprint(a, b)', "(2, 1)\n2 1"),
    ('let s = "a,b,,c"\nprint(s.split(separator: ",").count)\nprint("hello".contains("ell"), "Hello".lowercased().hasSuffix("lo"))', "3\ntrue true"),
]


def load():
    files = ["javascript-units-1-2.js", "swift.js"]
    src = "\n".join((ROOT / "src" / "courses" / f).read_text() for f in files)
    js = src + "\nconsole.log(JSON.stringify(COURSE_SWIFT,(k,v)=>v instanceof RegExp?{re:v.source}:v));"
    return json.loads(subprocess.run(["node", "-"], input=js, capture_output=True, text=True, check=True).stdout)


def run_all(codes):
    script = (ROOT / "src" / "engines" / "swift.js").read_text() + """
const I=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(I.map(c=>TMSwift.run(c))));"""
    tmp = ROOT / "tests" / ".swift-tmc.js"
    tmp.write_text(script)
    try:
        r = subprocess.run(["node", str(tmp)], input=json.dumps(codes), capture_output=True, text=True)
        if r.returncode:
            print(r.stderr[-3000:])
            sys.exit(1)
        return json.loads(r.stdout)
    finally:
        tmp.unlink()


def lines(out):
    l = str(out).split("\n")
    if l and l[-1] == "":
        l.pop()
    return l


def flat(out):
    return " ".join(x.strip() for x in lines(out) if x.strip())


def js_re(src):
    return re.compile(src.replace("\\/", "/"))


def collect():
    """Every Swift program the course and EXTRA contain, as (where, code, check)."""
    course = load()
    jobs = []  # (where, code, check)
    for unit in course["units"]:
        for l in unit["lessons"]:
            lid = l["id"]
            for code, opts in l.get("pool", []):
                jobs.append((f"{lid} game", code, ("flat", opts[0])))
                if len(set(opts)) != len(opts):
                    print(f"✖ {lid} game: duplicate options {opts}")
            for i, s in enumerate(l["steps"]):
                w = f"{lid} step {i}"
                if s["type"] == "talk" and s.get("demo"):
                    jobs.append((w + " demo", s["demo"], ("crash-ok",) if lid in INTENTIONAL_CRASH else ("runs",)))
                if s["type"] == "quiz" and s.get("code") and "does this print" in s["q"]:
                    jobs.append((w + " quiz", s["code"], ("flat", s["opts"][s["a"]])))
                if s["type"] in ("fill", "order"):
                    code = re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"]) if s["type"] == "fill" else "\n".join(s["lines"])
                    jobs.append((w + " " + s["type"], code, ("lines", s["out"].split("\n")) if s.get("out") else ("runs",)))
                if s["type"] == "code":
                    jobs.append((w + " answer", s["hint"], ("lines", s["out"])))
                    jobs.append((w + " starter", s["start"], ("not", s["out"])))
                    for j, (pat, rep, outs) in enumerate(s.get("variants", [])):
                        code, n = js_re(pat["re"]).subn(rep.replace("\\", "\\\\"), s["hint"], count=1)
                        if not n:
                            print(f"✖ {w} variant {j}: pattern doesn't match the answer")
                        jobs.append((f"{w} variant {j}", code, ("lines", outs)))
    for i, (code, exp) in enumerate(EXTRA):
        jobs.append((f"extra {i}", code, ("error",) if exp == "ERROR" else ("crash",) if exp == "CRASH" else ("lines", exp.split("\n"))))
    return jobs


def main():
    jobs = collect()
    results = run_all([c for _, c, _ in jobs])
    problems = []
    for (w, code, chk), r in zip(jobs, results):
        out, err = r["out"], r["error"]
        kind = chk[0]
        bad = None
        if kind == "flat":
            if err or flat(out) != chk[1]:
                bad = f"expected {chk[1]!r}, got {flat(out)!r} {err or ''}"
        elif kind == "lines":
            if err or lines(out) != chk[1]:
                bad = f"expected {chk[1]!r}, got {lines(out)!r} {err or ''}"
        elif kind == "runs":
            if err:
                bad = f"error: {err}"
        elif kind == "crash-ok":
            if err and not err.startswith("Fatal error"):
                bad = f"error: {err}"
        elif kind == "not":
            if not err and lines(out) == chk[1]:
                bad = "starter code already passes"
        elif kind == "error":
            if not err or not err.startswith("error"):
                bad = f"should be a compile error, got {lines(out)!r} {err or ''}"
        elif kind == "crash":
            if not err or not err.startswith("Fatal error"):
                bad = f"should crash, got {lines(out)!r} {err or ''}"
        if bad:
            problems.append(f"{w}: {bad}\n    {code[:220]!r}")
        elif VERBOSE:
            print(f"  ok {w}: {flat(out)[:70]!r} {err or ''}")
    for p in problems:
        print("✖", p)
    print(f"Swift: {len(jobs)} checks. {len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
