//MySQL Config
const mysqlDB= require('./src/config/mysqlDB');

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

//Posts
app.use('/posts', require('./src/routes/post'));

//ne4j
app.use('/user',require('./src/routes/neo4j_user'));
app.use('/friends',require('./src/routes/friendship'));

app.listen(port, function()  {
    console.log(`Server running on port: ${port}`);
});
// PATH STEVEN
// GOOGLE_APPLICATION_CREDENTIALS= C:\Users\USER\OneDrive\Documents\GitHub\SocialNetwork_DB\firebase.json
// PATH Marco
// GOOGLE_APPLICATION_CREDENTIALS= C:\Users\Marco\Desktop\DocumentosTEC\Github\SocialNetwork_DB\firebase.json
// PATH jarod
// GOOGLE_APPLICATION_CREDENTIALS= /home/jarod/Documents/TEC/BD II/Proyectos/SocialNetwork_DB/firebase.json
// PATH Fabian
// GOOGLE_APPLICATION_CREDENTIALS= D:\Datos\Documents\Estudios\TEC\Semestre VII\Bases de Datos II\Proyecto 1\SocialNetwork_DB\firebase.json