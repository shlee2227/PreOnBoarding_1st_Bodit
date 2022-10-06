const { query } = require("express");
const { myDataSource } = require("./typeorm-client");

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

  // try {

  //   const transaction = await myDataSource.query(
  //     `
  //     START TRANSACTION
  //     `,
  //   );

  //   const deleteMeasurementData = await myDataSource.query(
  //     `
  //     DELETE FROM measurement_data
  //     WHERE measurement_id = ?
  //     `,
  //     [measurementId],
  //   );

  //   const deleteMeasurement = await myDataSource.query(
  //     `
  //     DELETE FROM measurements
  //     WHERE measurements.id = ?
  //     `,
  //     [measurementId],
  //   );

  //   const commit = await myDataSource.query(
  //     `
  //     COMMIT
  //     `,
  //   );
  //   return transaction, deleteMeasurementData, deleteMeasurement, commit;
  // } catch (err) {
  //   const rollback = await myDataSource.query(
  //     `
  //     ROLLBACK
  //     `,
  //   );
  //   res.status(400).json({ message: "transcation failed" });
  // }
};

module.exports = {
  getMeasurementData,
  deleteMeasurementData,
};
