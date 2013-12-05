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
	const  ERROR = 1;


	function __construct()
	{
	}

	public function setMap($map) { $this->map = $map; }

	public function getresult()
	{
		return (rand (0, 18) . ';' . rand (0, 18));
	}
}



$ia = new IA;

/* Variables de définition pour savoir qui joue */
$ia->colorIA = 2;
$ia->colorPLAY2 = 2;
$ia->empty = 0;
$ia->setMap($_POST['map']);


// echo $_POST['query'];


/* Réponse */
echo $ia->getresult();

?>