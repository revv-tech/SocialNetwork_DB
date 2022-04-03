// RUTAS PARA USUARIOS

const express       = require('express');
const router        = express.Router();
const passport      = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const pool = require('../config/mysqlDB');
const {newImagePP, newImagePPUpdate} = require('../dbaccess/mysql_data');
const storage = require('../config/multer');
const multer = require('multer');
const path = require('path')
const upload = multer({storage});
const{connection, Factory} = require('../Factory/query_factory');


// Password handler
const bcrypt        = require('bcryptjs');
// User model
const User          = require('../model/UserMongoDB');
// Log in 
router.get('/login', (req, res) => res.render('login'));
// Register
router.get('/register', (req, res) => res.render('register'));
//neo4j
const dbNeo4j = require('../dbaccess/neo4j')

// Register Handle
router.post('/register', async (req, res) =>{
    
    const { name, email, password, password2, description, date, hoobies, interests} = req.body;
    
    let errors = [];
  
    if (!name || !email || !password || !password2 || !description) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            description,
            date,
            hoobies,
            interests
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            description,
            date,
            hoobies,
            interests
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                   dbNeo4j.addUser(name, email)
                  dbNeo4j.addUser(name, email)
                  res.redirect('/User/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
      // Ingresa el user en MySQL
      let sql = `insert into user values ('${email}');`;
      const result = await Factory(sql);
      // Ingresa el user en MySQL
      let sql_2 = `insert into profilepic (email_user, image) values ('${email}', '');`;
      const result_2 = await Factory(sql_2);
    }
    
  });
  
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/User/login',
    failureFlash: true
  })(req, res, next);
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/User/login');
});

// Settings
router.get('/settings', ensureAuthenticated,  async (req, res) => {
  res.render('settings', { user: req.user });
});
// Settings Handler
router.post('/settings', ensureAuthenticated, (req, res) => {
  const { name, email, emailPrivate , password, password2, description, descriptionPrivate , date, datePrivate, hoobies, hoobiesPrivate, interests, interestsPrivate, imagePrivate} = req.body;
  var isEmailPublic = false;
  var isDescriptionPublic = false;
  var isDatePublic = false;
  var ishoobiesPublic = false;
  var isinterestsPublic = false;
  var isImagePublic = false;

  if (emailPrivate == 'on'){
    isEmailPublic = true;
  }
  if (descriptionPrivate == 'on'){
    isDescriptionPublic = true;
  }
  if (datePrivate == 'on'){
    isDatePublic = true;
  }
  if (hoobiesPrivate == 'on'){
    ishoobiesPublic = true;
  }
  if (interestsPrivate == 'on'){
    isinterestsPublic = true;
  }
  if (imagePrivate == 'on'){
    isImagePublic = true;
  }
  
  if ( !password && !password2) {
    User.updateOne({email: email}, {
      $set : {
        name: name,
        emailPrivate: isEmailPublic,
        description: description,
        descriptionPrivate: isDescriptionPublic,
        date: date,
        datePrivate: isDatePublic,
        hoobies: hoobies,
        hoobiesPrivate: ishoobiesPublic,
        interests: interests,
        interestsPrivate: isinterestsPublic,
        imagePrivate: isImagePublic
      }
      }).then(
      res.redirect('/dashboard')
    );
  } if ( password || password2) {
      if ( password == password2) {

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            var encryptedPass = hash;
            User.updateOne({email: email}, {
              $set : {
                password: encryptedPass
              }
              }).then(
              res.redirect('/dashboard')
            );
          });
        });

        
    }else{
      res.redirect('/settings');
    }
  }
  
  
  
  

});


// Profile Picture
router.get('/updateProfilePic', ensureAuthenticated,  async (req, res) => {
  res.render('updateProfilePic', { user: req.user });
});

// Profile Picture Handler
router.post('/updateProfilePic', upload.single('images'), newImagePPUpdate, async (req, res) => {
  res.render('updateProfilePic', { user: req.user });
});


module.exports = router;