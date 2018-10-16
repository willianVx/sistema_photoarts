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

    $sql = "SELECT idTamanho, nomeTamanho, altura, largura, dataCadastro, ativo FROM tamanhos ";

    if ($_POST['nome'] !== '') {
        $sql .= "WHERE nomeTamanho LIKE '%" . $db->escapesql($_POST['nome']) . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, nomeTamanho";
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idTamanho'],
                'tamanho' => $linha['nomeTamanho'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'ativo' => $linha['ativo'],
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']), 
                'medida' => FormatMoeda($linha['altura']) . ' x ' . FormatMoeda($linha['largura'])
            );
        }

        echo json_encode($json);
    }   
    $db->close();
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT * FROM tamanhos WHERE nomeTamanho = '" . $db->escapesql($_POST['nome']) . "' OR idTamanho <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '-1';
    }else{

        $sql = "tamanhos SET 
                nomeTamanho = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "'), 
                altura = " . ValorE($_POST['altura']) . ", 
                largura = " . ValorE($_POST['largura']) . ", 
                ativo = " . $_POST['ativo'] . ", 
                idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . ", 
                dataAtualizacao = NOW()";

        if ($_POST['codigo'] <= 0) {

            $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW() , idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        } else {

            $sql = "UPDATE " . $sql . " WHERE idTamanho = " . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        } else {
            echo '1';
        }
    }
    $db->close();
}
?>

