
const mysql = require('mysql');

let dbConfig = {
    host: "localhost",
    password: "",
    user: "root",
    database: "hybr1d"
}

const database = mysql.createPool(dbConfig);

exports.executeQuery = executeQuery;

function executeQuery(sqlQuery, sqlParams) {
    return new Promise((resolve, reject) => {
        database.query(sqlQuery, sqlParams, (sqlError, sqlResult) => {
            if(sqlError) {
                console.error("Error while executing query ", sqlError);
                reject(sqlError);
            }
            resolve(sqlResult); 
        })
    })
}
