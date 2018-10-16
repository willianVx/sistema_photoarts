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

    $sql = "SELECT idContatoTipo AS codigo, UCASE(tipoContato) AS nome, ativo FROM contatostipos ";

    if ($_POST['nome'] !== '') {
        $sql .= " WHERE tipoContato LIKE '%" . $_POST['nome'] . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, nome ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

    $sql = "SELECT * FROM contatostipos WHERE tipoContato = '" . $_POST['nome'] . "' 
            OR idContatoTipo <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '2';
    }else{

        $sql = " contatostipos SET tipoContato = UCASE('" . $db->escapesql($_POST['nome']) . "') , 
                ativo = " . $_POST['ativo'] . ", dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'];

        if ($_POST['codigo'] <= 0) {
            $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        } else {
            $sql = "UPDATE " . $sql . " WHERE idContatoTipo = " . $_POST['codigo'];
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

?>