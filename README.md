```md
# Labfry Auth (Next.js + Socket.IO)

Simple auth app matching Figma:
- Register → Email OTP (6-digit)
- Login (JWT in HttpOnly cookie)
- Forgot/Reset Password (email link)
- Role Select (Customer / Service Provider)
- Profile with presence toggle (via external Socket.IO server)

## Project Layout

```


## Requirements
- Node 18+ (recommended 20)
- npm or pnpm
- MongoDB (Atlas or local)
- SMTP account (e.g., Gmail App Password)

## 1) Environment Variables

Create **`.env.local`** in the project root (Next.js):
```

MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=supersecret_min_32_chars

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[your@gmail.com](mailto:your@gmail.com)
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Labfry [no-reply@labfry.com](mailto:no-reply@labfry.com)"

NEXT_PUBLIC_SITE_URL=[http://localhost:3000](http://localhost:3000)
NEXT_PUBLIC_WS_URL=[http://localhost:5050](http://localhost:5050)

```

Create **`ws-server/.env`**:
```

WS_PORT=5050
CORS_ORIGIN=[http://localhost:3000](http://localhost:3000)
JWT_SECRET=supersecret_min_32_chars   # must match Next.js

````

> **Important:** `JWT_SECRET` must be identical in both places.

## 2) Install

```bash
# from project root
pnpm i           # or: npm i
# install ws-server deps
cd ws-server && npm i && cd ..
````

## 3) Run (Local)

```bash
# Terminal 1: Next.js app (frontend + API routes)
npm run dev
# => http://localhost:3000

# Terminal 2: Socket.IO server
cd ws-server
npm run dev
# => http://localhost:5050
```

## 4) Use

1. Visit `http://localhost:3000`.
2. Register → check your email for the OTP → verify.
3. Login → you’ll be redirected to **/profile**.
4. Toggle presence on profile (emits socket events).
   *Open two browsers to see realtime updates.*

## 5) Deploy (Summary)

* Deploy **Next.js** to Vercel (set env vars in dashboard).
* Deploy **ws-server** to a Node host (Render/Railway/Heroku/Fly).
  Set `CORS_ORIGIN` to your site URL and use `wss://` for `NEXT_PUBLIC_WS_URL`.

## Troubleshooting

* **CORS error**: `CORS_ORIGIN` must exactly match your site origin (protocol, host, port).
* **JWT invalid**: Ensure both apps share the same `JWT_SECRET`.
* **Emails not sending**: Use a Gmail **App Password** (not your normal password) or another SMTP provider.

```
```
