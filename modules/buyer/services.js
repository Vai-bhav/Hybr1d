

const commonFunction = require('../../utilities/commonFunction');
const constants      = require('../../properties/constants');
const logging        = require('../../logging/logging');


exports.sellerList  = sellerList;

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
