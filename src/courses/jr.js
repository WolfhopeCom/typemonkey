/* TypeMonkey Jr. · ages 7–12 · no typing. Maze steps: grid rows use # tree, . path, S start, B banana.
   dir is the starting direction (N/E/S/W). blocks are the buttons offered. start pre-fills a (buggy) program.
   solution must reach the banana within max blocks (checked by tests/verify_course.py). */
const JF="fwd",JL="left",JRT="right",JIFR="ifR",JIFL="ifL",JCALL="call",jrep=(n,...body)=>({rep:n,body}),juntil=(...body)=>({until:true,body});

const JR_UNIT1={name:"Monkey moves",free:true,lessons:[
{id:"jr1",title:"First steps",sub:"a program is a list of steps",steps:[
 {type:"talk",title:"Hi, junior coder!",mood:"cheer",
  body:`<p>I'm TypeMonkey, and I'm SO hungry. Can you help me get to my bananas? 🍌</p><p>You'll give me <b>instructions</b>, one block at a time. A list of instructions is called a <b>program</b>. I follow your program exactly, step by step!</p>`,
  say:"Let's start easy. Tap Continue!"},
 {type:"maze",title:"Walk to the banana",body:`<p>Tap <b>Forward</b> to add steps, then press <b>Go!</b></p>`,grid:["S..B"],dir:"E",blocks:[JF],solution:[JF,JF,JF],say:"Count the squares between me and the banana!"},
 {type:"maze",title:"A longer walk",grid:["S....B"],dir:"E",blocks:[JF],solution:[JF,JF,JF,JF,JF],say:"How many steps this time?"},
 {type:"quiz",q:"What is a program?",opts:["A list of steps for a computer to follow","A kind of banana","A TV show"],a:0,why:"Programs are instructions. Computers follow them exactly, in order."},
 {type:"maze",title:"Going down",body:`<p>The little arrow shows which way I'm facing. Right now I'm facing down!</p>`,grid:["S","." ,".","B"],dir:"S",blocks:[JF],solution:[JF,JF,JF],say:"Forward always means the way my arrow points."},
 {type:"done"}]},
{id:"jr2",title:"Turning corners",sub:"turn left, turn right",steps:[
 {type:"talk",title:"Turning",mood:"think",
  body:`<p><b>Turn left</b> and <b>Turn right</b> spin me around without moving. Then <b>Forward</b> goes the new way.</p><p>Tip: turn the way <b>I</b> would turn, like you're walking in my shoes!</p>`,
  say:"Watch my arrow change when I turn."},
 {type:"maze",title:"Around the corner",grid:["S..#","##.#","##.B"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JF,JRT,JF,JF,JL,JF],say:"Walk, turn, walk, turn, walk!"},
 {type:"quiz",q:"TypeMonkey faces right ➜ and turns LEFT. Which way is he facing now?",opts:["Up ⬆","Down ⬇","Left ⬅"],a:0,why:"If you face right and turn left, you end up facing up."},
 {type:"maze",title:"Up the hill",grid:["##.B","##.#","S..#"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JF,JL,JF,JF,JRT,JF]},
 {type:"maze",title:"Zig and zag",grid:["S.##","#..#","##.B"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JRT,JF,JL,JF,JRT,JF,JL,JF],say:"Lots of turns! Take it one step at a time."},
 {type:"done"}]},
{id:"jr3",title:"Bug hunt",sub:"finding and fixing mistakes",steps:[
 {type:"talk",title:"What's a bug?",mood:"oops",
  body:`<p>A <b>bug</b> is a mistake in a program. Even expert coders make them every day! Finding and fixing bugs is called <b>debugging</b>.</p><p>In these puzzles, someone already wrote a program, but it has a bug. Press Go to see what goes wrong, then fix it. Tap a block to remove it.</p>`,
  say:"Let's squash some bugs! 🐛"},
 {type:"maze",title:"Not far enough",grid:["S...B"],dir:"E",blocks:[JF],start:[JF,JF,JF],solution:[JF,JF,JF,JF],say:"This program has a bug. Press Go and watch what happens."},
 {type:"maze",title:"Wrong turn",grid:["S..#","##.#","##.B"],dir:"E",blocks:[JF,JL,JRT],start:[JF,JF,JL,JF,JF,JL,JF],solution:[JF,JF,JRT,JF,JF,JL,JF],say:"Something turns the wrong way. Can you spot it?"},
 {type:"quiz",q:"What's it called when you find and fix mistakes in a program?",opts:["Debugging","Bananaing","Restarting"],a:0,why:"Coders debug all the time. It's a superpower!"},
 {type:"maze",title:"Bonk!",grid:["S.#","#.#","#.B"],dir:"E",blocks:[JF,JL,JRT],start:[JF,JF,JRT,JF,JF,JL,JF],solution:[JF,JRT,JF,JF,JL,JF],say:"Ouch, I keep hitting a tree! Fix the program."},
 {type:"done"}]}
]};

const JR_UNIT2={name:"Loops",lessons:[
{id:"jr4",title:"Repeat!",sub:"loops do things again and again",steps:[
 {type:"talk",title:"The Repeat block",mood:"cheer",
  body:`<p>Instead of Forward, Forward, Forward, Forward, Forward, you can say <b>Repeat 5 times: Forward</b>. That's called a <b>loop</b>!</p><p>Tap <b>Repeat</b>, add blocks inside it, then tap <b>done</b>. Tap the 🔁 number to change how many times it repeats.</p>`,
  say:"Loops make programs shorter. Coders LOVE short programs."},
 {type:"maze",title:"Use a loop",grid:["S....B"],dir:"E",blocks:[JF,"rep"],max:2,solution:[jrep(5,JF)],say:"Only 2 blocks allowed! Use Repeat."},
 {type:"quiz",q:"Repeat 3 times: Forward. How many steps forward is that?",opts:["3","1","4"],a:0,why:"The block inside runs 3 times."},
 {type:"maze",title:"The long way round",grid:["S....","####.","B...."],dir:"E",blocks:[JF,JL,JRT,"rep"],max:8,solution:[jrep(4,JF),JRT,jrep(2,JF),JRT,jrep(4,JF)],say:"You can use more than one Repeat!"},
 {type:"maze",title:"Staircase",grid:["S####","..###","#..##","##..#","###.B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(4,JRT,JF,JL,JF)],say:"Each stair is the same: turn, step, turn, step. Loop it!"},
 {type:"done"}]},
{id:"jr5",title:"Loop patterns",sub:"spot the part that repeats",steps:[
 {type:"talk",title:"Find the pattern",mood:"think",
  body:`<p>Before you build, look at the path. Do you see a shape that happens again and again? That's the part to put inside your Repeat.</p>`,
  say:"Coders call this pattern-spotting. It's a big part of thinking like a programmer."},
 {type:"quiz",q:"Which part repeats in: Forward, Turn, Forward, Turn, Forward, Turn?",opts:["Forward, Turn","Forward","Turn, Turn"],a:0,why:"Forward, Turn happens 3 times. So: Repeat 3 times: Forward, Turn."},
 {type:"maze",title:"Climb up",grid:["###.B","##..#","#..##","..###","S####"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(4,JL,JF,JRT,JF)],say:"Find the pattern that repeats on every step."},
 {type:"maze",title:"Around the pond",grid:["S..","##.","B.."],dir:"N",blocks:[JF,JL,JRT,"rep"],max:4,solution:[jrep(3,JRT,JF,JF)],say:"I'm facing up this time! Turn, walk two. Turn, walk two. See it?"},
 {type:"maze",title:"Broken loop",grid:["S#####","..####","#..###","##..##","###..#","####.B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,start:[jrep(4,JRT,JF,JL,JF)],solution:[jrep(5,JRT,JF,JL,JF)],say:"This loop has a bug! It doesn't repeat enough times."},
 {type:"done"}]},
{id:"jr6",title:"Jungle adventure",sub:"bigger mazes, all your skills",project:true,steps:[
 {type:"talk",title:"Into the jungle!",mood:"cheer",
  body:`<p>These mazes are bigger. Use everything you know: Forward, turns, and Repeat. Plan first, then build!</p>`,
  say:"I believe in you!"},
 {type:"maze",title:"River bend",grid:["S...#","###.#","#B..#"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:8,solution:[jrep(3,JF),JRT,jrep(2,JF),JRT,jrep(2,JF)]},
 {type:"maze",title:"Monkey bridge",grid:["S..#..","#.##.#","#....B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:7,solution:[JF,JRT,jrep(2,JF),JL,jrep(4,JF)]},
 {type:"maze",title:"Giant stairs",grid:["S#####","..####","#..###","##..##","###..#","####.B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(5,JRT,JF,JL,JF)]},
 {type:"done"}]}
]};

const JR_UNIT3={name:"Think like a coder",lessons:[
{id:"jr7",title:"Step by step",sub:"why order matters",steps:[
 {type:"talk",title:"Order matters",mood:"think",
  body:`<p>Computers do things in the exact order you say. If you put on your shoes before your socks... uh oh! 🧦👟</p>`,
  say:"Let's practice putting steps in order."},
 {type:"order",title:"Banana sandwich",body:`<p>Put the steps in order.</p>`,lines:["Get two slices of bread","Spread peanut butter","Add banana slices","Put the slices together"],why:"First the bread, then the toppings, then close it up!"},
 {type:"order",title:"Plant a seed",body:`<p>Put the steps in order.</p>`,lines:["Dig a hole","Drop in the seed","Cover it with soil","Water it"],why:"You can't cover the seed before it's in the hole!"},
 {type:"quiz",q:"Why does order matter in a program?",opts:["The computer does steps exactly in the order you give","It doesn't matter at all","Computers like alphabetical order"],a:0,why:"Change the order and you change what happens."},
 {type:"order",title:"Brush your teeth",body:`<p>One more!</p>`,lines:["Put toothpaste on the brush","Brush for two minutes","Spit","Rinse the brush"],why:"Nice sequencing! That's what coders call it."},
 {type:"done"}]},
{id:"jr8",title:"If this, then that",sub:"computers make choices",steps:[
 {type:"talk",title:"Making choices",mood:"cheer",
  body:`<p>Programs can make choices with <b>IF</b> and <b>THEN</b>. <b>IF</b> it's raining, <b>THEN</b> take an umbrella. <b>ELSE</b> (otherwise), wear sunglasses! 😎</p>`,
  say:"Games use IF all the time: IF you touch a coin, THEN add a point."},
 {type:"quiz",q:"IF the light is red, THEN…",opts:["Stop","Go","Dance"],a:0,why:"That's a rule drivers follow every day."},
 {type:"quiz",q:"TypeMonkey's rule: IF hungry THEN eat a banana, ELSE play. He is NOT hungry. What does he do?",opts:["Play","Eat a banana","Sleep"],a:0,why:"The IF part is false, so the ELSE part happens."},
 {type:"quiz",q:"In a game: IF you touch a star THEN you get a point. You touch 3 stars. How many points?",opts:["3","1","0"],a:0,why:"The rule happens every time you touch one."},
 {type:"quiz",q:"Which one is an IF-THEN rule?",opts:["IF it's cold THEN wear a coat","Jump three times","Bananas are yellow"],a:0,why:"It has a condition (cold) and an action (coat)."},
 {type:"done"}]},
{id:"jr9",title:"Banana Quest",sub:"the final challenge",project:true,steps:[
 {type:"talk",title:"The final quest!",mood:"cheer",
  body:`<p>This is it: the Banana Quest! Three tricky mazes stand between me and the Golden Banana. Use sequences, loops and debugging. You've got this!</p>`,
  say:"Ready? Let's go!"},
 {type:"maze",title:"The canyon",grid:["S.#B","#.#.","#..."],dir:"E",blocks:[JF,JL,JRT,"rep"],max:10,solution:[JF,JRT,jrep(2,JF),JL,jrep(2,JF),JL,jrep(2,JF)]},
 {type:"maze",title:"Buggy temple",grid:["S...","###.","###.","B..."],dir:"N",blocks:[JF,JL,JRT,"rep"],max:5,start:[jrep(3,JL,JF,JF,JF)],solution:[jrep(3,JRT,JF,JF,JF)],say:"The temple's program has a bug. Find it!"},
 {type:"maze",title:"The Golden Banana",grid:["S#####","..####","#..###","##..##","###..#","####.B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(5,JRT,JF,JL,JF)],win:"You found the Golden Banana! You're a real coder now!"},
 {type:"done"}]}
]};

const JR_UNIT4={name:"Smart monkey",lessons:[
{id:"jr10",title:"Banana hunt",sub:"collect every banana",steps:[
 {type:"talk",title:"So many bananas!",mood:"cheer",
  body:`<p>Some mazes have <b>lots</b> of bananas. I won't stop until I've eaten every single one! Plan a path that passes through all of them.</p>`,
  say:"Watch them disappear as I gobble them up. Nom nom!"},
 {type:"maze",title:"Banana row",grid:["SB.B"],dir:"E",blocks:[JF],solution:[JF,JF,JF],say:"Two bananas in a row. Easy start!"},
 {type:"quiz",q:"In a banana hunt, when is the puzzle finished?",opts:["When ALL the bananas are collected","After the first banana","After 10 steps"],a:0,why:"Every banana counts! Leave one behind and the puzzle isn't done."},
 {type:"maze",title:"There and back",grid:["S.B.","###.","B..."],dir:"E",blocks:[JF,JL,JRT,"rep"],max:8,solution:[jrep(3,JF),JRT,jrep(2,JF),JRT,jrep(3,JF)],say:"One banana up top, one at the bottom. Go get 'em both!"},
 {type:"maze",title:"Banana stairs",grid:["S####","B.###","#.B##","##.B#","###.B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(4,JRT,JF,JL,JF)],say:"A banana on every step! Can you loop it?"},
 {type:"done"}]},
{id:"jr11",title:"Repeat until",sub:"loops that know when to stop",steps:[
 {type:"talk",title:"Repeat until 🍌",mood:"think",
  body:`<p>The <b>Repeat until 🍌</b> block keeps repeating the blocks inside it until every banana is collected. You don't even have to count!</p><p>Real programs do this all the time: "keep downloading <b>until</b> the file is done."</p>`,
  say:"Put Forward inside it and watch me go."},
 {type:"maze",title:"No counting needed",grid:["S......B"],dir:"E",blocks:[JF,"until"],max:2,solution:[juntil(JF)],say:"Seven squares? Don't count them. Let the loop do it!"},
 {type:"maze",title:"Long way down",grid:["S",".",".",".",".",".","B"],dir:"S",blocks:[JF,"until"],max:2,solution:[juntil(JF)]},
 {type:"quiz",q:"When does Repeat until 🍌 stop?",opts:["When every banana is collected","After exactly 3 times","Never"],a:0,why:"It checks after each step: bananas left? Keep going. All gone? Stop."},
 {type:"maze",title:"Endless stairs",grid:["S#####","..####","#..###","##..##","###..#","####.B"],dir:"E",blocks:[JF,JL,JRT,"until"],max:5,solution:[juntil(JRT,JF,JL,JF)],say:"Same stair pattern as before, but now you don't need to count the steps."},
 {type:"done"}]},
{id:"jr12",title:"Tree ahead?",sub:"blocks that make choices",steps:[
 {type:"talk",title:"Smart blocks",mood:"cheer",
  body:`<p>The purple blocks make a <b>choice</b>. <b>Tree ahead? Turn right</b> means: IF there's a tree in front of me, turn right. If there isn't, do nothing.</p><p>Put one inside <b>Repeat until 🍌</b> with a Forward, and I can find my own way around corners!</p>`,
  say:"This is how robot vacuums find their way around a room!"},
 {type:"maze",title:"Around the bend",grid:["S...","###.","###.","###B"],dir:"E",blocks:[JF,JIFR,"until"],max:3,solution:[juntil(JIFR,JF)],say:"Try: Repeat until 🍌 with Tree ahead? Turn right, then Forward inside."},
 {type:"quiz",q:"The rule is: IF a tree is ahead THEN turn right. There's NO tree ahead. What does TypeMonkey do?",opts:["Nothing, he skips the turn","He turns right anyway","He stops forever"],a:0,why:"The IF part is false, so the turn doesn't happen."},
 {type:"maze",title:"Left this time",grid:["###B","###.","###.","S..."],dir:"E",blocks:[JF,JIFL,"until"],max:3,solution:[juntil(JIFL,JF)]},
 {type:"maze",title:"The spiral",grid:["S....","####.","B...."],dir:"E",blocks:[JF,JL,JRT,JIFR,"until"],max:3,solution:[juntil(JIFR,JF)],say:"You could count every step... or let the smart block figure it out!"},
 {type:"done"}]},
{id:"jr13",title:"Maze master",sub:"the ultimate challenge",project:true,steps:[
 {type:"talk",title:"Final challenge!",mood:"cheer",
  body:`<p>You've learned sequences, loops, repeat-until and choices. These last mazes use <b>everything</b>. Take your time, plan, test, and fix. That's what real coders do!</p>`,
  say:"I believe in you, Maze Master!"},
 {type:"maze",title:"Banana loop-de-loop",grid:["SB..B","####.","B..B."],dir:"E",blocks:[JF,JL,JRT,JIFR,"until"],max:3,solution:[juntil(JIFR,JF)],say:"Four bananas, one tiny program. Can you do it in 3 blocks?"},
 {type:"maze",title:"The zigzag boss",grid:["S..#","##.#","##.B"],dir:"E",blocks:[JF,JIFR,JIFL,"until"],max:5,
  body:`<p>Tricky! At the second corner, turning right hits a tree. Hint: if turning right doesn't work, turning left <b>twice</b> faces the other way.</p>`,
  solution:[juntil(JIFR,JIFL,JIFL,JF)],say:"Think about what happens at each corner."},
 {type:"maze",title:"The Golden Grove",grid:["SB...","####B","B...."],dir:"E",blocks:[JF,JL,JRT,"rep",JIFR,"until"],max:3,solution:[juntil(JIFR,JF)],win:"You're officially a Maze Master! 🏆"},
 {type:"done"}]}
]};

const STAIRS5=["S####","..###","#..##","##..#","###.B"];
const STAIRS6=["S#####","..####","#..###","##..##","###..#","####.B"];
const HOPS3=["S.#####","#...###","###...#","#####.B"];
const HOPS5=["S.#########","#...#######","###...#####","#####...###","#######...#","#########.B"];
const JR_UNIT5={name:"My own blocks",lessons:[
{id:"jr14",title:"Make a move",sub:"build your own block",steps:[
 {type:"talk",title:"Your very own block!",mood:"cheer",
  body:`<p>What if you could make a <b>brand-new block</b>? Tap <b>⭐ My move</b> and add blocks to it. Then in your main program, each <b>⭐</b> block does your whole move!</p><p>Real coders call this a <b>function</b>. Build it once, use it again and again.</p>`,
  say:"It's like teaching me a dance move, then just shouting its name!"},
 {type:"maze",title:"Stair dance",func:true,grid:STAIRS5,dir:"E",blocks:[JF,JL,JRT,JCALL],max:8,solution:{main:[JCALL,JCALL,JCALL,JCALL],fn:[JRT,JF,JL,JF]},
  body:`<p>Every stair is the same: turn right, step, turn left, step. Put that in ⭐ My move, then use ⭐ four times.</p>`,say:"First tap ⭐ My move and build the stair move."},
 {type:"quiz",q:"Why make your own block?",opts:["So you can reuse steps without building them again","To make the maze bigger","Because computers like stars"],a:0,why:"Functions save you from repeating yourself. Change the move once and every ⭐ changes too!"},
 {type:"maze",title:"Hop, hop, hop",func:true,grid:HOPS3,dir:"E",blocks:[JF,JL,JRT,JCALL],max:8,solution:{main:[JCALL,JCALL,JCALL],fn:[JF,JRT,JF,JL,JF]},say:"Find the hop that repeats. How many blocks is one hop?"},
 {type:"done"}]},
{id:"jr15",title:"Moves and loops",sub:"put your block inside a repeat",steps:[
 {type:"talk",title:"Super combo",mood:"think",
  body:`<p>You can put ⭐ inside a <b>Repeat</b>! Then a tiny main program can make me do a huge amount of moves.</p>`,
  say:"Repeat 5 times: ⭐. That's two blocks doing twenty moves!"},
 {type:"maze",title:"Giant stairs again",func:true,grid:STAIRS6,dir:"E",blocks:[JF,JL,JRT,"rep",JCALL],max:6,solution:{main:[jrep(5,JCALL)],fn:[JRT,JF,JL,JF]}},
 {type:"quiz",q:"⭐ My move has 4 blocks. You use ⭐ 3 times. How many steps and turns does TypeMonkey do?",opts:["12","7","4"],a:0,why:"3 times 4 blocks is 12."},
 {type:"maze",title:"The long hop",func:true,grid:HOPS5,dir:"E",blocks:[JF,JL,JRT,"rep",JCALL],max:7,solution:{main:[jrep(5,JCALL)],fn:[JF,JRT,JF,JL,JF]},say:"Same hop as before, but five times. Use a Repeat!"},
 {type:"done"}]},
{id:"jr16",title:"Fix my move",sub:"debugging your own blocks",steps:[
 {type:"talk",title:"One fix fixes everything",mood:"oops",
  body:`<p>If ⭐ My move has a bug, every ⭐ has the same bug! The good news: fix it in one place and <b>every</b> ⭐ gets fixed.</p>`,
  say:"Let's find the bug in my dance move."},
 {type:"maze",title:"Wrong-way stairs",func:true,grid:STAIRS5,dir:"E",blocks:[JF,JL,JRT,JCALL],max:8,start:[JCALL,JCALL,JCALL,JCALL],startFn:[JRT,JF,JRT,JF],solution:{main:[JCALL,JCALL,JCALL,JCALL],fn:[JRT,JF,JL,JF]},say:"Press Go and watch. Then fix the move, not the main program!"},
 {type:"maze",title:"Banana steps",func:true,grid:["S####","B.###","#.B##","##.B#","###.B"],dir:"E",blocks:[JF,JL,JRT,"rep",JCALL],max:6,solution:{main:[jrep(4,JCALL)],fn:[JRT,JF,JL,JF]},say:"Four bananas, one tiny move."},
 {type:"done"}]},
{id:"jr17",title:"Function master",sub:"smart blocks inside your own block",project:true,steps:[
 {type:"talk",title:"The final combo",mood:"cheer",
  body:`<p>Last challenge: put <b>smart blocks</b> inside ⭐ My move, and use <b>Repeat until 🍌</b> in the main program. That's exactly how real programs are built: small smart pieces, used over and over.</p>`,
  say:"You're thinking like a real programmer now!"},
 {type:"maze",title:"Hop until banana",func:true,grid:HOPS5,dir:"E",blocks:[JF,JL,JRT,"until",JCALL],max:7,solution:{main:[juntil(JCALL)],fn:[JF,JRT,JF,JL,JF]},say:"You don't even need to count the hops!"},
 {type:"maze",title:"Smart spiral",func:true,grid:["S....","####.","B...."],dir:"E",blocks:[JF,JIFR,"until",JCALL],max:4,solution:{main:[juntil(JCALL)],fn:[JIFR,JF]}},
 {type:"maze",title:"The grand tour",func:true,grid:["SB..B","####.","B..B."],dir:"E",blocks:[JF,JL,JRT,JIFR,"until",JCALL],max:4,solution:{main:[juntil(JCALL)],fn:[JIFR,JF]},win:"Function Master! You built a smart, reusable program! ⭐"},
 {type:"done"}]}
]};

const JR_UNIT6={name:"Detective work",lessons:[
{id:"jr18",title:"Pattern detective",sub:"what comes next?",steps:[
 {type:"talk",title:"Patterns everywhere",mood:"think",
  body:`<p>Coders spot patterns all day long. A pattern is something that repeats. Once you see it, you can use a loop!</p>`,
  say:"Let's train your detective eyes. 🔍"},
 {type:"quiz",q:"What comes next? 🍌 🥥 🍌 🥥 🍌 …",opts:["🥥","🍌","🍎"],a:0,why:"Banana, coconut, banana, coconut... the pattern repeats every 2."},
 {type:"quiz",q:"What comes next? 2, 4, 6, 8, …",opts:["10","9","12"],a:0,why:"Each number is 2 more than the last one."},
 {type:"quiz",q:"What comes next? 🔴 🔴 🔵 🔴 🔴 🔵 🔴 🔴 …",opts:["🔵","🔴","🟢"],a:0,why:"The pattern is red, red, blue. After two reds comes blue."},
 {type:"quiz",q:"Which part repeats? Hop, clap, hop, clap, hop, clap",opts:["Hop, clap","Hop, hop","Clap, clap, clap"],a:0,why:"Hop, clap happens three times. So: Repeat 3 times: hop, clap."},
 {type:"quiz",q:"What comes next? 1, 2, 4, 8, …",opts:["16","10","12"],a:0,why:"Each number doubles: 8 + 8 is 16."},
 {type:"order",title:"Morning pattern",body:`<p>TypeMonkey's morning repeats every day. Put it in order.</p>`,lines:["Wake up","Eat a banana","Brush teeth","Go code!"],why:"Same steps, same order, every day. That's a routine, like a program."},
 {type:"done"}]},
{id:"jr19",title:"Debug detective",sub:"find the bug, fix the bug",steps:[
 {type:"talk",title:"Case of the broken programs",mood:"oops",
  body:`<p>Three programs are broken, and it's your job to crack the case! Press Go first to see what goes wrong. Watching closely is how real coders find bugs.</p>`,
  say:"Grab your magnifying glass. 🔍"},
 {type:"maze",title:"One step too far",grid:["S..B"],dir:"E",blocks:[JF],start:[JF,JF,JF,JF],solution:[JF,JF,JF],say:"Something is extra here..."},
 {type:"maze",title:"Wrong turn",grid:["S...","###.","###B"],dir:"E",blocks:[JF,JL,JRT,"rep"],start:[jrep(3,JF),JL,jrep(2,JF)],solution:[jrep(3,JF),JRT,jrep(2,JF)],say:"The turn looks suspicious."},
 {type:"maze",title:"The loop that forgot to look",grid:["S....","####.","B...."],dir:"E",blocks:[JF,JIFR,"until"],max:3,start:[juntil(JF)],solution:[juntil(JIFR,JF)],say:"My loop walks straight into trees. What block is missing?"},
 {type:"quiz",q:"What's the FIRST thing a good detective does with a buggy program?",opts:["Run it and watch what happens","Delete everything","Guess a fix"],a:0,why:"Watching the program run shows you exactly where it goes wrong."},
 {type:"done"}]}
]};

const COURSE_JR={id:"jr",name:"TypeMonkey Jr.",blurb:"Puzzle adventures for ages 7–12. Snap blocks together to guide TypeMonkey to his bananas. No typing needed! Unit 1 is free.",units:[JR_UNIT1,JR_UNIT2,JR_UNIT3,JR_UNIT4,JR_UNIT5,JR_UNIT6]};
