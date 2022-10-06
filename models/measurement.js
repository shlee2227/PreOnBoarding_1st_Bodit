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

const getMeasurementData = async (user_id, measurement_id) => {
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

module.exports = {
    getUserByUserId,
    getMeasurementByIdAndUser,
    getMeasurementData
}