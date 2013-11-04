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
		$.getJSON("arbitre/" + id_player + "/" + id, function(data)
		{			// $("#id-" + id).append("<div id='circle-" + id+ "' class='circle'></div>");

			id_player = (id_player + 1) %2
			console.log(data)
			refreshMap(data['map'])
			// $("#circle-" + id).css("background", data['color']);
			$("#current_player").html(mode)
		});
	})
	$("#restart").click(function()
	{
		document.cookie = "connect.sid=" +escape(-1);
		window.location.href=window.location.href
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
					$("#circle-" + i).css("background", "green");
				}
			}
			if (map[i] == 2)
			{
				if ($("#circle-" + i).html() === undefined)
				{
					$("#id-" + i).append("<div id='circle-" + i+ "' class='circle'></div>");
					$("#circle-" + i).css("background", "#FF00FF");
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