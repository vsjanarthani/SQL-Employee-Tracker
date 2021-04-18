module.exports = {
    getAllDeps: `SELECT id AS dep_id, name AS dep_name FROM department ORDER BY id;`,

    getAllRoles: `SELECT role.id AS role_id, title AS job_title, department.name AS department, salary
                    FROM role
                    JOIN department
                    ON department_id = department.id
                    ORDER by role.id;`,

    getAllEmps: `SELECT emp.id AS emp_id, 
                emp.first_name, 
                emp.last_name, 
                role.title AS job_title, 
                department.name AS department,
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
                    CONCAT (emp.first_name , ' ' , emp.last_name, ' ', "ID:", emp.id) AS manager_name  
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
                        WHERE emp.manager_id = ?;`,
                        
    getEmpsbyDep: `SELECT emp.id AS emp_id, 
                    emp.first_name, 
                    emp.last_name, 
                    role.title AS job_title, 
                    department.name AS department,
                    role.salary,
                    CONCAT (mgr.first_name , ' ' , mgr.last_name) AS manager_name  
                    FROM employee emp
                    LEFT JOIN employee mgr
                    ON emp.manager_id = mgr.id
                    JOIN role
                    ON emp.role_id = role.id
                    JOIN department
                    ON role.department_id = department.id
                    WHERE department.id = ?;`
   
  };