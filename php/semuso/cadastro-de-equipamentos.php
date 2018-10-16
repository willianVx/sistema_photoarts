<?php

include('foco.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostraEquipamentos':
            MostraEquipamentos();
            break;

        case 'GravarEquipamento':
            GravarEquipamento();
            break;

        case 'getEquipamento':
            getEquipamento();
            break;

        case 'MostraEstoqueEquipamento':
            MostraEstoqueEquipamento();
            break;

        case 'getEstoqueEquipamento':
            getEstoqueEquipamento();
            break;

        case 'GravarEstoqueEquipamento':
            GravarEstoqueEquipamento();
            break;

        case 'getHistoricoEquipamento':
            getHistoricoEquipamento();
            break;
    }
}

function MostraEquipamentos() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT e.*, et.equipamentoTipo FROM equipamentos AS e
            INNER JOIN equipamentos_tipos AS et ON et.idEquipamentoTipo = e.idEquipamentoTipo
            WHERE e.del = 0 ";

    if ($_POST['idTipoEquipamento'] > '0') {
        $sql .= " AND e.idEquipamentoTipo = " . $_POST['idTipoEquipamento'];
    }

    if ($_POST['nome'] !== '') {

        $sql .= " AND e.equipamento LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= " ORDER BY e.equipamento";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idEquipamento' => $linha['idEquipamento'],
            'ativo' => ($linha['ativo'] == '1' ? 'SIM' : 'NÃO'),
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'equipamentoTipo' => $linha['equipamentoTipo'],
            'equipamento' => $linha['equipamento'],
            'altura' => FormatMoeda($linha['altura']),
            'largura' => FormatMoeda($linha['largura']),
            'comprimento' => FormatMoeda($linha['comprimento']),
            'peso' => FormatMoeda($linha['peso']),
            'valorLocacao' => FormatMoeda($linha['valorLocacao'])
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function GravarEquipamento() {

    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT COUNT(*) AS total FROM equipamentos WHERE TRUE";

    if ($_POST['nome'] != '') {

        $sql .= " AND equipamento='" . TextoSSql($ArqT, $_POST['nome']) . "' 
                AND idEquipamento <> " . $_POST['idEquipamento'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") > 0) {
            echo "-1";
            return;
        }
    }

    if ($_POST['idEquipamento'] > 0) {

        $sql = "SELECT valorLocacao FROM equipamentos WHERE idEquipamento = " . $_POST['idEquipamento'];
        $Tb = ConsultaSQL($sql, $ArqT);
        $valor = mysqli_result($Tb, 0, "valorLocacao");
    }

    $sql = "equipamentos SET 
            ativo = " . $_POST['ativo'] . ", 
            idEquipamentoTipo = " . $_POST['idTipoEquipamento'] . ", 
            equipamento = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "'), 
            altura = '" . ValorE($_POST['altura']) . "', 
            largura = '" . ValorE($_POST['largura']) . "', 
            comprimento = '" . ValorE($_POST['profundidadeComprimento']) . "', 
            peso = '" . ValorE($_POST['peso']) . "', 
            descricaoTecnica = UCASE('" . TextoSSql($ArqT, $_POST['descricaoTecnica']) . "'), 
            valorLocacao = '" . ValorE($_POST['valorLocacao']) . "', 
            dataAtualizacao=NOW()";

    if ($_POST['idEquipamento'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idEquipamento = " . $_POST['idEquipamento'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUsuarioCadastro=" . $_SESSION['foco_codigo'] . ", dataCadastro=NOW()";
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    } else {        

        if ($_POST['idEquipamento'] > 0) {
            if ($valor !== ValorE($_POST['valorLocacao'])){
                GravarHistoricoEquipamento($ArqT, true, $_POST['idEquipamento'], ValorE($_POST['valorLocacao']));
            }
            
            echo $_POST['idEquipamento'];
        } else {
            $codE = UltimoRegistroInserido($ArqT);
            GravarHistoricoEquipamento($ArqT, false, $codE, ValorE($_POST['valorLocacao']));
            
            echo $codE;
        }

        mysqli_close($ArqT);
    }
}

function getEquipamento() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM equipamentos WHERE idEquipamento = " . $_POST['idEquipamento'];

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
        'idEquipamentoTipo' => $linha['idEquipamentoTipo'],
        'equipamento' => $linha['equipamento'],
        'altura' => FormatMoeda($linha['altura']),
        'largura' => FormatMoeda($linha['largura']),
        'comprimento' => FormatMoeda($linha['comprimento']),
        'peso' => FormatMoeda($linha['peso']),
        'valorLocacao' => FormatMoeda($linha['valorLocacao']),
        'descricaoTecnica' => $linha['descricaoTecnica']
    );

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostraEstoqueEquipamento() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM equipamentos_estoque WHERE idEquipamento = " . $_POST['idEquipamento'] . " ORDER BY dataCadastro DESC";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idEquipamentoEstoque' => $linha['idEquipamentoEstoque'],
            'ativo' => ($linha['ativo'] == '1' ? 'SIM' : 'NÃO'),
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'marca' => $linha['marca'],
            'modelo' => $linha['modelo'],
            'numeroSerie' => $linha['numeroSerie'],
            'descricao' => $linha['descricao'],
            'qtd' => $linha['qtd']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getEstoqueEquipamento() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM equipamentos_estoque WHERE idEquipamentoEstoque = " . $_POST['idEquipamentoEstoque'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $json = array(
        'marca' => $linha['marca'],
        'modelo' => $linha['modelo'],
        'ativo' => $linha['ativo'],
        'numeroSerie' => $linha['numeroSerie'],
        'descricao' => $linha['descricao']
    );

    echo json_encode($json);
    mysqli_close($ArqT);
}

function GravarEstoqueEquipamento() {

    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT COUNT(*) AS total FROM equipamentos_estoque WHERE TRUE";

    if ($_POST['numeroSerie'] != '') {

        $sql .= " AND marca='" . TextoSSql($ArqT, $_POST['marca']) . "' 
                AND modelo = '" . TextoSSql($ArqT, $_POST['modelo']) . "'
                AND numeroSerie = '" . TextoSSql($ArqT, $_POST['numeroSerie']) . "'
                AND idEquipamentoEstoque <> " . $_POST['idEquipamentoEstoque'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") > 0) {
            echo "-1";
            return;
        }
    }

    $sql = "equipamentos_estoque SET 
            ativo = " . $_POST['ativo'] . ", 
            idEquipamento = " . $_POST['idEquipamento'] . ", 
            marca = UCASE('" . TextoSSql($ArqT, $_POST['marca']) . "'), 
            modelo = UCASE('" . TextoSSql($ArqT, $_POST['modelo']) . "'), 
            numeroSerie = UCASE('" . TextoSSql($ArqT, $_POST['numeroSerie']) . "'), 
            descricao = UCASE('" . TextoSSql($ArqT, $_POST['descricao']) . "'), 
            qtd = 1, dataAtualizacao=NOW()";

    if ($_POST['idEquipamentoEstoque'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idEquipamentoEstoque = " . $_POST['idEquipamentoEstoque'];
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

function GravarHistoricoEquipamento($ArqT, $update, $idEquipamento, $valor) {

    inicia_sessao();

    if ($update) {

        $sql = "SELECT COUNT(*) AS total FROM equipamentos_historico 
                WHERE idEquipamento = " . $idEquipamento . " AND valorLocacao = '" . $valor . "'";

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") <= 0) {

            $sql = "INSERT INTO equipamentos_historico SET 
                    idEquipamento = " . $idEquipamento . ", 
                    DATA = NOW(), 
                    valorLocacao = '" . $valor . "', 
                    idUsuarioCadastro = " . $_SESSION['foco_codigo'];
        }
    } else {

        $sql = "INSERT INTO equipamentos_historico SET 
                idEquipamento = " . $idEquipamento . ", 
                DATA = NOW(), 
                valorLocacao = '" . $valor . "', 
                idUsuarioCadastro = " . $_SESSION['foco_codigo'];
    }

    mysqli_query($ArqT, $sql);
}

function getHistoricoEquipamento() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT eh.idEquipamentoHistorico, eh.data, eh.valorLocacao, f.funcionario 
            FROM equipamentos_historico AS eh 
            INNER JOIN funcionarios AS f ON f.idFuncionario = eh.idUsuarioCadastro 
            WHERE eh.idEquipamento = " . $_POST['idEquipamento'] . " ORDER BY eh.data DESC";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idEquipamentoHistorico' => $linha['idEquipamentoHistorico'],
            'data' => FormatData($linha['data']),
            'valorLocacao' => FormatMoeda($linha['valorLocacao']),
            'funcionario' => $linha['funcionario']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}
