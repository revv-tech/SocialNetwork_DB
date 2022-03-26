const neo4j = require('neo4j-driver')
const uri = 'neo4j+s://8cbb1336.databases.neo4j.io';
const user = 'neo4j';
const password = 'vTIxUPFWGKzbxG4k9-MAaytVJ-v9GVpP1s0w18jScrg';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()

exports.addUser = addUser;
exports.removeUser = removeUser;
exports.findUser = findUser;
exports.editUser = editUser;
exports.findFriends = findFriends;
exports.findRequests = findRequests;

async function addUser (name, guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    try{
        const writeQuery = `CREATE (u:User {Guid: $guid, Name: $name, Status : "E"}) 
                            RETURN u.Guid AS guid, u.Name AS name, u.Status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, { name, guid })
        )

        writeResult.records.forEach(record => {
            response.response.guid = record.get('guid')
            response.response.name = record.get('name')
            response.response.status = record.get('status')
            }
        ) 

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

//cambiarlo a change status
async function removeUser (guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    try{
        const writeQuery = `MATCH (u {Guid: $guid}) 
                            SET u.Status = "D" 
                            RETURN u.Name AS name, u.Status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, { guid })
        )
        writeResult.records.forEach(record => {
            response.guid = guid
            response.name = record.get('name')
            response.status = record.get('status')
            }
        )

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

async function findUser (guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    try{
        const readQuery =   `MATCH (u:User) 
                            WHERE u.Guid = $guid  
                            RETURN u.Name AS name, u.Status AS status`

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery, { guid })
        )

        readResult.records.forEach(
            record => {
                response.guid = guid
                response.name = record.get('name')
                response.status = record.get('status')
            }
        )

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

//query is not correct
async function editUser (guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    try{
        const writeQuery = `MATCH (u:User {Guid : $guid})-[F:FriendshipRequest]->(uFriends) 
                            WHERE uFriends.Status = "E" AND NOT F.accepted AND F.status = "E" 
                            RETURN DISTINCT u, uFriends`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1})
        )


    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

async function findFriends (guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = []
    try{
        const writeQuery = `MATCH (u:User {Guid : $guid})-[F:Friendship]->(uFriends) 
                            WHERE uFriends.Status = "E" and F.status = "E" 
                            RETURN DISTINCT uFriends.Guid AS guid, uFriends.Name AS name, uFriends.Status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, { guid })
        )
        writeResult.records.forEach(record => {
            const item = {} 
            item.guid = record.get('guid')
            item.name = record.get('name')
            item.status = record.get('status')
            response.response = response.response.concat(item)
            }
        )

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}
//cambiar
async function findRequests (guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = []
    try{
        const writeQuery = `MATCH (ur:User)-[r:Friendship]->(u:User {Guid :"285"}) 
                            RETURN DISTINCT ur.Guid AS guid, ur.Name AS name, ur.Status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, { guid })
        )
        writeResult.records.forEach(record => {
            const item = {} 
            item.guid = record.get('guid')
            item.name = record.get('name')
            item.status = record.get('status')
            response.response = response.response.concat(item)
            }
        )

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

//friendship
exports.requestFriendship = requestFriendship;
exports.acceptFriendship = acceptFriendship;
exports.removeFriendship = removeFriendship;

async function requestFriendship (guid1Requestor, guid2) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    try{
        //validar que no haya otro request activo antes



        const writeQuery = `MATCH
                                (u:User),
                                (u2:User)
                            WHERE u.Guid = $guid1Requestor AND u2.Guid = $guid2
                            CREATE (u)-[r:Friendship {accepted: false, date: date(), status: "R" }]->(u2)
                            RETURN DISTINCT r.accepted AS accepted, r.date AS date, r.status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1Requestor, guid2 })
        )
        writeResult.records.forEach(record => {
            response.response.guidrequestor = guid1Requestor
            response.response.guid2 = guid2
            response.response.accepted = record.get('accepted')
            response.response.date = record.get('date')
            response.response.status = record.get('status')
            }
        )   
        

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

async function acceptFriendship (guid1, guid2) {
    
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}

    try{

        const writeQuery = `MATCH
                                (u:User),
                                (u2:User)
                            WHERE u.Guid = $guid1 AND u2.Guid = $guid2
                            CREATE (u)-[r:Friendship {date: date(), status: "E" }]->(u2)
                            RETURN u, u2, r`

        //cambier el set de los request

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1, guid2 })
        )
        console.log(response)
        res.send (response)

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

async function removeFriendship (guid1, guid2, res) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}

    try{
        //validar que no hayan otras antes

        const writeQuery = `MATCH
                                (u:User),
                                (u2:User)
                            WHERE u.Guid = $guid1 AND u2.Guid = $guid2
                            CREATE (u)-[r:FriendshipRequest {accepted: false, date: date(), status: "D" }]->(u2)
                            RETURN u, u2, r`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1, guid2 })
        )
        console.log(response)
        res.send (response)

    } catch (error) {
        response.success = false
        response.ErrMsg = error
    } 
    return response
}