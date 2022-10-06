const express = require("express");
const measurementController = require("../controllers/measurement");

const router = express.Router();

router.post("/user/:userId", measurementController.createMeasurementData);
router.get("/user/:userId", measurementController.getUserMeasurementData);
router.get("/measurement", measurementController.getMeasurementData);
router.delete(
  "/measurement/:measurementId",
  measurementController.deleteMeasurementData,
);

module.exports = router;
