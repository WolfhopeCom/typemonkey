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
    # inheritance: virtual/override through A&, A*, vector<A*>, auto; non-virtual uses the static type;
    # Base::method(), init-list base constructors, struct inheritance, slicing, pure virtual, dynamic_cast
    r'''#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Animal {
protected:
  string name;
public:
  Animal(string n) : name(n) {}
  virtual ~Animal() {}
  virtual string speak() const { return "..."; }
  string plain() const { return "animal plain"; }
  void hello() const { cout << name << " says " << speak() << "\n"; }
  string getName() const { return name; }
};
class Dog : public Animal {
public:
  Dog(string n) : Animal(n) {}
  string speak() const override { return "Woof"; }
  string plain() const { return "dog plain"; }
  void fetch() { cout << name << " fetches\n"; }
};
class Puppy : public Dog {
public:
  Puppy(string n) : Dog(n + " Jr") {}
  string speak() const override { return "Yip " + Dog::speak(); }
};
class Cat : public Animal {
public:
  Cat() : Animal("Kitty") {}
  string speak() const override { return "Meow"; }
};
struct Base { int x = 1; void show() { cout << "Base " << x << "\n"; } };
struct Derived : Base { int y = 2; void show() { cout << "Derived " << x << y << "\n"; } };

class Shape {
public:
  virtual double area() const = 0;
  virtual string label() const { return "shape"; }
};
class Rect : public Shape {
  double w, h;
public:
  Rect(double w, double h) : w(w), h(h) {}
  double area() const override { return w * h; }
};

void introduce(const Animal& a) { a.hello(); cout << a.plain() << "\n"; }
void byValue(Animal a) { cout << a.speak() << "\n"; }

int main() {
  Dog d("Rex");
  Cat c;
  Puppy p("Rex");
  introduce(d);
  introduce(c);
  introduce(p);
  byValue(d);
  Animal& r = d;
  cout << r.speak() << " " << r.plain() << " " << d.plain() << "\n";
  Animal* ptr = &p;
  cout << ptr->speak() << " " << ptr->plain() << "\n";
  vector<Animal*> zoo = {new Dog("A"), new Cat(), new Puppy("B")};
  zoo.push_back(new Animal("Plain"));
  for (Animal* a : zoo) cout << a->getName() << ": " << a->speak() << "\n";
  for (auto a : zoo) cout << a->plain() << "\n";
  for (int i = 0; i < zoo.size(); i++) cout << zoo[i]->speak();
  cout << "\n";
  Derived dv;
  dv.show();
  Base& br = dv;
  br.show();
  Base b2 = dv;
  b2.show();
  Rect rc(2, 3);
  Shape& s = rc;
  cout << s.area() << " " << s.label() << "\n";
  Dog* dd = dynamic_cast<Dog*>(zoo[2]);
  if (dd) dd->fetch();
  Dog* none = dynamic_cast<Dog*>(zoo[1]);
  cout << (none == nullptr) << "\n";
  for (Animal* a : zoo) delete a;
  return 0;
}''',
    # braced initializers straight into const Struct& / by-value params, returns, push_back, emplace_back, Item{...}
    r'''#include <iostream>
#include <string>
#include <vector>
using namespace std;
struct Item { std::string name; int qty; };
struct Point { int x; int y; Point(int a, int b) : x(a), y(b) {} };
void tag(const Item& it) { std::cout << it.name << " - " << it.qty << "\n"; }
void tagv(Item it) { std::cout << it.name << " = " << it.qty << "\n"; }
void pt(const Point& p) { cout << p.x << "," << p.y << "\n"; }
Item make(int n) { return {"made", n}; }
Point origin() { return {0, 0}; }
struct Pair : Item { bool ok; };
int main() {
  tag({"banana", 2});
  tagv({"apple", 5});
  pt({3, 4});
  Item m = make(7);
  tag(m);
  tag(make(9));
  pt(origin());
  vector<Item> items;
  items.push_back({"kiwi", 1});
  items.emplace_back(Item{"fig", 3});
  vector<Point> ps;
  ps.emplace_back(5, 6);
  ps.push_back({7, 8});
  ps.push_back(Point(9, 10));
  for (const auto& i : items) tag(i);
  for (const auto& p : ps) pt(p);
  Item a;
  a = {"plum", 4};
  tag(a);
  Pair pr{{"pear", 6}, true};
  tag(pr);
  cout << pr.ok << "\n";
}''',
    'struct Item { std::string name; int qty; };\nvoid tag(const Item& it) { std::cout << it.name << " - " << it.qty << "\\n"; }\nint main() { tag({"banana", 2}); }',
    '#include <iostream>\nstruct A { int v; A(int x) : v(x) { std::cout << "A" << x; } };\nstruct B : A { int w; B() : A(3), w(4) { std::cout << "B" << v << w; } };\nint main() { B b; std::cout << b.v; }',
    '#include <iostream>\nclass A { public: virtual void f() = 0; void g() { f(); } virtual ~A() = default; };\nclass B : public A { public: void f() override { std::cout << "B::f "; } };\nclass C : public B { public: void f() override { std::cout << "C::f "; B::f(); } };\nint main() { C c; B b; A* xs[] = {&b, &c}; for (A* a : xs) a->g(); }',
    'class Counter {\nprotected:\n  int n = 0;\npublic:\n  void add() { n++; }\n};\nclass Loud : public Counter {\npublic:\n  void add() { Counter::add(); Counter::add(); std::cout << n; }\n};\nint main() { Loud l; l.add(); l.add(); Counter& c = l; c.add(); std::cout << " "; l.add(); }',
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
    # inheritance: abstract, virtual/override (several levels), base.Method(), : base(...), : this(...), new (hiding),
    # is / as / casts, List<Base> dispatch, ToString override, exception subclasses
    (r'''using System;
using System.Collections.Generic;

abstract class Shape {
  protected string name;
  public Shape(string name) { this.name = name; }
  public abstract double Area();
  public virtual string Describe() { return $"{name} with area {Area():F1}"; }
}
class Circle : Shape {
  double r;
  public Circle(double r) : base("Circle") { this.r = r; }
  public override double Area() => Math.PI * r * r;
}
class Square : Shape {
  protected double s;
  public Square(double s) : base("Square") { this.s = s; }
  public override double Area() { return s * s; }
  public override string Describe() { return "[] " + base.Describe(); }
}
class Cube : Square {
  public Cube(double s) : base(s) { name = "Cube"; }
  public override double Area() { return 6 * base.Area(); }
}
class Animal {
  public string Name { get; set; }
  public Animal(string n) { Name = n; }
  public virtual string Speak() => "...";
  public string Hello() { return Name + " says " + Speak(); }
  public string Plain() { return "animal plain"; }
  public override string ToString() => "Animal " + Name;
}
class Dog : Animal {
  public Dog(string n) : base(n) {}
  public override string Speak() => "Woof";
  public new string Plain() { return "dog plain"; }
  public void Fetch() { Console.WriteLine(Name + " fetches"); }
}
class Cat : Animal {
  public Cat() : this("Kitty") {}
  public Cat(string n) : base(n) {}
  public override string Speak() { return "Meow"; }
}
class MyErr : Exception { public MyErr(string m) : base(m) {} }

class Program {
  static void Main() {
    List<Shape> shapes = new List<Shape> { new Circle(1), new Square(2), new Cube(2) };
    foreach (Shape s in shapes) Console.WriteLine(s.Describe());
    var zoo = new List<Animal> { new Dog("Rex"), new Cat(), new Animal("Bob") };
    foreach (var a in zoo) {
      Console.WriteLine(a.Hello());
      if (a is Dog d) d.Fetch();
      Dog maybe = a as Dog;
      Console.WriteLine(maybe == null ? "not a dog" : "a dog");
      Console.WriteLine(a.Plain());
    }
    Animal x = new Dog("Max");
    Console.WriteLine(x.Speak() + " " + x.Plain() + " " + ((Dog)x).Plain());
    Console.WriteLine(x);
    Console.WriteLine(x is Animal);
    try { throw new MyErr("bad thing"); } catch (MyErr e) { Console.WriteLine("caught " + e.Message); }
    try { Cat c = (Cat)x; } catch (InvalidCastException e) { Console.WriteLine("cast failed"); }
  }
}''', 'Circle with area 3.1\n[] Square with area 4.0\n[] Cube with area 24.0\nRex says Woof\nRex fetches\na dog\nanimal plain\nKitty says Meow\nnot a dog\nanimal plain\nBob says ...\nnot a dog\nanimal plain\nWoof animal plain dog plain\nAnimal Max\nTrue\ncaught bad thing\ncast failed'),
    ('Animal a = new Dog();\nConsole.WriteLine(a.Sound + " " + a.Legs);\nConsole.WriteLine(a.Describe());\nclass Animal { public virtual string Sound => "?"; public int Legs { get; set; } = 4; public string Describe() => $"I say {Sound}"; }\nclass Dog : Animal { public override string Sound => "Woof"; }', 'Woof 4\nI say Woof'),
    ('var d = new Dog { Name = "Rex", Age = 3 };\nConsole.WriteLine(d.Name + d.Age + d.Info());\nclass Pet { public string Name { get; set; } public string Info() => "!" + Name; }\nclass Dog : Pet { public int Age { get; set; } }', 'Rex3!Rex'),
    ('class Base { public static int Count = 0; protected int id; public Base() { Count++; id = Count; } }\nclass Kid : Base { public int Id() { return id * 10; } }\nvar k1 = new Kid(); var k2 = new Kid();\nConsole.WriteLine(k2.Id() + " " + Base.Count);', '20 2'),
    ('object o = "hi";\nif (o is string s) Console.WriteLine(s.Length);\nobject n = 5;\nConsole.WriteLine(n is int);', '2\nTrue'),
]

ERR_CS = [  # (code, part of the error TypeMonkey must report)
    ('class A { public void F() {} }\nclass B : A { public override void F() {} }\nnew B().F();', 'no suitable method found to override'),
    ('abstract class A { public abstract void F(); }\nvar a = new A();', 'Cannot create an instance of the abstract type'),
    ('abstract class A { public abstract void F(); }\nclass B : A { }\nConsole.WriteLine(1);', 'does not implement inherited abstract member'),
    ('class A { public A(string n) {} }\nclass B : A { public B() {} }\nnew B();', 'There is no argument given'),
    ('class B : Zebra { }\nConsole.WriteLine(1);', "'Zebra' could not be found"),
]
ERR_CPP = [  # TypeMonkey must report an error, and g++ must refuse to compile them too
    'class A { public: void f() {} };\nclass B : public A { public: void f() override {} };\nint main() { B b; }',
    'class A { public: virtual void f() = 0; };\nclass B : public A {};\nint main() { B b; }',
    'class A { public: A(int x) {} };\nclass B : public A { public: B() {} };\nint main() { B b; }',
]


def run_tmc(items):
    script = (ROOT / "src" / "engines" / "clike.js").read_text() + """
const I=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(I.map(([c,l,i,q])=>TMC.run(c,l,i,q))));"""
    tmp = ROOT / "tests" / ".clike.js"
    tmp.write_text(script)
    try:
        r = subprocess.run(["node", str(tmp)], input=json.dumps([list(x) + [INPUTS.get(x[0]), x[0] in QUIET] for x in items]), capture_output=True, text=True)
        if r.returncode:
            print(r.stderr[-2000:])
            sys.exit(1)
        return json.loads(r.stdout)
    finally:
        tmp.unlink()


INPUTS = {}  # demo code -> what the learner types in the Input box
QUIET = set()  # code-challenge hints: run without echoing the typed input, like the grader does


def run_cpp_input(code, stdin):
    """Like run_cpp, but feeds `stdin` to the program (for cin-based challenges)."""
    import os, tempfile
    from verify_compiled import CPP_HEAD
    prog = CPP_HEAD + code if "int main" in code else CPP_HEAD + "int main() {\n" + code + "\n}"
    with tempfile.TemporaryDirectory() as d:
        src, exe = os.path.join(d, "t.cpp"), os.path.join(d, "t")
        pathlib.Path(src).write_text(prog)
        c = subprocess.run(["g++", "-std=c++17", "-w", src, "-o", exe], capture_output=True, text=True)
        if c.returncode:
            return False, "compile error"
        r = subprocess.run([exe], capture_output=True, text=True, timeout=5, input=stdin)
        return True, r.stdout


def snippets(course):
    for unit in course["units"]:
        for l in unit["lessons"]:
            for code, opts in l.get("pool", []):
                yield l["id"], "game", code, opts[0]
            for i, s in enumerate(l.get("steps", [])):
                if s["type"] == "talk" and s.get("demo"):
                    if s.get("input"):
                        INPUTS[s["demo"]] = s["input"]
                        QUIET.add(s["demo"])
                    yield l["id"], f"step {i} demo", s["demo"], None
                if s["type"] == "quiz" and s.get("code"):
                    yield l["id"], f"step {i} quiz", s["code"], s["opts"][s["a"]] if "print" in s["q"] else None
                if s["type"] == "fill":
                    yield l["id"], f"step {i} fill", re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"]), s.get("out")
                if s["type"] == "order":
                    yield l["id"], f"step {i} order", "\n".join(s["lines"]), s.get("out")
                if s["type"] == "code":
                    tests = s.get("tests") or ([{"input": s["input"], "out": s.get("out")}] if s.get("input") else [])
                    if tests:  # input-reading challenges: run the hint with every test's typed input
                        for j, t in enumerate(tests):
                            code = s["hint"] + "\n" * (j + 1)  # unique key per test input
                            INPUTS[code] = t["input"]
                            QUIET.add(code)
                            yield l["id"], f"step {i} hint test {j}", code, "\n".join(t["out"]) if t.get("out") is not None else None
                    else:
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
        ok, real = run_cpp_input(code, INPUTS[code]) if code in QUIET else run_cpp(code)
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
    # ---- programs that must be rejected
    ours = run_tmc([[c, "cs"] for c, _ in ERR_CS] + [[c, "cpp"] for c in ERR_CPP])
    for (code, want), mine in zip(ERR_CS, ours):
        if not mine["error"] or want not in mine["error"]:
            problems.append(f"C# error case: expected an error with {want!r}, TypeMonkey says {mine['error']!r}\n    {code[:200]!r}")
    for code, mine in zip(ERR_CPP, ours[len(ERR_CS):]):
        ok, _ = run_cpp(code)
        if ok or not mine["error"]:
            problems.append(f"C++ error case: g++ {'compiles' if ok else 'rejects'} it, TypeMonkey says {mine['error']!r}\n    {code[:200]!r}")
    for p in problems:
        print("✖", p)
    print(f"C++: {compared} snippets compared with g++. C#: {len(cs) + len(cs_extra)} snippets checked. {len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
