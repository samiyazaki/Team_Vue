DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    id  INT NOT NULL AUTO_INCREMENT,
    name  VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id  INT AUTO_INCREMENT,
    title  VARCHAR(255) NOT NULL,
    salary  DECIMAL(10,2) NOT NULL,
    department_id  INT,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id  INT AUTO_INCREMENT,
    first_name  VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    role_id  INT,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);