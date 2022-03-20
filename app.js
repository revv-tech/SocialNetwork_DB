// Mongo Config
const mongoDB       = require('./src/config/mongoDB');
const express       = require('express');
const app           = express();
const port          = 5000;
const passport      = require('passport');
const flash         = require('connect-flash');
const session       = require('express-session');

//Agregado Steven
const morgan = require('morgan');
const path = require('path');
const exphbs = require("express-handlebars");
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.create({
    defaultLayout: "main",
    extname: ".hbs",
    //custom helpers
    helpers:{
        prettifyDate: function(timestamp) {
            return new Date(timestamp).toString('dd-MM-yyyy')
        },
        filterChat: function(receptor, remitente, _receptor, _remitente){

            if ((receptor == _receptor && remitente == _remitente) || (remitente == _receptor && receptor == _remitente))
                return true
            else
                return false
        }
    }
}).engine);
app.set('view engine', '.hbs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//Fin Steven

// Passport Config
require('./src/config/passport')(passport);
// Layouts
const expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
// EJS
app.use(expressLayouts);

// Bodyparser
app.use(express.urlencoded({ 
    extended: false
}));

// Express Session Middleware
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

// App Routes
// Index
app.use('/',require('./src/routes/index'));
// Users
app.use('/User',require('./src/routes/User'));

app.listen(port, function()  {
    console.log(`Server running on port: ${port}`);
});
