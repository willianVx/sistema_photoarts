<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarParcelas':
            MostrarParcelas();
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'GetRegistroPrimeiro':
            $db = ConectaDB();
            echo RegistroPrimeiro($db, 'conpag', 'idConpag', true);
            break;

        case 'GetRegistroAnterior':
            $db = ConectaDB();
            echo RegistroAnterior($db, 'conpag', $_POST['atual'], 'idConpag', true);
            break;

        case 'GetRegistroProximo':
            $db = ConectaDB();
            echo RegistroProximo($db, 'conpag', $_POST['atual'], 'idConpag', true);
            break;

        case 'GetRegistroUltimo':
            $db = ConectaDB();
            echo RegistroUltimo($db, 'conpag', 'idConpag', true);
            break;

        case 'Salvar':
            Salvar();
            break;

        case 'SalvarParcela':
            SalvarParcela();
            break;

        case 'Excluir':
            Excluir();
            break;

        case 'ExcluirParcela':
            ExcluirParcela();
            break;

        case 'PesquisarTitulos':
            PesquisarTitulos();
            break;


        case 'getContasPagar':
            getContasPagar();
            break;
    }
}

function getContasPagar() {

    $db = ConectaDB();

    /* $sql = "SELECT c.idConpag, p.idConpagParcela AS idParcela, 
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
      WHERE c.del = 0 AND p.del = 0 "; */

    $sql = "SELECT c.idLoja, c.idConpag, cc.centroCusto, n.natureza, c.idFornecedor, c.idFuncionario, c.idVendedor, c.idArtista, c.idCliente, IFNULL(cli.cliente, '') AS cliente, 
        IFNULL(f.razaoFornecedor, '') AS fornecedor, IFNULL(fn.funcionario, '') AS funcionario,
        IFNULL(v.vendedor, '') AS vendedor, IFNULL(a.artista, '') AS artista, CURDATE() AS dataAtual,
        (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0) AS qtdParcelas, c.valorTotal, 
        (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0 AND pago=1) AS qtdParcelasPagas,
        (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0 AND pago=0) AS qtdParcelasNaoPagas,
        IFNULL((SELECT dataVencimento FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0 AND pago=0 ORDER BY dataVencimento LIMIT 1), '') AS dataVencimento
        FROM conpag AS c
        LEFT JOIN centro_custos AS cc USING(idCentroCusto)
        LEFT JOIN naturezas AS n USING(idNatureza)
        LEFT JOIN fornecedores AS f USING(idFornecedor)
        LEFT JOIN funcionarios AS fn USING(idFuncionario)
        LEFT JOIN vendedores AS v USING(idVendedor)
        LEFT JOIN artistas AS a USING(idArtista)
        LEFT JOIN clientes AS cli USING(idCliente)
        WHERE c.del=0 ";

    if ($_POST['busca'] != "") {
        $sql .= " AND (n.natureza like '%" . $_POST['busca'] . "%'  ";

        if (intval($_POST['busca']) > 0) {
            $sql .= " OR c.idConpag LIKE '%" . $_POST['busca'] . "%' ";
        }

        $sql .= " OR f.fornecedor LIKE '%" . $_POST['busca'] . "%'  ";
        $sql .= " OR fn.funcionario LIKE '%" . $_POST['busca'] . "%'  ";
        $sql .= " OR v.vendedor LIKE '%" . $_POST['busca'] . "%'  ";
        $sql .= " OR a.artista LIKE '%" . $_POST['busca'] . "%'  ";
        $sql .= " OR c.cliente LIKE '%" . $_POST['busca'] . "%'  ";
        $sql .= " OR cc.centrocusto LIKE '%" . $_POST['busca'] . "%') ";
    }

    if ($_POST['loja'] > 0)
        $sql .= " AND c.idLoja = " . $_POST['loja'] . " ";

    if ($_POST['emAberto'] == 'true') {
        $sql .= "AND (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0 AND pago=0)> 0 ";
    } else if ($_POST['pagos'] == 'true') {
        $sql .= "AND (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0) = (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag=c.idConpag AND del=0 AND pago=1) ";
    }

    $sql .= " ORDER BY dataVencimento, c.idConpag DESC ";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 
            if ($linha['idFornecedor'] > 0) {
                $origem = 'Fornecedor';
                $nome = $linha['fornecedor'];
            } else if ($linha['idFuncionario'] > 0) {
                $origem = 'Funcionário';
                $nome = $linha['funcionario'];
            } else if ($linha['idVendedor'] > 0) {
                $origem = 'Marchand';
                $nome = $linha['vendedor'];
            } else if ($linha['idArtista'] > 0) {
                $origem = 'Artista';
                $nome = $linha['artista'];
            } else {
                $origem = 'Cliente';
                $nome = $linha['cliente'];
            }

            $situacao = '';

            if ($linha['qtdParcelas'] == $linha['qtdParcelasPagas']) {
                $idSituacao = 1;
                $situacao = 'Título Liquidado';
            } else {
                if ($linha['dataVencimento'] < $linha['dataAtual']) {
                    $idSituacao = 2;
                    $situacao = 'Em aberto (vencido)';
                } else {
                    $idSituacao = 0;
                    $situacao = 'Em aberto';
                }
            }

            $json[] = array(
                'codigo' => $linha['idConpag'],
                'titulo' => number_format_complete($linha['idConpag'], '0', '5'),
                'centroCusto' => $linha['centroCusto'],
                'natureza' => $linha['natureza'],
                'loja' => $linha['idLoja'],
                'origem' => $origem,
                'nome' => $nome,
                'qtdParcelas' => $linha['qtdParcelas'],
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'idSituacao' => $idSituacao,
                'situacao' => $situacao
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function PesquisarTitulos() {
    
    $db = ConectaDB();

    $sql = "SELECT c.idConpag, cc.centrocusto, n.natureza, f.fornecedor, c.valorTotal, c.qtdeParcelas,
        c.descricao, IFNULL(a.artista, '') AS artista, IFNULL(f.fornecedor, '') AS fornecedor,
        IFNULL(ff.funcionario, '') AS funcionario, IFNULL(v.vendedor, '') AS vendedor
        FROM conpag AS c
        INNER JOIN centro_custos AS cc ON cc.idCentroCusto = c.idCentroCusto
        INNER JOIN naturezas AS n ON n.idNatureza = c.idNatureza
        LEFT JOIN artistas AS a ON a.idArtista = c.idArtista
        LEFT JOIN fornecedores AS f ON f.idFornecedor = c.idFornecedor
        LEFT JOIN funcionarios AS ff ON ff.idFuncionario = c.idFuncionario
        LEFT JOIN vendedores AS v ON v.idVendedor = c.idVendedor
        WHERE c.del = 0 ";

    if ($_POST['idCentroCusto'] > 0) {
        $sql .= "AND c.idCentroCusto = " . $_POST['idCentroCusto'] . " ";
    }

    if ($_POST['idNatureza'] > 0) {
        $sql .= "AND c.idNatureza = " . $_POST['idNatureza'] . " ";
    }

    if ($_POST['origem'] === '1') {
        $sql .= "AND c.idArtista > 0 ";
    } else if ($_POST['origem'] === '2') {
        $sql .= "AND c.idFornecedor > 0 ";
    } else if ($_POST['origem'] === '3') {
        $sql .= "AND c.idFuncionario > 0 ";
    } else {
        $sql .= "AND c.idVendedor > 0 ";
    }

    if ($_POST['idOrigem'] > 0) {

        if ($_POST['origem'] === '1') {
            $sql .= "AND c.idArtista = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '2') {
            $sql .= "AND c.idFornecedor = " . $_POST['idOrigem'] . " ";
        } else if ($_POST['origem'] === '3') {
            $sql .= "AND c.idFuncionario = " . $_POST['idOrigem'] . " ";
        } else {
            $sql .= "AND c.idVendedor = " . $_POST['idOrigem'] . " ";
        }
    }

    $sql .= "ORDER BY cc.centrocusto, n.natureza";

    if ($_POST['origem'] === '1') {

        $sql .= ", a.artista";
    } else if ($_POST['origem'] === '2') {
        $sql .= ", f.fornecedor";
    } else if ($_POST['origem'] === '3') {
        $sql .= ", ff.funcionario";
    } else {
        $sql .= ", v.vendedor";
    }

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            $json[] = array(
                'codigo' => $linha['idConpag'],
                'codTitulo' => number_format_complete($linha['idConpag'], '0', '5'),
                'centroCusto' => $linha['centrocusto'],
                'natureza' => $linha['natureza'],
                'natureza' => $linha['natureza'],
                'artista' => $linha['artista'],
                'fornecedor' => $linha['fornecedor'],
                'funcionario' => $linha['funcionario'],
                'vendedor' => $linha['vendedor'],
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'qtdeParcelas' => $linha['qtdeParcelas'],
                'descricao' => $linha['descricao'],
                'origem' => $_POST['origem']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function ExcluirParcela() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE conpagparcelas SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . "
            WHERE idConpagParcela = " . $_POST['codParcela'];

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo 'OK';
    } else {
        echo 'ERRO';
    }

    $db->close();
}

function Excluir() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE conpag SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . "
            WHERE idConpag = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {

        $sql = "UPDATE conpagparcelas SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . "
                WHERE idConpag = " . $_POST['codigo'];

        $db->query( $sql );

        if ( $db->n_rows > 0 ) {
            echo 'OK';
        } else {
            echo 'ERRO';
        }
    }
    $db->close();
}

function SalvarParcela() {
    inicia_sessao();

    $db = ConectaDB();

    if ($_POST['dataPagamento'] == '- --- ') {
        $_POST['dataPagamento'] = '0000-00-00';
    }

    $sql = "conpagparcelas SET
idConpag = " . $_POST['idConpag'] . ", " .
            "data = '" . DataSSql($_POST['data']) . "', " .
            "dataVencimento = '" . DataSSql($_POST['dataVencimento']) . "', " .
            "valor = " . ValorE($_POST['valor']) . ", " .
            "numero = " . $_POST['numParcela'] . ", " .
            "toleranciaUltrapassada = " . $_POST['toleranciaUltrapassada'] . ", " .
            "idUsuario = " . $_SESSION['photoarts_codigo'] . ", " .
            "pago = " . $_POST['pago'] . ", " .
            "dataPago = '" . DataSSql($_POST['dataPagamento']) . "', " .
            "valorPago = " . ValorE($_POST['valorPago']) . ", " .
            "valorDesconto = " . ValorE($_POST['valorDesconto']) . ", " .
            "valorJuros = " . ValorE($_POST['valorJuros']) . ", " .
            "idConta = " . $_POST['conta'] . ", " .
            "idFormaPagamento = " . $_POST['formaPagamento'] . ", " .
            "idUsuarioPago = " . $_POST['pagoPor'] . ", " .
            "idUsuarioLancamentoPago = " . $_SESSION['photoarts_codigo'] . ", " .
            "obsPago = '" . $_POST['obsPagamento'] . "'";

    if ($_POST['idParcela'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW() WHERE idConpagParcela = " . $_POST['idParcela'];
    } else {
        $sql = "INSERT INTO " . $sql;
    }

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo 'OK';
    }else{
        echo 'ERRO';
    }
    $db->close();
}

function Salvar() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "conpag SET " .
            "idCentroCusto = " . $_POST['idCentroCusto'] . ", " .
            "idNatureza = " . $_POST['idNatureza'] . ", " .
            "idFornecedor = " . $_POST['idFornecedor'] . ", " .
            "idFuncionario = " . $_POST['idFuncionario'] . ", " .
            "idVendedor = " . $_POST['idVendedor'] . ", " .
            "idArtista = " . $_POST['idArtista'] . ", " .
            "idCliente = " . $_POST['idCliente'] . ", " . 
            "idLoja = " . $_POST['loja'] . ", " .
            "dataEmissao = '" . DataSSql($_POST['dataEmissao']) . "', " .
            "valorTotal = " . ValorE($_POST['valorTotal']) . ", " .
            "qtdeParcelas = " . ValorE($_POST['qtdeParcelas']) . ", " .
            "descricao = '" . $_POST['descricao'] . "', " .
            "mediaFixa = " . ValorE($_POST['mediaFixa']) . ", " .
            "tolerancia = " . ValorE($_POST['tolerancia']) . ", " .
            "idUsuario = " . $_SESSION['photoarts_codigo'] . " ";

    if ($_POST['codigoAtual'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW() WHERE idConpag = " . $_POST['codigoAtual'];
    } else {
        $sql = "INSERT INTO " . $sql . ", data = NOW() ";
    }

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {

        if ($_POST['codigoAtual'] > 0) {
            echo $_POST['codigoAtual'];
        } else {
            echo UltimoRegistroInserido($db);
        }
    } else {
        echo 'ERRO';
    }
    $db->close();
    
}

function MostrarParcelas() {

    $db = ConectaDB();

    $sql = "SELECT c.*, IFNULL(func.funcionario, '- - -') AS pagoPor, c.idUsuarioPago,
            IFNULL(f.formaPagamento, '- - -') AS formaPagamento, c.idFormaPagamento,
            IFNULL(cc.conta, '- - -') AS conta, c.idConta,
            IF(DATEDIFF(CURDATE(), c.dataVencimento) > 0, 1, 0) AS vencido
           FROM conpagparcelas AS c
           LEFT JOIN funcionarios AS func ON func.idFuncionario = c.idUsuarioPago
           LEFT JOIN formaspagamentos AS f ON f.idFormaPagamento = c.idFormaPagamento
           LEFT JOIN contas AS cc ON cc.idConta = c.idConta
           WHERE c.idConpag = " . $_POST['idConpag'] . "
           AND c.del = 0 ORDER BY c.numero";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '-1';
        return;
    }

    while ($linha = $db->fetch()) { 

        $json[] = array(
            'codigo' => $linha['idConpagParcela'],
            'data' => FormatData($linha['data'], false),
            'numero' => number_format_complete($linha['numero'], '0', '4'),
            'valor' => FormatMoeda($linha['valor']),
            'dataVencimento' => FormatData($linha['dataVencimento'], false),
            'toleranciaUltrapassada' => $linha['toleranciaUltrapassada'],
            'pago' => ($linha ['pago'] == '0' ? '- - -' : 'SIM'),
            'dataPago' => (isDate($linha['dataPago']) ? FormatData($linha['dataPago'], false) : '- - -'),
            'valorDesconto' => FormatMoeda($linha['valorDesconto']),
            'valorJuros' => FormatMoeda($linha['valorJuros']),
            'valorPago' => FormatMoeda($linha['valorPago']),
            'pagoPor' => $linha['pagoPor'],
            'idUsuarioPago' => $linha['idUsuarioPago'],
            'formaPagamento' => $linha['formaPagamento'],
            'idFormaPagamento' => $linha['idFormaPagamento'],
            'idConta' => $linha['idConta'],
            'conta' => $linha['conta'],
            'obsPago' => $linha['obsPago'],
            'vencido' => $linha['vencido']
        );
    }

    echo json_encode($json);
    $db->close();
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT idLoja, idConpag, idCentroCusto, idNatureza, idFornecedor, idFuncionario, idVendedor, idArtista, 
            idCliente, data, valorTotal, valorTotalPago, qtdeParcelas, descricao, mediafixa, tolerancia
           FROM conpag WHERE idConpag = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
        return;
    }

    $linha = $db->fetch();

    $json = array(
        'codigo' => $linha['idConpag'],
        'centrocusto' => $linha['idCentroCusto'],
        'natureza' => $linha['idNatureza'],
        'loja' => $linha['idLoja'],
        'fornecedor' => $linha['idFornecedor'],
        'idFuncionario' => $linha['idFuncionario'],
        'idVendedor' => $linha['idVendedor'],
        'idArtista' => $linha['idArtista'],
        'idCliente' => $linha['idCliente'],
        'data' => FormatData($linha['data'], false),
        'valorTotal' => FormatMoeda($linha['valorTotal']),
        'valorTotalPago' => FormatMoeda($linha['valorTotalPago']),
        'qtdeParcelas' => $linha['qtdeParcelas'],
        'descricao' => $linha['descricao'],
        'mediafixa' => FormatMoeda($linha['mediafixa']),
        'tolerancia' => FormatMoeda($linha['tolerancia'])
    );

    echo json_encode($json);
    $db->close();
}
