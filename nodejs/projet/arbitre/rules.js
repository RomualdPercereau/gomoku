check_take_v = function(map, i, id_player) {
	var tab = Array();
	var pos = get_pos(map, i);


	for (var i = -3; i < 4; i++) {
		tab.push(new point(pos['x'] + i, pos['y'], get_player(map, pos['x'] + i,  pos['y'])));
	};
	tab[3] = new point(pos['x'], pos['y'], id_player);

	if (check_pattern(tab, "OEEOXXX", id_player)) {
		map[get_id(pos['x'] - 1, pos['y'])] = 0;
		map[get_id(pos['x'] - 2, pos['y'])] = 0;
		return (map);
	}
	if (check_pattern(tab, "XXXOEEO", id_player)) {
		map[get_id(pos['x'] + 1, pos['y'])] = 0;
		map[get_id(pos['x'] + 2, pos['y'])] = 0;
		return (map);
	}
	return (new Array());
}

check_take_h = function(map, i, id_player) {
	var pos = get_pos(map, i);
	var tab = Array();

	for (var inc = pos['y'] - 3; inc < pos['y'] + 4; inc++) {
		tab.push(new point(pos['x'], inc, get_player(map, pos['x'], inc)));
	}
	tab[3] = new point(pos['x'], pos['y'], id_player);
	console.log(tab);

	if (check_pattern(tab, "OEEOXXX", id_player)) {
		map[get_id(pos['x'], pos['y'] - 1)] = 0;
		map[get_id(pos['x'], pos['y'] - 2)] = 0;
		return (map);
	}
	if (check_pattern(tab, "XXXOEEO", id_player)) {
		map[get_id(pos['x'], pos['y'] + 1)] = 0;
		map[get_id(pos['x'], pos['y'] + 2)] = 0;
		return (map);
	}
	return (new Array());

}

check_take = function(map, i, id_player) {
	var map2;

	//if ((map = check_take_v(map, i, id_player)) == "")
		map2 = check_take_h(map, i, id_player);
	return (map2);
}

function mmatch(pattern, tab)
{
	this.pattern = pattern;
	this.tab = tab;
}

function point(x, y, id, symbole)
{
	this.x = x;
	this.y = y;
	this.id = id;
}

check_patterns = function (tab, id_player)
{

	if (check_pattern(tab, "XX_OOO_XX", id_player))
		return (new mmatch("XX_OOO_XX", tab));
	if (check_pattern(tab, "_O-OO_XXX", id_player))
		return (new mmatch("_O-OO_XXX", tab));
	if (check_pattern(tab, "X_OOO_XXX", id_player))
		return (new mmatch("X_OOO_XXX", tab));
	if (check_pattern(tab, "XXX_OOO_X", id_player))
		return (new mmatch("XXX_OOO_X", tab));

	if (check_pattern(tab, "XXX_OO-O_", id_player))
		return (new mmatch("XXX_OO-O_", tab));
	if (check_pattern(tab, "_OO-O_XXX", id_player))
		return (new mmatch("_OO-O_XXX", tab));

	if (check_pattern(tab, "XX_OO-O_X", id_player))
		return (new mmatch("XX_OO-O_X", tab));
	if (check_pattern(tab, "X_O-OO_XX", id_player))
		return (new mmatch("X_O-OO_XX", tab));

	if (check_pattern(tab, "XXX_O-OO_", id_player))
		return (new mmatch("XXX_O-OO", tab));
	if (check_pattern(tab, "_OO-O_XXX", id_player))
		return (new mmatch("_OO-O_XXX", tab));


	return (new mmatch("", new Array()));

}

check_3_h = function(map, i, id_player, second) {
	var cpt = 1;
	var pos = get_pos(map, i);
	var tab = Array();
	if (second === undefined)
		second = id_player;
	//console.log("haha " + second);

	for (var inc = pos['y'] - 4; inc < pos['y'] + 5; inc++) {
		tab.push(new point(pos['x'], inc, get_player(map, pos['x'], inc)));
	}
	tab[4] = new point(pos['x'], pos['y'], second); // ICI LE PB 
	//console.log(tab);
	return (check_patterns(tab, id_player));
}

check_3_v = function(map, i, id_player, second ) { // rien pour id player (O) || valeur settée (0?) si setté (-)
	var tab = Array();
	var pos = get_pos(map, i);
	if (second === undefined)
		second = id_player;
	//console.log("hihi " + second);
	for (var i = -4; i < 5; i++) {
		tab.push(new point(pos['x'] + i, pos['y'], get_player(map, pos['x'] + i,  pos['y'])));
	};
	tab[4] = new point(pos['x'], pos['y'], second); // ICI LE PB
	return (check_patterns(tab, id_player));
}


checkcan = function(map, match, id_player) {
	var pos = 0;
	var player;
	for (var i in match.tab)
	{
		console.log(match.pattern);
		if (match.pattern[pos] == '-' || match.pattern[pos] == 'O')
		{
			if (match.pattern[pos] == '-')
				player = 0;
			else
				player = id_player;
			//console.log(get_id(match.tab[i].x, match.tab[i].y));
		//	console.log("je vais check := "  + "simbole " +match.pattern[pos]);
			mmatchv = check_3_v(map, get_id(match.tab[i].x, match.tab[i].y),id_player, player);
		//	console.log("::je vais check := " + match.tab[i] + "simbole " +match.pattern[pos]);
			
			mmatchh = check_3_h(map, get_id(match.tab[i].x, match.tab[i].y),id_player, player); // pour faire je ne sais pas quoi ^^
//
		//	console.log("koink")
		//	console.log(mmatchv)
		//	console.log(mmatchh)
//
			if (mmatchv.tab.length || mmatchh.tab.length)
			{
				console.log("Nop ! ");
			}
		}
		pos++;
	}
}

double_trois_h = function(map, case_id, id_player) {
	var tab;
	var other_tab;
	var i;

	mmatchv = check_3_v(map, case_id, id_player);
	mmatchh = check_3_h(map, case_id, id_player);

	if (mmatchv.tab.length)
	{
		console.log("il est des nôtrreee V  ! ");
		checkcan(map, mmatchv, id_player);
	}


	if (mmatchh.tab.length)
	{
		console.log("il est des nôtrreee H  ! ");
		checkcan(map, mmatchh, id_player);

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