<?php

include('foco.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostraKits':
            MostraKits();
            break;

        case 'GravarKit':
            GravarKit();
            break;

        case 'getKit':
            getKit();
            break;

        case 'MostraEquipamentosKit':
            MostraEquipamentosKit();
            break;

        case 'getEquipamentoKit':
            getEquipamentoKit();
            break;

        case 'getValorQtdEquipamento':
            getValorQtdEquipamento();
            break;

        case 'GravarEquipamentoKit':
            GravarEquipamentoKit();
            break;

        case 'ExcluirEquipamentoKit':
            ExcluirEquipamentoKit();
            break;

        case 'getHistoricoKit':
            getHistoricoKit();
            break;
    }
}

function MostraKits() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT k.idKit, k.ativo, k.kit, k.valorLocacaoKit,
           (SELECT COUNT(*) FROM kits_comp WHERE idKit = k.idKit AND del = 0) AS qtdeEquipamentos
           FROM kits AS k WHERE k.del = 0 ";

    if ($_POST['nome'] !== '') {

        $sql .= " AND kit LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= " ORDER BY k.kit";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idKit' => $linha['idKit'],
            'ativo' => ($linha['ativo'] == '1' ? 'SIM' : 'NÃO'),
            'kit' => $linha['kit'],
            'valorLocacaoKit' => FormatMoeda($linha['valorLocacaoKit']),
            'qtdeEquipamentos' => $linha['qtdeEquipamentos'],
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function GravarKit() {

    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT COUNT(*) AS total FROM kits WHERE TRUE";

    if ($_POST['kit'] != '') {

        $sql .= " AND kit = '" . TextoSSql($ArqT, $_POST['kit']) . "' 
                AND idKit <> " . $_POST['idKit'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") > 0) {
            echo "-1";
            return;
        }
    }

    if ($_POST['idKit'] > 0) {

        $sql = "SELECT valorLocacaoKit FROM kits WHERE idKit = " . $_POST['idKit'];
        $Tb = ConsultaSQL($sql, $ArqT);
        $valor = mysqli_result($Tb, 0, "valorLocacaoKit");
    }

    $sql = "kits SET 
            ativo = " . $_POST['ativo'] . ", 
            kit = UCASE('" . TextoSSql($ArqT, $_POST['kit']) . "'), 
            valorLocacaoKit = '" . ValorE($_POST['valorLocacaoKit']) . "', 
            dataAtualizacao=NOW()";

    if ($_POST['idKit'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idKit = " . $_POST['idKit'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUsuarioCadastro=" . $_SESSION['foco_codigo'] . ", dataCadastro=NOW()";
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    } else {      

        if ($_POST['idKit'] > 0) {
            
            if ($valor !== ValorE($_POST['valorLocacaoKit'])) {
                GravarHistoricoKit($ArqT, true, $_POST['idKit'], ValorE($_POST['valorLocacaoKit']));
            }
            
            echo $_POST['idKit'];
        } else {
            $codK = UltimoRegistroInserido($ArqT);
            GravarHistoricoKit($ArqT, false, $codK, ValorE($_POST['valorLocacaoKit']));
            
            echo $codK;
        }

        mysqli_close($ArqT);
    }
}

function getKit() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM kits WHERE idKit = " . $_POST['idKit'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $json = array(
        'ativo' => $linha['ativo'],
        'dataCadastro' => FormatData($linha['dataCadastro'], false),
        'kit' => $linha['kit'],
        'valorLocacaoKit' => FormatMoeda($linha['valorLocacaoKit'])
    );

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostraEquipamentosKit() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT kc.idKitComp, LEFT(kc.dataCadastro, 10) AS dataCadastro, e.equipamento, et.equipamentoTipo, 
            kc.qtd 
            FROM kits_comp AS kc
            INNER JOIN equipamentos AS e ON e.idEquipamento = kc.idEquipamento
            INNER JOIN equipamentos_tipos AS et ON et.idEquipamentoTipo = e.idEquipamentoTipo
            WHERE kc.idKit = " . $_POST['idKit'] . " AND kc.del = 0 ORDER BY kc.dataCadastro DESC";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idKitComp' => $linha['idKitComp'],
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'equipamento' => $linha['equipamento'],
            'equipamentoTipo' => $linha['equipamentoTipo'],
            'qtd' => $linha['qtd']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getEquipamentoKit() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT kc.idEquipamento, e.idEquipamentoTipo, e.valorLocacao, 
            (SELECT IFNULL(SUM(qtd), 0) FROM equipamentos_estoque WHERE idEquipamento = kc.idEquipamento AND ativo = 1) AS qtdEstoque, 
            kc.qtd AS qtdKit 
            FROM kits_comp AS kc
            INNER JOIN equipamentos AS e ON e.idEquipamento = kc.idEquipamento
            WHERE kc.idKitComp = " . $_POST['idKitComp'] . " GROUP BY kc.idEquipamento";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $json = array(
        'idEquipamento' => $linha['idEquipamento'],
        'idEquipamentoTipo' => $linha['idEquipamentoTipo'],
        'qtdEstoque' => $linha['qtdEstoque'],
        'qtdKit' => $linha['qtdKit'],
        'valorLocacao' => FormatMoeda($linha['valorLocacao'])
    );

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getValorQtdEquipamento() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT valorLocacao, 
            (SELECT IFNULL(SUM(qtd), 0) FROM equipamentos_estoque WHERE idEquipamento = " . $_POST['idEquipamento'] . " AND ativo = 1) AS qtdEstoque 
            FROM equipamentos WHERE idEquipamento = " . $_POST['idEquipamento'] . " AND ativo = 1";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $json = array(
        'qtdEstoque' => $linha['qtdEstoque'],
        'valorLocacao' => FormatMoeda($linha['valorLocacao'])
    );

    echo json_encode($json);
    mysqli_close($ArqT);
}

function GravarEquipamentoKit() {

    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT COUNT(*) AS total FROM kits_comp WHERE TRUE";

    if ($_POST['idEquipamento'] > 0) {

        $sql .= " AND idEquipamento = " . $_POST['idEquipamento'] . " 
                AND qtd <> " . $_POST['qtd'] . " 
                AND idKit <> " . $_POST['idKit'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") > 0) {
            echo "-1";
            return;
        }
    }

    $sql = "kits_comp SET 
            idKit = " . $_POST['idKit'] . ", 
            idEquipamento = " . $_POST['idEquipamento'] . ", 
            qtd = " . $_POST['qtd'] . ", dataAtualizacao=NOW()";

    if ($_POST['idKitComp'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idKitComp = " . $_POST['idKitComp'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUsuarioCadastro=" . $_SESSION['foco_codigo'] . ", dataCadastro=NOW()";
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    } else {
        echo '1';
        mysqli_close($ArqT);
    }
}

function ExcluirEquipamentoKit() {

    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "UPDATE kits_comp SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['foco_codigo'] . "
            WHERE idKitComp = " . $_POST['idKitComp'];

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    } else {
        echo '1';
        mysqli_close($ArqT);
    }
}

function GravarHistoricoKit($ArqT, $update, $idKit, $valor) {

    inicia_sessao();

    if ($update) {

        $sql = "SELECT COUNT(*) AS total FROM kits_historico 
                WHERE idKit = " . $idKit . " AND valorLocacaoKit = '" . $valor . "'";

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") <= 0) {

            $sql = "INSERT INTO kits_historico SET 
                    idKit = " . $idKit . ", 
                    DATA = NOW(), 
                    valorLocacaoKit = '" . $valor . "', 
                    idUsuarioCadastro = " . $_SESSION['foco_codigo'];
        }
    } else {

        $sql = "INSERT INTO kits_historico SET 
                idKit = " . $idKit . ", 
                DATA = NOW(), 
                valorLocacaoKit = '" . $valor . "', 
                idUsuarioCadastro = " . $_SESSION['foco_codigo'];
    }

    mysqli_query($ArqT, $sql);
}

function getHistoricoKit() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT kh.idKitHistorico, kh.data, kh.valorLocacaoKit, f.funcionario 
            FROM kits_historico AS kh 
            INNER JOIN funcionarios AS f ON f.idFuncionario = kh.idUsuarioCadastro 
            WHERE kh.idKit = " . $_POST['idKit'] . " ORDER BY kh.data DESC";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idKitHistorico' => $linha['idKitHistorico'],
            'data' => FormatData($linha['data']),
            'valorLocacaoKit' => FormatMoeda($linha['valorLocacaoKit']),
            'funcionario' => $linha['funcionario']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}
