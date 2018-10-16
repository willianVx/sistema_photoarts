<?php

include('photoarts.php');
require_once '../padrao/pdf/mpdf.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarPedidos':
            MostrarPedidos();
            break;

        case 'Gravar':
            Gravar();
            break;

        /* case 'GetRegistroPrimeiro':
          $ArqT = AbreBancoPhotoarts();
          echo RegistroPrimeiro($ArqT, 'vendas', 'idVenda', false);
          break;

          case 'GetRegistroAnterior':
          $ArqT = AbreBancoPhotoarts();
          echo RegistroAnterior($ArqT, 'vendas', $_POST['atual'], 'idVenda', false);
          break;

          case 'GetRegistroProximo':
          $ArqT = AbreBancoPhotoarts();
          echo RegistroProximo($ArqT, 'vendas', $_POST['atual'], 'idVenda', false);
          break;

          case 'GetRegistroUltimo':
          $ArqT = AbreBancoPhotoarts();
          echo RegistroUltimo($ArqT, 'vendas', 'idVenda', false);
          break; */

        case 'Mostrar':
            Mostrar();
            break;

        case 'MostraFollowUp':
            MostraFollowUp();
            break;

        case 'getFollowUp':
            getFollowUp();
            break;

        case 'GravarFollowUp':
            GravarFollowUp();
            break;

        case 'ExcluirFollowUP':
            ExcluirFollowUP();
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

        case 'CalculaPrevisaoEntrega':
            CalculaPrevisaoEntrega();
            break;

        case 'ExcluirObra':
            ExcluirObra();
            break;

        case 'getPercentualComissaoMarchand':
            getPercentualComissaoMarchand();
            break;

        case 'getObra':
            getObra();
            break;

        case 'EditarObra':
            EditarObra();
            break;

        case 'getStatusPedido':
            getStatusPedido();
            break;

        case 'MostraHistoricoStatusPedido':
            MostraHistoricoStatusPedido();
            break;

        case 'AlterarStatusPedido':
            AlterarStatusPedido();
            break;

        case 'ExcluirParcela':
            ExcluirParcela();
            break;

        /* case 'GravarPagamentoParcela':
          GravarPagamentoParcela();
          break; */

        /* case 'PesquisarPedidos':
          PesquisarPedidos();
          break; */

        /* case 'getParcela':
          getParcela();
          break; */

        case 'ExcluirImagem':
            ExcluirImagem();
            break;

        case 'GerarMiniaturaImagem':
            GerarMiniaturaImagem();
            break;

        case 'getIdPedido':
            getIdPedido();
            break;

        case 'CancelarPedido':
            CancelarPedido();
            break;

        case 'EditarPagamento':
            EditarPagamento();
            break;

        case 'MostrarPagamentosPedido':
            MostrarPagamentosPedido();
            break;

        case 'GerarPdfPedido':
            GerarPdfPedido();
            break;

        case 'EnviarPdfPedidoEmail':
            EnviarPdfPedidoEmail();
            break;

        case 'gerarOrdemProducao':
            gerarOrdemProducao();
            break;

        case 'getQtdDiasPag':
            getQtdDiasPag();
            break;

        case 'BaixarEstoque':
            BaixarEstoque();
            break;

        case 'ExcluirPedido':
            ExcluirPedido();
            break;

        case 'MostrarEstoqueObra':
            MostrarEstoqueObra();
            break;

        case 'PesquisarVale':
            PesquisarVale();
            break;

        case 'MostrarObrasRefazer':
            MostrarObrasRefazer();
            break;

         case 'AvisoRetirada':
            AvisoRetirada();
            break;


         case 'AvisoPesquisa':
            AvisoPesquisa();
            break;


        case 'EnviarEmailEstrela':
            EnviarEmailEstrela();
            break;
    }
}

function getQtdDiasPag() {

    $ArqT = AbreBancoPhotoarts();
    $sql = "SELECT qtdeDiasComp FROM formaspagamentos WHERE idFormaPagamento = " . $_POST['codigo'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {
        echo mysql_result($Tb, 0, "qtdeDiasComp");
    }
}

function gerarOrdemProducao() {

    session_start();
    $ArqT = AbreBancoPhotoarts();
    $sql = "INSERT INTO ordem_producao SET anoProducao = YEAR(CURDATE()),
            dataOrdemProducao =  CURDATE(),
            idVenda = " . $_POST['idVenda'] . ",
            idLoja = " . $_POST['loja'] . ",
            dataPrevista =  '" . DataSSql($_POST['previsao']) . "',
            obs = '" . TextoSSql($ArqT, $_POST['obs']) . "', 
            refeita = " . $_POST['refeita'] . ", 
            dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    mysql_query($sql, $ArqT);

    $idOrdemProducao = UltimoRegistroInserido($ArqT);

    $sql = "SELECT *, (SELECT idEtapa FROM etapas WHERE ordem = 1) AS etapa 
            FROM vendas_comp WHERE idVenda = " . $_POST['idVenda'] . " AND del = 0 
            AND idVendaComp IN (" . $_POST['codigos'] . ")";

    $Tb = ConsultaSQL($sql, $ArqT);

    while ($linha = mysql_fetch_assoc($Tb)) {

        $sql = "INSERT INTO ordem_producao_comp SET 
                    del=0, 
                    idOrdemProducao = " . $idOrdemProducao . ",
                    idOPEtapa = " . $linha['etapa'] . ",
                    idTipoProduto = " . $linha['idTipoProduto'] . ",
                    idObra = " . $linha['idObra'] . ",
                    idProduto = " . $linha['idProduto'] . ",
                    idAcabamento = " . $linha['idAcabamento'] . ",
                    idTamanho = " . $linha['idTamanho'] . ",
                    altura = " . $linha['altura'] . ",
                    largura = " . $linha['largura'] . ",
                    idArtista = " . $linha['idArtista'] . ",
                    qtd = " . $linha['qtd'] . ",
                    idVendaComp = " . $linha['idVendaComp'] . ",
                    numeroSerie = '',  
                    idGrupo = " . $linha['idMolduraGrupo'] . ",  
                    imagem = '" . $linha['imagemObra'] . "',    
                    idMoldura = " . $linha['idMoldura'] . ",  
                    obs = '" . TextoSSql($ArqT, $linha['obs']) . ($_POST['refeita'] == '1' ? ' - Refeita' : '') . "', dataCadastro = NOW(),  
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                    numeroTiragem = (SELECT (IFNULL(MAX(numeroTiragem), 0) + 1) FROM ordem_producao_comp AS opc WHERE opc.idObra = " . $linha['idObra'] . " AND opc.idTamanho = " . $linha['idTamanho'] . " AND opc.idArtista = " . $linha['idArtista'] . " AND del = 0)";
                   
        mysql_query($sql, $ArqT);

        $sql = "UPDATE vendas_comp SET sequencia = (SELECT numeroTiragem FROM ordem_producao_comp WHERE idVendaComp = " . $linha['idVendaComp'] . ") WHERE idVendaComp = " . $linha['idVendaComp'];
        mysql_query($sql, $ArqT);
    }

    echo $idOrdemProducao;
}

function MostrarPedidos() {

    $ArqT = AbreBancoPhotoarts();
    //getObrasOrcamentos(ve.idVenda, 1) AS obras, 

    $sql = "SELECT ve.idVenda, LPAD(ve.idVenda, 5, '0') AS numeroPedido, ve.dataCadastro, 
            c.cliente, LEFT(ve.dataVenda, 16) AS dataVenda,            
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = ve.idVenda AND del = 0) AS qtdePagamentos, 
            ve.valorTotal, vs.descricaoStatus, l.loja, v.vendedor AS marchand, ve.consignacao           
            FROM vendas AS ve             
            INNER JOIN lojas AS l ON l.idLoja = ve.idLoja             
            INNER JOIN clientes AS c ON c.idCliente = ve.idCliente             
            INNER JOIN vendas_status AS vs ON vs.idVStatus = ve.idUltimoStatus             
            INNER JOIN vendedores AS v ON v.idVendedor = ve.idVendedor             
            WHERE ve.del = 0 ";

    if($_POST['de'] != ''){
        $sql .= " AND ve.dataVenda >= '" . DataSSql($_POST['de']) . "' ";
    }

    if($_POST['ate'] != ''){
        $sql .= " AND ve.dataVenda <= '" . DataSSql($_POST['ate']) . "' ";
    }

    if ($_POST['busca'] != '') {

        $sql .= " AND (ve.idVenda LIKE '%" . $_POST['busca'] . "%' 
                OR c.cliente LIKE '%" . $_POST['busca'] . "%' 
                OR (SELECT IFNULL(GROUP_CONCAT(CONCAT(IFNULL(ao.nomeObra, 'InstaArts'), ' (', vc.altura, 'x', vc.largura, ') - ', a.nomeAcabamento) SEPARATOR '<br>'), '')            
                    FROM vendas_comp AS vc            
                    LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra            
                    INNER JOIN acabamentos AS a ON a.idAcabamento = vc.idAcabamento            
                    WHERE vc.idVenda = ve.idVenda) LIKE '%" . $_POST['busca'] . "%')";
    }
    
    if ($_POST['statusTipo'] > '0') {
        $sql .= " AND ve.consignacao = " . ($_POST['statusTipo'] == '1' ? '0' : '1') . " ";
    }

    if ($_POST['statusBusca'] > '0') {
        $sql .= " AND vs.idVStatus = " . $_POST['statusBusca'] . " ";
    }

    if ($_POST['loja'] > '0') {
        $sql .= " AND ve.idLoja = " . $_POST['loja'] . " ";
    }
    
    if(isset($_POST['periodo'])){
        $sql .= " AND ve.dataVenda >= DATE_ADD(CURDATE(), INTERVAL " . $_POST['periodo'] . " DAY) " ;
    }


    if ($_POST['vendedor'] > '0') {
        $sql .= " AND v.idVendedor = " . $_POST['vendedor'];
    }

    $sql .= " GROUP BY ve.idVenda ORDER BY dataCadastro DESC ";

    if ($_POST['limitar'] == '1' && $_POST['de'] == '' || $_POST['ate'] == '' || !isset($_POST['periodo']))
        //$sql .= " LIMIT 20 ";
    
    //echo $sql;

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha = mysql_fetch_assoc($Tb)) {

            $json[] = array(
                'idVenda' => $linha['idVenda'],
                'numeroPedido' => $linha['numeroPedido'],
                'dataCadastro' => FormatData($linha['dataCadastro'], true),
                'dataVenda' => FormatData($linha['dataVenda']),
                'cliente' => $linha['cliente'],
                'obras' => getObrasComposicao($ArqT, $linha['idVenda'], 1),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'descricaoStatus' => $linha['descricaoStatus'],
                'loja' => $linha['loja'],
                'marchand' => $linha['marchand'],
                'consignacao' => $linha['consignacao'],
                'qtdePagamentos' => $linha['qtdePagamentos']
            );
        }

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function Gravar() {

    session_start();
    $ArqT = AbreBancoPhotoarts();

    if (isset($_POST['gerar']) && $_POST['gerar'] == 'true') {
        AtualizarStatusOrcamento($ArqT, 3, $_POST['codOrcamento']);
    }

    $sql = "vendas SET dataVenda = '" . DataSSql($_POST['dataCadastro']) . "', 
            idCliente = " . $_POST['idCliente'] . ", " . 
            "idClienteEndereco = " . $_POST['idClienteEndereco'] . ", " . 
            "idLoja = " . $_POST['idLoja'] . ", " .
            "valor = " . ValorE($_POST['valor']) . ", " .
            "percentualDesconto = " . ValorE($_POST['percentualDesconto']) . ", " .
            "valorDesconto = " . ValorE($_POST['valorDesconto']) . ", " .
            "valorAcrescimo = " . ValorE($_POST['valorAcrescimo']) . ", " .
            "valorFrete = " . ValorE($_POST['frete']) . ", " .
            "valorTotal = " . ValorE($_POST['valorTotal']) . ", " .
            "idTipoEntrega = " . $_POST['idTipoEntrega'] . ", " .
            "obs = '" . TextoSSql($ArqT, $_POST['obs']) . "', " .
            "idVendedor = " . $_POST['idMarchand'] . ", " .
            "percentualComissao = " . ValorE($_POST['percentualComissao']) . ", " .
            "valorComissao = " . ValorE($_POST['valorComissao']) . ", " . 
            "consignacao =" . ($_POST['consignacao'] == 'true' ? '1' : '0') . ", " . 
            "consignacaoDias =" . ValorE($_POST['consignacaoDias']) . ", " . 
            "consignacaoDadosCheque ='" . TextoSSql($ArqT, $_POST['consignacaoDados']) . "', " . 
            "dataContrato='" . DataSSql($_POST['dataContrato']) . "', " . 
            "periodoDiasContrato=" . ValorE($_POST['periodoDias']) . ", " . 
            "numeroContrato=" . ValorE($_POST['numeroContrato']) . ", " . 
            "obsContrato='" . TextoSSql($ArqT, $_POST['obsContrato']) . "', " . 
            "devolvido=" . ValorE($_POST['devolvido']) . ", " . 
            "comissaoContrato='" . ValorE($_POST['comissaoContrato']) . "'";

    if ($_POST['codOrcamento'] > 0) {
        $sql .= ", " . ($_POST['orcamentoSimplificado'] == '1' ? 'idOrcamentoSimplificado' : 'idOrcamento') . "=" . $_POST['codOrcamento'] . " ";
    }

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), " .
                "idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] .
                " WHERE idVenda =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUltimoStatus = 1, dataCadastro = NOW(), " .
                "idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", " .
                "dataEntrega = '" . DataSSql($_POST['previsaoEntrega']) . "'";
    }
    
    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) <= 0) {
        Erros($sql);
        echo '0';
    } else {

        if ($_POST['codigo'] > 0) {
            echo $_POST['codigo'];
        } else {
            $idPedido = UltimoRegistroInserido($ArqT);
            GravarStatusPedido($ArqT, $idPedido, 1, 'PEDIDO REALIZADO');
        }

        //GRAVA AS OBRAS
        if ($_POST['idsVendasObras'] != '' && count($_POST['idsVendasObras']) > 0) {

            $arrayObras = array($_POST['idsVendasObras'], $_POST['idsTiposObras'],
                $_POST['idsObras'], $_POST['idsArtistas'], $_POST['idsTamanhos'],
                $_POST['idsAcabamentos'], $_POST['totaisObras'], $_POST['alturas'],
                $_POST['larguras'], $_POST['qtds'], $_POST['percentuaisDescontos'],
                $_POST['valoresDescontos'], $_POST['valoresAcrescimos'], $_POST['valoresUnitarios'],
                $_POST['observacoes'], $_POST['tiragens'], $_POST['qtdsVendidos'], $_POST['estrelas'],
                $_POST['imagens'], $_POST['pesos'], $_POST['idsGruposMolduras'], $_POST['idsMolduras']);

            GravarObras($ArqT, ($_POST['codigo'] > 0 ? $_POST['codigo'] : $idPedido), $arrayObras);
        }
        
        //GRAVA OS PAGAMENTOS
        GravarParcelas($ArqT, ($_POST['codigo'] > 0 ? $_POST['codigo'] : $idPedido));

        if($_POST['codigo'] <= 0){
            GerarOrdemProducaoAutomatica($ArqT, $idPedido, $_POST['idLoja'], $_POST['idsVendasObras'], $arrayObras);
        }
        echo $idPedido;
    }

    mysql_close($ArqT);
}

function GravarObras($ArqT, $idPedido, $arrays) {

    session_start();

    //DELETA TODOS AS OBRAS SALVAS
    $sql = "UPDATE vendas_comp SET del=1, dataDel=Now(), idUsuarioDel =  " . $_SESSION['photoarts_codigo'] . " WHERE idVenda = " . $idPedido;
    mysql_query($sql, $ArqT);
    //=====

    $idVendaObra = explode(',', $arrays[0]);
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

    for ($i = 0; $i < count($idVendaObra); $i++) {

        $sql = " vendas_comp SET idVenda =" . $idPedido . ", " .
                "idTipoProduto =" . $idTipoObra[$i] . ", " .
                "idProduto =" . ($idTipoObra[$i] == '3' ? $idAcabamento[$i] : '0') . ", " .
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
                "tiragemMaxima =" . ($tiragem[$i] == '' ? 0 : $tiragem[$i]) . ", " .
                "qtdVendidoAtual =" . ($qtdVendido[$i] == '' ? 0 : $qtdVendido[$i]) . ", " .
                "estrelasAtual =" . ($estrelas[$i] == '' ? 0 : $estrelas[$i]) . ", " .
                "imagemObra = '" . $imagem[$i] . "', " .
                "pesoObra =" . $peso[$i] . ", " .
                "idMolduraGrupo =" . $idGrupoMoldura[$i] . ", " .
                "idMoldura =" . $idMoldura[$i] . " ";

        if ($idVendaObra[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del=0, dataAtualizacao=Now(), "
                    . "idUsuarioAtualizacao= " . $_SESSION['photoarts_codigo']
                    . " WHERE idVendaComp = " . $idVendaObra[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), "
                    . "idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                    prontaEntrega = " . ($idTipoObra[$i] == '2' ? "0" : "IF(getQtdEstoque(" . $idTipoObra[$i] . "," . ($idTipoObra[$i] == '3' ? $idAcabamento[$i] : '0') . "," . $idObra[$i] . "," . $idTamanho[$i] . "," . $idAcabamento[$i] . "," . $_POST['idLoja'] . ") > 0, 1, 0)") . ", 
                    estoqueOutrasLojas = " . ($idTipoObra[$i] == '2' ? "0" : "IF(getQtdEstoqueLojas(" . $idTipoObra[$i] . "," . ($idTipoObra[$i] == '3' ? $idAcabamento[$i] : '0') . "," . $idObra[$i] . "," . $idTamanho[$i] . "," . $idAcabamento[$i] . "," . $_POST['idLoja'] . ") > 0, 1, 0) ");
        }
        mysql_query($sql, $ArqT);
        if (mysql_affected_rows($ArqT) <= 0) {
            $json = array(
                'status' => 'ERROR_SET_VEN_COMP - ' . $sql
            );
            echo json_encode($json);
            mysql_close($ArqT);
            return;
        } else {
            //   gravaErro($ArqT, $idTipoObra[$i]);
            if ($idTipoObra[$i] == 1) {
                if ($idVendaObra[$i] <= 0) {
                    /*
                    $sql = "UPDATE artistas_obras_tamanhos SET tiragemAtual = tiragemAtual + 1 
                            WHERE idArtistaObraTamanho = '" . $idTamanho[$i] . "'
                            AND idObra = '" . $idObra[$i] . "'
                            AND idArtista = '" . $idArtista[$i] . "' ";*/

                        $sql = "UPDATE artistas_obras_tamanhos SET tiragemAtual = tiragemAtual + $qtd[$i]
                            WHERE idArtistaObraTamanho = '" . $idTamanho[$i] . "'
                            AND idObra = '" . $idObra[$i] . "'
                            AND idArtista = '" . $idArtista[$i] . "'";

                    mysql_query($sql, $ArqT);

                    //     gravaErro($ArqT, $sql);
                    //VERIFICAR SE É PHOTOARTS, SE SIM, DAR UM UPDATE NA TABELA artistas_obras_tamanhos, na coluna tiragemAtual
                    //tiragemAtual=tiragemAtual+1;
                }
            }
        }
    }

    $sql = "SELECT idVendaComp, imagemObra FROM vendas_comp WHERE idVenda = " . $idPedido;
    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysql_num_rows($Tb) > 0){

        while($linha = mysql_fetch_assoc($Tb)){

            $sql = "UPDATE ordem_producao_comp SET 
                    imagem ='" . TextoSSql($ArqT, $linha['imagemObra']) . "'
                    WHERE idVendaComp = " . $linha['idVendaComp'];

            mysql_query($sql, $ArqT);
        }
    }
}

function GravarStatusPedido($ArqT, $idPedido, $idVStatus, $descricaoStatus) {

    session_start();
    $sql = "INSERT INTO vendas_status SET 
            dataCadastro = NOW(), 
            idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
            idVenda = " . $idPedido . ", 
            idVStatus = " . $idVStatus . ", 
            descricaoStatus = '" . $descricaoStatus . "'";
    mysql_query($sql, $ArqT);
}

function GravarParcelas($ArqT, $idPedido) {

    session_start();

    $id = explode(',', $_POST['id']);
    $parcela = explode(',', $_POST['parcela']);
    $valor = explode(',', $_POST['valorParcela']);
    $forma = explode(',', $_POST['forma']);
    $data = explode(',', $_POST['data']);
    $recibo = explode(',', $_POST['recibo']);
    $idValePresenteTroca = explode(',', $_POST['idValePresenteTroca']);

    $sql = "UPDATE vendas_parcelas SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idVenda = " . $idPedido;
    mysql_query($sql, $ArqT);

    for ($i = 0; $i < count($id); $i++) {

        $sql = "vendas_parcelas SET del = 0, idUsuarioDel = 0, dataDel = '0000-00-00 00:00:00',
                idVenda = " . $idPedido . ", 
                parcela = " . $parcela[$i] . ", 
                valor = " . $valor[$i] . ", 
                recibo = '" . TextoSSql($ArqT, $recibo[$i]) . "', 
                dataVencimento = '" . DataSSql($data[$i]) . "', 
                dataCompensacao = '" . DataSSql($data[$i]) . "', 
                idFormaPagamento = " . $forma[$i] . ", 
                idValePresenteTroca = " . $idValePresenteTroca[$i] . "";

        if ($id[$i] <= 0) {
            $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(),
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        } else {
            $sql = "UPDATE " . $sql . " , dataAtualizacao = NOW(),
                    idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . " WHERE idVendaParcela = " . $id[$i];
        }
        
        mysql_query($sql, $ArqT);

        if($idValePresenteTroca[$i] != '0'){

            $sql = "UPDATE vales_presentes_trocas SET 
                    idVenda = " . $idPedido . " 
                    WHERE idValePresenteTroca = " . $idValePresenteTroca[$i];
            mysql_query($sql, $ArqT);
        }
    }
}

function GerarOrdemProducaoAutomatica($ArqT, $idPedido, $idLoja, $idsVendasObras, $arrayObras){

    $sql = "INSERT INTO ordem_producao SET 
            anoProducao = YEAR(CURDATE()), 
            dataOrdemProducao = CURDATE(), 
            dataCadastro = NOW(), 
            idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ",
            idVenda = " . $idPedido . ", 
            idLoja = " . $idLoja . ", 
            dataPrevista = ADDDATE(NOW(), INTERVAL 7 DAY)";

    mysql_query($sql, $ArqT);

    if(mysql_affected_rows($ArqT) <= 0){
        echo 'ERRO_GERAR_ORDEM_PRODUCAO';
    }else{

        $idOrdemProducao = UltimoRegistroInserido($ArqT);

        //GRAVA AS OBRAS
        if ($idsVendasObras != '' && count($idsVendasObras) > 0) {

            $idVendaObra = explode(',', $arrayObras[0]);
            $idTipoObra = explode(',', $arrayObras[1]);
            $idObra = explode(',', $arrayObras[2]);
            $idArtista = explode(',', $arrayObras[3]);
            $idTamanho = explode(',', $arrayObras[4]);
            $idAcabamento = explode(',', $arrayObras[5]);
            $altura = explode(',', $arrayObras[7]);
            $largura = explode(',', $arrayObras[8]);
            $qtd = explode(',', $arrayObras[9]);
            $imagem = explode(',', $arrayObras[18]);
            $idGrupoMoldura = explode(',', $arrayObras[20]);
            $idMoldura = explode(',', $arrayObras[21]);

            for ($i = 0; $i < count($idVendaObra); $i++) {

                $sql = "INSERT INTO ordem_producao_comp SET 
                    idOrdemProducao = " . $idOrdemProducao . ", 
                    idOPEtapa = 1, 
                    idTipoProduto = " . $idTipoObra[$i] . ", 
                    idObra = " . $idObra[$i] . ", 
                    idProduto = " . ($idTipoObra[$i] == '3' ? $idAcabamento[$i] : '0') . ", 
                    idAcabamento = " . $idAcabamento[$i] . ", 
                    idTamanho = " . $idTamanho[$i] . ", 
                    altura = '" . $altura[$i] . "', 
                    largura = '" . $largura[$i] . "', 
                    idArtista = " . $idArtista[$i] . ", 
                    qtd = " . $qtd[$i] . ", 
                    idGrupo = " . $idGrupoMoldura[$i] .  ", 
                    idMoldura = " . $idMoldura[$i] . ", 
                    imagem = '" . TextoSSql($ArqT, $imagem[$i]) . "', 
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                    dataCadastro = NOW(), 
                    obs = ''";

                mysql_query($sql, $ArqT);

                if (mysql_affected_rows($ArqT) <= 0) {
                    echo 'ERRO_GRAVAR_COMP_ORDEM_PRODUCAO';
                } else {

                    $idOrdemProducaoComp = UltimoRegistroInserido($ArqT);

                    $sql = "INSERT INTO ordem_producao_etapas SET 
                            ativo = 1, 
                            dataCadastro = NOW(), 
                            idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                            idEtapa = 1, 
                            NomeEtapa = 'Recebimento e impressão do pedido.', 
                            idOrdemProducaoComp = " . UltimoRegistroInserido($ArqT);
                    mysql_query($sql, $ArqT);
                }

                $sql = "SELECT idVendaComp FROM vendas_comp WHERE idVenda = " . $idPedido;
                $Tb = ConsultaSQL($sql, $ArqT);

                $sql = "UPDATE ordem_producao_comp SET idVendaComp = " . mysql_result($Tb, $i, "idVendaComp") . " 
                                WHERE idOrdemProducaoComp = " . $idOrdemProducaoComp;
                mysql_query($sql, $ArqT);
            }

        }
    }
}

function Mostrar() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT v.*, vs.status, vv.dataCadastro AS dataStatus, c.responsavel, c.telefone, c.celular, c.email,
            CURDATE() AS dataAtual, c.*, t.tipoTransporte, v.dataCadastro AS dataCadastroV, v.obs AS obsV,
            IFNULL((SELECT idOrdemProducao FROM ordem_producao WHERE idVenda = v.idVenda LIMIT 1),0) AS idOrdemProducao,
            l.loja, l.cidade AS cidadeLoja, IFNULL(ce.cep, '') AS cliente_cep, IFNULL(ce.endereco, '') AS cliente_endereco, 
            IFNULL(ce.numero, '') AS cliente_numero, IFNULL(ce.complemento, '') AS cliente_complemento, 
            IFNULL(ce.bairro, '') AS cliente_bairro, IFNULL(ce.cidade, '') AS cliente_cidade, 
            IFNULL(ce.estado, '') AS cliente_estado, ve.vendedor, 
            (SELECT idTipoProduto FROM vendas_comp WHERE idVenda = " . $_POST['codigo'] . " AND del = 0 LIMIT 1) AS idTipoProduto, 
            c.arquiteto, v.dataContrato, v.periodoDiasContrato, v.numeroContrato, 
            v.obsContrato, v.devolvido, v.comissaoContrato
            FROM vendas AS v 
            INNER JOIN v_status AS vs ON vs.idVStatus = v.idUltimoStatus 
            LEFT JOIN vendas_status AS vv ON vv.idVenda=v.idVenda AND v.idUltimoStatus=vv.idVStatus
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente             
            LEFT JOIN transportes_tipos AS t ON t.idTransporteTipo=v.idTipoEntrega
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja 
            LEFT JOIN clientes_enderecos AS ce ON ce.idClienteEndereco = v.idClienteEndereco 
            INNER JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor 
            WHERE v.idVenda = " . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha = mysql_fetch_assoc($Tb);

    $json = array(
        'idVenda' => $linha['idVenda'],
        'idOrdemProducao' => $linha['idOrdemProducao'],
        'idOrcamento' => number_format_complete($linha['idOrcamento'], '0', 5),
        'codPedido' => number_format_complete($linha['idVenda'], '0', 5),
        'dataCadastro' => FormatData($linha['dataVenda'], false),
        'dataEntrega' => FormatData($linha['dataEntrega'], false),
        'status' => $linha['status'] . ' em ' . substr(FormatData($linha['dataStatus']), 0, 16),
        'idStatus' => $linha['idUltimoStatus'],
        'idLoja' => $linha['idLoja'],
        'idCliente' => $linha['idCliente'],
        'contato' => $linha['responsavel'],
        'telefone' => $linha['telefone'] . " / " . $linha['celular'],
        'email' => $linha['email'],
        'valor' => FormatMoeda($linha['valor']),
        'percentualDesconto' => FormatMoeda($linha['percentualDesconto']),
        'valorDesconto' => FormatMoeda($linha['valorDesconto']),
        'valorAcrescimo' => FormatMoeda($linha['valorAcrescimo']),
        'valorFrete' => FormatMoeda($linha['valorFrete']),
        'valorTotal' => FormatMoeda($linha['valorTotal']),
        'idTipoEntrega' => $linha['idTipoEntrega'],
        'obs' => $linha['obsV'],
        'consignacao' => $linha['consignacao'],
        'consignacaoDias' => $linha['consignacaoDias'],
        'consignacaoDados' => $linha['consignacaoDadosCheque'],
        'idVendedor' => $linha['idVendedor'],
        'percentualComissao' => FormatMoeda($linha['percentualComissao']),
        'valorComissao' => FormatMoeda($linha['valorComissao']),
        'arrayObras' => MostrarObras($ArqT, $linha['idVenda']),
        'arrayObrasProducao' => MostrarObrasOpcoes($ArqT, $linha['idVenda']),
        'arrayParcelas' => MostrarParcelas($ArqT, $linha['idVenda']),
        //dados do cliente
        'entrega' => '<b>Previsão entrega:</b> <label>' . FormatData($linha['dataEntrega'], false) . '</label>',
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
        'loja' => $linha['loja'],
        'idTipoProduto' => $linha['idTipoProduto'],
        'idClienteEndereco' => $linha['idClienteEndereco'],
        'vendedor' => $linha['vendedor'],
        'cidadeLoja' => $linha['cidadeLoja'], 
        'arquiteto' => $linha['arquiteto'], 
        'dataContrato' => FormatData($linha['dataContrato'],false), 
        'periodoDiasContrato' => $linha['periodoDiasContrato'],
        'numeroContrato' => $linha['numeroContrato'], 
        'obsContrato' => $linha['obsContrato'], 
        'devolvido' => $linha['devolvido'], 
        'comissaoContrato' => FormatMoeda($linha['comissaoContrato'])
    );

    echo json_encode($json);
    mysql_close($ArqT);
}

function MostrarObras($ArqT, $idVenda) {
    /*
    $sql = "SELECT oc.*, IFNULL(ao.nomeObra, '- - -') AS nomeObra, IFNULL(a.artista, '- - -') AS artista, 
            IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho,
            tp.produto AS nomeTipo, IFNULL(tp.pasta, '') AS pasta, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, p.nomeProduto,
            (IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idProduto = oc.idProduto AND del = 0 AND oc.idProduto > 0 AND tipoMovimento = 'E'), 0) - 
            IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idProduto = oc.idProduto AND del = 0 AND oc.idProduto > 0 AND tipoMovimento = 'S'), 0)) AS estoqueProduto,
            (IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idObra = oc.idObra AND idArtista = oc.idArtista AND idAcabamento = oc.idAcabamento 
            AND idTamanho = oc.idTamanho AND m.idMoldura = oc.idMoldura AND altura = oc.altura AND largura = oc.largura AND del = 0 AND oc.idObra > 0 AND tipoMovimento = 'E'), 0) - 
	        IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idObra = oc.idObra AND idArtista = oc.idArtista AND idAcabamento = oc.idAcabamento 
            AND idTamanho = oc.idTamanho AND m.idMoldura = oc.idMoldura AND altura = oc.altura AND largura = oc.largura AND del = 0 AND oc.idObra > 0 AND tipoMovimento = 'S'), 0)
            ) AS estoqueObra,
            IFNULL(SELECT SUM(tiragemAtual) 
                FROM artistas_obras_tamanhos 
                WHERE idObra=oc.idObra AND del=0),0)AS qtdTotalVendida, 
            IFNULL((SELECT idOrdemProducaoComp FROM ordem_producao_comp WHERE idVendaComp = oc.idVendaComp LIMIT 1),0) AS idCompProd, 
            IFNULL(m.moldura, '') AS moldura, oc.prontaEntrega, oc.estoqueOutrasLojas  
            FROM vendas_comp AS oc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=oc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = oc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = oc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = oc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura 
            WHERE oc.idVenda = " . $idVenda . " AND oc.del = 0";

            */



    $sql="SELECT oc.*, IFNULL(ao.nomeObra, '- - -') AS nomeObra, IFNULL(a.artista, '- - -') AS artista, 
        IFNULL((SELECT SUM(tiragemAtual) FROM artistas_obras_tamanhos  WHERE idArtistaObraTamanho=oc.idTamanho AND del=0),0)AS qtdTotalVendida, 
            IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho,
            tp.produto AS nomeTipo, IFNULL(tp.pasta, '') AS pasta, IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, p.nomeProduto,
            (IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idProduto = oc.idProduto AND del = 0 AND oc.idProduto > 0 AND tipoMovimento = 'E'), 0) - 
            IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idProduto = oc.idProduto AND del = 0 AND oc.idProduto > 0 AND tipoMovimento = 'S'), 0)) AS estoqueProduto,
            (IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idObra = oc.idObra AND idArtista = oc.idArtista AND idAcabamento = oc.idAcabamento 
            AND idTamanho = oc.idTamanho AND m.idMoldura = oc.idMoldura AND altura = oc.altura AND largura = oc.largura AND del = 0 AND oc.idObra > 0 AND tipoMovimento = 'E'), 0) - 
            IFNULL((SELECT SUM(qtd) FROM estoque_produtos WHERE idObra = oc.idObra AND idArtista = oc.idArtista AND idAcabamento = oc.idAcabamento 
            AND idTamanho = oc.idTamanho AND m.idMoldura = oc.idMoldura AND altura = oc.altura AND largura = oc.largura AND del = 0 AND oc.idObra > 0 AND tipoMovimento = 'S'), 0)
            ) AS estoqueObra,
            
            IFNULL((SELECT idOrdemProducaoComp FROM ordem_producao_comp WHERE idVendaComp = oc.idVendaComp LIMIT 1),0) AS idCompProd, 
            IFNULL(m.moldura, '') AS moldura, oc.prontaEntrega, oc.estoqueOutrasLojas  
            FROM vendas_comp AS oc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=oc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = oc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = oc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = oc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura
            WHERE oc.idVenda = " . $idVenda . " AND oc.del = 0";
    $Tb = mysql_query($sql, $ArqT);
    
    if (mysql_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha = mysql_fetch_assoc($Tb)) {

            if($linha['prontaEntrega'] == '1'){

                $obs = 'PE';
            }else{

                $obs = 'OP';

                if($linha['estoqueOutrasLojas'] == '1'){

                    $obs .= ' ou EOL';                    
                }
            }
            if($linha['obs'] == $obs){
                $obs = $linha['obs'];
            }else{

                if($linha['obs'] != ''){
                    $obs .= ' ' . $linha['obs'];
                }
            } 
            $json[] = array(
                'idVendaComp' => $linha['idVendaComp'],
                'idTipoProduto' => $linha['idTipoProduto'],
                'idCompProd' => $linha['idCompProd'],
                'idProduto' => $linha['idProduto'],
                'nomeProduto' => $linha['nomeProduto'],
                'idTipo' => $linha['idTipoProduto'],
                'pasta' => $linha['pasta'], 
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
                'obs' => $obs,
                'tiragem' => $linha['tiragemMaxima'],
                'qtdVendido' => $linha['qtdTotalVendida'],
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
                'estoqueProduto' => $linha['estoqueProduto'],
                'estoqueObra' => $linha['estoqueObra'],
                'moldura' => $linha['moldura']
            );
        }

        return json_encode($json);
    }
}

function MostrarObrasOpcoes($ArqT, $idVenda){

    /*$sql = "SELECT vc.idVendaComp, vc.idTipoProduto, vc.idObra, vc.idArtista, vc.idAcabamento, vc.idTamanho, 
            vc.idMolduraGrupo, vc.idMoldura, vc.altura, vc.largura, vc.valor, vc.qtd, vc.percentualDesconto, 
            vc.valorDesconto, vc.valorAcrescimo, vc.valorTotal, vc.tiragemMaxima, vc.qtdVendidoAtual, vc.obs, 
            vc.estrelasAtual, vc.imagemObra, vc.pesoObra, IFNULL(ao.nomeObra, '- - -') AS nomeObra, 
            IFNULL(a.artista, '- - -') AS artista, IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, 
            IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, tp.produto AS nomeTipo, IFNULL(tp.pasta, '') AS pasta, 
            IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, IFNULL(p.nomeProduto, '') AS nomeProduto, 
            IFNULL(m.moldura, '') AS moldura, IFNULL(opc.idOrdemProducaoComp, 0) AS idOrdemProducaoComp, 
            getQtdEstoque(1,0,vc.idObra,vc.idTamanho,vc.idAcabamento,v.idLoja) AS qtdEstoque, 
            getQtdEstoqueLojas(1,0,vc.idObra,vc.idTamanho,vc.idAcabamento, v.idLoja) AS qtdEstoqueLojas, 
            IFNULL(ep.idVendaComp, 0) AS idVendaCompEstoque, 0 AS refeita, opc.idOrdemProducao
            FROM vendas_comp AS vc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=vc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=vc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = vc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = vc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = vc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = vc.idMoldura 
            INNER JOIN vendas AS v ON v.idVenda = vc.idVenda
            LEFT JOIN ordem_producao_comp AS opc ON opc.idVendaComp = vc.idVendaComp
            LEFT JOIN ordem_producao AS op ON op.idOrdemProducao = opc.idOrdemProducao
            LEFT JOIN estoque_produtos AS ep ON ep.idVendaComp = vc.idVendaComp 
            WHERE vc.idVenda = " . $idVenda . " AND vc.del = 0 AND op.cancelada = 0 
            GROUP BY vc.idVendaComp
            UNION
            SELECT opc.idVendaComp, opc.idTipoProduto, opc.idObra, opc.idArtista, opc.idAcabamento, opc.idTamanho, 
            vc.idMolduraGrupo, opc.idMoldura, opc.altura, opc.largura, vc.valor, opc.qtd, vc.percentualDesconto, 
            vc.valorDesconto, vc.valorAcrescimo, vc.valorTotal, vc.tiragemMaxima, vc.qtdVendidoAtual, opc.obs, 
            vc.estrelasAtual, vc.imagemObra, vc.pesoObra, IFNULL(ao.nomeObra, '- - -') AS nomeObra, 
            IFNULL(a.artista, '- - -') AS artista, IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, 
            IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, tp.produto AS nomeTipo, IFNULL(tp.pasta, '') AS pasta, 
            IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, IFNULL(p.nomeProduto, '') AS nomeProduto, 
            IFNULL(m.moldura, '') AS moldura, IFNULL(opc.idOrdemProducaoComp, 0) AS idOrdemProducaoComp, 
            getQtdEstoque(1,0,vc.idObra,vc.idTamanho,vc.idAcabamento,v.idLoja) AS qtdEstoque, 
            getQtdEstoqueLojas(1,0,vc.idObra,vc.idTamanho,vc.idAcabamento, v.idLoja) AS qtdEstoqueLojas, 
            IFNULL(ep.idVendaComp, 0) AS idVendaCompEstoque, 1 AS refeita, op.idOrdemProducao
            FROM ordem_producao_comp AS opc 
            INNER JOIN ordem_producao AS op ON op.idOrdemProducao=opc.idOrdemProducao AND op.cancelada=0
            INNER JOIN vendas_comp AS vc ON opc.idVendaComp = vc.idVendaComp
            INNER JOIN vendas AS v ON v.idVenda = vc.idVenda
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=opc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=opc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = opc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = opc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = opc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = opc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = opc.idMoldura 
            LEFT JOIN estoque_produtos AS ep ON ep.idVendaComp = vc.idVendaComp
            WHERE vc.idVenda = " . $idVenda . " AND vc.del = 0 AND op.cancelada=0 AND op.refeita = 1 
            GROUP BY vc.idVendaComp";*/

    $sql = "SELECT opc.idVendaComp, opc.idTipoProduto, opc.idObra, opc.idArtista, opc.idAcabamento, opc.idTamanho, 
            vc.idMolduraGrupo, opc.idMoldura, opc.altura, opc.largura, vc.valor, opc.qtd, vc.percentualDesconto, 
            vc.valorDesconto, vc.valorAcrescimo, vc.valorTotal, vc.tiragemMaxima, vc.qtdVendidoAtual, opc.obs, 
            vc.estrelasAtual, vc.imagemObra, vc.pesoObra, IFNULL(ao.nomeObra, '- - -') AS nomeObra, 
            IFNULL(a.artista, '- - -') AS artista, IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, 
            IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, tp.produto AS nomeTipo, IFNULL(tp.pasta, '') AS pasta, 
            IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, IFNULL(p.nomeProduto, '') AS nomeProduto, 
            IFNULL(m.moldura, '') AS moldura, IFNULL(opc.idOrdemProducaoComp, 0) AS idOrdemProducaoComp, 
            getQtdEstoque(1,0,vc.idObra,vc.idTamanho,vc.idAcabamento,v.idLoja) AS qtdEstoque, 
            getQtdEstoqueLojas(1,0,vc.idObra,vc.idTamanho,vc.idAcabamento, v.idLoja) AS qtdEstoqueLojas, 
            IFNULL(ep.idVendaComp, 0) AS idVendaCompEstoque, op.refeita, op.idOrdemProducao
            FROM ordem_producao_comp AS opc 
            INNER JOIN ordem_producao AS op ON op.idOrdemProducao=opc.idOrdemProducao AND op.cancelada=0
            INNER JOIN vendas_comp AS vc ON opc.idVendaComp = vc.idVendaComp
            INNER JOIN vendas AS v ON v.idVenda = vc.idVenda
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=opc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=opc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = opc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = opc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = opc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = opc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = opc.idMoldura 
            LEFT JOIN estoque_produtos AS ep ON ep.idVendaComp = vc.idVendaComp
            WHERE vc.idVenda = " . $idVenda . " AND vc.del = 0 AND op.cancelada=0 
            GROUP BY vc.idVendaComp";

    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysql_num_rows($Tb) <= 0){
        return '0';
    }else{

        while($linha = mysql_fetch_assoc($Tb)){

            $json[] = array(
                'idVendaComp' => $linha['idVendaComp'],
                'idTipoProduto' => $linha['idTipoProduto'],
                //'idCompProd' => $linha['idCompProd'],
                'idProduto' => $linha['idProduto'],
                'nomeProduto' => $linha['nomeProduto'],
                'idTipo' => $linha['idTipoProduto'],
                'pasta' => $linha['pasta'], 
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
                'qtdEstoque' => intval($linha['qtdEstoque']),
                'qtdEstoqueLojas' => intval($linha['qtdEstoqueLojas']),
                'idOrdemProducaoComp' => $linha['idOrdemProducaoComp'],
                'arrayOutrasLojas' => MostrarOutrasLojas($ArqT, $linha['idObra'], $linha['idTamanho'], $linha['idAcabamento']),
                'idVendaCompEstoque' => $linha['idVendaCompEstoque'],
                'refeita' => $linha['refeita'],
                'idOrdemProducao' => $linha['idOrdemProducao']
            );
        }

        return json_encode($json);
    }
}

function MostrarParcelas($ArqT, $idVenda) {

    $sql = "SELECT v.dataCadastro, 
            v.idVendaParcela AS codigo, v.parcela, v.valor, v.dataCompensacao AS 'data', 
            v.idFormaPagamento AS idForma, v.recibo, 
            f.formaPagamento AS forma, v.idValePresenteTroca, IFNULL(vpt.codigo, '') AS codigoVale
            FROM vendas_parcelas AS v         
            INNER JOIN formaspagamentos AS f ON f.idFormaPagamento = v.idFormaPagamento
            LEFT JOIN vales_presentes_trocas AS vpt ON vpt.idValePresenteTroca = v.idValePresenteTroca
            WHERE v.del = 0 AND v.idVenda = " . $idVenda;

    $Tb = mysql_query($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha = mysql_fetch_assoc($Tb)) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'parcela' => $linha['parcela'],
                'valor' => FormatMoeda($linha['valor']),
                'data' => FormatData($linha['data'], false),
                'cadastro' => FormatData($linha['dataCadastro'], false),
                'idForma' => $linha['idForma'],
                'forma' => $linha['forma'],
                'recibo' => $linha['recibo'],
                'codigoVale' => $linha['codigoVale'],
                'idValePresenteTroca' => $linha['idValePresenteTroca']
            );
        }

        return json_encode($json);
    }
}

function getObras() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT nomeObra, idArtistaObra FROM artistas_obras where idArtista=" . $_POST['idArtista'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo 0;
        return;
    }

    while ($linha = mysql_fetch_assoc($Tb)) {

        $json[] = array(
            'obra' => $linha['nomeObra'],
            'codigo' => $linha['idArtistaObra']
        );
    }

    echo json_encode($json);

    mysql_close($ArqT);
}

function getTamanhosObras() {

    $ArqT = AbreBancoPhotoarts();

    $sql = " SELECT CONCAT(t.nomeTamanho, ' (', TRUNCATE(t.altura, 0), 'x', TRUNCATE(t.largura, 0), ')') AS tamanho, 
            aot.idArtistaObraTamanho AS codigo
                FROM artistas_obras_tamanhos AS aot
                LEFT JOIN tamanhos AS t ON aot.idTamanho = t.idTamanho 
                WHERE aot.idObra = " . $_POST['idObra'] . " 
                ORDER BY t.idTamanho";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo 0;
        return;
    }

    while ($linha = mysql_fetch_assoc($Tb)) {

        $json[] = array(
            'tamanho' => $linha['tamanho'],
            'codigo' => $linha['codigo']
        );
    }

    echo json_encode($json);
    mysql_close($ArqT);
}

function getDadosTamanho() {

    $ArqT = AbreBancoPhotoarts();

    if ($_POST['item'] == 'p') {

        $sql = "  SELECT altura, largura, tiragemMaxima, tiragemAtual "
                . "FROM  artistas_obras_tamanhos WHERE idArtistaObraTamanho = " . $_POST['idArtistaObraTamanho'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysql_num_rows($Tb) <= 0) {
            echo 0;
            return;
        }

        $json = mysql_fetch_assoc($Tb);
        $json['altura'] = FormatMoeda($json['altura']);
        $json['largura'] = FormatMoeda($json['largura']);
    }

    if ($_POST['item'] == 'i') {

        $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idTamanho'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysql_num_rows($Tb) <= 0) {
            echo 0;
            return;
        }

        $json = mysql_fetch_assoc($Tb);
        $json['altura'] = FormatMoeda($json['altura']);
        $json['largura'] = FormatMoeda($json['largura']);
    }

    echo json_encode($json);
    mysql_close($ArqT);
}

function CalculaPrevisaoEntrega() {

    $dataAtual = DataSSql($_POST['dataAtual'], false);

    $qtdDias = 10;

    $dataPrevisao = add_date($dataAtual, $qtdDias, 0, 0);

    /* $dataAtual = DataSSql($_POST['dataAtual'], false);
      $dataPrevisao = date("Y-m-d", strtotime("+ 7 days", strtotime($dataAtual)));

      //Verifica se o dia da previsão é um dia util
      $ArqT = AbreBancoPhotoarts();
      $sql = "SELECT DATE_FORMAT('" . $dataPrevisao . "', '%w') AS codigoDia";
      $Tb = ConsultaSQL($sql, $ArqT);
      $codigoDia = mysql_result($Tb, '0', "codigoDia");

      //0 é domingo - soma 1 dia | 6 é sábado - soma dois dias
      if ($codigoDia === '0') {
      $dataPrevisao = date("Y-m-d", strtotime("+ 1 days", strtotime($dataPrevisao)));
      } else if ($codigoDia === '6') {
      $dataPrevisao = date("Y-m-d", strtotime("+ 2 days", strtotime($dataPrevisao)));
      } */

    echo FormatData($dataPrevisao, false);
}

function ExcluirObra() {

    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas_comp SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
             WHERE idVenda = " . $_POST['idPedido'] . " AND idObra = " . $_POST['idObra'];
    mysql_query($sql, $ArqT);


    $sql = "UPDATE ordem_producao_comp SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
             WHERE idVendaComp = " . $_POST['idObra'];
    mysql_query($sql, $ArqT);


    $sql= "SELECT (tiragemAtual - " . $_POST['numeroObras'] . ") AS tiragem FROM artistas_obras_tamanhos  WHERE  idArtistaObraTamanho = '" .$_POST['idTamanho']."'";
            $Tb = ConsultaSQL($sql, $ArqT);
            $num=  mysql_result($Tb, 0, 'tiragem');

    $sql = " UPDATE artistas_obras_tamanhos SET tiragemAtual='" . $num . "', dataAtualizacao= NOW(), 
            idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . " WHERE  idArtistaObraTamanho = '" .$_POST['idTamanho']."'";
            mysql_query($sql, $ArqT);
        


    }    

function getPercentualComissaoMarchand() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT comissao FROM vendedores WHERE idVendedor = " . $_POST['idMarchand'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {
        echo FormatMoeda(mysql_result($Tb, 0, "comissao"));
    }

    mysql_close($ArqT);
}

function getObra() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT vc.*, a.idArtista FROM vendas_comp AS vc 
            INNER JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
            INNER JOIN artistas AS a ON a.idArtista = ao.idArtista 
            WHERE vc.idVenda = " . $_POST['idPedido'] . " AND vc.idObra = " . $_POST['idObra'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        $linha = mysql_fetch_assoc($Tb);

        $json = array(
            'idArtista' => $linha['idArtista'],
            'idTipoProduto' => $linha['idTipoProduto'],
            'idObra' => $linha['idObra'],
            'idAcabamento' => $linha['idAcabamento'],
            'idTamanho' => $linha['idTamanho'],
            'altura' => FormatMoeda($linha['altura']),
            'largura' => FormatMoeda($linha['largura']),
            'valor' => FormatMoeda($linha['valor']),
            'qtde' => $linha['qtde'],
            'percentualDesconto' => FormatMoeda($linha['percentualDesconto']),
            'valorDesconto' => FormatMoeda($linha['valorDesconto']),
            'valorAcrescimo' => FormatMoeda($linha['valorAcrescimo']),
            'valorTotal' => FormatMoeda($linha['valorTotal']),
            'obs' => $linha['obs']
        );

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function EditarObra() {

    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas_comp SET 
            idTipoProduto = " . $_POST['idTipoProduto'] . ", 
            idObra = " . $_POST['idObra'] . ", 
            idAcabamento = " . $_POST['idAcabamento'] . ", 
            idTamanho = " . $_POST['idTamanho'] . ", 
            altura = " . ValorE($_POST['altura']) . ", 
            largura = " . ValorE($_POST['largura']) . ", 
            valor = " . ValorE($_POST['valor']) . ", 
            qtde = " . $_POST['qtde'] . ", 
            percentualDesconto = " . ValorE($_POST['percentualDesconto']) . ", 
            valorDesconto = " . ValorE($_POST['valorDesconto']) . ", 
            valorAcrescimo = " . ValorE($_POST['valorAcrescimo']) . ", 
            valorTotal = " . ValorE($_POST['valorTotal']) . ", 
            obs = '" . TextoSSql($ArqT, $_POST['obs']) . "', dataAtualizacao = NOW(), idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . " 
             WHERE idVenda = " . $_POST['idPedido'] . " AND idObra = " . $_POST['idObra'];

    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    mysql_close($ArqT);
}

function getStatusPedido() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT idUltimoStatus + 1 AS idUltimoStatus FROM vendas WHERE idVenda = " . $_POST['idPedido'];
    $Tb = ConsultaSQL($sql, $ArqT);
    $idUltimoStatus = mysql_result($Tb, 0, "idUltimoStatus");

    $sql = "SELECT idVStatus, status FROM v_status ORDER BY ordem";
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha = mysql_fetch_assoc($Tb)) {

            $json[] = array(
                'idVStatus' => $linha['idVStatus'],
                'status' => $linha['status'],
                'idUltimoStatus' => $idUltimoStatus
            );
        }

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function MostraHistoricoStatusPedido() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT vs.idVendaStatus, vs.dataCadastro, vs.descricaoStatus, f.funcionario AS responsavel 
            FROM vendas_status AS vs
            INNER JOIN v_status AS vv ON vv.idVStatus=vs.idVStatus
            INNER JOIN funcionarios AS f ON f.idFuncionario = vs.idUsuarioCadastro
            WHERE vs.idVenda = " . $_POST['idPedido'] . "
            ORDER BY vv.ordem DESC";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha = mysql_fetch_assoc($Tb)) {

            $json[] = array(
                'idVendaStatus' => $linha['idVendaStatus'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'descricaoStatus' => strtoupper($linha['descricaoStatus']),
                'responsavel' => $linha['responsavel']
            );
        }

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function AlterarStatusPedido() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas SET idUltimoStatus = " . $_POST['idStatus'] . " WHERE idVenda = " . $_POST['idPedido'];
    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) > 0) {

        GravarStatusPedido($ArqT, $_POST['idPedido'], $_POST['idStatus'], $_POST['descricaoStatus']);

        AvisoPesquisa($_POST['idPedido']);
        echo '1';
    } else {
        echo '0';
    }

    mysql_close($ArqT);
}

function ExcluirParcela() {
    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas_parcelas SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
             WHERE idVendaParcela = " . $_POST['idParcela'];
    mysql_query($sql, $ArqT);
}

/* function GravarPagamentoParcela() {

  session_start();
  $ArqT = AbreBancoPhotoarts();

  $sql = "UPDATE vendas_parcelas
  SET valorPago = " . ValorE($_POST['valorParcela']) . ",
  dataPagamento = '" . DataSSql($_POST['dataPagamento'], false) . "',
  idFormaPagamento = " . $_POST['idFormaPagamento'] . ",
  dataAtualizacao = NOW(),
  idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . "
  WHERE idVendaParcela = " . $_POST['idParcela'] . " AND idVenda = " . $_POST['idPedido'];

  mysql_query($sql, $ArqT);

  if (mysql_affected_rows($ArqT) > 0) {
  echo '1';
  } else {
  echo '0';
  }

  mysql_close($ArqT);
  } */

/* function PesquisarPedidos() {

  $ArqT = AbreBancoPhotoarts();

  $sql = "SELECT v.idVenda, v.dataVenda, v.dataEntrega, cc.centrocusto AS loja, c.apelido, ve.vendedor AS marchand FROM vendas AS v
  INNER JOIN centro_custos AS cc ON cc.idCentroCusto = v.idLoja
  INNER JOIN clientes AS c ON c.idCliente = v.idCliente
  INNER JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor
  WHERE TRUE";

  if ($_POST['dataCadastro'] !== '') {

  $sql .= " AND v.dataCadastro = '" . DataSSql($_POST['dataCadastro'], false) . "'";
  }

  if ($_POST['loja'] !== '0') {

  $sql .= " AND v.idLoja = " . $_POST['loja'];
  }

  if ($_POST['marchand'] !== '0') {

  $sql .= " AND v.idVendedor = " . $_POST[' idVendedor'];
  }

  if ($_POST['previsaoEntrega'] !== '') {

  $sql .= " AND v.dataEntrega = '" . DataSSql($_POST['previsaoEntrega'], false) . "'";
  }

  if ($_POST['cliente'] !== '0') {

  $sql .= " AND v.idCliente = " . $_POST['idCliente'];
  }

  $sql .= " ORDER BY v.dataVenda";

  $Tb = ConsultaSQL($sql, $ArqT);

  if (mysql_num_rows($Tb) <= 0) {
  echo '0';
  } else {

  while ($linha = mysql_fetch_assoc($Tb)) {

  $json[] = array(
  'idVenda' => $linha['idVenda'],
  'dataVenda' => FormatData($linha['dataVenda'], false),
  'dataEntrega' => FormatData($linha['dataEntrega'], false),
  'loja' => $linha['loja'],
  'apelido' => $linha['apelido'],
  'marchand' => $linha['marchand']
  );
  }

  echo json_encode($json);
  }

  mysql_close($ArqT);
  } */

function MostraFollowUp() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT vc.idVendaContato AS codigo, vc.dataCadastro AS data, t.tipoContato AS tipo, 
            IFNULL(f.funcionario, '') AS funcionario, vc.obs, vc.dataRetorno
            FROM vendas_contatos AS vc
            LEFT JOIN contatostipos AS t ON t.idContatoTipo = vc.idContatoTipo
            LEFT JOIN funcionarios AS f ON f.idFuncionario = vc.idUsuarioCadastro
            WHERE vc.del = 0 AND vc.idVenda =  " . $_POST['codigo'];

    $sql .= " ORDER BY vc.dataCadastro DESC";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    while ($linha = mysql_fetch_assoc($Tb)) {

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
    mysql_close($ArqT);
}

function GravarFollowUp() {

    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "vendas_contatos SET idVenda = " . $_POST['idPedido'] . ",
            idContatoTipo = " . $_POST['tipo'] . ", 
            obs = UCASE('" . TextoSSql($ArqT, $_POST['obs']) . "'), 
            dataAtualizacao = NOW(),
            idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'];

    $data = $_POST['retorno'] . " " . $_POST['horaretorno'] . ":00";

    if ($_POST['checkretorno'] == true) {
        $sql .= ", dataRetorno = '" . DataSSql($data, true) . "'";
    } else {
        $sql .= ", dataRetorno = '0000-00-00 00:00:00' ";
    }

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idVendaContato =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    }

    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

    mysql_close($ArqT);
}

function getFollowUp() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT idContatoTipo AS tipo, obs, DATE(dataRetorno) AS retorno, 
            LEFT(TIME(dataRetorno),5) AS horaretorno FROM vendas_contatos WHERE idVendaContato =" . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha = mysql_fetch_assoc($Tb);

    $json = array(
        'horaretorno' => $linha['horaretorno'],
        'retorno' => FormatData($linha['retorno'], false),
        'tipo' => $linha['tipo'],
        'obs' => $linha['obs']
    );

    echo json_encode($json);
    mysql_close($ArqT);
}

function ExcluirFollowUP() {

    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas_contatos SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
             WHERE idVendaContato = " . $_POST['codigo'];

    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

    mysql_close($ArqT);
}

/* function getParcela() {

  $ArqT = AbreBancoPhotoarts();

  $sql = "SELECT valorPago, dataPagamento, idFormaPagamento FROM vendas_parcelas WHERE idVendaParcela = " . $_POST['idParcela'];
  $Tb = ConsultaSQL($sql, $ArqT);

  if (mysql_num_rows($Tb) <= 0) {
  echo '0';
  } else {

  $linha = mysql_fetch_assoc($Tb);

  $json = array(
  'valorPago' => FormatMoeda($linha['valorPago']),
  'dataPagamento' => FormatData($linha['dataPagamento'], false),
  'idFormaPagamento' => $linha['idFormaPagamento']
  );

  echo json_encode($json);
  }

  mysql_close($ArqT);
  } */

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

function getIdPedido() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT idVenda FROM vendas WHERE idOrcamento = " . $_POST['idOrcamento'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {
        $linha = mysql_fetch_assoc($Tb);

        echo $linha['idVenda'];
    }

    mysql_close($ArqT);
}

function CancelarPedido() {

    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas SET idUltimoStatus = 7 WHERE idVenda = " . $_POST['idPedido'];
    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) > 0) {
        //INSERE NO HISTÓRICO
        GravarStatusPedido($ArqT, $_POST['idPedido'], '7', 'Pedido cancelado');

        echo '1';
    } else {
        echo '0';
    }

    mysql_close($ArqT);
}

function EditarPagamento() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas_parcelas SET 
            valor = " . ValorE($_POST['valorPago']) . ", 
            dataVencimento = '" . DataSSql($_POST['dataPagamento']) . "', 
            valorPago = " . ValorE($_POST['valorPago']) . ", 
            dataPagamento = '" . DataSSql($_POST['dataPagamento']) . "', 
            idFormaPagamento = " . $_POST['idFormaPagamento'] . ", 
            qtdVezes = " . $_POST['qtdVezes'] . " 
            WHERE idVendaParcela = " . $_POST['idVendaParcela'];
    mysql_query($sql, $ArqT);

    if (mysql_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    mysql_close($ArqT);
}

function MostrarPagamentosPedido() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT v.idVendaParcela AS codigo, parcela, v.valor,
            v.recibo, v.dataCadastro, v.dataCompensacao,  
            v.idFormaPagamento, formaPagamento, v.idValePresenteTroca, IFNULL(vpt.codigo, '') AS codigoVale 
            FROM vendas_parcelas AS v
            LEFT JOIN formaspagamentos USING(idFormaPagamento) 
            LEFT JOIN vales_presentes_trocas AS vpt ON vpt.idValePresenteTroca = v.idValePresenteTroca
            WHERE v.idVenda = " . $_POST['idPedido'] . "
            AND v.del = 0 ORDER BY parcela";

    $Tb = mysql_query($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
    } else {
        while ($linha = mysql_fetch_assoc($Tb)) {
            $json[] = array(
                'codigo' => $linha['codigo'],
                'recibo' => $linha['recibo'],
                'parcela' => $linha['parcela'],
                'valor' => FormatMoeda($linha['valor']),
                'cadastro' => FormatData($linha['dataCadastro'], false),
                'data' => FormatData($linha['dataCompensacao'], false),
                'valor' => FormatMoeda($linha['valor']),
                'idForma' => $linha['idForma'],
                'forma' => $linha['formaPagamento'],
                'idValePresenteTroca' => $linha['idValePresenteTroca'],
                'codigoVale' => $linha['codigoVale']
            );
        }

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function GerarPdfPedido() {

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT IF(c.apelido = '', c.cliente, c.apelido) AS cliente, c.telefone, c.celular, c.email, c.responsavel, tt.tipoTransporte, 
            v.dataVenda, v.dataEntrega, v.valor, v.valorFrete, v.valorTotal, v.valorDesconto, v.percentualDesconto, 
            v.obs, IFNULL(ce.endereco, '') AS endereco, IFNULL(ce.numero, '') AS numero, 
            IFNULL(ce.complemento, '') AS complemento, IFNULL(ce.bairro, '') AS bairro, 
            IFNULL(ce.cidade, '') AS cidade, IFNULL(ce.estado, '') AS estado, IFNULL(ce.cep, '') AS cep, 
            CURDATE() AS dataAtual, l.loja, l.cidade AS cidadeLoja, ve.vendedor 
            FROM vendas AS v
            INNER JOIN clientes AS c USING(idCliente)
            INNER JOIN transportes_tipos AS tt ON tt.idTransporteTipo = v.idTipoEntrega
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja 
            LEFT JOIN clientes_enderecos AS ce ON ce.idClienteEndereco = v.idClienteEndereco 
            INNER JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor 
            WHERE v.idVenda = " . $_POST['idPedido'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysql_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha = mysql_fetch_assoc($Tb);

    $cliente = $linha['cliente'];
    $clienteTelefone = $linha['telefone'] . ($linha['celular'] != '' ? ' / ' . $linha['celular'] : '');
    $clienteEmail = $linha['email'];
    //$responsavel = $linha['responsavel'];
    $tipoTransporte = $linha['tipoTransporte'];
    $obs = $linha['obs'];
    $dataVenda = FormatData($linha['dataVenda']);
    $dataEntrega = FormatData($linha['dataEntrega']);
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
    $sql = "SELECT idTipoProduto FROM vendas_comp WHERE idVenda = " . $_POST['idPedido'] . " AND del = 0 LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);
    $idTipoProduto = mysql_result($Tb, 0, "idTipoProduto");

    $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');

    /*$logoPdf = compress_image('http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg'), 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco_compress.jpeg' : 'logo_instaarts_fundo_branco_compress.jpeg'), 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco_compress.jpeg' : 'logo_instaarts_fundo_branco_compress.jpeg'), 40);*/

    $medidasLogo = ($idTipoProduto == '1' ? 'width:150px; float:right; margin-top:-53px;' : 'width:270px; float:right; margin-top:10px;');
    $assinatura = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts') . '<br>' . $vendedor;
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? 'www.photoarts.com.br' : 'www.instaarts.com.br');

    $html = '<!DOCTYPE html>
                <html lang="pt">
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title>Photoarts Gallery - Impressão Pedido</title>
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
                                <div style="overflow:hidden; color:' . $corPdf . '; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;">Pedido</div>
                                <div style="float:right; overflow:hidden; color:#000; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:right; font-weight:bold; font-size:20px; margin-top:-50px;">Nº Pedido: <span>' . number_format_complete($_POST['idPedido'], '0', 5) . '</span>
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
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $dataVenda . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Previsão Entrega: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $dataEntrega . '</span></div>
                                <img src=' . $logoPdf . ' style=' . $medidasLogo . '/>
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
            FROM vendas_comp AS oc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=oc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = oc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = oc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = oc.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura
            WHERE oc.idVenda = " . $_POST['idPedido'] . " AND oc.del = 0";

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
                        <th>Qtd</th>
                        <th>Total</th>
                        <th>Peso</th>
                    </tr>
                </thead>
                <tbody>';

        while ($linha = mysql_fetch_assoc($Tb)) {

            $html .= '<tr>
                        <td>' . $linha['nomeTipo'] . '</td>
                        <td>' . $linha['artista'] . '</td>
                        <td>' . $linha['nomeObra'] . '</td>
                        <td>' . $linha['nomeTamanho'] . ($linha['idTipoProduto'] == 3 ? '' : ' (' . round($linha['altura']) . 'X' . round($linha['largura']) . ') ') . '</td>
                        <td>' . ($linha['idTipoProduto'] == 3 ? $linha['nomeProduto'] : $linha['nomeAcabamento']) . ($linha['moldura'] == '' ? '' : ' (Mold.: ' . $linha['moldura'] . ')') . '</td>
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
                        <th>Artista</th>
                        <th>Obra</th>
                        <th>Tamanho</th>
                        <th>Acabamento</th>
                        <th>Qtd</th>
                        <th>Total</th>
                        <th>Peso</th>
                    </tr>
                </thead>
                <tbody>';

        while ($linha = mysql_fetch_assoc($Tb)) {

            $html .= '<tr>
                        <td>' . $linha['nomeTipo'] . '</td>
                        <td>' . $linha['artista'] . '</td>
                        <td>' . $linha['nomeObra'] . '</td>
                        <td>' . $linha['nomeTamanhoInsta'] . ($linha['idTipoProduto'] == 3 ? '' : ' (' . round($linha['altura']) . 'X' . round($linha['largura']) . ') ') . '</td>
                        <td>' . ($linha['idTipoProduto'] == 3 ? $linha['nomeProduto'] : $linha['nomeAcabamento']) . '</td>
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
                <div style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px; height:auto;">
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

    $random = rand();

    if (file_exists('../pedidos/pedido-' . $_POST['idPedido'] . '-' . $cliente . '.pdf')) {
        unlink('../pedidos/pedido-' . $_POST['idPedido'] . '-' . $cliente . '.pdf');
    }

    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');
    $pdf->WriteHTML($html);
    $pdf->Output('../pedidos/pedido-' . $_POST['idPedido'] . '-' . $cliente . '.pdf', 'F');
    $filepath = 'pedidos/pedido-' . $_POST['idPedido'] . '-' . $cliente . '.pdf?PID=' . rand();

    //unlink('http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco_compress.jpeg' : 'logo_instaarts_fundo_branco_compress.jpeg'));

    echo $filepath;
    mysql_close($ArqT);
}

function compress_image($src, $dest, $destimg, $quality) {
    
    $info = getimagesize($src);
  
    if ($info['mime'] == 'image/jpeg') 
    {
        $image = imagecreatefromjpeg($src);
    }
    elseif ($info['mime'] == 'image/gif') 
    {
        $image = imagecreatefromgif($src);
    }
    elseif ($info['mime'] == 'image/png') 
    {
        $image = imagecreatefrompng($src);
    }
    else
    {
        die('Unknown image file format');
    }
  
    //compress and save file to jpg
    imagejpeg($image, $dest, $quality);
  
    //return destination file
    return $destimg;
}

function EnviarPdfPedidoEmail() {

    if (!file_exists('../pedidos/pedido-' . $_POST['idPedido'] . '-' . $_POST['cliente'] . '.pdf')) {
        GerarPdfPedido();
    }

    session_start();
    $ArqT = AbreBancoPhotoarts();

    //Busca o tipo de produto
    $sql = "SELECT idTipoProduto FROM vendas_comp WHERE idVenda  = " . $_POST['idPedido'] . " AND del = 0 ORDER BY idTipoProduto DESC LIMIT 1";
   // $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idPedido'] . " AND del = 0 LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);
    $idTipoProduto = mysql_result($Tb, 0, "idTipoProduto");
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $corEmail = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $logoEmail = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br');
    $remetente = $_SESSION['photoarts_funcionario']; //($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $remetenteEmail = $_SESSION['photoarts_email'];//($idTipoProduto == '1' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');
    $assunto = "Pedido N° " . number_format_complete($_POST['idPedido'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));
    // Busca o email do marchand que fez a venda para retorno do e-mail enviado
    
    $sqll = "SELECT IFNULL(emailCorporativo, '') AS emailCorporativo 
            FROM vendedores 
            LEFT JOIN funcionarios AS f USING (idFuncionario) 
            WHERE idVendedor = " . $_POST['vendedor'];
    $Tb2 = ConsultaSQL($sqll, $ArqT);

    //$responderPara = $_SESSION['photoarts_email'];//mysql_result($Tb2, 0, "email");
    $responderPara = (mysql_result($Tb2, 0, "emailCorporativo") == '' ? $remetenteEmail : mysql_result($Tb2, 0, "emailCorporativo"));
    $nomeResponderPara = ($_POST['vendedor'] == '0' ? $remetente : $_POST['nomeVendedor']);

    $assunto = "Pedido N° " . number_format_complete($_POST['idPedido'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));
    $msg =  $_POST['mensagemopc'];
    $MSSG = $msg.str_replace('<p>', '<br>');

    $mensagem = '
                <html>
                    <head>
                        <title>Pedido | ' . $nomeProduto . '</title>
                        <meta charset="UTF-8">
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid ' . $corEmail . '">
                            <tr align="center">
                                <td valign="top">
                                    <img src="' . $logoEmail . '" style="' . $medidasLogo . '"/>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family: Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:25px;">Olá, ' . $_POST['cliente'] . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:20px">Segue em anexo o pedido solicitado.</span>
                                    '. $MSSG .'
                                    <p style="font-size:14px">Se possuir alguma dúvida com relação ao pedido entre em contato conosco.</p>
                                    
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family: Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="center">
                                <td valign="top">
                                    <p>' . $rodape . '</p>
                                    <p>' . $rodape2 . '</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>';

    $pedido = '../pedidos/pedido-' . $_POST['idPedido'] . '.pdf';

    if (EnvioDeEmailsPhotoarts($_POST['cliente'], $_POST['email'], $remetenteEmail, $remetente, '', '', $responderPara, $nomeResponderPara, $assunto, $mensagem, $pedido, $idTipoProduto)) {
        echo '1';
    } else {
        echo '0';
    }
}

function AvisoRetirada() {
   
    $ArqT = AbreBancoPhotoarts();
    session_start();

    $sql = "SELECT idTipoProduto FROM vendas_comp WHERE idVenda  = " . $_POST['idPedido'] . " AND del = 0 ORDER BY idTipoProduto DESC LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);

    $idTipoProduto = mysql_result($Tb, 0, "idTipoProduto");
    $nomeProduto = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts' : 'InstaArts');
    $corEmail = ($idTipoProduto == '1' || $idTipoProduto == '3' ? '#6FAEE3' : '#3AB54A');
    $logoEmail = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
    $rodape = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' || $idTipoProduto == '3' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br');
    //$remetente = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'Photoarts Gallery' : 'InstaArts');
    //$remetenteEmail = ($idTipoProduto == '1' || $idTipoProduto == '3' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');
    
    $remetente = $_SESSION['photoarts_funcionario']; //($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $remetenteEmail = $_SESSION['photoarts_email'];//($idTipoProduto == '1' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');
    
    $assunto = "Pedido N° " . number_format_complete($_POST['idPedido'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));
    
    $sqll = "SELECT IFNULL(emailCorporativo, '') AS emailCorporativo 
            FROM vendedores 
            LEFT JOIN funcionarios AS f USING (idFuncionario) 
            WHERE idVendedor = " . $_POST['vendedor'];
    $Tb2 = ConsultaSQL($sqll, $ArqT);

    //$responderPara = $_SESSION['photoarts_email'];//mysql_result($Tb2, 0, "email");
    $responderPara = (mysql_result($Tb2, 0, "emailCorporativo") == '' ? $remetenteEmail : mysql_result($Tb2, 0, "emailCorporativo"));
    $nomeResponderPara = ($_POST['vendedor'] == '0' ? $remetente : $_POST['nomeVendedor']);
    
    
    $sql = "SELECT idTipoEntrega, tr.tipotransporte, c.apelido, c.email, envioPesquisa 
        FROM vendas AS v
        INNER JOIN transportes_tipos AS tr ON tr.idTransporteTipo = v.idTipoEntrega
        INNER JOIN clientes AS c USING (idCliente)
        WHERE idVenda= " . $_POST['idPedido'];

    $Tb = ConsultaSQL($sql, $ArqT);
    $enviopesquisa = mysql_result($Tb, 0, "envioPesquisa");
    $tipoentrega = mysql_result($Tb, 0, "tipotransporte");
    $email = mysql_result($Tb, 0, "email");
    $apelido = mysql_result($Tb, 0, "apelido");
    $assunto = "Pedido N° " . number_format_complete($_POST['idPedido'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));

    $mensagem = '
                <html>
                    <head>
                        <title>Pedido | ' . $nomeProduto . '</title>
                        <meta charset="UTF-8">
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid ' . $corEmail . '">
                            <tr align="center">
                                <td valign="top">
                                    <img src="' . $logoEmail . '" style="' . $medidasLogo . '"/>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family: Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:25px;">Olá, ' . $apelido . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:20px">Seu pedido de número ' . $_POST['idPedido'] . ' já está pronto. </span>
                                    <p style="font-size:14px">E encontra-se disponível para '. $tipoentrega . '.</p>

                                    <p style="font-size:14px">Se possuir alguma dúvida com relação ao pedido entre em contato conosco.</p>
                                
                           </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family: Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="center">
                                <td valign="top">
                                    <p>' . $rodape . '</p>
                                    <p>' . $rodape2 . '</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>';  

    if (EnvioDeEmailsPhotoarts($apelido, $email, $remetenteEmail, $remetente, '', '', $responderPara, $nomeResponderPara, $assunto, $mensagem, '', $idTipoProduto)) {
        echo '1';
    } else {
        echo '0';
    }
}

function AvisoPesquisa($idPedido) {
   
    $ArqT = AbreBancoPhotoarts();

    //Busca o tipo de produto
    $sql = "SELECT idTipoProduto FROM vendas_comp WHERE idVenda  = " . $idPedido . " AND del = 0 LIMIT 1";
   // $sql = "SELECT idTipoProduto FROM orcamentos_comp WHERE idOrcamento = " . $_POST['idPedido'] . " AND del = 0 LIMIT 1";
    $Tb = ConsultaSQL($sql, $ArqT);
    $idTipoProduto = mysql_result($Tb, 0, "idTipoProduto");
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : 'InstaArts');
    $corEmail = ($idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');
    $logoEmail = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg');
    $medidasLogo = ($idTipoProduto == '1' ? 'width:auto; height:175px; max-height:175px;' : 'width:500px; height:auto;');
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019');
    $rodape2 = ($idTipoProduto == '1' ? '(11) 4612-6019 - www.photoarts.com.br' : 'www.instaarts.com.br');
    //$remetente = ($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    //$remetenteEmail = ($idTipoProduto == '1' ? 'atendimento@photoarts.com.br' : 'contato@instaarts.com.br');
    $assunto = "Pedido N° " . number_format_complete($_POST['idPedido'], '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));
    
    $remetente = $_SESSION['photoarts_funcionario']; //($idTipoProduto == '1' ? 'Photoarts Gallery' : 'InstaArts');
    $remetenteEmail = $_SESSION['photoarts_email'];
    
    // Busca os dados do cliente e transporte 
    $sqll  = "SELECT idTipoEntrega, tr.tipotransporte, c.apelido, c.email , envioPesquisa, idUltimoStatus,
        v.idVendedor
        FROM vendas AS v
        INNER JOIN transportes_tipos AS tr ON tr.idTransporteTipo = v.idTipoEntrega
        INNER JOIN clientes AS c USING (idCliente)
        WHERE idVenda= " . $idPedido;
     
    $Tb2 = ConsultaSQL($sqll, $ArqT);
    $idUltimoStatus = mysql_result($Tb2, 0, "idUltimoStatus");
    $enviopesquisa = mysql_result($Tb2, 0, "envioPesquisa");
    $tipoentrega = mysql_result($Tb2, 0, "tipotransporte");
    $email = mysql_result($Tb2, 0, "email");
    $apelido = mysql_result($Tb2, 0, "apelido");

    if($enviopesquisa == 0 && $idUltimoStatus =='6' || $enviopesquisa == 0 && $idUltimoStatus =='4'){
    $assunto = "Pedido N° " . number_format_complete($idPedido, '0', 5) . " | " . $nomeProduto . " | " . FormatData(getServerData(true));

    
    $sqll = "SELECT IFNULL(emailCorporativo, '') AS emailCorporativo, vendedor AS nomeVendedor
            FROM vendedores 
            LEFT JOIN funcionarios AS f USING (idFuncionario) 
            WHERE idVendedor = " . mysql_result($Tb2, 0, "idVendedor");
    $Tb3 = ConsultaSQL($sqll, $ArqT);

    //$responderPara = $_SESSION['photoarts_email'];//mysql_result($Tb2, 0, "email");
    $responderPara = (mysql_result($Tb3, 0, "emailCorporativo") == '' ? $remetenteEmail : mysql_result($Tb3, 0, "emailCorporativo"));
    $nomeResponderPara = (mysql_result($Tb2, 0, "idVendedor") == '0' ? $remetente : mysql_result($Tb3, 0, "nomeVendedor"));
    
    $mensagem = '
                <html>
                    <head>
                        <title>Pedido | ' . $nomeProduto . '</title>
                        <meta charset="UTF-8">
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid ' . $corEmail . '">
                            <tr align="center">
                                <td valign="top">
                                    <img src="' . $logoEmail . '" style="' . $medidasLogo . '"/>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family: Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:25px;">Olá, ' . $apelido . '</span>
                                    <br>
                                    <span style="font-size:17px;"><b>Pesquisa de satisfação de clientes - Photoarts</b></span>
                                    <br>
                                    <br>
                                    <span style="font-size:14px">Para garantirmos a qualidade contínua de nossos produtos e serviços, segue abaixo o botão de acesso à <b>PESQUISA DE SATISFAÇÃO</b> de clientes Photoarts. </span>
                                    <p style="font-size:20px">Sua avaliação é muito importante para nós!</p>
                                
                            <div> 
                            <a href="http://www.survio.com/survey/d/N2R0N8Y6A2V3U9D6C"><input type="submit" href="http://www.survio.com/survey/d/N2R0N8Y6A2V3U9D6C"  style="float:right; 
                                 margin-right:9px;
                                 margin-top:8px;
                                font-size: 14px; 
                                padding: 4px 12px;
                                background-color: #f5f5f5;
                                background-image: -moz-linear-gradient(top, #fff, #e6e6e6);
                                background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fff), to(#e6e6e6));
                                background-image: -webkit-linear-gradient(top, #fff, #e6e6e6);
                                background-image: -o-linear-gradient(top, #fff, #e6e6e6);
                                background-image: linear-gradient(to bottom, #fff, #e6e6e6);
                                background-repeat: repeat-x;
                                border: 1px solid #ccc;
                                border-color: #e6e6e6 #e6e6e6 #bfbfbf;
                                border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
                                border-bottom-color: #b3b3b3;
                                -webkit-border-radius: 4px;
                                -moz-border-radius: 4px;
                                border-radius: 4px;
                                " value="Responder Pesquisa" /></a>
                                    </div></td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family: Arial; color:' . $corEmail . '; border:2px solid ' . $corEmail . '; border-top:0px solid ' . $corEmail . ';" bgcolor="white">
                            <tr align="center">
                                <td valign="top">
                                    <p>' . $rodape . '</p>
                                    <p>' . $rodape2 . '</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>';  

    if (EnvioDeEmailsPhotoarts($apelido, $email, $remetenteEmail, $remetente, '', '', $responderPara, $nomeResponderPara, $assunto, $mensagem, '', $idTipoProduto)) {

        $sql= "UPDATE vendas SET envioPesquisa=1  WHERE idVenda= " . $_POST['idPedido'];
        mysql_query($sql, $ArqT);
        echo '1';
    } else {
        echo '0';
    }

}else {
    echo '1';
}
}




function BaixarEstoque(){

    session_start();
    $ArqT = AbreBancoPhotoarts();

    if($_POST['idVendaComp'] > 0){

        $sql = "SELECT COUNT(*) AS total FROM estoque_produtos 
                WHERE idVendaComp = " . $_POST['idVendaComp'] . " AND del = 0 AND tipoMovimento = 'S'";

        $Tb = ConsultaSQL($sql, $ArqT);

        if(mysql_result($Tb, 0, "total") > '0'){
            echo '0';
            mysql_close($ArqT);
            return;
        }

        $sql = "SELECT getQtdEstoque(1, vc.idProduto, vc.idObra, vc.idTamanho, vc.idAcabamento, " . $_POST['idLoja'] . ") AS qtdEstoque, 
                vc.idVendaComp, vc.idProduto, IFNULL(p.nomeProduto, '') AS nomeProduto, vc.idObra, 
                IFNULL(ao.nomeObra, '') AS nomeObra, vc.idArtista, vc.idAcabamento, vc.idTamanho, vc.altura, vc.largura, 
                vc.qtd, vc.idTipoProduto, IFNULL(vc.idEstoqueProduto, 0) AS idVendaCompEstoque 
                FROM vendas_comp AS vc 
                LEFT JOIN produtos AS p USING(idProduto)
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra 
                LEFT JOIN estoque_produtos AS ep ON ep.idEstoqueProduto = vc.idEstoqueProduto AND ep.del = 0
                WHERE vc.idVenda = " . $_POST['idVenda'] . " AND vc.idVendaComp = " . $_POST['idVendaComp'] . " 
                AND vc.del = 0 AND vc.idTipoProduto <> 2";

        $Tb = ConsultaSQL($sql, $ArqT);

        if(mysql_num_rows($Tb) <= 0){

            $json = array(
                'erro' => '1',
                'mensagem' => ''
            );
            
            echo json_encode($json);
        }else{

            $linha = mysql_fetch_assoc($Tb);

            if($linha['qtdEstoque'] > 0.00 && $linha['idVendaCompEstoque'] == '0'){

                $sql = "INSERT INTO estoque_produtos SET 
                        dataMovimento = NOW(), 
                        idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
                        tipoMovimento = 'S', 
                        idLoja = " . $_POST['idLoja'] . ", 
                        idTipoProduto = " . $linha['idTipoProduto'] . ", 
                        idProduto = " . $linha['idProduto'] . ", 
                        idObra = " . $linha['idObra'] . ", 
                        idArtista = " . $linha['idArtista'] . ", 
                        idAcabamento = " . $linha['idAcabamento'] . ", 
                        idTamanho = " . $linha['idTamanho'] . ", 
                        altura = " . $linha['altura'] . ", 
                        largura = " . $linha['largura'] . ", 
                        qtd = " . $linha['qtd'] . ", 
                        idVendaComp = " . $linha['idVendaComp'];

                mysql_query($sql, $ArqT);

                if(mysql_affected_rows($ArqT) > 0){

                    $json = array(
                        'erro' => '4',
                        'mensagem' => 'Baixa de estoque realizada com sucesso!'
                    );
                    
                    echo json_encode($json);
                }else{

                    $json = array(
                        'erro' => '3',
                        'mensagem' => ''
                    );
                    
                    echo json_encode($json);
                }
            }else{
                echo '0';
            }
        }

        mysql_close($ArqT);
    }else{

        $sql = "SELECT COUNT(*) AS total FROM estoque_produtos WHERE idVendaComp IN(" . $_POST['idsVendasComp'] . ") 
                AND del = 0 AND tipoMovimento = 'S'";

        $Tb = ConsultaSQL($sql, $ArqT);

        $idVendaComp = explode(',', $_POST['idsVendasComp']);

        if(mysql_result($Tb, 0, "total") == count($idVendaComp)){
            echo '0';
            mysql_close($ArqT);
            return;
        }

        $sql = "SELECT getQtdEstoque(2, vc.idProduto, vc.idObra, vc.idTamanho, vc.idAcabamento, " . $_POST['idLoja'] . ") AS qtdEstoque, 
                vc.idVendaComp, vc.idProduto, IFNULL(p.nomeProduto, '') AS nomeProduto, vc.idObra, 
                IFNULL(ao.nomeObra, '') AS nomeObra, vc.idArtista, vc.idAcabamento, vc.idTamanho, vc.altura, vc.largura, 
                vc.qtd, vc.idTipoProduto, IFNULL(ep.idEstoqueProduto, 0) AS idVendaCompEstoque 
                FROM vendas_comp AS vc 
                LEFT JOIN produtos AS p USING(idProduto)
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra 
                LEFT JOIN estoque_produtos AS ep ON ep.idEstoqueProduto = vc.idEstoqueProduto AND ep.del = 0
                WHERE vc.idVenda = " . $_POST['idVenda'] . " AND vc.del = 0 AND vc.idTipoProduto <> 2";

        $Tb = ConsultaSQL($sql, $ArqT);

        if(mysql_num_rows($Tb) <= 0){
            echo '1';
        }else{

            $qtdSemEstoque = 0;
            $qtdComEstoque = 0;
            $qtdBaixados = 0;
            $mensagemSemEstoque = 'Os itens abaixo não possuem quantidade suficiente no estoque: ';
            $mensagemComEstoque = 'Itens que foram realizados baixa: ';

            while($linha = mysql_fetch_assoc($Tb)){

                if($linha['qtdEstoque'] > 0.00 && $linha['idVendaCompEstoque'] == '0'){

                    $qtdComEstoque++;
                    $mensagemComEstoque .= '<br>' . ($linha['idProduto'] == '0' ? $linha['nomeObra'] : $linha['nomeProduto']) . ' - Qtd: ' . $linha['qtd'];

                    $sql = "INSERT INTO estoque_produtos SET 
                            dataMovimento = NOW(), 
                            idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
                            tipoMovimento = 'S', 
                            idLoja = " . $_POST['idLoja'] . ", 
                            idTipoProduto = " . $linha['idTipoProduto'] . ", 
                            idProduto = " . $linha['idProduto'] . ", 
                            idObra = " . $linha['idObra'] . ", 
                            idArtista = " . $linha['idArtista'] . ", 
                            idAcabamento = " . $linha['idAcabamento'] . ", 
                            idTamanho = " . $linha['idTamanho'] . ", 
                            altura = " . $linha['altura'] . ", 
                            largura = " . $linha['largura'] . ", 
                            qtd = " . $linha['qtd'] . ", 
                            idVendaComp = " . $linha['idVendaComp'];

                    mysql_query($sql, $ArqT);

                    if(mysql_affected_rows($ArqT) > 0){
                        $qtdBaixados++;
                    }
                }else{

                    if($linha['idVendaCompEstoque'] == '0'){
                        
                        $qtdSemEstoque++;
                        $mensagemSemEstoque .= '<br>' . ($linha['idProduto'] == 0 ? $linha['nomeObra'] : $linha['nomeProduto']);
                    }
                }
            }

            if($qtdSemEstoque == 0 && $qtdComEstoque > 0){

                $json = array(
                    'erro' => '4',
                    'mensagem' => $mensagemComEstoque
                );
            }else if($qtdSemEstoque > 0 && $qtdComEstoque == 0){

                $json = array(
                    'erro' => '2',
                    'mensagem' => $mensagemSemEstoque
                );
            }else if($qtdSemEstoque > 0 && $qtdComEstoque > 0){

                $json = array(
                    'erro' => '4',
                    'mensagem' => $mensagemSemEstoque . '<br>' . $mensagemComEstoque
                );
            }else if($qtdSemEstoque == 0 && $qtdComEstoque == 0){

                $json = array(
                    'erro' => '1',
                    'mensagem' => ''
                );
            }else if($qtdBaixados < $qtdComEstoque){

                $json = array(
                    'erro' => '3',
                    'mensagem' => ''
                );
            }

            echo json_encode($json);
        }

        mysql_close($ArqT);
    }
}

function ExcluirPedido(){

    session_start();
    $ArqT = AbreBancoPhotoarts();

    $sql = "UPDATE vendas SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idVenda = " . $_POST['idPedido'];

    mysql_query($sql, $ArqT);

    if(mysql_affected_rows($ArqT) > 0){
        echo '1';
    }else{
        echo '0';
    }

    mysql_close($ArqT);
}

function MostrarEstoqueObra(){

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT l.loja, getQtdEstoque(1,0,ep.idObra,ep.idTamanho,ep.idAcabamento,ep.idLoja) AS qtdEstoque, 
            ep.idLoja, IF(" . $_POST['idLoja'] . " = ep.idLoja, 1, 0) AS temEstoque, 
            IFNULL(GROUP_CONCAT(vc.idVenda), 0) AS idsVendas
            FROM estoque_produtos AS ep 
            INNER JOIN lojas AS l USING(idLoja) 
            LEFT JOIN vendas_comp AS vc ON vc.idVendaComp = ep.idVendaComp
            WHERE ep.idObra = " . $_POST['idObra'] . " AND ep.idTamanho = " . $_POST['idTamanho'] . " 
            AND ep.idAcabamento = " . $_POST['idAcabamento'] . " AND ep.del = 0             
            GROUP BY l.loja ORDER BY ep.idLoja";

    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysql_num_rows($Tb) <= 0){
        echo '0';
    }else{
        
        $qtdObrasLojaSelecionada = 0;
        $qtdOutrasLojasComEstoque = 0;
        $qtdTotal = 0;
        while($linha = mysql_fetch_assoc($Tb)){

            if($linha['temEstoque'] == '0'){
                if($linha['qtdEstoque'] > '0'){
                    $qtdOutrasLojasComEstoque++;
                    $qtdTotal = $qtdTotal + intval($linha['qtdEstoque']);
                }
            }

            if($linha['temEstoque'] == '1'){
                if($linha['qtdEstoque'] > '0'){
                    $qtdObrasLojaSelecionada = intval($linha['qtdEstoque']);
                }
            }

            $json[] = array(
                'qtdObrasLojaSelecionada' => intval($qtdObrasLojaSelecionada),
                'qtdOutrasLojasComEstoque' => intval($qtdOutrasLojasComEstoque),
                'qtdTotal' => $qtdTotal,
                'loja' => $linha['loja'],
                'qtdEstoque' => FormatMoeda($linha['qtdEstoque']),
                'idLoja' => $linha['idLoja'],
                'idsVendas' => $linha['idsVendas']
            );
        }

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function MostrarOutrasLojas($ArqT, $idObra, $idTamanho, $idAcabamento){

    $sql = "SELECT l.loja, getQtdEstoque(1,0,ep.idObra,ep.idTamanho,ep.idAcabamento,ep.idLoja) AS qtdEstoque
            FROM estoque_produtos AS ep 
            INNER JOIN lojas AS l USING(idLoja)
            WHERE ep.idObra = " . $idObra . " AND ep.idTamanho = " . $idTamanho . " 
            AND ep.idAcabamento = " . $idAcabamento . " AND ep.del = 0             
            GROUP BY l.loja ORDER BY ep.idLoja";

    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysql_num_rows($Tb) <= 0){
        return '0';
    }else{
        
        while($linha = mysql_fetch_assoc($Tb)){

            $json[] = array(
                'loja' => $linha['loja'],
                'qtdEstoque' => FormatMoeda($linha['qtdEstoque'])
            );
        }

        return json_encode($json);
    }
}

function PesquisarVale(){

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT vpt.idValePresenteTroca, IF(CURDATE() > vpt.dataValidade, 1, 0) AS vencido, vpt.idGaleria, 
            vpt.dataValidade, vpt.valor, 
            LPAD(vpt.idVenda, 5, '0') AS idVenda, IFNULL(l.loja, '') AS loja, vpt.dataCadastro, 
            (SELECT idFormaPagamento FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0 LIMIT 1) AS idFormaPagamento, 
            (SELECT recibo FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0 LIMIT 1) AS recibo
            FROM vales_presentes_trocas AS vpt
            LEFT JOIN lojas AS l ON l.idLoja = vpt.idGaleria
            WHERE vpt.codigo = '" . $_POST['codigo'] . "' AND vpt.del = 0";

    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysql_num_rows($Tb) <= 0){

        echo '0';
    }else{

        $linha = mysql_fetch_assoc($Tb);

        $json = array(
            'vencido' => $linha['vencido'],
            'idGaleria' => $linha['idGaleria'],
            'dataValidade' => FormatData($linha['dataValidade']),
            'valor' => FormatMoeda($linha['valor']),
            'idVenda' => $linha['idVenda'],
            'loja' => $linha['loja'],
            'idFormaPagamento' => $linha['idFormaPagamento'],
            'recibo' => $linha['recibo'], 
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'idValePresenteTroca' => $linha['idValePresenteTroca']
        );

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function MostrarObrasRefazer(){

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT vc.idVendaComp, vc.idTipoProduto, vc.idTamanho, vc.altura, vc.largura, vc.valor, vc.qtd, 
            vc.imagemObra, IFNULL(ao.nomeObra, '- - -') AS nomeObra, 
            IFNULL(a.artista, '- - -') AS artista, IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, 
            IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, tp.produto AS nomeTipo, IFNULL(tp.pasta, '') AS pasta, 
            IFNULL(tt.nomeTamanho, '- - -') AS nomeTamanhoInsta, IFNULL(p.nomeProduto, '') AS nomeProduto
            FROM vendas_comp AS vc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto=vc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto=vc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = vc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = vc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = vc.idTamanho 
            INNER JOIN vendas AS v ON v.idVenda = vc.idVenda
            WHERE vc.idVenda = " . $_POST['idVenda'] . " AND vc.del = 0 GROUP BY idVendaComp";

    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysql_num_rows($Tb) <= 0){
        echo '0';
    }else{

        while($linha = mysql_fetch_assoc($Tb)){

            $json[] = array(
                'idVendaComp' => $linha['idVendaComp'],
                'idTipoProduto' => $linha['idTipoProduto'],
                'idProduto' => $linha['idProduto'],
                'nomeProduto' => $linha['nomeProduto'],
                'idTipo' => $linha['idTipoProduto'],
                'pasta' => $linha['pasta'], 
                'idTamanho' => $linha['idTamanho'],
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']),
                'qtde' => $linha['qtd'],
                'nomeTipo' => $linha['nomeTipo'],
                'nomeObra' => $linha['nomeObra'],
                'nomeArtista' => $linha['artista'],
                'nomeTamanho' => ($linha['idTipoProduto'] == 1 ? $linha['nomeTamanho'] : $linha['nomeTamanhoInsta']),
                'nomeAcabamento' => $linha['nomeAcabamento'],
                'imagem' => $linha['imagemObra']
            );
        }

        echo json_encode($json);
    }

    mysql_close($ArqT);
}

function EnviarEmailEstrela() {

    $assunto = "Mudança de estrela - obra " . $_POST["obra"] . " | " . FormatData(getServerData(true));

    $mensagem = '
                <html>
                    <head>
                        <title>Mudança de estrela</title>
                        <meta charset="UTF-8">
                        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid #6FAEE3">
                            <tr align="center">
                                <td valign="top">
                                    <img src="http://www.photoarts.com.br/sistema/imagens/Logopronto_fundo_branco.jpeg" style="width:auto; height:175px; max-height:175px;"/>
                                </td> 
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family:Arial; color:#6FAEE3; border:2px solid #6FAEE3; border-top:0px solid #6FAEE3;" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:20px">Mudança de estrela na obra ' . $_POST["obra"] . ' (artista ' . $_POST["artista"] . '). Estrela antiga ' . $_POST["estrelaAtual"] . ', e estrela atual ' . $_POST["estrela"] . '.</span>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family:Arial; color:#6FAEE3; border:2px solid #6FAEE3; border-top:0px solid #6FAEE3;" bgcolor="white">
                            <tr align="center">
                                <td valign="top">
                                    <p>Photoarts Online Gallery - CNPJ: 00.934.702/0001-42</p>
                                    <p>(11) 4612-6019 - www.photoarts.com.br</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>';

    if(EnvioDeEmailsPhotoarts("Photoarts", "atendimento@photoarts.com.br", "atendimento@photoarts.com.br", "Photoarts", "", "", "atendimento@photoarts.com.br", "Photoarts", $assunto, $mensagem, "", "1")) {
        echo '1';
    } else {
        echo '0';
    }
}