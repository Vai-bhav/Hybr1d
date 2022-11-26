
const Joi = require('joi');

const apiReferenceModule = "buyer";

exports.sellerList  = sellerList;
exports.createOrder = createOrder;

function validate(opts, schema) {
    const validate = schema.validate(opts);
    return validate;
}

function sellerList(req, res, next) {
    
    req.apiReference = {
        apiReferenceModule,
        api: "sellerList"
    }
    
    const schema = Joi.object().keys({
        access_token: Joi.string().required()
    });

    const validateFields = validate(req.query, schema);
    if(validateFields.error) {
        return res.status(400).send("INVALID REQUEST");
    }

    next();

}

async function createOrder(req, res, next) {

    req.apiReference = {
        apiReferenceModule,
        api: "createOrder"
    }

    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        buyer_id    : Joi.number().required(),
        products    : Joi.array().required({
            id          : Joi.number().required(),
            quantity    : Joi.number().required()
        })
    })

    const validateFields = validate(req.body, schema);
    if(validateFields.error) {
        return res.status(400).send("INVALID REQUEST");
    }

    next();

}