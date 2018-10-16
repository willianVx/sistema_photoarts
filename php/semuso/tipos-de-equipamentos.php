<?php

include('foco.php');

if (isset($_POST['action'])) {


    switch ($_POST['action']) {
        case 'Mostra':
            Mostra();
            break;

        case 'Gravar':
            Gravar();
            break;
    }
}

function Mostra() {
    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT idEquipamentoTipo AS codigo, equipamentoTipo, ativo FROM equipamentos_tipos 
                WHERE del = 0 ";

    if ($_POST['nome'] !== '') {
        $sql .= " AND equipamentoTipo LIKE '%" . TextoSSql($ArqT, $_POST['nome']) . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, equipamentoTipo ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['equipamentoTipo'],
            'ativo' => $linha['ativo']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function Gravar() {

    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM equipamentos_tipos WHERE equipamentoTipo = '" . TextoSSql($ArqT, $_POST['nome']) . "' AND idEquipamentoTipo <> " . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) > 0) {
        echo '2';
        mysqli_close($ArqT);
        return;
    }

    $sql = " equipamentos_tipos SET equipamentoTipo = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "') , 
            ativo = " . $_POST['ativo'] . ", dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['foco_codigo'];

    if ($_POST['codigo'] <= 0) {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['foco_codigo'];
    } else {
        $sql = "UPDATE " . $sql . " WHERE idEquipamentoTipo = " . $_POST['codigo'];
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '-1';
        mysqli_close($ArqT);
        return;
    } else {
        echo '0';
        mysqli_close($ArqT);
    }   
}

?>