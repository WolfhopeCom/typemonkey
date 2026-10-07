# TypeMonkey 🐒

A play-along app for learning to code, guided by TypeMonkey, an orange monkey with round glasses who cheers you on. Bite-size lessons, real code you run yourself, quizzes, puzzles and mini-games.

**Audience:** teens, college students and anyone starting from zero. Kids aged 7–12 get their own section, TypeMonkey Jr.

## What's in it

| Course | Size | How it works in the app |
|---|---|---|
| JavaScript | 6 units · 25 lessons | Runs live in the browser |
| Python | 6 units · 20 lessons | Runs live (Brython, bundled) |
| HTML & CSS | 4 units · 12 lessons | Pages render live; challenges inspect the page you built |
| SQL | 4 units · 12 lessons | Runs live on the TypeMonkey Zoo database (in-house SQL engine); results show as tables |
| C# | 4 units · 12 lessons | Runs live (in-house C#/C++ runner) |
| C++ | 4 units · 12 lessons | Runs live (in-house C#/C++ runner) |
| TypeMonkey Jr. (ages 7–12) | 4 units · 13 lessons | Block-coding mazes: sequences, loops, repeat-until, if-tree-ahead choices, banana hunts, debugging, plus logic games |

All code challenges are graded by running the learner's code (with changed values too, so hard-coded answers fail).

Every course ends each unit with a project. Exercise types: explanations with runnable demos, code challenges, quizzes, fill-in-the-blank, put-the-lines-in-order, Output Rush (a timed "what prints?" game) and, for kids, maze puzzles.

Also included:

- **Playground:** free coding in all six languages, including SQL against the zoo database.
- **Review:** every missed quiz, fill-in, ordering puzzle and Output Rush question comes back with spaced repetition (right away, then after 1, 3 and 7 days).
- **Shop:** spend bananas on fur colors, hats, glasses and neckwear for TypeMonkey; the look appears everywhere he does.
- **Practice rush:** a 60-second review game drawing from every lesson you've finished.
- **Progress:** XP, bananas, daily streak, and resume-where-you-left-off, saved on the device.
- **Business model:** Unit 1 of each course is free; a one-time $4.99 unlock opens everything (currently a demo button).

Everything runs on the device. There are no servers, accounts, API keys or outside services.

## Project layout

```
src/
  app.html                     the app: screens, lesson engine, runners, web preview, mazes, shop, review, styles
  engines/sql.js               in-house SQL engine (SQLite-style)
  engines/clike.js             in-house C# / C++ runner for the course subset
  vendor/brython.js            Brython 3.14 (Python in the browser, BSD licence)
  legal.js                     Terms of Service and Privacy Policy (draft)
  courses/                     lesson content, one or more files per course
    javascript-units-*.js  python-units-*.js  web.js  sql.js
    csharp.js  csharp-units-2-4.js  cpp.js  cpp-units-2-4.js  jr.js
    challenges.js              hands-on challenges for Python, SQL, C#, C++
build.py                       combines src/ into one page (file order lives here)
tests/verify_course.py         browser test: runs every JS answer, checks every HTML/CSS challenge and maze
tests/verify_compiled.py       runs every C++ (g++), Python (python3) and SQL (SQLite) answer for real
tests/verify_python_engine.py  app's Python vs python3 on every snippet
tests/verify_sql_engine.py     app's SQL engine vs SQLite
tests/verify_clike.py          app's C++ runner vs g++, C# runner vs verified answers
index.html                     built app (generated)
```

## Build and test

```bash
python3 build.py                  # writes index.html
python3 build.py --artifact       # writes dist/artifact.html (Claude artifact version)

pip install playwright && python -m playwright install chromium
python3 tests/verify_course.py    # JavaScript, HTML & CSS, mazes, and structure of every course
python3 tests/verify_compiled.py  # C++, Python and SQL answers (needs g++, python3, node)
python3 tests/verify_python_engine.py && python3 tests/verify_sql_engine.py && python3 tests/verify_clike.py
```

Open `index.html` in any browser to use the app.

## Writing lessons

Each lesson is a list of steps. Step types:

- `talk`: an explanation, optionally with a runnable `demo`
- `code`: a challenge graded by `use` (required code patterns), `out` (exact expected output), `outRe` (output patterns) and `variants` (re-run with changed values so hard-coded answers fail). Always include a `hint` solution.
- `quiz`: multiple choice; `a` is the index of the correct option (options are shuffled on screen)
- `fill`: code with `[0]`, `[1]` blanks, the correct `blanks`, and the `tokens` to choose from
- `order`: `lines` in the correct order; they're shuffled on screen
- `game`: Output Rush using the lesson's `pool` of `[code, [correct, wrong, wrong]]`
- `maze` (TypeMonkey Jr.): a `grid` of `#` trees, `.` paths, `S` start and `B` banana, a starting `dir`, the `blocks` offered, an optional `max` block count, an optional buggy `start` program and a `solution`
- HTML & CSS `code` steps use `checks` (CSS selectors plus expected text, attributes or styles) instead of output
- `done`: the reward screen

Run both test scripts after editing lessons. They catch wrong answers, unsolvable mazes and challenges whose starter code already passes.

## Roadmap

- Terms of Service and Privacy Policy screens (needed for the app stores; kids section needs COPPA review)
- Native apps for iPhone, iPad, Android and desktop (wrap with Capacitor; Apple developer account $99/yr, Google Play $25 once)
- Real in-app purchase through the App Store and Google Play
