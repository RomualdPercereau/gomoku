$(function() {


if (location.pathname == "/game")
{
	mode = ""
	id_player = 0;

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
		$.getJSON("arbitre/" + (parseInt(id_player) + 1)  + "/" + id, function(data)
		{
			if (data['move_ok'])
			{
				id_player = (id_player + 1) %2
				console.log(data)
				refreshMap(data['map'])
				$("#current_player").html("Joueur " + (parseInt(id_player) + 1))
				$("#score1").html("Joueur 1 : " + 0)
				$("#score2").html("Joueur 2 : " + 0)
			}
		});
	})


	$("#restart").click(function()
	{
		document.cookie = "connect.sid=" +escape(-1);
		window.location.href = window.location.href
		return (false)
	})


	function refreshMap(map)
	{
		for (var i = map.length - 1; i >= 0; i--) {
			if (map[i] == 1)
			{
				if ($("#circle-" + i).html() === undefined)
				{
					$("#id-" + i).append("<div id='circle-" + i+ "' class='circle'></div>");
					$("#circle-" + i).css("background", "forestgreen");
				}
			}
			if (map[i] == 2)
			{
				if ($("#circle-" + i).html() === undefined)
				{
					$("#id-" + i).append("<div id='circle-" + i+ "' class='circle'></div>");
					$("#circle-" + i).css("background", "maroon");
				}
			}

			if (map[i] == 3)
			{
				if ($("#circle-" + i).html() === undefined)
				{
					$("#id-" + i).append("<div id='circle-" + i+ "' class='circle'></div>");
					$("#circle-" + i).css("background", "red");
				}
			}
		};
	}

}

})