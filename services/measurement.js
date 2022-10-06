const measurementModel = require("../models/measurement");
const {
  validateWeight,
  validateWristMobility,
  validateShoulderFlexion,
  validateShoulderExtension,
  validateWalking,
  validateBreathingBalance } = require("../utils/validation")

const createMeasurementData = async (user_id, weight, dataTypeArr) => {
  
  // 존재하는 유저id인지 확인
  const userCheck = await measurementModel.getUserByUserId(user_id);
  
  if (!userCheck) {
    const error = new Error("존재하지 않는 유저 ID입니다.");
    error.statusCode = 404;
    throw error;
  }
  
  // 몸무게 유효성 체크
  validateWeight(weight)
  
  let measurementData = [];
  let data_id;
  let value;
  
  // 존재하는 data_type_id인지 확인
  for (let i = 0; i < dataTypeArr.length; i++) {
    data_id = dataTypeArr[i].data_id
    value = dataTypeArr[i].value
      
    const dataTypeIdCheck = await measurementModel.getDataTypeIdByTypeId(data_id)
  
    if (!dataTypeIdCheck) {
      const error = new Error("존재하지 않는 데이터 타입 ID입니다.");
      error.statusCode = 404;
      throw error;
    }
  
    // 데이터타입 유효성 검사
    if (data_id === 1) {
      validateWristMobility(value);
    } else if (data_id === 2) {
      // data_type_id가 2나 3이면 두개데이터 동시에 와야한다.
      if (!(dataTypeArr[i + 1]) || (dataTypeArr[i + 1].data_id !== 3)) {
        const error = new Error("어깨신전 데이터(3번)가 같이 필요합니다.");
        error.statusCode = 400;
        throw error;
      } else {
        validateShoulderFlexion(value);
        validateShoulderExtension(dataTypeArr[i+1].value);
      }
    } else if (data_id === 3) {
      // data_type_id가 2나 3이면 두개데이터 동시에 와야한다.
      if (!(dataTypeArr[i - 1]) || (dataTypeArr[i - 1].data_id !== 2)) {
        const error = new Error("어깨굴곡 데이터(2번)가 같이 필요합니다.");
        error.statusCode = 400;
        throw error;
      }
    } else if (data_id === 4) {
      validateWalking(value)
    } else if (data_id === 5) {
      validateBreathingBalance(value)
    }
  
    // 유효성 검사 끝
    measurementData.push({
      measurement_id: null,
      data_type_id  : data_id,
      data          : value
    })
  }
  
  // 같은 유저 아이디, 몸무게의 측정 기록이 이미 존재하는가?
  const measurementCheck = await measurementModel.getMeasurementByUserIdAndWeight(user_id, weight)

  if (measurementCheck) {
    // 측정 기록 존재
    const measurementDataCheck = await measurementModel.getMeasurementDataByIdAndTypeId(measurementCheck.id, data_id)
    if (measurementDataCheck) {
      // 측정 데이터 존재
      const error = new Error("측정 데이터의 종류가 중복됩니다.");
      error.statusCode = 409;
      throw error;
    } else {
      // 측정 데이터 존재 X
      await measurementModel.createOnlyMeasurementData(measurementCheck.id, measurementData)
      return
    }
  }

  // 모든 검사 끝 => 새 데이터 생성
  await measurementModel.createMeasurementData(user_id, weight, measurementData)
};

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
  createMeasurementData,
  getMeasurementData,
  deleteMeasurementData,
};
