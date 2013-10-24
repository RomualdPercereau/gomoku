var express = require("express");
var app = express();
var crypto = require('crypto');
var node_cache = require('memory-cache');
var dt = new Date();

app.use(express.logger());


// var cache = new node_cache();


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'koink',
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();


app.get('/bistro/add/:a/:b', function(request, response) {
	if (isNaN(request.params.a) || isNaN(request.params.b))
	{
		response.status = 400;
		var json = { "error": 'not numeric' };
	response.send(json);
	}
	else
	{
		response.status = 200;
  	response.send(""+(parseInt(request.params.a) + parseInt(request.params.b)));
  	}
});

app.get('/bistro/sub/:a/:b', function(request, response) {
	if (isNaN(request.params.a) || isNaN(request.params.b))
	{
		response.status = 400;
		var json = { "error": 'not numeric' };
	response.send(json);
	}
	else
	{
		response.status = 200;
 	 response.send(""+(parseInt(request.params.a) - parseInt(request.params.b)));
	}
});

app.get('/bistro/mult/:a/:b', function(request, response) {
	if (isNaN(request.params.a) || isNaN(request.params.b))
	{
		response.status = 400;
		var json = { "error": 'not numeric' };
	response.send(json);
	}
	else
	{
		response.status = 200;
  		response.send(""+(parseInt(request.params.a) * parseInt(request.params.b)));
	}
});


app.get('/bistro/div/:a/:b', function(request, response) {
	if (isNaN(request.params.a) || isNaN(request.params.b) || parseInt(request.params.b) == 0)
	{
		response.status = 400;
		if (parseInt(request.params.b) == 0)
		var json = { "error": 'is null' };			
			else
		var json = { "error": 'not numeric' };
	response.send(json);
	}
	else
	{
		response.status = 200;
  		response.send(""+parseInt(parseInt(request.params.a) / parseInt(request.params.b)));
	}
});



app.get('/cache/get/:key', function(request, response) {
	if (node_cache.get(request.params.key) == null)
	{
		response.status = 400;
		var json = { "error": 'don\'t exist' };
		response.send(json);
	}
	else	
		response.send(node_cache.get(request.params.key));
});


app.get('/cache/set/:key/:value', function(request, response) {
	response.status = 200;
	response.send(node_cache.put(request.params.key, request.params.value));
});

app.get('/cache/set/:key/:value/:expiration', function(request, response) {
	response.status = 200;
	if (request.params.expiration <= 0)
	{
		response.status = 400;
		var json = { "error": "to little" };
		response.send(json);
	}
		else
	response.send(node_cache.put(request.params.key, request.params.value, request.params.expiration));
});

app.get('/crypto/md5/:str', function(request, response) {
	response.status = 200;
	response.send(crypto.createHash('md5').update(request.params.str).digest("hex"));
	// response.send(node_cache.put(request.params.key, request.params.value, request.params.expiration));
});


app.get('/crypto/sha1/:str', function(request, response) {
	response.status = 200;
	response.send(crypto.createHash('sha1').update(request.params.str).digest("hex"));
});


app.get('/crypto/sha1/:str', function(request, response) {
	response.status = 200;
	response.send(crypto.createHash('sha1').update(request.params.str).digest("hex"));
});



app.get('/utils/date', function(request, response) {
	response.status = 200;
	response.send({
				 "day": dt.getDate().toString() ,
				 "month": (dt.getMonth() +1 ).toString(),
				 "year": dt.getFullYear().toString(),
				});
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});