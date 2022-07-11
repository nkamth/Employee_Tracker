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
  console.log(`\n-------------------------------------------\n`);
  console.log(`\n          EMPLOYEE TRACKER                 \n`);
  console.log(`\n-------------------------------------------\n`);
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
          "1.View all Departments",
          "2.View all Roles",
          "3.View all Employees",
          "4.View all Employees by Manager",
          "5.View all Employees by Department",
          "6.Add a Department",
          "7.Add a role",
          "8.Add an Employee",
          "9.Update an employee role",
          "10.Update Employee Manager",
          "11.Delete an Employee",
          "12.Delete a Role",
          "13.Delete a Department",
          "14.View the Total Utilized Budget of a Dept",
          "15.----- DONE",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.mainQuestion) {
        case "1.View all Departments":
          viewDepartment();
          break;
        case "2.View all Roles":
          viewRoles();
          break;
        case "3.View all Employees":
          viewEmployees();
          break;
        case "4.View all Employees by Manager":
          viewEmpByManager();
          break;
        case "5.View all Employees by Department":
          viewEmpByDept();
          break;
        case "6.Add a Department":
          addDepartment();
          break;
        case "7.Add a role":
          addRole();
          break;
        case "8.Add an Employee":
          addEmployee();
          break;
        case "9.Update an employee role":
          updateEmployee();
          break;
        case "10.Update Employee Manager":
          updateManager();
          break;
        case "11.Delete an Employee":
          deleteEmployee();
          break;
        case "12.Delete a Role":
          deleteRole();
          break;
        case "13.Delete a Department":
          deleteDepartment();
          break;
        case "14.View the Total Utilized Budget of a Dept":
          viewBudget();
          break;
        default:
          done();
      }
    });
}

var listDeptNames = [];
var listEmp = [];
var listRoles = [];

function deptChoices() {
  connection.query("SELECT name FROM department", (err, data) => {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      listDeptNames.push(data[i].name);
    }
  });
  return;
}

function empChoices() {
  connection.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;
    listEmp.push(0 + "-" + "NONE");
    for (i = 0; i < data.length; i++) {
      listEmp.push(
        data[i].id + "-" + data[i].first_name + " " + data[i].last_name
      );
    }

    console.log(listEmp);
  });
  return;
}

function roleChoices() {
  connection.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      listRoles.push(data[i].id + "-" + data[i].title);
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
      console.log(
        `\n --------------------NEXT QUESTION ------------------------- \n`
      );
      mainQuestion();
    }
  );
}

function viewRoles() {
  console.log("\n - - - - - - - - - - - - - - - - -");
  console.log("******* All Roles *******");
  console.log(" - - - - - - - - - - - - - - - - -\n");
  connection.query(
    "SELECT title as Job_Title , R.id , D.name as Dept_Name , salary FROM role as R JOIN department as D on R.department_id=D.id ORDER BY R.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      console.log(
        `\n --------------------NEXT QUESTION ------------------------- \n`
      );
      mainQuestion();
    }
  );
}

function viewEmployees() {
  console.log("\n - - - - - - - - - - - - - - - - -");
  console.log("******* All Employees *******");
  console.log(" - - - - - - - - - - - - - - - - -\n");
  connection.query(
    "SELECT E.id, E.first_name, E.last_name,R.title as Job_Title,D.name as Dept_Name,R.salary,M.first_name as Manager_name FROM employee as E LEFT JOIN role as R ON E.role_id = R.id LEFT JOIN department as D ON R.department_id = D.id LEFT JOIN employee as M on E.manager_id=M.id ORDER BY E.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      console.log(
        `\n --------------------NEXT QUESTION ------------------------- \n`
      );
      mainQuestion();
    }
  );
}

function viewEmpByManager() {
  //get all the employee list
  connection.query("SELECT * FROM employee", (err, emplRes) => {
    if (err) throw err;
    const employeeChoice = [
      {
        name: "None",
        value: 0,
      },
    ];
    emplRes.forEach((emp) => {
      let qObj = {
        name: emp.first_name + " " + emp.last_name,
        value: emp.id,
      };
      employeeChoice.push(qObj);
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "manager_id",
          choices: employeeChoice,
          message: "which Manager's Employees you want to view ?",
        },
      ])
      .then((answer) => {
        let manager_id, query;
        if (answer.manager_id) {
          query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
        R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
        FROM employee AS E LEFT JOIN role AS R ON E.role_id = R.id
        LEFT JOIN department AS D ON R.department_id = D.id
        LEFT JOIN employee AS M ON E.manager_id = M.id
        WHERE E.manager_id = ?;`;
        } else {
          manager_id = null;
          query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
        R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
        FROM employee AS E LEFT JOIN role AS R ON E.role_id = R.id
        LEFT JOIN department AS D ON R.department_id = D.id
        LEFT JOIN employee AS M ON E.manager_id = M.id
        WHERE E.manager_id is null;`;
        }
        connection.query(query, [answer.manager_id], (err, res) => {
          if (err) throw err;
          console.log("\n - - - - - - - - - - - - - - - - -");
          console.log(`******* All Employees By Manager *******`);
          console.log(" - - - - - - - - - - - - - - - - -\n");
          console.table(res);
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function viewEmpByDept() {
  connection.query("SELECT * from department", (err, res) => {
    if (err) throw err;
    const deptList = [];
    res.forEach((dept) => {
      let qObj = {
        name: dept.name,
        id: dept.id,
      };
      deptList.push(qObj);
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which dept employees you want to view ?",
          choices: deptList,
        },
      ])
      .then((answer) => {
        let query = `select E.id,E.first_name,E.last_name,R.title,R.salary,D.name from employee as E LEFT JOIN role as R on E.role_id=R.id LEFT JOIN department as D on R.department_id=D.id WHERE D.name=?;`;
        connection.query(query, [answer.id], (err, res) => {
          if (err) throw err;
          console.log("\n - - - - - - - - - - - - - - - - -");
          console.log(`******* All Employees By Department *******`);
          console.log(" - - - - - - - - - - - - - - - - -\n");
          console.table(res);
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        });
      });
  }); //end of dept query
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
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        }
      );
    });
}

function addRole() {
  const departments = [];
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    res.forEach((dep) => {
      let qObj = {
        value: dep.id,
        name: dep.name,
        // value: dep.id,
      };
      departments.push(qObj);
    });

    // res.forEach(({ id, name }) => {
    //   departments.push({
    //     name: name,
    //     value: id,
    //   });
    // });
  });
  // deptChoices();
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
        name: "deptId",
        message: "Which Department does the role belong to?",
        // choices: listDeptNames,
        choices: departments,
      },
    ])
    // .then((answer) => {
    //   connection.query(
    //     `SELECT id from department where name ="${answer.deptName}"`,
    //     (err, res) => {
    //       if (err) throw err;
    //       connection.query(
    //         `INSERT INTO role(title,salary,department_id) VALUES("${answer.roleName}",${answer.salary},${res[0].id})`,
    //         (err, res) => {
    //           if (err) throw err;
    //           console.log(
    //             ` \n--> ADDED Role "${answer.roleName}" TO THE DATABASE !!\n `
    //           );
    //           mainQuestion();
    //         }
    //       );
    //     }
    //   );
    // });
    .then((answer) => {
      // console.log(answer);
      connection.query(
        `INSERT INTO role(title,salary,department_id) VALUES("${answer.roleName}",${answer.salary},"${answer.deptId}")`,
        (err, res) => {
          if (err) throw err;
          console.log(
            ` \n--> ADDED Role "${answer.roleName}" TO THE DATABASE !!\n `
          );
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        }
      );
    });
}

function addEmployee() {
  // ...
  const roleList = [];
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    res.forEach((roles) => {
      let qObj = {
        value: roles.id,
        name: roles.title,
      };
      roleList.push(qObj);
    });
  });

  // ...
  const empList = [
    {
      name: "None",
      value: 0,
    },
  ];
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    res.forEach((emp) => {
      let qObj = {
        value: emp.id,
        name: emp.first_name + " " + emp.last_name,
      };
      empList.push(qObj);
    });
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is Employees First Name ?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is Employee's Last Name ?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is Employee's Role ?",
        choices: roleList,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the Employee's Manager ?",
        choices: empList,
      },
    ])
    .then((answer) => {
      console.log(answer);
      console.log(answer.manager_id);
      let manager_id = answer.manager_id !== 0 ? answer.manager_id : null;
      connection.query(
        `INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES("${answer.firstName}","${answer.lastName}",${answer.roleId},?) `,
        [[manager_id]],
        (err, res) => {
          if (err) throw err;
          console.log(
            ` \n--> ADDED Employee "${answer.firstName}" TO THE DATABASE !!\n `
          );
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        }
      );
    });
}

function updateEmployee() {
  const empList = [];
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    res.forEach((emp) => {
      let qObj = {
        value: emp.id,
        name: emp.first_name + " " + emp.last_name,
      };
      empList.push(qObj);
    });
    const roleList = [];
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      res.forEach((role) => {
        let qObjR = {
          value: role.id,
          name: role.title,
        };
        roleList.push(qObjR);
      });

      inquirer
        .prompt([
          {
            type: "list",
            name: "empId",
            message: "Who's role do you want to update?",
            choices: empList,
          },
          {
            type: "list",
            name: "roleId",
            message: "What is the Employee's New Role ?",
            choices: roleList,
          },
        ])
        .then((answer) => {
          connection.query(
            `UPDATE employee SET role_id=${answer.roleId} WHERE id=${answer.empId}`,
            (err, res) => {
              if (err) throw err;
              console.log(` \n--> Successfully Updated Employee's role !!\n `);
              console.log(
                `\n --------------------NEXT QUESTION ------------------------- \n`
              );
              mainQuestion();
            }
          );
        });
    }); // end of  connection.query(role)
  }); // end of connection.query(employee)
}

function updateManager() {
  //get all the employee list
  connection.query("SELECT * FROM employee", (err, emplRes) => {
    if (err) throw err;
    const employeeChoice = [];
    emplRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    const managerChoice = [
      {
        name: "None",
        value: 0,
      },
    ]; //an employee could have no manager
    emplRes.forEach(({ first_name, last_name, id }) => {
      managerChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "who do you want to update?",
        },
        {
          type: "list",
          name: "manager_id",
          choices: managerChoice,
          message: "whos is the employee's new manager?",
        },
      ])
      .then((answer) => {
        const query = `UPDATE employee SET ? WHERE id = ?;`;
        let manager_id = answer.manager_id !== 0 ? answer.manager_id : null;
        connection.query(
          query,
          [{ manager_id: manager_id }, answer.id],
          (err, res) => {
            if (err) throw err;

            console.log(
              `\n---- successfully updated employee's manager-------\n`
            );
            console.log(
              `\n --------------------NEXT QUESTION ------------------------- \n`
            );
            mainQuestion();
          }
        );
      });
  });
}

function deleteDepartment() {
  const departments = [];
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    res.forEach((dep) => {
      let qObj = {
        name: dep.name,
        value: dep.id,
      };
      departments.push(qObj);
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: departments,
        message: "which department do u want to delete?",
      },
    ];

    inquirer
      .prompt(questions)
      .then((answer) => {
        const query = `DELETE FROM department WHERE id = ?`;
        connection.query(query, [answer.id], (err, res) => {
          if (err) throw err;
          console.log("------- **** ---------");
          console.log(`${res.affectedRows} row(s) successfully deleted!`);
          console.log("------- **** ---------");
          mainQuestion();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function deleteRole() {
  const departments = [];
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;

    const roleChoice = [];
    res.forEach(({ title, id }) => {
      roleChoice.push({
        name: title,
        value: id,
      });
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          choices: roleChoice,
          message: "which role do u want to delete?",
        },
      ])
      .then((answer) => {
        const query = `DELETE FROM role WHERE id = ?`;
        connection.query(query, [answer.id], (err, res) => {
          if (err) throw err;
          console.log("------- **** ---------");
          console.log(`${res.affectedRows} row(s) successfully deleted!`);
          console.log("------- **** ---------");
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function deleteEmployee() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employeeChoice = [];
    res.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "which employee do u want to delete?",
        },
      ])
      .then((answer) => {
        const query = `DELETE FROM employee WHERE id = ?`;
        connection.query(query, [answer.id], (err, res) => {
          if (err) throw err;
          console.log("------- **** ---------");
          console.log(`${res.affectedRows} row(s) successfully deleted!`);
          console.log("------- **** ---------");
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function viewBudget() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    const depChoice = [];
    res.forEach(({ name, id }) => {
      depChoice.push({
        name: name,
        value: id,
      });
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          choices: depChoice,
          message: "which department's budget do you want to see?",
        },
      ])
      .then((answer) => {
        const query = `SELECT D.name, SUM(salary) AS budget FROM
      employee AS E LEFT JOIN role AS R
      ON E.role_id = R.id
      LEFT JOIN department AS D
      ON R.department_id = D.id
      WHERE D.id = ?
      `;
        connection.query(query, [answer.id], (err, res) => {
          if (err) throw err;
          console.table(res);
          console.log(
            `\n --------------------NEXT QUESTION ------------------------- \n`
          );
          mainQuestion();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

// select E.first_name,E.manager_id,M.first_name from employee as E LEFT JOIN employee as M on E.manager_id=M.id
// SELECT employee.id, employee.first_name, employee.last_name,role.title,department.name,role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;

function done() {
  connection.end();
}
