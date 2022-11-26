
const jwt = require('jsonwebtoken');
const _   = require('underscore');

const { SECRET_KEY } = require('../config/config');

exports.authenticateUser = authenticateUser;

async function authenticateUser(req, res, next) {
    let opts = req.body;

    if(_.isEmpty(opts)) opts = req.query;
    
    let userDetails;

    try {
        userDetails = jwt.verify(opts.access_token, SECRET_KEY);
    } catch (error) {
        return res.status(400).send({
            message: "PLEASE SIGN IN AGAIN"
        });
    }
    
    req.body.userDetails = userDetails;

    next();
}