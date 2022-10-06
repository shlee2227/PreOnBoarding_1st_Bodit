const measurementModel = require("../models/measurement");

const getUserMeasurementData = async (user_id, measurement_id) => {
  
  const userCheck = await measurementModel.getUserByUserId(user_id);

  if (!userCheck) {
    const error = new Error("존재하지 않는 유저 ID입니다.");
    error.statusCode = 404;
    throw error;
  }

  const measurementIdCheck = await measurementModel.getMeasurementByIdAndUser(measurement_id, user_id);
  
  if (!measurementIdCheck) {
    const error = new Error("유저 ID와 측정 기록 ID를 확인하세요.");
    error.statusCode = 404;
    throw error;
  }

  const result = await measurementModel.getUserMeasurementData(user_id, measurementIdCheck.id)
  return result
}

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
  getUserMeasurementData
};
