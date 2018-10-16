<?php

include '../../padrao/rotinaspadrao.php';
include '../../classes/config.php';
include('../../classes/class.send.php');
include('../../classes/excelwriter.inc.php');

function AbreBancoPhotoartsPdv() {

    $con = new config();
    $id = AbreBanco($con->get_host(), $con->get_login(), $con->get_pass(), $con->get_banco());
   mysqli_set_charset($id, 'utf8');
    return $id;
}

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'DestruirSessao':
            DestruirSessao();
            break;

        case 'ValidarSessao':
            ValidarSessao();
            break;

        case 'CarregarGalerias':
            CarregarGalerias();
            break;

        case 'CarregarMarchandsGaleria':
            CarregarMarchandsGaleria();
            break;

        case 'CarregarDadosUsuario':
            CarregarDadosUsuario();
            break;

        case 'getArtistas':
            getArtistas();
            break;

        case 'getAcabamentos':
            getAcabamentos();
            break;

        case 'getTamanhos':
            getTamanhos();
            break;

        case 'getDadosTamanho':
            getDadosTamanho();
            break;

        case 'getProdutos':
            getProdutos();
            break;

        case 'getObras':
            getObras();
            break;

        case 'getTamanhosObras':
            getTamanhosObras();
            break;

        case 'getDetalhesAcabamento':
            getDetalhesAcabamento();
            break;

        case 'getStatusOrcamento':
            getStatusOrcamento();
            break;

        case 'getMarchands':
            getMarchands();
            break;

        case 'getClientes':
            getClientes();
            break;

        case 'getTiposTransportes':
            getTiposTransportes();
            break;

        case 'getFormasPagamentos':
            getFormasPagamentos();
            break;

        case 'getVendedores':
            getVendedores();
            break;

        case 'getComissaoMarchand':
            getComissaoMarchand();
            break;

        case 'getGruposMolduras':
            getGruposMolduras();
            break;

        case 'LoadDadosCliente':
            LoadDadosCliente();
            break;

        case 'getMolduras':
            getMolduras();
            break;

        case 'MostraResultadoClientes':
            MostraResultadoClientes();
            break;

        case 'GravarClienteRapido':
            GravarClienteRapido();
            break;

        case 'MostrarClienteRapido':
            MostrarClienteRapido();
            break;

        case 'VerificarSenhaPadrao':
            VerificarSenhaPadrao();
            break;

        case 'getImagemProduto':
            getImagemProduto();
            break;

        case 'getClientesPremium':
            getClientesPremium();
            break;

        case 'getTiposEnderecos':
            getTiposEnderecos();
            break;

        case 'getEnderecosColecionador':
            getEnderecosColecionador();
            break;

        case 'GravarEnderecoColecionador':
            GravarEnderecoColecionador();
            break;

        case 'BuscarCEP':
            BuscarCEP();
            break;

        case 'getEstilos':
            getEstilos();
            break;

        case 'VerificarCpfCnpjIgual':
            VerificarCpfCnpjIgual();
            break;

        case 'CalcularPrecoPrazoCorreios':
            CalcularPrecoPrazoCorreios();
            break;

        case 'SubtrairData':
            SubtrairData();
            break;

        case 'getDeAte':
            getDeAte();
            break;

        case 'CarregarGaleriasPdv':
            CarregarGaleriasPdv();
            break;

        case 'getEtapasOrdensProducao':
            getEtapasOrdensProducao();
            break;

        case 'getTiposProdutos':
            getTiposProdutos();
            break;
    }
}

function DestruirSessao() {

    session_start();
    session_destroy();
}

function ValidarSessao() {

    session_start();
    if (isset($_SESSION['photoarts_pdv_idVendedor'])) {
        echo '1';
    } else {
        echo '0';
    }
}

function CarregarGalerias() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idLoja, loja, cep FROM lojas WHERE ativo = 1 AND del = 0 ORDER BY loja";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idLoja' => $linha['idLoja'],
            'loja' => $linha['loja'],
            'cep' => $linha['cep']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function CarregarMarchandsGaleria() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idVendedor, vendedor FROM vendedores 
    		WHERE idLoja = " . $_POST['idLoja'] . " AND pdv=1 AND ativo = 1 ORDER BY vendedor";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idVendedor' => $linha['idVendedor'],
            'vendedor' => $linha['vendedor']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function CarregarDadosUsuario() {

    session_start();

    $hora = date('H');

    if ($hora > 24) {
        $hora = $hora - 24;
    }

    if ($hora >= '6' && $hora < '12') {
        $saudacao = 'Bom dia, ' . $_SESSION['photoarts_pdv_vendedor'];
    } else if ($hora >= '12' && $hora < "18") {
        $saudacao = 'Boa tarde, ' . $_SESSION['photoarts_pdv_vendedor'];
    } else {
        $saudacao = 'Boa noite, ' . $_SESSION['photoarts_pdv_vendedor'];
    }

    $json = array(
        'idVendedor' => $_SESSION['photoarts_pdv_idVendedor'],
        'vendedor' => $saudacao,
        'galeria' => $_SESSION['photoarts_pdv_loja'],
        'idGaleria' => $_SESSION['photoarts_pdv_idLoja'],
        'descontoMaximoObras' => $_SESSION['photoarts_pdv_descontoMaximoObras'],
        'descontoMaximo' => $_SESSION['photoarts_pdv_descontoMaximo'],
        'gerente' => $_SESSION['photoarts_pdv_gerente']
    );

    echo json_encode($json);
}

function getArtistas() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idArtista, artista FROM artistas WHERE ativo = 1 ORDER BY artista";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idArtista' => $linha['idArtista'],
            'artista' => $linha['artista']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getAcabamentos() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idAcabamento, nomeAcabamento, bloquearVendaUltrapassou1M 
  FROM acabamentos WHERE ativo = 1 ";

    if ($_POST['tipo'] == 'p') {
        $sql .= "AND photoArts=1 ";
    } elseif ($_POST['tipo'] == 'i') {
        $sql .= "AND instaArts=1 ";
    }

    $sql .= "ORDER BY nomeAcabamento";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['idAcabamento'],
            'nome' => $linha['nomeAcabamento'],
            'bloquearVendaUltrapassou1M' => $linha['bloquearVendaUltrapassou1M']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getTamanhos() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idTamanho, 
        CONCAT(nomeTamanho, ' (', TRUNCATE(altura, 0), 'x', TRUNCATE(largura, 0), ')') AS nome
        FROM tamanhos WHERE ativo = 1 ORDER BY nomeTamanho DESC, altura, largura";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idTamanho' => $linha['idTamanho'],
            'nomeTamanho' => $linha['nome']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getDadosTamanho() {

    $ArqT = AbreBancoPhotoartsPdv();

    if ($_POST['item'] == 'p') {

        /* $sql = "  SELECT altura, largura, tiragemMaxima, tiragemAtual, "
          . "(SELECT estrelas FROM estrelas WHERE ativo=1 AND tiragemAtual BETWEEN de AND ate) AS estrelas "
          . "FROM  artistas_obras_tamanhos "
          . "WHERE idArtistaObraTamanho = " . $_POST['idArtistaObraTamanho']; */

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

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) <= 0) {
            echo 0;
            return;
        }

        $json =mysqli_fetch_assoc($Tb);
        $json['altura'] = FormatMoeda($json['altura']);
        $json['largura'] = FormatMoeda($json['largura']);
        $json['tiragemMaxima'] = $json['tiragemMaxima'];
        $json['tiragemAtual'] = $json['tiragemAtual'];
        $json['estrelas'] = $json['estrelas'];
    }

    if ($_POST['item'] == 'i') {

        $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idTamanho'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) <= 0) {
            echo 0;
            return;
        }

        $json =mysqli_fetch_assoc($Tb);
        $json['altura'] = FormatMoeda($json['altura']);
        $json['largura'] = FormatMoeda($json['largura']);
    }

    echo json_encode($json);

   mysqli_close($ArqT);
}

function getProdutos() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idProduto, nomeProduto, valorProduto "
            . "FROM produtos "
            . "WHERE ativo = 1 ORDER BY nomeProduto";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['idProduto'],
            'nome' => $linha['nomeProduto'] . ' - ' . FormatMoeda($linha['valorProduto'])
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getObras() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT nomeObra, idArtistaObra "
            . "FROM artistas_obras where idArtista=" . $_POST['idArtista'] . " "
            . "ORDER BY nomeObra";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo 0;
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'obra' => $linha['nomeObra'],
            'codigo' => $linha['idArtistaObra']
        );
    }

    echo json_encode($json);

   mysqli_close($ArqT);
}

function getTamanhosObras() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = " SELECT CONCAT(t.nomeTamanho, ' (', TRUNCATE(t.altura, 0), 'x', TRUNCATE(t.largura, 0), ')') AS tamanho, 
      aot.idArtistaObraTamanho AS codigo, o.imagem
      FROM artistas_obras_tamanhos AS aot
      LEFT JOIN tamanhos AS t ON aot.idTamanho = t.idTamanho 
      LEFT JOIN artistas_obras AS o ON o.idArtistaObra = aot.idObra
      WHERE aot.del=0 AND aot.idObra = " . $_POST['idObra'] . " ORDER BY t.idTamanho";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo 0;
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'tamanho' => $linha['tamanho'],
            'codigo' => $linha['codigo'],
            'img' => $linha['imagem'],
            'imagem' => './../imagens/obras/mini_' . $linha['imagem']
        );
    }

    echo json_encode($json);

   mysqli_close($ArqT);
}

function getDetalhesAcabamento() {

    $ArqT = AbreBancoPhotoartsPdv();

    //---- PEGA O VALOR E PESO BASE DO ACABAMENTO
    $sql = "SELECT * FROM acabamentos WHERE idAcabamento =" . $_POST['idAcabamento'];
    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        echo json_encode(array(
            'status' => 'ERROR_GET_ACABAM',
            'SQL' => $sql
        ));
       mysqli_close($ArqT);
        return;
    }
    //----------------------------------------

    $linha =mysqli_fetch_assoc($Tb);

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

            $Tb =mysqli_query($ArqT, $sql);

            if (mysqli_num_rows($Tb) <= 0) {
                echo json_encode(array(
                    'status' => 'ERROR_GET_MOLD',
                    'SQL' => $sql
                ));
               mysqli_close($ArqT);
                return;
            }

            $linha =mysqli_fetch_assoc($Tb);

            $valorMoldura = $linha['valor'];
        }
    } else {
        $valorMoldura = 0;
    }
    //----------------------------------------

    if ($_POST['item'] == 'p') {

        //---- BUSCA OS DETALHES DAS OBRAS (ATUALIZADO)
        /* $sql = "  SELECT altura, largura, tiragemMaxima, tiragemAtual, "
          . "(SELECT estrelas FROM estrelas WHERE ativo=1 AND tiragemAtual BETWEEN de AND ate) AS estrelas "
          . "FROM  artistas_obras_tamanhos "
          . "WHERE idArtistaObraTamanho = " . $_POST['idObraTamanho']; */

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

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) <= 0) {
            echo json_encode(array(
                'status' => 'ERROR_GET_DET_OBR',
                'SQL' => $sql
            ));
           mysqli_close($ArqT);
            return;
        }

        $linha =mysqli_fetch_assoc($Tb);

        $altura = ($linha['altura'] == 0 ? $_POST['altura'] : $linha['altura']);
        $largura = ($linha['largura'] == 0 ? $_POST['largura'] : $linha['largura']);

        $tiragemMaxima = $linha['tiragemMaxima'];
        $tiragemAtual = $linha['tiragemAtual'];
        $estrelas = $linha['estrelas'];
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
    }

    if ($_POST['item'] == 'i') {

        $sql = "SELECT altura, largura FROM tamanhos WHERE idTamanho =" . $_POST['idObraTamanho'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) <= 0) {
            echo json_encode(array(
                'status' => 'ERROR_GET_DET_TAM',
                'SQL' => $sql
            ));
           mysqli_close($ArqT);
            return;
        }

        $linha =mysqli_fetch_assoc($Tb);

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
        'valorObra' => FormatMoeda(round($valorObra, 2)),
        'pesoObra' => FormatMoeda($pesoObra)
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getStatusOrcamento() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idOStatus, status 
  FROM o_status WHERE ativo = 1 ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idOStatus' => $linha['idOStatus'],
            'status' => $linha['status']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getMarchands() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT v.idVendedor AS codigo, v.vendedor AS nome, 
            IF(v.gerente = 1 , 'GERENTES' , 'MARCHANDS') AS tipo, l.loja    
            FROM vendedores AS v
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            WHERE v.ativo = 1";

    //if($_SESSION['photoarts_pdv_gerente'] == '1'){

    $sql .= " AND l.idLoja = " . $_SESSION['photoarts_pdv_idLoja'];
    //}

    $sql .= " ORDER BY loja, tipo, nome";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome'],
            'tipo' => $linha['tipo'],
            'loja' => $linha['loja']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getClientes() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idCliente AS codigo, CONCAT(cliente, ' (', apelido, ')') AS nome
  FROM clientes 
  WHERE ativo = 1   
  ORDER BY nome";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => number_format_complete($linha['codigo'], '0', 4) . ' - ' . $linha['nome']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getTiposTransportes() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idTransporteTipo AS codigo, tipoTransporte AS nome
  FROM transportes_tipos 
  WHERE ativo = 1  
  ORDER BY nome";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
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
   mysqli_close($ArqT);
}

function getFormasPagamentos() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idFormaPagamento, formaPagamento FROM formaspagamentos 
  WHERE ativo = 1 AND del = 0 ORDER BY formaPagamento";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idFormaPagamento' => $linha['idFormaPagamento'],
            'formaPagamento' => $linha['formaPagamento']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getObrasComposicao($ArqT, $id, $tipo) {

    if ($tipo == 0) {
        $sql = "SELECT oc.idTipoProduto, IF(ISNULL(ao.nomeObra), 
      IF(ISNULL(a.nomeAcabamento), 'Produtos', 'InstaArts'), 'PhotoArts') AS tipo, ao.nomeObra, a.nomeAcabamento, oc.altura, oc.largura, p.nomeProduto, IFNULL(m.moldura, '') AS moldura 
      FROM orcamentos_comp AS oc  
      LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra  
      LEFT JOIN acabamentos AS a ON a.idAcabamento = oc.idAcabamento     
      LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto 
      LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura   
      WHERE oc.del=0 AND oc.idOrcamento =" . $id;
    } else {
        $sql = "SELECT oc.idTipoProduto, IF(ISNULL(ao.nomeObra), 
      IF(ISNULL(a.nomeAcabamento), 'Produtos', 'InstaArts'), 'PhotoArts') AS tipo, ao.nomeObra, a.nomeAcabamento, oc.altura, oc.largura, p.nomeProduto, IFNULL(m.moldura, '') AS moldura 
      FROM vendas_comp AS oc  
      LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra  
      LEFT JOIN acabamentos AS a ON a.idAcabamento = oc.idAcabamento     
      LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto 
      LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura 
      WHERE oc.del=0 AND oc.idVenda =" . $id;
    }

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        //return 'Problemas ao carregar a(s) obra(s)/produto(s)';
        return 'Nenhuma obra encontrada/cadastrada';
    } else {
        $texto = '';
        while ($linha =mysqli_fetch_assoc($Tb)) {
            if ($texto != '') {
                $texto.= '<br />';
            }

            if ($linha['idTipoProduto'] == '1') {
                $aux = 'PhotoArts - ' . $linha['nomeObra'] . ' (' . round($linha['altura']) . 'x' . round($linha['largura']) . ') em ' . $linha['nomeAcabamento'] . ($linha['moldura'] == '' ? '' : ' - Mold.: ' . $linha['moldura']);
            } else if ($linha['idTipoProduto'] == '2') {
                $aux = 'InstaArts - (' . round($linha['altura']) . 'x' . round($linha['largura']) . ') em ' . $linha['nomeAcabamento'] . ($linha['moldura'] == '' ? '' : ' - Mold.: ' . $linha['moldura']);
            } else {
                $aux = 'Produtos - ' . $linha['nomeProduto'];
            }

            $texto.= $aux;
        }

        return $texto;
    }
}

function getVendedores() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idVendedor AS codigo, vendedor AS nome, IF(gerente = 1 , 'GERENTES' , 'MARCHANDS') AS tipo       
          FROM vendedores 
          WHERE ativo = 1
          AND idLoja = " . $_POST['idLoja'] . "
          ORDER BY gerente ASC , nome";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome'],
            'tipo' => $linha['tipo']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getComissaoMarchand() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT descontoMaximo, descontoMaximoObras FROM vendedores WHERE idVendedor = " . $_POST['idVendedor'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        $linha =mysqli_fetch_assoc($Tb);

        $json = array(
            'descontoMaximo' => FormatMoeda($linha['descontoMaximo']),
            'descontoMaximoObras' => FormatMoeda($linha['descontoMaximoObras'])
        );

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function AtualizarStatusOrcamento($ArqT, $idOSStatus, $idOrcamento) {

    session_start();

    $descricaoStatus = '';
    if ($idOSStatus == '2') {
        $descricaoStatus = 'ORÇAMENTO VENCIDO';
    } else if ($idOSStatus == '3') {
        $descricaoStatus = 'GERADO PEDIDO';
    } else {
        $descricaoStatus = 'ORÇAMENTO CANCELADO';
    }

    $sql = "INSERT INTO orcamentos_status SET 
  dataCadastro = NOW(), 
  idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
  idOrcamento = " . $idOrcamento . ", 
  idOSStatus = " . $idOSStatus . ", 
  descricaoStatus = '" . $descricaoStatus . "'";
   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {

        $sql = "UPDATE orcamentos SET idUltimoStatus = " . $idOSStatus . " WHERE idOrcamento = " . $idOrcamento;
       mysqli_query($ArqT, $sql);
    }
}

function getGruposMolduras() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idMolduraGrupo, molduraGrupo "
            . "FROM molduras_grupos "
            . "WHERE ativo = 1 ORDER BY molduraGrupo";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['idMolduraGrupo'],
            'nome' => $linha['molduraGrupo']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function LoadDadosCliente() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT IF(responsavel='', IF(apelido='', cliente, apelido), responsavel) AS responsavel, telefone, celular, email
  FROM clientes 
  WHERE idCliente =" . $_POST['idCliente'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $tel = '';

    if ($linha['telefone'] != '') {
        $tel = $linha['telefone'];
    }

    if ($linha['celular'] != '') {
        $tel .= (trim($tel) == '' ? '' : '/') . $linha['celular'];
    }

    $json = array(
        'responsavel' => $linha['responsavel'],
        'telefone' => $tel,
        'email' => $linha['email']
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getMolduras() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idMoldura, moldura "
            . "FROM molduras "
            . "WHERE ativo = 1 ";

    if ($_POST['idGrupo'] > 0) {
        $sql .= "AND idMolduraGrupo =" . $_POST['idGrupo'] . " ";
    }

    if ($_POST['photo'] == 'true') {
        $sql .= "AND photoarts = 1 ";
    } else {
        $sql .= "AND instaarts = 1 ";
    }

    $sql .= "ORDER BY moldura";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['idMoldura'],
            'nome' => $linha['moldura']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function MostraResultadoClientes() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idCliente AS codigo, cliente AS nome, apelido, cpfCnpj, telefone, celular FROM clientes WHERE TRUE";

    if ($_POST['nome'] != '') {
        $sql .= " AND UCASE(cliente) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(apelido) LIKE UCASE('%" . $_POST['nome'] . "%')";
    }

    if ($_POST['ativo'] === 'true') {

        $sql.= " AND ativo = 1";
    } else {
        $sql.= " AND ativo = 0";
    }

    if ($_POST['cpfCnpj'] !== '') {
        $sql .= " AND cpfCnpj = '" . $_POST['cpfCnpj'] . "'";
    }

    if ($_POST['telefone'] !== '') {
        $sql .= " AND telefone LIKE '%" . $_POST['telefone'] . "%'";
    }

    if ($_POST['celular'] !== '') {
        $sql .= " AND celular LIKE '%" . $_POST['celular'] . "%'";
    }

    $sql .= " ORDER BY nome";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome'],
            'apelido' => $linha['apelido'],
            'cpfCnpj' => $linha['cpfCnpj'],
            'telefone' => $linha['telefone'],
            'celular' => $linha['celular']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function GravarClienteRapido() {

    $ArqT = AbreBancoPhotoartsPdv();

    /*$sql = " clientes SET 
              cliente = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "'), 
              apelido = UCASE('" . TextoSSql($ArqT, $_POST['apelido']) . "'), 
              dataCadastro ='" . DataSSql($_POST['cadastro']) . "', 
              cpfCnpj='" . $_POST['cpf'] . "', 
              ativo=" . $_POST['ativo'] . ",
              rgIE ='" . $_POST['rg'] . "',
              dataNascimento ='" . DataSSql($_POST['dataNasc']) . "',
              sexo ='" . ($_POST['sexoM'] == 'true' ? 'M' : 'F') . "',
              cep='" . $_POST['cep'] . "',
              endereco=UCASE('" . TextoSSql($ArqT, $_POST['endereco']) . "'),
              numero='" . $_POST['numero'] . "',
              complemento=UCASE('" . TextoSSql($ArqT, $_POST['complemento']) . "'),
              bairro=UCASE('" . TextoSSql($ArqT, $_POST['bairro']) . "'),
              cidade=UCASE('" . TextoSSql($ArqT, $_POST['cidade']) . "'),
              estado=UCASE('" . $_POST['estado'] . "'),     
              responsavel=UCASE('" . TextoSSql($ArqT, $_POST['responsavel']) . "'),
              telefone='" . $_POST['telefone'] . "',
              celular='" . $_POST['celular'] . "',
              email=LCASE('" . TextoSSql($ArqT, $_POST['email']) . "'),
              site=LCASE('" . TextoSSql($ArqT, $_POST['site']) . "'),     
              obs='" . TextoSSql($ArqT, $_POST['obs']) . "',
              tipo='" . $_POST['tipo'] . "'";*/

    $sql = " clientes SET 
              cliente = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "'), 
              apelido = UCASE('" . TextoSSql($ArqT, $_POST['apelido']) . "'), 
              dataCadastro ='" . DataSSql($_POST['cadastro']) . "', 
              cpfCnpj='" . $_POST['cpf'] . "', 
              ativo=" . $_POST['ativo'] . ", 
              premium=" . $_POST['premium'] . ", 
              rgIE ='" . $_POST['rg'] . "',
              dataNascimento ='" . DataSSql($_POST['dataNasc']) . "',
              sexo ='" . ($_POST['sexoM'] == 'true' ? 'M' : 'F') . "', 
              responsavel=UCASE('" . TextoSSql($ArqT, $_POST['responsavel']) . "'), 
              telefone='" . $_POST['telefone'] . "',
              celular='" . $_POST['celular'] . "',
              email=LCASE('" . TextoSSql($ArqT, $_POST['email']) . "'),
              site=LCASE('" . TextoSSql($ArqT, $_POST['site']) . "'),     
              obs='" . TextoSSql($ArqT, $_POST['obs']) . "',
              tipo='" . $_POST['tipo'] . "'";

    if ($_POST['idCliente'] > 0) {
        $sql = 'UPDATE ' . $sql . ", dataAtualizacao=Now() WHERE idCliente =" . $_POST['idCliente'];
    } else {
        $sql = "INSERT INTO " . $sql;
    }

   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        if ($_POST['idCliente'] <= 0) {
            echo UltimoRegistroInserido($ArqT);
        } else {
            echo $_POST['idCliente'];
        }
    } else {
        echo '0';
    }

   mysqli_close($ArqT);
}

function MostrarClienteRapido() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idCliente, cliente,  apelido,  dataCadastro,  cpfCnpj,  ativo,  rgIE,  dataNascimento,  sexo,
        cep,  endereco,  numero,  complemento,  bairro,  cidade,  estado,  responsavel,  telefone,  celular,  email,
        site,  obs,  tipo 
        FROM clientes 
        WHERE idCliente =" . $_POST['idCliente'];

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $json = array(
        'idCliente' => $linha['idCliente'],
        'cliente' => $linha['cliente'],
        'apelido' => $linha['apelido'],
        'dataCadastro' => FormatData($linha['dataCadastro']),
        'cpfCnpj' => $linha['cpfCnpj'],
        'ativo' => $linha['ativo'],
        'rgIE' => $linha['rgIE'],
        'dataNascimento' => FormatData($linha['dataNascimento']),
        'sexo' => $linha['sexo'],
        'cep' => $linha['cep'],
        'endereco' => $linha['endereco'],
        'numero' => $linha['numero'],
        'complemento' => $linha['complemento'],
        'bairro' => $linha['bairro'],
        'cidade' => $linha['cidade'],
        'estado' => $linha['estado'],
        'responsavel' => $linha['responsavel'],
        'telefone' => $linha['telefone'],
        'celular' => $linha['celular'],
        'email' => $linha['email'],
        'site' => $linha['site'],
        'obs' => $linha['obs'],
        'tipo' => $linha['tipo']
    );

    echo json_encode($json);

   mysqli_close($ArqT);
}

function VerificarSenhaPadrao() {

    session_start();

    echo $_SESSION['photoarts_pdv_senhaPadrao'];
}

function getImagemProduto() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT imagem FROM produtos WHERE idProduto = " . $_POST['idProduto'];
    $Tb = ConsultaSQL($sql, $ArqT);

    echomysqli_result($Tb, 0, "imagem");

   mysqli_close($ArqT);
}

function EnvioDeEmailsPhotoarts($nomeEmail, $paraEmail, $remetenteEmail, $remetenteNome, $copiaEmail, $copiaNome, $responderPara, $nomeResponderPara, $assuntoEmail, $msgEmail, $anexoArquivo, $tipoProduto) {

    $contato = new SendEmail();
    $contato->nomeEmail = $nomeEmail; // Nome do Responsavel que vai receber o E-Mail
    $contato->paraEmail = $paraEmail; // Email que vai receber a mensagem

    $contato->configHost = 'mail.photoarts.com.br'; // Endereço do seu SMTP     
    //$contato->configSecureSMTP = $configSecureSMTP; // Tipo de criptografia usada '', ssl ou tls
    $contato->configPort = 587; // Porta usada pelo seu servidor. Padrão 587 ou google 465
    $contato->configSMTPAuth = true; // Usa autenticação SMTP? (opcional) true ou false

    if ($tipoProduto == '1') {
        $contato->configUsuario = 'atendimento@photoarts.com.br'; // Login do email que ira utilizar
        $contato->configSenha = 'photoarts731'; // Senha do email
    } else {
        $contato->configUsuario = 'contato@instaarts.com.br'; // Login do email que ira utilizar
        $contato->configSenha = 'arteref731'; // Senha do email
    }

    $contato->remetenteEmail = $remetenteEmail; // E-mail que vai ser exibido no remetente da mensagem    
    $contato->remetenteNome = $remetenteNome; // Um nome para o remetente

    $contato->copiaEmail = $copiaEmail; //E-mail que será enviado copia
    $contato->copiaNome = $copiaNome; //Nome do responsavel que vai receber a copia

    $contato->responderPara = $responderPara; // E-mail que será enviado a resposta
    $contato->nomeResponderPara = $nomeResponderPara; //Nome do responsavel que vai receber a resposta

    $assunto = $assuntoEmail;

    if ($anexoArquivo !== '') {
        $contato->anexo = $anexoArquivo;
    }

    $contato->assuntoEmail = $assunto; // Assunto da mensagem
    $contato->conteudoEmail = $msgEmail; // Conteudo da mensagem se voce quer enviar a mensagem em HTML so colocar o body ai dentro e montar seu style que ele aceita normal.
    $contato->confirmacao = 1; // Se for 1 exibi a mensagem de confirmação
    $contato->mensagem = "OK"; // Mensagem de Confirmação          
    $contato->erroMsg = "ERROR"; // pode colocar uma mensagem de erro aqui!!
    $contato->confirmacaoErro = 1; // Se voce colocar 1 ele exibi o erro que ocorreu no erro se for 0 não exibi o erro uso geralmente para verificar se ta pegando.

    $status = $contato->enviar(); // envia a mensagem
    //========================================================================

    if ($status == 'OK') {
        return true;
    } else {
        return false;
    }
}

function getClientesPremium() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idCliente AS codigo, cliente AS nome, premium, arquiteto 
            FROM clientes 
            WHERE ativo = 1
            ORDER BY premium DESC, arquiteto DESC, nome";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome'],
            'premium' => $linha['premium'],
            'arquiteto' => $linha['arquiteto']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getTiposEnderecos(){

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT * FROM tipos_enderecos";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idTipoEndereco' => $linha['idTipoEndereco'],
            'tipoEndereco' => $linha['tipoEndereco']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getEnderecosColecionador(){

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idClienteEndereco, cep, endereco, numero, complemento, bairro, cidade, estado 
            FROM clientes_enderecos WHERE idCliente = " . $_POST['idColecionador'] . " AND del = 0 
            AND idTipoEndereco IN(2,3)";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    $endereco = '';
    while ($linha =mysqli_fetch_assoc($Tb)) {

        $endereco = $linha['cep'] . ' - ' . $linha['endereco'] . ', ' . $linha['numero'] . ($linha['complemento'] == '' ? '' : ' ' . $linha['complemento']) . ' - ' . $linha['bairro'] . ' - ' . $linha['cidade'] . '/' . $linha['estado'];

        $json[] = array(
            'idClienteEndereco' => $linha['idClienteEndereco'],
            'endereco' => $endereco,
            'cep' => $linha['cep']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function GravarEnderecoColecionador(){

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT COUNT(*) AS total FROM clientes_enderecos 
            WHERE idTipoEndereco IN(1,3) AND idCliente = " . $_POST['idColecionador'] . " AND del = 0";

    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysqli_result($Tb, 0, "total") > 0 && $_POST['idTipoEndereco'] != '2'){
        echo '-1';
    }else{

        $sql = "INSERT INTO clientes_enderecos SET 
                idCliente = " . $_POST['idColecionador'] . ",
                idTipoEndereco = " . $_POST['idTipoEndereco'] . ", 
                cep = '" . $_POST['cep'] . "', 
                endereco = '" . TextoSSql($ArqT, $_POST['endereco']) . "', 
                numero = '" . TextoSSql($ArqT, $_POST['numero']) . "', 
                complemento = '" . TextoSSql($ArqT, $_POST['complemento']) . "', 
                bairro = '" . TextoSSql($ArqT, $_POST['bairro']) . "', 
                cidade = '" . TextoSSql($ArqT, $_POST['cidade']) . "', 
                estado = '" . TextoSSql($ArqT, $_POST['estado']) . "', 
                dataCadastro = NOW()";

       mysqli_query($ArqT, $sql);

        if(mysqli_affected_rows($ArqT) > 0){
            echo UltimoRegistroInserido($ArqT);
        }else{
            echo '0';
        }
    }

   mysqli_close($ArqT);
}

function BuscarCEP() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT r.rua, b.nome AS bairro, c.nome AS cidade, u.sigla AS estado FROM CEPS.ruas AS r 
            INNER JOIN CEPS.bairros AS b ON b.codigo = r.id_bairro
            INNER JOIN CEPS.cidades AS c ON c.id_cidade = b.id_cidade
            INNER JOIN CEPS.uf AS u ON u.codigo = c.id_uf
            WHERE r.CEP2 = '" . $_POST['cep'] . "'";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

    $json = array(
        'rua' => $linha['rua'],
        'bairro' => $linha['bairro'],
        'cidade' => $linha['cidade'],
        'estado' => $linha['estado']
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getEstilos() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idEstilo, estilo FROM estilos WHERE ativo = 1 AND del = 0 ORDER BY estilo";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idEstilo' => $linha['idEstilo'],
            'estilo' => $linha['estilo']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function VerificarCpfCnpjIgual() {

    $ArqT = AbreBancoPhotoartsPdv();

    if ($_POST['cpf'] == '') {
       mysqli_close($ArqT);
        return;
    }

    if ($_POST['codigo'] == '0') {
        $sql = "SELECT " . $_POST['nomeCampo'] . " FROM " . $_POST['tabela'] . " 
                WHERE " . $_POST['nomeCampo'] . " = '" . $_POST['cpf'] . "'";
    } else {
        $sql = "SELECT " . $_POST['nomeCampo'] . " FROM " . $_POST['tabela'] . " 
                WHERE " . $_POST['nomeCampo'] . " = '" . $_POST['cpf'] . "' AND 
                " . $_POST['pk'] . " <> " . $_POST['codigo'];
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) > 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    } else {
       mysqli_close($ArqT);
        return;
    }
}

function CalcularPrecoPrazoCorreios(){

    $peso = explode(',', $_POST['nVlPeso']);
    //$comprimento = explode(',', $_POST['nVlComprimento']);
    $altura = explode(',', $_POST['nVlAltura']);
    $largura = explode(',', $_POST['nVlLargura']);
    $valorTotal = 0;
    $totalDias = 0;
    $qtdObras = count($peso);
    $qtdErro = 0;
    $qtdOk = 0;

    for ($i = 0; $i < count($peso); $i++) {

        $xmlCorreios = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?nCdEmpresa=" . $_POST['nCdEmpresa'] . "&sDsSenha=" . $_POST['sDsSenha'] . "&nCdServico=" . $_POST['nCdServico'] . "&sCepOrigem=" . $_POST['sCepOrigem'] . "&sCepDestino=" . $_POST['sCepDestino'] . "&nVlPeso=" . $peso[$i] . "&nCdFormato=" . intval($_POST['nCdFormato']) . "&nVlComprimento=" . $_POST['nVlComprimento'] . "&nVlAltura=" . $altura[$i] . "&nVlLargura=" . $largura[$i] . "&nVlDiametro=" . ValorE($_POST['nVlDiametro']) . "&sCdMaoPropria=" . $_POST['sCdMaoPropria'] . "&nVlValorDeclarado=" . ValorE($_POST['nVlValorDeclarado']) . "&sCdAvisoRecebimento=" . $_POST['sCdAvisoRecebimento'] . "";

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

    /*if($qtdErro > 0 && $qtdOk == 0){
        echo '0';
        return;
    }*/

    if($valorTotal > 0){

        $json = array(
            'valorFrete' => 'R$ ' . FormatMoeda($valorTotal),
            'prazoEntrega' => round($totalDias / $qtdOk) . ' dia(s)'
        );

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function SubtrairData(){

    $ArqT = AbreBancoPhotoarts();

    $sql = "SELECT DATE_SUB('" . DataSSql($_POST['data']) . "', INTERVAL " . $_POST['periodoMeses'] . " MONTH) AS data";
    $Tb = ConsultaSQL($sql, $ArqT);

    echo FormatData(mysqli_result($Tb, 0, "data"));
}

function getDeAte() {

    $data = getdate();

    $de = $data[year] . '-' . sprintf('%002s', $data[mon]) . '-01';
    $ate = add_date($de, -1, 1, 0);

    $json = array(
        'de' => FormatData($de),
        'ate' => FormatData($ate, false)
    );

    echo json_encode($json);
}

function CarregarGaleriasPdv() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idLoja, loja, cep FROM lojas 
            WHERE ativo = 1 AND del = 0 AND idLoja = " . $_POST['idLoja'] . " ORDER BY loja";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idLoja' => $linha['idLoja'],
            'loja' => $linha['loja'],
            'cep' => $linha['cep']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getEtapasOrdensProducao() {

    $ArqT = AbreBancoPhotoartsPdv();
    $sql = "SELECT idEtapa AS codigo, CONCAT(etapa, ' - ', descricaoEtapa) AS nome FROM etapas 
            WHERE ativo = 1 ORDER BY ordem";
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nome']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getTiposProdutos(){

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idTipoProduto, produto FROM tipos_produtos WHERE TRUE ";

    if($_POST['mostraProduto'] == 'false'){

        $sql .= " AND idTipoProduto IN(1,2)";
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
       mysqli_close($ArqT);
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idTipoProduto' => $linha['idTipoProduto'],
            'produto' => $linha['produto']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}