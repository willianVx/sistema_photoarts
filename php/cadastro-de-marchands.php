<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostra':
            Mostra();
            break;
        case 'MostraVendedor':
            MostraVendedor();
            break;
        case'ComboFuncionarios':
            ComboFuncionarios();
            break;
        case 'Gravar':
            Gravar();
            break;

        case 'Desbloquear':
            Desbloquear();
            break;

        case 'Resetar':
            Resetar();
            break;
    }
}

function Resetar() {

    $db = ConectaDB();

    $sql = 'UPDATE vendedores SET senha = MD5("photoarts") WHERE idVendedor = ' . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function Desbloquear() {

    $db = ConectaDB();

    $sql = 'UPDATE vendedores SET tentativas = 0 WHERE idVendedor = ' . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function Mostra() {

    $db = ConectaDB();

    $sql = 'SELECT v.idVendedor, v.idFuncionario, v.vendedor, v.tentativas,  v.pdv, v.gerente, v.ativo, v.descontoMaximo AS descontomaximo,
            v.descontoMaximoObras, v.comissao, l.loja 
            FROM vendedores AS v
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja';

    if ($_POST['nome'] !== '') {
        $sql .= " WHERE v.vendedor LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= ' ORDER BY v.vendedor, v.ativo DESC ';

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idVendedor' => $linha['idVendedor'],
                'idFuncionario' => $linha['idFuncionario'],
                'vendedor' => $linha['vendedor'],
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO'),
                'tentativas' => $linha['tentativas'],
                'descontomaximo' => FormatMoeda($linha['descontomaximo']),
                'descontomaximoobras' => FormatMoeda($linha['descontoMaximoObras']),
                'comissao' => FormatMoeda($linha['comissao']),
                'gerente' => ($linha['gerente'] == 1 ? 'SIM' : 'NÃO'),
                'pdv' => ($linha['pdv'] == 1 ? 'SIM' : 'NÃO'),
                'loja' => $linha['loja']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function MostraVendedor() {

    $db = ConectaDB();

    $sql = 'SELECT idFuncionario, vendedor, pdv, ativo, idLoja, descontoMaximo AS descontomaximo, '
            . 'descontoMaximoObras, gerente, comissao, tentativas FROM vendedores '
            . 'WHERE idVendedor = ' . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'idFuncionario' => $linha['idFuncionario'],
            'vendedor' => $linha['vendedor'],
            'tentativas' => $linha['tentativas'],
            'idLoja' => $linha['idLoja'],
            'ativo' => $linha['ativo'],
            'descontomaximo' => FormatMoeda($linha['descontomaximo']),
            'descontomaximoobras' => FormatMoeda($linha['descontoMaximoObras']),
            'comissao' => FormatMoeda($linha['comissao']),
            'pdv' => $linha['pdv'],
            'gerente' => $linha['gerente']
        );

        echo json_encode($json);
    }
    $db->close();
}

function ComboFuncionarios() {

    $db = ConectaDB();

    $sql = 'SELECT idFuncionario, funcionario FROM funcionarios';

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idFuncionario' => $linha['idFuncionario'],
                'funcionario' => $linha['funcionario']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = 'SELECT vendedor FROM vendedores WHERE vendedor = UCASE("' . $db->escapesql($_POST['vendedor']) . '") 
            AND idLoja = ' . $_POST['idLoja'] . '
            OR idVendedor <> ' . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '2';
    }else{
        $sql = ' vendedores SET'
                . ' idFuncionario = ' . $_POST['idFuncionario']
                . ', idLoja = ' . $_POST['idLoja']
                . ', ativo = ' . $_POST['ativo']
                . ', gerente = ' . $_POST['gerente']
                . ', pdv = ' . $_POST['pdv']
                . ', vendedor = UCASE("' . $db->escapesql($_POST['vendedor']) . '")'
                . ', descontoMaximo = ' . ValorE($_POST['descontomaximo'])
                . ', descontoMaximoObras = ' . ValorE($_POST['descontomaximoobras'])
                . ', comissao = ' . ValorE($_POST['comissao']);


        if ($_POST['codigo'] <= 0) {
            $sql = 'INSERT INTO ' . $sql . ', dataCadastro = NOW(), senha = MD5("photoarts"), idUsuarioCadastro = ' . $_SESSION['photoarts_codigo'];
        } else {
            $sql = 'UPDATE ' . $sql . ', dataAtualizacao = NOW() WHERE idVendedor = ' . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows > 0) {
            echo '1';
        } else {
            echo '0';
        }
    }
    $db->close();
}

?>