get_id = function(x, y) {
	var ret = parseInt(x) * 19 + parseInt(y);
	return (ret);
}


$(function() {


if (location.pathname == "/game")
{
	mode = ""
	id_player = 0;
	locked = 0;

	$.getJSON("arbitre/-1/-1", function(data)
	{
		refreshMap(data['map']);
		if ($(".circle").length == 0)
		{
		    $( "#dialog-confirm" ).dialog({
		    	closeOnEscape: false,
		    	title: "Vous jouez ? ",
		      	resizable: false,
		      	modal: true,
		      	buttons:
		      	{
		        	"1 vs 1": function() {
		          	$( this ).dialog( "close" );
		          	mode = "PVP";
		          	update_players_data();
		        },
		        	"Joueur contre IA": function()
		        {
		          	$( this ).dialog( "close" );
		  			mode = "PVI";
		  			update_players_data(0, 0);
		        },
		        	"Demo": function()
		        {
		          	$( this ).dialog( "close" );
		  			mode = "IVI";
		  			update_players_data(0, 0);
		        }

		      }
		    });
		    $(".ui-icon-closethick").hide();

		}
		else
		{
			// already a party in progress
			if(data['id_prev_player'] == -1)
				data['id_prev_player'] = 2
			id_player = data['id_prev_player'] - 1;
			update_players_data(data["score_p1"], data["score_p2"]);
		}
	});



	$(".line li").click(function()
	{
		if (locked == 1)
			return;
		locked = 1;
		$("#error").html("");
		id = this.id.split("-")[1];
		if ($("#circle-tmp").html() != undefined)
			$("#circle-tmp").remove();
		if ($("#id-" + id).html().search("circle-tmp") != -1)
		{
			$("#circle-tmp").remove();
		}
		$.getJSON("arbitre/" + (parseInt(id_player) + 1)  + "/" + id, function(data)
		{
			winner(data);
			check_move(data);
			if (mode != "PVP")
				iaPlay()
			else
				locked = 0;
		});
	})


	function check_move(data)
	{		
		if (data['move_ok'])
		{
			id_player = (id_player + 1) %2
			refreshMap(data['map']);
			update_players_data(data["score_p1"], data["score_p2"]);
		}
		else
		{
			$("#error").html(data['error_msg']);
		}
	}

	function winner(data)
	{
		if (data['win'])
		{
			$.get("/rmsession")
			$( "#dialog-confirm" ).html("Le joueur " + data['win'] + " a gagné !")
			$( "#dialog-confirm" ).dialog({
				title: "Jeu terminé !  ",
		      modal: true,
		      buttons: {
		        Ok: function() {
		        	window.location.href = window.location.href
		        }
		      }
		    });
		}
	}

	function iaPlay()
	{
		locked = 1;
		console.log("c'est à l'ia ! ");
		$.ajax({
		  url: "/ia.php",
		  type: "POST",
		  data: "query=Wahou",
		  statusCode: 
		  {
			    404: function() {alert( "L'IA n'est pas installée au bon endroit" );},
		  }
		}).done(function(ia_data)
		{

			console.log(ia_data)
			tabl = ia_data.split(";");
			console.log(get_id(tabl[0], tabl[1]));
			$.getJSON("arbitre/" + (parseInt(id_player) + 1)  + "/" + get_id(tabl[0], tabl[1]), function(data)
			{
				winner(data);
				check_move(data);
				if (mode == "IVI")
					iaPlay()
				else
					locked = 0;
			});
		});


	}

	$(".line li").mousemove(function()
	{
		if (locked == 1)
			return;
		id = this.id.split("-")[1];
		if ($("#circle-tmp").html() != undefined)
			$("#circle-tmp").remove();
		if ($("#circle-" + id).html() === undefined)
		{
			$("#id-" + id).append("<div id='circle-tmp' class='circle'></div>");
			id_player++;
			if (id_player == 1)
				$("#circle-tmp").css("background", "forestgreen");
			else if (id_player == 2)
				$("#circle-tmp").css("background", "maroon");
			else if (id_player == 3)
				$("#circle-tmp").css("background", "red");
			id_player--;
		}
	})

	$(".tabl").mouseout(function()
	{
		$("#circle-tmp").hide();
	})


	$("#restart").click(function()
	{
		document.cookie = "connect.sid=-1";
		$.cookie('connect.sid', -1);
		$.get("/rmsession", function ()
		{
			window.location.href = window.location.href
		});
		return (false)
	})


	function update_players_data(a, b)
	{
		if (a === undefined || b === undefined)
			a = b = 0;
		$("#current_player").html("Joueur " + (parseInt(id_player) + 1))
		$("#score1").html("Joueur 1 : " + a)
		$("#score2").html("Joueur 2 : " + b)
	}

	function refreshMap(map)
	{
		for (var i = map.length - 1; i >= 0; i--) {
			if (map[i] == 0)
			{
				if ($("#circle-" + i).html() !== undefined)
				{
					$("#circle-" + i).remove();
				}
			}
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