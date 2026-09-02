const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/ApiError");

const getCustomers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
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
  // SEARCH
  // -------------------------
  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    const searchRegex = {
      $regex: trimmedSearch,
      $options: "i",
    };

    query.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }

  // -------------------------
  // SORTING
  // -------------------------
  const allowedSortFields = [
    "createdAt",
    "name",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  // -------------------------
  // PAGINATION
  // -------------------------
  const skip = (pageNumber - 1) * limitNumber;

  const [customers, total] = await Promise.all([
    Customer.find(query)
      .sort({
        [safeSortBy]: safeSortOrder,
      })
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Customer.countDocuments(query),
  ]);

  const totalPages = Math.ceil(
    total / limitNumber
  );

  sendResponse({
    res,
    message: "Customers fetched successfully",
    data: {
      customers,
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

const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(
    req.params.id
  ).lean();

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found"
    );
  }

  sendResponse({
    res,
    message: "Customer fetched successfully",
    data: customer,
  });
});

module.exports = {
  getCustomers,
  getCustomerById,
};