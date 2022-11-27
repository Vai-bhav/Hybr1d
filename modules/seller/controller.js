
const constants = require('../../properties/constants');
const services  = require('./services');
const logging   = require('../../logging/logging');

const _ = require('underscore');

exports.createCatalog = createCatalog;
exports.getOrders     = getOrders;

async function createCatalog(req, res) {
    const opts = req.body;
    try {
        if(opts.userDetails.user_type != constants.USER.SELLERS) {
            return res.status(400).send({
                message: "INVALID USER"
            })
        }

        const sellerData = await services.getSellerProduct(req.apiReference ,opts);

        if(!_.isEmpty(sellerData)) {
            return res.status(400).send({
                message: "CATALOG ALREADY ADDED",
                data: [...sellerData]
            })
        }

        await services.addProducts(req.apiReference, opts);

        res.status(200).send({
            message: "CATALOG ADDED SUCCESFULLY",
            data: [...opts.catalog]
        })
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "create catalog controller" , BODY: req.body , ERROR: error } );

        res.status(400).send({
            data: error
        })
    }
}

async function getOrders(req, res) {
    const opts = req.query;
    try {
        const getOrders = await services.getOrders(req.apiReference, opts);
        res.status(200).send({
            data: [...getOrders]
        });
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "getOrders controller" , QUERY: req.query , ERROR: error } );

        res.status(400).send({
            message: error
        })
    }
}
