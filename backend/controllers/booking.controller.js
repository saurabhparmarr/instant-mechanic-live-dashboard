
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const Mechanic = require("../models/Mechanic");

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/ApiError");

// =====================================================
// SOCKET.IO
// =====================================================

const { emitOperationUpdate } = require("../utils/socket");

// =====================================================
// GET ALL BOOKINGS
// =====================================================

const getBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    status,
    sortBy = "scheduledAt",
    sortOrder = "desc",
    from,
    to,
  } = req.query;

  const pageNumber = Math.max(
    parseInt(page, 10) || 1,
    1
  );

  const limitNumber = Math.min(
    Math.max(parseInt(limit, 10) || 20, 1),
    100
  );

  const query = {};

  // =====================================================
  // STATUS FILTER
  // =====================================================

  if (status) {
    const allowedStatuses = [
      "Pending",
      "Assigned",
      "Mechanic On The Way",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid booking status");
    }

    query.status = status;
  }

  // =====================================================
  // SEARCH
  // =====================================================

  if (search.trim()) {
    const searchRegex = {
      $regex: search.trim(),
      $options: "i",
    };

    const [customers, mechanics] = await Promise.all([
      Customer.find({
        $or: [
          { name: searchRegex },
          { phone: searchRegex },
          { email: searchRegex },
        ],
      }).select("_id"),

      Mechanic.find({
        $or: [
          { name: searchRegex },
          { phone: searchRegex },
        ],
      }).select("_id"),
    ]);

    const customerIds = customers.map(
      (customer) => customer._id
    );

    const mechanicIds = mechanics.map(
      (mechanic) => mechanic._id
    );

    query.$or = [
      { bookingId: searchRegex },
      {
        "vehicle.registrationNumber": searchRegex,
      },
      {
        "vehicle.make": searchRegex,
      },
      {
        "vehicle.model": searchRegex,
      },
      {
        customer: { $in: customerIds },
      },
      {
        mechanic: { $in: mechanicIds },
      },
    ];
  }

  // =====================================================
  // DATE FILTER
  // =====================================================

  if (from || to) {
    query.scheduledAt = {};

    if (from) {
      const fromDate = new Date(from);

      if (Number.isNaN(fromDate.getTime())) {
        throw new ApiError(400, "Invalid from date");
      }

      fromDate.setHours(0, 0, 0, 0);

      query.scheduledAt.$gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);

      if (Number.isNaN(toDate.getTime())) {
        throw new ApiError(400, "Invalid to date");
      }

      toDate.setHours(23, 59, 59, 999);

      query.scheduledAt.$lte = toDate;
    }
  }

  // =====================================================
  // SORTING
  // =====================================================

  const allowedSortFields = [
    "scheduledAt",
    "createdAt",
    "amount",
    "status",
    "bookingId",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "scheduledAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  // =====================================================
  // PAGINATION
  // =====================================================

  const skip = (pageNumber - 1) * limitNumber;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate({
        path: "customer",
        select: "name phone email",
      })
      .populate({
        path: "mechanic",
        select: "name phone status",
      })
      .sort({
        [safeSortBy]: safeSortOrder,
      })
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Booking.countDocuments(query),
  ]);

  const totalPages = Math.ceil(
    total / limitNumber
  );

  sendResponse({
    res,
    message: "Bookings fetched successfully",
    data: {
      bookings,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage:
          pageNumber < totalPages,
        hasPreviousPage:
          pageNumber > 1,
      },
    },
  });
});

// =====================================================
// GET BOOKING BY ID
// =====================================================

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: "customer",
      select: "name phone email",
    })
    .populate({
      path: "mechanic",
      select: "name phone status",
    })
    .lean();

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }

  sendResponse({
    res,
    message: "Booking fetched successfully",
    data: booking,
  });
});

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body);

  const populatedBooking =
    await Booking.findById(booking._id)
      .populate({
        path: "customer",
        select: "name phone email",
      })
      .populate({
        path: "mechanic",
        select: "name phone status",
      })
      .lean();

  // =====================================================
  // REAL-TIME UPDATE
  // =====================================================

  emitOperationUpdate("booking:updated", {
    action: "created",
    bookingId: booking._id,
  });

  sendResponse({
    res,
    statusCode: 201,
    message: "Booking created successfully",
    data: populatedBooking,
  });
});

// =====================================================
// UPDATE BOOKING
// =====================================================

const updateBooking = asyncHandler(async (req, res) => {
  const booking =
    await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "customer",
        select: "name phone email",
      })
      .populate({
        path: "mechanic",
        select: "name phone status",
      });

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }

  // =====================================================
  // REAL-TIME UPDATE
  // =====================================================

  emitOperationUpdate("booking:updated", {
    action: "updated",
    bookingId: booking._id,
  });

  sendResponse({
    res,
    message: "Booking updated successfully",
    data: booking,
  });
});

// =====================================================
// DELETE BOOKING
// =====================================================

const deleteBooking = asyncHandler(async (req, res) => {
  const booking =
    await Booking.findByIdAndDelete(
      req.params.id
    );

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }

  // =====================================================
  // REAL-TIME UPDATE
  // =====================================================

  emitOperationUpdate("booking:updated", {
    action: "deleted",
    bookingId: booking._id,
  });

  sendResponse({
    res,
    message: "Booking deleted successfully",
    data: null,
  });
});

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
