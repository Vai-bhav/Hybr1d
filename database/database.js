
const mysql  = require('mysql');
const config = require('../config/config');

const dbConfig = {
    host: config.DATABASE_CONFIG.HOST,
    password: config.DATABASE_CONFIG.PASSWORD,
    user: config.DATABASE_CONFIG.USER,
    database: config.DATABASE_CONFIG.DATABASE
}

const database = mysql.createPool(dbConfig);

exports.executeQuery = executeQuery;

function executeQuery(apiReference, sqlQuery, sqlParams) {
    return new Promise((resolve, reject) => {
        database.query(sqlQuery, sqlParams, (sqlError, sqlResult) => {
            if(sqlError) {
                logging.logError(apiReference, { EVENT: "Executing query error ", QUERY: sqlQuery , PARAMS: sqlParams, SQL_ERROR: sqlError } );
                reject(sqlError);
            }
            resolve(sqlResult); 
        })
    })
}
