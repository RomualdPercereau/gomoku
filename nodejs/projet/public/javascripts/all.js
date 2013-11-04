$(function() {


if (location.pathname == "/game")
{
	console.log("koink");
	$(".line li").click(function()
	{
		console.log(this.id);


		console.log("ok");

		$.getJSON( "arbitre/" + this.id, function( data )
		{
			console.log(data)
		});


	})
}

})