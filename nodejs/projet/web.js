var express = require("express");
var app = express();
var crypto = require('crypto');
var node_cache = require('memory-cache');
var dt = new Date();



function test_mysql()
{
	app.use(express.logger());

	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	});

	connection.connect();	
	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('The solution is: ', rows[0].solution);
	});

	connection.end();
}


test_mysql();





app.get('/', function(request, response) {
	
	response.status = 200;
	var user = { name: 'John' }
  	response.render('index.jade', {
      globals: { user: "user", currentUser: "req.currentUser" }
    });
    console.log("Pfou")
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});