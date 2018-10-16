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

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT idFormaPagamento AS codigo, pagar, formaPagamento, receber, qtdeDiasComp, ativo, taxa "
            . "FROM formaspagamentos ";

    if ($_POST['nome'] != '') {
        $sql .= "WHERE formaPagamento LIKE '%" . $_POST['nome'] . "%' ";
    }

    $sql .= "ORDER BY ativo DESC,formaPagamento";


    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'qtd' => $linha['qtdeDiasComp'],
                'pagar' => $linha['pagar'],
                'formaPagamento' => $linha['formaPagamento'],
                'receber' => $linha['receber'],
                'ativo' => $linha['ativo'],
                'taxa' => FormatMoeda( $linha['taxa'] )
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT * FROM formaspagamentos 
            WHERE formapagamento = '" . $db->escapesql($_POST['formaPagamento']) . "'
            AND idFormaPagamento = " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows < 0) {
        echo '-1';
    }else{

        $sql = " formaspagamentos SET    
                formaPagamento= UCASE('" . $db->escapesql($_POST['formaPagamento']) . "'), 
                pagar=" . $_POST['pagar'] . ", 
                qtdeDiasComp=" . ValorE($_POST['qtd']) . ",
                taxa=" . $_POST['taxa'] . ",
                receber=" . $_POST['receber'] . ",
                ativo=" . $_POST['ativo'];
                 

        if ($_POST['codigo'] <= 0) {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['photoarts_codigo'];
        } else {
            $sql = "UPDATE " . $sql . ", dataAtualizacao=NOW() WHERE idFormaPagamento = " . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows > 0) {
            echo '-1';
        } else {
            echo '0';
        }
    }
    //$db->close();
}
?>



