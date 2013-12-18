<?php


/* Instalation 
** Placer un lien (non symbolique) dans un répertoire Apache
** chez moi : 

cd www OU cd /var/www (linux)
ln /Users/romuald/ ... /gomoku/nodejs/projet/ia/ia.php .
**
*/ 

error_reporting(E_ALL); // remplacer E_ALL par 0 pour le rendu
ini_set('error_reporting', E_ALL); // pour windows au cas où 

/*
** IA for Gomuku 2013
*/



class mmatch 
{

	public 	$pattern;
	public $tab;

	function __construct($pattern, $tab)
	{
		$this->pattern = $pattern;
		$this->tab = $tab;
	}

}

class IA
{

	private $map;
	public $colorIA;
	public $colorPLAY2;
	public $empty;
	private $log;
	private $arbitre;
	const  ERROR = 1;


	function __construct()
	{
		$this->arbitre = new Arbitre;
	}

	public function setMap($map)
	{
		if (!$map || $map == "")
			$this->log[] = "No data";
		$this->map = json_decode(stripslashes($map));
		if ($this->map === NULL)
			$this->log[] = "Can't decrypt map";
		//$this->log[] = $map;
		//$this->log[] = $this->map;
	}

	private function get_id ($x, $y)
	{
		return ($x * 19 + $y);
	}

	private function get_pos($map, $i) {
		if ($i == 0) {
			$x = 0;
			$y = 0;
		}
		else {
			$y = $i % 19;
			$x = round($i / 19);
		}
		$tab = Array();
		$tab['x'] = $x;
		$tab['y'] = $y;
		return ($tab);
	}

	public function getresult()
	{
		$i = 0;
		while ($i < 18 * 19) {
				//$this->log[] = $this->colorIA;

			//$this->log[] = $this->get_pos($this->map, $i)['x'] . ';' . $this->get_pos($this->map, $i)['y'];
			if ($this->arbitre->check_5_h($this->map, $i, $this->colorIA) != 0) {
				$this->log[] = "prout";
				if ($this->map[$i] == 0) {
					//$this->log[] = "Pose en  $x;$y " . $this->map[$i];
					$this->log[] = "DOUBLE prout";
					$this->log[] = $his->get_pos($this->map, $i)['x'] . ';' . $his->get_pos($this->map, $i)['y'];
					return ($his->get_pos($this->map, $i)['x'] . ';' . $his->get_pos($this->map, $i)['y']);
				}
			}
			$i++;
		}


		$x = rand (0, 18);
		$y = rand (0, 18);
		if ($this->map[$this->get_id($x, $y)] == 0)
		{
			$this->log[] = "Pose en  $x;$y " . $this->map[$this->get_id($x, $y)];
			return ($x. ';' . $y);
		}
		else
			return ($this->getresult());
	}

	public function getLog()
	{
		$this->log[] = "Je suis un champignon grillé";
		print_r($this->log);
		print_r($this->arbitre->getLog());
	}

}

$ia = new IA;

/* Variables de définition pour savoir qui joue */
$ia->colorIA = 2;
$ia->colorPLAY2 = 2;
$ia->empty = 0;
$ia->setMap($_POST['query']);


// echo $_POST['query'];


/* Réponse */
echo $ia->getresult();


$ia->getLog();

/**
* Retranscription du JS en PHP de l'arbitre
*/

class Point
{
	public $x;
	public $y;
	public $id;

	function __construct($px, $py, $pid, $psymbole = null) {
		$this->x = $px;
		$this->y = $py;
		$this->id = $pid;
	}
}

class Arbitre
{
	private $log;

	function __construct()
	{
	}

	/* retourne la position en X-Y d'un id de case de la map */
	private function get_pos($map, $i) {
		if ($i == 0) {
			$x = 0;
			$y = 0;
		}
		else {
			$y = $i % 19;
			$x = round($i / 19);
		}
		$tab = Array();
		$tab['x'] = $x;
		$tab['y'] = $y;
		return ($tab);
	}

	/* retourne l'id de la case en fonction de sa position en X-Y */
	private function get_id($x, $y) {
		return ($x * 19 + $y);
	}

	/* retourne l'id du joueur de la case demandée */
	private function get_player($map, $x, $y) {
	if ($x < 0 || $x > 18)
		return (-1);
	if ($y < 0 || $y > 18)
		return (-1);
	$ret = $x * 19 + $y;
	return ($map[$ret]);
	}

	public function check_pattern($tab, $pattern, $id_player) {
	for($i = 0; $i < 9; $i++) {
		if ($pattern[$i] == 'O') {
			if ($tab[$i]->id != $id_player) {
				return (false);
			}
		}
		if ($pattern[$i] == '_' || $pattern[$i] == '-' ) {
			if ($tab[$i]->id != 0 && $tab[$i]->id != $id_player) {
				return (false);
			}
		}
		if ($pattern[$i] == 'E') {
			if ($tab[$i]->id == $id_player || $tab[$i]->id == 0) {
				return (false);
			}
		}
		if ($pattern[$i] == 'V') {
			if ($tab[$i]->id != 0) {
				return (false);
			}
		}
	}
	return (true);
}


	public function can_be_take($map, $i, $id_player) {
		$pos = $this->get_pos($map, $i);
		$tab = Array();

		for ($inc = $pos['y'] - 3; $inc < $pos['y'] + 4; $inc++) {
			array_push($tab, new Point($pos['x'], $inc, $this->get_player($map, $pos['x'], $inc)));
		}

		$tab[3] = new Point($pos['x'], $pos['y'], $id_player);

		if ($this->check_pattern($tab, "XXXEOOVXX", $id_player)) {
			return (true);
		}
		if ($this->check_pattern($tab, "XXVOOEXXX", $id_player)) {
			return (true);
		}
		$tab = Array();
		for ($j = -3; $j < 4; $j++) {
			array_push($tab, new Point($pos['x'] + $j, $pos['y'], $this->get_player($map, $pos['x'] + $j,  $pos['y'])));
		};
		$tab[3] = new Point($pos['x'], $pos['y'], $id_player);

		if ($this->check_pattern($tab, "XXXEOOVXX", $id_player)) {
			return (true);
		}
		if ($this->check_pattern($tab, "XXVOOEXXX", $id_player)) {
			return (true);
		}
		return (false);
	}


	/* Check win horizontal || i = id de la case où le pion est joué */
	public function check_5_h($map, $i, $id_player) {
		$qte = 5;
		$cpt = 0;
		$pos = $this->get_pos($map, $i);
		$this->log[] = '[' . $pos['x'] . ';' . $pos['y'] . ']';
		// incr cpt on left
		$inc = $pos['y'];
		$map[$i] = $id_player; // test
		while ($inc >= 0 && $map[$this->get_id($pos['x'], $inc)] == $id_player) {
			if (!$this->can_be_take($map, $this->get_id($pos['x'], $inc), $id_player))
				$cpt++;
			else
			{
				break;
			}
			$inc--;

		}
		// incr cpt on right
		$inc = $pos['y'];
		while ($inc <= 18 && $map[$this->get_id($pos['x'], $inc)] == $id_player) {
			if (!$this->can_be_take($map, $this->get_id($pos['x'], $inc), $id_player))
				$cpt++;
			else
			{
				break;
			}
			$inc++;
		}
		if ($cpt >= 4)
			$this->log[] = 'cpt: '. $pos['x'] . ';' . $pos['y'] . '  ' . $cpt;
		if ($cpt >= $qte)
			return ($id_player);
		return (0);
	}







	public function getLog()
	{
		print_r($this->log);
	}
}


function check_pattern($tab, $pattern, $id_player) {
	for($i = 0; $i < 9; $i++) {
		if ($pattern[$i] == 'O') {
			if ($tab[$i]->id != $id_player) {
				return (false);
			}
		}
		if ($pattern[$i] == '_' || $pattern[$i] == '-' ) {
			if ($tab[$i]->id != 0 && $tab[$i]->id != $id_player) {
				return (false);
			}
		}
		if ($pattern[$i] == 'E') {
			if ($tab[$i]->id == $id_player || $tab[$i]->id == 0) {
				return (false);
			}
		}
		if ($pattern[$i] == 'V') {
			if ($tab[$i]->id != 0) {
				return (false);
			}
		}
	}
	return (true);
}
  function check_patterns ($tab, $id_player)
{

	if (check_pattern($tab, "XX_OOO_XX", $id_player))
		return (new mmatch("XX_OOO_XX", $tab));
	if (check_pattern($tab, "_O-OO_XXX", $id_player))
		return (new mmatch("_O-OO_XXX", $tab));
	if (check_pattern($tab, "X_OOO_XXX", $id_player))
		return (new mmatch("X_OOO_XXX", $tab));
	if (check_pattern($tab, "XXX_OOO_X", $id_player))
		return (new mmatch("XXX_OOO_X", $tab));

	if (check_pattern($tab, "XXX_OO-O_", $id_player))
		return (new mmatch("XXX_OO-O_", $tab));
	if (check_pattern($tab, "_OO-O_XXX", $id_player))
		return (new mmatch("_OO-O_XXX", $tab));

	if (check_pattern($tab, "XX_OO-O_X", $id_player))
		return (new mmatch("XX_OO-O_X", $tab));
	if (check_pattern($tab, "X_O-OO_XX", $id_player))
		return (new mmatch("X_O-OO_XX", $tab));

	if (check_pattern($tab, "XXX_O-OO_", $id_player))
		return (new mmatch("XXX_O-OO", $tab));
	if (check_pattern($tab, "_OO-O_XXX", $id_player))
		return (new mmatch("_OO-O_XXX", $tab));

	return (new mmatch("", array()));

}

  function check_3_h($map, $i, $id_player, $second) {
	$cpt = 1;
	$pos = get_pos($map, $i);
	$tab = Array();
	if (!$second )
		$second = $id_player;

	for ($inc = $pos['y'] - 4; $inc < $pos['y'] + 5; $inc++) {
		array_push($tab, new point($pos['x'], $inc, get_player($map, $pos['x'], $inc)));
	}
	$tab[4] = new point($pos['x'], $pos['y'], $second);
	return (check_patterns($tab, $id_player));
}

 function check_3_v($map, $i,$id_player, $second ) {
	$tab = Array();
	$pos = get_pos($map,$i);
	if (!$second )
		$second =$id_player;
	for ($i = -4; $i < 5; $i++) {
		array_push($tab,new point($pos['x'] + $i, $pos['y'], get_player($map, $pos['x'] + $i,  $pos['y'])));
	};
	$tab[4] = new point($pos['x'], $pos['y'], $second);
	return (check_patterns($tab, $id_player));
}

  function check_3_d ($map, $i, $id_player, $second ) {
	$tab = Array();
	$pos = get_pos($map, $i);
	if (!$second )
		$second = $id_player;
	for ($i = -4; $i < 5; $i++) {
		array_push($tab, new point($pos['x'] + $i, $pos['y'] + $i, get_player($map, $pos['x'] + $i, $pos['y'] + $i)));
	};
	$tab[4] = new point($pos['x'], $pos['y'], $second);
	return (check_patterns($tab, $id_player));
}

  function check_3_dr ($map, $i, $id_player, $second ) {
	$tab = Array();
	$pos = get_pos($map, $i);
	if (!$second )
		$second = $id_player;
	$j = 4;
	for ($i = -4; $i < 5; $i++) {
		array_push($tab, new point($pos['x'] + $i, $pos['y'] + $j, get_player($map, $pos['x'] + $i, $pos['y'] + $j)));
		$j--;
	};
	$tab[4] = new point($pos['x'], $pos['y'], $second);
	return (check_patterns($tab, $id_player));
}

  function checkcan ($map, $match, $id_player, $h, $v, $d, $dr) {
	$pos = 0;
	$player;
	foreach ($match->tab as $i => $value)
	{
		if ($match->pattern[$pos] == '-' || $match->pattern[$pos] == 'O')
		{
			if ($match->pattern[$pos] == '-')
				$player = 0;
			else
				$player = $id_player;

			$mmatchv = check_3_v($map, get_id($match->tab[$i]->x, $match->tab[$i]->y), $id_player, $player);
			$mmatchh = check_3_h($map, get_id($match->tab[$i]->x, $match->tab[$i]->y), $id_player, $player);
			$mmatchd = check_3_d($map, get_id($match->tab[$i]->x, $match->tab[$i]->y), $id_player, $player);
			$mmatchdr = check_3_dr($map, get_id($match->tab[$i]->x, $match->tab[$i]->y), $id_player, $player);

			if ((count($mmatchv->tab) && !$v)  || (count($mmatchh->tab) && !$h) || (count($mmatchd->tab) && !$d) || (count($mmatchdr->tab) && !$dr))
			{
				return (false);
			}
		}
		$pos++;
	}
	return (true);
}


	 function double_trois($map, $case_id, $id_player) {
	$tab;
	$other_tab;
	$i;

	$mmatchv = check_3_v($map, $case_id, $id_player);
	$mmatchh = check_3_h($map, $case_id, $id_player);
	$mmatchd = check_3_d($map, $case_id, $id_player);
	$mmatchdr = check_3_dr($map, $case_id, $id_player);


	if (count($mmatchv))
	{
		if (!checkcan($map, $mmatchv, $id_player, 0, 1, 0, 0))
			return (false);
	}


	if (count($mmatchh))
	{
		if (!checkcan($map, $mmatchh, $id_player, 1, 0, 0, 0))
			return (false);
	}

	if (count($mmatchd))
	{
		if (!checkcan($map, $mmatchd, $id_player, 0, 0, 1, 0))
			return (false);
	}

	if (count($mmatchdr))
	{
		if (!checkcan($map, $mmatchdr, $id_player, 0, 0, 0, 1))
			return (false);
	}
	return (true);
}

?>