const dbpool = require('../connection');
const consoleTable = require('console.table');
const queries = require('../queries');
const { Employee, EmployeebyMgr } = require('../constructor');


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
};

module.exports = { getManagers, getEmpList, getEmps, addNewEmp, queryEmpName, updEmpRole, queryEmpID, updEmpMgr,
    getEmpsbyMgr, displayData, getEmpsbyDept, deleteEmp };