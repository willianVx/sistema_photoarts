<?php
	function Modulo11Base7($NN)
	{
    	$c = 0;
    	$Soma = 0;
	    $M = 0;
    	$Resto = 0;
		
    	$M = 2;
		
	    for ($c = strlen($NN) - 1; $c >= 0;  $c--)
		{
			$Soma += (intval(substr($NN, $c, 1)) * $M);
			$M++;
			
			if ($M > 7) 
				$M = 2;
		}
		
		$Resto = $Soma % 11;
		
		if ($Resto == 1)
			return "P";
		else if ($Resto == 0)
			return "0";
		else
			return trim(strval(11 - $Resto));
	}

	function CodBar25i($codigo) 
	{
		// Função para a criação de códigos de Barra 25i
		
		if ((strlen($codigo) % 2) <> 0) 
		{
			$codigo="0".$codigo;
		}
		
		$inicio = "0000";
		$fim = "100";
		$codn = array("0" => "00110", "1" => "10001", "2" => "01001", "3" => "11000", 
			"4" => "00101", "5" => "10100", "6" => "01100", "7" => "00011", 
			"8" => "10010", "9" => "01010");
			
		$codbin="";
		$BarraBranca="<img src=\"wt.gif\">";
		$BarraPreta="<img src=\"bk.gif\">";

		for ($n=0;$n<=strlen($codigo);$n=$n+2) 
		{
			$a1 = substr($codigo, $n, 1);
			$a2 = substr($codigo, $n + 1, 1);
			
			For ($n2=0;$n2<=5;$n2++) 
			{
				$codbin = $codbin.substr($codn[$a1], $n2, 1).substr($codn[$a2], $n2, 1);
			}
		}
		
		$codbin = $inicio.$codbin.$fim;
		$cy=false;
		$Saida="";
		
		for ($n=1;$n<=strlen($codbin);$n++) 
		{
			If (substr($codbin, $n, 1) == "0") 
			{
				if ($cy) 
				{
					$Saida=$Saida.$BarraPreta;
				}
				else 
				{
					$Saida=$Saida.$BarraBranca;
				}
			}
			else 
			{
				if ($cy) 
				{
					$Saida=$Saida.$BarraPreta.$BarraPreta.$BarraPreta;
				}
				else 
				{
					$Saida=$Saida.$BarraBranca.$BarraBranca.$BarraBranca;
				}
			}
		
			$cy=!$cy;
		}									
			
		return $Saida;
	}

	function Modulo11($codigo) 
	{
		$M = 1;
		$n = 0;
		
		for ($c = strlen($codigo)-1;$c>=0;$c--) 
		{
			if ($M == 9) $M = 2; else $M++;
			$n = $n + strval(substr($codigo, $c, 1)) * $M;
		}
		
		$n = $n * 10;
		$n = $n % 11;
		
		return substr(trim(strval($n)),-1,1);
	}
	
	function FormatData($data) 
	{
		return substr($data,8,2)."/".substr($data,5,2)."/".substr($data,0,4);
	}
	
	function Modulo10($codigo) 
	{
		$M = 1;
		$n = 0;
		$n2 = 0;
	
		for ($c = strlen($codigo)-1;$c>=0;$c--) 
		{
			If ($M == 1) 
				$M = 2; 
			else 
				$M = 1;
				
			$n = intval(substr($codigo, $c, 1)) * $M;
			
			If ($n > 9) 
			{
				$n = substr(trim(strval($n)),0, 1) + substr(trim(strval($n)), -1,1);
			}
			
			$n2 = $n2 + $n;
		}
		
		$n2 = $n2 % 10;
		$n2 = 10 - $n2;
	
		return substr(trim(strval(strval($n2))), -1,1);
	}

// principal 

	$NossoNumero = $_GET['codigo'];
	$conexao = mysql_connect("201.56.207.231", "wraa", "quebranozes");
	
	if (substr($NossoNumero, 0, 1) == "5") 
	{
		$banco = "BANCOINDUSTRIAL";
	} 
	
	$bancook = mysql_select_db($banco,$conexao);
	$SSql = "select * from setupbradesco";
	$resultado = mysql_query($SSql,$conexao);
	$a = mysql_num_rows($resultado);
	
	if ($a != 1)
	{
		echo 'Erro! Entrar em contato com o Suporte Técnico';
		exit;
	}
	else
	{
		$BradescoLocalPag = mysql_result($resultado, 0, "localDePagamento");
		$BradescoCliente = mysql_result($resultado, 0, "cedente");
		$BradescoAgencia = mysql_result($resultado, 0, "agencia");
		$BradescoConta = mysql_result($resultado, 0, "contacorrente");
//		$BradescoDac = mysql_result($resultado, 0, "dac");
		$BradescoCarteira = mysql_result($resultado, 0, "carteira");
		$BradescoTaxa = mysql_result($resultado, 0, "taxa");
		$BradescoMensa = mysql_result($resultado, 0, "mensagemboleto");
	}
	
	$SSql = "select p.codigo AS numero, d.nome, e.rua AS endereco, e.cidade, e.uf AS estado, e.cep, d.cpf AS cnpj, p.valor, " . 
		"p.vencimento, DATEDIFF(p.vencimento, '1997-10-07') AS fator, NOW() AS data " . 
		"FROM parcelas AS p " . 
		"INNER JOIN devedores AS d ON d.cpf = p.cpf " . 
		"LEFT JOIN enderecos AS e ON (e.cpf = d.cpf AND e.envio = -1) " . 
		"WHERE p.codigo = " . substr($NossoNumero, 1, 10) . " " . 
		"GROUP BY p.codigo";

	$resultado2=mysql_query($SSql, $conexao);
	$a = mysql_num_rows($resultado2);
	
	if ($a != 1)
	{
		echo 'Erro! Código de Boleto inválido! Entrar em contato com o Suporte Técnico';
		exit();
	}
	else
	{
		$DataEmissao=FormatData(mysql_result($resultado2, 0, "data"));
		$Valor = mysql_result($resultado2, 0, "valor") + $BradescoTaxa;
		$Vencimento = FormatData(mysql_result($resultado2, 0, "vencimento"));
		$Nome = mysql_result($resultado2, 0, "nome");
		$Cpf = mysql_result($resultado2, 0, "CNPJ");
		$Endereco = mysql_result($resultado2, 0, "ENDERECO");
		$Cidade = mysql_result($resultado2, 0, "CIDADE");
		$Estado = mysql_result($resultado2, 0, "estado");
		$CEP = mysql_result($resultado2, 0, "CEP");
		$Fator = mysql_result($resultado2, 0, "Fator");
	}
	
	$ValorL = "0000000000" . ($Valor * 100);
	$ValorL = substr($ValorL, strlen($ValorL) - 10, 10);
	
	$CampoLivre = substr($BradescoAgencia, 0, 4) . $BradescoCarteira . $NossoNumero . substr($BradescoConta, 0, 7) . "0";
	$CodBarras = "2379" . $Fator . $ValorL . $CampoLivre;
	$DacBarras = Modulo11($CodBarras);
	$CodBarras = substr($CodBarras, 0, 4) . $DacBarras . substr($CodBarras, 4);
	
	$Ipte0 = "2379" . substr($CampoLivre, 0, 5);
	$Ipte0 .= Modulo10($Ipte0);
	$Ipte0 = substr($Ipte0, 0, 5) . "." . substr($Ipte0, 5);
	
	$Ipte1 = substr($CampoLivre, 5, 10);
	$Ipte1 .= Modulo10($Ipte1);
	$Ipte1 = substr($Ipte1, 0, 5) . "." . substr($Ipte1, 5);	
	
	$Ipte2 = substr($CampoLivre, 15, 10);
	$Ipte2 .= Modulo10($Ipte2);
	$Ipte2 = substr($Ipte2, 0, 5) . "." . substr($Ipte2, 5); 
	
	$Ipte3 = $DacBarras;
	
	$Ipte4 = $Fator . $ValorL;
	
	$IPTE = $Ipte0 . "  " . $Ipte1 . "  " . $Ipte2 . "  " . $Ipte3 . "  " . $Ipte4;
?>

<html> 
	<head>
    	<title>Boleto</title>
        
        <style>
<!--
 /* Style Definitions */
p.MsoNormal, li.MsoNormal, div.MsoNormal
	{mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p
	{margin-right:0cm;
	mso-margin-top-alt:auto;
	mso-margin-bottom-alt:auto;
	margin-left:0cm;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.style1, li.style1, div.style1
	{mso-style-name:style1;
	margin-right:0cm;
	mso-margin-top-alt:auto;
	mso-margin-bottom-alt:auto;
	margin-left:0cm;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:Arial;
	mso-fareast-font-family:"Times New Roman";}
p.style6, li.style6, div.style6
	{mso-style-name:style6;
	margin-right:0cm;
	mso-margin-top-alt:auto;
	mso-margin-bottom-alt:auto;
	margin-left:0cm;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
span.style11
	{mso-style-name:style11;
	mso-ascii-font-family:Arial;
	mso-hansi-font-family:Arial;
	mso-bidi-font-family:Arial;}
span.style12
	{mso-style-name:style12;
	mso-ascii-font-family:Arial;
	mso-hansi-font-family:Arial;
	mso-bidi-font-family:Arial;}
@page Section1
	{size:612.0pt 792.0pt;
	margin:70.85pt 3.0cm 70.85pt 3.0cm;
	mso-header-margin:35.4pt;
	mso-footer-margin:35.4pt;
	mso-paper-source:0;}
div.Section1
	{page:Section1;}
.style4 {font-size: 16px}
div.MsoNormal1 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal1 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal1 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal2 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal2 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal2 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal3 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal3 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal3 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal4 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal4 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal4 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
.style11 {font-size: 6px}
.style12 {font-size: 7pt}
div.MsoNormal5 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal5 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal5 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal6 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal6 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal6 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal7 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal7 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal7 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal8 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal8 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal8 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal9 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal9 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal9 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal10 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal10 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal10 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal101 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal51 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal61 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal71 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal81 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal91 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
span.style121 {mso-style-name:style12;
	mso-ascii-font-family:Arial;
	mso-hansi-font-family:Arial;
	mso-bidi-font-family:Arial;}
p.MsoNormal1011 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal1012 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal1013 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal1014 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal1015 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal1016 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
div.MsoNormal11 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
li.MsoNormal11 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
p.MsoNormal11 {mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman";
	mso-fareast-font-family:"Times New Roman";}
.style13 {font-family: Arial}
.style17 {font-size: 10pt}
-->
</style>
    </head>
    
    <body>

<table width="657" border="0">
  <tr>
    <td width="108" style='width:80pt;border-top:none;border-left:
  none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><div align="center"><span style6><strong>BRADESCO</strong></span>
    </div>      <span class="MsoNormal"><o:p></o:p>
    </span></td>
    <td width="68"  style='width:50pt;border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><div align="center"><span class="MsoNormal" style="margin-left:-1.85pt;text-indent:1.85pt"><span
  class=style11><b><span style='font-size:16.0pt;mso-bidi-font-size:12.0pt; font-family:Arial'>237-2</span></b></span>
    </span></div>      
    <span class="MsoNormal" style="margin-left:-1.85pt;text-indent:1.85pt"><b><span style='font-size:16.0pt;
  mso-bidi-font-size:12.0pt'><o:p></o:p>
    </span></b></span></td>
    <td width="457"  style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><div align="right"><span class="style13">RECIBO DO SACADO </span></div></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="469" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p align="left" class=MsoNormal1 style12 style1><span style='mso-bidi-font-size: 12.0pt'><span class="style12">Local de Pagamento:</span>        
      <o:p></o:p>
    </span> <? echo $BradescoLocalPag; ?> </p></td>
    <td width="166" valign="top" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal2 style1><span style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'><span class="style12">Vencimento</span>
            <o:p></o:p>
    </span><span style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'><span class="style17">
        <o:p></o:p>
        </span></span></p>
    <p align="right" class=MsoNormal2 style17 style1><?php echo $Vencimento ?></p></td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal3 style10><span style='mso-bidi-font-size:12.0pt'><span class="style12">Cedente</span>
            <o:p></o:p>
    </span></p>
      <span class="style17"><? echo $BradescoCliente; ?>
      <o:p></o:p>
      </span></td>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal4 style1><span style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'><span class="style12">Ag&ecirc;ncia / C&oacute;digo Cedente</span>
      <o:p></o:p>
    </span></p>
    <p align="right" class=MsoNormal4 style1><?php echo $BradescoAgencia."/".$BradescoConta ?></p></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="92" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal5 style1><span class="style12">Data do Documento</span>
            <o:p></o:p>
    </p>
    <p class=MsoNormal5 style1><?php echo $DataEmissao ?></p></td>
    <td width="116" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal6 style1><span class="style12">No.  Documento</span>
      <o:p></o:p>
    </p>
      <p class=MsoNormal6 style1><?php echo $NossoNumero ?>
        <o:p></o:p>
    </p></td>
    <td width="69" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal7 style1><span class="style12" style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'>Esp&eacute;cie Doc</span><span class="style12">.</span>
          <o:p></o:p>
    </p>
    <p class=MsoNormal7 style1>RC </p></td>
    <td width="52" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal8 style1><span class="style12">Aceite</span>
            <o:p></o:p>
    </p>
    <p class=MsoNormal8 style1>N</p></td>
    <td width="124" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal9 style1><span class="style12">Data processamento</span>
      <o:p></o:p>
    </p>
      <p class=MsoNormal9 style1>
        <![if !supportEmptyParas]>
        &nbsp;
        <![endif]>
        <o:p></o:p>
    </p></td>
    <td width="166" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal10 style1><span class="style12">Nosso N&uacute;mero</span>
            <o:p></o:p>
    </p>
    <p align="right" class=MsoNormal10 style1><?php echo $BradescoCarteira."/".$NossoNumero."-".
	Modulo11Base7($BradescoCarteira.$NossoNumero) ?></p></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="92" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal51 style1><span class="style12">Uso do Banco</span>
            <o:p></o:p>
    </p>
        <p class=MsoNormal51 style1>8650</p></td>
    <td width="74" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal61 style1><span class="style12">Carteira</span>
            <o:p></o:p>
    </p>
        <p class=MsoNormal61 style1><? echo $BradescoCarteira; ?>
          <o:p></o:p>
      </p></td>
    <td width="41" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal71 style1><span class="style12" style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'>Esp&eacute;cie</span>
      <o:p></o:p>
    </p>
        <p class=MsoNormal71 style1>R$</p></td>
    <td width="122" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal81 style1><span class="style12">Quantidade</span>
            <o:p></o:p>
    </p>
    <p class=MsoNormal81 style1>&nbsp;</p></td>
    <td width="124" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal91 style1><span class="style12">Valor</span>
            <o:p></o:p>
    </p>
        <p class=MsoNormal91 style1>
          <![if !supportEmptyParas]>
          &nbsp;
          <![endif]>
          <o:p></o:p>
      </p></td>
    <td width="166" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal101 style1><span class="style12">(=)Valor do Documento</span>
            <o:p></o:p>
    </p>
        <p align="right" class=MsoNormal101 style1><?php echo $Valor ?></p></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="470" rowspan="5" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><?php echo $BradescoMensa ?>     &nbsp;</td>
    <td width="165" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal1014 style1><span class="style12">(-)Desconto / Abatimento</span>
          <o:p></o:p>
    </p>
    </td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'>&nbsp;</td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal1015 style1><span class="style12">(+)Mora / Multa</span>
          <o:p></o:p>
    </p>
    </td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'>&nbsp;</td>
  </tr>
  <tr>
    <td height="34" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal1016 style1><span class="style12">(=)Valor Cobrado</span>
        <o:p></o:p></p>
    </td>
  </tr>
</table>
<table width="650" border="0">
  <tr>
    <td width="410" style='border-bottom:solid windowtext .5pt'><p class=MsoNormal11 style1><span lang=ES-TRAD style='font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD'>Sacado
            <o:p></o:p>
    </span></p>
      <p class=MsoNormal11 style18 style18 style1><span lang=ES-TRAD style='mso-ansi-language:ES-TRAD'><?php echo $Nome ?>
            <o:p></o:p>
      </span></p>
    </td>
    <td width="230" style='border-bottom:solid windowtext .5pt'><p style="font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD"><span
  style="mso-spacerun:
  yes">&nbsp;</span><span style="mso-ansi-language:ES-TRAD">CPF/CNPJ:<?php echo $Cpf ?></span></p>
    </td>
  </tr>
  <tr>
    <td><p>&nbsp;</p>    </td>
    <td><p><span class="style12" style="font-size:7pt;mso-bidi-font-size: 12.0pt">Autentica&ccedil;&atilde;o Mec&acirc;nica  </span></p>    </td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
</table>

<table width="657" border="0">
  <tr>
    <td width="108" style='width:80pt;border-top:none;border-left:
  none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><div align="center"><span style6><strong>BRADESCO</strong></span>
    </div>      <span class="MsoNormal"><o:p></o:p>
    </span></td>
    <td width="68"  style='width:50pt;border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><div align="center"><span class="MsoNormal" style="margin-left:-1.85pt;text-indent:1.85pt"><span
  class=style11><b><span style='font-size:16.0pt;mso-bidi-font-size:12.0pt; font-family:Arial'>237-2</span></b></span>
    </span></div>      
    <span class="MsoNormal" style="margin-left:-1.85pt;text-indent:1.85pt"><b><span style='font-size:16.0pt;
  mso-bidi-font-size:12.0pt'><o:p></o:p>
    </span></b></span></td>
    <td width="457"  style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><span class="style4" style="font-family:
  Arial"><?php echo $IPTE ?></span></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="469" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal1 style12 style1><span style='mso-bidi-font-size: 12.0pt'><span class="style12">Local de Pagamento:</span>
            <o:p></o:p>
    </span><? echo $BradescoLocalPag; ?>          <o:p></o:p>      </p></td>
    <td width="166" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal2 style1><span style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'><span class="style12">Vencimento</span>
            <o:p></o:p>
    </span></p>
      <p align="right" class=MsoNormal2 style1><span style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'><span class="style17">
        <o:p></o:p>
      </span></span><?php echo $Vencimento ?></p>
    </td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal3 style10><span style='mso-bidi-font-size:12.0pt'><span class="style12">Cedente</span>
            <o:p></o:p>
    </span></p>
      <p align="left" class=MsoNormal3 style17><span class="style17"><? echo $BradescoCliente; ?></span>
        <o:p></o:p>
    </p></td>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal4 style1><span style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'><span class="style12">Ag&ecirc;ncia / C&oacute;digo Cedente</span>
      <o:p></o:p>
    </span></p>
    <p align="right" class=MsoNormal4 style1><?php echo $BradescoAgencia."/".$BradescoConta; ?></p></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="92" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal5 style1><span class="style12">Data do Documento</span>
            <o:p></o:p>
    </p>
    <p class=MsoNormal5 style1><?php echo $DataEmissao ?></p></td>
    <td width="116" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal6 style1><span class="style12">No.  Documento</span>
      <o:p></o:p>
    </p>
      <p class=MsoNormal6 style1><?php echo $NossoNumero ?>
        <o:p></o:p>
    </p></td>
    <td width="69" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal7 style1><span class="style12" style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'>Esp&eacute;cie Doc</span><span class="style12">.</span>
          <o:p></o:p>
    </p>
    <p class=MsoNormal7 style1>RC </p></td>
    <td width="52" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal8 style1><span class="style12">Aceite</span>
            <o:p></o:p>
    </p>
    <p class=MsoNormal8 style1>N</p></td>
    <td width="124" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal9 style1><span class="style12">Data processamento</span>
      <o:p></o:p>
    </p>
      <p class=MsoNormal9 style1>
        <![if !supportEmptyParas]>
        &nbsp;
        <![endif]>
        <o:p></o:p>
    </p></td>
    <td width="166" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal10 style1><span class="style12">Nosso N&uacute;mero</span>
            <o:p></o:p>
    </p>
    <p align="right" class=MsoNormal10 style1><?php echo $BradescoCarteira."/".$NossoNumero."-".
	Modulo11Base7($BradescoCarteira.$NossoNumero) ?></p></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="92" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal51 style1><span class="style12">Uso do Banco</span>
            <o:p></o:p>
    </p>
        <p class=MsoNormal51 style1>8650</p></td>
    <td width="74" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal61 style1><span class="style12">Careteira</span>
            <o:p></o:p>
    </p>
        <p class=MsoNormal61 style1>
          <o:p></o:p><? echo $BradescoCarteira; ?>
      </p></td>
    <td width="41" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal71 style1><span class="style12" style='font-size:8.0pt;mso-bidi-font-size:
  12.0pt'>Esp&eacute;cie</span>
      <o:p></o:p>
    </p>
        <p class=MsoNormal71 style1>R$</p></td>
    <td width="122" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal81 style1><span class="style12">Quantidade</span>
            <o:p></o:p>
    </p>
    <p class=MsoNormal81 style1>&nbsp;</p></td>
    <td width="124" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><p class=MsoNormal91 style1><span class="style12">Valor</span>
            <o:p></o:p>
    </p>
        <p class=MsoNormal91 style1>
          <![if !supportEmptyParas]>
          &nbsp;
          <![endif]>
          <o:p></o:p>
      </p></td>
    <td width="166" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal101 style1><span class="style12">(=)Valor do Documento</span>
            <o:p></o:p>
    </p>
        <p align="right" class=MsoNormal101 style1><?php echo $Valor ?></p></td>
  </tr>
</table>
<table width="645" border="0">
  <tr>
    <td width="470" rowspan="5" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:solid windowtext .5pt'><?php echo $BradescoMensa ?>     &nbsp;</td>
    <td width="165" style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal1014 style1><span class="style12">(-)Desconto / Abatimento</span>
          <o:p></o:p>
    </p>
    </td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'>&nbsp;</td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal1015 style1><span class="style12">(+)Mora / Multa</span>
          <o:p></o:p>
    </p>
    </td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'>&nbsp;</td>
  </tr>
  <tr>
    <td style='border-top:none;border-left:none;border-bottom:solid windowtext .5pt;border-right:none'><p align="right" class=MsoNormal1016 style1><span class="style12">(=)Valor Cobrado </span>
          <o:p></o:p>
    </p>
    </td>
  </tr>
</table>
<table width="650" border="0">
  <tr>
    <td width="410" style='border-bottom:solid windowtext .5pt'><p class=MsoNormal11 style1><span lang=ES-TRAD style='font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD'>Sacado
            <o:p></o:p>
    </span></p>
      <p class=MsoNormal11 style18 style18 style1><span lang=ES-TRAD style='mso-ansi-language:ES-TRAD'><?php echo $Nome ?>
            <o:p></o:p>
      </span></p>
      <p class=MsoNormal11 style18 style18 style1><span lang=ES-TRAD style='mso-ansi-language:ES-TRAD'>	  
<?php echo $Endereco ?>
            <o:p></o:p>
      </span></p>
      <p class=MsoNormal11 style18 style18 style1><span style='mso-ansi-language:ES-TRAD' lang=ES-TRAD>	  
<?php echo $Cidade."  -  ".$Estado."       CEP  ".$CEP ?>
            <o:p></o:p>
      </span></p>
    <p class=MsoNormal11 style1><span lang=ES-TRAD style='font-size:10px; mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD'></span><span lang=ES-TRAD style='font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD'>Sacador Avalista</span></p></td>
    <td width="230" style='border-bottom:solid windowtext .5pt'><p style="font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD"><span
  style="mso-spacerun:
  yes">&nbsp;</span><span style="mso-ansi-language:ES-TRAD">CPF/CNPJ:<?php echo $Cpf ?></span></p>
      <p style="font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD">&nbsp;</p>
    <p class="style12" style="font-size:8.0pt;
  mso-bidi-font-size:12.0pt;mso-ansi-language:ES-TRAD">C&oacute;digo de Baixa: </p></td>
  </tr>
  <tr>
    <td><p class="style17"> 

<?php 
echo CodBar25i($CodBarras);
?>

  &nbsp;</p>
    <p class="style17">&nbsp;</p></td>
    <td><p><span class="style12" style="font-size:7pt;mso-bidi-font-size: 12.0pt">Autentica&ccedil;&atilde;o Mec&acirc;nica / Ficha de Compensa&ccedil;&atilde;o </span></p>
      <p>&nbsp;</p>
    <p>&nbsp;</p></td>
  </tr>
</table>
</body>
</html> 