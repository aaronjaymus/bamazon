var inquirer = require("inquirer");
var mysql = require("mysql");
var connection;
require("console.table");

module.exports = {
	manager: function(){
		options();
		connect();
	}
}

function connect(){
	connection = mysql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "abcdef#1",
		database: "bamazon_db"
	});	

	connection.connect(function(err){
		if(err) throw err;
		//console.log("connected as id "+connection.threadId);
	});	
}

function options(){
	inquirer.prompt([
			{
				name: "toDo",
				message: "What would you like to do?",
				choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product","Quit"],
				type: "list"
			}
		]).then(function(answer){
			switch(answer.toDo){
				case "View products for sale": 
					viewProducts();
					break;
				case "View low inventory":
					viewLow();
					break;
				case "Add to inventory":
					addInventory();
					break;
				case "Add new product":
					addProduct();
					break;
				case "Quit": 
					connection.end();
					var view = require("./bamazon.js");
					view.start();
					break;
				default:
					console.log("Select toDo not working");					
			}
		});
}

function viewProducts(){
	//var query = "SELECT * FROM products";
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;
		console.table(res);
		options();
	});
}

function viewLow(){
	var query = "SELECT * FROM products WHERE stock_quantity<=5";
	connection.query(query, function(err, res){
		if(err) throw err;
		if (typeof res !== 'undefined' && res.length > 0) {
   			console.table(res);
		}else{
			console.log("All products are currently well stocked.");
		}
		options();
	});
}

function addInventory(){
	inquirer.prompt([
			{
				name: "toAddItem",
				message: "Which item would you like to add inventory to?",
				type: "input"
			},{
				name: "toAddAmount",
				message: "How many of this item would you like to add?",
				type: "input"
			}
		]).then(function(answers){
			var itemNum = parseInt(answers.toAddItem);
			var itemQuant = parseInt(answers.toAddAmount);
			connection.query("SELECT * FROM products", function(err, res){
				var elementPos = res.map(function(x){return x.item_id}).indexOf(itemNum);
				if(elementPos===-1){
					console.log("Item number not found.");
					options();
				}else{
					var totalQuant = res[elementPos].stock_quantity+itemQuant;
					var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";
					connection.query(query, [totalQuant, itemNum], function(err, res){
						if(err) throw err;
					});
					options();
				}
			});			
		});
}

function addProduct(){
	deptArray = [];
	connection.query("SELECT department_name FROM departments", function(err, res){
		for(var i=0; i<res.length; i++){
			if(deptArray.indexOf(res[i].department_name)===-1){
				deptArray.push(res[i].department_name);
			}
		}
		//console.log(res);
	});
	inquirer.prompt([
			{
				name: "item",
				message: "What new product would you like to sell?",
				type: "text"
			},{
				name: "department",
				message: "What department will sell this new product?",
				choices: deptArray,
				type: "list"
			},{
				name: "stock",
				message: "How many of this product will you sell?",
				type: "input"
			},{
				name: "price",
				message: "What is the price of this new product?",
				type: "input"
			}
		]).then(function(answers){
			connection.query("INSERT INTO products SET ?", {
				product_name: answers.item,
				department_name: answers.department,
				stock_quantity: answers.stock,
				price: answers.price
			}, function(err,res){
				console.log("Item added successfully.");
				options();
			});
		});
}