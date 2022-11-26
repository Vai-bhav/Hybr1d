
const validator = require('./validator');
const controller = require('./controller');

app.post('/auth/register', validator.registerUser, controller.registerUser);
app.post('/auth/login',    validator.loginUser);
