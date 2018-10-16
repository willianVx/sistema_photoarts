<?php

include('jujuba.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarContratos':
            MostrarContratos();
            break;

        case 'MostrarOpcionais':
            MostrarOpcionaisPrompt();
            break;
    }
}

function MostrarContratos() {

    $ArqT = AbreBancoJujuba();
    
    $sql = "SELECT  
           (SELECT COUNT(*) AS total FROM contratos_comp WHERE idOpcional > 0 AND del = 0 AND idContrato = c.idContrato) AS qtdopcional,
           (SELECT cor FROM cores WHERE codigo = DAY(c.dataFesta)) AS cor,  c.idPacote, c.dataFesta AS diaFesta, 
           CONCAT(LEFT(c.horaDe, 5), ' às ', LEFT(c.horaAte, 5)) AS horaFesta, c.valor, c.valorOpcionais, DAYOFWEEK(c.dataFesta) AS diaSemana,
            IFNULL((SELECT SUM(valorPago) FROM contratos_pagamentos 
            WHERE del = 0 AND idContrato = c.idContrato AND pago = 1),0) AS valorPago,
            c.idContrato, getPendenciasContrato(c.idContrato) AS pendencia, LPAD(c.idContrato, 5, '0') AS contrato, LEFT(c.dataCadastro, 10) AS dataCadastro, c.cancelado, c.idContrato, cl.razaoSocial, 
            l.nomeLocal, p.nomePacote, IFNULL(d.nomeDecoracao,'PENDENTE') AS nomeDecoracao, tf.tipoFesta, c.tituloFesta, 
            (c.qtdePagantes + c.qtdeNaoPagantes) AS qtdPessoas, c.qtdePagantes, c.qtdeNaoPagantes, CURDATE() AS dataAtual, c.obs, c.obsInterna,
            c.valorDesconto, c.valorTotal, c.percDesconto, c.contratoImpresso, c.contratoEmail, 
            (SELECT IFNULL(SUM(valorPago), '0.00') FROM contratos_pagamentos WHERE idContrato = c.idContrato LIMIT 1) AS valorPago,
            (SELECT COUNT(*) FROM contratos_pagamentos WHERE idContrato = c.idContrato AND pago = 0 AND dataVencimento < CURDATE() LIMIT 1) AS qtdEmAtraso, 
            IFNULL((SELECT GROUP_CONCAT(nomeConvidado) FROM contratos_listas WHERE idContrato = c.idContrato AND idTipoConvidado = 2 AND del = 0),'') AS nomePai, 
            IFNULL((SELECT GROUP_CONCAT(nomeConvidado) FROM contratos_listas WHERE idContrato = c.idContrato AND idTipoConvidado = 3 AND del = 0),'') AS nomeMae, 
            IFNULL((SELECT GROUP_CONCAT(nomeConvidado) FROM contratos_listas WHERE idContrato = c.idContrato AND idTipoConvidado = 4 AND del = 0),'') AS irmaos, 
            c.qtdeAdultosPagantes, c.qtdeAdultosNaoPagantes, c.qtdeCriancasPagantes, c.qtdeCriancasNaoPagantes, c.dataNascimentoFesta, c.obsInterna, l.logo 
            FROM contratos AS c
            LEFT JOIN clientes AS cl ON cl.idCliente = c.idCliente
            LEFT JOIN locais AS l ON l.idLocal = c.idLocal
            LEFT JOIN pacotes AS p ON p.idPacote = c.idPacote
            LEFT JOIN decoracoes AS d ON d.idDecoracao = c.idDecoracao
            LEFT JOIN tipos_festas AS tf ON tf.idTipoFesta = c.idTipoFesta
            WHERE c.cancelado = 0 AND c.dataFesta >= CURDATE()  
            AND c.dataFesta <= DATE_ADD(CURDATE(), INTERVAL " . $_POST['dias'] . " DAY)";

    if ($_POST['local'] > 0) {
        $sql .= " AND l.idLocal = " . $_POST['local'];
    }
    
    if ($_POST['idContrato'] > 0) {
        $sql .= " AND c.idContrato = " . $_POST['idContrato'];
    }

    $sql .= " ORDER BY c.dataFesta, c.horaDe, c.horaAte LIMIT 50";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'pagantes' => $linha['qtdePagantes'],
            'naopagantes' => $linha['qtdeNaoPagantes'],
            'qtdopcional' => $linha['qtdopcional'],
            'obsInterna' => ($linha['obsInterna'] == '' ? "NENHUMA" : $linha['obsInterna']),
            'cor' => $linha['cor'],
            'idPacote' => $linha['idPacote'],
            'diaFesta' => FormatData($linha['diaFesta'], false),
            'horaFesta' => $linha['horaFesta'],
            'diaSemana' => getNomeDiaSemana($linha['diaSemana']),
            'idContrato' => $linha['idContrato'],
            'contrato' => $linha['contrato'],
            'dataCadastro' => FormatData($linha['dataCadastro'], true),
            'razaoSocial' => $linha['razaoSocial'],
            'nomeLocal' => $linha['nomeLocal'],
            'nomePacote' => $linha['nomePacote'],
            'nomeDecoracao' => $linha['nomeDecoracao'],
            'tipoFesta' => $linha['tipoFesta'],
            'tituloFesta' => $linha['tituloFesta'],
            'qtdPessoas' => $linha['qtdPessoas'],
            'obs' => ($linha['obs'] == '' ? "NENHUMA" : $linha['obs']),
            'obsInterna' => ($linha['obsInterna'] == '' ? "NENHUMA" : $linha['obsInterna']),
            'valor' => "R$ " . FormatMoeda($linha['valor']),
            'valorOpcionais' => "R$ " . FormatMoeda($linha['valorOpcionais']),
            'valorTotal' => "R$ " . FormatMoeda($linha['valorTotal']),
            'pendencia' => $linha['pendencia'],
            'saldo' => (($linha['valorTotal'] - $linha['valorPago']) < 0 ? "0,00" : FormatMoeda($linha['valorTotal'] - $linha['valorPago'])),
            'valorPago' => "R$ " . FormatMoeda($linha['valorPago']),
            'nomePai' => $linha['nomePai'],
            'nomeMae' => $linha['nomeMae'],
            'irmaos' => $linha['irmaos'],
            'arrayOpcionais' => MostrarOpcionais($ArqT, 0, $linha['idContrato']),
            'listapendencia' => ($linha['pendencia'] == "1" ? getPendenciasContrato($ArqT, $linha['idContrato'], 1) : ""),
            'qtdeAdultosPagantes' => $linha['qtdeAdultosPagantes'], 
            'qtdeAdultosNaoPagantes' => $linha['qtdeAdultosNaoPagantes'], 
            'qtdeCriancasPagantes' => $linha['qtdeCriancasPagantes'], 
            'qtdeCriancasNaoPagantes' => $linha['qtdeCriancasNaoPagantes'],
            'dataNascimentoFesta' => FormatData($linha['dataNascimentoFesta']),
            'logoLocal' => $linha['logo']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostrarOpcionais($ArqT, $idCotacao, $idContrato) {

    if ($idCotacao > '0') {

        $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, 
            IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, 
            cc.idCardapioGrupo, cc.idCardapioItem, cc.idCotacaoComp, cg.nomeGrupo, cc.ok, o.externo 
            FROM cotacoes_comp AS cc
            LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
            LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
            LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
            LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
            WHERE cc.idCotacao = " . $idCotacao . " AND cc.idPacote = 0 AND cc.del = 0";
    } else if ($idContrato > '0') {

        $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, 
            IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, 
            cc.idCardapioGrupo, cc.idCardapioItem, cc.idContratoComp, cg.nomeGrupo, cc.ok, o.externo 
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
            $tipoOpcional = $linha['nomeOpcional'] . ' (Qtde: ' . $linha['qtd'] . ($linha['externo'] == '1' ? ($linha['ok'] == '1' ? ' - OK' : ' - Pendente') : '') . ')';
            //$tipoOpcional = $linha['nomeOpcional'] . ' (Qtde: ' . $linha['qtd'] . ($linha['externo'] == '1' ? ($linha['ok'] == '1' ? ' - <label id=div-' . $linha['idContratoComp'] . '><span id=' . $linha['idContratoComp'] . ' title="Clique para marcar o opcional como Pendente" style="text-decoration:underline; cursor:pointer;" onclick="SetarOpcionalOk(' . $idContrato . ', ' . $linha['idContratoComp'] . ', 0);">OK</span></label>' : ' - <label id=div-' . $linha['idContratoComp'] . '><span id=' . $linha['idContratoComp'] . ' title="Clique para marcar o opcional como OK" style="text-decoration:underline; cursor:pointer;" onclick="SetarOpcionalOk(' . $idContrato . ', ' . $linha['idContratoComp'] . ', 1);">Pendente</span></label>') : '') . ')';
        } else if ($linha['nomeDecoracao'] !== '') {
            $tipo = 'Decoração';
            $tipoOpcional = $linha['nomeDecoracao'] . ' (Qtde: ' . $linha['qtd'] . ')';
        } else if ($linha['nomeItem'] !== '') {
            $tipo = 'Ítem Cardápio';
            $tipoOpcional = 'GRUPO: ' . $linha['nomeGrupo'] . ' - ÍTEM: ' . $linha['nomeItem'] . ' (Qtde: ' . $linha['qtd'] . ')';
        }

        $json[] = array(
            'idContrato' => $idContrato,
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
            'idCardapioItem' => $linha['idCardapioItem'],
            'externo' => $linha['externo']
        );
    }

    return json_encode($json);
}

function MostrarOpcionaisPrompt() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, 
        IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, 
        cc.idCardapioGrupo, cc.idCardapioItem, cc.idContratoComp, cg.nomeGrupo, cc.ok, o.externo, 
        IFNULL(cc.obsOk, '') AS obsOk 
        FROM contratos_comp AS cc
        LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
        LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
        LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
        LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
        WHERE cc.idContrato = " . $_POST['idContrato'] . " AND cc.idPacote = 0 AND cc.del = 0";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        return '0';
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($linha['nomeOpcional'] !== '') {
            $tipo = 'Opcional';
            $tipoOpcional = $linha['nomeOpcional'] . ' (Qtde: ' . $linha['qtd'] . ($linha['externo'] == '1' ? ($linha['ok'] == '1' ? ' - OK' : ' - Pendente') : '') . ')';
            //$tipoOpcional = $linha['nomeOpcional'] . ' (Qtde: ' . $linha['qtd'] . ($linha['externo'] == '1' ? ($linha['ok'] == '1' ? ' - <label id=div-' . $linha['idContratoComp'] . '><span id=' . $linha['idContratoComp'] . ' title="Clique para marcar o opcional como Pendente" style="text-decoration:underline; cursor:pointer;" onclick="SetarOpcionalOk(' . $idContrato . ', ' . $linha['idContratoComp'] . ', 0);">OK</span></label>' : ' - <label id=div-' . $linha['idContratoComp'] . '><span id=' . $linha['idContratoComp'] . ' title="Clique para marcar o opcional como OK" style="text-decoration:underline; cursor:pointer;" onclick="SetarOpcionalOk(' . $idContrato . ', ' . $linha['idContratoComp'] . ', 1);">Pendente</span></label>') : '') . ')';
        } else if ($linha['nomeDecoracao'] !== '') {
            $tipo = 'Decoração';
            $tipoOpcional = $linha['nomeDecoracao'] . ' (Qtde: ' . $linha['qtd'] . ')';
        } else if ($linha['nomeItem'] !== '') {
            $tipo = 'Ítem Cardápio';
            $tipoOpcional = 'GRUPO: ' . $linha['nomeGrupo'] . ' - ÍTEM: ' . $linha['nomeItem'] . ' (Qtde: ' . $linha['qtd'] . ')';
        }

        $json[] = array(
            'idContrato' => $idContrato,
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
            'idCardapioItem' => $linha['idCardapioItem'],
            'externo' => $linha['externo'],
            'obsOk' => $linha['obsOk']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getNomeDiaSemana($dia) {

    switch ($dia) {
        case '1':
            return "Domingo";
        case '2':
            return "Segunda";
        case '3':
            return "Terça";
        case '4':
            return "Quarta";
        case '5':
            return "Quinta";
        case '6':
            return "Sexta";
        case '7':
            return "Sábado";
    }
}
