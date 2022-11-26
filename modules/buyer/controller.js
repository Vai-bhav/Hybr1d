
const services = require('./services');
const logging  = require('../../logging/logging');

const _ = require('underscore');

exports.sellerList   = sellerList;

async function sellerList(req, res) {
    try {
        const result = await services.sellerList(req.apiReference);

        res.status(200).send(result);
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "seller list controller" , ERROR: error } );

        res.status(400).send(error);
    }
}
