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
        message: "What Would You Like To Do ?",
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

var listDeptNames = [];

function viewDeptNames() {
  console.log(">>view dept names");
  connection.query("SELECT name FROM department", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      listDeptNames.push(data[i].name);
    }
  });
  return;
}

function viewDepartment() {
  console.log("\n - - - - - - - - - - - - - - - - -");
  console.log(" ******* All Department *******");
  console.log(" - - - - - - - - - - - - - - - - -\n");
  connection.query(
    "SELECT id as Dept_id,name as Dept_name FROM department",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainQuestion();
    }
  );
}

function viewRoles() {
  console.log("\n - - - - - - - - - - - - - - - - -");
  console.log("******* All Roles *******");
  console.log(" - - - - - - - - - - - - - - - - -\n");
  connection.query(
    "SELECT title as Job_Title , R.id , D.name as Dept_Name , salary FROM role as R JOIN department as D on R.department_id=D.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainQuestion();
    }
  );
}

function viewEmployees() {
  console.log("\n - - - - - - - - - - - - - - - - -");
  console.log("******* All Employees *******");
  console.log(" - - - - - - - - - - - - - - - - -\n");
  connection.query(
    "SELECT E.id, E.first_name, E.last_name,R.title as Job_Title,D.name as Dept_Name,R.salary,M.first_name as Manager_name FROM employee as E LEFT JOIN role as R ON E.role_id = R.id LEFT JOIN department as D ON R.department_id = D.id LEFT JOIN employee as M on E.manager_id=M.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainQuestion();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Please enter the Department Name",
      },
    ])
    .then((answer) => {
      // console.log(">>>check", answer.departmentName);
      connection.query(
        `INSERT INTO department(name) VALUES("${answer.departmentName}")`,
        (err, res) => {
          if (err) throw err;
          console.log(
            ` \n--> ADDED DEPARTMENT "${answer.departmentName}" TO THE DATABASE !!\n `
          );
          mainQuestion();
        }
      );
    });
}

function addRole() {
  viewDeptNames();
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "What is the name of the role? ",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the Salary of the Role?",
      },
      {
        type: "list",
        name: "deptName",
        message: "Which Department does the role belong to?",
        choices: listDeptNames,
      },
    ])
    .then((answer) => {
      connection.query(
        `SELECT id from department where name ="${answer.deptName}"`,
        (err, res) => {
          if (err) throw err;
          connection.query(
            `INSERT INTO role(title,salary,department_id) VALUES("${answer.roleName}",${answer.salary},${res[0].id})`,
            (err, res) => {
              if (err) throw err;
              console.log(
                ` \n--> ADDED Role "${answer.roleName}" TO THE DATABASE !!\n `
              );
            }
          );

          mainQuestion();
        }
      );
    });
}
// select E.first_name,E.manager_id,M.first_name from employee as E LEFT JOIN employee as M on E.manager_id=M.id
// SELECT employee.id, employee.first_name, employee.last_name,role.title,department.name,role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;

function done() {
  connection.end();
}
