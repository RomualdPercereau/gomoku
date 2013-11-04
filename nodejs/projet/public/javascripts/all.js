$(function() {


if (location.pathname == "/game")
{
	mode = ""

  $(function() {
    $( "#dialog-confirm" ).dialog({
    	title: "Vous jouez ? ",
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "1 vs 1": function() {
          $( this ).dialog( "close" );
          mode = "PVP";
        },
        "Joueur contre IA": function() {
          $( this ).dialog( "close" );
          mode = "PVI";

        }
      }
    });
  });



	$(".line li").click(function()
	{
		console.log("go" + mode);
		id = this.id.split("-")[1];
		$.getJSON("arbitre/" + id, function(data)
		{
			console.log(data)
			$("#id-" + id).append("<div id='circle-" + id+ "' class='circle'></div>");
			$("#circle-" + id).css("background", data['color']);
			$("#current_player").html(mode)
		});
	})



}

})