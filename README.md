# Employee_Tracker

[![License: MIT](https://img.shields.io/github/license/tiffany-brand/professional-README-generator?style=plastic)](./LICENSE)

## Visual Presentation :

The below link is a demonstration of how this application works in the termianl .

View a complete Video demonstrarion of the application: [Employee Tracker](https://drive.google.com/file/d/1M_cLfTrsWvkfGJ2ZNzClNaH2fUm0D4oa/view)

## Table of Contents

- [Description](#description)
- [User Story](#userStory)
- [Acceptance Criteria](#acceptance-criteria)
- [Technologies](#technologies)
- [Usage](#usage)
- [Installation](#installation)
- [License](#license)
- [Questions](#questions)

## Description:

A node.js application that uses user input from inquirer to populate an employee tracker database displaying members of a company.
By using a command line input application, the user will be able to add departments, roles and employees. In addition to adding departments, roles and employees, the user can also update the employee role. The user will be able to view the information in the application in tables where they can also view the added and update functionality. Instead of the user having to manually type in an ID, the SQL SELECT was utilized to list possible options available in the cli.

## User Story:

`AS A business owner I WANT to be able to view and manage the departments, roles, and employees in my company SO THAT I can organize and plan my business`

## Acceptance Criteria:

GIVEN a command-line application that accepts user input

- WHEN I start the application
  - THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
- WHEN I choose to view all departments
  - THEN I am presented with a formatted table showing department names and department ids
- WHEN I choose to view all roles
  - THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
- WHEN I choose to view all employees
  - THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
- WHEN I choose to add a department
  - THEN I am prompted to enter the name of the department and that department is added to the database
- WHEN I choose to add a role
  - THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
- WHEN I choose to add an employee
  - THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
- WHEN I choose to update an employee role
  - THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Technologies:

<p>
 <img src="https://img.shields.io/badge/-MySQL2-red" />
<img src="https://img.shields.io/badge/-JavaScript-purple" />
<img src="https://img.shields.io/badge/-Node-green" />
<img src="https://img.shields.io/badge/-Inquirer-grey" />
 <img src="https://img.shields.io/badge/-JQuery-red" />
 </p>

## Usage:

Load the module dependencies into your code with a require call:
`const inquirer = require(‘inquirer’);`
`const mysql = require("mysql2");`
`const cTable = require("console.table");`

Open terminal

1. Type 'node index.js' or 'npm start'
2. Answer the prompts that follow
3. Add departments, roles, employees (one row at a time)
4. View departments, roles, employees
5. Update employee roles
6. Update employee managers
7. View employees by manager
8. Delete departments, roles, and employees (one row at a time)

## Installation:

💾

- To install all file in order for npm to work
  `npm install`

- To create a json file
  `npm init`

- To use inquirer
  `npm install inquirer`

- To connect to MySql database
  `npm install mysql2`
- To format tables
  `npm install console-table`

## License:

This repository is licensed under the [MIT license](./LICENSE).

## Questions:

Please contact me at

- GitHub : [nkamth](https://github.com/nkamth)
- Email : [namitha.289@gmail.com](mailto:namitha.289@gmail.com)
