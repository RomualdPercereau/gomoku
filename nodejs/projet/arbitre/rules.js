// matching_case = function(tab, pattern, map, x) {
// 	var i = 0;
// 	var cases = new Array();

// 	while (tab[i]) {
// 		if (pattern[i] != 'X') {
// 			cases.push(map[get_id(x, i)];
// 		}
// 		i++;
// 	}
// }


function point(x, y, id)
{
	this.x = x;
	this.y = y;
	this.id = id;
}

check_patterns = function (tab, id_player)
{

	if (check_pattern(tab, "XX_OOO_XX", id_player))
		return tab;
	if (check_pattern(tab, "X_OOO_XXX", id_player))
		return tab;
	if (check_pattern(tab, "XXX_OOO_X", id_player))
		return tab;

	if (check_pattern(tab, "XXX_OO_O_", id_player))
		return tab;
	if (check_pattern(tab, "XXX_O_OO_", id_player))
		return tab;

	if (check_pattern(tab, "_O_OO_XXX", id_player))
		return tab;
	if (check_pattern(tab, "_OO_O_XXX", id_player))
		return tab;

	if (check_pattern(tab, "XX_OO_O_X", id_player))
		return tab;
	if (check_pattern(tab, "X_O_OO_XX", id_player))
		return tab;

	return (new Array());

}

check_3_h = function(map, i, id_player) {

	var cpt = 1;
	var pos = get_pos(map, i);
	var tab = Array();

	for (var inc = pos['y'] - 4; inc < pos['y'] + 5; inc++) {
		tab.push(new point(pos['x'], inc, get_player(map, pos['x'], inc)));
	}
	tab[4] = new point(pos['x'], pos['y'], id_player);
	return (check_patterns(tab, id_player));
}

check_3_v = function(map, i, id_player) {
	var tab = Array();
	var pos = get_pos(map, i);

	for (var i = -4; i < 5; i++) {
		tab.push(new point(pos['x'] + i, pos['y'], get_player(map, pos['x'] + i,  pos['y'])));
	};
	tab[4] = new point(pos['x'], pos['y'], id_player);
	return (check_patterns(tab, id_player));
}


checkcan = function(tab) {
	for (var i in tab)
	{
		tab[i];
		console.log(tab[i]);
	}
}

double_trois_h = function(map, case_id, id_player) {
	var tab;
	var other_tab;
	var i;


	tabv = check_3_v(map, case_id, id_player);
	tabh = check_3_h(map, case_id, id_player);

	if (tabv.length || tabh.length)
	{
		console.log("il est des nôtrreee ! ");
	}

	// tab = check_3_v(map, case_id, id_player);
	// if (tab.length > 1) {
	// 	console.log("hihi");
	// }

	// tab = check_3_h(map, case_id, id_player);
	// console.log("tab horizontal : " + tab)
	// if (tab.length > 1) {
	// 	console.log("OUIinnn");
	// 	i = 0;
	// 	while (tab[i]) {
	// 		if (tab[i] == '_' || tab[i] == 'O') {
	// 			console.log("case " + tab[i] + "en commun ?");
	// 			other_tab = check_3_v(map, tab[i], id_player);
	// 			console.log("___ " + other_tab.length);
	// 			if (other_tab.length > 1)
	// 				return true;
	// 		}
	// 		i++;
	// 	}
	// }
	// else
	// 	return false;
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