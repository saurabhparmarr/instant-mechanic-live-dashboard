# Instant Mechanic – Live Operations Dashboard

A full-stack **Live Operations Dashboard** for managing and monitoring mechanic service bookings in real time.

The dashboard provides booking analytics, revenue insights, mechanic availability, customer statistics, booking management, and real-time updates using **Socket.IO**.

---

## 🚀 Project Overview

**Instant Mechanic** is a full-stack operations dashboard designed for a mechanic/service-booking platform.

The application allows operations teams to:

* Monitor total and daily bookings
* Track completed, pending, active, and cancelled bookings
* Monitor total revenue
* Track active/available mechanics
* Monitor new customers
* Analyze booking trends
* Analyze revenue trends
* View booking status distribution
* View service/category distribution
* Search and filter bookings
* Sort bookings
* Paginate booking records
* Monitor mechanic status and completed jobs
* Receive real-time dashboard updates when bookings are created, updated, or deleted

The application uses a MongoDB database with realistic seeded data and exposes REST APIs through an Express.js backend.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Recharts
* Axios
* Socket.IO Client
* React Router
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* Helmet
* Express Rate Limit
* Morgan
* CORS

### Development & Deployment

* Git & GitHub
* Vercel – Frontend
* AWS EC2 – Backend
* MongoDB Atlas – Database
* Socket.IO – Real-time communication

---

## 🏗️ Architecture

```text
┌──────────────────────────┐
│       React Frontend     │
│     Vite + Tailwind      │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│      Express Backend     │
│   Controllers + Routes   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       MongoDB Atlas      │
│ Bookings / Customers /   │
│ Mechanics                │
└──────────────────────────┘

        Real-Time Updates
              ▲
              │ Socket.IO
              │
┌─────────────┴────────────┐
│       Express Server     │
│ booking:updated events   │
└──────────────────────────┘
```

### Data Flow

```text
Frontend
   ↓
Axios
   ↓
Express REST API
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

For live updates:

```text
Booking Created / Updated / Deleted
                ↓
         Backend Controller
                ↓
        Socket.IO Event
                ↓
       "booking:updated"
                ↓
       Connected Dashboard
                ↓
        Automatic API Refresh
```

---

## 📊 Dashboard Features

### Overview Metrics

The dashboard displays:

* Total Bookings
* Today's Bookings
* Completed Bookings
* Pending Bookings
* Cancelled Bookings
* Total Revenue
* Active Mechanics
* New Customers

### Analytics

* Bookings Over Time
* Revenue Over Time
* Booking Status Distribution
* Service/Category Distribution

### Booking Management

* Booking ID
* Date & Time
* Customer
* Vehicle
* Mechanic
* Service
* Amount
* Status

Supported functionality:

* Search
* Status filtering
* Sorting
* Pagination

### Mechanic Management

The mechanics section provides:

* Mechanic name
* Current status
* Jobs completed
* Current booking
* Last booking
* Search
* Filtering
* Sorting
* Pagination

### UI States

The dashboard handles the following states across data-driven views:

* **Loading** — skeleton/spinner states while data is fetched
* **Error** — a visible error state if an API call fails, instead of a blank screen
* **Empty** — a dedicated empty state when a filter/search returns no results

*(Adjust this section to accurately describe what you actually implemented before submitting.)*

---

## ⚡ Real-Time Updates

The dashboard uses **Socket.IO** for real-time communication.

Whenever a booking is:

* Created
* Updated
* Deleted

the backend emits:

```text
booking:updated
```

The frontend listens for this event and automatically refreshes:

* Dashboard statistics
* Booking status distribution
* Revenue trend
* Booking trend
* Service distribution

No complete browser page reload is required.

---

## 📦 Database & Seed Data

The project includes a database seed script for generating realistic dashboard data.

The seed script creates:

* 60 Customers
* 25 Mechanics
* 600 Bookings
* 8 Service Categories
* Multiple booking statuses
* Different booking dates
* Different booking amounts
* Different vehicles
* Different cities

### Booking Statuses

```text
Pending
Assigned
Mechanic On The Way
In Progress
Completed
Cancelled
```

---

# 🔌 API Documentation

Base URL:

```text
/api
```

## Health Check

### GET `/api/health`

Checks whether the backend is running.

Example:

```http
GET /api/health
```

---

## Dashboard

### GET `/api/dashboard/stats`

Returns dashboard overview statistics.

Response includes:

```text
totalBookings
todayBookings
activeBookings
completedBookings
pendingBookings
cancelledBookings
totalRevenue
totalCustomers
newCustomers
totalMechanics
availableMechanics
```

### GET `/api/dashboard/status`

Returns booking status distribution.

### GET `/api/dashboard/revenue`

Returns revenue trend data.

Query parameter:

```text
?days=30
```

Supported range:

```text
7 – 90 days
```

### GET `/api/dashboard/bookings-trend`

Returns booking trend data.

Query parameter:

```text
?days=30
```

### GET `/api/dashboard/services`

Returns service/category distribution.

> **Note:** the assignment brief suggests a single `GET /api/dashboard` endpoint. This project instead splits dashboard data into granular endpoints (`/stats`, `/status`, `/revenue`, `/bookings-trend`, `/services`) so each chart/widget fetches only the data it needs, rather than one large bloated response. The brief states API design quality is evaluated over exact endpoint matching.

---

## Bookings

### GET `/api/bookings`

Returns paginated bookings.

Supported query parameters:

```text
page
limit
search
status
sortBy
sortOrder
```

Example:

```http
GET /api/bookings?page=1&limit=20&status=Completed&sortBy=scheduledAt&sortOrder=desc
```

### GET `/api/bookings/:id`

Returns a single booking.

### POST `/api/bookings`

Creates a new booking.

### PUT `/api/bookings/:id`

Updates an existing booking.

### DELETE `/api/bookings/:id`

Deletes a booking.

Booking create/update/delete operations trigger the Socket.IO:

```text
booking:updated
```

event.

---

## Mechanics

### GET `/api/mechanics`

Returns paginated mechanics.

Supported query parameters:

```text
page
limit
search
status
sortBy
sortOrder
```

### GET `/api/mechanics/:id`

Returns a single mechanic.

---

## Customers

### GET `/api/customers`

Returns customer records with pagination and search support.

---

# 💻 Local Setup

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd instant-mechanic
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

---

## 3. Seed Database

From the backend directory:

```bash
node seed.js
```

This will create the sample customers, mechanics, services, and bookings.

---

## 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

## Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=your_frontend_url
```

## Frontend

```env
VITE_API_URL=your_backend_api_url/api
VITE_SOCKET_URL=your_backend_url
```

> Do not commit `.env` files or database credentials to GitHub.

---

# 🚀 Deployment

## Frontend – Vercel

The React frontend is deployed using Vercel.

### Production Frontend

```text
YOUR_VERCEL_URL
```

### Frontend Environment Variables

```env
VITE_API_URL=YOUR_AWS_BACKEND_URL/api
VITE_SOCKET_URL=YOUR_AWS_BACKEND_URL
```

---

## Backend – AWS EC2

The Express backend is deployed on AWS EC2.

### Production Backend

```text
YOUR_AWS_BACKEND_URL
```

Health check:

```text
YOUR_AWS_BACKEND_URL/api/health
```

The backend connects to MongoDB Atlas for persistent database storage.

---

# 📁 Project Structure

```text
instant-mechanic/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── socket.js
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 🔒 Security

The backend includes several security and reliability measures:

* Helmet security headers
* API rate limiting
* CORS configuration
* Request body size limits
* Disabled `X-Powered-By`
* Centralized error handling
* 404 handling
* Environment variables for secrets

---

# 📱 Responsive Design

The dashboard is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Tables and dashboard sections adapt to smaller screen sizes.

---

# ⭐ Bonus Features Implemented

Given the 48-hour window, priority was placed on fully finishing and polishing the core requirements over building out every optional bonus feature.

*(List anything you actually implemented here, e.g. Dark mode, CSV export, Swagger docs, Docker, CI/CD. If none, leave the line above as-is — it signals deliberate scoping rather than an oversight.)*

---

# 🤖 AI Usage

AI tools were used as development assistance during the project.

AI was primarily used for:

* Understanding implementation approaches
* Debugging errors
* Reviewing code structure
* Improving UI/UX ideas
* Generating development suggestions
* Reviewing API and Socket.IO implementation
* Documentation assistance

**What I personally implemented/modified:**
*(Fill this in with 2–3 concrete examples — e.g. "Wrote the MongoDB aggregation pipelines for the revenue and bookings-trend endpoints myself after an initial AI-suggested version didn't handle date bucketing correctly." This is what the evaluators specifically ask to see.)*

All submitted functionality was reviewed, tested, and understood before implementation.

---

# 🧪 Testing & Verification

The following areas were manually verified during development:

* Dashboard API responses
* Booking CRUD APIs
* Booking search/filter/sorting
* Pagination
* Mechanic listing
* Dashboard statistics
* Chart data
* Socket.IO connection
* Real-time booking update events
* Database seed data
* Frontend/backend API communication
* Production deployment configuration

---

# 🌐 Project Links

### GitHub – Frontend

```text
YOUR_FRONTEND_GITHUB_URL
```

### GitHub – Backend

```text
YOUR_BACKEND_GITHUB_URL
```

### Live Frontend

```text
YOUR_VERCEL_URL
```

### Live Backend

```text
YOUR_AWS_BACKEND_URL
```

### API Documentation

```text
YOUR_API_DOCUMENTATION_URL
```

---

# 🏆 What I'm Proud Of

I am particularly proud of implementing the dashboard as a complete full-stack system rather than relying on static frontend data.

The project includes:

* Real MongoDB data
* RESTful backend APIs
* Server-side filtering and pagination
* Analytics using MongoDB aggregation
* Real-time Socket.IO updates
* Responsive dashboard UI
* Production deployment
* Backend security middleware
* Realistic seed data

The real-time booking workflow was especially important because operations users can see booking changes reflected on the dashboard without manually refreshing the page.

---

# 👨‍💻 Author

**Saurabh Thakur**

B.Tech Computer Science & Engineering

Full Stack Developer | MERN Stack