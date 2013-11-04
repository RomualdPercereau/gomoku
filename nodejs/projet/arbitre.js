exports.simple_test = function(req) {

	var test = req.params.case_id;

	var json = {'id' : test,
				'color' : '#FF00FF'};
				return (json);
}