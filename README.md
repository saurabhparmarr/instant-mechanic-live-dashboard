# 🚗 Instant Mechanic – Live Operations Dashboard

A modern, full-stack Live Vehicle Service Operations Dashboard built for monitoring bookings, mechanics, customers, services, and revenue in real time.

The application is designed as a production-style operations dashboard rather than a simple static dashboard. It retrieves data from MongoDB through a Node.js/Express API and uses Socket.IO WebSockets to reflect booking updates without requiring a complete page reload.

## 🌐 Live Links

* **Frontend:** https://instant-mechanic-live-dashboard-x5r.vercel.app
* **Backend:** https://instant-mechanic-live-dashboard-1.onrender.com/
* **GitHub:** https://github.com/saurabhparmarr/instant-mechanic-live-dashboard.git
* **API Health:** https://instant-mechanic-live-dashboard-1.onrender.com/api/health

---

## ✨ Features

### Dashboard

* Total, today's, completed, pending and cancelled bookings
* Total revenue
* Active mechanics
* New customers
* Booking and revenue trends
* Booking status distribution
* Service/category distribution
* 7D / 30D / 90D analytics

### Bookings

* Search
* Status filtering
* Sorting
* Pagination
* Responsive booking table
* Booking CRUD APIs

### Mechanics

* Search and filtering
* Sorting and pagination
* Current status
* Jobs completed
* Current/last booking
* Specialization

### Customers

* Customer details
* Booking-related information
* Pagination
* Responsive UI

### Real-Time Updates

Socket.IO is used for live booking updates. When a booking is created, updated or deleted, connected dashboards automatically refresh the relevant data without a full page reload.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts, Axios, Socket.IO Client

**Backend:** Node.js, Express.js, Socket.IO, Mongoose

**Database:** MongoDB / MongoDB Atlas

**Security:** Helmet, CORS, Rate Limiting

**Deployment:** Vercel (Frontend), Render (Backend)

---

## 🏗️ Architecture

```text
React + Vite
     │
     │ REST API
     ▼
Node.js + Express
     │
     ▼
MongoDB
     
Socket.IO
     │
     ▼
Real-Time Dashboard Updates
```

---

## 🗄️ Seed Data

The project includes realistic demo data:

* **600 Bookings**
* **60 Customers**
* **25 Mechanics**
* **8 Service Categories**
* 6 booking statuses
* Different dates, vehicles and amounts

---

## 🔌 API

Main API resources:

```text
GET    /api/health
GET    /api/dashboard
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/mechanics
GET    /api/mechanics/:id
GET    /api/customers
```

Bookings and mechanics APIs support pagination, search, filtering and sorting where applicable.

---

## 🚀 Local Setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

Seed database:

```bash
node seed.js
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

## ☁️ Deployment

### Frontend

Deployed on **Vercel**.

### Backend

Deployed on **Render**.

### Database

Hosted on **MongoDB Atlas**.

Production frontend:

```text
https://instant-mechanic-live-dashboard-x5r.vercel.app
```

---

## 🔐 Security & UX

* Helmet security headers
* API rate limiting
* CORS configuration
* Environment variables for secrets
* Centralized error handling
* Loading, error and empty states
* Responsive design

---

## 🤖 AI Usage

**ChatGPT** was used as a development assistant for debugging, code review, Socket.IO implementation, API design, documentation and deployment troubleshooting.

All implemented features were reviewed and tested as part of the project.

---

## 🏆 Highlights

The main highlight of the project is the **real-time operations experience** using Socket.IO, combined with a database-backed dashboard, analytics, booking management and responsive UI.

---

## 👨‍💻 Author

**Saurabh Singh**
B.Tech – Computer Science & Engineering
Full Stack / MERN Developer
