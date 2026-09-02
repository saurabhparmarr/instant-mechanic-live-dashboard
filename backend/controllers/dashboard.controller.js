const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const Mechanic = require("../models/Mechanic");

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");


// =====================================================
// GET DASHBOARD OVERVIEW
// =====================================================

const getDashboardOverview = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalBookings,
    todayBookings,
    activeBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalCustomers,
    newCustomers,
    totalMechanics,
    availableMechanics,
    revenueResult,
  ] = await Promise.all([
    Booking.countDocuments(),

    Booking.countDocuments({
      scheduledAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }),

    Booking.countDocuments({
      status: {
        $in: [
          "Assigned",
          "Mechanic On The Way",
          "In Progress",
        ],
      },
    }),

    Booking.countDocuments({
      status: "Completed",
    }),

    Booking.countDocuments({
      status: "Pending",
    }),

    Booking.countDocuments({
      status: "Cancelled",
    }),

    Customer.countDocuments(),

    Customer.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),

    Mechanic.countDocuments(),

    Mechanic.countDocuments({
      status: "Available",
    }),

    Booking.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  const totalRevenue =
    revenueResult[0]?.totalRevenue || 0;

  sendResponse({
    res,
    message: "Dashboard overview fetched successfully",

    data: {
      bookings: {
        total: totalBookings,
        today: todayBookings,
        active: activeBookings,
        completed: completedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings,
      },

      revenue: {
        total: totalRevenue,
      },

      customers: {
        total: totalCustomers,
        newThisMonth: newCustomers,
      },

      mechanics: {
        total: totalMechanics,
        available: availableMechanics,
      },
    },
  });
});


// =====================================================
// GET DASHBOARD STATS
// =====================================================

const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalBookings,
    todayBookings,
    activeBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalCustomers,
    newCustomers,
    totalMechanics,
    availableMechanics,
    revenueResult,
  ] = await Promise.all([
    Booking.countDocuments(),

    Booking.countDocuments({
      scheduledAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }),

    Booking.countDocuments({
      status: {
        $in: [
          "Assigned",
          "Mechanic On The Way",
          "In Progress",
        ],
      },
    }),

    Booking.countDocuments({
      status: "Completed",
    }),

    Booking.countDocuments({
      status: "Pending",
    }),

    Booking.countDocuments({
      status: "Cancelled",
    }),

    Customer.countDocuments(),

    Customer.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),

    Mechanic.countDocuments(),

    Mechanic.countDocuments({
      status: "Available",
    }),

    Booking.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  const totalRevenue =
    revenueResult[0]?.totalRevenue || 0;

  sendResponse({
    res,
    message: "Dashboard statistics fetched successfully",

    data: {
      totalBookings,
      todayBookings,
      activeBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      totalCustomers,
      newCustomers,
      totalMechanics,
      availableMechanics,
    },
  });
});


// =====================================================
// GET BOOKING STATUS DISTRIBUTION
// =====================================================

const getBookingStatusDistribution = asyncHandler(
  async (req, res) => {
    const distribution = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

    sendResponse({
      res,
      message:
        "Booking status distribution fetched successfully",

      data: distribution,
    });
  }
);


// =====================================================
// GET REVENUE TREND
// =====================================================

const getRevenueTrend = asyncHandler(async (req, res) => {
  const days = Math.min(
    Math.max(Number(req.query.days) || 30, 7),
    90
  );

  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - days
  );

  startDate.setHours(0, 0, 0, 0);

  const revenue = await Booking.aggregate([
    {
      $match: {
        status: "Completed",

        scheduledAt: {
          $gte: startDate,
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$scheduledAt",
          },
        },

        revenue: {
          $sum: "$amount",
        },

        bookings: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        bookings: 1,
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
  ]);

  sendResponse({
    res,
    message: "Revenue trend fetched successfully",

    data: revenue,
  });
});


// =====================================================
// GET BOOKINGS TREND
// =====================================================

const getBookingsTrend = asyncHandler(async (req, res) => {
  const days = Math.min(
    Math.max(Number(req.query.days) || 30, 7),
    90
  );

  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - days
  );

  startDate.setHours(0, 0, 0, 0);

  const bookings = await Booking.aggregate([
    {
      $match: {
        scheduledAt: {
          $gte: startDate,
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$scheduledAt",
          },
        },

        bookings: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        bookings: 1,
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
  ]);

  sendResponse({
    res,
    message: "Bookings trend fetched successfully",

    data: bookings,
  });
});


// =====================================================
// GET SERVICE DISTRIBUTION
// =====================================================

const getServiceDistribution = asyncHandler(
  async (req, res) => {
    const services = await Booking.aggregate([
      {
        $group: {
          _id: "$service.category",

          bookings: {
            $sum: 1,
          },

          revenue: {
            $sum: "$amount",
          },
        },
      },

      {
        $project: {
          _id: 0,
          service: "$_id",
          bookings: 1,
          revenue: 1,
        },
      },

      {
        $sort: {
          bookings: -1,
        },
      },
    ]);

    sendResponse({
      res,
      message:
        "Service distribution fetched successfully",

      data: services,
    });
  }
);


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getDashboardOverview,
  getDashboardStats,
  getBookingStatusDistribution,
  getRevenueTrend,
  getBookingsTrend,
  getServiceDistribution,
};