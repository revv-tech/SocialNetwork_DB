const express = require('express');
const router = express.Router();
const db = require('../dbaccess/neo4j');
const neo4j_user = require('../routes/neo4j_user.js')

router.post('/request', (req, res) => request(req, res));
router.post('/accept', (req, res) => accept(req, res));
router.post('/reject', (req, res) => reject(req, res));
router.post('/remove', (req, res) => remove(req, res));

async function request (req, res) {
    
    console.log(req.body)
    const { guid1Requestor, guidFind} = req.body;
    response = await db.requestFriendship(guid1Requestor, guidFind)
    //res.send(response)

    res.redirect(308, '/user/find')
    //await neo4j_user.find_aux(guid2, req.user, res)
}

async function accept (req, res) {
    console.log(req.body)
    const { guid, guid2} = req.body;
    response = await db.acceptFriendship(guid, guid2)
    //console.log(response)
    //res.send(response)

    res.redirect(308, '/user/findRequests')
}

async function reject (req, res) {
    console.log(req.body)
    const { guid, guid2} = req.body;
    response = await db.rejectFriendship(guid, guid2)
    //console.log(response)
    //res.send(response)
    res.redirect(308, '/user/findRequests')
}

async function remove (req, res) {
    console.log(req.body)
    const { guid1Requestor, guidFind} = req.body;
    response = await db.removeFriendship(guid1Requestor, guidFind)
    res.redirect(308, '/user/find')
}

module.exports = router;