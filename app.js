// Mongo Config
const mongoDB       = require('./src/config/mongoDB');
const express       = require('express');
const app           = require('express')();
const port          = 5000;
const passport      = require('passport');
const flash         = require('connect-flash');
const session       = require('express-session');

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
