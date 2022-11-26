
const dbHandler = require('../database/database');

exports.insertDataIntoTable = (tableName, insertObj) => {
    return new Promise(async (resolve, reject) => {
        let sql = `INSERT INTO ${tableName} SET ? `;
        try {
            const insertData = await dbHandler.executeQuery(sql, [insertObj]);
            resolve(insertData);
        }catch(error) {
            reject(error);
        }
    })
}
