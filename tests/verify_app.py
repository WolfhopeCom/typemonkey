#!/usr/bin/env python3
"""App behaviour checks (browser): streak dates, Output Rush timer, backup vs purchase, rating prompt rules, a11y.

- streaks: "yesterday" is a calendar day (also on daylight-saving days); stale streaks show 0
- Output Rush: leaving through the top bar stops the clock (no results screen popping up later);
  the clock pauses while the app is in the background; a new personal best is shown
- backup restore and "Erase everything" never unlock or remove the purchase
- rating prompt: only in the native app, only after 5+ lessons and 3+ days, never for Jr., at most 3 asks, 120 days apart
- toasts are announced to screen readers; dialogs are modal
- no horizontal overflow on the main screens at 320 px (iPhone SE) and iPad widths
Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 tests/verify_app.py
"""
import asyncio, pathlib, sys
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
bad = []


def check(ok, msg):
    if not ok:
        bad.append(msg)


async def fresh(pg):
    await pg.evaluate("localStorage.clear()")
    await pg.reload()
    await pg.wait_for_timeout(500)


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 390, "height": 844})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto((ROOT / "index.html").as_uri())
        await pg.wait_for_timeout(800)

        # ---- streak dates
        r = await pg.evaluate("""() => [
          yesterdayStr(new Date(2026, 2, 9, 0, 30)),   // the day after US spring-forward
          yesterdayStr(new Date(2026, 10, 2, 23, 30)),  // the day after US fall-back
          yesterdayStr(new Date(2026, 0, 1, 0, 5)),     // new year
          yesterdayStr(new Date(2024, 2, 1, 9, 0)),     // leap year
        ]""")
        check(r == ["2026-3-8", "2026-11-1", "2025-12-31", "2024-2-29"], f"yesterdayStr wrong: {r}")
        r = await pg.evaluate("""() => {
          S.streak = 9; S.lastDay = "2020-1-1"; S.daily = {last: "2020-1-1", streak: 4, best: 4}; expireStreaks();
          const a = [S.streak, S.daily.streak, S.daily.best];
          S.streak = 5; S.lastDay = yesterdayStr(); S.daily = {last: yesterdayStr(), streak: 2, best: 2}; expireStreaks();
          a.push(S.streak, S.daily.streak);
          bumpStreak(); a.push(S.streak); return a }""")
        check(r == [0, 0, 4, 5, 2, 6], f"streak expiry/bump wrong: {r}")

        # ---- Output Rush: leaving through the top bar stops the clock
        await fresh(pg)
        await pg.evaluate("practice()")
        await pg.click("#homeBtn")
        await pg.evaluate("settingsPage()")
        await pg.wait_for_timeout(2500)
        check(await pg.evaluate("!!document.querySelector('.setpage')"), "Output Rush timer took over the Settings screen")
        check(await pg.evaluate("!document.querySelector('#tleft')"), "Output Rush still on screen after leaving")

        # pauses while hidden
        await pg.evaluate("practice()")
        start = int(await pg.inner_text("#tleft"))
        await pg.evaluate("""() => { Object.defineProperty(document, 'hidden', {configurable: true, get: () => true});
                                     document.dispatchEvent(new Event('visibilitychange')) }""")
        await pg.wait_for_timeout(2300)
        hidden_left = int(await pg.inner_text("#tleft"))
        check(hidden_left == start, f"Output Rush clock ran in the background ({start} -> {hidden_left})")
        await pg.evaluate("""() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')) }""")
        await pg.wait_for_timeout(2300)
        check(int(await pg.inner_text("#tleft")) < start, "Output Rush clock did not resume")
        await pg.click("#quitg")

        # personal best
        r = await pg.evaluate("""async () => {
          S.stats.rushBest = 2; const pool = Array.from({length: 6}, (_, k) => ["console.log(" + k + ")", [String(k), "x", "y"]]);
          rush(pool, 45, () => {}, () => {});
          for (let k = 0; k < 6; k++) { document.querySelector('.opt[data-k="0"]').click(); await new Promise(r => setTimeout(r, 420)) }
          return [S.stats.rushBest, /New personal best/.test(document.querySelector('#screen').textContent)] }""")
        check(r == [6, True], f"personal best not recorded/shown: {r}")

        # ---- backup restore keeps the purchase state of this device
        r = await pg.evaluate("""async () => {
          const out = [];
          S.pro = false; const code = await BK.make({...S, pro: true, done: ["x"]}); backupPage();
          document.querySelector('#bkin').value = code; document.querySelector('#bkcheck').click();
          await new Promise(r => setTimeout(r, 300));
          out.push(/unlocked/i.test(document.querySelector('#bkresult').textContent));
          document.querySelector('#bkyes').click(); out.push(S.pro, S.done.length);
          S.pro = true; const code2 = await BK.make({...S, pro: false}); backupPage();
          document.querySelector('#bkin').value = code2; document.querySelector('#bkcheck').click();
          await new Promise(r => setTimeout(r, 300)); document.querySelector('#bkyes').click(); out.push(S.pro);
          settingsPage(); document.querySelector('#reset').click(); document.querySelector('#yes').click(); out.push(S.pro, S.done.length);
          return out }""")
        check(r == [False, False, 1, True, True, 0], f"backup/reset changed the purchase: {r}")

        # ---- rating prompt rules
        r = await pg.evaluate("""async () => {
          const calls = []; window.Capacitor = {isNativePlatform: () => true, getPlatform: () => "ios",
            Plugins: {InAppReview: {requestReview: () => { calls.push(1); return Promise.resolve() }}}};
          const D = 864e5, now = Date.now(), out = [];
          const setup = (o) => { S = normState({done: Array.from({length: o.done ?? 6}, (_, i) => "l" + i),
            stats: {started: o.started ?? ["js"], firstSeen: now - (o.days ?? 10) * D, reviewAsks: o.asks ?? []}}); cur = o.cur ?? null };
          setup({}); out.push(reviewAllowed());
          setup({done: 4}); out.push(reviewAllowed());
          setup({days: 1}); out.push(reviewAllowed());
          setup({started: ["jr"]}); out.push(reviewAllowed());
          setup({cur: {c: {kids: true}}}); out.push(reviewAllowed());
          setup({asks: [now - 30 * D]}); out.push(reviewAllowed());
          setup({asks: [now - 300 * D]}); out.push(reviewAllowed());
          setup({asks: [1, 2, 3]}); out.push(reviewAllowed());
          setup({}); out.push(askForReview("test"), askForReview("again"));
          await new Promise(r => setTimeout(r, 300)); document.querySelectorAll('.celebrate').forEach(x => x.remove());
          await new Promise(r => setTimeout(r, 1500)); out.push(calls.length, S.stats.reviewAsks.length);
          // a badge pop-up on screen delays the request instead of using it up
          setup({}); const g = document.createElement('div'); g.className = 'celebrate'; document.body.appendChild(g);
          askForReview("blocked"); await new Promise(r => setTimeout(r, 1700)); out.push(calls.length, S.stats.reviewAsks.length);
          g.remove(); await new Promise(r => setTimeout(r, 1600)); out.push(calls.length, S.stats.reviewAsks.length);
          delete window.Capacitor; setup({}); out.push(askForReview("web"));
          return out }""")
        check(r == [True, False, False, False, False, False, True, False, True, False, 1, 1, 1, 0, 2, 1, False], f"rating prompt rules wrong: {r}")

        # ---- accessibility basics
        r = await pg.evaluate("""() => { const t = document.querySelector('#toast');
          grownUpGate(() => {}); const g = document.querySelector('.gate');
          const a = [t.getAttribute('aria-live'), g.getAttribute('aria-modal'), document.activeElement.classList.contains('opt')];
          g.remove(); return a }""")
        check(r == ["polite", "true", True], f"a11y attributes missing: {r}")

        # ---- layout: no sideways scrolling on small phones and iPad
        for w, h in [(320, 568), (820, 1180)]:
            await pg.set_viewport_size({"width": w, "height": h})
            for name in ["home()", "coursePage('js')", "settingsPage()", "backupPage()", "shop()", "badgesPage()", "playground('py')",
                         "startLesson(courseById('js').units[0].lessons[0].id)", "startLesson(courseById('jr').units[0].lessons[0].id)"]:
                await pg.evaluate(name)
                await pg.wait_for_timeout(150)
                ov = await pg.evaluate("document.documentElement.scrollWidth - innerWidth")
                check(ov <= 0, f"{w}px {name}: page scrolls sideways by {ov}px")
        await b.close()
    check(not errs, f"page errors: {errs[:5]}")
    for x in bad:
        print("FAIL", x)
    print(f"App behaviour: {len(bad)} problem(s)")
    sys.exit(1 if bad else 0)

asyncio.run(main())
