
const commonFunction = require("../../utilities/commonFunction");
const constants      = require('../../properties/constants');

const crypto         = require('crypto');

exports.registerUser     = registerUser;
exports.encryptPassword  = encryptPassword;

async function encryptPassword(opts) {
    return crypto.createHash('md5').update(opts.password).digest('hex');
}

async function registerUser(opts) {
    try{
        const userData = {
            username          : opts.username,
            email             : opts.email,
            encrypted_password: opts.encryptedPassword,
            user_type         : opts.user_type
        }

        const insertResult = await commonFunction.insertDataIntoTable(constants.TABLENAME.USER_DATA, userData);

        userData.user_id = insertResult.insertId;

        return {
            insertUser: insertResult,
            userData: {
                user_id: userData.user_id,
                username: userData.username,
                user_type: userData.user_type,
            }
        };
    }catch(error) {
        throw new Error("Error in user data insertion services ", error);
    }
}
