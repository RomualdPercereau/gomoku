exports.simple_test = function(req) {

	var new_user = true;

	if(req.session.lastPage)
		new_user = false;

	if (new_user) {
		var map = new Array();
		var i = 0;
		var j;
		while (i < 16)
		{
			map[i] = new Array();
			j = 0;
			while (j < 16)
			{
				map[i][j] = 0;
				j++;
			}
			i++;
		}
		req.session.map = map;
	}

	req.session.lastPage = '/arbitre';

	var test = req.params.case_id;

	var json = {'id' : test,
				'color' : '#FF00FF',
				'map' : req.session.map
				};
				return (json);
}