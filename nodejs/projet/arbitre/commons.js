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