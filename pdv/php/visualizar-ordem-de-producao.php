<?php

include './photoarts-pdv.php';
require_once '../../padrao/pdf/mpdf.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostrar':
            Mostrar();
            break;

        case 'Gravar':
        	Gravar();
        	break;

        case 'GerarPdfOrdem':
        	GerarPdfOrdem();
        	break;
    }
}

function Mostrar() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT o.idVenda, LPAD(o.idVenda,6,0) AS codVenda, CURDATE() AS dataAtual,
            l.loja,IFNULL(prodf.funcionario,'') AS usuarioCadastro,
            IFNULL(cancelf.funcionario,'') AS usuarioCancelou, IFNULL(finalizaf.funcionario,'') AS usuarioFinalizou,
            o.idOrdemProducao AS codigo, o.dataOrdemProducao AS 'data', o.dataPrevista AS previsao,
            o.obs, o.finalizada, o.cancelada, o.idLoja, o.dataFinalizada, o.dataCancelada, 
            IFNULL(c.cliente, '') AS cliente, IFNULL(fp.formaPagamento, '') AS formaPagamento, 
            IFNULL(LPAD(v.idVenda, 5, '0'), '') AS numeroPedido 
            FROM ordem_producao AS o
            LEFT JOIN funcionarios AS prodf ON prodf.idFuncionario = o.idUsuarioCadastro
            LEFT JOIN funcionarios AS cancelf ON cancelf.idFuncionario = o.idUsuarioCancelada
            LEFT JOIN funcionarios AS finalizaf ON finalizaf.idFuncionario = o.idUsuarioFinalizada
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            LEFT JOIN vendas AS v ON v.idVenda = o.idVenda
            LEFT JOIN clientes AS c ON c.idCliente = v.idCliente
            LEFT JOIN vendas_parcelas AS vp ON vp.idVenda = v.idVenda 
            LEFT JOIN formaspagamentos AS fp ON fp.idFormaPagamento = vp.idFormaPagamento
            WHERE o.cancelada = 0 ";

    if($_POST['ordemProducao'] != ''){
        $sql .= ' AND o.idOrdemProducao = ' . $_POST['ordemProducao'];
    }else{
        $sql .= ' AND o.idVenda = ' . $_POST['numeroPedido'];
    }

    $Tb = ConsultaSQL($sql, $ArqT);
    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $json = array(
        'id' => number_format_complete($linha['codigo'], '0', 5),
        'codigo' => $linha['codigo'],
        'idVenda' => $linha['idVenda'],
        'codVenda' => $linha['codVenda'],
        'usuarioCadastro' => $linha['usuarioCadastro'],
        'usuarioCancelou' => $linha['usuarioCancelou'],
        'usuarioFinalizou' => $linha['usuarioFinalizou'],
        'data' => FormatData($linha['data'], false),
        'idFornecedor' => $linha['idFornecedor'],
        'previsao' => FormatData($linha['previsao'], false),
        'obs' => $linha['obs'],
        'finalizada' => $linha['finalizada'],
        'cancelada' => $linha['cancelada'],
        'dataFinalizada' => FormatData($linha['dataFinalizada'], false),
        'dataCancelada' => FormatData($linha['dataCancelada'], false),
        'idLoja' => $linha['idLoja'],
        'loja' => $linha['loja'],
        'dataAtual' => FormatData($linha['dataAtual'], false),
        'etapas' => getEtapasOrdensProducaoArqT($ArqT),
        'itens' => MostrarItens($ArqT, $linha['codigo']),
        'cliente' => $linha['cliente'],
        'formaPagamento' => $linha['formaPagamento'],
        'numeroPedido' => $linha['numeroPedido']
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}


function getEtapasOrdensProducaoArqT($ArqT) {

    $sql = "SELECT idEtapa AS codigo, CONCAT(etapa, ' - ', descricaoEtapa) AS nome FROM etapas 
            WHERE ativo = 1 ORDER BY ordem";
    $Tb = ConsultaSQL($sql, $ArqT);
    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {
        while ($linha =mysqli_fetch_assoc($Tb)) {
            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome']
            );
        }
        return json_encode($json);
    }
}

function MostrarItens($ArqT, $idOrdemProducao) {

    $sql = "SELECT o.imagem AS  imagemOriginal, IFNULL(CONCAT(tm.nomeTamanho,' (',REPLACE(tm.altura,'.0',''),'x',REPLACE(tm.largura,'.0',''),')'), 
            IFNULL(CONCAT(ti.nomeTamanho,' (',REPLACE(ti.altura,'.0',''),'x',REPLACE(ti.largura,'.0',''),')'),'- - -')) AS tamanho,
            IFNULL(ar.artista,'- - -') AS artista, o.idOrdemProducaoComp AS codigo, IFNULL(a.nomeAcabamento, '- - -') AS acabamento, e.idEtapa,
            IFNULL(CONCAT(e.etapa, ' - ', e.descricaoEtapa),'') AS etapa,  e.etapa AS etapanumero,
            t.produto AS tipo, IFNULL(b.nomeObra,'- - -') AS obra, o.altura, o.largura,
            o.certificado, o.numeroSerie AS selo, IFNULL(CONCAT('../imagens/', t.pasta ,'/',o.imagem),'../imagens/semarte.png') AS imagem, o.qtd,
            o.idObra, o.idArtista, o.idTamanho, o.idAcabamento, o.idGrupo, o.idMoldura, o.idProduto, o.obs, o.idTipoProduto, 
            IFNULL(IFNULL(tm.nomeTamanho, ti.nomeTamanho), '- - -') AS nomeTamanho, IFNULL(m.moldura, '') AS moldura, p.nomeProduto
            FROM ordem_producao_comp AS o
            LEFT JOIN etapas AS e ON e.idEtapa =  o.idOPEtapa
            LEFT JOIN tipos_produtos AS t ON t.idTipoProduto = o.idTipoProduto 
            LEFT JOIN produtos AS p ON p.idProduto=o.idProduto
            LEFT JOIN artistas_obras AS b ON b.idArtistaObra = o.idObra
            LEFT JOIN artistas AS ar ON ar.idArtista = b.idArtista
            LEFT JOIN acabamentos AS a ON a.idAcabamento = o.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = o.idTamanho
            LEFT JOIN tamanhos AS ti ON ti.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tm ON tm.idTamanho = o.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = o.idMoldura 
            WHERE o.del = 0 AND idOrdemProducao =  " . $idOrdemProducao;
    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {
        while ($linha =mysqli_fetch_assoc($Tb)) {
            $json[] = array(
                'tamanho' => $linha['tamanho'],
                'etapanumero' => $linha['etapanumero'],
                'codigo' => $linha['codigo'],
                'artista' => $linha['artista'],
                'idEtapa' => $linha['idEtapa'],
                'etapa' => $linha['etapa'],
                'tipo' => $linha['tipo'],
                'obra' => $linha['obra'],
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']),
                'certificado' => $linha['certificado'],
                'selo' => $linha['selo'],
                'acabamento' => $linha['acabamento'],
                'imagem' => ($linha['imagemOriginal'] == '' ? '../imagens/semarte.png' : $linha['imagem']),
                'qtd' => $linha['qtd'],
                'idObra' => $linha['idObra'],
                'idArtista' => $linha['idArtista'],
                'idTamanho' => $linha['idTamanho'],
                'idAcabamento' => $linha['idAcabamento'],
                'idGrupo' => $linha['idGrupo'],
                'idMoldura' => $linha['idMoldura'],
                'idProduto' => $linha['idProduto'],
                'obs' => $linha['obs'],
                'idTipoProduto' => $linha['idTipoProduto'],
                'nomeTamanho' => $linha['nomeTamanho'],
                'moldura' => $linha['moldura'],
                'nomeProduto' => $linha['nomeProduto'],
                'opStatus' => MostrarOpCompStatus($ArqT, $linha['codigo'])
            );
        }
        return json_encode($json);
    }
}

function MostrarOpCompStatus($ArqT, $idOrdemProducaoComp){

    $sql = "SELECT ocs.idOpCompStatus, ocs.opCompStatus, 
            IFNULL((SELECT 1 FROM ordem_producao_comp_status WHERE idOrdemProducaoComp = " . $idOrdemProducaoComp . " AND idOpCompStatus = ocs.idOpCompStatus LIMIT 1), 0) AS ok
            FROM op_comp_status AS ocs ORDER BY ocs.ordem";
    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $json[] = array(
                'opCompStatus' => $linha['opCompStatus'],
                'ok' => $linha['ok'],
                'idOpCompStatus' => $linha['idOpCompStatus']
            );
        }
        
        return json_encode($json);
    }
}

function Gravar(){

	$ArqT = AbreBancoPhotoartsPdv();

	$idObra = explode(',', $_POST['idObras']);
	$idEtapa = explode(',', $_POST['idEtapa']);

	for($i = 0; $i < count($idObra); $i++){

		$sql = "UPDATE ordem_producao_comp SET 
				idOPEtapa = " . $idEtapa[$i] . ", 
				dataAtualizacao = NOW() 
				WHERE idOrdemProducaoComp = " . $idObra[$i];
		mysqli_query($sql, $ArqT);

		$sql = "SELECT idEtapa FROM ordem_producao_etapas 
				WHERE idOrdemProducaoComp = " . $idObra[$i] . " 
				AND idEtapa = " . $idEtapa[$i] . " 
				ORDER BY idOrdemProducaoEtapa DESC LIMIT 1";
        $Tb = ConsultaSQL($sql, $ArqT);

        if(mysqli_num_rows($Tb) <= 0){

        	$sql = "INSERT INTO ordem_producao_etapas SET 
					ativo = 1, 
					dataCadastro = NOW(), 
					idEtapa = " . $idEtapa[$i] . ", 
					NomeEtapa = (SELECT CONCAT(etapa, ' - ', descricaoEtapa) FROM etapas WHERE idEtapa = " . $idEtapa[$i] . "), 
					idOrdemProducaoComp = " . $idObra[$i];
			mysqli_query($sql, $ArqT);
        }
	}
}

function GerarPdfOrdem() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT o.idVenda, LPAD(o.idVenda,5,0) AS codVenda, CURDATE() AS dataAtual,
        l.loja,IFNULL(prodf.funcionario,'') AS usuarioCadastro,
        IFNULL(cancelf.funcionario,'') AS usuarioCancelou, IFNULL(finalizaf.funcionario,'') AS usuarioFinalizou,
        o.idOrdemProducao AS codigo, o.dataOrdemProducao AS 'data',   o.dataPrevista AS previsao,
       (SELECT idTipoProduto FROM ordem_producao_comp WHERE idOrdemProducao = o.idOrdemProducao LIMIT 1) AS tipox,
        o.obs, o.finalizada, o.cancelada, o.idLoja, o.dataFinalizada, o.dataCancelada 
        FROM ordem_producao AS o
        LEFT JOIN funcionarios AS prodf ON prodf.idFuncionario = o.idUsuarioCadastro
        LEFT JOIN funcionarios AS cancelf ON cancelf.idFuncionario = o.idUsuarioCancelada
        LEFT JOIN funcionarios AS finalizaf ON finalizaf.idFuncionario = o.idUsuarioFinalizada
        LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
        WHERE o.idOrdemProducao =  " . $_POST['idOrdem'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $loja = $linha['loja'];
    $previsao = FormatData($linha['previsao'], false);
    $emissao = FormatData($linha['data'], false);
    $obs = $linha['obs'];
    $dataAtual = dataExtenso($linha['dataAtual']);
    $idTipoProduto =mysqli_result($Tb, '0', 'tipox'); //mysqli_result($Tb, 0, "idTipoProduto");
    $numeroOrdem = number_format_complete($linha['codigo'], '0', 5);
    $numeroPedido = ($linha['codVenda'] == '' ? ' - - - ' : $linha['codVenda']);

    $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : ($idTipoProduto == '3' ? '#6FAEE3' : '#3AB54A'));
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : ($idTipoProduto == '3' ? 'Photoarts' : 'InstaArts'));
    $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : ($idTipoProduto == '3' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg'));
    $medidasLogo = ($idTipoProduto == '1' ? 'width:150px; height:auto; float:right; margin-top:-32px;' : ($idTipoProduto == '3' ? 'width:150px; height:auto; float:right; margin-top:-32px;' : 'width:270px; height:auto; float:right; margin-top:10px;'));
    $assinatura = ($idTipoProduto == '1' ? 'Photoarts Gallery' : ($idTipoProduto == '3' ? 'Photoarts Gallery' : 'InstaArts'));
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : ($idTipoProduto == '3' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019'));
    $rodape2 = ($idTipoProduto == '1' ? 'www.photoarts.com.br' : ($idTipoProduto == '3' ? 'www.photoarts.com.br' : 'www.instaarts.com.br'));

    $html = '<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title>Photoarts Gallery - Impressão Ordem de Produção</title>
                        <style>
                            .tabela_cinza_foco {
                                border: none;
                                overflow:auto;
                                color:#000;
                                font-size:10px;
                                padding-left:0px;
                                padding-top:0px;
                                width: 100%;
                                font-family: sans-serif;
                            }
                            .tabela_cinza_foco th {
                                border:none;
                                font-size:12px;
                                color:#000;
                                background: ' . $corPdf . ';//#EB801B;
                                border-radius: 10px 20px;
                            }
                            .tabela_cinza_foco td {
                                border:none;
                                font-size:11px;
                                border-radius: 10px 20px;
                            }
                        </style>
                    </head>
                    <body style="margin:0px; font-family:Arial, Helvetica, sans-serif; font-size:12px;">
                        <div id="quadro1" style="border:1px solid #000; min-height:950px; width:735px; padding-left:15px; padding-right:15px;">
                            <div id="linha1">
                                <div style="overflow:hidden; color:' . $corPdf . '; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;">Ordem de Produção</div>
                                <div style="float:right; overflow:hidden; color:#000; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:right; font-weight:bold; font-size:20px; margin-top:-50px;">
                                    Nº Ordem: <span>' . $numeroOrdem . '</span>
                                    <br />
                                    <span>Nº Pedido:</span> <span>' . $numeroPedido . '</span>
                                    <br>
                                    <span>' . strtoupper($nomeProduto) . '</span> 
                                </div>
                            </div>
                            <!--linha1-->
                            <div id="linha2" style="background:' . $corPdf . '; padding:4px; margin-bottom:10px;"></div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:left;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; vertical-align:top; text-align:left; width:auto;">Loja: <span style="font-weight:100; font-size:13px; line-height:22px; color:#444444;">' . $loja . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Previsão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $previsao . '</span></div>
                            </div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:right;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $emissao . '</span></div>
                                <img src="' . $logoPdf . '" style="' . $medidasLogo . '"/>
                            </div>
                            <div id="linha3" style="margin-top:15px;" ></div>
                            <div id="linhatotal" style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:10px;">
                                <h1 style="display:inline-block; margin:0px; padding:0px; font-size:16px; font-weight:bold; vertical-align:middle">Obras</h1>
                            </div>
                            <div id="tabela" style="border:solid 2px ' . $corPdf . '; border-top:none; height:auto; padding:1px; padding-top:3px; padding-bottom:3px; width:100%; margin-bottom:10px;">';

    $html .= '<table style="width:100%;" cellspacing="0" cellpadding="0"> 
                <thead > 
                    <tr>
                        <th align="center" style="width:150px;"></th>
                        <th align="left"></th>
                    </tr>
                </thead>
                <tbody>';

    $sql = "SELECT o.imagem AS  imagemOriginal, IFNULL(CONCAT(tm.nomeTamanho,' (',REPLACE(tm.altura,'.0',''),'x',REPLACE(tm.largura,'.0',''),')'), 
            IFNULL(CONCAT(ti.nomeTamanho,' (',REPLACE(ti.altura,'.0',''),'x',REPLACE(ti.largura,'.0',''),')'),'- - -')) AS tamanho,
            IFNULL(ar.artista,'- - -') AS artista, o.idOrdemProducaoComp AS codigo, IFNULL(a.nomeAcabamento, '- - -') AS acabamento, e.idEtapa,
            IFNULL(CONCAT(e.etapa, ' - ', e.descricaoEtapa),'') AS etapa,  e.etapa AS etapanumero,
            t.produto AS tipo, IFNULL(b.nomeObra,'- - -') AS obra, o.altura, o.largura,
            o.certificado, o.numeroSerie AS selo, IFNULL(CONCAT('imagens/', t.pasta ,'/',o.imagem),'imagens/semarte.png') AS imagem, o.qtd,
            o.idObra, o.idArtista, o.idTamanho, o.idAcabamento, o.idGrupo, o.idMoldura, o.idProduto, o.obs, o.idTipoProduto, 
            IFNULL(IFNULL(tm.nomeTamanho, ti.nomeTamanho), '- - -') AS nomeTamanho, IFNULL(m.moldura, '') AS moldura, p.nomeProduto
            FROM ordem_producao_comp AS o
            LEFT JOIN etapas AS e ON e.idEtapa =  o.idOPEtapa
            LEFT JOIN tipos_produtos AS t ON t.idTipoProduto = o.idTipoProduto 
            LEFT JOIN produtos AS p ON p.idProduto=o.idProduto
            LEFT JOIN artistas_obras AS b ON b.idArtistaObra = o.idObra
            LEFT JOIN artistas AS ar ON ar.idArtista = b.idArtista
            LEFT JOIN acabamentos AS a ON a.idAcabamento = o.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = o.idTamanho
            LEFT JOIN tamanhos AS ti ON ti.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tm ON tm.idTamanho = o.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = o.idMoldura 
            WHERE o.del = 0 AND idOrdemProducao = " . $_POST['idOrdem'];

    $Tb = ConsultaSQL($sql, $ArqT);

    $QTDORDEM = 0;
    $qtdObras =mysqli_num_rows($Tb);
    while ($linha =mysqli_fetch_assoc($Tb)) {

        $QTDORDEM++;
        $html .= '<tr>
                        <td align="center" style="width:150px; border-bottom:1px solid ' . ($qtdObras == 1 ? 'white' : $corPdf) . ';">
                            <img src="http://www.photoarts.com.br/sistema/' . $linha['imagem'] . '" style="width:150px; height:auto; vertical-align:bottom;"/>
                        </td>
                        <td align="left" style="padding-left:5px; border-bottom:1px solid ' . ($qtdObras == 1 ? 'white' : $corPdf) . ';">
                            <b>Tipo: </b>' . $linha['tipo'] . '
                            <br>
                            <b>Artista: </b> ' . $linha['artista'] . '
                            <br>
                            <b>Obra: </b> ' . $linha['obra'] . '
                            <br>
                            <b>Tamanho: </b> ' . $linha['nomeTamanho'] . ' (' . FormatMoeda($linha['altura']) . 'x' . FormatMoeda($linha['largura']) . ')
                            <br>
                            <b>Acabamento: </b> ' . ($linha['acabamento'] == '' ? ' - - -' : $linha['acabamento']) . '
                            <br>
                            <b>Moldura: </b> ' . $linha['moldura'] . '
                            <br>';
        if($linha['qtd'] > 1){

            $html .= '<span style="font-size:14px; color:red;"><b>Qtde: </b>' . $linha['qtd'] . '</span>';
        }else{
            $html .= '<b>Qtde: </b>' . $linha['qtd'];
        }
                            //<b>Qtde: </b> ' . $linha['qtd'] . '
        $html .= '<br>
                <b>Etapa: </b> ' . $linha['etapa'] . '
                </td>';
                        /*<td></td>
                    </tr>';*/

        $html .= '<td style="width:150px; border-bottom:1px solid ' . ($qtdObras == 1 ? 'white' : $corPdf) . ';">';

        $sql = "SELECT ocs.opCompStatus, 
                IFNULL((SELECT 1 FROM ordem_producao_comp_status WHERE idOrdemProducaoComp = " . $linha['codigo'] . " AND idOpCompStatus = ocs.idOpCompStatus LIMIT 1), 0) AS ok
                FROM op_comp_status AS ocs ORDER BY ocs.ordem";

        $Tb2 = ConsultaSQL($sql, $ArqT);

        while($linha2 =mysqli_fetch_assoc($Tb2)){

            $html .= '<input type="checkbox" ' . ($linha2['ok'] == '1' ? 'checked=checked' : '') . '/>
                    <label>' . $linha2['opCompStatus'] . '</label>
                    <br>';
        }

        $html .= '</td></tr>';
    }

    $html .= '</tbody>
            </table></div>';

    $html .= '<div style="min-height:10px;"> </div>
                <div align="right">
                    <div style="border: solid 4px #FFF; text-align:center; width:30%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Qtde: <span>' . $QTDORDEM . '</span></div>
                </div>';

    if ($obs != '') {
        $html .= '<div style="border:solid 2px ' . $corPdf . '; height:auto; padding:5px; padding-top:3px; padding-bottom:3px;" >
                    Observações:<br><br>
                    ' . $obs . '
                </div>
                <br>';
    }

    $html .= '  <div style="min-height:10px;"> </div>
                <!--<div style="min-height:10px;"></div>-->
                <br>
                <span style="font-size:13px; font-weight:bold; line-height:22px;">Cotia, ' . $dataAtual . '</span>
                <!--<div style="min-height:50px;"></div>-->
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; display:inline-block; text-align:center; margin-top:45px;">' . $assinatura . '</div>   
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; float:right; display:inline-block; text-align:center; margin-top:-25px;">Gerência</div>   
                <!--<div style="min-height:10px;"> </div>-->
                <br>
                <div style="text-align:center; color:#888888; width:350px; margin-top:25px; margin-left:25%;">
                    <span>' . $rodape . '</span>
                    <br />
                    <b>' . $rodape2 . '</b>
                </div>
            </div>
            </body>
            </html>';

    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');
    $pdf->WriteHTML($html);
    $pdf->Output('../../ordem-de-producao/ordem-de-producao-' . $_POST['idOrdem'] . '.pdf', 'F');
    $filepath = '../ordem-de-producao/ordem-de-producao-' . $_POST['idOrdem'] . '.pdf';

    echo $filepath;
   mysqli_close($ArqT);
}