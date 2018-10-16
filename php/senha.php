<?php

include('photoarts.php');

if (isset($_POST['action'])) {


    switch ($_POST['action']) {
        case 'Alterar':
            Alterar();
            break;
    }
}

function Alterar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT IF(senha = MD5('" . $_POST['senha'] . "'),1,0) AS senha FROM funcionarios 
            WHERE idFuncionario = " . $_SESSION['photoarts_codigo'];

    $db->query( $sql );
    
    $linhas->fetch();

    if ( $db->n_rows <= 0) {
        echo '-2';
        return;
    }

    if ($linhas["senha"] == 0) {
        echo '-1';
        return;
    }

    $sql = "UPDATE funcionarios SET senha = MD5('" . $_POST['novasenha'] . "') 
            WHERE idFuncionario = " . $_SESSION['photoarts_codigo'];
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        $_SESSION['photoarts_senhaPadrao'] = '0';
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}
