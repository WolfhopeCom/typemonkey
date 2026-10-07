#!/usr/bin/env python3
"""Checks TypeMonkey's Java runner (the "java" mode of src/engines/clike.js) against real Java.

Every Java snippet in the course (demos, quizzes, fill-ins, order puzzles, code-step answers,
Output Rush rounds, challenges) plus the EXTRA programs below is compiled with javac and run
with java. TypeMonkey's runner must print exactly the same thing. Game rounds and "What does
this print?" quizzes must also match the answer marked correct.

Snippets can be full programs (with public static void main) or the inside of main. For the
short form, top-level `static` methods and classes are moved to the right place, the same way
TypeMonkey's runner reads them.

Usage: python3 tests/verify_java.py [-v]
Needs node, javac and java on PATH.
"""
import base64, json, pathlib, re, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from build import COURSE_FILES  # noqa: E402

VERBOSE = "-v" in sys.argv

EXTRA = [
    'System.out.println("hi " + 5 / 2 + " " + 5 / 2.0 + " " + 7 % 3 + " " + (double) 7 / 2);',
    'System.out.println(10.0 / 3);\nSystem.out.println(1.0);\nSystem.out.println(100.0 * 3);\nSystem.out.println(1e7);\nSystem.out.println(0.0001);\nSystem.out.println(123456789.0);\nSystem.out.println(0.1 + 0.2);\nSystem.out.println(-0.5);',
    'int big = Integer.MAX_VALUE;\nbig = big + 1;\nSystem.out.println(big);\nlong l = 3000000000L;\nSystem.out.println(l * 2);\nSystem.out.println(Integer.MIN_VALUE - 1);\nint m = 50000 * 50000;\nSystem.out.println(m);',
    'char c = \'A\';\nc++;\nSystem.out.println(c);\nSystem.out.println(c + 1);\nSystem.out.println((char) (c + 1));\nSystem.out.println("" + c + c);\nSystem.out.println(\'a\' + \'b\');\nSystem.out.println(\'x\' + "y");',
    'boolean b = 3 > 2;\nSystem.out.println(b);\nSystem.out.println(!b);\nSystem.out.println(b && false || true);',
    'String s = "Banana";\nSystem.out.println(s.length());\nSystem.out.println(s.charAt(1));\nSystem.out.println(s.substring(2));\nSystem.out.println(s.substring(1, 4));\nSystem.out.println(s.indexOf("an"));\nSystem.out.println(s.lastIndexOf(\'a\'));\nSystem.out.println(s.toUpperCase() + s.toLowerCase());\nSystem.out.println(s.replace("a", "o"));\nSystem.out.println(s.contains("nan"));\nSystem.out.println(s.equals("banana") + " " + s.equalsIgnoreCase("banana"));\nSystem.out.println("  hi  ".trim() + "|");\nSystem.out.println("ab".repeat(3));\nSystem.out.println("apple".compareTo("banana"));\nSystem.out.println("b".compareTo("a"));\nSystem.out.println("app".compareTo("apple"));',
    'String[] parts = "a,b,,c,,".split(",");\nSystem.out.println(parts.length);\nfor (String p : parts) System.out.print("[" + p + "]");\nSystem.out.println();\nSystem.out.println(String.join("-", parts));\nString[] w = "the  quick brown".split(" ");\nSystem.out.println(w.length);\nString[] x = "one two  three".split("\\\\s+");\nSystem.out.println(x.length + x[2]);',
    'System.out.printf("%d items cost $%.2f%n", 3, 4.5);\nSystem.out.println(String.format("%5d|%-5d|%05d", 42, 42, 42));\nSystem.out.println(String.format("%s and %S", "ook", "ook"));\nSystem.out.println(String.format("%.1f %.0f %.3f", 2.25, 2.5, 1.0005));\nSystem.out.println(String.format("%,d", 1234567));\nSystem.out.println(String.format("%8.2f|", 3.14159));\nSystem.out.println(String.format("%b %c %x", true, \'z\', 255));\nSystem.out.println(String.format("%.2f", 2.675));\nSystem.out.println(String.format("%.2f", 0.125));\nSystem.out.println(String.format("%.1f", 0.05));\nSystem.out.println(String.format("%10s|%-10s|", "hi", "hi"));',
    'int[] nums = {5, 3, 9, 1};\nSystem.out.println(nums.length);\nSystem.out.println(Arrays.toString(nums));\nArrays.sort(nums);\nSystem.out.println(Arrays.toString(nums));\nint[] z = new int[3];\nz[1] = 7;\nSystem.out.println(Arrays.toString(z));\nString[] names = new String[2];\nSystem.out.println(Arrays.toString(names));\ndouble[] d = new double[2];\nSystem.out.println(Arrays.toString(d));\nboolean[] f = new boolean[2];\nSystem.out.println(Arrays.toString(f));',
    'int[][] grid = new int[3][4];\ngrid[1][2] = 5;\nSystem.out.println(grid.length + " " + grid[0].length);\nSystem.out.println(Arrays.deepToString(grid));\nint[][] g2 = {{1, 2}, {3, 4}};\nint sum = 0;\nfor (int[] row : g2) for (int v : row) sum += v;\nSystem.out.println(sum + " " + g2[1][0]);',
    'ArrayList<String> list = new ArrayList<>();\nlist.add("a");\nlist.add("b");\nlist.add(0, "z");\nSystem.out.println(list);\nSystem.out.println(list.size() + " " + list.get(1));\nlist.set(1, "q");\nlist.remove("b");\nSystem.out.println(list + " " + list.contains("z") + " " + list.indexOf("q"));\nList<Integer> nums = new ArrayList<>(List.of(4, 2, 8));\nnums.remove(0);\nSystem.out.println(nums);\nnums.remove(Integer.valueOf(8));\nSystem.out.println(nums + " " + nums.isEmpty());\nCollections.sort(list);\nSystem.out.println(list);',
    'List<Integer> n = new ArrayList<>();\nfor (int i = 1; i <= 6; i++) n.add(i * i);\nn.removeIf(x -> x % 2 == 0);\nSystem.out.println(n);\nn.forEach(x -> System.out.print(x + " "));\nSystem.out.println();\nn.sort((a, b) -> b - a);\nSystem.out.println(n);\nSystem.out.println(Collections.max(n) + " " + Collections.min(n));',
    'HashMap<String, Integer> ages = new HashMap<>();\nages.put("Zoe", 31);\nages.put("Al", 12);\nages.put("Mo", 4);\nages.put("Bea", 22);\nages.put("Kai", 9);\nSystem.out.println(ages);\nSystem.out.println(ages.get("Mo") + " " + ages.get("Nope") + " " + ages.getOrDefault("Nope", 0));\nfor (String k : ages.keySet()) System.out.print(k + " ");\nSystem.out.println();\nfor (Map.Entry<String, Integer> e : ages.entrySet()) System.out.print(e.getKey() + "=" + e.getValue() + ";");\nSystem.out.println();\nSystem.out.println(ages.values());\nages.remove("Al");\nSystem.out.println(ages.size() + " " + ages.containsKey("Al"));',
    'Map<String, Integer> counts = new HashMap<>();\nString[] words = "the cat and the hat and the bat".split(" ");\nfor (String w : words) counts.put(w, counts.getOrDefault(w, 0) + 1);\nSystem.out.println(counts);\nMap<Character, Integer> cc = new HashMap<>();\nfor (char c : "mississippi".toCharArray()) cc.merge(c, 1, (a, b) -> a + b);\nSystem.out.println(cc);\nTreeMap<String, Integer> t = new TreeMap<>(counts);\nSystem.out.println(t);\nMap<String, Integer> lm = new LinkedHashMap<>();\nlm.put("z", 1);\nlm.put("a", 2);\nSystem.out.println(lm);',
    'Map<Integer, String> m = new HashMap<>();\nfor (int i = 20; i > 0; i -= 3) m.put(i, "v" + i);\nSystem.out.println(m);\nHashSet<String> s = new HashSet<>();\nfor (String x : new String[]{"pear", "apple", "fig", "kiwi", "plum", "date", "lime", "apple"}) s.add(x);\nSystem.out.println(s + " " + s.size() + " " + s.contains("fig"));\nSet<Integer> nums = new HashSet<>(List.of(100, 5, 33, 17, 64));\nSystem.out.println(nums);\nTreeSet<String> ts = new TreeSet<>(s);\nSystem.out.println(ts);',
    'Map<String, Integer> big = new HashMap<>();\nString[] keys = {"alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima", "mike", "november", "oscar"};\nfor (int i = 0; i < keys.length; i++) big.put(keys[i], i);\nSystem.out.println(big.keySet());',
    'StringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 3; i++) sb.append(i).append(",");\nSystem.out.println(sb);\nsb.reverse();\nSystem.out.println(sb.toString() + " " + sb.length());\nSystem.out.println(new StringBuilder("hello").reverse());',
    'System.out.println(Math.max(3, 7) + " " + Math.min(2.5, 1) + " " + Math.abs(-4) + " " + Math.pow(2, 10) + " " + Math.sqrt(16) + " " + Math.round(2.5) + " " + Math.round(-2.5) + " " + Math.floor(3.7) + " " + Math.ceil(3.2));\nSystem.out.println(Integer.parseInt("42") + 1);\nSystem.out.println(Double.parseDouble("2.5") * 2);\nSystem.out.println(String.valueOf(12) + 3);\nSystem.out.println(Integer.MAX_VALUE + " " + Integer.MIN_VALUE);\nSystem.out.println(Character.isDigit(\'7\') + " " + Character.isLetter(\'7\') + " " + Character.toUpperCase(\'q\'));\nSystem.out.println((int) 3.99 + " " + (int) -3.99 + " " + (int) \'A\');',
    'static int fact(int n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}\nstatic double avg(int[] a) {\n  int s = 0;\n  for (int x : a) s += x;\n  return (double) s / a.length;\n}\nstatic void greet(String name) {\n  System.out.println("Hi " + name);\n}\nSystem.out.println(fact(10));\nSystem.out.println(avg(new int[]{1, 2, 4}));\ngreet("Mo");',
    'static int add(int a, int b) { return a + b; }\nstatic double add(double a, double b) { return a + b; }\nstatic String add(String a, String b) { return a + b; }\nSystem.out.println(add(2, 3));\nSystem.out.println(add(2.5, 3));\nSystem.out.println(add("ook", "!"));',
    'int day = 3;\nswitch (day) {\n  case 1:\n    System.out.println("Mon");\n    break;\n  case 3:\n    System.out.println("Wed");\n  case 4:\n    System.out.println("Thu");\n    break;\n  default:\n    System.out.println("?");\n}\nString fruit = "kiwi";\nswitch (fruit) {\n  case "apple", "pear" -> System.out.println("tree");\n  case "kiwi" -> System.out.println("vine");\n  default -> System.out.println("dunno");\n}\nint n = 2;\nString word = switch (n) {\n  case 1 -> "one";\n  case 2 -> "two";\n  default -> "many";\n};\nSystem.out.println(word);',
    'int i = 0;\nwhile (i < 3) {\n  System.out.print(i);\n  i++;\n}\ndo {\n  System.out.print("!");\n} while (false);\nfor (int j = 10; j > 0; j -= 4) System.out.print(" " + j);\nSystem.out.println();',
    'int x = 10;\nString r = x > 5 ? "big" : "small";\nSystem.out.println(r);\nint total = 0;\nfor (int k = 1; k <= 100; k++) {\n  if (k % 3 == 0) continue;\n  if (k > 10) break;\n  total += k;\n}\nSystem.out.println(total);\nx += 5;\nx *= 2;\nx -= 1;\nx /= 3;\nx %= 4;\nSystem.out.println(x);\nint y = 7;\ny += 2.9;\nSystem.out.println(y);',
    'try {\n  int[] a = new int[2];\n  a[5] = 1;\n} catch (ArrayIndexOutOfBoundsException e) {\n  System.out.println("Caught: " + e.getMessage());\n}\ntry {\n  int z = 0;\n  System.out.println(10 / z);\n} catch (ArithmeticException e) {\n  System.out.println(e.getMessage());\n} finally {\n  System.out.println("finally");\n}\ntry {\n  Integer.parseInt("12a");\n} catch (NumberFormatException e) {\n  System.out.println(e.getMessage());\n}\ntry {\n  String s = null;\n  s.length();\n} catch (NullPointerException e) {\n  System.out.println("null!");\n}\ntry {\n  throw new IllegalArgumentException("bad age");\n} catch (RuntimeException e) {\n  System.out.println(e);\n}\ntry {\n  List<Integer> l = new ArrayList<>();\n  l.get(3);\n} catch (IndexOutOfBoundsException e) {\n  System.out.println(e.getMessage());\n}\ntry {\n  "abc".charAt(5);\n} catch (Exception e) {\n  System.out.println(e.getClass().getSimpleName());\n}',
    'int[] a = {1, 2};\nSystem.out.println("before");\nSystem.out.println(a[2]);',
    'System.out.println(5 / 0);',
    'String s = null;\nSystem.out.println(s);\nSystem.out.println("x" + s);',
    'class Dog {\n  String name;\n  int age;\n  Dog(String name, int age) {\n    this.name = name;\n    this.age = age;\n  }\n  void bark() {\n    System.out.println(name + " says woof");\n  }\n  int humanYears() {\n    return age * 7;\n  }\n  @Override\n  public String toString() {\n    return "Dog(" + name + ", " + age + ")";\n  }\n}\nDog d = new Dog("Rex", 3);\nd.bark();\nSystem.out.println(d.humanYears());\nSystem.out.println(d);\nDog e = d;\ne.name = "Max";\nSystem.out.println(d.name);',
    'class Counter {\n  static int made = 0;\n  private int count;\n  Counter() { made++; }\n  void add() { count++; }\n  int get() { return count; }\n}\nCounter a = new Counter();\nCounter b = new Counter();\na.add();\na.add();\nb.add();\nSystem.out.println(a.get() + " " + b.get() + " " + Counter.made);',
    'abstract class Animal {\n  protected String name;\n  Animal(String name) { this.name = name; }\n  abstract String sound();\n  void speak() { System.out.println(name + ": " + sound()); }\n}\nclass Cat extends Animal {\n  Cat(String n) { super(n); }\n  String sound() { return "meow"; }\n}\nclass Lion extends Cat {\n  Lion(String n) { super(n); }\n  @Override\n  String sound() { return "ROAR (" + super.sound() + ")"; }\n}\nList<Animal> zoo = new ArrayList<>();\nzoo.add(new Cat("Tom"));\nzoo.add(new Lion("Leo"));\nfor (Animal a : zoo) a.speak();\nSystem.out.println(zoo.get(1) instanceof Cat);\nSystem.out.println(zoo.get(0) instanceof Lion);',
    'interface Shape {\n  double area();\n  default String describe() { return "Shape with area " + area(); }\n}\nclass Sq implements Shape {\n  double s;\n  Sq(double s) { this.s = s; }\n  public double area() { return s * s; }\n}\nclass Circle implements Shape {\n  double r;\n  Circle(double r) { this.r = r; }\n  public double area() { return Math.round(Math.PI * r * r * 100) / 100.0; }\n}\nShape[] shapes = {new Sq(3), new Circle(1)};\nfor (Shape s : shapes) System.out.println(s.describe());',
    'class TooHungry extends Exception {\n  TooHungry(String msg) { super(msg); }\n}\nstatic void eat(int n) throws TooHungry {\n  if (n > 3) throw new TooHungry("Only 3 bananas, not " + n);\n  System.out.println("Ate " + n);\n}\ntry {\n  eat(2);\n  eat(9);\n} catch (TooHungry e) {\n  System.out.println("Oops: " + e.getMessage());\n}',
    'enum Level { LOW, MEDIUM, HIGH }\nLevel l = Level.MEDIUM;\nSystem.out.println(l);\nSystem.out.println(l.ordinal() + " " + l.name());\nswitch (l) {\n  case LOW: System.out.println("chill"); break;\n  case MEDIUM: System.out.println("ok"); break;\n  default: System.out.println("yikes");\n}\nfor (Level x : Level.values()) System.out.print(x + " ");\nSystem.out.println(l == Level.MEDIUM);',
    'import java.util.function.*;\nFunction<Integer, Integer> twice = x -> x * 2;\nBiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;\nPredicate<String> isLong = s -> s.length() > 3;\nSupplier<String> hi = () -> "hi";\nSystem.out.println(twice.apply(5) + " " + add.apply(2, 3) + " " + isLong.test("ook") + " " + hi.get());\nRunnable r = () -> System.out.println("run!");\nr.run();',
    'public class Main {\n  static int square(int n) {\n    return n * n;\n  }\n  public static void main(String[] args) {\n    System.out.println(square(9));\n    System.out.println(args.length);\n  }\n}',
    'import java.util.*;\n\npublic class Main {\n  static class Point {\n    int x, y;\n    Point(int x, int y) { this.x = x; this.y = y; }\n  }\n  public static void main(String[] args) {\n    List<Point> ps = new ArrayList<>();\n    ps.add(new Point(1, 2));\n    ps.add(new Point(3, 4));\n    int t = 0;\n    for (Point p : ps) t += p.x * p.y;\n    System.out.println(t);\n  }\n}',
    'String text = "Hello World";\nint vowels = 0;\nfor (char c : text.toLowerCase().toCharArray()) {\n  if ("aeiou".indexOf(c) >= 0) vowels++;\n}\nSystem.out.println(vowels);\nString rev = "";\nfor (int i = text.length() - 1; i >= 0; i--) rev += text.charAt(i);\nSystem.out.println(rev);',
    'long total = 0;\nfor (int i = 1; i <= 20; i++) total += i * 1000000;\nSystem.out.println(total);\nlong f = 1;\nfor (int i = 1; i <= 15; i++) f *= i;\nSystem.out.println(f);\nint ov = 1;\nfor (int i = 1; i <= 15; i++) ov *= i;\nSystem.out.println(ov);',
    'double price = 19.99;\nint qty = 3;\ndouble total = price * qty;\nSystem.out.println(total);\nSystem.out.println(Math.round(total * 100) / 100.0);\nSystem.out.printf("%.2f%n", total);\nint pct = (int) (0.457 * 100);\nSystem.out.println(pct + "%");',
    'List<String> names = new ArrayList<>(List.of("Mo", "Ava", "Zed"));\nfor (String n : names) {\n  if (n.equals("Ava")) names.remove(n);\n}\nSystem.out.println(names);',
    'List<String> names = new ArrayList<>(List.of("Mo", "Ava", "Zed"));\nfor (String n : names) {\n  if (n.equals("Mo")) names.remove(n);\n}\nSystem.out.println(names);',
    'List<Integer> fixed = List.of(1, 2, 3);\nSystem.out.println(fixed);\nfixed.add(4);',
    'int x;\nSystem.out.println(x);',
    'int n = "five";',
    'int n = 3.5;',
    'String s = "a";\nif (s.length()) System.out.println("x");',
    'Object o = "hello";\nif (o instanceof String str) System.out.println(str.length());\nSystem.out.println(o.equals("hello"));',
    'int[] scores = {90, 72, 85};\nint best = scores[0];\nfor (int s : scores) best = Math.max(best, s);\nSystem.out.println("Best: " + best);\nint[] copy = Arrays.copyOf(scores, 5);\nSystem.out.println(Arrays.toString(copy));\nint[] same = scores;\nsame[0] = 0;\nSystem.out.println(scores[0]);',
    'String a = "ook";\nString b = "OOK".toLowerCase();\nSystem.out.println(a.equals(b));\nSystem.out.println(a.hashCode());\nSystem.out.println("".isEmpty() + " " + " ".isBlank());',
    'class Account {\n  private double balance;\n  public void deposit(double amt) {\n    if (amt <= 0) throw new IllegalArgumentException("Deposit must be positive");\n    balance += amt;\n  }\n  public double getBalance() { return balance; }\n}\nAccount acc = new Account();\nacc.deposit(50);\ntry {\n  acc.deposit(-5);\n} catch (IllegalArgumentException e) {\n  System.out.println(e.getMessage());\n}\nSystem.out.println(acc.getBalance());',
    'static int fib(int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }\nfor (int i = 0; i < 10; i++) System.out.print(fib(i) + " ");\nSystem.out.println();',
    'throw new IllegalStateException("game over");',
    'class Box {\n  int v;\n}\nBox b = new Box();\nSystem.out.println(b.v);\nBox n = null;\nSystem.out.println(n.v);',
    'char grade = \'B\';\nswitch (grade) {\n  case \'A\' -> System.out.println("Top");\n  case \'B\', \'C\' -> {\n    System.out.println("Good");\n    System.out.println("Keep going");\n  }\n  default -> System.out.println("Hmm");\n}',
    'Map<String, List<Integer>> m = new TreeMap<>();\nm.put("b", new ArrayList<>());\nm.get("b").add(1);\nm.computeIfAbsent("a", k -> new ArrayList<>()).add(9);\nm.computeIfAbsent("a", k -> new ArrayList<>()).add(8);\nSystem.out.println(m);',
    'var nums = new ArrayList<Integer>();\nnums.add(3);\nvar total = 0;\nfor (var n : nums) total += n;\nSystem.out.println(total);\nfinal int LIMIT = 5;\nSystem.out.println(LIMIT * 2);',
    'int[] a = {3, 1, 2};\nint[] b = a.clone();\nArrays.sort(b);\nSystem.out.println(Arrays.toString(a) + Arrays.toString(b));\nInteger[] boxed = {3, 1, 2};\nArrays.sort(boxed, (x, y) -> y - x);\nSystem.out.println(Arrays.toString(boxed));',
    'String s = "Ook";\ns += 1 + 2;\nSystem.out.println(s);\ns = 1 + 2 + s;\nSystem.out.println(s);\nSystem.out.println("Sum: " + (1 + 2));\nSystem.out.println(1 + 2 + "3" + 4 + 5);',
    'class Node {\n  int val;\n  Node next;\n  Node(int v) { val = v; }\n}\nNode head = new Node(1);\nhead.next = new Node(2);\nhead.next.next = new Node(3);\nint s = 0;\nfor (Node n = head; n != null; n = n.next) s += n.val;\nSystem.out.println(s);',
    'class Pt {\n  int x, y;\n  Pt(int x, int y) { this.x = x; this.y = y; }\n  @Override\n  public boolean equals(Object o) {\n    if (!(o instanceof Pt)) return false;\n    Pt p = (Pt) o;\n    return x == p.x && y == p.y;\n  }\n  @Override\n  public int hashCode() { return Objects.hash(x, y); }\n  public String toString() { return "(" + x + "," + y + ")"; }\n}\nSet<Pt> seen = new HashSet<>();\nseen.add(new Pt(1, 2));\nseen.add(new Pt(1, 2));\nseen.add(new Pt(0, 5));\nSystem.out.println(seen.size() + " " + seen.contains(new Pt(0, 5)));\nSystem.out.println(new Pt(3, 4).equals(new Pt(3, 4)));',
    'class Player implements Comparable<Player> {\n  String n; int s;\n  Player(String n, int s) { this.n = n; this.s = s; }\n  public int compareTo(Player o) { return o.s - s; }\n  public String toString() { return n + ":" + s; }\n}\nList<Player> ps = new ArrayList<>();\nps.add(new Player("a", 5));\nps.add(new Player("b", 9));\nps.add(new Player("c", 7));\nCollections.sort(ps);\nSystem.out.println(ps);\nps.sort((x, y) -> x.n.compareTo(y.n));\nSystem.out.println(ps);',
    'double d = 7;\nSystem.out.println(d);\ndouble avg = (3 + 4) / 2;\nSystem.out.println(avg);\nfloat ff = 2;\nint i = \'a\';\nSystem.out.println(i);\nlong big = 5;\nSystem.out.println(big + 1);\nSystem.out.println(10 / 4 * 4.0);',
    'int count = 0;\nfor (int i = 0; i < 5; i++)\n  for (int j = i; j < 5; j++)\n    count++;\nSystem.out.println(count);\nint n = 12345, digits = 0;\nwhile (n > 0) { n /= 10; digits++; }\nSystem.out.println(digits);',
]


def load_course():
    src = "\n".join((ROOT / "src" / "courses" / f).read_text() for f in COURSE_FILES)
    js = src + "\nconsole.log(JSON.stringify({java: typeof COURSE_JAVA!=='undefined'?COURSE_JAVA:null, ch: typeof CHALLENGES!=='undefined'?(CHALLENGES.java||[]):[], pools: typeof POOLS_EXTRA!=='undefined'?(POOLS_EXTRA.java||{}):{}},(k,v)=>v instanceof RegExp?{re:v.source}:v));"
    out = subprocess.run(["node", "-"], input=js, capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def norm(text):
    lines = [l.rstrip() for l in str(text).strip("\n").split("\n")]
    return "\n".join(lines).strip()


def snippets(course, ch, pools):
    if course:
        for unit in course["units"]:
            for l in unit["lessons"]:
                for code, opts in l.get("pool", []):
                    yield l["id"], "game", code, opts[0]
                for i, s in enumerate(l.get("steps", [])):
                    if s["type"] == "talk" and s.get("demo"):
                        yield l["id"], f"step {i} demo", s["demo"], None
                    if s["type"] == "quiz" and s.get("code"):
                        yield l["id"], f"step {i} quiz", s["code"], s["opts"][s["a"]] if "does this print" in s["q"] else None
                    if s["type"] == "fill":
                        yield l["id"], f"step {i} fill", re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"]), "\n".join(s["out"]) if isinstance(s.get("out"), list) else s.get("out")
                    if s["type"] == "order":
                        yield l["id"], f"step {i} order", "\n".join(s["lines"]), "\n".join(s["out"]) if isinstance(s.get("out"), list) else s.get("out")
                    if s["type"] == "code":
                        yield l["id"], f"step {i} answer", s["hint"], "\n".join(s["out"]) if s.get("out") else None
                        for j, (pat, rep, outs) in enumerate(s.get("variants", [])):
                            yield l["id"], f"step {i} variant {j}", re.sub(pat["re"] if isinstance(pat, dict) else pat, rep, s["hint"], count=1), "\n".join(outs)
    for c in ch:
        yield "challenge", c.get("title", "?"), c["hint"], "\n".join(c["out"]) if c.get("out") else None
    for lid, rounds in pools.items():
        for code, opts in rounds:
            yield lid, "rush", code, opts[0]


# ---------- real Java ----------
HEAD = "import java.util.*;\nimport java.util.function.*;\n"
TOP = re.compile(r"^(?:(?:public|private|protected|abstract|final|static)\s+)*(class|interface|enum|record)\b")


def split_snippet(code):
    """Returns (imports, classes, methods, body) for the short form."""
    imports, classes, methods, body = [], [], [], []
    lines = code.split("\n")
    i = 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith("import "):
            imports.append(ln)
            i += 1
            continue
        kind = "class" if TOP.match(ln) else "method" if ln.startswith("static ") or ln.startswith("@") else None
        if kind:
            block, depth, started = [], 0, False
            while i < len(lines):
                block.append(lines[i])
                depth += lines[i].count("{") - lines[i].count("}")
                started = started or "{" in lines[i]
                i += 1
                if started and depth <= 0:
                    break
            (classes if kind == "class" or (block and TOP.match(block[-1].lstrip())) else methods).append("\n".join(block))
            continue
        body.append(ln)
        i += 1
    return imports, classes, methods, "\n".join(body)


def wrap(code, name):
    if re.search(r"static\s+void\s+main\s*\(", code):
        imports = [l for l in code.split("\n") if l.startswith("import ")]
        rest = "\n".join(l for l in code.split("\n") if not l.startswith("import "))
        rest = re.sub(r"(?m)^(public\s+)?(abstract\s+)?(class|interface|enum)\b", lambda m: "static " + (m.group(2) or "") + m.group(3), rest)
        return HEAD + "\n".join(imports) + f"\npublic class {name} {{\n{rest}\n}}\n"
    imports, classes, methods, body = split_snippet(code)
    cls = "\n".join(re.sub(r"^(public\s+)?(abstract\s+)?(final\s+)?(class|interface|enum|record)\b", lambda m: "static " + (m.group(2) or "") + (m.group(3) or "") + m.group(4), c) for c in classes)
    return HEAD + "\n".join(imports) + f"\npublic class {name} {{\n{cls}\n" + "\n".join(methods) + "\npublic static void main(String[] args) throws Exception {\n" + body + "\n}\n}\n"


RUNNER = r'''
import java.io.*; import java.lang.reflect.*; import java.util.*;
public class Runner {
  static Method findMain(Class<?> c) {
    try { return c.getDeclaredMethod("main", String[].class); } catch (Exception e) {}
    for (Class<?> k : c.getDeclaredClasses()) { Method m = findMain(k); if (m != null) return m; }
    return null;
  }
  public static void main(String[] a) throws Exception {
    PrintStream real = System.out;
    for (String n : a) {
      ByteArrayOutputStream b = new ByteArrayOutputStream() {
        public synchronized void write(byte[] x, int o, int l) { if (size() > 200000) throw new Error("TOOMUCH"); super.write(x, o, l); }
        public synchronized void write(int x) { if (size() > 200000) throw new Error("TOOMUCH"); super.write(x); }
      };
      PrintStream ps = new PrintStream(b, true, "UTF-8");
      System.setOut(ps);
      String err = "";
      try { Method m = findMain(Class.forName(n)); m.setAccessible(true); m.invoke(null, (Object) new String[0]); }
      catch (InvocationTargetException e) { Throwable t = e.getCause(); err = "TOOMUCH".equals(t.getMessage()) ? "TIMEOUT" : "Exception in thread \"main\" " + t.toString(); }
      catch (Throwable t) { err = "RUNNER " + t; }
      ps.flush(); System.setOut(real);
      Base64.Encoder enc = Base64.getEncoder();
      real.println(n + " " + enc.encodeToString(b.toByteArray()) + " " + enc.encodeToString(err.getBytes("UTF-8")));
    }
  }
}
'''


def run_java(codes):
    """Returns a list of (status, stdout, err) where status is ok / compile."""
    results = [None] * len(codes)
    with tempfile.TemporaryDirectory() as d:
        dd = pathlib.Path(d)
        (dd / "Runner.java").write_text(RUNNER)
        files = {}
        for i, c in enumerate(codes):
            f = dd / f"S{i}.java"
            f.write_text(wrap(c, f"S{i}"))
            files[i] = f
        pending = dict(files)
        out = dd / "out"
        out.mkdir()
        for _ in range(30):
            r = subprocess.run(["javac", "-nowarn", "-Xmaxerrs", "100000", "-d", str(out), str(dd / "Runner.java")] + [str(f) for f in pending.values()], capture_output=True, text=True)
            if r.returncode == 0:
                break
            bad = set()
            for m in re.finditer(r"S(\d+)\.java:(\d+): error: (.*)", r.stderr):
                i = int(m.group(1))
                bad.add(i)
                if results[i] is None:
                    results[i] = ("compile", "", m.group(3))
            if not bad:
                print(r.stderr[-3000:])
                sys.exit("javac failed")
            for i in bad:
                pending.pop(i, None)
        names = [f"S{i}" for i in pending]
        r = subprocess.run(["java", "-Xss8m", "-cp", str(out), "Runner"] + names, capture_output=True, text=True, timeout=600)
        if r.returncode: print("runner stderr:", r.stderr[-1500:])
        for line in r.stdout.splitlines():
            parts = line.split(" ")
            if len(parts) != 3 or not parts[0].startswith("S"):
                continue
            i = int(parts[0][1:])
            o = base64.b64decode(parts[1]).decode()
            e = base64.b64decode(parts[2]).decode()
            e = re.sub(r"S\d+\$", "", e)
            results[i] = ("ok", o, e)
    return results


def run_tmc(codes):
    script = (ROOT / "src" / "engines" / "clike.js").read_text() + """
const I=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(I.map(c=>TMC.run(c,"java"))));"""
    tmp = ROOT / "tests" / ".java-tmc.js"
    tmp.write_text(script)
    try:
        r = subprocess.run(["node", str(tmp)], input=json.dumps(codes), capture_output=True, text=True)
        if r.returncode:
            print(r.stderr[-3000:])
            sys.exit(1)
        return json.loads(r.stdout)
    finally:
        tmp.unlink()


def main():
    data = load_course()
    items = list(snippets(data["java"], data["ch"], data["pools"]))
    items += [("extra", f"extra {i}", c, None) for i, c in enumerate(EXTRA)]
    codes = [c for _, _, c, _ in items]
    real = run_java(codes)
    mine = run_tmc(codes)
    problems, compared, frags = [], 0, 0
    for (lid, what, code, exp), rj, tm in zip(items, real, mine):
        status, rout, rerr = rj if rj else ("compile", "", "?")
        terr = tm["error"] or ""
        fragment = (what.endswith(("fill", "order")) or "quiz" in what) and exp is None
        if status == "compile":
            if fragment:
                frags += 1
                continue
            if not terr or ("error" not in terr.split(":")[0] and "Not supported" not in terr):
                problems.append(f"{lid} {what}: javac rejects it ({rerr}) but TypeMonkey ran it: {norm(tm['out'])[:80]!r} {terr}\n    {code[:240]!r}")
            elif VERBOSE:
                print(f"  ok {lid} {what}: both reject. javac: {rerr} | TypeMonkey: {terr[:100]}")
            compared += 1
            continue
        compared += 1
        if rerr == "TIMEOUT":
            if not terr.startswith("Stopped"):
                problems.append(f"{lid} {what}: Java never stops but TypeMonkey finished: {terr}")
            continue
        if norm(tm["out"]) != norm(rout):
            problems.append(f"{lid} {what}: Java prints {norm(rout)!r}, TypeMonkey prints {norm(tm['out'])!r} {terr}\n    {code[:240]!r}")
            continue
        short = lambda e: e.split(": ")[0] if "NullPointerException" in e else e.split(" (")[0]
        if (rerr or terr) and short(rerr) != short(terr):
            problems.append(f"{lid} {what}: Java error {rerr!r}, TypeMonkey error {terr!r}\n    {code[:240]!r}")
            continue
        flat = lambda t: " ".join(l for l in norm(t).split("\n") if l.strip())
        if exp is not None and flat(exp) != flat(rout):
            problems.append(f"{lid} {what}: answer marked correct is {norm(exp)!r} but Java prints {norm(rout)!r}\n    {code[:240]!r}")
            continue
        if VERBOSE:
            print(f"  ok {lid} {what}: {norm(rout)[:80]!r} {rerr}")
    for p in problems:
        print("✖", p)
    print(f"Java: {compared} snippets compared with real Java ({frags} fill/order fragments skipped). {len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
