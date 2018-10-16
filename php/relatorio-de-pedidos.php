<?php

include('photoarts.php');
//require_once '../padrao/pdf/mpdf.php';
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
        
        case 'getP':
            getP();
            break;

        case 'MudaStatusPedido':
            MudaStatusPedido();
            break;
            
    }
}

function MostrarPedidos(){

    $db = ConectaDB();

    /*$sql = "SELECT o.idOrcamento, LPAD(o.idOrcamento, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataCadastro, c.cliente,             
            getObrasOrcamentos(o.idOrcamento, 0) AS obras, o.valor, o.valorFrete,             
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
            WHERE TRUE ";*/
    
    $sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, ve.dataCadastro, IFNULL(vp.idFormaPagamento,'')AS idFormaPagamento,
            c.cliente, LEFT(ve.dataVenda, 16) AS dataVenda, 
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = ve.idVenda AND del = 0) AS qtdePagamentos, 
            ve.valor, ve.valorFrete, ve.valorTotal, vs.idVStatus,  vs.descricaoStatus, l.loja, 
            v.vendedor AS marchand 
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja       
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = ve.idVendedor 
            LEFT JOIN vendas_parcelas AS vp ON vp.idVenda = ve.idVenda            
            WHERE ve.del = 0";

    
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND ve.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND ve.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    if($_POST['idStatus'] > 0){
        $sql .= " AND ve.idUltimoStatus = " . $_POST['idStatus'] . " ";
    }else{
        $sql .= " AND ve.idUltimoStatus <> 7";
    }


    if($_POST['idFormaPagamento'] > 0){
        $sql .= " AND vp.idFormaPagamento = " . $_POST['idFormaPagamento'] . " ";
    }

    if($_POST['dtCadastro']  === '1'){
        
        if($_POST['de'] != ''){
            $sql .= " AND ve.dataVenda >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
                $sql .= " AND ve.dataVenda <= '" . DataSSql($_POST['ate']) . "' ";
        }

    }else{

        if($_POST['de'] != ''){
            $sql .= " AND ve.dataEntrega >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
                $sql .= " AND ve.dataEntrega <= '" . DataSSql($_POST['ate']) . "' ";
        }

    }

    $sql .= " GROUP BY ve.idVenda "
            . "ORDER BY dataCadastro DESC ";
    
    $db->query( $sql );
    
    SaveP();
    
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
                'cliente' => $linha['cliente'],
                'valor' => FormatMoeda($linha['valor']),
                'valorFrete' => FormatMoeda($linha['valorFrete']),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'descricaoStatus' => $linha['descricaoStatus'],
                'loja' => $linha['loja'],
                'idStatus' => $linha['idVStatus'],
                'marchand' => $linha['marchand'],
                'obras' => getObrasComposicao($db, $linha['idVenda'], 1),
                'formaPagamento' => getPagamentoVenda($db, $linha['idVenda']) //($linha['qtdePagamentos']==1 ? 'Em 1x' : 'Em ' . $linha['qtdePagamentos'] . "x")
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    /*$sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, LEFT(ve.dataCadastro, 16) AS dataCadastro, 
            c.cliente, 
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = ve.idVenda AND del = 0) AS qtdePagamentos, 
            ve.valor, ve.valorFrete, ve.valorTotal, vs.descricaoStatus, l.loja, 
            v.vendedor AS marchand            
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja 
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = ve.idVendedor             
            WHERE TRUE ";

    if($_POST['de'] != ''){
        $sql .= " AND ve.dataCadastro >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND ve.dataCadastro <= '" . DataSSql($_POST['ate']) . "' ";
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
    
    
    if($_POST['idFormaPagamento'] > 0){
        $sql .= " AND vp.idFormaPagamento = " . $_POST['idFormaPagamento'] . " ";
    }

    if($_POST['dtCadastro']  === '1'){
        
        if($_POST['de'] != ''){
            $sql .= " AND ve.dataVenda >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
                $sql .= " AND ve.dataVenda <= '" . DataSSql($_POST['ate']) . "' ";
        }

    }else{

        if($_POST['de'] != ''){
            $sql .= " AND ve.dataEntrega >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
                $sql .= " AND ve.dataEntrega <= '" . DataSSql($_POST['ate']) . "' ";
        }

    }
    

    $sql .= " GROUP BY ve.idVenda "
            . "ORDER BY dataCadastro DESC ";

    $Tb = ConsultaSQL($sql, $ArqT);*/
	
	$sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, ve.dataCadastro, IFNULL(vp.idFormaPagamento,'')AS idFormaPagamento,
            c.cliente, LEFT(ve.dataVenda, 16) AS dataVenda, 
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = ve.idVenda AND del = 0) AS qtdePagamentos, 
            ve.valor, ve.valorFrete, ve.valorTotal, vs.idVStatus,  vs.descricaoStatus, l.loja, 
            v.vendedor AS marchand 
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja       
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = ve.idVendedor 
            LEFT JOIN vendas_parcelas AS vp ON vp.idVenda = ve.idVenda            
            WHERE ve.del = 0";    
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND ve.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND ve.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    if($_POST['idStatus'] > 0){
        $sql .= " AND ve.idUltimoStatus = " . $_POST['idStatus'] . " ";
    }else{
        $sql .= " AND ve.idUltimoStatus <> 7";
    }


    if($_POST['idFormaPagamento'] > 0){
        $sql .= " AND vp.idFormaPagamento = " . $_POST['idFormaPagamento'] . " ";
    }

    if($_POST['dtCadastro']  === '1'){
        
        if($_POST['de'] != ''){
            $sql .= " AND ve.dataVenda >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
                $sql .= " AND ve.dataVenda <= '" . DataSSql($_POST['ate']) . "' ";
        }

    }else{

        if($_POST['de'] != ''){
            $sql .= " AND ve.dataEntrega >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
                $sql .= " AND ve.dataEntrega <= '" . DataSSql($_POST['ate']) . "' ";
        }

    }

    $sql .= " GROUP BY ve.idVenda "
            . "ORDER BY dataCadastro DESC ";
    
    //Erros($sql);
    
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
    $newPath = '../relatorio-de-pedidos-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-pedidos-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel->error == false)
        echo $excel->error;

    $arr = array('N°', 'DATA CADASTRO', 'LOJA', 'COLECIONADOR', 'OBRAS', 'VALOR', 'FRETE', 'TOTAL', 'PAGAMENTO', 'MARCHAND', 'STATUS');

    $excel->writeLine($arr);

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        $totalValor = $totalValor + $linha['valor'];
        $totalFrete = $totalFrete + $linha['valorFrete'];
        $totalValorTotal = $totalValorTotal + $linha['valorTotal'];

        $arr = array(
            $linha['numeroPedido'],
            FormatData($linha['dataCadastro'], true),
            $linha['loja'],
            $linha['cliente'],
            getObrasComposicao($db, $linha['idVenda'], 1),
            FormatMoeda($linha['valor']),
            FormatMoeda($linha['valorFrete']),
            FormatMoeda($linha['valorTotal']),
            getPagamentoVenda($db, $linha['idVenda']),
            $linha['marchand'],
            $linha['descricaoStatus']
        );

        $excel->writeLine($arr);
    }

    $arr = array('', '', '', '', 'TOTAL', FormatMoeda($totalValor), FormatMoeda($totalFrete), FormatMoeda($totalValorTotal), '', '', '');
    $excel->writeLine($arr);

    $excel->close();
    echo $newPathReturn;
    $db->close();
}

function GerarPdf(){

    $db = ConectaDB();

    $sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, LEFT(ve.dataCadastro, 16) AS dataCadastro, 
            c.cliente, 
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = ve.idVenda AND del = 0) AS qtdePagamentos, 
            ve.valor, ve.valorFrete, ve.valorTotal, vs.descricaoStatus, l.loja, 
            v.vendedor AS marchand            
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja       
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = ve.idVendedor             
            WHERE ve.del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND ve.dataVenda >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND ve.dataVenda <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    if($_POST['idGaleria'] > 0){
        $sql .= " AND ve.idLoja = " . $_POST['idGaleria'] . " ";
    }
    
    if($_POST['idMarchand'] > 0){
        $sql .= " AND ve.idVendedor = " . $_POST['idMarchand'] . " ";
    }
    
    if($_POST['idStatus'] > 0){
        $sql .= " AND ve.idUltimoStatus = " . $_POST['idStatus'] . " ";
    }else{
        $sql .= " AND ve.idUltimoStatus <> 7";
    }
    
    $sql .= " GROUP BY ve.idVenda "
            . "ORDER BY dataCadastro DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '';
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
                            text-align:top;
                        }
                        .tabela_cinza_foco th {
                            border:none;
                            font-size:12px;
                            padding-left:0px;
                            padding-top:0px;
                            color:#fff;
                            background: #171616;

                        }
                        .tabela_cinza_foco td {
                            border: 1px solid #999;
                            padding-left:0px;
                            padding-top:0px;
                            font-size:11px;


                        }
                    </style>
                </head>
                <body>
                    <div class="divformulario" align="center">
                        <img src="../imagens/login.png" alt="Photoarts Gallery" align="absbottom" style="float:left; width:auto; height: 80px;"/>
                        <h1 style="text-align:center;">Relatório de Pedidos</h1>
                    </div>
                    <hr />        
                    <div id="corpo" style="margin-top:10px; margin-left:10px;">';

    $html .= '<table class="tabela_cinza_foco"> 
                <thead> 
                    <tr>
                        <th>N°</th>
                        <th>Data Cadastro</th>
                        <th>Loja</th>
                        <th>Colecionador</th>
                        <th>Obras</th>
                        <th>Valor</th>
                        <th>Frete</th>
                        <th>Total</th>
                        <th>Pagamento</th>
                        <th>Marchand</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>';

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        $totalValor = $totalValor + $linha['valor'];
        $totalFrete = $totalFrete + $linha['valorFrete'];
        $totalValorTotal = $totalValorTotal + $linha['valorTotal'];

        $html .= '<tr>
                    <td>' . $linha['numeroPedido'] . '</td>
                    <td align="center">' . FormatData($linha['dataCadastro'], true) . '</td>
                    <td>' . $linha['loja'] . '</td>
                    <td>' . $linha['cliente'] . '</td>
                    <td>' . getObrasComposicao($db, $linha['idVenda'], 1) . '</td>
                    <td align="right">' . FormatMoeda($linha['valor']) . '</td>
                    <td align="right">' . FormatMoeda($linha['valorFrete']) . '</td>
                    <td align="right">' . FormatMoeda($linha['valorTotal']) . '</td>
                    <td align="left">' . getPagamentoVenda($db, $linha['idVenda']) . '</td>
                    <td align="left">' . $linha['marchand'] . '</td>
                    <td align="center">' . $linha['descricaoStatus'] . '</td>
                </tr>';
    }

    $html .= '<tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-size:14px; font-weight:bold;">TOTAL</td>
                <td align="right" style="font-size:14px; font-weight:bold;">' . FormatMoeda($totalValor) . '</td>
                <td align="right" style="font-size:14px; font-weight:bold;">' . FormatMoeda($totalFrete) . '</td>
                <td align="right" style="font-size:14px; font-weight:bold;">' . FormatMoeda($totalValorTotal) . '</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>';

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
    
    file_put_contents( '../relatorio-de-pedidos.pdf', $output);
    $filepath = 'relatorio-de-pedidos.pdf?PID=' . rand();

    echo $filepath;
    $db->close();
}

function getP() {
    inicia_sessao();
    echo $_SESSION['p'];
}

function saveP() {
    inicia_sessao();
    
    $x = Array(
        'de' => $_POST['de'],
        'ate' => $_POST['ate'],
        'idGaleria' => $_POST['idGaleria'],
        'idMarchand' => $_POST['idMarchand'],
        'idStatus' => $_POST['idStatus']
    );

    $_SESSION['p'] = json_encode($x);
   
}

function MudaStatusPedido (){
    $db = ConectaDB();
    $sql = "UPDATE vendas SET idUltimoStatus = " . $_POST['status'] . " 
        WHERE idVenda = " . $_POST['idPedido'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {
       GravarStatusPedido($ArqT, $_POST['idPedido'], $_POST['status'], $_POST['statusDesc']);
        echo '1';
    } else {
        echo '0';
    }
    $db->close();
}

function GravarStatusPedido($ArqT, $idPedido, $idVStatus, $descricaoStatus) {
    inicio_sessao();
    
    $sql = "INSERT INTO vendas_status SET 
            dataCadastro = NOW(), 
            idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
            idVenda = " . $idPedido . ", 
            idVStatus = " . $idVStatus . ", 
            descricaoStatus = '" . $descricaoStatus . "'";
    $ArqT->query( $sql );
}