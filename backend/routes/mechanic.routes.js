const express = require("express");

const {
  getMechanics,
  getMechanicById,
} = require("../controllers/mechanic.controller");

const router = express.Router();

router.get("/", getMechanics);

router.get("/:id", getMechanicById);

module.exports = router;