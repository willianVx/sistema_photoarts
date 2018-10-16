<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Pesquisar':
            Pesquisar();
            break;

        case 'AnteciparParcelas':
            AnteciparParcelas();
            break;

        case 'ExcluirAntecipacao':
            ExcluirAntecipacao();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;
    }
}

function Pesquisar(){

    $db = ConectaDB();

    if($_POST['situacao'] == '1'){

        $sql = "SELECT v.idVenda, vp.idVendaParcela, 0 AS idVendaParcelaAntecipacao, 
                LPAD(v.idVenda, 5, '0') AS numeroVenda, v.dataVenda, l.loja, c.cliente,
                CONCAT(vp.parcela, ' de ', (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)) AS parcelas, vp.valor, 
                0.00 AS valorAntecipacao, vp.dataCompensacao, 'Em aberto' AS situacao, '0000-00-00' AS dataAntecipacao
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda)
                INNER JOIN lojas AS l ON l.idLoja = v.idLoja
                INNER JOIN clientes AS c ON c.idCliente = v.idCliente
                WHERE v.del = 0 AND vp.del = 0 AND vp.idFormaPagamento > 0 AND vp.idVendaParcelaAntecipacao <= 0";
    }else{

        $sql = "SELECT v.idVenda, vp.idVendaParcela, vpa.idVendaParcelaAntecipacao, 
                LPAD(v.idVenda, 5, '0') AS numeroVenda, v.dataVenda, l.loja, c.cliente,
                CONCAT(vp.parcela, ' de ', (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)) AS parcelas, vp.valor, 
                vpa.valorAntecipacao, vp.dataCompensacao, 'Antecipada' AS situacao, vpa.dataAntecipacao
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda)
                INNER JOIN lojas AS l ON l.idLoja = v.idLoja
                INNER JOIN clientes AS c ON c.idCliente = v.idCliente
                INNER JOIN vendas_parcelas_antecipacoes AS vpa ON vpa.idVendaParcelaAntecipacao = vp.idVendaParcelaAntecipacao AND vpa.del = 0
                WHERE v.del = 0 AND vp.del = 0 AND vp.idFormaPagamento > 0";
    }

    if($_POST['idFormaPagamento'] > 0){
        $sql .= " AND vp.idFormaPagamento = " . $_POST['idFormaPagamento'];
    }

    if($_POST['idGaleria'] > 0){
        $sql .= " AND v.idLoja = " . $_POST['idGaleria'];
    }

    if($_POST['de'] != ''){
        $sql .= " AND vp.dataCompensacao >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND vp.dataCompensacao <= '" . DataSSql($_POST['ate']) . "' ";
    }
    
    $sql .= " ORDER BY vp.dataCompensacao, vp.idVenda, vp.parcela ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {
            
            $json[] = array(
                'idVenda' => $linha['idVenda'],
                'idVendaParcela' => $linha['idVendaParcela'],
                'idVendaParcelaAntecipacao' => $linha['idVendaParcelaAntecipacao'],
                'numeroVenda' => $linha['numeroVenda'],
                'dataVenda' => FormatData($linha['dataVenda'], false),
                'loja' => $linha['loja'],
                'cliente' => $linha['cliente'],
                'obras' => getObrasComposicao($db, $linha['idVenda'], 1),
                'parcelas' => $linha['parcelas'],
                'valor' => FormatMoeda($linha['valor']),
                'valorAntecipacao' => FormatMoeda($linha['valorAntecipacao']),
                'dataCompensacao' => FormatData($linha['dataCompensacao'], false),
                'situacao' => ($linha['situacao'] == 'Antecipada' ? $linha['situacao'] . ' em ' . FormatData($linha['dataAntecipacao']) : $linha['situacao'])
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function AnteciparParcelas(){

    inicia_sessao();
    $db = ConectaDB();

    $sql = "INSERT INTO vendas_parcelas_antecipacoes SET 
            dataCadastro = NOW(), 
            idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
            dataAntecipacao = '" . DataSSql($_POST['dataAntecipacao']) . "', 
            valorTotal = " . $_POST['valorTotal'] . ",
            valorAntecipacao = " . ValorE($_POST['valorAntecipacao']) . ", 
            obs = '" . $db->escapesql($_POST['obs']) . "'";

    $db->query( $sql );

    if ( $db->n_rows > 0) {

        $idVendaParcelaAntecipacao = UltimoRegistroInserido($ArqT);

        //Atualiza as parcelas com o id da antecipação
        $sql = "UPDATE vendas_parcelas SET 
                idVendaParcelaAntecipacao = " . $idVendaParcelaAntecipacao . " 
                WHERE idVendaParcela IN(" . $_POST['idParcelasVendas'] . ")";

        $db->query( $sql );

        if ( $db->n_rows > 0) {

            //Insere na tabela receitas_avulsas com o valor total da antecipação
            $sql = "INSERT INTO receitas_avulsas SET 
                    dataCadastro = NOW(), 
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                    DATA = CURDATE(), 
                    descricao = '" . $db->escapesql( "ANTECIPAÇÃO DE PARCELAS REALIZADA EM " . $_POST['dataAntecipacao']) . "', 
                    valor = " . ValorE($_POST['valorAntecipacao']) . ", 
                    idFormaPagamento = " . $_POST['idFormaPagamento'] . ",
                    idVendaParcelaAntecipacao = " . $idVendaParcelaAntecipacao;
            $db->query( $sql );
        }else{

            echo '0';
        }
    }else{

        echo '0';
    }

    $db->close();
}

function ExcluirAntecipacao(){

    inicia_sessao();

    $db = ConectaDB();

    //Exclui a receita avulsa vinculada a uma antecipação
    $sql = "UPDATE receitas_avulsas SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idVendaParcelaAntecipacao = " . $_POST['idVendaParcelaAntecipacao'];
    $db->query( $sql );

    if ( $db->n_rows > 0) {

        //Desvincula as parcelas da antecipação
        $sql = "UPDATE vendas_parcelas SET idVendaParcelaAntecipacao = 0 
                WHERE idVendaParcelaAntecipacao = " . $_POST['idVendaParcelaAntecipacao'];
        $db->query( $sql );

        if ( $db->n_rows > 0) {

            //Exclui a antecipação
            $sql = "UPDATE vendas_parcelas_antecipacoes SET 
                    del = 1, 
                    dataDel = NOW(), 
                    idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
                    WHERE idVendaParcelaAntecipacao = " . $_POST['idVendaParcelaAntecipacao'];
            $db->query( $sql );
        }else{

            echo '0';
        }
    }else{
        echo '0';
    }
    $db->close();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    if($_POST['situacao'] == '1'){

        $sql = "SELECT v.idVenda, vp.idVendaParcela, 0 AS idVendaParcelaAntecipacao, 
                LPAD(v.idVenda, 5, '0') AS numeroVenda, v.dataVenda, l.loja, c.cliente,
                CONCAT(vp.parcela, ' de ', (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)) AS parcelas, vp.valor, 
                0.00 AS valorAntecipacao, vp.dataCompensacao, 'Em aberto' AS situacao, '0000-00-00' AS dataAntecipacao
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda)
                INNER JOIN lojas AS l ON l.idLoja = v.idLoja
                INNER JOIN clientes AS c ON c.idCliente = v.idCliente
                WHERE v.del = 0 AND vp.del = 0 AND vp.idFormaPagamento > 0 AND vp.idVendaParcelaAntecipacao <= 0";
    }else{

        $sql = "SELECT v.idVenda, vp.idVendaParcela, vpa.idVendaParcelaAntecipacao, 
                LPAD(v.idVenda, 5, '0') AS numeroVenda, v.dataVenda, l.loja, c.cliente,
                CONCAT(vp.parcela, ' de ', (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0)) AS parcelas, vp.valor, 
                vpa.valorAntecipacao, vp.dataCompensacao, 'Antecipada' AS situacao, vpa.dataAntecipacao
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda)
                INNER JOIN lojas AS l ON l.idLoja = v.idLoja
                INNER JOIN clientes AS c ON c.idCliente = v.idCliente
                INNER JOIN vendas_parcelas_antecipacoes AS vpa ON vpa.idVendaParcelaAntecipacao = vp.idVendaParcelaAntecipacao AND vpa.del = 0
                WHERE v.del = 0 AND vp.del = 0 AND vp.idFormaPagamento > 0";
    }

    if($_POST['idFormaPagamento'] > 0){
        $sql .= " AND vp.idFormaPagamento = " . $_POST['idFormaPagamento'];
    }

    if($_POST['idGaleria'] > 0){
        $sql .= " AND v.idLoja = " . $_POST['idGaleria'];
    }

    if($_POST['de'] != ''){
        $sql .= " AND vp.dataCompensacao >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND vp.dataCompensacao <= '" . DataSSql($_POST['ate']) . "' ";
    }   
    
    $sql .= " ORDER BY v.idVenda DESC, vp.parcela";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    inicia_sessao();
    $_SESSION['sql_rel'] = $sql;

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-antecipacoes-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-antecipacoes-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N° PEDIDO', 'DATA PEDIDO', 'LOJA', 'CLIENTE', 'OBRAS', 'PARCELA', 'VALOR', 'DATA COMPENSAÇÃO', 'SITUAÇÃO');

    $excel->writeLine($arr);

    while ($linha = $db->fetch()) {
        
        $valorTotal = $valorTotal + $linha['valor'];
        $valorTotalAntecipacao = $valorTotalAntecipacao + $linha['valorAntecipacao'];

        $arr = array(
            $linha['numeroVenda'],
            FormatData($linha['dataVenda'], false),
            $linha['loja'],
            $linha['cliente'],
            getObrasComposicao($db, $linha['idVenda'], 1),
            $linha['parcelas'],
            FormatMoeda($linha['valor']),
            FormatData($linha['dataCompensacao'], false),
            ($linha['situacao'] == 'Antecipada' ? $linha['situacao'] . ' em ' . FormatData($linha['dataAntecipacao']) : $linha['situacao'])
        );

        $excel->writeLine($arr);
    }

    $arr = array('', '', '', '', 'TOTAL', FormatMoeda($valorTotal), '', '', '');
    $excel->writeLine($arr);

    if($_POST['situacao'] == '2'){
        $arr = array('', '', '', '', 'TOTAL ANTECIPAÇÃO', FormatMoeda($valorTotalAntecipacao), '', '', '');
        $excel->writeLine($arr);        
    }
    
    $excel->close();

    echo $newPathReturn;
    $db->close();
}