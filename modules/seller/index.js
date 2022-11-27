
const validator  = require('./validator');
const auth       = require('../../auth/auth');
const controller = require('./controller');

app.post('/seller/create-catalog', validator.createCatalog, auth.authenticateUser, controller.createCatalog);
// app.get('/seller/orders',          validator.getOrders);
