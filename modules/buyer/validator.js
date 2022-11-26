
const Joi = require('joi');

exports.sellerList = sellerList;

function validate(opts, schema) {
    const validate = schema.validate(opts);
    return validate;
}

function sellerList(req, res, next) {
    
    const schema = Joi.object().keys({
        access_token: Joi.string().required()
    });

    const validateFields = validate(req.query, schema);
    if(validateFields.error) {
        return res.status(400).send("INVALID REQUEST");
    }

    next();

}