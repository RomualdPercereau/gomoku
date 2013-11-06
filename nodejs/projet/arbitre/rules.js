check_3_h = function(map, i, id_player) {

	var cpt = 1;
	var pos = get_pos(map, i);
	var tab = Array();
	//tab.push(i);

	for (var inc = pos['y'] - 3; inc < pos['y'] + 4; inc++) {
		tab.push(get_player(map, pos['x'], inc));
	}
	tab[3] = id_player;

	if (check_pattern(tab, "X_OOO_X", id_player))
		console.log("PATTERN MATCH");
	if (check_pattern(tab, "_OOO_XX", id_player))
		console.log("PATTERN MATCH");
	if (check_pattern(tab, "XX_OOO_", id_player))
		console.log("PATTERN MATCH");

	if (check_pattern(tab, "XXXOO_O", id_player))
		console.log("PATTERN MATCH");
	if (check_pattern(tab, "XXOOOXX", id_player))
		console.log("PATTERN MATCH");
	if (check_pattern(tab, "XXOOOXX", id_player))
		console.log("PATTERN MATCH");
	if (check_pattern(tab, "XXOOOXX", id_player))
		console.log("PATTERN MATCH");
	if (check_pattern(tab, "XXOOOXX", id_player))
		console.log("PATTERN MATCH");

	console.log(tab);

	// incr cpt on left
	//var inc = pos['y'] - 1;
	/*while (inc >= 0 && map[get_id(pos['x'], inc)] == id_player) {
		tab.push(get_id(pos['x'], inc));
		inc--;
		cpt++;
	}
	if (inc >= 0 && map[get_id(pos['x'], inc)] != id_player && map[get_id(pos['x'], inc)] != 0)
		return (new Array());
	// incr cpt on right
	inc = pos['y'] + 1;
	while (inc <= 18 && map[get_id(pos['x'], inc)] == id_player) {
		tab.push(get_id(pos['x'], inc));
		inc++;
		cpt++;
	}
	if (inc <= 18 && map[get_id(pos['x'], inc)] != id_player && map[get_id(pos['x'], inc)] != 0)
		return (new Array());*/
	//tab.sort();
	return (tab);
}

check_3_v = function(map, i, id_player) {
	var cpt = 1;
	var pos = get_pos(map, i);
	var tab = Array();
	tab.push(i);

	// incr cpt on left
	var inc = pos['x'] - 1;
	while (inc >= 0 && map[get_id(inc, pos['y'])] == id_player) {
		tab.push(get_id(inc, pos['y']));
		inc--;
		cpt++;
	}
	if (inc >= 0 && map[get_id(inc, pos['y'])] != id_player && map[get_id(inc, pos['y'])] != 0)
		return (new Array());
	// incr cpt on right
	inc = pos['x'] + 1;
	while (inc <= 18 && map[get_id(inc, pos['y'])] == id_player) {
		tab.push(get_id(inc, pos['y']));
		inc++;
		cpt++;
	}
	if (inc <= 18 && map[get_id(inc, pos['y'])] != id_player && map[get_id(inc, pos['y'])] != 0)
		return (new Array());
	tab.sort();
	return (tab);
}

double_trois_h = function(map, case_id, id_player) {
	var tab;
	var other_tab;
	var i;

	tab = check_3_h(map, case_id, id_player);
	console.log("tab horizontal : " + tab)
	if (tab.length == 3) {
		i = 0;
		while (tab[i]) {
			console.log("case " + tab[i] + "en commun ?");
			other_tab = check_3_v(map, tab[i], id_player);
			console.log("___ " + other_tab.length);
			if (other_tab.length == 3)
				return true;
			i++;
		}
	}
	else
		return false;
	return false;
}

double_trois = function(map, case_id, id_player) {
	if (double_trois_h(map, case_id, id_player))
		return false;
	return true;
}

allowed_move = function(map, case_id, id_player) {
	var allowed = double_trois(map, case_id, id_player);
	return (allowed);
}

check_5_h = function(map, i, id_player, qte) {
	if (! qte)
		qte = 5;

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
	if (cpt >= qte)
		return (id_player);
	return (0);
}

check_5_v = function(map, i, id_player, qte) {
	if (! qte)
		qte = 5;

	var cpt = 1;
	var pos = get_pos(map, i);

	// incr cpt on left
	var inc = pos['x'] - 1;
	while (inc >= 0 && map[get_id(inc, pos['y'])] == id_player) {
		inc--;
		cpt++;
	}
	// incr cpt on right
	inc = pos['x'] + 1;
	while (inc <= 18 && map[get_id(inc, pos['y'])] == id_player) {
		inc++;
		cpt++;
	}
	if (cpt >= qte)
		return (id_player);
	return (0);
}

check_5_d1 = function(map, i, id_player, qte) {
	if (! qte)
		qte = 5;

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
	if (cpt >= qte)
		return (id_player);
	return (0);
}

check_5_d2 = function(map, i, id_player, qte) {
	if (! qte)
		qte = 5;
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
	if (cpt >= qte)
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