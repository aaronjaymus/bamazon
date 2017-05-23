var inquirer = require("inquirer");
var mysql = require("mysql");
var connection;
require("console.table");

module.exports = {
	customer: function(){	
		options();
	}
}

function options(){
	inquirer.prompt([
			{
				name: "toDo",
				message: "What would you like to do?",
				type: "list",
				choices: ["Purchase an item", "Quit"]
			}
		]).then(function(answer){
			if(answer.toDo==="Quit"){
				connection.end();
				var view = require("./bamazon.js");
				view.start();
			}else{
				connect();
				showTable();
			}
		});
}

function connect (){
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

function showTable (){
	var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
	connection.query(query, function(err, res){
		if(err) throw err;
		console.table(res);
		purchaseOptions();
	});
}

function purchaseOptions(){
	inquirer.prompt([
			{
				name: "itemNum",
				message: "Which item would you like to purchase?",
				type: "input"
			},{
				name: "itemQuant",
				message: "How many of this item would you like to purchase?",
				type: "input"
			}
		]).then(function(answer){
			purchase(answer.itemNum, answer.itemQuant);
		});
}

function purchase(item, quantity){
	var itemNum = parseInt(item);
	var itemQuant = parseInt(quantity);
	var dept;
	var query1 = "SELECT * FROM products";
	connection.query(query1, function(err, res){
		if(err) throw err;
		var elementPos = res.map(function(x){return x.item_id}).indexOf(itemNum);
		if(elementPos !== -1){
			if(res[elementPos].stock_quantity>=itemQuant){
				var currentSale = res[elementPos].price * itemQuant;
				var totalSales = res[elementPos].product_sales + currentSale;
				var productInventory = res[elementPos].stock_quantity - itemQuant;
				var department = res[elementPos].department_name;
				var query2 = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id=?";
				connection.query(query2, [productInventory, totalSales, itemNum], function(err, res){
					if(err) throw err;
					console.log("Your purchase total was $"+currentSale);
					options();
				});
				var query3 = "SELECT total_sales FROM departments WHERE department_name=?";
				connection.query(query3, [department], function(err, res){
					if(err) throw err;
					var totalDeptSales = res[0].total_sales+currentSale;
					var query4 = "UPDATE departments SET total_sales=? WHERE department_name=?";
					connection.query(query4, [totalDeptSales, department],function(err, res){
						if(err) throw(err);
					});
				});
			} else {
				console.log("Not enough of those in stock.");
				options();
			}
		}else{
			console.log("Item ID not found.");
			options();
		}
	});
}
