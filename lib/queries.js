module.exports = {
        getAllDeps: `SELECT id AS dep_id, dep_name FROM department ORDER BY id;`,

        getAllRoles: `SELECT role.id AS role_id, title AS job_title, department.dep_name AS department, salary
                        FROM role
                        JOIN department
                        ON department_id = department.id
                        ORDER by role.id;`,

        getAllEmps: `SELECT emp.id AS emp_id, 
                emp.first_name, 
                emp.last_name, 
                role.title AS job_title, 
                department.dep_name AS department,
                role.salary,
                CONCAT (mgr.first_name , ' ' , mgr.last_name) AS manager_name  
                FROM employee emp
                LEFT JOIN employee mgr
                ON emp.manager_id = mgr.id
                JOIN role
                ON emp.role_id = role.id
                JOIN department
                ON role.department_id = department.id
                ORDER BY emp.id;`,

        getAllManagers: `SELECT 
                CONCAT (emp.first_name , ' ' , emp.last_name) AS manager_name, 
                emp.id AS manager_id
                FROM employee emp
                LEFT JOIN employee mgr
                ON emp.manager_id = mgr.id
                JOIN role
                ON emp.role_id = role.id
                WHERE role.title LIKE '% Manager';`,

        addDep: `INSERT INTO department(dep_name) VALUES(?);`,

        addRole: `INSERT INTO role(title, salary, department_id)
                VALUES(?, ?, ?);`,

        addEmp: `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                VALUES(?, ?, ?, ?);`,

        updateEmpRole: `UPDATE employee
                        SET role_id = ?
                        WHERE id = ?;`,

        updateEmpManager: `UPDATE employee
                        SET manager_id = ?
                        WHERE id = ?;`,

        getEmpsbyManager: `SELECT emp.id AS emp_id, 
                        emp.first_name, 
                        emp.last_name, 
                        role.title AS job_title, 
                        role.salary,
                        CONCAT (mgr.first_name , ' ' , mgr.last_name) AS manager_name  
                        FROM employee emp
                        LEFT JOIN employee mgr
                        ON emp.manager_id = mgr.id
                        JOIN role
                        ON emp.role_id = role.id
                        WHERE emp.manager_id =?;`,

        getEmpsbyNoManager: `SELECT emp.id AS emp_id, 
                        emp.first_name, 
                        emp.last_name, 
                        role.title AS job_title, 
                        role.salary,
                        CONCAT (mgr.first_name , ' ' , mgr.last_name) AS manager_name  
                        FROM employee emp
                        LEFT JOIN employee mgr
                        ON emp.manager_id = mgr.id
                        JOIN role
                        ON emp.role_id = role.id
                        WHERE emp.manager_id IS NULL;`,

        getEmpsbyDep: `SELECT emp.id AS emp_id, 
                        emp.first_name, 
                        emp.last_name, 
                        role.title AS job_title, 
                        department.dep_name AS department,
                        role.salary,
                        CONCAT (mgr.first_name , ' ' , mgr.last_name) AS manager_name  
                        FROM employee emp
                        LEFT JOIN employee mgr
                        ON emp.manager_id = mgr.id
                        JOIN role
                        ON emp.role_id = role.id
                        JOIN department
                        ON role.department_id = department.id
                        WHERE department.id = ?;`,

        getbydep_name: `SELECT * FROM department
                        WHERE dep_name = ?;`,

        getbyrole_title: `SELECT * FROM role WHERE title = ?;`,
        
        getbyemp_names: `SELECT * FROM employee WHERE first_name = ? AND last_name = ?;`,

        getempbyId: `SELECT * FROM employee WHERE id = ?;`,

        deleteEmpbyId: `DELETE FROM employee WHERE id = ?;`,

        deleteRolebyId: `DELETE FROM role WHERE id = ?;`,

        deletedepbyId: `DELETE FROM department WHERE id = ?;`,

        getSalarybyDep_id: `SELECT sum(role.salary) AS total_budget
                        FROM employee 
                        JOIN role
                        ON role_id = role.id
                        JOIN department
                        ON role.department_id = department.id
                        WHERE department.id = ?;`
};