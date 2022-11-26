
const services = require('./services');
const logging  = require('../../logging/logging');

const _ = require('underscore');

const apiReferenceModule = "buyer";

exports.sellerList           = sellerList;
exports.getSellerCatalogByID = getSellerCatalogByID;

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
