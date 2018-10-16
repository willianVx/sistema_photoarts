<?php

/*
  SITUAÇÕES DE UM ORÇAMENTO
 * 1 - EM ABERTO
 * 2 - VENCIDO
 * 3 - GERADO PEDIDO
 * 4 - CANCELADO
 *  */

include('photoarts.php');
require_once '../padrao/pdf/mpdf.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarOrcamentos':
            MostrarOrcamentos();
            break;

        case 'Gravar':
            Gravar();
            break;

        case 'GetRegistroPrimeiro':
            $ArqT =  ConectaDB();
            echo RegistroPrimeiro($ArqT, 'orcamentos', 'idOrcamento', false);
            break;

        case 'GetRegistroAnterior':
            $ArqT =  ConectaDB();
            echo RegistroAnterior($ArqT, 'orcamentos', $_POST['atual'], 'idOrcamento', false);
            break;

        case 'GetRegistroProximo':
            $ArqT =  ConectaDB();
            echo RegistroProximo($ArqT, 'orcamentos', $_POST['atual'], 'idOrcamento', false);
            break;

        case 'GetRegistroUltimo':
            $ArqT =  ConectaDB();
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

        case 'CancelarOrcamento':
            CancelarOrcamento();
            break;

        case 'GerarPdfOrcamento2':
            GerarPdfOrcamento2();
            break;
        case 'GerarPdfOrcamentoImg':
            GerarPdfOrcamentoImg();
            break;

        case 'EnviarPdfOrcamentoEmail':
            EnviarPdfOrcamentoEmail();
            break;

        case 'ExcluirOrcamento':
            ExcluirOrcamento();
            break;

        case 'BuscaArtistas';
              BuscaArtistas();
              break;

        case 'BuscaObras';
              BuscaObras();
              break;

        case 'AtualizaEstrela';
              AtualizaEstrela();
              break;

        case 'CalcularFrete':
            CalcularFrete();
            break;
    }
}

function MostrarOrcamentos() {

    $db = ConectaDB();

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
            WHERE o.del = 0";
    
    if ($_POST['de'] != '') {
        $sql .= " AND o.dataOrcamento >= '" . DataSSql($_POST['de']) . "' ";
    }
    
    if ($_POST['ate'] != '') {
        $sql .= " AND o.dataOrcamento <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['busca'] != '') {

        $sql .= " AND (c.cliente LIKE '%" . $_POST['busca'] . "%' 
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

    if ($_POST['loja'] > '0') {

        $sql .= " AND l.idLoja = " . $_POST['loja'];
    }

    if ($_POST['vendedor'] > '0') {

        $sql .= " AND v.idVendedor = " . $_POST['vendedor'];
    }

    $sql .= " GROUP BY o.idOrcamento ORDER BY dataCadastro DESC ";

    //if ($_POST['limitar'] == '1')
        //$sql .= " LIMIT 20 ";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

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
                'obras' => getObrasComposicao($db, $linha['idOrcamento'], 0),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                //'descricaoStatus' => $linha['descricaoStatus'] . ' ' . ($linha['descricaoStatus'] == 'GERADO PEDIDO' ? number_format_complete($linha['idVenda'], '0', 4) : ''),
                'descricaoStatus' => $status,
                'loja' => $linha['loja'],
                'marchand' => $linha['marchand']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function Gravar() {

    inicia_sessao();
    $db = ConectaDB();

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
            "obs ='" . $db->escapesql($_POST['obs']) . "', " .
            "idVendedor =" . $_POST['idVendedor'] . ", 
            dataContrato='" . ($_POST['dataContrato'] == '' ? '0000-00-00' : DataSSql($_POST['dataContrato'])) . "', " . 
            "periodoDiasContrato=" . ValorE($_POST['periodoDias']) . ", " . 
            "numeroContrato=" . ValorE($_POST['numeroContrato']) . ", " . 
            "obsContrato='" . $db->escapesql($_POST['obsContrato']) . "', " . 
            "devolvido=" . $_POST['devolvido'] . ", " . 
            "comissaoContrato='" . ValorE($_POST['comissaoContrato']) . "'";

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao=Now(), " .
                "idUsuarioAtualizacao =" . $_SESSION['photoarts_codigo'] . " " .
                "WHERE idOrcamento =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), " .
                "idUsuarioCadastro =" . $_SESSION['photoarts_codigo'] . " ";
    }

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        $json = array(
            'status' => 'ERROR_SET_ORC '// . $sql
        );
        echo json_encode($json);
        $db->close();
        return;
    }

    //VERIFICA SE É EDIÇÃO
    if ($_POST['codigo'] > 0) {
        $codigo = $_POST['codigo'];
    } else {
        $codigo = UltimoRegistroInserido($db);

        //GERA A VERSÃO 1 DO NOVO ORÇAMENTO
        $sql = "INSERT INTO orcamentos_status SET idOrcamento =" . $codigo . ", " .
                "idOSStatus=1, descricaoStatus='ORÇAMENTO EM ABERTO', dataCadastro=Now(), idUsuarioCadastro =" . $_SESSION['photoarts_codigo'];

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            $json = array(
                'status' => 'ERROR_SET_ORC_STATUS'
            );
            echo json_encode($json);
            $db->close();
            return;
        }

        //$codStatus = UltimoRegistroInserido($ArqT);        
        //ATUALIZA O ORÇAMENTO COM O CÓDIGO DO ÚLTIMO STATUS
        $sql = "UPDATE orcamentos SET idUltimoStatus = 1, "
                . "dataAtualizacao=Now(), "
                . "idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'] . " "
                . "WHERE idOrcamento =" . $codigo;

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            $json = array(
                'status' => 'ERROR_UPDATE_ORC_STATUS'
            );
            echo json_encode($json);
            $db->close();
            return;
        }
    }

    //GRAVA AS OBRAS
    if ($_POST['idOrcamentoComp'] != '' && count((array)$_POST['idOrcamentoComp']) > 0) {

        /*$arrayObras = array($_POST['idsOrcamentosObras'], $_POST['idsTiposObras'],
            $_POST['idsObras'], $_POST['idsArtistas'], $_POST['idsTamanhos'],
            $_POST['idsAcabamentos'], $_POST['totaisObras'], $_POST['alturas'],
            $_POST['larguras'], $_POST['qtds'], $_POST['percentuaisDescontos'],
            $_POST['valoresDescontos'], $_POST['valoresAcrescimos'], $_POST['valoresUnitarios'],
            $_POST['observacoes'], $_POST['tiragens'], $_POST['qtdsVendidos'], $_POST['estrelas'],
            $_POST['imagens'], $_POST['pesos'], $_POST['idsGruposMolduras'], $_POST['idsMolduras']);*/

        $arrayObras = array($_POST['idOrcamentoComp'], $_POST['idsTiposObras'], $_POST['idsObras'], $_POST['idsArtistas'], $_POST['idsTamanhos'], $_POST['idsAcabamentos'], $_POST['alturas'], $_POST['larguras'], $_POST['valoresUnitarios'], $_POST['selecionados'], $_POST['imagens'], $_POST['idsGruposMolduras'], $_POST['idsMolduras'], $_POST['estrelas'], $_POST['qtdsVendidos'], $_POST['pesos'], $_POST['qtds']);

        GravarObras($db, $codigo, $arrayObras);
    }

    //GRAVOU TUDO, RETORNO OK!
    $json = array(
        'status' => 'OK',
        'idOrcamento' => $codigo
    );

    echo json_encode($json);
    $db->close();
}

function GravarObras($ArqT, $idOrcamento, $arrays) {
    inicia_sessao();
    
    $sql = "UPDATE orcamentos_comp SET del=1, dataDel=Now(), idUsuarioDel =" . $_SESSION['photoarts_codigo'] . " " .
            "WHERE idOrcamento =" . $idOrcamento;

    $ArqT->query( $sql );

    /* $arrayObras = array($_POST['idsOrcamentosObras'], $_POST['idsTiposObras'], 
      $_POST['idsObras'], $_POST['idsArtistas'], $_POST['idsTamanhos'],
      $_POST['idsAcabamentos'], $_POST['totaisObras'], $_POST['alturas'],
      $_POST['larguras'], $_POST['qtds'], $_POST['percentuaisDescontos'],
      $_POST['valoresDescontos'], $_POST['valoresAcrescimos'], $_POSt['valoresUnitarios'],
      $_POST['observacoes'], $_POST['tiragens'], $_POST['qtdsVendidos'], $_POST['estrelas'],
      $_POST['imagens'], $_POST['pesos']); */

    $idOrcamentoComp = explode('#', $arrays[0]);
    $idTipoObra = explode(',', $arrays[1]);
    $idObra = explode('#', $arrays[2]);
    $idArtista = explode(',', $arrays[3]);
    $idTamanho = explode('#', $arrays[4]);
    $idAcabamento = explode(',', $arrays[5]);

    //$altura = explode(',', $arrays[7]);
    $altura = explode('#', $arrays[6]);
    //$largura = explode(',', $arrays[8]);
    $largura = explode('#', $arrays[7]);

    //$valorTotal = explode(',', $arrays[6]);
    //$qtd = explode(',', $arrays[9]);
    //$percentualDesconto = explode(',', $arrays[10]);
    //$valorDesconto = explode(',', $arrays[11]);
    //$valorAcrescimo = explode(',', $arrays[12]);
    //$valorUnitario = explode(',', $arrays[13]);
    $valorUnitario = explode('#', $arrays[8]);

    //$observacao = explode(',', $arrays[14]);
    $selecionado = explode('#', $arrays[9]);

    //$tiragem = explode(',', $arrays[15]);
    //$qtdVendido = explode(',', $arrays[16]);
    //$estrelas = explode(',', $arrays[17]);
    //$imagem = explode(',', $arrays[18]);
    $imagem = explode(',', $arrays[10]);
    //$peso = explode(',', $arrays[19]);

    $idGrupoMoldura = explode(',', $arrays[11]);
    $idMoldura = explode(',', $arrays[12]);
    $estrelas = explode('#', $arrays[13]);
    $qtdVendido = explode('#', $arrays[14]);
    $pesos = explode('#', $arrays[15]);
    $qtds = explode('#', $arrays[16]);

    for ($i = 0; $i < count($idTipoObra); $i++) {

        if(count($idObra) == count($idTamanho)){

            $idOrcamentoCompAux = explode(',', $idOrcamentoComp[$i]);
            $idTamanhoAux = explode(',', $idTamanho[$i]);
            $alturaAux = explode(',', $altura[$i]);
            $larguraAux = explode(',', $largura[$i]);
            $valorAux = explode(',', $valorUnitario[$i]);
            $selecionadoAux = explode(',', $selecionado[$i]);
            $estrelasAux = explode(',', $estrelas[$i]);
            $qtdVendidoAux = explode(',', $qtdVendido[$i]);
            $pesosAux = explode(',', $pesos[$i]);
            $qtdsAux = explode(',', $qtds[$i]);

            for ($j = 0; $j < count($idTamanhoAux); $j++) {

                $sql = " orcamentos_comp SET
                        idOrcamento = " . $idOrcamento . ", 
                        idTipoProduto = " . $idTipoObra[$i] . ", 
                        idProduto = " . ($idTipoObra[$i] == '3' ? $idObra[$i] : 0) . ", 
                        idObra = " . ($idTipoObra[$i] == '3' ? 0 : $idObra[$i]) . ",
                        idArtista = " . ($idArtista[$i]=='null' ? '0' : $idArtista[$i]) . ", 
                        idAcabamento = " . $idAcabamento[$i] . ", 
                        idTamanho = " . $idTamanhoAux[$j] . ", 
                        idMolduraGrupo = " . $idGrupoMoldura[$i] . ", 
                        idMoldura = " . $idMoldura[$i] . ", 
                        altura ='" . $alturaAux[$j] . "', 
                        largura ='" . $larguraAux[$j] . "', 
                        valor ='" . $valorAux[$j] . "', 
                        qtd = " . ($idTipoObra[$i] == '3' ? $qtdsAux[$j] : 1) . ", 
                        valorTotal = '" . $valorAux[$j] . "', 
                        qtdVendidoAtual = " . ($qtdVendidoAux[$j] == '' ? 0 : $qtdVendidoAux[$j]) . ",
                        estrelasAtual = " . ($estrelasAux[$j] == '' ? 0 : $estrelasAux[$j]) . ",
                        imagemObra ='" . $imagem[$i] . "', 
                        pesoObra = '" . $pesosAux[$j] . "', 
                        selecionado = " . $selecionadoAux[$j];

                if ($idOrcamentoCompAux[$j] > 0) {

                    $sql = "UPDATE " . $sql . ", del=0, dataAtualizacao=Now(), "
                            . "idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'] . " "
                            . "WHERE idOrcamentoComp =" . $idOrcamentoCompAux[$j];
                }else{
                    $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), "
                            . "idUsuarioCadastro =" . $_SESSION['photoarts_codigo'];
                }

                $ArqT->query( $sql );

                if ($idOrcamentoCompAux[$j] <= 0 && $idObra[$i] == '0') {
                    $idOrcamentoCompAux2 = UltimoRegistroInserido($ArqT);

                    $sql = "INSERT INTO orcamentos_comp_instaarts 
                            SET idOrcamentoComp = " . $idOrcamentoCompAux2;
                    
                    $ArqT->query( $sql );

                    $idOrcamentoCompInstaarts = UltimoRegistroInserido($ArqT);

                    $sql = "UPDATE orcamentos_comp SET 
                            idOrcamentoCompInstaarts = " . $idOrcamentoCompInstaarts . " 
                            WHERE idOrcamentoComp = " . $idOrcamentoCompAux2;
                    
                    $ArqT->query( $sql );
                }

                if ( $ArqT->n_rows <= 0 ) {
                    $json = array(
                        'status' => 'ERROR_SET_ORC_COMP - '// . $sql
                    );
                    echo json_encode($json);
                    $ArqT->close();
                    return;
                }
            }
        }
        /*$sql = " orcamentos_comp SET idOrcamento =" . $idOrcamento . ", " .
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
                "idMoldura =" . $idMoldura[$i] . " ";*/            

        /*if ($idOrcamentoObra[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del=0, dataAtualizacao=Now(), "
                    . "idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'] . " "
                    . "WHERE idOrcamentoComp =" . $idOrcamentoObra[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), "
                    . "idUsuarioCadastro =" . $_SESSION['photoarts_codigo'];
        }

        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0) {
            $json = array(
                'status' => 'ERROR_SET_ORC_COMP - ' . $sql
            );
            echo json_encode($json);
            mysqli_close($ArqT);
            return;
        }*/
    }
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT o.*, DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY) AS dataValidade, IFNULL(v.idVenda, '') AS idVenda,
        IFNULL(v.dataVenda, '') AS dataVenda, CURDATE() AS dataAtual, o.obs AS obsO, c.email,
        DATEDIFF(DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY), CURDATE()) AS validade,
        c.*, t.tipoTransporte, l.loja, l.cidade AS cidadeLoja, IFNULL(ce.cep, '') AS cliente_cep, IFNULL(ce.endereco, '') AS cliente_endereco, 
        IFNULL(ce.numero, '') AS cliente_numero, IFNULL(ce.complemento, '') AS cliente_complemento, 
        IFNULL(ce.bairro, '') AS cliente_bairro, IFNULL(ce.cidade, '') AS cliente_cidade, 
        IFNULL(ce.estado, '') AS cliente_estado, ve.vendedor, c.arquiteto, o.dataContrato, o.periodoDiasContrato, 
        o.numeroContrato, IFNULL(o.obsContrato, '') AS obsContrato, o.devolvido, o.comissaoContrato
        FROM orcamentos AS o
        LEFT JOIN vendas AS v ON o.idOrcamento=v.idOrcamento
        LEFT JOIN clientes AS c ON c.idCliente=o.idCliente
        LEFT JOIN transportes_tipos AS t ON t.idTransporteTipo=o.idTipoEntrega
        INNER JOIN lojas AS l ON l.idLoja = o.idLoja 
        LEFT JOIN clientes_enderecos AS ce ON ce.idClienteEndereco = o.idClienteEndereco
        INNER JOIN vendedores AS ve ON ve.idVendedor = o.idVendedor
        WHERE o.idOrcamento =" . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch();

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
        
        $db->query( $sql );
        
        $result = $db->fetch();

        $idTipoProduto = $result["idTipoProduto"];

        $json = [
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
            'email' => $linha['email'],
            'idVendedor' => $linha['idVendedor'],
            'idTransporteTipo' => $linha['idTipoEntrega'],
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
            'loja' => $linha['loja'],
            'idClienteEndereco' => $linha['idClienteEndereco'],
            'cidadeLoja' => $linha['cidadeLoja'],
            'vendedor' => $linha['vendedor'],
            'arquiteto' => $linha['arquiteto'], 
            'dataContrato' => FormatData($linha['dataContrato'],false), 
            'periodoDiasContrato' => $linha['periodoDiasContrato'],
            'numeroContrato' => $linha['numeroContrato'], 
            'obsContrato' => $linha['obsContrato'], 
            'devolvido' => $linha['devolvido'], 
            'comissaoContrato' => FormatMoeda($linha['comissaoContrato']),
            'arrayObras' => MostrarObras($db, $linha['idOrcamento'])
        ];
        
        echo json_encode($json);

    }
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
            WHERE oc.idOrcamento = " . $idOrcamento . " AND oc.del = 0 ";
    
    if(isset($_POST['viaPedido'])){
        if($_POST['viaPedido'] == 'true'){
            $sql .= " AND oc.selecionado=1 ";
        }
    }
       
    $ArqT->query( $sql );
    
    if ( $ArqT->n_rows <= 0 ) {
        return '0';
    }else{
        while ($linha = $ArqT->fetch()) {  

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
                'moldura' => $linha['moldura'],
                'selecionado' => $linha['selecionado']
            );
        }

        return json_encode($json);
    }
}

function ExcluirFollowUP() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE orcamentos_contatos SET del = 1, 
            dataDel = NOW(),
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . "  WHERE idOrcamentoContato = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function GravarFollow() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "orcamentos_contatos SET idOrcamento = " . $_POST['orcamento'] . ",
            idContatoTipo = " . $_POST['tipo'] . ", 
            obs = UCASE('" . $db->escapesql($_POST['obs']) . "'), 
            dataAtualizacao = NOW(),
            idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'];

    $data = $_POST['retorno'] . " " . $_POST['horaretorno'] . ":00";

    if ($_POST['checkretorno'] == true) {
        $sql .= ", dataRetorno = '" . DataSSql($data, true) . "'";
    } else {
        $sql .= ", dataRetorno = '0000-00-00 00:00:00' ";
    }

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idOrcamentoContato =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    }

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function pesquisarFollow() {

    $db = ConectaDB();

    $sql = "SELECT idContatoTipo AS tipo, obs, DATE(dataRetorno) AS retorno, 
            LEFT(TIME(dataRetorno),5) AS horaretorno FROM orcamentos_contatos WHERE idOrcamentoContato =" . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'horaretorno' => $linha['horaretorno'],
            'retorno' => FormatData($linha['retorno'], false),
            'tipo' => $linha['tipo'],
            'obs' => $linha['obs']
        );

        echo json_encode($json);
    }
    $db->close();
}

function getTiposFollow() {

    $db = ConectaDB();
    $sql = "SELECT idContatoTipo AS codigo, tipoContato AS nome FROM contatostipos WHERE ativo = 1 ORDER BY nome";
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function getFollow() {

    $db = ConectaDB();
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

    $sql = "SELECT c.idOrcamentoContato AS codigo, c.dataCadastro AS data, t.tipoContato AS tipo, 
      f.funcionario, c.obs, c.dataRetorno
      FROM orcamentos_contatos AS c
      LEFT JOIN contatostipos AS t ON t.idContatoTipo = c.idContatoTipo
      LEFT JOIN funcionarios AS f ON f.idFuncionario = c.idUsuarioCadastro
      WHERE c.del = 0 AND idOrcamento =  " . $_POST['codigo'];

    $sql .= " ORDER BY c.dataCadastro DESC  ";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

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
    $db->close();
}

function getObras() {

    $db = ConectaDB();

    $sql = "SELECT nomeObra, idArtistaObra "
            . "FROM artistas_obras where idArtista=" . $_POST['idArtista'] . " AND del=0 "
            . "ORDER BY nomeObra";
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
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
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 
            $json[] = array(
                'tamanho' => $linha['tamanho'],
                'codigo' => $linha['codigo'],
                'img' => $linha['imagem'],
                'imagem' => 'imagens/obras/mini_' . $linha['imagem'], 
                'imagemReal' => 'imagens/obras/' . $linha['imagem']

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

        /*$sql = "SELECT altura, largura, tiragemMaxima, tiragemAtual, "
                . "(SELECT estrelas FROM estrelas WHERE ativo=1 AND tiragemAtual BETWEEN de AND ate) AS estrelas "
                . "FROM  artistas_obras_tamanhos "
                . "WHERE idArtistaObraTamanho = " . $_POST['idArtistaObraTamanho'];*/
        /*
        $sql = "SELECT aob.altura, aob.largura, aob.tiragemMaxima, aob.tiragemAtual, 
            (SELECT estrelas FROM estrelas 
                WHERE ativo=1 AND 
                    (SELECT SUM(tiragemAtual)+1 FROM artistas_obras_tamanhos 
                        WHERE idObra=aob.idObra AND del=0) BETWEEN de AND ate) AS estrelas,
            (SELECT SUM(tiragemAtual) 
                FROM artistas_obras_tamanhos 
                WHERE idObra=aob.idObra AND del=0) AS qtdTotalVendida
            FROM artistas_obras_tamanhos AS aob
            WHERE aob.idArtistaObraTamanho =" . $_POST['idArtistaObraTamanho'];

        */


        $sql ="SELECT aob.altura, aob.largura, aob.tiragemMaxima, aob.tiragemAtual, idObra, 
            (SELECT estrelas FROM estrelas 
                WHERE ativo=1 AND 
                    (SELECT SUM(tiragemAtual)+1 FROM artistas_obras_tamanhos 
                        WHERE idArtistaObraTamanho= '". $_POST['idArtistaObraTamanho'] ."' AND del=0) BETWEEN de AND ate) AS estrelas,
            (SELECT SUM(tiragemAtual) 
                FROM artistas_obras_tamanhos 
                WHERE idArtistaObraTamanho= ". $_POST['idArtistaObraTamanho'] ." AND del=0) AS qtdTotalVendida,
                 IFNULL((SELECT MAX(estrelasAtual) FROM vendas_comp   WHERE idTamanho=". $_POST['idArtistaObraTamanho']."   AND del=0),0) AS estrelaAtual,
                 IFNULL((SELECT MAX(estrelasAtual) FROM orcamentos_comp  WHERE idTamanho=". $_POST['idArtistaObraTamanho']."   AND del=0),0) AS estrelaAtualOrcamento
            FROM artistas_obras_tamanhos AS aob
            WHERE aob.idArtistaObraTamanho=" . $_POST['idArtistaObraTamanho']; 

        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo '0';
        }else{
            $json = $db->fetch(); 
            $json['altura'] = FormatMoeda($json['altura']);
            $json['largura'] = FormatMoeda($json['largura']);
            $json['tiragemMaxima'] = $json['tiragemMaxima'];
            $json['tiragemAtual'] = $json['tiragemAtual'];
            $json['qtdTotalVendida'] = $json['qtdTotalVendida'];
            $json['estrelas'] = $json['estrelas'];
            $json['estrelaAtual'] = $json['estrelaAtual'];
            $json['estrelaAtualOrcamento'] = $json['estrelaAtualOrcamento'];           
        }

    }

    if ($_POST['item'] == 'i') {
        $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idTamanho'];
        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo '0';
        }else{
            $json = $db->fetch(); 
            $json['altura'] = FormatMoeda($json['altura']);
            $json['largura'] = FormatMoeda($json['largura']);
        }
    }
  
    echo json_encode($json);

    $db->close();
}

function getEstrelaObra ($item){
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

    $valorBase = $linha['precoBase'];
    $pesoBase = $linha['pesoBase'];
    $valorAcresMoldura = $linha['valorAcresMoldura'];

    $indiceAte1MSemEstrela = $linha['indiceAte1MSemEstrela'];
    $indiceAte1MComEstrela = $linha['indiceAte1MComEstrela'];

    $indiceAcima1MSemEstrela = $linha['indiceAcima1MSemEstrela'];
    $indiceAcima1MComEstrela = $linha['indiceAcima1MComEstrela'];

    //---- PEGA O VALOR BASE DA MOLDURA (CASO EXISTA)
    if ($_POST['idMoldura'] > 0) {
        if ($_POST['item'] == 'p') {
            if($valorAcresMoldura>0){
                $valorMoldura = $valorAcresMoldura;
            }
            else{
                $valorMoldura = 320;
            }
        } else {
            $sql = "SELECT mg.valor "
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

            $valorMoldura = $linha['valor'];
        }
    } else {
        $valorMoldura = 0;
    }
    //----------------------------------------

    if ($_POST['item'] == 'p') {

        //---- BUSCA OS DETALHES DAS OBRAS (ATUALIZADO)
       /*$sql = "  SELECT altura, largura, tiragemMaxima, tiragemAtual, "
                . "(SELECT estrelas FROM estrelas WHERE ativo=1 AND tiragemAtual BETWEEN de AND ate) AS estrelas "
                . "FROM  artistas_obras_tamanhos "
                . "WHERE idArtistaObraTamanho = " . $_POST['idObraTamanho'];*/
        
        $sql = "SELECT aob.altura, aob.largura, aob.tiragemMaxima, aob.tiragemAtual, 
            (SELECT estrelas FROM estrelas 
                WHERE ativo=1 AND 
                    (SELECT SUM(tiragemAtual)+1 FROM artistas_obras_tamanhos 
                        WHERE idObra=aob.idObra AND del=0) BETWEEN de AND ate) AS estrelas,
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

        $tiragemMaxima = $linha['tiragemMaxima'];
        $tiragemAtual = $linha['tiragemAtual'];
        $estrelas = $linha['estrelas'];
        
        /*
        //---------------------------------------
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

        if ($valorMoldura > 0) {
            $valorObra += (($altura * $largura / 10000) * $valorMoldura);
        }

        $pesoObra = round(($pesoBase * $altura * $largura) / 10000, 2);
         
        */
        
        $estrelas = (int)($linha['qtdTotalVendida'] / 10);

        //ACIMA DE 1 M²
        $indice = 1.5;
        if (($altura  > 100 || $largura > 100) ) {
           $indice = 1.8;
        }

        $valorObra = round((($altura * $largura) / 10000) * $indice, 2);

        $valorObra += ( $valorObra * 0.05 * $estrelas );

        if ($valorMoldura > 0) {
            $valorObra += (($altura * $largura / 10000) * $valorMoldura);
        }

        $pesoObra = round(($pesoBase * $altura * $largura) / 10000, 2);

        $valorObra = (int)($valorObra);
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

        $valorObra = round(((0.000000006 * (pow($altura * $largura, 2))) - (0.00012 * ($altura * $largura)) + 1.6) * (($valorBase * $altura * $largura) / 10000), 2);

        if ($valorMoldura > 0) {
            $valorObra += (($altura * $largura / 10000) * $valorMoldura);
        }

        $pesoObra = round(($pesoBase * $altura * $largura) / 10000, 2);
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
        'imagemMoldura' => getImagemMoldura($ArqT, $_POST['idMoldura'])
    );

    echo json_encode($json);
    $db->close();
}

function ExcluirImagem() {

    if (file_exists("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem'])) {
        unlink("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem']);
        unlink("../imagens/" . $_POST['pasta'] . "/mini_" . $_POST['imagem']);
    }
}

function GerarMiniaturaImagem() {

    if (file_exists("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem'])) {

        $extensao = explode('.', $_POST['imagem']);

        //Verifica a extensão do arquivo
        if ($extensao[1] !== 'jpg' && $extensao[1] !== 'jpeg') {

            $image = imagecreatefrompng("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem']);
            $quality = 80;

            $filePath = "../imagens/" . $_POST['pasta'] . "/" . $extensao[0];

            //Cria imagem .jpg
            $bg = imagecreatetruecolor(imagesx($image), imagesy($image));
            $quality = 80;
            $filePath = "../imagens/" . $_POST['pasta'] . "/" . $extensao[0];
            imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
            imagealphablending($bg, TRUE);
            imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
            imagedestroy($image);
            imagejpeg($bg, $filePath . ".jpg", $quality);
            imagedestroy($bg);

            //Exclui arquivo .png
            unlink("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem']);

            $_POST['imagem'] = $extensao[0] . '.jpg';
        }

        Redimensionar("../imagens/" . $_POST['pasta'] . "/" . $_POST['imagem'], 175, 125, "mini_", 80);

        $json = array(
            'imagem' => "imagens/" . $_POST['pasta'] . "/mini_" . $_POST['imagem']
        );

        echo json_encode($json);
    } else {
        echo "0";
    }
}

function CancelarOrcamento() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE orcamentos SET del = 1, 
            dataDel = NOW(),
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . "  
            WHERE idOrcamento= " . $_POST['idOrcamento'];

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        AtualizarStatusOrcamento($db, 4, $_POST['idOrcamento']);
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function GerarPdfOrcamento() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT c.cliente, o.telefoneCliente, o.emailCliente, c.responsavel, tt.tipoTransporte, 
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

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch();

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
        $idTipoProduto = mysqli_result($Tb, 0, "idTipoProduto");

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
    }
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

    $db->query( $sql );

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

        while ($linha = $db->fetch()) {

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

        while ($linha = $db->fetch()) {

            $html .= '<tr>
                        <td>' . $linha['nomeTipo'] . '</td>
                        <td>' . $linha['nomeTamanhoInsta'] . ($linha['idTipoProduto'] == 3 ? '' : ' (' . round($linha['altura']) . 'X' . round($linha['largura']) . ') ') . '</td>
                        <td>' . ($linha['idTipoProduto'] == 3 ? $linha['nomeProduto'] : $linha['nomeAcabamento']) . ($linha['moldura'] == '' ? '' : ' (Mold.: ' . $linha['moldura'] . ')') . '</td>
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
    $pdf->Output('../orcamentos/orcamento-' . $_POST['idOrcamento'] . '-' . $cliente . '.pdf', 'F');
    $filepath = 'orcamentos/orcamento-' . $_POST['idOrcamento'] . '-' . $cliente . '.pdf';

    echo $filepath;
    $db->close();
}

function EnviarPdfOrcamentoEmail() {

    if (!file_exists('../orcamentos/orcamento-' . $_POST['idOrcamento'] . '-' . $_POST['cliente'] . '.pdf')) {
        GerarPdfOrcamento2();
    }

    $db = ConectaDB();

    //Busca o tipo de produto
    $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idOrcamento'] . " AND del = 0 ORDER BY idTipoProduto DESC LIMIT 1";

    $db->query( $sql );
    $idTipoProduto = 1;//mysqli_result($Tb, 0, "idTipoProduto");

    $nomeProduto = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts' : 'InstaArts');
    $corEmail = ($idTipoProduto == '1' || $idTipoProduto == '3' ? '#6FAEE3' : '#3AB54A');
    $logoEmail = '../imagens/' . ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
    $rodape = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' || $idTipoProduto == '3' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br');
    
    //$remetente = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts Gallery' : 'InstaArts');
    //$remetenteEmail = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');
    
    $sqll = "SELECT IFNULL(emailCorporativo, '') AS emailCorporativo 
            FROM vendedores 
            LEFT JOIN funcionarios AS f USING (idFuncionario) 
            WHERE idVendedor = " . $_POST['vendedor'];

    $db->query( $sql );
    $result = $db->fetch();
    
    $remetente = ($_POST['nomeVendedor']=='' ? $_SESSION['photoarts_funcionario'] : $_POST['nomeVendedor']); //($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $remetenteEmail = ($result["emailCorporativo"] == '' ? $_SESSION['photoarts_email'] : $result["emailCorporativo"]); //($idTipoProduto == '1' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');
    
    $responderPara = ($result["emailCorporativo"] == '' ? $remetenteEmail : $result["emailCorporativo"]);
    $nomeResponderPara = ($_POST['vendedor'] == '0' ? $remetente : $_POST['nomeVendedor']);
    
    $assunto = "Orçamento N° " . number_format_complete($_POST['idOrcamento'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));
    $msg =  $_POST['mensagemopc'];
    $MSSG = str_replace($msg, '<p>', '<br>');
    
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
                                    '. $MSSG .'
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

    $orcamento = '../orcamentos/orcamento-' . $_POST['idOrcamento'] . '-' . $_POST['cliente'] . '.pdf';
    
    //Erros(implode(',', array($_POST['cliente'], $_POST['email'], $remetenteEmail, $remetente, '', '', $responderPara, $nomeResponderPara, $assunto, $mensagem, $orcamento, $idTipoProduto)));
    if (EnvioDeEmailsPhotoarts($_POST['cliente'], $_POST['email'], $remetenteEmail, $remetente, '', '', $responderPara, $nomeResponderPara, $assunto, $mensagem, $orcamento, $idTipoProduto)){
        echo '1';
    } else {
        echo '0';
    }
}

function ExcluirOrcamento(){
    inicia_sessao();
    
    $db = ConectaDB();

    $sql = "UPDATE orcamentos SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idOrcamento = " . $_POST['idOrcamento'];

    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        echo '1';
    }else{
        echo '0';
    }

    $db->close();
}


function GerarPdfOrcamentoImg() {

    $db = ConectaDB();

 $sql = "SELECT c.cliente, o.telefoneCliente, o.emailCliente, c.responsavel, tt.tipoTransporte, 
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

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch(); 

        $cliente = $linha['cliente'];
        $clienteTelefone = $linha['telefoneCliente'];
        $clienteEmail = $linha['emailCliente'];
        $tipoTransporte = $linha['tipoTransporte'];
        $obs = $linha['obs'];
        $dataAtual = dataExtenso($linha['dataAtual']);
        $dataOrcamento = FormatData($linha['dataOrcamento'], false);
        $dataValidade = FormatData($linha['dataValidade']);
        $artista = $linha['artista'];
        $vendedor = $linha['vendedor'];
        $idTipoProduto = $linha['idTipoProduto'];
        $loja = $linha['loja'];
        $cidadeLoja = ($linha['cidadeLoja'] == '' ? 'Cotia' : $linha['cidadeLoja']);

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

    //======================================
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
                                    <div style="width:70px;  font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Obs.: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444; width:auto;">' . $obs . '</span></div>
                                </div>
                                <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:right;">
                                    <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $dataOrcamento . '</span></div>
                                    <div style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">Valido até <span style="font-size:16px;">' . $dataValidade . '</span></div>
                                    <img src="' . $logoPdf . '" style="' . $medidasLogo . '"/>
                                </div>
                                <div style="clear:both"></div>
                                <div id="linha3" style="margin-top:15px; " ></div>
                                <div style="position:relative; border:solid; border-color:#BDBDBD; border-width:1.5px;">
                                <div style="background-color:color:#444444; width:40%;height: 20px; float:left;"></div>
                                <div id="linhatotal" style="border:solid 2px ' . $corPdf . ';  background:' . $corPdf . '; width:50%; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px;  float:right;">
                                    <h1 style="display:inline-block; margin:0px; padding:0px; font-size:15px; font-weight:bold; vertical-align:middle">Obras</h1>
                                </div> </div>';
    }
    $sql = "SELECT IFNULL(ao.nomeObra, 'Instaarts') AS nomeObra, IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, 
            oc.altura AS altura, oc.largura, oc.valor, oc.imagemObra, ab.nomeAcabamento, 
            IFNULL(a.artista, 'Instaarts') AS nomeArtista, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta FROM orcamentos AS o
            LEFT JOIN orcamentos_comp AS  oc ON oc.idOrcamento = o.idOrcamento 
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra 
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = oc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = oc.idTamanho
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ab ON ab.idAcabamento = oc.idAcabamento
            WHERE o.idOrcamento = " . $_POST['idOrcamento'] . " AND oc.del = 0";
    $db->query( $sql );

    $nomeObra = '';
    $imagemObra = '';
    $nomeAcab = '';
    $cont = 0;
    $contador = 0;
    
    while ($linha = $db->fetch()) {  
        $contador++; 
        //if ($artista == 'Instaarts') {
        if ($idTipoProduto == 2) {

            if ($imagemObra != $linha['imagemObra']){

                $imagemObra = $linha['imagemObra'];   
                $nomeAcab = '';
                $cont++;
                if($_POST['opcaoTexto'] === '1'){
                    $html .= '<div style="margin-top:20px;width:150px;  float:left;">';
                    $html .= '<img style="width:150px; height:auto;" src="http://www.photoarts.com.br/sistema/imagens/instaarts/' . $linha['imagemObra'] . '"/>
                            </div> <div style="margin-top:20px; width:150px; float:right;" >  
                            <label><b>Artista:</b> Instaarts</label>
                            <br>
                            <label><b>Obra:</b> ' . $linha['nomeObra'] . '</label>';
                            /*<label><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                            <br>
                            <label><b>Tamanhos</b></label>';*/

                }else{ 
                            $html .= '<div style="margin-top:20px;width:150px;  float:right;">';
                           $html .= ($cont==1 ? '' : '<hr />');
                           $html .= '<img style="width:150px; height:auto;" src="http://www.photoarts.com.br/sistema/imagens/instaarts/' . $linha['imagemObra'] . '"/>
                            </div> <div style="margin-top:20px; width:150px; float:left;" >  
                            <label><b>Artista:</b> Instaarts</label>
                            <br>
                            <label><b>Obra:</b> ' . $linha['nomeObra'] . '</label>
                            ';
                            /*<label><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                            <br>
                            <label><b>Tamanhos</b></label>';*/

                    }
            }
        } 
        else {            
           
                    if ($nomeObra != $linha['nomeObra']) {
                        if($_POST['opcaoTexto'] === '1'){
                        $nomeObra = $linha['nomeObra'];
                        $nomeAcab = '';
                        $cont++;
                        
                        $html.= '<div style="margin-top:20px;width:100%; float:left;"> '. ($cont==1 ? '' : '<hr>') .' <label> '.$contador.') </label>   </div>';
                        $html .= '<div style="margin-top:10px;width:150px;  float:left;">';
                        
                        $html .= '<img style="width:150px; height:auto;" src="http://www.photoarts.com.br/sistema/imagens/obras/' . $linha['imagemObra'] . '"/>
                                    </div>
                                    <div style="width:270px; margin-top:15px; float:right; margin-right:210px;" >  
                                    <label><b>Artista:</b> ' . $linha['nomeArtista'] . '</label>
                                    <br>
                                    <label><b>Obra:</b> ' . $linha['nomeObra'] . '</label>
                                    ';
                                    /*<label><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                                    <br>
                                    <label><b>Tamanhos</b></label>';*/
                
                 }else{ 

                     $nomeObra = $linha['nomeObra'];
                        $nomeAcab = '';
                        $cont++;
                        $html.= '<div style="margin-top:20px;width:100%; "> '. ($cont==1 ? '' : '<hr>') .' <label> '.$contador.') </label>  </div>';

                        $html.='<div style="width:270px; float:left; " >  
                                    <label><b>Artista:</b> ' . $linha['nomeArtista'] . '</label>
                                    <br>
                                    <label><b>Obra:</b> ' . $linha['nomeObra'] . '</label>';
                        if ($nomeAcab != $linha['nomeAcabamento']) {
                                $nomeAcab = $linha['nomeAcabamento'];
                                
                                $html .= '<br /><label style="padding-top:10px"><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                                                <br>
                                                <label><b>Tamanhos</b></label>';
                                
                            }

                    if($_POST['opcaoValores'] === '1'){
                        $html .= '<br>
                            <label>' . ($idTipoProduto == 2 ? $linha['nomeTamanhoInsta'] : $linha['nomeTamanho']) . ' (' . FormatMoeda($linha['altura']) . ' x ' . FormatMoeda($linha['largura']) . ') <br><b>Preço:</b> R$ ' . FormatMoeda($linha['valor']) . '</label></div>';
                    }else{

                        $html .= '<br>
                        <label>' . ($idTipoProduto == 2 ? $linha['nomeTamanhoInsta'] : $linha['nomeTamanho']) . ' (' . FormatMoeda($linha['altura']) . ' x ' . FormatMoeda($linha['largura']) . ')</label></div>';
                    }

                        $html .= '<div style="width:150px;  margin-right:220px; float:right;">';
                        $html .= '<img style="width:150px; height:auto; " src="http://www.photoarts.com.br/sistema/imagens/obras/' . $linha['imagemObra'] . '"/>
                                    </div>';

                 }

            }
        }
         if($_POST['opcaoTexto'] === '1'){


        if ($nomeAcab != $linha['nomeAcabamento']) {
            $nomeAcab = $linha['nomeAcabamento'];
            
            $html .= '<br /><label style="padding-top:10px"><b>Acabamento:</b> ' . $linha['nomeAcabamento'] . '</label>
                            <br>
                            <label><b>Tamanhos</b></label>';
            
        }
        
        if($_POST['opcaoValores'] === '1'){
            $html .= '<br>
                <label>' . ($idTipoProduto == 2 ? $linha['nomeTamanhoInsta'] : $linha['nomeTamanho']) . ' (' . FormatMoeda($linha['altura']) . ' x ' . FormatMoeda($linha['largura']) . ')<br><b>Preço:</b> R$ ' . FormatMoeda($linha['valor']) . '</b></label></div>';
        }else{

            $html .= '<br>
            <label>' . ($idTipoProduto == 2 ? $linha['nomeTamanhoInsta'] : $linha['nomeTamanho']) . ' (' . FormatMoeda($linha['altura']) . ' x ' . FormatMoeda($linha['largura']) . ')</label></div>';
        }
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
    
    $pdf->Output('../orcamentos/orcamento-' . $_POST['idOrcamento'] . '.pdf', 'F');
    $filepath = 'orcamentos/orcamento-' . $_POST['idOrcamento'] . '.pdf';

    echo $filepath;
    $db->close();
}


function BuscaArtistas (){
    $db = ConectaDB();

    $sql = "SELECT idArtista, artista FROM artistas WHERE ativo = 1 ORDER BY artista";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {  

            $json[] = array(
                'idArtista' => $linha['idArtista'],
                'artista' => $linha['artista']


                    //  'imagem' => 'http://criodigital.net/photoarts/imagens/obras/mini_' . $linha['imagem']
            );
        }

        echo json_encode($json);
    }

    $db->close();


}


function BuscaObras (){
    $db = ConectaDB();

    $sql = "SELECT nomeObra, idArtistaObra  FROM artistas_obras WHERE del=0 AND idArtista= ". $_POST['codigo']."  ORDER BY nomeObra";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {  

            $json[] = array(
                'idObra' => $linha['idArtistaObra'],
                'obra' => $linha['nomeObra']


                    //  'imagem' => 'http://criodigital.net/photoarts/imagens/obras/mini_' . $linha['imagem']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function AtualizaEstrela(){

    $db = ConectaDB();

    $sql ="SELECT aob.altura, aob.largura, aob.tiragemMaxima, aob.tiragemAtual, idObra, 
            (SELECT estrelas FROM estrelas 
                WHERE ativo=1 AND 
                    (SELECT SUM(tiragemAtual)+ " . $_POST['qtd'] . " FROM artistas_obras_tamanhos 
                        WHERE idArtistaObraTamanho=". $_POST['idArtistaObraTamanho']." AND del=0) BETWEEN de AND ate) AS estrelas,
            (SELECT SUM(tiragemAtual) 
                FROM artistas_obras_tamanhos 
                WHERE idArtistaObraTamanho=". $_POST['idArtistaObraTamanho']." AND del=0) AS qtdTotalVendida, 
                IFNULL((SELECT MAX(estrelasAtual) FROM vendas_comp   WHERE idTamanho=". $_POST['idArtistaObraTamanho']."   AND del=0),0) AS estrelaAtual,
                 IFNULL((SELECT MAX(estrelasAtual) FROM orcamentos_comp  WHERE idTamanho=". $_POST['idArtistaObraTamanho']."   AND del=0),0) AS estrelaAtualOrcamento
            FROM artistas_obras_tamanhos AS aob
            WHERE aob.idArtistaObraTamanho=" . $_POST['idArtistaObraTamanho'];
     
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $json = $db->fetch();
        $json['estrelas'] = $json['estrelas'];
        $json['estrelaAtual'] = $json['estrelaAtual'];
        $json['estrelaAtualOrcamento'] = $json['estrelaAtualOrcamento'];

        echo json_encode($json);
    }
    $db->close();
}

function GerarPdfOrcamento2() {

    $db = ConectaDB();

    $sql = "SELECT c.cliente, o.telefoneCliente, o.emailCliente, c.responsavel, tt.tipoTransporte, 
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

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch();

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
        $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idOrcamento'] . " AND del = 0 ORDER BY idTipoProduto DESC LIMIT 1";
        
        $db->query( $sql );
        $result = $db->fetch();
        
        $idTipoProduto = $result["idTipoProduto"];

        $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : ($idTipoProduto == '2' ? '#3AB54A' : '#6FAEE3'));
        $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : ($idTipoProduto == '2' ? 'InstaArts' : 'Photoarts'));
        $logoPdf = '../imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : ($idTipoProduto == '2' ? 'logo_instaarts_fundo_branco.jpeg' : 'Logopronto_fundo_branco.jpeg'));
        $medidasLogo = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'width:150px; float:right; margin-top:-53px;' : 'width:270px; float:right; margin-top:10px;');
        $assinatura = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts Gallery' : 'InstaArts') . '<br>' . $vendedor;
        $rodape = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
        $rodape2 = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'www.photoarts.com.br' : 'www.instaarts.com.br');

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
        }
    /*$sql = "SELECT oc.*, IFNULL(ao.nomeObra, '- - -') AS nomeObra, IFNULL(a.artista, '- - -') AS artista, 
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
            WHERE oc.idOrcamento = " . $_POST['idOrcamento'] . " AND oc.del = 0 GROUP BY osc.imagemObra ";*/

    $sql = "SELECT osc.idObra, IFNULL(ao.nomeObra, 'InstaArts') AS nomeObra, osc.imagemObra, 
            IFNULL(a.artista, 'Instaarts') AS artista,
            IFNULL(ac.nomeAcabamento, '') AS nomeAcabamento, IFNULL(ao.idArtista, 0) AS idArtista, osc.idAcabamento, 
            GROUP_CONCAT(idOrcamentoCompInstaarts) AS idsInstaarts, osc.idTipoProduto, osc.idMolduraGrupo, osc.idMoldura, 
            IFNULL(m.moldura, '') AS moldura, IFNULL(p.nomeProduto, '') AS nomeProduto, osc.qtd, osc.valor
            FROM orcamentos_comp AS osc
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = osc.idObra
            LEFT JOIN artistas AS a ON ao.idArtista = a.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = osc.idAcabamento
            LEFT JOIN molduras AS m ON m.idMoldura = osc.idMoldura 
            LEFT JOIN produtos AS p ON p.idProduto = osc.idProduto
            WHERE osc.idOrcamento = " . $_POST['idOrcamento'] . " AND osc.del = 0 AND osc.selecionado = 1
            GROUP BY osc.imagemObra, osc.idAcabamento#, osc.idOrcamentoComp
            ORDER BY osc.idObra";

    $db->query( $sql );

    if($_POST['opcaoTexto'] == '2'){

        $html .= '<table class="tabela_cinza_foco"> 
                 <thead> 
                     <tr>
                        <th>Imagem</th>
                         <th>Dados</th>
                         <th>Tamanhos</th>
                     </tr>
                 </thead>
                 <tbody>';

        while ($linha = $db->fetch()) {

            if($linha['idTipoProduto'] == '1'){

                $html .= '<tr>
                            <td align="center"><img src="../imagens/obras/' . $linha['imagemObra'] . '" style="width:100px; height:auto;"/></td>
                            <td>Artista: ' . $linha['artista'] . '<br/> Obra: ' . $linha['nomeObra'] . '<br/> Acabamento: ' . $linha['nomeAcabamento'] . ' <br/> ' . ($linha['moldura'] == "" ? "" : "Moldura: " . $linha['moldura']) . '</td>
                            <td>' . ListarTamanhosObras($ArqT, $linha['idObra'], $_POST['idOrcamento'], $linha['idsInstaarts']) . '</td>
                        </tr>';
            }else if($linha['idTipoProduto'] == '2'){

                $html .= '<tr>
                            <td align="center"><img src="' . ($linha['imagemObra'] == 'semimagem.png' || $linha['imagemObra'] == '' ? '../imagens/semimagem.png' : '../imagens/instaarts/' . $linha['imagemObra']) . '" style="width:100px; height:auto;"/></td>
                            <td>Instaarts<br/> Acabamento: ' . $linha['nomeAcabamento'] . ' <br/> ' . ($linha['moldura'] == "" ? "" : "Moldura: " . $linha['moldura']) .  '</td>
                            <td>' . ListarTamanhosObras($ArqT, $linha['idObra'], $_POST['idOrcamento'], $linha['idsInstaarts']) . '</td>
                        </tr>';
            }else{

                $html .= '<tr>
                            <td align="center"><img src="' . ($linha['imagemObra'] == '' ? '../imagens/semarte.png' : '../imagens/produtos/' . $linha['imagemObra']) . '" style="width:100px; height:auto;"/></td>
                            <td>' . $linha['nomeProduto'] . '</td>
                            <td>Quantidade: ' . $linha['qtd'] . ' - Valor: ' . FormatMoeda($linha['valor']) . '</td>
                        </tr>';
            }
        }
    }else{

        $html .= '<table class="tabela_cinza_foco"> 
                 <thead> 
                     <tr>
                        <th>Tamanhos</th>
                         <th>Dados</th>
                         <th>Imagem</th>
                     </tr>
                 </thead>
                 <tbody>';

        while ($linha = $db->fetch()) {  

            if($linha['idTipoProduto'] == '1'){

                $html .= '<tr>
                            <td>' . ListarTamanhosObras($ArqT, $linha['idObra'], $_POST['idOrcamento'], $linha['idsInstaarts']) . '</td>
                            <td>Artista: ' . $linha['artista'] . '<br/> Obra: ' . $linha['nomeObra'] . '<br/> Acabamento: ' . $linha['nomeAcabamento'] . ' <br/> ' . ($linha['moldura'] == "" ? "" : "Moldura: " . $linha['moldura']) .  '</td>
                            <td align="center"><img src="../imagens/obras/' . $linha['imagemObra'] . '" style="width:100px; height:auto;"/></td>
                        </tr>';
            }else if($linha['idTipoProduto'] == '2'){

                $html .= '<tr>
                            <td>' . ListarTamanhosObras($ArqT, $linha['idObra'], $_POST['idOrcamento'], $linha['idsInstaarts']) . '</td>
                            <td>Instaarts<br/> Acabamento: ' . $linha['nomeAcabamento'] . ' <br/> ' . ($linha['moldura'] == "" ? "" : "Moldura: " . $linha['moldura']) .  '</td>
                            <td align="center"><img src="../imagens/instaarts/' . $linha['imagemObra'] . '" style="width:100px; height:auto;"/></td>
                        </tr>';
            }else{

                $html .= '<tr>
                            <td align="center"><img src="' . ($linha['imagemObra'] == '' ? '../imagens/semarte.png' : '../imagens/produtos/' . $linha['imagemObra']) . '" style="width:100px; height:auto;"/></td>
                            <td>' . $linha['nomeProduto'] . '</td>
                            <td>Quantidade: ' . $linha['qtd'] . ' - Valor: ' . FormatMoeda($linha['valor']) . '</td>
                        </tr>';
            }
        }
    }

    $html .= '</tbody>
            </table></div>';

    if($_POST['opcaoValores'] == '1'){

        $html .= '<div style="min-height:10px;"> </div>
                <div align="right">
                    <div style="border: solid 4px #FFF; text-align:center; width:20%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; border:solid 2px ' . $corPdf . '; float:right; margin-top:5px; margin-bottom:5px;">Total R$ <span>' . $valorTotal . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:30%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Desconto R$ <span>' . $valorDesconto . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:20%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Frete R$ <span>' . $valorFrete . '</span></div>
                    <div style="border: solid 4px #FFF; text-align:center; width:25%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Valor R$ <span>' . $valor . '</span></div>
                </div>';
    }

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
                <span style="font-size:11px; font-weight:bold; line-height:22px;">' . $cidadeLoja . ', ' . $dataAtual . '</span>
                <!--<div style="min-height:50px;"></div>-->
                <div style="font-size:12px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; display:inline-block; text-align:center; margin-top:25px;">' . $assinatura . '</div>   
                <div style="font-size:12px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; float:right; display:inline-block; text-align:center; margin-top:-46px;">' . $cliente . '</div>   
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
    $random = rand();
    $pdf->Output('../orcamentos/orcamento-' . $_POST['idOrcamento'] . '-' . $cliente . '.pdf', 'F');
    $filepath = 'orcamentos/orcamento-' . $_POST['idOrcamento'] . '-' . $cliente . '.pdf?' . $random;

    echo $filepath;
    $db->close();
}

function ListarTamanhosObras($ArqT, $idObra, $idOrcamento, $idsInstaarts){

    if($idObra == '0'){

        $sql = "SELECT oc.idOrcamentoComp, oc.idTamanho, t.nomeTamanho, oc.altura, oc.largura, oc.valor 
                FROM orcamentos_comp AS oc
                LEFT JOIN tamanhos AS t ON t.idTamanho = oc.idTamanho 
                LEFT JOIN orcamentos_comp_instaarts AS oci ON oci.idOrcamentoComp = oc.idOrcamentoComp
                WHERE oc.del=0 AND oc.idOrcamento = " . $idOrcamento . " AND oc.idTipoProduto = 2 
                AND idOrcamentoCompInstaarts IN(" . $idsInstaarts . ") AND oc.selecionado = 1
                GROUP BY oc.imagemObra, oc.idTamanho, oc.idOrcamentoCompInstaarts 
                ORDER BY oc.idOrcamentoComp";
    }else{

        $sql = "SELECT osc.idOrcamentoComp, osc.idTamanho, t.nomeTamanho, osc.altura, osc.largura, 
                osc.valor 
                FROM orcamentos_comp AS osc 
                INNER JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = osc.idTamanho
                INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho 
                WHERE osc.del=0 AND osc.idObra = " . $idObra . " AND osc.idOrcamento = " . $idOrcamento . " 
                AND osc.selecionado = 1";
        $sql .= " ORDER BY osc.idOrcamentoComp";
    }

    $ArqT->query( $sql );
    
    if ( $ArqT->n_rows <= 0 ) {
        echo '0';
    }else{
        $tamanhos = '';
        while ($linha = $ArqT->fetch()) {  

            if($tamanhos == ''){
                $tamanhos = $linha['nomeTamanho'] . ' (' . FormatMoeda($linha['altura']) . 'x' . FormatMoeda($linha['largura']) . ')' . ' - R$' . FormatMoeda($linha['valor']);
            }else{
                $tamanhos .= '<br/>' . $linha['nomeTamanho'] . ' (' . FormatMoeda($linha['altura']) . 'x' . FormatMoeda($linha['largura']) . ')' . ' - R$' . FormatMoeda($linha['valor']);
            }
        }

        return $tamanhos;
    }
}

function CalcularFrete(){

    $pesos = explode('#', $_POST['pesos']);
    $alturas = explode('#', $_POST['alturas']);
    $larguras = explode('#', $_POST['larguras']);
    $selecionados = explode('#', $_POST['selecionados']);

    $valorTotal = 0;
    $totalDias = 0;
    $qtdObras = count($pesos);
    $qtdErro = 0;
    $qtdOk = 0;
    $erro = '';
    $msgErro = '';

    for ($i = 0; $i < count($selecionados); $i++) {

        $alturaAux = explode(',', $alturas[$i]);
        $larguraAux = explode(',', $larguras[$i]);
        $selecionadoAux = explode(',', $selecionados[$i]);
        $pesosAux = explode(',', $pesos[$i]);

        for ($j = 0; $j < count($selecionadoAux); $j++) {

            if($selecionadoAux[$j] == '1' && $alturaAux[$j] != '0' && $larguraAux[$j] != '0'){

                $xmlCorreios = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?nCdEmpresa=" . $_POST['nCdEmpresa'] . "&sDsSenha=" . $_POST['sDsSenha'] . "&nCdServico=" . $_POST['nCdServico'] . "&sCepOrigem=" . $_POST['sCepOrigem'] . "&sCepDestino=" . $_POST['sCepDestino'] . "&nVlPeso=" . $pesosAux[$j] . "&nCdFormato=" . intval($_POST['nCdFormato']) . "&nVlComprimento=" . $_POST['nVlComprimento'] . "&nVlAltura=" . $alturaAux[$j] . "&nVlLargura=" . $larguraAux[$j] . "&nVlDiametro=" . ValorE($_POST['nVlDiametro']) . "&sCdMaoPropria=" . $_POST['sCdMaoPropria'] . "&nVlValorDeclarado=" . ValorE($_POST['nVlValorDeclarado']) . "&sCdAvisoRecebimento=" . $_POST['sCdAvisoRecebimento'] . "";

                $xml = simplexml_load_file($xmlCorreios);

                //0 = Processamento feito com sucesso
                if($xml->Servicos->cServico->Erro == '0'){
                    $qtdOk++;
                    $valorTotal += $xml->Servicos->cServico->Valor;
                    $totalDias += $xml->Servicos->cServico->PrazoEntrega;
                }else{
                    $qtdErro++;
                    echo $xml->Servicos->cServico->Erro;
                    return;
                }
            }
        }
    }

    if($valorTotal > 0){

        $json = array(
            'valorFrete' => 'R$ ' . FormatMoeda($valorTotal),
            'prazoEntrega' => round($totalDias / $qtdOk) . ' dia(s)'
        );

        echo json_encode($json);
    }else{

        echo '0';
    }

    $db->close();
}