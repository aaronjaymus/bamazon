var inquirer = require('inquirer');

module.exports = {
	start: function(){
		inquirer.prompt([
				{
					name: "viewSelect",
					choices: ["customer","manager","supervisor", "quit"],
					message: "Which application view will you be using?",
					type: "list"
				}
			]).then(function(answer){
				switch(answer.viewSelect){
					case "customer":
						customerView();
						break;
					case "manager":
						managerView();
						break;
					case "supervisor":
						supervisorView();
						break;
					case "quit":
						console.log("Maybe next time.");
						break;	
					default:
						console.log("Select view function not working.");			
				}
			});
	}
}
function customerView(){
	var view = require("./bamazonCustomer.js");
	view.customer();
};

function managerView(){
	var view = require("./bamazonManager.js");
	view.manager();
};

function supervisorView(){
	var view = require("./bamazonSupervisor.js");
	view.supervisor();
};

module.exports.start();