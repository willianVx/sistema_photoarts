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

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT idLogistica AS codigo, UCASE(logistica) AS nome, ativo FROM logisticas ";

    if ($_POST['nome'] !== '') {
        $sql .= " WHERE logistica LIKE '%" . $_POST['nome'] . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, logistica ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome'],
            'ativo' => $linha['ativo']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function Gravar() {
    inicia_sessao();

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM logisticas WHERE logistica = '" . $_POST['nome'] . "' AND idLogistica <> " . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) > 0) {
        echo '2';
        mysqli_close($ArqT);
        return;
    }

    $sql = " logisticas SET logistica = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "') , 
            ativo = " . $_POST['ativo'] . ", dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['foco_codigo'];

    if ($_POST['codigo'] <= 0) {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['foco_codigo'];
    } else {
        $sql = "UPDATE " . $sql . " WHERE idLogistica = " . $_POST['codigo'];
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