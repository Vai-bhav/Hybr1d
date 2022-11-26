
const services = require('./services');

const _ = require('underscore');

exports.registerUser = registerUser;

async function registerUser(req, res) {
    const opts = req.body;
    try{
        let username = opts.username;

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
                user_type   : result.userData.user_type
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
