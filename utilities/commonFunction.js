
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

exports.updateDataIntoTable = (tableName, updateObj, whereObj) => {
    return new Promise( async(resolve, reject) => {
        let sqlQuery = `UPDATE ${tableName} SET ? WHERE 1=1 `;
        let values = [updateObj];
        if(whereObj.hasOwnProperty('user_id')) {
            sqlQuery += ' AND user_id = ? ';
            values.push(whereObj['user_id'])
        }

        try{
            await dbHandler.executeQuery(sqlQuery, values);
            resolve();
        }catch(error) {
            reject(error);
        }

    })
}