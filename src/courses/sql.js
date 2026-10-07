/* SQL course. All queries run against the TypeMonkey Zoo database below.
   Answers are verified with SQLite (tests/verify_compiled.py sql). Results are written one row per line, columns joined with " | ". */
const ZOO_TABLES={
  animals:{cols:["id","name","species","age","keeper_id"],rows:[
    [1,"Mo","monkey",4,1],[2,"Kiki","parrot",12,2],[3,"Bao","panda",7,1],
    [4,"Zuri","giraffe",9,3],[5,"Pip","monkey",2,1],[6,"Odo","owl",5,null]]},
  keepers:{cols:["id","name","shift"],rows:[[1,"Ava","morning"],[2,"Leo","night"],[3,"Kai","morning"],[4,"Mia","night"]]},
  snacks:{cols:["id","animal_id","food","qty"],rows:[[1,1,"banana",6],[2,5,"banana",3],[3,3,"bamboo",20],[4,2,"seeds",4],[5,1,"mango",2],[6,4,"leaves",15]]}
};

const SQL_UNIT1={name:"Asking questions",free:true,lessons:[
{id:"sql1",title:"SELECT",sub:"getting data out of a table",steps:[
 {type:"talk",title:"Databases are everywhere",mood:"cheer",
  body:`<p>Every app you use stores data in a <b>database</b>: tables with rows and columns, like spreadsheets. <b>SQL</b> is the language for asking them questions.</p><p>All through this course you'll explore the TypeMonkey Zoo database. Here's the ${C("animals")} table:</p>`,
  show:["animals"],say:"Each row is one animal. Each column is one fact about it."},
 {type:"talk",title:"SELECT * FROM",
  body:`<p>${C("SELECT")} picks columns, ${C("FROM")} picks the table. ${C("*")} means "every column". Statements end with a semicolon.</p>`,
  demo:`SELECT * FROM keepers;`,show:["keepers"],
  say:"That query returns the whole keepers table, exactly as shown."},
 {type:"talk",title:"Pick your columns",mood:"think",
  body:`<p>List the columns you want, separated by commas. SQL keywords are usually written in CAPITALS, but that's just style.</p>`,
  demo:`SELECT name, species FROM animals;`,
  say:"Result: Mo | monkey, Kiki | parrot, Bao | panda, Zuri | giraffe, Pip | monkey, Odo | owl"},
 {type:"quiz",q:"What does * mean in SELECT * FROM animals?",opts:["Every column","Multiply","Only the first row"],a:0,why:"* is shorthand for all columns."},
 {type:"fill",title:"Get the names",body:`<p>Get just the name column of every keeper.</p>`,
  code:`[0] name [1] keepers;`,blanks:["SELECT","FROM"],tokens:["SELECT","FROM","GET","TABLE"],why:"SELECT columns FROM table.",out:"Ava\nLeo\nKai\nMia"},
 {type:"quiz",q:"What does this return?",code:`SELECT shift FROM keepers;`,opts:["morning\nnight\nmorning\nnight","Ava\nLeo\nKai\nMia","shift"],a:0,mono:true,why:"One value per keeper, from the shift column."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT name FROM keepers;`,["Ava\nLeo\nKai\nMia","1\n2\n3\n4","name"]],
  [`SELECT food FROM snacks;`,["banana\nbanana\nbamboo\nseeds\nmango\nleaves","banana\nbamboo\nseeds\nmango\nleaves","6"]],
  [`SELECT name, age FROM animals;`,["Mo | 4\nKiki | 12\nBao | 7\nZuri | 9\nPip | 2\nOdo | 5","Mo\nKiki\nBao\nZuri\nPip\nOdo","4\n12\n7\n9\n2\n5"]],
  [`SELECT id, shift FROM keepers;`,["1 | morning\n2 | night\n3 | morning\n4 | night","morning\nnight\nmorning\nnight","1\n2\n3\n4"]]
 ]},
{id:"sql2",title:"WHERE",sub:"filtering rows",steps:[
 {type:"talk",title:"Only the rows you want",
  body:`<p>${C("WHERE")} keeps only rows that match a condition. Text values go in single quotes.</p>`,
  demo:`SELECT name FROM animals WHERE species = 'monkey';`,show:["animals"],
  say:"Result: Mo, Pip"},
 {type:"talk",title:"Comparisons and logic",mood:"think",
  body:`<p>Use ${C("=")}, ${C("&lt;&gt;")} (not equal), ${C("&gt;")}, ${C("&lt;")}, ${C("&gt;=")}, ${C("&lt;=")}. Combine conditions with ${C("AND")} and ${C("OR")}.</p>`,
  demo:`SELECT name, age FROM animals WHERE age > 5 AND species <> 'parrot';`,
  say:"Result: Bao | 7, Zuri | 9"},
 {type:"quiz",q:"SQL uses which symbol for 'equals' in a WHERE?",opts:["=","==","==="],a:0,mono:true,why:"Just one = in SQL."},
 {type:"fill",title:"Night owls",body:`<p>Find keepers who work the night shift.</p>`,
  code:`SELECT name FROM keepers [0] shift = [1];`,blanks:["WHERE","'night'"],tokens:["WHERE","'night'","night","IF"],why:"WHERE filters; text needs quotes.",out:"Leo\nMia"},
 {type:"quiz",q:"What does this return?",code:`SELECT name FROM animals WHERE age < 5 OR species = 'owl';`,opts:["Mo\nPip\nOdo","Mo\nPip","Odo"],a:0,mono:true,why:"Mo (4) and Pip (2) are under 5, and Odo is an owl."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT name FROM animals WHERE age = 12;`,["Kiki","Zuri","12"]],
  [`SELECT name FROM animals WHERE age >= 9;`,["Kiki\nZuri","Kiki","Zuri"]],
  [`SELECT food FROM snacks WHERE qty > 10;`,["bamboo\nleaves","bamboo","banana\nbamboo\nleaves"]],
  [`SELECT name FROM keepers WHERE shift = 'morning' AND id > 1;`,["Kai","Ava\nKai","Leo"]],
  [`SELECT name FROM animals WHERE species = 'cat';`,["(no rows)","NULL","cat"]]
 ]},
{id:"sql3",title:"ORDER BY & LIMIT",sub:"sorting and top-N lists",steps:[
 {type:"talk",title:"Sorting",
  body:`<p>${C("ORDER BY")} sorts the results. It's ascending (small to big, A to Z) by default. Add ${C("DESC")} for descending.</p>`,
  demo:`SELECT name, age FROM animals ORDER BY age DESC;`,show:["animals"],
  say:"Result: Kiki 12, Zuri 9, Bao 7, Odo 5, Mo 4, Pip 2"},
 {type:"talk",title:"Top results",mood:"think",
  body:`<p>${C("LIMIT")} keeps only the first few rows. Sorting plus limiting gives you leaderboards and "top 3" lists.</p>`,
  demo:`SELECT name FROM animals ORDER BY age LIMIT 2;`,
  say:"Result: Pip, Mo. The two youngest."},
 {type:"quiz",q:"Which sorts from biggest to smallest?",opts:["ORDER BY age DESC","ORDER BY age","SORT age DOWN"],a:0,mono:true,why:"DESC means descending."},
 {type:"fill",title:"Oldest animal",body:`<p>Get the single oldest animal.</p>`,
  code:`SELECT name FROM animals ORDER BY age [0] [1] 1;`,blanks:["DESC","LIMIT"],tokens:["DESC","LIMIT","ASC","TOP"],why:"Sort oldest first, then keep one row.",out:"Kiki"},
 {type:"order",title:"Write the query",body:`<p>Put the clauses in the order SQL requires.</p>`,
  lines:["SELECT name","FROM animals","WHERE species = 'monkey'","ORDER BY age","LIMIT 1;"],why:"SELECT, FROM, WHERE, ORDER BY, LIMIT. Always in that order.",out:"Pip"},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT name FROM keepers ORDER BY name;`,["Ava\nKai\nLeo\nMia","Ava\nLeo\nKai\nMia","Mia\nLeo\nKai\nAva"]],
  [`SELECT name FROM keepers ORDER BY name DESC LIMIT 1;`,["Mia","Ava","Leo"]],
  [`SELECT food FROM snacks ORDER BY qty DESC LIMIT 2;`,["bamboo\nleaves","leaves\nbamboo","bamboo"]],
  [`SELECT name FROM animals WHERE age > 4 ORDER BY age LIMIT 1;`,["Odo","Mo","Bao"]],
  [`SELECT qty FROM snacks ORDER BY qty LIMIT 3;`,["2\n3\n4","20\n15\n6","2"]]
 ]}
]};

const SQL_UNIT2={name:"Summarizing data",lessons:[
{id:"sql4",title:"Counting & math",sub:"COUNT, SUM, AVG, MIN, MAX",steps:[
 {type:"talk",title:"Aggregate functions",
  body:`<p>Aggregates squash many rows into one answer: ${C("COUNT(*)")} counts rows, and ${C("SUM")}, ${C("AVG")}, ${C("MIN")} and ${C("MAX")} work on a column.</p>`,
  demo:`SELECT COUNT(*), AVG(age), MAX(age) FROM animals;`,show:["animals"],
  say:"Result: 6 | 6.5 | 12"},
 {type:"talk",title:"Name your results",mood:"think",
  body:`<p>${C("AS")} gives a result column a friendly name. Aggregates also work with ${C("WHERE")}.</p>`,
  demo:`SELECT SUM(qty) AS bananas FROM snacks WHERE food = 'banana';`,show:["snacks"],
  say:"Result: a column called bananas with the value 9"},
 {type:"quiz",q:"What does COUNT(*) count?",opts:["Rows","Columns","Unique values"],a:0,why:"COUNT(*) counts every row that matches."},
 {type:"fill",title:"Total snacks",body:`<p>Add up every qty.</p>`,code:`SELECT [0](qty) FROM snacks;`,blanks:["SUM"],tokens:["SUM","COUNT","ADD","TOTAL"],why:"SUM adds a column up.",out:"50"},
 {type:"quiz",q:"What does this return?",code:`SELECT MIN(age) FROM animals WHERE species = 'monkey';`,opts:["2","4","Pip"],a:0,mono:true,why:"The monkeys are 4 and 2, and MIN returns the number, not the name."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT COUNT(*) FROM keepers;`,["4","3","Ava"]],
  [`SELECT MAX(qty) FROM snacks;`,["20","6","bamboo"]],
  [`SELECT COUNT(*) FROM animals WHERE age > 6;`,["3","4","2"]],
  [`SELECT SUM(age) FROM animals WHERE species = 'monkey';`,["6","2","4"]],
  [`SELECT AVG(qty) FROM snacks WHERE food = 'banana';`,["4.5","9","4"]]
 ]},
{id:"sql5",title:"GROUP BY & HAVING",sub:"totals for each group",steps:[
 {type:"talk",title:"One answer per group",
  body:`<p>${C("GROUP BY")} splits rows into groups and runs the aggregate once per group.</p>`,
  demo:`SELECT species, COUNT(*) FROM animals GROUP BY species ORDER BY species;`,show:["animals"],
  say:"Result: giraffe 1, monkey 2, owl 1, panda 1, parrot 1"},
 {type:"talk",title:"Filtering groups",mood:"think",
  body:`<p>${C("WHERE")} filters rows <b>before</b> grouping. ${C("HAVING")} filters groups <b>after</b>, so it can use aggregates.</p>`,
  demo:`SELECT food, SUM(qty) FROM snacks GROUP BY food HAVING SUM(qty) > 8 ORDER BY food;`,show:["snacks"],
  say:"Result: bamboo 20, banana 9, leaves 15"},
 {type:"quiz",q:"Which can use COUNT() or SUM() in its condition?",opts:["HAVING","WHERE","FROM"],a:0,why:"HAVING runs after grouping, so the totals exist by then."},
 {type:"fill",title:"Animals per keeper",body:`<p>Count how many animals each keeper looks after.</p>`,code:`SELECT keeper_id, COUNT(*) FROM animals WHERE keeper_id IS NOT NULL [0] keeper_id;`,blanks:["GROUP BY"],tokens:["GROUP BY","ORDER BY","HAVING","SPLIT"],why:"GROUP BY makes one row per keeper.",out:"1 | 3\n2 | 1\n3 | 1"},
 {type:"quiz",q:"What does this return?",code:`SELECT species FROM animals GROUP BY species HAVING COUNT(*) > 1;`,opts:["monkey","monkey\npanda","2"],a:0,mono:true,why:"Only monkey has more than one animal."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT shift, COUNT(*) FROM keepers GROUP BY shift ORDER BY shift;`,["morning | 2\nnight | 2","morning | 1\nnight | 1","2\n2"]],
  [`SELECT food, COUNT(*) FROM snacks GROUP BY food HAVING COUNT(*) > 1;`,["banana | 2","banana | 9","bamboo | 1"]],
  [`SELECT animal_id, SUM(qty) FROM snacks WHERE animal_id = 1 GROUP BY animal_id;`,["1 | 8","1 | 6","1 | 2"]],
  [`SELECT COUNT(*) FROM (SELECT species FROM animals GROUP BY species);`,["5","6","2"]]
 ]},
{id:"sql6",title:"Pattern matching & NULL",sub:"LIKE, IN, BETWEEN, IS NULL",steps:[
 {type:"talk",title:"LIKE, IN, BETWEEN",
  body:`<p>${C("LIKE")} matches patterns: ${C("%")} means "anything". ${C("IN")} checks a list of values. ${C("BETWEEN")} checks a range, including both ends.</p>`,
  demo:`SELECT name FROM animals WHERE name LIKE 'K%';\nSELECT name FROM animals WHERE species IN ('owl', 'panda');\nSELECT name FROM animals WHERE age BETWEEN 4 AND 7;`,
  say:"Results: Kiki · Bao, Odo · Mo, Bao, Odo",noRun:true},
 {type:"talk",title:"NULL means unknown",mood:"oops",
  body:`<p>Odo the owl has no keeper yet: his ${C("keeper_id")} is ${C("NULL")}. NULL isn't equal to anything, not even NULL! Use ${C("IS NULL")} and ${C("IS NOT NULL")}.</p>`,
  demo:`SELECT name FROM animals WHERE keeper_id IS NULL;`,show:["animals"],
  say:"Result: Odo. Writing = NULL would return nothing at all."},
 {type:"quiz",q:"What does this return?",code:`SELECT name FROM animals WHERE keeper_id = NULL;`,opts:["(no rows)","Odo","NULL"],a:0,mono:true,why:"= NULL is never true. You need IS NULL."},
 {type:"fill",title:"Names ending in o",body:`<p>Find animals whose name ends with o.</p>`,code:`SELECT name FROM animals WHERE name [0] '[1]o';`,blanks:["LIKE","%"],tokens:["LIKE","%","=","*"],why:"'%o' means anything, then an o at the end.",out:"Mo\nBao\nOdo"},
 {type:"quiz",q:"What does this return?",code:`SELECT COUNT(*) FROM snacks WHERE food IN ('banana', 'mango');`,opts:["3","2","1"],a:0,mono:true,why:"Two banana rows plus one mango row."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT name FROM keepers WHERE name LIKE '%a';`,["Ava\nMia","Ava","Kai"]],
  [`SELECT name FROM animals WHERE age BETWEEN 9 AND 12;`,["Kiki\nZuri","Zuri","Kiki"]],
  [`SELECT COUNT(*) FROM animals WHERE keeper_id IS NOT NULL;`,["5","6","1"]],
  [`SELECT food FROM snacks WHERE food LIKE 'b%' AND qty < 5;`,["banana","banana\nbamboo","bamboo"]],
  [`SELECT name FROM animals WHERE species NOT IN ('monkey', 'owl', 'panda');`,["Kiki\nZuri","Zuri","Mo\nPip"]]
 ]}
]};

const SQL_UNIT3={name:"Joining tables",lessons:[
{id:"sql7",title:"INNER JOIN",sub:"combine matching rows",steps:[
 {type:"talk",title:"Why split data up?",
  body:`<p>${C("animals.keeper_id")} points at ${C("keepers.id")}. Storing each keeper once, then pointing at them, keeps data tidy. A <b>JOIN</b> brings the tables back together.</p>`,
  show:["animals","keepers"],say:"Mo's keeper_id is 1, and keeper 1 is Ava."},
 {type:"talk",title:"JOIN … ON",mood:"think",
  body:`<p>${C("JOIN")} pairs rows where the ${C("ON")} condition matches. Write ${C("table.column")} so SQL knows which ${C("name")} you mean.</p>`,
  demo:`SELECT animals.name, keepers.name\nFROM animals\nJOIN keepers ON animals.keeper_id = keepers.id\nORDER BY animals.id;`,
  say:"Result: Mo | Ava, Kiki | Leo, Bao | Ava, Zuri | Kai, Pip | Ava. Odo has no keeper, so he's left out."},
 {type:"talk",title:"Short names",
  body:`<p>Give tables short aliases right after their names to save typing.</p>`,
  demo:`SELECT a.name, s.food, s.qty\nFROM snacks s\nJOIN animals a ON s.animal_id = a.id\nWHERE a.species = 'monkey'\nORDER BY s.qty DESC;`,
  say:"Result: Mo | banana | 6, Pip | banana | 3, Mo | mango | 2"},
 {type:"quiz",q:"Why isn't Odo in the INNER JOIN results?",opts:["His keeper_id is NULL, so nothing matches","Owls are filtered out","JOIN only returns 5 rows"],a:0,why:"INNER JOIN only keeps rows that have a match in both tables."},
 {type:"fill",title:"Who feeds whom?",body:`<p>Finish the join condition.</p>`,code:`SELECT k.name FROM keepers k\nJOIN animals a [0] a.keeper_id = k.[1]\nWHERE a.name = 'Zuri';`,blanks:["ON","id"],tokens:["ON","id","WHERE","name"],why:"Match animals.keeper_id to keepers.id.",out:"Kai"},
 {type:"quiz",q:"What does this return?",code:`SELECT COUNT(*) FROM animals a\nJOIN keepers k ON a.keeper_id = k.id\nWHERE k.name = 'Ava';`,opts:["3","1","Ava"],a:0,mono:true,why:"Ava looks after Mo, Bao and Pip."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT k.name FROM animals a JOIN keepers k ON a.keeper_id = k.id WHERE a.name = 'Kiki';`,["Leo","Ava","2"]],
  [`SELECT a.name FROM snacks s JOIN animals a ON s.animal_id = a.id WHERE s.food = 'bamboo';`,["Bao","Pip","3"]],
  [`SELECT COUNT(*) FROM animals a JOIN keepers k ON a.keeper_id = k.id;`,["5","6","4"]],
  [`SELECT DISTINCT k.name FROM animals a JOIN keepers k ON a.keeper_id = k.id WHERE k.shift = 'morning' ORDER BY k.name;`,["Ava\nKai","Ava\nAva\nAva\nKai","Kai"]]
 ]},
{id:"sql8",title:"LEFT JOIN",sub:"keep rows with no match",steps:[
 {type:"talk",title:"Keep everyone",
  body:`<p>${C("LEFT JOIN")} keeps every row from the left table, even with no match. The missing side becomes ${C("NULL")}.</p>`,
  demo:`SELECT a.name, k.name\nFROM animals a\nLEFT JOIN keepers k ON a.keeper_id = k.id\nORDER BY a.id;`,
  say:"Result: the same 5 pairs as before, plus Odo | NULL"},
 {type:"talk",title:"Find what's missing",mood:"think",
  body:`<p>A classic trick: LEFT JOIN, then keep rows where the right side ${C("IS NULL")}. That finds things with no match.</p>`,
  demo:`SELECT k.name\nFROM keepers k\nLEFT JOIN animals a ON a.keeper_id = k.id\nWHERE a.id IS NULL;`,
  say:"Result: Mia. She's the only keeper without an animal."},
 {type:"quiz",q:"What does LEFT JOIN do with left-side rows that have no match?",opts:["Keeps them, with NULLs on the right","Drops them","Duplicates them"],a:0,why:"That's the whole difference from INNER JOIN."},
 {type:"fill",title:"Snack-less animals",body:`<p>Find animals that never got a snack.</p>`,code:`SELECT a.name FROM animals a\n[0] JOIN snacks s ON s.animal_id = a.id\nWHERE s.id [1];`,blanks:["LEFT","IS NULL"],tokens:["LEFT","IS NULL","INNER","= NULL"],why:"LEFT JOIN keeps everyone; IS NULL finds the ones with no snack.",out:"Odo"},
 {type:"quiz",q:"What does this return?",code:`SELECT COUNT(*) FROM keepers k\nLEFT JOIN animals a ON a.keeper_id = k.id;`,opts:["6","4","5"],a:0,mono:true,why:"Ava appears 3 times (one per animal), Leo once, Kai once, Mia once with NULL."},
 {type:"game"},{type:"done"}],
 pool:[
  [`SELECT COUNT(*) FROM animals a LEFT JOIN keepers k ON a.keeper_id = k.id;`,["6","5","4"]],
  [`SELECT k.name FROM animals a LEFT JOIN keepers k ON a.keeper_id = k.id WHERE a.name = 'Odo';`,["NULL","(no rows)","Odo"]],
  [`SELECT k.name, COUNT(a.id) FROM keepers k LEFT JOIN animals a ON a.keeper_id = k.id GROUP BY k.id ORDER BY k.id;`,["Ava | 3\nLeo | 1\nKai | 1\nMia | 0","Ava | 3\nLeo | 1\nKai | 1","Ava | 3\nLeo | 1\nKai | 1\nMia | 1"]],
  [`SELECT COUNT(*) FROM animals a LEFT JOIN snacks s ON s.animal_id = a.id WHERE s.id IS NULL;`,["1","0","6"]]
 ]},
{id:"sql9",title:"Project: Zoo Report",sub:"joins + groups for a real report",project:true,steps:[
 {type:"talk",title:"The manager wants a report",mood:"cheer",
  body:`<p>The zoo manager asks: "For each keeper, how many animals do they look after and how many snacks did those animals eat?" You'll build that report one piece at a time.</p>`,
  show:["keepers","animals","snacks"],say:"Real data analysts write queries like this every day."},
 {type:"order",title:"Step 1: animals per keeper",body:`<p>Count each keeper's animals, including keepers with none.</p>`,
  lines:["SELECT k.name, COUNT(a.id) AS animals","FROM keepers k","LEFT JOIN animals a ON a.keeper_id = k.id","GROUP BY k.id","ORDER BY animals DESC, k.name;"],why:"LEFT JOIN so Mia shows up with 0, then group per keeper.",out:"Ava | 3\nKai | 1\nLeo | 1\nMia | 0"},
 {type:"fill",title:"Step 2: snacks per keeper",body:`<p>Join three tables and total the snacks.</p>`,
  code:`SELECT k.name, SUM(s.qty) AS snacks\nFROM keepers k\nJOIN animals a ON a.keeper_id = k.id\nJOIN snacks s ON s.animal_id = [0]\nGROUP BY k.id\nORDER BY snacks [1];`,blanks:["a.id","DESC"],tokens:["a.id","DESC","k.id","ASC"],why:"Snacks belong to animals, so match s.animal_id to a.id.",out:"Ava | 31\nKai | 15\nLeo | 4"},
 {type:"quiz",q:"Ava's animals ate how many snacks in total?",opts:["31","8","26"],a:0,why:"Mo 6 + 2, Pip 3, Bao 20: 31."},
 {type:"talk",title:"The finished report",mood:"cheer",
  body:`<p>One query, the whole report. ${C("COALESCE")} turns NULL into 0 for keepers with no snacks, and ${C("DISTINCT")} avoids counting an animal twice.</p>`,
  demo:`SELECT k.name,\n       COUNT(DISTINCT a.id) AS animals,\n       COALESCE(SUM(s.qty), 0) AS snacks\nFROM keepers k\nLEFT JOIN animals a ON a.keeper_id = k.id\nLEFT JOIN snacks s ON s.animal_id = a.id\nGROUP BY k.id\nORDER BY snacks DESC;`,
  say:"Result:\nAva | 3 | 31\nKai | 1 | 15\nLeo | 1 | 4\nMia | 0 | 0"},
 {type:"done"}]}
]};

const SQL_UNIT4={name:"Changing data",lessons:[
{id:"sql10",title:"INSERT",sub:"adding new rows",steps:[
 {type:"talk",title:"Add a row",
  body:`<p>${C("INSERT INTO")} adds rows. List the columns, then the ${C("VALUES")} in the same order.</p>`,
  demo:`INSERT INTO keepers (id, name, shift) VALUES (5, 'Zed', 'night');\nSELECT name FROM keepers WHERE shift = 'night';`,
  say:"Result: Leo, Mia, Zed. Zed is hired!"},
 {type:"talk",title:"Several at once",mood:"think",
  body:`<p>Add multiple rows by separating the value groups with commas.</p>`,
  demo:`INSERT INTO animals (id, name, species, age, keeper_id) VALUES\n  (7, 'Lulu', 'lemur', 3, 4),\n  (8, 'Rafa', 'monkey', 6, 4);\nSELECT COUNT(*) FROM animals;`,
  say:"Result: 8. Mia finally has animals to look after!"},
 {type:"quiz",q:"What has to match in an INSERT?",opts:["The column list and the VALUES order","The table name and the first column","Nothing, SQL figures it out"],a:0,why:"Values are matched to columns by position."},
 {type:"fill",title:"New snack",body:`<p>Give Odo (id 6) 5 mice.</p>`,code:`[0] snacks (id, animal_id, food, qty)\n[1] (7, 6, 'mice', 5);\nSELECT food FROM snacks WHERE animal_id = 6;`,blanks:["INSERT INTO","VALUES"],tokens:["INSERT INTO","VALUES","ADD","SET"],why:"INSERT INTO table (columns) VALUES (values).",out:"mice"},
 {type:"quiz",q:"What does the final SELECT return?",code:`INSERT INTO keepers (id, name, shift) VALUES (5, 'Zed', 'night');\nSELECT COUNT(*) FROM keepers;`,opts:["5","4","1"],a:0,mono:true,why:"4 keepers plus Zed."},
 {type:"game"},{type:"done"}],
 pool:[
  [`INSERT INTO keepers (id, name, shift) VALUES (9, 'Ivy', 'morning');\nSELECT COUNT(*) FROM keepers WHERE shift = 'morning';`,["3","2","4"]],
  [`INSERT INTO snacks (id, animal_id, food, qty) VALUES (8, 5, 'banana', 10);\nSELECT SUM(qty) FROM snacks WHERE food = 'banana';`,["19","10","9"]],
  [`INSERT INTO animals (id, name, species, age, keeper_id) VALUES (9, 'Bo', 'owl', 1, NULL);\nSELECT COUNT(*) FROM animals WHERE keeper_id IS NULL;`,["2","1","0"]]
 ]},
{id:"sql11",title:"UPDATE & DELETE",sub:"changing and removing rows",steps:[
 {type:"talk",title:"UPDATE … SET",
  body:`<p>${C("UPDATE")} changes existing rows. ${C("SET")} says what to change, ${C("WHERE")} says which rows.</p>`,
  demo:`UPDATE animals SET keeper_id = 4 WHERE name = 'Odo';\nSELECT name, keeper_id FROM animals WHERE name = 'Odo';`,
  say:"Result: Odo | 4. Mia adopts the owl!"},
 {type:"talk",title:"DELETE, carefully",mood:"oops",
  body:`<p>${C("DELETE FROM")} removes rows. <b>Always</b> include a WHERE. Without one, it deletes every row in the table!</p>`,
  demo:`DELETE FROM snacks WHERE qty < 5;\nSELECT COUNT(*) FROM snacks;`,
  say:"Result: 3. The small snacks (3 bananas, 4 seeds and 2 mangoes) are gone."},
 {type:"quiz",q:"What happens with DELETE FROM snacks; (no WHERE)?",opts:["Every snack row is deleted","Nothing happens","SQL asks you to confirm"],a:0,why:"No WHERE means no filter. Pros double-check with a SELECT first."},
 {type:"fill",title:"Birthday time",body:`<p>Pip turns 3. Update his age.</p>`,code:`[0] animals [1] age = 3 WHERE name = 'Pip';\nSELECT age FROM animals WHERE name = 'Pip';`,blanks:["UPDATE","SET"],tokens:["UPDATE","SET","CHANGE","INTO"],why:"UPDATE table SET column = value WHERE ...",out:"3"},
 {type:"quiz",q:"What does the SELECT return?",code:`UPDATE animals SET age = age + 1;\nSELECT MAX(age) FROM animals;`,opts:["13","12","1"],a:0,mono:true,why:"No WHERE, so every animal gets a year older. Kiki goes from 12 to 13."},
 {type:"game"},{type:"done"}],
 pool:[
  [`UPDATE snacks SET qty = qty * 2 WHERE food = 'mango';\nSELECT qty FROM snacks WHERE food = 'mango';`,["4","2","mango"]],
  [`DELETE FROM keepers WHERE shift = 'night';\nSELECT COUNT(*) FROM keepers;`,["2","4","0"]],
  [`UPDATE keepers SET shift = 'night';\nSELECT COUNT(*) FROM keepers WHERE shift = 'morning';`,["0","2","4"]],
  [`DELETE FROM animals WHERE species = 'monkey';\nSELECT COUNT(*) FROM animals;`,["4","6","2"]]
 ]},
{id:"sql12",title:"Project: Build a Library",sub:"CREATE TABLE and design your own database",project:true,steps:[
 {type:"talk",title:"Design your own database",mood:"cheer",
  body:`<p>Final project: a library app. You'll create the tables yourself with ${C("CREATE TABLE")}, giving each column a type. ${C("PRIMARY KEY")} marks the unique id of each row.</p>`,
  demo:`CREATE TABLE books (\n  id INTEGER PRIMARY KEY,\n  title TEXT NOT NULL,\n  author TEXT,\n  year INTEGER\n);\nINSERT INTO books VALUES (1, 'Hatchet', 'Gary Paulsen', 1987);\nSELECT title FROM books;`,
  say:"Result: Hatchet. NOT NULL means that column must always have a value."},
 {type:"fill",title:"Step 1: a members table",body:`<p>Create a table for library members.</p>`,
  code:`[0] members (\n  id INTEGER [1],\n  name TEXT NOT NULL\n);\nINSERT INTO members VALUES (1, 'Ava');\nSELECT name FROM members;`,blanks:["CREATE TABLE","PRIMARY KEY"],tokens:["CREATE TABLE","PRIMARY KEY","NEW TABLE","UNIQUE ID"],why:"CREATE TABLE name (columns...). The id is the primary key.",out:"Ava"},
 {type:"order",title:"Step 2: loans",body:`<p>A loans table links members to books.</p>`,
  lines:["CREATE TABLE loans (","  member_id INTEGER,","  book_id INTEGER,","  due TEXT",");","INSERT INTO loans VALUES (1, 1, '2026-11-01');","SELECT COUNT(*) FROM loans;"],why:"Two ids pointing at other tables, plus a due date.",out:"1"},
 {type:"quiz",q:"Why does loans store member_id instead of the member's name?",opts:["Names can repeat or change; ids are unique and stable","Numbers are prettier","SQL can't store text twice"],a:0,why:"Point at the id, then JOIN to get the name whenever you need it."},
 {type:"talk",title:"The finished library",mood:"cheer",
  body:`<p>Everything together, with a JOIN showing who borrowed what.</p>`,
  demo:`CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL);\nCREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT NOT NULL);\nCREATE TABLE loans (member_id INTEGER, book_id INTEGER, due TEXT);\nINSERT INTO books VALUES (1, 'Hatchet'), (2, 'Wonder'), (3, 'Holes');\nINSERT INTO members VALUES (1, 'Ava'), (2, 'Leo');\nINSERT INTO loans VALUES (1, 1, '2026-11-01'), (1, 3, '2026-11-05'), (2, 2, '2026-11-03');\nSELECT m.name, b.title, l.due\nFROM loans l\nJOIN members m ON m.id = l.member_id\nJOIN books b ON b.id = l.book_id\nORDER BY l.due;`,
  say:"Result:\nAva | Hatchet | 2026-11-01\nLeo | Wonder | 2026-11-03\nAva | Holes | 2026-11-05\n\nYou designed a real database. You finished SQL! 🗄️"},
 {type:"done"}]}
]};

const COURSE_SQL={id:"sql",name:"SQL",blurb:"The language every app uses to store and question data. Explore the TypeMonkey Zoo database. Unit 1 is free.",tables:ZOO_TABLES,
  units:[SQL_UNIT1,SQL_UNIT2,SQL_UNIT3,SQL_UNIT4]};
