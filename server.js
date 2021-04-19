const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');
const queries = require('./lib/queries');


// Connect to database
const dbpool = mysql.createPool(
    {
        host: 'localhost',
        user: 'janarthani',
        password: 'password',
        database: 'employee_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

initialPrompt();

// Initial prompt
function initialPrompt() {
    inquirer
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
                    'Quit',
                ]

            },
            {
                type: 'input',
                name: 'dep_name',
                message: 'Enter the name of the Department: (Required)',
                when: ({ choice }) => choice === 'Add a department',
                validate: dep_nameInput => {
                    if (dep_nameInput) {
                        return true;
                    } else {
                        console.log('Please enter the name of the department');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role: (Required)',
                when: ({ choice }) => choice === 'Add a role',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter the job title of the role');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
                when: ({ choice }) => choice === 'Add a role'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Enter the deparment id for the role:',
                when: ({ choice }) => choice === 'Add a role',
            },
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the employee's First name: (Required)",
                when: ({ choice }) => choice === 'Add an employee',
                validate: first_nameInput => {
                    if (first_nameInput) {
                        return true;
                    } else {
                        console.log('Please enter the First name of the Employee');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the employee's Last name:",
                when: ({ choice }) => choice === 'Add an employee',
                validate: last_nameInput => {
                    if (last_nameInput) {
                        return true;
                    } else {
                        console.log('Please enter the Last name of the Employee');
                        return false;
                    }
                }
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
        .then(response => {
            if (response.choice != "Quit") {
                displayResult(response);
                return true;
            } else {
                console.log(`You are exited out of the loop. Press crtl+C to exit out of the prompt`);
                return false;
            }
        });
};


const displayResult = response => {
    switch (response.choice) {

        case "View all departments":
            getDeps();
            break;

        case "View all roles":
            getRoles();
            break;

        case "View all employees":
            getEmps();
            break;

        case "Add a department":
            addNewDep(response);
            break;

        case "Add a role":
            addNewRole(response);
            break;

        case "Add an employee":
            addNewEmp(response);
            break;

        case "Update an employee role":
            updEmpRole(response);
            break;
    }
};

// function to get all departments
const getDeps = () => {
    dbpool.query(queries.getAllDeps, (err, data) => {
        if (err) throw err;
        console.table(data);
        initialPrompt();
    });
};

// Function to get all roles
const getRoles = () => {
    dbpool.query(queries.getAllRoles, (err, data) => {
        if (err) throw err;
        console.table(data);
        initialPrompt();
    });
};

// Function to get all Employees
const getEmps = () => {
    dbpool.query(queries.getAllEmps, (err, data) => {
        if (err) throw err;
        console.table(data);
        initialPrompt();
    });
};

// Function to add a Department
const addNewDep = response => {
    dbpool.query(queries.addDep, [response.dep_name], (err, data) => {
        if (err) throw err;
        console.log(`${response.dep_name} added to the department table`);
        getDeps();
        initialPrompt();
    });
};

// Function to add a Role
const addNewRole = response => {
    dbpool.query(queries.addRole, [response.title, response.salary, response.department_id], (err, data) => {
        if (err) throw err;
        console.log(`${response.title} added to the role table`);
        getRoles();
        initialPrompt();
    });
};

// Function to add employee
const addNewEmp = response => {
    dbpool.query(queries.addEmp, [response.first_name, response.last_name, response.role_id, response.manager_id], (err, data) => {
        if (err) throw err;
        console.log(`Employee ${response.first_name} ${response.last_name} added to the employee table`);
        getEmps();
        initialPrompt();
    });
};

// Function to updated an employee's role
const updEmpRole = response => {
    dbpool.query(queries.updateEmpRole, [response.role_id, response.emp_id], (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Emp Id ${response.emp_id} updated in the employee table`);
        getEmps();
        initialPrompt();
    });
};