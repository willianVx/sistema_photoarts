<?php

include('photoarts.php');

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

    $db = ConectaDB();

    $sql = "SELECT idCentroCusto AS codigo, UCASE(centrocusto) AS nome, ativo FROM centro_custos ";

    if ($_POST['nome'] !== '') {
        $sql .= " WHERE centrocusto LIKE '%" . $_POST['nome'] . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, centrocusto";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome'],
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

    $sql = "SELECT * FROM centro_custos WHERE centrocusto = '" . $_POST['nome'] . "' OR idCentroCusto <> " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '2';
        $db->close();
        return;
    }

    $sql = " centro_custos SET centrocusto = UCASE('" . $_POST['nome'] . "') , ativo = " . $_POST['ativo'] . ", 
             dataAtualizacao = NOW(), idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'];

    if ($_POST['codigo'] <= 0) {

        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    } else {

        $sql = "UPDATE " . $sql . " WHERE idCentroCusto = " . $_POST['codigo'];
    }


    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo '-1';
    } else {
        echo '0';
    }
    $db->close();
}

?>