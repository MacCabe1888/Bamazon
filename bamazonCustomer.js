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
  displayItems();
});

function displayItems() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
    let priceArr = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i].price % 1 === 0) {
        priceArr.push(`$${res[i].price}.00`);
      } else {
        priceArr.push(`$${res[i].price}`);
      }
    }
    console.log("\nItems for sale:\n");
    for (let i = 0; i < res.length; i++) {
      console.log(`ID: ${res[i].item_id}\nName: ${res[i].product_name}\nPrice: ${priceArr[i]}\n`);
    }
    // Carry the result to the next function. This is necessary because the first inquirer prompt's answer choices will depend on res.length.
    customerPrompt(res);
  });
}

function customerPrompt(res) {
  let id = null;
  let name = null;
  let idChoices = [];
  for (i = 0; i < res.length; i++) {
    idChoices.push(`${res[i].item_id}`);
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "chosenID",
        message: "Please select the ID of the item you would like to order:",
        choices: idChoices
      }
    ]).then(function(inquirerResponse) {
      console.log();
      id = parseInt(inquirerResponse.chosenID);
      name = res[id - 1].product_name;
      inquirer
        .prompt([
          {
            type: "input",
            name: "quantity",
            message: `Please enter the quantity of "${name}" you would like to order:`
          }
        ]).then(function(inquirerResponse) {
          console.log("\nChecking the storage room...\n");
          connection.query("SELECT stock_quantity FROM products WHERE ?",
            {
              item_id: id
            },
            function(err, res) {
              if (err) throw err;
              let orderQuantity = inquirerResponse.quantity;
              let supply = res[0].stock_quantity;
              if (orderQuantity > supply) {
                if (supply === 0) {
                  inquirer
                    .prompt([
                      {
                        type: "confirm",
                        name: "resetDisplay",
                        message: `Unfortunately, we are out of stock of "${name}." Would you like to order something else?`,
                        default: false
                      }
                    ]).then(function(inquirerResponse) {
                      if (inquirerResponse.resetDisplay === true) {
                        displayItems();
                      } else {
                        connection.end();
                      }
                    })
                } else if (supply === 1) {
                  console.log(`Unfortunately, we have but one unit of "${name}" remaining in stock. Please try your order again.`);
                  displayItems();
                } else {
                  console.log(`Unfortunately, we have only ${supply} units of "${name}" remaining in stock. Please try your order again.`);
                  displayItems();
                }
              } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity - " + orderQuantity + " WHERE ?",
                  {
                    item_id: id
                  },
                  function(err) {
                    if (err) throw err;
                  }
                );
                connection.query("SELECT price FROM products WHERE ?",
                  {
                    item_id: id
                  },
                  function(err, res) {
                    if (err) throw err;
                    let unitPrice = res[0].price;
                    let totalCost = orderQuantity * unitPrice;
                    if (totalCost % 1 === 0) {
                      totalCost = `$${totalCost}.00`;
                    } else {
                      totalCost = `$${totalCost}`;
                    }
                    console.log(`Thank you for your patronage! Your total is: ${totalCost}`);
                    connection.end();
                  }
                );
              }
            }
          );
        });
    });
}
