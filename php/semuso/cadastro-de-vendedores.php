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

    $db = ConectaDB();

    $sql = "SELECT idVendedor AS codigo, vendedor, ativo, descontoMaximo FROM vendedores WHERE TRUE";

    if ($_POST['nome'] !== '') {
        $sql .= " AND vendedor LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= " ORDER BY ativo DESC, vendedor";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'vendedor' => $linha['vendedor'],
                'descontoMaximo' => FormatMoeda($linha['descontoMaximo']),
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

    $sql = "SELECT * FROM vendedores WHERE vendedor = '" . $db->escapesql($_POST['nome']) . "' AND idVendedor <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '2';
    }else{

        $sql = "vendedores SET 
                vendedor = UCASE('" . $db->escapesql($_POST['nome']) . "'), 
                ativo = " . $_POST['ativo'] . ", 
                descontoMaximo = '" . ValorE($_POST['desconto']) . "', 
                dataAtualizacao = NOW(), idUsuarioAtualizacao = " . $_SESSION['foco_codigo'];

        if ($_POST['codigo'] <= 0) {

            $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['foco_codigo'];
        } else {

            $sql = "UPDATE " . $sql . " WHERE idVendedor = " . $_POST['codigo'];
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