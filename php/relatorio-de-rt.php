<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarRT':
            MostrarRT();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;
    }
}

function MostrarRT() {

    $db = ConectaDB();

    $sql = "SELECT c.cliente, c.idCliente, LPAD(v.idVenda, 5, 0) AS numeroPedido, 
            v.dataContrato, v.idVenda, v.periodoDiasContrato, 
            v.numeroContrato, v.obsContrato, v.devolvido, v.comissaoContrato FROM vendas AS v 
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente AND c.arquiteto = 1
            WHERE v.del=0";

    if($_POST['de'] != "") {
        $sql .= " AND v.dataContrato >= '" . DataSSql($_POST['de']) . "' ";
    }

    if($_POST['ate'] != ''){
        $sql .= " AND v.dataContrato <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if($_POST['periodoDiasContrato'] != "") {
        $sql .= " AND v.periodoDiasContrato = " . $_POST['periodoDiasContrato'];
    }

    if($_POST['numeroContrato'] != "")  {
        $sql .= " AND v.numeroContrato = " . $_POST['numeroContrato'];
    }

    $sql .= " ORDER BY v.idVenda DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idVenda' => $linha['idVenda'], 
                'idCliente' => $linha['idCliente'], 
                'cliente' => $linha['cliente'], 
                'numeroPedido' => $linha['numeroPedido'], 
                'dataContrato' => FormatData($linha['dataContrato']), 
                'periodoDiasContrato' => $linha['periodoDiasContrato'], 
                'numeroContrato' => $linha['numeroContrato'], 
                'obsContrato' => $linha['obsContrato'], 
                'devolvido' => $linha['devolvido'], 
                'comissaoContrato' => FormatMoeda($linha['comissaoContrato'])
            );
        }

        echo json_encode($json);
    }
    $db->close();

}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT c.cliente, LPAD(v.idVenda, 5, 0) AS numeroPedido, v.dataContrato, v.idVenda, v.periodoDiasContrato, 
            v.numeroContrato, v.obsContrato, v.devolvido, v.comissaoContrato FROM vendas AS v 
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente AND c.arquiteto = 1
            WHERE v.del=0";

    if($_POST['de'] != "") {
        $sql .= " AND v.dataContrato >= '" . DataSSql($_POST['de']) . "' ";
    }

    if($_POST['ate'] != ''){
        $sql .= " AND v.dataContrato <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if($_POST['periodoDiasContrato'] != "") {
        $sql .= " AND v.periodoDiasContrato = " . $_POST['periodoDiasContrato'];
    }

    if($_POST['numeroContrato'] != "")  {
        $sql .= " AND v.numeroContrato = " . $_POST['numeroContrato'];
    }

    $sql .= " ORDER BY v.idVenda DESC";

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
    $newPath = '../relatorio-de-rt-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-rt-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N° PEDIDO', 'COLECIONADOR', 'TAXA COMISSÃO', 'Nº CONTRATO', 'DATA CONTRATO', 'PERÍODO DIAS CONTRATO', 'OBS CONTRATO', 'DEVOLVIDO');

    $excel->writeLine($arr);

    while ($linha = $db->fetch()) {

        $arr = array(
            $linha['numeroPedido'],
            $linha['cliente'],
            FormatMoeda($linha['comissaoContrato']),
            $linha['numeroContrato'],
            FormatData($linha['dataContrato']),
            $linha['periodoDiasContrato'],
            $linha['obsContrato'],
            ($linha['devolvido'] == "1" ? "SIM" : "NÃO")
        );

        $excel->writeLine($arr);
    }

    $excel->close();
    echo $newPathReturn;
    $db->close();
}