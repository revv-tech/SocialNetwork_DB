// Mongo
require('./src/config/mongoDB');
const app           = require('express')();
const port          = 5000;


// App Routes
// Register - Log in
app.use('/users',require('./src/api/routes/User'));

// For acepting post form data
const bodyParser    =require('express').json;
app.use(bodyParser());



//app.use('/user', UserRouter)
app.listen(port, function()  {
    console.log(`Server running on port: ${port}`);
});
