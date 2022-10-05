const measurementModel = require("../models/measurement");

const getMeasurementData = async (date1, date2, weight1, weight2) => {
  const dateCheck =
    /([0-2][0-9]{3})-([0-1][0-9])-([0-3][0-9]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])(([\-\+]([0-1][0-9])\:00))?/;

  if (
    (date1 != undefined) & (date2 == undefined) ||
    (date1 == undefined) & (date2 != undefined)
  ) {
    res.status(400).json({ message: "날짜를 입력해주세요." });
  }

  if ((date1 != undefined) & (date2 != undefined)) {
    if (dateCheck.test(date1) == false || dateCheck.test(date2) == false) {
      return res
        .status(400)
        .json({ message: "날짜 형식이 올바르지 않습니다." });
    }
  }

  if (
    (weight1 != undefined) & (weight2 == undefined) ||
    (weight1 == undefined) & (weight2 != undefined)
  ) {
    res.status(400).json({ message: "몸무게를 입력해주세요." });
  }

  if ((weight1 !== undefined) & (weight2 !== undefined)) {
    if (typeof weight1 !== "number" || typeof weight2 !== "number") {
      return res
        .status(400)
        .json({ message: "몸무게 형식이 올바르지 않습니다" });
    }
  }

  if (date1 == undefined) {
    date1 = "null";
  }

  if (date2 == undefined) {
    date2 = "null";
  }

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
