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

        case 'getP':
            getP();
            break;

        case 'saveP':
            saveP();
            break;

        case 'Pagar':
            Pagar();
            break;
    }
}

function Pagar() {

    $db = ConectaDB();

    $sql = "UPDATE conpagparcelas SET " .
            "pago=" . ($_POST['pago'] == 'true' ? '1' : '0') . ", " .
            "dataPago='" . DataSSql($_POST['dataPago']) . "', " .
            "valorPago=" . ValorE($_POST['valorPago']) . ", " .
            "valorDesconto=" . ValorE($_POST['valorDesconto']) . ", " .
            "valorJuros=" . ValorE($_POST['valorJuros']) . ", " .
            "idConta=" . $_POST['idConta'] . ", " .
            "idFormaPagamento=" . $_POST['idFormaPagamento'] . ", " .
            "idUsuarioPago=" . $_POST['idUsuarioPago'] . ", " .
            "obsPago ='" . $_POST['obsPago'] . "', " .
            "dataAtualizacao = NOW() WHERE idConpagParcela =" . $_POST['idParcela'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo 'OK';
    }else{
        echo 'ERRO';
    }
    $db->close();
}

function getP() {
    inicia_sessao();
    echo $_SESSION['p'];
}

function saveP() {

    $x = Array(
        'de' => $_POST['de'],
        'ate' => $_POST['ate'],
        'idCentroCusto' => $_POST['idCentroCusto'],
        'idNatureza' => $_POST['idNatureza'],
        'idOrigem' => $_POST['idOrigem'],
        'de' => $_POST['de'],
        'ate' => $_POST['ate'],
        'porVencimento' => $_POST['porVencimento'],
        'idSituacao' => $_POST['idSituacao'],
        'idConta' => $_POST['idConta'],
        'obs' => $_POST['obs'],
        'origem' => $_POST['origem']
            //'comProjecao' => $_POST['comProjecao']
    );

    inicia_sessao();

    $_SESSION['p'] = json_encode($x);
    //$_SESSION['comProjecao'] = $_POST['comProjecao'];
    $_SESSION['de'] = $_POST['de'];
    $_SESSION['ate'] = $_POST['ate'];
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT c.idConpag, p.idConpagParcela AS idParcela, 
            CONCAT(LPAD(p.numero, 2, '0'), '/', LPAD(c.qtdeParcelas, 2, '0')) AS parcela, p.data, cc.centrocusto, 
            n.natureza, IFNULL(f.fornecedor, '') AS fornecedor, IFNULL(fu.funcionario, '') AS funcionario, 
            IFNULL(v.vendedor, '') AS vendedor, IFNULL(a.artista, '') AS artista, c.descricao, p.dataVencimento, 
            p.valor, p.pago, p.valorDesconto, p.valorJuros, p.valorPago, p.dataPago, 
            IFNULL(fu.funcionario, '- - -') AS pagoPor, p.obsPago, 
            IFNULL(fp.formapagamento, '- - -') AS formaPagamento, IFNULL(co.conta, '- - -') AS conta, 
            p.toleranciaUltrapassada, IF(DATEDIFF(CURDATE(), p.dataVencimento) > 0, 1, 0) AS vencido, 
            p.projetado FROM conpag AS c 
            INNER JOIN conpagparcelas AS p ON p.idConpag = c.idConpag
            INNER JOIN centro_custos AS cc ON cc.idCentroCusto = c.idCentroCusto
            INNER JOIN naturezas AS n ON n.idNatureza = c.idNatureza
            LEFT JOIN fornecedores AS f ON f.idFornecedor = c.idFornecedor
            LEFT JOIN funcionarios AS fu ON fu.idFuncionario = c.idFuncionario
            LEFT JOIN vendedores AS v ON v.idVendedor = c.idVendedor
            LEFT JOIN artistas AS a ON a.idArtista = c.idArtista
            LEFT JOIN formaspagamentos AS fp ON fp.idFormaPagamento = p.idFormaPagamento
            LEFT JOIN contas AS co ON co.idConta = p.idConta
            WHERE c.del = 0 AND p.del = 0 ";

    if ($_POST['idCentroCusto'] > 0) {
        $sql .= "AND c.idCentroCusto =" . $_POST['idCentroCusto'] . " ";
    }

    if ($_POST['idNatureza'] > 0) {
        $sql .= "AND c.idNatureza =" . $_POST['idNatureza'] . " ";
    }

    if ($_POST['origem'] === '1') {
        $sql .= "AND c.idArtista > 0 ";
    } else if ($_POST['origem'] === '2') {
        $sql .= "AND c.idFornecedor > 0 ";
    } else if ($_POST['origem'] === '3') {
        $sql .= "AND c.idFuncionario > 0 ";
    } else if ($_POST['origem'] === '4') {
        $sql .= "AND c.idVendedor > 0 ";
    }

    if ($_POST['idOrigem'] > 0) {

        if ($_POST['origem'] === '1') {
            $sql .= "AND c.idArtista = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '2') {
            $sql .= "AND c.idFornecedor = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '3') {
            $sql .= "AND c.idFuncionario = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '4') {
            $sql .= "AND c.idVendedor = " . $_POST['idOrigem'] . " ";
        }
    }

    if ($_POST['de'] != '') {

        if ($_POST['porVencimento'] == 'true')
            $sql .= "AND p.dataVencimento >='" . DataSSql($_POST['de']) . "' ";
        else
            $sql .= "AND p.dataPago >='" . DataSSql($_POST['de']) . "' ";
    }

    if ($_POST['ate'] != '') {

        if ($_POST['porVencimento'] == 'true')
            $sql .= "AND p.dataVencimento <='" . DataSSql($_POST['ate']) . "' ";
        else
            $sql .= "AND p.dataPago <='" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['idSituacao'] > 0) {

        if ($_POST['idSituacao'] == 1)
            $sql .= "AND p.pago = 1 ";
        else
            $sql .= "AND p.pago = 0 ";
    }

    if ($_POST['idConta'] > 0) {
        $sql .= "AND p.idConta =" . $_POST['idConta'] . " ";
    }

    if ($_POST['obs'] != '') {
        $sql .= "AND c.descricao LIKE '%" . $_POST['obs'] . "%' ";
    }

    if ($_POST['porVencimento'] == 'true')
        $sql .= "ORDER BY p.dataVencimento, vencido DESC, p.pago DESC, cc.centrocusto, n.natureza, f.fornecedor";
    else
        $sql .= "ORDER BY p.dataPago DESC, cc.centrocusto, n.natureza, f.fornecedor";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '-1';
        return;
    }

    inicia_sessao();
    $_SESSION['sql_rel'] = $sql;
    //saveP();

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-contas-a-pagar-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-contas-a-pagar-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('TOL. ULTRAP..?', 'N° TÍTULO', 'PARCELA', 'C. CUSTO', 'NATUREZA', 'ORIGEM', 'NOME', 'OBS.', 'VENCIMENTO',
        'VALOR', 'PAGO?', 'VALOR PAGO', 'PAGO EM', 'PAGO POR', 'FORMA', 'CONTA', 'VENCIDO?');

    $excel->writeLine($arr);

    while ($linha = $db->fetch()) {

        $tolUlt = ($linha['toleranciaUltrapassada'] === '-1' ? 'SIM' : '- - -');

        if ($linha['artista'] !== '') {
            $origem = 'Artista';
            $nome = $linha['artista'];
        } else if ($linha['fornecedor'] !== '') {
            $origem = 'Fornecedor';
            $nome = $linha['fornecedor'];
        } else if ($linha['funcionario'] !== '') {
            $origem = 'Funcionário';
            $nome = $linha['funcionario'];
        } else {
            $origem = 'Vendedor';
            $nome = $linha['vendedor'];
        }

        $arr = array(
            $tolUlt,
            number_format_complete($linha['idConpag'], '0', '5'),
            $linha['parcela'],
            $linha['centrocusto'],
            $linha['natureza'],
            $origem,
            $nome,
            $linha['descricao'],
            FormatData($linha['dataVencimento'], false),
            FormatMoeda($linha['valor']),
            ($linha['pago'] == 0 ? '- - -' : 'SIM'),
            FormatMoeda($linha['valorPago']),
            (isDate($linha['dataPago']) ? FormatData($linha['dataPago'], false) : '- - -'),
            $linha['pagoPor'],
            $linha['formaPagamento'],
            $linha['conta'],
            ($linha['vencido'] == 1 && $linha['pago'] == 0 ? 'SIM' : '- - -')
        );

        $excel->writeLine($arr);
    }

    $excel->close();

    echo $newPathReturn;
    $db->close();
}

function Pesquisar() {

    $db = ConectaDB();

    $sql = "SELECT c.idConpag, p.idConpagParcela AS idParcela, 
            CONCAT(LPAD(p.numero, 2, '0'), '/', LPAD(c.qtdeParcelas, 2, '0')) AS parcela, p.data, cc.centrocusto, 
            n.natureza, IFNULL(f.fornecedor, '') AS fornecedor, IFNULL(fu.funcionario, '') AS funcionario, 
            IFNULL(v.vendedor, '') AS vendedor, IFNULL(a.artista, '') AS artista, c.descricao, p.dataVencimento, 
            p.valor, p.pago, p.valorDesconto, p.valorJuros, p.valorPago, p.dataPago, 
            IFNULL(fu.funcionario, '- - -') AS pagoPor, p.obsPago, 
            IFNULL(fp.formapagamento, '- - -') AS formaPagamento, IFNULL(co.conta, '- - -') AS conta, 
            p.toleranciaUltrapassada, IF(DATEDIFF(CURDATE(), p.dataVencimento) > 0, 1, 0) AS vencido, 
            p.projetado FROM conpag AS c 
            INNER JOIN conpagparcelas AS p ON p.idConpag = c.idConpag
            INNER JOIN centro_custos AS cc ON cc.idCentroCusto = c.idCentroCusto
            INNER JOIN naturezas AS n ON n.idNatureza = c.idNatureza
            LEFT JOIN fornecedores AS f ON f.idFornecedor = c.idFornecedor
            LEFT JOIN funcionarios AS fu ON fu.idFuncionario = c.idFuncionario
            LEFT JOIN vendedores AS v ON v.idVendedor = c.idVendedor
            LEFT JOIN artistas AS a ON a.idArtista = c.idArtista
            LEFT JOIN formaspagamentos AS fp ON fp.idFormaPagamento = p.idFormaPagamento
            LEFT JOIN contas AS co ON co.idConta = p.idConta
            WHERE c.del = 0 AND p.del = 0 ";

    if ($_POST['idCentroCusto'] > 0) {
        $sql .= "AND c.idCentroCusto =" . $_POST['idCentroCusto'] . " ";
    }

    if ($_POST['idNatureza'] > 0) {
        $sql .= "AND c.idNatureza =" . $_POST['idNatureza'] . " ";
    }


    if ($_POST['loja'] > 0) {
        $sql .= " AND c.idLoja = " . $_POST['loja'] . " ";
    }


    if ($_POST['origem'] === '1') {
        $sql .= "AND c.idArtista > 0 ";
    } else if ($_POST['origem'] === '2') {
        $sql .= "AND c.idFornecedor > 0 ";
    } else if ($_POST['origem'] === '3') {
        $sql .= "AND c.idFuncionario > 0 ";
    } else if ($_POST['origem'] === '4') {
        $sql .= "AND c.idVendedor > 0 ";
    }

    if ($_POST['idOrigem'] > 0) {

        if ($_POST['origem'] === '1') {
            $sql .= "AND c.idArtista = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '2') {
            $sql .= "AND c.idFornecedor = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '3') {
            $sql .= "AND c.idFuncionario = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '4') {
            $sql .= "AND c.idVendedor = " . $_POST['idOrigem'] . " ";
        }
    }

    if ($_POST['de'] != '') {

        if ($_POST['porVencimento'] == 'true')
            $sql .= "AND p.dataVencimento >='" . DataSSql($_POST['de']) . "' ";
        else
            $sql .= "AND p.dataPago >='" . DataSSql($_POST['de']) . "' ";
    }

    if ($_POST['ate'] != '') {

        if ($_POST['porVencimento'] == 'true')
            $sql .= "AND p.dataVencimento <='" . DataSSql($_POST['ate']) . "' ";
        else
            $sql .= "AND p.dataPago <='" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['idSituacao'] > 0) {

        if ($_POST['idSituacao'] == 1)
            $sql .= "AND p.pago = 1 ";
        else
            $sql .= "AND p.pago = 0 ";
    }

    if ($_POST['idConta'] > 0) {
        $sql .= "AND p.idConta =" . $_POST['idConta'] . " ";
    }

    if ($_POST['obs'] != '') {
        $sql .= "AND c.descricao LIKE '%" . $_POST['obs'] . "%' ";
    }

    if ($_POST['porVencimento'] == 'true')
        $sql .= "ORDER BY p.dataVencimento, vencido DESC, p.pago DESC, cc.centrocusto, n.natureza, f.fornecedor";
    else
        $sql .= "ORDER BY p.dataPago DESC, cc.centrocusto, n.natureza, f.fornecedor";

    saveP();

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '-1';
        return;
    }

    while ($linha = $db->fetch()) {

        $json[] = array(
            'codigo' => $linha['idConpag'],
            'idParcela' => $linha['idParcela'],
            'titulo' => number_format_complete($linha['idConpag'], '0', '5'),
            'parcela' => ($linha['projetado'] == 1 ? 'Projeção' : $linha['parcela']),
            'centroCusto' => $linha['centrocusto'],
            'natureza' => $linha['natureza'],
            'fornecedor' => $linha['fornecedor'],
            'funcionario' => $linha['funcionario'],
            'vendedor' => $linha['vendedor'],
            'artista' => $linha['artista'],
            'obs' => $linha['descricao'],
            'dataVencimento' => FormatData($linha['dataVencimento'], false),
            'valor' => FormatMoeda($linha['valor']),
            'toleranciaUltrapassada' => $linha['toleranciaUltrapassada'],
            'pago' => ($linha['pago'] == 0 ? '- - -' : 'SIM'),
            'valorDesconto' => FormatMoeda($linha['valorDesconto']),
            'valorJuros' => FormatMoeda($linha['valorJuros']),
            'valorPago' => FormatMoeda($linha['valorPago']),
            'dataPago' => (isDate($linha['dataPago']) ? FormatData($linha['dataPago'], false) : '- - -'),
            'pagoPor' => $linha['pagoPor'],
            'obsPgto' => $linha['obsPago'],
            'formaPagamento' => $linha['formaPagamento'],
            'conta' => $linha['conta'],
            'vencido' => $linha['vencido'],
            'projetado' => $linha['projetado'],
            'origem' => $_POST['origem']
        );
    }

    echo json_encode($json);
    $db->close();
}
