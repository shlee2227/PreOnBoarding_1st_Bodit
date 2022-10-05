const express = require("express");
const measurementController = require("../controllers/measurement");

const router = express.Router();

router.get("/measurement", measurementController.getMeasurementData);
router.delete("/measurement", measurementController.deleteMeasurementData);

module.exports = router;
