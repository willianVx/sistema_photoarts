<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostra':
            Mostra();
            break;

        case 'MostrarLoja':
            MostrarLoja();
            break;

        case 'Gravar':
            Gravar();
            break;
    }
}

function Mostra() {

    $db = ConectaDB();

    $sql = 'SELECT * FROM lojas WHERE del = 0';

    if ($_POST['nome'] !== '') {
        $sql .= " AND loja LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= ' ORDER BY loja, ativo DESC ';
    
    $db->query( $sql );
        
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $endereco = '';
        while ($linha = $db->fetch()) {

            if($linha['endereco'] != ''){

                $endereco = $linha['endereco'];

                if($linha['numero'] != ''){

                    $endereco .= ', ' . $linha['numero'];
                }

                if($linha['complemento'] != ''){

                    $endereco .= ' ' . $linha['complemento'];
                }

                if($linha['bairro'] != ''){

                    $endereco .= ', ' . $linha['bairro'];
                }

                if($linha['cidade'] != ''){

                    $endereco .= ' - ' . $linha['cidade'];
                }

                if($linha['estado'] != ''){

                    $endereco .= '/' . $linha['estado'];
                }

                if($linha['cep'] != ''){

                    $endereco .= ' - ' . $linha['cep'];
                }
            }else{

                $endereco = '';
            }

            $json[] = array(
                'idLoja' => $linha['idLoja'],
                'loja' => $linha['loja'],
                'cnpj' => $linha['cnpj'],
                'endereco' => $endereco,
                'telefone' => $linha['telefone'],
                'email' => $linha['email'],
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO')
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function MostrarLoja() {

    $db = ConectaDB();

    $sql = "SELECT * FROM lojas WHERE idLoja = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {
    
            $json = array(
                'idLoja' => $linha['idLoja'],
                'ativo' => $linha['ativo'],
                'loja' => $linha['loja'],
                'cnpj' => $linha['cnpj'],
                'endereco' => $linha['endereco'],
                'numero' => $linha['numero'],
                'complemento' => $linha['complemento'],
                'bairro' => $linha['bairro'],
                'cidade' => $linha['cidade'],
                'estado' => $linha['estado'],
                'cep' => $linha['cep'],
                'telefone' => $linha['telefone'],
                'email' => $linha['email']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {
    inicia_sessao();

    $db = ConectaDB();
    
    $sql = 'SELECT loja FROM lojas WHERE loja = UCASE("' . $db->escapesql( $_POST['loja']) . '") 
            OR idLoja <> ' . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '2';
    }else{

        $sql = " lojas SET 
                ativo = " . $_POST['ativo'] . ", 
                loja = UCASE('" . $db->escapesql($_POST['loja']) . "'), 
                cnpj = '" . $_POST['cnpj'] . "', 
                endereco = UCASE('" . $db->escapesql($_POST['endereco']) . "'), 
                numero = '" . $_POST['numero'] . "', 
                complemento = UCASE('" . $db->escapesql( $_POST['complemento']) . "'), 
                bairro = UCASE('" . $db->escapesql( $_POST['bairro']) . "'), 
                cidade = UCASE('" . $db->escapesql( $_POST['cidade']) . "'), 
                estado = UCASE('" . $db->escapesql($_POST['estado']) . "'), 
                cep = '" . $_POST['cep'] . "', 
                telefone = '" . $_POST['telefone'] . "', 
                email = '" . $_POST['email'] . "'";

        if ($_POST['codigo'] <= 0) {
            $sql = 'INSERT INTO ' . $sql . ', dataCadastro = NOW(), idUsuarioCadastro = ' . $_SESSION['photoarts_codigo'];
        } else {
            $sql = 'UPDATE ' . $sql . ', dataAtualizacao = NOW(), idUsuarioAtualizacao = ' . $_SESSION['photoarts_codigo'] . ' WHERE idLoja = ' . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows > 0 ) {
            echo '1';
        } else {
            echo '0';
        }
    }
    $db->close();
}

?>