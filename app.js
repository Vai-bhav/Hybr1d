
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

global.app = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

app.listen(PORT, function() {
    console.log(`App is running at ${PORT}`);
});

