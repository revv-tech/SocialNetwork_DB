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
exports.areFriends = areFriends;

async function addUser (name, guid) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    try{
        const writeQuery = `CREATE (u:User {Guid: $guid, Name: $name, Status : "ENABLE"}) 
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
                            SET u.Status = "DISABLE" 
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
    response.success = false
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
                response.success = true
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
        const readQuery = `MATCH (u:User {Guid : $guid})-[F:Friendship]->(uFriends) 
                            WHERE uFriends.Status = "ENABLE" and F.status = "ENABLE" 
                            RETURN DISTINCT uFriends.Guid AS guid, uFriends.Name AS name, uFriends.Status AS status`

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery, { guid })
        )
     
        readResult.records.forEach(record => {
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
    response.requests = []
    try{
        const readQuery = `MATCH (ur:User)-[r:Friendship]->(u:User {Guid : $guid}) 
                            WHERE not r.accepted AND r.status = "REQUESTED"
                            RETURN DISTINCT ur.Guid AS requester, ur.Name AS name, ur.Status AS status`

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery, { guid })
        )
        readResult.records.forEach(record => {
            const item = {} 
            item.requester = record.get('requester')
            item.name = record.get('name')
            item.status = record.get('status')
            response.requests = response.requests.concat(item)
            }
        )

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

async function areFriends (guid, guid2) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.areFriends = false
    try{
        const readQuery = `MATCH (u:User {Guid : $guid})-[F:Friendship]->(u2: User {Guid: $guid2}) 
                            WHERE F.status = "ENABLE" AND F.accepted 
                            RETURN COUNT(F) AS count`

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery, { guid, guid2 })
        )
        readResult.records.forEach(record => {
            const item = {} 
            let count= record.get('count')
            response.areFriends = count > 0
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
exports.rejectFriendship = rejectFriendship;
exports.removeFriendship = removeFriendship;
exports.isRequest = isRequest;

async function isRequest (guid1Requestor, guid2) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.isRequest = false
    count = 0
    try{
        //validar que no haya otro request activo antes
        const readQuery =   `MATCH (u:User)-[r:Friendship]->(u2:User) 
                            where u.Guid = $guid1Requestor AND u2.Guid = $guid2 AND 
                            r.accepted = false AND r.status = "REQUESTED" 
                            RETURN COUNT(r) AS count`

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery,  {guid1Requestor, guid2 })
        )

        readResult.records.forEach(
            record => {
                count = record.get('count')
            }
        )    
        
        response.isRequest = count > 0

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}

async function requestFriendship (guid1Requestor, guid2) {
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}
    count = 0
    try{
        //validar que no haya otro request activo antes
        const readQuery =   `MATCH (u:User)-[r:Friendship]->(u2:User) 
                            where u.Guid = $guid1Requestor AND u2.Guid = $guid2 AND 
                            r.accepted = false AND r.status = "REQUESTED" 
                            RETURN COUNT(r) AS count`

        const readResult = await session.readTransaction(tx =>
            tx.run(readQuery,  {guid1Requestor, guid2 })
        )

        readResult.records.forEach(
            record => {
                count = record.get('count')
            }
        )

        if (count == 0) {
            const writeQuery = `MATCH
                                    (u:User),
                                    (u2:User)
                                WHERE u.Guid = $guid1Requestor AND u2.Guid = $guid2
                                CREATE (u)-[r:Friendship {accepted: false, date: date(), status: "REQUESTED" }]->(u2)
                                RETURN r.accepted AS accepted, r.date AS date, r.status AS status`

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
        } else {
            response.success = false
            response.errmsg = "There is already a request"

        }
        
        

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

        const writeQuery = `MATCH (u1:User {Guid: $guid2})-[r:Friendship {accepted: false, status: "REQUESTED"}]->(u2:User {Guid : $guid1}) 
                            SET r.accepted = true , r.status = "ENABLE"
                            CREATE (u2)-[r2:Friendship {accepted: r.accepted, date: r.date, status: r.status }]->(u1)
                            RETURN r.accepted AS accepted, r.status AS status`

        //cambier el set de los request

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1, guid2 })
        )
        writeResult.records.forEach(record => {
            response.response.guid1 = guid1//es el que acepta, 
            response.response.guid2 = guid2//este es el que hizo el reques
            response.response.accepted = record.get('accepted')
            response.response.status = record.get('status')
            }
        )   

    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}


async function rejectFriendship (guid1, guid2) {
    
    const response = {}
    response.success = true
    response.errmsg = ""
    response.response = {}

    try{

        const writeQuery = `MATCH (ur:User {Guid: $guid2})-[r:Friendship {accepted: false, status: "REQUESTED"}]->(u:User {Guid : $guid1}) 
                            SET r.status = "REJECTED"
                            RETURN r.accepted AS accepted, r.status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1, guid2 })
        )


        writeResult.records.forEach(record => {
            response.response.guid1 = guid1
            response.response.guid2 = guid2
            response.response.accepted = record.get('accepted')
            response.response.status = record.get('status')
            }
        )   

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

        const writeQuery = `MATCH (ur:User {Guid: $guid1})-[r:Friendship {accepted: true, status: "ENABLE"}]->(u:User {Guid : $guid2}) 
                            SET  r.accepted = false , r.status = "DISABLE"
                            RETURN r.accepted AS accepted, r.status AS status`

        const writeResult = await session.writeTransaction(tx =>
            tx.run(writeQuery, {guid1, guid2 })
        )

        const writeQuery2 = `MATCH (ur:User {Guid: $guid2})-[r:Friendship {accepted: true, status: "ENABLE"}]->(u:User {Guid : $guid1}) 
                            SET  r.accepted = false , r.status = "DISABLE"
                            RETURN r.accepted AS accepted, r.status AS status`

        const writeResult2 = await session.writeTransaction(tx =>
            tx.run(writeQuery2, {guid1, guid2 })
        )
        writeResult2.records.forEach(record => {
            response.response.guid1 = guid1
            response.response.guid2 = guid2
            response.response.accepted = record.get('accepted')
            response.response.status = record.get('status')
            }
        ) 
    } catch (error) {
        response.success = false
        response.errmsg = error
    } 
    return response
}