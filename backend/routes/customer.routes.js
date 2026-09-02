const express = require("express");

const {
  getCustomers,
  getCustomerById,
} = require("../controllers/customer.controller");

const router = express.Router();

router.get("/", getCustomers);

router.get("/:id", getCustomerById);

module.exports = router;