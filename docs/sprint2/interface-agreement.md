# AutoTori - Frontend/Backend Interface Agreement

> **This is the interface agreement (Sprint 2 deliverable #3), NOT API documentation.** API documentation is Sprint 3.

**When and how this was made:** During Sprint 2 we agreed on the HTTP methods, required fields and data types, but we didn't finish writing everything down. This file was written after the sprint (27.09.2026). It is based on the backend models we built, so it matches what the backend really returns. The frontend will follow it when we connect everything in Sprint 3.

## General rules

- **Base URL (dev):** `http://localhost:3000`. There is no `/api` prefix at the moment.
- **Format:** everything is JSON (`Content-Type: application/json`).
- **Ids:** every document has a MongoDB `_id`, which is a string. The frontend uses `_id`, not `id`.
- **Dates:** sent as ISO strings, for example `"2026-09-22T09:00:00.000Z"`.
- **Enum values:** always written exactly as listed below. Most are lowercase. The only capitalised ones are the values of `isVerified` on Car.
- **Success response:** the document, or a list of documents.
- **Error response:** `{ "message": "..." }`, with status 400 (bad input), 404 (not found) or 500 (server error).
- **Login and register:** in Sprint 2 these are only simulated on the frontend. Real authentication comes in Sprint 3.

---

## User

| Method | Path | What it does |
|---|---|---|
| GET | `/users` | Get all users |
| POST | `/users` | Create a user |
| GET | `/users/:userId` | Get one user |
| PUT | `/users/:userId` | Update a user |
| DELETE | `/users/:userId` | Delete a user |

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | no | Full name. The register form joins first name and last name into this. |
| `email` | String | **yes** | |
| `password` | String | **yes** | Should NOT be sent back in responses (to fix in Sprint 3). |
| `phone` | String | no | |
| `address` | String | no | |
| `age` | Number | no | |
| `role` | String | no | `client` / `worker` / `admin`, default `client` |
| `browsingHistory` | [Car `_id`] | no | |

Example response:

```json
{
  "_id": "6aa52314087049a29a82d1ca",
  "name": "Test User",
  "email": "test@test.com",
  "phone": "0123456789",
  "address": "Myyrmäki, Vantaa",
  "role": "client",
  "browsingHistory": [],
  "createdAt": "2026-09-12T10:01:56.549Z",
  "updatedAt": "2026-09-12T10:01:56.549Z"
}
```

---

## Car

| Method | Path | What it does |
|---|---|---|
| GET | `/cars` | Get all cars |
| POST | `/cars` | Seller submits a car |
| GET | `/cars/:carId` | Get one car (for the detail page) |
| PUT | `/cars/:carId` | Update a car, e.g. the worker accepts or rejects it |
| DELETE | `/cars/:carId` | Delete a car |

| Field | Type | Required | Notes |
|---|---|---|---|
| `client` | User `_id` | **yes** | The seller who owns the car |
| `make` | String | **yes** | |
| `model` | String | **yes** | |
| `year` | Number | **yes** | |
| `mileage` | Number | **yes** | km, minimum 0 |
| `fuel` | String | no | |
| `transmission` | String | no | |
| `location` | String | no | |
| `condition` | String | no | `poor` / `fair` / `good` / `excellent`, default `good` |
| `description` | String | no | |
| `estimatedPrice` | Number or null | no | Default `null` |
| `isVerified` | String | no | `Pending` / `Accepted` / `Rejected`, default `Pending` |

Example response:

```json
{
  "_id": "6aa6430041026794d1c2b7a1",
  "client": "6aa52314087049a29a82d1ca",
  "make": "BMW",
  "model": "3 Series",
  "year": 2021,
  "mileage": 45200,
  "fuel": "petrol",
  "transmission": "automatic",
  "location": "Helsinki",
  "condition": "good",
  "description": "One owner, service book.",
  "estimatedPrice": null,
  "isVerified": "Pending"
}
```

Not decided yet: car images (Multer), and the seller's own asking price. At the moment the asking price is saved in `estimatedPrice`, but that field is meant for the AI estimate. We will add a separate field in Sprint 3.

---

## Offer

| Method | Path | What it does |
|---|---|---|
| GET | `/offers` | Get all offers |
| POST | `/offers` | Worker makes an offer on a car |
| GET | `/offers/:offerId` | Get one offer |
| PUT | `/offers/:offerId` | Update an offer, e.g. accept or reject it |
| DELETE | `/offers/:offerId` | Delete an offer |

| Field | Type | Required | Notes |
|---|---|---|---|
| `car` | Car `_id` | **yes** | |
| `worker` | User `_id` | **yes** | |
| `amount` | Number | **yes** | €, minimum 0 |
| `message` | String | no | |
| `status` | String | no | `pending` / `accepted` / `rejected`, default `pending` |
| `respondedAt` | Date or null | no | Default `null` |

Example response:

```json
{
  "_id": "6aa7a1b2c3d4e5f607182930",
  "car": "6aa6430041026794d1c2b7a1",
  "worker": "6aa5231f087049a29a82d1cb",
  "amount": 29500,
  "message": "Price after inspection.",
  "status": "pending",
  "respondedAt": null,
  "createdAt": "2026-09-15T08:30:00.000Z",
  "updatedAt": "2026-09-15T08:30:00.000Z"
}
```

---

## Appointment

| Method | Path | What it does |
|---|---|---|
| GET | `/appointments` | Get all appointments. Add `?worker=<userId>` to get one worker's appointments. |
| POST | `/appointments` | Seller books an appointment |
| GET | `/appointments/:appointmentId` | Get one appointment |
| PUT | `/appointments/:appointmentId` | Reschedule, confirm, complete or cancel |
| DELETE | `/appointments/:appointmentId` | Delete an appointment |

| Field | Type | Required | Notes |
|---|---|---|---|
| `car` | Car `_id` | **yes** | |
| `seller` | User `_id` | **yes** | |
| `worker` | User `_id` or null | no | Default `null` |
| `scheduledAt` | Date | **yes** | The date and time together in one value |
| `location` | String | no | |
| `notes` | String | no | |
| `status` | String | no | `booked` / `confirmed` / `completed` / `cancelled`, default `booked` |

`GET /appointments` also fills in some details for you: `car` comes back as `{ _id, make, model, year }` and `seller` as `{ _id, name }`. The results are sorted by `scheduledAt`.

Example response:

```json
{
  "_id": "6aa8c0ffee0123456789abcd",
  "car": { "_id": "6aa6430041026794d1c2b7a1", "make": "BMW", "model": "3 Series", "year": 2021 },
  "seller": { "_id": "6aa52314087049a29a82d1ca", "name": "Test User" },
  "worker": null,
  "scheduledAt": "2026-09-29T09:00:00.000Z",
  "location": "AutoTori, Espoo",
  "notes": "Vehicle inspection",
  "status": "booked",
  "createdAt": "2026-09-20T12:00:00.000Z",
  "updatedAt": "2026-09-20T12:00:00.000Z"
}
```

---

## Differences found in the Sprint 2 code (to fix in Sprint 3)

| Where (frontend) | What it uses now | What it should use |
|---|---|---|
| Featured cars mock data | `id`, `name`, `km: "38,500"`, `price: "€34,990"` | `_id`, `make` + `model`, `mileage` (Number), a price as a Number |
| Worker offers page | `seller` | `client` |
| Worker offers page | Car documents with `isVerified` | Decide as a team: keep using `isVerified` on Car, or use the Offer model |
| Offer status | `Pending` (capital letter) | `pending` |
| Booking form | separate date + time (e.g. `"09:00 AM"`), and a service type | One `scheduledAt` date. A `service` field would need to be added to the backend. |
| Booking form | no car or seller | `car` and `seller` are required |
| Profile page | `fullName`, role `"Seller / Worker"` | `name`, role `client` / `worker` |
| Register form | `dob` is collected, `age` is sent but empty | Decide as a team: `age` or a date of birth |
