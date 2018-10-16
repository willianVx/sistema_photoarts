<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostra':
            Mostra();
            break;

        case 'Gravar':
            Gravar();
            break;

        case 'getValePresenteTroca':
            getValePresenteTroca();
            break;

        case 'ExcluirVale':
            ExcluirVale();
            break;
    }
}

function Mostra() {

    $db = ConectaDB();

    $sql = 'SELECT vpt.idValePresenteTroca, vpt.dataCadastro, vpt.codigo, IFNULL(l.loja, "Todas") AS loja, 
            vpt.dataValidade, vpt.valor, 
            LPAD(vpt.idVenda, 5, "0") AS idVenda, c.cliente 
            FROM vales_presentes_trocas AS vpt
            LEFT JOIN lojas AS l ON l.idLoja = vpt.idGaleria
            INNER JOIN clientes AS c ON c.idCliente = vpt.idCliente
            WHERE vpt.del = 0';

    if($_POST['tipoData'] == 'D'){
        if($_POST['de'] != ''){
            $sql .= " AND vpt.dataCadastro >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
            $sql .= " AND vpt.dataCadastro <= '" . DataSSql($_POST['ate']) . "' ";
        }
    }else{
        if($_POST['de'] != ''){
            $sql .= " AND vpt.dataValidade >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
            $sql .= " AND vpt.dataValidade <= '" . DataSSql($_POST['ate']) . "' ";
        }
    }

    if($_POST['idGaleria'] != '0'){
        $sql .= " AND vpt.idGaleria = " . $_POST['idGaleria'];
    }

    if($_POST['idCliente'] != '0'){
        $sql .= " AND vpt.idCliente = " . $_POST['idCliente'];
    }

    if($_POST['situacao'] == '2'){
        $sql .= " AND vpt.idVenda > 0";
    }else if($_POST['situacao'] == '3'){
        $sql .= " AND vpt.idVenda = 0";
    }

    if ($_POST['codigo'] !== '') {
        $sql .= " AND vpt.codigo LIKE '%" . $_POST['codigo'] . "%'";
    }

    if($_POST['tipoData']  == 'D'){
        $sql .= ' ORDER BY vpt.dataCadastro DESC';
    }else{
        $sql .= ' ORDER BY vpt.dataValidade DESC';
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idValePresenteTroca' => $linha['idValePresenteTroca'],
                'dataCadastro' => FormatData($linha['dataCadastro']),
                'codigo' => $linha['codigo'],
                'loja' => $linha['loja'],
                'dataValidade' => FormatData($linha['dataValidade']),
                'valor' => FormatMoeda($linha['valor']),
                'idVenda' => $linha['idVenda'],
                'cliente' => $linha['cliente']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();
    $db = ConectaDB();

    if ($_POST['idValePresenteTroca'] <= 0) {

        $sql = 'SELECT codigo FROM vales_presentes_trocas WHERE codigo = "' . $db->escapesql($_POST['codigo']) . '" 
                OR idValePresenteTroca <> ' . $_POST['idValePresenteTroca'];

        $db->query( $sql );

        if ( $db->n_rows > 0) {
            echo '2';
            $db->close();
            return;
        }
    }

    $sql = ' vales_presentes_trocas SET '
            . ' codigo = "' . $_POST['codigo'] . '"' 
            . ', idGaleria = ' . $_POST['idGaleria']
            . ', idCliente = ' . $_POST['idColecionador']
            . ', dataValidade = DATE_ADD("' .  DataSSql($_POST['dataCadastro']) . '", INTERVAL ' . $_POST['validade'] . ' DAY) '
            . ', valor = ' . ValorE($_POST['valor']);

    if ($_POST['idValePresenteTroca'] <= 0) {
        $sql = 'INSERT INTO ' . $sql . ', 
                dataCadastro = "' . DataSSql($_POST['dataCadastro']) . '", 
                idUsuarioCadastro = ' . $_SESSION['photoarts_codigo'];
    } else {
        $sql = 'UPDATE ' . $sql . ', 
                dataAtualizacao = NOW() WHERE idValePresenteTroca = ' . $_POST['idValePresenteTroca'];
    }

    $db->query( $sql );

    if ($_POST['idValePresenteTroca'] <= 0) {
        $idValePresenteTroca = UltimoRegistroInserido($db);
    }else{
        $idValePresenteTroca = $_POST['idValePresenteTroca'];
    }

    if ( $db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }

    for($i = 0; $i < $_POST['qtdParcelas']; $i++){

        $sql = "INSERT INTO vales_presentes_trocas_parcelas SET 
                idValePresenteTroca = " . $idValePresenteTroca . ", 
                valor = " . (ValorE($_POST['valor']) / $_POST['qtdParcelas']) . ", 
                parcela = " . ($i + 1) . ", 
                dataVencimento = DATE_ADD('" .  DataSSql($_POST['dataCadastro']) . "', INTERVAL " . ($i + 1) . " MONTH),
                idFormaPagamento = " . $_POST['idFormaPagamento'] . ", 
                recibo = '" . $_POST['recibo'] . "'";
        $db->query( $sql );
    }

    $db->close();
}

function getValePresenteTroca(){

    $db = ConectaDB();

    $sql = "SELECT dataCadastro, codigo, idGaleria, idCliente, DATEDIFF(dataValidade, dataCadastro) AS validade, valor,  
            (SELECT idFormaPagamento FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0 LIMIT 1) AS idFormaPagamento, 
            (SELECT recibo FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0 LIMIT 1) AS recibo, 
            (SELECT COUNT(*) FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0) AS qtdParcelas
            FROM vales_presentes_trocas AS vpt
            WHERE vpt.idValePresenteTroca = " . $_POST['idValePresenteTroca'];
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'codigo' => $linha['codigo'],
            'idGaleria' => $linha['idGaleria'],
            'idCliente' => $linha['idCliente'],
            'validade' => $linha['validade'],
            'valor' => FormatMoeda($linha['valor']),
            'idFormaPagamento' => $linha['idFormaPagamento'],
            'recibo' => $linha['recibo'],
            'qtdParcelas' => $linha['qtdParcelas']
        );

        echo json_encode($json);
    }

    $db->close();
}

function ExcluirVale(){

    inicia_sessao();
    $db = ConectaDB();

    $sql = "UPDATE vales_presentes_trocas SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idValePresenteTroca = " . $_POST['idValePresenteTroca'];
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        echo '1';
    }

    $db->close();
}

?>