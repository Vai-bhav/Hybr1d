
const auth = require('../../auth/auth');

const validator   = require('./validator');
const controllers = require('./controller');

app.get('/buyer/list-of-sellers',           validator.sellerList,  auth.authenticateUser, controllers.sellerList);
app.get('/buyer/seller-catalog/:seller_id',                                               controllers.getSellerCatalogByID);
app.post('/buyer/create-order/:seller_id',  validator.createOrder, auth.authenticateUser, controllers.createOrder);