// Mongo
require('./src/config/mongoDB');
const app       = require('express')();
const port      = 5000;

// For acepting post form data
const bodyParser    =require('express').json;
app.use(bodyParser());

app.listen(port, function()  {
    console.log(`Server running on port: ${port}`);
});