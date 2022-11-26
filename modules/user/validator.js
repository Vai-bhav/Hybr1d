
const Joi = require('joi');

exports.registerUser = registerUser;

function validate(opts, schema) {
    const validate = schema.validate(opts);
    return validate;
}

async function registerUser(req, res, next) {
    const schema = Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        user_type: Joi.number().required().valid(1,2)
    });

    const validateFields = validate(req.body, schema);
    if(validateFields.error) {
        return res.status(400).send("INVALID REQUEST");
    }

    next();

}
