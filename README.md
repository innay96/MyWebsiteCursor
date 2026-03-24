# My Website (Node + React + PostgreSQL)

Simple auth app:
- User signs up with email + password if they do not have credentials.
- User signs in with email + password.
- After login, the page shows only: `My Website`.


Backend runs on `http://localhost:4000`.

Frontend runs on `http://localhost:5173`.

## API routes

- `POST /api/signup` body: `{ "email": "...", "password": "..." }`
- `POST /api/login` body: `{ "email": "...", "password": "..." }`
- `GET /api/me` header: `Authorization: Bearer <token>`
