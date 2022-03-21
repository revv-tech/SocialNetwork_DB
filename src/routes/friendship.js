const express = require('express');
const router = express.Router();
const db = require('../dbaccess/neo4j');

router.post('/request', (req, res) => request(req, res));
router.post('/accept', (req, res) => accept(req, res));
router.post('/remove', (req, res) => remove(req, res));

async function request (req, res) {
    console.log(req.body)
    const { guid1Requestor, guid2} = req.body;
    response = await db.requestFriendship(guid1Requestor, guid2)
    console.log(response)
    res.send(response)
}

async function accept (req, res) {
    console.log(req.body)
    const { guid1, guid2} = req.body;
    response = await db.acceptFriendship(guid1, guid2)
    console.log(response)
    res.send(response)
}

async function remove (req, res) {
    console.log(req.body)
    const { guid1, guid2} = req.body;
    response = await db.removeFriendship(guid1, guid2)
    console.log(response)
    res.send(response)
}

module.exports = router;