get_pos = function(map, i) {
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

get_id = function(x, y) {
	var ret = x * 19 + y;
	return (ret);
}

check_5_h = function(map, i, id_player) {
	var cpt = 1;
	var pos = get_pos(map, i);

	// incr cpt on left
	var inc = pos['y'] - 1;
	while (inc >= 0 && map[get_id(pos['x'], inc)] == id_player) {
		inc--;
		cpt++;
	}
	// incr cpt on right
	inc = pos['y'] + 1;
	while (inc <= 18 && map[get_id(pos['x'], inc)] == id_player) {
		inc++;
		cpt++;
	}
	if (cpt >= 5)
		return (id_player);
	return (0);
}

check_5_v = function(map, i, id_player) {
	var cpt = 1;
	var pos = get_pos(map, i);

	// incr cpt on left
	var inc = pos['x'] - 1;
	while (inc >= 0 && map[get_id(inc, pos['y'])] == id_player) {
		inc--;
		cpt++;
	}
	// incr cpt on right
	inc = pos['y'] + 1;
	while (inc <= 18 && map[get_id(inc, pos['y'])] == id_player) {
		inc++;
		cpt++;
	}
	if (cpt >= 5)
		return (id_player);
	return (0);
}

check_5_d1 = function(map, i, id_player) {
	var cpt = 1;
	var pos = get_pos(map, i);

	// incr cpt on top left
	var inc_x = pos['x'] - 1;
	var inc_y = pos['y'] - 1;
	while (inc_x >= 0 && inc_y >= 0 && map[get_id(inc_x, inc_y)] == id_player) {
		inc_x--;
		inc_y--;
		cpt++;
	}
	// incr cpt on bottom right
	inc_x = pos['x'] + 1;
	inc_y = pos['y'] + 1;
	while (inc_x <= 18 && inc_y <= 18 && map[get_id(inc_x, inc_y)] == id_player) {
		inc_x++;
		inc_y++;
		cpt++;
	}
	if (cpt >= 5)
		return (id_player);
	return (0);
}

check_5_d2 = function(map, i, id_player) {
	var cpt = 1;
	var pos = get_pos(map, i);

	var inc_x = pos['x'] + 1;
	var inc_y = pos['y'] - 1;
	while (inc_x <= 18 && inc_y >= 0 && map[get_id(inc_x, inc_y)] == id_player) {
		inc_x++;
		inc_y--;
		cpt++;
	}
	inc_x = pos['x'] - 1;
	inc_y = pos['y'] + 1;
	while (inc_x >= 0 && inc_y <= 18 && map[get_id(inc_x, inc_y)] == id_player) {
		inc_x--;
		inc_y++;
		cpt++;
	}
	if (cpt >= 5)
		return (id_player);
	return (0);
}

check_5 = function(map, i, id_player) {

	var win = check_5_h(map, i, id_player); // 5 horizontal
	if (win == 0)
		win = check_5_v(map, i, id_player); // 5 vertical
	if (win == 0)
		win = check_5_d1(map, i, id_player); // 5 diagonale gauche -> droite
	if (win == 0)
		win = check_5_d2(map, i, id_player); // 5 diagonale droite -> gauche
	return win;
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

	// check victoire/défaite
	if (req.session.score_p1 == 10)
		win = 1;
	else if (req.session.score_p2 == 10)
		win = 2;
	else
		win = check_5(req.session.map, req.params.case_id, req.params.id_player);
	}

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