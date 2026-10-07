/* C# and C++ courses · Unit 1 built, later units on the roadmap.
   These languages need a compiler, so exercises are read-and-reason: quizzes, fill, order, output rush. */
COURSE_JS.blurb="From your first console.log to building a game leaderboard. 25 lessons with real code you run yourself. Unit 1 is free.";

const COURSE_CS={id:"cs",name:"C#",blurb:"The language behind Unity games, Windows apps and tons of backend systems. Unit 1 is free.",units:[
{name:"Hello, C#",free:true,lessons:[
{id:"cs1",title:"Hello, Console",sub:"Console.WriteLine and the Main method",steps:[
 {type:"talk",title:"Meet C#",mood:"cheer",
  body:`<p>C# (say "C sharp") powers Unity games, Windows apps and big company servers. It's stricter than JavaScript, and that strictness catches bugs early.</p>`,
  say:"If you finished JavaScript, a lot of this will feel familiar!"},
 {type:"talk",title:"Printing a line",
  body:`<p>${C("Console.WriteLine()")} prints text and moves to a new line. Every statement ends with a semicolon ${C(";")}. Your program starts running inside ${C("Main")}.</p>`,
  demo:`using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, world!");\n    Console.WriteLine("I'm learning C#");\n  }\n}`,
  say:"Output:\nHello, world!\nI'm learning C#"},
 {type:"talk",title:"Write vs WriteLine",mood:"think",
  body:`<p>${C("Console.Write()")} prints <b>without</b> starting a new line, so the next print continues on the same line.</p>`,
  demo:`Console.Write("Ook ");\nConsole.Write("ook ");\nConsole.WriteLine("OOK!");\nConsole.WriteLine("Done");`,
  say:"That prints \"Ook ook OOK!\" on one line, then \"Done\" below it."},
 {type:"quiz",q:"What does every C# statement end with?",opts:[";",".",":","Nothing"],a:0,mono:true,why:"Forget a semicolon and the compiler refuses to build your program."},
 {type:"fill",title:"Print it",body:`<p>Print Hello, then move to a new line.</p>`,
  code:`Console.[0]("Hello")[1]`,blanks:["WriteLine",";"],tokens:["WriteLine",";","log","print"],why:"Console.WriteLine(...); is C#'s console.log."},
 {type:"order",title:"Build a program",body:`<p>Put the lines in a working order.</p>`,
  lines:["class Program {","  static void Main() {","    Console.WriteLine(\"Hi!\");","  }","}"],why:"The class holds Main, and Main holds your code."},
 {type:"quiz",q:"What does this print?",code:`Console.Write("A");\nConsole.Write("B");\nConsole.WriteLine("C");`,opts:["ABC","A B C","A\nB\nC"],a:0,mono:true,why:"Write doesn't add a new line, so all three end up together."},
 {type:"game"},{type:"done"}],
 pool:[
  [`Console.WriteLine("Hi" + "!");`,["Hi!","Hi +!","Hi !"]],
  [`Console.Write("x");\nConsole.Write("y");`,["xy","x y","yx"]],
  [`Console.WriteLine(2 + 3);`,["5","23","2 + 3"]],
  [`Console.WriteLine("2" + 3);`,["23","5","Error"]],
  [`Console.WriteLine("ook".ToUpper());`,["OOK","ook","Ook"]],
  [`Console.WriteLine("monkey".Length);`,["6","5","monkey"]]
 ]},
{id:"cs2",title:"Variables & types",sub:"int, double, string, bool, var",steps:[
 {type:"talk",title:"Every box has a type",
  body:`<p>In C#, you say what <b>type</b> a variable holds: ${C("int")} for whole numbers, ${C("double")} for decimals, ${C("string")} for text and ${C("bool")} for true/false.</p>`,
  demo:`int lives = 3;\ndouble price = 1.99;\nstring name = "Mo";\nbool hungry = true;\nConsole.WriteLine(name);\nConsole.WriteLine(lives);`,
  say:"Try putting text in an int and C# won't even build. That's the safety net."},
 {type:"talk",title:"String interpolation",mood:"cheer",
  body:`<p>Put ${C("$")} before a string and drop variables inside ${C("{ }")}. It's like JavaScript's template literals.</p>`,
  demo:`string name = "Mo";\nint age = 4;\nConsole.WriteLine($"{name} is {age} years old");\nConsole.WriteLine($"Next year: {age + 1}");`,
  say:"Output:\nMo is 4 years old\nNext year: 5"},
 {type:"talk",title:"var: let C# figure it out",mood:"think",
  body:`<p>${C("var")} lets the compiler work out the type from the value. The type is still fixed after that.</p>`,
  demo:`var score = 10;     // int\nvar city = "Lima";  // string\nscore = 20;         // fine\n// score = "high";  // error: score is an int`,
  say:"var saves typing, but the variable still has one type forever."},
 {type:"quiz",q:"Which type holds 3.14?",opts:["double","int","string","bool"],a:0,mono:true,why:"Decimals go in double. int is only for whole numbers."},
 {type:"fill",title:"Pick the types",body:`<p>Match each value with its type.</p>`,
  code:`[0] coins = 50;\n[1] pet = "owl";\n[2] isAwake = false;`,blanks:["int","string","bool"],tokens:["int","string","bool","double"],why:"Whole number → int, text → string, true/false → bool."},
 {type:"quiz",q:"What does this print?",code:`bool ready = true;\nConsole.WriteLine(ready);`,opts:["True","true","1"],a:0,mono:true,why:"C# prints booleans with a capital letter: True and False."},
 {type:"quiz",q:"Which line won't compile?",opts:["int x = \"five\";","int x = 5;","string s = \"5\";"],a:0,mono:true,why:"You can't put a string into an int box."},
 {type:"game"},{type:"done"}],
 pool:[
  [`int a = 4;\na = a + 1;\nConsole.WriteLine(a);`,["5","4","a + 1"]],
  [`string s = "ab";\ns += "c";\nConsole.WriteLine(s);`,["abc","ab","c"]],
  [`int x = 3;\nConsole.WriteLine($"x={x}");`,["x=3","x={x}","$x=3"]],
  [`bool b = false;\nConsole.WriteLine(b);`,["False","false","0"]],
  [`double d = 2.5;\nConsole.WriteLine(d * 2);`,["5","5.5","2.52.5"]],
  [`var n = 7;\nn++;\nConsole.WriteLine(n);`,["8","7","n++"]]
 ]},
{id:"cs3",title:"Math & decisions",sub:"integer division, %, if / else",steps:[
 {type:"talk",title:"Integer division surprise",mood:"oops",
  body:`<p>When you divide two ${C("int")}s, C# throws away the decimal part. Use a ${C("double")} if you want the decimal.</p>`,
  demo:`Console.WriteLine(7 / 2);     // 3\nConsole.WriteLine(7.0 / 2);   // 3.5\nConsole.WriteLine(7 % 2);     // 1`,
  say:"This trips up everyone once. Now it won't trip you."},
 {type:"talk",title:"if / else",
  body:`<p>Decisions look almost exactly like JavaScript. Comparisons use ${C("==")} in C#, and conditions need parentheses.</p>`,
  demo:`int hunger = 8;\nif (hunger > 5) {\n  Console.WriteLine("Banana time!");\n} else if (hunger > 2) {\n  Console.WriteLine("Snack time");\n} else {\n  Console.WriteLine("All good");\n}`,
  say:"hunger is 8, so it prints \"Banana time!\""},
 {type:"quiz",q:"What does this print?",code:`Console.WriteLine(9 / 2);`,opts:["4","4.5","5"],a:0,mono:true,why:"int / int drops the decimal, so 4.5 becomes 4."},
 {type:"fill",title:"Even check",body:`<p>Print "even" when n divides by 2 with nothing left over.</p>`,
  code:`int n = 6;\nif (n [0] 2 [1] 0) {\n  Console.WriteLine("even");\n}`,blanks:["%","=="],tokens:["%","==","/","="],why:"n % 2 == 0 means 'no remainder', so it's even."},
 {type:"quiz",q:"What does this print?",code:`int t = 15;\nif (t > 20) {\n  Console.WriteLine("hot");\n} else {\n  Console.WriteLine("cool");\n}`,opts:["cool","hot","15"],a:0,mono:true,why:"15 > 20 is false, so the else runs."},
 {type:"quiz",q:"Which operator means AND in C#?",opts:["&&","and","&|"],a:0,mono:true,why:"Same as JavaScript: && is and, || is or."},
 {type:"game"},{type:"done"}],
 pool:[
  [`Console.WriteLine(10 / 4);`,["2","2.5","3"]],
  [`Console.WriteLine(10.0 / 4);`,["2.5","2","3"]],
  [`Console.WriteLine(10 % 4);`,["2","2.5","0"]],
  [`int a = 3;\nif (a == 3) {\n  Console.WriteLine("yes");\n}`,["yes","no","True"]],
  [`Console.WriteLine(5 > 3 && 2 > 4);`,["False","True","false"]],
  [`int x = 2 + 3 * 2;\nConsole.WriteLine(x);`,["8","10","7"]]
 ]}
]},
{name:"Loops & methods",lessons:[
 {id:"cs4",title:"for and while",sub:"repeating code in C#"},
 {id:"cs5",title:"Methods",sub:"parameters, return types, void"},
 {id:"cs6",title:"Project: Number guesser",sub:"loops + methods together",project:true}]},
{name:"Classes & objects",lessons:[
 {id:"cs7",title:"Your first class",sub:"fields, constructors, new"},
 {id:"cs8",title:"Properties & methods",sub:"get, set, and behavior"},
 {id:"cs9",title:"Project: Virtual pet",sub:"a class that lives and breathes",project:true}]},
{name:"Collections",lessons:[
 {id:"cs10",title:"Arrays & Lists",sub:"List&lt;T&gt;, Add, Count, foreach"},
 {id:"cs11",title:"Dictionaries",sub:"key and value lookups"},
 {id:"cs12",title:"Project: Inventory system",sub:"like a game backpack",project:true}]}
]};

const COURSE_CPP={id:"cpp",name:"C++",blurb:"The speed-demon language behind game engines, browsers and robots. Unit 1 is free.",units:[
{name:"Hello, C++",free:true,lessons:[
{id:"cpp1",title:"Hello, C++",sub:"#include, main, std::cout",steps:[
 {type:"talk",title:"Meet C++",mood:"cheer",
  body:`<p>C++ is one of the fastest languages around. Game engines like Unreal, web browsers and robots use it. It gives you a lot of control, so it asks for a bit more care.</p>`,
  say:"Fast, powerful, and a little picky. Let's tame it."},
 {type:"talk",title:"Printing with cout",
  body:`<p>${C("#include &lt;iostream&gt;")} brings in input/output tools. Programs start in ${C("main()")}. You print by sending things into ${C("std::cout")} with ${C("&lt;&lt;")}.</p>`,
  demo:`#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  std::cout << "I'm learning C++" << std::endl;\n  return 0;\n}`,
  say:"std::endl ends the line. return 0 tells the computer 'all good'."},
 {type:"talk",title:"Chaining output",mood:"think",
  body:`<p>You can chain as many ${C("&lt;&lt;")} as you want. ${C("\"\\n\"")} is a shorter way to end a line.</p>`,
  demo:`std::cout << "Level " << 3 << "\\n";\nstd::cout << 2 + 2 << "\\n";`,
  say:"Output:\nLevel 3\n4"},
 {type:"quiz",q:"Where does a C++ program start running?",opts:["main()","start()","the first line","#include"],a:0,mono:true,why:"Every C++ program begins in main."},
 {type:"fill",title:"Print it",body:`<p>Print Hi and end the line.</p>`,
  code:`std::[0] [1] "Hi" << std::endl;`,blanks:["cout","<<"],tokens:["cout","<<",">>","print"],why:"std::cout << sends things to the screen. >> is for reading input."},
 {type:"order",title:"Build a program",body:`<p>Put the lines in a working order.</p>`,
  lines:["#include <iostream>","int main() {","  std::cout << \"Ook!\";","  return 0;","}"],why:"Include first, then main wraps your code and returns 0."},
 {type:"quiz",q:"What does this print?",code:`std::cout << "A" << "B" << "\\n";\nstd::cout << "C";`,opts:["AB\nC","ABC","A B C"],a:0,mono:true,why:"\\n ends the first line after AB, then C goes on the next line."},
 {type:"game"},{type:"done"}],
 pool:[
  [`std::cout << "Hi" << "!";`,["Hi!","Hi !","Hi << !"]],
  [`std::cout << 3 + 4;`,["7","34","3 + 4"]],
  [`std::cout << "3" << 4;`,["34","7","Error"]],
  [`std::cout << "x\\n" << "y";`,["x y","xy","x\\ny"]],
  [`std::cout << 10 - 2 * 3;`,["4","24","6"]],
  [`std::cout << "a" << " " << "b";`,["a b","ab","a  b"]]
 ]},
{id:"cpp2",title:"Variables & types",sub:"int, double, std::string, bool, auto",steps:[
 {type:"talk",title:"Typed boxes",
  body:`<p>Like C#, every C++ variable has a type: ${C("int")}, ${C("double")}, ${C("bool")}, and ${C("std::string")} for text (which needs ${C("#include &lt;string&gt;")}).</p>`,
  demo:`int lives = 3;\ndouble price = 1.99;\nstd::string name = "Mo";\nbool hungry = true;\nstd::cout << name << " has " << lives << " lives";`,
  say:"Output: Mo has 3 lives"},
 {type:"talk",title:"bool prints as a number",mood:"oops",
  body:`<p>Surprise: by default, C++ prints ${C("true")} as ${C("1")} and ${C("false")} as ${C("0")}.</p>`,
  demo:`bool a = true;\nbool b = false;\nstd::cout << a << " " << b;`,
  say:"Output: 1 0. Computers love ones and zeros."},
 {type:"talk",title:"auto",mood:"think",
  body:`<p>${C("auto")} lets the compiler pick the type from the value, like ${C("var")} in C#.</p>`,
  demo:`auto score = 10;     // int\nauto ratio = 0.5;    // double\nscore = score + 5;\nstd::cout << score;  // 15`,
  say:"The type still never changes after it's decided."},
 {type:"quiz",q:"What does this print?",code:`bool ok = true;\nstd::cout << ok;`,opts:["1","true","True"],a:0,mono:true,why:"C++ prints booleans as 1 and 0 by default."},
 {type:"fill",title:"Pick the types",body:`<p>Match each value with its type.</p>`,
  code:`[0] coins = 50;\n[1] speed = 2.5;\n[2] name = "Kai";`,blanks:["int","double","std::string"],tokens:["int","double","std::string","bool"],why:"Whole → int, decimal → double, text → std::string."},
 {type:"quiz",q:"Which header do you need for std::string?",opts:["#include <string>","#include <text>","#include <iostream> only"],a:0,mono:true,why:"<string> brings in std::string."},
 {type:"game"},{type:"done"}],
 pool:[
  [`int a = 5;\na += 2;\nstd::cout << a;`,["7","52","5"]],
  [`bool b = false;\nstd::cout << b;`,["0","false","False"]],
  [`std::string s = "ook";\nstd::cout << s.length();`,["3","ook","2"]],
  [`int x = 4;\nint y = x;\nx = 10;\nstd::cout << y;`,["4","10","0"]],
  [`double d = 1.5;\nstd::cout << d + d;`,["3","1.51.5","2"]],
  [`auto n = 9;\nn--;\nstd::cout << n;`,["8","9","10"]]
 ]},
{id:"cpp3",title:"Math & decisions",sub:"integer division, %, if / else",steps:[
 {type:"talk",title:"Integer division",mood:"oops",
  body:`<p>${C("int")} divided by ${C("int")} drops the decimal in C++ too. Make one side a decimal to keep it.</p>`,
  demo:`std::cout << 7 / 2 << "\\n";    // 3\nstd::cout << 7.0 / 2 << "\\n";  // 3.5\nstd::cout << 7 % 2 << "\\n";    // 1`,
  say:"Same trap as C#. You're now immune."},
 {type:"talk",title:"if / else",
  body:`<p>Decisions use the same shape you already know: ${C("if")}, ${C("else if")}, ${C("else")}, plus ${C("==")}, ${C("&amp;&amp;")} and ${C("||")}.</p>`,
  demo:`int score = 84;\nif (score >= 90) {\n  std::cout << "A";\n} else if (score >= 80) {\n  std::cout << "B";\n} else {\n  std::cout << "Keep going";\n}`,
  say:"84 lands on B."},
 {type:"quiz",q:"What does this print?",code:`std::cout << 11 / 3;`,opts:["3","3.67","4"],a:0,mono:true,why:"11 / 3 is 3 with the decimal dropped."},
 {type:"fill",title:"Both must be true",body:`<p>Print "Go" only if ready AND fueled.</p>`,
  code:`bool ready = true;\nbool fueled = true;\nif (ready [0] fueled) {\n  std::cout << "Go";\n}`,blanks:["&&"],tokens:["&&","||","==","and"],why:"&& requires both sides to be true."},
 {type:"quiz",q:"What does this print?",code:`int x = 5;\nif (x = 0) {\n  std::cout << "zero";\n} else {\n  std::cout << "not zero";\n}`,opts:["not zero","zero","5"],a:0,mono:true,why:"Bug alert! x = 0 ASSIGNS 0 (which counts as false). You wanted x == 0. Classic C++ trap."},
 {type:"game"},{type:"done"}],
 pool:[
  [`std::cout << 9 / 2;`,["4","4.5","5"]],
  [`std::cout << 9.0 / 2;`,["4.5","4","5"]],
  [`std::cout << 9 % 4;`,["1","2","0"]],
  [`int a = 2;\nif (a > 1) std::cout << "big";\nelse std::cout << "small";`,["big","small","bigsmall"]],
  [`std::cout << (3 > 2 && 1 > 5);`,["0","1","false"]],
  [`std::cout << (4 == 4);`,["1","true","4"]]
 ]}
]},
{name:"Loops & functions",lessons:[
 {id:"cpp4",title:"for and while",sub:"repeating code in C++"},
 {id:"cpp5",title:"Functions",sub:"return types, parameters, void"},
 {id:"cpp6",title:"Project: Times table",sub:"loops inside loops",project:true}]},
{name:"Memory & pointers",lessons:[
 {id:"cpp7",title:"References",sub:"another name for the same box"},
 {id:"cpp8",title:"Pointers",sub:"addresses, * and &"},
 {id:"cpp9",title:"Project: Swap machine",sub:"change values through pointers",project:true}]},
{name:"Classes & vectors",lessons:[
 {id:"cpp10",title:"std::vector",sub:"growable lists"},
 {id:"cpp11",title:"Your first class",sub:"members, constructors, methods"},
 {id:"cpp12",title:"Project: Monster battle",sub:"classes fighting it out",project:true}]}
]};
