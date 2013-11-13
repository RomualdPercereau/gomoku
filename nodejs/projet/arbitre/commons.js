check_pattern = function(tab, pattern, id_player) {

	console.log(id_player);
	if (tab[4].id == 0)
	{
		console.log("c'est un put1 de tiret ! ")
	}
	for(var i = 0; i < 9; i++) {
		if (pattern[i] == 'O') {
		//console.log(pattern[i] + " : match entre " + tab[i] + "et " + id_player);

			if (tab[i].id != id_player) {
				return (false);
			}
		}
		if (pattern[i] == '_' || pattern[i] == '-' ) {
		//console.log(pattern[i] + " : match entre " + tab[i] + "et " + id_player);

			if (tab[i].id != 0 && tab[i].id != id_player) {
		//console.log('b');

				return (false);
			}
		}
	}
	//console.log(pattern);
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