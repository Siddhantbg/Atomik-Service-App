# ATOMIK — Demo Login Credentials

**For local development only.** All roles use the same **Sign In** screen. The backend routes you to the correct dashboard by account role.

**Demo password** is set via environment variables (not hardcoded in source):

- Backend: `DEMO_USER_PASSWORD` in `backend/.env` (required for `npm run seed`)
- Frontend: `EXPO_PUBLIC_DEMO_PASSWORD` in `frontend/.env` (same value; offline `__DEV__` demo only)

Example for local dev: `Atomik@123` in both files — **do not commit** `.env` files.

---

## Accounts

| Role | Email | Phone | Password | Notes |
|------|-------|-------|----------|--------|
| **Client** | `client@atomik.demo` | `+91 98765 43210` | `DEMO_USER_PASSWORD` | Use email **or** phone + password on Sign In. Offline demo works in `__DEV__` only (email). |
| **Master Technician** | **`master@atomik.demo`** | `+91 98765 43213` | `DEMO_USER_PASSWORD` | Use the full email (not `master@atomik`). Only one master account. |
| **Technician** | `tech@atomik.demo` | `+91 98765 43211` | `DEMO_USER_PASSWORD` | Cannot drop jobs assigned by the master technician. |
| **Admin** | `admin@atomik.demo` | `+91 98765 43212` | `DEMO_USER_PASSWORD` | Admin dashboard. |

---

## Sign in

Use **email or phone** + **password** on the main Sign In screen. No separate technician portal on the splash page.

If staff login fails with *Invalid credentials*, run `cd backend && npm run seed` to create/update demo accounts (including master).

**Master technician email must be exactly:** `master@atomik.demo`

Staff accounts (master technician, technician, admin) are **seeded manually** — not created from the public app.

---

## Client sign-up

**Create Account** is for clients only. **Phone number is required** and must be verified with SMS OTP before the button unlocks. **Email is optional.**

---

## Database (MongoDB Atlas)

```bash
cd backend
npm run seed
```

Creates/updates demo users, one **open demo job** (`ATM90001` at Demo Studio), and clears other operational data.

---

## Quick test checklist

1. `cd backend && npm run dev`
2. `cd frontend && npm start`
3. Sign in as **master@atomik.demo** — dashboard shows **1 open job** (`ATM90001`)
4. Tap **Open assignment board** → assign to **Aditya** (tech@atomik.demo)
5. Sign in as **tech@atomik.demo** → job under My Jobs (drop blocked when master-assigned)

---

## OTP (Twilio)

Client sign-up with a phone number uses Twilio SMS OTP. See **[TWILIO_AUTH_SETUP.md](./TWILIO_AUTH_SETUP.md)**.
