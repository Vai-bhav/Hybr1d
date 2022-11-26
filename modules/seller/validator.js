
const Joi = require('joi');

const apiReferenceModule = "seller";

exports.createCatalog = createCatalog;

async function validate(opts, schema) {
    const validate = schema.validate(opts);
    return validate;
}

async function createCatalog(req, res, next) {
    
    req.apiReference = {
        apiReferenceModule,
        api: "createCatalog"
    }

    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        catalog     : Joi.array().required()
    });

    const validateFields = validate(req.body, schema);
    if(validateFields.error) {
        return res.status(400).send("INVALID REQUEST");
    }

    next();

}
