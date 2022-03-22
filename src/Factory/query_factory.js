const util = require('util')
const connection = require('../config/mysqlDB');
const query = util.promisify(connection.query).bind(connection);

async function Factory(sql){
    try{
        let sql_query = sql;
        const res = await  query(sql_query);
        return res;
    }catch(err){
        console.log('There was an error in the SQL query: ' + err);
        return err
    }
} 
module.exports = {connection, Factory};