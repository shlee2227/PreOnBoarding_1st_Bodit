const express = require("express");
const measurementController = require("../controllers/measurement");

const router = express.Router();

router.get("/user/:userId", measurementController.getMeasurementData);

module.exports = router;