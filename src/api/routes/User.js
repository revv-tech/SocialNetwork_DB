const express = require('express');
const router = express.Router();

// Mongo user Model
const User = require('./src/modules/User.js');

// Password handler
const bcrypt = require('bcryptjs');

// Sign up
router.post('/signup', (req, res) => {
    let {name, email, password, dateOfBirth, description, } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();
    


    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    }else if (!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Name input fields"
        });
    }else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Mail input fields"
        })
    }else if (password.length < 8){
        res.json({
            status: "FAILED",
            message: "Password is short"
        })
    }else{
        // Checking if user already exists
        User.find({email}).then( result => {
            if (result.length){
                // If user exists
                res.json({
                    status: "FAILED",
                    message: "User provided already exists"
                })
            }else{
                // Try to create new user
                
                // Paswword encrypting
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword =>{

                    const newUser = ({
                        name,
                        mail,
                        dateOfBirth,
                        description,
                        password : hashedPassword

                    })
                    newUser.save().then(result =>{
                        res.json({
                            status: "SUCCESS",
                            message: "All done!"
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Error while saving account!"
                        })
                    })
                    
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error while hashing password!"
                    })
                })
            }
        }).catch( err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error ocurred while checking credentials"
            })
        })
    }

})

// Sign in
router.post('/signin', (req, res) => {

})


module.exports = router;