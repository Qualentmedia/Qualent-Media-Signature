# JK Job Alerts — Android App

A modern Android app for **[jkjobalerts.com](https://jkjobalerts.com)**. It wraps the
live website in a fast, native shell and adds **push notifications for new job posts**
via Firebase Cloud Messaging.

- **Language:** Kotlin
- **Min Android:** 7.0 (API 24) &nbsp;•&nbsp; **Target/Compile:** Android 15 (API 35)
- **Package / applicationId:** `com.jkjobalerts.app`
- **App name:** JK Job Alerts

## What's included

| Feature | Detail |
| --- | --- |
| Native WebView shell | Loads `https://jkjobalerts.com/`, JavaScript + DOM storage + cookies enabled |
| Splash screen | Branded splash using AndroidX Core SplashScreen |
| Pull-to-refresh | Swipe down to reload the page |
| Progress bar | Thin top loading bar tied to page progress |
| Offline screen | Friendly "You're offline" page with a **Try again** button |
| Smart links | `jkjobalerts.com` stays in-app; `tel:`, `mailto:`, WhatsApp, other sites open in their app/browser |
| Downloads | PDFs/notifications etc. download via the Android Download Manager |
| File uploads | Web forms with `<input type="file">` can pick a file |
| Back navigation | Hardware/gesture back walks WebView history, then "press again to exit" |
| Dark mode | Follows the system light/dark setting |
| App Links | Tapping a `jkjobalerts.com` link can open the app directly |
| Push notifications | Firebase Cloud Messaging, broadcast to all devices via the `new_jobs` topic |
| Adaptive icon | Vector adaptive icon + monochrome (themed icons) + legacy PNGs (all densities) |

## Build & run

You need **Android Studio** (Ladybug / 2024.2 or newer).

1. Open the `android/` folder in Android Studio (**File → Open**).
2. Let Gradle sync. It downloads the Android SDK components it needs (API 35).
3. Press **Run ▶** to install on a device/emulator, or build an APK from
   **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

From the command line (with the Android SDK installed and `local.properties`
pointing at it):

```bash
cd android
./gradlew assembleDebug        # debug APK -> app/build/outputs/apk/debug/
./gradlew assembleRelease      # release APK (see "Signing" below)
./gradlew bundleRelease        # Play Store .aab
```

> The app builds and runs immediately with the bundled **placeholder**
> `app/google-services.json`. Push notifications only start working once you
> replace it with your own Firebase file (next section).

## Enable push notifications (Firebase)

The app is fully wired for FCM; you just add your own free Firebase project.

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project**.
2. **Add app → Android**. Use the package name **`com.jkjobalerts.app`** exactly.
3. Download the generated **`google-services.json`** and drop it into `android/app/`,
   replacing the placeholder file.
4. Rebuild. On first launch each device auto-subscribes to the **`new_jobs`** topic.

### Sending a "new job" alert

**Option A — Firebase console (no code):** Firebase → **Messaging → New campaign →
Notification**. Compose the title/body, and under *Target* choose **Topic → `new_jobs`**.
Every installed device gets the notification.

**Option B — from your website/backend (automatic):** call the FCM HTTP v1 API when
you publish a job. Send to the topic and include a `url` so tapping opens that job:

```json
{
  "message": {
    "topic": "new_jobs",
    "notification": { "title": "New Job Posted", "body": "Check the latest opening" },
    "data": { "url": "https://jkjobalerts.com/the-new-job-page" }
  }
}
```

Supported `data` keys: `title`, `body`, and `url` (or `link`) for the tap target.

## Signing a release (for the Play Store)

1. Create a keystore (once):

   ```bash
   keytool -genkey -v -keystore jkjobalerts-release.jks \
     -keyalg RSA -keysize 2048 -validity 10000 -alias jkjobalerts
   ```

2. Create `android/keystore.properties` (git-ignored — never commit it):

   ```properties
   storeFile=/absolute/path/to/jkjobalerts-release.jks
   storePassword=YOUR_STORE_PASSWORD
   keyAlias=jkjobalerts
   keyPassword=YOUR_KEY_PASSWORD
   ```

3. `./gradlew bundleRelease` → upload the `.aab` from
   `app/build/outputs/bundle/release/` to Google Play.

Without `keystore.properties`, release builds fall back to the debug signing key so
`assembleRelease` still succeeds for local testing.

## Changing the website or app version

- **Website URL / host:** `app/build.gradle.kts` → `SITE_URL` / `SITE_HOST`.
- **Version:** `app/build.gradle.kts` → `versionCode` (integer, bump every release)
  and `versionName` (e.g. `"1.0.1"`).
- **App icon:** replace `playstore-icon-512.png` and the `mipmap-*` PNGs, or edit the
  vector drawables `ic_launcher_foreground.xml` / `ic_launcher_background.xml`.

## Project layout

```
android/
├── app/
│   ├── build.gradle.kts            # module config, SDK levels, dependencies
│   ├── google-services.json        # PLACEHOLDER — replace with your Firebase file
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/jkjobalerts/app/
│       │   ├── JkApp.kt             # notification channel + topic subscription
│       │   ├── MainActivity.kt      # WebView shell + all UX
│       │   └── JkMessagingService.kt# FCM push handling
│       └── res/                     # layouts, themes, colours, icons, strings
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/libs.versions.toml       # dependency versions
└── gradlew / gradlew.bat           # Gradle wrapper (8.14.3)
```
