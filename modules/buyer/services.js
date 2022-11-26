

const commonFunction = require('../../utilities/commonFunction');
const constants      = require('../../properties/constants');
const logging        = require('../../logging/logging');
const dbHandler      = require('../../database/database');

const uuid        = require('uuid');

exports.sellerList           = sellerList;
exports.getSellerCatalogByID = getSellerCatalogByID;
exports.checkProductQuantity = checkProductQuantity;
exports.createOrder          = createOrder;
exports.updateProductQuantity= updateProductQuantity;

async function sellerList(apiReference) {
    try {
        const data = await commonFunction.fetchDataFromTable(apiReference, constants.TABLENAME.USER_DATA, "user_id, username, user_type", {
            user_type: constants.USER.SELLERS
        });
        return data;
    }catch(error) {
        logging.logError(apiReference, { EVENT: "seller list services" , ERROR: error } );

       throw new Error("Error while fetching seller details");
    }
}

async function getSellerCatalogByID(apiReference ,opts) {
    try{
        const seller_id = opts.seller_id;
        const sellerCatalogData = await commonFunction.fetchDataFromTable(apiReference, constants.TABLENAME.PRODUCTS, "id, product_name, product_price, product_quantity", {
            seller_user_id: seller_id
        })
        return sellerCatalogData;
    }catch(error) {
        logging.logError(apiReference, { EVENT: "getSellerCatalogByID services" , ERROR: error } );

        throw new Error(error);
    }
}

async function checkProductQuantity(apiReference, product_ids) {
    try{
        const productDetails = await commonFunction.fetchDataFromTable(apiReference, constants.TABLENAME.PRODUCTS, "", {
            product_ids: product_ids
        });

        return productDetails;

    }catch(error) {
        logging.logError(apiReference, { EVENT: "checkProductQuantity services" , ERROR: error, OPTS: product_ids } );

        throw new Error(error);
    }
}

async function createOrder(apiReference, opts) {
    try {
        const transaction_id = uuid.v4();
        const insertOrderDetails = await commonFunction.insertDataIntoTable(apiReference, constants.TABLENAME.ORDERS, {
            buyer_id      : opts.buyer_id,
            seller_id     : opts.seller_id,
            product_id    : JSON.stringify(opts.product_ids),
            total_price   : opts.total_price,
            transaction_id
        });

        insertOrderDetails.transaction_id = transaction_id;
        return insertOrderDetails;
    }catch(error) {
        logging.logError(apiReference, { EVENT: "createOrder services" , ERROR: error, OPTS: opts } );

        throw new Error(error);
    }
}

async function updateProductQuantity(apiReference, productDetails) {
    try {
        let sqlQuery = `INSERT INTO ${constants.TABLENAME.PRODUCTS} (id, seller_user_id, product_name, product_price, product_quantity) VALUES `
        productDetails.forEach((ele, index) => {
            sqlQuery += `( ${ele.id}, ${ele.seller_user_id}, "${ele.product_name}", ${ele.product_price}, ${ele.product_quantity} )`
            if(index != productDetails.length-1) sqlQuery += " , "
        })

        sqlQuery += ` ON DUPLICATE KEY UPDATE product_quantity = VALUES(product_quantity), seller_user_id = VALUES(seller_user_id) , product_name = VALUES(product_name) , product_price = VALUES(product_price) `;

        const result = await dbHandler.executeQuery(apiReference, sqlQuery);
        return result;

    }catch(error) {
        logging.logError(apiReference, { EVENT: "updateProductQuantity services error" , ERROR: error, PRODUCT_DETAILS: productDetails } );

        throw new Error(error);
    }
}
