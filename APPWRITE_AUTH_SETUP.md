# Appwrite OTP (optional — not required)

**Default for ATOMIK is Twilio only.** See **[TWILIO_AUTH_SETUP.md](./TWILIO_AUTH_SETUP.md)**.

Use this guide only if you later enable Appwrite instead of Twilio (`APPWRITE_PROJECT_ID` in `backend/.env`).

---

# Appwrite OTP authentication setup (ATOMIK)

If configured, Appwrite Phone (SMS) OTP can replace Twilio for send/verify. Technicians use **phone only** (email optional, no password). Clients can still use **email + password** or **phone OTP**.

---

## 1. Create an Appwrite project

1. Sign up at [https://cloud.appwrite.io](https://cloud.appwrite.io) (or self-host Appwrite).
2. Create a **Project** (e.g. `atomik-production`).
3. Note:
   - **Project ID** (Console → Settings → General)
   - **API Endpoint** (e.g. `https://cloud.appwrite.io/v1` or your region URL)
  
---

## 2. Enable phone (SMS) authentication

1. Console → **Auth** → **Settings**.
2. Enable **Phone** sign-in.
3. Configure an SMS provider (required for real OTP delivery):

### Option A — Appwrite built-in SMS (quick test)

- Auth → **SMS** → use Appwrite’s test/sandbox provider where available.
- Add **mock phone numbers** (Auth → **Mock numbers**) for development without SMS cost.

### Option B — Twilio via Appwrite (production)

1. Auth → **Providers** → **SMS** → connect **Twilio**.
2. Enter Twilio Account SID, Auth Token, and sender number.
3. Appwrite sends OTP SMS; you can remove direct Twilio usage from the Node backend once `APPWRITE_*` env vars are set.

---

## 3. API key (optional, for admin tasks)

For user lookup/admin scripts only:

1. Console → **API Keys** → **Create key**.
2. Scopes: `users.read` (and `users.write` if you automate provisioning).
3. Store as `APPWRITE_API_KEY` in `backend/.env` — **never** commit or ship this in the mobile app.

Phone OTP **send/verify** uses the **Account** API from your backend **without** exposing the API key to clients.

---

## 4. Backend environment (`backend/.env`)

```env
# Appwrite (OTP) — when set, replaces legacy Twilio OTP in /auth/send-otp
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
# Optional: only for server admin scripts, not for OTP send/verify
APPWRITE_API_KEY=

# Legacy Twilio fallback (used only if APPWRITE_PROJECT_ID is empty)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

Restart the API after changing env:

```bash
cd backend
npm run dev
```

---

## 5. Frontend environment (`frontend/.env`)

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:5000/api

# Optional: for future direct Appwrite client SDK (session exchange)
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
```

Use your machine’s LAN IP for physical devices (not `localhost`).

---

## 6. Auth flows in the app

| Role | Sign up | Sign in |
|------|---------|---------|
| **Client** | Create Account → phone OTP + email + password | Sign In (email) **or** Phone Sign In |
| **Technician** | Technician Sign Up → name + phone OTP, email optional | Technician Sign In → phone OTP only |

Backend routes:

- `POST /api/auth/send-otp` — body: `{ phone, purpose }`  
  `purpose`: `signup` \| `login` \| `technician_signup` \| `technician_login`
- `POST /api/auth/register` — client (email + password + OTP)
- `POST /api/auth/register/technician` — technician (name + phone + OTP, optional email)
- `POST /api/auth/login` — email + password (clients)
- `POST /api/auth/login/phone` — phone + OTP (any user with that phone)

---

## 7. Mock phone testing (no SMS cost)

1. Appwrite Console → **Auth** → **Mock phone numbers**.
2. Add e.g. `+919876543210` with a fixed OTP `123456`.
3. In the app, use that number; enter `123456` when prompted.

---

## 8. Technician provisioning notes

- Technicians are **not** created from the public client sign-up screen.
- Admins can still seed technicians in `npm run seed` (demo accounts).
- New technicians self-register via **Technician Sign Up** after OTP is enabled.
- Email is **optional** on technician profile; phone is **unique** and required.

---

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| `Appwrite is not configured` | Set `APPWRITE_ENDPOINT` and `APPWRITE_PROJECT_ID` in `backend/.env`, restart API |
| OTP not received | Check SMS provider in Appwrite Console; use mock numbers in dev |
| `Phone already registered` | Number exists in MongoDB; use login instead of sign-up |
| `Invalid verification code` | OTP expires in ~15 minutes; request a new code |
| Client still uses Twilio | Clear `APPWRITE_PROJECT_ID` unset — Twilio fallback runs |

---

## 10. Security checklist (production)

- [ ] Use production Appwrite project and SMS provider
- [ ] Remove mock phone numbers
- [ ] Do not put `APPWRITE_API_KEY` in the Expo app
- [ ] Keep `JWT_SECRET` long and random on the API
- [ ] Rate limits on `/auth/send-otp` are already enabled (`otpSendLimiter`)
