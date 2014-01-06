<?php


/* Instalation 
** Placer un lien (non symbolique) dans un répertoire Apache
** chez moi : 

cd www OU cd /var/www (linux)
ln /Users/romuald/ ... /gomoku/nodejs/projet/ia/ia.php .
**
*/ 

$timestart = microtime(true);
error_reporting(E_ALL); // remplacer E_ALL par 0 pour le rendu
ini_set('error_reporting', E_ALL); // pour windows au cas où 
ini_set('max_execution_time', 360);
/*
** IA for Gomuku 2013
*/

ob_start();


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
			$x = floor($i / 19);
		}
		$tab = Array();
		$tab['x'] = $x;
		$tab['y'] = $y;
		return ($tab);
	}

	public function getresult()
	{
		$iamachine = new IaMachine($this->map, $_POST);
		$val = $iamachine->run_machine();
		
		$this->log[] = $val;
		$this->log[] = print_r($iamachine->get_log(), true);
		return ($val);
	}

	public function getLog()
	{
		print_r($this->log);
	}
}


class IaValueLine
{
	public $tab;
	public $map;
	
	function __construct($map)
	{
		$this->map = $map;
	}
	
	private function get_id ($x, $y)
	{
		return (($x * 19 + $y < 19 * 19 ? $x * 19 + $y : 19 * 19 ));
	}

	private function get_pos($map, $i)
	{
		if ($i <= 0) 
		{
			$x = 0;
			$y = 0;
		}
		else
		{
			$y = $i % 19;
			$x = floor($i / 19);
		}
		$tab = Array();
		$tab['x'] = $x;
		$tab['y'] = $y;
		return ($tab);
	}
	
	public function concat_raw($i)
	{
		$x = 0;
		$y = $i;
		$res = "";
		while ($x < 19)
		{
			$id = $this->get_id($x, $y);
			$res .= $this->map[$id];
			$x++;
		}
		return ($res);
	}
	
	public function concat_line($i)
	{
		$x = $i;
		$y = 0;
		$res = "";
		while ($y < 19)
		{
			$id = $this->get_id($x, $y);
			$res .= $this->map[$id];
			$y++;
		}
		return ($res);
	}

	public function concat_diagonal_down_up()
	{
		$init_x = 0;
		$init_y = 15;
		$i = 0;
		$tab = Array();
		while ($init_x < (15))
		{
			while ($init_y > -1)
			{
				$x = $init_x;
				$y = $init_y;
				$tab[$i] = "";
				while ($x < 19 && $y < 19)
				{
					$id = $this->get_id($x, $y);
					$tab[$i] .= $this->map[$id];
					$x++;
					$y++;
				}
				$init_y--;
				$i++;
			}
			$init_y = 0;
			$init_x++;
		}
		return ($tab);
	}

	/*
	bas gauche -> haut droit
	*/
	public function concat_diagonal_up_down()
	{
		$init_x = 0;
		$init_y = 2;
		$i = 0;
		$tab = Array();
		while ($init_x < 5)
		{
			while ($init_y < 19)
			{
				$x = $init_x;
				$y = $init_y;
				$tab[$i] = "";
				while (($y > -1 && $y < 19) && ($x > -1 && $x < 19))
				{
					$id = $this->get_id($x, $y);
					$tab[$i] .= $this->map[$id];
					$x++;
					$y--;
				}
				$init_y++;
				$i++;
			}
			$init_y = 18;
			$init_x++;
		}
		return ($tab);
	}
}

class IaPatern
{
	public $tab;
	public $value_tab;
	public $turn;
	public $double_trois;
	public $five_breakable;
	private $score_ia_init;
	private $score_j_init;
	public $score_ia;
	public $score_j;
	public $last_id; // dernier coup jouer
	public $user; // 0 -> ia, 1 -> joueur
	private $log;
	private $arbitre;
	private $absolute_val;
	
	function __construct($tab, $post, $last_id, $user)
	{
		$this->arbitre = new Arbitre;
		$this->absolute_val = 10000;
		$this->last_id = $last_id;
		$this->tab = $tab;
		$this->value_tab = Array();
		$this->value_tab[1][1]['lock'] = 0; // 1 -> case j1
		$this->value_tab[1][2]['lock'] = 0; // 2 -> case j2
		$this->value_tab[2][1]['lock'] = 0; // 1 -> case j1
		$this->value_tab[2][2]['lock'] = 0; // 2 -> case j2
		$this->value_tab[3][1]['lock'] = 0; // 1 -> case j1
		$this->value_tab[3][2]['lock'] = 0; // 2 -> case j2
		$this->value_tab[4][1]['lock'] = 0; // 1 -> case j1
		$this->value_tab[4][2]['lock'] = 0; // 2 -> case j2
		$this->value_tab[5][1]['lock'] = 0; // 1 -> case j1
		$this->value_tab[5][2]['lock'] = 0; // 2 -> case j2
		
		$this->value_tab[1][0]['free'] = 0; // 0 -> case vide
		$this->value_tab[1][1]['free'] = 0; // 1 -> case j1
		$this->value_tab[1][2]['free'] = 0; // 2 -> case j2
		$this->value_tab[2][0]['free'] = 0; // 0 -> case vide
		$this->value_tab[2][1]['free'] = 0; // 1 -> case j1
		$this->value_tab[2][2]['free'] = 0; // 2 -> case j2
		$this->value_tab[3][0]['free'] = 0; // 0 -> case vide
		$this->value_tab[3][1]['free'] = 0; // 1 -> case j1
		$this->value_tab[3][2]['free'] = 0; // 2 -> case j2
		$this->value_tab[4][0]['free'] = 0; // 0 -> case vide
		$this->value_tab[4][1]['free'] = 0; // 1 -> case j1
		$this->value_tab[4][2]['free'] = 0; // 2 -> case j2
		$this->value_tab[5][0]['free'] = 0; // 0 -> case vide
		$this->value_tab[5][1]['free'] = 0; // 1 -> case j1
		$this->value_tab[5][2]['free'] = 0; // 2 -> case j2
		

		$this->value_tab[1][1]['condition'] = 0; // 1 -> case j1
		$this->value_tab[1][2]['condition'] = 0; // 2 -> case j2
		$this->value_tab[2][1]['condition'] = 0; // 1 -> case j1
		$this->value_tab[2][2]['condition'] = 0; // 2 -> case j2
		$this->value_tab[3][1]['condition'] = 0; // 1 -> case j1
		$this->value_tab[3][2]['condition'] = 0; // 2 -> case j2
		$this->value_tab[4][1]['condition'] = 0; // 1 -> case j1
		$this->value_tab[4][2]['condition'] = 0; // 2 -> case j2
		$this->value_tab[5][1]['condition'] = 0; // 1 -> case j1
		$this->value_tab[5][2]['condition'] = 0; // 2 -> case j2
		
		$this->turn = 0;
		$this->double_trois = $post['endbl3'];
		$this->five_breakable = $post['endbl5'];
		$this->score_j = $post['sca'];
		$this->score_ia = $post['scb'];
		$this->score_j_init = $post['sca'];
		$this->score_ia_init = $post['scb'];
		$this->user = $user;
	}
	
	
	public function parse_line($token)
	{
		$tab = Array();
		$i = 0;
		$count = 0;
		while (isset($token[$i]))
			$i++;
		$max = $i;
		$i = 0;
		$j = 0;
		$player = ($token[$i] == 9 ? ($this->user == 0 ? 2 : 1) : $token[$i]);
		$is = 0;
		while ($i < $max)
		{
			$tmp = ($token[$i] == 9 ? ($this->user == 0 ? 2 : 1) : $token[$i]);
			if ($player == $tmp)
			{
				$is = ($token[$i] == 9 ? 1 : $is);
				$count++;
			}
			else
			{
				$tab[$j] = Array();
				$tab[$j]['count'] = $count;
				$tab[$j]['played'] = ($is);
				$tab[$j]['player'] = $player;
				$j++;
				$player = $tmp;
				$count = 1;
				$is = ($token[$i] == 9 ? 1 : 0);
			}
			$i++;
		}
		$tab[$j]['count'] = $count;
		$tab[$j]['played'] = $is;
		$tab[$j]['player'] = $player;
		return ($tab);
	}
	
	public function value_parse_line($tab)
	{
		$i = 0;
		$max = count($tab);
		$score = 0;
		while ($i < $max)
		{
			$lens = ($tab[($i)]['count'] > 5 ? 5 : $tab[($i)]['count']);
			if ($tab[($i)]['player'] != 0)
			{
				$player = $tab[($i)]['player'];
				if (($i + 2) < $max && $tab[($i)]['player'] == $tab[($i + 2)]['player'] && $tab[($i + 1)]['player'] == 0 && $tab[($i + 1)]['count'] == 1)
				{
					$lens += $tab[($i + 2)]['count'];
					$lens = ($lens > 5 ? 5 : $lens);
					$this->value_tab[($lens)][($player)]['lock'] += 1;
				}
				else if ($i > 0 && ($i + 1) < $max)
				{
					if ($tab[($i - 1)]['played'] == 1 && $tab[($i + 1)]['player'] == $tab[($i - 1)]['player'] && $tab[($i)]['count'] == 2)
						$score += 2;
					else if ($tab[($i + 1)]['played'] == 1 && $tab[($i - 1)]['player'] == $tab[($i + 1)]['player'] && $tab[($i)]['count'] == 2)
						$score += 2;
					else if ($tab[($i - 1)]['player'] == $tab[($i + 1)]['player'] && $tab[($i - 1)]['player'] != 0)
						$this->value_tab[($lens)][($player)]['lock'] += 1;
					else if ($tab[($i - 1)]['player'] == 0 && $tab[($i + 1)]['player'] == 0)
						$this->value_tab[($lens)][($player)]['free'] += 1;
					else if ($tab[($i - 1)]['player'] == 0 XOR $tab[($i + 1)]['player'] == 0)
						$this->value_tab[($lens)][($player)]['condition'] += 1;
				
				}
				else if ($lens > 0)
				{
					$this->value_tab[($lens)][0]['free'] += 1;
				}
			}
			$i++;
		}
		if ($this->user)
			$this->score_j += $score;
		else
			$this->score_ia += $score;
	}


	public function run_token($token)
	{
		$this->value_parse_line($this->parse_line($token));
	}

	public function value_patterns($i)
	{
		$value = 0;
		if ($this->score_j >= 10)
			$value -= $absolute_val;
		if ($this->score_ia >= 10)
			$value += $absolute_val;
		$value += ($this->score_ia > $this->score_ia_init ? ((($this->score_ia * 0.1) + 1)  * $this->absolute_val) : 0);
		$value -= ($this->score_j > $this->score_j_init ? ((($this->score_j * 0.1) + 1) * $this->absolute_val) : 0);
		
		$value -= $this->value_tab[1][1]['lock'] * 5 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[1][2]['lock'] * 3 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value += $this->value_tab[2][1]['lock'] * 10 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value -= $this->value_tab[2][2]['lock'] * 8 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value += $this->value_tab[3][1]['lock'] * 20 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value -= $this->value_tab[3][2]['lock'] * 18 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value += $this->value_tab[4][1]['lock'] * 40 * (($this->score_ia * 0.1) + 1); // 2 -> case j2
		$value -= $this->value_tab[4][2]['lock'] * 50 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value += $this->value_tab[5][1]['lock'] * ($this->five_breakable == 1 ? 1000 : $this->absolute_val) * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value -= $this->value_tab[5][2]['lock'] * ($this->five_breakable == 1 ? 1000 : $this->absolute_val) * (($this->score_j * 0.1) + 1); // 2 -> case j2*/
		
		//$this->value_tab[1][0]['free'] * 0 * ($this->score_ia / 10); // 0 -> case vide
		$value -= $this->value_tab[1][1]['free'] * 1 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[1][2]['free'] * 2 * (($this->score_j * 0.1) + 1); // 2 -> case j2
				
		//$this->value_tab[2][0]['free'] * 10 * ($this->score_ia / 10); // 0 -> case vide
		$value += $this->value_tab[2][1]['free'] * 11 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value -= $this->value_tab[2][2]['free'] * 10 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		//$this->value_tab[3][0]['free'] = 0; // 0 -> case vide
		$value -= $this->value_tab[3][1]['free'] * 25 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[3][2]['free'] * 10 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		//$this->value_tab[4][0]['free'] = 0; // 0 -> case vide
		$value -= $this->value_tab[4][1]['free'] * 40 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[4][2]['free'] * 100 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		//$this->value_tab[5][0]['free'] = 0; // 0 -> case vide
		$value -= $this->value_tab[5][1]['free'] * ($this->five_breakable == 1 ? 3000 : $this->absolute_val) * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[5][2]['free'] * ($this->five_breakable == 1 ? 3000 : $this->absolute_val) * (($this->score_j * 0.1) + 1); // 2 -> case j2
		

		$value -= $this->value_tab[1][1]['condition'] * 4 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[1][2]['condition'] * 8 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value += $this->value_tab[2][1]['condition'] * 28 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value -= $this->value_tab[2][2]['condition'] * 30 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value -= $this->value_tab[3][1]['condition'] * 1 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[3][2]['condition'] * 20 * (($this->score_j * 0.1) + 1); // 2 -> case j2
		$value -= $this->value_tab[4][1]['condition'] * 5 * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[4][2]['condition'] * 40 * (($this->score_j * 0.1) + 1); // 2 -> case j2

		$value += $this->value_tab[5][1]['condition'] * ($this->five_breakable == 1 ? 2000 : $this->absolute_val) * (($this->score_ia * 0.1) + 1); // 1 -> case j1
		$value += $this->value_tab[5][2]['condition'] * ($this->five_breakable == 1 ? 4000 : $this->absolute_val + 5000) * (($this->score_j * 0.1) + 1); // 2 -> case j2
		return ($value);
	}
	
	public function get_log()
	{
		print_r($this->log, true);
	}
}

class IaMachine
{
	public $map;
	public $map_val;
	public $tab_best_val;
	public $deep_lvl;
	public $turn;
	public $double_trois;
	public $five_breakable;
	public $score_ia;
	public $score_j;
	public $last_id; // dernier coup jouer
	public $user; // 0 -> ia, 1 -> joueur
	public $post;
	private $log;
	
	function __construct($map, $post)
	{
		$this->post = $post;
		$this->map = $map;
		$this->turn = 0;
		$this->double_trois = $post['endbl3'];
		$this->five_breakable = $post['endbl5'];
		$this->score_j = $post['sca'];
		$this->score_ia = $post['scb'];
		$this->user = 0;
		$this->deep_lvl = 1;
		
	}
	
	private function make_rdm()
	{
		$x = rand (0, 18);
		$y = rand (0, 18);
		if ($this->map[$this->get_id($x, $y)] == 0)
		{
			return ($x. ';' . $y);
		}
		else
			return ($this->make_rdm());
	}
	
		
	private function get_pos($i) {
		if ($i <= 0) {
			$x = 0;
			$y = 0;
		}
		else {
			$y = $i % 19;
			$x = floor($i / 19);
		}
		$tab = Array();
		$tab['x'] = $x;
		$tab['y'] = $y;
		return ($tab);
	}
	
	public function run_machine()
	{

		$i = 0;
		$tab = Array();
		$res = Array();
		$maxs = 0;

		while ($i < (19*19))
		{
			$tmp = $this->map;
			if ($tmp[$i] == 0)
			{
				$tmp = $this->map;
				$tmp[$i] = 9;
				
				$ia_pt = new IaPatern($tmp, $this->post, $i, $this->user);
				$lines = new IaValueLine($tmp);
				$j = 0;
				while ($j < 19)
				{
					$ia_pt->run_token($lines->concat_line($j));
					$j++;
				}
				$j = 0;
				while ($j < 19)
				{
					$ia_pt->run_token($lines->concat_raw($j));
					$j++;
				}
				$tmp_tab = $lines->concat_diagonal_down_up();
				foreach ($tmp_tab as $tabs)
				{
					$ia_pt->run_token($tabs);
				}
				$tmp_tab = $lines->concat_diagonal_up_down();
				foreach ($tmp_tab as $tabs)
				{
					$ia_pt->run_token($tabs);
				}
				$tmps = intval($ia_pt->value_patterns($i));
				if ($maxs < $tmps)
					{
						$maxs = $tmps;
						unset($res);
						$res = array();
					}
				if ($maxs == $tmps)
					$res[] = $i;
				if ($tmps != 0)
					$tab[$i] = $tmps;
			}
			$i++;
		}

		$final = $res;
		$ends = count($final);
		$j = 0;
		$this->user = 1;
		$res = array();
		$minu = 99999;
		while ($j < $ends)
		{
			$tmp = $this->map;
			$tmp[($final[$j])] = !$this->user;
			$i = 0;
			$maxu = 8888;
			while ($i < (19*19))
			{
				if ($tmp[$i] != 0)
					$tmp = $this->map;
				$tmp[$i] = 9; // 9 -> just pose
				$ia_pt = new IaPatern($tmp, $this->post, $i, $this->user);
				$lines = new IaValueLine($tmp);
				$u = 0;
				while ($u < 19)
				{
					$ia_pt->run_token($lines->concat_line($u));
					$u++;
				}
				$u = 0;
				while ($u < 19)
				{
					$ia_pt->run_token($lines->concat_raw($u));
					$u++;
				}
				
				$tmp_tab = $lines->concat_diagonal_down_up();
				foreach ($tmp_tab as $tabs)
				{
					$ia_pt->run_token($tabs);
				}
				$tmp_tab = $lines->concat_diagonal_up_down();
				foreach ($tmp_tab as $tabs)
				{
					$ia_pt->run_token($tabs);
				}
				$tmps = intval($ia_pt->value_patterns($i));
				if ($maxu > $tmps)
					{
						$maxu = $tmps;
					}
				if ($tmps != 0)
					$tab[$i] = $tmps;
				$i++;
			}
			$res[] = $maxu;
			if ($minu > $maxu)
				$minu = $maxu;
			$j++;
		}
		$i = 0;
		while ($i < $ends)
		{
			if ($minu != $res[$i]) 
				unset($final[$i]);
			$i++;
		}
	
		if (count($final) >= 1)
			$id = $final[rand(0, count($final) - 1)];
		else
			return ($this->make_rdm());
		$tabs = $this->get_pos($id);
		$x = $tabs['x'];
		$y = $tabs['y'];
		return ($x. ';' . $y);
	}

	private function get_id ($x, $y)
	{
		return (($x * 19 + $y < 19 * 19 ? $x * 19 + $y : 19 * 19 ));
	}
	
	public function get_log()
	{
		print_r($this->log, true);
	}
	
}

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
			$x = floor($i / 19);
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
		print_r($this->log, true);
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


/* MAIN */ 

$ia = new IA;
$ia->colorIA = 2;
$ia->colorPLAY2 = 2;
$ia->empty = 0;
$ia->setMap($_POST['query']);
$result =  $ia->getresult();

$tmp  = ob_get_clean();
echo $result . "debug : " .  $tmp;
$timeend=microtime(true);
$time=$timeend-$timestart;
 
$page_load_time = number_format($time, 3);
echo "Script execute en " . $page_load_time . " sec";



?>