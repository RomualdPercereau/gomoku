check_pattern = function(tab, pattern, id_player) {
	for(var i = 0; i < 6; i++) {
		console.log(pattern[i]);
		if (pattern[i] == 'O') {
			if (tab[i] != id_player)
				return (false);
		}
		if (pattern[i] == '_') {
			if (tab[i] != 0 && tab[i] != id_player)
				return (false);
		}
	}
	return (true);
}

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

get_player = function(map, x, y) {
	if (x < 0 || x > 18)
		return (-1);
	if (y < 0 || y > 18)
		return (-1);
	var ret = x * 19 + y;
	return (map[ret]);
}