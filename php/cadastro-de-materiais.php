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

    $sql = "SELECT m.idMaterial, m.nomeMaterial, m.descricaoMaterial, "
            . "m.estoqueMinimo, m.dataCadastro, m.ativo, u.idUnidadeMedida, u.unidadeMedida "
            . "FROM materiais AS m "
            . "LEFT JOIN unidades_medidas AS u USING(idUnidadeMedida) ";

    if ($_POST['nome'] !== '') {
        $sql .= "WHERE nomeMaterial LIKE '%" . $db->escapesql($_POST['nome']) . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, nomeMaterial";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idMaterial'],
                'material' => $linha['nomeMaterial'],
                'descricao' => $linha['descricaoMaterial'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'ativo' => $linha['ativo'],
                'idUnidadeMedida' => $linha['idUnidadeMedida'],
                'unidadeMedida' => $linha['unidadeMedida'],
                'estoqueMinimo' => $linha['estoqueMinimo']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT * FROM materiais "
            . "WHERE nomeMaterial = '" . $db->escapesql($_POST['nome']) . "' "
            . "OR idMaterial <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '-1';
    }else{

        $sql = "materiais SET 
                nomeMaterial = '" . $db->escapesql($_POST['nome']) . "', 
                descricaoMaterial = '" . $db->escapesql($_POST['descricao']) . "',             
                estoqueMinimo = " . ValorE($_POST['estoque']) . ", 
                idUnidadeMedida =" . $_POST['idUnidadeMedida'] . ",
                ativo = " . $_POST['ativo'] . ", 
                idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . ", 
                dataAtualizacao = NOW()";

        if ($_POST['codigo'] <= 0) {
            $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW() , idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        } else {   
            $sql = "UPDATE " . $sql . " WHERE idMaterial = " . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        } else {        
            if ($_POST['codigo'] <= 0) {
                $idMaterial = UltimoRegistroInserido($db);            
            } else {
                $idMaterial = $_POST['codigo'];                              
            }

            echo '1';
        }      
    }
    $db->close();
}