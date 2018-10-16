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

    $sql = "SELECT o.idOrcamento, LPAD(o.idOrcamento, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataCadastro, c.cliente,             
            o.valor, o.valorFrete,             
            o.valorTotal, os.descricaoStatus, l.loja, v.vendedor AS marchand, o.del, 
            DATEDIFF(DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY), CURDATE()) AS validade, 
            IFNULL(ve.idVenda, '') AS idVenda, IFNULL(fp.formaPagamento, '') AS formaPagamento
            FROM orcamentos AS o             
            INNER JOIN lojas AS l ON l.idLoja = o.idLoja             
            INNER JOIN clientes AS c ON c.idCliente = o.idCliente             
            LEFT JOIN orcamentos_status AS os ON os.idOrcamentoStatus = o.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = o.idVendedor 
            LEFT JOIN vendas AS ve ON o.idOrcamento = ve.idOrcamento    
            LEFT JOIN formaspagamentos AS fp ON o.idFormaPagamento=fp.idFormaPagamento
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
        $sql .= " AND o.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    $sql .= " GROUP BY o.idOrcamento "
            . "ORDER BY dataCadastro DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){
            $status = '';

            if ($linha['idVenda'] != '') {
                $status = 'GERADO VENDA ' . number_format_complete($linha['idVenda'], '0', 4);
                $idStatus=3;
            } else {
                if ($linha['del'] == '1') {
                    $status = 'CANCELADO';
                    $idStatus=4;
                } else {
                    if ($linha['validade'] < 0) {
                        $status = 'NÃO CONCRETIZADO (VENCIDO)';
                        $idStatus=2;
                    } else {
                        $status = 'EM ABERTO';
                        $idStatus=1;
                    }
                }
            }

            $json[] = array(
                'idOrcamento' => $linha['idOrcamento'],
                'numeroOrcamento' => $linha['numeroOrcamento'],
                'dataCadastro' => FormatData($linha['dataCadastro'], true),
                'cliente' => $linha['cliente'],
                'obras' => getObrasComposicao($db, $linha['idOrcamento'], 0),
                'valor' => FormatMoeda($linha['valor']),
                'valorFrete' => FormatMoeda($linha['valorFrete']),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'descricaoStatus' => $linha['descricaoStatus'] . ' ' . ($linha['descricaoStatus'] == 'GERADO PEDIDO' ? number_format_complete($linha['idVenda'], '0', 4) : ''),
                'loja' => $linha['loja'],
                'formaPagamento' => $linha['formaPagamento'],
                'marchand' => $linha['marchand']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT o.idOrcamento, LPAD(o.idOrcamento, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataCadastro, c.cliente,             
            o.valor, o.valorFrete,             
            o.valorTotal, os.descricaoStatus, cc.centrocusto AS loja, v.vendedor AS marchand, o.del, 
            DATEDIFF(DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY), CURDATE()) AS validade, 
            IFNULL(ve.idVenda, '') AS idVenda, fp.formaPagamento          
            FROM orcamentos AS o             
            INNER JOIN centro_custos AS cc ON cc.idCentroCusto = o.idCentroCusto             
            INNER JOIN clientes AS c ON c.idCliente = o.idCliente             
            LEFT JOIN orcamentos_status AS os ON os.idOrcamentoStatus = o.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = o.idVendedor 
            LEFT JOIN vendas AS ve ON o.idOrcamento = ve.idOrcamento    
            LEFT JOIN formaspagamentos AS fp ON o.idFormaPagamento=fp.idFormaPagamento
            WHERE TRUE ";

    if($_POST['de'] != ''){
        $sql .= " AND o.dataCadastro >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND o.dataCadastro <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND o.idCentroCusto = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND o.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    $sql .= " GROUP BY o.idOrcamento "
            . "ORDER BY dataCadastro DESC ";

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
    $newPath = '../relatorio-de-orcamentos-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-orcamentos-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N°', 'DATA CADASTRO', 'LOJA', 'COLECIONADOR', 'OBRAS', 'VALOR', 'FRETE', 'TOTAL', 'FORMA', 'MARCHAND', 'STATUS');

    $excel->writeLine($arr);

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        $status = '';

        if ($linha['idVenda'] != '') {
            $status = 'GERADO VENDA ' . number_format_complete($linha['idVenda'], '0', 4);
            $idStatus=3;
        } else {
            if ($linha['del'] == '1') {
                $status = 'CANCELADO';
                $idStatus=4;
            } else {
                if ($linha['validade'] < 0) {
                    $status = 'NÃO CONCRETIZADO (VENCIDO)';
                    $idStatus=2;
                } else {
                    $status = 'EM ABERTO';
                    $idStatus=1;
                }
            }
        }

        $totalValor = $totalValor + $linha['valor'];
        $totalFrete = $totalDesconto + $linha['valorFrete'];
        $totalValorTotal = $totalJuros + $linha['valorTotal'];

        $arr = array(
            $linha['numeroOrcamento'],
            FormatData($linha['dataCadastro'], true),
            $linha['loja'],
            $linha['cliente'],
            getObrasComposicao($db, $linha['idOrcamento'], 0),
            FormatMoeda($linha['valor']),
            FormatMoeda($linha['valorFrete']),
            FormatMoeda($linha['valorTotal']),
            $linha['formaPagamento'],
            $linha['marchand'],
            $linha['descricaoStatus'] . ' ' . ($linha['descricaoStatus'] == 'GERADO PEDIDO' ? number_format_complete($linha['idVenda'], '0', 4) : '')
        );

        $excel->writeLine($arr);
    }

    $arr = array('', '', '', '', 'TOTAL', FormatMoeda($totalValor), FormatMoeda($totalFrete), FormatMoeda($totalValorTotal), '', '', '');
    $excel->writeLine($arr);

    $excel->close();
    echo $newPathReturn;
    $db->close();
}