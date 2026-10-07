/* deep-python: launch depth units. Python Unit 8 (text & lists workshop) and Unit 9 (objects & safe code).
   Lots of small, scaffolded challenges; each unit starts with a gentle warm-up and ends with a project. */

COURSE_PY.units.push({name:"Text & list workshop",lessons:[
{id:"py25",title:"Warm-up: loops & lists",sub:"a gentle practice round",steps:[
 {type:"talk",title:"Welcome back!",mood:"cheer",
  body:`<p>Let's warm up with something you already know: a ${C("for")} loop walks through a list, one item at a time.</p><p>Everything indented under the loop runs once for each item.</p>`,
  demo:`snacks = ["banana", "mango", "kiwi"]
for snack in snacks:
    print("I like", snack)`,
  say:"Output: I like banana, I like mango, I like kiwi. Three items, three lines."},
 {type:"code",title:"Say hi to everyone",body:`<p>The loop is ready. Replace ${C("pass")} with one ${C("print")} line so it says hi to each friend:</p><ul><li>${C("Hi, Mo!")}</li><li>${C("Hi, Ava!")}</li><li>${C("Hi, Leo!")}</li></ul>`,
  start:`friends = ["Mo", "Ava", "Leo"]
for name in friends:
    pass  # print Hi, then the name, then !
`,use:[[/print\s*\(/,"Print inside the loop with print(...)."]],out:["Hi, Mo!","Hi, Ava!","Hi, Leo!"],
  hint:`friends = ["Mo", "Ava", "Leo"]
for name in friends:
    print(f"Hi, {name}!")`},
 {type:"talk",title:"Adding up as you go",
  body:`<p>To add up a list, start a <b>total</b> at 0 and add each item to it inside the loop. ${C("total += n")} is short for ${C("total = total + n")}.</p>`,
  demo:`coins = [2, 5, 1]
total = 0
for n in coins:
    total += n
print(total)`,
  say:"Output: 8. (Python's sum(coins) does the same thing in one go!)"},
 {type:"code",title:"Banana total",body:`<p>Each number is how many bananas a monkey picked. Replace ${C("pass")} with a line that adds ${C("b")} to ${C("total")}, so the program prints ${C("14")}.</p>`,
  start:`bananas = [3, 5, 2, 4]
total = 0
for b in bananas:
    pass  # add b to total
print(total)
`,use:[[/total\s*\+=\s*b|total\s*=\s*total\s*\+\s*b/,"Add each b to the total with total += b"]],out:["14"],
  hint:`bananas = [3, 5, 2, 4]
total = 0
for b in bananas:
    total += b
print(total)`},
 {type:"talk",title:"Counting with if",mood:"think",
  body:`<p>Put an ${C("if")} inside the loop to count only <b>some</b> items. Here we count the ripe bananas (ripeness 7 or more).</p>`,
  demo:`ripeness = [3, 8, 9, 5, 7]
ripe = 0
for r in ripeness:
    if r >= 7:
        ripe += 1
print(ripe)`,
  say:"Output: 3. Only 8, 9 and 7 pass the if."},
 {type:"quiz",q:"What does this print?",code:`nums = [1, 2, 3]
count = 0
for n in nums:
    if n > 1:
        count += 1
print(count)`,opts:["2","3","1"],a:0,mono:true,why:"Only 2 and 3 are bigger than 1, so count goes up twice."},
 {type:"code",title:"Big scores",body:`<p>Count how many scores are <b>70 or more</b>. Replace ${C("pass")} with an ${C("if")} that adds 1 to ${C("count")}. The answer should be ${C("3")}.</p>`,
  start:`scores = [40, 85, 92, 60, 77]
count = 0
for s in scores:
    pass  # if s is 70 or more, add 1 to count
print(count)
`,use:[[/if\s+\S/,"Use an if inside the loop, like: if s >= 70:"]],out:["3"],
  hint:`scores = [40, 85, 92, 60, 77]
count = 0
for s in scores:
    if s >= 70:
        count += 1
print(count)`},
 {type:"game"},{type:"done"}],
 pool:[[`for x in [1, 2, 3]:
    print(x * 2)`,["2 4 6","1 2 3","6"]],[`total = 0
for n in [4, 6]:
    total += n
print(total)`,["10","46","6"]],[`print(len(["a", "b", "c"]))`,["3","2","abc"]],[`nums = [5, 1, 7]
print(max(nums) - min(nums))`,["6","4","7"]],[`for c in "hi":
    print(c)`,["h i","hi","i h"]]]},

{id:"py26",title:"String toolkit",sub:"upper, count, replace, strip",steps:[
 {type:"talk",title:"Strings have tools built in",
  body:`<p>Every string comes with handy <b>methods</b>. You call them with a dot: ${C("word.upper()")}.</p><ul><li>${C(".upper()")} SHOUTS</li><li>${C(".count(\"a\")")} counts letters</li><li>${C(".replace(\"a\", \"o\")")} swaps text</li></ul>`,
  demo:`word = "banana"
print(word.upper())
print(word.count("a"))
print(word.replace("a", "o"))`,
  say:"Output: BANANA, 3, bonono. The original word doesn't change; each method gives you a new string."},
 {type:"code",title:"Shout it",body:`<p>Change the print line so it prints ${C("msg")} in capitals: ${C("OOK OOK")}. Add ${C(".upper()")} after ${C("msg")}.</p>`,
  start:`msg = "ook ook"
print(msg)
`,use:[[/\.upper\s*\(/,"Use .upper() to make it capitals."]],out:["OOK OOK"],
  hint:`msg = "ook ook"
print(msg.upper())`},
 {type:"talk",title:"Checking text",mood:"think",
  body:`<p>Want to know if text contains something? Use ${C("in")}. To check the start or end, use ${C(".startswith()")} and ${C(".endswith()")}. They all give ${C("True")} or ${C("False")}.</p>`,
  demo:`email = "mo@jungle.com"
print("@" in email)
print(email.endswith(".com"))
print(email.startswith("ava"))`,
  say:"Output: True, True, False."},
 {type:"quiz",q:"What does this print?",code:`print("banana".startswith("ban"))`,opts:["True","False","ban"],a:0,mono:true,why:"\"banana\" does start with \"ban\"."},
 {type:"fill",title:"Swap a letter",body:`<p>Turn ${C("jungle")} into ${C("bungle")}.</p>`,code:`word = "jungle"
print(word.[0]("j", "b"))`,blanks:["replace"],tokens:["replace","swap","upper","count"],why:"replace(old, new) swaps every j for a b.",out:"bungle"},
 {type:"code",title:"Count the a's",body:`<p>Print how many times the letter ${C("a")} appears in ${C("text")}. Use ${C("text.count(\"a\")")}. You should see ${C("6")}.</p>`,
  start:`text = "a monkey ate a banana"
# print how many times "a" appears
`,use:[[/\.count\s*\(/,"Use .count(\"a\")."]],out:["6"],
  hint:`text = "a monkey ate a banana"
print(text.count("a"))`},
 {type:"talk",title:"Tidy up messy text",
  body:`<p>When people type, they add extra spaces and forget capitals. ${C(".strip()")} trims spaces off both ends and ${C(".title()")} Capitalizes Each Word. You can chain them!</p>`,
  demo:`raw = "   mo the monkey   "
print(raw.strip().title())`,
  say:"Output: Mo The Monkey"},
 {type:"code",title:"Name tidier",body:`<p>The player types their name, maybe messily, like ${C("  kiki  ")}. Tidy it with ${C(".strip()")} and ${C(".title()")} so the program prints ${C("Welcome, Kiki!")}.</p><p>Tip: add them to the end of the ${C("input(...)")} line.</p>`,
  start:`name = input("Your name: ")
print(f"Welcome, {name}!")
`,use:[[/\.strip\s*\(/,"Trim the spaces with .strip()."],[/\.title\s*\(/,"Add capitals with .title()."]],tests:[{input:"  kiki  ",out:["Welcome, Kiki!"]},{input:"ava",out:["Welcome, Ava!"]}],
  input:"  kiki  ",
  hint:`name = input("Your name: ").strip().title()
print(f"Welcome, {name}!")`},
 {type:"game"},{type:"done"}],
 pool:[[`print("ook".upper())`,["OOK","ook","Ook"]],[`print("kiwi".count("i"))`,["2","1","3"]],[`print("cat".replace("c", "b"))`,["bat","cat","bct"]],[`print("  hi  ".strip() + "!")`,["hi!","  hi  !","hi !"]],[`print("ape" in "grape")`,["True","False","ape"]]]},

{id:"py27",title:"split & join",sub:"turn text into lists and back",steps:[
 {type:"talk",title:"split() breaks text up",
  body:`<p>${C(".split()")} cuts a string at the spaces and gives you a <b>list of words</b>. Super useful for working with sentences!</p>`,
  demo:`sentence = "monkeys love ripe bananas"
words = sentence.split()
print(words)
print(len(words))`,
  say:"Output: ['monkeys', 'love', 'ripe', 'bananas'] and 4."},
 {type:"code",title:"Word count",body:`<p>Make ${C("words")} a list by adding ${C(".split()")} to the end of line 2. Then the program prints ${C("5")}, the number of words.</p>`,
  start:`line = "the quick brown monkey jumps"
words = line
print(len(words))
`,use:[[/\.split\s*\(/,"Split the line with .split()."]],out:["5"],
  hint:`line = "the quick brown monkey jumps"
words = line.split()
print(len(words))`},
 {type:"talk",title:"Split on anything",mood:"think",
  body:`<p>Put a character inside the brackets to split on it instead of spaces. Data is often stored with commas, like ${C("Mo,12,banana")}.</p><p>You can unpack the pieces straight into variables.</p>`,
  demo:`row = "Mo,12,banana"
name, age, food = row.split(",")
print(name)
print(int(age) + 1)
print(food)`,
  say:"Output: Mo, 13, banana. The pieces are text, so we use int() to do maths with the age."},
 {type:"quiz",q:"What does this print?",code:`parts = "a-b-c".split("-")
print(len(parts))`,opts:["3","5","1"],a:0,mono:true,why:"Splitting on - gives ['a', 'b', 'c']: three pieces."},
 {type:"talk",title:"join() glues a list together",mood:"cheer",
  body:`<p>${C("join")} is the opposite of split. Write the glue first, then ${C(".join(list)")}.</p>`,
  demo:`words = ["ook", "eek", "aah"]
print(" ".join(words))
print("-".join(words))`,
  say:"Output: ook eek aah, then ook-eek-aah."},
 {type:"fill",title:"Comma glue",body:`<p>Join the sounds with a comma and a space.</p>`,code:`words = ["ook", "eek", "aah"]
print([0].join(words))`,blanks:[`", "`],tokens:[`", "`,"split","words","print"],why:"The glue string goes before .join().",out:"ook, eek, aah"},
 {type:"code",title:"Reverse the words",body:`<p>The words are already split and reversed. Add one line that joins them with spaces and prints ${C("monkeys love bananas")}. Use ${C("\" \".join(words)")}.</p>`,
  start:`sentence = "bananas love monkeys"
words = sentence.split()
words.reverse()
# join the words with spaces and print them
`,use:[[/\.join\s*\(/,"Glue the words back with \" \".join(words)."]],out:["monkeys love bananas"],
  hint:`sentence = "bananas love monkeys"
words = sentence.split()
words.reverse()
print(" ".join(words))`},
 {type:"code",title:"Score cards",body:`<p>Each item looks like ${C("Mo:12")}. On the empty line, split ${C("item")} on ${C("\":\"")} into ${C("name")} and ${C("score")}. The program should print:</p><ul><li>${C("Mo scored 12")}</li><li>${C("Ava scored 30")}</li><li>${C("Leo scored 7")}</li></ul>`,
  start:`data = ["Mo:12", "Ava:30", "Leo:7"]
for item in data:
    # split item on ":" into name and score

    print(f"{name} scored {score}")
`,use:[[/split\s*\(\s*["']:["']\s*\)/,"Split on the colon: item.split(\":\")"]],out:["Mo scored 12","Ava scored 30","Leo scored 7"],
  hint:`data = ["Mo:12", "Ava:30", "Leo:7"]
for item in data:
    name, score = item.split(":")
    print(f"{name} scored {score}")`},
 {type:"game"},{type:"done"}],
 pool:[[`print("a b c".split())`,["['a', 'b', 'c']","abc","['a b c']"]],[`print("-".join(["x", "y"]))`,["x-y","xy","['x', 'y']"]],[`print(len("one two".split()))`,["2","7","1"]],[`a, b = "3,4".split(",")
print(a + b)`,["34","7","3,4"]],[`print("".join(["o", "o", "k"]))`,["ook","o o k","['o', 'o', 'k']"]]]},

{id:"py28",title:"Comprehension practice",sub:"build lists in one line",steps:[
 {type:"talk",title:"The loop way vs the one-line way",
  body:`<p>A <b>list comprehension</b> builds a new list in one line. Read it like English: "${C("n * 2")} <b>for</b> each ${C("n")} <b>in</b> nums".</p>`,
  demo:`nums = [1, 2, 3]

doubled = []
for n in nums:
    doubled.append(n * 2)
print(doubled)

print([n * 2 for n in nums])`,
  say:"Both print [2, 4, 6]. The second one is the comprehension."},
 {type:"code",title:"Triple it",body:`<p>Replace the empty ${C("[]")} with a comprehension that triples each number: ${C("[n * 3 for n in nums]")}. It should print ${C("[3, 6, 9, 12]")}.</p>`,
  start:`nums = [1, 2, 3, 4]
tripled = []
print(tripled)
`,use:[[/\[[^\]]*\bfor\b[^\]]*\bin\b/,"Use a list comprehension: [n * 3 for n in nums]"]],out:["[3, 6, 9, 12]"],
  hint:`nums = [1, 2, 3, 4]
tripled = [n * 3 for n in nums]
print(tripled)`},
 {type:"code",title:"Name lengths",body:`<p>Make a list of how long each name is. Fill the brackets with ${C("len(n) for n in names")}. It should print ${C("[2, 4, 3]")}.</p>`,
  start:`names = ["Mo", "Kiki", "Leo"]
lengths = []
print(lengths)
`,use:[[/len\s*\(\s*\w+\s*\)\s*for\b/,"Try: [len(n) for n in names]"]],out:["[2, 4, 3]"],
  hint:`names = ["Mo", "Kiki", "Leo"]
lengths = [len(n) for n in names]
print(lengths)`},
 {type:"talk",title:"Keep only some with if",mood:"think",
  body:`<p>Add ${C("if")} at the end to keep only the items you want. This is called <b>filtering</b>.</p>`,
  demo:`scores = [45, 80, 30, 95]
passed = [s for s in scores if s >= 50]
print(passed)`,
  say:"Output: [80, 95]"},
 {type:"quiz",q:"What does this print?",code:`print([n for n in [1, 2, 3, 4] if n % 2 == 0])`,opts:["[2, 4]","[1, 3]","[1, 2, 3, 4]"],a:0,mono:true,why:"n % 2 == 0 keeps only the even numbers."},
 {type:"code",title:"Short words",body:`<p>Keep only the words with <b>4 letters or fewer</b>. Add ${C("if len(w) <= 4")} inside the brackets, after ${C("in words")}. It should print ${C("['fig', 'kiwi', 'yam']")}.</p>`,
  start:`words = ["fig", "banana", "kiwi", "mango", "yam"]
short = [w for w in words]
print(short)
`,use:[[/\bif\b/,"Add an if to the comprehension."]],out:["['fig', 'kiwi', 'yam']"],
  hint:`words = ["fig", "banana", "kiwi", "mango", "yam"]
short = [w for w in words if len(w) <= 4]
print(short)`},
 {type:"fill",title:"Name tags",body:`<p>Capitalize every name in one line.</p>`,code:`names = ["mo", "ava"]
print([n.[0]() [1] n in names])`,blanks:["title","for"],tokens:["title","for","in","if"],why:"n.title() for each n in names.",out:"['Mo', 'Ava']"},
 {type:"game"},{type:"done"}],
 pool:[[`print([x + 1 for x in [1, 2]])`,["[2, 3]","[1, 2]","[3]"]],[`print([c for c in "abc"])`,["['a', 'b', 'c']","abc","['abc']"]],[`print(len([n for n in range(10) if n > 6]))`,["3","4","10"]],[`print([w[0] for w in ["ook", "eek"]])`,["['o', 'e']","['ook', 'eek']","oe"]],[`print(sum([n * 2 for n in [1, 2, 3]]))`,["12","6","[2, 4, 6]"]]]},

{id:"py29",title:"Project: Snack Shop Receipt",sub:"split, loops and f-strings together",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a receipt printer for TypeMonkey's Snack Shop!</b> Customers order like ${C("banana,3")} (a snack and how many). Your program works out the cost of each line and the total.</p><p>We'll build it in small steps. First, here are the prices, stored in a dictionary.</p>`,
  demo:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
print(prices["mango"])
print(prices["banana"] * 3)`,
  say:"Output: 1.25, then 1.5. Three bananas cost 1.5 coins."},
 {type:"code",title:"Step 1: read one order",body:`<p>On the empty line, split ${C("order")} on ${C("\",\"")} into ${C("item")} and ${C("qty")}. The program should print ${C("2 x mango")}.</p>`,
  start:`order = "mango,2"
# split order into item and qty

print(f"{qty} x {item}")
`,use:[[/split\s*\(\s*["'],["']\s*\)/,"Split on the comma: order.split(\",\")"]],out:["2 x mango"],
  hint:`order = "mango,2"
item, qty = order.split(",")
print(f"{qty} x {item}")`},
 {type:"code",title:"Step 2: price one line",body:`<p>Work out the cost: the item's price times the quantity. ${C("qty")} is text, so use ${C("int(qty)")}. Replace the ${C("0")} so the program prints ${C("2 x mango: 2.50")}.</p><p>(${C(":.2f")} shows 2 decimal places, like money.)</p>`,
  start:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
order = "mango,2"
item, qty = order.split(",")
cost = 0  # price of the item times int(qty)
print(f"{qty} x {item}: {cost:.2f}")
`,use:[[/prices\s*\[\s*item\s*\]/,"Look up the price with prices[item]."],[/int\s*\(\s*qty\s*\)/,"Turn qty into a number with int(qty)."]],out:["2 x mango: 2.50"],
  hint:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
order = "mango,2"
item, qty = order.split(",")
cost = prices[item] * int(qty)
print(f"{qty} x {item}: {cost:.2f}")`},
 {type:"talk",title:"Many orders at once",mood:"think",
  body:`<p>A whole order can be one line of text, with spaces between the snacks. ${C(".split()")} turns it into a list we can loop over.</p>`,
  demo:`orders = "banana,3 kiwi,2 mango,1"
for order in orders.split():
    print(order)`,
  say:"Output: banana,3 then kiwi,2 then mango,1."},
 {type:"code",title:"Step 3: every line",body:`<p>The loop already splits each order and works out the cost. Add the print line so the receipt shows:</p><ul><li>${C("3 x banana: 1.50")}</li><li>${C("2 x kiwi: 1.50")}</li><li>${C("1 x mango: 1.25")}</li></ul>`,
  start:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
orders = "banana,3 kiwi,2 mango,1"
for order in orders.split():
    item, qty = order.split(",")
    cost = prices[item] * int(qty)
    # print the line like: 3 x banana: 1.50
`,use:[[/print\s*\(/,"Print each line inside the loop."]],out:["3 x banana: 1.50","2 x kiwi: 1.50","1 x mango: 1.25"],
  hint:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
orders = "banana,3 kiwi,2 mango,1"
for order in orders.split():
    item, qty = order.split(",")
    cost = prices[item] * int(qty)
    print(f"{qty} x {item}: {cost:.2f}")`},
 {type:"code",title:"Step 4: the total",body:`<p>Two small jobs: inside the loop, add ${C("cost")} to ${C("total")}. After the loop, print ${C("Total: 4.25")} using ${C('f"Total: {total:.2f}"')}.</p>`,
  start:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
orders = "banana,3 kiwi,2 mango,1"
total = 0
for order in orders.split():
    item, qty = order.split(",")
    cost = prices[item] * int(qty)
    print(f"{qty} x {item}: {cost:.2f}")
    # add cost to total

# print the total
`,use:[[/total\s*\+=\s*cost|total\s*=\s*total\s*\+\s*cost/,"Add to the total with total += cost"]],out:["3 x banana: 1.50","2 x kiwi: 1.50","1 x mango: 1.25","Total: 4.25"],
  hint:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
orders = "banana,3 kiwi,2 mango,1"
total = 0
for order in orders.split():
    item, qty = order.split(",")
    cost = prices[item] * int(qty)
    print(f"{qty} x {item}: {cost:.2f}")
    total += cost
print(f"Total: {total:.2f}")`},
 {type:"code",title:"Step 5: open the shop!",body:`<p>Now real customers type their orders, one per line, and type ${C("done")} to finish. The loop that asks is ready. Replace ${C("pass")} with the lines you wrote before: split the order, work out the cost, print the line and add it to the total.</p><p>If a customer types ${C("banana,3")}, ${C("kiwi,2")}, ${C("done")}, the program prints ${C("3 x banana: 1.50")}, ${C("2 x kiwi: 1.50")} and ${C("Total: 3.00")}.</p>`,
  start:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
total = 0
while True:
    order = input("Order (or done): ")
    if order == "done":
        break
    pass  # split, work out the cost, print the line, add to total

print(f"Total: {total:.2f}")
`,input:"banana,3\nkiwi,2\ndone",
  use:[[/split\s*\(/,"Split each order on the comma."],[/total\s*\+=|total\s*=\s*total\s*\+/,"Add each cost to the total."]],
  tests:[{input:"banana,3\nkiwi,2\ndone",out:["3 x banana: 1.50","2 x kiwi: 1.50","Total: 3.00"]},{input:"mango,4\ndone",out:["4 x mango: 5.00","Total: 5.00"]},{input:"done",out:["Total: 0.00"]}],
  hint:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
total = 0
while True:
    order = input("Order (or done): ")
    if order == "done":
        break
    item, qty = order.split(",")
    cost = prices[item] * int(qty)
    print(f"{qty} x {item}: {cost:.2f}")
    total += cost

print(f"Total: {total:.2f}")`},
 {type:"talk",title:"🎉 The finished shop",mood:"cheer",
  body:`<p>Here's a polished version that also handles snacks the shop doesn't sell. Change the orders in the Input box and run it again!</p>`,
  input:"banana,3\npizza,1\nmango,2\ndone",demo:`prices = {"banana": 0.5, "mango": 1.25, "kiwi": 0.75}
total = 0
print("== TypeMonkey Snack Shop ==")
while True:
    order = input("Order (or done): ")
    if order == "done":
        break
    item, qty = order.split(",")
    if item not in prices:
        print(f"Sorry, we don't sell {item}.")
        continue
    cost = prices[item] * int(qty)
    print(f"{qty} x {item}: {cost:.2f}")
    total += cost
print(f"Total: {total:.2f}")
print("Thanks for shopping!")`,
  say:"You built a real receipt printer with split, loops, a dictionary and f-strings. Unit complete!"},
 {type:"done"}]}
]});

COURSE_PY.units.push({name:"Objects & safe code",lessons:[
{id:"py30",title:"Warm-up: functions",sub:"return values and defaults, gently",steps:[
 {type:"talk",title:"A function is a recipe",mood:"cheer",
  body:`<p>Quick warm-up! A function takes some <b>inputs</b> (parameters), does some work, and ${C("return")}s an answer.</p>`,
  demo:`def add_bananas(a, b):
    return a + b

print(add_bananas(2, 3))`,
  say:"Output: 5"},
 {type:"code",title:"Area of a rectangle",body:`<p>Replace ${C("pass")} with ${C("return width * height")}. The program should print ${C("12")} and then ${C("25")}.</p>`,
  start:`def area(width, height):
    pass  # return width times height

print(area(3, 4))
print(area(5, 5))
`,use:[[/return\s+\S/,"Give the answer back with return."]],out:["12","25"],
  hint:`def area(width, height):
    return width * height

print(area(3, 4))
print(area(5, 5))`},
 {type:"talk",title:"return gives you a value to use",mood:"think",
  body:`<p>${C("print")} only shows something. ${C("return")} hands the answer back, so you can store it or do more maths with it.</p>`,
  demo:`def area(width, height):
    return width * height

room = area(2, 3)
print(room + 1)
print(area(room, 2))`,
  say:"Output: 7, then 12."},
 {type:"quiz",q:"What does this print?",code:`def f(n):
    return n + 1

print(f(f(1)))`,opts:["3","2","1"],a:0,mono:true,why:"f(1) is 2, then f(2) is 3."},
 {type:"talk",title:"Default values",
  body:`<p>Give a parameter a <b>default</b> with ${C("=")}. If the caller leaves it out, the default is used.</p>`,
  demo:`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Mo"))
print(greet("Ava", "Hey"))`,
  say:"Output: Hello, Mo! then Hey, Ava!"},
 {type:"code",title:"Star maker",body:`<p>${C("stars()")} is called with no number, so it crashes. Give ${C("n")} a default of 3 by changing the first line to ${C("def stars(n=3):")}. It should print ${C("***")} and then ${C("*****")}.</p>`,
  start:`def stars(n):
    return "*" * n

print(stars())
print(stars(5))
`,use:[[/def\s+stars\s*\(\s*n\s*=\s*3\s*\)/,"Change the first line to def stars(n=3):"]],out:["***","*****"],
  hint:`def stars(n=3):
    return "*" * n

print(stars())
print(stars(5))`},
 {type:"fill",title:"Friendly default",body:`<p>Make ${C("Hi")} the default greeting.</p>`,code:`def greet(name, greeting=[0]):
    return f"{greeting}, {name}!"

print(greet("Kai"))`,blanks:[`"Hi"`],tokens:[`"Hi"`,"print","return","name"],why:"greeting=\"Hi\" is used when no greeting is given.",out:"Hi, Kai!"},
 {type:"game"},{type:"done"}],
 pool:[[`def f(x):
    return x * x

print(f(3))`,["9","6","x * x"]],[`def g(a, b=10):
    return a + b

print(g(1))`,["11","1","Error"]],[`def g(a, b=10):
    return a + b

print(g(1, 2))`,["3","11","12"]],[`def h():
    print("hi")

h()
h()`,["hi hi","hi","None"]],[`def k(n):
    return n > 5

print(k(7))`,["True","False","7"]]]},

{id:"py31",title:"Classes practice",sub:"build objects with methods",steps:[
 {type:"talk",title:"Recap: a blueprint",
  body:`<p>A ${C("class")} is a blueprint for objects. ${C("__init__")} sets up each new object, and ${C("self")} means "this object".</p>`,
  demo:`class Monkey:
    def __init__(self, name):
        self.name = name
        self.bananas = 0

mo = Monkey("Mo")
print(mo.name, mo.bananas)`,
  say:"Output: Mo 0"},
 {type:"code",title:"Make a Robot",body:`<p>Replace ${C("pass")} with ${C("self.name = name")} so each robot remembers its name. The program should print ${C("Beep")}.</p>`,
  start:`class Robot:
    def __init__(self, name):
        pass  # store the name on self

r = Robot("Beep")
print(r.name)
`,use:[[/self\.name\s*=\s*name/,"Store it with self.name = name"]],out:["Beep"],
  hint:`class Robot:
    def __init__(self, name):
        self.name = name

r = Robot("Beep")
print(r.name)`},
 {type:"talk",title:"Methods change the object",mood:"think",
  body:`<p>A <b>method</b> is a function inside a class. It can change the object's attributes through ${C("self")}.</p>`,
  demo:`class Monkey:
    def __init__(self, name):
        self.name = name
        self.bananas = 0

    def pick(self, n):
        self.bananas += n

mo = Monkey("Mo")
mo.pick(3)
mo.pick(2)
print(mo.bananas)`,
  say:"Output: 5"},
 {type:"code",title:"Piggy bank",body:`<p>Finish the ${C("add")} method: replace ${C("pass")} with ${C("self.coins += amount")}. After adding 5 and 3, it should print ${C("8")}.</p>`,
  start:`class Piggy:
    def __init__(self):
        self.coins = 0

    def add(self, amount):
        pass  # add amount to self.coins

bank = Piggy()
bank.add(5)
bank.add(3)
print(bank.coins)
`,use:[[/self\.coins\s*\+=\s*amount|self\.coins\s*=\s*self\.coins\s*\+\s*amount/,"Add it with self.coins += amount"]],out:["8"],
  hint:`class Piggy:
    def __init__(self):
        self.coins = 0

    def add(self, amount):
        self.coins += amount

bank = Piggy()
bank.add(5)
bank.add(3)
print(bank.coins)`},
 {type:"talk",title:"Nice printing with __str__",mood:"cheer",
  body:`<p>Printing an object normally shows something ugly like ${C("<__main__.Monkey object>")}. Add a ${C("__str__")} method that returns friendly text, and ${C("print")} uses it.</p>`,
  demo:`class Monkey:
    def __init__(self, name, bananas):
        self.name = name
        self.bananas = bananas

    def __str__(self):
        return f"{self.name} has {self.bananas} bananas"

print(Monkey("Mo", 4))`,
  say:"Output: Mo has 4 bananas"},
 {type:"quiz",q:"What does this print?",code:`class Thing:
    def __str__(self):
        return "Ook!"

print(Thing())`,opts:["Ook!","Thing","__str__"],a:0,mono:true,why:"print() calls __str__ to get the text."},
 {type:"code",title:"Pet name tags",body:`<p>Make ${C("__str__")} return text like ${C("Mo the monkey")}. Replace ${C("\"?\"")} with ${C('f"{self.name} the {self.kind}"')}. It should print:</p><ul><li>${C("Mo the monkey")}</li><li>${C("Kiki the parrot")}</li></ul>`,
  start:`class Pet:
    def __init__(self, name, kind):
        self.name = name
        self.kind = kind

    def __str__(self):
        return "?"  # return text like: Mo the monkey

print(Pet("Mo", "monkey"))
print(Pet("Kiki", "parrot"))
`,use:[[/self\.name/,"Use self.name in the text."],[/self\.kind/,"Use self.kind in the text."]],out:["Mo the monkey","Kiki the parrot"],
  hint:`class Pet:
    def __init__(self, name, kind):
        self.name = name
        self.kind = kind

    def __str__(self):
        return f"{self.name} the {self.kind}"

print(Pet("Mo", "monkey"))
print(Pet("Kiki", "parrot"))`},
 {type:"order",title:"Build a lamp",body:`<p>Put the lines in order so the lamp switches on and prints ${C("True")}.</p>`,lines:["class Lamp:","    def __init__(self):","        self.on = False","    def switch(self):","        self.on = not self.on","lamp = Lamp()","lamp.switch()","print(lamp.on)"],why:"Class first, then make a lamp, switch it, and print.",out:"True"},
 {type:"game"},{type:"done"}],
 pool:[[`class A:
    def __init__(self):
        self.n = 2

a = A()
a.n *= 5
print(a.n)`,["10","2","25"]],[`class S:
    def __str__(self):
        return "ook"

print(S())`,["ook","S","None"]],[`class M:
    def __init__(self, b):
        self.b = b

    def eat(self):
        self.b -= 1

m = M(3)
m.eat()
print(m.b)`,["2","3","1"]],[`class P:
    sound = "eek"

print(P().sound)`,["eek","sound","P"]],[`class Q:
    def __init__(self, x):
        self.x = x

print(Q(1).x + Q(2).x)`,["3","12","1"]]]},

{id:"py32",title:"Lists of objects",sub:"many objects, one loop",steps:[
 {type:"talk",title:"A team of objects",
  body:`<p>Objects can live in a list, just like numbers or strings. Loop over the list and use each object's attributes.</p>`,
  demo:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
for p in team:
    print(p.name)`,
  say:"Output: Mo, Ava, Leo"},
 {type:"code",title:"Roll call",body:`<p>Replace ${C("pass")} with a print line so each player shows like this:</p><ul><li>${C("Mo: 12")}</li><li>${C("Ava: 30")}</li><li>${C("Leo: 7")}</li></ul><p>Tip: ${C('f"{p.name}: {p.score}"')}</p>`,
  start:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
for p in team:
    pass  # print the name and score
`,use:[[/p\.score/,"Use p.score to get each score."]],out:["Mo: 12","Ava: 30","Leo: 7"],
  hint:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
for p in team:
    print(f"{p.name}: {p.score}")`},
 {type:"code",title:"Team total",body:`<p>Add up everyone's score. Replace ${C("pass")} with ${C("total += p.score")}. It should print ${C("49")}.</p>`,
  start:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
total = 0
for p in team:
    pass  # add p.score to total
print(total)
`,use:[[/total\s*\+=\s*p\.score|total\s*=\s*total\s*\+\s*p\.score/,"Add each score with total += p.score"]],out:["49"],
  hint:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
total = 0
for p in team:
    total += p.score
print(total)`},
 {type:"talk",title:"Finding the best one",mood:"think",
  body:`<p>To find the biggest, start by guessing the first one is the best. Then check each object: if it beats the best so far, it becomes the new best.</p>`,
  demo:`class Fruit:
    def __init__(self, name, size):
        self.name = name
        self.size = size

basket = [Fruit("kiwi", 3), Fruit("melon", 9), Fruit("fig", 2)]
biggest = basket[0]
for f in basket:
    if f.size > biggest.size:
        biggest = f
print(biggest.name)`,
  say:"Output: melon"},
 {type:"quiz",q:"What does this print?",code:`class B:
    def __init__(self, v):
        self.v = v

boxes = [B(3), B(8), B(1)]
print(max([b.v for b in boxes]))`,opts:["8","3","[3, 8, 1]"],a:0,mono:true,why:"The comprehension makes [3, 8, 1], and max picks 8."},
 {type:"code",title:"Who's the winner?",body:`<p>Find the player with the highest score. Replace ${C("pass")} with an ${C("if")}: when ${C("p.score")} is bigger than ${C("best.score")}, set ${C("best = p")}. It should print ${C("Winner: Ava")}.</p>`,
  start:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
best = team[0]
for p in team:
    pass  # if p.score is bigger than best.score, set best = p
print(f"Winner: {best.name}")
`,use:[[/best\s*=\s*p\b/,"Make p the new best with best = p"]],out:["Winner: Ava"],
  hint:`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

team = [Player("Mo", 12), Player("Ava", 30), Player("Leo", 7)]
best = team[0]
for p in team:
    if p.score > best.score:
        best = p
print(f"Winner: {best.name}")`},
 {type:"talk",title:"A class that holds a list",mood:"cheer",
  body:`<p>You can also put the list <b>inside</b> an object. This ${C("Team")} keeps its own list of players and has methods to work with them. You'll use this idea in the project!</p>`,
  demo:`class Team:
    def __init__(self):
        self.players = []

    def add(self, name):
        self.players.append(name)

    def size(self):
        return len(self.players)

t = Team()
t.add("Mo")
t.add("Ava")
print(t.size(), t.players)`,
  say:"Output: 2 ['Mo', 'Ava']"},
 {type:"game"},{type:"done"}],
 pool:[[`class P:
    def __init__(self, n):
        self.n = n

ps = [P(1), P(2), P(3)]
print(len(ps))`,["3","6","1"]],[`class P:
    def __init__(self, n):
        self.n = n

ps = [P(4), P(5)]
print(ps[-1].n)`,["5","4","-1"]],[`class P:
    def __init__(self, n):
        self.n = n

print([p.n * 2 for p in [P(1), P(3)]])`,["[2, 6]","[1, 3]","8"]],[`class P:
    def __init__(self, n):
        self.n = n

t = 0
for p in [P(2), P(2)]:
    t += p.n
print(t)`,["4","2","22"]]]},

{id:"py33",title:"Errors practice",sub:"check input and raise your own errors",steps:[
 {type:"talk",title:"Recap: try and except",
  body:`<p>Risky code goes in ${C("try")}. If it raises an error, the matching ${C("except")} block runs instead of crashing.</p>`,
  demo:`try:
    n = int("ten")
except ValueError:
    print("Not a number!")
print("Still running")`,
  say:"Output: Not a number!, then Still running."},
 {type:"code",title:"Safe age",body:`<p>If the player types something that isn't a number, ${C("int()")} raises a ${C("ValueError")}. Replace ${C("pass")} with ${C('print("Please type a number")')}.</p><p>Typing ${C("9")} prints ${C("Next year you'll be 10")}. Typing ${C("nine")} prints ${C("Please type a number")}.</p>`,
  start:`text = input("Your age: ")
try:
    age = int(text)
    print(f"Next year you'll be {age + 1}")
except ValueError:
    pass  # print: Please type a number
`,input:"nine",use:[[/except\s+ValueError/,"Keep the except ValueError: line."]],
  tests:[{input:"9",out:["Next year you'll be 10"]},{input:"nine",out:["Please type a number"]}],
  hint:`text = input("Your age: ")
try:
    age = int(text)
    print(f"Next year you'll be {age + 1}")
except ValueError:
    print("Please type a number")`},
 {type:"talk",title:"Keep asking until it works",mood:"think",
  body:`<p>Put ${C("try")} inside a ${C("while True")} loop. When the number works, ${C("break")} out. When it fails, say so and the loop asks again.</p>`,
  input:"abc\n7",demo:`while True:
    text = input("Pick a number: ")
    try:
        n = int(text)
        break
    except ValueError:
        print("That's not a number, try again!")
print(f"You picked {n}")`,
  say:"With abc then 7 typed: it complains once, then says You picked 7."},
 {type:"quiz",q:"What does this print?",code:`try:
    n = int("4")
    print(n * 2)
except ValueError:
    print("oops")`,opts:["8","oops","44"],a:0,mono:true,why:"\"4\" becomes 4 just fine, so no error happens."},
 {type:"talk",title:"raise your own errors",mood:"oops",
  body:`<p>Your own functions can complain too! ${C("raise ValueError(\"message\")")} stops the function with an error. Whoever called it can catch it with ${C("except ValueError as e")}, and ${C("e")} holds the message.</p>`,
  demo:`def set_age(age):
    if age < 0:
        raise ValueError("Age can't be negative")
    return age

try:
    set_age(-3)
except ValueError as e:
    print("Problem:", e)`,
  say:"Output: Problem: Age can't be negative"},
 {type:"code",title:"Not enough bananas",body:`<p>You can't take more bananas than you have! Replace ${C("pass")} with ${C('raise ValueError("Not enough bananas")')}. The program should print ${C("7")} and then ${C("Oops: Not enough bananas")}.</p>`,
  start:`def take(bananas, amount):
    if amount > bananas:
        pass  # raise a ValueError here
    return bananas - amount

try:
    print(take(10, 3))
    print(take(2, 5))
except ValueError as e:
    print("Oops:", e)
`,use:[[/raise\s+ValueError/,"Use raise ValueError(\"Not enough bananas\")"]],out:["7","Oops: Not enough bananas"],
  hint:`def take(bananas, amount):
    if amount > bananas:
        raise ValueError("Not enough bananas")
    return bananas - amount

try:
    print(take(10, 3))
    print(take(2, 5))
except ValueError as e:
    print("Oops:", e)`},
 {type:"fill",title:"Catch the right one",body:`<p>Pick the error that dividing by zero raises.</p>`,code:`try:
    x = 1 / 0
except [0]:
    print("No dividing by zero!")`,blanks:["ZeroDivisionError"],tokens:["ZeroDivisionError","ValueError","KeyError","Error"],why:"Dividing by zero raises ZeroDivisionError.",out:"No dividing by zero!"},
 {type:"game"},{type:"done"}],
 pool:[[`try:
    print(int("7") + 1)
except ValueError:
    print("no")`,["8","no","71"]],[`try:
    raise ValueError("bad")
except ValueError as e:
    print(e)`,["bad","ValueError","e"]],[`try:
    print([1, 2][9])
except IndexError:
    print("too far")`,["too far","None","2"]],[`try:
    x = 5
except ValueError:
    x = 0
print(x)`,["5","0","None"]],[`def f(n):
    if n < 0:
        raise ValueError("neg")
    return n

try:
    print(f(-1))
except ValueError:
    print("caught")`,["caught","-1","neg"]]]},

{id:"py34",title:"Project: Adventure Backpack",sub:"a class, a dictionary and safe commands",project:true,steps:[
 {type:"talk",title:"🏗️ Your mission",mood:"cheer",
  body:`<p><b>Build a backpack for an adventure game!</b> The player can ${C("add")} items, ${C("use")} them, and ${C("show")} what's inside. If they try to use something they don't have, the game explains nicely instead of crashing.</p><p>Inside, the backpack is a dictionary: item name → how many.</p>`,
  demo:`items = {"banana": 2}
items["rope"] = 1
items["banana"] += 1
print(items)`,
  say:"Output: {'banana': 3, 'rope': 1}. Four small steps, then you play it!"},
 {type:"code",title:"Step 1: add items",body:`<p>Finish ${C("add")}: it should add 1 to the item's count, starting from 0 if it's new. Replace ${C("pass")} with:</p><p>${C("self.items[item] = self.items.get(item, 0) + 1")}</p><p>It should print ${C("{'banana': 2, 'rope': 1}")}.</p>`,
  start:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        pass  # add 1 to this item's count

bag = Backpack()
bag.add("banana")
bag.add("banana")
bag.add("rope")
print(bag.items)
`,use:[[/\.get\s*\(|\bin\b/,"Use self.items.get(item, 0) so new items start at 0."]],out:["{'banana': 2, 'rope': 1}"],
  hint:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

bag = Backpack()
bag.add("banana")
bag.add("banana")
bag.add("rope")
print(bag.items)`},
 {type:"code",title:"Step 2: use items",body:`<p>${C("use")} already takes 1 away. But when the count reaches 0, the item should disappear. Replace ${C("pass")} with ${C("del self.items[item]")}. It should print ${C("{'banana': 1}")}.</p>`,
  start:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

    def use(self, item):
        self.items[item] -= 1
        if self.items[item] == 0:
            pass  # remove the item

bag = Backpack()
bag.add("banana")
bag.add("banana")
bag.add("rope")
bag.use("banana")
bag.use("rope")
print(bag.items)
`,use:[[/del\s+self\.items\s*\[/,"Remove it with del self.items[item]"]],out:["{'banana': 1}"],
  hint:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

    def use(self, item):
        self.items[item] -= 1
        if self.items[item] == 0:
            del self.items[item]

bag = Backpack()
bag.add("banana")
bag.add("banana")
bag.add("rope")
bag.use("banana")
bag.use("rope")
print(bag.items)`},
 {type:"code",title:"Step 3: no cheating!",body:`<p>Using an item you don't have crashes with a ${C("KeyError")}. Replace ${C("pass")} with a friendly error:</p><p>${C('raise ValueError(f"You don\'t have a {item}.")')}</p><p>It should print ${C("You don't have a map.")}</p>`,
  start:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

    def use(self, item):
        if item not in self.items:
            pass  # raise a ValueError with a friendly message
        self.items[item] -= 1
        if self.items[item] == 0:
            del self.items[item]

bag = Backpack()
try:
    bag.use("map")
except ValueError as e:
    print(e)
`,use:[[/raise\s+ValueError/,"Use raise ValueError(...)"]],out:["You don't have a map."],
  hint:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

    def use(self, item):
        if item not in self.items:
            raise ValueError(f"You don't have a {item}.")
        self.items[item] -= 1
        if self.items[item] == 0:
            del self.items[item]

bag = Backpack()
try:
    bag.use("map")
except ValueError as e:
    print(e)`},
 {type:"talk",title:"Showing what's inside",mood:"think",
  body:`<p>One more method, already written for you: ${C("show")} prints each item in A to Z order, or says the backpack is empty. ${C("not self.items")} is ${C("True")} when the dictionary is empty.</p>`,
  demo:`class Backpack:
    def __init__(self):
        self.items = {"rope": 1, "banana": 2}

    def show(self):
        if not self.items:
            print("Your backpack is empty.")
        for item in sorted(self.items):
            print(f"{item}: {self.items[item]}")

Backpack().show()`,
  say:"Output: banana: 2, then rope: 1."},
 {type:"code",title:"Step 4: play it!",body:`<p>The whole game is ready except the ${C("use")} command. Replace ${C("pass")} with a ${C("try")} / ${C("except")}:</p><ul><li>try ${C("bag.use(item)")} and print ${C("You used the rope.")} (with the right item)</li><li>${C("except ValueError as e:")} print ${C("e")}</li></ul><p>Try commands like ${C("add rope")}, ${C("use rope")}, ${C("show")} and ${C("quit")} in the Input box.</p>`,
  start:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

    def use(self, item):
        if item not in self.items:
            raise ValueError(f"You don't have a {item}.")
        self.items[item] -= 1
        if self.items[item] == 0:
            del self.items[item]

    def show(self):
        if not self.items:
            print("Your backpack is empty.")
        for item in sorted(self.items):
            print(f"{item}: {self.items[item]}")

bag = Backpack()
while True:
    command = input("> ")
    if command == "quit":
        print("Bye!")
        break
    elif command == "show":
        bag.show()
    elif command.startswith("add "):
        item = command[4:]
        bag.add(item)
        print(f"Added {item}.")
    elif command.startswith("use "):
        item = command[4:]
        pass  # try to use it; print the error if it fails
    else:
        print("Try: add, use, show or quit")
`,input:"add rope\nuse rope\nuse rope\nquit",
  use:[[/\btry\s*:/,"Wrap bag.use(item) in try:"],[/except\s+ValueError/,"Catch it with except ValueError as e:"]],
  tests:[{input:"add rope\nadd banana\nadd banana\nuse banana\nshow\nquit",out:["Added rope.","Added banana.","Added banana.","You used the banana.","banana: 1","rope: 1","Bye!"]},{input:"use map\nadd map\nuse map\nshow\ndance\nquit",out:["You don't have a map.","Added map.","You used the map.","Your backpack is empty.","Try: add, use, show or quit","Bye!"]}],
  hint:`class Backpack:
    def __init__(self):
        self.items = {}

    def add(self, item):
        self.items[item] = self.items.get(item, 0) + 1

    def use(self, item):
        if item not in self.items:
            raise ValueError(f"You don't have a {item}.")
        self.items[item] -= 1
        if self.items[item] == 0:
            del self.items[item]

    def show(self):
        if not self.items:
            print("Your backpack is empty.")
        for item in sorted(self.items):
            print(f"{item}: {self.items[item]}")

bag = Backpack()
while True:
    command = input("> ")
    if command == "quit":
        print("Bye!")
        break
    elif command == "show":
        bag.show()
    elif command.startswith("add "):
        item = command[4:]
        bag.add(item)
        print(f"Added {item}.")
    elif command.startswith("use "):
        item = command[4:]
        try:
            bag.use(item)
            print(f"You used the {item}.")
        except ValueError as e:
            print(e)
    else:
        print("Try: add, use, show or quit")`},
 {type:"talk",title:"🎉 You built it!",mood:"cheer",
  body:`<p>Your backpack uses a <b>class</b>, a <b>dictionary</b>, a <b>loop</b>, and <b>error handling</b>, all working together. That's how real programs are built: small pieces, each doing one job.</p><p>Ideas to try next: a ${C("drop")} command, a weight limit that raises an error, or a secret item that wins the game.</p>`,
  say:"You finished Objects & safe code. Amazing work!"},
 {type:"done"}]}
]});
