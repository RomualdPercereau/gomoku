
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.about = function(req, res){
  res.render('about', { title: 'About', content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'})
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Express', supervar:"foo" })
};

exports.postcontact = function(req, res){
  res.render('postcontact', { title: 'Contact', nom:req.body.nom })
  //Gestion du message
  //...
};

exports.rmsession = function (req, res)
{
  req.session.destroy();
  res.status(200);
  res.send("");

}

exports.arbitre = function(req, res){
	var arb = require('../arbitre/arbitre.js');
	var ret = arb.main_game(req);
		
	res.status(200);
	res.send(ret);
};

exports.game = function(req, res){
  res.render('game', { title: 'game', supervar:"foo" })
};

exports.ia = function(req, res){

console.log(req.session)
  var request = require('request');
  request.post(
{
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://localhost/ia.php',
  body:    "query=" + req.body['query']
},   
   function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var csv = body;
          // Continue with your processing here.
          res.status(200);
          res.send(body);
      }
      else
      {
          res.status(400);
          res.send("L'IA n'a pas été trouvée ");
      }
  });


};
