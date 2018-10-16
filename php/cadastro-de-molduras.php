<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostra':
            Mostra();
            break;

        case 'MostrarMoldura':
            MostrarMoldura();
            break;
        
        case 'MostrarGrupoMoldura':
            MostrarGrupoMoldura();
            break;

        case 'Gravar':
            Gravar();
            break;
        
        case 'GravarGrupo':
            GravarGrupo();
            break;

         case 'GerarMiniaturaObra':
            GerarMiniaturaObra();
            break;

        case 'ExcluirImagemObra':
            ExcluirImagemObra();
            break;

    }
}

function Mostra() {

    $db = ConectaDB();

    $sql = 'SELECT mg.idMolduraGrupo, m.idMoldura, mg.molduraGrupo, m.moldura, mg.valor, 
        m.photoarts, m.instaarts, m.ativo, mg.ativo AS ativoG
        FROM molduras AS m
        INNER JOIN molduras_grupos AS mg USING(idMolduraGrupo)
        WHERE TRUE ';
    
    if($_POST['idGrupo'] > 0){
        $sql .= ' AND m.idMolduraGrupo =' . $_POST['idGrupo'] . ' ';
    }
    
    if($_POST['nome'] != ''){
        $sql .= " AND m.moldura LIKE '%" . $_POST['nome'] . "%' ";
    }
    
    $sql .= 'ORDER BY mg.ativo DESC, mg.molduraGrupo, m.ativo DESC, m.moldura';
       
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idMolduraGrupo' => $linha['idMolduraGrupo'],
                'idMoldura' => $linha['idMoldura'],
                'molduraGrupo' => $linha['molduraGrupo'],
                'moldura' => $linha['moldura'],
                'valor' => FormatMoeda($linha['valor']),
                'photoarts' => ($linha['photoarts'] == 1 ? 'SIM' : 'NÃO'),
                'instaarts' => ($linha['instaarts'] == 1 ? 'SIM' : 'NÃO'),
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO'),
                'ativoG' => ($linha['ativoG'] == 1 ? 'SIM' : 'NÃO')
            );
        }
        
        echo json_encode($json);
    }
    $db->close();
}

function MostrarMoldura() {

    $db = ConectaDB();

    $sql = 'SELECT mg.idMolduraGrupo, m.idMoldura, mg.molduraGrupo, m.moldura, mg.valor,m.imagem, 
        m.photoarts, m.instaarts, m.ativo, mg.ativo AS ativoG
        FROM molduras AS m
        INNER JOIN molduras_grupos AS mg USING(idMolduraGrupo)
        WHERE m.idMoldura =' . $_POST['codigo'] . " ";    
    
    $sql .= 'ORDER BY mg.molduraGrupo, m.moldura';    
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'idMolduraGrupo' => $linha['idMolduraGrupo'],
            'idMoldura' => $linha['idMoldura'],
            'molduraGrupo' => $linha['molduraGrupo'],
            'moldura' => $linha['moldura'],
            'imagem' => $linha['imagem'],
            'imagemMini' => 'imagens/molduras/mini_' . $linha['imagem'],
            'valor' => FormatMoeda($linha['valor']),
            'photoarts' => ($linha['photoarts'] == 1 ? 'SIM' : 'NÃO'),
            'instaarts' => ($linha['instaarts'] == 1 ? 'SIM' : 'NÃO'),
            'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO'),
            'ativoG' => ($linha['ativoG'] == 1 ? 'SIM' : 'NÃO')
        );

        echo json_encode($json);
    }
    $db->close();
}

function MostrarGrupoMoldura() {

    $db = ConectaDB();

    $sql = 'SELECT * FROM molduras_grupos WHERE idMolduraGrupo =' . $_POST['codigo'];        
   
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'idMolduraGrupo' => $linha['idMolduraGrupo'],        
            'molduraGrupo' => $linha['molduraGrupo'],        
            'valor' => FormatMoeda($linha['valor']),        
            'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO')
        );

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();
    $db = ConectaDB();
    
    $sql = 'SELECT moldura FROM molduras '
            . 'WHERE idMolduraGrupo =' . $_POST['idMolduraGrupo'] . ' '
            . 'AND UCASE(moldura) = UCASE("' . $db->escapesql($_POST['moldura']) . '") '
            . 'OR idMoldura <> ' . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo "2";
    }else{

        $sql = " molduras SET 
                ativo = " . $_POST['ativo'] . ", 
                idMolduraGrupo = " . $_POST['idMolduraGrupo'] . ", 
                moldura = '" . $db->escapesql($_POST['moldura']) . "', 
                photoarts = " . $_POST['photoarts'] . ", 
                imagem = '" . $db->escapesql($_POST['imagem']) . "', 
                instaarts = " . $_POST['instaarts'];

        if ($_POST['codigo'] <= 0) {
            $sql = 'INSERT INTO ' . $sql . ', dataCadastro = NOW(), idUsuarioCadastro = ' . $_SESSION['photoarts_codigo'];
        } else {
            $sql = 'UPDATE ' . $sql . ', dataAtualizacao = NOW(), idUsuarioAtualizacao = ' . $_SESSION['photoarts_codigo'] . ' WHERE idMoldura = ' . $_POST['codigo'];
        }

    $db->query( $sql );

    if ( $db->n_rows >= 0) {
            echo "1";
        } else {
            echo "0";
        }
    }
}

function GravarGrupo() {
    inicia_sessao();
    
    $db = ConectaDB();
    
    $sql = 'SELECT molduraGrupo FROM molduras_grupos '
            . 'WHERE UCASE(molduraGrupo) = UCASE("' . $db->escapesql( $_POST['grupo']) . '") '
            . 'AND idMolduraGrupo <> ' . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '2';
    }else{

        $sql = " molduras_grupos SET 
                ativo = " . $_POST['ativo'] . ",             
                molduraGrupo = '" . $db->escapesql($_POST['grupo']) . "', 
                valor = " . ValorE($_POST['valor']) . " ";

        if ($_POST['codigo'] <= 0) {
            $sql = 'INSERT INTO ' . $sql . ', dataCadastro = NOW(), idUsuarioCadastro = ' . $_SESSION['photoarts_codigo'];
        } else {
            $sql = 'UPDATE ' . $sql . ', dataAtualizacao = NOW(), idUsuarioAtualizacao = ' . $_SESSION['photoarts_codigo'] . ' WHERE idMolduraGrupo = ' . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows >= 0) {
            echo '1';
        } else {
            echo '0';
        }
    }
    $db->close();
}

function GerarMiniaturaObra() {

    Redimensionar("../imagens/molduras/" . $_POST['imagem'], 175, 125, "mini_", 80);
    if (file_exists("../imagens/molduras/" . $_POST['imagem'])) {

        $json = array(
            'foto' => "imagens/molduras/mini_" . $_POST['imagem']
        );

        echo json_encode($json);

        Redimensionar("../imagens/molduras/" . $_POST['imagem'], 64, 64, "mini_64_", 80);
    } else {
        echo "0";
    }
}

function ExcluirImagemObra() {

    $db = ConectaDB();

    $sql = "UPDATE molduras SET imagem = '' WHERE idMoldura = " . $_POST['idMoldura'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {

        if (file_exists("../imagens/obras/" . $_POST['imagem'])) {

            if (unlink("../imagens/obras/" . $_POST['imagem'])) {

                unlink("../imagens/obras/mini_" . $_POST['imagem']);
                echo '0';
            } else {
                echo '1';
            }
        }
    } else {
        echo '0';
    }

    $db->close();
}
