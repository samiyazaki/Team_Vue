const cTable = require("console.table"); // Setting up console.table
const mysql = require("mysql2"); // Setting up mysql2
const inquirer = require("inquirer"); // Setting up inquirer for prompts
const express = require("express"); // Setting up node
const util = require("util"); // Util package
// const sequelize = require("./config/connection"); // I tried to use sequelize in this instance but it doesn't fully function

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  // Connecting the MySQL database
  {
    host: "localhost",
    user: "root",
    password: "Rootsql",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);
db.connect(); // connection function
db.query = util.promisify(db.query); // Making the query return a promise
openApp(); // Launches the app

async function openApp() {
  // Main function as async call
  let decision = await inquirer.prompt([
    // Inquirer prompts for the user
    {
      name: "choices",
      type: "list",
      message: "Select an option",
      choices: [
        "View departments",
        "View roles",
        "View employees",
        "Add department",
        "Add role",
        "Add employee",
        "Update employee role",
        "Exit",
      ],
    },
  ]);
  switch (
    decision.choices // Switching the selected function based on user selection from await inquirer prompts
  ) {
    case "View departments":
      selectDepartment();
      break;
    case "View roles":
      selectRole();
      break;
    case "View employees":
      selectEmployees();
      break;
    case "Add department":
      addDepartment();
      break;
    case "Add role":
      addRole();
      break;
    case "Add employee":
      addEmployee();
      break;
    case "Update employee role":
      updateEmployee();
      break;
    case "Exit":
      exit();
      break;
  }
}
async function selectEmployees() {
  // async function for viewing employees
  const employee = await db.query(`
    SELECT employee.*, role.title, role.salary
    FROM employee
    JOIN role ON employee.role_id = role.id
  `);
  console.table(employee);
  openApp();
}

async function addEmployee() {
  // async function for adding employees
  let answer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the first name of the employee?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last name of the employee?",
    },
    {
      type: "input",
      name: "role_id",
      message:
        "What is the role for this employee? 1 for Manager, 2 for office, 3 for warehouse.",
    },
    {
      type: "input",
      name: "manager_id",
      message:
        "Which manager do they report to? 1 for Branch, 2 for Operations.",
    },
  ]);
  await db.query(
    "INSERT INTO employee SET first_name=?, last_name=?, role_id=?, manager_id=?",
    [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]
  );
  console.table("employee has been added.");
  openApp();
}
async function updateEmployee() {
  // async function to update the employee and their role in the company.
  // Using the inquirer library, the function prompts the user to choose an employee and a role from a list.
  let answer = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "please choose the following employee from the list.",
      choices: async () => {
        // The function queries the database to retrieve a list of employees and maps each employee to an object.
        const employees = await db.query("SELECT * FROM employee");
        const addEmployee = employees.map((employee) => {
          return {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          };
        });
        // The function returns the list of employees to the inquirer prompt.
        return addEmployee;
      },
    },
    {
      type: "list",
      name: "role_id",
      message: "Please choose the new role for the employee",
      choices: async () => {
        // The function queries the database to retrieve a list of roles and maps each role to an object.
        const roles = await db.query("SELECT * FROM role");
        const newRoles = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });
        // The function returns the list of roles to the inquirer prompt.
        return newRoles;
      },
    },
  ]);

  // The function updates the employee's role in the database using the answers from the inquirer prompt.
  await db.query(
    "UPDATE employee SET role_id=? WHERE id=?",
    [answer.role_id, answer.employee_id],
    (err, results) => {
      if (err) throw err;
      openApp();
      console.log("Employee updated");
    }
  );
  // The openApp() function is called after the employee's role is updated.
  openApp();
}

// This is an asynchronous function that retrieves and displays the list of roles from the database.
async function selectRole() {
  const role = await db.query("SELECT * FROM role");
  console.table(role);
  // The openApp() function is called after the roles are displayed.
  openApp();
}

// This is an asynchronous function to add a new role to the database.
async function addRole() {
  // Using the inquirer library, the function prompts the user to enter the title, salary, and department id of the new role.
  let answer = await inquirer.prompt([
    {
      type: "input",
      name: "role_title",
      message: "What is the title of the new role?",
    },
    {
      type: "input",
      name: "role_salary",
      message: "What is the salary for this role?",
    },
    {
      type: "input",
      name: "department_id",
      message: "Which department does this role belong to?",
    },
  ]);
  // Insert the new role into the database
  await db.query("INSERT INTO role SET title=?, salary=?, department_id=?", [
    answer.role_title,
    answer.role_salary,
    answer.department_id,
  ]);
  // Confirm that the new role was added to the database
  console.table("New role added");
  // Call the openApp function to continue with the application
  openApp();
}

// Function to select and display all departments from the database
async function selectDepartment() {
  // Retrieve all departments from the database
  const department = await db.query("SELECT * FROM department");
  // Display the departments using the console.table function
  console.table(department);
  // Call the openApp function to continue with the application
  openApp();
}

// Function to add a new department to the database
async function addDepartment() {
  // Prompt the user to enter the name of the new department using inquirer
  let answer = await inquirer.prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the name of the new department",
    },
  ]);
  // Insert the new department into the database
  await db.query("INSERT INTO department SET name=?", answer.department_name);
  // Retrieve all departments from the database to confirm the new department was added
  const addDepartment = await db.query("SELECT * FROM department");
  // Display the departments using the console.table function
  console.table(addDepartment);
  // Call the openApp function to continue with the application
  openApp();
}

// Function to exit the application
async function exit() {
  console.log("Thank you for choosing Team Viewer, please press Ctrl + C to end this program; goodbye!");
  return;
}

// async function updateManager() {
//   let answer = await inquirer.prompt([
//     {
//       type: "list",
//       name: "employee_id",
//       message: "please choose the following employee from the list.",
//       choices: async () => {
//         const employees = await db.query("SELECT * FROM employee");
//         const addEmployee = employees.map((employee) => {
//           return {
//             name: employee.first_name + " " + employee.last_name,
//             value: employee.id,
//           };
//         });
//         return addEmployee;
//       },
//     },
//     {
//       type: "input",
//       name: "manager_id",
//       message: "Please input the new manager id",
//     },
//   ]);

//   await db.query(
//     "UPDATE employee SET manager_id=? WHERE id=?",
//     [answer.manager_id, answer.employee_id],
//     (err, results) => {
//       if (err) throw err;
//       openApp();
//       console.log("Manager updated");
//     }
//   );
//   openApp();
// }

// async function removeEmployee() {
//   let answer = await inquirer.prompt([
//     {
//       type: "list",
//       name: "employee_id",
//       message: "Please choose the following employee from the list.",
//       choices: async () => {
//         const employees = await db.query("SELECT * FROM employee");
//         const addEmployee = employees.map((employee) => {
//           return {
//             name: employee.first_name + " " + employee.last_name,
//             value: employee.id,
//           };
//         });
//         return addEmployee;
//       },
//     },
//   ]);

//   await db.query(
//     "DELETE FROM employee WHERE id=?",
//     [answer.employee_id],
//     (err, results) => {
//       if (err) throw err;
//       openApp();
//       console.log("Employee removed");
//     }
//   );
//   openApp();
// }

// async function removeRole() {
//   let answer = await inquirer.prompt([
//     {
//       type: "list",
//       name: "role_id",
//       message: "please choose the following role from the list.",
//       choices: async () => {
//         const roles = await db.query("SELECT * FROM role");
//         const removedRoles = roles.map((role) => {
//           return {
//             name: role.title,
//             value: role.id,
//           };
//         });
//         return removedRoles;
//       },
//     },
//   ]);
//   await db.query(
//     "DELETE FROM role WHERE id=?",
//     [answer.role_id],
//     (err, results) => {
//       if (err) throw err;
//       console.log(results);
//       console.log(role_title, role_id);
//       openApp();
//     }
//   );
//   console.log("Role removed");
// }
