
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

        /*case 'EditarFeriado':
            EditarFeriado();
            break;*/
    }
}

function Gravar() {
    
    inicia_sessao();

    $db = ConectaDB();
    
    $sql = "SELECT * FROM feriados WHERE obs = '" . $db->escapesql($_POST['obs']) . "' OR idFeriado <> " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo '2';
        $db->close();
        return;
    }
    
    $sql = " feriados SET 
            data ='" . DataSSql($_POST['data']) . "', 
            datafinal ='" . DataSSql($_POST['datafinal']) . "', 
            bancario=" . $_POST['bancario'] . ", 
            operacional=" . $_POST['operacional'] . ", 
            obs=UCASE('" . $db->escapesql($_POST['obs']) . "'), 
            recorrente=" . $_POST['recorrente'] . ", 
            ativo=" . $_POST['ativo'] . ", 
            dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'];
    
    if ($_POST['codigo'] <= 0) {
        $sql = "INSERT INTO " . $sql . ", dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['photoarts_codigo'];
    } else {
        $sql = "UPDATE " . $sql . " WHERE idFeriado = " . $_POST['codigo'];
    }
    
    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo '-1';
    } else {
        echo '0';
    }
    $db->close();
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT idFeriado, data, obs AS nome, bancario, operacional, recorrente, datafinal, ativo FROM feriados ";
    
    if ($_POST['nome'] != '') {
        $sql .= "WHERE obs LIKE '%" . $_POST['nome'] . "%' ";
    }
    
    $sql .= "ORDER BY ativo DESC, data DESC";
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {  

            $json[] = array(
                'codigo' => $linha['idFeriado'],
                'data' => FormatData($linha['data']),
                'datafinal' => FormatData($linha['datafinal']),
                'nome' => $linha['nome'],
                'bancario' => $linha['bancario'],
                'operacional' => $linha['operacional'],
                'recorrente' => $linha['recorrente'],
                'ativo' => $linha['ativo']
            );
        }

        echo json_encode($json);
    }
    mysqli_close($ArqT);
}


?>
