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

        case 'Editar':
            Editar();
            break;

        case 'verHistorico':
            verHistorico();
            break;
    }
}

function Mostra() {
    
    $db = ConectaDB();

    $sql = "SELECT idAcabamento, ativo, nomeAcabamento AS nome, LEFT(dataCadastro , 10) AS `data`,"
            . " precoBase, pesoBase, instaArts, photoArts, idUsuarioCadastro, idUsuarioAtualizacao,"
            . " LEFT(dataAtualizacao , 10) AS dataAtualizacao, "
            . "indiceAte1MSemEstrela, indiceAte1MComEstrela, indiceAcima1MSemEstrela, indiceAcima1MComEstrela "
            . "FROM acabamentos ";

    if ($_POST['nome'] !== '') {
        $sql .= " WHERE nomeAcabamento LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= " ORDER BY ativo DESC, nomeAcabamento";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idAcabamento' => $linha['idAcabamento'],
                'data' => FormatData($linha['data']),
                'nome' => $db->escapesql($linha['nome']),
                'precoBase' => FormatMoeda($linha['precoBase']),
                'pesoBase' => $linha['pesoBase'],
                'precoBaseAte1mSE' => FormatMoeda($linha['indiceAte1MSemEstrela']),
                'precoBaseAte1mCE' => FormatMoeda($linha['indiceAte1MComEstrela']),
                'precoBaseAcima1mSE' => FormatMoeda($linha['indiceAcima1MSemEstrela']),
                'precoBaseAcima1mCE' => FormatMoeda($linha['indiceAcima1MComEstrela']),
                'idUsuarioCadastro' => $linha['idUsuarioCadastro'],
                'idUsuarioAtualizacao' => $linha['idUsuarioAtualizacao'],
                'dataAtualizacao' => FormatData($linha['dataAtualizacao']),
                'instaArts' => ($linha['instaArts'] == 1 ? 'SIM' : 'NÃO'),
                'photoArts' => ($linha['photoArts'] == 1 ? 'SIM' : 'NÃO'),
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO')
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT * FROM acabamentos WHERE nomeAcabamento = '" . $db->escapesql($_POST['nome']) . "' OR idAcabamento <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '2';
        $db->close();
        return;
    }

    $sql = " acabamentos SET nomeAcabamento = '" . $db->escapesql($_POST['nome']) . "',"
            . " precoBase = " . ValorE($_POST['precoBase']) . " , pesoBase = " . ValorE($_POST['pesoBase'])
            . ", indiceAte1MSemEstrela =" . ValorE($_POST['precoBaseAte1mSE'])
            . ", indiceAte1MComEstrela =" . ValorE($_POST['precoBaseAte1mCE'])
            . ", indiceAcima1MSemEstrela =" . ValorE($_POST['precoBaseAcima1mSE'])
            . ", indiceAcima1MComEstrela =" . ValorE($_POST['precoBaseAcima1mCE'])
            . ", instaArts = " . $_POST['instaArts'] . ",  ativo = " . $_POST['ativo'] . ", 
            bloquearVendaUltrapassou1M = " . $_POST['bloquearVenda'] . ", photoArts = " . $_POST['photoArts'];

    if ($_POST['codigo'] <= 0) {

        $sql = "INSERT INTO" . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ";";
    } else {

        $sql = "UPDATE" . $sql . ", dataAtualizacao = NOW(), idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo']
                . " WHERE idAcabamento = " . $_POST['codigo'] . "; ";
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
        return;
    } else {
        if ($_POST['codigo'] > 0) {
            $idacabamento = $_POST['codigo'];
        } else {
            $idacabamento = UltimoRegistroInserido($db);
        }

        $sql = " INSERT INTO acabamentos_historico SET dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ","
                . " precoBase = '" . ValorE($_POST['precoBase']) . "' , idAcabamento = " . $idacabamento
                . " , pesoBase = '" . ValorE($_POST['pesoBase']) . "' ,"
                . " indiceAte1MSemEstrela =" . ValorE($_POST['precoBaseAte1mSE'])
                . ", indiceAte1MComEstrela =" . ValorE($_POST['precoBaseAte1mCE'])
                . ", indiceAcima1MSemEstrela =" . ValorE($_POST['precoBaseAcima1mSE'])
                . ", indiceAcima1MComEstrela =" . ValorE($_POST['precoBaseAcima1mCE'])
                . ", instaArts = " . $_POST['instaArts'] . ", photoArts = " . $_POST['photoArts'];
    }

    $db->query( $sql );

    if ( $db->n_rows > 0 ) {
        echo '-1';
    } else {
        echo '0';
    }
    $db->close();
}

function Editar() {

    $db = ConectaDB();

    $sql = "SELECT a.nomeAcabamento AS nome, a.precoBase AS precoBase, a.pesoBase AS pesoBase , a.instaArts AS instaArts, "
            . " a.photoArts AS photoArts, a.ativo AS ativo , LEFT(a.dataAtualizacao , 10) AS dataAtualizacao, "
            . " IFNULL(f.funcionario, '') AS funcionario, "
            . "a.indiceAte1MSemEstrela, a.indiceAte1MComEstrela, a.indiceAcima1MSemEstrela, a.indiceAcima1MComEstrela, bloquearVendaUltrapassou1M "
            . "FROM acabamentos AS a "
            . "LEFT JOIN funcionarios AS f ON a.idUsuarioAtualizacao = f.idFuncionario "
            . "WHERE a.idAcabamento = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {   

            $json[] = array(
                'nome' => $linha['nome'],
                'precoBase' => FormatMoeda($linha['precoBase']),
                'pesoBase' => FormatMoeda($linha['pesoBase']),
                'precoBaseAte1mSE' => FormatMoeda($linha['indiceAte1MSemEstrela']),
                'precoBaseAte1mCE' => FormatMoeda($linha['indiceAte1MComEstrela']),
                'precoBaseAcima1mSE' => FormatMoeda($linha['indiceAcima1MSemEstrela']),
                'precoBaseAcima1mCE' => FormatMoeda($linha['indiceAcima1MComEstrela']),
                'funcionario' => $linha['funcionario'],
                'dataAtualizacao' => FormatData($linha['dataAtualizacao']),
                'instaArts' => $linha['instaArts'],
                'photoArts' => $linha['photoArts'],
                'ativo' => $linha['ativo'],
                'bloquearVendaUltrapassou1M' => $linha['bloquearVendaUltrapassou1M']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function verHistorico() {

    $db = ConectaDB();

    $sql = "SELECT a.nomeAcabamento AS nome, f.funcionario AS funcionario, "
            . "LEFT(h.dataCadastro , 10) AS `data`, h.precoBase AS precoBase,"
            . " h.pesoBase AS pesoBase, h.instaArts AS instaArts, h.photoArts AS photoArts "
            . "FROM acabamentos_historico AS h "
            . "LEFT JOIN acabamentos AS a ON h.idAcabamento = a.idAcabamento "
            . "LEFT JOIN funcionarios AS f ON h.idUsuarioCadastro = f.idFuncionario"
            . " WHERE h.idAcabamento = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {  

            $json[] = array(
                'nome' => $linha['nome'],
                'data' => FormatData($linha['data']),
                'funcionario' => $linha['funcionario'],
                'precoBase' => FormatMoeda($linha['precoBase']),
                'pesoBase' => $linha['pesoBase'],
                'instaArts' => ($linha['instaArts'] == 1 ? 'SIM' : 'NÃO'),
                'photoArts' => ($linha['photoArts'] == 1 ? 'SIM' : 'NÃO'),
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO')
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

?>