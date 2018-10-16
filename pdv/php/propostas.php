 
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

        case 'GetRegistroPrimeiro':
            $ArqT = AbreBancoPhotoarts();
            echo RegistroPrimeiro($ArqT, 'orcamentos', 'idOrcamento', false);
            break;

        case 'GetRegistroAnterior':
            $ArqT = AbreBancoPhotoarts();
            echo RegistroAnterior($ArqT, 'orcamentos', $_POST['atual'], 'idOrcamento', false);
            break;

        case 'GetRegistroProximo':
            $ArqT = AbreBancoPhotoarts();
            echo RegistroProximo($ArqT, 'orcamentos', $_POST['atual'], 'idOrcamento', false);
            break;

        case 'GetRegistroUltimo':
            $ArqT = AbreBancoPhotoarts();
            echo RegistroUltimo($ArqT, 'orcamentos', 'idOrcamento', false);
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'getFollow':
            getFollow();
            break;

        case 'getTiposFollow':
            getTiposFollow();
            break;

        case 'pesquisarFollow':
            pesquisarFollow();
            break;

        case 'GravarFollow':
            GravarFollow();
            break;

        case 'ExcluirFollowUP':
            ExcluirFollowUP();
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

        case 'CancelarOrcamento':
            CancelarOrcamento();
            break;

        case 'GerarPdfOrcamento':
            GerarPdfOrcamento();
            break;

        case 'EnviarPdfOrcamentoEmail':
            EnviarPdfOrcamentoEmail();
            break;
    }
}

function MostrarOrcamentos() {

    $ArqT = AbreBancoPhotoartsPdv();

    //getObrasOrcamentos(o.idOrcamento, 0) AS obras, 
    $sql = "SELECT o.idOrcamento, LPAD(o.idOrcamento, 5, '0') AS numeroOrcamento, 
            LEFT(o.dataCadastro, 16) AS dataCadastro, LEFT(o.dataOrcamento, 16) AS dataOrcamento, c.cliente,                        
            o.valorTotal, os.descricaoStatus, l.loja, v.vendedor AS marchand, o.del, 
            DATEDIFF(DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY), CURDATE()) AS validade, IFNULL(ve.idVenda, '') AS idVenda           
            FROM orcamentos AS o             
            INNER JOIN lojas AS l ON l.idLoja = o.idLoja             
            INNER JOIN clientes AS c ON c.idCliente = o.idCliente             
            LEFT JOIN orcamentos_status AS os ON os.idOrcamentoStatus = o.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = o.idVendedor 
            LEFT JOIN vendas AS ve ON o.idOrcamento = ve.idOrcamento            
            WHERE TRUE ";
    
    if ($_POST['de'] != '') {
        $sql .= " AND o.dataOrcamento >= '" . DataSSql($_POST['de']) . "' ";            
    }
    
    if ($_POST['ate'] != '') {
        $sql .= " AND o.dataOrcamento <= '" . DataSSql($_POST['ate']) . "' ";            
    }

    if ($_POST['busca'] != '') {

        $sql .= " AND (l.loja LIKE '%" . $_POST['busca'] . "%' 
                OR c.cliente LIKE '%" . $_POST['busca'] . "%' 
                OR o.idOrcamento LIKE '%" . $_POST['busca'] . "%' 
                OR (SELECT IFNULL(GROUP_CONCAT(CONCAT(IFNULL(ao.nomeObra, 'InstaArts'), ' (', oc.altura, 'x', oc.largura, ') - ', a.nomeAcabamento) SEPARATOR '<br>'), '')            
                    FROM orcamentos_comp AS oc            
                    LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra            
                    INNER JOIN acabamentos AS a ON a.idAcabamento = oc.idAcabamento            
                    WHERE oc.idOrcamento = o.idOrcamento) LIKE '%" . $_POST['busca'] . "%')";
    }

    if ($_POST['statusBusca'] > '0') {

        $sql .= " AND os.idOSStatus = " . $_POST['statusBusca'];
    }

    if ($_POST['vendedor'] != '0') {

        $sql .= " AND o.idVendedor = " . $_POST['vendedor'];
    }

    $sql .= " GROUP BY o.idOrcamento ORDER BY dataCadastro DESC ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $status = '';

            if ($linha['idVenda'] != '') {
                $status = 'GERADO VENDA ' . number_format_complete($linha['idVenda'], '0', 4);
                $idStatus = 3;
            } else {
                if ($linha['del'] == '1') {
                    $status = 'CANCELADO';
                    $idStatus = 4;
                } else {
                    if ($linha['validade'] < 0) {
                        $status = 'NÃO CONCRETIZADO (VENCIDO)';
                        $idStatus = 2;
                    } else {
                        $status = 'EM ABERTO';
                        $idStatus = 1;
                    }
                }
            }

            $json[] = array(
                'idOrcamento' => $linha['idOrcamento'],
                'numeroOrcamento' => $linha['numeroOrcamento'],
                'dataCadastro' => FormatData($linha['dataOrcamento'], true),
                'cliente' => $linha['cliente'],
                'obras' => getObrasComposicao($ArqT, $linha['idOrcamento'], 0),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                //'descricaoStatus' => $linha['descricaoStatus'] . ' ' . ($linha['descricaoStatus'] == 'GERADO PEDIDO' ? number_format_complete($linha['idVenda'], '0', 4) : ''),
                'descricaoStatus' => $status,
                'loja' => $linha['loja'],
                'marchand' => $linha['marchand']
            );
        }

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function Gravar() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    //GRAVA O ORÇAMENTO
    $sql = " orcamentos SET dataOrcamento ='" . DataSSql($_POST['dataCadastro']) . "', " .
            "idLoja =" . $_POST['idLoja'] . ", " .
            "idCliente =" . $_POST['idCliente'] . ", " . 
            "idClienteEndereco = " . $_POST['idClienteEndereco'] . ", " . 
            "contatoCliente ='" . $_POST['contatoCliente'] . "', " .
            "telefoneCliente ='" . $_POST['telefoneCliente'] . "', " .
            "emailCliente ='" . $_POST['emailCliente'] . "', " .
            "idFormaPagamento =" . $_POST['idFormaPagamento'] . ", " .
            "qtdParcelas =" . $_POST['qtdeParcelas'] . ", " .
            "idTipoEntrega =" . $_POST['idTipoTransporte'] . ", " .
            "valor =" . ValorE($_POST['valor']) . ", " .
            "valorFrete =" . ValorE($_POST['valorFrete']) . ", " .
            "valorAcrescimo =" . ValorE($_POST['valorAcrescimo']) . ", " .
            "percentualDesconto =" . ValorE($_POST['percentualDesconto']) . ", " .
            "valorDesconto =" . ValorE($_POST['valorTotalDesconto']) . ", " .
            "valorTotal =" . ValorE($_POST['valorTotalOrcamento']) . ", " .
            "obs ='" . TextoSSql($ArqT, $_POST['obs']) . "', " .
            "idVendedor =" . $_POST['idVendedor'] . " ";

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao=Now(), " .
                "idUsuarioAtualizacao = 0 " .
                "WHERE idOrcamento =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), " .
                "idUsuarioCadastro = 0 ";
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

    //VERIFICA SE É EDIÇÃO
    if ($_POST['codigo'] > 0) {
        $codigo = $_POST['codigo'];
    } else {
        $codigo = UltimoRegistroInserido($ArqT);

        //GERA A VERSÃO 1 DO NOVO ORÇAMENTO
        $sql = "INSERT INTO orcamentos_status SET idOrcamento =" . $codigo . ", " .
                "idOSStatus=1, descricaoStatus='ORÇAMENTO EM ABERTO', dataCadastro=Now(), idUsuarioCadastro = 0";

       mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0) {
            $json = array(
                'status' => 'ERROR_SET_ORC_STATUS'
            );
            echo json_encode($json);
           mysqli_close($ArqT);
            return;
        }

        //$codStatus = UltimoRegistroInserido($ArqT);        
        //ATUALIZA O ORÇAMENTO COM O CÓDIGO DO ÚLTIMO STATUS
        $sql = "UPDATE orcamentos SET idUltimoStatus = 1, "
                . "dataAtualizacao=Now(), "
                . "idUsuarioAtualizacao= 0 "
                . "WHERE idOrcamento =" . $codigo;

       mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0) {
            $json = array(
                'status' => 'ERROR_UPDATE_ORC_STATUS'
            );
            echo json_encode($json);
           mysqli_close($ArqT);
            return;
        }
    }

    //GRAVA AS OBRAS
    if ($_POST['idsOrcamentosObras'] != '' && count($_POST['idsOrcamentosObras']) > 0) {

        $arrayObras = array($_POST['idsOrcamentosObras'], $_POST['idsTiposObras'],
            $_POST['idsObras'], $_POST['idsArtistas'], $_POST['idsTamanhos'],
            $_POST['idsAcabamentos'], $_POST['totaisObras'], $_POST['alturas'],
            $_POST['larguras'], $_POST['qtds'], $_POST['percentuaisDescontos'],
            $_POST['valoresDescontos'], $_POST['valoresAcrescimos'], $_POST['valoresUnitarios'],
            $_POST['observacoes'], $_POST['tiragens'], $_POST['qtdsVendidos'], $_POST['estrelas'],
            $_POST['imagens'], $_POST['pesos'], $_POST['idsGruposMolduras'], $_POST['idsMolduras']);

        GravarObras($ArqT, $codigo, $arrayObras);
    }

    //GRAVOU TUDO, RETORNO OK!
    $json = array(
        'status' => 'OK',
        'idOrcamento' => $codigo
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function GravarObras($ArqT, $idOrcamento, $arrays) {
    session_start();

    //DELETA TODOS AS OBRAS SALVAS
    $sql = "UPDATE orcamentos_comp SET del=1, dataDel=Now(), idUsuarioDel = 0 " .
            " WHERE idOrcamento =" . $idOrcamento;

   mysqli_query($ArqT, $sql);
    //=====

    /* $arrayObras = array($_POST['idsOrcamentosObras'], $_POST['idsTiposObras'], 
      $_POST['idsObras'], $_POST['idsArtistas'], $_POST['idsTamanhos'],
      $_POST['idsAcabamentos'], $_POST['totaisObras'], $_POST['alturas'],
      $_POST['larguras'], $_POST['qtds'], $_POST['percentuaisDescontos'],
      $_POST['valoresDescontos'], $_POST['valoresAcrescimos'], $_POSt['valoresUnitarios'],
      $_POST['observacoes'], $_POST['tiragens'], $_POST['qtdsVendidos'], $_POST['estrelas'],
      $_POST['imagens'], $_POST['pesos']); */

    $idOrcamentoObra = explode(',', $arrays[0]);
    $idTipoObra = explode(',', $arrays[1]);
    $idObra = explode(',', $arrays[2]);
    $idArtista = explode(',', $arrays[3]);
    $idTamanho = explode(',', $arrays[4]);
    $idAcabamento = explode(',', $arrays[5]);

    $altura = explode(',', $arrays[7]);
    $largura = explode(',', $arrays[8]);

    $valorTotal = explode(',', $arrays[6]);
    $qtd = explode(',', $arrays[9]);
    $percentualDesconto = explode(',', $arrays[10]);
    $valorDesconto = explode(',', $arrays[11]);
    $valorAcrescimo = explode(',', $arrays[12]);
    $valorUnitario = explode(',', $arrays[13]);

    $observacao = explode(',', $arrays[14]);

    $tiragem = explode(',', $arrays[15]);
    $qtdVendido = explode(',', $arrays[16]);
    $estrelas = explode(',', $arrays[17]);
    $imagem = explode(',', $arrays[18]);
    $peso = explode(',', $arrays[19]);
    
    $idGrupoMoldura = explode(',', $arrays[20]);
    $idMoldura = explode(',', $arrays[21]);

    for ($i = 0; $i < count($idOrcamentoObra); $i++) {
        $sql = " orcamentos_comp SET idOrcamento =" . $idOrcamento . ", " .
                "idTipoProduto =" . $idTipoObra[$i] . ", " .
                "idProduto ='" . ($idTipoObra[$i] == '3' ? $idAcabamento[$i] : '0') . "', " .
                "idObra ='" . $idObra[$i] . "', " .
                "idArtista ='" . $idArtista[$i] . "', " .
                "idAcabamento ='" . ($idTipoObra[$i] == '3' ? '0' : $idAcabamento[$i]) . "', " .
                "idTamanho ='" . $idTamanho[$i] . "', " .
                "altura ='" . $altura[$i] . "', " .
                "largura ='" . $largura[$i] . "', " .
                "valor ='" . $valorUnitario[$i] . "', " .
                "qtd ='" . $qtd[$i] . "', " .
                "percentualDesconto ='" . $percentualDesconto[$i] . "', " .
                "valorDesconto ='" . $valorDesconto[$i] . "', " .
                "valorAcrescimo ='" . $valorAcrescimo[$i] . "', " .
                "valorTotal ='" . $valorTotal[$i] . "', " .
                "obs ='" . TextoSSql($ArqT, $observacao[$i]) . "', " .
                "tiragemMaxima =" . $tiragem[$i] . ", " .
                "qtdVendidoAtual =" . $qtdVendido[$i] . ", " .
                "estrelasAtual =" . $estrelas[$i] . ", " .
                "imagemObra ='" . $imagem[$i] . "', " .
                "pesoObra =" . $peso[$i] . ", " .
                "idMolduraGrupo =" . $idGrupoMoldura[$i] . ", " . 
                "idMoldura =" . $idMoldura[$i] . " ";

        if ($idOrcamentoObra[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del=0, dataAtualizacao=Now(), "
                    . "idUsuarioAtualizacao= 0 "
                    . "WHERE idOrcamentoComp =" . $idOrcamentoObra[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), "
                    . "idUsuarioCadastro = 0";
        }

       mysqli_query($ArqT, $sql);

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

function Mostrar() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT o.*, DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY) AS dataValidade, IFNULL(v.idVenda, '') AS idVenda,
        IFNULL(v.dataVenda, '') AS dataVenda, CURDATE() AS dataAtual, o.obs AS obsO, 
        DATEDIFF(DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY), CURDATE()) AS validade,
        c.*, t.tipoTransporte, IFNULL(ce.cep, '') AS cliente_cep, IFNULL(ce.endereco, '') AS cliente_endereco, 
        IFNULL(ce.numero, '') AS cliente_numero, IFNULL(ce.complemento, '') AS cliente_complemento, 
        IFNULL(ce.bairro, '') AS cliente_bairro, IFNULL(ce.cidade, '') AS cliente_cidade, 
        IFNULL(ce.estado, '') AS cliente_estado, l.loja, l.cidade AS cidadeLoja, ve.vendedor 
        FROM orcamentos AS o
        LEFT JOIN vendas AS v ON o.idOrcamento=v.idOrcamento
        LEFT JOIN clientes AS c ON c.idCliente=o.idCliente
        LEFT JOIN transportes_tipos AS t ON t.idTransporteTipo=o.idTipoEntrega 
        LEFT JOIN clientes_enderecos AS ce ON ce.idClienteEndereco = o.idClienteEndereco 
        INNER JOIN lojas AS l ON l.idLoja = o.idLoja 
        INNER JOIN vendedores AS ve ON ve.idVendedor = o.idVendedor
        WHERE o.idOrcamento =" . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $status = '';

    if ($linha['idVenda'] != '') {
        $status = 'Gerado venda ' . number_format_complete($linha['idVenda'], '0', 4) . ' em ' . substr(FormatData($linha['dataVenda']), 0, 16);
        $idStatus = 3;
    } else {
        if ($linha['del'] == '1') {
            $status = 'Cancelado em ' . substr(FormatData($linha['dataDel']), 0, 16);
            $idStatus = 4;
        } else {
            if ($linha['validade'] < 0) {
                $status = 'Não concretizado (vencido)';
                $idStatus = 2;
            } else {
                $status = 'Em aberto';
                $idStatus = 1;
            }
        }
    }
    
    $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['codigo'] . " AND del = 0 LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);
    $idTipoProduto =mysqli_result($Tb, 0, "idTipoProduto");

    $json = array(
        'idOrcamento' => $linha['idOrcamento'],
        'idLoja' => $linha['idLoja'],
        'proposta' => number_format_complete($linha['idOrcamento'], '0', 5),
        'dataCadastro' => FormatData($linha['dataOrcamento'], false),
        'validade' => 'Válido até <label style="font-size:18px">' . FormatData($linha['dataValidade'], false) . '</label>',
        'idSituacao' => $idStatus,
        'situacao' => $status,
        'idVenda' => $linha['idVenda'],
        'idCliente' => $linha['idCliente'],
        'contato' => $linha['contatoCliente'],
        'telefone' => $linha['telefoneCliente'],
        'email' => $linha['emailCliente'],
        'idVendedor' => $linha['idVendedor'],
        'idTransporteTipo' => $linha['idTipoEntrega'],
        'arrayObras' => MostrarObras($ArqT, $linha['idOrcamento']),
        'obs' => $linha['obsO'],
        'valor' => FormatMoeda($linha['valor']),
        'valorFrete' => FormatMoeda($linha['valorFrete']),
        'valorAcrescimo' => FormatMoeda($linha['valorAcrescimo']),
        'percDesconto' => FormatMoeda($linha['percentualDesconto']),
        'valorDesconto' => FormatMoeda($linha['valorDesconto']),
        'valorTotal' => FormatMoeda($linha['valorTotal']),
        'idFormaPagamento' => $linha['idFormaPagamento'],
        'qtdeParcelas' => $linha['qtdParcelas'],
        //dados do cliente
        'cliente' => $linha['cliente'],
        'apelido' => $linha['apelido'],
        'endereco' => $linha['cliente_endereco'],
        'numero' => $linha['cliente_numero'],
        'complemento' => $linha['cliente_complemento'],
        'bairro' => $linha['cliente_bairro'],
        'cidade' => $linha['cliente_cidade'],
        'estado' => $linha['cliente_estado'],
        'cep' => $linha['cliente_cep'],
        'tipoTransporte' => $linha['tipoTransporte'],
        'dataAtual' => dataExtenso($linha['dataAtual']),
        'dataValidade' => FormatData($linha['dataValidade'], false),
        'idTipoProduto' => $idTipoProduto,
        'idClienteEndereco' => $linha['idClienteEndereco'],
        'cidadeLoja' => $linha['cidadeLoja'],
        'vendedor' => $linha['vendedor'],
        'loja' => $linha['loja']
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function MostrarObras($ArqT, $idOrcamento) {

    $sql = "SELECT oc.*, IFNULL(ao.nomeObra, '- - -') AS nomeObra, IFNULL(a.artista, '- - -') AS artista, 
            IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho,
            tp.produto AS nomeTipo, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, p.nomeProduto, 
            IFNULL(m.moldura, '') AS moldura 
            FROM orcamentos_comp AS oc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=oc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = oc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = oc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = oc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura 
            WHERE oc.idOrcamento = " . $idOrcamento . " AND oc.del = 0";

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $json[] = array(
                'idOrcamentoComp' => $linha['idOrcamentoComp'],
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

function ExcluirFollowUP() {
    session_start();

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "UPDATE orcamentos_contatos SET del = 1, 
            dataDel = NOW(),
            idUsuarioDel = 0 WHERE idOrcamentoContato = " . $_POST['codigo'];


   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

   mysqli_close($ArqT);
}

function GravarFollow() {

    session_start();

   $ArqT = AbreBancoPhotoartsPdv();

    $sql = "orcamentos_contatos SET idOrcamento = " . $_POST['orcamento'] . ",
            idContatoTipo = " . $_POST['tipo'] . ", 
            obs = UCASE('" . TextoSSql($ArqT, $_POST['obs']) . "'), 
            dataAtualizacao = NOW(),
            idUsuarioAtualizacao = 0";

    $data = $_POST['retorno'] . " " . $_POST['horaretorno'] . ":00";

    if ($_POST['checkretorno'] == true) {
        $sql .= ", dataRetorno = '" . DataSSql($data, true) . "'";
    } else {
        $sql .= ", dataRetorno = '0000-00-00 00:00:00' ";
    }

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idOrcamentoContato =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = 0";
    }

   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

   mysqli_close($ArqT);
}

function pesquisarFollow() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idContatoTipo AS tipo, obs, DATE(dataRetorno) AS retorno, 
            LEFT(TIME(dataRetorno),5) AS horaretorno FROM orcamentos_contatos WHERE idOrcamentoContato =" . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $json = array(
        'horaretorno' => $linha['horaretorno'],
        'retorno' => FormatData($linha['retorno'], false),
        'tipo' => $linha['tipo'],
        'obs' => $linha['obs']
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getTiposFollow() {

    $ArqT = AbreBancoPhotoartsPdv();
    $sql = "SELECT idContatoTipo AS codigo, tipoContato AS nome FROM contatostipos WHERE ativo = 1 ORDER BY nome";
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome']
        );
    }

    echo json_encode($json);
}

function getFollow() {

    $ArqT = AbreBancoPhotoartsPdv();
    //$dados = explode('-', getDadosOrcamento($ArqT, $_POST['codigo']));

    /* MOSTRA O FOLLOW-UP DE UMA ÚNICA VERSÃO
     * $sql = "SELECT  c.idOrcamentoContato AS codigo, c.dataCadastro AS data, t.tipoContato AS tipo, 
      f.funcionario, c.obs, c.dataRetorno
      FROM orcamentos_contatos AS c
      LEFT JOIN contatostipos AS t ON t.idContatoTipo = c.idContatoTipo
      LEFT JOIN funcionarios AS f ON f.idFuncionario = c.idUsuarioCadastro
      WHERE c.del = 0 AND idOrcamento =  " . $_POST['codigo'];

      $sql .= " ORDER BY c.dataCadastro DESC  "; */

    /* MOSTRA O FOLLOW-UP DE TODAS AS VERSÕES */

    $sql = "SELECT  c.idOrcamentoContato AS codigo, c.dataCadastro AS data, t.tipoContato AS tipo, 
      IFNULL(f.funcionario, '') AS funcionario, c.obs, c.dataRetorno
      FROM orcamentos_contatos AS c
      LEFT JOIN contatostipos AS t ON t.idContatoTipo = c.idContatoTipo
      LEFT JOIN funcionarios AS f ON f.idFuncionario = c.idUsuarioCadastro
      WHERE c.del = 0 AND idOrcamento =  " . $_POST['codigo'];

    $sql .= " ORDER BY c.dataCadastro DESC  ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'data' => FormatData($linha['data'], true),
            'tipo' => $linha['tipo'],
            'usuario' => $linha['funcionario'],
            'obs' => $linha['obs'],
            'retorno' => FormatData($linha['dataRetorno'])
        );
    }

    echo json_encode($json);
}

function ExcluirImagem() {

    if (file_exists("../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $_POST['imagem'])) {
        unlink("../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $_POST['imagem']);
        unlink("../imagens/" . $_POST['tipoProdutoImagem'] . "/mini_" . $_POST['imagem']);
    }
}

function GerarMiniaturaImagem() {

    if (file_exists("../../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $_POST['imagem'])) {

        $extensao = explode('.', $_POST['imagem']);

        //Verifica a extensão do arquivo
        if ($extensao[1] !== 'jpg' && $extensao[1] !== 'jpeg') {

            $image = imagecreatefrompng("../../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $_POST['imagem']);
            $quality = 80;

            $filePath = "../../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $extensao[0];

            //Cria imagem .jpg
            $bg = imagecreatetruecolor(imagesx($image), imagesy($image));
            $quality = 80;
            $filePath = "../../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $extensao[0];
            imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
            imagealphablending($bg, TRUE);
            imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
            imagedestroy($image);
            imagejpeg($bg, $filePath . ".jpg", $quality);
            imagedestroy($bg);

            //Exclui arquivo .png
            unlink("../../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $_POST['imagem']);

            $_POST['imagem'] = $extensao[0] . '.jpg';
        }

        Redimensionar("../../imagens/" . $_POST['tipoProdutoImagem'] . "/" . $_POST['imagem'], 175, 125, "mini_", 80);

        $json = array(
            'imagem' => "imagens/" . $_POST['tipoProdutoImagem'] . "/mini_" . $_POST['imagem']
        );

        echo json_encode($json);
    } else {
        echo "0";
    }
}

function CancelarOrcamento() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "UPDATE orcamentos SET del = 1, 
            dataDel = NOW(),
            idUsuarioDel = 0 
            WHERE idOrcamento= " . $_POST['idOrcamento'];

   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        AtualizarStatusOrcamento($ArqT, 4, $_POST['idOrcamento']);
        echo '1';
    } else {
        echo '0';
    }

   mysqli_close($ArqT);
}

function GerarPdfOrcamento() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT c.cliente AS cliente, o.telefoneCliente, o.emailCliente, c.responsavel, tt.tipoTransporte, 
            o.dataOrcamento, DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY) AS dataValidade, o.valor, o.valorFrete, 
            o.valorTotal, o.valorDesconto, o.percentualDesconto, o.obs, IFNULL(ce.endereco, '') AS endereco, 
            IFNULL(ce.numero, '') AS numero, IFNULL(ce.complemento, '') AS complemento, 
            IFNULL(ce.bairro, '') AS bairro, IFNULL(ce.cidade, '') AS cidade, IFNULL(ce.estado, '') AS estado, 
            IFNULL(ce.cep, '') AS cep, CURDATE() AS dataAtual, l.loja, l.cidade AS cidadeLoja, ve.vendedor 
            FROM orcamentos AS o
            INNER JOIN clientes AS c USING(idCliente)
            INNER JOIN transportes_tipos AS tt ON tt.idTransporteTipo = o.idTipoEntrega
            INNER JOIN lojas AS l ON l.idLoja = o.idLoja 
            LEFT JOIN clientes_enderecos AS ce ON ce.idClienteEndereco = o.idClienteEndereco
            INNER JOIN vendedores AS ve ON ve.idVendedor = o.idVendedor 
            WHERE o.idOrcamento = " . $_POST['idOrcamento'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $cliente = $linha['cliente'];
    $clienteTelefone = $linha['telefoneCliente'];
    $clienteEmail = $linha['emailCliente'];
    //$responsavel = $linha['responsavel'];
    $tipoTransporte = $linha['tipoTransporte'];
    $obs = $linha['obs'];
    $dataOrcamento = FormatData($linha['dataOrcamento'], false);
    $dataValidade = FormatData($linha['dataValidade']);
    $valor = FormatMoeda($linha['valor']);
    $valorFrete = FormatMoeda($linha['valorFrete']);
    $valorDesconto = FormatMoeda($linha['valorDesconto']) . ' (' . FormatMoeda($linha['percentualDesconto']) . '%)';
    $valorTotal = FormatMoeda($linha['valorTotal']);
    $endereco = $linha['endereco'];
    $numero = ($linha['numero'] == '0' ? '' : $linha['numero']);
    $complemento = $linha['complemento'];
    $bairro = $linha['bairro'];
    $cidade = $linha['cidade'];
    $estado = $linha['estado'];
    $cep = $linha['cep'];
    $dataAtual = dataExtenso($linha['dataAtual']);
    $loja = $linha['loja'];
    $cidadeLoja = ($linha['cidadeLoja'] == '' ? 'Cotia' : $linha['cidadeLoja']);
    $vendedor = $linha['vendedor'];

    //Busca o tipo de produto
    $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idOrcamento'] . " AND del = 0 LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);
    $idTipoProduto =mysqli_result($Tb, 0, "idTipoProduto");

    $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:150px; float:right; margin-top:-53px;' : 'width:270px; float:right; margin-top:10px;');
    $assinatura = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts') . '<br>' . $vendedor;
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? 'www.photoarts.com.br' : 'www.instaarts.com.br');

    $html = '<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title>Photoarts Gallery - Impressão Orçamento</title>
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
                            </div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:right;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $dataOrcamento . '</span></div>
                                <div style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">Valido até <span style="font-size:16px;">' . $dataValidade . '</span></div>
                                <img src="' . $logoPdf . '" style="' . $medidasLogo . '"/>
                            </div>
                            <div id="linha3" style="margin-top:15px;" ></div>
                            <div id="linhatotal" style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;">
                                <h1 style="display:inline-block; margin:0px; padding:0px; font-size:15px; font-weight:bold; vertical-align:middle">Obras</h1>
                            </div>
                            <div id="tabela" style="border:solid 2px ' . $corPdf . '; border-top:none; min-height:200px; height:auto; padding:1px; padding-top:3px; padding-bottom:3px; width:100%;">';

    $sql = "SELECT oc.*, IFNULL(ao.nomeObra, '- - -') AS nomeObra, IFNULL(a.artista, '- - -') AS artista, 
            IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho,
            tp.produto AS nomeTipo, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, p.nomeProduto, 
            IFNULL(m.moldura, '') AS moldura 
            FROM orcamentos_comp AS oc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=oc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = oc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = oc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = oc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura 
            WHERE oc.idOrcamento = " . $_POST['idOrcamento'] . " AND oc.del = 0";

    $Tb = ConsultaSQL($sql, $ArqT);

    if ($idTipoProduto == '1') {

        $html .= '<table class="tabela_cinza_foco"> 
                <thead > 
                    <tr>
                        <th>Tipo</th>
                        <th>Artista</th>
                        <th>Obra</th>
                        <th>Tamanho</th>
                        <th>Acabamento</th>
                        <th>R$ Unit.</th>
                        <th>Qtd</th>
                        <th>R$ Total</th>
                        <th>Peso</th>
                    </tr>
                </thead>
                <tbody>';

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $html .= '<tr>
                        <td>' . $linha['nomeTipo'] . '</td>
                        <td>' . $linha['artista'] . '</td>
                        <td>' . $linha['nomeObra'] . '</td>
                        <td>' . $linha['nomeTamanho'] . ($linha['idTipoProduto'] == 3 ? '' : ' (' . round($linha['altura']) . 'X' . round($linha['largura']) . ') ') . '</td>
                        <td>' . ($linha['idTipoProduto'] == 3 ? $linha['nomeProduto'] : $linha['nomeAcabamento']) . ($linha['moldura'] == '' ? '' : ' (Mold.: ' . $linha['moldura'] . ')') . '</td>
                        <td align="right">' . FormatMoeda($linha['valor']) . '</td>
                        <td align="center">' . $linha['qtd'] . '</td>
                        <td align="right">' . FormatMoeda($linha['valorTotal']) . '</td>
                        <td align="right">' . ($linha['idTipoProduto'] == 3 ? '- - -' : FormatMoeda($linha['pesoObra']) . ' KG') . '</td>
                    </tr>';
        }
    } else {

        $html .= '<table class="tabela_cinza_foco"> 
                <thead > 
                    <tr>
                        <th>Tipo</th>
                        <th>Tamanho</th>
                        <th>Acabamento</th>
                        <th>R$ Unit.</th>
                        <th>Qtd</th>
                        <th>R$ Total</th>
                        <th>Peso</th>
                    </tr>
                </thead>
                <tbody>';

        while ($linha =mysqli_fetch_assoc($Tb)) {

            $html .= '<tr>
                        <td>' . $linha['nomeTipo'] . '</td>
                        <td>' . $linha['nomeTamanhoInsta'] . ($linha['idTipoProduto'] == 3 ? '' : ' (' . round($linha['altura']) . 'X' . round($linha['largura']) . ') ') . '</td>
                        <td>' . ($linha['idTipoProduto'] == 3 ? $linha['nomeProduto'] : $linha['nomeAcabamento']) . '</td>
                        <td align="right">' . FormatMoeda($linha['valor']) . '</td>
                        <td align="center">' . $linha['qtd'] . '</td>
                        <td align="right">' . FormatMoeda($linha['valorTotal']) . '</td>
                        <td align="right">' . ($linha['idTipoProduto'] == 3 ? '- - -' : FormatMoeda($linha['pesoObra']) . ' KG') . '</td>
                    </tr>';
        }
    }

    $html .= '</tbody>
            </table></div>';

    $html .= '<div style="min-height:10px;"> </div>
                <div align="right">
                    <div style="border: solid 4px #FFF; text-align:center; width:20%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; border:solid 2px ' . $corPdf . '; float:right; margin-top:5px; margin-bottom:5px;">Total R$ <span>' . $valorTotal . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:30%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Desconto R$ <span>' . $valorDesconto . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:20%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Frete R$ <span>' . $valorFrete . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:25%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Valor R$ <span>' . $valor . '</span></div>
                </div>';

    if ($obs != '') {

        $html .= '<div style="border:solid 2px ' . $corPdf . '; height:auto; padding:5px; padding-top:3px; padding-bottom:3px;" >
                    Observações:<br>
                    ' . $obs . '
                </div>
                <br>';
    }

    $html .= '<div style="border:solid 2px ' . $corPdf . '; height:auto; padding:5px; padding-top:3px; padding-bottom:3px; font-size:9px;" >
                    Termos:<br /><br />
                    A ' . $nomeProduto . ' se compromete a entregar a obra de arte encomendada dentro de um prazo máximo de 10 dias corridos a partir da data da compra. O comprador será informado sobre as etapas do processo de produção da obra até o momento da entrega.
                    <br /><br />
                    As despesas de entrega (incluindo seguro e transporte) serão pagas pelo comprador, via correios, transportadora ou taxi, com valor a ser informado na hora da remessa. Não nos comprometemos com qualquer atraso referente ao prazo da transportadora
                </div>
                <div style="min-height:10px;"> </div>
                <div style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;">
                    <h1 style="display:inline-block; margin:0px; padding:0px; font-size:15px; font-weight:bold; vertical-align:middle">Endereço de Entrega</h1>
                </div>
                <div style="border:solid 2px ' . $corPdf . '; border-top:none; height:80px; padding:5px; padding-top:3px; padding-bottom:3px; float:left;"> 
                    <div style="background:#FFF; width:49.5%; display:inline-block; vertical-align:top; height:auto">
                        <div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">Endereço: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444;">' . $endereco . '</span></div>
                        <!--<br />-->
                        <div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">Bairro: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444;">' . $bairro . '</span></div>
                        <!--<br />-->
                        <div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">CEP: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444;">' . $cep . '</span></div>
                    </div>
                    <div style="clear:both; background:#FFF; width:49.5%; display:inline-block; vertical-align:top; height:auto; float:right; margin-top:-65px;">
                        <div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">Nº: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444; width:30px">' . $numero . ($complemento != '' ? ' - ' . $complemento : '') . '</span></div>
                        <!--<div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">Complemento: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444; width:auto">' . $complemento . '</span></div>-->
                        <!--<br />-->
                        <div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">Cidade: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444; width:150px">' . $cidade . ' / ' . $estado . '</span></div>
                        <!--<div style="width:auto; font-size:12px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left;">Estado: <span style="width:290px; font-size:12px; line-height:22px; display:inline-block; color:#444444; width:auto">' . $estado . '</span></div>-->
                    </div>
                </div>
                <!--<div style="min-height:10px;"></div>-->
                <br>
                <span style="font-size:13px; font-weight:bold; line-height:22px;">' . $cidadeLoja . ', ' . $dataAtual . '</span>
                <!--<div style="min-height:50px;"></div>-->
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; display:inline-block; text-align:center; margin-top:45px;">' . $assinatura . '</div>   
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; float:right; display:inline-block; text-align:center; margin-top:-46px;">' . $cliente . '</div>   
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

    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');
    $pdf->WriteHTML($html);
    $pdf->Output('../../orcamentos/orcamento-' . $_POST['idOrcamento'] . '.pdf', 'F');
    $filepath = '../orcamentos/orcamento-' . $_POST['idOrcamento'] . '.pdf';

    echo $filepath;
   mysqli_close($ArqT);
}

function EnviarPdfOrcamentoEmail() {

    if (!file_exists('../../orcamentos/orcamento-' . $_POST['idOrcamento'] . '.pdf')) {
        GerarPdfOrcamento();
    }

    $ArqT = AbreBancoPhotoartsPdv();

    //Busca o tipo de produto
    $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idOrcamento'] . " AND del = 0 LIMIT 1";
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

    $mensagem = '
                <html>
                    <head>
                        <title>Orçamento | ' . $nomeProduto . '</title>
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

    $orcamento = '../../orcamentos/orcamento-' . $_POST['idOrcamento'] . '.pdf';

    if (EnvioDeEmailsPhotoarts($_POST['cliente'], $_POST['email'], $remetenteEmail, $remetente, '', '', $remetenteEmail, $remetente, $assunto, $mensagem, $orcamento, $idTipoProduto)) {
        echo '1';
    } else {
        echo '0';
    }
}