const Mechanic = require("../models/Mechanic");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/ApiError");

const getMechanics = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
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

  // -------------------------
  // STATUS FILTER
  // -------------------------
  if (status) {
    const allowedStatuses = [
      "Available",
      "Busy",
      "Offline",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid mechanic status");
    }

    query.status = status;
  }

  // -------------------------
  // SEARCH
  // -------------------------
  if (search.trim()) {
    const searchRegex = {
      $regex: search.trim(),
      $options: "i",
    };

    query.$or = [
      {
        name: searchRegex,
      },
      {
        phone: searchRegex,
      },
      {
        email: searchRegex,
      },
      {
        specialization: searchRegex,
      },
    ];
  }

  // -------------------------
  // SORTING
  // -------------------------

  const allowedSortFields = [
    "name",
    "status",
    "createdAt",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  const skip = (pageNumber - 1) * limitNumber;

  const [mechanics, total] = await Promise.all([
    Mechanic.find(query)
      .populate({
        path: "currentBooking",
        select:
          "bookingId status scheduledAt vehicle service customer",
        populate: [
          {
            path: "customer",
            select: "name phone",
          },
        ],
      })
      .populate({
        path: "lastBooking",
        select:
          "bookingId status scheduledAt vehicle service customer",
      })
      .sort({
        [safeSortBy]: safeSortOrder,
        _id: -1,
      })
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Mechanic.countDocuments(query),
  ]);

  const totalPages = Math.ceil(
    total / limitNumber
  );

  // -------------------------
  // ADD COMPLETED JOBS
  // -------------------------

  const mechanicIds = mechanics.map(
    (mechanic) => mechanic._id
  );

  const completedJobs = await Booking.aggregate([
    {
      $match: {
        mechanic: {
          $in: mechanicIds,
        },
        status: "Completed",
      },
    },
    {
      $group: {
        _id: "$mechanic",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const completedMap = new Map(
    completedJobs.map((item) => [
      item._id.toString(),
      item.count,
    ])
  );

  const enrichedMechanics = mechanics.map((mechanic) => ({
    ...mechanic,

    jobsCompleted:
      completedMap.get(
        mechanic._id.toString()
      ) ??
      mechanic.jobsCompleted ??
      0,
  }));

  // -------------------------
  // SORT BY COMPLETED JOBS
  // -------------------------
  if (sortBy === "jobsCompleted") {
    enrichedMechanics.sort((a, b) => {
      const aJobs = a.jobsCompleted ?? 0;
      const bJobs = b.jobsCompleted ?? 0;

      return sortOrder === "asc"
        ? aJobs - bJobs
        : bJobs - aJobs;
    });
  }

  sendResponse({
    res,
    message: "Mechanics fetched successfully",
    data: {
      mechanics: enrichedMechanics,

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

const getMechanicById = asyncHandler(async (req, res) => {
  const mechanic = await Mechanic.findById(req.params.id)
    .populate({
      path: "currentBooking",
      select:
        "bookingId status scheduledAt vehicle service customer",
      populate: {
        path: "customer",
        select: "name phone",
      },
    })
    .populate({
      path: "lastBooking",
      select:
        "bookingId status scheduledAt vehicle service customer",
    })
    .lean();

  if (!mechanic) {
    throw new ApiError(
      404,
      "Mechanic not found"
    );
  }

  const jobsCompleted = await Booking.countDocuments({
    mechanic: mechanic._id,
    status: "Completed",
  });

  sendResponse({
    res,
    message: "Mechanic fetched successfully",
    data: {
      ...mechanic,
      jobsCompleted,
    },
  });
});

module.exports = {
  getMechanics,
  getMechanicById,
};
