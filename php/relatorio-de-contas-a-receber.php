<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Pesquisar':
            Pesquisar();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;
    }
}

function Pesquisar() {
    $db = ConectaDB();

    $sql = "SELECT  ve.vendedor, v.dataVenda AS dataPedido, LPAD(vp.idVenda,6,0) AS id, vp.idvendaParcela AS codigo, 
            v.idVenda, vp.dataCadastro AS 'data', vp.parcela, vp.valorComp, vp.dataComp,
            vp.valor, vp.dataCompensacao, IFNULL(f.formaPagamento,'') AS forma, vp.numero, vp.recibo,
            c.cliente, l.loja, f.taxa as taxa,
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0) AS parcelas, 
            vp.idVendaParcelaAntecipacao,
            IFNULL(vpa.dataAntecipacao, '0000-00-00') AS dataAntecipacao, 
            IFNULL(vpa.valorAntecipacao, 0.00) AS valorAntecipacao
            FROM vendas_parcelas AS vp
            INNER JOIN vendas AS v ON v.idVenda = vp.idVenda
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            LEFT JOIN formaspagamentos AS f ON f.idFormaPagamento = vp.idFormaPagamento
            LEFT JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor
            LEFT JOIN vendas_parcelas_antecipacoes AS vpa ON vpa.idVendaParcelaAntecipacao = vp.idVendaParcelaAntecipacao
            WHERE vp.del = 0 ";
    if ($_POST['de'] != '') {
        $sql .= " AND vp.dataCompensacao >= '" . DataSSql($_POST['de']) . "' ";
    }

    if ($_POST['ate'] != '') {
        $sql .= " AND vp.dataCompensacao <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['idLoja'] > 0) {
        $sql .= " AND l.idLoja = " . $_POST['idLoja'] . " ";
    }

    if ($_POST['idVendedor'] > 0) {
        $sql .= " AND v.idVendedor = " . $_POST['idVendedor'] . " ";
    }

    if($_POST['situacao'] == '0'){
        $sql .= " AND vp.idVendaParcelaAntecipacao <= 0";
    }else if($_POST['situacao'] == '1'){
        $sql .= " AND vp.idVendaParcelaAntecipacao > 0";
    }

    $sql .= " ORDER BY vp.dataCompensacao, vp.idVenda, vp.parcela ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            if($linha['idVendaParcelaAntecipacao'] <= 0){
                $situacao = 'Em aberto';
            }else{
                $situacao = 'Antecipada em ' . FormatData($linha['dataAntecipacao']);
            }
            
            $vrComp = ( $linha['valor'] * ( 1 - ( $linha['taxa'] / 100 )) );
            
            $json[] = array(
                'id' => $linha['id'],
                'codigo' => $linha['codigo'],
                'idVenda' => $linha['idVenda'],
                'data' => FormatData($linha['dataPedido'], false),
                'compensacao' => FormatData($linha['dataCompensacao'], false),
                'parcela' => $linha['parcela'],
                'forma' => $linha['forma'],
                'numero' => $linha['numero'],
                'recibo' => $linha['recibo'],
                'cliente' => $linha['cliente'],
                'loja' => $linha['loja'],
                'vendedor' => $linha['vendedor'],
                'valor' => FormatMoeda($linha['valor']),
                'parcelas' => $linha['parcelas'],
                'situacao' => $situacao,
                'valorAntecipacao' => FormatMoeda($linha['valorAntecipacao']),
                'valorComp' => FormatMoeda( $vrComp )
            );
        }

        echo json_encode($json);
    }

    $db = ConectaDB();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT  ve.vendedor, v.dataVenda AS dataPedido, LPAD(vp.idVenda,6,0) AS id, vp.idvendaParcela AS codigo, 
            v.idVenda, vp.dataCadastro AS 'data', vp.parcela, vp.valorComp, vp.dataComp,
            vp.valor, vp.dataCompensacao, IFNULL(f.formaPagamento,'') AS forma, vp.numero, vp.recibo,
            c.cliente, l.loja,
            (SELECT COUNT(*) FROM vendas_comp WHERE idVenda = v.idVenda AND del = 0) AS parcelas, 
            vp.idVendaParcelaAntecipacao,
            IFNULL(vpa.dataAntecipacao, '0000-00-00') AS dataAntecipacao, 
            IFNULL(vpa.valorAntecipacao, 0.00) AS valorAntecipacao
            FROM vendas_parcelas AS vp
            INNER JOIN vendas AS v ON v.idVenda = vp.idVenda
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            LEFT JOIN formaspagamentos AS f ON f.idFormaPagamento = vp.idFormaPagamento
            LEFT JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor
            LEFT JOIN vendas_parcelas_antecipacoes AS vpa ON vpa.idVendaParcelaAntecipacao = vp.idVendaParcelaAntecipacao
            WHERE vp.del = 0 ";

    if ($_POST['de'] != '') {
        $sql .= " AND vp.dataCompensacao >= '" . DataSSql($_POST['de']) . "' ";
    }

    if ($_POST['ate'] != '') {
        $sql .= " AND vp.dataCompensacao <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['idLoja'] > 0) {
        $sql .= " AND l.idLoja = " . $_POST['idLoja'] . " ";
    }

    if ($_POST['idVendedor'] > 0) {
        $sql .= " AND v.idVendedor = " . $_POST['idVendedor'] . " ";
    }

    if($_POST['situacao'] == '0'){
        $sql .= " AND vp.idVendaParcelaAntecipacao <= 0";
    }else if($_POST['situacao'] == '1'){
        $sql .= " AND vp.idVendaParcelaAntecipacao > 0";
    }

    $sql .= " ORDER BY vp.dataCompensacao, vp.idVenda, vp.parcela ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    inicia_sessao();
    $_SESSION['sql_rel'] = $sql;
    //saveP();

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-contas-a-receber-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-contas-a-receber-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N° VENDA', 'DATA PEDIDO', 'LOJA', 'COLECIONADOR', 'MARCHAND', 'PARCELA', 'VALOR', 'DT. COMPENSAÇÃO', 'VALOR COMP', 'FORMA DE PAG.', 'Nº RECIBO', 'SITUAÇÃO');

    $excel->writeLine($arr);

    $totalValor = 0;

    while ($linha = $db->fetch()) {

        $totalValor = $totalValor + $linha['valor'];
        $PARCELA = $linha['parcela'] . "/" . $linha['parcelas'];
        $valorTotalAntecipacao = $valorTotalAntecipacao + $linha['valorAntecipacao'];

        if($linha['idVendaParcelaAntecipacao'] <= 0){
            $situacao = 'Em aberto';
        }else{
            $situacao = 'Antecipada em ' . FormatData($linha['dataAntecipacao']);
        }

        $arr = array(
            $linha['id'],
            FormatData($linha['dataPedido'], true),
            $linha['loja'],
            $linha['cliente'],
            $linha['vendedor'],
            $PARCELA,
            FormatMoeda($linha['valor']),
            FormatData($linha['dataCompensacao'], false),
            FormatMoeda($linha['valorComp']),
            $linha['forma'],
            $linha['recibo'],
            $situacao
        );

        $excel->writeLine($arr);
    }

    $arr = array('', '', '', '', '', '', '', '', '', 'TOTAL', FormatMoeda($totalValor));
    $excel->writeLine($arr);

    if($_POST['situacao'] != '0'){
        $arr = array('', '', '', '', '', '', '', '', '', 'TOTAL ANTECIPAÇÃO', FormatMoeda($valorTotalAntecipacao));
        $excel->writeLine($arr);        
    }

    $excel->close();

    echo $newPathReturn;
    $db->close();
}
