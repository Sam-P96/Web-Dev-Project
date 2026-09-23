# AutoTori — Full Project Review

> **Review date:** 2026-09-23
> **Branch:** `feature/be-login-and-authentication`
> **Scope:** entire repository (backend, frontend, config, git)
> **Document type:** audit report — *no code changes were made*

---

## Table of Contents

1. [Overall status](#1-overall-status)
2. [Product Backlog status](#2-product-backlog-status)
3. [Hardcoded values](#3-hardcoded-values)
4. [Real bugs](#4-real-bugs)
5. [Repository-level issues](#5-repository-level-issues)
6. [Recommended priority order](#6-recommended-priority-order)
7. [Biggest risks](#7-biggest-risks)

---

## 1. Overall status

| Area | Completion | Notes |
|---|---|---|
| Backend structure (routes → controllers → models) | ~75% | Clean, consistent across 4 resources, proper layering |
| Backend business logic / security | ~15% | No auth, no hashing, no error middleware |
| **Auth & login (current branch)** | **0%** | `git diff main...HEAD` is **empty** — the branch has no commits yet |
| Frontend UI (Tailwind) | ~80% | All pages present, basic responsiveness, good visuals |
| Frontend ↔ backend wiring | ~35% | Only Car + Appointment truly wired; user registration is one-way; Login/Profile/Booking/Offer still fake |
| AI valuation (core of the product vision) | **0%** | Not a single line — this is the main selling point |
| Tests | 0% | `npm test` = `exit 1` |
| Docs | ~40% | README still describes Sprint 1, run instructions still `python -m http.server` |

**Overall MVP: roughly 40–45%.**
The shell is nearly done; the core (auth + valuation + business rules) has barely started.

---

## 2. Product Backlog status

| User story | Status | Detail |
|---|---|---|
| Seller creates an account | 🟡 Partial | `POST /users` works, but password is plaintext and email is not unique |
| Seller submits a car | 🟡 Partial | Works, but `client` is a hardcoded ID |
| Seller gets an instant price estimate | 🔴 Missing | UI exists, model/API does not |
| Worker views & responds to offers | 🟡 Partial | Uses the Car API instead of the Offer API |
| Seller books an appointment | 🔴 Missing | The form only `console.log`s |
| Worker manages appointments | 🟢 Done | Truly wired to the backend — the most complete flow in the project |
| Login & profile management | 🔴 Missing | Login only `console.log`s; Profile is 100% hardcoded |

---

## 3. Hardcoded values

### A. URLs / configuration — three conflicting sources

| Location | Value |
|---|---|
| `frontend/src/api/userApi.js:3` | `http://localhost:3000/users` |
| `frontend/src/apis/carApi.js:3` | `http://localhost:3000/cars` |
| `frontend/.env:2` | `VITE_API_URL=http://localhost:4000` |
| `backend/.env` | `PORT=4000`, while `backend/app.js:34` defaults to `3000` |

**Consequences:**
- `WorkerAppointments` calls port **4000**, Car/User call port **3000** — one of them is hitting the wrong server.
- `frontend/.env` is swallowed by the root `.gitignore` (`.env` pattern), and **there is no `.env.example` for the frontend** → a teammate who clones the repo gets `VITE_API_URL = undefined`, so fetches become `undefined/appointments`.

### B. Faked identity IDs — the most dangerous logic issue

| Location | Value |
|---|---|
| `frontend/src/components/CarForm.jsx:6, 63` | `PLACEHOLDER_CLIENT_ID = "6ab1575f4b02b92e8a25e7e3"` — every submitted car belongs to the same user |
| `frontend/src/lib/useCurrentUser.js:4` | With no `localStorage.user`, it returns `{_id: VITE_DEV_WORKER_ID, role: 'worker'}` — **every anonymous visitor is a worker** |
| `frontend/.env:1` | `VITE_DEV_WORKER_ID=652f1a2b3c4d5e6f7a8b9c0f` |

### C. Fake data standing in for the database

| Location | Value |
|---|---|
| `frontend/src/components/FeaturedCarsPrime.jsx:4-55` | 6 placeholder cars (3 duplicated pairs), `image: ""` — used by both Home and `/find_cars` |
| `frontend/src/pages/UserProfile.jsx:6-12` | `'Ridhi'`, `ridhi@autotori.fi`, `+358 234 567 890`, an Espoo address, role `'Seller / Worker'` |
| `frontend/src/components/BookingAppointment.jsx:6-13` | 6 fixed time slots, `09:00 AM … 04:00 PM` |
| `frontend/src/components/PriceEstimateDisplay.jsx:3` | Default prices `23500 / 25000 / 26800` plus a fixed range bar `left-[15%] right-[15%]` |
| `frontend/src/pages/WorkerOffers.jsx:55, 59` | `location: 'Unknown'`, `image: ''` |
| `frontend/src/pages/WorkerAppointments.jsx:4-35` | Commented-out mock data |
| `frontend/src/pages/WorkerOffers.jsx:4-41` | Commented-out mock data plus 3 Unsplash image URLs |

### D. Hardcoded option lists

| Location | Value |
|---|---|
| `CarForm.jsx` | Make (6 brands), Year 2015–2026, Fuel, Transmission, Condition |
| `SearchPrime.jsx:25-66` | Make / Model / price brackets — **duplicated from CarForm but with different contents** |
| `Navbar.jsx:49-56, 119-126` | `EN / FI / SV` with no i18n — a dead select |

### E. Handlers that only pretend to work

| Location | Behaviour |
|---|---|
| `LoginForm.jsx:63` | `console.log('sending to server:', …)` — no API call |
| `BookingAppointment.jsx:25` | `console.log(values)` — never POSTs to `/appointments` |
| `UserProfile.jsx:18-22` | `handleSave` only calls `setIsEditing(false)` |

### F. Dead links / wrong routes

| Location | Problem |
|---|---|
| `FeaturedCarsPrime.jsx:65`, `CarCardPrime.jsx:13` | `href="listings.html"` — points at the Sprint 1 static prototype |
| `Navbar.jsx:88, 94, 106, 112` | The mobile menu points at `/create-account`, `/booking`, `/worker/appointments`, `/worker/offers` — **none of these routes exist**; the desktop menu uses `/register`, `/employee_booking`, `/offers` |
| `Navbar.jsx:36` | `to="appointment"` is missing the leading `/` → relative path, breaks on nested pages |
| `SellCtaPrime.jsx:11` | The "Sell Your Car" button points at `/find_cars` instead of `/submit_page` |
| `SearchPrime.jsx:69` | The Search button is just a `<Link>` and passes no filters |

### G. Colours

Hardcoded hex values (`#247f3d`, `#2f9449`, `#151815`, `#d8dcd8`…) repeat hundreds of times, even though `index.css` already ships shadcn design tokens (`--primary`, `--border`…).
→ Changing one brand colour means editing ~200 places.

---

## 4. Real bugs

### Frontend

| # | Location | Description |
|---|---|---|
| 1 | `WorkerOffers.jsx:82, 85` | Uses `updateCar.isVerified` (a reference to the **imported function**) instead of `updateStatus.isVerified`. Clicking Accept/Reject sets status to `undefined` and blanks the badge |
| 2 | `WorkerOffers.jsx:56` | Reads `car.seller`, but the Car schema field is `client` and the backend does not `populate` → the Seller column is always empty |
| 3 | `WorkerOffers.jsx:165, 252` | `item.price.toLocaleString()` with `estimatedPrice` defaulting to `null` → **white-screen crash** as soon as an unvalued car exists |
| 4 | `UserForm.jsx:79` | Sends `age: values.age`, but the form only has a `dob` field and no `age` → always `undefined`; `dob` is validated and then discarded |
| 5 | `UserForm.jsx:3` | Unused `import { fi } from 'zod/v4/locales'` |
| 6 | `Login.jsx`, `CreateAccount.jsx` | Import `Navbar` and `Footer` but never render them (Navbar is already global in `AppPrime`) |
| 7 | `HeaderPrime.jsx:1` | `function HeaderPrime(para1, header1, para2)` — wrong prop signature (props must be destructured from one object); classNames are still the old CSS → dead component |
| 8 | `PriceEstimateDisplay.jsx` | **Not imported anywhere**, even though it represents the core of the product vision |
| 9 | `frontend/src/App.css` | 1366 lines of old CSS, **not imported anywhere** |
| 10 | `lib/utils.js` | `export { cn } from "cn"` — uses an obscure `cn` package instead of the standard shadcn `clsx` + `tailwind-merge` |

### Backend

| # | Location | Description |
|---|---|---|
| 11 | Project-wide | No `POST /login`, no `bcrypt`, no `jsonwebtoken`, no auth middleware. Passwords are stored in **plaintext**, and `GET /users` + `GET /users/:id` return the `password` field in the response |
| 12 | `userModel.js:21` | `email` has **no `unique: true`**, yet the code handles error `11000` "already in use" → that branch can never run, and duplicate emails are accepted |
| 13 | `carControllers.js`, `userControllers.js`, `offerControllers.js` | No `try/catch` (only `appointment` has one) → a DB error becomes an unhandled rejection and the request hangs |
| 14 | `app.js:29-32` | All 4 routers mount at `"/"` with no `/api` prefix; no 404 handler; no error-handling middleware; `cors()` is fully open |
| 15 | `appointmentModel.js` | No double-booking check, even though the user story explicitly says *"without double-booking"* |
| 16 | `offerModel.js` + `/offers` | The API is complete but **the frontend never uses it** — the Offers page runs on the Car API. The offer/counter-offer flow is unwired |
| 17 | `carModel.js:31` | The `images` field is still a `HELP???` comment. `isVerified` is named like a boolean but is an enum `Pending/Accepted/Rejected` |
| 18 | `appointmentModel.js:41` | Leftover `SIGNUP_ROLES` (copy-pasted from userModel) |
| 19 | `backend/test-db.js` | Imports `./src/config/db.js` and `./src/models/User.js` from a directory layout that **no longer exists** → crashes on run |
| 20 | `PUT /appointments/:id` | Returns an unpopulated document, forcing the frontend to merge manually (`mergeRow`) — a correct but fragile workaround |

---

## 5. Repository-level issues

| # | Description |
|---|---|
| 21 | The root still holds `css/`, `js/`, `image/` from the Sprint 1 prototype; `js/script.js` is **truncated mid-file** (unclosed brace) |
| 22 | The root `package.json` only contains `react-router-dom` — unused, should be removed |
| 23 | `frontend/package.json` includes `dotenv` — meaningless on the client (Vite handles it) |
| 24 | The README describes Sprint 1; its run instructions no longer match reality |
| 25 | 20+ stale remote branches |

---

## 6. Recommended priority order

### 🔴 Demo blockers — do these first

1. Settle on a **single base-URL source** and commit a `frontend/.env.example`.
2. Backend: `POST /login` + bcrypt + JWT (exactly the current branch's scope), and strip `password` from every response.
3. Add `email: { unique: true }` and sync the index.
4. Fix the three `WorkerOffers` crashers (`updateCar.isVerified`, `car.seller`, null `price`).

### 🟠 Remove the faked identities

5. Persist the user on login → drop the worker fallback in `useCurrentUser` → have `CarForm` take `client` from the real user.
6. Wire `UserProfile` to `GET /users/:id` and `PUT /users/:id`.
7. Make `BookingAppointment` actually POST to `/appointments`.

### 🟡 Finish the data wiring

8. Have `FeaturedCarsPrime` read `GET /cars`, drop `placeholderCars`, and fix the `listings.html` links.
9. Align the mobile and desktop navigation on the real routes.
10. Decide once and for all: use the Offer API or drop it — two overlapping concepts currently coexist.

### 🟢 After that

11. The valuation API (the product core that nobody has touched).
12. Image upload (multer).
13. Clean up `App.css`, `css/`, `js/`, `test-db.js`.
14. Rewrite the README.

---

## 7. Biggest risks

> **The product vision is built around a regression valuation model, and none of it exists yet.**

That is the product's main selling point and the first thing reviewers will ask about.
Schedule it **early** in the next sprint, not at the end.

Second risk: the `feature/be-login-and-authentication` branch **has no commits** — auth is a high-priority backlog story and the prerequisite for removing every hardcoded value in group B.
