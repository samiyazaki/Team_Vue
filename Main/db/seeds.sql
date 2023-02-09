USE employee_db;

INSERT INTO department (name)
VALUES  ("Branch Main"),
        ("Operations"),
        ("Outside Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Branch Manager", 150000.00, 1),
        ("Assistant Branch Manager", 75000.00, 1),
        ("Operations Manager", 125000.00, 2),
        ("Bookkeeper", 65000.00, 1),
        ("Inside Sales", 50000.00, 1),
        ("Warehouse Manager", 70000.00, 2),
        ("Logistics Specialist", 60000.00, 2),
        ("Territory Manager", 60000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Ronald", "Prince", 1, NULL),
        ("Seiya", "Miyazaki", 3, 1),
        ("Eve", "Lenahan", 4, 1),
        ("Paul", "Johnson", 5, 1),
        ("Roberto", "Torres", 5, 1),
        ("John", "Ferrara", 6, 2),
        ("Hector", "Ocasio", 7, 6),
        ("Darwin", "Inamagua", 7, 6),
        ("Jeff", "Fields", 7, 6),
        ("Nana", "Edu-Egyei II", 7, 6),
        ("Wes", "Fey", 8, 1),
        ("Tom", "Zinerco", 8, 1);