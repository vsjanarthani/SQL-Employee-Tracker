const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { getDeplist, getDeps, addNewDep, queryDept, deleteDep, budgetbyDep } = require('./lib/Functions/department');
const { getRoleList, getRoles, addNewRole, queryRoleTitle, deleteRole } = require('./lib/Functions/role');
const { getManagers, getEmpList, getEmps, addNewEmp, queryEmpName, updEmpRole, queryEmpID, updEmpMgr,
    getEmpsbyMgr, displayData, getEmpsbyDept, deleteEmp } = require('./lib/Functions/employee');

// Initial prompt
const initialPrompt = async() => {
    let managers = await getManagers();
    let departments = await getDeplist();
    let roletitle = await getRoleList();
    let emplist = await getEmpList();
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
                    "Update an employee's role",
                    "Update an employee's Manager",
                    "View employees by manager",
                    "View employees by department",
                    "Delete employee",
                    "Delete role",
                    "Delete department",
                    "Get utilized budget by department",
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
                when: ({ choice }) => choice === 'Add a role',
                validate: salaryInput => {
                    if (!Number.isNaN(parseFloat(salaryInput))) {
                        return true;
                    } else {
                        console.log('Please enter a number for salary with a max of 2 decimal value');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'dep_name',
                message: 'Select the department:',
                when: ({ choice }) => choice === 'Add a role' || choice === "View employees by department" ||
                 choice === "Delete department" || choice === "Get utilized budget by department",
                choices: [...departments]
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
                message: "Enter the employee's Last name: (Required)",
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
                type: 'list',
                name: 'role_title',
                message: "Select Employee's role:",
                choices: [...roletitle],
                when: ({ choice }) => choice === 'Add an employee' || choice === "Delete role"
            },
            {
                type: 'list',
                name: 'manager_name',
                message: "Select Employee's Manager:",
                when: ({ choice }) => choice === 'Add an employee',
                choices: [...managers, "None"]
            },
            {
                type: 'list',
                name: 'emp_name',
                message: "Select the employee whose role needs to be updated:",
                choices: [...emplist],
                when: ({ choice }) => choice === "Update an employee's role"
            },
            {
                type: 'list',
                name: 'role_title',
                message: "Select the role / job title:",
                choices: [...roletitle],
                when: ({ choice }) => choice === "Update an employee's role"
            },
            {
                type: 'list',
                name: 'emp_name',
                message: "Select the employee:",
                choices: [...emplist],
                when: ({ choice }) => choice === "Update an employee's Manager" || choice === "Delete employee"
            },
            {
                type: 'list',
                name: 'manager_name',
                message: "Select Employee's New Manager:",
                when: ({ choice }) => choice === "Update an employee's Manager",
                choices: [...managers, "None"]
            },
            {
                type: 'list',
                name: 'manager_name',
                message: "Select a Manager to view their reportees:",
                when: ({ choice }) => choice === "View employees by manager",
                choices: [...managers, "None"]
            }
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

initialPrompt();

const displayResult = response => {
    switch (response.choice) {

        case "View all departments":
            getDeps().then(() => initialPrompt());
            break;

        case "View all roles":
            getRoles().then(() => initialPrompt());
            break;

        case "View all employees":
            getEmps().then(() => initialPrompt());
            break;

        case "Add a department":
            addNewDep(response).then(response => queryDept(response))
            .then(() => initialPrompt());
            break;

        case "Add a role":
            addNewRole(response).then(response => queryRoleTitle(response))
            .then(() => initialPrompt());
            break;

        case "Add an employee":
            addNewEmp(response).then(response => queryEmpName(response))
            .then(() => initialPrompt());
            break;

        case "Update an employee's role":
            updEmpRole(response).then(response => queryEmpID(response))
            .then(() => initialPrompt());
            break;

        case "Update an employee's Manager":
            updEmpMgr(response).then(response => queryEmpID(response))
            .then(() => initialPrompt());
            break;

        case "View employees by manager":
            getEmpsbyMgr(response).then(response => displayData(response))
            .then(() => initialPrompt());
            break;

        case "View employees by department":
            getEmpsbyDept(response)
            .then(() => initialPrompt());
            break;

        case "Delete employee":
            deleteEmp(response)
            .then(() => initialPrompt());
            break;

        case "Delete role":
            deleteRole(response)
            .then(() => initialPrompt());
            break;

        case "Delete department":
            deleteDep(response)
            .then(() => initialPrompt());
            break;
        
        case "Get utilized budget by department":
            budgetbyDep(response)
            .then(() => initialPrompt());
            break;
    }
};

module.exports = { initialPrompt };