/* TypeMonkey Jr. · ages 7–12 · no typing. Maze steps: grid rows use # tree, . path, S start, B banana.
   dir is the starting direction (N/E/S/W). blocks are the buttons offered. start pre-fills a (buggy) program.
   solution must reach the banana within max blocks (checked by tests/verify_course.py).
   aim (optional) overrides the big goal line shown on every puzzle; otherwise it's made from the puzzle.
   predict steps show a short program and ask where the monkey ends up (grid/dir/prog) or which dance move
   comes next (dance:{pattern,times}, ask = index of the move to guess). build is the free-play level maker.
   Ramp rule (checked): the first puzzle of every lesson needs 3 blocks or fewer. */
const JF="fwd",JL="left",JRT="right",JIFR="ifR",JIFL="ifL",JCALL="call",jrep=(n,...body)=>({rep:n,body}),juntil=(...body)=>({until:true,body});

const JR_UNIT1={name:"Monkey moves",free:true,lessons:[
{id:"jr1",title:"First steps",sub:"a program is a list of steps",steps:[
 {type:"talk",title:"Hi, junior coder!",mood:"cheer",
  body:`<p>I'm TypeMonkey, and I'm SO hungry. Can you help me get to my bananas? 🍌</p><p>You'll give me <b>instructions</b>, one block at a time. A list of instructions is called a <b>program</b>. I follow your program exactly, step by step!</p>`,
  say:"This first one is super easy. Tap Continue!"},
 {type:"maze",title:"Two little steps",body:`<p>Tap <b>Forward</b> two times, then press <b>Go!</b></p>`,grid:["S.B"],dir:"E",blocks:[JF],solution:[JF,JF],say:"Forward, Forward, Go!"},
 {type:"dance",title:"Copy my dance",body:`<p>A dance is a program too: moves in order! Tap <b>👀 Watch it</b>, then tap the same moves.</p>`,moves:["clap","jump"],target:["clap","jump"],solution:{pattern:["clap","jump"]},say:"Clap first, then jump!"},
 {type:"maze",title:"A longer walk",grid:["S....B"],dir:"E",blocks:[JF],solution:[JF,JF,JF,JF,JF],say:"Count the empty squares between me and the banana!"},
 {type:"predict",title:"Where will I stop?",body:`<p>Read my program. Then tap the square where I will stop.</p>`,grid:["S....B"],dir:"E",prog:[JF,JF,JF],say:"Three steps. Count them on the path!"},
 {type:"quiz",q:"What is a program?",opts:["A list of steps for a computer to follow","A kind of banana","A TV show"],a:0,why:"Programs are instructions. Computers follow them exactly, in order."},
 {type:"dance",title:"Three-move dance",moves:["clap","jump","wave"],target:["wave","clap","jump"],solution:{pattern:["wave","clap","jump"]},say:"Same order as the dance. Watch it first!"},
 {type:"box",title:"Bonus: my banana box",body:`<p>This is my banana box! Its name is <b>bananas</b>. Coders call a box with a name a <b>variable</b>. Tap <b>+ 1</b> to put in a banana until there are 3.</p>`,name:"bananas",startVal:0,goal:3,ops:["+1"],solution:["+1","+1","+1"],say:"Watch the code change every time you tap!"},
 {type:"done"}]},
{id:"jr2",title:"Turning corners",sub:"turn left, turn right",steps:[
 {type:"talk",title:"Turning",mood:"think",
  body:`<p><b>Turn right ↻</b> and <b>Turn left ↺</b> spin me around without moving. Then <b>Forward</b> goes the new way.</p><p>Watch my little arrow. It always shows which way I'm facing!</p>`,
  say:"Just one turn to start."},
 {type:"maze",title:"One turn",grid:["S.","#B"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JRT,JF],say:"Forward, then turn right so I face down, then Forward!"},
 {type:"quiz",q:"TypeMonkey faces right ➜ and turns LEFT. Which way is he facing now?",opts:["Up ⬆","Down ⬇","Left ⬅"],a:0,why:"If you face right and turn left, you end up facing up."},
 {type:"maze",title:"The other way",grid:["#B","S."],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JL,JF],say:"This time the banana is up. Which way do I turn?"},
 {type:"predict",title:"Step, turn, step",body:`<p>Where will I stop? Tap the square!</p>`,grid:["S..","...","..B"],dir:"E",prog:[JF,JRT,JF],say:"Watch my arrow. After the turn, I face down."},
 {type:"dance",title:"Spin move!",body:`<p>New move: <b>🌀 Spin</b>. That's a turn all the way around!</p>`,moves:["clap","jump","spin"],target:["jump","spin","clap","spin"],solution:{pattern:["jump","spin","clap","spin"]}},
 {type:"maze",title:"Walk, then turn",grid:["S..","##B"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JF,JRT,JF],say:"Walk to the end, then turn and step down."},
 {type:"maze",title:"Around the corner",grid:["S..#","##.#","##.B"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JF,JRT,JF,JF,JL,JF],say:"Walk, turn, walk, turn, walk!"},
 {type:"done"}]},
{id:"jr3",title:"Bug hunt",sub:"finding and fixing mistakes",steps:[
 {type:"talk",title:"What's a bug?",mood:"oops",
  body:`<p>A <b>bug</b> is a mistake in a program. Even expert coders make them every day! Finding and fixing bugs is called <b>debugging</b>.</p><p>Someone already wrote these programs, but they have bugs. Press Go to see what goes wrong, then fix it. Tap a block to remove it.</p>`,
  say:"Let's squash some bugs! 🐛"},
 {type:"maze",title:"Not far enough",grid:["S...B"],dir:"E",blocks:[JF],start:[JF,JF,JF],solution:[JF,JF,JF,JF],say:"This program has a bug. Press Go and watch what happens."},
 {type:"dance",title:"Buggy dance",body:`<p>This dance program has a bug. Press <b>▶ Dance!</b> to see it, then fix it.</p>`,moves:["clap","jump","spin"],start:["clap","clap","spin"],target:["clap","jump","spin"],solution:{pattern:["clap","jump","spin"]},say:"One move is wrong. Tap it to take it out."},
 {type:"quiz",q:"What's it called when you find and fix mistakes in a program?",opts:["Debugging","Bananaing","Restarting"],a:0,why:"Coders debug all the time. It's a superpower!"},
 {type:"maze",title:"Wrong turn",grid:["S..#","##.#","##.B"],dir:"E",blocks:[JF,JL,JRT],start:[JF,JF,JL,JF,JF,JL,JF],solution:[JF,JF,JRT,JF,JF,JL,JF],say:"Something turns the wrong way. Can you spot it?"},
 {type:"done"}]}
]};

const JR_UNIT2={name:"Loops",lessons:[
{id:"jr4",title:"Repeat!",sub:"loops do things again and again",steps:[
 {type:"talk",title:"The Repeat block",mood:"cheer",
  body:`<p>Instead of Forward, Forward, Forward, Forward, Forward, you can say <b>Repeat 5 times: Forward</b>. That's called a <b>loop</b>!</p><p>Tap <b>Repeat</b>, add blocks inside it, then tap <b>done</b>. Tap the 🔁 number to change how many times it repeats.</p>`,
  say:"Loops make programs shorter. Coders LOVE short programs."},
 {type:"dance",title:"Clap clap clap clap",loop:true,body:`<p>Add <b>one</b> 👏 Clap, then press <b>+</b> until it says Repeat <b>4</b> times.</p>`,moves:["clap","jump"],target:["clap","clap","clap","clap"],solution:{pattern:["clap"],times:4},say:"One clap, repeated 4 times. That's a loop!"},
 {type:"predict",title:"What comes next?",body:`<p>Read the dance program. Which move comes next?</p>`,dance:{pattern:["clap","jump"],times:3},ask:3,moves:["clap","jump","spin"],say:"Clap, jump, clap... then?"},
 {type:"maze",title:"Use a loop",grid:["S....B"],dir:"E",blocks:[JF,"rep"],max:2,solution:[jrep(5,JF)],say:"Only 2 blocks allowed! Tap Repeat, then Forward, then set it to 5."},
 {type:"predict",title:"Loop, turn, loop",body:`<p>Where will I stop? Tap the square!</p>`,grid:["S...",".#..","...B"],dir:"E",prog:[jrep(2,JF),JRT,jrep(2,JF)],say:"Two steps, turn, two steps."},
 {type:"quiz",q:"Repeat 3 times: Forward. How many steps forward is that?",opts:["3","1","4"],a:0,why:"The block inside runs 3 times."},
 {type:"dance",title:"Jump and clap, again and again",loop:true,moves:["clap","jump","spin"],target:["jump","clap","jump","clap","jump","clap"],solution:{pattern:["jump","clap"],times:3},say:"Find the part that repeats. How many times does it happen?"},
 {type:"maze",title:"Two loops",grid:["S....","####.","####.","####B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(4,JF),JRT,jrep(3,JF)],say:"One loop to go across, one loop to go down!"},
 {type:"done"}]},
{id:"jr5",title:"Loop patterns",sub:"spot the part that repeats",steps:[
 {type:"talk",title:"Find the pattern",mood:"think",
  body:`<p>Before you build, look closely. Do you see something that happens again and again? That's the part to put inside your Repeat.</p>`,
  say:"Coders call this pattern-spotting. It's a big part of thinking like a programmer."},
 {type:"predict",title:"Party guess",body:`<p>Which move comes next? Look for the part that repeats.</p>`,dance:{pattern:["wave","spin","clap"],times:2},ask:4,moves:["clap","spin","wave"],say:"Wave, spin, clap, wave... then?"},
 {type:"quiz",q:"Which part repeats in: Forward, Turn, Forward, Turn, Forward, Turn?",opts:["Forward, Turn","Forward","Turn, Turn"],a:0,why:"Forward, Turn happens 3 times. So: Repeat 3 times: Forward, Turn."},
 {type:"dance",title:"The party pattern",loop:true,moves:["clap","jump","spin","wave","wiggle"],target:["wave","spin","clap","wave","spin","clap"],solution:{pattern:["wave","spin","clap"],times:2},say:"Three moves, then the same three moves again!"},
 {type:"maze",title:"Around the pond",grid:["S..","##.","B.."],dir:"N",blocks:[JF,JL,JRT,"rep"],max:4,solution:[jrep(3,JRT,JF,JF)],say:"I'm facing up! Turn, walk two. Turn, walk two. See the pattern?"},
 {type:"maze",title:"Staircase",grid:["S####","..###","#..##","##..#","###.B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:5,solution:[jrep(4,JRT,JF,JL,JF)],say:"Each stair is the same: turn, step, turn, step. Loop it!"},
 {type:"done"}]},
{id:"jr6",title:"Jungle adventure",sub:"bigger mazes, all your skills",project:true,steps:[
 {type:"talk",title:"Into the jungle!",mood:"cheer",
  body:`<p>These mazes are bigger. Use everything you know: Forward, turns, and Repeat. Plan first, then build!</p>`,
  say:"I believe in you!"},
 {type:"maze",title:"Down the vine",grid:["S",".",".",".","B"],dir:"S",blocks:[JF,JL,JRT,"rep"],max:2,solution:[jrep(4,JF)],say:"Warm-up! One loop takes me all the way down."},
 {type:"maze",title:"River bend",grid:["S...#","###.#","#B..#"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:8,solution:[jrep(3,JF),JRT,jrep(2,JF),JRT,jrep(2,JF)]},
 {type:"dance",title:"Victory dance!",loop:true,body:`<p>Halfway through the jungle! Time to celebrate.</p>`,moves:["clap","jump","spin","wave","wiggle"],target:["wiggle","jump","wiggle","jump","wiggle","jump","wiggle","jump"],solution:{pattern:["wiggle","jump"],times:4}},
 {type:"maze",title:"Monkey bridge",grid:["S..#..","#.##.#","#....B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:7,solution:[JF,JRT,jrep(2,JF),JL,jrep(4,JF)]},
 {type:"done"}]}
]};

const JR_UNIT3={name:"Think like a coder",lessons:[
{id:"jr7",title:"Step by step",sub:"why order matters",steps:[
 {type:"talk",title:"Order matters",mood:"think",
  body:`<p>Computers do things in the exact order you say. If you put on your shoes before your socks... uh oh! 🧦👟</p>`,
  say:"Let's practice putting steps in order."},
 {type:"order",title:"Banana sandwich",body:`<p>Put the steps in order.</p>`,lines:["Get two slices of bread","Add banana slices","Put the slices together"],why:"First the bread, then the bananas, then close it up!"},
 {type:"quiz",q:"Why does order matter in a program?",opts:["The computer does steps exactly in the order you give","It doesn't matter at all","Computers like alphabetical order"],a:0,why:"Change the order and you change what happens."},
 {type:"order",title:"Plant a seed",body:`<p>Put the steps in order.</p>`,lines:["Dig a hole","Drop in the seed","Cover it with soil","Water it"],why:"You can't cover the seed before it's in the hole!"},
 {type:"dance",title:"Order changes the dance",body:`<p>Same moves, different order, different dance! Copy this one exactly.</p>`,moves:["clap","jump","spin","wave"],target:["spin","wave","jump","clap"],solution:{pattern:["spin","wave","jump","clap"]}},
 {type:"done"}]},
{id:"jrv",title:"Banana boxes",sub:"variables hold things",steps:[
 {type:"talk",title:"Boxes with names",mood:"cheer",
  body:`<p>Coders keep things in <b>boxes with names</b>. They're called <b>variables</b>!</p><p>My box is called <b>bananas</b>. Right now it has 0 inside. Every time you tap a button, I change what's in the box, and you'll see the line of code that does it.</p>`,
  say:"Games use variables for your score, your lives, your coins..."},
 {type:"box",title:"Fill the box",body:`<p>Tap <b>+ 1</b> until the box holds 3 bananas.</p>`,name:"bananas",startVal:0,goal:3,ops:["+1"],solution:["+1","+1","+1"],say:"Tap + 1 three times!"},
 {type:"quiz",q:"bananas = 2, then bananas = bananas + 1. What's in the box now?",opts:["3","2","1"],a:0,why:"It had 2, and we added 1 more. Now it holds 3."},
 {type:"box",title:"Bigger jumps",body:`<p>Now you can add 1 <b>or</b> 2 at a time. Get to 5 in only <b>3 taps</b>!</p>`,name:"bananas",startVal:0,goal:5,ops:["+1","+2"],max:3,solution:["+2","+2","+1"],say:"Big jumps first, then a little one!"},
 {type:"box",title:"Score points",body:`<p>Games keep a <b>score</b>. Get the score to 10 in <b>3 taps</b>.</p>`,name:"score",startVal:0,goal:10,ops:["+1","+2","+5"],max:3,solution:["+5","+5"],say:"Which button gets there fastest?"},
 {type:"box",title:"Double trouble",body:`<p>New button: <b>× 2</b> doubles what's in the box! Start with 1 and get to 8 in <b>3 taps</b>.</p>`,name:"bananas",startVal:1,goal:8,ops:["+1","x2"],max:3,solution:["x2","x2","x2"],win:"Doubling is super powerful! 1, 2, 4, 8!"},
 {type:"done"}]},
{id:"jr8",title:"If this, then that",sub:"computers make choices",steps:[
 {type:"talk",title:"Making choices",mood:"cheer",
  body:`<p>Programs can make choices with <b>IF</b> and <b>ELSE</b>. <b>IF</b> it's raining, take an umbrella. <b>ELSE</b> (otherwise), wear sunglasses! 😎</p><p>Let's try it with my sorting machine!</p>`,
  say:"Games use IF all the time: IF you touch a coin, THEN add a point."},
 {type:"sort",title:"The yellow sorter",rule:"IF it's yellow ➜ 🧺 Yellow basket<br>ELSE ➜ 📦 Other box",bins:[{icon:"🧺",name:"Yellow basket"},{icon:"📦",name:"Other box"}],
  items:[{icon:"🍌",bin:0},{icon:"🍎",bin:1,why:"An apple is red, not yellow. So it goes in the ELSE box!"},{icon:"🍋",bin:0,why:"A lemon is yellow!"},{icon:"🥦",bin:1,why:"Broccoli is green, so it's ELSE."},{icon:"🌻",bin:0,why:"A sunflower is yellow!"},{icon:"🍇",bin:1,why:"Grapes are purple, so it's ELSE."}],
  code:'if thing.color == "yellow":\n    yellow_basket.add(thing)\nelse:\n    other_box.add(thing)',say:"Is it yellow? Basket! Not yellow? Box!"},
 {type:"quiz",q:"TypeMonkey's rule: IF hungry, eat a banana. ELSE, play. He is NOT hungry. What does he do?",opts:["Play","Eat a banana","Sleep"],a:0,why:"The IF part is false, so the ELSE part happens."},
 {type:"sort",title:"Snack or toy?",rule:"IF you can eat it ➜ 🍽️ Snack plate<br>ELSE ➜ 🧸 Toy box",bins:[{icon:"🍽️",name:"Snack plate"},{icon:"🧸",name:"Toy box"}],
  items:[{icon:"🍪",bin:0},{icon:"⚽",bin:1,why:"You can't eat a ball! Toy box."},{icon:"🍉",bin:0,why:"Watermelon is yummy. Snack plate!"},{icon:"🎈",bin:1,why:"Don't eat a balloon! Toy box."},{icon:"🥕",bin:0,why:"Carrots are a snack!"},{icon:"🪀",bin:1,why:"A yo-yo is a toy."},{icon:"🍌",bin:0,why:"Bananas are the BEST snack!"}],
  code:'if can_eat(thing):\n    snack_plate.add(thing)\nelse:\n    toy_box.add(thing)'},
 {type:"quiz",q:"In a game: IF you touch a star, you get a point. You touch 3 stars. How many points?",opts:["3","1","0"],a:0,why:"The rule happens every time you touch one."},
 {type:"done"}]},
{id:"jr9",title:"Banana Quest",sub:"the final challenge",project:true,steps:[
 {type:"talk",title:"The final quest!",mood:"cheer",
  body:`<p>This is it: the Banana Quest! Tricky challenges stand between me and the Golden Banana. Use sequences, loops, choices and debugging. You've got this!</p>`,
  say:"Ready? Let's go!"},
 {type:"maze",title:"Temple hallway",grid:["S...B"],dir:"E",blocks:[JF,JL,JRT,"rep"],max:2,solution:[jrep(4,JF)],say:"A quick warm-up. Two blocks!"},
 {type:"maze",title:"The canyon",grid:["S.#B","#.#.","#..."],dir:"E",blocks:[JF,JL,JRT,"rep"],max:10,solution:[JF,JRT,jrep(2,JF),JL,jrep(2,JF),JL,jrep(2,JF)]},
 {type:"sort",title:"The temple gate",body:`<p>The gate only opens for the right things!</p>`,rule:"IF it's a number bigger than 5 ➜ 🚪 Open the gate<br>ELSE ➜ 🔒 Stay shut",bins:[{icon:"🚪",name:"Open"},{icon:"🔒",name:"Stay shut"}],
  items:[{icon:"8",bin:0},{icon:"2",bin:1,why:"2 is smaller than 5. Stay shut!"},{icon:"10",bin:0,why:"10 is bigger than 5!"},{icon:"5",bin:1,why:"5 is not BIGGER than 5. It's the same! Stay shut."},{icon:"7",bin:0,why:"7 is bigger than 5!"}],
  code:"if number > 5:\n    open_gate()\nelse:\n    stay_shut()",say:"Careful with 5!"},
 {type:"box",title:"The treasure counter",body:`<p>The treasure chest opens when <b>coins</b> is exactly 12. Use <b>4 taps</b> or fewer.</p>`,name:"coins",startVal:0,goal:12,ops:["+1","+5","x2","-1"],max:4,solution:["+5","+1","x2"],say:"There's more than one way to do it!"},
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
 {type:"maze",title:"Banana corner",grid:["SB.","##B"],dir:"E",blocks:[JF,JL,JRT],solution:[JF,JF,JRT,JF],say:"Get the first banana, then turn the corner for the next one."},
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
 {type:"sort",title:"Robot brain",body:`<p>First, YOU be my brain! Look at what's in front of me and choose.</p>`,rule:"IF there's a tree ahead ➜ ↻ Turn<br>ELSE ➜ 👣 Walk forward",bins:[{icon:"↻",name:"Turn"},{icon:"👣",name:"Forward"}],
  items:[{icon:"🌳",name:"tree ahead",bin:0},{icon:"🟩",name:"clear path",bin:1,why:"No tree, so keep walking!"},{icon:"🟩",name:"clear path",bin:1,why:"No tree, so keep walking!"},{icon:"🌳",name:"tree ahead",bin:0,why:"Tree! Turn so you don't bonk."},{icon:"🟩",name:"clear path",bin:1,why:"No tree, so keep walking!"},{icon:"🌳",name:"tree ahead",bin:0,why:"Tree! Turn so you don't bonk."}],
  code:"if tree_ahead():\n    turn_right()\nelse:\n    forward()",say:"Tree? Turn! No tree? Walk!"},
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
 {type:"maze",title:"Smart pond",grid:["S..","##.","B.."],dir:"E",blocks:[JF,JIFR,"until"],max:3,solution:[juntil(JIFR,JF)],say:"Remember this pond? This time the smart block does all the turning!"},
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
 {type:"maze",title:"Big steps",func:true,grid:["S.....B"],dir:"E",blocks:[JF,JCALL],startFn:[JF,JF,JF],solution:{main:[JCALL,JCALL],fn:[JF,JF,JF]},aim:"⭐ Use My move two times to get the banana!",
  body:`<p>I made a move for you! ⭐ <b>My move</b> = 3 steps forward. In the <b>Main program</b>, tap ⭐ two times.</p>`,say:"Each ⭐ is 3 big steps!"},
 {type:"maze",title:"Stair dance",func:true,grid:STAIRS5,dir:"E",blocks:[JF,JL,JRT,JCALL],max:8,solution:{main:[JCALL,JCALL,JCALL,JCALL],fn:[JRT,JF,JL,JF]},
  body:`<p>Every stair is the same: turn right, step, turn left, step. Put that in ⭐ My move, then use ⭐ four times.</p>`,say:"First tap ⭐ My move and build the stair move."},
 {type:"quiz",q:"Why make your own block?",opts:["So you can reuse steps without building them again","To make the maze bigger","Because computers like stars"],a:0,why:"Functions save you from repeating yourself. Change the move once and every ⭐ changes too!"},
 {type:"maze",title:"Hop, hop, hop",func:true,grid:HOPS3,dir:"E",blocks:[JF,JL,JRT,JCALL],max:8,solution:{main:[JCALL,JCALL,JCALL],fn:[JF,JRT,JF,JL,JF]},say:"Find the hop that repeats. How many blocks is one hop?"},
 {type:"done"}]},
{id:"jr15",title:"Moves and loops",sub:"put your block inside a repeat",steps:[
 {type:"talk",title:"Super combo",mood:"think",
  body:`<p>You can put ⭐ inside a <b>Repeat</b>! Then a tiny main program can make me do a huge amount of moves.</p>`,
  say:"Repeat 5 times: ⭐. That's two blocks doing twenty moves!"},
 {type:"maze",title:"Giant stairs again",func:true,grid:STAIRS6,dir:"E",blocks:[JF,JL,JRT,"rep",JCALL],max:6,startFn:[JRT,JF,JL,JF],solution:{main:[jrep(5,JCALL)],fn:[JRT,JF,JL,JF]},say:"I kept your stair move in ⭐! Put ⭐ inside a Repeat."},
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
 {type:"maze",title:"Hop until banana",func:true,grid:HOPS5,dir:"E",blocks:[JF,JL,JRT,"until",JCALL],max:7,startFn:[JF,JRT,JF,JL,JF],solution:{main:[juntil(JCALL)],fn:[JF,JRT,JF,JL,JF]},say:"Your hop is already in ⭐. You don't even need to count the hops!"},
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
 {type:"sort",title:"Even or odd?",body:`<p>Even numbers can be split into two equal groups: 2, 4, 6, 8... Odd numbers can't: 1, 3, 5, 7...</p>`,rule:"IF the number is even ➜ 🔵 Even box<br>ELSE ➜ 🟠 Odd box",bins:[{icon:"🔵",name:"Even"},{icon:"🟠",name:"Odd"}],
  items:[{icon:"4",bin:0},{icon:"7",bin:1,why:"7 is odd: 1, 3, 5, 7..."},{icon:"2",bin:0,why:"2 is even!"},{icon:"9",bin:1,why:"9 is odd."},{icon:"6",bin:0,why:"6 is even: 3 + 3."},{icon:"1",bin:1,why:"1 is odd."}],
  code:"if number % 2 == 0:\n    even_box.add(number)\nelse:\n    odd_box.add(number)"},
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
 {type:"done"}]},
{id:"jr20",title:"Make your own puzzle",sub:"build a maze, then solve it",project:true,steps:[
 {type:"talk",title:"You're the boss now!",mood:"cheer",
  body:`<p>Now YOU make the puzzle! Put me, some bananas 🍌 and some trees 🌴 on the grid.</p><p>Then press <b>▶ Play it!</b> and write a program to get me there.</p>`,
  say:"Make it as easy or as tricky as you like!"},
 {type:"build",title:"My own maze",say:"Pick a thing, then tap a square to put it there."},
 {type:"done"}]}
]};

const COURSE_JR={id:"jr",name:"TypeMonkey Jr.",blurb:"Puzzle adventures for ages 7–12. Snap blocks together to guide TypeMonkey to his bananas. No typing needed! Unit 1 is free.",units:[JR_UNIT1,JR_UNIT2,JR_UNIT3,JR_UNIT4,JR_UNIT5,JR_UNIT6]};
