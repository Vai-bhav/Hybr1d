
const services  = require('./services');
const logging   = require('../../logging/logging');
const constants = require('../../properties/constants');

const _ = require('underscore');

const apiReferenceModule = "buyer";

exports.sellerList           = sellerList;
exports.getSellerCatalogByID = getSellerCatalogByID;
exports.createOrder          = createOrder;

async function sellerList(req, res) {
    try {
        const result = await services.sellerList(req.apiReference);

        res.status(200).send(result);
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "seller list controller" , ERROR: error } );

        res.status(400).send(error);
    }
}

async function getSellerCatalogByID(req, res) {
    const opts = req.params;
    req.apiReference = {
        apiReferenceModule,
        api: "getSellerCatalogByID"
    }
    
    try {
        
        const sellerData = await services.getSellerCatalogByID(req.apiReference, opts);

        res.status(200).send({
            message: "DATA RETRIEVED SUCCESFULLY",
            data: {
                seller_id: opts.seller_id,
                catalog: [...sellerData]
            }
        })
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "getSellerCatalogByID controller" , BODY: req.params , ERROR: error } );
        
        res.status(400).send({ message: error })
    }
}

async function createOrder(req, res) {
    const params = req.params;
    const opts = req.body;
    try {

        if(opts.userDetails.user_type == constants.USER.SELLERS) {
            return res.status(400).send({
                message: "INVALID USER"
            });
        }
        
        const products = opts.products;
        console.log("PRODUCT: ", products);
        const product_ids = products.map(ele => ele.id);

        const productDetails = await services.checkProductQuantity(req.apiReference ,product_ids);

        if(_.isEmpty(productDetails)) {
            throw new Error("PRODUCTS NOT FOUND");
        }

        res.status(200).send({
            message: "Order placed successfully"
        })

    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "createOrder controller" , BODY: req.body , PARAMS: req.params, ERROR: error } );
        res.status(400).send({
            message: "Order couldn't be placed succesfully. Please try again"
        })
    }
}
