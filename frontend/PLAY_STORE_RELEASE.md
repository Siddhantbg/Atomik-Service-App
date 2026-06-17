# ATOMIK Audio — Google Play Release (EAS Build)

## App identity

| Field | Value |
|-------|--------|
| App name | ATOMIK Audio |
| Package | `com.atomikaudio.service` |
| Version name | `1.0.0` |
| Version code | Managed by EAS (`autoIncrement: true`) |

---

## Prerequisites

1. [Expo account](https://expo.dev/signup)
2. [Google Play Console](https://play.google.com/console) developer account ($25 one-time)
3. Production HTTPS API deployed (not `localhost` / LAN IP)
4. Razorpay **live** public key for production checkout
5. Google Maps API key restricted to Android app `com.atomikaudio.service`

---

## Commands

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS (first time only)

```bash
cd frontend
eas init
eas build:configure
```

`eas init` links the project and writes `extra.eas.projectId` into `app.config.js`.

### 4. Set production environment variables

**Recommended (secrets, not in git):**

```bash
cd frontend
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.yourdomain.com/api"
eas secret:create --scope project --name EXPO_PUBLIC_RAZORPAY_KEY_ID --value "rzp_live_xxxx"
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_MAPS_KEY --value "your_maps_key"
```

Then remove duplicate keys from `eas.json` → `build.production.env` or leave placeholders only.

### 5. Build production Android App Bundle (.aab)

```bash
cd frontend
eas build --platform android --profile production
```

### 6. (Optional) Submit to Play Console via CLI

```bash
eas submit --platform android --profile production
```

Requires `frontend/google-service-account.json` (Play Console → API access → service account).

---

## Where is the .aab file?

| Source | Location |
|--------|----------|
| **EAS cloud build** | Download from the build URL printed in terminal, or [expo.dev](https://expo.dev) → Projects → **atomik-audio** → Builds → download **.aab** |
| **Local path** | Not saved locally by default — EAS builds in the cloud |

After a successful build, the CLI shows:

```
✔ Build finished
🤖 Android app:
https://expo.dev/artifacts/eas/xxxxxxxx.aab
```

---

## Play Console upload checklist

- [ ] Create app in Play Console with package `com.atomikaudio.service`
- [ ] Upload `.aab` to **Release → Production** (or Internal testing first)
- [ ] **Store listing**: short + full description, feature graphic (1024×500), screenshots
- [ ] **App icon**: 512×512 (use `assets/icon.png`)
- [ ] **Privacy policy URL** (required — host your `PrivacyPolicy` content)
- [ ] **Data safety** form (location, photos, payments, account data)
- [ ] **Content rating** questionnaire
- [ ] **Target audience** and ads declaration
- [ ] **Signing**: EAS manages upload key; enable Play App Signing on first upload

---

## Blocking issues before submission

| Issue | Action |
|-------|--------|
| `EXPO_PUBLIC_API_URL` points to localhost/LAN | Set production HTTPS URL in EAS secrets |
| `EXPO_PUBLIC_DEMO_PASSWORD` in production env | **Remove** — demo login is `__DEV__` only |
| Razorpay test key in production | Use `rzp_live_*` public key |
| No `eas init` / missing `projectId` | Run `eas init` |
| Backend not on HTTPS | Deploy API with valid TLS certificate |
| Privacy policy URL missing in Play Console | Publish a web page and add URL |

---

## Verify config locally

```bash
cd frontend
npx expo config --type public
npx expo-doctor
```
