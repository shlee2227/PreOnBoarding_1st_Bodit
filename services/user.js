const userDao = require("../models/user");

const checkUserInput = async (name, birth, height, phone) => {
  const name_regex = /^[가-힣a-zA-Z]{1,50}$/;
  if (!name_regex.test(name)) {
    const error = new Error('유효하지 않은 name입니다.')
    error.statusCode = 400
    throw error
  }
  
  const birth_regex = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
   if (!birth_regex.test(birth)) {
    const error = new Error('유효하지 않은 birth입니다.')
    error.statusCode = 400
    throw error
   }

  const height_regex = /^\d{2,3}[.]\d{1}$/
  if (!height_regex.test(height)) {
    const error = new Error('유효하지 않은 height입니다.')
    error.statusCode = 400
    throw error
  }

  const phone_regex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/;
   if (!phone_regex.test(phone)) {
     const error = new Error('유효하지 않은 phone입니다.')
     error.statusCode = 400
     throw error
   }

   return;
};

const createUser = async (name, birth, height, phone) => {
  const user = await userDao.getUserByPhone(phone)
  if (user) {
    const error = new Error('이미 등록된 phone입니다.')
    error.statusCode = 400
    throw error
  }
  await userDao.createUser(name, birth, height, phone)

  return;
};

const getUsers = async () => {
  return await userDao.getUsers();
};

const getAUserByUserId = async (userId) => {
  const user =  await userDao.getAUserByUserId(userId)
  if (!user) {
    const error = new Error('존재하지 않는 user_id입니다.')
    error.statusCode = 404
    throw error
  }
  return user;
};

const updateUser = async (userId, name, birth, height, phone) => {
  const user = await userDao.getUserByPhone(phone)
  if (user) {
    const error = new Error('이미 등록된 phone입니다.')
    error.statusCode = 400
    throw error
  }
  return await userDao.updateUser(userId, name, birth, height, phone);
};

const deleteUser = async (userId) => {
  return await userDao.deleteUser(userId);
};

module.exports = {
  checkUserInput, createUser, getUsers, getAUserByUserId, updateUser, deleteUser
};

