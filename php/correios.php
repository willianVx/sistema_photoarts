<?php

include('photoarts.php');

function CalcularPrecoPrazo($nCdEmpresa, $sDsSenha, $nCdServico, $sCepOrigem, $sCepDestino, $nVlPeso, $nCdFormato, $nVlComprimento, $nVlAltura, $nVlLargura, $nVlDiametro, $sCdMaoPropria, $nVlValorDeclarado, $sCdAvisoRecebimento){

	$correios = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?nCdEmpresa=" . $nCdEmpresa . "&sDsSenha=" . $sDsSenha . "&nCdServico=" . $nCdServico . "&sCepOrigem=" . $sCepOrigem . "&sCepDestino=" . $sCepDestino . "&nVlPeso=" . $nVlPeso . "&nCdFormato=" . $nCdFormato . "&nVlComprimento=" . $nVlComprimento . "&nVlAltura=" . $nVlAltura . "&nVlLargura=" . $nVlLargura . "&nVlDiametro=" . $nVlDiametro . "&sCdMaoPropria=" . $sCdMaoPropria . "&nVlValorDeclarado=" . $nVlValorDeclarado . "&sCdAvisoRecebimento=" . $sCdAvisoRecebimento . "";

	$xml = simplexml_load_file($correios);

	print_r($correios);
	echo '<br><br>';

	foreach ($xml->Servicos->cServico as $item) {
		echo $item->Valor . '<br>';
		echo $item->PrazoEntrega . '<br>';
	}
}

CalcularPrecoPrazo("", "", "40010", "06710660", "09210320", "4", 4, 100.00, 70.00, 100.00, 0, "N", 0, "N");