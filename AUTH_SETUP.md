# Enabling accounts (Email + Google + Apple) in lit

The code is fully built. To turn sign-in **on**, you connect a free Firebase
project and do some one-time iOS setup. Until you add the Firebase keys, the
app runs normally with **no login screen** — so nothing breaks in the meantime.

> ⚠️ IMPORTANT: Do **not** rebuild the iOS app on Codemagic until you've added
> the Firebase keys **and** `GoogleService-Info.plist` (steps 1–5). The native
> Firebase plugin needs that file or the app will crash on launch.

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** → name it `lit` → create.

## 2. Add a Web app and paste its config
1. In the project, click the **Web** icon (`</>`) → register an app (any nickname).
2. Copy the `firebaseConfig` values it shows.
3. Paste them into **`src/auth/firebaseConfig.js`**, replacing the `PASTE_…` placeholders.

## 3. Turn on the sign-in methods
Firebase Console → **Build → Authentication → Get started → Sign-in method**, and enable:
- **Email/Password**
- **Google**
- **Apple**

## 4. Add an iOS app to Firebase
1. Firebase Console → **Project settings → Your apps → Add app → iOS**.
2. **Bundle ID:** `com.maiafrank.lit`
3. Download **`GoogleService-Info.plist`** and put it at **`ios/App/App/GoogleService-Info.plist`** (commit it to the repo — it's safe to ship).

## 5. iOS native config for Google + Apple
**Google (URL scheme):**
- Open your `GoogleService-Info.plist`, find `REVERSED_CLIENT_ID`.
- Add it as a URL scheme in `ios/App/App/Info.plist` (I can do this for you once you paste me the value — it looks like `com.googleusercontent.apps.1234-abcd`).

**Sign in with Apple (capability):**
- In Xcode (or via the Apple Developer site), enable the **Sign in with Apple** capability for the App ID `com.maiafrank.lit`:
  - [developer.apple.com → Identifiers](https://developer.apple.com/account/resources/identifiers/list) → `com.maiafrank.lit` → check **Sign In with Apple** → Save.
- In Firebase → Authentication → Apple provider, complete the **Services ID / Team ID / Key** fields (Firebase shows the exact steps).

## 6. Rebuild
Once steps 1–5 are done:
```bash
npm run build && npx cap sync ios
```
Commit, push, and run a new Codemagic build. The app will now require an
account, and Google/Apple/email sign-in will work.

---

## What's already implemented for you
- A gated **login / sign-up screen** (`src/screens/Login.jsx`) with email,
  Google, and Apple — shown automatically once Firebase is configured.
- Per-account data: each user's lists are stored separately.
- **Log out** and **Delete account** (Apple requires in-app deletion) on the
  Profile → Stats tab.
- Platform-aware auth: native Google/Apple on iOS via
  `@capacitor-firebase/authentication`, web popups in the browser.

## App Store note
Because you offer **Google** sign-in, Apple requires **Sign in with Apple** too
(already included). Apps with accounts must also offer account deletion
(already included).

## Want help finishing?
Paste me your `REVERSED_CLIENT_ID` and I'll wire the Info.plist URL scheme, and
I can double-check each step as you go.
