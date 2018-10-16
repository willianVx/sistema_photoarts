<?php

include('photoarts.php');
require_once '../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarPedidos':
            MostrarPedidos();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;

        case 'GerarPdf':
            GerarPdf();
            break;
    }
}

function MostrarPedidos(){

    $db = ConectaDB();
    
    $sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, ve.dataCadastro, 
            c.cliente, LEFT(ve.dataVenda, 16) AS dataVenda, ve.dataEntrega, vs.descricaoStatus, l.loja
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja       
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus
            WHERE ve.del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND ve.dataEntrega >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND ve.dataEntrega <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND ve.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND ve.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    if($_POST['idStatus'] > 0){
        $sql .= " AND ve.idUltimoStatus = " . $_POST['idStatus'] . " ";
    }
    
    $sql .= " GROUP BY ve.idVenda "
            . "ORDER BY dataCadastro DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){
            
            $json[] = array(
                'idPedido' => $linha['idVenda'],
                'numeroPedido' => $linha['numeroPedido'],
                'dataCadastro' => FormatData($linha['dataCadastro'], true),
                'dataVenda' => FormatData($linha['dataVenda'], false),
                'dataEntrega' => FormatData($linha['dataEntrega']),
                'cliente' => $linha['cliente'],
                'obras' => getObrasComposicao($db, $linha['idVenda'], 1),
                'descricaoStatus' => $linha['descricaoStatus'],
                'loja' => $linha['loja']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, ve.dataCadastro, 
            c.cliente, LEFT(ve.dataVenda, 16) AS dataVenda, ve.dataEntrega, vs.descricaoStatus, l.loja
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja       
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus
            WHERE ve.del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND ve.dataEntrega >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND ve.dataEntrega <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND ve.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND ve.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    if($_POST['idStatus'] > 0){
        $sql .= " AND ve.idUltimoStatus = " . $_POST['idStatus'] . " ";
    }
    
    $sql .= " GROUP BY ve.idVenda "
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
    $newPath = '../relatorio-de-encomendas-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-encomendas-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N°', 'DATA CADASTRO', 'DATA PEDIDO', 'DATA ENTREGA', 'COLECIONADOR', 'OBRAS', 'STATUS');

    $excel->writeLine($arr);

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        $arr = array(
            $linha['numeroPedido'],
            FormatData($linha['dataCadastro'], true),
            FormatData($linha['dataVenda'], true),
            FormatData($linha['dataEntrega']),
            $linha['cliente'],
            getObrasComposicao($ArqT, $linha['idVenda'], 1),
            $linha['descricaoStatus']
        );

        $excel->writeLine($arr);
    }

    $excel->close();
    echo $newPathReturn;
    $db->close();
}

function GerarPdf(){

    $db = ConectaDB();

    $sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, ve.dataCadastro, 
            c.cliente, LEFT(ve.dataVenda, 16) AS dataVenda, ve.dataEntrega, vs.descricaoStatus, l.loja
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja       
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus
            WHERE ve.del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND ve.dataEntrega >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND ve.dataEntrega <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND ve.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND ve.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    if($_POST['idStatus'] > 0){
        $sql .= " AND ve.idUltimoStatus = " . $_POST['idStatus'] . " ";
    }
    
    $sql .= " GROUP BY ve.idVenda "
            . "ORDER BY dataCadastro DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    $html = '<html>
                <head>
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
                            color:#fff;
                            background: #171616;
                        }
                        .tabela_cinza_foco td {
                            border: 1px solid #999;
                            font-size:11px;
                        }
                    </style>
                </head>
                <body>
                    <div class="divformulario" align="center">
                        <img src="../imagens/login.png" alt="Photoarts Gallery" align="absbottom" style="float:left; width:auto; height: 80px;"/>
                        <h1 style="text-align:center;">Relatório de Encomendas</h1>
                    </div>
                    <hr />        
                    <div id="corpo" style="margin-top:10px; margin-left:10px;">';

    $html .= '<table class="tabela_cinza_foco"> 
                <thead> 
                    <tr>
                        <th>N°</th>
                        <th>Data Cadastro</th>
                        <th>Data Pedido</th>
                        <th>Data Entrega</th>
                        <th>Colecionador</th>
                        <th>Obras</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>';

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        $html .= '<tr>
                    <td>' . $linha['numeroPedido'] . '</td>
                    <td align="center">' . FormatData($linha['dataCadastro'], true) . '</td>
                    <td align="center">' . FormatData($linha['dataVenda'], true) . '</td>
                    <td align="center">' . FormatData($linha['dataEntrega']) . '</td>
                    <td>' . $linha['cliente'] . '</td>
                    <td>' . getObrasComposicao($db, $linha['idVenda'], 1) . '</td>
                    <td align="center">' . $linha['descricaoStatus'] . '</td>
                </tr>';
    }

    $html .= '</tbody>
            </table>';

    $html .= '</div>
                </body>
            </html>';

    $options = new Options();
    $options->setDpi(110);

    // instantiate and use the dompdf class  
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml( $html );


    // (Optional) Setup the paper size and orientation (portrait or landscape)
    $dompdf->setPaper('A4', "landscape");

    // Render the HTML as PDF
    $dompdf->render();

    //Gera arquivo para saida PDF
    $output = $dompdf->output();
   
    $random = rand();
    
    file_put_contents( '../relatorio-de-encomendas.pdf', $output);
    $filepath = 'relatorio-de-encomendas.pdf';

    echo $filepath;
    $db->close();
}