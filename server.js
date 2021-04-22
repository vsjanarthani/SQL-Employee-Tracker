const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');
const queries = require('./lib/queries');
const { Department, Role, Employee, EmployeebyMgr } = require('./lib/constructor');
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

// Function to get manager names
async function getManagers() {
    try {
        let rowdata = await dbpool.query(queries.getAllManagers);
        let managerlist = [];
        rowdata = rowdata[0];
        for (row in rowdata) {
            managerlist.push(`${rowdata[row].manager_id} ${rowdata[row].manager_name}`);
        }
        return managerlist;
    } catch (err) {
        console.log(err);
    }
};

// Function to get department list
async function getDeplist() {
    try {
        const depquery = await dbpool.query(queries.getAllDeps);
        let depname = [];
        let rowdata = depquery[0];
        for (row in rowdata) {
            depname.push(`${rowdata[row].dep_id} ${rowdata[row].dep_name}`);
        }
        return depname;
    } catch (err) {
        console.log(err);
    }
};

// Function to get role list
async function getRoleList() {
    try {
        const rolequery = await dbpool.query(queries.getAllRoles);
        let roleTitle = [];
        let rowdata = rolequery[0];
        for (row in rowdata) {
            roleTitle.push(`${rowdata[row].role_id} ${rowdata[row].job_title}`);
        }
        return roleTitle;
    } catch (err) {
        console.log(err);
    }
};

// Function to get Employee list
async function getEmpList() {
    try {
        const empquery = await dbpool.query(queries.getAllEmps);
        let empNames = [];
        let rowdata = empquery[0];
        for (row in rowdata) {
            empNames.push(`${rowdata[row].emp_id} ${rowdata[row].first_name} ${rowdata[row].last_name}`);
        }
        return empNames;
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

initialPrompt();

// Initial prompt
async function initialPrompt() {
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


const displayResult = response => {
    switch (response.choice) {

        case "View all departments":
            getDeps();
            initialPrompt();
            break;

        case "View all roles":
            getRoles();
            initialPrompt();
            break;

        case "View all employees":
            getEmps();
            initialPrompt();
            break;

        case "Add a department":
            addNewDep(response).then(response => queryDept(response));
            break;

        case "Add a role":
            addNewRole(response).then(response => queryRoleTitle(response));
            break;

        case "Add an employee":
            addNewEmp(response).then(response => queryEmpName(response));
            break;

        case "Update an employee's role":
            updEmpRole(response).then(response => queryEmpID(response));
            break;

        case "Update an employee's Manager":
            updEmpMgr(response).then(response => queryEmpID(response));
            break;

        case "View employees by manager":
            getEmpsbyMgr(response).then(response => displayData(response));
            break;

        case "View employees by department":
            getEmpsbyDept(response);
            initialPrompt();
            break;

        case "Delete employee":
            deleteEmp(response);
            break;

        case "Delete role":
            deleteRole(response);
            break;

        case "Delete department":
            deleteDep(response);
            break;
        
        case "Get utilized budget by department":
            budgetbyDep(response);
            break;
    }
};

// function to get all departments
const getDeps = async () => {
    try {
        const depquery = await dbpool.query(queries.getAllDeps);
        let departmentList = [];
        let depname = [];
        let rowdata = depquery[0];
        for (row in rowdata) {
            departmentList.push(new Department(rowdata[row].dep_id, rowdata[row].dep_name));
            depname.push(`${rowdata[row].dep_id} ${rowdata[row].dep_name}`);
        }
        console.table(departmentList);
        return depname;
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to get all roles
const getRoles = async () => {
    try {
        const rolequery = await dbpool.query(queries.getAllRoles);
        let roleList = [];
        let rowdata = rolequery[0];
        for (row in rowdata) {
            roleList.push(new Role(rowdata[row].role_id, rowdata[row].job_title, rowdata[row].department, rowdata[row].salary));
        }
        console.table(roleList);
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to get all Employees
const getEmps = async () => {
    try {
        const empquery = await dbpool.query(queries.getAllEmps);
        let empList = [];
        let rowdata = empquery[0];
        for (row in rowdata) {
            empList.push(new Employee(rowdata[row].emp_id, rowdata[row].first_name, rowdata[row].last_name, rowdata[row].job_title, rowdata[row].salary, rowdata[row].manager_name, rowdata[row].department));
        }
        if (empList.length <= 0) {
            console.log(`No records to display`);
        } else {
            console.log('\n');
            console.table(empList);
        }  
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to add a Department
const addNewDep = async response => {
    try {
        await dbpool.query(queries.addDep, response.dep_name);
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    return response.dep_name;
};

// Function to query a department by name
const queryDept = async response => {
    try {
        const querybydep = await dbpool.query(queries.getbydep_name, response);
        if (querybydep[0].length <= 0) {
            console.log(`No records to display`);
        } else {
            console.log(`Department added successfully`);
            console.table(querybydep[0]);
        }
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// Function to add a Role
const addNewRole = async response => {
    let dep_id = parseInt(response.dep_name.split(' ')[0]);
    try {
        await dbpool.query(queries.addRole, [response.title, response.salary, dep_id]);
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    return response.title;
};

// Function to query a role by title
const queryRoleTitle = async response => {
    try {
        const queryRole = await dbpool.query(queries.getbyrole_title, response);
        if (queryRole[0].length <= 0) {
            console.log(`No records to display`);
        } else {
            console.log(`\n Role added successfully`);
            console.table(queryRole[0]);
        }
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// Function to add an employee
const addNewEmp = async response => {
    let manager_id;
    if (response.manager_name === 'None') {
        manager_id = null;
    } else {
        manager_id = parseInt(response.manager_name.split(' ')[0]);
    }
    let role_id = parseInt(response.role_title.split(' ')[0]);
    try {
        await dbpool.query(queries.addEmp, [response.first_name, response.last_name, role_id, manager_id]);
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    return (`${response.first_name}_${response.last_name}`);
};

// Function to query employee by first and last name
const queryEmpName = async response => {
    try {
        let first_name = (response.split('_')[0]);
        let last_name = (response.split('_')[1]);
        const queryNewEmp = await dbpool.query(queries.getbyemp_names, [first_name, last_name]);
        if (queryNewEmp[0].length <= 0) {
            console.log(`No records to display`);
        } else {
            console.log(`\n Employee added successfully`);
            console.table(queryNewEmp[0]);
        }
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// Function to updated an employee's role
const updEmpRole = async response => {
    try {
        const emp_id = (response.emp_name.split(' ')[0]);
        const role_id = (response.role_title.split(' ')[0]);
        await dbpool.query(queries.updateEmpRole, [role_id, emp_id]);
        return emp_id;
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to query Employee by Id
const queryEmpID = async response => {
    try {
        const queryEmp = await dbpool.query(queries.getempbyId, [response]);
        if (queryEmp[0].length <= 0) {
            console.log(`No records to display`);
        } else {
            console.log(`\n Employee updated successfully`);
            console.table(queryEmp[0]);
        }
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// Function to update Employee's manager
const updEmpMgr = async response => {
    try {
        let manager_id;
        if (response.manager_name === 'None') {
            manager_id = null;
        } else {
            manager_id = parseInt(response.manager_name.split(' ')[0]);
        }
        const emp_id = (response.emp_name.split(' ')[0]);
        await dbpool.query(queries.updateEmpManager, [manager_id, emp_id]);
        return emp_id;
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to view Employees by Manager
const getEmpsbyMgr = async response => {
    let manager_id;
    try {
        if (response.manager_name != 'None') {
            manager_id = parseInt(response.manager_name.split(' ')[0]);
            const empquery = await dbpool.query(queries.getEmpsbyManager, manager_id);
            return empquery[0];
        } else {
            const empquery = await dbpool.query(queries.getEmpsbyNoManager);
            return empquery[0];
        }
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to display the employee data by manager
const displayData = response => {
    let empList = [];
    for (row in response) {
        empList.push(new EmployeebyMgr(response[row].emp_id, response[row].first_name, response[row].last_name, response[row].job_title, response[row].salary, response[row].manager_name));
    }
    if (empList.length <= 0) {
        console.log(`No Employees to display`);
    } else {
        console.log('\n');
        console.table(empList);
    }
    initialPrompt();
};

// Function to get employees by department
const getEmpsbyDept = async response => {
    try {
        let dep_id = parseInt(response.dep_name.split(' ')[0]);
        const queryempbydep = await dbpool.query(queries.getEmpsbyDep, dep_id);
        let empList = [];
        let rowdata = queryempbydep[0];
        for (row in rowdata) {
            empList.push(new Employee(rowdata[row].emp_id, rowdata[row].first_name, rowdata[row].last_name, rowdata[row].job_title, rowdata[row].salary, rowdata[row].manager_name, rowdata[row].department));
        }
        if (empList.length <= 0) {
            console.log(`No Employees to display`);
            return;
        }
        console.log('\n');
        console.table(empList);
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};

// Function to delete employee by id
const deleteEmp = async response => {
    try {
        const emp_id = (response.emp_name.split(' ')[0]);
        const delEmp = await dbpool.query(queries.deleteEmpbyId, emp_id);
        console.log(delEmp[0]);
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// function to delete role by id
const deleteRole = async response => {
    try {
        const role_id = (response.role_title.split(' ')[0]);
        const delrole = await dbpool.query(queries.deleteRolebyId, role_id);
        console.log(delrole[0]);
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// function to delete deparment by id
const deleteDep = async response => {
    try {
        let dep_id = parseInt(response.dep_name.split(' ')[0]);
        const deldep = await dbpool.query(queries.deletedepbyId, dep_id);
        console.log(deldep[0]);
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};

// function to get budget by deparment
const budgetbyDep = async response => {
    try {
        let dep_id = parseInt(response.dep_name.split(' ')[0]);
        const getbudget = await dbpool.query(queries.getSalarybyDep_id, dep_id);
        console.table(getbudget[0]);
    }
    catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
    initialPrompt();
};