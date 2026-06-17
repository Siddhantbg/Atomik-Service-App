# Twilio OTP authentication (ATOMIK)

Phone sign-up and sign-in use **Twilio SMS**. The API generates a 6-digit code, stores a hash in MongoDB, and sends the code as the SMS body.

**Do not use Appwrite** for OTP: leave `APPWRITE_PROJECT_ID` unset (or commented out) in `backend/.env`.

---

## 1. Twilio Console

1. [https://console.twilio.com](https://console.twilio.com) → your project.
2. **Account Info**: copy **Account SID** and **Auth Token** (Show).
3. **Phone Numbers** → **Manage** → **Active numbers**: copy your SMS-capable number (e.g. `+15752513389`). This is `TWILIO_FROM_NUMBER`.

Trial accounts can only SMS **verified** recipient numbers (Console → Phone Numbers → Verified Caller IDs).

---

## 2. Backend `backend/.env`

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+15752513389
```

Restart the API:

```bash
cd backend
npm run dev
```

---

## 3. Test SMS from the API machine

```bash
cd backend
npx ts-node src/scripts/testTwilio.ts +919876543210
```

Replace with your real test number (E.164: `+91…` for India). Check the phone for a 4-digit test code in the message body.

---

## 4. App auth flows

| Role | Sign up | Sign in |
|------|---------|---------|
| **Technician** | Technician Sign Up → name + phone OTP (email optional) | Technician Sign In → phone OTP |
| **Client** | Create Account → phone OTP + email + password | Sign In or Phone Sign In |

API:

- `POST /api/auth/send-otp` — `{ "phone": "+91...", "purpose": "technician_login" | "technician_signup" | "login" | "signup" }`
- `POST /api/auth/verify-otp` — `{ "phone", "otp", "purpose" }` — confirms phone in the app (green **Verified** badge) before register/login
- `POST /api/auth/login/phone` — `{ "phone", "otp" }`
- `POST /api/auth/register/technician` — `{ "name", "phone", "otp", "email?" }`

OTP expires in **10 minutes**. Resend cooldown **30 seconds**.

---

## 5. curl (manual check)

Same as Twilio’s REST API (use your SID, token, **From** = your Twilio number, **To** = verified number on trial):

```bash
curl.exe -X POST "https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json" ^
  --data-urlencode "To=+919876543210" ^
  --data-urlencode "From=+15752513389" ^
  --data-urlencode "Body=123456" ^
  -u YOUR_SID:YOUR_AUTH_TOKEN
```

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| `Twilio is not configured` | Set all three `TWILIO_*` vars in `backend/.env`, restart API |
| `Twilio authentication failed` | Wrong Auth Token; regenerate in Console |
| SMS not received (trial) | Add recipient under **Verified Caller IDs** |
| `21211` invalid number | Use full E.164 (`+91` + 10 digits) |
| Still using Appwrite | Remove or comment `APPWRITE_PROJECT_ID` in `.env` |
| Old credentials in DB | Env vars override seed; run `npm run seed` to refresh `twilio_sms` in MongoDB |

---

## 7. Security

- Never commit `backend/.env` or paste Auth Token in chat/repos.
- Rotate the Auth Token in Twilio Console if it was exposed.
- Production: use a dedicated Twilio subaccount and monitor usage/alerts.
