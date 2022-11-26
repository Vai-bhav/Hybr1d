
const { executeQuery } = require('../../database/database');
const constants        = require('../../properties/constants');
const commonFunction   = require('../../utilities/commonFunction');
const logging          = require('../../logging/logging');


exports.getSellerProduct = getSellerProduct;
exports.addProducts      = addProducts;

async function getSellerProduct(apiReference, opts) {
    try {


        console.log("OPTS ", opts);
        const sellerProductData = await commonFunction.fetchDataFromTable(apiReference, constants.TABLENAME.PRODUCTS, "*", {
           seller_user_id: opts.userDetails.user_id
        });

        return sellerProductData;
    }catch(error) {
        logging.logError(apiReference, { EVENT: "get seller product services" , OPTS: opts , ERROR: error } );

        throw new Error("GET SELLER DATA");
    }
}

async function addProducts(apiReference, opts) {
    try{

        const catalog = opts.catalog;

        const seller_user_id = opts.userDetails.user_id;

        let sqlQuery = `INSERT INTO ${constants.TABLENAME.PRODUCTS} (seller_user_id, product_name, product_price, product_quantity) VALUES `

        catalog.forEach((ele, index) => {
            sqlQuery += ` ( ${seller_user_id}, "${ele.product_name}", ${ele.product_price} , ${ele.product_quantity} )`;
            if(index != catalog.length-1) sqlQuery += `, `;
        })

        await executeQuery(apiReference, sqlQuery);

        return;
    }catch(error) {
        logging.logError(apiReference, { EVENT: "add product services" , BODY: req.body , ERROR: error } );

        throw new Error("ADD PRODUCT SERVICE ERROR");
    }
}
