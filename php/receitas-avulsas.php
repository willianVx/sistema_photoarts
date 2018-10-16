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

        case 'Excluir':
            Excluir();
            break;
    }
}

function Mostra() {

    $db = ConectaDB();

    $sql = "SELECT idReceitaAvulsa AS codigo, data, descricao, valor,
            IFNULL((SELECT formaPagamento FROM formaspagamentos WHERE idFormaPagamento = receitas_avulsas.idFormaPagamento),'') AS forma 
            FROM receitas_avulsas
            WHERE del = 0 ";

    if ($_POST['busca'] !== '') {
        $sql .= " AND descricao LIKE '%" . $_POST['busca'] . "%' ";
    }


    if ($_POST['forma'] > 0) {
        $sql .= " AND idFormaPagamento =  " . $_POST['forma'] . "  ";
    }

    if ($_POST['de'] !== "") {
        $sql .= " AND data >=  DATE('" . DataSSql($_POST['de']) . "') ";
    }

    if ($_POST['ate'] !== "") {
        $sql .= " AND data <=  DATE('" . DataSSql($_POST['ate']) . "') ";
    }

    $sql .= " ORDER BY descricao";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'data' => FormatData($linha['data']),
                'descricao' => $linha['descricao'],
                'valor' => FormatMoeda($linha['valor']),
                'forma' => $linha['forma']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Excluir() {

    inicia_sessao();

    $db = ConectaDB();
    
    $sql = "UPDATE receitas_avulsas SET del = 1, dataDel = NOW(),
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idReceitaAvulsa = " . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();
    $sql = "SELECT COUNT(*) AS total FROM receitas_avulsas WHERE descricao LIKE '" . $_POST['codigo'] . "'";
    
    $db->query( $sql );
    
    $result = $db->fetch();

    if ( $db->n_rows > 0) {
        if ($result["total"] > 0) {
            echo '2';
            $db->close();
            return;
        }
    }

    $sql = "INSERT INTO receitas_avulsas SET data = '" . DataSSql($_POST['data']) . "', 
            descricao = '" . $db->escapesql($_POST['descricao']) . "',
            valor = " . $_POST['valor'] . ",
            idFormaPagamento = " . $_POST['forma'] . ",
            dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    
    $db->query( $sql );
    
    if ( $db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }
}

?>