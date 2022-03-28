// MySQL Config
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'social_network_bdii',
    user: 'root',
    password: 'Antonio99'
});
connection.connect(function(error){
    if(error){
        throw error;
    } else{
        console.log('Successfully Connected to MySQL');
    }
});
module.exports = connection;