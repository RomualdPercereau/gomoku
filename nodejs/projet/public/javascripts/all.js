$(function() {


if (location.pathname == "/game")
{
	console.log("koink");
	$(".line li").click(function()
	{
		console.log(this.id);



		$.getJSON( "ajax/test.json", function( data ) {
		});


	})
}

})