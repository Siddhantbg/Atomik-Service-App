# Google Play — Upload key mismatch fix

## Root cause (resolved)

Play Console registered upload key **SHA1 `6E:F4:E9:10:...`** from the first production build (`com.atomikaudio.app`, build2).

When the package changed to `com.atomikaudio.service`, EAS attached a **new** keystore (**SHA1 `91:F6:FB:36:...`**) to the same credential name. Build3 was signed with that new key → Play rejected it.

**Fix applied:** Re-pointed `com.atomikaudio.service` credentials to the original keystore (`6E:F4:E9:...`) via `frontend/scripts/fix-android-signing.cjs`, then triggered a new production build.

---

## Current build (upload this to Play)

After build **FINISHED**, download the `.aab` and upload to Play Console.

Monitor: https://expo.dev/accounts/atomikaudio/projects/atomik-audio/builds/7f062898-3ad3-4f73-8e57-ff07a5c8775c

Local path (after download): `frontend/releases/atomik-audio-1.0.0-build4-service.aab`

---

## If signing breaks again

Run from `frontend/`:

```bash
node scripts/fix-android-signing.cjs
eas build --platform android --profile production
```

The script assigns the Play-registered keystore (`6E:F4:E9:...`) to `com.atomikaudio.service`.

---

## Fingerprints reference

| Keystore | SHA-1 | Status |
|----------|-------|--------|
| Original (Play expects) | `6E:F4:E9:10:FD:91:87:DC:AD:86:7C:16:1F:E5:E6:82:5A:5B:B6:9E` | Use this |
| New (wrong for Play) | `91:F6:FB:36:BF:55:A8:39:80:DD:30:F3:EC:50:58:F5:BF:F8:9D:10` | Do not upload |

---

## Upload key reset (only if original keystore is lost)

1. `eas credentials -p android` → download keystore  
2. `keytool -export -rfc -alias <alias> -file upload_certificate.pem -keystore <file.jks>`  
3. Play Console → **Setup** → **App signing** → **Request upload key reset**  
4. Upload PEM; wait for Google approval (~24–48 hrs)
