const validateWeight = (weight) => {
  const weightRegExp = /^(\d{2,3})+(?:[.]?[\d]?)$/;
  if (!weightRegExp.test(weight)) {
    const err = new Error("몸무게는 소수점 한자리까지 가능합니다.");
    err.statusCode = 400;
    throw err;
  }
};

const validateWristMobility = (data) => {
  const wristMobilityRegExp = /^[0-9]{1}$|^[1-8]{1}[0-9]{1}$|^9{1}0{1}$/;
  if (!wristMobilityRegExp.test(data)) {
    const err = new Error("1 - 손목 가동성의 범위가 벗어났습니다. ");
    err.statusCode = 400;
    throw err;
  }
};

const validateShoulderFlexion = (data) => {
  const shoulderFlexionRegExp = /^[3-9]{1}[0-9]{1}$|^1{1}[0-6]{1}[0-9]{1}$|^1{1}7{1}0{1}$/;
  if (!shoulderFlexionRegExp.test(data)) {
    const err = new Error("2 - 어깨 굴곡의 범위가 벗어났습니다.");
    err.statusCode = 400;
    throw err;
  }
};

const validateShoulderExtension = (data) => {
  const shoulderRegExp = /^-[3-5]{1}[0-9]{1}$|^-6{1}0{1}$/;
  if (!shoulderRegExp.test(data)) {
    const err = new Error("3 - 어깨 신전의 범위가 벗어났습니다.");
    err.statusCode = 400;
    throw err;
  }
};

const validateWalking = (data) => {
  const walkingRegExp = /^[0-9]{1}$|^[1-9]{1}[0-9]{1}$|^1{1}0{1}0{1}$/;
  if (!walkingRegExp.test(data)) {
    const err = new Error("4 - 보행의 범위가 벗어났습니다.");
    err.statusCode = 400;
    throw err;
  }
};

const validateBreathingBalance = (data) => {
  const breathingBalanceRegExp = /^-?[0-9]{1}$|^-?[1-9]{1}[0-9]{1}$|^-?1{1}0{1}0{1}$/;
  if (!breathingBalanceRegExp.test(data)) {
    const err = new Error("5 - 호흡 균형의 범위가 벗어났습니다.");
    err.statusCode = 400;
    throw err;
  }
};

module.exports = {
  validateWeight,
  validateWristMobility,
  validateShoulderFlexion,
  validateShoulderExtension,
  validateWalking,
  validateBreathingBalance,
};
