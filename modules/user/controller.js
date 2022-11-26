
const services = require('./services');

const _ = require('underscore');

exports.registerUser = registerUser;

async function registerUser(req, res) {
    const opts = req.body;
    try{
        let email = opts.email;

        let userDetails = await services.fetchUserDetails({ email });

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

        const result = await services.registerUser(opts);

        if(!result?.insertUser?.affectedRows) {
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
        res.status(400).send({
            message: "Error while creating user",
            data: {
                error
            }
        })
    }
}
