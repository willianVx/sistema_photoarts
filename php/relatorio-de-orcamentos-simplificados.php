<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarOrcamentos':
            MostrarOrcamentos();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;
    }
}

function MostrarOrcamentos(){

    $db = ConectaDB();

    $sql = "SELECT o.idOrcamentoSimplificado, LPAD(o.idOrcamentoSimplificado, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataCadastro, c.cliente, l.loja, v.vendedor AS marchand, o.del, 
            o.dataValidade, IFNULL(ve.idVenda, 0) AS idVenda, o.idArtista, 
            (SELECT SUM(valor) FROM orcamentos_simplificados_comp WHERE idOrcamentoSimplificado = o.idOrcamentoSimplificado AND selecionado = 1 AND del = 0) AS valorTotal, 
            DATEDIFF(DATE_ADD(o.dataCadastro, INTERVAL 30 DAY), CURDATE()) AS validade 
            FROM orcamentos_simplificados AS o
            INNER JOIN lojas AS l ON l.idLoja = o.idLoja             
            INNER JOIN clientes AS c ON c.idCliente = o.idColecionador 
            INNER JOIN vendedores AS v ON v.idVendedor = o.idMarchand 
            LEFT JOIN vendas AS ve ON o.idOrcamentoSimplificado = ve.idOrcamentoSimplificado
            WHERE o.del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND o.dataCadastro >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND o.dataCadastro <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND o.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND o.idMarchand = " . $_POST['idMarchand'] . " ";
    }

    if($_POST['idArtista'] > 0){
        $sql .= " AND o.idArtista = " . $_POST['idArtista'] . " ";
    }

    $sql .= " AND o.idTipoProduto = " . $_POST['idTipoProduto'] . " ";
    
    $sql .= " GROUP BY o.idOrcamentoSimplificado ORDER BY o.dataCadastro DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $status = '';

            if ($linha['idVenda'] != '0') {
                $status = 'GERADO VENDA ' . number_format_complete($linha['idVenda'], '0', 4);                
            } else {
                if ($linha['del'] == '1') {
                    $status = 'CANCELADO';                    
                } else {
                    if ($linha['validade'] < 0) {
                        $status = 'NÃO CONCRETIZADO (VENCIDO)';                        
                    } else {
                        $status = 'EM ABERTO';
                    }
                }
            }

            $json[] = array(
                'idOrcamentoSimplificado' => $linha['idOrcamentoSimplificado'],
                'numeroOrcamento' => $linha['numeroOrcamento'],
                'dataCadastro' => FormatData($linha['dataCadastro'], true),
                'dataValidade' => FormatData($linha['dataValidade']),
                'cliente' => $linha['cliente'],
                'obras' => getObras($db, $linha['idOrcamentoSimplificado'], $linha['idArtista']),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'descricaoStatus' => $status,
                'loja' => $linha['loja'],
                'marchand' => $linha['marchand']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function getObras($ArqT, $idOrcamentoSimplificado, $idArtista) {

    $sql = "SELECT IFNULL(GROUP_CONCAT(CONCAT(" . ($idArtista == '0' ? "'InstaArts'" : "ao.nomeObra") . ", ' - ', t.nomeTamanho, ' (', formatInteiro(osc.altura), 'x', formatInteiro(osc.largura), ')') SEPARATOR '<br>'), 'Nenhuma obra selecionada') AS obras 
            FROM orcamentos_simplificados_comp AS osc 
            " . ($idArtista == '0' ? 'LEFT' : 'INNER') . " JOIN artistas_obras AS ao ON ao.idArtistaObra = osc.idObra";

    if($idArtista == '0'){

        $sql .= " INNER JOIN tamanhos AS t ON t.idTamanho = osc.idTamanho";
    }else{
        $sql .= " INNER JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = osc.idTamanho
                INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho";
    }

    $sql .= " WHERE osc.idOrcamentoSimplificado = " . $idOrcamentoSimplificado . " 
            AND osc.selecionado = 1 AND osc.del = 0";

    $ArqT->query( $sql );
    $result = $ArqT->fetch();
    if ( $db->n_rows <= 0) {
        return 'Problemas ao carregar a(s) obra(s)/produto(s)';
    } else {
        return $result["obras"];
    }
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT o.idOrcamentoSimplificado, LPAD(o.idOrcamentoSimplificado, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataCadastro, c.cliente, l.loja, v.vendedor AS marchand, o.del, 
            o.dataValidade, IFNULL(ve.idVenda, 0) AS idVenda, o.idArtista, 
            (SELECT SUM(valor) FROM orcamentos_simplificados_comp WHERE idOrcamentoSimplificado = o.idOrcamentoSimplificado AND selecionado = 1 AND del = 0) AS valorTotal, 
            DATEDIFF(DATE_ADD(o.dataCadastro, INTERVAL 30 DAY), CURDATE()) AS validade 
            FROM orcamentos_simplificados AS o
            INNER JOIN lojas AS l ON l.idLoja = o.idLoja             
            INNER JOIN clientes AS c ON c.idCliente = o.idColecionador 
            INNER JOIN vendedores AS v ON v.idVendedor = o.idMarchand 
            LEFT JOIN vendas AS ve ON o.idOrcamentoSimplificado = ve.idOrcamentoSimplificado
            WHERE o.del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND o.dataCadastro >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND o.dataCadastro <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND o.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND o.idMarchand = " . $_POST['idMarchand'] . " ";
    }

    if($_POST['idArtista'] > 0){
        $sql .= " AND o.idArtista = " . $_POST['idArtista'] . " ";
    }

    $sql .= " AND o.idTipoProduto = " . $_POST['idTipoProduto'] . " ";
    
    $sql .= " GROUP BY o.idOrcamentoSimplificado ORDER BY o.dataCadastro DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    session_start();
    $_SESSION['sql_rel'] = $sql;
    //saveP();

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-orcamentos-simplificados-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-orcamentos-simplificados-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N°', 'DATA CADASTRO', 'DATA VALIDADE', 'LOJA', 'COLECIONADOR', 'OBRAS', 'TOTAL', 'MARCHAND', 'STATUS');

    $excel->writeLine($arr);

    while ($linha = $db->fetch()) {

        $status = '';

        if ($linha['idVenda'] != '0') {
            $status = 'GERADO VENDA ' . number_format_complete($linha['idVenda'], '0', 4);                
        } else {
            if ($linha['del'] == '1') {
                $status = 'CANCELADO';                    
            } else {
                if ($linha['validade'] < 0) {
                    $status = 'NÃO CONCRETIZADO (VENCIDO)';                        
                } else {
                    $status = 'EM ABERTO';
                }
            }
        }

        $totalValor = $totalValor + $linha['valorTotal'];

        $arr = array(
            $linha['numeroOrcamento'],
            FormatData($linha['dataCadastro'], true),
            FormatData($linha['dataValidade']),
            $linha['loja'],
            $linha['cliente'],
            getObras($db, $linha['idOrcamentoSimplificado'], $linha['idArtista']),
            FormatMoeda($linha['valorTotal']),
            $linha['marchand'],
            $status
        );

        $excel->writeLine($arr);
    }

    $arr = array('', '', '', '', '', 'TOTAL', FormatMoeda($totalValor), '', '', '');
    $excel->writeLine($arr);

    $excel->close();
    echo $newPathReturn;
    $db->close();
}