// RUTAS GENERALES
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const{connection, Factory} = require('../Factory/query_factory');

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
router.get('/dashboard', ensureAuthenticated, async (req, res) => { 
    let sql_pp = `SELECT * FROM profilepic where email_user = '${req.user.email}';`;
    const pp = await Factory(sql_pp);
    res.render('dashboard', { user: req.user, pp: pp[0].image });
});


//Agregado Steven
router.get('/chats', ensureAuthenticated, (req, res) => {
    _remitente = req.user.name;
    //console.log(req.user.name);
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

router.get('/write-comment/:id', async (req, res) => {
    const id = req.params.id
    res.render('new-comment.hbs', {id});



});

router.post('/new-comment/:id', ensureAuthenticated, async (req, res) =>{

    const postID = req.params.id
    _remitente = req.user.email
    console.log(_remitente)
    const _timeStamp = Date.now()
    const { mensaje, remitente = _remitente, post = postID, fecha = _timeStamp} = req.body

    await db.collection('Comentarios').add({
        remitente: remitente,
        Comentario: mensaje,
        idMySQL: post,
        fecha: fecha,
    });
    res.redirect('/posts/othersPosts')
});

router.get('/view-comments/:id', async (req, res) => {
    const querySnapshot = await db.collection('Comentarios').get();
    const midQuery = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),

            }));
    const idSearched = req.params.id
    var listaComentarios = []
    for(i=0; i<midQuery.length; i++){
        if(midQuery[i].idMySQL == idSearched)
            listaComentarios[i] = midQuery[i]
    }
    res.render('view-comments.hbs', {comentarios: listaComentarios, idSearched: idSearched});
});

router.get('/view-responses/:id', async (req, res) => {
    const querySnapshot = await db.collection('Respuestas').get();
    const midQuery = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),

            }));
    const idSearched = req.params.id
    var listaRespuestas = []
    console.log("El id " + idSearched)
    console.log(midQuery[0])
    for(i=0; i<midQuery.length; i++){
        if(midQuery[i].idComentario == idSearched)
            listaRespuestas[i] = midQuery[i]
    }
    res.render('view-responses.hbs', {responses: listaRespuestas, idSearched: idSearched});
});

router.get('/write-response/:id', async (req, res) => {
    const id = req.params.id
    res.render('new-response.hbs', {id});

});

router.post('/new-response/:id', ensureAuthenticated, async (req, res) =>{

    const responseID = req.params.id
    _remitente = req.user.email
    console.log(_remitente)
    const _timeStamp = Date.now()
    const { mensaje, remitente = _remitente, response = responseID, fecha = _timeStamp} = req.body

    await db.collection('Respuestas').add({
        remitente: remitente,
        Comentario: mensaje,
        idComentario: response,
        fecha: fecha,
    });
    res.redirect('/posts/othersPosts')
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