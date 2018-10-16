<?php

require_once( 'jujuba.php' );
require_once( '../padrao/pdf/tcpdf.php' );
require_once( '../padrao/mpdf/mpdf.php' );

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'EditarOpcional':
            EditarOpcional();
            break;

        case 'ExcluirOpcional':
            ExcluirOpcional();
            break;

        case 'Gravar':
            Gravar();
            break;

        case 'MostrarContratos':
            MostrarContratos();
            break;

        case 'getContrato':
            getContrato();
            break;

        case 'GravarFollowUp':
            GravarFollowUp();
            break;

        case 'MostrarFollowUp':
            MostrarFollowUp();
            break;

        case 'getFollowUp':
            getFollowUp();
            break;

        case 'ExcluirFollowUp':
            ExcluirFollowUp();
            break;

        case 'CancelarContrato':
            CancelarContrato();
            break;

        case 'GravarConvidado':
            GravarConvidado();
            break;

        case 'MostrarListaConvidados':
            MostrarListaConvidados();
            break;

        case 'getConvidado':
            getConvidado();
            break;

        case 'ExcluirConvidado':
            ExcluirConvidado();
            break;

        case 'EnviarConvite':
            EnviarConvite();
            break;

        case 'GerarParcelas':
            GerarParcelas();
            break;

        case 'MostrarParcelas':
            MostrarParcelas();
            break;

        case 'getParcela':
            getParcela();
            break;

        case 'GravarParcela':
            GravarParcela();
            break;

        case 'ExcluirParcela':
            ExcluirParcela();
            break;

        case 'VerificaDataCotacao':
            VerificaDataCotacao();
            break;

        case 'MostraPacoteComposicao':
            MostraPacoteComposicao();
            break;

        case 'MostrarPendenciasContratoDetalhado':
            MostrarPendenciasContratoDetalhado();
            break;

        case 'getItensGrupo':
            getItensGrupo();
            break;

        case 'EscolherItens':
            EscolherItens();
            break;

        case 'VerificaDecoracaoContrato':
            VerificaDecoracaoContrato();
            break;

        case 'getEnderecoNumLocal':
            getEnderecoNumLocal();
            break;

        case 'ExcluirParcelas':
            ExcluirParcelas();
            break;

        case 'GerarPdfContrato':
            GerarPdfContrato();
            break;

        case 'ExcluirPdfContrato':
            ExcluirPdfContrato();
            break;

        case 'getValorPacote':
            getValorPacote();
            break;

        case 'getInfoTipoOpcional':
            getInfoTipoOpcional();
            break;

        case 'EnviarContratoEmail':
            EnviarContratoEmail();
            break;

        case 'VerificaQtdDecoracao':
            VerificaQtdDecoracao();
            break;

        case 'ImprimirReciboPagamento':
            ImprimirReciboPagamento();
            break;

        case 'ImprimirReciboPagamentoTotal':
            ImprimirReciboPagamentoTotal();
            break;

        case 'ConfirmarPagamentoCliente':
            ConfirmarPagamentoCliente();
            break;

        case 'AprovarOpcional':
            AprovarOpcional();
            break;

        case 'SetarOpcionalOk':
            SetarOpcionalOk();
            break;

        case 'MensagemDecoracao':
            MensagemDecoracao();
            break;
    }
}

function ImprimirReciboPagamentoTotal() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT SUM(p.valor) AS total, cl.razaoSocial AS cliente, c.tituloFesta, l.logo,
            l.nomeLocal, c.dataFesta, LEFT(c.horaDe, 5) AS horaDe, LEFT(c.horaAte, 5) AS horaAte 
            FROM contratos_pagamentos AS p
            INNER JOIN contratos AS c ON c.idContrato = p.idContrato
            INNER JOIN clientes AS cl ON cl.idCliente = c.idCliente
            INNER JOIN locais AS l ON l.idLocal = c.idLocal
            WHERE p.idContrato = " . $_POST['codigo'] . " AND p.pago = 1 AND p.del = 0 ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $html = '<html>
                <head>
                    <title>Recibo de Pagamento | Buffet Jujuba</title>
                    <meta charset="UTF-8">
                </head>
                <body>
                    <div style="width:650px; height:300px; padding:20px; border:1px solid black; font-family:arial;">
                        <span style="font-size:30px; margin-top:50px; float:left;">RECIBO</span>
                        <img src="http://buffetmax.com.br/admin/imagens/locais/' . $linha['logo'] . '" style="float:right; width:auto; height:100px;"/>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <p style="line-height:30px; font-size:14px;">Recebemos de <span style="font-weight:bold;">' . $linha['cliente'] . '</span>, a quantia de R$ <span style="font-weight:bold;">' . FormatMoeda($linha['total']) . ' (' . valorPorExtenso($linha['total'], true) . ')</span>, correspondente <span style="font-weight:bold;">a soma de todas parcelas pagas atÃ© o presente momento da festa ' . $linha['tituloFesta'] . ' a ser realizada em ' . FormatData($linha['dataFesta']) . ' das ' . $linha['horaDe'] . 'h Ã s ' . $linha['horaAte'] . 'h</span>, e para clareza firmamos o presente na cidade de <span style="font-weight:bold;">JundiaÃ­</span> no dia <span style="font-weight:bold;">' . dataExtenso(date('Y') . '-' . date('m') . '-' . date('d')) . '</span>.</p>
                        <img src="http://buffetmax.com.br/admin/imagens/assinatura.jpg" style="width:auto; height:80px; margin-left:90px;"/>
                        <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___________________________<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $linha['nomeLocal'] . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contratante
                        </label>   
                    </div>
                </body>
            </html>';

    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');
    $pdf->WriteHTML($html);
    $pdf->Output('../recibos/recibo-total-' . $linha['numeroRecibo'] . '.pdf', 'F');
    echo './recibos/recibo-total-' . $linha['numeroRecibo'] . '.pdf';
}

function EditarOpcional() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_comp SET 
            idOpcional = " . $_POST['idTipoOpcional'] . ", 
            idDecoracao = " . $_POST['idDecoracao'] . ", 
            idCardapioItem = " . $_POST['idCardapioItem'] . ", 
            valor = " . ValorE($_POST['valor']) . ", 
            qtd = " . $_POST['qtd'] . ", 
            valorTotal = " . ValorE($_POST['valorTotal']) . ", 
            dataAtualizacao = NOW(), idUsuarioAtualizacao = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContratoComp = " . $_POST['idOpcional'];

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    mysqli_close($ArqT);
}

function ExcluirOpcional() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_comp SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContratoComp = " . $_POST['idOpcional'];

    mysqli_query($ArqT, $sql);
}

function Gravar() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "SELECT idPacote FROM contratos WHERE idContrato = " . $_POST['idContrato'];
    $Tb = ConsultaSQL($sql, $ArqT);   
    $idPacoteAntigo = mysqli_result($Tb, 0, "idPacote");   

    $sql = "contratos SET 
            dataNascimentoFesta = '" . DataSSql($_POST['nascimento']) . "', 
            idCliente = " . $_POST['idCliente'] . ", 
            contatoCliente = '" . TextoSSql($ArqT, $_POST['contatoCliente']) . "', 
            emailCliente = '" . TextoSSql($ArqT, $_POST['emailCliente']) . "', 
            idLocal = " . $_POST['idLocal'] . ", 
            idPacote = " . $_POST['idPacote'] . ", 
            qtdePagantes = " . $_POST['qtdePagantes'] . ", 
            qtdeNaoPagantes = " . $_POST['qtdeNaoPagantes'] . ", 
            qtdeAdultosPagantes = " . $_POST['qtdeAdultosPagantes'] . ", 
            qtdeCriancasPagantes = " . $_POST['qtdeCriancasPagantes'] . ", 
            qtdeAdultosNaoPagantes = " . $_POST['qtdeAdultosNaoPagantes'] . ", 
            qtdeCriancasNaoPagantes = " . $_POST['qtdeCriancasNaoPagantes'] . ", 
            valorAdicionalPagantes = " . ValorE($_POST['valorAdicionalPagantes']) . ", 
            idDecoracao = " . $_POST['idDecoracao'] . ", 
            idTipoFesta = " . $_POST['idTipoFesta'] . ", 
            tituloFesta = UCASE('" . TextoSSql($ArqT, $_POST['nomeFesta']) . "'), 
            dataFesta = '" . DataSSql($_POST['dataFesta']) . "',
            horaDe = '" . $_POST['horarioDe'] . "',
            horaAte = '" . $_POST['horarioAte'] . "',
            valor = " . ValorE($_POST['valor']) . ",
            valorOpcionais = " . ValorE($_POST['valorOpcionais']) . ",
            percDesconto = " . ValorE($_POST['percentualDesconto']) . ", 
            valorDesconto = " . ValorE($_POST['valorDesconto']) . ",
            valorAcrescimo = " . ValorE($_POST['valorAcrescimo']) . ",
            valorTotal = " . ValorE($_POST['valorTotal']) . ",
            obs = '" . TextoSSql($ArqT, $_POST['obs']) . "', 
            obsInterna = '" . TextoSSql($ArqT, $_POST['obsInterna']) . "' ";
    //motivoAcrescimo = '" . TextoSSql($ArqT, $_POST['motivoAcrescimo']) . "',

    if ($_POST['idContrato'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), 
                idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'] . " 
                WHERE idContrato =" . $_POST['idContrato'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = CONCAT('" . DataSSql($_POST['dataCotacao']) . "', ' ', TIME(NOW())), idUsuarioCadastro = " . $_SESSION['jujuba_codigo'];
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {

        if ($_POST['idContrato'] > 0) {
            $idContrato = $_POST['idContrato'];
        } else {
            $idContrato = UltimoRegistroInserido($ArqT);
            AtualizarCotacao($ArqT, $_POST['idCotacao'], $idContrato);
        }

        $arrayOpcionais = array($_POST['rowDatas'], $_POST['idOpcionais'], $_POST['idDecoracoes'], $_POST['idCardapiosGrupos'], $_POST['idCardapiosItens'], $_POST['valores'], $_POST['qtds'], $_POST['total']);
        GravarCompPacote($ArqT, $idContrato, $_POST['idPacote'], $idPacoteAntigo, ($_POST['idContrato'] > 0 ? true : false));
        GravarOpcionais($ArqT, $idContrato, $arrayOpcionais, $_POST['qtdLinhas'], $_POST['idPacote']);
        GravarPaiMae($ArqT, $idContrato, $_POST['nomeFesta'], $_POST['nomePai'], $_POST['nomeMae'], $_POST['nomeIrmaos'], $_POST['idade'], ($_POST['idContrato'] > 0 ? false : true));
        echo $idContrato;

        // Erros(" Retorno " . $idContrato);
    }

    mysqli_close($ArqT);
}

function GravarCompPacote($ArqT, $idContrato, $idPacote, $idPacoteAntigo, $editar) {

    $pacoteDiferente = false;
    inicia_sessao();
    if ($editar) {

        if ($idPacoteAntigo != $idPacote) {

            $pacoteDiferente = true;

            $sql = "UPDATE contratos_comp SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['jujuba_codigo'] . " 
                    WHERE idContrato = " . $idContrato . " AND idPacote = " . $idPacoteAntigo;

            mysqli_query($ArqT, $sql);
        }
    }

    if (!$editar || $pacoteDiferente) {

        $sql = "INSERT INTO contratos_comp
                SELECT NULL, NOW(), " . $_SESSION['jujuba_codigo'] . " AS cod, " . $idContrato . " AS codCot, " . $idPacote . ", 0, 0, pc.idCardapioGrupo, 
                cgc.idCardapioItem, 0, 1, 0, 0, '0000-00-00 00:00:00', 0, '0000-00-00 00:00:00', 0, 1, 0, '' 
                FROM pacotes AS p
                INNER JOIN pacotes_comp AS pc ON pc.idPacote=p.idPacote
                INNER JOIN cardapio_grupos_comp AS cgc ON cgc.idCardapioGrupo=pc.idCardapioGrupo
                WHERE p.idPacote = " . $idPacote . "
                GROUP BY cgc.idCardapioGrupo, cgc.idCardapioItem";

        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0) {
            Erros($sql);
        }
    }
}

function GravarOpcionais($ArqT, $idContrato, $arrays, $qtdLinhas, $idPacote) {

    inicia_sessao();

    $rowsDatas = explode(",", $arrays[0]);
    $idOpcionais = explode(",", $arrays[1]);
    $idDecoracoes = explode(",", $arrays[2]);
    $idCardapiosGrupos = explode(",", $arrays[3]);
    $idCardapiosItens = explode(",", $arrays[4]);
    $valor = explode(",", $arrays[5]);
    $qtds = explode(",", $arrays[6]);
    $total = explode(",", $arrays[7]);

    for ($i = 0; $i < intval($qtdLinhas); $i++) {

        if ($rowsDatas[$i] <= 0) {

            $sql = "INSERT INTO contratos_comp SET 
                    dataCadastro = NOW(),
                    idUsuarioCadastro = " . $_SESSION['jujuba_codigo'] . ",
                    idContrato = " . $idContrato . ",
                    idPacote = 0,
                    idOpcional = " . $idOpcionais[$i] . ",
                    idDecoracao = " . $idDecoracoes[$i] . ",
                    idCardapioGrupo = " . $idCardapiosGrupos[$i] . ",
                    idCardapioItem = " . $idCardapiosItens[$i] . ",
                    valor = " . floatval($valor[$i]) . ",
                    qtd = " . $qtds[$i] . ",
                    valorTotal = " . floatval($total[$i]);
            mysqli_query($ArqT, $sql);

            if (mysqli_affected_rows($ArqT) <= 0) {
                Erros($sql);
            }
        }
    }
}

function GravarPaiMae($ArqT, $idContrato, $aniversariante, $pai, $mae, $irmaos, $idadeAniversariante, $novo) {

    $idade = explode("anos", $idadeAniversariante);
    if (strpos($idade[1], " completar") > 0) {

        $idade = (intval($idade[0]) - 1);
    } else {
        $idade = intval($idade[0]);
    }

    if ($aniversariante == '' && $pai == '' && $mae == '' && $irmaos == '') {
        return;
    }
    /*
      #ANIVERSARIANTE = 1
      #PAI = 2
      #MÃƒE = 3
      #IRMÃƒO(A) = 4
     */
    inicia_sessao();

    //VERIFICA SE ESTÃ� GRAVADO OS IRMÃƒOS 
    if ($irmaos !== "") {
        $irmao = explode(',', $irmaos);

        $sql = "UPDATE contratos_listas SET del = 2 WHERE idContrato =" . $idContrato . " 
                    AND idTipoConvidado= 4 
                    AND del = 0 ";

        mysqli_query($ArqT, $sql);

        for ($i = 0; $i < count($irmao); $i++) {

            if (trim($irmao[$i]) == "")
                continue;

            $sql = "SELECT COUNT(*) AS total, IFNULL(idContratoLista,0) AS codigo FROM contratos_listas 
                    WHERE idContrato =" . $idContrato . " 
                    AND del = 2
                    AND UCASE(nomeConvidado) LIKE UCASE('" . trim(TextoSSql($ArqT, $irmao[$i])) . "')";

            $Tb = mysqli_query($ArqT, $sql);
            if (mysqli_result($Tb, 0, "total") <= 0) {
                $sql = "INSERT INTO contratos_listas SET del = 0, idContrato =" . $idContrato . ",  
                        idTipoConvidado= 4, nomeConvidado = UCASE('" . trim(TextoSSql($ArqT, $irmao[$i])) . "'), 
                        criancaNaoPagante = 1, dataCadastro=Now(), idUsuarioCadastro = " . $_SESSION['jujuba_codigo'];
            } else {
                $sql = "UPDATE contratos_listas SET del = 0 WHERE idContratoLista = " . mysqli_result($Tb, 0, "codigo");
            }

            mysqli_query($ArqT, $sql);
        }

        $sql = "UPDATE contratos_listas SET del = 1 WHERE idContrato =" . $idContrato . " AND del = 2 ";
        mysqli_query($ArqT, $sql);

        if ($novo) {
            $sql = "UPDATE contratos SET qtdeCriancasNaoPagantes = " . count($irmao) . " WHERE idContrato = " . $idContrato;
            mysqli_query($ArqT, $sql);
        }

        //-----------------
    } else {
        $sql = "UPDATE contratos_listas SET del = 1 WHERE idContrato =" . $idContrato;
        mysqli_query($ArqT, $sql);
    }

    //VERIFICA SE ESTÃ� GRAVADO O ANIVERSARIANTE
    $sql = "SELECT idContratoLista FROM contratos_listas WHERE idContrato =" . $idContrato . " "
            . "AND idTipoConvidado=1 AND del=0 ";

    $Tb = mysqli_query($ArqT, $sql);

    if ($Tb) {
        $linha = mysqli_fetch_assoc($Tb);

        $idContratoNiver = $linha['idContratoLista'];
    } else {
        $idContratoNiver = 0;
    }
    //-----------------
    //VERIFICA SE ESTÃ� GRAVADO O PAI
    $sql = "SELECT idContratoLista FROM contratos_listas WHERE idContrato =" . $idContrato . " "
            . "AND idTipoConvidado=2 AND del=0 ";

    $Tb = mysqli_query($ArqT, $sql);

    if ($Tb) {
        $linha = mysqli_fetch_assoc($Tb);

        $idContratoPai = $linha['idContratoLista'];
    } else {
        $idContratoPai = 0;
    }
    //-----------------
    //VERIFICA SE ESTÃ� GRAVADO A MÃƒE
    $sql = "SELECT idContratoLista FROM contratos_listas WHERE idContrato =" . $idContrato . " "
            . "AND idTipoConvidado=3 AND del=0 ";

    $Tb = mysqli_query($ArqT, $sql);

    if ($Tb) {
        $linha = mysqli_fetch_assoc($Tb);

        $idContratoMae = $linha['idContratoLista'];
    } else {
        $idContratoMae = 0;
    }
    //-----------------

    if ($aniversariante != '') {
        //GRAVA O ANVIVERSARIANTE
        $sql = " contratos_listas SET idContrato =" . $idContrato . ", "
                . "idTipoConvidado=1, nomeConvidado = UCASE('" . TextoSSql($ArqT, $aniversariante) . "'), "
                . "dataAtualizacao=Now(), idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'];


        if ($idade <= 6) {
            $sql .= ", criancaNaoPagante = 1";
        } else {
            $sql .= ", adultoNaoPagante = 1";
        }

        if ($idContratoNiver > 0) {
            $sql = "UPDATE " . $sql . " WHERE idContratoLista =" . $idContratoNiver;
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), idUsuarioCadastro =" . $_SESSION['jujuba_codigo'];
        }

        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) < 0) {
            echo 'ERRO AO GRAVAR ANIVERSARIANTE NA LISTA';
            return;
        }

        if ($novo) {
            $sql = "UPDATE contratos SET qtdeAdultosNaoPagantes = (qtdeAdultosNaoPagantes + 1) WHERE idContrato = " . $idContrato;
            mysqli_query($ArqT, $sql);
        }
        //-----------------------
    }

    if ($pai != '') {
        //GRAVA O PAI
        $sql = " contratos_listas SET idContrato =" . $idContrato . ", "
                . "idTipoConvidado=2, adultoNaoPagante = 1, nomeConvidado = UCASE('" . TextoSSql($ArqT, $pai) . "'), "
                . "dataAtualizacao=Now(), idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'];

        if ($idContratoPai > 0) {
            $sql = "UPDATE " . $sql . " WHERE idContratoLista =" . $idContratoPai;
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), idUsuarioCadastro =" . $_SESSION['jujuba_codigo'];
        }

        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) < 0) {
            echo 'ERRO AO GRAVAR O PAI NA LISTA';
            return;
        }

        if ($novo) {
            $sql = "UPDATE contratos SET qtdeAdultosNaoPagantes = (qtdeAdultosNaoPagantes + 1) WHERE idContrato = " . $idContrato;
            mysqli_query($ArqT, $sql);
        }
        //-----------------------
    }

    if ($mae != '') {
        //GRAVA A MÃƒE
        $sql = " contratos_listas SET idContrato =" . $idContrato . ", "
                . "idTipoConvidado=3, adultoNaoPagante = 1, nomeConvidado = UCASE('" . TextoSSql($ArqT, $mae) . "'), "
                . "dataAtualizacao=Now(), idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'];

        if ($idContratoMae > 0) {
            $sql = "UPDATE " . $sql . " WHERE idContratoLista =" . $idContratoMae;
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), idUsuarioCadastro =" . $_SESSION['jujuba_codigo'];
        }

        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) < 0) {
            echo 'ERRO AO GRAVAR A MÃƒE NA LISTA';
            return;
        }

        if ($novo) {
            $sql = "UPDATE contratos SET qtdeAdultosNaoPagantes = (qtdeAdultosNaoPagantes + 1) WHERE idContrato = " . $idContrato;
            mysqli_query($ArqT, $sql);
        }
        //-----------------------
    }
}

function MostrarContratos() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT c.idContrato, LPAD(c.idContrato, 5, '0') AS contrato, LEFT(c.dataCadastro, 10) AS dataCadastro, c.cancelado, c.idContrato, cl.razaoSocial, 
            l.nomeLocal, p.nomePacote, IFNULL(d.nomeDecoracao,'SEM DECORAÃ‡ÃƒO') AS nomeDecoracao, tf.tipoFesta, c.tituloFesta, CURDATE() AS dataAtual, 
            CONCAT(DATE_FORMAT(c.dataFesta, '%d/%m/%Y'), ' das ', LEFT(c.horaDe, 5), ' as ', LEFT(c.horaAte, 5)) AS dataFesta, c.valor, c.valorOpcionais, 
            c.valorDesconto, c.valorTotal, c.percDesconto, c.contratoImpresso, c.contratoEmail, 
            (SELECT IFNULL(SUM(valorPago), '0.00') FROM contratos_pagamentos WHERE idContrato = c.idContrato LIMIT 1) AS valorPago,
            (SELECT COUNT(*) FROM contratos_pagamentos WHERE idContrato = c.idContrato AND pago = 0 AND dataVencimento < CURDATE() LIMIT 1) AS qtdEmAtraso, 
            HOUR(NOW()) AS horaAtual, c.horaDe, c.dataFesta AS festa
            FROM contratos AS c
            LEFT JOIN clientes AS cl ON cl.idCliente = c.idCliente
            LEFT JOIN locais AS l ON l.idLocal = c.idLocal
            LEFT JOIN pacotes AS p ON p.idPacote = c.idPacote
            LEFT JOIN decoracoes AS d ON d.idDecoracao = c.idDecoracao
            LEFT JOIN tipos_festas AS tf ON tf.idTipoFesta = c.idTipoFesta
            WHERE TRUE ";

    if ($_POST['busca'] !== '') {

        $sql .= " AND (UCASE(cl.razaoSocial) LIKE UCASE('%" . $_POST['busca'] . "%') 
                OR l.nomeLocal LIKE UCASE('%" . $_POST['busca'] . "%')  
                OR p.nomePacote LIKE UCASE('%" . $_POST['busca'] . "%') 
                OR DATE_FORMAT(LEFT(c.dataFesta, 10), '%d/%m/%Y') LIKE '%" . $_POST['busca'] . "%' 
                OR c.idContrato LIKE '" . $_POST['busca'] . "')";
    }

    if ($_POST['situacao'] === '1') {
        $sql .= " AND c.cancelado = 1";
    } else if ($_POST['situacao'] === '2') {
        $sql .= " AND c.cancelado = 0 AND c.dataFesta >= CURDATE() AND IF(c.dataFesta = CURDATE(), HOUR(NOW()) < LEFT(c.horaDe,2), TRUE)";
    } else if ($_POST['situacao'] === '3') {
        $sql .= " AND c.cancelado = 0 AND c.dataFesta <= CURDATE() AND IF(c.dataFesta = CURDATE(), HOUR(NOW()) > LEFT(c.horaDe,2), TRUE)";
    }

    if ($_POST['situacao2'] === '1') {
        $sql .= " HAVING valorPago = c.valorTotal";
    } else if ($_POST['situacao2'] === '2') {
        $sql .= " HAVING valorPago < c.valorTotal";
    }

    $sql .= " ORDER BY c.idContrato DESC, c.dataCadastro DESC " . ($_POST['limite'] == 'true' ? "LIMIT 50" : "");

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($linha['cancelado'] === '1') {
            $situacao = "Festa Cancelada";
        } else {

            if ($linha['festa'] > $linha['dataAtual']) {
                $situacao = "Festa a realizar";
            } else if ($linha['festa'] == $linha['dataAtual']) {
                if (intval($linha['horaAtual']) < intval(substr($linha['horaDe'], 0, 2))) {
                    $situacao = "Festa a realizar";
                } else {
                    $situacao = "Festa realizada";
                }
            } else {
                $situacao = "Festa realizada";
            }
        }

        $json[] = array(
            'idContrato' => $linha['idContrato'],
            'contrato' => $linha['contrato'],
            'dataCadastro' => FormatData($linha['dataCadastro'], true),
            'razaoSocial' => $linha['razaoSocial'],
            'nomeLocal' => $linha['nomeLocal'],
            'nomePacote' => $linha['nomePacote'],
            'nomeDecoracao' => $linha['nomeDecoracao'],
            'tipoFesta' => $linha['tipoFesta'],
            'tituloFesta' => $linha['tituloFesta'],
            'dataFesta' => $linha['dataFesta'],
            'valor' => 'R$ ' . FormatMoeda($linha['valor']),
            'valorOpcionais' => 'R$ ' . FormatMoeda($linha['valorOpcionais']),
            'valorDesconto' => 'R$ ' . FormatMoeda($linha['valorDesconto']) . " (" . FormatMoeda($linha['percDesconto']) . "%)",
            'valorTotal' => 'R$ ' . FormatMoeda($linha['valorTotal']),
            'situacao' => $situacao,
            'arrayOpcionais' => MostrarOpcionais($ArqT, 0, $linha['idContrato']),
            'pendencia' => getPendenciasContrato($ArqT, $linha['idContrato'], 0)
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostrarOpcionais($ArqT, $idCotacao, $idContrato) {

    if ($idCotacao > '0' && $idContrato <= '0') {

        return '0';

        $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, 
            cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, cc.idCardapioGrupo, cc.idCardapioItem, cc.idCotacaoComp, cg.nomeGrupo 
            FROM cotacoes_comp AS cc
            LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
            LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
            LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
            LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
            WHERE cc.idCotacao = " . $idCotacao . " AND cc.idPacote = 0 AND cc.del = 0 GROUP BY cc.idOpcional, cc.idDecoracao, cc.idCardapioItem";
    } else if ($idContrato > '0') {

        $sql = "SELECT IFNULL(o.nomeOpcional, '') AS nomeOpcional, IFNULL(d.nomeDecoracao, '') AS nomeDecoracao, 
                IFNULL(ci.nomeItem, '') AS nomeItem, cc.valor, cc.qtd, cc.valorTotal, cc.idOpcional, cc.idDecoracao, 
                cc.idCardapioGrupo, cc.idCardapioItem, cc.idContratoComp, IFNULL(cg.nomeGrupo, '') AS nomeGrupo, 
                ccs.situacao, cc.ok, o.externo, IFNULL(cc.obsOk, '') AS obsOk 
                FROM contratos_comp AS cc
                LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
                LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
                LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
                LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
                INNER JOIN contratos_comp_situacao AS ccs ON ccs.idContratoCompSituacao = cc.idContratoCompSituacao
                WHERE cc.idContrato = " . $idContrato . " AND cc.idPacote = 0 AND cc.del = 0 ";
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        return '0';
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($linha['nomeOpcional'] !== '') {
            $tipo = 'Opcional';
            $tipoOpcional = $linha['nomeOpcional'];
        } else if ($linha['nomeDecoracao'] !== '') {
            $tipo = 'DecoraÃ§Ã£o';
            $tipoOpcional = $linha['nomeDecoracao'];
        } else if ($linha['nomeItem'] !== '') {
            $tipo = 'Ã�tem CardÃ¡pio';
            $tipoOpcional = 'GRUPO: ' . $linha['nomeGrupo'] . ' - Ã�TEM: ' . $linha['nomeItem'];
        }

        $json[] = array(
            'idCotacaoComp' => $linha['idCotacaoComp'],
            'idContratoComp' => $linha['idContratoComp'],
            'tipo' => $tipo,
            'tipoOpcional' => $tipoOpcional,
            'qtd' => $linha['qtd'],
            'valor' => FormatMoeda($linha['valor']),
            'valorTotal' => FormatMoeda($linha['valorTotal']),
            'idOpcional' => $linha['idOpcional'],
            'idDecoracao' => $linha['idDecoracao'],
            'idCardapioGrupo' => $linha['idCardapioGrupo'],
            'idCardapioItem' => $linha['idCardapioItem'],
            'situacao' => $linha['situacao'],
            'ok' => $linha['ok'],
            'externo' => $linha['externo'],
            'obsOk' => $linha['obsOk']
        );
    }

    return json_encode($json);
}

function getContrato() {

    $ArqT = AbreBancoJujuba();

    if ($_POST['idContrato'] > '0') {

        $sql = "SELECT c.*, LPAD(c.idContrato,5,0) AS codigoContrato, LEFT(c.horaDe, 5) AS horario1, LEFT(c.horaAte, 5) AS horario2, c.valorTotal, 
                (SELECT IFNULL(SUM(valorPago), '0.00') FROM contratos_pagamentos WHERE idContrato = c.idContrato AND del = 0) AS valorPago, 
                CURDATE() AS dataAtual, HOUR(NOW()) AS horaAtual,
                IFNULL(LPAD(co.idCotacao,5,0), 0) AS codigoCotacao, co.idCotacao,
                DATE_FORMAT(c.dataFesta,'%w') AS diasemana,
                (SELECT IFNULL(GROUP_CONCAT(nomeConvidado),'') FROM contratos_listas WHERE idContrato = c.idContrato
                AND idTipoConvidado = 4 AND del = 0) AS irmaos,
                c.qtdeAdultosPagantes, c.qtdeAdultosNaoPagantes, c.qtdeCriancasPagantes, c.qtdeCriancasNaoPagantes
                FROM contratos AS c 
                LEFT JOIN cotacoes AS co ON co.idContrato = c.idContrato
                WHERE c.idContrato = " . $_POST['idContrato'];
    } else if ($_POST['idCotacao'] > '0') {

        $sql = "SELECT *, 0 AS codigoContrato, LPAD(idCotacao,5,0) AS codigoCotacao, '' AS obsInterna, 
                LEFT(horaDe, 5) AS horario1, LEFT(horaAte, 5) AS horario2, 0.00 AS valorPago, 
                CURDATE() AS dataAtual, HOUR(NOW()) AS horaAtual 
                FROM cotacoes WHERE idCotacao = " . $_POST['idCotacao'];
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    if ($linha['cancelado'] === '1') {
        $situacao = "Festa Cancelada";
    } else {

        if ($linha['dataFesta'] > $linha['dataAtual']) {
            $situacao = "Festa a realizar";
        } else if ($linha['dataFesta'] == $linha['dataAtual']) {
            if (intval($linha['horaAtual']) < intval(substr($linha['horaDe'], 0, 2))) {
                $situacao = "Festa a realizar";
            } else {
                $situacao = "Festa realizada";
            }
        } else {
            $situacao = "Festa realizada";
        }
    }

    if ($_POST['idContrato'] > '0') {
        $auxP_M = explode('#', getPaiMaeContrato($ArqT, $_POST['idContrato']));
        $pai = $auxP_M[0];
        $mae = $auxP_M[1];
    } else {
        $pai = '';
        $mae = '';
    }

    $json = array(
        'irmaos' => $linha['irmaos'],
        'nascimento' => FormatData($linha['dataNascimentoFesta'], false),
        'diasemana' => $linha['diasemana'],
        'idCliente' => $linha['idCliente'],
        'idCotacao' => $linha['idCotacao'],
        'codigoContrato' => $linha['codigoContrato'],
        'codigoCotacao' => $linha['codigoCotacao'],
        'contatoCliente' => $linha['contatoCliente'],
        'emailCliente' => $linha['emailCliente'],
        'dataCotacao' => FormatData($linha['dataCadastro'], false),
        'idLocal' => $linha['idLocal'],
        'idPacote' => $linha['idPacote'],
        'idDecoracao' => $linha['idDecoracao'],
        'dataFesta' => FormatData($linha['dataFesta'], false),
        'horaDe' => $linha['horario1'],
        'horaAte' => $linha['horario2'],
        'idTipoFesta' => $linha['idTipoFesta'],
        'tituloFesta' => $linha['tituloFesta'],
        'nomePai' => $pai,
        'nomeMae' => $mae,
        'situacao' => $situacao,
        'valor' => FormatMoeda($linha['valor']),
        'valorOpcionais' => FormatMoeda($linha['valorOpcionais']),
        'percDesconto' => FormatMoeda($linha['percDesconto']),
        'valorDesconto' => FormatMoeda($linha['valorDesconto']),
        'valorAcrescimo' => FormatMoeda($linha['valorAcrescimo']),
        'valorTotal' => FormatMoeda($linha['valorTotal']),
        'idFormaPagamento' => $linha['idFormaPagamento'],
        //'motivoAcrescimo' => $linha['motivoAcrescimo'],
        'obsInterna' => $linha['obsInterna'],
        'obs' => $linha['obs'],
        'idContrato' => $linha['idContrato'],
        'valorPago' => FormatMoeda($linha['valorPago']),
        //'saldoPagar' => FormatMoeda($linha['saldoPagar']),
        'saldoPagar' => FormatMoeda(($linha['valorTotal'] - $linha['valorPago'] < 0 ? '0.00' : $linha['valorTotal'] - $linha['valorPago'])),
        'cancelado' => $linha['cancelado'],
        'arrayOpcionais' => MostrarOpcionais($ArqT, $linha['idCotacao'], $linha['idContrato']),
        'qtdePagantes' => $linha['qtdePagantes'],
        'qtdeNaoPagantes' => $linha['qtdeNaoPagantes'],
        'valorAdicionalPagantes' => FormatMoeda($linha['valorAdicionalPagantes']),
        'qtdeAdultosPagantes' => $linha['qtdeAdultosPagantes'],
        'qtdeAdultosNaoPagantes' => $linha['qtdeAdultosNaoPagantes'],
        'qtdeCriancasPagantes' => $linha['qtdeCriancasPagantes'],
        'qtdeCriancasNaoPagantes' => $linha['qtdeCriancasNaoPagantes']
    );

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getPaiMaeContrato($ArqT, $idContrato) {

    $sql = "SELECT idTipoConvidado, nomeConvidado FROM contratos_listas "
            . "WHERE idContrato =" . $idContrato . " "
            . "AND idTipoConvidado IN(2, 3) AND del=0 "
            . "ORDER BY idTipoConvidado LIMIT 2";

    $Tb = mysqli_query($ArqT, $sql);

    if (!$Tb) {
        return '#';
    } else {
        $texto = '';

        while ($linha = mysqli_fetch_assoc($Tb)) {
            if ($linha['idTipoConvidado'] == '2') {
                $texto = $linha['nomeConvidado'];
            }

            if ($linha['idTipoConvidado'] == '3') {
                $texto .= '#' . $linha['nomeConvidado'];
            }
        }

        return $texto;
    }
}

function GravarFollowUp() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "contatos SET 
            idContrato = " . $_POST['idContrato'] . ", 
            idContatoTipo = " . $_POST['idContatoTipo'] . ", 
            obs = UCASE('" . TextoSSql($ArqT, $_POST['obs']) . "'), 
            dataRetorno = '" . DataSSql($_POST['dataRetorno'], true) . "'";

    if ($_POST['idFollowUp'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), " .
                "idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'] . " " .
                "WHERE idContato =" . $_POST['idFollowUp'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['jujuba_codigo'];
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {

        if ($_POST['idFollowUp'] > 0) {
            $idFollowUp = $_POST['idFollowUp'];
        } else {
            $idFollowUp = UltimoRegistroInserido($ArqT);
        }

        if ($_POST['dataRetorno'] !== '') {
            //GerarAvisoFollowUp($ArqT, $_POST['obs'], $_POST['dataRetorno'], ($_POST['idFollowUp'] > 0 ? $_POST['idAviso'] : 0), $idFollowUp, 'cadastro-de-contratos.html?follow=true&c=' . $_POST['idContrato']);
            GerarAvisoFollowUp($ArqT, $_POST['obs'], $_POST['dataRetorno'], $idFollowUp, 'cadastro-de-contratos.html?follow=true&c=' . $_POST['idContrato']);
        }

        echo $idFollowUp;
    }

    mysqli_close($ArqT);
}

function MostrarFollowUp() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT c.idContato, ct.tipoContato, LEFT(c.dataCadastro, 10) AS dataCadastro, c.obs, LEFT(c.dataRetorno, 10) AS dataRetorno, 
            LEFT(RIGHT(c.dataRetorno, 8), 5) AS horaRetorno 
            FROM contatos AS c
            INNER JOIN contatos_tipos AS ct ON ct.idContatoTipo = c.idContatoTipo
            WHERE c.idContrato = " . $_POST['idContrato'] . " AND c.del = 0 ORDER BY c.dataCadastro";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($linha['dataRetorno'] === '0000-00-00') {
            $dataRetorno = '';
        } else {
            $dataRetorno = FormatData($linha['dataRetorno']) . " Ã s " . $linha['horaRetorno'];
        }

        $json[] = array(
            'idContato' => $linha['idContato'],
            'tipoContato' => $linha['tipoContato'],
            'dataCadastro' => FormatData($linha['dataCadastro'], false),
            'obs' => $linha['obs'],
            'dataRetorno' => $dataRetorno
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getFollowUp() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT idContatoTipo, obs, LEFT(dataRetorno, 16) AS dataRetorno, idAviso 
            FROM contatos 
            WHERE idContato = " . $_POST['idFollowUp'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {

        $linha = mysqli_fetch_assoc($Tb);

        $json = array(
            'idContatoTipo' => $linha['idContatoTipo'],
            'obs' => $linha['obs'],
            'dataRetorno' => FormatData($linha['dataRetorno'], true),
            'idAviso' => $linha['idAviso'],
        );

        echo json_encode($json);
    }

    mysqli_close($ArqT);
}

function ExcluirFollowUp() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contatos SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContato = " . $_POST['idFollowUp'];
    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {

        $sql = "SELECT idAviso FROM contatos WHERE idContato = " . $_POST['idFollowUp'];
        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "idAviso") > 0) {

            $sql = "UPDATE funcionarios_avisos SET 
                    del = 1, 
                    dataDel = NOW(), 
                    idUsuarioDel = " . $_SESSION['jujuba_codigo'] . " 
                    WHERE idFuncionarioAviso = " . mysqli_result($Tb, 0, "idAviso");
            mysqli_query($ArqT, $sql);
        }

        echo '1';
    }

    mysqli_close($ArqT);
}

function AtualizarCotacao($ArqT, $idCotacao, $idContrato) {

    if ($idCotacao > 0) {

        $sql = "UPDATE cotacoes SET idContrato = " . $idContrato . " WHERE idCotacao = " . $idCotacao;
        mysqli_query($ArqT, $sql);

        //  Erros($sql);
    }
}

function CancelarContrato() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos SET cancelado = 1, dataCancelado = NOW(), idUsuarioCancelado = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContrato = " . $_POST['idContrato'];
    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    mysqli_close($ArqT);
}

function GravarConvidado() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "contratos_listas SET 
            idContrato = " . $_POST['idContrato'] . ", 
            idTipoConvidado = " . $_POST['idTipoConvidado'] . ", 
            nomeConvidado = UCASE('" . $_POST['nomeConvidado'] . "'), 
            rgConvidado = '" . $_POST['rg'] . "', 
            idadeConvidado = '" . $_POST['idade'] . "', 
            telConvidado = '" . $_POST['telefone'] . "', 
            emailConvidado = '" . $_POST['email'] . "'";

    if ($_POST['idConvidado'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), " .
                "idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'] . " " .
                "WHERE idContratoLista =" . $_POST['idConvidado'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['jujuba_codigo'];
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {

        if ($_POST['idConvidado'] > 0) {
            $idConvidado = $_POST['idConvidado'];
        } else {
            $idConvidado = UltimoRegistroInserido($ArqT);
        }

        echo $idConvidado;
    }

    mysqli_close($ArqT);
}

function MostrarListaConvidados() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT tc.idTipoConvidado, idContratoLista, tc.tipoConvidado, IF(tc.pagante = 0, 'NÃ£o Pagante', 'Pagante') AS pagante, nomeConvidado, rgConvidado, idadeConvidado, 
            telConvidado, emailConvidado, conviteImpresso, dataConviteImpresso, IFNULL(f.funcionario, '') AS usuarioConviteImpresso, conviteEmail, dataConviteEmail, 
            IFNULL(ff.funcionario, '') AS usuarioConviteEmail
            FROM contratos_listas AS cl 
            INNER JOIN tipos_convidados AS tc ON tc.idTipoConvidado = cl.idTipoConvidado
            LEFT JOIN funcionarios AS f ON f.idFuncionario = cl.idUsuarioConviteImpresso
            LEFT JOIN funcionarios AS ff ON ff.idFuncionario = cl.idUsuarioConviteEmail
            WHERE idContrato = " . $_POST['idContrato'] . " AND cl.del = 0 ORDER BY nomeConvidado";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idTipoConvidado' => $linha['idTipoConvidado'],
            'idContratoLista' => $linha['idContratoLista'],
            'tipoConvidado' => $linha['tipoConvidado'],
            'pagante' => $linha['pagante'],
            'nomeConvidado' => $linha['nomeConvidado'],
            'rgConvidado' => $linha['rgConvidado'],
            'idadeConvidado' => $linha['idadeConvidado'],
            'telConvidado' => $linha['telConvidado'],
            'emailConvidado' => $linha['emailConvidado'],
            'conviteImpresso' => $linha['conviteImpresso'],
            'dataConviteImpresso' => FormatData($linha['dataConviteImpresso'], false),
            'usuarioConviteImpresso' => $linha['usuarioConviteImpresso'],
            'conviteEmail' => $linha['conviteEmail'],
            'dataConviteEmail' => FormatData($linha['dataConviteEmail'], false),
            'usuarioConviteEmail' => $linha['usuarioConviteEmail']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getConvidado() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT idTipoConvidado, nomeConvidado, rgConvidado, idadeConvidado, telConvidado, emailConvidado 
            FROM contratos_listas WHERE idContratoLista = " . $_POST['idConvidado'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {

        $linha = mysqli_fetch_assoc($Tb);

        $json = array(
            'idTipoConvidado' => $linha['idTipoConvidado'],
            'nomeConvidado' => $linha['nomeConvidado'],
            'rgConvidado' => $linha['rgConvidado'],
            'idadeConvidado' => $linha['idadeConvidado'],
            'telConvidado' => $linha['telConvidado'],
            'emailConvidado' => $linha['emailConvidado']
        );

        echo json_encode($json);
    }

    mysqli_close($ArqT);
}

function ExcluirConvidado() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_listas SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContratoLista = " . $_POST['idConvidado'];
    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    mysqli_close($ArqT);
}

function EnviarConvite() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "SELECT c.tituloFesta, c.dataFesta, LEFT(c.horaDe, 5) AS horaDe, LEFT(c.horaAte, 5) AS horaAte, 
            l.idLocal, l.nomeLocal, l.cep, l.endereco, l.numero, l.complemento, l.bairro, l.cidade, l.estado, 
            l.logo, l.telefone1, l.telefone2, l.telefone3, l.email 
            FROM contratos AS c
            INNER JOIN locais AS l ON l.idLocal = c.idLocal
            WHERE idContrato = " . $_POST['idContrato'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $assunto = $linha['nomeLocal'] . " | Convite para " . $linha['tituloFesta'] . " " . FormatData(getServerData(true));

    if ($linha['idLocal'] == '1') {

        $html = '<!DOCTYPE html>
            <html>
                <head>
                    <title>Modelo Convite | Buffet Jujuba</title>
                    <meta charset="UTF-8">
                    <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
                    <!--<link rel="stylesheet" type="text/css" href="http://192.168.0.201/sites/jujuba/css/estilos.css"/>-->
                </head>
                <body>
                    <table width="650" align="center" bgcolor="#A8D147" style="padding:10px; border-bottom:3px solid #805AA3">
                        <tr align="center">
                            <td valign="top">
                                <!--<img src="http://192.168.0.201/sites/jujuba/admin/imagens/locais/' . $linha['logo'] . '" width="auto" height="270"/>-->
                                <img src="http://www.criodigital.net/jujuba/admin/imagens/locais/' . $linha['logo'] . '" width="auto" height="270"/>
                            </td>
                        </tr>
                    </table>
                    <table width="650" align="center" style="padding:20px; font-family:foo; color:#805AA3; border-top:2px solid #805AA3" bgcolor="#A8D147">
                        <tr align="center">
                            <td valign="top">
                                <span style="font-size:35px;">' . $_POST['nomeConvidado'] . '</span>
                                <br>
                                <br>
                                <span style="font-size:25px">Sua presenÃ§a Ã© muito especial no meu aniverÃ¡rio.</span>
                                <br>
                                <span style="font-size:19px">Que serÃ¡ comemorado no dia ' . FormatData($linha['dataFesta']) . ' das: ' . $linha['horaDe'] . ' Ã s ' . $linha['horaAte'] . 'hs.</span>
                            </td>
                        </tr>
                    </table>
                    <table width="650" align="center" style="padding:30px; color:#FFF; font-size:13px; font-family:Arial, Helvetica, sans-serif;" bgcolor="#805AA3">
                        <tr align="left">
                            <td valign="top">
                                ' . $linha['endereco'] . ', ' . $linha['numero'] . '
                                <br>
                                ' . $linha['bairro'] . ' - CEP: ' . $linha['cep'] . ' - ' . $linha['cidade'] . '/' . $linha['estado'] . '
                                <br>
                                <br>
                                ' . $linha['telefone1'] . ' ' . ($linha['telefone2'] != '' ? '/' : '') . ' ' . $linha['telefone2'] . ' ' . ($linha['telefone3'] != '' ? '/' : '') . ' ' . $linha['telefone3'] . '
                                <br>
                                ' . $linha['email'] . '
                                <br>
                                <br>
                                www.buffetjujuba.com
                                <!--<img src="http://192.168.0.201/sites/jujuba/imagens/googlemaps.png" title="Clique aqui para ver a localizaÃ§Ã£o" style="float:right; margin-top:-110px; cursor:pointer"/>-->
                            </td>
                        </tr>
                    </table>
                </body>
            </html>';
    } else {

        $html = '<!DOCTYPE html>
                <html>
                    <head>
                        <title>Modelo Convite | Buffet Jujuba</title>
                        <meta charset="UTF-8">
                        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
                        <!--<link rel="stylesheet" type="text/css" href="http://192.168.0.201/sites/jujuba/css/estilos.css"/>-->
                    </head>
                    <body>
                        <table width="650" align="center" bgcolor="white" style="padding:10px; border:2px solid #805AA3">
                            <tr align="center">
                                <td valign="top">
                                    <img src="http://192.168.0.201/sites/jujuba/admin/imagens/locais/' . $linha['logo'] . '" width="auto" height="235"/>
                                </td>
                            </tr>
                        </table>
                        <table width="650" align="center" style="padding:20px; font-family:foo; color:#805AA3; border:2px solid #805AA3; border-top:2px solid #805AA3;" bgcolor="white">
                            <tr align="center">
                                <td valign="top">
                                    <span style="font-size:35px;">' . $_POST['nomeConvidado'] . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:24px">Sua presenÃ§a Ã© muito especial no meu aniversÃ¡rio. </span>
                                    <br>
                                    <span style="font-size:19px">Que serÃ¡ comemorado no dia ' . FormatData($linha['dataFesta']) . ' das: ' . $linha['horaDe'] . ' Ã s ' . $linha['horaAte'] . 'hs.</span>
                                </td>
                            </tr>
                        </table>
                        <table width="650" align="center" style="padding:30px; color:#FFF; font-size:13px; font-family:Arial, Helvetica, sans-serif;" bgcolor="#805AA3">
                            <tr align="left">
                                <td valign="top">
                                    ' . $linha['endereco'] . ', ' . $linha['numero'] . '
                                <br>
                                ' . $linha['bairro'] . ' - CEP: ' . $linha['cep'] . ' - ' . $linha['cidade'] . '/' . $linha['estado'] . '
                                <br>
                                <br>
                                ' . $linha['telefone1'] . ' ' . ($linha['telefone2'] != '' ? '/' : '') . ' ' . $linha['telefone2'] . ' ' . ($linha['telefone3'] != '' ? '/' : '') . ' ' . $linha['telefone3'] . '
                                <br>
                                ' . $linha['email'] . '
                                <br>
                                <br>
                                www.buffetjujuba.com
                                <!--<img src="http://192.168.0.201/sites/jujuba/imagens/googlemaps.png" title="Clique aqui para ver a localizaÃ§Ã£o" style="float:right; margin-top:-110px; cursor:pointer"/>-->
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>';
    }

    $mensagem = '
                <html>
                    <head>
                        <title>Convite | Buffet Jujuba</title>
                        <meta charset="UTF-8">
                        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid #805AA3">
                            <tr align="center">
                                <td valign="top">
                                    <img src="http://192.168.0.201/sites/jujuba/admin/imagens/locais/' . $linha['logo'] . '" width="auto" height="200"/>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family:Arial; color:#805AA3; border:2px solid #805AA3; border-top:0px solid #805AA3;" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:25px;">OlÃ¡, ' . $_POST['nomeConvidado'] . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:20px">Segue em anexo seu convite para ' . $linha['tituloFesta'] . '.</span>
                                    <br>
                                    <br>';

    if ($linha['idLocal'] == '1') {
        $mensagem .= "<label><a href='https://goo.gl/maps/8wsdD' target='_blank'>Clique aqui</a> para ver o local da festa.</label>";
    } else {
        $mensagem .= "<label><a href='https://goo.gl/maps/gO0Ne' target='_blank'>Clique aqui</a> para ver o local da festa.</label>";
    }

    $mensagem .= '</td>
                            </tr>
                        </table>
                    </body>
                </html>';

    $pdf = new TCPDF('P', 'mm', 'A3', true, 'UTF-8', false);
    $pdf->AddPage('P');
    $fontname = $pdf->addTTFfont('../css/fontes/foo.ttf', 'TrueTypeUnicode', '', 32);
    $pdf->SetFont($fontname);
    $pdf->writeHTML($html);
    $pdf->Output('../convites/convite-' . $_POST['idContrato'] . '-' . $linha['tituloFesta'] . '-' . $_POST['idConvidado'] . '.pdf', 'F');

    if (EnvioDeEmailsJujuba($ArqT, $_POST['nomeConvidado'], $_POST['emailConvidado'], 'siscrio@criodigital.com.br', 'Buffet Jujuba', '', '', 'siscrio@criodigital.com.br', 'Buffet Jujuba', $assunto, $mensagem, '../convites/convite-' . $_POST['idContrato'] . '-' . $linha['tituloFesta'] . '-' . $_POST['idConvidado'] . '.pdf')) {

        $sql = "UPDATE contratos_listas SET 
                conviteEmail = 1, 
                dataConviteEmail = NOW(), 
                idUsuarioConviteEmail = " . $_SESSION['jujuba_codigo'] . " 
                WHERE idContratoLista = " . $_POST['idConvidado'];
        mysqli_query($ArqT, $sql);
        mysqli_close($ArqT);

        unlink('../convites/convite-' . $_POST['idContrato'] . '-' . $linha['tituloFesta'] . '-' . $_POST['idConvidado'] . '.pdf');
        echo '1';
    } else {
        echo '0';
    }
}

/* function GerarParcelas(){

  inicia_sessao();
  $ArqT = AbreBancoJujuba();

  $datasVencimento = explode(",", $_POST['dataVencimento']);
  $count = 0;

  for($i = 0; $i < count($datasVencimento); $i++){

  $sql = "INSERT INTO contratos_pagamentos SET
  dataCadastro = NOW(),
  idUsuarioCadastro = " . $_SESSION['jujuba_codigo'] . ",
  idContrato = " . $_POST['idContrato'] . ",
  parcela = " . ($i + 1) . ",
  obs = '',
  dataVencimento = '" . DataSSql($datasVencimento[$i], false) . "',
  valor = " . ValorE($_POST['valorParcelas']) . "";

  mysqli_query($ArqT, $sql);

  if(mysqli_affected_rows($ArqT) > 0){
  $count++;
  }
  }

  if($count === count($datasVencimento)){
  echo '1';
  }else{
  echo '0';
  }

  mysqli_close($ArqT);
  } */

function GerarParcelas() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    if ($_POST['rowData'] <= 0) {

        $sql = "INSERT INTO contratos_pagamentos SET 
                dataCadastro = NOW(), 
                idUsuarioCadastro = " . $_SESSION['jujuba_codigo'] . ", 
                idContrato = " . $_POST['idContrato'] . ", 
                parcela = " . $_POST ['numParcela'] . ", 
                obs = '" . TextoSSql($ArqT, $_POST['obs']) . "',
                dataVencimento = '" . DataSSql($_POST['dataVencimento'], false) . "', 
                valor = " . ValorE($_POST['valor']);

        if ($_POST['pago'] == '1') {

            $sql .= ", pago = " . $_POST['pago'] . ", valorPago = " . ValorE($_POST['valorPago']) . ", idFormaPagamento = " . $_POST['idFormaPagamento'] . ", 
                dataPagamento = NOW(), idUsuarioPagamento = " . $_SESSION['jujuba_codigo'];
        }

        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) > 0) {
            echo '1';
        } else {
            echo '0';
        }

        mysqli_close($ArqT);
    }

    /* $sql = "INSERT INTO contratos_pagamentos SET 
      dataCadastro = CURDATE(),
      idUsuarioCadastro = " . $_SESSION['codigo'] . ",
      idAssinatura = " . $_POST['idAssinatura'] . ",
      numParcela = " . $_POST ['numParcela'] . ",
      dataVencimento = '" . DataSSql($_POST['dataVencimento']) . "',
      pago = 0,
      valor = " . ValorE($_POST['valor']) . ""; */
}

function MostrarParcelas() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT cp.idContratoPagamento, cp.parcela, cp.dataVencimento, cp.valor, cp.pago, cp.valorPago, 
            cp.dataPagamento, CURDATE() AS dataAtual, IFNULL(f.funcionario, '') AS usuarioPagamento, 
            IFNULL(fp.formaPagamento, '') AS formaPagamento, cp.obs, cp.confirmadaAdmin, cp.incluidaCliente 
            FROM contratos_pagamentos AS cp 
            LEFT JOIN funcionarios AS f ON f.idFuncionario = cp.idUsuarioPagamento
            LEFT JOIN formas_pagamentos AS fp ON fp.idFormaPagamento = cp.idFormaPagamento
            WHERE cp.idContrato = " . $_POST['idContrato'] . " AND cp.del = 0 
            ORDER BY cp.parcela";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($linha['pago'] === '1') {
            $situacao = "Pago em " . FormatData($linha['dataPagamento']) . " por " . $linha['usuarioPagamento'];
        } else {

            if ($linha['dataVencimento'] < $linha['dataAtual']) {
                $situacao = "Vencido";
            } else {

                if ($linha['incluidaCliente'] == '1' && $linha['confirmadaAdmin'] == '0') {
                    $situacao = 'Confirmar Parcela';
                } else {
                    $situacao = "Em aberto";
                }
            }
        }

        $json[] = array(
            'idContratoPagamento' => $linha['idContratoPagamento'],
            'parcela' => $linha['parcela'],
            'dataVencimento' => FormatData($linha['dataVencimento']),
            'valor' => FormatMoeda($linha['valor']),
            'pago' => $linha['pago'],
            'valorPago' => FormatMoeda($linha['valorPago']),
            'situacao' => $situacao,
            'formaPagamento' => $linha['formaPagamento'],
            'obs' => $linha['obs'],
            'confirmadaAdmin' => $linha['confirmadaAdmin'],
            'incluidaCliente' => $linha['incluidaCliente']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function getParcela() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT parcela, dataVencimento, valor, pago, valorPago, idFormaPagamento, obs 
            FROM contratos_pagamentos WHERE idContratoPagamento = " . $_POST['idParcela'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {

        $linha = mysqli_fetch_assoc($Tb);

        $json = array(
            'parcela' => $linha['parcela'],
            'dataVencimento' => FormatData($linha['dataVencimento']),
            'valor' => FormatMoeda($linha['valor']),
            'pago' => $linha['pago'],
            'valorPago' => FormatMoeda($linha['valorPago']),
            'idFormaPagamento' => $linha['idFormaPagamento'],
            'obs' => $linha['obs']
        );

        echo json_encode($json);
    }

    mysqli_close($ArqT);
}

function GravarParcela() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "contratos_pagamentos SET 
            idContrato = " . $_POST['idContrato'] . ", 
            parcela = " . $_POST['numeroParcela'] . ", 
            dataVencimento = '" . DataSSql($_POST['vencimento']) . "', 
            valor = " . ValorE($_POST['valor']) . ", 
            pago = " . $_POST['pago'] . ",             
            obs = UCASE('" . TextoSSql($ArqT, $_POST['obs']) . "')";

    if ($_POST['pago'] === '1' || $_POST['desfazerPago'] === '1') {

        $sql .= ", idFormaPagamento = " . $_POST['formaPagamento'] . ", 
                valorPago = " . ValorE($_POST['valorPago']) . ", 
                dataPagamento = CURDATE(), 
                idUsuarioPagamento = " . $_SESSION['jujuba_codigo'] . "";
    }

    if ($_POST['idParcela'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), " .
                "idUsuarioAtualizacao =" . $_SESSION['jujuba_codigo'] . " " .
                "WHERE idContratoPagamento =" . $_POST['idParcela'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['jujuba_codigo'];
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {

        if ($_POST['idParcela'] > 0) {
            $idParcela = $_POST['idParcela'];
        } else {
            $idParcela = UltimoRegistroInserido($ArqT);

            /* if($_POST['pago'] == '1') {
              $sql = "UPDATE contratos SET valorTotal = (valorTotal - " . ValorE($_POST['valorPago']) . ") WHERE idContrato = " . $_POST['idContrato'];
              mysqli_query($ArqT, $sql);
              } */

            //$sql = "UPDATE contratos SET valorTotal = (valorTotal + " . ($_POST['pago'] === '1' ? ValorE($_POST['valorPago']) : ValorE($_POST['valor'])) . ") WHERE idContrato = " . $_POST['idContrato'];
            //mysqli_query($ArqT, $sql);
        }

        echo $idParcela;
    }

    mysqli_close($ArqT);
}

function ExcluirParcela() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_pagamentos SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContratoPagamento = " . $_POST['idParcela'];
    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    mysqli_close($ArqT);
}

function VerificaDataCotacao() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT COUNT(*) AS contador 
            FROM contratos 
            WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
            AND (horaDe BETWEEN '" . $_POST['horaDe'] . "' AND '" . $_POST['horaAte'] . "')
            AND cancelado = 0 AND idContrato <> " . $_POST['idContrato'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, 'contador') >= '1') {
        echo '1';
        mysqli_close($ArqT);
        return;
    }

    $sql = "SELECT COUNT(*) AS contador 
            FROM contratos 
            WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
            AND (horaAte BETWEEN '" . $_POST['horaDe'] . "' AND '" . $_POST['horaAte'] . "')
            AND cancelado = 0 AND idContrato <> " . $_POST['idContrato'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, 'contador') >= '1') {
        echo '-1';
        mysqli_close($ArqT);
        return;
    }

    $sql = "SELECT COUNT(*) AS contador
            FROM contratos 
            WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
            AND
            (
                (
                    (horaDe BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $_POST['horaDe'] . "')
                    OR (horaDe BETWEEN '" . $_POST['horaDe'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
                ) OR ( 
                    (horaAte BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $_POST['horaDe'] . "')
                    OR (horaAte BETWEEN '" . $_POST['horaDe'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
		)
		OR (horaDe BETWEEN '" . $_POST['horaDe'] . "' AND '" . $_POST['horaAte'] . "')
            )
            AND cancelado = 0 AND idContrato <> " . $_POST['idContrato'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, 'contador') >= '1') {
        echo '2';
        mysqli_close($ArqT);
        return;
    }

    $sql = "SELECT COUNT(*) AS contador
            FROM contratos 
            WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
            AND
            (
		(
                    (horaAte BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $_POST['horaAte'] . "')
                    OR (horaAte BETWEEN '" . $_POST['horaAte'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
		) OR ( 
                    (horaDe BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $_POST['horaAte'] . "')
                    OR (horaDe BETWEEN '" . $_POST['horaAte'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($_POST['dataFesta']) . "', ' " . $_POST['horaAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
		)
		OR (horaDe BETWEEN '" . $_POST['horaDe'] . "' AND '" . $_POST['horaAte'] . "')
            )
            AND cancelado = 0 AND idContrato <> " . $_POST['idContrato'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, 'contador') >= '1') {
        echo '-2';
        mysqli_close($ArqT);
        return;
    }

    echo '0';
    mysqli_close($ArqT);

    /* $sql = "SELECT COUNT(*) AS totalDiaTodo 
      FROM contratos
      WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "'
      AND horaDe >= '15:00:00' AND horaDe <= '16:00:00' AND horaAte <= '21:00:00'
      AND cancelado = 0 AND idContrato <> " . $_POST['idContrato'];

      $Tb = ConsultaSQL($sql, $ArqT);

      if (mysqli_result($Tb, 0, "totalDiaTodo") >= '1') {
      echo '-1';
      return;
      }

      $sql = "SELECT getNovoPeriodo('" . $_POST['horaDe'] . "', '" . $_POST['horaAte'] . "') AS periodo";
      $Tb = ConsultaSQL($sql, $ArqT);

      if (mysqli_result($Tb, 0, "periodo") == '000') {
      echo '-2';
      return;
      }

      //$sql = "SELECT COUNT(*) AS total FROM contratos
      // WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "'
      // AND (horaDe BETWEEN '" . $_POST['horaDe'] . "' AND '" . $_POST['horaAte'] . "'
      // OR horaAte BETWEEN '" . $_POST['horaDe'] . "' AND '" . $_POST['horaAte2'] . "')
      // AND idContrato <> " . $_POST['idContrato'];

      $horaDePadrao1 = date("H:i", strtotime('18:00'));
      $horaAtePadrao1 = date("H:i", strtotime('23:00'));
      $horaDePadrao2 = date("H:i", strtotime('11:00'));
      $horaAtePadrao2 = date("H:i", strtotime('17:00'));

      $horaDe = date("H:i", strtotime($_POST['horaDe']));
      $horaAte = date("H:i", strtotime($_POST['horaAte']));

      $sql = "SELECT COUNT(*) AS total FROM contratos
      WHERE idLocal = " . $_POST['idLocal'] . " AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "'";

      if ($horaDe >= $horaDePadrao1 && $horaAte <= $horaAtePadrao1) {
      $sql .= " AND (horaDe >= '18:00' AND horaAte <= '23:00')";
      } else if ($horaDe >= $horaDePadrao2 && $horaAte <= $horaAtePadrao2) {
      $sql .= " AND (horaDe >= '11:00' AND horaAte <= '17:00')";
      }

      $sql .= " AND cancelado = 0 AND idContrato <> " . $_POST['idContrato'];

      $Tb = ConsultaSQL($sql, $ArqT);

      if (mysqli_result($Tb, 0, "total") <= 0) {
      echo '0';
      } else {
      echo '1';
      }

      mysqli_close($ArqT); */
}

function MostraPacoteComposicao() {

    $ArqT = AbreBancoJujuba();

    if ($_POST['idContrato'] > '0') {
        $sql = "SELECT cc.idCardapioGrupo, cg.nomeGrupo, cc.idCardapioItem, ci.nomeItem 
                FROM contratos_comp AS cc
                INNER JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
                INNER JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
                WHERE idContrato = " . $_POST['idContrato'] . " ORDER BY cg.nomeGrupo";
    } else {

        $sql = "SELECT cg.nomeGrupo, ci.nomeItem 
                FROM pacotes_comp AS pc 
                INNER JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = pc.idCardapioGrupo 
                INNER JOIN cardapio_grupos_comp AS cgc ON cgc.idCardapioGrupo = cg.idCardapioGrupo 
                INNER JOIN cardapio_itens AS ci ON ci.idCardapioItem = cgc.idCardapioItem 
                WHERE pc.idPacote = " . $_POST['idPacote'] . " AND pc.del = 0 ORDER BY cg.nomeGrupo";
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'nomeGrupo' => $linha['nomeGrupo'],
            'nomeItem' => $linha['nomeItem']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function MostrarPendenciasContratoDetalhado() {

    $ArqT = AbreBancoJujuba();
    echo getPendenciasContratoDetalhado($ArqT, $_POST['idContrato'], $_POST['idCotacao']);
}

function getItensGrupo() {

    $ArqT = AbreBancoJujuba();

    if ($_POST['grupo'] == 'DECORAÃ‡ÃƒO ESCOLHIDA' || $_POST['grupo'] == 'DECORAÃ‡ÃƒO') {

        $sql = "SELECT dataFesta, CONCAT((LEFT(horaDe, 2) - 2), RIGHT(horaDe, 6)) AS horaDe, 
                CONCAT((LEFT(horaAte, 2) + 2), RIGHT(horaAte, 6)) AS horaAte, idLocal 
                FROM contratos WHERE idContrato = " . $_POST['idContrato'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (!$Tb) {
            echo '0';
            return;
        } else {

            $dataFesta = mysqli_result($Tb, 0, "dataFesta");
            $horaDe = mysqli_result($Tb, 0, "horaDe");
            $horaAte = mysqli_result($Tb, 0, "horaAte");
            $idLocal = mysqli_result($Tb, 0, "idLocal");
        }

        $sql = "SELECT d.idDecoracao AS idCardapioItem, d.nomeDecoracao, d.imagem, 
                IFNULL((SELECT cc.qtd FROM contratos_comp AS cc
                INNER JOIN contratos AS c ON c.idContrato = cc.idContrato
                WHERE c.cancelado = 0 AND cc.del = 0 AND c.dataFesta = '" . $dataFesta . "' 
                AND (c.horaDe BETWEEN '" . $horaDe . "' AND '" . $horaAte . "' OR c.horaAte BETWEEN '" . $horaDe . "' AND '" . $horaAte . "') 
                AND cc.idDecoracao = d.idDecoracao AND c.idLocal = " . $idLocal . "), 0) AS qtdDecoracoesContratoComp,
                (SELECT COUNT(*) FROM contratos WHERE cancelado = 0 
                AND dataFesta = '" . $dataFesta . "' 
                AND (horaDe BETWEEN '" . $horaDe . "' AND '" . $horaAte . "' OR horaAte BETWEEN '" . $horaDe . "' AND '" . $horaAte . "') 
                AND idDecoracao = d.idDecoracao AND idLocal = " . $idLocal . ") AS qtdDecoracoesContrato,
                (SELECT IF(qtdDecoracoesContratoComp >= d.qtd OR qtdDecoracoesContrato >= d.qtd, ' (IndisponÃ­vel)', CONCAT(' (', d.qtd, IF(d.qtd = 1, ' disponÃ­vel', ' disponÃ­veis'), ')'))) AS situacao
                FROM decoracoes AS d WHERE d.ativo = 1 ORDER BY d.nomeDecoracao";

        /* $sql = "SELECT idDecoracao AS idCardapioItem, nomeDecoracao AS nomeItem 
          FROM decoracoes WHERE ativo = 1 ORDER BY nomeDecoracao"; */
    } else {

        $sql = "SELECT cgc.idCardapioItem, ci.nomeItem FROM cardapio_grupos_comp AS cgc 
                INNER JOIN cardapio_itens AS ci ON ci.idCardapioItem = cgc.idCardapioItem
                WHERE cgc.idCardapioGrupo = " . $_POST['idGrupo'];
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $nomeItem = '';
    while ($linha = mysqli_fetch_assoc($Tb)) {

        if ($_POST['grupo'] == 'DECORAÃ‡ÃƒO ESCOLHIDA' || $_POST['grupo'] == 'DECORAÃ‡ÃƒO') {

            $nomeItem = $linha['nomeDecoracao'] . $linha['situacao'];
        } else {
            $nomeItem = $linha['nomeItem'];
        }

        $json[] = array(
            'idCardapioItem' => $linha['idCardapioItem'],
            'nomeItem' => $nomeItem
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function EscolherItens() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $idItens = explode(",", $_POST['idItens']);
    $count = 0;

    if ($_POST['grupo'] == 'DECORAÃ‡ÃƒO ESCOLHIDA' || $_POST['grupo'] == 'DECORAÃ‡ÃƒO') {

        $sql = "UPDATE contratos SET idDecoracao = " . $_POST['idDecoracao'] . " WHERE idContrato = " . $_POST['idContrato'];
        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) > 0) {
            echo '1';

            $sql = "INSERT INTO funcionarios_avisos SET 
                    dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['jujuba_codigo'] . ", idFuncionario=0, dataAviso=DATE(NOW()), horaAviso=TIME(NOW()), 
                    descricao='O funcionÃ¡rio " . $_SESSION['jujuba_funcionario'] . " fez alteraÃ§Ãµes na decoraÃ§Ã£o no contrato NÂº " . $_POST['idContrato'] . "', link='cadastro-de-contratos.html?c=" + $_POST['idContrato'] + "'";

            mysqli_query($ArqT, $sql);
        } else {
            echo '0';
        }
    } else {

        $sql = "UPDATE contratos_escolhas SET 
                del = 1, 
                dataDel = NOW(), 
                idUsuarioDel = " . $_SESSION['jujuba_codigo'] . "
                WHERE idCardapioGrupo = " . $_POST['idGrupo'] . " AND idContrato = " . $_POST['idContrato'];
        mysqli_query($ArqT, $sql);

        for ($i = 0; $i < count($idItens); $i++) {

            $sql = "INSERT INTO contratos_escolhas SET 
                    dataEscolha = NOW(), 
                    idUsuarioEscolha = " . $_SESSION['jujuba_codigo'] . ", 
                    idContrato = " . $_POST['idContrato'] . ", 
                    idCardapioGrupo = " . $_POST['idGrupo'] . ", 
                    idCardapioItem = " . $idItens[$i];

            mysqli_query($ArqT, $sql);

            if (mysqli_affected_rows($ArqT) > 0) {
                $count++;

                $sql = "INSERT INTO funcionarios_avisos SET 
                        dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['jujuba_codigo'] . ", idFuncionario=0, dataAviso=DATE(NOW()), horaAviso=TIME(NOW()), 
                        descricao='O funcionÃ¡rio " . $_SESSION['jujuba_funcionario'] . " fez alteraÃ§Ãµes nas pendÃªncias no contrato NÂº " . $_POST['idContrato'] . "', link='cadastro-de-contratos.html?c=" + $_POST['idContrato'] + "'";

                mysqli_query($ArqT, $sql);
            }
        }

        if ($count === count($idItens)) {
            echo '1';
        } else {
            echo '0';
        }
    }

    mysqli_close($ArqT);
}

function VerificaDecoracaoContrato() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT 
	    (SELECT cc.qtd FROM contratos_comp AS cc
		INNER JOIN contratos AS c ON c.idContrato = cc.idContrato
		WHERE  c.cancelado = 0 AND cc.del = 0 AND c.dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
                AND (c.horaDe BETWEEN '" . $_POST['horaDe2'] . "' AND '" . $_POST['horaAte2'] . "' OR c.horaAte BETWEEN '" . $_POST['horaDe2'] . "' AND '" . $_POST['horaAte2'] . "') AND cc.idDecoracao = " . $_POST['idDecoracao'] . ") AS qtdCotacoesDecoracaoComp,
            (SELECT COUNT(*) FROM contratos WHERE cancelado = 0 
                AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
                AND (horaDe BETWEEN '" . $_POST['horaDe2'] . "' AND '" . $_POST['horaAte2'] . "' OR horaAte BETWEEN '" . $_POST['horaDe2'] . "' AND '" . $_POST['horaAte2'] . "') AND idDecoracao = " . $_POST['idDecoracao'] . ") AS qtdCotacoesDecoracao,
            (SELECT qtd FROM decoracoes WHERE idDecoracao = " . $_POST['idDecoracao'] . ") AS qtdDecoracao, 
            (SELECT IF(qtdCotacoesDecoracao >= qtdDecoracao OR qtdCotacoesDecoracaoComp >= qtdDecoracao OR IF(qtdCotacoesDecoracao = 0, " . $_POST['qtd'] . ", qtdCotacoesDecoracao + " . $_POST['qtd'] . ") > qtdDecoracao, 'NÃ£o', 'Sim')) AS podeDecoracao";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, "podeDecoracao") == 'NÃ£o') {

        $sql = "SELECT cl.razaoSocial AS nomeCliente, l.nomeLocal, 
                c.dataCadastro FROM contratos AS c 
                INNER JOIN contratos_comp AS cc ON cc.idContrato = c.idContrato
                INNER JOIN clientes AS cl ON cl.idCliente = c.idCliente
                INNER JOIN locais AS l ON l.idLocal = c.idLocal
                WHERE c.cancelado=0 AND cc.del=0 AND dataFesta = '" . DataSSql($_POST['dataFesta']) . "' 
                AND (horaDe BETWEEN '" . $_POST['horaDe2'] . "' AND '" . $_POST['horaAte2'] . "' 
                    OR horaAte BETWEEN '" . $_POST['horaDe2'] . "' AND '" . $_POST['horaAte2'] . "') 
                AND (cc.idDecoracao = " . $_POST['idDecoracao'] . " OR c.idDecoracao = " . $_POST['idDecoracao'] . ") 
                GROUP BY c.idContrato";

        $Tb = ConsultaSQL($sql, $ArqT);

        if (!$Tb) {
            echo '1';
            mysqli_close($ArqT);
            return;
        }

        while ($linha = mysqli_fetch_assoc($Tb)) {

            $json[] = array(
                'nomeCliente' => $linha['nomeCliente'],
                'nomeLocal' => $linha['nomeLocal'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false)
            );
        }

        echo json_encode($json);
    } else {
        echo '0';
    }

    mysqli_close($ArqT);
}

function getEnderecoNumLocal() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT CONCAT(endereco, ', ', numero) AS endereco FROM locais WHERE idLocal = " . $_POST['idLocal'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {

        echo mysqli_result($Tb, 0, "endereco");
    }

    mysqli_close($ArqT);
}

function ExcluirParcelas() {

    inicia_sessao();

    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_pagamentos SET del = 1, dataDel = NOW(), idUsuarioDel = "
            . $_SESSION['jujuba_codigo'] . " 
           WHERE idContrato = " . $_POST['idContrato'];
    mysqli_query($ArqT, $sql);
}

function GerarPdfContrato() {

    $ArqT = AbreBancoJujuba();

    //Pega os opcionais
    $sql = "SELECT IFNULL(LCASE(o.nomeOpcional), '') AS nomeOpcional, IFNULL(LCASE(d.nomeDecoracao), '') AS nomeDecoracao, 
            IFNULL(LCASE(ci.nomeItem), '') AS nomeItem, cc.qtd, cc.valorTotal 
            FROM contratos_comp AS cc
            LEFT JOIN opcionais AS o ON o.idOpcional = cc.idOpcional
            LEFT JOIN decoracoes AS d ON d.idDecoracao = cc.idDecoracao
            LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem = cc.idCardapioItem
            LEFT JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cc.idCardapioGrupo
            WHERE cc.idContrato = " . $_POST['idContrato'] . " AND cc.idPacote = 0 AND cc.del = 0 
            AND cc.idContratoCompSituacao = 1 GROUP BY cc.idOpcional, cc.idDecoracao, cc.idCardapioItem";

    $Tb = ConsultaSQL($sql, $ArqT);

    $arrayOpcionais = array();
    $arrayDecoracoes = array();
    $arrayItens = array();
    $arrayOpcionaisQtds = array();
    $arrayOpcionaisValores = array();

    while ($linha = mysqli_fetch_assoc($Tb)) {
        array_push($arrayOpcionais, $linha['nomeOpcional']);
        array_push($arrayDecoracoes, $linha['nomeDecoracao']);
        array_push($arrayItens, $linha['nomeItem']);
        array_push($arrayOpcionaisQtds, $linha['qtd']);
        array_push($arrayOpcionaisValores, $linha['valorTotal']);
    }

    //Pega as pendencias
    $sql = "SELECT LCASE(cg.nomeGrupo) AS nomeGrupo, IFNULL(GROUP_CONCAT(LCASE(ci.nomeItem) SEPARATOR ', '), '') AS itens, '' AS valor
            FROM contratos AS c 
            INNER JOIN contratos_comp AS cc ON c.idContrato=cc.idContrato
            INNER JOIN cardapio_grupos AS cg ON cc.idCardapioGrupo=cg.idCardapioGrupo
            LEFT JOIN contratos_escolhas AS ce ON ce.idContrato=cc.idContrato AND ce.del=0 
            AND ce.idCardapioGrupo=cc.idCardapioGrupo 
            AND ce.idCardapioItem=cc.idCardapioItem
            LEFT JOIN cardapio_itens AS ci ON ci.idCardapioItem=ce.idCardapioItem
            WHERE cc.idContrato= " . $_POST['idContrato'] . "
            AND cc.idPacote > 0
            AND cg.requerEscolha=1
            GROUP BY cc.idCardapioGrupo
            UNION
            SELECT 'decoraÃ§Ã£o' AS nomeGrupo, IFNULL(LCASE(d.nomeDecoracao), '') AS itens, d.valorDecoracaoAvulsa AS valor 
            FROM contratos AS c 
            LEFT JOIN decoracoes AS d USING(idDecoracao)
            WHERE c.idContrato = " . $_POST['idContrato'];

    $Tb = ConsultaSQL($sql, $ArqT);
    $arrayPendenciasItens = array();
    $arrayPendenciasGrupos = array();
    $arrayPendenciasValores = array();

    while ($linha = mysqli_fetch_assoc($Tb)) {
        array_push($arrayPendenciasGrupos, $linha['nomeGrupo']);
        array_push($arrayPendenciasItens, $linha['itens']);
        array_push($arrayPendenciasValores, $linha['valor']);
    }

    //Pega informaÃ§Ãµes do contrato
    $sql = 'SELECT c.razaoSocial AS nome, c.cpfCNPJ, c.telefone1, c.telefone2, c.telefone3, 
            c.email, c.email2, c.email3, c.endereco AS enderecoCliente, 
            c.numero, c.complemento, c.bairro, c.cidade, c.estado, l.nomeLocal AS nomeLocal, p.nomePacote, CURDATE() AS data, 
            l.endereco AS enderecoLocal, l.numero AS numeroLocal, l.complemento AS complementoLocal, l.bairro AS bairroLocal, l.cidade AS cidadeLocal, 
            l.estado AS estadoLocal, l.logo, co.dataFesta, LEFT(co.horaDe, 5) AS horaDe, LEFT(co.horaAte, 5) AS horaAte, p.qtdPagantes, p.qtdNaoPagantes, 
            LEFT(p.duracaoFesta, 5) AS duracaoFesta, p.valorAdicionalDiaFesta, co.valorAdicionalPagantes, co.valor, co.valorOpcionais, co.percDesconto, 
            co.valorDesconto, co.valorAcrescimo, co.valorTotal, SUBDATE(co.dataFesta, INTERVAL 7 DAY) AS dataLiquidado, co.qtdePagantes, co.idLocal, 
            (SELECT GROUP_CONCAT(LCASE(ci.nomeItem) ORDER BY ci.nomeItem SEPARATOR ", ") AS itens
            FROM pacotes_comp AS pc
            INNER JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = pc.idCardapioGrupo
            INNER JOIN cardapio_grupos_comp AS cgc ON cgc.idCardapioGrupo = cg.idCardapioGrupo
            INNER JOIN cardapio_itens AS ci ON ci.idCardapioItem = cgc.idCardapioItem
            WHERE pc.idPacote = p.idPacote) AS itensPacote, co.valorTotal 
            FROM contratos AS co
            INNER JOIN clientes AS c  ON c.idCliente = co.idCliente 
            INNER JOIN locais AS l ON co.idLocal = l.idLocal
            INNER JOIN pacotes AS p ON co.idPacote = p.idPacote
            WHERE co.idContrato = ' . $_POST['idContrato'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);
    $idLocal = $linha['idLocal'];

    $telefone = $linha['telefone1'];

    if ($linha['telefone2'] != '') {

        $telefone .= ' | ' . $linha['telefone2'];
    }

    if ($linha['telefone3'] != '') {
        $telefone .= ' | ' . $linha['telefone3'];
    }

    if (substr($telefone, 0, 3) == ' | ') {
        $telefone = str_replace(' | ', '', $telefone);
    }

    $email = $linha['email'];

    if ($linha['email2'] != '') {
        $email .= ' | ' . $linha['email2'];
    }

    if ($linha['email3'] != '') {
        $email .= ' | ' . $linha['email3'];
    }

    if (substr($email, 0, 3) == ' | ') {
        $email = str_replace(' | ', '', $email);
    }

    if ($linha['enderecoCliente'] == '') {
        $endereco = '';
    } else {
        $endereco = $linha['enderecoCliente'] . ', ' . $linha['numero'];
    }

    if ($linha['complemento'] != '') {

        $endereco .= ' ' . $linha['complemento'];
    }

    $endereco .= ' - ' . $linha['bairro'] . ' - ' . $linha['cidade'] . '/' . $linha['estado'];

    $enderecoLocal = $linha['enderecoLocal'] . ', ' . $linha['numeroLocal'];

    if ($linha['complementoLocal'] != '') {

        $enderecoLocal .= ' ' . $linha['complementoLocal'];
    }

    $enderecoLocal .= ' - ' . $linha['bairroLocal'] . ', ' . $linha['cidadeLocal'] . '/' . $linha['estadoLocal'];

    //$enderecoLocal = $linha['enderecoLocal'] . ', ' . $linha['numeroLocal'] . ' - ' . $linha['bairroLocal'] . ' / ' . $linha['cidadeLocal'];

    $html = '<!DOCTYPE html>
<html>
    <head>
        <title>Contrato - Buffet Jujuba</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin-left:3cm; margin-right:2cm; margin-top:0px; padding-top:0px; font-family:Arial; text-align:justify; font-size:10.2px;">
        <div>
            <img src="../imagens/locais/' . $linha['logo'] . '" width="140" height="90" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;<label style="font-size:20px; font-weight:bold;">CONTRATO NÂ° ' . number_format_complete($_POST['idContrato'], '0', 5, true) . '</label>
            <p style="margin-top:0px;">' . $linha['nomeLocal'] . ', com sede na ' . $enderecoLocal . ', inscrita no CNPJ 18.229.109/0001-60, realizarÃ¡ o evento contratado de prestaÃ§Ã£o de serviÃ§os de buffet regendo as seguintes clÃ¡usulas:</p>
            <p>
                ClÃ¡usula 1Âª: O serviÃ§o do Buffet terÃ¡ inÃ­cio a partir do horÃ¡rio combinado conforme estabelecido no contrato, o salÃ£o serÃ¡ disponibilizado ao contratante e eventuais profissionais 15 (quinze) minutos antes do horÃ¡rio estabelecido, sendo certo que os serviÃ§os somente serÃ£o iniciados no horÃ¡rio contratado. O Buffet encerrarÃ¡ o serviÃ§o no horÃ¡rio estabelecido no contrato, terÃ¡ tolerÃ¢ncia de 20 minutos apÃ³s encerramento. SerÃ¡ cobrado uma taxa de 15% do valor total da festa caso ultrapasse o tempo de tolerÃ¢ncia.
            </p>
            <p>
                ClÃ¡usula 2Âª: O Buffet obriga-se a garantir a qualidade de seus serviÃ§os e estarÃ¡ preparado para atender atÃ© 10% a mais sob o nÃºmero de pagantes contratados, caso o nÃºmero de pagantes exceda 10% o Buffet nÃ£o se responsibilizarÃ¡ pela perda de qualidade nos serviÃ§os oferecidos. O contratante deverÃ¡ informar ao Buffet o nÃºmero exato de convidados especificando adultos, crianÃ§as pagantes e nÃ£o pagantes.
            </p>
            <p>
                ClÃ¡usula 3Âª: Caso exceda o nÃºmero de pagantes contratados, serÃ¡ cobrado ao tÃ©rmino da festa o valor do adicional estipulado na negociaÃ§Ã£o e o pagamento deverÃ¡ ser Ã  vista. NÃ£o serÃ£o devolvidos e nem serÃ£o compensados valores se houver comparecimento de um nÃºmero menor de convidados contratados.
            </p>
            <p>
                ClÃ¡usula 4Âª: Se houver alteraÃ§Ã£o para um nÃºmero maior de convidados, avisar com 10 dias de antecedÃªncia e realizar o pagamento do mesmo. Produtos e serviÃ§os opcionais devem ser acrescentados ao contrato no mÃ­nimo 30 dias antes do evento para que haja tempo hÃ¡bil para as contrataÃ§Ãµes e devidas providÃªncias, passado esse prazo poderemos analisar se hÃ¡ possibilidade de acrescentar produtos e serviÃ§os opcionais.
            </p>
            <p>
                ClÃ¡usula 5Âª: Caso o contratante solicite o cancelamento da festa independente do motivo, o Buffet ficarÃ¡ com multa de 25% do valor total do contrato se notificado 30 dias antes do evento, se for notificado no prazo inferior a 30 dias o Buffet nÃ£o restituirÃ¡ quaisquer valores pago.
            </p>
            <p>
                ClÃ¡usula 6Âª: Se o contratante desejar alterar a data e/ou o horÃ¡rio de realizaÃ§Ã£o do evento, deverÃ¡ comunicar o Buffet com antecedÃªncia mÃ­nima de 45 dias, que procederÃ¡ a alteraÃ§Ã£o, desde que haja disponibilidade na agenda. A transferÃªncia do evento serÃ¡ possÃ­vel desde que nÃ£o haja reserva para o dia e horÃ¡rio desejados. Se a transferÃªncia for solicitada no prazo inferior a 45 dias, incidirÃ¡ uma taxa de 25% sobre o valor total do contrato.
            </p>
            <p>
                ClÃ¡usula 7Âª: O nÃ£o pagamento total ou parcial de quaisquer das parcelas, serÃ¡ interpretado como desistÃªncia do evento, acarretando o seu imediato cancelamento, independente de qualquer aviso ou notificaÃ§Ã£o.
            </p>
            <p>
                ClÃ¡usula 8Âª: O Buffet nÃ£o serÃ¡ responsabilizado por problemas advindos de falhas dos serviÃ§os pÃºblicos, tais como ' . ($linha['nomeLocal'] == 'ESPAÃ‡O JUJUBA' ? '' : 'energia elÃ©trica,') . ' Ã¡gua, gÃ¡s, e etc. Caso haja acidente de qualquer natureza durante o evento sem a ocorrÃªncia de culpa ou dolo do Buffet, este nÃ£o terÃ¡ nenhuma responsabilidade, podendo, se entender necessÃ¡rio prestar a assistÃªncia cabÃ­vel. O Buffet nÃ£o se responsabiliza por objetos esquecidos ou perdidos durante ou apÃ³s a realizaÃ§Ã£o do evento.
            </p>
            <p>
                ClÃ¡usula 9Âª: O Buffet realiza periodicamente a manutenÃ§Ã£o preventiva dos brinquedos elÃ©tricos ou eletrÃ´nicos, porÃ©m, nÃ£o serÃ¡ responsabilizado por brinquedos ou aparelhos que tenham quebrado de um evento para outro, sem tempo hÃ¡bil para manutenÃ§Ã£o, nestes casos, o Buffet se reserva o direito do nÃ£o funcionamento de atÃ© 10% dos equipamentos eletrÃ´nicos oferecidos na locaÃ§Ã£o do salÃ£o, se ocorrer a quebra o Buffet irÃ¡ oferecer uma cortesia no dia da festa como restituiÃ§Ã£o.
            </p>
            <p>
                ClÃ¡usula 10Âª: A utilizaÃ§Ã£o do espaÃ§o fÃ­sico e dos brinquedos estÃ¡ incluÃ­da no pacote juntamente com equipe de monitores, garÃ§onetes, recepcionista e pessoal de cozinha. Exceto por algumas atraÃ§Ãµes opcionais que tem custo adicional e tempo de duraÃ§Ã£o especÃ­fico para o serviÃ§o, como por exemplo camarim duraÃ§Ã£o de 3 horas, consulte.
            </p>
            <p>
                ClÃ¡usula 11Âª: DecoraÃ§Ã£o do tema estÃ¡ sujeita a disponibilidade. OpÃ§Ãµes de decoraÃ§Ã£o terceirizada tem custo adicional, consultar.
            </p>
            <p>
                ClÃ¡usula 12Âª: Hora do parabÃ©ns serÃ¡ sempre 1 hora antes de terminar a festa. No caso de festa com 5 horas de duraÃ§Ã£o o parabÃ©ns serÃ¡ 1 hora e 15 minutos antes do tÃ©rmino da festa.
            </p>
            <p>
                ClÃ¡usula 13Âª: Pagantes serÃ£o considerados a partir de 6 anos, serÃ¡ cortesia crianÃ§as atÃ© 5 anos no limite de 25 crianÃ§as. Pai, MÃ£e, Aniversariantes e atÃ© dois irmÃ£os serÃ£o cortesia. O contratante tem o direito de trazer dois profissionais externos sem custo, alÃ©m desse nÃºmero cada profissional serÃ¡ cobrado como pagante adicional no valor estabelecido neste contrato.
            </p>
            <p>
                ClÃ¡usula 14Âª: As lembrancinhas serÃ£o fornecidas apenas para crianÃ§as atÃ© 12 anos, serÃ¡ um pirulito de chocolate personalizado com o logo do Buffet ou produto equivalente.
            </p>
            <p>
                ClÃ¡usula 15Âª: Caso haja algum dano na decoraÃ§Ã£o ou no salÃ£o, o valor serÃ¡ cobrado de acordo com o valor da peÃ§a.
            </p>
            <p>
                ClÃ¡usula 16Âª: NÃ£o fornecemos alimentos e nem sobras de bolo e docinhos para os convidados levarem, pois nÃ£o nos responsabilizamos pelo manuseio e ingestÃ£o dos alimentos ao sair do Buffet.
            </p>';

    if ($idLocal == '1') {

        $html .= '<p>
                    ClÃ¡usula 17Âª: NÃ£o dispomos de gerador de energia, portanto em queda de energia elÃ©trica, somente as luzes de emergÃªncia ficarÃ£o acesas e em funcionamento somente os brinquedos que nÃ£o sÃ£o eletrÃ´nicos.
                </p>';
    }

    $html .= '<h4>Dados do Contratante</h4>
            <p>
<strong>Nome:</strong> ' . $linha['nome'] . ' <strong>CPF:</strong> ' . $linha['cpfCNPJ'] . '
                <br>
<strong>Telefones:</strong> ' . $telefone . ' <br>
<strong>Emails:</strong> ' . $email . ' <br>
<strong>EndereÃ§o:</strong> ' . $endereco . '
            </p>
            <h4>Dados da Festa</h4>
            <p>
<strong>Unidade:</strong> ' . $linha['nomeLocal'] . ' <strong><label> (' . $enderecoLocal . ')</label><br>Pacote:</strong> ' . $linha['nomePacote'] . ' <strong>Qtde. de Pagantes:</strong> ' . $linha['qtdePagantes'] . '
<br>
<strong>Data:</strong> ' . FormatData($linha['dataFesta']) . ' <strong>HorÃ¡rio:</strong> ' . $linha['horaDe'] . ' Ã s ' . $linha['horaAte'] . 'h
            ';

    $qtdPendencias = 0;
    for ($i = 0, $tamanho = count($arrayPendenciasItens); $i < $tamanho; $i++) {

        if ($arrayPendenciasItens[$i] != '') {
            $qtdPendencias++;
        }
    }

    if ($qtdPendencias > 0) {

        $html .= '<br /><strong>Itens escolhidos:</strong><label>';

        $aux = '';
        $nomeGrupo = '';
        for ($i = 0, $tamanho = count($arrayPendenciasItens); $i < $tamanho; $i++) {

            if ($arrayPendenciasItens[$i] != '') {

                if ($nomeGrupo != $arrayPendenciasGrupos[$i]) {
                    $nomeGrupo = $arrayPendenciasGrupos[$i];

                    $aux .= $arrayPendenciasGrupos[$i] . ': <i><b>' . $arrayPendenciasItens[$i] . '</b></i>; ';
                    //$aux .= $arrayPendenciasGrupos[$i] . ': ' . $arrayPendenciasItens[$i] . ($arrayPendenciasGrupos[$i] == 'decoraÃ§Ã£o' ? '' : ' (Valor: R$' . (FormatMoeda($arrayPendenciasValores[$i]))) . '; ';
                }
            }
        }

        $aux = substr($aux, 0, -2);
        $html .= '&nbsp;&nbsp;<label>' . $aux . '</label>';
    }

    $qtdOpcionais = 0;
    for ($i = 0, $tamanho = count($arrayOpcionais); $i < $tamanho; $i++) {

        if ($arrayOpcionais[$i] != '' || $arrayDecoracoes[$i] != '' || $arrayItens[$i] != '') {
            $qtdOpcionais++;
        }
    }

    if ($qtdOpcionais > 0) {

        $html .= '<br><strong>Itens opcionais adquiridos:</strong>
                        <label>';

        $aux = '';
        for ($i = 0, $tamanho = count($arrayOpcionais); $i < $tamanho; $i++) {

            if ($arrayOpcionais[$i] != '') {

                $aux .= $arrayOpcionais[$i] . ' (Qtde: ' . $arrayOpcionaisQtds[$i] . ' - Valor: R$' . FormatMoeda($arrayOpcionaisValores[$i]) . ')' . '; ';
            }

            if ($arrayDecoracoes[$i] != '') {

                $aux .= $arrayDecoracoes[$i] . ' (Qtde: ' . $arrayOpcionaisQtds[$i] . ' - Valor: R$' . FormatMoeda($arrayOpcionaisValores[$i]) . ')' . '; ';
            }

            if ($arrayItens[$i] != '') {

                $aux .= $arrayItens[$i] . ' (Qtde: ' . $arrayOpcionaisQtds[$i] . ' - Valor: R$' . FormatMoeda($arrayOpcionaisValores[$i]) . ')' . '; ';
            }
        }

        $aux = substr($aux, 0, -2);
        $html .= '&nbsp;<label>' . $aux . '</label>';
        $html .= '</label>';
    }

    $html .= '</p>';

    $html .= '<p><strong>Valor:</strong> R$ ' . FormatMoeda($linha['valor']) . '';

    if ($linha['valorAdicionalPagantes'] != '0.00') {

        $html .= ' &nbsp;<strong>Valor Adic. Pagantes:</strong> R$ ' . FormatMoeda($linha['valorAdicionalPagantes']);
    }

    if ($linha['valorOpcionais'] != '0.00') {

        $html .= ' &nbsp;<strong>Valor Opcionais:</strong> R$ ' . FormatMoeda($linha['valorOpcionais']);
    }

    if ($linha['valorDesconto'] != '0.00') {

        $html .= ' &nbsp;<strong>Valor Desconto:</strong> R$ ' . FormatMoeda($linha['valorDesconto']) . ' (' . FormatMoeda($linha['percDesconto']) . '%)';
    }

    if ($linha['valorAcrescimo'] != '0.00') {

        $html .= ' &nbsp;<strong>Valor AcrÃ©scimo:</strong> R$ ' . FormatMoeda($linha['valorAcrescimo']);
    }

    if ($linha['valorTotal'] != '') {

        $html .= ' &nbsp;<strong>Valor Total:</strong> R$ ' . FormatMoeda($linha['valorTotal']);
    }

    if ($_POST['valorPago'] != '0,00') {

        $html .= ' &nbsp;<strong>Valor Pago:</strong> R$ ' . $_POST['valorPago'];
    }

    if ($_POST['saldoPagar'] != '0,00') {

        $html .= ' &nbsp;<strong>Saldo Ã  Pagar:</strong> R$ ' . $_POST['saldoPagar'];

        $html .= ' (a ser liquidado atÃ© ' . FormatData($linha['dataLiquidado']) . ')';
    }

    if ($_POST['obs'] != '') {

        $html .= ' </p><h4>ObservaÃ§Ãµes</h4><label>' . $_POST['obs'];
    }

    //- <strong>Valor Adic. Pagantes:</strong> R$' . FormatMoeda($linha['valorAdicionalPagantes']) . ' - <strong>Valor Opcionais:</strong> R$' . FormatMoeda($linha['valorOpcionais']) . ' <br><strong>Valor Desconto:</strong> R$' . FormatMoeda($linha['valorDesconto']) . ' (' . FormatMoeda($linha['percDesconto']) . '%)
    //     - <strong>Valor AcrÃ©scimo:</strong> R$' . FormatMoeda($linha['valorAcrescimo']) . ' - <strong>Valor Total:</strong> R$' . FormatMoeda($linha['valorTotal']) . ' (a ser liquidado atÃ© ' . FormatData($linha['dataLiquidado']) . ') - <strong>Valor Pago:</strong> R$' . $_POST['valorPago'] . ' - <strong>Saldo Ã  Pagar: </strong> R$' . $_POST['saldoPagar'] . '
    $html .= '</label>
            <br><br><br>
<label>Por estarem assim justos e contratados firmam o presente instrumento:
            </label>
<p>JundiaÃ­, ' . dataExtenso($linha['data']) . '
            </p>
            <img src="../imagens/assinatura.jpg" width="140" height="60" />
            <label>___________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___________________________<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CONTRATADA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CONTRATANTE</label>
        </div>
    </body>
</html>';

    $pdf = new TCPDF('P', 'cm', 'A4', true, 'UTF-8', false);
    $pdf->AddPage('P');
    $pdf->writeHTML($html);

    if (file_exists('../contratos/contrato-' . $_POST['idContrato'] . '.pdf')) {
        unlink('../contratos/contrato-' . $_POST['idContrato'] . '.pdf');
    }

    $pdf->Output('../contratos/contrato-' . $_POST['idContrato'] . '.pdf', 'F');
    $filepath = 'contratos/contrato-' . $_POST['idContrato'] . '.pdf';

    echo $filepath;
    return;
}

function ExcluirPdfContrato() {

    $filename = '../' . $_POST['file_link'];

    if (file_exists($filename)) {
        unlink($filename);
    } else {
        echo '1';
    }
}

function EnviarContratoEmail() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "SELECT IF(cl.fantasia = '', cl.razaoSocial, cl.fantasia) AS fantasia, l.logo, c.tituloFesta, 
            IFNULL(l.telefone1, '') AS telefone1, IFNULL(l.telefone2, '') AS telefone2, 
            IFNULL(l.telefone3, '') AS telefone3, IFNULL(l.email, '') AS email, 
            IFNULL(cl.email, '') AS emailCliente, IFNULL(cl.email2, '') AS emailCliente2, IFNULL(cl.email3, '') AS emailCliente3 
            FROM contratos AS c
            INNER JOIN clientes AS cl USING(idCliente)
            INNER JOIN locais AS l USING(idLocal)
            WHERE c.idContrato = " . $_POST['idContrato'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $assunto = "Contrato NÂ° " . number_format_complete($_POST['idContrato'], '0', 5) . " | Buffet Jujuba " . FormatData(getServerData(true));

    $mensagem = '
                <html>
                    <head>
                        <title>Contrato | Buffet Jujuba</title>
                        <meta charset="UTF-8">
                        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
                    </head>
                    <body>
                        <table width="600" align="center" bgcolor="white" style="padding:10px; border:2px solid #805AA3">
                            <tr align="center">
                                <td valign="top">
                                    <!--<img src="http://192.168.0.201/sites/jujuba/admin/imagens/locais/' . $linha['logo'] . '" width="auto" height="200"/>-->
                                    <img src="http://buffetmax.com.br/admin/imagens/locais/' . $linha['logo'] . '" width="auto" height="200" style="display:block"/>
                                </td>
                            </tr>
                        </table>
                        <table width="600" align="center" style="padding:20px; font-family:Arial; color:#805AA3; border:2px solid #805AA3; border-top:0px solid #805AA3;" bgcolor="white">
                            <tr align="left">
                                <td valign="top">
                                    <span style="font-size:25px;">OlÃ¡, ' . $linha['fantasia'] . '</span>
                                    <br>
                                    <br>
                                    <span style="font-size:20px">Segue em anexo o contrato da sua festa: ' . $linha['tituloFesta'] . '.</span>
                                    <p>Se possuir alguma dÃºvida com relaÃ§Ã£o ao contrato entre em contato conosco.</p>
                                    <p>Contatos:</p>';

    if ($linha['telefone1'] != '') {

        $mensagem .= $linha['telefone1'];
    }

    if ($linha['telefone2'] != '') {
        $mensagem .= '<br>' . $linha['telefone2'];
    }

    if ($linha['telefone3'] != '') {
        $mensagem .= '<br>' . $linha['telefone3'];
    }

    if ($linha['email'] != '') {

        $mensagem .= '<br> Email: ' . $linha['email'];
    }

    $mensagem .= '</td>
                            </tr>
                        </table>
                    </body>
                </html>';

    if (!file_exists('../contratos/contrato-' . $_POST['idContrato'] . '.pdf')) {
        echo '-1';
        mysqli_close($ArqT);
        return;
    }

    $contrato = '../contratos/contrato-' . $_POST['idContrato'] . '.pdf';

    $confEnvio = 0;

    if ($linha['emailCliente'] != '') {
        if (EnvioDeEmailsJujuba($ArqT, $linha['fantasia'], $linha['emailCliente'], 'siscrio@criodigital.com.br', 'Buffet Jujuba', '', '', 'siscrio@criodigital.com.br', 'Buffet Jujuba', $assunto, $mensagem, $contrato)) {
            $confEnvio = 1;
        }
    }

    if ($linha['emailCliente2'] != '') {
        if (EnvioDeEmailsJujuba($ArqT, $linha['fantasia'], $linha['emailCliente2'], 'siscrio@criodigital.com.br', 'Buffet Jujuba', '', '', 'siscrio@criodigital.com.br', 'Buffet Jujuba', $assunto, $mensagem, $contrato)) {
            $confEnvio = 1;
        }
    }

    if ($linha['emailCliente3'] != '') {
        if (EnvioDeEmailsJujuba($ArqT, $linha['fantasia'], $linha['emailCliente3'], 'siscrio@criodigital.com.br', 'Buffet Jujuba', '', '', 'siscrio@criodigital.com.br', 'Buffet Jujuba', $assunto, $mensagem, $contrato)) {
            $confEnvio = 1;
        }
    }

    if ($confEnvio == 1) {

        $sql = "UPDATE contratos SET 
                contratoEmail = 1, 
                dataContratoEmail = NOW(), 
                idUsuarioContratoEmail = " . $_SESSION['jujuba_codigo'] . " 
                WHERE idContrato = " . $_POST['idContrato'];
        mysqli_query($ArqT, $sql);

        echo '1';
    } else {
        echo '0';
    }

    mysqli_close($ArqT);
}

function getValorPacote() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT valorPacote, qtdPagantes, qtdNaoPagantes, valorAdicionalAntesFesta, 
            valorAdicionalDiaFesta, LEFT(duracaoFesta, 5) AS duracaoFesta 
            FROM pacotes WHERE idPacote = " . $_POST['idPacote'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {

        $linha = mysqli_fetch_assoc($Tb);

        $json = array(
            'valorPacote' => FormatMoeda($linha['valorPacote']),
            'qtdPagantes' => $linha['qtdPagantes'],
            'qtdNaoPagantes' => $linha['qtdNaoPagantes'],
            'valorAdicionalAntesFesta' => FormatMoeda($linha['valorAdicionalAntesFesta']),
            'valorAdicionalDiaFesta' => FormatMoeda($linha['valorAdicionalDiaFesta']),
            'duracaoFesta' => $linha['duracaoFesta'],
        );

        echo json_encode($json);
    }

    mysqli_close($ArqT);
}

function getInfoTipoOpcional() {

    $ArqT = AbreBancoJujuba();

    if ($_POST['tipo'] === '1') {

        $sql = "SELECT o.valorOpcional AS valor, otv.opcionalTipoValor AS 'tipoValor', 0 AS idCardapioGrupo
                FROM opcionais AS o
                INNER JOIN opcionais_tipo_valor AS otv ON otv.idOpcionalTipoValor = o.idOpcionalTipoValor
                WHERE o.idOpcional = " . $_POST['idTipo'];
    } else if ($_POST['tipo'] === '2') {

        $sql = "SELECT valorDecoracaoAvulsa AS valor, '' AS tipoValor, 0 AS idCardapioGrupo FROM decoracoes 
                WHERE idDecoracao = " . $_POST['idTipo'];
    } else {

        $sql = "SELECT '' AS valor, '' AS tipoValor, cg.idCardapioGrupo 
                FROM cardapio_itens AS ci
                INNER JOIN cardapio_grupos_comp AS cgc ON cgc.idCardapioItem = ci.idCardapioItem
                INNER JOIN cardapio_grupos AS cg ON cg.idCardapioGrupo = cgc.idCardapioGrupo
                WHERE ci.idCardapioItem = " . $_POST['idTipo'];
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {

        $linha = mysqli_fetch_assoc($Tb);

        $json = array(
            'valor' => FormatMoeda($linha['valor']),
            'tipoValor' => $linha['tipoValor'],
            'idCardapioGrupo' => $linha['idCardapioGrupo']
        );

        echo json_encode($json);
    }

    mysqli_close($ArqT);
}

function VerificaQtdDecoracao() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT qtd FROM decoracoes WHERE idDecoracao = " . $_POST['idDecoracao'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        mysqli_close($ArqT);
        return;
    }

    $qtdDecoracao = mysqli_result($Tb, 0, "qtd");

    if (intval($_POST['qtd']) > intval($qtdDecoracao)) {
        echo '0';
    } else {
        echo '1';
    }
    mysqli_close($ArqT);
}

function ImprimirReciboPagamento() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT * FROM contratos_pagamentos_recibos WHERE idContratoPagamento = " . $_POST['idParcela'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {

        $sql = "INSERT INTO contratos_pagamentos_recibos SET idContratoPagamento = " . $_POST['idParcela'];
        mysqli_query($ArqT, $sql);
    }

    $sql = "SELECT LPAD(cpr.idContratoPagamentoRecibo, 5, '0') AS numeroRecibo, cl.razaoSocial AS cliente, cp.valor, 
            cp.parcela, c.tituloFesta, l.logo, l.nomeLocal 
            FROM contratos_pagamentos_recibos AS cpr
            INNER JOIN contratos_pagamentos AS cp USING(idContratoPagamento)
            INNER JOIN contratos AS c USING(idContrato)
            INNER JOIN clientes AS cl USING(idCliente)
            INNER JOIN locais AS l USING(idLocal)
            WHERE cpr.idContratoPagamento = " . $_POST['idParcela'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $linha = mysqli_fetch_assoc($Tb);

    $html = '<html>
                <head>
                    <title>Recibo de Pagamento | Buffet Jujuba</title>
                    <meta charset="UTF-8">
                </head>
                <body>
                    <div style="width:650px; height:300px; padding:20px; border:1px solid black; font-family:arial;">
                        <span style="font-size:30px; margin-top:50px; float:left;">RECIBO NÂ° ' . $linha['numeroRecibo'] . '</span>
                        <img src="http://buffetmax.com.br/admin/imagens/locais/' . $linha['logo'] . '" style="float:right; width:auto; height:100px;"/>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <p style="line-height:30px; font-size:14px;">Recebemos de <span style="font-weight:bold;">' . $linha['cliente'] . '</span>, a quantia de R$ <span style="font-weight:bold;">' . FormatMoeda($linha['valor']) . ' (' . valorPorExtenso($linha['valor'], true) . ')</span>, correspondente ao <span style="font-weight:bold;">pagamento da parcela NÂ° ' . $linha['parcela'] . ' da festa ' . $linha['tituloFesta'] . '</span>, e para clareza firmamos o presente na cidade de <span style="font-weight:bold;">JundiaÃ­</span> no dia <span style="font-weight:bold;">' . dataExtenso(date('Y') . '-' . date('m') . '-' . date('d')) . '</span>.</p>
                        <img src="http://buffetmax.com.br/admin/imagens/assinatura.jpg" style="width:auto; height:80px; margin-left:90px;"/>
                        <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___________________________<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $linha['nomeLocal'] . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contratante
                        </label>   
                    </div>
                </body>
            </html>';

    $pdf = new mPDF('pt');
    $pdf->SetDisplayMode('fullpage');
    $pdf->WriteHTML($html);
    $pdf->Output('../recibos/recibo-' . $linha['numeroRecibo'] . '.pdf', 'F');
    echo './recibos/recibo-' . $linha['numeroRecibo'] . '.pdf';
}

function ConfirmarPagamentoCliente() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_pagamentos SET 
            pago = 1, 
            valorPago = " . ValorE($_POST['valor']) . ", 
            idUsuarioPagamento = " . $_SESSION['jujuba_codigo'] . ", 
            confirmadaAdmin = 1 
            WHERE idContratoPagamento = " . $_POST['idParcela'];
    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

    mysqli_close($ArqT);
}

function AprovarOpcional() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_comp SET idContratoCompSituacao=" . $_POST['idContratoCompSituacao'] . ", idUsuarioAtualizacao=" . $_SESSION['jujuba_codigo'] . ", dataAtualizacao=NOW() 
            WHERE idContratoComp=" . $_POST['idContratoComp'];

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    if ($_POST['idContratoCompSituacao'] == '1') {
        $sql = "UPDATE contratos SET valorOpcionais=" . ValorE($_POST['valorOpcionais']) . ", valorTotal=" . ValorE($_POST['valorTotal']) . "
                WHERE idContrato=" . $_POST['idContrato'];
        mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0)
            echo '-1';
        else
            echo '1';
    }

    mysqli_close($ArqT);
}

function SetarOpcionalOk() {

    inicia_sessao();
    $ArqT = AbreBancoJujuba();

    $sql = "UPDATE contratos_comp SET 
            ok = " . $_POST['ok'] . ", 
            obsOk = '" . TextoSSql($ArqT, $_POST['obs']) . "', 
            dataAtualizacao = NOW(), 
            idUsuarioAtualizacao = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idContrato = " . $_POST['idContrato'] . " 
            AND idContratoComp = " . $_POST['idContratoComp'];

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

    mysqli_close($ArqT);
}

function MensagemDecoracao() {

    $ArqT = AbreBancoJujuba();

    $sql = "SELECT IFNULL(MIN(LPAD(idContrato, 5, '0')), 0) AS numeroContrato 
            FROM contratos WHERE idDecoracao = " . $_POST['idDecoracao'] . " AND cancelado = 0 
            AND dataFesta > CURDATE()";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
    } else {
        echo mysqli_result($Tb, 0, "numeroContrato");
    }

    mysqli_close($ArqT);
}
