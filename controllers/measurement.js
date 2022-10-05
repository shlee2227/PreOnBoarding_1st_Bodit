const measurementService = require("../services/measurement.js");

const getMeasurementData = async (req, res) => {
  const { date1, date2, weight1, weight2 } = req.body;

  try {
    const getMeasurementData = await measurementService.getMeasurementData(
      date1,
      date2,
      weight1,
      weight2,
    );
    res.status(200).json(getMeasurementData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};

const deleteMeasurementData = async (req, res) => {
  const { measurementId } = req.body;

  const hasKey = { measurementId: false };

  /** 받아온 데이터에 키 + 벨류 값이 존재하는지 확인하는 코드 */
  const requireKey = Object.keys(hasKey);

  Object.entries(req.body).forEach((keyValue) => {
    const [key, value] = keyValue;
    if (requireKey.includes(key) && value) {
      hasKey[key] = true;
    }
  });

  /** 받아온 데이터에 키 + 벨류 값이 없을때 에러를 표시해주는 코드*/
  const hasKeyArray = Object.entries(hasKey);
  for (let i = 0; i < hasKeyArray.length; i++) {
    const [key, value] = hasKeyArray[i];
    if (!value) {
      res.status(400).json({ message: `${key}이/가 없습니다.` });
      return;
    }
  }

  try {
    const deleteMeasurementData =
      await measurementService.deleteMeasurementData(measurementId);
    res.status(200).json({ message: "delete success!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};

module.exports = {
  getMeasurementData,
  deleteMeasurementData,
};
