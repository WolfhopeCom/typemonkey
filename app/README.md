# TypeMonkey native app (iOS + Android)

This folder wraps the web app (`../index.html`, built by `../build.py`) in [Capacitor](https://capacitorjs.com) so it can ship on the App Store and Google Play. The app runs entirely from files inside the app bundle: no server, no accounts. Progress stays in the WebView's `localStorage`, as on the web.

```
app/
  package.json            Capacitor 7 (core, cli, ios, android, splash-screen, status-bar, assets)
  capacitor.config.json   app id, name, colours, splash and status bar settings
  build_app.py            builds ../index.html, copies it to www/, applies native settings, runs `npx cap sync`
  scripts/native_icons.py writes icons and splash screens into ios/ and android/ with Pillow (fallback for @capacitor/assets)
  scripts/render_resources.js  re-renders resources/*.png from the app's own monkey() drawing (Playwright)
  resources/              icon.png 1024 (no transparency), icon-only.png (same, for @capacitor/assets),
                          icon-foreground.png + icon-background.png (Android adaptive icon),
                          splash.png / splash-dark.png 2732
  www/                    generated, not committed
  ios/ android/           native projects, created once by `python3 build_app.py --setup`, then committed
```

## Before the first build: confirm the app ID

`capacitor.config.json` uses **`com.wolfhope.typemonkey`**. Change it now if you want a different one. The ID becomes the iOS Bundle ID and the Android package name. After the first upload to App Store Connect or Google Play it can never change.

## What you need

- **Node.js 20 or newer** (Capacitor 7 requirement) and Python 3.
- **iOS:** a Mac with **Xcode 16+**. Swift Package Manager is used, so CocoaPods is not needed. To run on your own iPhone you need an Apple ID; a paid Apple Developer account ($99/yr) is needed for TestFlight and the App Store.
- **Android:** **Android Studio** (Ladybug or newer, includes the JDK and SDK). Google Play developer account ($25 once).
- Pillow (`pip3 install pillow`) only if `@capacitor/assets` cannot run on your machine.

## First-time setup (once, on your Mac)

```bash
cd app
npm install
python3 build_app.py --setup       # builds the web app, runs `npx cap add ios` + `npx cap add android`,
                                   # applies the native settings below, makes all icon/splash sizes, `npx cap sync`
git add .                          # ios/, android/, package-lock.json (node_modules and www are ignored)
git commit -m "Add native iOS and Android projects"
```

`--setup` only adds a platform whose folder is missing, so it is safe to run again.

## Every time the web app changes

```bash
cd app
python3 build_app.py               # = python3 ../build.py, copy index.html to www/, npx cap sync
npx cap open ios                   # opens Xcode
npx cap open android               # opens Android Studio
```

Shortcuts: `npm run ios` / `npm run android` build and open in one go.

### Run on an iPhone or iPad

1. `npx cap open ios`, then in Xcode select the **App** target, **Signing & Capabilities**, and pick your **Team**.
2. Plug in the phone (first time: on the phone, Settings, Privacy & Security, **Developer Mode** on).
3. Pick the phone in the device menu at the top and press **Run**.
4. Release: **Product → Archive**, then **Distribute App** to App Store Connect / TestFlight.

### Run on an Android phone

1. `npx cap open android`, wait for the Gradle sync to finish.
2. On the phone: Settings, About phone, tap Build number 7 times, then Developer options, **USB debugging** on. Plug it in.
3. Pick the phone and press **Run**.
4. Release: **Build → Generate Signed App Bundle** (`.aab`), upload to Play Console. Keep the upload keystore safe and out of git (`*.jks` is ignored).

## Version numbers

Bump before every store upload. One command updates iOS, Android and package.json:

```bash
python3 build_app.py --set-version 1.1.0            # build number goes up by one
python3 build_app.py --set-version 1.1.0 --build 12 # or set it yourself
```

- iOS: `MARKETING_VERSION` (shown in the store) and `CURRENT_PROJECT_VERSION` (must rise with every upload) in `ios/App/App.xcodeproj`. Same as the **Version** and **Build** fields in Xcode, General tab.
- Android: `versionName` and `versionCode` (must rise with every upload) in `android/app/build.gradle`.

## App icon and splash screen

The icon is TypeMonkey's happy monkey (drawn by `monkey("happy")` in the app) on a cream disc over orange `#FF7A1A`. The splash screen is the monkey on the app's light background `#F2F5F1` (dark: `#111B17`).

- `python3 build_app.py --icons` regenerates every size: it runs `npm run assets` (`@capacitor/assets`) and falls back to `scripts/native_icons.py` (Pillow) if that fails.
- To change the artwork, edit `resources/*.png` or re-render them: `npm i -D playwright && npx playwright install chromium && python3 build_app.py --no-sync && node scripts/render_resources.js`.

## Settings already chosen

| Setting | Value | Why |
|---|---|---|
| `webDir` | `www` | `build_app.py` copies the single-file build there |
| `server.iosScheme` / `androidScheme` / `hostname` | `capacitor` / `https` / `localhost` | Pinned on purpose. `localStorage` belongs to this origin; changing any of them in a later update would make every player lose their progress. |
| Web debugging | Capacitor default | Safari / Chrome inspector work in **debug** builds only, never in release builds. Do not set `webContentsDebuggingEnabled: true`. |
| Background colour | `#F2F5F1` | Matches the app, so no white flash on launch |
| Splash | 0.6 s, fades out, no spinner | |
| Status bar | `DEFAULT` style, not overlaying on Android | Dark text on the light theme, follows dark mode on iOS. The page already pads for `env(safe-area-inset-*)`. |
| iOS Info.plist | Display name TypeMonkey; portrait + landscape on iPhone, all four on iPad; `ITSAppUsesNonExemptEncryption = NO` | Set by `build_app.py` every build (skips the export-compliance question on upload) |
| Android permissions | `INTERNET` only (Capacitor's default) | The app runs from local assets and its fonts are bundled, so it makes no network requests. Keeping INTERNET is harmless (no runtime prompt, allowed for Kids/Families apps). `build_app.py` warns if any other permission appears. |

Web Audio and `localStorage` work in both WebViews (WKWebView on iOS, Android System WebView). Sounds start on a tap, as the app already does.

### Things to check on a real device

- **iPhone silent switch** mutes Web Audio in the app. That is normal iOS behaviour.
- **Backup file** (Settings, Back up my progress, save as a file) uses a browser download, which WebViews do not support. The **backup code** (copy and paste) works. Loading a backup file works. To save files natively later, add `@capacitor/filesystem` + `@capacitor/share`.
- Rotating, the keyboard over the code editor, and the safe areas around the notch / Android gesture bar.

## Detecting the native app (for the purchase work)

Capacitor injects `window.Capacitor` before the page runs, so `src/app.html` can check it without any import and the web build keeps working unchanged:

```js
const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const platform = window.Capacitor ? window.Capacitor.getPlatform() : "web";   // "ios" | "android" | "web"
// Plugins installed in app/ are reachable as window.Capacitor.Plugins.<Name> after `npx cap sync`.
```

The purchase entry point is `unlockFull()` in `src/app.html`: it already runs `grownUpGate()` and then sets `S.pro = true` (demo). In the native app, replace the demo line with the store purchase when `isNative`, and keep the demo (or hide the button) on the web.

## Next step: the $4.99 "unlock everything" purchase

**Store setup**
- [ ] App Store Connect: sign the **Paid Apps agreement** and add tax/bank details. Create an In-App Purchase of type **Non-Consumable**, e.g. product ID `com.wolfhope.typemonkey.unlock`, price $4.99, with a review screenshot.
- [ ] Play Console: set up a **payments profile**, then **Monetize → In-app products → Create product** (a one-time, non-consumable product) with the **same product ID**, $4.99. Play only lets you create products after you upload one build that includes the billing library.
- [ ] Add StoreKit testing (a `.storekit` file in Xcode) and Play **license testers** so you can buy without being charged.

**Plugin (no outside server needed)**
- Recommended: **`@capgo/native-purchases`** (Capacitor plugin, StoreKit 2 + Google Play Billing; purchase, restore and owned-products query all on the device), or **`cordova-plugin-purchase`** (CdvPurchase, works in Capacitor, mature, receipt validation is optional).
- Avoid RevenueCat or other hosted billing services: they are an outside service, and the app promises none.
- Install in `app/` (`npm install <plugin> && npx cap sync`), never in `src/`. Check the plugin's current release supports Capacitor 7 before installing.

**App behaviour**
- [ ] Grown-up gate first: the existing `grownUpGate()` must run before the purchase sheet opens (it already wraps `unlockFull()`).
- [ ] **Restore Purchases** button (Apple requires it for non-consumables): Settings and the paywall, also behind the grown-up gate.
- [ ] On every launch, ask the store which products the user owns and set `S.pro` from that, so a refund or a new phone ends up correct. Keep the saved `S.pro` as the offline fallback.
- [ ] Android: **acknowledge** each purchase within 3 days or Google refunds it automatically (the plugins expose `finish()` / `acknowledge`).
- [ ] Handle cancelled, pending (Android "pay later") and failed purchases with a friendly message, and no unlock.
- [ ] The backup code must not unlock a purchase on another device: purchases restore through the store, not through the code.

**Kids Category (Apple) / Families policy (Google)**
- [ ] No third-party analytics, advertising or tracking SDKs at all. (The app has none; keep plugins to Capacitor's own and the purchase plugin.)
- [ ] Parental gate before any purchase **and** before any link that leaves the app (web pages, mail, store review links).
- [ ] Privacy policy URL in both stores (draft text lives in `src/legal.js`). App Privacy label: **Data Not Collected**. Play **Data safety**: no data collected or shared.
- [x] Fonts are bundled; the app makes no network requests.
- [ ] Apple age rating questionnaire, Kids Category with age band 9–11 (or 6–8) only if you choose the Kids Category. Play **Target audience and content**: include the under-13 ages, which puts the app under the Families policy.
