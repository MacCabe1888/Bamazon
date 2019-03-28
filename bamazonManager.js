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
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Disconnect"]
      }
    ]).then(function(inquirerResponse) {
      switch(inquirerResponse.choice) {
        case "View Products for Sale":
          view("");
          break;
        case "View Low Inventory":
          view(" WHERE stock_quantity < 5");
          break;
        case "Add to Inventory":
          restock();
          break;
        case "Add New Product":
          newProduct();
          break;
        case "Disconnect":
        default:
          connection.end();
      }
    });
}

function view(filter) {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products" + filter, function(err, res) {
    if (err) throw err;
    let priceArr = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i].price % 1 === 0) {
        priceArr.push(`$${res[i].price}.00`);
      } else if ((10 * res[i].price) % 1 === 0) {
        priceArr.push(`$${res[i].price}0`);
      } else {
        priceArr.push(`$${res[i].price}`);
      }
    }
    console.log("\nProduct Inventory:");
    for (let i = 0; i < res.length; i++) {
      console.log(`\nID: ${res[i].item_id}\nName: ${res[i].product_name}\nPrice: ${priceArr[i]}\nQuantity in Inventory: ${res[i].stock_quantity}`);
    }
    displayMenu();
  });
}

function restock() {
  console.log();
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "reviewInventory",
          message: "Before you enter the ID and the added quantity of the item whose stock you would like to replenish, would you like to review the product inventory?",
          default: false
        }
      ]).then(function(inquirerResponse) {
        if (inquirerResponse.reviewInventory === true) {
          view("");
        } else {
          console.log();
          connection.query("SELECT item_id FROM products", function(err, res) {
            if (err) throw err;
            let idChoices = [];
            for (i = 0; i < res.length; i++) {
              idChoices.push(`${res[i].item_id}`);
            }
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "chosenID",
                  message: "Please select the ID of the item whose stock you would like to replenish:",
                  choices: idChoices
                },
                {
                  type: "input",
                  name: "addend",
                  message: "Please enter the number of units you would like to add:"
                }
              ]).then(function(inquirerResponse) {
                let id = parseInt(inquirerResponse.chosenID);
                connection.query("UPDATE products SET stock_quantity = stock_quantity + " + inquirerResponse.addend + " WHERE ?",
                  {
                    item_id: id
                  },
                  function(err) {
                    if (err) throw err;
                    console.log(`\nSuccess! You added ${inquirerResponse.addend} unit(s).`)
                    displayMenu();
                  }
                );
              });
          });
        }
      });
}

function newProduct() {
  console.log();
  connection.query("SELECT department_name FROM departments", function(err, res) {
    if (err) throw err;
    let deptChoices = [];
    for (i = 0; i < res.length; i++) {
      deptChoices.push(res[i].department_name);
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "itemName",
          message: "Please enter the name of the new product you would like to add:"
        },
        {
          type: "list",
          name: "department",
          message: "Please select the most appropriate department for the new product:",
          choices: deptChoices
        },
        {
          type: "input",
          name: "price",
          message: "Please enter the price of the new product:"
        },
        {
          type: "input",
          name: "quantity",
          message: "Please enter the starting quantity of the new product:"
        }
      ]).then(function(inquirerResponse) {
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${inquirerResponse.itemName}", "${inquirerResponse.department}", ${inquirerResponse.price}, ${inquirerResponse.quantity})`, function (err) {
          if(err) throw err;
          console.log(`\nNew item "${inquirerResponse.itemName}" was successfully added!`);
          displayMenu();
        });
      });
  });
}
