var inquirer = require("inquirer");
var mysql = require("mysql");
var connection;
require("console.table");

module.exports = {
	supervisor: function(){
		connect();
		options();
	}
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
		//console.log("Logged in as "+connection.threadId);
	});
}

function options(){
	inquirer.prompt([
			{
				name: "toDo",
				message: "What would you like to do?",
				choices: ["Create new department", "View Product Sales by Department", "Quit"],
				type: "list"
			}
		]).then(function(answer){
			switch(answer.toDo){
				case "Create new department":
					addDepartment();
					break;
				case "View Product Sales by Department":
					viewSales();
					break;
				case "Quit":
					connection.end();
					var view = require("./bamazon.js");
					view.start();
					break;
				default:
					console.log("toDo select did not work.");			
			}
		});
}

function addDepartment(){
	inquirer.prompt([
			{
				name: "department",
				message: "What is the new department?",
				type: "text"
			},{
				name: "costs",
				message: "What is the overhead cost for this department?",
				type: "input"
			}
		]).then(function(answers){
			var query = "INSERT INTO departments SET ?";
			connection.query(query, {
				department_name: answers.department,
				over_head_costs: answers.costs
			}, function(err, res){
				if(err) throw err;
				console.log("Department added successfully.");
				options();
			});
		});
	
}

function viewSales(){
	var query = "SELECT *, total_sales-over_head_costs AS profit FROM departments";
	connection.query(query, function(err, res){
		if(err) throw err;
		console.table(res);
		options();
	});
}