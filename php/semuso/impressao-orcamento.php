<?php

include('foco.php');

if (isset($_POST['action'])) {


    switch ($_POST['action']) {
        case 'getDataAtual':
            getDataAtual();
            break;
    }
}

function getDataAtual() {

    $db = ConectaDB();
    $sql = " SELECT DATE_FORMAT(CURDATE(), '%w') AS dia, CURDATE() AS diaAtual";
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        echo dataExtended($linha['dia'], $linha['diaAtual']);
    }
}
