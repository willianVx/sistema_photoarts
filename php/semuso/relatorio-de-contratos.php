<?php

include('jujuba.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarContratos':
            MostrarContratos();
            break;
    }
}

function MostrarContratos() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT 
            IFNULL((SELECT SUM(valorPago) FROM contratos_pagamentos 
            WHERE del = 0 AND idContrato = c.idContrato AND pago = 1),0) AS valorPago,
            c.idContrato, getPendenciasContrato(c.idContrato) AS pendencia, LPAD(c.idContrato, 5, '0') AS contrato, LEFT(c.dataCadastro, 10) AS dataCadastro, c.cancelado, c.idContrato, cl.razaoSocial, 
            l.nomeLocal, p.nomePacote, IFNULL(d.nomeDecoracao,'SEM DECORAÇÃO') AS nomeDecoracao, tf.tipoFesta, c.tituloFesta, CURDATE() AS dataAtual, 
            CONCAT(DATE_FORMAT(c.dataFesta, '%d/%m/%Y'), ' das ', LEFT(c.horaDe, 5), ' as ', LEFT(c.horaAte, 5)) AS dataFesta, c.valor, c.valorOpcionais, 
            c.valorDesconto, c.valorTotal, c.percDesconto, c.contratoImpresso, c.contratoEmail, 
            (SELECT IFNULL(SUM(valorPago), '0.00') FROM contratos_pagamentos WHERE idContrato = c.idContrato LIMIT 1) AS valorPago,
            (SELECT COUNT(*) FROM contratos_pagamentos WHERE idContrato = c.idContrato AND pago = 0 AND dataVencimento < CURDATE() LIMIT 1) AS qtdEmAtraso 
            FROM contratos AS c
            LEFT JOIN clientes AS cl ON cl.idCliente = c.idCliente
            LEFT JOIN locais AS l ON l.idLocal = c.idLocal
            LEFT JOIN pacotes AS p ON p.idPacote = c.idPacote
            LEFT JOIN decoracoes AS d ON d.idDecoracao = c.idDecoracao
            LEFT JOIN tipos_festas AS tf ON tf.idTipoFesta = c.idTipoFesta
            WHERE TRUE ";

    if ($_POST['clientes'] > 0) {
        $sql .= " AND cl.idCliente = " . $_POST['clientes'];
    }

    if ($_POST['local'] > 0) {
        $sql .= " AND l.idLocal = " . $_POST['local'];
    }

    if ($_POST['pacote'] > 0) {
        $sql .= " AND  p.idPacote = " . $_POST['pacote'];
    }

    if ($_POST['de'] !== "") {
        $sql .= " AND DATE(c.dataCadastro) >= DATE('" . DataSSql($_POST['de']) . "') ";
    }

    if ($_POST['ate'] !== "") {
        $sql .= " AND DATE(c.dataCadastro) <= DATE('" . DataSSql($_POST['ate']) . "') ";
    }

    if ($_POST['compendencias'] == "true") {
        $sql .= " AND getPendenciasContrato(c.idContrato) > 0 ";
    }

    if($_POST['situacao'] === '2'){
        $sql .= " AND c.cancelado = 0 AND c.dataFesta > CURDATE()";
    }else if($_POST['situacao'] === '3'){
        $sql .= " AND c.cancelado = 0 AND c.dataFesta < CURDATE()";
     }else if($_POST['situacao'] === '4'){
        $sql .= " AND c.cancelado = 1 ";
    }

    if ($_POST['emaberto'] == "true") {
        $sql .= " HAVING valorTotal > valorPago ";
    }

    $sql .= " ORDER BY  dataCadastro";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0'; 
        return;
    }

    while ($linha = $db->fetch()) {

        if ($linha['cancelada'] === '1') {
            $situacao = "Cotação Cancelada";
        } else {

            if ($linha['idContrato'] > '0') {
                $situacao = "Gerado Contrato";
            } else {
                $dataAtual = date('Y') . "-" . date('m') . "-" . date('d');
                $dataCadastro = date("Y-m-d", strtotime("+ 30 days", strtotime($linha['dataCadastro'])));

                if ($dataAtual > $dataCadastro) {
                    $situacao = "Cotação Vencida";
                } else {
                    $situacao = "Cotação em Aberto";
                }
            }
        }

        $json[] = array(
            'idContrato' => $linha['idContrato'],
            'contrato' => $linha['contrato'],
            'dataCadastro' => FormatData($linha['dataCadastro'], true),
            'razaoSocial' => $linha['razaoSocial'],
            'nomeLocal' => $linha['nomeLocal'],
            'nomePacote' => $linha['nomePacote'],
            'nomeDecoracao' => $linha['nomeDecoracao'],
            'tipoFesta' => $linha['tipoFesta'],
            'tituloFesta' => $linha['tituloFesta'],
            'dataFesta' => $linha['dataFesta'],
            'valor' => "R$ " . FormatMoeda($linha['valor']),
            'valorOpcionais' => "R$ " . FormatMoeda($linha['valorOpcionais']),
            'valorTotal' => "R$ " . FormatMoeda($linha['valorTotal']),
            'situacao' => $situacao,
            'pendencia' => $linha['pendencia'],
            'saldo' => (($linha['valorTotal'] - $linha['valorPago']) < 0 ? "0,00" : FormatMoeda($linha['valorTotal'] - $linha['valorPago'])),
            'valorPago' =>  "R$ " . FormatMoeda($linha['valorPago']),
            'arrayOpcionais' => MostrarOpcionais($ArqT, 0, $linha['idContrato']),
            'listapendencia' => ($linha['pendencia'] == "1" ? getPendenciasContrato($ArqT, $linha['idContrato'], 0) : "")
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostrarOpcionais($ArqT, $idCotacao, $idContrato) {

    if ($idCotacao > '0') {

        $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, 
            cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, cc.idCardapioGrupo, cc.idCardapioItem, cc.idCotacaoComp, cg.nomeGrupo 
            FROM cotacoes_comp AS cc
            LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
            LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
            LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
            LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
            WHERE cc.idCotacao = " . $idCotacao . " AND cc.idPacote = 0 AND cc.del = 0";
    } else if ($idContrato > '0') {

        $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, 
            cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, cc.idCardapioGrupo, cc.idCardapioItem, cc.idContratoComp, cg.nomeGrupo 
            FROM contratos_comp AS cc
            LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
            LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
            LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
            LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
            WHERE cc.idContrato = " . $idContrato . " AND cc.idPacote = 0 AND cc.del = 0";
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        return '0';
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($linha['nomeOpcional'] !== '') {
            $tipo = 'Opcional';
            $tipoOpcional = $linha['nomeOpcional'];
        } else if ($linha['nomeDecoracao'] !== '') {
            $tipo = 'Decoração';
            $tipoOpcional = $linha['nomeDecoracao'];
        } else if ($linha['nomeItem'] !== '') {
            $tipo = 'Ítem Cardápio';
            $tipoOpcional = 'GRUPO: ' . $linha['nomeGrupo'] . ' - ÍTEM: ' . $linha['nomeItem'];
        }

        $json[] = array(
            'idCotacaoComp' => $linha['idCotacaoComp'],
            'idContratoComp' => $linha['idContratoComp'],
            'tipo' => $tipo,
            'tipoOpcional' => $tipoOpcional,
            'qtd' => $linha['qtd'],
            'valor' => FormatMoeda($linha['valor']),
            'valorTotal' => FormatMoeda($linha['valorTotal']),
            'idOpcional' => $linha['idOpcional'],
            'idDecoracao' => $linha['idDecoracao'],
            'idCardapioGrupo' => $linha['idCardapioGrupo'],
            'idCardapioItem' => $linha['idCardapioItem']
        );
    }

    return json_encode($json);
}
