/* C# course. Needs a compiler, so exercises are read-and-reason: quizzes, fill, order, output rush. Units 2–4 live in csharp-units-2-4.js */

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
CS_UNIT2,CS_UNIT3,CS_UNIT4
]};

