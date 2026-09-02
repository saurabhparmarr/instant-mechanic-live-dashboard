# API Documentation — Instant Mechanic Live Operations Dashboard

**Base URL (Production):** `https://instant-mechanic-live-dashboard-1.onrender.com`
**Base URL (Local):** `http://localhost:5000`

All endpoints are prefixed with `/api`.

---

## Conventions

**Success response shape**
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { }
}
```

**Error response shape**
```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": []
}
```

- `errors` is populated with `{ field, message }` objects on Mongoose validation failures (`400`).
- Invalid MongoDB ObjectIds return `400 Invalid <field>`.
- Duplicate unique fields (e.g. email) return `409 <field> already exists`.
- Unhandled server errors return `500 Internal Server Error`.

**Rate limiting**
All `/api/*` routes are limited to 300 requests per 15 minutes per IP. Exceeding this returns `429` with:
```json
{ "success": false, "message": "Too many requests. Please try again later." }
```

**Pagination** (bookings, mechanics, customers)

| Query param | Type   | Default | Notes |
|---|---|---|---|
| `page`  | number | 1  | Min 1 |
| `limit` | number | 20 | Min 1, max 100 |

Paginated responses include:
```json
"pagination": {
  "page": 1,
  "limit": 20,
  "total": 532,
  "totalPages": 27,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## Health Check

### `GET /api/health`
Returns API liveness status.

**Response `200`**
```json
{
  "success": true,
  "message": "Live Operations Dashboard API is healthy",
  "timestamp": "2026-09-02T10:00:00.000Z"
}
```

---

## Dashboard

### `GET /api/dashboard`
High-level overview used by the dashboard's top cards.

**Response `200` — `data`**
```json
{
  "bookings": {
    "total": 532, "today": 12, "active": 40,
    "completed": 410, "pending": 55, "cancelled": 27
  },
  "revenue": { "total": 1245600 },
  "customers": { "total": 210, "newThisMonth": 18 },
  "mechanics": { "total": 24, "available": 9 }
}
```

### `GET /api/dashboard/stats`
Flat version of the same counters (used for compact stat widgets).

**Response `200` — `data`**
```json
{
  "totalBookings": 532,
  "todayBookings": 12,
  "activeBookings": 40,
  "completedBookings": 410,
  "pendingBookings": 55,
  "cancelledBookings": 27,
  "totalRevenue": 1245600,
  "totalCustomers": 210,
  "newCustomers": 18,
  "totalMechanics": 24,
  "availableMechanics": 9
}
```

### `GET /api/dashboard/booking-status`
Booking count grouped by status, for the status pie/donut chart.

**Response `200` — `data`**
```json
[
  { "status": "Completed", "count": 410 },
  { "status": "Pending", "count": 55 }
]
```

### `GET /api/dashboard/revenue-trend`
Daily revenue for completed bookings.

**Query params**
| Param | Type | Default | Range |
|---|---|---|---|
| `days` | number | 30 | 7–90 |

**Response `200` — `data`**
```json
[
  { "date": "2026-08-05", "revenue": 18500, "bookings": 6 }
]
```

### `GET /api/dashboard/bookings-trend`
Daily booking volume (all statuses).

**Query params:** same `days` param as above.

**Response `200` — `data`**
```json
[
  { "date": "2026-08-05", "bookings": 14 }
]
```

### `GET /api/dashboard/services`
Booking count and revenue grouped by service category.

**Response `200` — `data`**
```json
[
  { "service": "Periodic Service", "bookings": 120, "revenue": 340000 }
]
```

---

## Bookings

### `GET /api/bookings`
List bookings with search, filters, sorting and pagination.

**Query params**
| Param | Type | Notes |
|---|---|---|
| `page`, `limit` | number | See Pagination |
| `search` | string | Matches booking ID, vehicle reg/make/model, customer name/phone/email, mechanic name/phone |
| `status` | string | One of `Pending`, `Assigned`, `Mechanic On The Way`, `In Progress`, `Completed`, `Cancelled` |
| `from`, `to` | date (`YYYY-MM-DD`) | Filters by `scheduledAt`, inclusive |
| `sortBy` | string | `scheduledAt` (default), `createdAt`, `amount`, `status`, `bookingId` |
| `sortOrder` | string | `asc` or `desc` (default) |

**Response `200` — `data`**
```json
{
  "bookings": [
    {
      "_id": "66f...",
      "bookingId": "BK10234",
      "customer": { "_id": "...", "name": "Rahul Mehta", "phone": "98...", "email": "..." },
      "mechanic": { "_id": "...", "name": "Suresh Yadav", "phone": "98...", "status": "Busy" },
      "vehicle": { "make": "Honda", "model": "City", "registrationNumber": "MH12AB1234", "year": 2020 },
      "service": { "name": "Full Service", "category": "Periodic Service" },
      "status": "In Progress",
      "amount": 3500,
      "scheduledAt": "2026-09-02T09:00:00.000Z",
      "createdAt": "2026-09-01T12:00:00.000Z"
    }
  ],
  "pagination": { "...": "see Pagination section" }
}
```

**Errors:** `400 Invalid booking status`, `400 Invalid from date`, `400 Invalid to date`

### `GET /api/bookings/:id`
Fetch a single booking with populated customer and mechanic.

**Errors:** `404 Booking not found`, `400 Invalid _id` (malformed id)

### `POST /api/bookings`
Create a booking.

**Body**
```json
{
  "bookingId": "BK10235",
  "customer": "<customerId>",
  "mechanic": "<mechanicId>",
  "vehicle": { "make": "Hyundai", "model": "i20", "registrationNumber": "MH14XY9876", "year": 2021 },
  "service": { "name": "Oil Change", "category": "Oil Change" },
  "status": "Pending",
  "amount": 1200,
  "scheduledAt": "2026-09-03T10:00:00.000Z"
}
```
Emits Socket.IO event `booking:updated` with `{ action: "created", bookingId }` to the `operations` room.

**Response:** `201` with the created (populated) booking.

### `PUT /api/bookings/:id` / `PATCH /api/bookings/:id`
Update a booking (full or partial). Same body shape as create; only send fields to change.
Emits `booking:updated` with `{ action: "updated", bookingId }`.

**Errors:** `404 Booking not found`

### `DELETE /api/bookings/:id`
Deletes a booking. Emits `booking:updated` with `{ action: "deleted", bookingId }`.

**Errors:** `404 Booking not found`

---

## Mechanics

### `GET /api/mechanics`
List mechanics with search, filter, sort and pagination.

**Query params**
| Param | Type | Notes |
|---|---|---|
| `page`, `limit` | number | See Pagination |
| `status` | string | `Available`, `Busy`, `Offline` |
| `search` | string | Matches name, phone, email, specialization |
| `sortBy` | string | `name`, `status`, `createdAt` (default), `jobsCompleted` |
| `sortOrder` | string | `asc` or `desc` (default) |

**Response `200` — `data`**
```json
{
  "mechanics": [
    {
      "_id": "...",
      "name": "Suresh Yadav",
      "status": "Busy",
      "specialization": "Engine Repair",
      "jobsCompleted": 87,
      "currentBooking": { "bookingId": "BK10234", "status": "In Progress", "customer": { "name": "Rahul Mehta", "phone": "..." } },
      "lastBooking": { "bookingId": "BK10190", "status": "Completed" }
    }
  ],
  "pagination": { "...": "see Pagination section" }
}
```
`jobsCompleted` is computed live from completed bookings, not just the stored counter.

**Errors:** `400 Invalid mechanic status`

### `GET /api/mechanics/:id`
Single mechanic with populated `currentBooking` and `lastBooking`, plus live `jobsCompleted` count.

**Errors:** `404 Mechanic not found`

---

## Customers

### `GET /api/customers`
List customers with search, sort and pagination.

**Query params**
| Param | Type | Notes |
|---|---|---|
| `page`, `limit` | number | See Pagination |
| `search` | string | Matches name, phone, email |
| `sortBy` | string | `createdAt` (default), `name` |
| `sortOrder` | string | `asc` or `desc` (default) |

### `GET /api/customers/:id`
Single customer record.

**Errors:** `404 Customer not found`

---

## Real-time Updates (Socket.IO)

Connect to the backend base URL over Socket.IO and join the operations room:

```js
const socket = io(BASE_URL, { withCredentials: true });
socket.emit("join:operations");
socket.on("booking:updated", ({ action, bookingId }) => {
  // action: "created" | "updated" | "deleted"
  // refetch or patch the booking with this id
});
```

No page reload is needed — booking creates/updates/deletes made by anyone push a `booking:updated` event to every connected client in the `operations` room.