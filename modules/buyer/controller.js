
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

        const product_ids = products.map(ele => ele.id);

        const productDetails = await services.checkProductQuantity(req.apiReference ,product_ids);

        if(_.isEmpty(productDetails)) {
            logging.logError(req.apiReference, { EVENT: "createOrder controller - invalid products" , BODY: req.body , PARAMS: req.params, ERROR: error, PRODUCT_DETAILS: productDetails } );

            throw new Error("PRODUCTS NOT FOUND");
        }

        const hashMap = new Map();

        opts.products.filter((ele) => {
            hashMap.set(ele.id, ele.quantity);
        })

        let notValidOrder = false;
        let message;
        let total_price = 0;

        for(let i=0;i<productDetails.length;i++) {
            console.log("i ", i);
            if(hashMap.get(productDetails[i].id) > productDetails[i].product_quantity) {
                notValidOrder = true;
                message = `Order couldn't be placed because ${(productDetails[i].product_quantity) ? 'Only '+ (productDetails[i].product_quantity) + 'items' : 'No Item'} available for product - ${productDetails[i].product_name} and product id is ${productDetails[i].id}`;
                break;
            }else {
                productDetails[i].product_quantity -= hashMap.get(productDetails[i].id);
                total_price += productDetails[i].product_price * hashMap.get(productDetails[i].id);
            }
        }

        if(notValidOrder) {
            logging.logError(req.apiReference, { EVENT: "createOrder controller - not valid order " , BODY: req.body , PARAMS: req.params, ERROR: error } );

            return res.status(400).send({
                message
            });
        }

        const orderData = await services.createOrder(req.apiReference, {
            product_ids: product_ids,
            seller_id: params.seller_id,
            buyer_id: opts.userDetails.user_id,
            total_price
        })

        if(!orderData.affectedRows) {
            logging.logError(req.apiReference, { EVENT: "createOrder controller - orderData" , BODY: req.body , PARAMS: req.params, ERROR: error, ORDER_DATA: orderData } );

            return res.status(400).send({
                message: "Order couldn't be placed. Please try again"
            });
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
