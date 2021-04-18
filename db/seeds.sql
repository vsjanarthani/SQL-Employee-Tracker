-- Inserting values to department table;
INSERT INTO department (dep_name)
VALUES 
('Sales'),
('Finance'),
('Human Resources'),
('Marketing'),
('Legal'),
('Research & Development'),
('Tech Support'),
('Customer Care'),
('Production');

-- Inserting into role table;
INSERT INTO role (title, salary, department_id)
VALUES
('Sales Executive', 20080.00, 1),
('HR Manager', 61800.00, 3),
('Lawyer', 82590.00, 5),
('Customer Care Rep', 39670.00, 8),
('Finance Manager', 85900.00, 2),
('Sales Manager', 79450.00, 1),
('Customer Care Manager', 58740.00, 8),
('Production Manager', 75024.00, 9),
('Sales Lead', 30900.00, 1),
('Accountant', 28900.00, 2),
('HR Generalist', 22470.00, 3),
('Marketing Executive', 20478.00, 4),
('R&D Manager', 99785.00, 6),
('Technical Manager', 49850.00, 7),
('Technical support Executive', 24620.00, 7),
('Production Worker', 18570, 9),
('Engineer', 60580.00, 6);

-- Inserting values into employee table managers first & employees next;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Richard', 'Dawson', 2, NULL),
('Nicholas', 'Cruz', 5, NULL),
('Jessica', 'Chen', 6, NULL),
('Laura', 'Rodriguez', 7, NULL),
('Teddy', 'Noah', 8, NULL),
('Kamala', 'Venugopal', 13, NULL),
('Juan', 'Ramirez', 14, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Sara', 'Johnson', 1, 3),
('Kim', 'chang', 3, NULL),
('Taylor', 'Smith', 4, 4),
('Janet', 'floyd', 9, 3),
('Patty', 'Holland', 10, 2),
('Adib', 'Cooper', 11, 1),
('Andrea', 'Hammond', 12, NULL),
('Juana', 'Kennedy', 15, 7),
('Feroz', 'Khan', 16, 5),
('Edith', 'Carr', 17, 6);


