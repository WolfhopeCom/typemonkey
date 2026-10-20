# TypeMonkey: App Store submission kit

Everything to copy into App Store Connect, plus the exact steps. Screenshots are in `app/store/screenshots/`:
`iphone-6.3/` (1206 × 2622, the iPhone size App Store Connect asks for), the 6.9" set (1290 × 2796) in the folder itself, and `ipad/` (2048 × 2732). Remake them any time with
`python3 tools/store_shots.py`.

---

## 1. Before you start (one time)

- **Website live:** Merge pull request #1 on GitHub, then in the repo go to **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, folder **/docs**, **Save**. After a minute these work:
  - Support URL: https://wolfhopecom.github.io/typemonkey/support.html
  - Privacy Policy URL: https://wolfhopecom.github.io/typemonkey/privacy.html
  - Marketing URL (optional): https://wolfhopecom.github.io/typemonkey/
- **Agreements:** App Store Connect → **Business**: the **Paid Apps** agreement must be active, with bank and tax info filled in. In-app purchases don't work without it, even if your other app is free.
- **Recommended:** make a support email, for example typemonkey.help@gmail.com. Put it in `src/legal.js` (`email:"..."`), then run `python3 tools/site.py` and `python3 app/build_app.py`.

## 2. Create the app in App Store Connect

**Apps → + → New App**
- Platform: **iOS**
- Name: **TypeMonkey: Learn To Code** (the home-screen icon still says TypeMonkey)
- Primary language: English (U.S.)
- Bundle ID: **com.wolfhope.typemonkey**. If it's not in the list, register it first: developer.apple.com → Certificates, IDs & Profiles → Identifiers → +, App ID, with **In-App Purchase** checked.
- SKU: **typemonkey-ios**
- User access: Full access

## 3. The in-app purchase

**App → Monetization → In-App Purchases → +**
- Type: **Non-Consumable**
- Reference name: Full version unlock
- Product ID: **typemonkey_full_unlock**. It must be exactly this; the app looks for this ID.
- Price: **$4.99** (USD price; Apple fills in other countries)
- Display name: **Unlock everything**
- Description: **Every lesson in every course, all projects and future updates.**
- Review screenshot: a screenshot of the "Unlock · $4.99" button (Home screen, bottom).
- Review notes: The full version unlocks every course. Buy it from Settings → Unlock, or from any "Unlock" button. A grown-up check (a multiplication question) comes first. Restore is in Settings.

> **Store-text rule (Guideline 2.3.8):** TypeMonkey is not in the Kids category, so the name, subtitle, keywords, description, screenshots and icon must not say or imply "for kids", "for children" or an age range like "ages 7–12". Say "beginners", "all ages", "families" or "no typing" instead. (In-app text and the privacy policy can still describe Jr.)

## 4. App information

- **Subtitle (30 max):** Python, JavaScript & more (or: Coding for beginners)
- **Category:** Primary **Education**, Secondary **Developer Tools**
- **Content rights:** Does not contain third-party content (Brython and the fonts are open-source and credited in Settings).
- **Age rating questionnaire:** answer **None / No** to everything (no violence, no mature themes, no gambling, no unrestricted web access, no user-generated content shared with others, no chat). Result: **4+**.
- **Kids category:** leave **unchecked**.

## 5. App Privacy ("nutrition label")

- **Data collection:** choose **"No, we do not collect data from this app."**
- Privacy Policy URL: https://wolfhopecom.github.io/typemonkey/privacy.html

## 6. Version page (1.0)

**Promotional text (170 max):**
> Learn to code with a monkey buddy! Bite-size lessons, tap-to-build code, real projects and no-typing puzzles. No ads, no accounts, works offline.

**Description:**
> TypeMonkey makes learning to code fun, friendly and bite-size, for all ages.
>
> Learn real programming with a cheerful monkey buddy who helps you every step of the way. Short lessons explain one idea at a time, then you try it: tap tiles to build real code, run it, and see what happens. No heavy typing needed on your phone, but you can type whenever you like.
>
> LEARN 9 LANGUAGES
> • JavaScript and Build a Game
> • Python
> • HTML & CSS
> • SQL
> • C#, C++, Java and Swift
>
> BUILD REAL THINGS
> • Build Projects: make a number guessing game, a quiz show, rock paper scissors, a pet monkey simulator, a to-do app and a text adventure, one mission at a time
> • Bug Lab: fix broken code with hints that come one at a time
> • Playground: write and run anything you want
>
> TYPEMONKEY JR.: CODING PUZZLES, NO TYPING
> • Guide TypeMonkey through mazes with blocks: no typing, no reading walls of text
> • Dance parties that teach loops, sorting machines that teach if/else, banana boxes that teach variables
> • See your blocks turned into real code after every win
>
> MADE TO KEEP YOU GOING
> • A fresh daily challenge every day, sized to where you are
> • Review brings back what you missed, right when you're about to forget it
> • Earn bananas and dress up TypeMonkey; collect badges
> • Help is always one tap away: a clue, then the plan, then the answer
>
> SAFE AND PRIVATE
> • No ads. No accounts. No tracking. No chat.
> • Everything, even running your code, works offline on your device
> • Purchases are behind a grown-up check
>
> Unit 1 of every course is free. One purchase unlocks everything, forever. No subscription.

**Keywords (100 max):**
> coding,programming,python,javascript,swift,html,sql,java,c++,beginner,learn,games,lessons,family

**Support URL:** https://wolfhopecom.github.io/typemonkey/support.html
**Marketing URL:** https://wolfhopecom.github.io/typemonkey/
**Copyright:** 2026 Wolfhope
**Screenshots:** drag in the 6 files from `app/store/screenshots/` (6.9" display), in order 01 → 06.
**In-App Purchases and Subscriptions:** click **+** and add **Unlock everything**. Do this before your first submission, or the purchase won't be reviewed with the app.

**App Review information**
- Sign-in required: **No**
- Notes:
> TypeMonkey needs no account and works fully offline. Unit 1 of each course is free. To review the in-app purchase, tap "Unlock" (Home screen bottom, or Settings → Unlock). A grown-up check asks a multiplication question first; tap the correct answer. "Restore" is in Settings. TypeMonkey Jr. (ages 7–12) is a section of the app; the app is not in the Kids category.

**Export compliance:** the app uses no encryption beyond Apple's. It's already set in Info.plist (`ITSAppUsesNonExemptEncryption = NO`), so Xcode won't ask.

## 7. Build and upload (on your Mac)

```
cd ~/Downloads/TypeMonkey/app
npm install
python3 build_app.py
npx cap open ios
```
`npm install` adds the purchase plugin, and `build_app.py` puts it in the iPhone project.

In Xcode:
1. **TARGETS → App → Signing & Capabilities**:
   - Team: your **paid** developer team (the one you used for All Sports Scoreboard).
   - Bundle Identifier: `com.wolfhope.typemonkey`.
   - Click **+ Capability** and add **In-App Purchase**.
2. **General** tab: Version **1.0**, Build **1**. Raise the Build number by 1 for every new upload.
3. At the top, choose **Any iOS Device (arm64)** instead of your phone.
4. **Product → Archive**. When the Organizer opens: **Distribute App → App Store Connect → Upload**, and keep the defaults.
5. After about 15 minutes the build appears in App Store Connect → **TestFlight**.

## 8. Test the purchase before submitting (free)

1. App Store Connect → **Users and Access → Sandbox → Test Accounts → +**. Make a test Apple ID; it can be any email you own.
2. On your iPhone: **Settings → App Store → Sandbox Account** and sign in with that test account.
3. Install the build from **TestFlight**. Tap **Unlock**: the price shows from Apple, and buying costs nothing in sandbox.
4. Delete and reinstall, then tap **Settings → Restore**. It should unlock again.

## 9. Submit

On the 1.0 version page, under **Build**, click **+** and pick the uploaded build, then **Add for Review → Submit**.
Review usually takes 1–3 days.

---

## Version 1.1 (the next update)

Submit this only after 1.0 is approved and live.

**On your Mac:**
```
cd ~/Downloads/TypeMonkey/app
npm install
python3 build_app.py --set-version 1.1 --build 2
python3 build_app.py
npx cap open ios
```
`npm install` adds the new vibration, reminder and iCloud plugins. In Xcode check **General → Version 1.1, Build 2**, and under **Signing & Capabilities** add **iCloud** (tick **Key-value storage**) and keep **In-App Purchase**. Then **Product → Archive → Distribute App → Upload**.

**App Store Connect:** on the app page, click **+** next to iOS App and type **1.1**. Pick the new build, paste the text below into **What's New in This Version**, and drag in the new screenshots from `iphone-6.3/` and `ipad/` (the 6th one is now the Profile). Then **Add for Review → Submit**.

**What's New in This Version:**
> The biggest TypeMonkey update yet!
>
> • Level up: TypeMonkey now grows with you through 30 levels, with rare outfits you can only get by levelling up
> • Your new Profile: stats, best streak and a chart of your week. Tap the monkey at the top to see it
> • A quick hello when you first open the app, then right to Home
> • Never coded before? A pointing hand shows you exactly what to tap, and you can tap any coding word to see what it means in plain English
> • Friendlier first lessons for JavaScript and Python
> • Daily goals: pick 10, 20, 30 or 50 XP a day and fill your ring
> • A brand-new lesson map with unit banners and treasure chests to open
> • Combos, streak milestones and "Perfect lesson" bonuses
> • Gentle vibration on answers (turn it off in Settings)
> • Daily reminders, if you want them
> • Progress syncs with iCloud across your iPhone and iPad
> • New for TypeMonkey Jr.: Unit 7, "Creator", with 5 new lessons
> • Bug Lab: two new levels, Sneaky Bugs and Boss Bugs
> • Fresh daily challenge puzzles, smoother animations and lots of small fixes

**Promotional text (optional update):**
> New: level up your monkey, open treasure chests, set a daily goal and track your week. Plus new Jr. lessons and Boss Bugs!

**Privacy:** still **Data Not Collected**. iCloud sync stores progress in the user's own iCloud account, which Apple does not count as you collecting data.

### After launch: updating the app
1. Make changes.
2. Run `python3 app/build_app.py`.
3. In Xcode, raise the **Build** number (or the Version for bigger releases), then Archive → Upload.
4. In App Store Connect, add a new version (for example 1.0.1), pick the build, and submit.
