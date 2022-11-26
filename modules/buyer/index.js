
const auth = require('../../auth/auth');

const validator   = require('./validator');
const controllers = require('./controller');

app.get('/buyer/list-of-sellers', validator.sellerList, auth.authenticateUser, controllers.sellerList);
app.get('/buyer/seller-catalog/:seller_id', controllers.getSellerCatalogByID);
