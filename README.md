# TypeMonkey 🐒

A play-along app for learning to code, guided by TypeMonkey, an orange monkey with round glasses who cheers you on. Bite-size lessons, real code you run yourself, quizzes, puzzles and mini-games.

**Audience:** teens, college students and anyone starting from zero. Kids aged 7–12 get their own section, TypeMonkey Jr.

## What's in it

| Course | Size | How it works in the app |
|---|---|---|
| JavaScript | 7 units · 29 lessons | Runs live in the browser |
| Build a Game (JavaScript) | 6 units · 24 lessons | Runs live on a retro "game screen": dice, mazes, card games, boss battles |
| Python | 9 units · 34 lessons | Runs live (Brython, bundled) |
| HTML & CSS | 7 units · 26 lessons | Pages render live; challenges inspect the page you built |
| SQL | 7 units · 24 lessons | Runs live on the TypeMonkey Zoo database (in-house SQL engine) |
| C# | 7 units · 26 lessons | Runs live (in-house C#/C++/Java runner, with inheritance) |
| C++ | 7 units · 26 lessons | Runs live (in-house runner, checked against g++) |
| Java | 6 units · 24 lessons | Runs live (in-house runner, checked against javac) |
| Swift | 6 units · 24 lessons | Runs live (in-house Swift runner, checked against a real Swift 6 compiler) |
| TypeMonkey Jr. (ages 7–12) | 6 units · 21 lessons | No typing: block mazes, dance party, sorting machine, banana boxes, predict puzzles and a puzzle maker |

Plus two hands-on sections (Python):

- **🏗️ Build Projects:** 8 projects across Beginner, Intermediate and Advanced. Each is a mission brief, small missions that teach one piece, then a final build TypeMonkey checks by playing your program with different inputs. Pick any project in an open level; a level opens after any 2 projects in the level before it.
- **🐛 Bug Lab:** 5 levels of broken code to fix, from syntax slips to debugging a mini-project, with hints that come one at a time.

All code challenges are graded by running the learner's code (with changed values or several inputs, so hard-coded answers fail). Help comes as a ladder: one clue, then the plan, then the answer. Early lessons add a warm-up before longer code.

Also included:

- **TypeMonkey Jr. help:** a clear goal line on every puzzle with read-aloud, kind "oops" messages, step-by-step hints that glow on the block to fix, a gentle "can you make it shorter?" nudge, and the kid's blocks shown as real code after each win.
- **Playground:** free coding in every language, with an input box for programs that ask questions.
- **Review:** missed questions come back with spaced repetition.
- **Shop & badges:** spend bananas on outfits for TypeMonkey; earn badges.
- **Sounds:** soft synthesized effects (no audio files), with an on/off switch in the top bar and in Settings.
- **Backup code:** Settings → Back up my progress makes a `TM1-` code (or a file) you can paste on another device to restore lessons, bananas and outfits. Codes are checked before anything is replaced.
- **Progress:** XP, bananas, daily streak and resume-where-you-left-off, saved on the device.
- **Business model:** Unit 1 of each course is free; a one-time $4.99 unlock opens everything (currently a demo button behind a grown-up check).

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
tests/verify_java.py           app's Java runner vs javac
tests/verify_swift.py          app's Swift runner vs expected outputs
tests/verify_swift_real.py     app's Swift runner vs a real Swift compiler (set SWIFTC=/path/to/swiftc; skips if unset)
tests/verify_extras.py         Build Projects and Bug Lab answers vs python3
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
python3 tests/verify_java.py && python3 tests/verify_swift.py && python3 tests/verify_extras.py
SWIFTC=/opt/swiftwasm/swift-wasm-6.0.2-RELEASE/usr/bin/swiftc python3 tests/verify_swift_real.py  # swiftwasm 6.0.2 (Ubuntu 22.04) from GitHub releases
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
