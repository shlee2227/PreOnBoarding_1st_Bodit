const measurementService = require("../services/measurement");

const getMeasurementData = async (req, res) => {
  try {
    const user_id = req.params.userId;
    const { measurement_id } = req.body;
  
    const result = await measurementService.getMeasurementData(user_id, measurement_id)
    res.status(200).json({ message: "해당 유저의 측정 기록들 조회 완료", result : result});
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  getMeasurementData,
};