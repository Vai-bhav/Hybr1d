
const services = require('./services');
const logging  = require('../../logging/logging');

const _ = require('underscore');

exports.registerUser = registerUser;
exports.loginUser    = loginUser;

async function registerUser(req, res) {
    const opts = req.body;
    try{
        let email = opts.email;

        let userDetails = await services.fetchUserDetails(req.apiReference, { email });

        if(!_.isEmpty(userDetails)) {
            return res.status(200).send({
                message: "USER ALREADY REGISTERED",
                data: {
                    user_id     : userDetails[0].user_id,
                    email       : userDetails[0].email,
                    username    : userDetails[0].username,
                    user_type   : userDetails[0].user_type,
                    access_token: userDetails[0].access_token
                }
            });
        }

        opts.encryptedPassword = await services.encryptPassword(opts);

        const result = await services.registerUser(req.apiReference ,opts);

        if(!result?.insertUser?.affectedRows) {
            logging.logError(req.apiReference, { BODY: req.body , ERROR: error } );

            throw new Error("Error while inserting data into table");
        }

        res.status(200).send({
            message: "USER ADDED SUCCESFULLY",
            data: {
                user_id     : result.userData.user_id,
                email       : result.userData.email,
                username    : result.userData.username,
                user_type   : result.userData.user_type,
                access_token: result.userData.access_token
            }
        });
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "register user controller" , BODY: req.body , ERROR: error } );
        res.status(400).send({
            message: "Error while creating user",
            data: {
                error
            }
        })
    }
}

async function loginUser(req, res) {
    const opts = req.body;
    try {
        const userData = await services.fetchUserDetails(req.apiReference, opts);
        if(_.isEmpty(userData)) {
            return res.status(200).send({
                message: "USER NOT REGISTERED"
            })
        }

        opts.user_id = userData[0].user_id;

        const encryptedPassword = await services.encryptPassword(opts);

        if(encryptedPassword !== userData[0].encrypted_password) {
            return res.status(400).send({
                message: "INVALID CREDENTIALS. PLEASE TRY AGAIN WITH VALID USERNAME AND PASSWORD",
            })
        }

        opts.user_id = userData[0].user_id;

        await services.loginUser(req.apiReference, opts);

        res.status(200).send({
            message: "LOGIN SUCCESSFUL",
            data: {
                user_id     : opts.user_id,
                username    : userData[0].username,
                email       : opts.email,
                access_token: opts.access_token
            }
        });
        
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "login user controller" , BODY: req.body , ERROR: error } );
        res.status(400).send({
            message: "Error while user login ",
            data: {
                error
            }
        })
    }
}
