DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100),
  department_name VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INT(10),
  product_sales DECIMAL(10,2),
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50),
  overhead_costs DECIMAL(10,2),
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
  ("Gibson USA Les Paul Classic T 2017 Electric Guitar, Heritage Cherry Sunburst", "Musical Instruments", 2869.00, 1),
  ("D Z Strad Violin - Model 505F - Hellier Stradivarius Advanced Masterpiece Copy - Full Size (4/4)", "Musical Instruments", 2550.00, 3),
  ("Spyro Reignited Trilogy - PlayStation 4", "Video Games", 29.99, 100),
  ("SOULCALIBUR VI: Standard Edition - PlayStation 4", "Video Games", 33.16, 100),
  ("The Resume Design Book", "Books", 9.99, 10),
  ("Think and Grow Rich", "Books", 6.00, 100),
  ("The Dark Side of the Moon - Pink Floyd - Vinyl", "Music", 24.84, 25),
  ("AM - Arctic Monkeys - Audio CD", "Music", 8.99, 15),
  ("Beats Studio3 Wireless Over-Ear Headphones - Matte Black", "Electronics", 349.95, 30),
  ("New Microsoft Surface Go (Intel Pentium Gold, 8GB RAM, 128GB)", "Electronics", 499.00, 30);
  
INSERT INTO departments (department_name, overhead_costs)
VALUES
  ("Musical Instruments", 5000),
  ("Video Games", 2500),
  ("Books", 1000),
  ("Music", 1000),
  ("Electronics", 20000);

SELECT * FROM products;
SELECT * FROM departments;
