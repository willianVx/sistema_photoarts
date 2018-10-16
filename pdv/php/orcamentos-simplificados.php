 
<?php

/*
  SITUAÇÕES DE UM ORÇAMENTO
 * 1 - EM ABERTO
 * 2 - VENCIDO
 * 3 - GERADO PEDIDO
 * 4 - CANCELADO
 *  */

include './photoarts-pdv.php';
require_once '../../padrao/pdf/mpdf.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarOrcamentos':
            MostrarOrcamentos();
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

        case 'ExcluirImagem':
            ExcluirImagem();
            break;

        case 'GerarMiniaturaImagem':
            GerarMiniaturaImagem();
            break;

        case 'GerarPdfOrcamento':
            GerarPdfOrcamento();
            break;

        case 'EnviarPdfOrcamentoEmail':
            EnviarPdfOrcamentoEmail();
            break;

        case 'ExcluirOrcamento':
            ExcluirOrcamento();
            break;

        case 'MostrarObras':
            MostrarObras();
            break;

        case 'CalcularValorTamanhoInstaArts':
            CalcularValorTamanhoInstaArts();
            break;
    }
}

function MostrarOrcamentos() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT o.idOrcamentoSimplificado, LPAD(o.idOrcamentoSimplificado, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataOrcamento, c.cliente, l.loja, v.vendedor AS marchand, o.del, 
            o.dataValidade, IFNULL(ve.idVenda, 0) AS idVenda, o.idArtista, 
            (SELECT SUM(valor) FROM orcamentos_simplificados_comp WHERE idOrcamentoSimplificado = o.idOrcamentoSimplificado AND selecionado = 1 AND del = 0) AS valorTotal, 
            DATEDIFF(DATE_ADD(o.dataCadastro, INTERVAL 30 DAY), CURDATE()) AS validade, o.idTipoProduto 
            FROM orcamentos_simplificados AS o
            INNER JOIN lojas AS l ON l.idLoja = o.idLoja             
            INNER JOIN clientes AS c ON c.idCliente = o.idColecionador 
            INNER JOIN vendedores AS v ON v.idVendedor = o.idMarchand 
            LEFT JOIN vendas AS ve ON o.idOrcamentoSimplificado = ve.idOrcamentoSimplificado
            WHERE o.del = 0";
    
    if ($_POST['de'] != '') {
        $sql .= " AND DATE(o.dataCadastro) >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if ($_POST['ate'] != '') {
        $sql .= " AND DATE(o.dataCadastro) <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['busca'] != '') {

        $sql .= " AND (c.cliente LIKE '%" . $_POST['busca'] . "%' 
                OR o.idOrcamentoSimplificado LIKE '%" . $_POST['busca'] . "%' 
                OR (SELECT IFNULL(GROUP_CONCAT(CONCAT(IFNULL(ao.nomeObra, 'InstaArts'), ' (', oc.altura, 'x', oc.largura, ') - ', a.nomeAcabamento) SEPARATOR '<br>'), '')            
                    FROM orcamentos_simplificados_comp AS oc 
                    LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra            
                    INNER JOIN acabamentos AS a ON a.idAcabamento = oc.idAcabamento            
                    WHERE oc.idOrcamento = o.idOrcamento) LIKE '%" . $_POST['busca'] . "%')";
    }

    if ($_POST['statusBusca'] == '1') {
        $sql .= " AND IFNULL(ve.idVenda, 0) <= 0 AND CURDATE() <= o.dataValidade";
    } else if ($_POST['statusBusca'] == '2') {
        $sql .= " AND IFNULL(ve.idVenda, 0) > 0";
    } else if ($_POST['statusBusca'] == '3') {
        $sql .= " AND CURDATE() > o.dataValidade";
    }

    if ($_POST['loja'] > '0') {
        $sql .= " AND l.idLoja = " . $_POST['loja'];
    }

    if ($_POST['vendedor'] > '0') {
        $sql .= " AND v.idVendedor = " . $_POST['vendedor'];
    }

    $sql .= " GROUP BY o.idOrcamentoSimplificado ORDER BY o.dataCadastro DESC";

    if ($_POST['limitar'] == '1')
        //$sql .= " LIMIT 20 ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $status = '';

            if ($linha['idVenda'] != '0') {
                $status = 'GERADO VENDA ' . number_format_complete($linha['idVenda'], '0', 4);
            } else {
                if ($linha['del'] == '1') {
                    $status = 'CANCELADO';
                } else {
                    if ($linha['validade'] < 0) {
                        $status = 'NÃO CONCRETIZADO (VENCIDO)';
                    } else {
                        $status = 'EM ABERTO';
                    }
                }
            }

            $json[] = array(
                'idOrcamentoSimplificado' => $linha['idOrcamentoSimplificado'],
                'numeroOrcamento' => $linha['numeroOrcamento'],
                'dataCadastro' => FormatData($linha['dataOrcamento'], true),
                'cliente' => $linha['cliente'],
                'obras' => getObras2($ArqT, $linha['idOrcamentoSimplificado'], ($linha['idTipoProduto']==1?'1':'0')),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'descricaoStatus' => $status,
                'loja' => $linha['loja'],
                'marchand' => $linha['marchand'],
                'valorTotal' => FormatMoeda($linha['valorTotal'])
            );
        }

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function getObras2($ArqT, $idOrcamentoSimplificado, $idArtista) {

    $sql = "SELECT IFNULL(GROUP_CONCAT(CONCAT(" . ($idArtista == '0' ? "''" : "a.artista") . ", ' - ', " . ($idArtista == '0' ? "'InstaArts'" : "ao.nomeObra") . ", ' - ', t.nomeTamanho, ' (', formatInteiro(osc.altura), 'x', formatInteiro(osc.largura), ')') SEPARATOR '<br>'), 'Nenhuma obra selecionada') AS obras 
            FROM orcamentos_simplificados_comp AS osc 
            " . ($idArtista == '0' ? 'LEFT' : 'INNER') . " JOIN artistas_obras AS ao ON ao.idArtistaObra = osc.idObra";

    if ($idArtista == '0') {

        $sql .= " INNER JOIN tamanhos AS t ON t.idTamanho = osc.idTamanho";
    } else {
        $sql .= " INNER JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = osc.idTamanho
                LEFT JOIN artistas AS a ON a.idArtista=ao.idArtista
                INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho";
    }

    $sql .= " WHERE osc.idOrcamentoSimplificado = " . $idOrcamentoSimplificado . " 
            AND osc.selecionado = 1 AND osc.del = 0 ORDER BY " . ($idArtista == '0' ? "osc.idOrcamentoSimplificado" : "a.artista, ao.nomeObra ");

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return 'Problemas ao carregar a(s) obra(s)/produto(s)';
    } else {
        returnmysqli_result($Tb, 0, "obras");
    }
}

function Gravar() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = " orcamentos_simplificados SET 
            idTipoProduto = " . $_POST['idTipoProduto'] . ",
            idColecionador = " . $_POST['idCliente'] . ", 
            idColecionadorEndereco = " . $_POST['idClienteEndereco'] . ", 
            idAcabamento = " . $_POST['idAcabamento'] . ", 
            idArtista = " . $_POST['idArtista'] . ", 
            idLoja = " . $_POST['idLoja'] . ", 
            dataValidade = '" . DataSSql($_POST['dataValidade']) . "', 
            idMarchand = " . $_POST['idVendedor'] . ", 
            idTipoEntrega = " . $_POST['idTipoTransporte'] . ", 
            obs = '" . TextoSSql($ArqT, $_POST['obs']) . "'";

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao=Now(), " .
                "idUsuarioAtualizacao = 0 " .
                "WHERE idOrcamentoSimplificado =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), " .
                "idUsuarioCadastro =0";
    }

   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        $json = array(
            'status' => 'ERROR_SET_ORC ' . $sql
        );
        echo json_encode($json);
       mysqli_close($ArqT);
        return;
    }

    if ($_POST['codigo'] > 0) {
        $codigo = $_POST['codigo'];
    } else {
        $codigo = UltimoRegistroInserido($ArqT);
    }

    if ($_POST['idTamanho'] != '' && count($_POST['idTamanho']) > 0) {

        $arrayObras = array($_POST['idOrcamentoSimplificadoComp'],
            $_POST['imagem'],
            $_POST['idObra'],
            $_POST['idTamanho'],
            $_POST['altura'],
            $_POST['largura'],
            $_POST['valor'],
            $_POST['selecionados'],
            $_POST['idsArtistas'],
            $_POST['idsAcabamentos']);

        GravarObras($ArqT, $codigo, $arrayObras);
    }

    $json = array(
        'status' => 'OK',
        'idOrcamentoSimplificado' => $codigo
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function GravarObras($ArqT, $idOrcamento, $arrays) {

    session_start();

    $sql = "UPDATE orcamentos_simplificados_comp SET 
            del=1, 
            dataDel=Now(), 
            idUsuarioDel = 0 
            WHERE idOrcamentoSimplificado = " . $idOrcamento;

   mysqli_query($ArqT, $sql);

    $idOrcamentoSimplificadoComp = explode('#', $arrays[0]);
    $imagem = explode(',', $arrays[1]);
    $idObra = explode(',', $arrays[2]);
    $idTamanho = explode('#', $arrays[3]);
    $altura = explode('#', $arrays[4]);
    $largura = explode('#', $arrays[5]);
    $valor = explode('#', $arrays[6]);
    $selecionado = explode('#', $arrays[7]);

    $idArtista = explode(',', $arrays[8]);
    $idAcabamento = explode(',', $arrays[9]);

    for ($i = 0; $i < count($idObra); $i++) {

        if (count($idObra) == count($idTamanho)) {

            $idOrcamentoSimplificadoCompAux = explode(',', $idOrcamentoSimplificadoComp[$i]);
            $idTamanhoAux = explode(',', $idTamanho[$i]);
            $alturaAux = explode(',', $altura[$i]);
            $larguraAux = explode(',', $largura[$i]);
            $valorAux = explode(',', $valor[$i]);
            $selecionadoAux = explode(',', $selecionado[$i]);

            for ($j = 0; $j < count($idTamanhoAux); $j++) {
                
                $sql = " orcamentos_simplificados_comp SET
                    idOrcamentoSimplificado = " . $idOrcamento . ", 
                    idArtista = " . ($idArtista[$i]=='null' ? '0' : $idArtista[$i]) . ", 
                    idAcabamento = " . $idAcabamento[$i] . ", 
                    idObra = " . $idObra[$i] . ", 
                    idTamanho =" . $idTamanhoAux[$j] . ", 
                    altura ='" . $alturaAux[$j] . "', 
                    largura ='" . $larguraAux[$j] . "', 
                    valor ='" . $valorAux[$j] . "', 
                    imagemObra ='" . $imagem[$i] . "', 
                    selecionado = " . $selecionadoAux[$j];

                if ($idOrcamentoSimplificadoCompAux[$j] > 0) {

                    $sql = "UPDATE " . $sql . ", del=0, dataAtualizacao=Now(), "
                            . "idUsuarioAtualizacao=0 "
                            . "WHERE idOrcamentoSimplificadoComp =" . $idOrcamentoSimplificadoCompAux[$j];
                } else {
                    $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), "
                            . "idUsuarioCadastro =0";
                }

               mysqli_query($ArqT, $sql);                

                if ($idOrcamentoSimplificadoCompAux[$j] <= 0 && $idObra[$i] == '0') {
                    $idOrcamentoSimplificadoCompAux2 = UltimoRegistroInserido($ArqT);

                    $sql = "INSERT INTO orcamentos_simplificados_instaarts 
                            SET idOrcamentoSimplificadoComp = " . $idOrcamentoSimplificadoCompAux2;
                    
                   mysqli_query($ArqT, $sql);

                    $idOrcamentoSimplificadoInstaarts = UltimoRegistroInserido($ArqT);

                    $sql = "UPDATE orcamentos_simplificados_comp SET 
                            idOrcamentoSimplificadoInstaarts = " . $idOrcamentoSimplificadoInstaarts . " 
                            WHERE idOrcamentoSimplificadoComp = " . $idOrcamentoSimplificadoCompAux2;
                    
                   mysqli_query($ArqT, $sql);
                }

                if (mysqli_affected_rows($ArqT) <= 0) {
                    $json = array(
                        'status' => 'ERROR_SET_ORC_COMP - ' . $sql
                    );
                    echo json_encode($json);
                   mysqli_close($ArqT);
                    return;
                }
            }
        }
    }
}

function Mostrar() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT o.idOrcamentoSimplificado, o.idTipoProduto, o.idColecionador, o.idColecionadorEndereco,
            o.idAcabamento, o.idArtista, 
            o.idLoja, o.dataValidade, o.dataCadastro, o.idMarchand, o.idTipoEntrega, o.obs, 
            IFNULL(v.idVenda, 0) AS idVenda, IFNULL(v.dataVenda, '') AS dataVenda, c.email, 
            DATEDIFF(DATE_ADD(o.dataCadastro, INTERVAL 30 DAY), CURDATE()) AS validade 
            FROM orcamentos_simplificados AS o 
            LEFT JOIN vendas AS v ON o.idOrcamentoSimplificado = v.idOrcamentoSimplificado 
            INNER JOIN clientes AS c ON c.idCliente = o.idColecionador
            WHERE o.idOrcamentoSimplificado = " . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $status = '';

    if ($linha['idVenda'] != '0') {
        $status = 'Gerado venda ' . number_format_complete($linha['idVenda'], '0', 4) . ' em ' . substr(FormatData($linha['dataVenda']), 0, 16);
    } else {
        if ($linha['validade'] < 0) {
            $status = 'Não concretizado (vencido)';
        } else {
            $status = 'Em aberto';
        }
    }

    $json = array(
        'idOrcamento' => $linha['idOrcamentoSimplificado'],
        'idLoja' => $linha['idLoja'],
        'proposta' => number_format_complete($linha['idOrcamentoSimplificado'], '0', 5),
        'dataCadastro' => FormatData($linha['dataCadastro'], false),
        'dataValidade' => FormatData($linha['dataValidade'], false),
        'situacao' => $status,
        'idVenda' => $linha['idVenda'],
        'idCliente' => $linha['idColecionador'],
        'idClienteEndereco' => $linha['idColecionadorEndereco'],
        'email' => $linha['email'],
        'idVendedor' => $linha['idMarchand'],
        'idTransporteTipo' => $linha['idTipoEntrega'],
        'idTipoProduto' => $linha['idTipoProduto'],
        'idAcabamento' => $linha['idAcabamento'],
        'idArtista' => $linha['idArtista'],
        'obs' => $linha['obs'],        
        'contato' => '',
        'telefone' => '',
        'valor' => '0,00',
        'valorFrete' => '0,00',
        'valorAcrescimo' => '0,00',
        'percDesconto' => '0,00',
        'valorDesconto' => '0,00',
        'valorTotal' => '0,00',
        'arrayObras' => ListarObras($ArqT, $linha['idOrcamentoSimplificado'])
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function ListarObras($ArqT, $idOrcamento) {
    
    $sql = "SELECT osc.idOrcamentoSimplificadoComp, IFNULL(ao.nomeObra, '- - -') AS nomeObra, o.idTipoProduto, 
            0 AS idProduto, '' AS nomeProduto, osc.idObra, o.idAcabamento, osc.idTamanho, osc.altura, osc.largura, 
            osc.valor, 1 AS qtd, 0.00 AS percentualDesconto, 0.00 AS valorDesconto, 0.00 AS valorAcrescimo, 
            osc.valor AS valorTotal, '' AS obs, aot.tiragemMaxima, 0 AS qtdVendidoAtual, 0 AS estrelasAtual, 
            osc.imagemObra, 0.00 AS pesoObra, tp.produto AS nomeTipo, IFNULL(a.artista, '- - -') AS artista, 
            IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, 
            IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, ao.idArtista, 0 AS idMolduraGrupo, 0 AS idMoldura, 
            '' AS moldura
            FROM orcamentos_simplificados_comp AS osc
            INNER JOIN orcamentos_simplificados AS o ON o.idOrcamentoSimplificado = osc.idOrcamentoSimplificado
            INNER JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = osc.idTamanho 
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = osc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista 
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = osc.idTamanho
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = osc.idAcabamento 
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=o.idTipoProduto
            WHERE osc.idOrcamentoSimplificado = " . $idOrcamento . " AND osc.del = 0 AND osc.selecionado = 1";
    
    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $json[] = array(
                'idOrcamentoComp' => $linha['idOrcamentoSimplificadoComp'],
                'idTipoProduto' => $linha['idTipoProduto'],
                'idTipo' => $linha['idTipoProduto'],
                'idProduto' => $linha['idProduto'],
                'nomeProduto' => $linha['nomeProduto'],
                'idObra' => $linha['idObra'],
                'idAcabamento' => $linha['idAcabamento'],
                'idTamanho' => $linha['idTamanho'],
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']),
                'valor' => FormatMoeda($linha['valor']),
                'qtde' => $linha['qtd'],
                'percentualDesconto' => FormatMoeda($linha['percentualDesconto']),
                'valorDesconto' => FormatMoeda($linha['valorDesconto']),
                'valorAcrescimo' => FormatMoeda($linha['valorAcrescimo']),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'obs' => $linha['obs'],
                'tiragem' => $linha['tiragemMaxima'],
                'qtdVendido' => $linha['qtdVendidoAtual'],
                'estrelas' => $linha['estrelasAtual'],
                'imagem' => $linha['imagemObra'],
                'peso' => FormatMoeda($linha['pesoObra']),
                'nomeTipo' => $linha['nomeTipo'],
                'nomeObra' => $linha['nomeObra'],
                'nomeArtista' => $linha['artista'],
                'nomeTamanho' => ($linha['idTipoProduto'] == 1 ? $linha['nomeTamanho'] : $linha['nomeTamanhoInsta']),
                'nomeAcabamento' => $linha['nomeAcabamento'],
                'idArtista' => $linha['idArtista'],
                'idMolduraGrupo' => $linha['idMolduraGrupo'],
                'idMoldura' => $linha['idMoldura'],
                'moldura' => $linha['moldura']
            );
        }

        return json_encode($json);
    }
}

function MostrarObras() {

    $ArqT = AbreBancoPhotoartsPdv();

    if ($_POST['idOrcamentoSimplificado'] <= '0' || $_POST['salvas'] == '0') {
        $sql = "SELECT idArtistaObra, nomeObra, imagem 
                FROM artistas_obras 
                WHERE idArtista = " . $_POST['idArtista'] . " AND del = 0";
        
        $idArtista = $_POST['idArtista'];
    } else {
        $sql = "SELECT idObra AS idArtistaObra, IFNULL(ao.nomeObra, 'InstaArts') AS nomeObra, osc.imagemObra AS imagem, 
                GROUP_CONCAT(idOrcamentoSimplificadoInstaarts) AS idsInstaarts, IFNULL(a.artista, 'Instaarts') AS nomeArtista,
                IFNULL(ac.nomeAcabamento, '') AS nomeAcabamento, ao.idArtista, osc.idAcabamento
                FROM orcamentos_simplificados_comp AS osc
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = osc.idObra
                LEFT JOIN artistas AS a ON ao.idArtista = a.idArtista
                LEFT JOIN acabamentos AS ac ON ac.idAcabamento = osc.idAcabamento
                WHERE osc.idOrcamentoSimplificado = " . $_POST['idOrcamentoSimplificado'] . " AND osc.del = 0";

        if ($_POST['idArtista'] != '0') {
            $sql .= " GROUP BY osc.idObra";
        } else {
            $sql .= " GROUP BY osc.imagemObra";
        }

        $sql .= " ORDER BY osc.idOrcamentoSimplificado, nomeArtista, nomeObra ";        
        
        $idArtista = -2;
    }    
    
    $Tb = ConsultaSQL($sql, $ArqT);   

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $json[] = array(
                'idArtistaObra' => $linha['idArtistaObra'],
                'nomeObra' => $linha['nomeObra'],
                'imagem' => $linha['imagem'],
                'idArtista' => $linha['idArtista'],
                'idAcabamento' => $linha['idAcabamento'],
                'nomeArtista' => $linha['nomeArtista'],
                'nomeAcabamento' => $linha['nomeAcabamento'],
                'tamanhos' => MostrarTamanhosObras($ArqT, $linha['idArtistaObra'], $_POST['idAcabamento'], $_POST['idOrcamentoSimplificado'], ($idArtista==-2 ? $linha['idArtista'] : $idArtista), $linha['idsInstaarts'])
            );
        }

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function MostrarTamanhosObras($ArqT, $idObra, $idAcabamento, $idOrcamentoSimplificado, $idArtista, $idsInstaarts) {

    if ($idOrcamentoSimplificado <= 0 || $_POST['salvas']=='0') {

        $sql = "SELECT precoBase, pesoBase, indiceAte1MSemEstrela, indiceAte1MComEstrela, indiceAcima1MSemEstrela, 
            indiceAcima1MComEstrela 
            FROM acabamentos WHERE idAcabamento = " . $idAcabamento;

        $Tb =mysqli_query($ArqT, $sql);

        if (mysqli_num_rows($Tb) <= 0) {
            return '0';
        }

        $linha =mysqli_fetch_assoc($Tb);

        $valorBase = $linha['precoBase'];
        $pesoBase = $linha['pesoBase'];
        $indiceAte1MSemEstrela = $linha['indiceAte1MSemEstrela'];
        $indiceAte1MComEstrela = $linha['indiceAte1MComEstrela'];
        $indiceAcima1MSemEstrela = $linha['indiceAcima1MSemEstrela'];
        $indiceAcima1MComEstrela = $linha['indiceAcima1MComEstrela'];

        $sql = "SELECT aot.idArtistaObraTamanho, t.nomeTamanho, aot.altura, aot.largura, aot.tiragemMaxima, 
                aot.tiragemAtual, 0 AS selecionado, 0 AS idOrcamentoSimplificadoComp, 
                (SELECT estrelas FROM estrelas 
                WHERE ativo=1 AND 
                (SELECT SUM(tiragemAtual)+1 FROM artistas_obras_tamanhos 
                WHERE idObra=aot.idObra AND del=0) BETWEEN de AND ate) AS estrelas, 
                (SELECT SUM(tiragemAtual) 
                FROM artistas_obras_tamanhos 
                WHERE idObra=aot.idObra AND del=0) AS qtdTotalVendida
                FROM artistas_obras_tamanhos AS aot
                INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
                WHERE idObra = " . $idObra . " AND del = 0";

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) <= 0) {
            return '0';
        } else {

            while ($linha =mysqli_fetch_assoc($Tb)) {

                $altura = ($linha['altura'] == 0 ? $_POST['altura'] : $linha['altura']);
                $largura = ($linha['largura'] == 0 ? $_POST['largura'] : $linha['largura']);

                $tiragemMaxima = $linha['tiragemMaxima'];
                $tiragemAtual = $linha['tiragemAtual'];
                $estrelas = $linha['estrelas'];

                //ACIMA DE 1 M²
                if (($altura * $largura) > 10000) {
                    if ($estrelas < 1) {
                        $indice = $indiceAcima1MSemEstrela;
                    } else {
                        //CALCULAR O REAUSTE DO INDICE
                        if ($estrelas > 1) {
                            $indice = $indiceAcima1MComEstrela + (($estrelas - 1) * 150);
                        } else {
                            $indice = $indiceAcima1MComEstrela;
                        }
                    }
                }
                //ATÉ 1 M²
                else {
                    if ($estrelas < 1) {
                        $indice = $indiceAte1MSemEstrela;
                    } else {
                        //CALCULAR O REAJUSTE DO INDICE
                        if ($estrelas > 1) {
                            $indice = $indiceAte1MComEstrela + (($estrelas - 1) * 150);
                        } else {
                            $indice = $indiceAte1MComEstrela;
                        }
                    }
                }

                $valorObra = round((($altura * $largura) / 10000) * $indice, 2);

                $aux = explode(',', FormatMoeda($valorObra));
                $centavos = $aux[1];
                $diferenca = 100 - $centavos;

                if ($centavos > 50) {
                    $valorObra += ($diferenca / 100);
                } else if ($centavos < 50) {
                    $valorObra -= ($centavos / 100);
                }

                $json[] = array(
                    'idOrcamentoSimplificadoComp' => $linha['idOrcamentoSimplificadoComp'],
                    'idArtistaObraTamanho' => $linha['idArtistaObraTamanho'],
                    'nomeTamanho' => $linha['nomeTamanho'],
                    'altura' => FormatMoeda($linha['altura']),
                    'largura' => FormatMoeda($linha['largura']),
                    'valor' => FormatMoeda(round($valorObra, 2)),
                    'selecionado' => $linha['selecionado']
                );
            }

            return json_encode($json);
        }
    } 
    else {

        $sql = "SELECT osc.idOrcamentoSimplificadoComp, osc.idTamanho, t.nomeTamanho, osc.altura, osc.largura, 
                osc.valor, osc.selecionado 
                FROM orcamentos_simplificados_comp AS osc ";

        if ($idObra == '0') {
            $sql .= " INNER JOIN tamanhos AS t ON t.idTamanho = osc.idTamanho 
                    INNER JOIN orcamentos_simplificados_instaarts AS osi ON osi.idOrcamentoSimplificadoComp = osc.idOrcamentoSimplificadoComp";
        } else {
            $sql .= " INNER JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = osc.idTamanho
                    INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho";
        }

        $sql .= " WHERE osc.idObra = " . $idObra;
        $sql .= " AND osc.idOrcamentoSimplificado = " . $idOrcamentoSimplificado . " ";

        if ($idObra == '0') {
            $sql .= "  AND idOrcamentoSimplificadoInstaarts IN(" . $idsInstaarts . ")";
            //$sql .= " GROUP BY osc.imagemObra, osc.idTamanho, osi.idOrcamentoSimplificadoInstaarts";
        } else {
            $sql .= " ORDER BY osc.idOrcamentoSimplificadoComp";
        }
        
        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) <= 0) {
            return '0';
        } else {

            while ($linha =mysqli_fetch_assoc($Tb)) {

                $json[] = array(
                    'idOrcamentoSimplificadoComp' => $linha['idOrcamentoSimplificadoComp'],
                    'idArtistaObraTamanho' => $linha['idTamanho'],
                    'nomeTamanho' => $linha['nomeTamanho'],
                    'altura' => FormatMoeda($linha['altura']),
                    'largura' => FormatMoeda($linha['largura']),
                    'valor' => FormatMoeda($linha['valor']),
                    'selecionado' => $linha['selecionado']
                );
            }

            return json_encode($json);
        }
    }
}

function ExcluirImagem() {

    if (file_exists("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem'])) {
        unlink("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem']);
        unlink("../imagens/" . $_POST['pasta'] . "/mini_" . $_POST['imagem']);
    }
}

function GerarMiniaturaImagem() {

    if (file_exists("../../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem'])) {

        $extensao = explode('.', $_POST['imagem']);

        //Verifica a extensão do arquivo
        if ($extensao[1] !== 'jpg' && $extensao[1] !== 'jpeg') {

            $image = imagecreatefrompng("../../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem']);
            $quality = 80;

            $filePath = "../../imagens/" . $_POST['pasta'] . "/" . $extensao[0];

            //Cria imagem .jpg
            $bg = imagecreatetruecolor(imagesx($image), imagesy($image));
            $quality = 80;
            $filePath = "../../imagens/" . $_POST['pasta'] . "/" . $extensao[0];
            imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
            imagealphablending($bg, TRUE);
            imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
            imagedestroy($image);
            imagejpeg($bg, $filePath . ".jpg", $quality);
            imagedestroy($bg);

            //Exclui arquivo .png
            unlink("../../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem']);

            $_POST['imagem'] = $extensao[0] . '.jpg';
        }

        Redimensionar("../../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem'], 175, 125, "mini_", 80);

        $json = array(
            'imagem' => "imagens/" . $_POST['pasta'] . "/mini_" . $_POST['imagem']
        );

        echo json_encode($json);
    } else {
        echo "0";
    }
}

function GerarPdfOrcamento() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT c.cliente, a.nomeAcabamento, IFNULL(ar.artista, 'Instaarts') AS artista,
            ve.vendedor, os.idTipoProduto, l.loja, os.dataCadastro, os.dataValidade, 
            tt.tipoTransporte, c.responsavel, c.telefone, c.celular, c.email, os.obs
            FROM orcamentos_simplificados AS os
            INNER JOIN clientes AS c ON c.idCliente = os.idColecionador
            INNER JOIN acabamentos AS a ON a.idAcabamento = os.idAcabamento
            INNER JOIN vendedores AS ve ON ve.idVendedor = os.idMarchand 
            LEFT JOIN artistas AS ar ON ar.idArtista = os.idArtista
            LEFT JOIN lojas AS l ON os.idLoja = l.idLoja
            LEFT JOIN transportes_tipos AS tt ON tt.idTransporteTipo = os.idTipoEntrega
            WHERE os.idOrcamentoSimplificado = " . $_POST['idOrcamento'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $cliente = $linha['cliente'];
    $clienteTelefone = $linha['telefone'] . '/' . $linha['celular'];
    $clienteEmail = $linha['email'];
    $tipoTransporte = $linha['tipoTransporte'];
    $obs = $linha['obs'];
    $nomeAcabamento = $linha['nomeAcabamento'];
    $dataOrcamento = FormatData($linha['dataCadastro']);
    $dataValidade = FormatData($linha['dataValidade']);
    $artista = $linha['artista'];
    $vendedor = $linha['vendedor'];
    $idTipoProduto = $linha['idTipoProduto'];
    $loja = $linha['loja'];

    $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:150px; float:right; margin-top:-53px;' : 'width:270px; float:right; margin-top:10px;');
    $assinatura = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'Instaarts') . '<br>' . $vendedor;
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'Instaarts - O laboratório de arte contemporânea ');
    $rodape1 = ($idTipoProduto == '1' ? 'Rua Monet, 731 - Granja Viana - Cotia/SP - CEP: 06710-660 ' : 'Rua Monet, 731 - Granja Viana - Cotia/SP - CEP: 06710-660 ');
    $rodape3 = ($idTipoProduto == '1' ? 'Tel.: (55 11) 4612-6019 | 4612-3157 ' : 'Tel.: (55 11) 4612-6019 | 4612-3157 ');
    $rodape4 = ($idTipoProduto == '1' ? 'E-mail: atendimento@photoarts.com.br | mail@photoarts.com.br ' : 'E-mail: contato@instaarts.com.br ');
    $rodape2 = ($idTipoProduto == '1' ? 'www.photoarts.com.br' : 'www.instaarts.com.br');

    $html = '<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title>Photoarts Gallery - Impressão Orçamento</title>
                    </head>
                    <body style="margin:0px; font-family:Arial, Helvetica, sans-serif; font-size:12px;">
                        <!--<div id="quadro1" style="border:1px solid #000; min-height:950px; width:735px; padding-left:15px; padding-right:15px;">
                            <div style="text-align:center;" align="center">
                                <img src="http://www.photoarts.com.br/sistema/imagens/Logopronto_fundo_branco.jpeg" style="width:150px; height:auto;"/>
                            </div>-->
                            ';
//border:1px solid #000; height:1200px; 
    $html .= '<div id="quadro1" style="width:735px; padding-left:15px; padding-right:15px;">
                            <div id="linha1">
                                <div style="overflow:hidden; color:' . $corPdf . '; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;">Orçamento</div>
                                <div style="float:right; overflow:hidden; color:#000; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:right; font-weight:bold; font-size:20px; margin-top:-50px;">Nº Orçamento: <span>' . number_format_complete($_POST['idOrcamento'], '0', 5) . '</span>
                                    <br />
                                    <span>' . $loja . '</span> 
                                </div>
                            </div>
                            <!--linha1-->
                            <div id="linha2" style="background:' . $corPdf . '; padding:4px; margin-bottom:10px;"></div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:left;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; vertical-align:top; text-align:left; width:auto;">Colecionador: <span style="font-weight:100; font-size:13px; line-height:22px; color:#444444;">' . $cliente . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Telefone: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $clienteTelefone . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">E-mail: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $clienteEmail . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Marchand: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444; width:auto;">' . $vendedor . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Tipo Entrega: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444; width:auto;">' . $tipoTransporte . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Obs.: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444; width:auto;">' . $obs . '</span></div>
                            </div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:right;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $dataOrcamento . '</span></div>
                                <div style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">Valido até <span style="font-size:16px;">' . $dataValidade . '</span></div>
                                <img src="' . $logoPdf . '" style="' . $medidasLogo . '"/>
                            </div>
                            <div id="linha3" style="margin-top:15px;" ></div>
                            <div id="linhatotal" style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;">
                                <h1 style="display:inline-block; margin:0px; padding:0px; font-size:15px; font-weight:bold; vertical-align:middle">Obras</h1>
                            </div>';

    $sql = "SELECT IFNULL(ao.nomeObra, 'Instaarts') AS nomeObra, IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, 
            osc.altura, osc.largura, osc.valor, osc.imagemObra, ab.nomeAcabamento, osc.selecionado,
            IFNULL(a.artista, 'Instaarts') AS nomeArtista, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta
            FROM orcamentos_simplificados_comp AS osc
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = osc.idObra 
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = osc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = osc.idTamanho
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ab ON ab.idAcabamento = osc.idAcabamento
            WHERE idOrcamentoSimplificado = " . $_POST['idOrcamento'] . " AND osc.del = 0";

    $Tb = ConsultaSQL($sql, $ArqT);

    $nomeObra = '';
    $imagemObra = '';
    $nomeAcab = '';
    $cont = 0;
    
    while ($linha =mysqli_fetch_assoc($Tb)) {
        
        
        //if ($artista == 'Instaarts') {
        if ($idTipoProduto == 2) {

            if ($imagemObra != $linha['imagemObra']){

                $imagemObra = $linha['imagemObra'];      
                $nomeAcab = '';
                $cont++;

                $html .= '<div style="margin-top:20px; ">
                            <img style="width:150px; height:auto;" src="http://www.photoarts.com.br/sistema/imagens/instaarts/' . $linha['imagemObra'] . '"/>
                            <br>
                            <label><b>Artista:</b> Instaarts</label>
                            <br>
                            <label><b>Obra:</b> ' . $linha['nomeObra'] . '</label>';
                            /*<br>
                            <label><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                            <br>
                            <label><b>Tamanhos</b></label>';*/
            }
        } 
        else {            
            if ($nomeObra != $linha['nomeObra']) {

                $nomeObra = $linha['nomeObra'];
                $nomeAcab = '';
                $cont++;

                $html .= '<div style="margin-top:20px; ">
                            <img style="width:150px; height:auto;" src="http://www.photoarts.com.br/sistema/imagens/obras/' . $linha['imagemObra'] . '"/>
                            <br>
                            <label><b>Artista:</b> ' . $linha['nomeArtista'] . '</label>
                            <br>
                            <label><b>Obra:</b> ' . $linha['nomeObra'] . '</label>';
                            /*<br>
                            <label><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                            <br>
                            <label><b>Tamanhos</b></label>';*/
            }
        }
        
        if ($nomeAcab != $linha['nomeAcabamento']) {
            $nomeAcab = $linha['nomeAcabamento'];
            
            $html .= '<br /><label style="padding-top:10px"><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                            <br>
                            <label><b>Tamanhos</b></label>';
            
        }
        
        if ($linha['selecionado'] == '1') {
            $html .= '<br>
                <label>' . ($idTipoProduto == 2 ? $linha['nomeTamanhoInsta'] : $linha['nomeTamanho']) . ' (' . FormatMoeda($linha['altura']) . ' x ' . FormatMoeda($linha['largura']) . '): <b>R$ ' . FormatMoeda($linha['valor']) . '</b></label>';
        }
    }
    
    
    $html .='<!--<div style="text-align:center; color:#888888; width:350px; margin-top:25px; margin-left:25%;">
                <hr />
                <b>' . $rodape . '</b>
                <br />
                <span>' . $rodape1 . '</span>
                <br />
                <span>' . $rodape3 . '</span>
                <br />
                <span>' . $rodape4 . '</span>
                <br />
                <b>' . $rodape2 . '</b>
            </div>-->';
    
    $html .= '</div></body></html>';
    
    $rodape ='<div style="text-align:center; color:#888888; width:100%; margin-top:25px; font-size:10px">
                <hr />
                <b>' . $rodape . '</b>
                <br />
                <span>' . $rodape1 . '</span>
                <br />
                <span>' . $rodape3 . '</span>
                <br />
                <span>' . $rodape4 . '</span>
                <br />
                <b>' . $rodape2 . '</b>
            </div>';

    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');    
    //$pdf->SetFooter('{DATE j/m/Y  H:i}||Pagina {PAGENO}/{nb}');       
    
    $pdf->WriteHTML($html);
    $pdf->SetHTMLFooter($rodape);
    
    $pdf->Output('../../orcamentos/orcamento-simplificado-' . $_POST['idOrcamento'] . '.pdf', 'F');
    $filepath = '../orcamentos/orcamento-simplificado-' . $_POST['idOrcamento'] . '.pdf';

    echo $filepath;
   mysqli_close($ArqT);
}

function EnviarPdfOrcamentoEmail() {

    if (!file_exists('../../orcamentos/orcamento-simplificado-' . $_POST['idOrcamento'] . '.pdf')) {
        GerarPdfOrcamento();
    }

    $ArqT = AbreBancoPhotoartsPdv();

    //Busca o tipo de produto
    $sql = "SELECT idTipoProduto FROM orcamentos_simplificados WHERE idOrcamentoSimplificado = " . $_POST['idOrcamento'] . " AND del = 0 LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);
    $idTipoProduto =mysqli_result($Tb, 0, "idTipoProduto");

    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $corEmail = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $logoEmail = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br');
    $remetente = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $remetenteEmail = ($idTipoProduto == '1' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');

    $assunto = "Orçamento N° " . number_format_complete($_POST['idOrcamento'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));
    
    /* $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idOrcamento'] . " AND del = 0 LIMIT 1";
      $Tb = ConsultaSQL($sql, $ArqT);
      $idTipoProduto =mysqli_result($Tb, 0, "idTipoProduto");

      $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
      $corEmail = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
      $logoEmail = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
      $medidasLogo = ($idTipoProduto == '1' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
      $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
      $rodape2 = ($idTipoProduto == '1' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br'); */
    //$remetente = 'Photoarts Gallery';
    //$remetenteEmail = 'atendimento@photoarts.com.br';

    //$assunto = "Orçamento N° " . number_format_complete($_POST['idOrcamento'], '0', 5) . " | " . FormatData(getServerData(true));

    $mensagem = '
                <html>
                    <head>
                        <title>Orçamento Simplificado</title>
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
                                    <span style="font-size:25px;">Olá, ' . $_POST['cliente'] . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:20px">Segue em anexo o orçamento solicitado.</span>
                                    <br>
                                    <span style="font-size:20px">Lembrando que este orçamento é válido até ' . $_POST['dataValidade'] . '.</span>
                                    <p style="font-size:14px">Se possuir alguma dúvida com relação ao orçamento entre em contato conosco.</p>
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

    $orcamento = '../../orcamentos/orcamento-simplificado-' . $_POST['idOrcamento'] . '.pdf';

    if (EnvioDeEmailsPhotoarts($_POST['cliente'], $_POST['email'], $remetenteEmail, $remetente, '', '', $remetenteEmail, $remetente, $assunto, $mensagem, $orcamento, '1')) {
        echo '1';
    } else {
        echo '0';
    }
}

function ExcluirOrcamento() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "UPDATE orcamentos_simplificados SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = 0  
            WHERE idOrcamentoSimplificado = " . $_POST['idOrcamento'];

   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

   mysqli_close($ArqT);
}

function CalcularValorTamanhoInstaArts() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT precoBase
            FROM acabamentos WHERE idAcabamento = " . $_POST['idAcabamento'];
    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $valorBase = $linha['precoBase'];

    $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho = " . $_POST['idTamanho'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $altura = ($linha['altura'] == 0 ? $_POST['altura'] : $linha['altura']);
    $largura = ($linha['largura'] == 0 ? $_POST['largura'] : $linha['largura']);

    $valorObra = round(((0.000000006 * (pow($altura * $largura, 2))) - (0.00012 * ($altura * $largura)) + 1.6) * (($valorBase * $altura * $largura) / 10000), 2);

    if ($centavos > 50) {
        $valorObra += ($diferenca / 100);
    } else if ($centavos < 50) {
        $valorObra -= ($centavos / 100);
    }

    echo FormatMoeda(round($valorObra, 2));
   mysqli_close($ArqT);
}
