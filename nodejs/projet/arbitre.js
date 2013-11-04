check_5 = function(map) {

	// check horizontal
	var i = 0;
	var cpt = 0;
	var curr_p = 0;
	while (i < 361)
	{
		if (map[i] == 0 || (i != 0 && ((5 - cpt) > (19 - (i % 19)))))
		{
			cpt = 0;
			curr_p = 0;
		}
		else if (map[i] == curr_p)
			cpt++;
		else
		{
			curr_p = map[i];
			cpt = 1;
		}
		i++;
		if (cpt == 5)
			return curr_p;
	}
	// check vertical
	i = 0;
	cpt = 0;
/*
	while (i < 361)
	{
		if (map[i] == 0 || (5 - cpt) > (19 - i / 19))
		{
			cpt = 0;
			curr_p = 0;
		}
		else if (map[i] == curr_p)
			cpt++;
		else
		{
			curr_p = map[i];
			cpt = 1;
		}
		i++;
		if (cpt == 5)
			return curr_p;
	}
*/
	return 0;
}

exports.simple_test = function(req) {

	var new_user = true;
	var move_ok = false;
	var win = 0;

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
	if (req.session.map[req.params.case_id] != 0)
		move_ok = false;
	else {
		move_ok = true;
		req.session.prev_player = req.session.tmp_player;
		req.session.tmp_player = req.session.map[req.params.case_id] = req.params.id_player;
	}

	// check victoire/défaite
	if (req.session.score_p1 == 10)
		win = 1;
	else if (req.session.score_p2 == 10)
		win = 2;
	else
		win = check_5(req.session.map);

	//req.session.prev_player = req.params.id_player;

	// return
	var json = {'id' : req.params.case_id,
				'move_ok' : move_ok,
				'id_player' : req.params.id_player,
				'id_prev_player' : req.session.prev_player,
				'map' : req.session.map,
				'score_p1' : req.session.score_p1,
				'score_p2' : req.session.score_p2,
				'win' : win
				};
	return (json);
}

// score
// detection victoire/défaite
// règles à implémenter