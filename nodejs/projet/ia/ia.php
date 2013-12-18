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

	private function check_pattern($tab, $pattern, $id_player) {
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

?>