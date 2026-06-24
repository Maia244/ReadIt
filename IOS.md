# Publishing **lit** to the App Store

lit is a web app wrapped as a native iOS app with [Capacitor](https://capacitorjs.com).
The native Xcode project lives in `ios/`. Everything below the "On your Mac"
line **must** be done on a Mac — Apple requires Xcode to sign and upload.

## What you need first

1. **Apple Developer Program** membership — $99/year: https://developer.apple.com/programs/
2. **A Mac with Xcode** installed (free from the Mac App Store).
3. About 30–60 minutes the first time.

## App identity (already configured)

- **App name:** lit
- **Bundle ID:** `com.lit.app` — change it in `capacitor.config.json` if you
  own a different domain (use reverse-domain style, e.g. `com.yourname.lit`).
- **App icon:** set from `assets/icon.svg` → `assets/icon.png`.

---

## On your Mac

### 1. Get the project and build the web app
```bash
git clone <this repo> && cd ReadIt
npm install
npm run build          # builds the web app into dist/
npx cap sync ios       # copies the build into the iOS project
```

### 2. (Optional) Regenerate the full app-icon set from the source image
```bash
npm i -D @capacitor/assets
npx capacitor-assets generate --ios   # uses assets/icon.png + assets/splash if present
```

### 3. Open in Xcode
```bash
npx cap open ios
```

### 4. Configure signing (one time)
In Xcode: select the **App** target → **Signing & Capabilities** tab →
- Check **Automatically manage signing**
- Choose your **Team** (your Apple Developer account)
- Confirm the **Bundle Identifier** matches `com.lit.app` (or your custom one)

### 5. Set version & build number
In the **General** tab set **Version** (e.g. `1.0.0`) and **Build** (e.g. `1`).

### 6. Archive and upload
- At the top of Xcode, set the run destination to **Any iOS Device (arm64)**.
- Menu: **Product → Archive**.
- When the Organizer opens: **Distribute App → App Store Connect → Upload**.

### 7. Create the App Store listing
Go to https://appstoreconnect.apple.com → **My Apps → +** → **New App**:
- Platform iOS, name **lit**, your bundle ID, language, SKU (any unique string).
- Fill in: **description, keywords, screenshots** (required sizes: 6.7" and
  6.5" iPhone), **support URL**, **privacy policy URL**, **age rating**.
- Under **App Privacy**, declare data use (see note below).
- Select the build you uploaded in step 6, then **Submit for Review**.

Apple review typically takes 1–3 days.

---

## Things to prepare for the listing

- **Screenshots** — take them in the iOS Simulator (Xcode) on an iPhone 15 Pro
  Max (6.7") and an iPhone 8 Plus (5.5"/6.5") device.
- **Privacy policy URL** — required. lit currently stores your lists **locally
  on the device** and fetches public book data from **openlibrary.org**. It has
  no accounts, no analytics, and no tracking, so a short policy stating that is
  enough. (Host it anywhere, e.g. a GitHub Pages page.)
- **App Privacy questionnaire** — with the current build you can answer "Data
  Not Collected."

## Likely review considerations

- **Guideline 4.2 (minimum functionality):** Apple rejects apps that are just a
  website. lit has real native-feeling features (ranking, lists, search,
  follows), an app icon, and a launch screen, which helps — but make sure it
  runs fully offline-tolerant (it falls back to the built-in catalogue).
- **Future:** for lists/follows to sync across devices you'll eventually want a
  backend + accounts. Not required to ship v1.

## Updating the app later
```bash
npm run build && npx cap sync ios
```
Then bump the **Build** number in Xcode and Archive → Upload again.
