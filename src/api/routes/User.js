// RUTAS PARA USUARIOS

const express = require('express');
const router = express.Router();

// Password handler
const bcrypt = require('bcryptjs');

// Log in 
router.post('/login', (req, res) => res.send('Log in'));

// Register
router.post('/register', (req, res) => res.send('Register'));


module.exports = router;