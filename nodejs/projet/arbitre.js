exports.simple_test = function(req) {

	var new_user = true;

	if(req.session.lastPage)
		new_user = false;
	req.session.lastPage = '/arbitre';

	var test = req.params.case_id;

	var json = {'id' : test,
				'color' : '#FF00FF',
				'new_user' : new_user
				};
				return (json);
}