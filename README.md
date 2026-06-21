# 🌿 Holistics Events Platform

A full-stack platform for discovering and managing holistic wellness gatherings —
yoga, meditation, sound healing and community events. Public visitors browse and
RSVP to events (with one-click "Add to Google Calendar"), while admins manage
events, categories and users from a dedicated dashboard.

This is a monorepo with two applications:

| App        | Stack                                                            | Location    |
| ---------- | --------------------------------------------------------------- | ----------- |
| Backend    | Spring Boot 4.0 · Kotlin · Gradle · PostgreSQL · Flyway · JWT    | `backend/`  |
| Frontend   | React 18 · TypeScript · Vite · TailwindCSS                       | `frontend/` |

## Architecture

```
Browser ──HTTP──> React SPA (Vite) ──/api──> Spring Boot REST API ──JPA──> PostgreSQL
                                                   │
                                            JWT (Spring Security)
```

- **Auth**: Stateless JWT. The token is stored in `localStorage` and attached to
  every request via an Axios interceptor. `USER` and `ADMIN` roles; admin routes
  are guarded both on the backend (`/api/admin/**` → `ROLE_ADMIN`) and the
  frontend (`ProtectedRoute`).
- **Data**: Flyway migrations `V1`–`V4` create `users`, `categories`, `events`
  and `attendees`, and seed a few categories, demo events and the admin account.

## Getting started

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Run the backend (port 8080)

```bash
cd backend
./gradlew bootRun
```

Flyway runs the migrations automatically on startup. Configuration lives in
`backend/src/main/resources/application.yml` and can be overridden with the
`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` and `CORS_ALLOWED_ORIGINS`
environment variables.

### 3. Run the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080`, so no extra
configuration is needed for local development.

## Default admin account

| Email                     | Password   |
| ------------------------- | ---------- |
| `admin@holistics.events`  | `admin123` |

> Change this password (and the `JWT_SECRET`) before deploying anywhere real.

## API overview

| Method | Endpoint                          | Auth   | Description                       |
| ------ | --------------------------------- | ------ | -------------------------------- |
| POST   | `/api/auth/register`              | —      | Create an account                |
| POST   | `/api/auth/login`                 | —      | Obtain a JWT                     |
| GET    | `/api/auth/me`                    | User   | Current user                     |
| GET    | `/api/events`                     | —      | List/search/paginate events      |
| GET    | `/api/events/{slug}`              | —      | Event details                    |
| POST   | `/api/events/{slug}/rsvp`         | —      | RSVP to an event                 |
| GET    | `/api/categories`                 | —      | List categories                  |
| GET/POST/PUT/DELETE | `/api/admin/events`  | Admin  | Manage events                    |
| GET/POST/PUT/DELETE | `/api/admin/categories` | Admin | Manage categories              |
| GET    | `/api/admin/users`                | Admin  | List users                       |
| PATCH  | `/api/admin/users/{id}/role`      | Admin  | Change a user's role             |
| GET    | `/api/admin/dashboard/stats`      | Admin  | Dashboard statistics             |

## Project layout

```
backend/
  src/main/kotlin/com/holistics/events/
    config/        Spring Security + CORS
    controller/    Public + admin REST controllers
    dto/           Request/response models
    entity/        JPA entities
    exception/     Domain exceptions + global handler
    repository/    Spring Data repositories
    security/      JWT service + auth filter
    service/       Business logic
  src/main/resources/
    application.yml
    db/migration/  Flyway V1–V4
frontend/
  src/
    api/           Axios client + typed API modules
    components/    Navbar, EventCard, CategoryFilter, AdminSidebar, …
    context/       AuthContext (JWT)
    pages/         Public + admin pages
    utils/         Google Calendar URL builder, formatting
docker-compose.yml PostgreSQL 16
```
