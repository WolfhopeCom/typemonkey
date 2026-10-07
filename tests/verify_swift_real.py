#!/usr/bin/env python3
"""Compares TypeMonkey's Swift runner (src/engines/swift.js) with a real Swift compiler.

Every program that tests/verify_swift.py checks (course demos, quizzes, code-step answers and starters,
Output Rush rounds, fill-ins, and the EXTRA programs) is compiled with swiftc, run, and its output compared
with what TMSwift.run prints. Skips (exit 0) when no Swift compiler can be found.

Finding swiftc: $SWIFTC, then `swiftc` on PATH. Any Linux toolchain works; for example the swiftwasm
release tarball (swift-wasm-6.0.2-RELEASE-ubuntu22.04_x86_64.tar.gz) ships a usr/bin/swiftc that builds
native Linux programs. Don't commit a toolchain to the repo.

Usage:
  python3 tests/verify_swift_real.py [-v]            check everything
  python3 tests/verify_swift_real.py FILE.swift ...  compare ad-hoc programs; one file can hold several,
                                                     separated by lines that are exactly "// ----"
Real results are cached by program text in $SWIFT_REAL_CACHE (default ~/.cache/typemonkey-swift-real).
"""
import concurrent.futures as cf, hashlib, json, os, pathlib, re, shutil, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
import verify_swift as VS  # noqa: E402

VERBOSE = "-v" in sys.argv
CACHE = pathlib.Path(os.environ.get("SWIFT_REAL_CACHE", pathlib.Path.home() / ".cache" / "typemonkey-swift-real"))
# programs whose output is random by design, or that only make sense in TypeMonkey (readLine with no input)
SKIP_RE = re.compile(r"\.random|shuffled\(|shuffle\(|randomElement")


# unbuffered stdout, so what a crashing program printed before it crashed isn't lost
STDBUF = ["stdbuf", "-o0"] if shutil.which("stdbuf") else []


def find_swiftc():
    c = os.environ.get("SWIFTC") or shutil.which("swiftc")
    return c if c and os.path.exists(c) else None


def real_run(swiftc, code):
    """-> {"kind": "ok"|"error"|"crash", "out": stdout, "msg": compiler/runtime message}"""
    key = hashlib.sha256(("v3\n" + code).encode()).hexdigest()
    hit = CACHE / (key + ".json")
    if hit.exists():
        return json.loads(hit.read_text())
    with tempfile.TemporaryDirectory() as d:
        src = pathlib.Path(d) / "main.swift"
        src.write_text(code + "\n")
        c = subprocess.run([swiftc, "-Onone", "-module-name", "main", "-Xlinker", "-lm", str(src), "-o", str(pathlib.Path(d) / "prog")], capture_output=True, text=True, cwd=d)
        if c.returncode:
            msg = "\n".join(l for l in c.stderr.splitlines() if "error:" in l)[:600]
            r = {"kind": "error", "out": "", "msg": msg}
        else:
            try:
                p = subprocess.run(STDBUF + [str(pathlib.Path(d) / "prog")], capture_output=True, text=True, timeout=10, stdin=subprocess.DEVNULL)
                r = {"kind": "crash" if p.returncode else "ok", "out": p.stdout, "msg": p.stderr.strip().splitlines()[0][:300] if p.returncode and p.stderr.strip() else ""}
            except subprocess.TimeoutExpired as t:
                r = {"kind": "crash", "out": (t.stdout or b"").decode(errors="replace"), "msg": "timeout"}
    CACHE.mkdir(parents=True, exist_ok=True)
    hit.write_text(json.dumps(r))
    return r


def tm_kind(r):
    e = r["error"]
    if not e:
        return "ok"
    if e.startswith("error"):
        return "error"
    if e.startswith("Fatal error") or e.startswith("Stopped"):
        return "crash"
    return "unsupported"


def unordered_equal(a, b):
    """Dictionaries and Sets print in a random order in real Swift: accept lines that only differ in order."""
    la, lb = a.split("\n"), b.split("\n")
    return len(la) == len(lb) and all(x == y or ("[" in x and sorted(x) == sorted(y)) for x, y in zip(la, lb))


def compare(swiftc, programs):
    """programs: [(where, code)] -> list of problems"""
    tm = VS.run_all([c for _, c in programs])
    with cf.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as pool:
        real = list(pool.map(lambda wc: real_run(swiftc, wc[1]), programs))
    problems, unsupported = [], []
    for (w, code), t, r in zip(programs, tm, real):
        tk, rk = tm_kind(t), r["kind"]
        if tk == "unsupported":
            unsupported.append(f"{w}: {t['error']}")
            continue
        bad = None
        if tk != rk:
            bad = f"real Swift: {rk} {r['msg']!r} {r['out'][-200:]!r}\n    TypeMonkey: {tk} {t['error']!r} {t['out'][-200:]!r}"
        elif tk != "error" and t["out"] != r["out"] and not unordered_equal(t["out"], r["out"]):
            bad = f"output differs\n    real Swift: {r['out'][-400:]!r}\n    TypeMonkey: {t['out'][-400:]!r}"
        if bad:
            problems.append(f"{w}: {bad}\n    code: {code[:300]!r}")
        elif VERBOSE:
            print(f"  ok {w}: {rk} {r['out'][:60]!r}")
    return problems, unsupported


def main():
    swiftc = find_swiftc()
    if not swiftc:
        print("Swift (real): no swiftc found (set $SWIFTC), skipped.")
        return 0
    files = [a for a in sys.argv[1:] if not a.startswith("-")]
    if files:
        programs = []
        for f in files:
            for i, chunk in enumerate(re.split(r"(?m)^// ----\s*$", pathlib.Path(f).read_text())):
                if chunk.strip():
                    programs.append((f"{f}#{i}", chunk.strip("\n")))
    else:
        seen, programs = set(), []
        for w, code, _ in VS.collect():
            if code in seen or SKIP_RE.search(code):
                continue
            seen.add(code)
            programs.append((w, code))
    problems, unsupported = compare(swiftc, programs)
    for p in problems:
        print("✖", p)
    for u in unsupported:
        print("  (not supported by TypeMonkey)", u)
    print(f"Swift (real): {len(programs)} programs compared with {swiftc}. {len(problems)} mismatch(es), {len(unsupported)} unsupported")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
