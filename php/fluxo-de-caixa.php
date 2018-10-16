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

    /* $sql = "SELECT 
      (SELECT LAST_DAY(DATE_SUB('" . DataSSql($_POST['de']) . "', INTERVAL 1 MONTH))) AS ultimoDiaMes,
      (SELECT IFNULL(SUM(valorPago),0) FROM conpag_parcelas WHERE pago = 1 AND del = 0 AND dataPago BETWEEN 0000-00-00 AND ultimoDiaMes) AS valorPago,
      (SELECT IFNULL(SUM(valor),0) FROM clientes_contratos_mensalidades WHERE pago = 1 AND del = 0 AND dataPagamento BETWEEN 0000-00-00 AND ultimoDiaMes) AS valorRecebido,
      (SELECT (valorRecebido - valorPago)) AS saldoAnterior"; */

    $sql = "SELECT 
            (SELECT LAST_DAY(DATE_SUB('" . DataSSql($_POST['de']) . "', INTERVAL 1 MONTH))) AS ultimoDiaMes,
            (SELECT IFNULL(SUM(valorPago),0) FROM conpagparcelas 
            INNER JOIN conpag ON conpag.idConpag = conpagparcelas.idConpag 
            WHERE " . ($_POST['loja'] > 0 ? " conpag.idLoja = " . $_POST['loja'] . " AND " : "") . " pago = 1 AND conpagparcelas.del = 0 
            AND dataPago BETWEEN '" . DataSSql($_POST['de']) . "' AND ultimoDiaMes) AS valorPago,
            (SELECT IFNULL(SUM(vendas_parcelas.valor),0) FROM vendas_parcelas  
            INNER JOIN vendas ON vendas.idVenda = vendas_parcelas.idVenda 
            WHERE " . ($_POST['loja'] > 0 ? " vendas.idLoja = " . $_POST['loja'] . " AND " : "") . "  vendas_parcelas.valor > 0 AND vendas_parcelas.del = 0 
            AND dataCompensacao BETWEEN '" . DataSSql($_POST['de']) . "' AND ultimoDiaMes) AS valorRecebido,
            (SELECT (valorRecebido - valorPago)) AS saldoAnterior";

    $db->query( $sql );
    $result = $db->fetch();

    $saldoAnterior = $result["saldoAnterior"];
    $ultimoDiaMes = $result["ultimoDiaMes"];

    if ($_POST['debitos'] === 'true') {

        $sql = "SELECT IFNULL(l.loja,'') AS loja, cp.dataPago, cp.numero AS numParcela, 
                CONCAT('Pagamento Parcela N°', cp.numero, ' - ', IFNULL(n.natureza, '')) AS descricao, 
                IFNULL(f.razaoFornecedor, '') AS fornecedor, IFNULL(fu.funcionario, '') AS funcionario, 
                IFNULL(v.vendedor, '') AS vendedor, IFNULL(a.artista, '') AS artista, cp.valorPago, 1 AS debito
                FROM conpagparcelas AS cp
                INNER JOIN conpag AS c ON c.idConpag = cp.idConpag
                LEFT JOIN lojas AS l ON l.idLoja = c.idLoja
                LEFT JOIN naturezas AS n ON n.idNatureza = c.idNatureza
                LEFT JOIN fornecedores AS f ON f.idFornecedor = c.idFornecedor
                LEFT JOIN funcionarios AS fu ON fu.idFuncionario = c.idFuncionario
                LEFT JOIN vendedores AS v ON v.idVendedor = c.idVendedor
                LEFT JOIN artistas AS a ON a.idArtista = c.idArtista
                WHERE cp.pago = 1 AND cp.del = 0 
                AND cp.dataPago BETWEEN '" . DataSSql($_POST['de']) . "' AND '" . DataSSql($_POST['ate']) . "'";

        if ($_POST['loja'] > 0)
            $sql .= " AND c.idLoja = " . $_POST['loja'] . " ";

        if ($_POST['debitos'] === 'true' && $_POST['creditos'] === 'false') {

            $sql .= " ORDER BY dataPago";
        }
    }

    if ($_POST['debitos'] === 'true' && $_POST['creditos'] === 'true') {

        $sql .= " UNION ALL
                SELECT IFNULL(l.loja,'') AS loja, vp.dataCompensacao AS dataPago, vp.parcela AS numParcela, 
                CONCAT('Recebimento da Venda N° ', LPAD(vp.idVenda, 5, '0'), ' | Colecionador: ', c.cliente) AS descricao,
                '' AS fornecedor, '' AS funcionario, '' AS vendedor, '' AS artista, 
                vp.valor AS valorPago, 0 AS debito
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda) 
                LEFT JOIN lojas AS l ON l.idLoja = v.idLoja
                LEFT JOIN clientes AS c USING(idCliente)
                WHERE vp.valor > 0 AND vp.del = 0 
                AND vp.dataCompensacao BETWEEN '" . DataSSql($_POST['de']) . "' "
                . "AND '" . DataSSql($_POST['ate']) . "' AND vp.idVendaParcelaAntecipacao <= 0 ";

        if ($_POST['loja'] > 0)
            $sql .= " AND v.idLoja = " . $_POST['loja'] . " ";

        $sql .= "UNION ALL
                SELECT '' AS loja, ra.data AS dataPago, 0 AS numParcela, ra.descricao, '' AS fornecedor, 
                '' AS funcionario, '' AS vendedor, '' AS artista, ra.valor AS valorPago, 0 AS debito 
                FROM receitas_avulsas AS ra
                INNER JOIN vendas_parcelas_antecipacoes AS vpa USING(idVendaParcelaAntecipacao) 
                INNER JOIN vendas_parcelas AS vp ON vp.idVendaParcelaAntecipacao = vpa.idVendaParcelaAntecipacao
                INNER JOIN vendas AS v ON v.idVenda = vp.idVenda
                WHERE ra.del = 0 AND ra.idVendaParcelaAntecipacao > 0 
                AND ra.data BETWEEN '" . DataSSql($_POST['de']) . "' AND '" . DataSSql($_POST['ate']) . "' ";

        if ($_POST['loja'] > 0)
            $sql .= " AND v.idLoja = " . $_POST['loja'] . " ";

        $sql .= " GROUP BY vp.idVenda ";

        $sql .= " ORDER BY dataPago";
    } else if ($_POST['creditos'] === 'true' && $_POST['debitos'] === 'false') {

        $sql = "SELECT IFNULL(l.loja,'') AS loja, vp.dataCompensacao AS dataPago, vp.parcela AS numParcela, 
                CONCAT('Recebimento da Venda N° ', LPAD(vp.idVenda, 5, '0'), ' | Colecionador: ', c.cliente) AS descricao,
                '' AS fornecedor, '' AS funcionario, '' AS vendedor, '' AS artista, 
                vp.valor AS valorPago, 0 AS debito
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda) 
                LEFT JOIN lojas AS l ON l.idLoja = v.idLoja
                LEFT JOIN clientes AS c USING(idCliente)
                WHERE vp.valor > 0 AND vp.del = 0 
                AND vp.dataCompensacao BETWEEN '" . DataSSql($_POST['de']) . "' "
                . "AND '" . DataSSql($_POST['ate']) . "' AND vp.idVendaParcelaAntecipacao <= 0 ";

        if ($_POST['loja'] > 0)
            $sql .= " AND v.idLoja = " . $_POST['loja'] . " ";

        $sql .= " ORDER BY dataPago";
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            if ($linha['debito'] === '1') {

                $descricao = $linha['descricao'];

                if ($linha['fornecedor'] != '') {

                    $descricao .= ' | Fornecedor: ' . $linha['fornecedor'];
                } else if ($linha['funcionario'] != '') {

                    $descricao .= ' | Funcionário: ' . $linha['funcionario'];
                } else if ($linha['vendedor'] != '') {

                    $descricao .= ' | Marchand: ' . $linha['vendedor'];
                } else {

                    $descricao .= ' | Artista: ' . $linha['artista'];
                }
            } else {

                $descricao = $linha['descricao'];
            }

            $json[] = array(
                'ultimoDiaMes' => FormatData($ultimoDiaMes),
                'saldoAnterior' => FormatMoeda($saldoAnterior),
                'loja' => $linha['loja'],
                'dataPago' => FormatData($linha['dataPago'], false),
                'valorPago' => FormatMoeda($linha['valorPago']),
                'debito' => $linha['debito'],
                'descricao' => $descricao
            );
        }

        echo json_encode($json);
    }
    $db = ConectaDB();
}

function ExportarPlanilha() {

    inicia_sessao();
    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT 
            (SELECT LAST_DAY(DATE_SUB('" . DataSSql($_POST['de']) . "', INTERVAL 1 MONTH))) AS ultimoDiaMes,
            (SELECT IFNULL(SUM(valorPago),0) FROM conpagparcelas 
            INNER JOIN conpag ON conpag.idConpag = conpagparcelas.idConpag 
            WHERE " . ($_POST['loja'] > 0 ? " conpag.idLoja = " . $_POST['loja'] . " AND " : "") . " pago = 1 AND conpagparcelas.del = 0 
            AND dataPago BETWEEN '" . DataSSql($_POST['de']) . "' AND ultimoDiaMes) AS valorPago,
            (SELECT IFNULL(SUM(vendas_parcelas.valor),0) FROM vendas_parcelas  
            INNER JOIN vendas ON vendas.idVenda = vendas_parcelas.idVenda 
            WHERE " . ($_POST['loja'] > 0 ? " vendas.idLoja = " . $_POST['loja'] . " AND " : "") . "  vendas_parcelas.valor > 0 AND vendas_parcelas.del = 0 
            AND dataCompensacao BETWEEN '" . DataSSql($_POST['de']) . "' AND ultimoDiaMes) AS valorRecebido,
            (SELECT (valorRecebido - valorPago)) AS saldoAnterior";

    $db->query( $sql );
    $result = $db->fetch();

    $saldoAnterior = $result["saldoAnterior"];
    $ultimoDiaMes = $result["ultimoDiaMes"];
    $num = $_SESSION['photoarts_codigo'];

    $newPath = '../relatorio-de-fluxo-de-caixa-user-' . $num . '.xls';
    $newPathReturn = './relatorio-de-fluxo-de-caixa-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false) {
        echo $excel->error;
    }

    $arr = array('DATA', 'LOJA', 'DESCRIÇÃO', 'VALOR', 'SALDO');
    $excel->writeLine($arr);

    $arr = array(FormatData($ultimoDiaMes), '', 'SALDO ANTERIOR', '', FormatMoeda($saldoAnterior));
    $excel->writeLine($arr);

    if ($_POST['debitos'] === 'true') {

        $sql = "SELECT IFNULL(l.loja,'') AS loja, cp.dataPago, cp.numero AS numParcela, 
                CONCAT('Pagamento Parcela N°', cp.numero, ' - ', IFNULL(n.natureza, '')) AS descricao, 
                IFNULL(f.razaoFornecedor, '') AS fornecedor, IFNULL(fu.funcionario, '') AS funcionario, 
                IFNULL(v.vendedor, '') AS vendedor, IFNULL(a.artista, '') AS artista, cp.valorPago, 1 AS debito
                FROM conpagparcelas AS cp
                INNER JOIN conpag AS c ON c.idConpag = cp.idConpag
                LEFT JOIN lojas AS l ON l.idLoja = c.idLoja
                LEFT JOIN naturezas AS n ON n.idNatureza = c.idNatureza
                LEFT JOIN fornecedores AS f ON f.idFornecedor = c.idFornecedor
                LEFT JOIN funcionarios AS fu ON fu.idFuncionario = c.idFuncionario
                LEFT JOIN vendedores AS v ON v.idVendedor = c.idVendedor
                LEFT JOIN artistas AS a ON a.idArtista = c.idArtista
                WHERE cp.pago = 1 AND cp.del = 0 
                AND cp.dataPago BETWEEN '" . DataSSql($_POST['de']) . "' AND '" . DataSSql($_POST['ate']) . "'";

        if ($_POST['loja'] > 0)
            $sql .= " AND c.idLoja = " . $_POST['loja'] . " ";

        if ($_POST['debitos'] === 'true' && $_POST['creditos'] === 'false') {

            $sql .= " ORDER BY dataPago";
        }
    }

    if ($_POST['debitos'] === 'true' && $_POST['creditos'] === 'true') {

        $sql .= " UNION ALL
                SELECT  IFNULL(l.loja,'') AS loja, vp.dataCompensacao AS dataPago, vp.parcela AS numParcela, 
                CONCAT('Recebimento da Venda N° ', LPAD(vp.idVenda, 5, '0'), ' | Colecionador: ', c.cliente) AS descricao,
                '' AS fornecedor, '' AS funcionario, '' AS vendedor, '' AS artista, 
                vp.valor AS valorPago, 0 AS debito
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda) 
                LEFT JOIN lojas AS l ON l.idLoja = v.idLoja
                LEFT JOIN clientes AS c USING(idCliente)
                WHERE vp.valor > 0 AND vp.del = 0 
                AND vp.dataCompensacao BETWEEN '" . DataSSql($_POST['de']) . "' "
                . "AND '" . DataSSql($_POST['ate']) . "' ";

        if ($_POST['loja'] > 0)
            $sql .= " AND v.idLoja = " . $_POST['loja'] . " ";

        $sql .= " ORDER BY dataPago";
    } else if ($_POST['creditos'] === 'true' && $_POST['debitos'] === 'false') {

        $sql = "SELECT IFNULL(l.loja,'') AS loja, vp.dataCompensacao AS dataPago, vp.parcela AS numParcela, 
                CONCAT('Recebimento da Venda N° ', LPAD(vp.idVenda, 5, '0'), ' | Colecionador: ', c.cliente) AS descricao,
                '' AS fornecedor, '' AS funcionario, '' AS vendedor, '' AS artista, 
                vp.valor AS valorPago, 0 AS debito
                FROM vendas_parcelas AS vp
                INNER JOIN vendas AS v USING(idVenda) 
                LEFT JOIN lojas AS l ON l.idLoja = v.idLoja
                LEFT JOIN clientes AS c USING(idCliente)
                WHERE vp.valor > 0 AND vp.del = 0 
                AND vp.dataCompensacao BETWEEN '" . DataSSql($_POST['de']) . "' "
                . "AND '" . DataSSql($_POST['ate']) . "' ";

        if ($_POST['loja'] > 0)
            $sql .= " AND v.idLoja = " . $_POST['loja'] . " ";

        $sql .= " ORDER BY dataPagoo";
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '-1';
    }else{
        while ($linha = $db->fetch()) {

            if ($linha['debito'] == '1') {
                $valor = '-' . $linha['valorPago'];
                $valorPago = '-' . FormatMoeda($linha['valorPago']);
            } else {
                $valor = $linha['valorPago'];
                $valorPago = FormatMoeda($linha['valorPago']);
            }

            $total += $valor;

            $arr = array(
                FormatData($linha['dataPago'], false),
                $linha['loja'],
                $linha['descricao'],
                $valorPago,
                ''
            );

            $excel->writeLine($arr);
        }

        $arr = array(
            '',
            '',
            'SALDO FINAL',
            '',
            FormatMoeda($total)
        );

        $excel->writeLine($arr);

        $excel->close();
        echo $newPathReturn;
    }
    $db->close();
}