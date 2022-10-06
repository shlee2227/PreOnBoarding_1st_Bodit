const { get } = require("../routes/measurement.js");
const measurementService = require("../services/measurement");

const createMeasurementData = async (req, res) => {
  try {
    const user_id = req.params.userId;
    const { weight, type_data } = req.body;

    if (!weight || !type_data) {
      const error = new Error("데이터를 확인해주세요.");
      error.statusCode = 400;
      throw error;
    }
    await measurementService.createMeasurementData(user_id, weight, type_data);
    res.status(201).json({ message: "측정 기록 생성 성공" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getUserMeasurementData = async (req, res) => {
  try {
    const user_id = req.params.userId;
    const { measurement_id } = req.body;

    const result = await measurementService.getUserMeasurementData(
      user_id,
      measurement_id,
    );
    res
      .status(200)
      .json({ message: "해당 유저의 측정 기록들 조회 완료", result: result });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getMeasurementData = async (req, res) => {
  let { date1, date2, weight1, weight2 } = req.query;

  const dateCheck =
    /([0-2][0-9]{3})-([0-1][0-9])-([0-3][0-9]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])(([\-\+]([0-1][0-9])\:00))?/;

  if (
    (date1 != undefined) & (date2 == undefined) ||
    (date1 == undefined) & (date2 != undefined)
  ) {
    return res.status(400).json({ message: "날짜 범위를 입력해주세요." });
  }

  if ((date1 != undefined) & (date2 != undefined)) {
    if (dateCheck.test(date1) == false || dateCheck.test(date2) == false) {
      return res
        .status(400)
        .json({ message: "날짜 형식이 올바르지 않습니다." });
    }
  }

  const weightCheck = /\d/;

  if (
    (weight1 != undefined) & (weight2 == undefined) ||
    (weight1 == undefined) & (weight2 != undefined)
  ) {
    return res.status(400).json({ message: "몸무게 범위를 입력해주세요." });
  }

  if ((weight1 !== undefined) & (weight2 !== undefined)) {
    if (
      weightCheck.test(weight1) == false ||
      weightCheck.test(weight2) == false
    ) {
      return res
        .status(400)
        .json({ message: "몸무게 형식이 올바르지 않습니다" });
    }
  }

  try {
    const getMeasurementData = await measurementService.getMeasurementData(
      date1,
      date2,
      weight1,
      weight2,
    );

    if (getMeasurementData.length === 0) {
      return res
        .status(200)
        .json({ message: "설정하신 범위에 일치하는 데이터가 없습니다." });
    }
    res.status(200).json(getMeasurementData);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error" });
  }
};

const deleteMeasurementData = async (req, res) => {
  let measurementId = req.params;
  console.log(measurementId);
  measurementId = measurementId.measurementId;

  const hasKey = { measurementId: false };

  /** 받아온 데이터에 키 + 벨류 값이 존재하는지 확인하는 코드 */
  const requireKey = Object.keys(hasKey);

  Object.entries(req.params).forEach((keyValue) => {
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

  const measurementIdCheck = /\d/;

  if (measurementIdCheck.test(measurementId) == false) {
    return res
      .status(400)
      .json({ message: "입력된 데이터 형식이 올바르지 않습니다" });
  }

  try {
    const deleteMeasurementData =
      await measurementService.deleteMeasurementData(measurementId);
    res.status(200).json({ message: "데이터 삭제 성공!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error" });
  }
};

module.exports = {
  createMeasurementData,
  getMeasurementData,
  deleteMeasurementData,
  getUserMeasurementData,
};
