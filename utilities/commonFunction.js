
const dbHandler = require('../database/database');

exports.insertDataIntoTable = (apiReference, tableName, insertObj) => {
    return new Promise(async (resolve, reject) => {
        let sql = `INSERT INTO ${tableName} SET ? `;
        try {
            const insertData = await dbHandler.executeQuery(apiReference, sql, [insertObj]);
            resolve(insertData);
        }catch(error) {
            reject(error);
        }
    })
}

exports.updateDataIntoTable = (apiReference, tableName, updateObj, whereObj) => {
    return new Promise( async(resolve, reject) => {
        let sqlQuery = `UPDATE ${tableName} SET ? WHERE 1=1 `;
        let values = [updateObj];
        if(whereObj.hasOwnProperty('user_id')) {
            sqlQuery += ' AND user_id = ? ';
            values.push(whereObj['user_id'])
        }

        try{
            await dbHandler.executeQuery(apiReference, sqlQuery, values);
            resolve();
        }catch(error) {
            reject(error);
        }

    })
}

exports.fetchDataFromTable = (apiReference, tableName, selectItems, criteria) => {
    return new Promise( async(resolve, reject) => {
        
        let columns = selectItems || "*";

        let sqlQuery = `SELECT ${columns} FROM ${tableName} WHERE 1=1 `
        let values = [];

        if(criteria.hasOwnProperty('email')) {
            sqlQuery += " AND email = ? ";
            values.push(criteria.email);
        }

        if(criteria.hasOwnProperty('user_type')) {
            sqlQuery += " AND user_type = ? ";
            values.push(criteria.user_type);
        }

        try{
            const data = await dbHandler.executeQuery(apiReference, sqlQuery, values);
            resolve(data);
        }catch(error) {
            reject(error);
        }
    })
}