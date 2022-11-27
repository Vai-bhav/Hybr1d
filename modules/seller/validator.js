
const Joi = require('joi');

const apiReferenceModule = "seller";

exports.createCatalog = createCatalog;
exports.getOrders     = getOrders;

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

async function getOrders(req, res, next) {

    req.apiReference = {
        apiReferenceModule,
        api: "getOrders"
    }

    const schema = Joi.object().keys({
        seller_id: Joi.number().required()
    })

    const validateFields = validate(req.query, schema);

    if(validateFields.error) {
        return res.status(400).send("INVALID REQUEST");
    }

    next();

}
