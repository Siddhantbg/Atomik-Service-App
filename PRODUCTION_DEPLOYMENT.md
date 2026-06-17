# ATOMIK production deployment checklist

This checklist captures the operational items from the Production Security Plan that cannot be fully enforced in code.

## 1) HTTPS (required)

- Terminate TLS in front of the API (**Render** handles HTTPS on free web services).
- Only expose the API over HTTPS (no direct `http://` public endpoint).
- Verify with:
  - `https://<api-domain>/health` returns 200
  - TLS 1.2+ enabled
  - HSTS enabled (at the proxy/CDN layer)

## 2) MongoDB Atlas lockdown (required)

- Remove `0.0.0.0/0` from the Atlas Network Access allowlist.
- Allowlist only your hosting provider egress IPs (or use VPC peering/private endpoints).
- Create a least-privilege DB user for the API (no admin/root user).
- Enable backups and test restore.

## 3) Razorpay live configuration (required)

- Use Live `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in the API runtime secrets.
- Configure webhook in Razorpay Dashboard:
  - URL: `https://<api-domain>/api/payments/webhook`
  - Secret: set and store as `RAZORPAY_WEBHOOK_SECRET`
  - Events: at minimum `payment.captured`
- Validate the webhook by sending a test event and verifying the API rejects invalid signatures.

## 4) Resend / Twilio production setup (required)

- Resend:
  - Verify a sending domain (SPF/DKIM).
  - Ensure production sender identity is not sandbox-only.
- Twilio:
  - Use a production-capable sender.
  - Monitor spend and configure anti-fraud controls.

## 5) CORS and client URL (required)

- Set `CLIENT_URL` to your production origin(s) only (comma-separated).
- Example:
  - `CLIENT_URL=https://atomik.app,https://admin.atomik.app`

## 6) Observability (recommended)

- Add error monitoring (Sentry/Datadog) for:
  - Auth failures, OTP abuse signals
  - Payment verify failures
  - Webhook signature failures
- Configure alerts for spikes in 4xx/5xx and payment anomalies.

## 7) Edge protection / WAF (recommended)

- Put Cloudflare (or AWS WAF) in front of the API.
- Add rate limiting/bot rules at the edge (in addition to the app rate limiters).

## 8) Staff accounts (required)

- The mobile app uses a **single sign-in screen**; users are routed by role after authentication.
- **Clients** may self-register via signup (role is always `client` on the API).
- **Technicians and admins** must be created internally:
  - Admin panel API (`POST /api/admin/users` or equivalent), or
  - Controlled `npm run seed` in non-production environments only.
- Do not expose staff registration or portal selection in the public app UI.
- Disable offline demo auth in production builds (`EXPO_PUBLIC_ENABLE_DEMO_AUTH` must not be `true` in store releases).

