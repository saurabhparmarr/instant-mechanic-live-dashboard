const express = require("express");

const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/booking.controller");

const router = express.Router();

// GET /api/bookings
router.get("/", getBookings);

// POST /api/bookings
router.post("/", createBooking);

// GET /api/bookings/:id
router.get("/:id", getBookingById);

// PUT /api/bookings/:id
router.put("/:id", updateBooking);

// PATCH /api/bookings/:id
router.patch("/:id", updateBooking);

// DELETE /api/bookings/:id
router.delete("/:id", deleteBooking);

module.exports = router;