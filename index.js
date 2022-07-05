const mysql = require("mysql");
const inquirer = require("inquirer");

console.log("check");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});
