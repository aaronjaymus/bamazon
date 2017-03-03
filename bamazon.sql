CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR (50) NOT NULL,
	department_name VARCHAR (50) NOT NULL,
	price DECIMAL(10,2),
	stock_quantity INTEGER(10),
	product_sales DECIMAL(10,2) DEFAULT 0,
	PRIMARY KEY (item_id)
);

CREATE TABLE departments(
	department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
	department_name VARCHAR (50) NOT NULL,
	over_head_costs DECIMAL(10,2) NOT NULL,
	total_sales DECIMAL(10,2) DEFAULT 0,
	PRIMARY KEY (department_id)
);

INSERT INTO products 
		(product_name, department_name, price, stock_quantity)
	VALUES
		("Dog bed", "Dogs", 100, 50),
		("Dog food", "Dogs", 29.50, 100),
		("Dog bones", "Dogs", 4.50, 75),
		("Dog dish", "Dogs", 7, 60),
		("Fallout 4", "Video Games", 25, 20),
		("PS4 Console", "Video Games", 299.50, 25),
		("PS4 Controller", "Video Games", 49.75, 12),
		("DOOM", "Video Games", 25, 10),
		("Flannel shirt", "Clothing", 19.50, 15),
		("Jeans", "Clothing", 30, 22),
		("Flat cap", "Clothing", 25, 9),
		("Loafers", "Clothing", 21.50, 10),
		("Cardigan", "Clothing", 40, 18);	

INSERT INTO departments
		(department_name, over_head_costs)
	VALUES
		("Dogs", 450),
		("Video Games", 575),
		("Clothing", 125);			