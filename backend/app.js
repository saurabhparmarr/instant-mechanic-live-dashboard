const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");
const dashboardRoutes = require("./routes/dashboard.routes");
const bookingRoutes = require("./routes/booking.routes");
const mechanicRoutes = require("./routes/mechanic.routes");
const customerRoutes = require("./routes/customer.routes");

const app = express();
app.disable("x-powered-by");

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// Middlewares
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Live Operations Dashboard API is healthy",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/customers", customerRoutes);
// API routes will come here
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Live Operations Dashboard API",
  });
});
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});
// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;