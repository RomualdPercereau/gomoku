
/*
 * GET home page.
 */
var endbl5 = 0;
var endbl3 = 0;


getpos = function(i) {
  var y;
  var x;

  if (i == 0) {
    x = 0;
    y = 0;
  }
  else {
    y = i % 19;
    x = Math.floor(i / 19);
  }
  var tab = Array();
  tab['x'] = x;
  tab['y'] = y;
  return (tab);
}


var fs = require('fs');
lines = undefined;

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


exports.endbl3 = function (req, res)
{
  endbl3 = req.params["val"];
  res.status(200);
  res.send("");

}

exports.endbl5 = function (req, res)
{
  endbl5 = req.params["val"];

  res.status(200);
  res.send("");

}

exports.clreplay = function (req, res)
{
  fs.unlink("demo42.txt");
  res.status(200);
  res.send("");
}




exports.arbitre = function(req, res){
	var arb = require('../arbitre/arbitre.js');
	var ret = arb.main_game(req, endbl5, endbl3);
  var tabpos = get_pos(null, parseInt(req.params["case_id"]));
  fs.appendFile('demo42.txt', tabpos['x'] + ";" + tabpos['y'] + "\n", function (err) {
  });

	res.status(200);
	res.send(ret);
};

exports.game = function(req, res){
   endbl5 = 0;
   endbl3 = 0;

  lines = undefined;

  res.render('game', { title: 'game', supervar:"foo" })
};

exports.ia = function(req, res){


if (req.body['demo'] > 0 && !(lines != undefined  &&  lines.length == 0))
{
  if (lines == undefined )
  {
    var filename = "demo" + req.body['demo'] + ".txt";
    fs.readFile(filename, 'utf8', function(err, data)
    {
      if (err) console.log(err);
      // console.log(data);
      lines = data.split(/\r?\n/);

      ret = lines.shift();
      fs.appendFile('demo42.txt', ret + "\n", function (err) {
      res.status(200);
      res.send(ret); 
      });
    });
  }
  else
  {
    res.status(200);
    ret = lines.shift();
    fs.appendFile('demo42.txt', ret + "\n", function (err) {
      res.status(200);
      res.send(ret); 
    });
  }


}
else
{

    var request = require('request');
    request.post(
  {
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'http://localhost/ia.php',
    body:    "query=" + req.body['query'] + "&demo=" + req.body['demo'] + "&endbl5=" + req.body['endbl5'] + "&endbl3=" + req.body['endbl3'] + "&sca=" + req.body['sca'] + "&scb=" + req.body['scb']
  },   
     function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var csv = body;
            // Continue with your processing here.
            res.status(200);
            var linea = body.split("Array");
            fs.appendFile('demo42.txt', linea[0] + "\n", function (err) {
              res.send(body); 
            });
        }
        else
        {
            res.status(400);
            res.send("L'IA n'a pas été trouvée ");
        }
    });
   } 


};
