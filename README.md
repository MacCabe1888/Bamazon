# Bamazon
An Amazon-like storefront, in the form of a CLI app. Powered by Node.js and MySQL.

### Overview

In this online store simulator, you can take on three different roles:
1. As a customer, you can view and buy products.
2. As a manager, you can view and restock existing products and add new products to existing departments.
3. As a supervisor, you can view product sales and create new departments.

The code makes use of MySQL queries to interact with the store database, where information on the various products and departments is stored and updated.

### Technical Approach

The Node.js-powered CLI user interface largely consists of inquirer prompts, the user's answers to which are interpreted by MySQL queries in order to update the Bamazon database and/or display data to the user, depending on the type of request.

In order to deal with asynchronicity, many of the functions handling user requests are built with several layers of nested callback functions (attached via the then() method, which handles promises from the inquirer prompts). This ensures that changes in the database and the reflection of those changes in the CLI take place in the desired logical order.

### User Interface Walkthrough

1. Customer UI
    1. In your CLI, navigate to the directory containing "bamazonCustomer.js."
    2. Execute the command "node bamazonCustomer.js."
    3. You will be shown the list of items for sale. Each item is listed with its ID, name, and price information.
    4. Use the arrow keys to scroll through the list of item IDs. Press "enter"/"return" to select the ID corresponding to your desired item.
    5. Enter the quantity of the item you would like to order.
    6.  * If there are enough units of the item remaining in stock to fulfill your order, then the order will go through, and you will be shown your total expenditure.
        * If there is at least one unit remaining, but not enough units to meet your requested quantity, you will be directed to try ordering again (with a smaller quantity if you wish), starting from the ID selection prompt.
        * If the desired item is sold out, then you will be asked whether you would like to order something else.
            * If you enter "y" for "yes," then you will be returned to the ID selection prompt.
            * If you enter "n" for "no," then you will exit the app.
2. Manager UI
    1. In your CLI, navigate to the directory containing "bamazonManager.js."
    2. Execute the command "node bamazonManager.js."
    3. You will be shown a list of options. Choose the action you wish to take by using the arrow keys to scroll through the options and then pressing "enter"/"return."
    4.  * View Products for Sale
            * You will be shown the list of items for sale. Each item is listed with its ID, name, and price information, as well as the quantity remaining in the inventory.
        * View Low Inventory
            * You will be shown the list of items for sale that have a quantity of fewer than five units remaining in the inventory.
        * Add to Inventory
            * You will be given the option to review the product inventory.
                * If you enter "y" for "yes," then you will be shown the list of items for sale.
                * If you enter "n" for "no," then you will be prompted to select the ID of the item whose stock you would like to replenish.
                    * After selecting the ID, enter the number of units of the corresponding item you would like to add to the inventory.
        * Add New Product
            1. Enter the name of the new product you would like to add to the store.
            2. Select the most appropriate department for the new product from the list of existing departments.
            3. Enter a number (no other symbols, but a decimal point followed by the number of cents is allowed) representing the price (in dollars) per unit of the new product.
            4. Enter the initial quantity of the new product to be added to the inventory.
        * Disconnect
            * This option simply disconnects you from the MySQL database so you can exit the app.
3. Supervisor UI
    1. In your CLI, navigate to the directory containing "bamazonSupervisor.js."
    2. Execute the command "node bamazonSupervisor.js."
    3. You will be shown a list of options. Choose the action you wish to take by using the arrow keys to scroll through the options and then pressing "enter"/"return."
    4.  * View Product Sales by Department
            * You will be shown a table displaying the department name, overhead costs, product sales, and total profit for each department.
        * Create New Department
            1. Enter the name of the new department you would like to add to the store.
            2. Enter a number (no other symbols, but a decimal point followed by the number of cents is allowed) representing the total overhead costs (in dollars) incurred as a result of investing in the new department.
        * Disconnect
            * This option simply disconnects you from the MySQL database so you can exit the app.

### Demo

A video demonstration of the app is located in the "demo" folder.

<video width="578" height="368" controls>
  <source src="demo/Demo.webm" type="video/webm">
</video>
