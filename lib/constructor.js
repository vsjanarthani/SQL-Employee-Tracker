class Department {
    constructor (dep_id, dep_name) {
        this.dep_id = dep_id;
        this.dep_name =dep_name;
    }
}

class Role {
    constructor (role_id, job_title, department, salary) {
        this.role_id = role_id;
        this.job_title = job_title;
        this.department = department;
        this.salary = salary;
    }
}
class Employee {
    constructor (emp_id, first_name, last_name, job_title, salary, manager_name, department) {
        this.emp_id = emp_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.job_title = job_title;
        this.salary = salary;
        this.manager_name = manager_name;
        this.department = department;
    }
}

class EmployeebyMgr {
    constructor (emp_id, first_name, last_name, job_title, salary, manager_name) {
        this.emp_id = emp_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.job_title = job_title;
        this.salary = salary;
        this.manager_name = manager_name;
    }
}

module.exports = { Department, Role, Employee, EmployeebyMgr };