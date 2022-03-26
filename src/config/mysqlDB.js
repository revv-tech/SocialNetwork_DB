// MySQL Config
const {promisify} = require('util');
const mysql = require('mysql');
const database = {
    database: {
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'project_bdii'
    }
};
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code == 'ER_CON_COUNT_ERRPR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code == 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('MySQL DB is connected');
    return;
});
pool.query = promisify(pool.query);

module.exports = pool;