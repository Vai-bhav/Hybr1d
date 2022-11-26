

const commonFunction = require('../../utilities/commonFunction');
const constants      = require('../../properties/constants');
const logging        = require('../../logging/logging');


exports.sellerList           = sellerList;
exports.getSellerCatalogByID = getSellerCatalogByID;

async function sellerList(apiReference) {
    try {
        const data = await commonFunction.fetchDataFromTable(apiReference, constants.TABLENAME.USER_DATA, "user_id, username, user_type", {
            user_type: constants.USER.SELLERS
        });
        return data;
    }catch(error) {
        logging.logError(req.apiReference, { EVENT: "seller list services" , ERROR: error } );

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
        logging.logError(req.apiReference, { EVENT: "getSellerCatalogByID services" , ERROR: error } );

        throw new Error(error);
    }
}
