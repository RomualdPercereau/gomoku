require('./commons.js');
require('./rules.js');

exports.main_game = function(req, endbl5, endbl3) {


	console.log(endbl5 + " " + endbl3)

	var new_user = true;
	var move_ok = false;
	var win = 0;
	var error_msg = "";

	// check session
	if(req.session.lastPage)
		new_user = false;
	req.session.lastPage = '/arbitre';

	// init map et score
	if (new_user) {
		var map = new Array();
		var i = 0;
		while (i < 361)
		{
			map[i] = 0;
			i++;
		}
		req.session.map = map;
		req.session.score_p1 = 0;
		req.session.score_p2 = 0;
		req.session.prev_player = -1;
		req.session.tmp_player = -1;
	}
	// position autorisée
	if (req.session.map[req.params.case_id] != 0) {
		move_ok = false;
		error_msg = "Case déjà occupée";
	}
	else if (endbl3 && !allowed_move(req.session.map, req.params.case_id, req.params.id_player)) {
		move_ok = false;
		error_msg = "Case impossible à cause de la règle du double trois";
	}
	else {

		move_ok = true;
		req.session.prev_player = req.session.tmp_player;
		req.session.tmp_player = req.session.map[req.params.case_id] = req.params.id_player;

	// check mangeage
	var editedmap = check_take(req.session.map, req.params.case_id, req.params.id_player);
	if (editedmap.map.length) {
		req.session.map = editedmap.map;
		if (req.params.id_player == 1)
			req.session.score_p1 += editedmap.score;
		else
			req.session.score_p2 += editedmap.score;
	}
	}

	// check victoire/défaite
	if (req.session.score_p1 >= 10)
		win = 1;
	else if (req.session.score_p2 >= 10)
		win = 2;
	else
		win = check_5(req.session.map, req.params.case_id, req.params.id_player, endbl5);



	// return
	var json = {'id' : req.params.case_id,
				'move_ok' : move_ok,
				'id_player' : req.params.id_player,
				'id_prev_player' : req.session.prev_player,
				'map' : req.session.map,
				'error_msg' : error_msg,
				'score_p1' : req.session.score_p1,
				'score_p2' : req.session.score_p2,
				'win' : win
				};
	return (json);
}