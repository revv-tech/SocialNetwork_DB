const express       = require('express');
const router        = express.Router();
const db = require('../dbaccess/neo4j')
const mysqldb = require('../dbaccess/mysql_data')
//mongodb
const User          = require('../model/UserMongoDB');


router.post('/add', (req, res) => add(req, res));
router.post('/remove', (req, res) => remove(req, res));
router.post('/find', (req, res) => find(req, res));
router.post('/edit', (req, res) => edit(req, res));
router.post('/findRequests', (req, res) => findRequests(req, res));
router.post('/findFriends', (req, res) => findFriends(req, res));
  
exports.find_aux = find_aux;
exports.findRequests_aux = findRequests_aux;

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
    const {guidFind} = req.body;
    find_aux(guidFind, req.user, res)
}

//guid is email
async function find_aux (guid, user, res) {
    let errors = [];
    if (!guid) {
        errors.push({ msg: 'Please enter your friend mail' });
        res.render('dashboard.ejs', {user: user, err: errors})
    } else {

        //search user on neo4j and assumes that exists in other dv
        const response = await db.findUser(guid)
        response.user = {}
        //verify if has friends
        response2 = await db.areFriends(guid, user.email)

        //or if logged user already send a request
        isRequestResp = await db.isRequest(user.email, guid)
        //crear metodo areFriends, para saber que botón colocar
        //request friendship or remove
        if (response.success){
            photo = mysqldb.getProfilePic(guid)

            await User.findOne({ email: guid }).then(userFound => {
                response.user.name = userFound.name
                response.user.email = userFound.emailPrivate ? userFound.email : "is private"
                response.user.description = userFound.descriptionPrivate ? userFound.description : "is private"
                response.user.date = userFound.datePrivate ? userFound.date : "is private"
                response.user.imagePrivate = userFound.imagePrivate
                if (userFound.interestsPrivate) {
                    response.user.interests = "are private"
                } else {
                    response.user.interests = ""
                    userFound.interests.forEach(interest => {
                        response.user.interests += interest + "  "
                    });
                }
                if (userFound.hoobiesPrivate) {
                    response.user.hoobies = "are private"
                } else {
                    response.user.hoobies = ""
                    userFound.hoobies.forEach(hooby => {
                        response.user.hoobies += hooby + "  "
                    });
                }
                response.areFriends = response2.areFriends
                response.isRequest = isRequestResp.isRequest
                response.emailReq = guid
                res.render('user.ejs', {response : response, user : user, photo: photo});
            })
            
        } else {
            errors.push({ msg: 'User not found' });
            res.redirect('dashboard.ejs', {user: user, err: errors})
        }
    }
}


//de momento no usarlo
async function edit (req, res) {
    console.log(req.body)
    const { name, guid} = req.body;
    const response = await db.editUser(guid)
    res.send(response)
}

async function findRequests (req, res) {
    console.log(req.body)
    const {guid} = req.body;
    //const response = await db.findRequests(guid)
    //res.render('requests.ejs', {response : response, user : req.user});
    findRequests_aux(guid, req.user, res)
}

async function findRequests_aux (guid, user, res) {
    const response = await db.findRequests(guid)
    res.render('requests.ejs', {response : response, user : user});
}

async function findFriends (req, res) {
    console.log(req.body)
    const {guid} = req.body;
    const response = await db.findFriends(guid)
    res.send(response)
}


module.exports = router;