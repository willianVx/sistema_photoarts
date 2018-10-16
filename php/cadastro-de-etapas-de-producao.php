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

    $sql = "SELECT * FROM etapas 
            WHERE (etapa = '" . $db->escapesql($_POST['etapa']) . "' OR ordem = " . $_POST['ordem'] . ") 
            OR idEtapa <> " . $_POST['codigo'];
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '2';
    }else{

        $sql = " etapas SET
                descricaoEtapa= '" . $db->escapesql($_POST['descricao']) . "', 
                ordem=" . $_POST['ordem'] . ", 
                etapa=UCASE('" . $db->escapesql($_POST['etapa'] ). "'), 
                ativo=" . $_POST['ativo'] ;

        if ($_POST['codigo'] <= 0) {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['photoarts_codigo'];
        } else {
            $sql = "UPDATE " . $sql . ", dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'] ." 
                    WHERE idEtapa = " . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows > 0 ) {
            echo '-1';
        } else {
            echo '0';
        }
    }
    $db->close();
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT idEtapa AS codigo, ordem, etapa, descricaoEtapa, ativo "
            . "FROM etapas ";
    
    if($_POST['nome'] != ''){
        $sql .= "WHERE (etapa LIKE '%" . $_POST['nome'] . "%' OR descricaoEtapa LIKE '%" . $_POST['nome'] . "%') ";
    }
    
    $sql .= "ORDER BY codigo";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'], 
                'ordem' => $linha['ordem'],
                'etapa' => $linha['etapa'],
                'descricao' => $linha['descricaoEtapa'],
                'ativo' => $linha['ativo']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}
?>

