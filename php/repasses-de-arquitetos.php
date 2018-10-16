<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Pesquisar':
            Pesquisar();
            break;

        case 'FecharRepasses':
            FecharRepasses();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;

        case 'getPagamentosPedidos':
            getPagamentosPedidos();
            break;
    }
}

function Pesquisar(){

    $db = ConectaDB();

    $sql = "SELECT l.loja, v.idVenda, vc.idVendaComp, vp.idVendaParcela, LPAD(v.idVenda, 5, '0') AS numeroPedido, v.dataVenda, 
            cli.cliente, v.valorTotal, 
            CONCAT(vp.parcela, ' de ', (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)) AS parcelas, 
            TRUNCATE(((v.valorTotal * cli.arquitetoComissao) / 100), 2) AS comissao, 
            TRUNCATE((((v.valorTotal * cli.arquitetoComissao) / 100) / (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)), 2) AS comissaoParcela, 
            IFNULL(vr.idArquitetoRepasse, 0) AS situacao, IFNULL(vr.idConpag,0) AS idConpag
            FROM vendas_parcelas AS vp
            INNER JOIN vendas AS v USING(idVenda)
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            INNER JOIN vendas_comp AS vc ON vc.idVenda = v.idVenda
            INNER JOIN clientes AS cli ON cli.idCliente = v.idCliente AND cli.ativo = 1 AND cli.del = 0 AND cli.arquiteto=1
            LEFT JOIN arquitetos_repasses AS vr ON vr.idVendaParcela=vp.idVendaParcela
            WHERE vp.del = 0 AND vc.del = 0 AND v.del = 0";

    if($_POST['situacao'] == '1'){
        $sql .= " AND vp.idVendaParcela NOT IN(SELECT IFNULL(idVendaParcela, 0) FROM vendas_parcelas_repasses)";
        //$sql .= " AND IFNULL(vr.idVendedorRepasse, 0) NOT IN(SELECT IFNULL(GROUP_CONCAT(idMarchandRepasse), 0) FROM vendas_parcelas_repasses WHERE idMarchandRepasse <> 0)";
    }else{
        $sql .= " AND vp.idVendaParcela IN(SELECT IFNULL(idVendaParcela, 0) FROM vendas_parcelas_repasses)";
        //$sql .= " AND IFNULL(vr.idVendedorRepasse, 0) IN(SELECT IFNULL(GROUP_CONCAT(idMarchandRepasse), 0) FROM vendas_parcelas_repasses WHERE idMarchandRepasse <> 0)";
    }

    if($_POST['de'] != ''){
        $sql .= " AND vp.dataVencimento >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND vp.dataVencimento <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if($_POST['idGaleria'] > 0){
        $sql .= " AND v.idLoja = " . $_POST['idGaleria'];
    }

    if($_POST['idCliente'] > 0){
        $sql .= " AND v.idCliente = " . $_POST['idCliente'];
    }

    $sql .= " GROUP BY numeroPedido, vr.idVendaParcela, v.idVendedor ORDER BY v.dataVenda DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            if($linha['situacao'] != "0") {
                $situacao = "Fechado";
            } else {
                $situacao = "Em aberto";
            }
            
            $json[] = array(
                'loja' => $linha['loja'],
                'idVenda' => $linha['idVenda'],
                'idVendaComp' => $linha['idVendaComp'],
                'idVendaParcela' => $linha['idVendaParcela'],
                'numeroPedido' => $linha['numeroPedido'],
                'dataVenda' => FormatData($linha['dataVenda'], false),
                'cliente' => $linha['cliente'],
                'obras' => getObrasComposicao($db, $linha['idVenda'], 1),
                'valorTotal' => FormatMoeda($linha['valorTotal']), 
                'parcelas' => $linha['parcelas'],
                'comissao' => FormatMoeda($linha['comissao']),
                'comissaoParcela' => FormatMoeda($linha['comissaoParcela']),
                'situacao' => $situacao,
                'idConpag' => $linha['idConpag']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function FecharRepasses(){

    session_start();
    $db = ConectaDB();

    $sql = "INSERT INTO conpag SET 
            idCentroCusto = " . $_POST['idCentroCusto'] . ", 
            idNatureza = " . $_POST['idNatureza'] . ", 
            idCliente = " . $_POST['idCliente'] . ", 
            idLoja = " . $_POST['idLoja'] . ", 
            data = NOW(), 
            valorTotal = " . ValorE($_POST['valorTotal']) . ", 
            qtdeParcelas = " . $_POST['qtdParcelas'] . ",             
            descricao = 'FECHAMENTO DO REPASSE DE ARQUITETOS NO PERÍODO DE " . $_POST['de'] . " ATÉ " . $_POST['ate'] . "', 
            idUsuario = " . $_SESSION['photoarts_codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo 'ERROR SET CONPAG: ' . $sql;
        return;
    }

    $idConpag = UltimoRegistroInserido($db);
    $numParcela = explode(',', $_POST['numsParcelas']);
    $valorParcela = explode(',', $_POST['valoresParcelas']);
    $vencimentoParcela = explode(',', $_POST['vencimentosParcelas']);

    for ($i = 0; $i < count($numParcela); $i++) {

        $sql = "INSERT INTO conpagparcelas SET idConpag=" . $idConpag . ", "
                . "data=NOW(), numero =" . $numParcela[$i] . ", "
                . "valor =" . $valorParcela[$i] . ", "
                . "dataVencimento ='" . DataSSql($vencimentoParcela[$i]) . "' ";

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo 'ERROR SET CONPAG COMP: ' . $sql;
            return;
        }
    }

    $idVenda = explode(',', $_POST['idVenda']);
    $idVendaComp = explode(',', $_POST['idVendaComp']);
    $idVendaParcela = explode(',', $_POST['idVendaParcela']);
    $parcela = explode(',', $_POST['parcela']);
    $comissao = explode(',', $_POST['comissao']);
    $comissaoParcela = explode(',', $_POST['comissaoParcela']);

    for($i = 0; $i < count($idVenda); $i++){

        $sql = "INSERT INTO arquitetos_repasses SET 
                dataRepasse = NOW(), 
                idUsuarioRepasse = " . $_SESSION['photoarts_codigo'] . ", 
                idCliente = " . $_POST['idCliente'] . ", 
                idVenda = " . $idVenda[$i] . ", 
                idVendaComp = " . $idVendaComp[$i] . ", 
                idVendaParcela = " . $idVendaParcela[$i] . ", 
                parcela = " . $parcela[$i] . ", 
                valorComissao = " . $comissao[$i] . ", 
                valorComissaoParcela = " . $comissaoParcela[$i] . ", 
                idConpag = " . $idConpag;

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo 'ERROR SET ARQUITETOS REPASSES: ' . $sql;
            return;
        }

        /*$sql = "UPDATE vendas_comp SET 
                idVendedorRepasse = " . UltimoRegistroInserido($ArqT) . " 
                WHERE idVendaComp = " . $idVendaComp[$i];*/

        $sql = "INSERT INTO vendas_parcelas_repasses SET 
                idVendaParcela = " . $idVendaParcela[$i] . ", 
                idArquitetoRepasse = " . UltimoRegistroInserido($db);

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo 'ERROR UPDATE ID VENDEDOR REPASSES VENDAS_COMP: ' . $sql;
            return;
        }
    }

    echo 'OK';
    $db->close();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT l.loja, v.idVenda, vc.idVendaComp, vp.idVendaParcela, LPAD(v.idVenda, 5, '0') AS numeroPedido, v.dataVenda, 
            cli.cliente, v.valorTotal, 
            CONCAT(vp.parcela, ' de ', (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)) AS parcelas, 
            TRUNCATE(((v.valorTotal * cli.arquitetoComissao) / 100), 2) AS comissao, 
            TRUNCATE((((v.valorTotal * cli.arquitetoComissao) / 100) / (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)), 2) AS comissaoParcela, 
            IFNULL(vr.idArquitetoRepasse, 0) AS situacao, 0 AS idConpag
            FROM vendas_parcelas AS vp
            INNER JOIN vendas AS v USING(idVenda)
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            INNER JOIN vendas_comp AS vc ON vc.idVenda = v.idVenda
            INNER JOIN clientes AS cli ON cli.idCliente = v.idCliente AND cli.ativo = 1 AND cli.del = 0 AND cli.arquiteto=1
            LEFT JOIN arquitetos_repasses AS vr ON vr.idVendaParcela=vp.idVendaParcela
            WHERE vp.del = 0 AND vc.del = 0 AND v.del = 0";

    if($_POST['situacao'] == '1'){
        $sql .= " AND vp.idVendaParcela NOT IN(SELECT IFNULL(idVendaParcela, 0) FROM vendas_parcelas_repasses)";
        //$sql .= " AND IFNULL(vr.idVendedorRepasse, 0) NOT IN(SELECT IFNULL(GROUP_CONCAT(idMarchandRepasse), 0) FROM vendas_parcelas_repasses WHERE idMarchandRepasse <> 0)";
    }else{
        $sql .= " AND vp.idVendaParcela IN(SELECT IFNULL(idVendaParcela, 0) FROM vendas_parcelas_repasses)";
        //$sql .= " AND IFNULL(vr.idVendedorRepasse, 0) IN(SELECT IFNULL(GROUP_CONCAT(idMarchandRepasse), 0) FROM vendas_parcelas_repasses WHERE idMarchandRepasse <> 0)";
    }

    if($_POST['de'] != ''){
        $sql .= " AND vp.dataVencimento >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND vp.dataVencimento <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if($_POST['idGaleria'] > 0){
        $sql .= " AND v.idLoja = " . $_POST['idGaleria'];
    }

    if($_POST['idCliente'] > 0){
        $sql .= " AND v.idCliente = " . $_POST['idCliente'];
    }

    $sql .= " GROUP BY numeroPedido, vr.idVendaParcela, v.idVendedor ORDER BY v.dataVenda DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    inicio_sessao();
    $_SESSION['sql_rel'] = $sql;

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-repasses-de-arquitetos-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-repasses-de-arquitetos-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('LOJA', 'N° PEDIDO', 'DATA PEDIDO', 'CLIENTE', 'OBRAS', 'VALOR TOTAL', 'PARCELAS', 'COMISSÃO', 'COMISSÃO PARCELA', 'SITUAÇÃO');

    $excel->writeLine($arr);

    while ($linha = $db->fetch()) {
        
        $valorTotalComissao = $valorTotalComissao + $linha['comissao'];
        $valorTotalComissaoParcela = $valorTotalComissaoParcela + $linha['comissaoParcela'];

        if($linha['situacao'] != "0") {
            $situacao = "Fechado";
        } else {
            $situacao = "Em aberto";
        }

        $arr = array(
            $linha['loja'],
            $linha['numeroPedido'],
            FormatData($linha['dataVenda'], false),
            $linha['vendedor'],
            getObrasComposicao($ArqT, $linha['idVenda'], 1),
            FormatMoeda($linha['valorTotal']), 
            $linha['parcelas'],
            FormatMoeda($linha['comissao']),
            FormatMoeda($linha['comissaoParcela']),
            $situacao
        );

        $excel->writeLine($arr);
    }

    $arr = array('', '', '', '', '', '', 'TOTAL', FormatMoeda($valorTotalComissao), FormatMoeda($valorTotalComissaoParcela), '');
    $excel->writeLine($arr);
    
    $excel->close();

    echo $newPathReturn;
    $db->close();
}

function getPagamentosPedidos(){

    $db = ConectaDB();

    $sql = "SELECT  v.dataCadastro, v.parcela, v.valor, v.dataCompensacao AS 'data', v.recibo, 
            f.formaPagamento AS forma
            FROM vendas_parcelas AS v         
            INNER JOIN formaspagamentos AS f ON f.idFormaPagamento = v.idFormaPagamento
            WHERE v.del = 0 AND v.idVenda = " . $_POST['idVenda'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'parcela' => $linha['parcela'],
                'valor' => FormatMoeda($linha['valor']),
                'dataPara' => FormatData($linha['data'], false),
                'cadastro' => FormatData($linha['dataCadastro'], false),
                'forma' => $linha['forma'],
                'recibo' => $linha['recibo']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}