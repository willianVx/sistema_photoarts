<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Gravar':
            Gravar();
            break;

        case 'Mostrar':
            Mostrar();
            break;
    }
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT * FROM v_status 
            WHERE (status = '" . $db->escapesql($_POST['status']) . "' OR ordem = " . $_POST['ordem'] . ") 
            OR idVStatus <> " . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '2';
    }else{

        $sql = " v_status SET

                descricaoStatus= '" . $db->escapesql( $_POST['descricao']) . "', 
                ordem=" . $_POST['ordem'] . ", 
                status=UCASE('" . $db->escapesql( $_POST['status'] ). "'), 
                ativo=" . $_POST['ativo'] ;


        if ($_POST['codigo'] <= 0) {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['photoarts_codigo'];
        } else {
            $sql = "UPDATE " . $sql . ", dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'] ." 
                    WHERE idVStatus = " . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows > 0) {
            echo '-1';
        } else {
            echo '0';
        }
    }
    $db->close();
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT idVStatus AS codigo, ordem, status, descricaoStatus, ativo "
            . "FROM v_status ";
    
    if($_POST['nome'] != ''){
        $sql .= "WHERE (status LIKE '%" . $_POST['nome'] . "%' OR descricaoStatus LIKE '%" . $_POST['nome'] . "%') ";
    }
    
    $sql .= "ORDER BY ordem ASC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'], 
                'ordem' => $linha['ordem'],
                'status' => $linha['status'],
                'descricao' => $linha['descricaoStatus'],
                'ativo' => $linha['ativo']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}
?>

