SELECT emp.id, emp.first_name, emp.last_name, mgr.first_name as manager_name, role.title, role.salary, department.name AS department
FROM employee emp
LEFT JOIN employee mgr
ON emp.manager_id = mgr.id
JOIN role
ON emp.role_id = role.id
JOIN department
ON role.department_id = department.id;