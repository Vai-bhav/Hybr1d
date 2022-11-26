
const validator = require('./validator');

app.get('/buyer/list-of-sellers', validator.sellerList);
