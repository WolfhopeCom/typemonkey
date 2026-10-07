/* deep-game: Build a Game, Units 5 and 6 (launch depth).
   Unit 5 "Arcade classics": higher-or-lower cards, a quiz show that reads prompt() answers, high-score tables,
   and an Arcade Night project. Unit 6 "Boss battle": turn-based fights, seeded crits and loot, levelling up,
   and a Coconut King boss fight finale. Uses DICE / RAND_FN from game.js so every roll can be graded.
   Wrapped in a block so nothing here leaks into the page's global names. */
{
const KING_HELPERS=`const PATTERN = ["swipe", "swipe", "coconut"];
const DMG = { swipe: 2, coconut: 5 };
function bossAttack(boss, turn) {
  const move = PATTERN[turn % PATTERN.length];
  let dmg = DMG[move];
  if (boss.angry) dmg = dmg * 2;
  console.log(boss.name + " uses " + move + "!");
  return dmg;
}
function hitBoss(boss, dmg) {
  boss.hp = Math.max(0, boss.hp - dmg);
  console.log("You hit for " + dmg + " (" + boss.hp + " left)");
  if (!boss.angry && boss.hp <= boss.maxHp / 2) {
    boss.angry = true;
    console.log("😡 " + boss.name + " gets ANGRY!");
  }
}
`;
const BOSS_START=`let seed = 1;
const boss = { name: "The Coconut King", hp: 24, maxHp: 24, angry: false };
const hero = { hp: 20, maxHp: 20, power: 5, potions: 1 };
const moves = ["attack", "attack", "defend", "attack", "potion", "attack", "attack", "attack"];
let over = false;
for (let turn = 0; turn < moves.length; turn++) {
  const move = moves[turn];
`;
const BOSS_END=`}
if (!over) console.log("The battle goes on...");

`;
const BOSS_BODY=`  if (move === "attack") {
    let hit = hero.power;
    if (roll() === 6) {
      hit = hit * 2;
      console.log("CRITICAL HIT!");
    }
    hitBoss(boss, hit);
  } else if (move === "potion") {
    if (hero.potions > 0) {
      hero.potions--;
      hero.hp = Math.min(hero.maxHp, hero.hp + 8);
      console.log("You drink a potion (♥" + hero.hp + ")");
    } else {
      console.log("No potions left!");
    }
  } else if (move === "defend") {
    console.log("You raise your shield!");
  }
  if (boss.hp === 0) {
    console.log(boss.name + " falls! You win!");
    over = true;
    break;
  }
  let dmg = bossAttack(boss, turn);
  if (move === "defend") dmg = Math.floor(dmg / 2);
  hero.hp = Math.max(0, hero.hp - dmg);
  console.log("Ouch! You have ♥" + hero.hp);
  if (hero.hp === 0) {
    console.log("You were defeated...");
    over = true;
    break;
  }
`;
const HL_FN=`function playHL(deck, guesses) {
  const cards = deck.slice();
  let card = cards.shift();
  let streak = 0;
  for (const g of guesses) {
    const next = cards.shift();
    const right = g === "H" ? next > card : next < card;
    if (!right) break;
    streak++;
    card = next;
  }
  return streak;
}
`;
const NIGHT_PLAYERS=`const deck = [7, 3, 9, 12, 2, 8, 13, 5];
const players = [
  { name: "Mo", guesses: "LHHLL" },
  { name: "Kiki", guesses: "LHHLHHL" },
  { name: "Bao", guesses: "LL" },
  { name: "Ivy", guesses: "LHHLHL" }
];
`;

COURSE_GAME.units.push(
{name:"Arcade classics",lessons:[
{id:"g16",title:"Higher or lower",sub:"a deck of cards and a winning streak",steps:[
 {type:"talk",title:"A deck of cards",mood:"cheer",
  body:`<p>Card games are just arrays! Our deck is a list of numbers from 1 to 13. ${C(".shift()")} takes the top card off the front of the deck, so the deck gets one card shorter.</p>`,
  demo:`const deck = [7, 3, 12, 1, 9];\nconst first = deck.shift();\nconsole.log("🃏 You drew a " + first);\nconsole.log("Cards left: " + deck.length);`,
  say:"🃏 You drew a 7, and 4 cards are left."},
 {type:"talk",title:"Higher or lower?",
  body:`<p>Here's the game: you see a card and guess if the next one is <b>H</b>igher or <b>L</b>ower. A right guess adds to your <b>streak</b>. The guesses come from a string, one letter per turn.</p>`,
  demo:`const deck = [7, 3, 9];\nlet card = deck.shift();\nfor (const g of "LH") {\n  const next = deck.shift();\n  const right = g === "H" ? next > card : next < card;\n  console.log(card + " then " + next + ": you said " + g + (right ? " ✓" : " ✗"));\n  card = next;\n}`,
  say:"7 then 3, you said L ✓. 3 then 9, you said H ✓."},
 {type:"talk",title:"Shuffling with a seed",mood:"think",
  body:`<p>A real deck gets shuffled. The famous trick: walk backwards through the deck and swap each card with a random one before it. We use a seeded ${C("makeRandom")} so the shuffle is the same every time (that's how TypeMonkey can check your games).</p>`,
  demo:`const rand = makeRandom(5);\nconst deck = [1, 2, 3, 4, 5, 6];\nfor (let i = deck.length - 1; i > 0; i--) {\n  const j = Math.floor(rand() * (i + 1));\n  [deck[i], deck[j]] = [deck[j], deck[i]];\n}\nconsole.log(deck.join(" "));\n\n`+RAND_FN,
  say:"Same seed, same shuffle. Change the 5 and run again!"},
 {type:"quiz",q:"What does this print?",code:`const deck = [4, 8, 2];\nconst c = deck.shift();\nconsole.log(c + deck.length);`,opts:["6","42","8"],a:0,mono:true,why:"shift() gives 4 and leaves 2 cards, so 4 + 2 = 6."},
 {type:"quiz",q:"The card is 5 and the next card is 11. Which guess was right?",opts:["Higher","Lower","Neither"],a:0,why:"11 is bigger than 5."},
 {type:"fill",title:"Draw a card",body:`<p>Take the top card off the front of the deck.</p>`,code:`const deck = [5, 10, 2];\nconst card = deck.[0]();\nconsole.log(card);`,blanks:["shift"],tokens:["shift","pop","push","join"],why:"shift takes from the front. pop would take from the back."},
 {type:"code",title:"Card names",body:`<p>Real cards say A, J, Q and K. Finish ${C("name(n)")}: return ${C("A")} for 1, ${C("J")} for 11, ${C("Q")} for 12, ${C("K")} for 13, and the number itself for anything else.</p>`,start:`function name(n) {\n  // your code here\n}\n\nconsole.log([1, 5, 11, 12, 13, 10].map(name).join(" "));\n`,
  use:[[/return/,"Give the name back with return."]],out:["A 5 J Q K 10"],variants:[[/\[1, 5, 11, 12, 13, 10\]/,"[13, 2, 1]",["K 2 A"]]],
  hint:`function name(n) {\n  if (n === 1) return "A";\n  if (n === 11) return "J";\n  if (n === 12) return "Q";\n  if (n === 13) return "K";\n  return n;\n}\n\nconsole.log([1, 5, 11, 12, 13, 10].map(name).join(" "));`},
 {type:"code",title:"Keep the streak going",body:`<p>For each guess, draw the next card. If the guess is right, add 1 to ${C("streak")} and print the card with ${C("✓")}, like ${C("3 ✓")}. If it's wrong, print ${C("8 ✗ Game over!")} and stop with ${C("break")}. (The same card twice counts as wrong.)</p>`,start:`const deck = [7, 3, 9, 12, 2, 8];\nconst guesses = "LHHLL";\nlet card = deck.shift();\nlet streak = 0;\nfor (const g of guesses) {\n  const next = deck.shift();\n  // was the guess right?\n  card = next;\n}\nconsole.log("Streak: " + streak);\n`,
  use:[[/\bbreak\b/,"Stop the game with break after a wrong guess."]],out:["3 ✓","9 ✓","12 ✓","2 ✓","8 ✗ Game over!","Streak: 4"],variants:[[/"LHHLL"/,"\"LHHLH\"",["3 ✓","9 ✓","12 ✓","2 ✓","8 ✓","Streak: 5"]],[/"LHHLL"/,"\"H\"",["3 ✗ Game over!","Streak: 0"]]],
  hint:`const deck = [7, 3, 9, 12, 2, 8];\nconst guesses = "LHHLL";\nlet card = deck.shift();\nlet streak = 0;\nfor (const g of guesses) {\n  const next = deck.shift();\n  const right = g === "H" ? next > card : next < card;\n  if (right) {\n    streak++;\n    console.log(next + " ✓");\n  } else {\n    console.log(next + " ✗ Game over!");\n    break;\n  }\n  card = next;\n}\nconsole.log("Streak: " + streak);`},
 {type:"game"},{type:"done"}],
 pool:[
  [`const d = [3, 9, 4];\nd.shift();\nconsole.log(d.length);`,["2","3","1"]],
  [`const d = [5, 8];\nconsole.log(d.shift() + d.shift());`,["13","58","5"]],
  [`const card = 6, next = 2;\nconsole.log(next > card ? "H" : "L");`,["L","H","2"]],
  [`const N = { 1: "A", 13: "K" };\nconsole.log(N[13] || 13);`,["K","13","A"]],
  [`let streak = 0;\nfor (const ok of [true, true, false, true]) {\n  if (!ok) break;\n  streak++;\n}\nconsole.log(streak);`,["2","3","4"]]
 ]},
{id:"g17",title:"Quiz show",sub:"asking the player with prompt()",steps:[
 {type:"talk",title:"Asking the player",mood:"cheer",
  body:`<p>${C("prompt(\"question\")")} asks the player something and gives back what they typed. On TypeMonkey, the player's answers go in the <b>⌨️ Input</b> box under the code, one per line. Try changing the name there!</p>`,
  demo:`const name = prompt("What's your name?");\nconsole.log("Welcome to Quiz Night, " + name + "!");`,input:"Mo",
  say:"Welcome to Quiz Night, Mo!"},
 {type:"talk",title:"Checking an answer",mood:"think",
  body:`<p>${C("prompt()")} always gives back <b>text</b>, even if the player typed a number. So compare it with ${C("\"4\"")} in quotes, or turn it into a number first with ${C("Number(...)")}.</p>`,
  demo:`const ans = prompt("What is 2 + 2?");\nif (ans === "4") console.log("✓ Correct! +10 points");\nelse console.log("✗ Nope, it was 4");`,input:"4",
  say:"Type 5 in the Input box and run it again to see the other answer."},
 {type:"talk",title:"A whole list of questions",
  body:`<p>Keep the questions in an array of objects, each with a question ${C("q")} and an answer ${C("a")}. Loop through them, ask each one and keep score.</p>`,
  demo:`const questions = [\n  { q: "2 + 2?", a: "4" },\n  { q: "Color of the sky?", a: "blue" },\n  { q: "Legs on a monkey?", a: "2" }\n];\nlet score = 0;\nfor (const item of questions) {\n  const ans = prompt(item.q);\n  if (ans === item.a) score++;\n}\nconsole.log("Score: " + score + "/" + questions.length);`,input:"4\nblue\n3",
  say:"Score: 2/3. Monkeys have 2 legs (and 2 very grabby hands)!"},
 {type:"quiz",q:"The player types 7 into a prompt. What do you get back?",opts:["The text \"7\"","The number 7","true"],a:0,why:"prompt always gives text. Number(\"7\") turns it into the number 7."},
 {type:"quiz",q:"What does this print?",code:`const ans = "5";\nconsole.log(ans === 5);`,opts:["false","true","5"],a:0,mono:true,why:"\"5\" is text and 5 is a number, so === says they're different."},
 {type:"fill",title:"Turn text into a number",body:`<p>Turn the player's answer into a number so you can do maths with it.</p>`,code:`const age = [0](prompt("How old are you?"));\nconsole.log(age + 1);`,blanks:["Number"],tokens:["Number","String","prompt"],why:"Number(...) turns \"9\" into 9, so age + 1 is 10 instead of \"91\"."},
 {type:"code",title:"One big question",body:`<p>Ask ${C("What is 6 x 7?")} with ${C("prompt")}. If the player types ${C("42")}, print ${C("✓ Correct!")}. Otherwise print ${C("✗ Wrong, it was 42")}. TypeMonkey will test it twice, typing a right and a wrong answer.</p>`,start:`const ans = prompt("What is 6 x 7?");\n// check the answer\n`,input:"42",
  use:[[/prompt\s*\(/,"Ask with prompt(...)."],[/if\s*\(/,"Check the answer with if."]],tests:[{input:"42",out:["✓ Correct!"]},{input:"41",out:["✗ Wrong, it was 42"]}],
  hint:`const ans = prompt("What is 6 x 7?");\nif (ans === "42") console.log("✓ Correct!");\nelse console.log("✗ Wrong, it was 42");`},
 {type:"code",title:"Quiz with lives",body:`<p>You have 2 lives. For a right answer add 10 to ${C("score")} and print ${C("✓ +10")}. For a wrong one lose a life and print ${C("✗ Lives: 1")}. If lives hit 0, print ${C("Game over! Score: 10")} and stop. If you get through every question, print ${C("You win! Score: 30")}.</p>`,start:`const questions = [\n  { q: "3 + 5?", a: "8" },\n  { q: "Opposite of up?", a: "down" },\n  { q: "10 - 4?", a: "6" },\n  { q: "Monkeys love...?", a: "bananas" }\n];\nlet score = 0;\nlet lives = 2;\nfor (const item of questions) {\n  const ans = prompt(item.q);\n  // right or wrong?\n}\n`,input:"8\ndown\n7\nbananas",
  use:[[/lives--|lives\s*-=/,"Lose a life with lives--."],[/\bbreak\b/,"Stop the quiz with break when lives run out."]],tests:[{input:"8\ndown\n7\nbananas",out:["✓ +10","✓ +10","✗ Lives: 1","✓ +10","You win! Score: 30"]},{input:"8\nup\n5",out:["✓ +10","✗ Lives: 1","✗ Lives: 0","Game over! Score: 10"]},{input:"8\ndown\n6\nbananas",out:["✓ +10","✓ +10","✓ +10","✓ +10","You win! Score: 40"]}],
  hint:`const questions = [\n  { q: "3 + 5?", a: "8" },\n  { q: "Opposite of up?", a: "down" },\n  { q: "10 - 4?", a: "6" },\n  { q: "Monkeys love...?", a: "bananas" }\n];\nlet score = 0;\nlet lives = 2;\nfor (const item of questions) {\n  const ans = prompt(item.q);\n  if (ans === item.a) {\n    score += 10;\n    console.log("✓ +10");\n  } else {\n    lives--;\n    console.log("✗ Lives: " + lives);\n    if (lives === 0) {\n      console.log("Game over! Score: " + score);\n      break;\n    }\n  }\n}\nif (lives > 0) console.log("You win! Score: " + score);`},
 {type:"game"},{type:"done"}],
 pool:[
  [`console.log("7" === 7);`,["false","true","7"]],
  [`console.log(Number("12") + 1);`,["13","121","12"]],
  [`console.log("12" + 1);`,["121","13","12"]],
  [`const qs = [{ a: "x" }, { a: "y" }];\nconsole.log(qs[1].a);`,["y","x","undefined"]],
  [`let score = 0;\nfor (const ok of [true, false, true]) if (ok) score += 10;\nconsole.log(score);`,["20","30","10"]],
  [`console.log("Banana".toLowerCase() === "banana");`,["true","false","banana"]]
 ]},
{id:"g18",title:"High scores",sub:"sorting a leaderboard and handing out medals",steps:[
 {type:"talk",title:"A score table",mood:"cheer",
  body:`<p>Every arcade has a <b>high score table</b>. In code it's an array of objects, one per player, each with a ${C("name")} and a ${C("score")}.</p>`,
  demo:`const scores = [\n  { name: "Mo", score: 120 },\n  { name: "Kiki", score: 300 },\n  { name: "Bao", score: 90 }\n];\nfor (const s of scores) console.log(s.name + ": " + s.score);`,
  say:"They're in the order they played, not best first. Let's fix that!"},
 {type:"talk",title:"Best to the top",mood:"think",
  body:`<p>${C(".sort()")} puts an array in order. Give it a compare function: ${C("(a, b) => b.score - a.score")} puts the <b>biggest</b> score first. (Swap a and b for smallest first.)</p>`,
  demo:`const scores = [\n  { name: "Mo", score: 120 },\n  { name: "Kiki", score: 300 },\n  { name: "Bao", score: 90 }\n];\nscores.sort((a, b) => b.score - a.score);\nfor (const s of scores) console.log(s.name + ": " + s.score);`,
  say:"Kiki 300, Mo 120, Bao 90. Best first!"},
 {type:"talk",title:"Medals and neat columns",
  body:`<p>${C(".slice(0, 3)")} keeps just the top 3. The loop's counter ${C("i")} picks a medal. ${C(".padEnd(6, \".\")")} pads a name with dots so the scores line up, just like a real arcade screen.</p>`,
  demo:`const top = [\n  { name: "Kiki", score: 300 },\n  { name: "Mo", score: 120 },\n  { name: "Bao", score: 90 },\n  { name: "Ivy", score: 40 }\n].slice(0, 3);\nconst medals = ["🥇", "🥈", "🥉"];\nfor (let i = 0; i < top.length; i++) {\n  console.log(medals[i] + " " + top[i].name.padEnd(6, ".") + top[i].score);\n}`,
  say:"Ivy is 4th, so she doesn't get a medal this time."},
 {type:"quiz",q:"What does this print?",code:`const s = [5, 20, 10];\ns.sort((a, b) => b - a);\nconsole.log(s.join(" "));`,opts:["20 10 5","5 10 20","5 20 10"],a:0,mono:true,why:"b - a sorts biggest first."},
 {type:"quiz",q:"What does this print?",code:`console.log("Mo".padEnd(5, "."));`,opts:["Mo...","...Mo","Mo....."],a:0,mono:true,why:"padEnd adds dots at the end until the text is 5 long."},
 {type:"fill",title:"Just the best",body:`<p>Keep only the top 2 scores.</p>`,code:`const scores = [90, 70, 50, 30];\nconst top = scores.[0](0, 2);\nconsole.log(top.join(" "));`,blanks:["slice"],tokens:["slice","sort","push","join"],why:"slice(0, 2) copies the first 2 items."},
 {type:"code",title:"Leaderboard",body:`<p>Sort the scores best first, then print the top 3 with medals, like ${C("🥇 Kiki 300")}.</p>`,start:`const scores = [\n  { name: "Mo", score: 120 },\n  { name: "Kiki", score: 300 },\n  { name: "Bao", score: 90 },\n  { name: "Ivy", score: 210 }\n];\nconst medals = ["🥇", "🥈", "🥉"];\n// sort, then print the top 3\n`,
  use:[[/\.sort\s*\(/,"Sort the scores first with .sort(...)."]],out:["🥇 Kiki 300","🥈 Ivy 210","🥉 Mo 120"],variants:[[/score: 90/,"score: 999",["🥇 Bao 999","🥈 Kiki 300","🥉 Ivy 210"]]],
  hint:`const scores = [\n  { name: "Mo", score: 120 },\n  { name: "Kiki", score: 300 },\n  { name: "Bao", score: 90 },\n  { name: "Ivy", score: 210 }\n];\nconst medals = ["🥇", "🥈", "🥉"];\nscores.sort((a, b) => b.score - a.score);\nfor (let i = 0; i < 3; i++) {\n  console.log(medals[i] + " " + scores[i].name + " " + scores[i].score);\n}`},
 {type:"code",title:"New high score?",body:`<p>Finish ${C("addScore(name, score)")}: add the new score, sort best first and keep only the top 3. If the new player made the table, print ${C("NEW HIGH SCORE! Zed")}, otherwise print ${C("So close, Bao!")}.</p>`,start:`let table = [\n  { name: "Kiki", score: 300 },\n  { name: "Ivy", score: 210 },\n  { name: "Mo", score: 120 }\n];\n\nfunction addScore(name, score) {\n  // your code here\n}\n\naddScore("Bao", 90);\naddScore("Zed", 250);\nconsole.log(table.map(s => s.name + " " + s.score).join(", "));\n`,
  use:[[/\.sort\s*\(/,"Sort the table after adding the score."],[/\.find\s*\(|\.some\s*\(|includes/,"Check whether the new player is still in the table."]],out:["So close, Bao!","NEW HIGH SCORE! Zed","Kiki 300, Zed 250, Ivy 210"],variants:[[/addScore\("Bao", 90\)/,"addScore(\"Bao\", 500)",["NEW HIGH SCORE! Bao","NEW HIGH SCORE! Zed","Bao 500, Kiki 300, Zed 250"]]],
  hint:`let table = [\n  { name: "Kiki", score: 300 },\n  { name: "Ivy", score: 210 },\n  { name: "Mo", score: 120 }\n];\n\nfunction addScore(name, score) {\n  table.push({ name: name, score: score });\n  table.sort((a, b) => b.score - a.score);\n  table = table.slice(0, 3);\n  if (table.find(s => s.name === name)) console.log("NEW HIGH SCORE! " + name);\n  else console.log("So close, " + name + "!");\n}\n\naddScore("Bao", 90);\naddScore("Zed", 250);\nconsole.log(table.map(s => s.name + " " + s.score).join(", "));`},
 {type:"game"},{type:"done"}],
 pool:[
  [`const s = [3, 1, 2];\ns.sort((a, b) => a - b);\nconsole.log(s.join(""));`,["123","321","312"]],
  [`console.log([50, 40, 30, 20].slice(0, 2).join(" "));`,["50 40","30 20","50 40 30"]],
  [`console.log("7".padStart(3, "0"));`,["007","700","7"]],
  [`const t = [{ n: "a", s: 5 }, { n: "b", s: 9 }];\nt.sort((x, y) => y.s - x.s);\nconsole.log(t[0].n);`,["b","a","9"]],
  [`const m = ["🥇", "🥈", "🥉"];\nconsole.log(m[1]);`,["🥈","🥇","🥉"]]
 ]},
{id:"g19",title:"Project: Arcade Night",sub:"cards, players and a champion",project:true,steps:[
 {type:"talk",title:"Arcade Night",mood:"cheer",
  body:`<p>Four friends are playing higher-or-lower with the same shuffled deck. You'll write the game as a function, score every player, then crown a champion on the leaderboard.</p>`,
  say:"Winner gets the golden banana! 🍌"},
 {type:"code",title:"Step 1: the game as a function",body:`<p>Finish ${C("playHL(deck, guesses)")}: it plays higher-or-lower and <b>returns</b> the streak (how many guesses in a row were right before the first wrong one). Copy the deck first with ${C("deck.slice()")} so every player gets a fresh deck.</p>`,start:`const deck = [7, 3, 9, 12, 2, 8, 13, 5];\n\nfunction playHL(deck, guesses) {\n  const cards = deck.slice();\n  // your code here\n}\n\nconsole.log(playHL(deck, "LHHL"));\nconsole.log(playHL(deck, "HL"));\nconsole.log(playHL(deck, "LHHLHHL"));\n`,
  use:[[/return/,"Give back the streak with return."],[/shift\s*\(/,"Draw cards with cards.shift()."]],out:["4","0","7"],variants:[[/"HL"\)/,"\"LL\")",["4","1","7"]]],
  hint:`const deck = [7, 3, 9, 12, 2, 8, 13, 5];\n\n`+HL_FN+`\nconsole.log(playHL(deck, "LHHL"));\nconsole.log(playHL(deck, "HL"));\nconsole.log(playHL(deck, "LHHLHHL"));`},
 {type:"code",title:"Step 2: score every player",body:`<p>Each right guess is worth 100 points. Loop over the players, save each one's points in ${C("p.score")} and print them like ${C("Mo: 400")}.</p>`,start:NIGHT_PLAYERS+`\n`+HL_FN+`\n// score every player\n`,
  use:[[/playHL\s*\(/,"Use playHL to play each player's guesses."],[/\.score\s*=/,"Save the points in p.score."]],out:["Mo: 400","Kiki: 700","Bao: 100","Ivy: 500"],variants:[[/guesses: "LL"/,"guesses: \"LHHLHHL\"",["Mo: 400","Kiki: 700","Bao: 700","Ivy: 500"]]],
  hint:NIGHT_PLAYERS+`\n`+HL_FN+`\nfor (const p of players) {\n  p.score = playHL(deck, p.guesses) * 100;\n  console.log(p.name + ": " + p.score);\n}`},
 {type:"code",title:"Step 3: crown the champion",body:`<p>Now sort the players best first, print the top 3 with medals like ${C("🥇 Kiki 700")}, and finish with ${C("🏆 Kiki wins!")} for whoever is on top.</p>`,start:NIGHT_PLAYERS+`\n`+HL_FN+`\nfor (const p of players) p.score = playHL(deck, p.guesses) * 100;\nconst medals = ["🥇", "🥈", "🥉"];\n// leaderboard and champion\n`,
  use:[[/\.sort\s*\(/,"Sort the players by score."]],out:["🥇 Kiki 700","🥈 Ivy 500","🥉 Mo 400","🏆 Kiki wins!"],variants:[[/guesses: "LHHLHHL"/,"guesses: \"LH\"",["🥇 Ivy 500","🥈 Mo 400","🥉 Kiki 200","🏆 Ivy wins!"]]],
  hint:NIGHT_PLAYERS+`\n`+HL_FN+`\nfor (const p of players) p.score = playHL(deck, p.guesses) * 100;\nconst medals = ["🥇", "🥈", "🥉"];\nplayers.sort((a, b) => b.score - a.score);\nfor (let i = 0; i < 3; i++) {\n  console.log(medals[i] + " " + players[i].name + " " + players[i].score);\n}\nconsole.log("🏆 " + players[0].name + " wins!");`},
 {type:"done"}]}
]},
{name:"Boss battle",lessons:[
{id:"g20",title:"Taking turns",sub:"attack, defend and enemy patterns",steps:[
 {type:"talk",title:"Your turn, my turn",mood:"cheer",
  body:`<p>In a turn-based battle (like Pokémon), you act, then the enemy acts, over and over until someone runs out of hp. Each fighter is an object with ${C("hp")} and ${C("power")}.</p>`,
  demo:`const hero = { hp: 10, power: 4 };\nconst bat = { hp: 7, power: 3 };\nwhile (hero.hp > 0 && bat.hp > 0) {\n  bat.hp = Math.max(0, bat.hp - hero.power);\n  console.log("⚔ You hit the bat (" + bat.hp + " left)");\n  if (bat.hp === 0) break;\n  hero.hp = Math.max(0, hero.hp - bat.power);\n  console.log("🦇 The bat bites you (" + hero.hp + " left)");\n}\nconsole.log(hero.hp > 0 ? "You win!" : "You lose!");`,
  say:"The bat only gets one bite in. You win!"},
 {type:"talk",title:"Choosing a move",
  body:`<p>Good battles give you choices. Here the hero's moves come from a list: ${C("attack")} hurts the enemy, ${C("defend")} halves the next hit, and ${C("heal")} gets some hp back. ${C("Math.floor")} rounds the half down.</p>`,
  demo:`const hero = { hp: 10, maxHp: 10 };\nfor (const move of ["defend", "heal", "attack"]) {\n  let hit = 5;\n  if (move === "defend") hit = Math.floor(hit / 2);\n  if (move === "heal") hero.hp = Math.min(hero.maxHp, hero.hp + 3);\n  hero.hp -= hit;\n  console.log(move + ": took " + hit + ", hp " + hero.hp);\n}`,
  say:"Defending only cost 2 hp instead of 5."},
 {type:"talk",title:"Enemy patterns",mood:"think",
  body:`<p>Game enemies often repeat a <b>pattern</b> you can learn. The trick is ${C("%")} (remainder): ${C("turn % pattern.length")} counts 0, 1, 2, 0, 1, 2… forever, so the pattern loops around.</p>`,
  demo:`const pattern = ["bite", "bite", "ROAR"];\nfor (let turn = 0; turn < 6; turn++) {\n  console.log("Turn " + turn + ": " + pattern[turn % pattern.length]);\n}`,
  say:"Every third turn it ROARS. Now you know when to defend!"},
 {type:"quiz",q:"What does this print?",code:`const p = ["a", "b", "c"];\nconsole.log(p[4 % p.length]);`,opts:["b","a","undefined"],a:0,mono:true,why:"4 % 3 is 1, and p at position 1 is b."},
 {type:"quiz",q:"You have 10 hp and you defend. The ogre hits for 7, but defending halves it (rounded down). How much hp is left?",opts:["7","3","6"],a:0,mono:true,why:"Half of 7 rounded down is 3, and 10 - 3 = 7."},
 {type:"fill",title:"Loop the pattern",body:`<p>Make the pattern repeat forever.</p>`,code:`const pattern = ["swipe", "rest"];\nfor (let turn = 0; turn < 4; turn++) {\n  console.log(pattern[turn [0] pattern.length]);\n}`,blanks:["%"],tokens:["%","/","*","+"],why:"turn % 2 goes 0, 1, 0, 1, so it's swipe, rest, swipe, rest."},
 {type:"code",title:"Slime fight",body:`<p>Write the battle loop. Each turn you hit the slime (print ${C("You hit Slime (7 left)")}); if it's still alive it hits back (print ${C("Slime hits you (10 left)")}). Never go below 0. At the end print ${C("Slime is defeated! You win!")} or ${C("You were defeated...")}.</p>`,start:`const hero = { hp: 12, power: 3 };\nconst slime = { hp: 10, power: 2 };\n// your battle loop here\n`,
  use:[[/while\s*\(|for\s*\(/,"Use a loop that runs until someone is out of hp."],[/Math\.max/,"Use Math.max(0, ...) so hp never goes below 0."]],out:["You hit Slime (7 left)","Slime hits you (10 left)","You hit Slime (4 left)","Slime hits you (8 left)","You hit Slime (1 left)","Slime hits you (6 left)","You hit Slime (0 left)","Slime is defeated! You win!"],variants:[[/power: 2/,"power: 5",["You hit Slime (7 left)","Slime hits you (7 left)","You hit Slime (4 left)","Slime hits you (2 left)","You hit Slime (1 left)","Slime hits you (0 left)","You were defeated..."]]],
  hint:`const hero = { hp: 12, power: 3 };\nconst slime = { hp: 10, power: 2 };\nwhile (hero.hp > 0 && slime.hp > 0) {\n  slime.hp = Math.max(0, slime.hp - hero.power);\n  console.log("You hit Slime (" + slime.hp + " left)");\n  if (slime.hp === 0) break;\n  hero.hp = Math.max(0, hero.hp - slime.power);\n  console.log("Slime hits you (" + hero.hp + " left)");\n}\nif (hero.hp > 0) console.log("Slime is defeated! You win!");\nelse console.log("You were defeated...");`},
 {type:"code",title:"Outsmart the ogre",body:`<p>Do your move (${C("attack")} takes ${C("hero.power")} from the ogre, ${C("heal")} gives +4 hp up to the max, ${C("defend")} does nothing yet). Then the ogre uses its pattern: look up the damage in ${C("DMG")}, and if you defended, halve it with ${C("Math.floor")}.</p>`,start:`const hero = { hp: 15, maxHp: 15, power: 4 };\nconst ogre = { hp: 12 };\nconst OGRE = ["smash", "smash", "stomp"];\nconst DMG = { smash: 3, stomp: 6 };\nconst moves = ["attack", "attack", "defend", "heal", "attack"];\nfor (let turn = 0; turn < moves.length; turn++) {\n  const move = moves[turn];\n  // 1. do your move\n\n  if (ogre.hp <= 0) {\n    console.log("Ogre is defeated! You win!");\n    break;\n  }\n  // 2. the ogre attacks (half damage if you defended)\n\n  console.log("You " + hero.hp + " | Ogre " + ogre.hp);\n}\n`,
  use:[[/%\s*OGRE\.length/,"Pick the ogre's move with OGRE[turn % OGRE.length]."],[/Math\.floor/,"Halve the damage with Math.floor(dmg / 2)."]],out:["You 12 | Ogre 8","You 9 | Ogre 4","You 6 | Ogre 4","You 7 | Ogre 4","Ogre is defeated! You win!"],variants:[[/"defend", "heal"/,"\"attack\", \"heal\"",["You 12 | Ogre 8","You 9 | Ogre 4","Ogre is defeated! You win!"]],[/"attack", "attack", "defend"/,"\"heal\", \"defend\", \"defend\"",["You 12 | Ogre 12","You 11 | Ogre 12","You 8 | Ogre 12","You 9 | Ogre 12","You 6 | Ogre 8"]]],
  hint:`const hero = { hp: 15, maxHp: 15, power: 4 };\nconst ogre = { hp: 12 };\nconst OGRE = ["smash", "smash", "stomp"];\nconst DMG = { smash: 3, stomp: 6 };\nconst moves = ["attack", "attack", "defend", "heal", "attack"];\nfor (let turn = 0; turn < moves.length; turn++) {\n  const move = moves[turn];\n  if (move === "attack") ogre.hp -= hero.power;\n  if (move === "heal") hero.hp = Math.min(hero.maxHp, hero.hp + 4);\n  if (ogre.hp <= 0) {\n    console.log("Ogre is defeated! You win!");\n    break;\n  }\n  let dmg = DMG[OGRE[turn % OGRE.length]];\n  if (move === "defend") dmg = Math.floor(dmg / 2);\n  hero.hp -= dmg;\n  console.log("You " + hero.hp + " | Ogre " + ogre.hp);\n}`},
 {type:"game"},{type:"done"}],
 pool:[
  [`const p = ["hit", "rest"];\nconsole.log(p[3 % 2]);`,["rest","hit","undefined"]],
  [`console.log(Math.floor(7 / 2));`,["3","3.5","4"]],
  [`let hp = 5;\nhp = Math.max(0, hp - 8);\nconsole.log(hp);`,["0","-3","5"]],
  [`const DMG = { bite: 2, roar: 0 };\nconsole.log(DMG["bite"] * 3);`,["6","2","bitebitebite"]],
  [`let a = 10, b = 4;\nwhile (a > 0 && b > 0) {\n  a -= 3;\n  b -= 2;\n}\nconsole.log(a + "," + b);`,["4,0","1,-2","7,2"]]
 ]},
{id:"g21",title:"Lucky hits & loot",sub:"critical hits, misses and treasure chests",steps:[
 {type:"talk",title:"Critical hits!",mood:"cheer",
  body:`<p>A little luck makes battles exciting. Roll a die for every attack: on a <b>6</b> it's a <b>critical hit</b> and does double damage. We use TypeMonkey's seeded ${C("roll()")} again, so the same seed gives the same fight.</p>`,
  demo:`let seed = 16;\nconst power = 3;\nfor (let i = 0; i < 4; i++) {\n  const r = roll();\n  if (r === 6) console.log("🎲 " + r + " CRITICAL! " + power * 2 + " damage");\n  else console.log("🎲 " + r + " hit for " + power);\n}\n\n`+DICE,
  say:"Seed 16 starts with a 6: critical!"},
 {type:"talk",title:"Whoops, a miss",mood:"oops",
  body:`<p>Rolling a <b>1</b> could mean a miss. Now there are three outcomes, so use ${C("if")}, ${C("else if")} and ${C("else")}.</p>`,
  demo:`let seed = 20;\nfor (let i = 0; i < 3; i++) {\n  const r = roll();\n  if (r === 1) console.log("💨 Miss!");\n  else if (r === 6) console.log("💥 Critical!");\n  else console.log("👊 Hit");\n}\n\n`+DICE,
  say:"Seed 20 rolls 1, 3, 3: a miss, then two hits."},
 {type:"talk",title:"Loot tables",mood:"think",
  body:`<p>When you open a chest, a <b>loot table</b> decides what's inside. Put 6 prizes in an array and use ${C("LOOT[roll() - 1]")}: the roll is 1 to 6 but array positions are 0 to 5. Putting a prize in twice makes it twice as likely! To count prizes, use an object: ${C("bag[item] = (bag[item] || 0) + 1")}.</p>`,
  demo:`let seed = 12;\nconst LOOT = ["banana", "banana", "coin", "coin", "potion", "golden banana"];\nconst bag = {};\nfor (let i = 0; i < 3; i++) {\n  const item = LOOT[roll() - 1];\n  console.log("🎁 " + item);\n  bag[item] = (bag[item] || 0) + 1;\n}\nconsole.log("potions: " + bag.potion);\n\n`+DICE,
  say:"Two potions and a banana."},
 {type:"quiz",q:"A loot table has 6 slots and \"coin\" is in 2 of them. How likely is a coin?",opts:["2 in 6","1 in 6","2 in 2"],a:0,why:"2 of the 6 possible rolls give a coin (that's 1 in 3)."},
 {type:"quiz",q:"What does this print?",code:`const LOOT = ["rock", "coin", "gem"];\nconst r = 3;\nconsole.log(LOOT[r - 1]);`,opts:["gem","coin","undefined"],a:0,mono:true,why:"r - 1 is 2, and position 2 is gem."},
 {type:"fill",title:"Double damage",body:`<p>Double the damage on a 6.</p>`,code:`const r = 6;\nlet dmg = 4;\nif (r [0] 6) dmg = dmg * [1];\nconsole.log(dmg);`,blanks:["===","2"],tokens:["===","=","2","6"],why:"=== checks, = would change r. Times 2 makes it double."},
 {type:"code",title:"Crit or miss",body:`<p>Attack 5 times. For each roll: ${C("1")} prints ${C("Miss!")}, ${C("6")} prints ${C("CRITICAL! 6 damage")} (double power) and anything else prints ${C("Hit for 3")}. Add up the damage and the last line prints ${C("Total: N")}.</p>`,start:`let seed = 13;\nconst power = 3;\nlet total = 0;\nfor (let i = 0; i < 5; i++) {\n  const r = roll();\n  // miss, critical or normal hit?\n}\nconsole.log("Total: " + total);\n\n`+DICE,
  use:[[/===\s*1\b/,"Check for a 1 (a miss)."],[/===\s*6\b/,"Check for a 6 (a critical hit)."]],out:["Hit for 3","Hit for 3","CRITICAL! 6 damage","Hit for 3","Miss!","Total: 15"],variants:[[/seed = 13/,"seed = 34",["Hit for 3","Miss!","Hit for 3","Miss!","CRITICAL! 6 damage","Total: 12"]],[/power = 3/,"power = 5",["Hit for 5","Hit for 5","CRITICAL! 10 damage","Hit for 5","Miss!","Total: 25"]]],
  hint:`let seed = 13;\nconst power = 3;\nlet total = 0;\nfor (let i = 0; i < 5; i++) {\n  const r = roll();\n  if (r === 1) {\n    console.log("Miss!");\n  } else if (r === 6) {\n    console.log("CRITICAL! " + power * 2 + " damage");\n    total += power * 2;\n  } else {\n    console.log("Hit for " + power);\n    total += power;\n  }\n}\nconsole.log("Total: " + total);\n\n`+DICE},
 {type:"code",title:"Treasure chests",body:`<p>Open 4 chests. For each one pick a prize with ${C("LOOT[roll() - 1]")}, print it like ${C("Chest 1: coin")}, and count it in ${C("bag")}. The last line prints the bag for you.</p>`,start:`let seed = 9;\nconst LOOT = ["banana", "banana", "coin", "coin", "potion", "golden banana"];\nconst bag = {};\nfor (let chest = 1; chest <= 4; chest++) {\n  // pick a prize, print it, count it\n}\nconsole.log(Object.keys(bag).map(k => k + " x" + bag[k]).join(", "));\n\n`+DICE,
  use:[[/LOOT\s*\[/,"Pick the prize with LOOT[roll() - 1]."],[/bag\s*\[/,"Count it with bag[item]."]],out:["Chest 1: coin","Chest 2: banana","Chest 3: potion","Chest 4: potion","coin x1, banana x1, potion x2"],variants:[[/seed = 9/,"seed = 18",["Chest 1: golden banana","Chest 2: potion","Chest 3: golden banana","Chest 4: coin","golden banana x2, potion x1, coin x1"]]],
  hint:`let seed = 9;\nconst LOOT = ["banana", "banana", "coin", "coin", "potion", "golden banana"];\nconst bag = {};\nfor (let chest = 1; chest <= 4; chest++) {\n  const item = LOOT[roll() - 1];\n  console.log("Chest " + chest + ": " + item);\n  bag[item] = (bag[item] || 0) + 1;\n}\nconsole.log(Object.keys(bag).map(k => k + " x" + bag[k]).join(", "));\n\n`+DICE},
 {type:"game"},{type:"done"}],
 pool:[
  [`const LOOT = ["coin", "gem", "key"];\nconsole.log(LOOT[2 - 1]);`,["gem","key","coin"]],
  [`const r = 6;\nconsole.log(r === 6 ? "CRIT!" : "hit");`,["CRIT!","hit","6"]],
  [`const bag = {};\nbag.coin = (bag.coin || 0) + 1;\nbag.coin = (bag.coin || 0) + 1;\nconsole.log(bag.coin);`,["2","1","NaN"]],
  [`let dmg = 3;\nconst r = 1;\nif (r === 1) dmg = 0;\nconsole.log(dmg);`,["0","3","1"]],
  [`console.log(Math.floor(0.2 * 6) + 1);`,["2","1","3"]]
 ]},
{id:"g22",title:"Level up!",sub:"experience points and getting stronger",steps:[
 {type:"talk",title:"Experience points",mood:"cheer",
  body:`<p>Beating monsters earns <b>XP</b> (experience points). Collect 100 XP and you <b>level up</b>! A ${C("while")} loop handles a big win that's worth more than one level.</p>`,
  demo:`let xp = 0;\nlet level = 1;\nfor (const gain of [40, 70, 250]) {\n  xp += gain;\n  console.log("+" + gain + " xp");\n  while (xp >= 100) {\n    xp -= 100;\n    level++;\n    console.log("⬆ LEVEL UP! Now level " + level);\n  }\n}`,
  say:"The +250 gives two level ups in a row!"},
 {type:"talk",title:"Getting stronger",
  body:`<p>Levelling up should feel good: more max hp, more power, and a full heal. Put that in a function so every level up works the same way.</p>`,
  demo:`const hero = { level: 1, hp: 3, maxHp: 10, power: 2 };\nfunction levelUp(h) {\n  h.level++;\n  h.maxHp += 5;\n  h.power += 1;\n  h.hp = h.maxHp;\n}\nlevelUp(hero);\nconsole.log("Level " + hero.level + " ♥" + hero.hp + " ⚔" + hero.power);`,
  say:"Level 2 ♥15 ⚔3, and fully healed."},
 {type:"talk",title:"Harder every level",mood:"think",
  body:`<p>If every level needed 100 XP, you'd level up too fast. Lots of games make each level need more: here level 1 needs 100, level 2 needs 200, level 3 needs 300. That's ${C("level * 100")}.</p>`,
  demo:`let total = 0;\nfor (let level = 1; level <= 4; level++) {\n  total += level * 100;\n  console.log("Level " + (level + 1) + " needs " + total + " xp in total");\n}`,
  say:"Reaching level 5 takes 1000 XP in total."},
 {type:"quiz",q:"What does this print?",code:`let xp = 130, level = 1;\nwhile (xp >= 100) {\n  xp -= 100;\n  level++;\n}\nconsole.log(level + " " + xp);`,opts:["2 30","1 130","3 0"],a:0,mono:true,why:"130 is enough for one level up, leaving 30."},
 {type:"quiz",q:"Each level needs level × 100 XP. A hero is level 3. How much XP do they need to reach level 4?",opts:["300","400","100"],a:0,mono:true,why:"3 × 100 = 300."},
 {type:"fill",title:"Level up",body:`<p>Raise the level by one and the power by one.</p>`,code:`const hero = { level: 1, power: 2 };\nfunction levelUp(h) {\n  h.level[0];\n  h.power += [1];\n}\nlevelUp(hero);\nconsole.log(hero.level + " " + hero.power);`,blanks:["++","1"],tokens:["++","--","1","=="],why:"++ adds one, and += 1 does too."},
 {type:"code",title:"Gain XP",body:`<p>Finish ${C("gainXp(hero, amount)")}: add the XP, then <b>while</b> the hero has at least ${C("hero.level * 100")}, take that much away, add a level, add 5 to ${C("maxHp")}, heal fully and print ${C("⬆ Level 2! Max hp: 15")}.</p>`,start:`const hero = { level: 1, xp: 0, hp: 10, maxHp: 10 };\n\nfunction gainXp(hero, amount) {\n  // your code here\n}\n\ngainXp(hero, 80);\ngainXp(hero, 50);\ngainXp(hero, 400);\nconsole.log("Level " + hero.level + ", xp " + hero.xp + "/" + hero.level * 100);\n`,
  use:[[/while\s*\(/,"Use a while loop: a big XP gain can level you up more than once."]],out:["⬆ Level 2! Max hp: 15","⬆ Level 3! Max hp: 20","Level 3, xp 230/300"],variants:[[/gainXp\(hero, 400\)/,"gainXp(hero, 900)",["⬆ Level 2! Max hp: 15","⬆ Level 3! Max hp: 20","⬆ Level 4! Max hp: 25","⬆ Level 5! Max hp: 30","Level 5, xp 30/500"]]],
  hint:`const hero = { level: 1, xp: 0, hp: 10, maxHp: 10 };\n\nfunction gainXp(hero, amount) {\n  hero.xp += amount;\n  while (hero.xp >= hero.level * 100) {\n    hero.xp -= hero.level * 100;\n    hero.level++;\n    hero.maxHp += 5;\n    hero.hp = hero.maxHp;\n    console.log("⬆ Level " + hero.level + "! Max hp: " + hero.maxHp);\n  }\n}\n\ngainXp(hero, 80);\ngainXp(hero, 50);\ngainXp(hero, 400);\nconsole.log("Level " + hero.level + ", xp " + hero.xp + "/" + hero.level * 100);`},
 {type:"code",title:"A hero class",body:`<p>Now the hero is a ${C("class")}. ${C("gain")} is done for you. Finish the ${C("levelUp()")} method: add 1 to ${C("this.level")}, 5 to ${C("this.maxHp")}, 1 to ${C("this.power")}, heal fully, and print ${C("Mo reached level 2! ♥15 ⚔3")}.</p>`,start:`const XP = { slime: 30, bat: 45, ogre: 120 };\n\nclass Hero {\n  constructor(name) {\n    this.name = name;\n    this.level = 1;\n    this.xp = 0;\n    this.hp = 10;\n    this.maxHp = 10;\n    this.power = 2;\n  }\n  levelUp() {\n    // your code here\n  }\n  gain(amount) {\n    this.xp += amount;\n    while (this.xp >= this.level * 100) {\n      this.xp -= this.level * 100;\n      this.levelUp();\n    }\n  }\n}\n\nconst mo = new Hero("Mo");\nfor (const m of ["slime", "bat", "ogre", "bat", "slime", "ogre"]) mo.gain(XP[m]);\nconsole.log(mo.name + " is level " + mo.level + " with " + mo.xp + " xp");\n`,
  use:[[/this\.level\s*\+\+|this\.level\s*\+=/,"Raise this.level by 1."]],out:["Mo reached level 2! ♥15 ⚔3","Mo reached level 3! ♥20 ⚔4","Mo is level 3 with 90 xp"],variants:[[/new Hero\("Mo"\)/,"new Hero(\"Kiki\")",["Kiki reached level 2! ♥15 ⚔3","Kiki reached level 3! ♥20 ⚔4","Kiki is level 3 with 90 xp"]]],
  hint:`const XP = { slime: 30, bat: 45, ogre: 120 };\n\nclass Hero {\n  constructor(name) {\n    this.name = name;\n    this.level = 1;\n    this.xp = 0;\n    this.hp = 10;\n    this.maxHp = 10;\n    this.power = 2;\n  }\n  levelUp() {\n    this.level++;\n    this.maxHp += 5;\n    this.power += 1;\n    this.hp = this.maxHp;\n    console.log(this.name + " reached level " + this.level + "! ♥" + this.maxHp + " ⚔" + this.power);\n  }\n  gain(amount) {\n    this.xp += amount;\n    while (this.xp >= this.level * 100) {\n      this.xp -= this.level * 100;\n      this.levelUp();\n    }\n  }\n}\n\nconst mo = new Hero("Mo");\nfor (const m of ["slime", "bat", "ogre", "bat", "slime", "ogre"]) mo.gain(XP[m]);\nconsole.log(mo.name + " is level " + mo.level + " with " + mo.xp + " xp");`},
 {type:"game"},{type:"done"}],
 pool:[
  [`let xp = 250, lvl = 1;\nwhile (xp >= 100) {\n  xp -= 100;\n  lvl++;\n}\nconsole.log(lvl);`,["3","2","250"]],
  [`const lvl = 4;\nconsole.log(lvl * 100);`,["400","4100","104"]],
  [`const h = { maxHp: 10 };\nh.maxHp += 5;\nconsole.log(h.maxHp);`,["15","105","10"]],
  [`class H {\n  constructor() { this.lvl = 1; }\n  up() { this.lvl++; }\n}\nconst h = new H();\nh.up();\nh.up();\nconsole.log(h.lvl);`,["3","2","1"]],
  [`const XP = { bat: 45 };\nconsole.log(XP.bat * 2);`,["90","4545","45"]]
 ]},
{id:"g23",title:"Project: Boss Battle",sub:"the Coconut King, the grand finale",project:true,steps:[
 {type:"talk",title:"The Coconut King",mood:"cheer",
  body:`<p>The final boss has stolen every banana in the jungle! 👑🥥 He follows an attack pattern, gets <b>ANGRY</b> (double damage!) when his hp drops to half, and only a brave hero with a shield, a potion and a lucky die can beat him. You'll build his attacks, his angry phase, then the whole battle.</p>`,
  say:"This is it, the grand finale. Let's get those bananas back!"},
 {type:"code",title:"Step 1: the boss attacks",body:`<p>Finish ${C("bossAttack(boss, turn)")}: pick the move from ${C("PATTERN")} with ${C("turn % PATTERN.length")}, look up its damage in ${C("DMG")}, double it if ${C("boss.angry")}, print ${C("The Coconut King uses swipe!")} and <b>return</b> the damage.</p>`,start:`const PATTERN = ["swipe", "swipe", "coconut"];\nconst DMG = { swipe: 2, coconut: 5 };\nconst boss = { name: "The Coconut King", angry: false };\n\nfunction bossAttack(boss, turn) {\n  // your code here\n}\n\nlet total = 0;\nfor (let turn = 0; turn < 4; turn++) total += bossAttack(boss, turn);\nconsole.log("Total damage: " + total);\nboss.angry = true;\nconsole.log(bossAttack(boss, 2));\n`,
  use:[[/%\s*PATTERN\.length/,"Pick the move with PATTERN[turn % PATTERN.length]."],[/return/,"Give back the damage with return."]],out:["The Coconut King uses swipe!","The Coconut King uses swipe!","The Coconut King uses coconut!","The Coconut King uses swipe!","Total damage: 11","The Coconut King uses coconut!","10"],variants:[[/coconut: 5/,"coconut: 7",["The Coconut King uses swipe!","The Coconut King uses swipe!","The Coconut King uses coconut!","The Coconut King uses swipe!","Total damage: 13","The Coconut King uses coconut!","14"]]],
  hint:`const PATTERN = ["swipe", "swipe", "coconut"];\nconst DMG = { swipe: 2, coconut: 5 };\nconst boss = { name: "The Coconut King", angry: false };\n\nfunction bossAttack(boss, turn) {\n  const move = PATTERN[turn % PATTERN.length];\n  let dmg = DMG[move];\n  if (boss.angry) dmg = dmg * 2;\n  console.log(boss.name + " uses " + move + "!");\n  return dmg;\n}\n\nlet total = 0;\nfor (let turn = 0; turn < 4; turn++) total += bossAttack(boss, turn);\nconsole.log("Total damage: " + total);\nboss.angry = true;\nconsole.log(bossAttack(boss, 2));`},
 {type:"code",title:"Step 2: phase two",body:`<p>Finish ${C("hitBoss(boss, dmg)")}: lower the boss's hp (not below 0) and print ${C("You hit for 4 (26 left)")}. The first time his hp is at half of ${C("maxHp")} or less, set ${C("boss.angry")} to true and print ${C("😡 The Coconut King gets ANGRY!")}. Only once!</p>`,start:`const boss = { name: "The Coconut King", hp: 30, maxHp: 30, angry: false };\n\nfunction hitBoss(boss, dmg) {\n  // your code here\n}\n\nfor (const dmg of [4, 8, 6, 5, 9]) hitBoss(boss, dmg);\n`,
  use:[[/maxHp\s*\/\s*2/,"Compare the hp with boss.maxHp / 2."],[/Math\.max/,"Use Math.max(0, ...) so hp never goes below 0."]],out:["You hit for 4 (26 left)","You hit for 8 (18 left)","You hit for 6 (12 left)","😡 The Coconut King gets ANGRY!","You hit for 5 (7 left)","You hit for 9 (0 left)"],variants:[[/\[4, 8, 6, 5, 9\]/,"[10, 10, 10]",["You hit for 10 (20 left)","You hit for 10 (10 left)","😡 The Coconut King gets ANGRY!","You hit for 10 (0 left)"]]],
  hint:`const boss = { name: "The Coconut King", hp: 30, maxHp: 30, angry: false };\n\nfunction hitBoss(boss, dmg) {\n  boss.hp = Math.max(0, boss.hp - dmg);\n  console.log("You hit for " + dmg + " (" + boss.hp + " left)");\n  if (!boss.angry && boss.hp <= boss.maxHp / 2) {\n    boss.angry = true;\n    console.log("😡 " + boss.name + " gets ANGRY!");\n  }\n}\n\nfor (const dmg of [4, 8, 6, 5, 9]) hitBoss(boss, dmg);`},
 {type:"code",title:"Step 3: the final battle",body:`<p>Your helpers from steps 1 and 2 are at the top. Write each turn: <b>attack</b> rolls the die (a 6 prints ${C("CRITICAL HIT!")} and doubles your power) and calls ${C("hitBoss")}; <b>potion</b> heals 8 (up to the max) and prints ${C("You drink a potion (♥20)")}, or ${C("No potions left!")}; <b>defend</b> prints ${C("You raise your shield!")}. If the boss is at 0, print ${C("The Coconut King falls! You win!")} and stop. Otherwise he attacks (half damage if you defended, rounded down), print ${C("Ouch! You have ♥18")}, and if you're at 0 print ${C("You were defeated...")} and stop.</p>`,start:KING_HELPERS+`\n`+BOSS_START+`  // your turn, then the boss's turn\n`+BOSS_END+DICE,
  use:[[/roll\s*\(\s*\)/,"Roll the die for every attack."],[/hitBoss\s*\(/,"Hurt the boss with hitBoss(boss, dmg)."],[/bossAttack\s*\(/,"Let the boss fight back with bossAttack(boss, turn)."]],out:["You hit for 5 (19 left)", "The Coconut King uses swipe!", "Ouch! You have ♥18", "You hit for 5 (14 left)", "The Coconut King uses swipe!", "Ouch! You have ♥16", "You raise your shield!", "The Coconut King uses coconut!", "Ouch! You have ♥14", "You hit for 5 (9 left)", "😡 The Coconut King gets ANGRY!", "The Coconut King uses swipe!", "Ouch! You have ♥10", "You drink a potion (♥18)", "The Coconut King uses swipe!", "Ouch! You have ♥14", "CRITICAL HIT!", "You hit for 10 (0 left)", "The Coconut King falls! You win!"],variants:[[/seed = 1;/,"seed = 17;",["CRITICAL HIT!", "You hit for 10 (14 left)", "The Coconut King uses swipe!", "Ouch! You have ♥18", "CRITICAL HIT!", "You hit for 10 (4 left)", "😡 The Coconut King gets ANGRY!", "The Coconut King uses swipe!", "Ouch! You have ♥14", "You raise your shield!", "The Coconut King uses coconut!", "Ouch! You have ♥9", "You hit for 5 (0 left)", "The Coconut King falls! You win!"]],[/hp: 20, maxHp/,"hp: 10, maxHp",["You hit for 5 (19 left)", "The Coconut King uses swipe!", "Ouch! You have ♥8", "You hit for 5 (14 left)", "The Coconut King uses swipe!", "Ouch! You have ♥6", "You raise your shield!", "The Coconut King uses coconut!", "Ouch! You have ♥4", "You hit for 5 (9 left)", "😡 The Coconut King gets ANGRY!", "The Coconut King uses swipe!", "Ouch! You have ♥0", "You were defeated..."]],[/potions: 1/,"potions: 0",["You hit for 5 (19 left)", "The Coconut King uses swipe!", "Ouch! You have ♥18", "You hit for 5 (14 left)", "The Coconut King uses swipe!", "Ouch! You have ♥16", "You raise your shield!", "The Coconut King uses coconut!", "Ouch! You have ♥14", "You hit for 5 (9 left)", "😡 The Coconut King gets ANGRY!", "The Coconut King uses swipe!", "Ouch! You have ♥10", "No potions left!", "The Coconut King uses swipe!", "Ouch! You have ♥6", "CRITICAL HIT!", "You hit for 10 (0 left)", "The Coconut King falls! You win!"]],[/"attack", "attack", "attack"\]/,"\"defend\"]",["You hit for 5 (19 left)","The Coconut King uses swipe!","Ouch! You have ♥18","You hit for 5 (14 left)","The Coconut King uses swipe!","Ouch! You have ♥16","You raise your shield!","The Coconut King uses coconut!","Ouch! You have ♥14","You hit for 5 (9 left)","😡 The Coconut King gets ANGRY!","The Coconut King uses swipe!","Ouch! You have ♥10","You drink a potion (♥18)","The Coconut King uses swipe!","Ouch! You have ♥14","You raise your shield!","The Coconut King uses coconut!","Ouch! You have ♥9","The battle goes on..."]]],
  hint:KING_HELPERS+`\n`+BOSS_START+BOSS_BODY+BOSS_END+DICE},
 {type:"done"}]}
]}
);
}
