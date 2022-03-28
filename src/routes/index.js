// RUTAS GENERALES
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Agregado Steven
const User          = require('../model/UserMongoDB');
const { db } = require('../firebase');
var _remitente = ""
var _receptor = ""
var _numMensajes = 0
var _post = 0
// Fin Steven

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => { 
    res.render('dashboard', { user: req.user });
});


//Agregado Steven
router.get('/chats', ensureAuthenticated, (req, res) => {
    _remitente = req.user.email;
    console.log(req.user.name);
    res.render('chats.ejs', { user: req.user })
});



router.get('/conversation', async (req, res) => {
    const querySnapshot = await db.collection('Mensajes').orderBy("numero", "asc").get();
    _numMensajes = querySnapshot.size + 1;
    _receptor = req.query.receptor

    if(_receptor == _remitente)
    res.redirect('/chats')

    User.findOne({email: _receptor}).then(user => {
        if (user){
            const mensajes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                _receptor,
                _remitente,

            }));
            res.render('index.hbs', {mensajes});
        }
        else{
            res.redirect('/chats')
        }
    })


});

router.post('/new-message', async (req, res) =>{

    const _timeStamp = Date.now()
    const { mensaje, remitente = _remitente, receptor = _receptor, fecha = _timeStamp, numero = _numMensajes} = req.body

    await db.collection('Mensajes').add({
        remitente: remitente,
        mensaje: mensaje,
        receptor: receptor,
        fecha: fecha,
        numero: numero,
    });
    res.redirect('/conversation?receptor=' + _receptor);
});

router.post('/new-comment/:id', async (req, res) =>{

    _remitente = req.user.email
    const _timeStamp = Date.now()
    const { mensaje, remitente = _remitente, post = _post, fecha = _timeStamp} = req.body

    await db.collection('Comentarios').add({
        remitente: remitente,
        mensaje: mensaje,
        post: post,
        fecha: fecha,
    });
    /*res.redirect('/conversation?receptor=' + _receptor);*/
});

router.get('/view-comments/:id', async (req, res) => {
    console.log(req.params.id)
    const querySnapshot = await db.collection('Comentarios').get();
    const comentarios = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                _receptor,
                _remitente,

            }));
    res.render('view-comments.hbs', {comentarios});
});


router.get('/edit-message/:id', async (req, res) =>{
    const doc = await db.collection("Mensajes").doc(req.params.id).get();
   res.render('index.hbs', {mensaje: {id: doc.id, ...doc.data()}});
});

router.get('/delete-message/:id', async (req, res) =>{
    await db.collection("Mensajes").doc(req.params.id).delete();
    res.redirect('/conversation?receptor=' + _receptor);
});

router.post('/update-message/:id', async (req, res) =>{
    const { id } = req.params;

    await db.collection('Mensajes').doc(id).update(req.body);
    res.redirect('/conversation?receptor=' + _receptor);
});
// Fin Steven

module.exports = router;