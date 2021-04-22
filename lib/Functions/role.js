const dbpool = require('../connection');
const queries = require('../queries');
const { Role } = require('../constructor');

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
};

module.exports = { getRoleList, getRoles, addNewRole, queryRoleTitle, deleteRole };