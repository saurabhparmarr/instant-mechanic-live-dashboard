const express = require("express");

const {
  getDashboardOverview,
  getDashboardStats,
  getBookingStatusDistribution,
  getRevenueTrend,
  getBookingsTrend,
  getServiceDistribution,
} = require("../controllers/dashboard.controller");

const router = express.Router();

// Dashboard overview
router.get("/", getDashboardOverview);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Booking status distribution
router.get("/booking-status", getBookingStatusDistribution);

// Revenue trend
router.get("/revenue-trend", getRevenueTrend);

// Services distribution
router.get("/services", getServiceDistribution);

// Bookings over time
router.get("/bookings-trend", getBookingsTrend);

module.exports = router;