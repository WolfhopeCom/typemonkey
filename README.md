# TypeMonkey 🐒

A play-along app for learning to code, guided by TypeMonkey, an orange monkey with round glasses who cheers you on. Bite-size lessons, real code you run yourself, quizzes, puzzles and mini-games.

**Audience:** teens, college students and anyone starting from zero. A separate kids section (TypeMonkey Jr.) is planned.

## What's in it

| Course | Status | Lessons |
|---|---|---|
| JavaScript | Complete: 6 units, 25 lessons, 5 projects | Code runs live in the app |
| C# | Unit 1 built (3 lessons), Units 2–4 planned | Read-and-reason exercises |
| C++ | Unit 1 built (3 lessons), Units 2–4 planned | Read-and-reason exercises |
| Python, HTML & CSS, SQL, TypeMonkey Jr. | Planned | |

Also included:

- **Playground:** a free-coding editor with a language picker. JavaScript runs today; Python, C# and C++ need a bundled compiler (planned for the native apps).
- **Practice rush:** a 60-second review game drawing from every lesson you've finished.
- **Progress:** XP, bananas, daily streak, and resume-where-you-left-off, saved on the device.
- **Business model:** Unit 1 of each course is free; a one-time $4.99 unlock opens everything (currently a demo button).

Everything runs on the device. There are no servers, accounts, API keys or outside services.

## Project layout

```
src/
  app.html                     the app: screens, lesson engine, code runner, styles
  courses/
    javascript-units-1-2.js    lesson content, one file per chunk of the course
    javascript-units-3-4.js
    javascript-units-5-6.js
    csharp-cpp.js
build.py                       combines src/ into one page
tests/verify_course.py         runs every lesson's code to prove the answers are right
index.html                     built app (generated, ready for GitHub Pages)
```

## Build and test

```bash
python3 build.py                  # writes index.html
python3 build.py --artifact       # writes dist/artifact.html (Claude artifact version)

pip install playwright && python -m playwright install chromium
python3 tests/verify_course.py    # checks every answer by running the code
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
- `done`: the reward screen

Run `tests/verify_course.py` after editing a JavaScript lesson.

## Roadmap

- C# and C++ Units 2–4
- Python course (runs via Pyodide in the native app)
- TypeMonkey Jr. kids section
- Native apps for iPhone, iPad, Android and desktop (wrap with Capacitor; Apple developer account $99/yr, Google Play $25 once)
- Real in-app purchase through the App Store and Google Play
