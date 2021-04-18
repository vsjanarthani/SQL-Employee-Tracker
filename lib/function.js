const mysql = require('mysql2');
const queries = require('./queries');
const consoleTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'janarthani',
        password: 'password',
        database: 'employee_db'
    });

// Function to get all departments

const getDepts = db.query(queries.getAllDeps, (err, data) => {
    if (err) {
        console.log(err);
    }
    return console.table(data);
});

// function to get all roles
const getRoles = db.query(queries.getAllRoles, (err, data) => {
    if (err) {
        console.log(err);
    }
    console.table(data);
});

// function to get all employees
const getEmps = db.query(queries.getAllEmps, (err, data) => {
    if (err) {
        console.log(err);
    }
    console.table(data);
});

// function to Add a role
const addRole = db.query(queries.addRole, [title, salary, department_id], (err, data) => {
    if (err) {
        console.log(err);
    }
    console.table(data);
});



module.exports = {getDepts, getRoles, getEmps};