<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Pesquisar':
            Pesquisar();
            break;

        case 'alterarEtapa':
            alterarEtapa();
            break;
    }
}

function alterarEtapa() {

    $db = ConectaDB();

    $sql = "UPDATE ordem_producao_comp SET idOPEtapa = " . $_POST['etapa'] . " 
            WHERE idOrdemProducaoComp = " . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {
                
        inicia_sessao();
        $sql = "INSERT INTO ordem_producao_etapas SET dataCadastro = NOW(),
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                    idEtapa = " . $_POST['etapa'] . ", nomeEtapa =  '" .$db->escapesql($_POST['nomeEtapa']) . "',
                    idOrdemProducaoComp = " . $_POST['codigo'];
        $db->query( $sql );
        echo '-1';
    } else {
        echo '0';
    }

    $db->close();
}

function Pesquisar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT op.idLoja, v.dataEntrega, LPAD(op.idOrdemProducao,5,0) AS codigo, op.dataOrdemProducao AS 'data', op.dataPrevista, op.obs, op.finalizada, op.cancelada,
            o.imagem AS  imagemOriginal, IFNULL(CONCAT(tm.nomeTamanho,' (',REPLACE(tm.altura,'.0',''),'x',REPLACE(tm.largura,'.0',''),')'), 
            IFNULL(CONCAT(ti.nomeTamanho,' (',REPLACE(ti.altura,'.0',''),'x',REPLACE(ti.largura,'.0',''),')'),'- - -')) AS tamanho,
            IFNULL(ar.artista,'- - -') AS artista, o.idOrdemProducaoComp AS codigoComp,IFNULL( a.nomeAcabamento,'- - -') AS acabamento, e.idEtapa,
            IFNULL(CONCAT(e.etapa, ' - ', e.descricaoEtapa),'') AS etapa,  e.etapa AS etapanumero,
            t.produto AS tipo, IFNULL(b.nomeObra,'- - -') AS obra, o.altura, o.largura,
            o.numeroSerie AS selo, IFNULL(CONCAT('imagens/', t.pasta ,'/',o.imagem),'imagens/semarte.png') AS imagem, o.qtd,
            o.obs AS obsComp, IFNULL(IFNULL(tm.nomeTamanho, ti.nomeTamanho), '- - -') AS nomeTamanho, op.refeita, op.idVenda
            FROM ordem_producao_comp AS o
            INNER JOIN ordem_producao AS op ON op.idOrdemProducao = o.idOrdemProducao
            LEFT JOIN vendas AS v ON v.idVenda  = op.idVenda AND v.del = 0
            LEFT JOIN etapas AS e ON e.idEtapa =  o.idOPEtapa
            LEFT JOIN tipos_produtos AS t ON t.idTipoProduto = o.idTipoProduto
            LEFT JOIN artistas_obras AS b ON b.idArtistaObra = o.idObra
            LEFT JOIN artistas AS ar ON ar.idArtista = b.idArtista
            LEFT JOIN acabamentos AS a ON a.idAcabamento = o.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = o.idTamanho
            LEFT JOIN tamanhos AS ti ON ti.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tm ON tm.idTamanho = o.idTamanho
            WHERE o.del = 0 ";

    if ($_POST['dias'] !== '-1') {
        $sql .= " AND op.dataPrevista >= CURDATE() AND op.dataPrevista <= DATE_ADD(CURDATE(), INTERVAL " . $_POST['dias'] . " DAY) ";
    }

    if ($_POST['codigo'] > '0') {
        $sql .= " AND op.idOrdemProducao = " . $_POST['codigo'] . " ";
    }
    
    if ($_POST['pedido'] > '0') {
        $sql .= " AND op.idVenda = " . $_POST['pedido'] . " ";
    }

    if ($_POST['loja'] > '0') {
        $sql .= " AND op.idLoja = " . $_POST['loja'] . " ";
    }

    if ($_POST['etapa'] > '0') {
        $sql .= " AND op.idOrdemProducao IN 
                 (SELECT cc.idOrdemProducao FROM ordem_producao_comp AS cc 
                  INNER JOIN ordem_producao AS i ON i.idOrdemProducao = cc.idOrdemProducao
                  WHERE cc.idOPEtapa = " . $_POST['etapa'];
        if ($_POST['dias'] !== '-1') {
            $sql .= " AND i.dataPrevista >= CURDATE() AND i.dataPrevista <= DATE_ADD(CURDATE(), INTERVAL " . $_POST['dias'] . " DAY) ";
        }
        if ($_POST['loja'] > '0') {
            $sql .= " AND i.idLoja = " . $_POST['loja'] . " ";
        }
        $sql .= " ) ";
    }
    
    if ($_POST['statusBusca'] == '2') {
        $sql .= " AND op.finalizada = 1 ";
    } else if ($_POST['statusBusca'] == '3') {
        $sql .= " AND op.cancelada = 1 ";
    } else if ($_POST['statusBusca'] == '1') {
        $sql .= " AND op.cancelada = 0 AND  op.finalizada = 0 ";
    }

    if($_POST['refeitas'] == 'true'){
        $sql .= " AND op.refeita = 1";
    }

    $sql .= " ORDER BY codigo ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{

        while ($linha = $db->fetch()) {
            $json[] = array(
                'codigo' => $linha['codigo'],
                'codigoComp' => $linha['codigoComp'],
                'idLoja' => $linha['idLoja'],
                'idVenda' => number_format_complete($linha['idVenda'], '0', 5),
                'finalizada' => $linha['finalizada'],
                'cancelada' => $linha['cancelada'],
                'dataEntrega' => FormatData($linha['dataEntrega'], false),
                'data' => FormatData($linha['data'], false),
                'previsao' => FormatData($linha['dataPrevista'], false),
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
                'imagem' => ($linha['imagemOriginal'] == '' ? 'imagens/semarte.png' : $linha['imagem']),
                'qtd' => $linha['qtd'],
                'obs' => $linha['obs'],
                'obsComp' => $linha['obsComp'],
                'nomeTamanho' => $linha['nomeTamanho'],
                'refeita' => $linha['refeita']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

?>