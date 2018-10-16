<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostrar':
            Mostrar();
            break;

        case 'Gravar':
            Gravar();
            break;
    }
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT idCargo, cargo, ativo FROM cargos WHERE del = 0 ";

    if ($_POST['nome'] !== '') {
        $sql .= "AND cargo LIKE '%" . $db->escopesql( $_POST['nome']) . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, cargo";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
    
        while ($linha = $db->fetch()) {
            $json[] = array(
                'codigo' => $linha['idCargo'],
                'cargo' => $linha['cargo'],
                'ativo' => $linha['ativo']
            );
        }
        echo json_encode($json);
    }
    
    $db->close();
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT * FROM cargos WHERE cargo = '" . $db->escapesql( $_POST['nome']) . "' OR idCargo <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '-1';
        $db->close();
        return;
    }

    $sql = "cargos SET 
            cargo = UCASE('" . $db->escapesql($_POST['nome']) . "'), 
            ativo = " . $_POST['ativo'] . ", 
            idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . ", 
            dataAtualizacao = NOW()";

    if ($_POST['codigo'] <= 0) {

        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW() , idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    } else {

        $sql = "UPDATE " . $sql . " WHERE idCargo = " . $_POST['codigo'];
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}
?>

