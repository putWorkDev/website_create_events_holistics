# 🌿 Holistics Events Platform — Features

A complete reference of everything the platform does, grouped by area. The app is
a full-stack monorepo: a **Spring Boot + Kotlin** REST API (`backend/`) and a
**React + TypeScript + Vite** single-page app (`frontend/`), backed by
**PostgreSQL** with **Flyway** migrations.

---

## 1. Public website (visitors)

### Home page
- Hero section with headline, intro copy and primary calls-to-action
  ("Browse events", "Become a member").
- "Values" highlight cards (mindful practice, holistic wellbeing, warm community).
- **Upcoming events** preview pulling the next events from the API.
- **About** section with imagery and mission copy.
- **Contact** section / call-to-action with email, phone and location.
- Responsive layout with a greens + warm (sand) palette and serif/sans type pairing.

### Events listing
- Grid of event cards (image, category badge, date/time, location, price).
- **Category filter** chips (colour-coded per category, with event counts).
- **Search** box (by title, summary or location) with debounced input.
- **Pagination** (page size 9) with previous/next controls and page indicator.
- Loading skeletons and empty-state messaging.

### Event detail
- Full event hero image, title and colour-coded category badge.
- Date, time range, location and price.
- Full description with preserved line breaks.
- **RSVP form** (name + email) with capacity / "fully booked" handling and
  duplicate-RSVP prevention; live attendee count and "spots left".
- Pre-filled RSVP details when the visitor is logged in.
- **"Add to Google Calendar"** button that builds a Google Calendar template URL
  from the event's title, times, description and location.

### Navigation & layout
- Sticky responsive navbar with mobile menu.
- Auth-aware navbar (Log in / Join us vs. greeting + Log out; Admin link for admins).
- Global footer with explore links and contact details.
- Friendly 404 page for unknown routes.

---

## 2. Accounts & authentication

- **Register** — create an account (name, email, password) and be logged in
  immediately.
- **Login** — obtain a JWT; admins are routed to the admin dashboard.
- **JWT auth** — token stored in `localStorage`, attached to every request via an
  Axios interceptor; 401 responses clear the stored token.
- **Session restore** — on load the app validates the stored token via `/auth/me`.
- **Roles** — `USER` and `ADMIN`.
- **Route protection** — `ProtectedRoute` guards authenticated and admin-only
  areas on the client; the server independently enforces `ROLE_ADMIN` on
  `/api/admin/**`.
- Password hashing with **BCrypt**; passwords are never returned by the API.

---

## 3. Admin dashboard (ADMIN role)

### Dashboard / overview
- Stat cards: total events, upcoming events, published events, categories,
  RSVPs (attendees) and members (users).
- Quick-action shortcuts to manage events, categories and users.

### Manage events
- Table of all events (title, category, date, price, RSVPs/capacity, status).
- Create, edit and delete events.
- Draft vs. Published status badges.
- Delete confirmation.

### Event form (create / edit)
- Full form: title, short summary, description, location, category, start/end
  date-time, capacity (0 = unlimited), price, image URL and published toggle.
- Client-side validation and `datetime-local` handling.
- Slugs generated automatically server-side.

### Manage categories
- Create / edit / delete categories.
- Name, description and a **colour picker** (used for badges across the app).
- Per-category event counts; categories with events cannot be deleted.

### Manage users
- Table of all members (name, email, join date, role).
- **Role selector** to promote/demote between USER and ADMIN.
- Guards: an admin cannot change their own role, and the last remaining admin
  cannot be demoted.

---

## 4. Backend REST API

| Method | Endpoint                          | Auth   | Description                       |
| ------ | --------------------------------- | ------ | -------------------------------- |
| POST   | `/api/auth/register`              | —      | Create an account                |
| POST   | `/api/auth/login`                 | —      | Obtain a JWT                     |
| GET    | `/api/auth/me`                    | User   | Current user                     |
| GET    | `/api/events`                     | —      | List/search/paginate events      |
| GET    | `/api/events/{slug}`              | —      | Event details                    |
| POST   | `/api/events/{slug}/rsvp`         | —      | RSVP to an event                 |
| GET    | `/api/categories`                 | —      | List categories                  |
| GET    | `/api/admin/events`               | Admin  | List all events (incl. drafts)   |
| POST   | `/api/admin/events`               | Admin  | Create event                     |
| PUT    | `/api/admin/events/{id}`          | Admin  | Update event                     |
| DELETE | `/api/admin/events/{id}`          | Admin  | Delete event                     |
| GET/POST/PUT/DELETE | `/api/admin/categories` | Admin | Manage categories              |
| GET    | `/api/admin/users`                | Admin  | List users                       |
| PATCH  | `/api/admin/users/{id}/role`      | Admin  | Change a user's role             |
| GET    | `/api/admin/dashboard/stats`      | Admin  | Dashboard statistics             |

### Cross-cutting backend features
- **Validation** of request bodies (Jakarta Bean Validation) with structured
  field-level error responses.
- **Global exception handling** returning consistent JSON errors
  (404 / 409 / 400 / 401 with timestamps and messages).
- **CORS** configured from `app.cors.allowed-origins`.
- **Stateless security** (no server sessions) via a JWT filter.
- **Pagination & search** at the repository layer.
- **Unique slugs** generated for events and categories.
- **Capacity & duplicate** enforcement on RSVPs.

---

## 5. Data model (PostgreSQL + Flyway)

Migrations `V1`–`V4` create and seed the schema:

- **users** — `id, name, email (unique), password_hash, role, timestamps`.
  Seeds a default admin (`admin@holistics.events` / `admin123`).
- **categories** — `id, name (unique), slug (unique), description, color,
  timestamps`. Seeds five wellness categories.
- **events** — `id, title, slug (unique), summary, description, location,
  image_url, start_time, end_time, capacity, price, published, category_id,
  created_by, timestamps`. Seeds demo events. Indexed by category, start time
  and published flag.
- **attendees** — `id, event_id, user_id, name, email, status, created_at`,
  with a unique `(event_id, email)` constraint to prevent duplicate RSVPs.

---

## 6. Tech stack & tooling

**Backend**
- Spring Boot 4 · Kotlin · Gradle (wrapper included)
- Spring Web, Spring Data JPA, Spring Security, Spring Validation
- PostgreSQL driver · Flyway · Hibernate
- JJWT for JSON Web Tokens · Jackson Kotlin module

**Frontend**
- React 18 · TypeScript · Vite · React Router
- TailwindCSS (custom forest/sand theme) · Axios

**Infrastructure / DX**
- `docker-compose.yml` for PostgreSQL 16
- Vite dev proxy (`/api` → `http://localhost:8080`)
- Environment-driven configuration (DB, JWT secret, CORS, API base URL)

---

## 7. Default credentials

| Email                     | Password   | Role  |
| ------------------------- | ---------- | ----- |
| `admin@holistics.events`  | `admin123` | ADMIN |

> Change the admin password and `JWT_SECRET` before any real deployment.
