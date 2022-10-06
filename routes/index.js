const express = require('express');
const router = express.Router();

const usersRouter = require("./user");
const measurementsRouter = require("./measurement");

router.use("/users", usersRouter);
router.use("/measurement-data", measurementsRouter);

module.exports = router;