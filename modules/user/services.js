
const commonFunction = require("../../utilities/commonFunction");
const constants      = require('../../properties/constants');
const config         = require('../../config/config');

const crypto         = require('crypto');
const jwt            = require('jsonwebtoken');

exports.registerUser     = registerUser;
exports.encryptPassword  = encryptPassword;
exports.fetchUserDetails = fetchUserDetails;
exports.loginUser        = loginUser;

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

        const access_token = createToken(userData);

        await commonFunction.updateDataIntoTable(constants.TABLENAME.USER_DATA, {
            access_token: access_token
        }, {
            user_id: userData.user_id
        });

        return {
            insertUser: insertResult,
            userData: {
                user_id  : userData.user_id,
                username : userData.username,
                user_type: userData.user_type,
                access_token
            }
        };
    }catch(error) {
        throw new Error("Error in user creation services ", error);
    }
}

function createToken(opts) {
    try {
        const token = jwt.sign({
            user_id  : opts.user_id,
            email    : opts.email,
            user_type: opts.user_type
        }, 
        config.SECRET_KEY, {
            expiresIn: constants.JWT_EXPIRY_TIME
        });
    
        return token;
    }catch(error) {
        throw new Error("Error while generating token: ", error);
    }
}

async function fetchUserDetails(opts) {
    try {
        const tableName = constants.TABLENAME.USER_DATA;
        const userData = {
            email: opts.email
        };
        if(opts.user_type) userData.user_type = opts.user_type;
        const userDetails = await commonFunction.fetchDataFromTable(tableName, "user_id, email, username, encrypted_password, user_type, access_token", userData);

        return userDetails;
    }catch(error) {
        throw new Error("USER FETCH DATA ERROR: ", error);
    }
}

async function loginUser(opts) {
    try {

        const access_token = createToken(opts);

        await commonFunction.updateDataIntoTable(constants.TABLENAME.USER_DATA, {
            access_token
        }, {
            email: opts.email,
            user_type: opts.user_type
        })

        opts.access_token = access_token;

        return;

    }catch(error) {
        throw new Error("LOGIN USER ERROR: ", error);
    }
}
