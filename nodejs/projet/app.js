/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes');

 var app = module.exports = express.createServer();

// Cookie

app.use(express.cookieParser());
app.use(express.session({secret: 'koink'}));

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
 res.render('index', { title: 'Express' })
});

app.get('/about', routes.about);

app.get('/game', routes.game);

app.get('/arbitre/:id_player/:case_id', routes.arbitre);

app.get('/contact', routes.contact);

app.post('/postcontact', routes.postcontact);

app.get('/rmsession', routes.rmsession);


app.listen(process.env.port || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
