const express = require("express");
const measurementController = require("../controllers/measurement");

const router = express.Router();

router.get("/measurement", measurementController.getMeasurementData);
router.delete(
  "/measurement/:measurementId",
  measurementController.deleteMeasurementData,
);

module.exports = router;
