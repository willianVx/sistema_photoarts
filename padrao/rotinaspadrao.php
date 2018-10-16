<?php

function SoNumeros($str) {
    return preg_replace("/[^0-9]/", "", $str);
}

function FormatData($data, $hora = true) {
    if (!isDate($data))
        return '';

    if (strlen($data) <= 10 || !$hora)
        return ltrim( substr($data, 8, 2) . "/" . substr($data, 5, 2) . "/" . substr($data, 0, 4));
    else
        return ltrim( substr($data, 8, 2) . "/" . substr($data, 5, 2) . "/" . substr($data, 0, 4) . " " . substr($data, 11, 8));
}

function TextoSSql($ArqT, $texto) {
    
    $str = mysqli_real_escape_string($ArqT, $texto);
    
    echo $str;
    
    return $str;
}

function PrimeiroNome($texto) {
    $aux = explode(' ', $texto);
    return $aux[0];
}

function NomeCurto($texto) {

    if (trim($texto) == '') {
        return '';
    } else {
        $aux = explode(' ', $texto);

        $nome = $aux[0] . ' ' . $aux[1];

        if (count_chars($aux[1]) <= 3) {
            $nome .= $aux[2];
        }

        return $nome;
    }
}

function strposa($haystack, $needles = array(), $offset = 0) {
    $chr = array();
    foreach ($needles as $needle) {
        if (strpos($haystack, $needle, $offset))
            $chr[] = strpos($haystack, $needle, $offset);
        //echo strpos($haystack,$needle,$offset);
    }
    if (empty($chr))
        return false;
    return min($chr);
}

function DataSSql($data, $hora = false) {
    $data = trim( $data );
    $temp = substr($data, 6, 4) . "-" . substr($data, 3, 2) . "-" . substr($data, 0, 2);

    if ($hora)
        $temp .= ' ' . substr($data, 11, 2) . ':' . substr($data, 14, 2) . ':' . substr($data, 17, 2);

    return trim( $temp );
}

function DateAdd($givendate, $day = 0, $mth = 0, $yr = 0) {
    $cd = strtotime($givendate);

    $dia = number_format_complete(date('d', $cd) + $day, '0', 2);
    $mes = date('m', $cd);
    $ano = date('Y', $cd) + $yr;

    if ($mth > 0) {
        for ($i = 0; $i < $mth; $i++) {
            $mes++;

            if ($mes > 12) {
                $ano++;
                $mes = 1;
            }
        }
    }

    $mes = number_format_complete($mes, '0', 2);
    $ano = number_format_complete($ano, '0', 4);

    $newdate = $ano . '-' . $mes . '-' . $dia;

    while (!isDate($newdate)) {
        $dia--;
        $newdate = $ano . '-' . $mes . '-' . $dia;
    }

    $newdate = date('Y-m-d h:i:s', mktime(date('h', $cd), date('i', $cd), date('s', $cd), $mes, $dia, $ano));

    return $newdate;
}

function isDate($data) {  
    $ano = (int)substr($data, 0, 4);
    $mes = (int)substr($data, 5, 2);
    $dia = (int)substr($data, 8, 2);
    return checkdate($mes, $dia, $ano);
            
}

function dataExtended($diaSemana, $data) {
    $ano = substr($data, 0, 4);
    $mes = substr($data, 5, 2);
    $dia = substr($data, 8, 2);

    $meses = array('', 'janeiro', 'fevereiro', 'marÃ§o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro');
    $dias = array('Segunda-feira', 'TerÃ§a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'SÃ¡bado', 'Domingo');

    $temp = $dias[$diaSemana] . ', ' . $dia . ' de ' . $meses[intval($mes)] . ' de ' . $ano;

    return $temp;
}

function dataExtended2($diaSemana, $data) {
    $ano = substr($data, 0, 4);
    $mes = substr($data, 5, 2);
    $dia = substr($data, 8, 2);

    $meses = array('', 'janeiro', 'fevereiro', 'marÃ§o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro');
    $dias = array('', 'Segunda-feira', 'TerÃ§a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'SÃ¡bado', 'Domingo');

    $temp = $dias[$diaSemana] . ', ' . $dia . ' de ' . $meses[intval($mes)] . ' de ' . $ano;

    return $temp;
}

function dataExtenso($data) {
    $ano = substr($data, 0, 4);
    $mes = substr($data, 5, 2);
    $dia = substr($data, 8, 2);

    $meses = array('', 'janeiro', 'fevereiro', 'marÃ§o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro');

    $temp = $dia . ' de ' . $meses[intval($mes)] . ' de ' . $ano;

    return $temp;
}

function ValorE($valor) {

    if ($valor == '') {
        return 0;
    }
    if (trim($valor) == ',') {
        return 0;
    }

    $temp = str_replace('.', '', $valor);
    $temp = str_replace(',', '.', $temp);

    return $temp;
}

function FormatValor($valor) {

    if ($valor == '') {
        return 0;
    }
    $temp = str_replace('.', ',', $valor);

    return $temp;
}

function FormatInteiro($numero, $formato) {
    return substr(trim($formato) . trim($numero), -1 * strlen($formato));
}

function ConectaDB(){
    $Conectado = _DB::obtain(DB_SERVER, DB_USER, DB_PASS, DB_DATABASE);
    return $Conectado;
}

function AbreBanco($host, $user, $pass, $database = 'photoarts_crio', $new = false) {
       
   $link = mysqli_connect( $host, $user, $pass, $database);
 
   if (!$link) {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
   }
   mysqli_set_charset($link, 'utf8');
   return $link;

}

function mysqli_result($res,$row=0,$col=0){ 
    $numrows = mysqli_num_rows($res); 
    if ($numrows && $row <= ($numrows-1) && $row >=0){
        mysqli_data_seek($res,$row);
        $resrow = (is_numeric($col)) ? mysqli_fetch_row($res) : mysqli_fetch_assoc($res);
        if (isset($resrow[$col])){
            return $resrow[$col];
        }
    }
    return false;
} 

function ConsultaSQL($SSql, $ArqT) {
    $result = mysqli_query($ArqT, $SSql);
    return $result;
}

function getIdConsultaSQL($SSql, $ArqT) {
    /*
     * Executa a consulta e retorna o last_insert_id
     * Retorna 0 se deu erro
     */
    if (mysqli_query($ArqT, $SSql)) {
        return mysqli_insert_id($ArqT);
    } else {
        return 0;
    }
}

function setCombo($strCombo, $Valor) {
    if ($strCombo == $Valor)
        return "selected";
    else
        return "";
}

function FillComboSQL($SSql, $ArqT, $selecionado) {
       
    $ArqT->query( $SSql );
    while ($row = $ArqT->fetch()) {
        if ($selecionado == $row['codigo'])
            $sel = " selected ";
        else
            $sel = "";
        echo "\n<option value=\"" . $row['codigo'] . "\"" . $sel . ">" . htmlentities($row['nome']) . "</option>";
    }
    return true;
}

function PreencherSelectJSON($id, $sql) {
    $id->query( $SSql );
    $txt = '';

    while ($row = $id->fetch()) {
        if ($txt != '')
            $txt .= ', ';

        $txt .= '{"id":"' . $row['id'] . '", "nome":"' . $row['nome'] . '"}';
    }

    $txt = '[' . $txt . ']';
    return $txt;
}

function UltimoRegistroInserido($id) {
    $sql = "SELECT LAST_INSERT_ID() AS id";
    
    $id->query( $sql );
    $result = $id->fetch();
    /*
    $rs = mysqli_query( $id, $sql);
    mysqli_result($rs, 0, 'id');
    */
    return $result['id'];
}

function RegistroAnterior($ArqT, $tabela, $atual, $campoCodigo = 'codigo', $consideraDeletados = true, $criterios = '') {
    $sql = "SELECT IFNULL(MAX(" . $campoCodigo . "), 0) AS codigo FROM " . $tabela . " WHERE " . $campoCodigo . " < '" . $atual . "' ";

    if ($consideraDeletados)
        $sql = $sql . " AND del = 0";

    if ($criterios != '')
        $sql = $sql . " AND " . $criterios;
   
    $ArqT->query( $sql );
    $result = $ArqT->fetch();
    
    /*
    $Tb = mysqli_query( $ArqT, $sql);
    return mysqli_result($Tb, 0, 'codigo');
    */
    return $result['codigo'];


}

function RegistroProximo($ArqT, $tabela, $atual, $campoCodigo = 'codigo', $consideraDeletados = true, $criterios = '') {
    $sql = "SELECT IFNULL(MIN(" . $campoCodigo . "), 0) AS codigo FROM " . $tabela . " WHERE " . $campoCodigo . " > '" . $atual . "' ";

    if ($consideraDeletados)
        $sql = $sql . " AND del = 0";

    if ($criterios != '')
        $sql = $sql . " AND " . $criterios;

    $ArqT->query( $sql );
    $result = $ArqT->fetch();
    
    /*
    $Tb = mysqli_query( $ArqT, $sql);
    return mysqli_result($Tb, 0, 'codigo');
    */
    return $result['codigo'];
}

function RegistroPrimeiro($ArqT, $tabela, $campoCodigo = 'codigo', $consideraDeletados = true, $criterios = '') {
    $sql = "SELECT IFNULL(MIN(" . $campoCodigo . "), 0) AS codigo FROM " . $tabela . " WHERE TRUE ";

    if ($consideraDeletados)
        $sql .= " AND del = 0 ";

    if ($criterios != '')
        $sql .= " AND " . $criterios;

    $ArqT->query( $sql );
    $result = $ArqT->fetch();
    
    /*
    $Tb = mysqli_query( $ArqT, $sql);
    return mysqli_result($Tb, 0, 'codigo');
    */
    return $result['codigo'];
}

function RegistroUltimo($ArqT, $tabela, $campoCodigo = 'codigo', $consideraDeletados = true, $criterios = '') {
    $sql = "SELECT IFNULL(MAX(" . $campoCodigo . "), 0) AS codigo FROM " . $tabela . " WHERE TRUE ";

    if ($consideraDeletados)
        $sql .= " AND del = 0 ";

    if ($criterios != '')
        $sql .= " AND " . $criterios;

    $ArqT->query( $sql );
    $result = $ArqT->fetch();
    
    /*
    $Tb = mysqli_query( $ArqT, $sql);
    return mysqli_result($Tb, 0, 'codigo');
    */
    return $result['codigo'];
}

function format_bytes($size) {
    $units = array(' B', ' KB', ' MB', ' GB', ' TB');
    for ($i = 0; $size >= 1024 && $i < 4; $i++)
        $size /= 1024;
    return round($size, 2) . $units[$i];
}

function getServerData($hours) {
    // RETORNA A DATA NO FORMATO SQL

    $data = getdate();

    $temp = $data['year'] . '-' . number_format_complete($data['mon'], '0', 2) . '-' . number_format_complete($data['mday'], '0', 2);

    if ($hours) {
        $temp .= ' ' . number_format_complete($data['hours'], '0', 2) . ':' . number_format_complete($data['minutes'], '0', 2) . ':' . number_format_complete($data['seconds'], '0', 2);
    }

    return $temp;
}

function add_date($givendate, $day = 0, $mth = 0, $yr = 0) {
    $cd = strtotime($givendate);

    $newdate = date('Y-m-d h:i:s', mktime(date('h', $cd), date('i', $cd), date('s', $cd), date('m', $cd) + $mth, date('d', $cd) + $day, date('Y', $cd) + $yr));

    return $newdate;
}

function is_valid_email($email) {

    $result = TRUE;

    if (!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$", $email)) {

        $result = FALSE;
    }

    return $result;
}

function FormatMoeda($valor, $casas=2) {
    $valor = round($valor,$casas);
    if ($valor == '') {
        return '0,00';
    }

    if ($valor < 0) {
        $neg = true;
        $valor = $valor * -1;
    } else {
        $neg = false;
    }


    $temp = str_replace('.', ',', $valor);

    if (substr($temp, strlen($temp) - 3, 1) == ',') {
        $temp;
    } elseif (substr($temp, strlen($temp) - 2, 1) == ',') {
        $temp.= '0';
    } elseif (substr($temp, strlen($temp) - 1, 1) == ',') {
        $temp.= '00';
    } else {
        $temp.= ',00';
    }

    $Total = strlen(intval($temp));
    $TotalLen = strlen(intval($temp)) / 3;
    $TotalLenX = intval(strlen(intval($temp)) / 3);
    $Texto = substr($temp, strlen($temp) - 3, 3);
    $Contar = 0;
    if ($TotalLenX > 0) {

        $vetor = str_split($temp, 1);
        for ($x = count($vetor) - 4; $x >= 0; $x--) {
            $Contar++;
            $Texto = $vetor[$x] . $Texto;

            if ($Contar == 3 && $x <> 0) {
                $Contar = 0;
                $Texto = '.' . $Texto;
            }
        }
    } else {
        if ($neg)
            return '-' . $temp;
        else
            return $temp;
    }  
    //return 'Total sem quebrados = ' . $Total . ', TotalDividido por 3 = ' . $TotalLen . ', TotalArr= ' . $TotalLenX;
    if ($neg)
        return '-' . $Texto;
    else
        return $Texto;
}

function FormatMoedaFull($valor) {
    $valorDuasCasas = substr($valor, 0, strlen($valor) - 2);
    $valorResto = substr($valor, strlen($valor) - 2, 2);

    $valorDuasCasas = FormatMoeda($valorDuasCasas);

    return $valorDuasCasas . $valorResto;
}

function FormatMoeda3casas($valor) {
    $valorDuasCasas = substr($valor, 0, strlen($valor) - 3);
    $valorResto = substr($valor, strlen($valor) - 3, 3);

    $valorDuasCasas = substr(FormatMoeda($valorDuasCasas), 0, strlen(FormatMoeda($valorDuasCasas)) - 3);

    return $valorDuasCasas . "," . $valorResto;
}

function number_format_complete($valor, $caracter, $qtde, $esquerda = true) {
    if ($esquerda)
        return sprintf('%' . $caracter . $qtde . 's', $valor);
    else
        return sprintf('%' . $caracter . '-' . $qtde . 's', $valor);
}

/* function mysqli_set_charset_local($charset, $link_identifier = null) {
  if (function_exists('mysqli_set_charset') === false) {
  if ($link_identifier == null)
  return mysqli_query('SET NAMES "' . $charset . '"');
  else
  return mysqli_query('SET NAMES "' . $charset . '"', $link_identifier);

  } else {
  if ($link_identifier == null)
  mysqli_set_charset($charset);
  else
  mysqli_set_charset($charset, $link_identifier);
  }
  } */

function renomeia_miniatura($filename) {

    $aux = explode("/", $filename);
    $x = explode(".", $aux[count($aux) - 1]);
    $newname = 'mini_' . $x[0];
    $extensao = $x[1];
    $size = sizeof($aux) - 1;

    for ($i = 0; $i < $size; $i++) {
        $novoarquivo .= $aux[$i] . "/";
    }

    $novoarquivo .= $newname . "." . $extensao;
    return $novoarquivo;
}

function verifica_miniatura($filename) {

    $aux = explode("/", $filename);
    $x = explode(".", $aux[count($aux) - 1]);
    $newname = 'mini_' . $x[0];
    $extensao = $x[1];
    $size = sizeof($aux) - 1;

    for ($i = 0; $i < $size; $i++) {
        $novoarquivo .= $aux[$i] . "/";
    }

    $novoarquivo .= $newname . "." . $extensao;

    if (file_exists($novoarquivo)) {

        return true;
    } else {
        return false;
    }
}

function Redimensionar($filename, $new_width, $new_height, $complemento, $quality = 50) {

    $aux = explode("/", $filename);

    $x = explode(".", $aux[count($aux) - 1]);

    if ($complemento == "") {
        $newname = 'mini_' . $x[0];
    } else {
        $newname = $complemento . $x[0];
    }

    $extensao = $x[1];

    if ($extensao == "gif" || $extensao == "png" || $extensao == "bmp") {
        return;
    }
    
    $novoarquivo = "";
    
    $size = sizeof($aux) - 1;

    for ($i = 0; $i < $size; $i++) {
        $novoarquivo .= $aux[$i] . "/";
    }

    $novoarquivo .= $newname . "." . $extensao;

    #pegando as dimensoes reais da imagem, largura e altura
    list($width, $height) = getimagesize($filename);

    if ($width > $height) {
        $new_height = ($height / $width) * $new_width;
    } else {
        $new_width = ( $width / $height) * $new_height;
    }

    #gerando a a miniatura da imagem
    $image_p = imagecreatetruecolor($new_width, $new_height);

    //if ($extensao == ("jpg" || "jpeg")) {
    $image = imagecreatefromjpeg($filename);
    imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    imagejpeg($image_p, $novoarquivo, $quality);
    //}

    imagedestroy($image_p);
}

function rezise_image($filename, $new_width, $new_height, $quality = 50) {

    $aux = explode("/", $filename);

    $x = explode(".", $aux[count($aux) - 1]);

    $newname = 'mini_' . $x[0];
    $extensao = $x[1];

    if ($extensao == "gif" || $extensao == "png" || $extensao == "bmp") {
        return;
    }

    $size = sizeof($aux) - 1;

    for ($i = 0; $i < $size; $i++) {
        $novoarquivo .= $aux[$i] . "/";
    }

    $novoarquivo .= $newname . "." . $extensao;

    #pegando as dimensoes reais da imagem, largura e altura
    list($width, $height) = getimagesize($filename);

    if ($width > $height) {
        $new_height = ($height / $width) * $new_width;
    } else {
        $new_width = ( $width / $height) * $new_height;
    }

    #gerando a a miniatura da imagem
    $image_p = imagecreatetruecolor($new_width, $new_height);

    //if ($extensao == ("jpg" || "jpeg")) {
    $image = imagecreatefromjpeg($filename);
    imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    imagejpeg($image_p, $novoarquivo, $quality);
    //}

    imagedestroy($image_p);
}

function get_path_miniatura($filename) {
    $aux = explode("/", $filename);
    $x = explode(".", $aux[count($aux) - 1]);
    $newname = 'mini_' . $x[0];
    $extensao = $x[1];
    $size = sizeof($aux) - 1;

    for ($i = 0; $i < $size; $i++) {
        $novoarquivo .= $aux[$i] . "/";
    }

    $novoarquivo .= $newname . "." . $extensao;

    return $novoarquivo;
}

function get_extensao($filename) {
    $aux = explode("/", $filename);

    $x = explode(".", $aux[count($aux) - 1]);

    return $x[1];
}

function getURLSite() {
    $protocolo = (strpos(strtolower($_SERVER['SERVER_PROTOCOL']), 'https') === false) ? 'http' : 'https'; // PEGA O PROTOCOLO
    $host = $_SERVER['HTTP_HOST']; //NOME SERVIDOR (NOME OU IP)
    $script = $_SERVER['SCRIPT_NAME']; //CAMINHO DO ARQUIVO
    $url = explode('/', $script); //SEPARA E PEGA APENAS O DIRETORIO ONDE ESTA O SITE

    $UrlSite = $protocolo . '://' . $host . '/' . ($url[1] == '' ? '' : $url[1] . '/'); //MONTA A URL

    return $UrlSite; // RETORNA
}

function semAcentos($frase) {

    $frase = str_replace('ï¿½', '%', $frase);
    $frase = str_replace('ï¿½', '%', $frase);
    $frase = str_replace('`', '%', $frase);
    $frase = str_replace('~', '%', $frase);
    $frase = str_replace('^', '%', $frase);
    $frase = str_replace('ï¿½', 'a', $frase);
    $frase = str_replace('ï¿½', 'a', $frase);
    $frase = str_replace('ï¿½', 'a', $frase);
    $frase = str_replace('ï¿½', 'a', $frase);
    $frase = str_replace('ï¿½', 'o', $frase);
    $frase = str_replace('ï¿½', 'o', $frase);
    $frase = str_replace('ï¿½', 'o', $frase);
    $frase = str_replace('ï¿½', 'a', $frase);
    $frase = str_replace('ï¿½', 'e', $frase);
    $frase = str_replace('ï¿½', 'e', $frase);
    $frase = str_replace('ï¿½', 'a', $frase);
    $frase = str_replace('ï¿½', 'i', $frase);
    $frase = str_replace('ï¿½', 'i', $frase);
    $frase = str_replace('ï¿½', 'u', $frase);
    $frase = str_replace('ï¿½', 'u', $frase);
    $frase = str_replace('ï¿½', 'u', $frase);
    $frase = str_replace('ï¿½', 'c', $frase);

    return strtolower($frase);
}

function getBrowser($versao = true) {
    $useragent = $_SERVER['HTTP_USER_AGENT'];

    if (preg_match('|MSIE ([0-9].[0-9]{1,2})|', $useragent, $matched)) {
        $browser_version = $matched[1];
        $browser = 'IE';
    } elseif (preg_match('|Opera/([0-9].[0-9]{1,2})|', $useragent, $matched)) {
        $browser_version = $matched[1];
        $browser = 'Opera';
    } elseif (preg_match('|Firefox/([0-9\.]+)|', $useragent, $matched)) {
        $browser_version = $matched[1];
        $browser = 'Firefox';
    } elseif (preg_match('|Chrome/([0-9\.]+)|', $useragent, $matched)) {
        $browser_version = $matched[1];
        $browser = 'Chrome';
    } elseif (preg_match('|Safari/([0-9\.]+)|', $useragent, $matched)) {
        $browser_version = $matched[1];
        $browser = 'Safari';
    } else {
        // browser not recognized!
        $browser_version = 0;
        $browser = 'Outros [' . $useragent . ']';
    }
    return $browser . ($versao ? ' ' . $browser_version : '');
}

function valorPorExtenso($valor = 0, $complemento = true) {

    $singular = array("centavo", "real", "mil", "milhÃ£o", "bilhÃ£o", "trilhÃ£o", "quatrilhÃ£o");
    $plural = array("centavos", "reais", "mil", "milhÃµes", "bilhÃµes", "trilhÃµes", "quatrilhÃµes");

    $c = array("", "cem", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos");
    $d = array("", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa");
    $d10 = array("dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezesete", "dezoito", "dezenove");
    $u = array("", "um", "dois", "trÃƒÂªs", "quatro", "cinco", "seis", "sete", "oito", "nove");

    $z = 0;

    $valor = number_format($valor, 2, ".", ".");
    $inteiro = explode(".", $valor);
    for ($i = 0; $i < count($inteiro); $i++)
        for ($ii = strlen($inteiro[$i]); $ii < 3; $ii++)
            $inteiro[$i] = "0" . $inteiro[$i];

    // $fim identifica onde que deve se dar junÃƒÂ§ÃƒÂ£o de centenas por "e" ou por "," ;) 
    $fim = count($inteiro) - ($inteiro[count($inteiro) - 1] > 0 ? 1 : 2);
    for ($i = 0; $i < count($inteiro); $i++) {
        $valor = $inteiro[$i];
        $rc = (($valor > 100) && ($valor < 200)) ? "cento" : $c[$valor[0]];
        $rd = ($valor[1] < 2) ? "" : $d[$valor[1]];
        $ru = ($valor > 0) ? (($valor[1] == 1) ? $d10[$valor[2]] : $u[$valor[2]]) : "";

        $r = $rc . (($rc && ($rd || $ru)) ? " e " : "") . $rd . (($rd && $ru) ? " e " : "") . $ru;
        $t = count($inteiro) - 1 - $i;
        if ($complemento == true) {
            $r .= $r ? " " . ($valor > 1 ? $plural[$t] : $singular[$t]) : "";
            if ($valor == "000")
                $z++;
            elseif ($z > 0)
                $z--;
            if (($t == 1) && ($z > 0) && ($inteiro[0] > 0))
                $r .= (($z > 1) ? " de " : "") . $plural[$t];
        }
        if ($r)
            $rt = $rt . ((($i > 0) && ($i <= $fim) && ($inteiro[0] > 0) && ($z < 1)) ? ( ($i < $fim) ? ", " : " e ") : " ") . $r;
    }

    return($rt ? $rt : "zero");
}

function getBoleanSQL($sql, $ArqT) {
    $Tb = ConsultaSQL($sql, $ArqT);
    if (mysqli_num_rows($Tb) > 0) {
        $r = mysqli_fetch_row($Tb);
        return $r[0];
    } else
        return FALSE;
}

function concatenarStrings($array, $separador, $norape = false) {
    $temp = "";
    foreach ($array as $item)
        if ($item !== "")
            $temp .= ($temp == "" ? "" : $separador) . ($norape ? "<span style='white-space:nowrap'>" : "") . $item . ($norape ? "</span>" : "");
    return $temp;
}

function truncate($valor, $decimais = 2) {
    return floor($valor * pow(10, $decimais)) / pow(10, $decimais);
}

function tirarAcentos($string){
    return preg_replace(array("/(Ã¡|Ã |Ã£|Ã¢|Ã¤)/","/(Ã�|Ã€|Ãƒ|Ã‚|Ã„)/","/(Ã©|Ã¨|Ãª|Ã«)/","/(Ã‰|Ãˆ|ÃŠ|Ã‹)/","/(Ã­|Ã¬|Ã®|Ã¯)/","/(Ã�|ÃŒ|ÃŽ|Ã�)/","/(Ã³|Ã²|Ãµ|Ã´|Ã¶)/","/(Ã“|Ã’|Ã•|Ã”|Ã–)/","/(Ãº|Ã¹|Ã»|Ã¼)/","/(Ãš|Ã™|Ã›|Ãœ)/","/(Ã±)/","/(Ã‘)/"),explode(" ","a A e E i I o O u U n N"),$string);
}

function removePontosArquivo($nomeArquivo) {

    $x = explode(".", $nomeArquivo);

    if(count($x) > 1){

        $x1 = "";

        for($i = 0; $i < count($x); $i++) {

            $x1 .= $x[$i];
        }

        return $x1;
    } else {
        return $nomeArquivo;
    }
}

?>
