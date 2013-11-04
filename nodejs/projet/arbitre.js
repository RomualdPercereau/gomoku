exports.simple_test = function(req) {

	var new_user = true;
	var move_ok = false;

	if(req.session.lastPage)
		new_user = false;
	req.session.lastPage = '/arbitre';

	if (new_user) {
		var map = new Array();
		var i = 0;
		while (i < 256)
		{
			map[i] = 0;
			i++;
		}
		req.session.map = map;
	}

	if (req.session.map[req.params.case_id] != 0)
		move_ok = false;
	else {
		move_ok = true;
		req.session.map[req.params.case_id] = req.params.id_player;
	}

var json = {'id' : req.params.case_id,
					'move_ok' : move_ok,
					'id_player' : req.params.id_player,
					'map' : req.session.map
				};
	
				return (json);
}