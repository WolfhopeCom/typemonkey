/* Build Projects and Bug Lab: two hands-on sections (Python for now).
   Projects: a mission brief, missions that teach one piece at a time, then the learner builds the whole
   thing and TypeMonkey plays it with different answers ("tests"). Bug Lab: broken code to fix, with
   hints that come one at a time. Every answer is checked against real Python by tests/verify_extras.py. */

const PJ_MADLIBS={id:"pj4",title:"Project 02 · Silly Story Maker",sub:"input, f-strings, text tricks",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a story maker: the player types some words, and your program turns them into a ridiculous story.</b></p><p>The sillier the words, the funnier the story. Try a "sparkly llama" who eats "spaghetti"!</p>`,
  say:"This one is pure fun. Two missions, then you build it!"},
 {type:"code",mission:"Mission 1",title:"Ask for a name",body:`<p>Ask for the player's name with ${C('input("Your name: ")')}, then print ${C("Hi Mo, let's make a story!")} using their name. Use an f-string: ${C('f"Hi {name}..."')}</p>`,start:`# Mission 1: ask for a name\n`,
  use:[[/input\s*\(/,"Ask with input(...)."],[/f["']/,"Put the name in with an f-string: f\"Hi {name}...\""]],tests:[{input:"Mo",out:["Hi Mo, let's make a story!"]},{input:"Ava",out:["Hi Ava, let's make a story!"]}],
  hint:`name = input("Your name: ")
print(f"Hi {name}, let's make a story!")`},
 {type:"talk",title:"New piece: text tricks",mood:"think",
  body:`<p>Text has superpowers. ${C(".upper()")} makes it SHOUT, ${C(".title()")} Capitalizes Each Word, and you can drop any variable into an f-string.</p>`,
  input:"banana bread",demo:`food = input("A food: ")
print(f"I love {food}!")
print(food.upper())
print(food.title())`,
  say:"Change the food in the Input box and run it again!"},
 {type:"code",mission:"Mission 2",title:"Ask for more words",body:`<p>Ask for ${C('"An animal: "')} and ${C('"A food: "')}. Print ${C("The cat ate a pizza.")} and then ${C("It yelled: PIZZA!")} (the food in capitals).</p>`,start:`# Mission 2: ask for an animal and a food\n`,
  use:[[/upper\s*\(\s*\)/,"Shout the food with .upper()."]],tests:[{input:"cat\npizza",out:["The cat ate a pizza.","It yelled: PIZZA!"]},{input:"monkey\nbanana",out:["The monkey ate a banana.","It yelled: BANANA!"]}],
  hint:`animal = input("An animal: ")
food = input("A food: ")
print(f"The {animal} ate a {food}.")
print(f"It yelled: {food.upper()}!")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Now build the whole Silly Story Maker yourself. TypeMonkey will feed it two sets of silly words.</p>`,say:"Make it silly!"},
 {type:"code",final:true,title:"Build the Silly Story Maker",body:`<p>Ask for 5 words, in this order: a <b>name</b>, an <b>adjective</b> (describing word), an <b>animal</b>, a <b>food</b> and a <b>place</b>. Then print:</p><ul><li>${C("Once upon a time, Mo met a silly llama.")}</li><li>${C("They ate tacos together in the jungle.")}</li><li>${C('Mo shouted: "TACOS IS THE BEST!"')}</li><li>${C("The end.")}</li></ul>`,start:`# Build the Silly Story Maker here!\n`,
  use:[[/input[\s\S]*input[\s\S]*input[\s\S]*input[\s\S]*input/,"Ask for all 5 words with input()."],[/upper\s*\(/,"Shout the food with .upper()."]],
  tests:[{input:"Mo\nsilly\nllama\ntacos\nthe jungle",out:["Once upon a time, Mo met a silly llama.","They ate tacos together in the jungle.","Mo shouted: \"TACOS IS THE BEST!\"","The end."]},{input:"Zoe\nsparkly\ndragon\nspaghetti\nParis",out:["Once upon a time, Zoe met a sparkly dragon.","They ate spaghetti together in Paris.","Zoe shouted: \"SPAGHETTI IS THE BEST!\"","The end."]}],
  hint:`name = input("A name: ")
adjective = input("An adjective: ")
animal = input("An animal: ")
food = input("A food: ")
place = input("A place: ")
print(f"Once upon a time, {name} met a {adjective} {animal}.")
print(f"They ate {food} together in {place}.")
print(f'{name} shouted: "{food.upper()} IS THE BEST!"')
print("The end.")`},
 {type:"talk",title:"Make it yours",mood:"cheer",body:`<p>Ideas for the Playground: add more words, ask for a number and repeat a word that many times with ${C('"ha" * n')}, or write a whole second chapter.</p>`,say:"Every app you use is just words and logic like this."},
 {type:"done"}]};

const PJ_8BALL={id:"pj5",title:"Project 03 · Magic 8-Ball",sub:"lists, len, remainder, loops",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a Magic 8-Ball that answers any yes-or-no question.</b></p><p>Secret: it isn't really magic. Your program picks the answer using the <b>length of the question</b>, so the same question always gets the same answer. Shhh!</p>`,
  say:"Will this be fun? 🎱 Signs point to yes!"},
 {type:"code",mission:"Mission 1",title:"The answer list",body:`<p>Make a list ${C("answers")} with these four, in order: ${C("Yes!")}, ${C("No way.")}, ${C("Ask again later.")}, ${C("Definitely!")} Then print ${C("4 answers ready")} using ${C("len()")}, and print the first answer.</p>`,start:`# Mission 1: make the list of answers\n`,
  use:[[/answers\s*=\s*\[/,"Make a list called answers."],[/len\s*\(\s*answers\s*\)/,"Count them with len(answers)."]],out:["4 answers ready","Yes!"],
  hint:`answers = ["Yes!", "No way.", "Ask again later.", "Definitely!"]
print(f"{len(answers)} answers ready")
print(answers[0])`},
 {type:"talk",title:"New piece: remainder %",mood:"think",
  body:`<p>${C("%")} gives the <b>remainder</b> after dividing. ${C("10 % 4")} is ${C("2")}, because 4 goes into 10 twice with 2 left over. The answer is always smaller than 4, so it's always a safe spot in a list of 4!</p>`,
  demo:`print(10 % 4)
print(7 % 4)
print(len("hello") % 4)`,say:"Remainders keep any number inside the list."},
 {type:"code",mission:"Mission 2",title:"Answer a question",body:`<p>Ask ${C('input("Ask the 8-Ball: ")')}. Pick the answer at position ${C("len(question) % len(answers)")} and print ${C("8-Ball says: Definitely!")} (or whichever answer it picks).</p>`,start:`answers = ["Yes!", "No way.", "Ask again later.", "Definitely!"]\n# Mission 2: answer one question\n`,
  use:[[/%/,"Use % to pick a spot in the list."]],tests:[{input:"Will I win?",out:["8-Ball says: Definitely!"]},{input:"Can I fly?",out:["8-Ball says: Ask again later."]},{input:"Is it pizza day?",out:["8-Ball says: Yes!"]}],
  hint:`answers = ["Yes!", "No way.", "Ask again later.", "Definitely!"]
question = input("Ask the 8-Ball: ")
pick = len(question) % len(answers)
print(f"8-Ball says: {answers[pick]}")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Now build the whole 8-Ball yourself. This time it keeps answering until the player says ${C("bye")}.</p>`,say:"Ask it if you'll finish this. 🎱"},
 {type:"code",final:true,title:"Build the Magic 8-Ball",body:`<p>From scratch:</p><ul><li>the same 4 answers, in the same order</li><li>keep asking ${C('"Ask the 8-Ball: "')} until the player types ${C("bye")}</li><li>if they type nothing (just spaces), print ${C("You have to ask something!")}</li><li>otherwise print ${C("8-Ball says: ...")} using the length of the question (without extra spaces, so use ${C(".strip()")})</li><li>at the end, print ${C("The 8-Ball fades away...")}</li></ul>`,start:`# Build the Magic 8-Ball here!\n`,
  use:[[/while/,"Keep answering in a while loop."],[/%/,"Use % to pick the answer."]],
  tests:[{input:"Will I win?\n\nCan I fly?\nbye",out:["8-Ball says: Definitely!","You have to ask something!","8-Ball says: Ask again later.","The 8-Ball fades away..."]},{input:"bye",out:["The 8-Ball fades away..."]},{input:"  Is it raining?  \nbye",out:["8-Ball says: Ask again later.","The 8-Ball fades away..."]}],
  hint:`answers = ["Yes!", "No way.", "Ask again later.", "Definitely!"]
while True:
    question = input("Ask the 8-Ball: ").strip()
    if question == "bye":
        break
    if question == "":
        print("You have to ask something!")
    else:
        pick = len(question) % len(answers)
        print(f"8-Ball says: {answers[pick]}")
print("The 8-Ball fades away...")`},
 {type:"talk",title:"Make it yours",mood:"cheer",body:`<p>Add more answers (it still works, because ${C("len(answers)")} changes too!), or use ${C("import random")} and ${C("random.choice(answers)")} for real randomness.</p>`,say:"Outlook good!"},
 {type:"done"}]};

const PJ_RPS={id:"pj6",title:"Project 05 · Rock Paper Scissors",sub:"functions, dictionaries, game loops",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build Rock Paper Scissors: best of 3 rounds against the computer.</b></p><p>The computer plays a secret pattern: rock, then paper, then scissors. Once you build it, you'll know how to beat it every time. 😎</p>`,
  say:"Rock beats scissors, scissors beats paper, paper beats rock!"},
 {type:"talk",title:"New piece: dictionaries",mood:"think",
  body:`<p>A <b>dictionary</b> matches keys to values. Here each move points to the move it beats. ${C('beats["rock"]')} gives ${C('"scissors"')}.</p>`,
  demo:`beats = {"rock": "scissors", "paper": "rock", "scissors": "paper"}
print(beats["rock"])
print("paper" in beats)
print("banana" in beats)`,say:"One dictionary holds all the rules."},
 {type:"code",mission:"Mission 1",title:"Who wins?",body:`<p>Write a function ${C("winner(player, computer)")} that returns ${C('"win"')}, ${C('"lose"')} or ${C('"tie"')} for the player. Use the ${C("beats")} dictionary.</p>`,start:`beats = {"rock": "scissors", "paper": "rock", "scissors": "paper"}\n\n# Mission 1: write winner(player, computer)\n\n\nprint(winner("rock", "scissors"))\nprint(winner("rock", "paper"))\nprint(winner("paper", "paper"))\n`,
  use:[[/def\s+winner\s*\(/,"Define the function with def winner(player, computer):"],[/return/,"Send the answer back with return."]],out:["win","lose","tie"],
  hint:`beats = {"rock": "scissors", "paper": "rock", "scissors": "paper"}

def winner(player, computer):
    if player == computer:
        return "tie"
    if beats[player] == computer:
        return "win"
    return "lose"

print(winner("rock", "scissors"))
print(winner("rock", "paper"))
print(winner("paper", "paper"))`},
 {type:"code",mission:"Mission 2",title:"Play 3 rounds",body:`<p>The computer's moves are ${C('moves = ["rock", "paper", "scissors"]')}, and in round ${C("r")} (starting at 0) it plays ${C("moves[r % 3]")}. Play 3 rounds. Each round ask ${C('"rock, paper or scissors? "')} and print ${C("Computer picked rock. You win!")}, ${C("... You lose!")} or ${C("... It's a tie!")}</p>`,start:`beats = {"rock": "scissors", "paper": "rock", "scissors": "paper"}\n\ndef winner(player, computer):\n    if player == computer:\n        return "tie"\n    if beats[player] == computer:\n        return "win"\n    return "lose"\n\n# Mission 2: play 3 rounds\n`,
  use:[[/for\s+\w+\s+in\s+range\s*\(\s*3\s*\)|while/,"Play 3 rounds with for r in range(3):"],[/%\s*3/,"Pick the computer's move with moves[r % 3]."]],
  tests:[{input:"rock\nrock\nrock",out:["Computer picked rock. It's a tie!","Computer picked paper. You lose!","Computer picked scissors. You win!"]},{input:"paper\nscissors\nrock",out:["Computer picked rock. You win!","Computer picked paper. You win!","Computer picked scissors. You win!"]}],
  hint:`beats = {"rock": "scissors", "paper": "rock", "scissors": "paper"}

def winner(player, computer):
    if player == computer:
        return "tie"
    if beats[player] == computer:
        return "win"
    return "lose"

moves = ["rock", "paper", "scissors"]
messages = {"win": "You win!", "lose": "You lose!", "tie": "It's a tie!"}
for r in range(3):
    player = input("rock, paper or scissors? ").strip().lower()
    computer = moves[r % 3]
    print(f"Computer picked {computer}. {messages[winner(player, computer)]}")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Build the full game yourself, with two upgrades: <b>keep score</b>, and if the player types something that isn't a move, ask again (that round doesn't count).</p>`,say:"May the best monkey win!"},
 {type:"code",final:true,title:"Build Rock Paper Scissors",body:`<p>From scratch, with a ${C("winner")} function:</p><ul><li>3 counted rounds; the computer plays ${C("moves[round % 3]")}</li><li>a bad move prints ${C("Pick rock, paper or scissors!")} and asks again</li><li>each round prints ${C("Computer picked rock. You win!")} (or You lose! / It's a tie!)</li><li>then ${C("Final score: You 2, Computer 1")}</li><li>then ${C("You won the match!")}, ${C("The computer won the match!")} or ${C("The match is a tie!")}</li></ul>`,start:`# Build Rock Paper Scissors here!\n`,
  use:[[/def\s+\w+\s*\(/,"Put the rules in a function with def."],[/input\s*\(/,"Ask for moves with input(...)."]],
  tests:[{input:"paper\nbanana\nscissors\nrock",out:["Computer picked rock. You win!","Pick rock, paper or scissors!","Computer picked paper. You win!","Computer picked scissors. You win!","Final score: You 3, Computer 0","You won the match!"]},{input:"rock\nrock\nrock",out:["Computer picked rock. It's a tie!","Computer picked paper. You lose!","Computer picked scissors. You win!","Final score: You 1, Computer 1","The match is a tie!"]},{input:"scissors\nRock\nscissors",out:["Computer picked rock. You lose!","Computer picked paper. You lose!","Computer picked scissors. It's a tie!","Final score: You 0, Computer 2","The computer won the match!"]}],
  hint:`beats = {"rock": "scissors", "paper": "rock", "scissors": "paper"}
moves = ["rock", "paper", "scissors"]

def winner(player, computer):
    if player == computer:
        return "tie"
    if beats[player] == computer:
        return "win"
    return "lose"

you = 0
cpu = 0
r = 0
while r < 3:
    player = input("rock, paper or scissors? ").strip().lower()
    if player not in beats:
        print("Pick rock, paper or scissors!")
        continue
    computer = moves[r % 3]
    result = winner(player, computer)
    if result == "win":
        you += 1
        print(f"Computer picked {computer}. You win!")
    elif result == "lose":
        cpu += 1
        print(f"Computer picked {computer}. You lose!")
    else:
        print(f"Computer picked {computer}. It's a tie!")
    r += 1

print(f"Final score: You {you}, Computer {cpu}")
if you > cpu:
    print("You won the match!")
elif cpu > you:
    print("The computer won the match!")
else:
    print("The match is a tie!")`},
 {type:"talk",title:"Make it yours",mood:"cheer",body:`<p>Make the computer unbeatable... or fair! Try ${C("random.choice(moves)")}, add lizard and Spock, or play best of 5.</p>`,say:"Now you can beat the pattern every time. Paper, scissors, rock! 😉"},
 {type:"done"}]};

const PJ_PET={id:"pj7",title:"Project 06 · Pet Monkey Simulator",sub:"dictionaries, commands, limits",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a virtual pet monkey!</b> The player names it, then types commands: ${C("feed")}, ${C("play")}, ${C("sleep")} and ${C("status")}. Your monkey gets hungry, tired and happy, just like a real pet.</p>`,
  say:"I've always wanted a little brother! 🐒"},
 {type:"code",mission:"Mission 1",title:"Hatch your pet",body:`<p>Ask ${C('input("Name your pet monkey: ")')}. Make a dictionary ${C("pet")} with the name, plus ${C("hunger")}, ${C("energy")} and ${C("fun")} all set to 5. Print ${C("Mo: hunger 5, energy 5, fun 5")}</p>`,start:`# Mission 1: create your pet\n`,
  use:[[/pet\s*=\s*\{/,"Make a dictionary: pet = {...}"]],tests:[{input:"Mo",out:["Mo: hunger 5, energy 5, fun 5"]},{input:"Kiki",out:["Kiki: hunger 5, energy 5, fun 5"]}],
  hint:`name = input("Name your pet monkey: ")
pet = {"name": name, "hunger": 5, "energy": 5, "fun": 5}
print(f"{pet['name']}: hunger {pet['hunger']}, energy {pet['energy']}, fun {pet['fun']}")`},
 {type:"talk",title:"New piece: changing values with limits",mood:"think",
  body:`<p>You can change a value in a dictionary: ${C('pet["hunger"] -= 3')}. But hunger can't go below 0! ${C("max(0, x)")} keeps a number from dropping under 0, and ${C("min(10, x)")} keeps it from going over 10.</p>`,
  demo:`pet = {"hunger": 2, "fun": 9}
pet["hunger"] = max(0, pet["hunger"] - 3)
pet["fun"] = min(10, pet["fun"] + 3)
print(pet)`,say:"Games use max and min for health bars all the time."},
 {type:"code",mission:"Mission 2",title:"Feed your pet",body:`<p>After the status line, keep reading commands with ${C('input("> ")')}:</p><ul><li>${C("feed")}: hunger goes down 3 (not below 0), print ${C("Mo munches a banana. Yum!")}</li><li>${C("status")}: print the status line again</li><li>${C("quit")}: stop and print ${C("Bye, Mo!")}</li><li>anything else: ${C("Mo doesn't know how to dance.")}</li></ul>`,start:`name = input("Name your pet monkey: ")\npet = {"name": name, "hunger": 5, "energy": 5, "fun": 5}\nprint(f"{pet['name']}: hunger {pet['hunger']}, energy {pet['energy']}, fun {pet['fun']}")\n# Mission 2: read commands\n`,
  use:[[/while/,"Keep reading commands in a while loop."],[/max\s*\(/,"Use max(0, ...) so hunger stays at 0 or more."]],
  tests:[{input:"Mo\nfeed\nstatus\nfeed\nstatus\nquit",out:["Mo: hunger 5, energy 5, fun 5","Mo munches a banana. Yum!","Mo: hunger 2, energy 5, fun 5","Mo munches a banana. Yum!","Mo: hunger 0, energy 5, fun 5","Bye, Mo!"]},{input:"Zip\ndance\nquit",out:["Zip: hunger 5, energy 5, fun 5","Zip doesn't know how to dance.","Bye, Zip!"]}],
  hint:`name = input("Name your pet monkey: ")
pet = {"name": name, "hunger": 5, "energy": 5, "fun": 5}

def status():
    print(f"{pet['name']}: hunger {pet['hunger']}, energy {pet['energy']}, fun {pet['fun']}")

status()
while True:
    cmd = input("> ").strip().lower()
    if cmd == "quit":
        break
    elif cmd == "feed":
        pet["hunger"] = max(0, pet["hunger"] - 3)
        print(f"{name} munches a banana. Yum!")
    elif cmd == "status":
        status()
    else:
        print(f"{name} doesn't know how to {cmd}.")
print(f"Bye, {name}!")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Build the whole simulator yourself, with two new commands: ${C("play")} and ${C("sleep")}. Playing is fun but makes your monkey tired and hungry!</p>`,say:"Take good care of your monkey!"},
 {type:"code",final:true,title:"Build the Pet Monkey Simulator",body:`<p>From scratch, with at least one function. Start by asking the name and printing the status line. Then:</p><ul><li>${C("feed")}: hunger −3 (min 0) → ${C("Mo munches a banana. Yum!")}</li><li>${C("play")}: if energy is under 2 → ${C("Mo is too tired to play!")} Otherwise fun +3 (max 10), energy −2, hunger +2 (max 10) → ${C("Mo swings from the vines. Wheee!")}</li><li>${C("sleep")}: energy back to 10 → ${C("Mo takes a nap. Zzz...")}</li><li>${C("status")}, ${C("quit")} and unknown commands work like before</li></ul>`,start:`# Build the Pet Monkey Simulator here!\n`,
  use:[[/def\s+\w+\s*\(/,"Put some of the work in a function with def."],[/min\s*\(/,"Use min(10, ...) so values don't go over 10."]],
  tests:[{input:"Mo\nplay\nplay\nplay\nstatus\nsleep\nfeed\nstatus\nquit",out:["Mo: hunger 5, energy 5, fun 5","Mo swings from the vines. Wheee!","Mo swings from the vines. Wheee!","Mo is too tired to play!","Mo: hunger 9, energy 1, fun 10","Mo takes a nap. Zzz...","Mo munches a banana. Yum!","Mo: hunger 6, energy 10, fun 10","Bye, Mo!"]},{input:"Bo\nsing\nfeed\nfeed\nstatus\nquit",out:["Bo: hunger 5, energy 5, fun 5","Bo doesn't know how to sing.","Bo munches a banana. Yum!","Bo munches a banana. Yum!","Bo: hunger 0, energy 5, fun 5","Bye, Bo!"]}],
  hint:`name = input("Name your pet monkey: ")
pet = {"name": name, "hunger": 5, "energy": 5, "fun": 5}

def status():
    print(f"{name}: hunger {pet['hunger']}, energy {pet['energy']}, fun {pet['fun']}")

def play():
    if pet["energy"] < 2:
        print(f"{name} is too tired to play!")
        return
    pet["fun"] = min(10, pet["fun"] + 3)
    pet["energy"] -= 2
    pet["hunger"] = min(10, pet["hunger"] + 2)
    print(f"{name} swings from the vines. Wheee!")

status()
while True:
    cmd = input("> ").strip().lower()
    if cmd == "quit":
        break
    elif cmd == "feed":
        pet["hunger"] = max(0, pet["hunger"] - 3)
        print(f"{name} munches a banana. Yum!")
    elif cmd == "play":
        play()
    elif cmd == "sleep":
        pet["energy"] = 10
        print(f"{name} takes a nap. Zzz...")
    elif cmd == "status":
        status()
    else:
        print(f"{name} doesn't know how to {cmd}.")
print(f"Bye, {name}!")`},
 {type:"talk",title:"Make it yours",mood:"cheer",body:`<p>Ideas: make hunger go up a little after <i>every</i> command, add a ${C("bath")} command, or print a sad face when fun drops to 0.</p>`,say:"You built a living (well, digital) creature!"},
 {type:"done"}]};

const ADV_ROOMS=`rooms = {
    "gate": {"desc": "You are at the temple gate. A path leads north.", "exits": {"north": "hall"}},
    "hall": {"desc": "A dusty hall. Something shiny is on the floor. Exits: south, east.", "exits": {"south": "gate", "east": "vault"}, "item": "key"},
    "vault": {"desc": "A huge golden door blocks the way. Exit: west.", "exits": {"west": "hall"}},
}`;
const PJ_ADVENTURE={id:"pj8",title:"Project 08 · Temple Escape Adventure",sub:"nested dictionaries, game state, functions",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a text adventure game!</b> The player explores an ancient temple by typing commands like ${C("go north")}, ${C("look")}, ${C("take")} and ${C("open")}. Somewhere inside is the legendary <b>Golden Banana</b>. 🍌✨</p><p>Games like this were some of the very first computer games ever made.</p>`,
  say:"Grab your explorer hat!"},
 {type:"talk",title:"New piece: a map in a dictionary",mood:"think",
  body:`<p>Each room is a dictionary <i>inside</i> a bigger dictionary. A room has a description, its exits (another dictionary!), and maybe an item. ${C('rooms["gate"]["exits"]["north"]')} tells you where north leads.</p>`,
  demo:`${ADV_ROOMS}
room = "gate"
print(rooms[room]["desc"])
print(rooms[room]["exits"])
print("east" in rooms["hall"]["exits"])`,say:"The whole world of the game lives in one variable."},
 {type:"code",mission:"Mission 1",title:"Take a step",body:`<p>Start with ${C('room = "gate"')} and print the room's description. Then move north by setting ${C("room")} to where the north exit leads, and print the new description.</p>`,start:`${ADV_ROOMS}\n\n# Mission 1: start at the gate, then walk north\n`,
  use:[[/rooms\s*\[\s*room\s*\]/,"Look up the current room with rooms[room]."],[/\[\s*["']exits["']\s*\]/,"Find where north leads with rooms[room][\"exits\"][\"north\"]."]],out:["You are at the temple gate. A path leads north.","A dusty hall. Something shiny is on the floor. Exits: south, east."],
  hint:`${ADV_ROOMS}

room = "gate"
print(rooms[room]["desc"])
room = rooms[room]["exits"]["north"]
print(rooms[room]["desc"])`},
 {type:"code",mission:"Mission 2",title:"Explore",body:`<p>Print the starting room, then read commands with ${C('input("> ")')}:</p><ul><li>${C("look")}: print the description again</li><li>${C("go DIRECTION")}: if that exit exists, move and print the new room. Otherwise ${C("You can't go that way.")}</li><li>${C("quit")}: stop</li><li>anything else: ${C("I don't understand.")}</li></ul><p>At the end print ${C("Thanks for playing!")}</p>`,start:`${ADV_ROOMS}\n\nroom = "gate"\n# Mission 2: the explore loop\n`,
  use:[[/while/,"Keep reading commands in a while loop."],[/startswith|split/,"Spot go commands with cmd.startswith(\"go \") or .split()."]],
  tests:[{input:"go north\ngo west\ngo east\nlook\nquit",out:["You are at the temple gate. A path leads north.","A dusty hall. Something shiny is on the floor. Exits: south, east.","You can't go that way.","A huge golden door blocks the way. Exit: west.","A huge golden door blocks the way. Exit: west.","Thanks for playing!"]},{input:"dance\nquit",out:["You are at the temple gate. A path leads north.","I don't understand.","Thanks for playing!"]}],
  hint:`${ADV_ROOMS}

room = "gate"
print(rooms[room]["desc"])
while True:
    cmd = input("> ").strip().lower()
    if cmd == "quit":
        break
    elif cmd == "look":
        print(rooms[room]["desc"])
    elif cmd.startswith("go "):
        direction = cmd[3:]
        if direction in rooms[room]["exits"]:
            room = rooms[room]["exits"][direction]
            print(rooms[room]["desc"])
        else:
            print("You can't go that way.")
    else:
        print("I don't understand.")
print("Thanks for playing!")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Final build: the whole adventure, with an <b>inventory</b> list and two new commands. Find the key, open the golden door, and win! TypeMonkey will play through it twice.</p>`,say:"The Golden Banana awaits!"},
 {type:"code",final:true,title:"Build Temple Escape",body:`<p>Use the same ${C("rooms")} map. With at least one function, add to your explore game:</p><ul><li>${C("take")}: if the room has an item, add it to an ${C("inventory")} list, remove it from the room, and print ${C("You picked up the key.")} Otherwise ${C("There's nothing to take.")}</li><li>${C("open")}: only works in the vault. With the key → ${C("The door swings open. You found the Golden Banana! You win!")} and the game ends. Without it → ${C("It's locked. You need a key.")} Anywhere else → ${C("There's nothing to open here.")}</li><li>finish with ${C("Thanks for playing!")}</li></ul>`,start:`${ADV_ROOMS}\n\n# Build Temple Escape here!\n`,
  use:[[/def\s+\w+\s*\(/,"Put some of the work in a function with def."],[/inventory/,"Keep picked-up items in a list called inventory."]],
  tests:[{input:"go north\ngo east\nopen\ngo west\ntake\ntake\ngo east\nopen",out:["You are at the temple gate. A path leads north.","A dusty hall. Something shiny is on the floor. Exits: south, east.","A huge golden door blocks the way. Exit: west.","It's locked. You need a key.","A dusty hall. Something shiny is on the floor. Exits: south, east.","You picked up the key.","There's nothing to take.","A huge golden door blocks the way. Exit: west.","The door swings open. You found the Golden Banana! You win!","Thanks for playing!"]},{input:"open\nlook\ngo south\nquit",out:["You are at the temple gate. A path leads north.","There's nothing to open here.","You are at the temple gate. A path leads north.","You can't go that way.","Thanks for playing!"]}],
  hint:`${ADV_ROOMS}

room = "gate"
inventory = []

def describe():
    print(rooms[room]["desc"])

def take():
    item = rooms[room].get("item")
    if item:
        inventory.append(item)
        del rooms[room]["item"]
        print(f"You picked up the {item}.")
    else:
        print("There's nothing to take.")

describe()
while True:
    cmd = input("> ").strip().lower()
    if cmd == "quit":
        break
    elif cmd == "look":
        describe()
    elif cmd.startswith("go "):
        direction = cmd[3:]
        if direction in rooms[room]["exits"]:
            room = rooms[room]["exits"][direction]
            describe()
        else:
            print("You can't go that way.")
    elif cmd == "take":
        take()
    elif cmd == "open":
        if room != "vault":
            print("There's nothing to open here.")
        elif "key" in inventory:
            print("The door swings open. You found the Golden Banana! You win!")
            break
        else:
            print("It's locked. You need a key.")
    else:
        print("I don't understand.")
print("Thanks for playing!")`},
 {type:"talk",title:"Make it yours",mood:"cheer",body:`<p>Your game, your world! Add more rooms, a ${C("inventory")} command, a sleeping snake you have to sneak past, or a secret room only found with ${C("go down")}.</p>`,say:"You're officially a game designer! 🏆"},
 {type:"done"}]};

const COURSE_PROJECTS={id:"projects",name:"Build Projects",extra:true,blurb:"Real programs, built step by step. Each project gives you a mission, teaches the pieces as you need them, then you build the whole thing yourself and TypeMonkey plays it to check it works. In Python. The Beginner projects are free.",units:[
{name:"Beginner",free:true,lessons:[
{id:"pj1",title:"Project 01 · Number Guessing Game",sub:"variables, input, if, while",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a game where the computer chooses a secret number and the player has to guess it.</b></p><p>The game says <i>Too low</i> or <i>Too high</i> after each guess, and counts how many tries it took. TypeMonkey will teach you each piece as you need it, then you'll build the final version on your own.</p>`,
  say:"Five missions, then the big build. Let's go!"},
 {type:"code",mission:"Mission 1",title:"Create the secret number",body:`<p>Every guessing game needs a secret. Make a variable ${C("secret")} set to ${C("7")}, then print ${C("I'm thinking of a number...")}</p>`,start:`# Mission 1: create the secret number\n`,
  use:[[/secret\s*=\s*7/,"Make the secret: secret = 7"],[/print\s*\(/,"Print the message with print(...)."]],out:["I'm thinking of a number..."],
  hint:`secret = 7\nprint("I'm thinking of a number...")`},
 {type:"talk",title:"New piece: input()",mood:"think",
  body:`<p>${C("input()")} asks the player a question and waits for an answer. The answer is always <b>text</b>, so wrap it in ${C("int()")} to turn it into a number you can compare. The answers go in the <b>⌨️ Input</b> box under the code.</p>`,
  input:"4",demo:`guess = int(input("Guess the number: "))\nprint("You guessed", guess)\nprint("Double that is", guess * 2)`,
  say:"Change the number in the Input box and run it again."},
 {type:"code",mission:"Mission 2",title:"Ask the player",body:`<p>Ask with ${C('input("Guess the number: ")')}, turn the answer into a number, and print ${C("You guessed 4")} (with whatever they typed).</p>`,start:`secret = 7\n# Mission 2: ask the player for a guess\n`,
  use:[[/input\s*\(/,"Ask with input(...)."],[/int\s*\(/,"Turn the answer into a number with int(...)."]],tests:[{input:"4",out:["You guessed 4"]},{input:"9",out:["You guessed 9"]}],
  hint:`secret = 7\nguess = int(input("Guess the number: "))\nprint("You guessed", guess)`},
 {type:"code",mission:"Mission 3",title:"Check their guess",body:`<p>If the guess equals the secret, print ${C("You got it!")} Otherwise print ${C("Nope!")}</p>`,start:`secret = 7\nguess = int(input("Guess the number: "))\n# Mission 3: check the guess\n`,
  use:[[/if\s+guess\s*==\s*secret|if\s+secret\s*==\s*guess/,"Compare with if guess == secret:"],[/else\s*:/,"Use else: for a wrong guess."]],tests:[{input:"7",out:["You got it!"]},{input:"3",out:["Nope!"]}],
  hint:`secret = 7\nguess = int(input("Guess the number: "))\nif guess == secret:\n    print("You got it!")\nelse:\n    print("Nope!")`},
 {type:"code",mission:"Mission 4",title:"Give the player hints",body:`<p>Make it helpful: print ${C("Too low")} if the guess is smaller, ${C("Too high")} if it's bigger, and ${C("You got it!")} if it's right.</p>`,start:`secret = 7\nguess = int(input("Guess the number: "))\nif guess == secret:\n    print("You got it!")\nelse:\n    print("Nope!")\n`,
  use:[[/elif/,"Use elif for the extra case."]],tests:[{input:"3",out:["Too low"]},{input:"9",out:["Too high"]},{input:"7",out:["You got it!"]}],
  hint:`secret = 7\nguess = int(input("Guess the number: "))\nif guess < secret:\n    print("Too low")\nelif guess > secret:\n    print("Too high")\nelse:\n    print("You got it!")`},
 {type:"talk",title:"New piece: keep looping",
  body:`<p>One guess isn't much of a game. A ${C("while")} loop keeps asking until the guess is right. Set ${C("guess")} to something wrong first so the loop starts, and count the tries as you go.</p>`,
  input:"2\n5",demo:`target = 5\nguess = 0\ntries = 0\nwhile guess != target:\n    guess = int(input("Number: "))\n    tries += 1\nprint("Found it after", tries, "tries")`,
  say:"It keeps asking until the answer matches."},
 {type:"code",mission:"Mission 5",title:"Keep guessing",body:`<p>Wrap it in a loop so the player keeps guessing until they're right. Count the tries, and when they get it print ${C("You got it! Guesses: 3")} (with the real count). Keep printing Too low / Too high for wrong guesses.</p>`,start:`secret = 7\nguess = int(input("Guess the number: "))\nif guess < secret:\n    print("Too low")\nelif guess > secret:\n    print("Too high")\nelse:\n    print("You got it!")\n`,
  use:[[/while/,"Keep asking in a while loop."],[/tries/,"Count the guesses in a variable called tries."]],tests:[{input:"3\n9\n7",out:["Too low","Too high","You got it! Guesses: 3"]},{input:"7",out:["You got it! Guesses: 1"]}],
  hint:`secret = 7\nguess = 0\ntries = 0\nwhile guess != secret:\n    guess = int(input("Guess the number: "))\n    tries += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\nprint(f"You got it! Guesses: {tries}")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>You've learned every piece: a secret, input, if/elif/else and a loop. Now <b>build the final version yourself</b>, from an empty file. TypeMonkey will play your game a few different ways to check it really works.</p>`,
  say:"No peeking at the missions! (Okay, a little peeking is fine.)"},
 {type:"code",final:true,title:"Build the Number Guessing Game",body:`<p>From scratch, build the whole game:</p><ul><li>the secret number is ${C("7")}</li><li>keep asking ${C('"Guess the number: "')} until the player gets it</li><li>print ${C("Too low")} or ${C("Too high")} after wrong guesses</li><li>finish with ${C("You got it! Guesses: N")}</li></ul>`,start:`# Build the whole game here!\n`,
  use:[[/input\s*\(/,"Ask for guesses with input(...)."],[/while/,"Keep asking in a loop."]],tests:[{input:"3\n9\n7",out:["Too low","Too high","You got it! Guesses: 3"]},{input:"10\n1\n5\n7",out:["Too high","Too low","Too low","You got it! Guesses: 4"]},{input:"7",out:["You got it! Guesses: 1"]}],
  hint:`secret = 7\nguess = 0\ntries = 0\nwhile guess != secret:\n    guess = int(input("Guess the number: "))\n    tries += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\nprint(f"You got it! Guesses: {tries}")`},
 {type:"talk",title:"Make it yours",mood:"cheer",
  body:`<p>Your game works! Ideas to try in the Playground: use ${C("import random")} and ${C("random.randint(1, 100)")} for a real secret, give the player only 5 tries, or print a different message for a one-try win.</p>`,
  say:"Real programmers add features one at a time, exactly like you just did."},
 {type:"done"}]}
,PJ_MADLIBS,PJ_8BALL]},
{name:"Intermediate",lessons:[
{id:"pj2",title:"Project 04 · Quiz Master",sub:"lists, tuples, loops, scores",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a quiz game that asks questions, checks the answers, and gives a final score.</b></p><p>Answers shouldn't care about capital letters or extra spaces, so <i>Yellow</i> and <i> yellow </i> both count. At the end the player gets a score and a rating.</p>`,
  say:"Quiz shows are just loops and if statements!"},
 {type:"code",mission:"Mission 1",title:"Store the questions",body:`<p>Make a list ${C("questions")} of (question, answer) pairs using the three below. Then print ${C("Quiz time! 3 questions")} using ${C("len()")}.</p><p><code class="i">What color are bananas?</code> → <code class="i">yellow</code>, <code class="i">How many legs does a spider have?</code> → <code class="i">8</code>, <code class="i">What planet do we live on?</code> → <code class="i">earth</code></p>`,start:`# Mission 1: store the questions\n`,
  use:[[/questions\s*=\s*\[/,"Make a list called questions."],[/len\s*\(\s*questions\s*\)/,"Count them with len(questions)."]],out:["Quiz time! 3 questions"],
  hint:`questions = [\n    ("What color are bananas?", "yellow"),\n    ("How many legs does a spider have?", "8"),\n    ("What planet do we live on?", "earth"),\n]\nprint(f"Quiz time! {len(questions)} questions")`},
 {type:"talk",title:"New piece: unpacking pairs",mood:"think",
  body:`<p>When you loop over pairs, you can give each half a name at once: ${C("for q, a in questions:")}. ${C(".strip().lower()")} cleans up an answer so spaces and capitals don't matter.</p>`,
  input:"  YELLOW ",demo:`pairs = [("Banana color?", "yellow")]\nfor q, a in pairs:\n    reply = input(q + " ")\n    print("You said:", reply.strip().lower())\n    print("Match?", reply.strip().lower() == a)`,
  say:"Messy answer in, clean answer out."},
 {type:"code",mission:"Mission 2",title:"Ask and check",body:`<p>Loop over the questions. Ask each one with ${C("input()")}. Print ${C("Correct!")} for a right answer, or ${C("Nope, it was yellow")} (with the right answer) for a wrong one. Ignore capitals and spaces.</p>`,start:`questions = [\n    ("What color are bananas?", "yellow"),\n    ("How many legs does a spider have?", "8"),\n    ("What planet do we live on?", "earth"),\n]\n# Mission 2: ask each question and check it\n`,
  use:[[/for\s+\w+\s*,\s*\w+\s+in\s+questions/,"Loop with for q, a in questions:"],[/lower\s*\(\s*\)/,"Use .lower() so capitals don't matter."]],tests:[{input:"yellow\n6\nEarth",out:["Correct!","Nope, it was 8","Correct!"]},{input:" Yellow \n8\nmars",out:["Correct!","Correct!","Nope, it was earth"]}],
  hint:`questions = [\n    ("What color are bananas?", "yellow"),\n    ("How many legs does a spider have?", "8"),\n    ("What planet do we live on?", "earth"),\n]\nfor q, a in questions:\n    reply = input(q + " ")\n    if reply.strip().lower() == a:\n        print("Correct!")\n    else:\n        print(f"Nope, it was {a}")`},
 {type:"code",mission:"Mission 3",title:"Keep score",body:`<p>Count the right answers in ${C("score")}. After the last question, print ${C("You scored 2/3")}. Then a rating: ${C("Perfect!")} for all right, ${C("Nice job!")} for at least half, otherwise ${C("Keep practicing!")}</p>`,start:`questions = [\n    ("What color are bananas?", "yellow"),\n    ("How many legs does a spider have?", "8"),\n    ("What planet do we live on?", "earth"),\n]\nfor q, a in questions:\n    reply = input(q + " ")\n    if reply.strip().lower() == a:\n        print("Correct!")\n    else:\n        print(f"Nope, it was {a}")\n`,
  use:[[/score\s*\+=\s*1|score\s*=\s*score\s*\+\s*1/,"Add 1 to score for each right answer."]],tests:[{input:"yellow\n6\nEarth",out:["Correct!","Nope, it was 8","Correct!","You scored 2/3","Nice job!"]},{input:"yellow\n8\nearth",out:["Correct!","Correct!","Correct!","You scored 3/3","Perfect!"]},{input:"red\n2\nmars",out:["Nope, it was yellow","Nope, it was 8","Nope, it was earth","You scored 0/3","Keep practicing!"]}],
  hint:`questions = [\n    ("What color are bananas?", "yellow"),\n    ("How many legs does a spider have?", "8"),\n    ("What planet do we live on?", "earth"),\n]\nscore = 0\nfor q, a in questions:\n    reply = input(q + " ")\n    if reply.strip().lower() == a:\n        print("Correct!")\n        score += 1\n    else:\n        print(f"Nope, it was {a}")\nprint(f"You scored {score}/{len(questions)}")\nif score == len(questions):\n    print("Perfect!")\nelif score >= len(questions) / 2:\n    print("Nice job!")\nelse:\n    print("Keep practicing!")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Now build the whole Quiz Master yourself, from an empty file. TypeMonkey will take your quiz three times with different answers.</p>`,
  say:"You've got all the pieces. Build it!"},
 {type:"code",final:true,title:"Build Quiz Master",body:`<p>Build it from scratch with the same three questions:</p><ul><li>ask each question with ${C("input()")}</li><li>${C("Correct!")} or ${C("Nope, it was ...")} after each one (ignore capitals and spaces)</li><li>${C("You scored S/3")}, then ${C("Perfect!")}, ${C("Nice job!")} or ${C("Keep practicing!")}</li></ul>`,start:`# Build Quiz Master here!\n`,
  use:[[/input\s*\(/,"Ask with input(...)."],[/for\s/,"Loop over the questions."]],tests:[{input:"yellow\n6\nEarth",out:["Correct!","Nope, it was 8","Correct!","You scored 2/3","Nice job!"]},{input:"YELLOW\n8\n earth ",out:["Correct!","Correct!","Correct!","You scored 3/3","Perfect!"]},{input:"red\n8\nmars",out:["Nope, it was yellow","Correct!","Nope, it was earth","You scored 1/3","Keep practicing!"]}],
  hint:`questions = [\n    ("What color are bananas?", "yellow"),\n    ("How many legs does a spider have?", "8"),\n    ("What planet do we live on?", "earth"),\n]\nscore = 0\nfor q, a in questions:\n    reply = input(q + " ")\n    if reply.strip().lower() == a:\n        print("Correct!")\n        score += 1\n    else:\n        print(f"Nope, it was {a}")\nprint(f"You scored {score}/{len(questions)}")\nif score == len(questions):\n    print("Perfect!")\nelif score >= len(questions) / 2:\n    print("Nice job!")\nelse:\n    print("Keep practicing!")`},
 {type:"done"}]}
,PJ_RPS,PJ_PET]},
{name:"Advanced",lessons:[
{id:"pj3",title:"Project 07 · To-Do List App",sub:"command loops, lists, functions, errors",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a to-do list app that the user controls by typing commands.</b></p><ul><li><code class="i">add buy bananas</code> adds a task</li><li><code class="i">list</code> shows the tasks, numbered</li><li><code class="i">done 1</code> finishes task 1</li><li><code class="i">quit</code> ends the app</li></ul><p>This is how real command-line tools work.</p>`,
  say:"Your first real app! Let's build it piece by piece."},
 {type:"code",mission:"Mission 1",title:"The command loop",body:`<p>Keep reading commands with ${C('input("> ")')} until the user types ${C("quit")}, then print ${C("Bye!")} For any other command, print ${C("Unknown command: ...")} for now.</p>`,start:`# Mission 1: keep reading commands until quit\n`,
  use:[[/while/,"Keep going in a while loop."],[/quit/,"Stop when the command is quit."]],tests:[{input:"hello\nquit",out:["Unknown command: hello","Bye!"]},{input:"quit",out:["Bye!"]}],
  hint:`while True:\n    cmd = input("> ")\n    if cmd == "quit":\n        break\n    print(f"Unknown command: {cmd}")\nprint("Bye!")`},
 {type:"talk",title:"New piece: splitting commands",mood:"think",
  body:`<p>${C('cmd.split(" ", 1)')} cuts a command into the first word and <b>everything else</b>: ${C('"add buy milk"')} becomes ${C('["add", "buy milk"]')}. Check ${C("len()")} before using the second part, because ${C('"list"')} has only one part.</p>`,
  input:"add buy milk",demo:`cmd = input("> ")\nparts = cmd.split(" ", 1)\nprint(parts)\nprint("word:", parts[0])\nif len(parts) > 1:\n    print("rest:", parts[1])`,
  say:"One split, and you know exactly what the user wants."},
 {type:"code",mission:"Mission 2",title:"add and list",body:`<p>Keep a list ${C("tasks")}. ${C("add ...")} adds the task and prints ${C("Added: buy bananas")}. ${C("list")} prints each task numbered like ${C("1. buy bananas")}, or ${C("Nothing to do!")} if the list is empty.</p>`,start:`while True:\n    cmd = input("> ")\n    if cmd == "quit":\n        break\n    print(f"Unknown command: {cmd}")\nprint("Bye!")\n`,
  use:[[/tasks\s*=\s*\[\s*\]/,"Start with an empty list: tasks = []"],[/append\s*\(/,"Add tasks with .append(...)."],[/enumerate|range\s*\(\s*len/,"Number the tasks with enumerate(tasks, 1)."]],tests:[{input:"list\nadd buy bananas\nadd feed Mo\nlist\nquit",out:["Nothing to do!","Added: buy bananas","Added: feed Mo","1. buy bananas","2. feed Mo","Bye!"]},{input:"jump\nquit",out:["Unknown command: jump","Bye!"]}],
  hint:`tasks = []\nwhile True:\n    cmd = input("> ")\n    parts = cmd.split(" ", 1)\n    if parts[0] == "quit":\n        break\n    elif parts[0] == "add" and len(parts) > 1:\n        tasks.append(parts[1])\n        print(f"Added: {parts[1]}")\n    elif parts[0] == "list":\n        if not tasks:\n            print("Nothing to do!")\n        for i, t in enumerate(tasks, 1):\n            print(f"{i}. {t}")\n    else:\n        print(f"Unknown command: {cmd}")\nprint("Bye!")`},
 {type:"talk",title:"New piece: handling bad input",mood:"oops",
  body:`<p>Users type weird things. ${C("int(\"two\")")} crashes with a ValueError, and asking for task 9 in a list of 2 is an IndexError. Wrap risky code in ${C("try")} / ${C("except")} so the app keeps running.</p>`,
  input:"two",demo:`items = ["a", "b"]\ntry:\n    n = int(input("Which? "))\n    print(items[n - 1])\nexcept (ValueError, IndexError):\n    print("That's not a valid number")`,
  say:"A good app never crashes, it explains."},
 {type:"code",mission:"Mission 3",title:"Finish tasks",body:`<p>Add ${C("done N")}: remove task number N and print ${C("Finished: buy bananas")}. If N isn't a number or there's no such task, print ${C("No task #N")}. When the user quits, print ${C("Bye! 1 tasks left")} with the real count.</p>`,start:`tasks = []\nwhile True:\n    cmd = input("> ")\n    parts = cmd.split(" ", 1)\n    if parts[0] == "quit":\n        break\n    elif parts[0] == "add" and len(parts) > 1:\n        tasks.append(parts[1])\n        print(f"Added: {parts[1]}")\n    elif parts[0] == "list":\n        if not tasks:\n            print("Nothing to do!")\n        for i, t in enumerate(tasks, 1):\n            print(f"{i}. {t}")\n    else:\n        print(f"Unknown command: {cmd}")\nprint("Bye!")\n`,
  use:[[/try\s*:/,"Use try: so bad numbers don't crash the app."],[/pop\s*\(|del\s/,"Remove the task with tasks.pop(...)."]],tests:[{input:"add buy bananas\nadd feed Mo\ndone 1\nlist\nquit",out:["Added: buy bananas","Added: feed Mo","Finished: buy bananas","1. feed Mo","Bye! 1 tasks left"]},{input:"add x\ndone 5\ndone two\nquit",out:["Added: x","No task #5","No task #two","Bye! 1 tasks left"]}],
  hint:`tasks = []\nwhile True:\n    cmd = input("> ")\n    parts = cmd.split(" ", 1)\n    if parts[0] == "quit":\n        break\n    elif parts[0] == "add" and len(parts) > 1:\n        tasks.append(parts[1])\n        print(f"Added: {parts[1]}")\n    elif parts[0] == "list":\n        if not tasks:\n            print("Nothing to do!")\n        for i, t in enumerate(tasks, 1):\n            print(f"{i}. {t}")\n    elif parts[0] == "done" and len(parts) > 1:\n        try:\n            n = int(parts[1])\n            if n < 1:\n                raise IndexError\n            print(f"Finished: {tasks.pop(n - 1)}")\n        except (ValueError, IndexError):\n            print(f"No task #{parts[1]}")\n    else:\n        print(f"Unknown command: {cmd}")\nprint(f"Bye! {len(tasks)} tasks left")`},
 {type:"talk",title:"🎉 The tutorial is over",mood:"cheer",
  body:`<p>Final challenge: build the whole To-Do app yourself. To make it cleaner, put the work in functions, like ${C("def add_task(text):")} and ${C("def show_tasks():")}. TypeMonkey will run three different sessions of commands.</p>`,
  say:"This is a real app. Take your time!"},
 {type:"code",final:true,title:"Build the To-Do List App",body:`<p>From scratch, with at least one function:</p><ul><li>${C("add TEXT")} → ${C("Added: TEXT")}</li><li>${C("list")} → numbered tasks, or ${C("Nothing to do!")}</li><li>${C("done N")} → ${C("Finished: TEXT")}, or ${C("No task #N")}</li><li>anything else → ${C("Unknown command: ...")}</li><li>${C("quit")} → ${C("Bye! N tasks left")}</li></ul>`,start:`# Build the To-Do List App here!\n`,
  use:[[/def\s+\w+\s*\(/,"Put some of the work in a function with def."],[/input\s*\(/,"Read commands with input(...)."]],tests:[{input:"add buy bananas\nadd feed Mo\ndone 1\nlist\nquit",out:["Added: buy bananas","Added: feed Mo","Finished: buy bananas","1. feed Mo","Bye! 1 tasks left"]},{input:"list\ndance\nquit",out:["Nothing to do!","Unknown command: dance","Bye! 0 tasks left"]},{input:"add a\nadd b\nadd c\ndone 2\ndone 9\nlist\nquit",out:["Added: a","Added: b","Added: c","Finished: b","No task #9","1. a","2. c","Bye! 2 tasks left"]}],
  hint:`tasks = []\n\ndef add_task(text):\n    tasks.append(text)\n    print(f"Added: {text}")\n\ndef show_tasks():\n    if not tasks:\n        print("Nothing to do!")\n    for i, t in enumerate(tasks, 1):\n        print(f"{i}. {t}")\n\ndef finish(num):\n    try:\n        n = int(num)\n        if n < 1:\n            raise IndexError\n        print(f"Finished: {tasks.pop(n - 1)}")\n    except (ValueError, IndexError):\n        print(f"No task #{num}")\n\nwhile True:\n    cmd = input("> ")\n    parts = cmd.split(" ", 1)\n    if parts[0] == "quit":\n        break\n    elif parts[0] == "add" and len(parts) > 1:\n        add_task(parts[1])\n    elif parts[0] == "list":\n        show_tasks()\n    elif parts[0] == "done" and len(parts) > 1:\n        finish(parts[1])\n    else:\n        print(f"Unknown command: {cmd}")\nprint(f"Bye! {len(tasks)} tasks left")`},
 {type:"done"}]}
,PJ_ADVENTURE
]}
]};

const BUG_INTRO=(level,what)=>({type:"talk",title:`🐛 Bug Lab · Level ${level}`,mood:"think",
  body:`<p>${what}</p><p>All the code in Bug Lab is <b>Python</b> 🐍. For each one: press <b>▶ Run</b> to see what goes wrong, then fix the code until it does what it should. If you're stuck, hints come one at a time. Try to fix it without them!</p>`,
  say:"Finding bugs is a real programmer superpower. Let's train it!"});

const COURSE_BUGLAB={id:"buglab",name:"Bug Lab",extra:true,blurb:"This code is broken. Fix it! Five levels, from typos to debugging a real mini-project. Hints come one at a time. In Python. Level 1 is free.",units:[
{name:"Level 1 · Syntax slips",free:true,lessons:[
{id:"bug1",title:"Syntax slips",sub:"missing colons, quotes and brackets",steps:[
 BUG_INTRO(1,"Level 1 bugs stop the program from running at all. Python can't understand the code, so it shows an error before anything prints. The error message is your best clue!"),
 {type:"bug",title:"Can Alex play?",body:`<p>This should print ${C("Alex can play")}, but it won't even start.</p>`,
  start:`name = "Alex"\nage = 15\n\nif age >= 13\n    print(name + " can play")\n`,out:["Alex can play"],
  hints:["Look closely at the <code class=\"i\">if</code> line.","What does Python expect at the end of an <code class=\"i\">if</code> condition?"],
  explain:"Every <code class=\"i\">if</code> line must end with a colon <code class=\"i\">:</code>. It tells Python \"the indented block below belongs to this if\". The fix: <code class=\"i\">if age >= 13:</code>",
  hint:`name = "Alex"\nage = 15\n\nif age >= 13:\n    print(name + " can play")`},
 {type:"bug",title:"The unfinished greeting",body:`<p>This should print ${C("Hello, world!")}</p>`,
  start:`print("Hello, world!)\n`,out:["Hello, world!"],
  hints:["The error mentions a string. Look at the quote marks.","Every string needs a quote at the start <b>and</b> at the end."],
  explain:"The string starts with <code class=\"i\">\"</code> but never ends, so Python reads the rest of the line as text. Add the closing quote: <code class=\"i\">print(\"Hello, world!\")</code>",
  hint:`print("Hello, world!")`},
 {type:"bug",title:"Missing bracket",body:`<p>This should print ${C("Score: 15")}</p>`,
  start:`points = 10\nbonus = 5\nprint("Score:", points + bonus\n`,out:["Score: 15"],
  hints:["Count the brackets on the print line.","Every <code class=\"i\">(</code> needs a matching <code class=\"i\">)</code>."],
  explain:"<code class=\"i\">print(</code> opens a bracket that never closes. Add <code class=\"i\">)</code> at the end of the line.",
  hint:`points = 10\nbonus = 5\nprint("Score:", points + bonus)`},
 {type:"bug",title:"Lost indentation",body:`<p>This should count ${C("0")}, ${C("1")}, ${C("2")} on separate lines.</p>`,
  start:`for i in range(3):\nprint(i)\n`,out:["0","1","2"],
  hints:["The error talks about indentation. Which line belongs inside the loop?","Code inside a loop has to be pushed in (indented) under the for line."],
  explain:"Python uses indentation to know what's inside the loop. The <code class=\"i\">print(i)</code> line needs 4 spaces in front of it.",
  hint:`for i in range(3):\n    print(i)`},
 {type:"done"}]}
]},
{name:"Level 2 · Variable mix-ups",lessons:[
{id:"bug2",title:"Variable mix-ups",sub:"typos, capitals, wrong types",steps:[
 BUG_INTRO(2,"Level 2 bugs are about variables: misspelled names, capital letters that don't match, and mixing up text and numbers. Python's error message usually names the variable that's wrong."),
 {type:"bug",title:"The mystery name",body:`<p>This should print ${C("10")}</p>`,
  start:`score = 10\nprint(scroe)\n`,out:["10"],
  hints:["Read the error: which name does Python say it doesn't know?","Compare the spelling of the two names letter by letter."],
  explain:"The variable is called <code class=\"i\">score</code>, but the print says <code class=\"i\">scroe</code>. To Python those are completely different names.",
  hint:`score = 10\nprint(score)`},
 {type:"bug",title:"Capital trouble",body:`<p>This should print ${C("Hi, Mo")}</p>`,
  start:`Name = "Mo"\nprint("Hi, " + name)\n`,out:["Hi, Mo"],
  hints:["Python cares about capital letters.","Is it <code class=\"i\">Name</code> or <code class=\"i\">name</code>?"],
  explain:"Python names are case-sensitive, so <code class=\"i\">Name</code> and <code class=\"i\">name</code> are different variables. Use the same spelling (most Python code uses lowercase).",
  hint:`name = "Mo"\nprint("Hi, " + name)`},
 {type:"bug",title:"Text plus a number",body:`<p>This should print ${C("I am 12 years old")}</p>`,
  start:`age = 12\nprint("I am " + age + " years old")\n`,out:["I am 12 years old"],
  hints:["The error says you can only join a str to a str.","<code class=\"i\">age</code> is a number. How can you turn it into text?"],
  explain:"You can't glue a number onto text with <code class=\"i\">+</code>. Turn it into text with <code class=\"i\">str(age)</code>, or use an f-string: <code class=\"i\">print(f\"I am {age} years old\")</code>",
  hint:`age = 12\nprint("I am " + str(age) + " years old")`},
 {type:"bug",title:"Too early",body:`<p>This should print ${C("Total: 15")}</p>`,
  start:`print("Total:", total)\ntotal = 5 + 10\n`,out:["Total: 15"],
  hints:["Python runs your code from top to bottom.","When the print runs, does <code class=\"i\">total</code> exist yet?"],
  explain:"The print happens before <code class=\"i\">total</code> is created. Swap the two lines so the variable is made first.",
  hint:`total = 5 + 10\nprint("Total:", total)`},
 {type:"done"}]}
]},
{name:"Level 3 · Logic errors",lessons:[
{id:"bug3",title:"Logic errors",sub:"code that runs but gives the wrong answer",steps:[
 BUG_INTRO(3,"Level 3 bugs are sneaky: there's <b>no error message</b>. The code runs fine but gives the wrong answer. Compare what it prints with what it should print, then think about why."),
 {type:"bug",title:"Count to five",body:`<p>This should print 1, 2, 3, 4 and 5, each on its own line. It runs... but something's missing.</p>`,
  start:`for i in range(1, 5):\n    print(i)\n`,out:["1","2","3","4","5"],
  hints:["Run it. Which number is missing?","<code class=\"i\">range(1, 5)</code> stops <b>before</b> the second number."],
  explain:"<code class=\"i\">range(a, b)</code> goes up to but not including <code class=\"i\">b</code>. To include 5, use <code class=\"i\">range(1, 6)</code>. This mistake is so common it has a name: an off-by-one error.",
  hint:`for i in range(1, 6):\n    print(i)`},
 {type:"bug",title:"Just enough to pass",body:`<p>A score of 50 or more is a pass. This student got exactly 50, so it should print ${C("Pass")}</p>`,
  start:`score = 50\nif score > 50:\n    print("Pass")\nelse:\n    print("Try again")\n`,out:["Pass"],
  hints:["What happens when the score is exactly 50?","Is 50 greater than 50?"],
  explain:"<code class=\"i\">></code> means strictly greater, so 50 doesn't count. \"50 or more\" is <code class=\"i\">>=</code>.",
  hint:`score = 50\nif score >= 50:\n    print("Pass")\nelse:\n    print("Try again")`},
 {type:"bug",title:"The forgetful total",body:`<p>This should add up the list and print ${C("15")}</p>`,
  start:`nums = [1, 2, 3, 4, 5]\nfor n in nums:\n    total = 0\n    total += n\nprint(total)\n`,out:["15"],
  hints:["It prints 5. What happens to total every time the loop goes around?","Where should the total start: inside the loop, or before it?"],
  explain:"<code class=\"i\">total = 0</code> is inside the loop, so it's reset to 0 on every round and only the last number survives. Move it above the loop.",
  hint:`nums = [1, 2, 3, 4, 5]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)`},
 {type:"bug",title:"Average trouble",body:`<p>This should print the average of the scores: ${C("6.0")}</p>`,
  start:`scores = [4, 8, 6]\naverage = sum(scores) / 2\nprint(average)\n`,out:["6.0"],
  hints:["How many scores are there?","Instead of typing the count, let Python count the list for you."],
  explain:"It divides by 2, but there are 3 scores. Use <code class=\"i\">len(scores)</code> so it's always right, even if the list changes.",
  hint:`scores = [4, 8, 6]\naverage = sum(scores) / len(scores)\nprint(average)`},
 {type:"done"}]}
]},
{name:"Level 4 · Multiple bugs",lessons:[
{id:"bug4",title:"Multiple bugs",sub:"more than one thing is wrong",steps:[
 BUG_INTRO(4,"Level 4 programs have <b>two or three bugs each</b>. Fix one, run it again, and see what the next problem is. That loop of fix → run → read is exactly how real debugging works."),
 {type:"bug",title:"Broken greeter",body:`<p>This should print ${C("Hi, Mo!")} and ${C("Hi, Kiki!")} <i>(2 bugs)</i></p>`,
  start:`def greet(name)\n    print("Hi, " + nme + "!")\n\ngreet("Mo")\ngreet("Kiki")\n`,out:["Hi, Mo!","Hi, Kiki!"],
  hints:["Bug 1 is on the <code class=\"i\">def</code> line. What's missing at the end?","Bug 2: check the spelling of the variable inside the print."],
  explain:"The <code class=\"i\">def</code> line needs a colon, and <code class=\"i\">nme</code> should be <code class=\"i\">name</code> to match the parameter.",
  hint:`def greet(name):\n    print("Hi, " + name + "!")\n\ngreet("Mo")\ngreet("Kiki")`},
 {type:"bug",title:"Shopping total",body:`<p>This should print ${C("Total: 10")} <i>(2 bugs)</i></p>`,
  start:`prices = [2, 3, 5]\ntotal = 0\nfor p in prices\n    total = p\nprint("Total:", total)\n`,out:["Total: 10"],
  hints:["Bug 1 stops it running: look at the end of the <code class=\"i\">for</code> line.","Bug 2: after fixing it, it prints 5. Does <code class=\"i\">total = p</code> add, or replace?"],
  explain:"The <code class=\"i\">for</code> line needs a colon, and <code class=\"i\">total = p</code> replaces the total each time. Use <code class=\"i\">total += p</code> to add.",
  hint:`prices = [2, 3, 5]\ntotal = 0\nfor p in prices:\n    total += p\nprint("Total:", total)`},
 {type:"bug",title:"Even numbers",body:`<p>This should print every even number from 2 to 10 (2, 4, 6, 8, 10) on separate lines. <i>(2 bugs)</i></p>`,
  start:`for n in range(1, 10):\n    if n % 2 = 0:\n        print(n)\n`,out:["2","4","6","8","10"],
  hints:["Bug 1 is a syntax error in the <code class=\"i\">if</code>. Is it storing a value or comparing?","Bug 2: once it runs, is 10 printed? Check where the range stops."],
  explain:"<code class=\"i\">=</code> stores a value; comparing needs <code class=\"i\">==</code>. And <code class=\"i\">range(1, 10)</code> stops at 9, so use <code class=\"i\">range(1, 11)</code> to reach 10.",
  hint:`for n in range(1, 11):\n    if n % 2 == 0:\n        print(n)`},
 {type:"done"}]}
]},
{name:"Level 5 · Debug a real project",lessons:[
{id:"bug5",title:"Debug a mini-project",sub:"fix a whole game",steps:[
 BUG_INTRO(5,"Level 5: a whole program written by a very tired monkey. Each one has <b>three bugs</b> of different kinds. TypeMonkey will play the game with different answers to check every bug is gone."),
 {type:"bug",title:"The guessing game",body:`<p>The player guesses until they find the secret number 7. It should print Too low / Too high, then ${C("Got it! Guesses: N")} <i>(3 bugs)</i></p>`,
  start:`secret = 7\ntries = 0\nwhile True:\n    guess = input("Guess: ")\n    tries + 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret\n        print("Too high")\n    else:\n        print(f"Got it! Guesses: {tries}")\n        break\n`,tests:[{input:"3\n9\n7",out:["Too low","Too high","Got it! Guesses: 3"]},{input:"7",out:["Got it! Guesses: 1"]}],
  hints:["Start with the syntax error: one of the <code class=\"i\">elif</code>/<code class=\"i\">if</code> lines is missing something.","Next: <code class=\"i\">input()</code> gives text. Can you compare text with the number 7?","Last: the try counter never goes up. Does <code class=\"i\">tries + 1</code> change tries?"],
  explain:"1) <code class=\"i\">elif guess > secret</code> needs a colon. 2) The guess must be a number: <code class=\"i\">int(input(\"Guess: \"))</code>. 3) <code class=\"i\">tries + 1</code> calculates a number and throws it away; use <code class=\"i\">tries += 1</code>.",
  hint:`secret = 7\ntries = 0\nwhile True:\n    guess = int(input("Guess: "))\n    tries += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\n    else:\n        print(f"Got it! Guesses: {tries}")\n        break`},
 {type:"bug",title:"The grade report",body:`<p>${C("letter()")} turns a score into a grade: 90+ is A, 80+ is B, 70+ is C, anything lower is F. The report should print each student's grade and the class average. <i>(3 bugs)</i></p>`,
  start:`def letter(score):\n    if score >= 70:\n        return "C"\n    elif score >= 80:\n        return "B"\n    elif score >= 90:\n        return "A"\n    else:\n        return "F"\n\nscores = {"Ava": 95, "Leo": 82, "Kai": 64}\nfor name in scores:\n    print(name, letter(scores[name]))\nprint("Average:", sum(scores) / len(scores))\n`,out:["Ava A","Leo B","Kai F","Average: 80.33"],
  hints:["Ava gets C instead of A. Which check does Python try first?","The order of the checks matters: the first one that's true wins. Put the highest grade first.","For the average: <code class=\"i\">sum(scores)</code> on a dictionary adds up the <b>keys</b>. You want the values, rounded to 2 decimals."],
  explain:"1) The checks are in the wrong order: 95 is already >= 70, so it returns C. Check 90 first, then 80, then 70. 2) <code class=\"i\">sum(scores)</code> tries to add the names; use <code class=\"i\">sum(scores.values())</code>. 3) Round it: <code class=\"i\">round(..., 2)</code>.",
  hint:`def letter(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    elif score >= 70:\n        return "C"\n    else:\n        return "F"\n\nscores = {"Ava": 95, "Leo": 82, "Kai": 64}\nfor name in scores:\n    print(name, letter(scores[name]))\nprint("Average:", round(sum(scores.values()) / len(scores), 2))`},
 {type:"talk",title:"🏆 Bug Lab complete",mood:"cheer",
  body:`<p>You fixed syntax errors, variable mix-ups, logic errors, programs with several bugs, and whole broken projects. That's real debugging, the skill programmers use every single day.</p>`,
  say:"Bug squasher certified! 🐛🔨"},
 {type:"done"}]}
]}
]};
