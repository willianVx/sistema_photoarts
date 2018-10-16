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

    $sql = "SELECT idEstrela, estrelas, de, ate, valorizacao, ativo FROM estrelas";

    if ($_POST['busca'] !== '') {
        $sql .= " WHERE estrelas = " . $_POST['busca'];
    }

    $sql .= " ORDER BY ativo DESC, estrelas";
	
	//echo $sql;

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {  

            $json[] = array(
                'codigo' => $linha['idEstrela'],
                'estrelas' => $linha['estrelas'],
                'de' => $linha['de'],
                'ate' => $linha['ate'],
                'valorizacao' => FormatMoeda($linha['valorizacao']),
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

    $sql = "SELECT * FROM estrelas 
            WHERE estrelas = " . $_POST['estrela'] . " OR idEstrela <> " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '-1';
    }else{
    
        $sql = "SELECT * FROM estrelas 
                WHERE ((" . $_POST['de'] . " BETWEEN de AND ate) OR 
                (" . $_POST['ate'] . " BETWEEN de AND ate)) AND idEstrela <> " . $_POST['codigo'];

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo '-2';
        }else{

            $sql = "estrelas SET 
                    estrelas = " .$_POST['estrela'] . ", 
                    de = " . $_POST['de'] . ", 
                    ate = " . $_POST['ate'] . ", 
                    valorizacao = " . ValorE($_POST['valorizacao']) . ",
                    ativo = " . $_POST['ativo'] . ", 
                    idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . ", 
                    dataAtualizacao = NOW()";

            if ($_POST['codigo'] <= 0) {

                $sql = "INSERT INTO " . $sql;
            } else {

                $sql = "UPDATE " . $sql . " WHERE idEstrela = " . $_POST['codigo'];
            }

            $db->query( $sql );

            if ( $db->n_rows <= 0 ) {
                echo '0';
            } else {
                echo '1';
            }
        }
    }
    $db->close();
}
?>

