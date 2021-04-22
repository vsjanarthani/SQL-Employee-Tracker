const dbpool = require('../connection');
const consoleTable = require('console.table');
const queries = require('../queries');
const { Department } = require('../constructor');

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
};

module.exports = { getDeplist, getDeps, addNewDep, queryDept, deleteDep, budgetbyDep }