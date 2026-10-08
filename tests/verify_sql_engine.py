#!/usr/bin/env python3
"""Compares TypeMonkey's in-house SQL engine (src/engines/sql.js) with real SQLite.

Every query in the SQL course (demos, games, quizzes, fill-ins, ordering steps and challenge
solutions) plus the EXTRA queries below must give identical results in both.
Usage: python3 tests/verify_sql_engine.py
"""
import json, pathlib, re, sqlite3, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
from verify_compiled import load_courses, sql_setup, run_sql  # noqa: E402

EXTRA = [
    "WITH old AS (SELECT * FROM animals WHERE age > 5) SELECT COUNT(*) FROM old;",
    "WITH old AS (SELECT * FROM animals WHERE age > 5), named AS (SELECT name, age FROM old) SELECT name FROM named n WHERE n.age < 12 ORDER BY name;",
    "WITH k AS (SELECT id, name FROM keepers) SELECT a.name, k.name FROM animals a JOIN k ON a.keeper_id = k.id ORDER BY a.name;",
    "SELECT 7 / 2, 7.0 / 2, 7 % 3, -7 / 2",
    "SELECT name FROM animals WHERE name LIKE '%o%' ORDER BY name",
    "SELECT species, AVG(age), MIN(name) FROM animals GROUP BY species ORDER BY 2 DESC, 1",
    "SELECT COUNT(*), COUNT(keeper_id), COUNT(DISTINCT keeper_id) FROM animals",
    "SELECT name, CASE WHEN age >= 9 THEN 'old' WHEN age >= 5 THEN 'grown' ELSE 'young' END AS stage FROM animals ORDER BY id",
    "SELECT a.name FROM animals a WHERE a.age > (SELECT AVG(age) FROM animals) ORDER BY a.name",
    "SELECT name FROM keepers WHERE id IN (SELECT keeper_id FROM animals WHERE species = 'monkey')",
    "SELECT name FROM keepers WHERE id NOT IN (1, 2) ORDER BY name DESC",
    "SELECT UPPER(name), LENGTH(name), name || '!' FROM keepers ORDER BY id LIMIT 2 OFFSET 1",
    "SELECT ROUND(AVG(qty), 2), SUM(qty) * 1.0 / COUNT(*) FROM snacks",
    "SELECT food, SUM(qty) AS total FROM snacks GROUP BY food ORDER BY total DESC, food LIMIT 3",
    "SELECT k.shift, COUNT(a.id) FROM keepers k LEFT JOIN animals a ON a.keeper_id = k.id GROUP BY k.shift ORDER BY k.shift",
    "SELECT DISTINCT species FROM animals ORDER BY species",
    "SELECT name FROM animals WHERE keeper_id IS NULL OR age < 3 ORDER BY id",
    "SELECT MAX(age) - MIN(age) FROM animals",
    "SELECT SUM(qty) FROM snacks WHERE food = 'pizza'",
    "SELECT COUNT(*) FROM snacks WHERE food = 'pizza'",
    "SELECT name FROM animals ORDER BY keeper_id, name",
    "SELECT COALESCE(keeper_id, 0) FROM animals ORDER BY id",
    "SELECT a.name, s.food FROM animals a JOIN snacks s ON s.animal_id = a.id WHERE s.qty BETWEEN 3 AND 15 ORDER BY s.qty",
    "INSERT INTO snacks VALUES (7, 6, 'mice', 5); SELECT animal_id, COUNT(*) FROM snacks GROUP BY animal_id ORDER BY animal_id",
    "UPDATE animals SET age = age * 2 WHERE species = 'monkey'; SELECT SUM(age) FROM animals",
    "DELETE FROM animals WHERE keeper_id IS NULL; SELECT COUNT(*) FROM animals",
    "CREATE TABLE t (id INTEGER PRIMARY KEY, v TEXT); INSERT INTO t (v) VALUES ('a'), ('b'); SELECT id, v FROM t ORDER BY id",
    "SELECT 1.5 + 1, 2 * 3.0, 10 / 4.0, 0.1 + 0.2",
    "SELECT name FROM animals WHERE species <> 'monkey' AND NOT age > 8 ORDER BY name",
    "SELECT shift, GROUP_CONCAT(name) FROM keepers GROUP BY shift ORDER BY shift",
    "SELECT name FROM animals WHERE name = 'mo'",
    "SELECT name FROM animals WHERE name LIKE 'mo'",
    "SELECT AVG(age) FROM animals WHERE species = 'monkey'",
]


def main():
    courses = load_courses()
    sql = courses["sql"]
    tables = sql["tables"]
    setup = sql_setup(tables)
    queries = []
    for unit in sql["units"]:
        for l in unit["lessons"]:
            for code, _ in l.get("pool", []):
                queries.append(code)
            for s in l.get("steps", []):
                if s["type"] == "talk" and s.get("demo"):
                    queries.append(s["demo"])
                if s["type"] == "quiz" and s.get("code"):
                    queries.append(s["code"])
                if s["type"] == "fill":
                    queries.append(re.sub(r"\[(\d)\]", lambda m: s["blanks"][int(m.group(1))], s["code"]))
                if s["type"] == "order":
                    queries.append("\n".join(s["lines"]))
                if s["type"] == "code":
                    queries.append(s["hint"])
    queries += EXTRA
    script = (ROOT / "src" / "engines" / "sql.js").read_text() + """
const I=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(I.q.map(q=>{const r=TMSQL.run(q,I.t);return r.ok?TMSQL.text(r):'ERROR: '+r.error})));"""
    tmp = ROOT / "tests" / ".sqlcheck.js"
    tmp.write_text(script)
    try:
        res = subprocess.run(["node", str(tmp)], input=json.dumps({"q": queries, "t": tables}), capture_output=True, text=True, check=True)
    finally:
        tmp.unlink()
    ours = json.loads(res.stdout)
    problems = 0
    for q, mine in zip(queries, ours):
        multi = [s for s in q.split(";") if s.strip()]
        has_select = any(s.strip().upper().startswith("SELECT") for s in multi)
        ok, real = run_sql(q, setup)
        if not ok:
            real = "ERROR"
        if not has_select:
            continue
        if (mine.startswith("ERROR") and real == "ERROR"):
            continue
        if mine != real:
            problems += 1
            print("✖", q.replace("\n", " ")[:150])
            print("   sqlite :", real.replace("\n", " / ")[:200])
            print("   ours   :", mine.replace("\n", " / ")[:200])
    print(f"{len(queries)} queries compared, {problems} mismatch(es)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
