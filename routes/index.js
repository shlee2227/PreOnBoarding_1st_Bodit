const express = require("express");
const router = express.Router();

const usersRouter = require("./user");
const measurementRouter = require("./measurement");

router.use("/users", usersRouter);
router.use("", measurementRouter);
router.use("/measurement-data", measurementRouter);

module.exports = router;
