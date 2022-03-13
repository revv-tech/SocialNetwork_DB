// RUTAS PARA USUARIOS

const express = require('express');
const router = express.Router();

// User model
const User = require('../model/UserMongoDB');

// Password handler
const bcrypt = require('bcryptjs');

// Log in 
router.get('/login', (req, res) => res.render('login'));

// Register
router.get('/register', (req, res) => res.render('register'));
// Register Handle
router.post('/register', (req, res) =>{
    console.log(req.body)
    const { name, email, password, password2, description, dateBirth} = req.body;
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
            dateBirth
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            description,
            dateBirth
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
                  res.redirect('/User/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

module.exports = router;