
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
