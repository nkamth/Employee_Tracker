const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

console.log("check");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to " + connection.config.database);
  mainQuestion();
});

// create an iquirer.prompt function - ask the first set of questions

function mainQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "mainQuestion",
        message: "What would you like to do?",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a role",
          "Add an Employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.mainQuestion) {
        case "View all Departments":
          viewDepartment();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "View all Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
        default:
          done();
      }
    });
}

function viewDepartment() {
  console.log("******* All Department *******");
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainQuestion();
  });
}

function viewRoles() {
  console.log("******* All Roles *******");
  connection.query(
    "SELECT title, R.id , D.name , salary FROM role as R JOIN department as D on R.department_id=D.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainQuestion();
    }
  );
}

function done() {
  connection.end();
}
