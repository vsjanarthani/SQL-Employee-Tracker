const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const pool = mysql.createPool(
    {
        host: 'localhost',
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: 'employee_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

const dbpool = pool.promise();

module.exports = dbpool;