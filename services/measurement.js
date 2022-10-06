const measurementDao = require("../models/measurement");

const getMeasurementData = async (user_id, measurement_id) => {
  
  const userCheck = await measurementDao.getUserByUserId(user_id);

  if (!userCheck) {
    const error = new Error("존재하지 않는 유저 ID입니다.");
    error.statusCode = 404;
    throw error;
  }

  const measurementIdCheck = await measurementDao.getMeasurementByIdAndUser(measurement_id, user_id);
  
  if (!measurementIdCheck) {
    const error = new Error("유저 ID와 측정 기록 ID를 확인하세요.");
    error.statusCode = 404;
    throw error;
  }

  const result = await measurementDao.getMeasurementData(user_id, measurementIdCheck.id)
  return result
}

module.exports = {
  getMeasurementData
}