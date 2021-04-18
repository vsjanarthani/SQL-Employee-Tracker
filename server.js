const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');
const queries = require('./lib/queries');
// const {getDepts, getRoles, getEmps} = require('./lib/function');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'janarthani',
        password: 'password',
        database: 'employee_db'
    });

// Initial prompt
const initialPrompt = () => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'quit',
                ]
            },
            {
                type: 'input',
                name: 'dep_name',
                message: 'Enter the name of the Department:',
                when: ({ choice }) => choice === 'Add a department'
            },
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
                when: ({ choice }) => choice === 'Add a role'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
                when: ({ choice }) => choice === 'Add a role'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter the deparment id for the role:',
                when: ({ choice }) => choice === 'Add a role'
            },
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the employee's First name:",
                when: ({ choice }) => choice === 'Add an employee'
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the employee's Last name:",
                when: ({ choice }) => choice === 'Add an employee'
            },
            {
                type: 'input',
                name: 'role_id',
                message: "Enter the employee's role Id:",
                when: ({ choice }) => choice === 'Add an employee'
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "Enter the employee's Manager Id:",
                when: ({ choice }) => choice === 'Add an employee'
            },
            {
                type: 'input',
                name: 'emp_id',
                message: "Enter the employee's Id whose role needs to be updated:",
                when: ({ choice }) => choice === 'Update an employee role'
            },
            {
                type: 'input',
                name: 'role_id',
                message: "Enter the new role Id for the employee:",
                when: ({ choice }) => choice === 'Update an employee role'
            },
        ])
};

initialPrompt()
.then(response => {

    if (response.choice === "View all departments") {
        db.query(queries.getAllDeps, (err, data) => {
            if (err) {
                console.log(err);
            }
        console.table(data);
        });
    } if (response.choice === "View all roles") {
        db.query(queries.getAllRoles, (err, data) => {
            if (err) {
                console.log(err);
            }
            console.table(data);
        });
    } if (response.choice === "View all employees") {
        db.query(queries.getAllEmps, (err, data) => {
            if (err) {
                console.log(err);
            }
            console.table(data);
        });
    } if (response.choice === "Add a department") {
        db.query(queries.addDep, [response.dep_name], (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(`${response.dep_name} added to the department table`);
        });
    } if (response.choice === "Add a role") {
        db.query(queries.addRole, [response.title, response.salary, response.department_id], (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(`${response.title} added to the role table`);
        });
    } if (response.choice === "Add an employee") {
        db.query(queries.addEmp, [response.first_name, response.last_name, response.role_id, response.manager_id], (err, data) => {
            if (err) {
               return console.log(err);
            }
            console.log(`Employee ${response.first_name} ${response.last_name} added to the employee table`);
        });
    } if (response.choice === "Update an employee role") {
        db.query(queries.updateEmpRole, [response.role_id, response.emp_id], (err, data) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Emp Id ${response.emp_id} updated in the employee table`);
        });
    }
});

