const express       = require('express');
const router        = express.Router();
const db = require('../dbaccess/neo4j')


router.post('/add', (req, res) => add(req, res));
router.post('/remove', (req, res) => remove(req, res));
router.post('/find', (req, res) => find(req, res));
router.post('/edit', (req, res) => edit(req, res));
router.post('/findRequest', (req, res) => findRequest(req, res));
router.post('/findFriends', (req, res) => findFriends(req, res));
  

async function add (req, res) {
    console.log(req.body)
    const { name, guid} = req.body;
    const response = await db.addUser(name, guid);
    let sql = `insert into user values (${guid});`;
    const result = await Factory(sql);
    res.send(response) ;
}

async function remove (req, res) {
    console.log(req.body)
    const {guid} = req.body;
    const response = await db.removeUser(guid)
    res.send(response) 
}

async function find (req, res) {
    console.log(req.body)
    const {guid} = req.body;
    const response = await db.findUser(guid)
    res.send(response)
}

//de momento no usarlo
async function edit (req, res) {
    console.log(req.body)
    const { name, guid} = req.body;
    const response = await db.editUser(guid)
    res.send(response)
}

async function findRequest (req, res) {
    console.log(req.body)
    const {guid} = req.body;
    const response = await db.findRequest(guid)
    res.send(response)
}

async function findFriends (req, res) {
    console.log(req.body)
    const {guid} = req.body;
    const response = await db.findFriends(guid)
    res.send(response)
}


module.exports = router;