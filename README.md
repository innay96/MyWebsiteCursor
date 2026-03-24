# My Website (Node + React + PostgreSQL)

Simple auth app:
- User signs up with email + password if they do not have credentials.
- User signs in with email + password.
- After login, the page shows only: `My Website`.

## 1) Create a free PostgreSQL database

Use any free PostgreSQL provider (for example [Neon](https://neon.tech) or [Supabase](https://supabase.com)).

Copy the connection string and use it as `DATABASE_URL`.

## 2) Backend setup

```bash
cd server
cp .env.example .env
```

Update `.env` values:
- `DATABASE_URL`: your free PostgreSQL URL
- `JWT_SECRET`: any long random string

Then run:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

## 3) Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API routes

- `POST /api/signup` body: `{ "email": "...", "password": "..." }`
- `POST /api/login` body: `{ "email": "...", "password": "..." }`
- `GET /api/me` header: `Authorization: Bearer <token>`
