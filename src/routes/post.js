const express = require('express');
const router = express.Router();
const storage = require('../config/multer');
const multer = require('multer');
const uploader = multer({storage});
const pool = require('../config/mysqlDB');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// GET
router.get('/create', ensureAuthenticated, (req, res) => res.render('createPost', { user: req.user }));
//router.get('/edit', ensureAuthenticated, (req, res) => res.render('createPost', { user: req.user }));
router.get('/mostrar', (req, res) => res.render('mostrarPosts', { user: req.user }));

// POST
router.post('/create', async (req, res) => {
    const {description, photos, videos, documents, isPublic} = req.body;
    var isPostPublic = false;
    if(isPublic == 'on') isPostPublic = true;

    console.log(req.body);
    res.send('received');
});

/*outer.post('/edit', (req, res) => {
    console.log(req.body);
    res.send('received');
});*/

module.exports = router;