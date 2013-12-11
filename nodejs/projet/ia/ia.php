<?php


/* Instalation 
** Placer un lien (non symbolique) dans un répertoire Apache
** chez moi : 

cd www
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
	const  ERROR = 1;


	function __construct()
	{
	}

	public function setMap($map)
	{
		if (!$map || $map == "")
			$this->log[] = "No data";
		$this->map = json_decode(stripslashes($map));
		if ($this->map === NULL)
			$this->log[] = "Can't decrypt map";
		$this->log[] = $map;
		$this->log[] = $this->map;
	}

	private function get_id ($x, $y)
	{
		return ($x * 19 + $y);
	}

	public function getresult()
	{
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
		print_r($this->log);
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


?>