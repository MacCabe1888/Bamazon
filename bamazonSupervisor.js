require("console.table");
let inquirer = require("inquirer");
let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Melomania1888",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayMenu();
});

function displayMenu() {
  console.log();
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Disconnect"]
      }
    ]).then(function(inquirerResponse) {
      switch(inquirerResponse.choice) {
        case "View Product Sales by Department":
          viewSales();
          break;
        case "Create New Department":
          newDept();
          break;
        case "Disconnect":
        default:
          connection.end();
      }
    });
}

function viewSales() {
  connection.query(
  "SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS product_sales, SUM(products.product_sales) - departments.overhead_costs AS total_profit"
  + " FROM departments LEFT JOIN products ON departments.department_name = products.department_name"
  + " GROUP BY departments.department_id",
  function(err, res) {
    if (err) throw err;
    console.log();
    console.table(res);
    displayMenu();
  });
}

function newDept() {
  console.log();
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Please enter the name of the new department you would like to add:"
      },
      {
        type: "input",
        name: "overhead",
        message: "Please enter the total overhead costs incurred as a result of investing in this new department:"
      }
    ]).then(function(inquirerResponse) {
      connection.query(`INSERT INTO departments (department_name, overhead_costs) VALUES ("${inquirerResponse.deptName}", "${inquirerResponse.overhead}")`, function (err) {
        if(err) throw err;
        console.log(`\nNew department "${inquirerResponse.deptName}" was successfully added!`);
        displayMenu();
      });
    });
}
