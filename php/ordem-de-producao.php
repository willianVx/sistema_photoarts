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

        case 'GerarPdfCertificado':
            GerarPdfCertificado();
            break;

        case 'AtualizarStatusOpComp':
            AtualizarStatusOpComp();
            break;
    }
}

function GerarPdfCertificado() {

    $db = ConectaDB();

    $sql = "SELECT * FROM ordem_producao_comp WHERE idOrdemProducaoComp = " . $_POST['codigo'];
    
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
    
        $linha = $db->fetch();

        $idTamanho = $linha['idTamanho'];
        $idObra = $linha['idObra'];
        $numeroTiragem = $linha['numeroTiragem'];

        $sql = "SELECT 
                CONCAT(tm.nomeTamanho, ' (', REPLACE(tm.altura,'.0','') , 'x', REPLACE(tm.largura,'.0','') , ')') AS tamanho,
                a.artista, a.nacionalidade, a.sobre, o.nomeObra, o.descricao, 
                t.idTamanho, t.tiragemMaxima, tm.nomeTamanho, tm.altura, tm.largura 
                FROM artistas AS a
                INNER JOIN artistas_obras AS o ON o.idArtista = a.idArtista 
                INNER JOIN artistas_obras_tamanhos AS t ON t.idObra = o.idArtistaObra
                INNER JOIN tamanhos AS tm ON tm.idTamanho = t.idTamanho
                WHERE o.idArtistaObra =  " . $idObra . " AND t.idArtistaObraTamanho = " . $idTamanho;
        
        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        }else{

            $linha = $db->fetch();
            $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/Logopronto_fundo_branco.jpeg';

            $html = '<html>
                        <body style="font-family:Arial, Helvetica, sans-serif">
                        <div id="pagina" style="width:755px; height:auto; max-height:548px; border:1px solid #CCC; padding:5px; padding-bottom:0px;">
                          <img src="http://www.photoarts.com.br/sistema/imagens/Logopronto_fundo_branco.jpeg" style="width:auto; height:80px; position:relative; float:right; margin-top:-10px;" />
                          <div style="color:#6FAEE3; margin:0px;"><label style="font-weight:bold; font-size:15px; color:#6FAEE3;">CERTIFICADO DE AUTENTICIDADE PHOTOARTS</label></div>
                          <label style="font-size:12px; font-weight:bold">' . $linha['artista'] . ',  ' . $linha['nacionalidade'] . ' <i>"' . $linha['nomeObra'] . '"</i></label>
                          <div style="margin-top:0px">
                            <h2 style="' . (strlen($linha['sobre']) > 1030 ? "font-size:10px;" : "font-size:11px;") . ' margin-bottom: 6px;">Sobre o artista: </h2>
                            <p style="' . (strlen($linha['sobre']) > 1030 ? "font-size:9px;" : "font-size:10px;") . ' margin-top: 0px; text-align:justify;"> ' . $linha['sobre'] . ' </p>
                          </div>
                          <div>
                            <h2 style="' . (strlen($linha['descricao']) > 1000 ? "font-size:10px;" : "font-size:11px;") . ' margin-bottom: 6px;">Sobre a obra: </h2>
                            <p style="' . (strlen($linha['descricao']) > 1000 ? "font-size:9px;" : "font-size:10px;") . ' margin-top: 0px; text-align:justify;"> ' . $linha['descricao'] . '</p>
                          </div>
                          <div>
                            <p style="font-size:11px; margin-top: 0px; text-align:justify;"> Nós da <b>Photoarts</b> certificamos que a fotografia intitulada <i><b>"' . $linha['nomeObra'] . '"</b></i> é uma fotografia original de <b>' . $linha['artista'] . '.</b><br>
                              Esta fotografia foi impressa por nosso laboratório profissional e checada individualmente por um de nossos profissionais.  Edição ' . ($linha['tiragemMaxima'] > 0 ? 'limitada' : 'ilimitada'). ' de tamanho <b>' . $linha['nomeTamanho'] . ' (' . FormatMoeda($linha['altura']) . 'x' . FormatMoeda($linha['largura']) . ')</b> cm e número <b> ' . $numeroTiragem . '/' . $linha['tiragemMaxima'] . '.</b> </p>
                          </div>
                          <div style="font-size:11px;"> <img src="../imagens/QRCODEMANUALCONSERVACAO.jpg" style="width:auto; height:80px; vertical-align:middle; margin-right:40px" /> Acesse o manual de conservação das obras </div>
                        </div>
                        </body>
                    </html>';

            $pdf = new mPDF('pt');
            $pdf->SetDisplayMode('fullpage');
            $pdf->WriteHTML($html);
            $pdf->Output('../certificados/certificado-' . $_POST['codigo'] . '.pdf', 'F');
            $filepath = 'certificados/certificado-' . $_POST['codigo'] . '.pdf';

            echo $filepath;
            
            $options = new Options();
            $options->setDpi(101);

            // instantiate and use the dompdf class  
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml( $html );


            // (Optional) Setup the paper size and orientation (portrait or landscape)
            $dompdf->setPaper('A4', "portrait");

            // Render the HTML as PDF
            $dompdf->render();

            //Gera arquivo para saida PDF
            $output = $dompdf->output();

            file_put_contents( '../certificados/certificado-' . $_POST['codigo'] . '.pdf', $output);

            $random = rand();

            $filepath = 'certificados/certificado-' . $_POST['codigo'] . '.pdf?' . $random;

            echo $filepath;
        }
    }
    $db->close();
}

function Finalizar() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE ordem_producao SET dataFim = NOW(), dataFinalizada = NOW(),
	    idUsuarioFinalizada = " . $_SESSION['photoarts_codigo'] . ",  finalizada = 1 
	    WHERE idOrdemProducao = " . $_POST['codigo'];
    
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $sql = "SELECT *, (SELECT idEtapa FROM etapas ORDER BY ordem DESC LIMIT 1) AS etapaAtual,
                (SELECT descricaoEtapa FROM etapas ORDER BY ordem DESC LIMIT 1) AS nomeEtapaAtual 
                FROM ordem_producao_comp WHERE idOrdemProducao =  " . $_POST['codigo'];

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        }else{
            while ($linha = $db->fetch()) {
                $sql = "UPDATE ordem_producao_comp SET
                        numeroTiragem = IFNULL(getTiragemAtual(" . $linha['idObra'] . "," . $linha['idTamanho'] . "," . $linha['idArtista'] . "), 0) + 1,
                        idOPEtapa =  " . $linha['etapaAtual'] . "
                        WHERE idOrdemProducaoComp = " . $linha['idOrdemProducaoComp'];
                $db->query( $sql );

                $sql = "INSERT INTO ordem_producao_etapas SET dataCadastro = NOW(),
                        idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                        idEtapa = " . $linha['etapaAtual'] . ", nomeEtapa =  '" . $db->escapesql($linha['nomeEtapaAtual']) . "',
                        idOrdemProducaoComp = " . $linha['idOrdemProducaoComp'];
                $db->query( $sql );
            }
            
            movimentaEstoque($db);

            echo "1";
        }
    }
    $db->close();
}

function movimentaEstoque($ArqT) {

    inicia_sessao();

    $sql = "SELECT *,(SELECT idLoja FROM ordem_producao WHERE idOrdemProducao = " . $_POST['codigo'] . ") AS loja
            FROM ordem_producao_comp WHERE idOrdemProducao =  " . $_POST['codigo'];
    
    $ArqT->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $ArqT->fetch()) {

        $sql = "INSERT INTO estoque_produtos SET dataMovimento = NOW(),
                    idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ",
                    idProduto = " . $linha['idProduto'] . ",
                    idObra = " . $linha['idObra'] . ",
                    idArtista = " . $linha['idArtista'] . ",
                    idAcabamento = " . $linha['idAcabamento'] . ",
                    idTamanho = " . $linha['idTamanho'] . ",
                    idLoja = " . $linha['loja'] . ",
                    idTipoProduto = " . $linha['idTipoProduto'] . ",
                    tipoMovimento = 'E',
                    altura = " . $linha['altura'] . ",
                    largura = " . $linha['largura'] . ",
                    qtd = " . $linha['qtd'] . ",
                    idVendaComp = " . $linha['idVendaComp'] . ",
                    idOrdemProducaoComp = " . $linha['idOrdemProducaoComp'];


        $ArqT->query( $sql );
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
    $db->close();
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

    $sql = "SELECT o.idOrdemProducao AS codigo,  o.idVenda, LPAD(o.idVenda,6,0) AS venda, 
            LPAD(o.idOrdemProducao,6,0) AS id, l.loja, o.dataOrdemProducao AS 'data', 
            (SELECT COUNT(*) FROM ordem_producao_comp WHERE idOrdemProducao = o.idOrdemProducao AND del = 0) AS itens, 
            o.cancelada, o.finalizada, IFNULL(cl.cliente, '- - -') AS cliente, o.refeita 
            FROM ordem_producao AS o 
            LEFT JOIN vendas AS v USING(idVenda) 
            LEFT JOIN clientes AS cl ON cl.idCliente = v.idCliente
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            LEFT JOIN ordem_producao_comp AS c ON c.idOrdemProducao = o.idOrdemProducao
            WHERE TRUE ";

    if ($_POST['de'] !== '') {
        $sql .= " AND DATE(o.dataOrdemProducao) >= DATE('" . DataSSql($_POST['de']) . "') ";
    }

    if ($_POST['ate'] !== '') {
        $sql .= " AND DATE(o.dataOrdemProducao) <= DATE('" . DataSSql($_POST['ate']) . "') ";
    }

    if ($_POST['etapa'] > '0') {
        $sql .= " AND c.idOPEtapa = " . $_POST['etapa'];
    }

    if ($_POST['buscanumero'] !== '') {
        $sql .= " AND o.idOrdemProducao =  " . ValorE($_POST['buscanumero']) . " ";
    }
    
    if ($_POST['buscanumeropedido'] !== '') {
        $sql .= " AND o.idVenda =  " . ValorE($_POST['buscanumeropedido']) . " ";
    }

    if ($_POST['statusBusca'] == '2') {
        $sql .= " AND o.finalizada = 1 ";
    } else if ($_POST['statusBusca'] == '3') {
        $sql .= " AND o.cancelada = 1 ";
    } else if ($_POST['statusBusca'] == '1') {
        $sql .= " AND o.cancelada = 0 AND  o.finalizada = 0 ";
    }

    if($_POST['refeitas'] == 'true'){
        $sql .= " AND o.refeita = 1 ";
    }

    $sql .= " GROUP BY o.idOrdemProducao ORDER BY o.dataOrdemProducao DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            if ($linha['cancelada'] == 1) {
                $status = "Cancelada";
            }elseif ($linha['finalizada'] == 1) {
                $status = "Finalizada";
            }else{
                $status = "Em Aberto";
            }
            $json[] = array(
                'codigo' => $linha['codigo'],
                'id' => $linha['id'],
                'idVenda' => $linha['idVenda'],
                'venda' => $linha['venda'],
                'loja' => $linha['loja'],
                'data' => FormatData($linha['data'], false),
                'itens' => $linha['itens'],
                'cancelada' => $linha['cancelada'],
                'finalizada' => $linha['finalizada'],
                'status' => $status,
                'cliente' => $linha['cliente'],
                'refeita' => ($linha['refeita'] == '1' ? 'SIM' : 'NÃO')
            );
        }

        echo json_encode($json);
    }
    
    $db->close();
}

function Gravar() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = " ordem_producao SET anoProducao = YEAR('" . DataSSql($_POST['data']) . "'),
            dataOrdemProducao =  '" . DataSSql($_POST['data']) . "',
            idLoja = " . $_POST['loja'] . ",
            dataPrevista =  '" . DataSSql($_POST['previsao']) . "',
            obs = '" . $db->escapesql($_POST['obs']) . "', refeita = " . $_POST['refeita'] . "";

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idOrdemProducao = " . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    }

    $db->query( $sql );

    if ($_POST['codigo'] > 0) {
        $codigo = $_POST['codigo'];
    } else {
        $codigo = UltimoRegistroInserido($db);
    }

    GravarObras($db, $codigo);

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

function GravarObras($ArqT, $codigo) {

    inicia_sessao();

    $sql = "UPDATE ordem_producao_comp SET del = 1, 
            dataDel = NOW(), idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idOrdemProducao = " . $codigo;

    $ArqT->query( $sql );

    if ($_POST['idsOrcamentosObras'] == '[]') {
        return;
    }

    $id = explode(',', $_POST['idsOrcamentosObras']);
    $imagem = explode(',', $_POST['imagens']);
    $qtd = explode(',', $_POST['qtds']);
    $etapa = explode(',', $_POST['etapas']);
    $nomeEtapa = explode('|crio|', $_POST['nomeEtapas']);
    $selo = explode(',', $_POST['selos']);
    $altura = explode(',', $_POST['alturas']);
    $largura = explode(',', $_POST['larguras']);
    $idArtista = explode(',', $_POST['idsArtistas']);
    $idObra = explode(',', $_POST['idsObras']);
    $idTamanho = explode(',', $_POST['idsTamanhos']);
    $idAcabamento = explode(',', $_POST['idsAcabamentos']);
    $idGrupo = explode(',', $_POST['idsGruposMolduras']);
    $idMoldura = explode(',', $_POST['idsMolduras']);
    $idProduto = explode(',', $_POST['idsProdutos']);
    $obs = explode(',', $_POST['observacoes']);
    $idTipo = explode(',', $_POST['tipo']);

    for ($i = 0; $i < count($id); $i++) {

        $sql = "ordem_producao_comp SET 
                del=0, 
                idOrdemProducao = " . $codigo . ",
                idOPEtapa = " . $etapa[$i] . ",
                idTipoProduto = " . $idTipo[$i] . ",
                idObra = " . $idObra[$i] . ",
                idProduto = " . $idProduto[$i] . ",
                idAcabamento = " . $idAcabamento[$i] . ",
                idTamanho = " . $idTamanho[$i] . ",
                altura = " . $altura[$i] . ",
                largura = " . $largura[$i] . ",
                idArtista = " . $idArtista[$i] . ",
                qtd = " . $qtd[$i] . ",
                numeroSerie = '" . $selo[$i] . "',  
                idGrupo = " . $idGrupo[$i] . ",  
                imagem = '" . $ArqT->escapesql($imagem[$i]) . "',    
                idMoldura = " . $idMoldura[$i] . ",  
                obs = '" . $ArqT->escapesql($obs[$i]) . "' ";

        if ($id[$i] > 0) {

            $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), 
                    idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . "  
                    WHERE idOrdemProducaoComp = " . $id[$i];
            $ArqT->query( $sql );

            $sql = "SELECT idEtapa FROM ordem_producao_etapas 
                    WHERE idOrdemProducaoComp = " . $id[$i] . " ORDER BY idOrdemProducaoEtapa DESC LIMIT 1 ";
            
            $ArqT->query( $sql );
        
            if ( $ArqT->n_rows <= 0) {

                $sql = "INSERT INTO ordem_producao_etapas SET dataCadastro = NOW(),
                        idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                        idEtapa = " . $etapa[$i] . ", nomeEtapa =  '" . $ArqT->escapesql($nomeEtapa[i]) . "',
                        idOrdemProducaoComp = " . $id[$i];
                $ArqT->query( $sql );
            } else {
                $result = $ArqT->fetch();
                if ($result['idEtapa'] !== $etapa[$i]) {

                    $sql = "INSERT INTO ordem_producao_etapas SET dataCadastro = NOW(),
                        idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                        idEtapa = " . $etapa[$i] . ", nomeEtapa =  '" . $ArqT->escapesql($nomeEtapa[i]) . "',
                        idOrdemProducaoComp = " . $id[$i];
                    $ArqT->query( $sql );
                }
            }
        } else {

            $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(),  
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
            $linhas = $ArqT->query( $sql );
            
            $codigoComp = UltimoRegistroInserido($ArqT);

            if($linhas == '0'){

                //VERIFICAR SE É PHOTOARTS, SE SIM, DAR UM UPDATE NA TABELA artistas_obras_tamanhos, na coluna tiragemAtual
                if ($idTipo[$i] == 1) {

                    if ($_POST['idVenda'] <= 0) {

                        $sql = "UPDATE artistas_obras_tamanhos SET tiragemAtual = tiragemAtual + 1, dataAtualizacao = NOW() 
                                WHERE idArtistaObraTamanho = '" . $idTamanho[$i] . "'
                                AND idObra = '" . $idObra[$i] . "'
                                AND idArtista = '" . $idArtista[$i] . "' ";
                        $ArqT->query( $sql );
                    }
                }
            }

            $sql = "INSERT INTO ordem_producao_etapas SET dataCadastro = NOW(),
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                    idEtapa = " . $etapa[$i] . ", nomeEtapa =  '" . $ArqT->escapesql( $nomeEtapa[i]) . "',
                    idOrdemProducaoComp = " . $codigoComp;
            $ArqT->query( $sql );
        }        
    }
}

function getEtapasOrdensProducaoArqT($ArqT) {

    $sql = "SELECT idEtapa AS codigo, CONCAT(etapa, ' - ', descricaoEtapa) AS nome FROM etapas 
            WHERE ativo = 1 ORDER BY ordem";
    $linhas = $ArqT->query( $sql );

    if ( $ArqT->n_rows <= 0) {
        return '0';
    }else{
        while ($linha = $ArqT->fetch()) {
            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome']
            );
        }
        return json_encode($json);
    }
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT o.idVenda, LPAD(o.idVenda,6,0) AS codVenda, CURDATE() AS dataAtual,
            l.loja,IFNULL(prodf.funcionario,'') AS usuarioCadastro,
            IFNULL(cancelf.funcionario,'') AS usuarioCancelou, IFNULL(finalizaf.funcionario,'') AS usuarioFinalizou,
            o.idOrdemProducao AS codigo, o.dataOrdemProducao AS 'data', o.dataPrevista AS previsao,
            o.obs, o.finalizada, o.cancelada, o.idLoja, o.dataFinalizada, o.dataCancelada, 
            IFNULL(c.cliente, '') AS cliente, IFNULL(fp.formaPagamento, '') AS formaPagamento, 
            IFNULL(LPAD(v.idVenda, 5, '0'), '') AS numeroPedido, o.refeita 
            FROM ordem_producao AS o
            LEFT JOIN funcionarios AS prodf ON prodf.idFuncionario = o.idUsuarioCadastro
            LEFT JOIN funcionarios AS cancelf ON cancelf.idFuncionario = o.idUsuarioCancelada
            LEFT JOIN funcionarios AS finalizaf ON finalizaf.idFuncionario = o.idUsuarioFinalizada
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            LEFT JOIN vendas AS v ON v.idVenda = o.idVenda
            LEFT JOIN clientes AS c ON c.idCliente = v.idCliente
            LEFT JOIN vendas_parcelas AS vp ON vp.idVenda = v.idVenda 
            LEFT JOIN formaspagamentos AS fp ON fp.idFormaPagamento = vp.idFormaPagamento
            WHERE o.idOrdemProducao = " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = [
            'id' => number_format_complete($linha['codigo'], '0', 5),
            'codigo' => $linha['codigo'],
            'idVenda' => $linha['idVenda'],
            'codVenda' => $linha['codVenda'],
            'usuarioCadastro' => $linha['usuarioCadastro'],
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
            'idLoja' => $linha['idLoja'],
            'loja' => $linha['loja'],
            'dataAtual' => FormatData($linha['dataAtual'], false),
            'cliente' => $linha['cliente'],
            'formaPagamento' => $linha['formaPagamento'],
            'numeroPedido' => $linha['numeroPedido'],
            'refeita' => $linha['refeita'],
            'etapas' => getEtapasOrdensProducaoArqT($db),
            'itens' => MostrarItens($db)
            ];

        echo json_encode($json);
    }
    $db->close();
}

function MostrarItens($ArqT) {

    $sql = "SELECT o.imagem AS  imagemOriginal, IFNULL(CONCAT(tm.nomeTamanho,' (',REPLACE(tm.altura,'.0',''),'x',REPLACE(tm.largura,'.0',''),')'), 
            IFNULL(CONCAT(ti.nomeTamanho,' (',REPLACE(ti.altura,'.0',''),'x',REPLACE(ti.largura,'.0',''),')'),'- - -')) AS tamanho,
            IFNULL(ar.artista,'- - -') AS artista, o.idOrdemProducaoComp AS codigo, IFNULL(a.nomeAcabamento, '- - -') AS acabamento, e.idEtapa,
            IFNULL(CONCAT(e.etapa, ' - ', e.descricaoEtapa),'') AS etapa,  e.etapa AS etapanumero,
            t.produto AS tipo, IFNULL(b.nomeObra,'- - -') AS obra, o.altura, o.largura,
            o.certificado, o.numeroSerie AS selo, IFNULL(CONCAT('imagens/', t.pasta ,'/',o.imagem),'imagens/semarte.png') AS imagem, o.qtd,
            o.idObra, o.idArtista, o.idTamanho, o.idAcabamento, o.idGrupo, o.idMoldura, o.idProduto, o.obs, o.idTipoProduto, 
            IFNULL(IFNULL(tm.nomeTamanho, ti.nomeTamanho), '- - -') AS nomeTamanho, IFNULL(m.moldura, '') AS moldura, p.nomeProduto
            FROM ordem_producao_comp AS o
            LEFT JOIN etapas AS e ON e.idEtapa =  o.idOPEtapa
            LEFT JOIN tipos_produtos AS t ON t.idTipoProduto = o.idTipoProduto 
            LEFT JOIN produtos AS p ON p.idProduto=o.idProduto
            LEFT JOIN artistas_obras AS b ON b.idArtistaObra = o.idObra
            LEFT JOIN artistas AS ar ON ar.idArtista = b.idArtista
            LEFT JOIN acabamentos AS a ON a.idAcabamento = o.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = o.idTamanho
            LEFT JOIN tamanhos AS ti ON ti.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tm ON tm.idTamanho = o.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = o.idMoldura 
            WHERE o.del = 0 AND idOrdemProducao =  " . $_POST['codigo'];
    
    $ArqT->query( $sql );

    if ( $ArqT->n_rows <= 0) {
        return '0';
    }else{
        $linhas = $ArqT->fetch_all();
        foreach ($linhas as $linha){
            $json[] = array(
                'tamanho' => $linha['tamanho'],
                'etapanumero' => $linha['etapanumero'],
                'codigo' => $linha['codigo'],
                'artista' => $linha['artista'],
                'idEtapa' => $linha['idEtapa'],
                'etapa' => $linha['etapa'],
                'tipo' => $linha['tipo'],
                'obra' => $linha['obra'],
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']),
                'certificado' => $linha['certificado'],
                'selo' => $linha['selo'],
                'acabamento' => $linha['acabamento'],
                'imagem' => ($linha['imagemOriginal'] == 'semarte.png' ? 'imagens/semarte.png' : $linha['imagem']),
                'qtd' => $linha['qtd'],
                'idObra' => $linha['idObra'],
                'idArtista' => $linha['idArtista'],
                'idTamanho' => $linha['idTamanho'],
                'idAcabamento' => $linha['idAcabamento'],
                'idGrupo' => $linha['idGrupo'],
                'idMoldura' => $linha['idMoldura'],
                'idProduto' => $linha['idProduto'],
                'obs' => $linha['obs'],
                'idTipoProduto' => $linha['idTipoProduto'],
                'nomeTamanho' => $linha['nomeTamanho'],
                'moldura' => $linha['moldura'],
                'nomeProduto' => $linha['nomeProduto'],
                'opStatus' => MostrarOpCompStatus($ArqT, $linha['codigo'])
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

    $sql = "SELECT CONCAT(t.nomeTamanho, ' (', TRUNCATE(t.altura, 0), 'x', TRUNCATE(t.largura, 0), ')') AS tamanho, 
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
                'imagem' => 'imagens/obras/mini_' . $linha['imagem'], 
                'imagemReal' => 'imagens/obras/' . $linha['imagem']
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
    
        $linhas = $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        }else{

            $json = $db-fetch();
            $json['altura'] = FormatMoeda($json['altura']);
            $json['largura'] = FormatMoeda($json['largura']);
            $json['tiragemMaxima'] = $json['tiragemMaxima'];
            $json['tiragemAtual'] = $json['tiragemAtual'];
            $json['estrelas'] = $json['estrelas'];


            if ($_POST['item'] === 'i') {

                $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idTamanho'];

                $linhas = $db->query( $sql );

                if ( $db->n_rows <= 0) {
                    echo '0';
                }else{

                    $json = $db-fetch();
                    $json['altura'] = FormatMoeda($json['altura']);
                    $json['largura'] = FormatMoeda($json['largura']);
                }

                echo json_encode($json);
            }
        }
    }
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

function CancelarOrdem() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE ordem_producao SET cancelada = 1, 
            dataCancelada = NOW(),
            idUsuarioCancelada = " . $_SESSION['photoarts_codigo'] . "  
            WHERE idOrdemProducao = " . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        echo '1';
    }

    $db->close();
}

function GerarPdfOrdem() {

    $db = ConectaDB();

    $sql = "SELECT o.idVenda, LPAD(o.idVenda,5,0) AS codVenda, CURDATE() AS dataAtual,
            l.loja,IFNULL(prodf.funcionario,'') AS usuarioCadastro,
            IFNULL(cancelf.funcionario,'') AS usuarioCancelou, IFNULL(finalizaf.funcionario,'') AS usuarioFinalizou,
            o.idOrdemProducao AS codigo, o.dataOrdemProducao AS 'data',   o.dataPrevista AS previsao,
           (SELECT idTipoProduto FROM ordem_producao_comp WHERE idOrdemProducao = o.idOrdemProducao LIMIT 1) AS tipox,
            o.obs, o.finalizada, o.cancelada, o.idLoja, o.dataFinalizada, o.dataCancelada 
            FROM ordem_producao AS o
            LEFT JOIN funcionarios AS prodf ON prodf.idFuncionario = o.idUsuarioCadastro
            LEFT JOIN funcionarios AS cancelf ON cancelf.idFuncionario = o.idUsuarioCancelada
            LEFT JOIN funcionarios AS finalizaf ON finalizaf.idFuncionario = o.idUsuarioFinalizada
            LEFT JOIN lojas AS l ON l.idLoja = o.idLoja
            WHERE o.idOrdemProducao =  " . $_POST['idOrdem'];

    $linhas = $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
        return;
    }
    
    $linha = $db->fetch();

    $loja = $linha['loja'];
    $previsao = FormatData($linha['previsao'], false);
    $emissao = FormatData($linha['data'], false);
    $obs = $linha['obs'];
    $dataAtual = dataExtenso($linha['dataAtual']);
    
    $idTipoProduto = $linha['tipox']; //mysqli_result($Tb, 0, "idTipoProduto");
    
    $numeroOrdem = number_format_complete($linha['codigo'], '0', 5);
    $numeroPedido = ($linha['codVenda'] == '' ? ' - - - ' : $linha['codVenda']);

    $corPdf = ($idTipoProduto == '1' ? '#6FAEE3' : ($idTipoProduto == '3' ? '#6FAEE3' : '#3AB54A'));
    $nomeProduto = ($idTipoProduto == '1' ? 'Photoarts' : ($idTipoProduto == '3' ? 'Photoarts' : 'InstaArts'));
    $logoPdf = 'http://www.photoarts.com.br/sistema/imagens/' . ($idTipoProduto == '1' ? 'Logopronto_fundo_branco.jpeg' : ($idTipoProduto == '3' ? 'Logopronto_fundo_branco.jpeg' : 'logo_instaarts_fundo_branco.jpeg'));
    $medidasLogo = ($idTipoProduto == '1' ? 'width:150px; height:auto; float:right; margin-top:-32px;' : ($idTipoProduto == '3' ? 'width:150px; height:auto; float:right; margin-top:-32px;' : 'width:270px; height:auto; float:right; margin-top:10px;'));
    $assinatura = ($idTipoProduto == '1' ? 'Photoarts Gallery' : ($idTipoProduto == '3' ? 'Photoarts Gallery' : 'InstaArts'));
    $rodape = ($idTipoProduto == '1' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : ($idTipoProduto == '3' ? 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42' : 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019'));
    $rodape2 = ($idTipoProduto == '1' ? 'www.photoarts.com.br' : ($idTipoProduto == '3' ? 'www.photoarts.com.br' : 'www.instaarts.com.br'));

    $html = '<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title>Photoarts Gallery - Impressão Ordem de Produção</title>
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
                                <div style="overflow:hidden; color:' . $corPdf . '; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;">Ordem de Produção</div>
                                <div style="float:right; overflow:hidden; color:#000; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:right; font-weight:bold; font-size:20px; margin-top:-50px;">
                                    Nº Ordem: <span>' . $numeroOrdem . '</span>
                                    <br />
                                    <span>Nº Pedido:</span> <span>' . $numeroPedido . '</span>
                                    <br>
                                    <span>' . strtoupper($nomeProduto) . '</span> 
                                </div>
                            </div>
                            <!--linha1-->
                            <div id="linha2" style="background:' . $corPdf . '; padding:4px; margin-bottom:10px;"></div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:left;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; vertical-align:top; text-align:left; width:auto;">Loja: <span style="font-weight:100; font-size:13px; line-height:22px; color:#444444;">' . $loja . '</span></div>
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto;">Previsão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $previsao . '</span></div>
                            </div>
                            <div style="background:#FFF; width:49.5%; height:120px; display:inline-block; vertical-align:top; float:right;">
                                <div style="width:70px; font-size:13px; font-weight:bold; line-height:22px; display:inline-block; vertical-align:top; text-align:left; width:auto">Emissão: <span style="width:290px; font-size:13px; line-height:22px; display:inline-block; color:#444444;">' . $emissao . '</span></div>
                                <img src="' . $logoPdf . '" style="' . $medidasLogo . '"/>
                            </div>
                            <div id="linha3" style="margin-top:15px;" ></div>
                            <div id="linhatotal" style="border:solid 2px ' . $corPdf . '; background:' . $corPdf . '; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:10px;">
                                <h1 style="display:inline-block; margin:0px; padding:0px; font-size:16px; font-weight:bold; vertical-align:middle">Obras</h1>
                            </div>
                            <div id="tabela" style="border:solid 2px ' . $corPdf . '; border-top:none; height:auto; padding:1px; padding-top:3px; padding-bottom:3px; width:100%; margin-bottom:10px;">';

    $html .= '<table style="width:100%;" cellspacing="0" cellpadding="0"> 
                <thead > 
                    <tr>
                        <th align="center" style="width:150px;"></th>
                        <th align="left"></th>
                    </tr>
                </thead>
                <tbody>';

    $sql = "SELECT o.imagem AS  imagemOriginal, IFNULL(CONCAT(tm.nomeTamanho,' (',REPLACE(tm.altura,'.0',''),'x',REPLACE(tm.largura,'.0',''),')'), 
            IFNULL(CONCAT(ti.nomeTamanho,' (',REPLACE(ti.altura,'.0',''),'x',REPLACE(ti.largura,'.0',''),')'),'- - -')) AS tamanho,
            IFNULL(ar.artista,'- - -') AS artista, o.idOrdemProducaoComp AS codigo, IFNULL(a.nomeAcabamento, '- - -') AS acabamento, e.idEtapa,
            IFNULL(CONCAT(e.etapa, ' - ', e.descricaoEtapa),'') AS etapa,  e.etapa AS etapanumero,
            t.produto AS tipo, IFNULL(b.nomeObra,'- - -') AS obra, o.altura, o.largura,
            o.certificado, o.numeroSerie AS selo, IFNULL(CONCAT('imagens/', t.pasta ,'/',o.imagem),'imagens/semarte.png') AS imagem, o.qtd,
            o.idObra, o.idArtista, o.idTamanho, o.idAcabamento, o.idGrupo, o.idMoldura, o.idProduto, o.obs, o.idTipoProduto, 
            IFNULL(IFNULL(tm.nomeTamanho, ti.nomeTamanho), '- - -') AS nomeTamanho, IFNULL(m.moldura, '') AS moldura, p.nomeProduto
            FROM ordem_producao_comp AS o
            LEFT JOIN etapas AS e ON e.idEtapa =  o.idOPEtapa
            LEFT JOIN tipos_produtos AS t ON t.idTipoProduto = o.idTipoProduto 
            LEFT JOIN produtos AS p ON p.idProduto=o.idProduto
            LEFT JOIN artistas_obras AS b ON b.idArtistaObra = o.idObra
            LEFT JOIN artistas AS ar ON ar.idArtista = b.idArtista
            LEFT JOIN acabamentos AS a ON a.idAcabamento = o.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = o.idTamanho
            LEFT JOIN tamanhos AS ti ON ti.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tm ON tm.idTamanho = o.idTamanho 
            LEFT JOIN molduras AS m ON m.idMoldura = o.idMoldura 
            WHERE o.del = 0 AND idOrdemProducao = " . $_POST['idOrdem'];

    $qtdObras = $db->query( $sql );
    $QTDORDEM = 0;

    while ($linha = $db->fetch()) {

        $QTDORDEM++;
        $html .= '<tr>
                        <td align="center" style="width:150px; border-bottom:1px solid ' . ($qtdObras == 1 ? 'white' : $corPdf) . ';">
                            <img src="http://www.photoarts.com.br/sistema/' . $linha['imagem'] . '" style="width:150px; height:auto; vertical-align:bottom;"/>
                        </td>
                        <td align="left" style="padding-left:5px; border-bottom:1px solid ' . ($qtdObras == 1 ? 'white' : $corPdf) . ';">
                            <b>Tipo: </b>' . $linha['tipo'] . '
                            <br>
                            <b>Artista: </b> ' . $linha['artista'] . '
                            <br>
                            <b>Obra: </b> ' . $linha['obra'] . '
                            <br>
                            <b>Tamanho: </b> ' . $linha['nomeTamanho'] . ' (' . FormatMoeda($linha['altura']) . 'x' . FormatMoeda($linha['largura']) . ')
                            <br>
                            <b>Acabamento: </b> ' . ($linha['acabamento'] == '' ? ' - - -' : $linha['acabamento']) . '
                            <br>
                            <b>Moldura: </b> ' . $linha['moldura'] . '
                            <br>';
        if($linha['qtd'] > 1){

            $html .= '<span style="font-size:14px; color:red;"><b>Qtde: </b>' . $linha['qtd'] . '</span>';
        }else{
            $html .= '<b>Qtde: </b>' . $linha['qtd'];
        }
                            //<b>Qtde: </b> ' . $linha['qtd'] . '
        $html .= '<br>
                <b>Etapa: </b> ' . $linha['etapa'] . '
                </td>';
                        /*<td></td>
                    </tr>';*/

        $html .= '<td style="width:150px; border-bottom:1px solid ' . ($qtdObras == 1 ? 'white' : $corPdf) . ';">';

        $sql = "SELECT ocs.opCompStatus, 
                IFNULL((SELECT 1 FROM ordem_producao_comp_status WHERE idOrdemProducaoComp = " . $linha['codigo'] . " AND idOpCompStatus = ocs.idOpCompStatus LIMIT 1), 0) AS ok
                FROM op_comp_status AS ocs ORDER BY ocs.ordem";

        $db->query( $sql );

        while( $linha2 == $db->fetch() ) {

            $html .= '<input type="checkbox" ' . ($linha2['ok'] == '1' ? 'checked=checked' : '') . '/>
                    <label>' . $linha2['opCompStatus'] . '</label>
                    <br>';
        }

        $html .= '</td></tr>';
    }

    $html .= '</tbody>
            </table></div>';

    /*$qtdObras = mysqli_num_rows($Tb);
    $i = 0;
    while ($linha = mysqli_fetch_assoc($Tb)) {

        $html .= '<div style="width:' . ($qtdObras == 1 ? "99.6%;" : "49.2%;") . ' border:1px solid #6FAEE3; margin-top:5px; ' . ($i > 0 ? "margin-left:5px;" : "margin-left:0px;") . ' display:inline-block; height:auto;">
                    <div style="width: ' . ($qtdObras == 1 ? "100px;" : "30%;") . ' height:auto; position:relative; display:inline-block; vertical-align: ' . ($qtdObras == 1 ? "top;" : "middle;") . ' margin-right:5px; padding:5px;">
                        <img src="http://www.photoarts.com.br/sistema/' . $linha['imagem'] . '" style="width:100%; height:auto; vertical-align:bottom;"/>
                    </div>
                    <div style="width: ' . ($qtdObras == 1 ? "100px;" : "58.8%;") . ' height:auto; position:relative; display:inline-block; vertical-align: ' . ($qtdObras == 1 ? "top;" : "middle;") . ' padding:5px;">
                        <label><b>Tipo: </b>' . $linha['tipo'] . '</label>
                    </div>
                </div>';
        $i++;
    }*/

    //$html .= '</div>';

    $html .= '<div style="min-height:10px;"> </div>
                <div align="right">
                    <div style="border: solid 4px #FFF; text-align:center; width:30%; display:inline-block; vertical-align:top; font-weight:bold; font-size:12px; float:right;">Qtde: <span>' . $QTDORDEM . '</span></div>
                </div>';

    if ($obs != '') {
        $html .= '<div style="border:solid 2px ' . $corPdf . '; height:auto; padding:5px; padding-top:3px; padding-bottom:3px;" >
                    Observações:<br><br>
                    ' . $obs . '
                </div>
                <br>';
    }

    $html .= '  <div style="min-height:10px;"> </div>
                <!--<div style="min-height:10px;"></div>-->
                <br>
                <span style="font-size:13px; font-weight:bold; line-height:22px;">Cotia, ' . $dataAtual . '</span>
                <!--<div style="min-height:50px;"></div>-->
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; display:inline-block; text-align:center; margin-top:45px;">' . $assinatura . '</div>   
                <div style="font-size:13px; font-weight:bold; line-height:22px; width:300px; border-top:2px solid #000; vertical-align:top; float:right; display:inline-block; text-align:center; margin-top:-25px;">Gerência</div>   
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
    /*
    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');
    $pdf->WriteHTML($html);
    $pdf->Output('../ordem-de-producao/ordem-de-producao-' . $_POST['idOrdem'] . '.pdf', 'F');
    $filepath = 'ordem-de-producao/ordem-de-producao-' . $_POST['idOrdem'] . '.pdf';

    echo $filepath;
    */
  
    $options = new Options();
    $options->setDpi(101);

    // instantiate and use the dompdf class  
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml( $html );


    // (Optional) Setup the paper size and orientation (portrait or landscape)
    $dompdf->setPaper('A4', "portrait");

    // Render the HTML as PDF
    $dompdf->render();

    //Gera arquivo para saida PDF
    $output = $dompdf->output();
    
    file_put_contents( '../ordem-de-producao/ordem-de-producao-' . $_POST['idOrdem'] . '.pdf', $output);
    
    $random = rand();

    $filepath = '../ordem-de-producao/ordem-de-producao-' . $_POST['idOrdem'] . '.pdf' . $random;
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
    
    $linha = $db->fetch();
    if ($linha["email"] == "") {
        echo '-1';
        return;
    }

    $email = $linha["email"];
    $fornecedor = $linha["fornecedor"];
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

function MostrarOpCompStatus($ArqT, $idOrdemProducaoComp){

    $sql = "SELECT ocs.idOpCompStatus, ocs.opCompStatus, 
            IFNULL((SELECT 1 FROM ordem_producao_comp_status WHERE idOrdemProducaoComp = " . $idOrdemProducaoComp . " AND idOpCompStatus = ocs.idOpCompStatus LIMIT 1), 0) AS ok
            FROM op_comp_status AS ocs ORDER BY ocs.ordem";
    
    $ArqT->query( $sql );

    if ( $db->n_rows <= 0) {
        return '0';
    }else {
        while ($linha = $ArqT->fetch()) {

            $json[] = array(
                'opCompStatus' => $linha['opCompStatus'],
                'ok' => $linha['ok'],
                'idOpCompStatus' => $linha['idOpCompStatus']
            );
        }
        
        return json_encode($json);
    }
}

function AtualizarStatusOpComp(){

    $db = ConectaDB();

    if($_POST['check'] == '0'){

        $sql = "DELETE FROM ordem_producao_comp_status 
                WHERE idOrdemProducaoComp = " . $_POST['idOrdemProducaoComp'] . " 
                AND idOpCompStatus = " . $_POST['idOpCompStatus'];
        $db->query( $sql );
    }else{

        $sql = "INSERT INTO ordem_producao_comp_status SET 
                idOrdemProducaoComp = " . $_POST['idOrdemProducaoComp'] . ", 
                idOpCompStatus = " . $_POST['idOpCompStatus'];
        $db->query( $sql );
    }
    $db->close();
}
