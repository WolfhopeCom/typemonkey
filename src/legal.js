/* TypeMonkey legal text. Have a lawyer or a reputable template service review it when you can. Used by the in-app Terms/Privacy screens and by build.py
   to generate terms.html and privacy.html (the app stores require a public privacy policy URL). */
const LEGAL_INFO={
  owner:"Wolfhope",                     // the person or company that publishes the app
  email:"",                             // optional public support email; leave "" to point people to the support page
  support:"https://wolfhopecom.github.io/typemonkey/support.html",
  law:"the State of Ohio, United States", // governing law
  updated:"October 7, 2026",
  price:"$4.99"
};

const LEGAL_CONTACT=()=>LEGAL_INFO.email?`email us at <b>${LEGAL_INFO.email}</b> or visit <a href="${LEGAL_INFO.support}">${LEGAL_INFO.support}</a>`:`visit our support page at <a href="${LEGAL_INFO.support}">${LEGAL_INFO.support}</a>`;
const LEGAL={
terms:{title:"Terms of Service",sections:[
 ["The short version",`<p>TypeMonkey is a learning app. Use it to learn and have fun. The lessons and TypeMonkey himself belong to us. We work hard to keep the app bug-free, but it's provided "as is," and we can't be responsible for problems that come from using it or the code you learn in it.</p>`],
 ["Agreeing to these terms",`<p>These Terms of Service ("Terms") are an agreement between you and ${LEGAL_INFO.owner} ("we," "us"). By downloading or using TypeMonkey (the "App"), you agree to these Terms. If you don't agree, please don't use the App.</p>`],
 ["Who can use TypeMonkey",`<p>You may use the App on your own if you are 13 or older. Children under 13 may use the App, including the TypeMonkey Jr. section, with the permission and supervision of a parent or guardian, who agrees to these Terms on the child's behalf.</p>`],
 ["Your license",`<p>We give you a personal, non-exclusive, non-transferable license to use the App on devices you own or control, for your own learning. You may not copy, sell, rent, redistribute or publish the App's lessons, quizzes, artwork or other content, or reverse-engineer the App, except where the law specifically allows it.</p>`],
 ["What we own and what you own",`<p>The App, its lessons, exercises, games, the TypeMonkey name and character, and all related artwork are owned by ${LEGAL_INFO.owner} and protected by copyright and trademark laws.</p><p>Code you write yourself in the App, such as in the Playground, is yours.</p>`],
 ["Purchases",`<p>Some content requires a one-time in-app purchase (currently ${LEGAL_INFO.price}). Purchases are processed by Apple's App Store or Google Play, and their terms govern payment, billing and refunds. To request a refund, contact the store you bought from. You can restore a purchase on another device signed in to the same store account. Prices and the content included may change over time, but changes won't take away content you already bought.</p>`],
 ["Learning, not professional advice",`<p>TypeMonkey teaches programming concepts with simplified examples. Lessons are for education only and are not professional, security or engineering advice. Before using any code in a real product, test it carefully and review it for your situation.</p>`],
 ["No warranty",`<p>The App is provided "as is" and "as available," without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. We don't promise that the App will be error-free, uninterrupted, or that lessons are free of mistakes.</p>`],
 ["Limitation of liability",`<p>To the fullest extent the law allows, ${LEGAL_INFO.owner} will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits, or progress, arising from your use of (or inability to use) the App, including bugs or errors in the App or in code examples, or from any code you write or use based on what you learned.</p><p>Our total liability for any claim related to the App is limited to the amount you paid us for the App in the 12 months before the claim. Some places don't allow these limits, so they may not fully apply to you.</p>`],
 ["Your progress",`<p>Your progress is stored only on your device. Deleting the App, clearing its data, or using Reset progress erases it, and we can't recover it.</p>`],
 ["Changes",`<p>We may update the App and these Terms. If we make important changes, we'll update the date at the top and, where appropriate, let you know in the App. Continuing to use the App after changes means you accept the updated Terms.</p>`],
 ["App Store and Google Play",`<p>These Terms are between you and ${LEGAL_INFO.owner}, not Apple or Google. Apple and Google are not responsible for the App, its content, maintenance, support or any claims about it. If the App fails to meet any warranty that can't be disclaimed, you may notify the store, which may refund the purchase price; beyond that, the store has no warranty obligation. Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.</p>`],
 ["Governing law",`<p>These Terms are governed by the laws of ${LEGAL_INFO.law}, without regard to conflict-of-law rules.</p>`],
 ["Contact",`<p>Questions about these Terms? Please ${LEGAL_CONTACT()}.</p>`]
]},
privacy:{title:"Privacy Policy",sections:[
 ["The short version",`<p><b>TypeMonkey doesn't collect any personal information.</b> There are no accounts, no ads, no analytics and no tracking. Your progress stays on your device.</p>`],
 ["What stays on your device",`<p>To remember where you are, the App saves your lesson progress, XP, bananas, streak, settings and any code you type into the Playground or challenges. This is stored only in the App's storage on your device. It is never sent to us or anyone else.</p><p>You can erase it anytime with <b>Reset progress</b> at the bottom of the home screen, or by deleting the App.</p>`],
 ["What we don't collect",`<p>We don't collect your name, email, location, contacts, photos, device identifiers or usage data. The App doesn't include advertising, analytics or tracking software from other companies, and it works without an internet connection.</p>`],
 ["Purchases",`<p>In-app purchases are handled entirely by Apple's App Store or Google Play. They process your payment under their own privacy policies. We only learn that a purchase was made so the App can unlock content; we never see your payment details.</p>`],
 ["Children",`<p>TypeMonkey Jr. is designed for children ages 7 to 12. Because the App doesn't collect personal information from anyone, it doesn't collect personal information from children. Purchases are behind a grown-up check, and the App doesn't open outside websites.</p><p>Parents or guardians with questions can contact us at <b>${LEGAL_INFO.email}</b>.</p>`],
 ["Changes",`<p>If this policy changes, we'll update the date at the top. If we ever start collecting any information, we'll update this policy first and ask for your permission where the law requires it.</p>`],
 ["Contact",`<p>Questions about privacy? Please ${LEGAL_CONTACT()}.</p>`]
]}
};
