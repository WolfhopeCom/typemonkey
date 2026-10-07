# TypeMonkey 🐒

A play-along app for learning to code, guided by TypeMonkey, an orange monkey with round glasses who cheers you on. Bite-size lessons, real code you run yourself, quizzes, puzzles and mini-games.

**Audience:** teens, college students and anyone starting from zero. Kids aged 7–12 get their own section, TypeMonkey Jr.

## What's in it

| Course | Size | How it works in the app |
|---|---|---|
| JavaScript | 6 units · 25 lessons | Code runs live; challenges are graded by running your code |
| Python | 6 units · 20 lessons | Read-and-reason exercises (runs live once Pyodide is bundled in the native app) |
| HTML & CSS | 4 units · 12 lessons | Pages render live; challenges inspect the page you built |
| SQL | 4 units · 12 lessons | Read-and-reason against the TypeMonkey Zoo database, shown as tables |
| C# | 4 units · 12 lessons | Read-and-reason exercises |
| C++ | 4 units · 12 lessons | Read-and-reason exercises |
| TypeMonkey Jr. (ages 7–12) | 3 units · 9 lessons | Block-coding maze puzzles: sequences, loops, debugging, plus logic games |

Every course ends each unit with a project. Exercise types: explanations with runnable demos, code challenges, quizzes, fill-in-the-blank, put-the-lines-in-order, Output Rush (a timed "what prints?" game) and, for kids, maze puzzles.

Also included:

- **Playground:** free coding with a language picker. JavaScript and HTML & CSS run today; Python, C# and C++ need a bundled compiler (planned for the native apps).
- **Practice rush:** a 60-second review game drawing from every lesson you've finished.
- **Progress:** XP, bananas, daily streak, and resume-where-you-left-off, saved on the device.
- **Business model:** Unit 1 of each course is free; a one-time $4.99 unlock opens everything (currently a demo button).
- **Tester mode** (footer) opens every lesson for testing.

Everything runs on the device. There are no servers, accounts, API keys or outside services.

## Project layout

```
src/
  app.html                     the app: screens, lesson engine, code runner, web preview, mazes, styles
  courses/                     lesson content, one or more files per course
    javascript-units-*.js  python-units-*.js  web.js  sql.js
    csharp.js  csharp-units-2-4.js  cpp.js  cpp-units-2-4.js  jr.js
build.py                       combines src/ into one page (file order lives here)
tests/verify_course.py         browser test: runs every JS answer, checks every HTML/CSS challenge and maze
tests/verify_compiled.py       runs every C++ (g++), Python (python3) and SQL (SQLite) answer for real
index.html                     built app (generated)
```

## Build and test

```bash
python3 build.py                  # writes index.html
python3 build.py --artifact       # writes dist/artifact.html (Claude artifact version)

pip install playwright && python -m playwright install chromium
python3 tests/verify_course.py    # JavaScript, HTML & CSS, mazes, and structure of every course
python3 tests/verify_compiled.py  # C++, Python and SQL answers (needs g++, python3, node)
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

- Run Python, C#, C++ and SQL live in the native app (Pyodide, bundled compilers, SQLite)
- Terms of Service and Privacy Policy screens (needed for the app stores; kids section needs COPPA review)
- Native apps for iPhone, iPad, Android and desktop (wrap with Capacitor; Apple developer account $99/yr, Google Play $25 once)
- Real in-app purchase through the App Store and Google Play
