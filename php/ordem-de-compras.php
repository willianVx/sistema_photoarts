 
<?php

include('photoarts.php');
require_once '../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarOrdens':
            MostrarOrdens();
            break;

        case 'Gravar':
            Gravar();
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'MostraResultadoClientes':
            MostraResultadoClientes();
            break;

        case 'getObras':
            getObras();
            break;

        case 'getTamanhosObras':
            getTamanhosObras();
            break;

        case 'getDadosTamanho':
            getDadosTamanho();
            break;

        case 'getDetalhesAcabamento':
            getDetalhesAcabamento();
            break;

        case 'ExcluirImagem':
            ExcluirImagem();
            break;

        case 'GerarMiniaturaImagem':
            GerarMiniaturaImagem();
            break;

        case 'CancelarOrdem':
            CancelarOrdem();
            break;

        case 'GerarPdfOrdem':
            GerarPdfOrdem();
            break;

        case 'EnviarPdfOrdemEmail':
            EnviarPdfOrdemEmail();
            break;

        case 'getInfoItem':
            getInfoItem();
            break;

        case 'getItens':
            getItens();
            break;

        case 'getDadosConpag':
            getDadosConpag();
            break;

        case 'Finalizar':
            Finalizar();
            break;
    }
}

function Finalizar() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = "SELECT * FROM ordem_compras WHERE idOrdemCompra = " . $_POST['codigo'];
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        if ($_POST["gerarcontas"] == "1") {
            $sql = "INSERT INTO conpag SET idCentroCusto = " . $_POST['centrocusto'] . ",
                    idNatureza = " . $_POST['natureza'] . ",
                    idFornecedor = " . $linha['idFornecedor'] . ",
                    data = NOW(),
                    dataEmissao = NOW(),
                    valorTotal = " . ValorE($_POST['total']) . ",
                    qtdeParcelas =  " . ValorE($_POST['qtdParcelas']) . ",
                    descricao = 'ORDEM DE COMPRA Nº " . $_POST['codigo'] . ": " . $db->escapesql($linha['obs']) . "',
                    idUsuario =  " . $_SESSION['photoarts_codigo'];

            $db->query( $sql );
            $idConpag = UltimoRegistroInserido($db);

            if ($idConpag <= 0) {
                echo '0';
                return;
            }

            GravarParcelas($db, $idConpag);
        } else {
            $idConpag = 0;
        }

        $sql = "UPDATE ordem_compras SET dataFinalizada = NOW(), finalizada = 1, 
                idUsuarioFinalizada = " . $_SESSION['photoarts_codigo'] . ", 
                idConpag = " . $idConpag . ", NF = '" . $db->escapesql($_POST['recibo']) . "'
                WHERE idOrdemCompra =" . $_POST['codigo'];
        
        $db->query( $sql );

        if ( $db->n_rows > 0) {
            movimentaEstoque($db);
            echo "1";
        } else {
            echo "0";
        }
    }

}

function movimentaEstoque($ArqT) {

    inicia_sessao();

    $sql = "SELECT *,(SELECT idLoja FROM ordem_compras WHERE idOrdemCompra = " . $_POST['codigo'] . ") AS loja
            FROM ordem_compras_comp WHERE idOrdemCompra = " . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){

            if ($linha['idMaterial'] > 0) {

                $sql = "INSERT INTO estoque_materiais SET dataMovimento = NOW(),
                        idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ",
                        idLoja = " . $linha['loja'] . ",
                        idMaterial = " . $linha['idMaterial'] . ",
                        tipoMovimento = 'E',
                        altura = " . $linha['altura'] . ",
                        largura = " . $linha['largura'] . ",
                        qtd = " . $linha['qtd'] . ",
                        idOrdemCompraComp = " . $linha['idOrdemCompraComp'];
            } else {
                $sql = "INSERT INTO estoque_produtos SET dataMovimento = NOW(),
                        idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ",
                        idProduto = " . $linha['idProduto'] . ",
                        idLoja = " . $linha['loja'] . ",
                        idTipoProduto = 3,
                        tipoMovimento = 'E',
                        altura = " . $linha['altura'] . ",
                        largura = " . $linha['largura'] . ",
                        qtd = " . $linha['qtd'] . ",
                        idOrdemCompraComp = " . $linha['idOrdemCompraComp'];
            }

            $db->query( $sql );
        }
    }
}

function getDadosConpag() {

    $db = ConectaDB();

    $sql = "SELECT CURDATE() AS 'data',
           (SELECT SUM(valorTotal) FROM ordem_compras_comp 
            WHERE del = 0 AND idOrdemCompra = " . $_POST['codigo'] . ") AS total";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'data' => FormatData($linha['data'], false),
            'total' => FormatMoeda($linha['total'])
        );

        echo json_encode($json);
    }
    $db->close();
}

function getItens() {
    $db = ConectaDB();
    echo MostrarItens($db);
}

function getInfoItem() {

    $db = ConectaDB();

    if ($_POST['material'] == "1")
        $sql = "SELECT largura, altura, 0 AS valor 
                FROM materiais WHERE idMaterial = " . $_POST['codigo'];
    else
        $sql = "SELECT '0.00' AS largura, '0.00' AS altura, valorProduto AS valor 
                FROM produtos WHERE idProduto = " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'altura' => FormatMoeda($linha['altura']),
            'largura' => FormatMoeda($linha['largura']),
            'valor' => FormatMoeda($linha['valor'])
        );

        echo json_encode($json);
    }
    $db->close();
}

function MostrarOrdens() {

    $db = ConectaDB();

    $sql = "SELECT IFNULL(l.loja, '') AS loja, f.idFornecedor, LPAD(o.idOrdemCompra, 6,0) AS id, o.idOrdemCompra AS codigo,
            DATE(o.dataOrdemCompra) AS 'data', o.dataPrevisao AS previsao, f.fornecedor,
            (SELECT COUNT(*) FROM ordem_compras_comp WHERE idOrdemCompra = o.idOrdemCompra AND del = 0) AS itens,
            o.cancelada, o.finalizada
            FROM ordem_compras AS o
            INNER JOIN fornecedores AS f ON f.idFornecedor = o.idFornecedor
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            WHERE TRUE ";

    if ($_POST['de'] !== '') {
        $sql .= " AND DATE(o.dataOrdemCompra) >= DATE('" . DataSSql($_POST['de']) . "') ";
    }

    if ($_POST['ate'] !== '') {
        $sql .= " AND DATE(o.dataOrdemCompra) <= DATE('" . DataSSql($_POST['ate']) . "') ";
    }

    if ($_POST['fornecedor'] > '0') {
        $sql .= " AND o.idFornecedor = " . $_POST['fornecedor'];
    }

    if ($_POST['loja'] > '0') {
        $sql .= " AND o.idLoja = " . $_POST['loja'];
    }

    if ($_POST['statusBusca'] == '2') {
        $sql .= " AND o.finalizada = 1 ";
    } else if ($_POST['statusBusca'] == '3') {
        $sql .= " AND o.cancelada = 1 ";
    } else if ($_POST['statusBusca'] == '1') {
        $sql .= " AND o.cancelada = 0 AND  o.finalizada = 0 ";
    }

    $sql .= " ORDER BY o.idOrdemCompra DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            if ($linha['cancelada'] == 1)
                $status = "Cancelada";
            else if ($linha['finalizada'] == 1)
                $status = "Finalizada";
            else
                $status = "Em Aberto";

            $json[] = array(
                'codigo' => $linha['codigo'],
                'id' => $linha['id'],
                'loja' => $linha['loja'],
                'data' => FormatData($linha['data'], false),
                'previsao' => FormatData($linha['previsao'], false),
                'fornecedor' => $linha['fornecedor'],
                'idFornecedor' => $linha['idFornecedor'],
                'itens' => $linha['itens'],
                'cancelada' => $linha['cancelada'],
                'finalizada' => $linha['finalizada'],
                'status' => $status
            );
        }

        echo json_encode($json);
    }
    $db->close();
   
}

function Gravar() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = "ordem_compras SET
            dataOrdemCompra = '" . DataSSql($_POST['data']) . "', 
            idFornecedor = " . $_POST['fornecedor'] . ",
            idLoja = " . $_POST['loja'] . ",
            dataPrevisao = '" . DataSSql($_POST['previsao']) . "',
            obs = '" . $db->escapesql($_POST['obs']) . "'";

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idOrdemCompra = " . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUsuarioOrdemCompra = " . $_SESSION['photoarts_codigo'];
    }

    $db->query( $sql );

    if ($_POST['codigo'] > 0) {
        $codigo = $_POST['codigo'];
    } else {
        $codigo = UltimoRegistroInserido($db);
    }

    GravarItens($db, $codigo);

    echo '1';
    $db->close();
}

function GravarParcelas($ArqT, $codigo) {

    inicia_sessao();

    $parcela = explode(',', $_POST['parcela']);
    $valor = explode(',', $_POST['valor']);
    $vencimento = explode(',', $_POST['vencimento']);

    for ($i = 0; $i < count($parcela); $i++) {
        $sql = "INSERT INTO conpagparcelas SET idConpag = " . $codigo . ",
                data = NOW(),
                numero = " . $parcela[$i] . ",
                valor = " . $valor[$i] . ",
                dataVencimento = DATE('" . DataSSql($vencimento[$i]) . "'),
                idUsuario = " . $_SESSION['photoarts_codigo'];
        $ArqT->query( $sql );
    }
}

function GravarItens($ArqT, $codigo) {

    inicia_sessao();

    $sql = "UPDATE ordem_compras_comp SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idOrdemCompra = " . $codigo; // . " AND idOrdemCompraComp NOT IN (" . $_POST['codigos'] . ") ";

    $ArqT->query( $sql );


    if ($_POST['codigos'] == '[]') {
        return;
    }

    $id = explode(',', $_POST['codigos']);
    // $item = explode(',', $_POST['itens']);
    $valor = explode(',', $_POST['valores']);
    $qtd = explode(',', $_POST['qtd']);
    $total = explode(',', $_POST['totais']);
    $material = explode(',', $_POST['idMateriais']);
    $produto = explode(',', $_POST['idProdutos']);
    $altura = explode(',', $_POST['altura']);
    $largura = explode(',', $_POST['largura']);

    for ($i = 0; $i < count($id); $i++) {

        $sql = "ordem_compras_comp SET 
                del=0, 
                idOrdemCompra = " . $codigo . ",
                idMaterial = " . $material[$i] . ",
                idProduto = " . $produto[$i] . ",
                valorUnitario = " . $valor[$i] . ",
                altura = " . $altura[$i] . ",
                largura = " . $largura[$i] . ",
                qtd = " . $qtd[$i] . ",
                valorTotal = " . $total[$i] . " ";

        if ($id[$i] > 0) {
            $sql = "UPDATE " . $sql . ", dataAtualizacao=Now(), 
                    idUsuarioAtualizacao= " . $_SESSION['photoarts_codigo'] . "  
                    WHERE idOrdemCompraComp = " . $id[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro = Now(),  
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        }

        $ArqT->query( $sql );
    }
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT CURDATE() AS dataAtual, f.fornecedor, l.loja,IFNULL(compraf.funcionario,'') AS usuarioComprou,
            IFNULL(cancelf.funcionario,'') AS usuarioCancelou, IFNULL(finalizaf.funcionario,'') AS usuarioFinalizou,
            o.idOrdemCompra AS codigo, o.dataOrdemCompra AS 'data', o.idFornecedor, o.dataPrevisao AS previsao,
            o.obs, o.finalizada, o.cancelada, o.idLoja, o.dataFinalizada, o.dataCancelada, o.idConpag, o.NF FROM ordem_compras AS o
            LEFT JOIN funcionarios AS compraf ON compraf.idFuncionario = o.idUsuarioOrdemCompra
            LEFT JOIN funcionarios AS cancelf ON cancelf.idFuncionario = o.idUsuarioCancelada
            LEFT JOIN funcionarios AS finalizaf ON finalizaf.idFuncionario = o.idUsuarioFinalizada
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            LEFT JOIN fornecedores AS f ON f.idFornecedor = o.idFornecedor
            WHERE idOrdemCompra = " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'id' => number_format_complete($linha['codigo'], '0', 5),
            'codigo' => $linha['codigo'],
            'usuarioComprou' => $linha['usuarioComprou'],
            'usuarioCancelou' => $linha['usuarioCancelou'],
            'usuarioFinalizou' => $linha['usuarioFinalizou'],
            'data' => FormatData($linha['data'], false),
            'idFornecedor' => $linha['idFornecedor'],
            'previsao' => FormatData($linha['previsao'], false),
            'obs' => $linha['obs'],
            'finalizada' => $linha['finalizada'],
            'cancelada' => $linha['cancelada'],
            'dataFinalizada' => FormatData($linha['dataFinalizada'], false),
            'dataCancelada' => FormatData($linha['dataCancelada'], false),
            'idConpag' => $linha['idConpag'],
            'idLoja' => $linha['idLoja'],
            'loja' => $linha['loja'],
            'fornecedor' => $linha['fornecedor'],
            'dataAtual' => FormatData($linha['dataAtual'], false),
            'NF' => $linha['NF'],
            'itens' => MostrarItens($db)
        );

        echo json_encode($json);
    }
    $db->close();
}

function MostrarItens($ArqT) {

    $sql = "SELECT  o.idOrdemCompraComp AS codigo, IFNULL(m.nomeMaterial,'') AS material,
            IFNULL(p.nomeProduto,'') AS produto, o.idMaterial, o.idProduto, o.valorUnitario AS valor,
            o.qtd, o.altura, o.largura, o.valorTotal AS total FROM ordem_compras_comp AS o
            LEFT JOIN materiais AS m ON m.idMaterial = o.idMaterial
            LEFT JOIN produtos AS p ON p.idProduto = o.idProduto
            WHERE o.del = 0 AND o.idOrdemCompra = " . $_POST['codigo'];

    $ArqT->query( $sql );

    if ( $ArqT->n_rows <= 0) {
        return '0';
    }else{
        while ($linha = $ArqT->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'material' => $linha['material'],
                'produto' => $linha['produto'],
                'idMaterial' => $linha['idMaterial'],
                'idProduto' => $linha['idProduto'],
                'valor' => FormatMoeda($linha['valor']),
                'qtd' => FormatMoeda($linha['qtd']),
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']),
                'total' => FormatMoeda($linha['total'])
            );
        }

        return json_encode($json);
    }
}

function getObras() {

    $db = ConectaDB();

    $sql = "SELECT nomeObra, idArtistaObra "
            . "FROM artistas_obras where idArtista=" . $_POST['idArtista'] . " "
            . "ORDER BY nomeObra";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'obra' => $linha['nomeObra'],
                'codigo' => $linha['idArtistaObra']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function getTamanhosObras() {

    $db = ConectaDB();

    $sql = " SELECT CONCAT(t.nomeTamanho, ' (', TRUNCATE(t.altura, 0), 'x', TRUNCATE(t.largura, 0), ')') AS tamanho, 
                aot.idArtistaObraTamanho AS codigo, o.imagem
                FROM artistas_obras_tamanhos AS aot
                LEFT JOIN tamanhos AS t ON aot.idTamanho = t.idTamanho 
                LEFT JOIN artistas_obras AS o ON o.idArtistaObra = aot.idObra
                WHERE aot.del=0 AND aot.idObra = " . $_POST['idObra'] . " ORDER BY t.idTamanho";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'tamanho' => $linha['tamanho'],
                'codigo' => $linha['codigo'],
                'img' => $linha['imagem'],
                'imagem' => 'imagens/obras/mini_' . $linha['imagem']

                    //  'imagem' => 'http://criodigital.net/photoarts/imagens/obras/mini_' . $linha['imagem']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function getDadosTamanho() {

    $db = ConectaDB();

    if ($_POST['item'] == 'p') {

        $sql = "  SELECT altura, largura, tiragemMaxima, tiragemAtual, "
                . "(SELECT estrelas FROM estrelas WHERE ativo=1 AND tiragemAtual BETWEEN de AND ate) AS estrelas "
                . "FROM  artistas_obras_tamanhos "
                . "WHERE idArtistaObraTamanho = " . $_POST['idArtistaObraTamanho'];

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        }else{

            $json = -$db->fetch();
            $json['altura'] = FormatMoeda($json['altura']);
            $json['largura'] = FormatMoeda($json['largura']);
            $json['tiragemMaxima'] = $json['tiragemMaxima'];
            $json['tiragemAtual'] = $json['tiragemAtual'];
            $json['estrelas'] = $json['estrelas'];
        }
    }

    if ($_POST['item'] == 'i') {

        $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idTamanho'];

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        }else{

            $json = -$db->fetch();
            $json['altura'] = FormatMoeda($json['altura']);
            $json['largura'] = FormatMoeda($json['largura']);
        }
    }

    echo json_encode($json);

    $db->close();
}

function getDetalhesAcabamento() {
    $db = ConectaDB();

    //---- PEGA O VALOR E PESO BASE DO ACABAMENTO
    $sql = "SELECT * FROM acabamentos WHERE idAcabamento =" . $_POST['idAcabamento'];
    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo json_encode(array(
            'status' => 'ERROR_GET_ACABAM',
            'SQL' => $sql
        ));
        $db->close();
        return;
    }
    //----------------------------------------

    $linha = $db->fetch();

    $valorBase     = $linha['precoBase'];
    $pesoBase      = $linha['pesoBase'];
    $valorMoldura1 = $linha['indiceAte1MSemEstrela'];
    $valorMoldura2 = $linha['indiceAte1MComEstrela'];
    $valorMoldura3 = $linha['indiceAcima1MSemEstrela'];
    $valorExtra    = $linha['indiceAcima1MComEstrela'];
    $valorAcresMoldura = $linha['valorAcresMoldura'];
    $valorMoldura = 0;
    $valorMinimo = 40;

    //---- PEGA O VALOR BASE DA MOLDURA (CASO EXISTA)
    if ($_POST['idMoldura'] > "0") {
        
        
        $sql = "SELECT mg.valor, mg.idMolduraGrupo "
            . "FROM molduras AS m "
            . "INNER JOIN molduras_grupos AS mg USING(idMolduraGrupo) "
            . "WHERE m.idMoldura =" . $_POST['idMoldura'];

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo json_encode(array(
                'status' => 'ERROR_GET_ACABAM',
                'SQL' => $sql
            ));
            $db->close();
            return;
        }
        //----------------------------------------

        $linha = $db->fetch();
        $MolduraGrp = $linha['idMolduraGrupo'];
        $valorMoldura = $linha['valor'];
        if ($valorMoldura1 > 0 AND $MolduraGrp == 1) {
            $valorMoldura = $valorMoldura1;
        }elseif ($valorMoldura2 > 0 AND $MolduraGrp == 2) {
            $valorMoldura = $valorMoldura2;
        }elseif ($valorMoldura3 > 0 AND $MolduraGrp == 3) {
            $valorMoldura = $valorMoldura3;        
        }
        $valorMoldura += $valorExtra > 0 ? $valorExtra : 0;
    }
    
    //----------------------------------------

    if ($_POST['item'] == 'p') {

        //---- BUSCA OS DETALHES DAS OBRAS (ATUALIZADO)
        
        $sql = "SELECT aob.altura, aob.largura, aob.tiragemMaxima, aob.tiragemAtual, 
            (SELECT SUM(tiragemAtual) 
                FROM artistas_obras_tamanhos 
                WHERE idObra=aob.idObra AND del=0) AS qtdTotalVendida
            FROM artistas_obras_tamanhos AS aob
            WHERE aob.idArtistaObraTamanho =" . $_POST['idObraTamanho'];

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo json_encode(array(
                'status' => 'ERROR_GET_ACABAM',
                'SQL' => $sql
            ));
            $db->close();
            return;
        }
        //----------------------------------------

        $linha = $db->fetch();

        $altura = ($linha['altura'] == 0 ? $_POST['altura'] : $linha['altura']);
        $largura = ($linha['largura'] == 0 ? $_POST['largura'] : $linha['largura']);
      
        $qtdestrelas = (int)($linha['qtdTotalVendida'] / 10);
        
        $indice = 1.5;
        if (($altura  >= 100 || $largura >= 100) ) {
           $indice = 1.8;
        }
        
        if ($valorMoldura > 0) {
            $valorBase += $valorMoldura;
        }
        
        $valorObra = ( ( ( ($altura * $largura) / 10000) * $valorBase  ) + $valorMinimo ) * $indice;
        
        if ( $qtdestrelas >= 1 ) {
            
            $valorObra += ( $valorObra * 0.065 ) * $qtdestrelas;
        }
                
        $pesoObra = round( ( ($altura * $largura) / 10000 ) * $pesoBase, 2);
        
        $valorObra = round( $valorObra, 2);
    }

    if ($_POST['item'] == 'i') {

        $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idObraTamanho'];

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo json_encode(array(
                'status' => 'ERROR_GET_ACABAM',
                'SQL' => $sql
            ));
            $db->close();
            return;
        }
        //----------------------------------------

        $linha = $db->fetch();

        $altura = ($linha['altura'] == 0 ? $_POST['altura'] : $linha['altura']);
        $largura = ($linha['largura'] == 0 ? $_POST['largura'] : $linha['largura']);
       
        if ($valorMoldura > 0) {
            $valorBase += $valorMoldura;
        }
        $valorObra = ( ( ( ($altura * $largura) / 10000) * $valorBase  ) + $valorMinimo );
 
        $pesoObra = round( ( ($altura * $largura) / 10000 ) * $pesoBase, 2);
        
        $valorObra = round( $valorObra, 2);
    }

    $aux = explode(',', FormatMoeda($valorObra));
    $centavos = $aux[1];
    $diferenca = 100 - $centavos;

    if ($centavos > 50) {
        $valorObra += ($diferenca / 100);
    } else if ($centavos < 50) {
        $valorObra -= ($centavos / 100);
    }    
    
    $json = array(
        'status' => 'OK',
        'valorObra' => FormatMoeda(round($valorObra,2)),
        'pesoObra' => FormatMoeda($pesoObra),
        'imagemMoldura' => getImagemMoldura($db, $_POST['idMoldura'])
    );

    echo json_encode($json);
    $db->close();
}


function ExcluirImagem() {

    if (file_exists("../imagens/instaarts/" . $_POST['imagem'])) {
        unlink("../imagens/instaarts/" . $_POST['imagem']);
        unlink("../imagens/instaarts/mini_" . $_POST['imagem']);
    }
}

function GerarMiniaturaImagem() {

    if (file_exists("../imagens/instaarts/" . $_POST['imagem'])) {

        $extensao = explode('.', $_POST['imagem']);

        //Verifica a extensão do arquivo
        if ($extensao[1] !== 'jpg' && $extensao[1] !== 'jpeg') {

            $image = imagecreatefrompng("../imagens/instaarts/" . $_POST['imagem']);
            $quality = 80;

            $filePath = "../imagens/instaarts/" . $extensao[0];

            //Cria imagem .jpg
            $bg = imagecreatetruecolor(imagesx($image), imagesy($image));
            $quality = 80;
            $filePath = "../imagens/instaarts/" . $extensao[0];
            imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
            imagealphablending($bg, TRUE);
            imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
            imagedestroy($image);
            imagejpeg($bg, $filePath . ".jpg", $quality);
            imagedestroy($bg);

            //Exclui arquivo .png
            unlink("../imagens/instaarts/" . $_POST['imagem']);

            $_POST['imagem'] = $extensao[0] . '.jpg';
        }

        Redimensionar("../imagens/instaarts/" . $_POST['imagem'], 175, 125, "mini_", 80);

        $json = array(
            'imagem' => "imagens/instaarts/mini_" . $_POST['imagem']
        );

        echo json_encode($json);
    } else {
        echo "0";
    }
}

function CancelarOrdem() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE ordem_compras SET cancelada = 1, 
            dataCancelada = NOW(),
            idUsuarioCancelada = " . $_SESSION['photoarts_codigo'] . "  
            WHERE idOrdemCompra = " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function GerarPdfOrdem() {

    $db = ConectaDB();

    $sql = "SELECT CURDATE() AS dataAtual, f.fornecedor, l.loja,IFNULL(compraf.funcionario,'') AS usuarioComprou,
            IFNULL(cancelf.funcionario,'') AS usuarioCancelou, IFNULL(finalizaf.funcionario,'') AS usuarioFinalizou,
            o.idOrdemCompra AS codigo, o.dataOrdemCompra AS 'data', o.idFornecedor, o.dataPrevisao AS previsao,
            o.obs, o.finalizada, o.cancelada, o.idLoja, o.dataFinalizada, o.dataCancelada, o.idConpag, o.NF FROM ordem_compras AS o
            LEFT JOIN funcionarios AS compraf ON compraf.idFuncionario = o.idUsuarioOrdemCompra
            LEFT JOIN funcionarios AS cancelf ON cancelf.idFuncionario = o.idUsuarioCancelada
            LEFT JOIN funcionarios AS finalizaf ON finalizaf.idFuncionario = o.idUsuarioFinalizada
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            LEFT JOIN fornecedores AS f ON f.idFornecedor = o.idFornecedor
            WHERE idOrdemCompra = " . $_POST['idOrdem'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
        return;
    }
    
    $linha = $db->fetch();

    $id = number_format_complete($linha['codigo'], '0', 5);
    $loja = $linha['loja'];
    $fornecedor = $linha['fornecedor'];
    $previsao = FormatData($linha['previsao'], false);
    $emissao = FormatData($linha['data'], false);
    $usuario = $linha['usuarioComprou'];
    $obs = $linha['obs'];
    $dataAtual = dataExtenso($linha['dataAtual']);

    $idTipoProduto = 1;

    $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:150px; float:right; margin-top:-30px;' : 'width:270px; float:right; margin-top:10px;');
    $assinatura = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? 'www.photoarts.com.br' : 'www.instaarts.com.br');

    $html = '<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title>Photoarts Gallery - Impressão Ordem de Compra</title>
                        <style>
                            .tabela_cinza_foco {
                                border: none;
                                overflow:auto;
                                color:#000;
                                font-size:10px;
                                padding-left:0px;
                                padding-top:0px;
                                width: 100%;
                                font-family: sans-serif;
                            }
                            .tabela_cinza_foco th {
                                border:none;
                                font-size:12px;
                                color:#000;
                                background: ' . $corPdf . ';//#EB801B;
                                border-radius: 10px 20px;
                            }
                            .tabela_cinza_foco td {
                                border:none;
                                font-size:11px;
                                border-radius: 10px 20px;
                            }
                        </style>
                    </head>
                    <body style="margin:0px; font-family:Arial, Helvetica, sans-serif; font-size:12px;">
                        <div id="quadro1" style="border:1px solid #000; min-height:950px; width:735px; padding-left:15px; padding-right:15px;">
                            <div id="linha1">
                                <div style="overflow:hidden; color:' . $corPdf . '; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;">Ordem de Compra</div>
                                <div style="float:right; overflow:hidden; color:#000; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:right; font-weight:bold; font-size:20px; margin-top:-50px;">Nº Ordem: <span>' . $id . '</span>
                                    <br />
                                    <span>' . strtoupper($nomeProduto) . '</span> 
                                </div>
                            </div>
                            <!--linha1-->
                            <div id="linha2" style="background:' . $corPdf . '; padding:4px; margin-bottom:10px;"></div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:left;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; vertical-align:top; text-align:left; width:auto;">Loja: <span style="font-weight:100; font-size:13px; line-height:22px; color:#444444;">' . $loja . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Fornecedor: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $fornecedor . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Previsão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $previsao . '</span></div>
                            </div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:right;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $emissao . '</span></div>
                                <img src="' . $logoPdf . '" style="' . $medidasLogo . '"/>
                            </div>
                            <div id="linha3" style="margin-top:15px;" ></div>
                            <div id="linhatotal" style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;">
                                <h1 style="display:inline-block; margin:0px; padding:0px; font-size:16px; font-weight:bold; vertical-align:middle">Itens</h1>
                            </div>
                            <div id="tabela" style="border:solid 2px ' . $corPdf . '; border-top:none; height:430px; padding:1px; padding-top:3px; padding-bottom:3px; width:100%;">';

    $sql = "SELECT  o.idOrdemCompraComp AS codigo, IFNULL(m.nomeMaterial,'') AS material,
            IFNULL(p.nomeProduto,'') AS produto, o.idMaterial, o.idProduto, o.valorUnitario AS valor,
            o.qtd, o.altura, o.largura, o.valorTotal AS total FROM ordem_compras_comp AS o
            LEFT JOIN materiais AS m ON m.idMaterial = o.idMaterial
            LEFT JOIN produtos AS p ON p.idProduto = o.idProduto
            WHERE o.del = 0 AND o.idOrdemCompra = " . $_POST['idOrdem'];

    $db->query( $sql );

    if ($idTipoProduto == '1') {

        $html .= '<table class="tabela_cinza_foco"> 
                <thead > 
                    <tr>
                        <th align="left">Tipo</th>
                        <th align="left">Descrição</th>
                        <th align="center">Altura</th>
                        <th align="center">Largura</th>
                        <th align="center">Qtd</th>
                        <th align="right">Valor</th>
                        <th align="right">Total</th>
                    </tr>
                </thead>
                <tbody>';


        $TOTALORDEM = 0;
        $QTDORDEM = 0;
        while ($linha = $db->fetch()) {

            $QTDORDEM++;
            $TOTALORDEM = $TOTALORDEM + $linha['total'];

            $html .= '<tr>
                        <td>' . ($linha['idMaterial'] > 0 ? 'MATERIAL' : 'PRODUTO') . '</td>
                        <td>' . ($linha['idMaterial'] > 0 ? $linha['material'] : $linha['produto']) . '</td>
                        <td align="center">' . FormatMoeda($linha['altura']) . '</td>
                        <td align="center">' . FormatMoeda($linha['largura']) . '</td>
                        <td align="center">' . $linha['qtd'] . '</td>
                        <td align="right">' . FormatMoeda($linha['valor']) . '</td>
                        <td align="right">' . FormatMoeda($linha['total']) . '</td>
                    </tr>';
        }
    } else {

        $html .= '<table class="tabela_cinza_foco"> 
                <thead > 
                    <tr>
                        
                        <th>Qtd</th>
                        <th>Total</th>
                  
                    </tr>
                </thead>
                <tbody>';

        while ($linha = $db->fetch()) {

            $html .= '<tr>
                      
                        <td align="center">' . $QTDORDEM . '</td>
                        <td align="right">' . FormatMoeda($TOTALORDEM) . '</td>
                        
                    </tr>';
        }
    }

    $html .= '</tbody>
            </table></div>';

    $html .= '<div style="min-height:10px;"> </div>
                <div align="right">
                    <div style="border: solid 4px #FFF; text-align:center; width:20%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; border:solid 2px ' . $corPdf . '; float:right; margin-top:5px; margin-bottom:5px;">Total R$ <span>' . FormatMoeda($TOTALORDEM) . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:30%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Qtde <span>' . $QTDORDEM . '</span></div>
                </div>';

    if ($obs != '') {

        $html .= '<div style="border:solid 2px ' . $corPdf . '; height:auto; padding:5px; padding-top:3px; padding-bottom:3px;" >
                    Observações:<br><br>
                    ' . $obs . '
                </div>
                <br>';
    }

    $html .= ' 
                <div style="min-height:10px;"> </div>
         
 
                <!--<div style="min-height:10px;"></div>-->
                <br>
                <span style="font-size:13px; font-weight:bold; line-height:22px;">Cotia, ' . $dataAtual . '</span>
                <!--<div style="min-height:50px;"></div>-->
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; display:inline-block; text-align:center; margin-top:45px;">' . $assinatura . '</div>   
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; float:right; display:inline-block; text-align:center; margin-top:-25px;">' . $usuario . '</div>   
                <!--<div style="min-height:10px;"> </div>-->
                <br>
                <div style="text-align:center; color:#888888; width:350px; margin-top:25px; margin-left:25%;">
                    <span>' . $rodape . '</span>
                    <br />
                    <b>' . $rodape2 . '</b>
                </div>
            </div>
            </body>
            </html>';

    $options = new Options();
    $options->setDpi(110);

    // instantiate and use the dompdf class  
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml( $html );


    // (Optional) Setup the paper size and orientation (portrait or landscape)
    $dompdf->setPaper('A4', "portrait");

    // Render the HTML as PDF
    $dompdf->render();

    //Gera arquivo para saida PDF
    $output = $dompdf->output();
   
    $random = rand();
    
    file_put_contents( '../ordens-de-compra/ordem-de-compra-' . $_POST['idOrdem'] . '.pdf', $output);
    $filepath = 'ordens-de-compra/ordem-de-compra-' . $_POST['idOrdem'] . '.pdf';

    echo $filepath;
    $db->close();
}

function EnviarPdfOrdemEmail() {

    if (!file_exists('../ordens-de-compra/ordem-de-compra-' . $_POST['idOrdem'] . '.pdf')) {
        GerarPdfOrdem();
    }

    $db = ConectaDB();

    $sql = "SELECT IFNULL(email,'') AS email, fornecedor FROM fornecedores WHERE idFornecedor = " . $_POST['fornecedor'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
        return;
    }
    
    $result = $db->fetch();

    if ($result["email"] == "") {
        echo '-1';
        return;
    }

    $email = $result["email"];
    $fornecedor = $result["fornecedor"];
    
    //Busca o tipo de produto
    $idTipoProduto = "1";

    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $corEmail = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $logoEmail = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br');
    $remetente = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $remetenteEmail = ($idTipoProduto == '1' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');

    $assunto = "Ordem de Compra N° " . number_format_complete($_POST['idOrdem'], '0', 5) . " | " . $nomeProduto . " " . FormatData(getServerData(true));

    $mensagem = '
                <html>
                    <head>
                        <title>Ordem de Compra | ' . $nomeProduto . '</title>
                        <meta charset="UTF-8">
                        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid ' . $corEmail . '">
                            <tr align="center">
                                <td valign="top">
                                    <img src="' . $logoEmail . '" style="' . $medidasLogo . '"/>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family:Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:25px;">Olá, ' . $fornecedor . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:20px">Segue em anexo a ordem de compra.</span>
                                    <br>
                                    
                                    <p style="font-size:14px">Se possuir alguma dúvida com relação a ordem de compra entre em contato conosco.</p>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family:Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="center">
                                <td valign="top">
                                    <p>' . $rodape . '</p>
                                    <p>' . $rodape2 . '</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>';

    $ordem = '../ordens-de-compra/ordem-de-compra-' . $_POST['idOrdem'] . '.pdf';

    if (EnvioDeEmailsPhotoarts($fornecedor, $email, $remetenteEmail, $remetente, '', '', $remetenteEmail, $remetente, $assunto, $mensagem, $ordem, $idTipoProduto)) {
        echo '1';
    } else {
        echo '0';
    }
}
