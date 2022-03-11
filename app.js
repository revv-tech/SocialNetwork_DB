// Mongo
require('./src/config/mongoDB');
const app           = require('express')();
const port          = 5000;

// Layouts
const expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
// App Routes
// Welcome page
app.use('/users',require('./src/api/routes/User'));
// Register - Log in
app.use('/',require('./src/api/routes/Index'));

// For acepting post form data
const bodyParser    =require('express').json;
app.use(bodyParser());



//app.use('/user', UserRouter)
app.listen(port, function()  {
    console.log(`Server running on port: ${port}`);
});
