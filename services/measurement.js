const measurementModel = require("../models/measurement");

const getMeasurementData = async (date1, date2, weight1, weight2) => {
  if (weight1 == undefined) {
    weight1 = "null";
  }

  if (weight2 == undefined) {
    weight2 = "null";
  }

  try {
    const getMeasurementData = await measurementModel.getMeasurementData(
      date1,
      date2,
      weight1,
      weight2,
    );
    return getMeasurementData;
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};

const deleteMeasurementData = async (measurementId) => {
  try {
    const deleteMeasurementData = await measurementModel.deleteMeasurementData(
      measurementId,
    );
    return deleteMeasurementData;
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};

module.exports = {
  getMeasurementData,
  deleteMeasurementData,
};
