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

    $sql = "SELECT idProduto, nomeProduto, descricaoProduto, "
            . "valorProduto, estoqueMinimo, dataCadastro, ativo "
            . "FROM produtos ";

    if ($_POST['nome'] !== '') {
        $sql .= "WHERE nomeProduto LIKE '%" . $db->escapesql($_POST['nome']) . "%' ";
    }

    $sql .= "ORDER BY ativo DESC, nomeProduto";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idProduto'],
                'produto' => $linha['nomeProduto'],
                'descricao' => $linha['descricaoProduto'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'ativo' => $linha['ativo'],
                'valor' => FormatMoeda($linha['valorProduto']),
                'estoqueMinimo' => $linha['estoqueMinimo']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT * FROM produtos "
            . "WHERE nomeProduto = '" . $db->escapesql( $_POST['nome']) . "' "
            . "OR idProduto <> " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '-1';
    }else{

        $sql = "produtos SET 
                nomeProduto = '" . $db->escapesql($_POST['nome']) . "', 
                descricaoProduto = '" . $db->escapesql($_POST['descricao']) . "', 
                valorProduto = " . ValorE($_POST['valor']) . ", 
                estoqueMinimo = " . ValorE($_POST['estoque']) . ", 
                ativo = " . $_POST['ativo'] . ", 
                idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . ", 
                dataAtualizacao = NOW()";

        if ($_POST['codigo'] <= 0) {
            $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW() , idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        } else {
            $valorAntigo = getValorProduto($db, $_POST['codigo']);
            $sql = "UPDATE " . $sql . " WHERE idProduto = " . $_POST['codigo'];
        }

        $db->query( $sql );

        if ( $db->n_rows < 0) {
            echo '0';
        } else {        

            if ($_POST['codigo'] <= 0) {
                $idProduto = UltimoRegistroInserido($db);
                GravarHistoricoProdutos($db, $idProduto, $_POST['valor']);
            } else {
                $idProduto = $_POST['codigo'];                  
                if(floatval($_POST['valor']) != floatval($valorAntigo)){
                    GravarHistoricoProdutos($db, $idProduto, $_POST['valor']);
                }
            }
            echo '1';
        }
    }
    $db->close();
}

function GravarHistoricoProdutos($ArqT, $idProduto, $valor) {
    inicia_sessao();
    $sql = "INSERT INTO produtos_historico SET dataCadastro=Now(), "
            . "idUsuarioCadastro =" . $_SESSION['photoarts_codigo'] . ", "
            . "idProduto =" . $idProduto . ", "
            . "valor =" . ValorE($valor);

    $ArqT->close();
}

function getValorProduto($ArqT, $idProduto){
    $sql = "SELECT valorProduto FROM produtos WHERE idProduto =" . $idProduto;
    
    $ArqT->query( $sql );

    if ( $db->n_rows < 0) {
        return 0;
    }else{
        $linha = $ArqT->fetch();
        return $linha['valorProduto'];
    }
}
