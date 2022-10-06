const { myDataSource } = require("./typeorm-client");

const getUserByPhone =  async (phone) => {
  const [user] = await myDataSource.query(`
    SELECT * FROM users 
    WHERE phone = ? AND deleted=?
  `, [phone, false])
  return user;
};

const createUser = async (name, birth, height, phone) => {
  return await myDataSource.query(`
    INSERT INTO users (name, birth, height, phone, deleted)
    VALUE (?, ?, ?, ?, ?)
  `,[name, birth, height, phone, false]);
};

const getUsers = async () => {
  return await myDataSource.query(`
    SELECT * FROM users WHERE deleted = ?
  `,[false]);
};

const getAUserByUserId = async (userId) => {
  const [user] = await myDataSource.query(`
    SELECT * FROM users WHERE id = ? AND deleted = ?
  `, [userId, false])
  return user;
};

const updateUser = async (userId, name, birth, height, phone) => {
  return await myDataSource.query(`
    UPDATE users
    SET name = ?, birth = ?, height = ?, phone = ?
    WHERE id = ?
  `,[name, birth, height, phone, userId]);
};

const deleteUser = async (userId) => {
  const queryRunner = myDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await myDataSource.query(`
      UPDATE users
      SET name = ?, birth = REGEXP_REPLACE(birth, '-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$', ?), phone = ?
      WHERE id = ?
    `,['***', '-**-**', '***-****-****', userId]);
    await myDataSource.query(`
      UPDATE users
      SET deleted = ?
      WHERE id = ?
    `,[true, userId]);
    await queryRunner.commitTransaction();
  }
  catch (err) {
    await queryRunner.rollbackTransaction();
    const error = new Error('회원 삭제 실패')
    error.statusCode = 500
    throw error
  } 
  finally {
    await queryRunner.release();
  }

  return;
};

module.exports = {
  getUserByPhone, createUser, getUsers, getAUserByUserId, updateUser, deleteUser
};
