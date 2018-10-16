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

    $sql = "SELECT c.idContrato, LPAD(c.idContrato, 5, '0') AS contrato, c.dataFesta, LEFT(c.horaDe, 5) AS horaDe, 
            LEFT(c.horaAte, 5) AS horaAte, 
            IFNULL(cl.razaoSocial, cl.fantasia) AS cliente, l.nomeLocal, p.nomePacote, 
            (SELECT COUNT(*) FROM contratos_comp AS cc
            INNER JOIN opcionais AS o ON o.idOpcional = cc.idOpcional AND o.externo = 1
            WHERE cc.idContrato = c.idContrato AND cc.del = 0) AS qtdOpcionais
            FROM contratos AS c 
            INNER JOIN clientes AS cl ON cl.idCliente = c.idCliente 
            INNER JOIN locais AS l ON l.idLocal = c.idLocal
            INNER JOIN pacotes AS p ON p.idPacote = c.idPacote
            WHERE c.cancelado = 0 ";

    if ($_POST['de'] !== "") {
        $sql .= " AND c.dataFesta >= DATE('" . DataSSql($_POST['de']) . "') ";
    }

    if ($_POST['ate'] !== "") {
        $sql .= " AND c.dataFesta <= DATE('" . DataSSql($_POST['ate']) . "') ";
    }

    if ($_POST['cliente'] > 0) {
        $sql .= " AND c.idCliente = " . $_POST['cliente'];
    }

    if ($_POST['local'] > 0) {
        $sql .= " AND c.idLocal = " . $_POST['local'];
    }

    if ($_POST['pacote'] > 0) {
        $sql .= " AND c.idPacote = " . $_POST['pacote'];
    }

    $sql .= " HAVING qtdOpcionais > 0 ORDER BY c.dataFesta";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idContrato' => $linha['idContrato'],
            'contrato' => $linha['contrato'],
            'data' => FormatData($linha['dataFesta'], true) . ' das ' . $linha['horaDe'] . ' até ' . $linha['horaAte'],
            'cliente' => $linha['cliente'],
            'nomeLocal' => $linha['nomeLocal'],
            'nomePacote' => $linha['nomePacote'],
            'arrayOpcionais' => MostrarOpcionais($ArqT, $linha['idContrato'])
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostrarOpcionais($ArqT, $idContrato) {

    $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, cc.qtd, cc.ok, o.externo, cc.idContratoComp, 
            IFNULL(cc.obsOk, '') AS obsOk 
            FROM contratos_comp AS cc
            LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
            WHERE cc.idContrato = " . $idContrato . " AND cc.idPacote = 0 AND cc.del = 0 AND o.externo = 1";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        return '0';
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'opcional' => $linha['nomeOpcional'] . ' (Qtde: ' . $linha['qtd'] . ($linha['externo'] == '1' ? ($linha['ok'] == '1' ? ' - <label id=div-' . $linha['idContratoComp'] . '><span id=' . $linha['idContratoComp'] . ' title="Clique para marcar o opcional como Pendente" style="text-decoration:underline; cursor:pointer;" onclick="PromptObsOpcionalOk(' . $idContrato . ', ' . $linha['idContratoComp'] . ', 0, \'' . $linha['obsOk'] . '\');">OK</span></label>' : ' - <label id=div-' . $linha['idContratoComp'] . '><span id=' . $linha['idContratoComp'] . ' title="Clique para marcar o opcional como OK" style="text-decoration:underline; cursor:pointer;" onclick="PromptObsOpcionalOk(' . $idContrato . ', ' . $linha['idContratoComp'] . ', 1, \'' . $linha['obsOk'] . '\');">Pendente</span></label>') : '') . ')'
        );
    }

    return json_encode($json);
}