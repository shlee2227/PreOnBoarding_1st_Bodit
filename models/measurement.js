const { query } = require("express");
const { myDataSource } = require("./typeorm-client");

const getUserByUserId = async (user_id) => {
  const [user] = await myDataSource.query(
      `SELECT id FROM users WHERE id = ?`,
      [user_id]
  );
  return user;
};

const getMeasurementByIdAndUser = async (measurement_id, user_id) => {
  const [measurement] = await myDataSource.query(
      `SELECT id FROM measurements WHERE id = ? AND user_id = ?`,
      [measurement_id, user_id]
  );
  return measurement;
}

const getUserMeasurementData = async (user_id, measurement_id) => {
  const [result] = await myDataSource.query(
      `SELECT 
          u.id,
          u.name,
          u.birth,
          u.height,
          u.phone,
          m.created_at,
          m.weight,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                      'data_type_id', md.data_type_id,
                      'data_type_name', dt.name,
                      'data', md.data
              )
          ) AS measurement_data
      FROM 
          users AS u 
      JOIN
          measurements AS m ON m.user_id = u.id
      JOIN 
          measurement_data AS md ON m.id = md.measurement_id
      JOIN
          data_types AS dt ON md.data_type_id = dt.id
      WHERE
          u.id = ? AND m.id = ? ;`,
      [user_id, measurement_id]
  )
  return result
}

const getMeasurementData = async (date1, date2, weight1, weight2) => {
  const getMeasurementData = await myDataSource.query(
    `
    SELECT
      user_id as id, 
      weight,
      date_format(created_at, "%Y-%m-%d %h:%m:%s") as date,
      JSON_ARRAYAGG(JSON_OBJECT("value", measurement_data.data, "name", data_types.name)) as typeData


    FROM measurements
      INNER JOIN measurement_data ON measurements.id = measurement_data.measurement_id
      INNER JOIN data_types ON measurement_data.data_type_id = data_types.id

    WHERE 1=1 AND ((("null" IN (?))AND(created_at=created_at))OR(created_at BETWEEN ? AND ? ))
    OR
    ((("null" IN (?))AND(weight=weight))OR(weight BETWEEN ? AND ? ))

    GROUP BY user_id, weight, created_at

    `,
    [date1, date1, date2, weight1, weight1, weight2],
  );
  return getMeasurementData;
};

const deleteMeasurementData = async (measurementId) => {
  const queryRunner = myDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.query(
      `DELETE FROM measurement_data WHERE measurement_id=?`,
      [measurementId],
    );
    await queryRunner.query(
      `DELETE FROM measurements WHERE measurements.id = ?`,
      [measurementId],
    );
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    res.status(400);
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  getUserByUserId,
  getMeasurementByIdAndUser,
  getMeasurementData,
  deleteMeasurementData,
  getUserMeasurementData
};
