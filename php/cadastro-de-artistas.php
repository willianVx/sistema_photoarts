<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Gravar':
            Gravar();
            break;

        case 'GetRegistroPrimeiro':
            $db = ConectaDB();
            echo RegistroPrimeiro($db, 'artistas', 'idArtista', false);
            break;

        case 'GetRegistroAnterior':
            $db = ConectaDB();
            echo RegistroAnterior($db, 'artistas', $_POST['atual'], 'idArtista', false);
            break;

        case 'GetRegistroProximo':
            $db = ConectaDB();
            echo RegistroProximo($db, 'artistas', $_POST['atual'], 'idArtista', false);
            break;

        case 'GetRegistroUltimo':
            $db = ConectaDB();
            echo RegistroUltimo($db, 'artistas', 'idArtista', false);
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'PesquisarArtistas':
            PesquisarArtistas();
            break;

        case 'getHistoricoComissoes':
            getHistoricoComissoes();
            break;

        case 'MostrarEstilosArtista':
            MostrarEstilosArtista();
            break;

        case 'ExcluirEstilo':
            ExcluirEstilo();
            break;

        case 'MostrarObrasArtista':
            MostrarObrasArtista();
            break;

        case 'GravarObra':
            GravarObra();
            break;

        case 'GerarMiniaturaObra':
            GerarMiniaturaObra();
            break;

        case 'MostraMedidasTamanho':
            MostraMedidasTamanho();
            break;

        case 'EditarTamanhoObra':
            EditarTamanhoObra();
            break;

        case 'ExcluirTamanhoObra':
            ExcluirTamanhoObra();
            break;

        case 'getObra':
            getObra();
            break;

        case 'MostraTamanhosObra':
            MostraTamanhosObra();
            break;

        case 'AtualizarImagemObra':
            AtualizarImagemObra();
            break;

        case 'ExcluirImagemObra':
            ExcluirImagemObra();
            break;

        case 'ExcluirObra':
            ExcluirObra();
            break;

        case 'GravarConsignacao':
            GravarConsignacao();
            break;

        case 'AtualizarImagemConsignacao':
            AtualizarImagemConsignacao();
            break;

        case 'GerarMiniaturaConsignacao':
            GerarMiniaturaConsignacao();
            break;

        case 'MostrarConsignacoesArtista':
            MostrarConsignacoesArtista();
            break;

        case 'getConsignacao':
            getConsignacao();
            break;

        case 'ExcluirConsignacao':
            ExcluirConsignacao();
            break;

        case 'getQtdeTamanhosVendidos':
            getQtdeTamanhosVendidos();
            break;

        case 'ExcluirImagemConsignacao':
            ExcluirImagemConsignacao();
            break;

        case 'MostrarPagamentosArtista':
            MostrarPagamentosArtista();
            break;

        case 'CompleteTipoPagamento':
            CompleteTipoPagamento();
            break;

        case 'TabelaDeVendas':
            TabelaDeVendas();
            break;

        case 'ExportarVendas':
            ExportarVendas();
            break;

        case 'ListaDeArtistas':
            ListaDeArtistas();
            break;
    }
}


function ListaDeArtistas() {

    $db = ConectaDB();
          
    if ($_POST['busca'] != "") {
        $filtro = " AND (artista LIKE '%$_POST[busca]%' OR idArtista = '$_POST[busca]' OR nacionalidade LIKE '%$_POST[busca]') ";
    } else {
        $filtro = "";
    }
    
    $sql = "SELECT a.idArtista, a.ativo, a.artista, a.nacionalidade, a.telefone, a.celular, 
            a.tipoPagamento, a.dadosPagamento, a.diaRepasse, a.comissao, 
            (SELECT COUNT(idArtista) 
                FROM artistas_obras 
                WHERE idArtista = a.idArtista) AS numObras
            FROM artistas AS a
            WHERE TRUE $filtro " . ($_POST['ativo'] == '1' ? "AND a.ativo = 1" : "") . " "
            . "ORDER BY artista ";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {           
            
            $json[] = array('idArtista' => $linha['idArtista'],
                'cod' => str_pad($linha['idArtista'], 5, "0", STR_PAD_LEFT),
                'ativo' => $linha['ativo'],
                'artista' => $linha['artista'],
                'nacionalidade' => $linha['nacionalidade'],
                'contatos' => ($linha['telefone'] != '' ? $linha['telefone'] . ' / ' : '') . $linha['celular'],
                'pagamento' => $linha['tipoPagamento'] . ' - ' . $linha['dadosPagamento'],
                'diaRepasse' => $linha['diaRepasse'],
                'comissao' => FormatMoeda($linha['comissao']) . ' %',
                'numObras' => $linha['numObras']
                );

        }
        echo json_encode($json);

    }
    $db->close();

}

function Gravar() {
    inicia_sessao();

    $db = ConectaDB();

    if ($_POST['codigo'] > 0) {

        $sql = "SELECT comissao FROM artistas WHERE idArtista = " . $_POST['codigo'];
        $db->query( $sql );
        $result = $db->fetch();        
        $comissao = $result["comissao"];
    }

    $sql = " artistas SET 
            ativo = " . $_POST['ativo'] . ", 
            artista = UCASE('" . $db->escapesql( $_POST['nome']) . "'), 
            sexo = '" . $_POST['sexo'] . "', 
            cpf = '" . $_POST['cpf'] . "',
            cep = '" . $_POST['cep'] . "',
            endereco = '" . $_POST['endereco'] . "',
            numero = '" . $_POST['numero'] . "',
            complemento = '" . $_POST['complemento'] . "',
            bairro = '" . $_POST['bairro'] . "',
            cidade = '" . $_POST['cidade'] . "',
            estado = '" . $_POST['estado'] . "',                                             
            nacionalidade = '" . $_POST['nacionalidade'] . "', 
            telefone = '" . $_POST['telefone'] . "',
            celular = '" . $_POST['celular'] . "',
            email = LCASE('" . $_POST['email'] . "'), 
            tipoPagamento = '" . $_POST['tipoPagamento'] . "', 
            dadosPagamento = '" . $_POST['dadosPagamento'] . "', 
            diaRepasse = " . $_POST['diaRepasse'] . ", 
            comissao = '" . ValorE($_POST['comissao']) . "', 
            sobre = '" . $db->escapesql( $_POST['sobre']) . "', 
            obs = '" . $db->escapesql( $_POST['obs']) . "', 
            dataAtualizacao= NOW(), 
            idUsuarioAtualizacao= " . $_SESSION['photoarts_codigo'];

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idArtista =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . "";
    }

    $db->query( $sql );
       
    if( $db->n_rows <= 0 ){
        echo '0';
    }else{

        if ($_POST['codigo'] > 0) {

            echo $_POST['codigo'];

            GravarEstilosArtista($db, $_POST['estilos'], $_POST['codigo']);

            if ($comissao !== ValorE($_POST['comissao'])) {

                GravarHistoricoComissao($db, true, $_POST['codigo'], ValorE($_POST['comissao']));
            }
        } else {
            $idArtista = UltimoRegistroInserido($db);
            echo $idArtista;
            GravarHistoricoComissao($db, false, $idArtista, ValorE($_POST['comissao']));
            GravarEstilosArtista($db, $_POST['estilos'], $idArtista);
        }

    }

    $db->close();
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT a.*, 
           IFNULL(CONCAT((SELECT funcionario 
           FROM funcionarios WHERE idFuncionario = a.idUsuarioAtualizacao),'') ,'') AS usuario 
           FROM artistas AS a
           WHERE a.idArtista = " . $_POST['codigo'];

    $db->query( $sql );
    $linha = $db->fetch();    
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $json = array(
            'codigo' => $linha['idArtista'],
            'ativo' => $linha['ativo'],
            'dataCadastro' => FormatData($linha['dataCadastro'], false),
            'artista' => $linha['artista'],
            'sexo' => $linha['sexo'],
            'cpf' => $linha['cpf'],
            'cep' => $linha['cep'],
            'endereco' => $linha['endereco'],
            'numero' => $linha['numero'],
            'complemento' => $linha['complemento'],
            'bairro' => $linha['bairro'],
            'cidade' => $linha['cidade'],
            'estado' => $linha['estado'],
            'nacionalidade' => $linha['nacionalidade'],
            'telefone' => $linha['telefone'],
            'celular' => $linha['celular'],
            'email' => $linha['email'],
            'tipoPagamento' => $linha['tipoPagamento'],
            'dadosPagamento' => $linha['dadosPagamento'],
            'diaRepasse' => $linha['diaRepasse'],
            'comissao' => FormatMoeda($linha['comissao']),
            'usuario' => ($linha['usuario'] !== "" ? "Última Atualização em " . FormatData($linha['dataAtualizacao'], true) .
            " por " . $linha['usuario'] : ""),
            'sobre' => $linha['sobre'],
            'obs' => $linha['obs']
        );

        echo json_encode($json);
    }

    $db->close();
}

function PesquisarArtistas() {

    $db = ConectaDB();

    $sql = "SELECT a.idArtista AS codigo, a.artista, a.email, a.ativo 
            FROM artistas AS a LEFT JOIN artistas_estilos AS e
            ON a.idArtista = e.idArtista 
            WHERE TRUE ";

    if ($_POST['nome'] != '') {
        $sql .= " AND UCASE(a.artista) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(a.artista) LIKE UCASE('%" . $_POST['nome'] . "%')";
    }
    if ($_POST['sexo'] != '') {
        $sql .= " AND a.sexo = '" . $_POST['sexo'] . "'";
    }
    if ($_POST['endereco'] != '') {
        $sql .= " AND (a.endereco LIKE '%" . $_POST['endereco'] . "%' "
                . "OR a.numero = '" . $_POST['endereco'] . "' "
                . "OR a.complemento = '" . $_POST['endereco'] . "' "
                . "OR a.bairro LIKE '%" . $_POST['endereco'] . "%' "
                . "OR a.cidade LIKE '%" . $_POST['endereco'] . "%' "
                . "OR a.cidade LIKE '%" . $_POST['endereco'] . "%') ";
    }
    if ($_POST['contato'] != '') {
        $sql .= " AND ( a.telefone= '" . $_POST['contato'] . "' OR a.celular= '" . $_POST['contato'] . "' )";
    }
    if ($_POST['email'] != '') {
        $sql .= " AND a.email= '" . $_POST['email'] . "' ";
    }
    if ($_POST['estilo'] != 0) {
        $sql .= " AND e.idEstilo = " . $_POST['estilo'];
    }
    if ($_POST['estilo'] == 0 || $_POST['endereco'] != '') {
        $sql .= " GROUP BY a.idArtista";
    }

    $sql .= " ORDER BY a.ativo DESC, a.artista";

    $db->query( $sql );
  
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch(); 
        $json = array(
            'codigo' => $linha['codigo'],
            'artista' => $linha['artista'],
            'email' => $linha['email'],
            'ativo' => $linha['ativo']
        );
    }

    echo json_encode($json);
}

function GravarHistoricoComissao($ArqT, $update, $idArtista, $comissao) {
    inicia_sessao();

    if ($update) {

        $sql = "SELECT COUNT(*) AS total FROM artistas_comissoes 
                WHERE idArtista = " . $idArtista . " AND percentual = '" . $comissao . "'";

        $ArqT->query( $sql );
        $result = $ArqT->fetch();

        if($result["total"] <= 0){
            $sql = "INSERT INTO artistas_comissoes SET 
                    idArtista = " . $idArtista . ", 
                    dataCadastro = NOW(), 
                    percentual = '" . $comissao . "', 
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        } else {

            $sql = "INSERT INTO artistas_comissoes SET 
                    idArtista = " . $idArtista . ", 
                    dataCadastro = NOW(), 
                    percentual = '" . $comissao . "', 
                    idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        }

      $ArqT->query( $sql );
    }
}

function getHistoricoComissoes() {

    $db = ConectaDB();

    $sql = "SELECT ac.idArtistaComissao, ac.dataCadastro, ac.percentual, f.funcionario 
            FROM artistas_comissoes AS ac
            INNER JOIN funcionarios AS f ON f.idFuncionario = ac.idUsuarioCadastro 
            WHERE ac.idArtista = " . $_POST['idArtista'] . " ORDER BY ac.dataCadastro DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idArtistaComissao' => $linha['idArtistaComissao'],
                'dataCadastro' => FormatData($linha['dataCadastro']),
                'percentual' => FormatMoeda($linha['percentual']),
                'funcionario' => $linha['funcionario']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function GravarEstilosArtista($ArqT, $arrayEstilos, $idArtista) {
    inicia_sessao();

    $estilos = explode(",", $arrayEstilos);

    for ($i = 0; $i < count($estilos); $i++) {

        if( $estilos[$i] > "" ){
            $sql = "INSERT INTO artistas_estilos SET 
                   dataCadastro = NOW(), 
                   idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
                   idArtista = " . $idArtista . ", 
                   idEstilo = " . $estilos[$i] . "";

            $ArqT->query( $sql );
        }
    }
}

function MostrarEstilosArtista() {
    $db = ConectaDB();

    $sql = "SELECT ae.idArtistaEstilo, e.estilo FROM artistas_estilos AS ae
            INNER JOIN estilos AS e ON e.idEstilo = ae.idEstilo
            WHERE ae.idArtista = " . $_POST['idArtista'] . " AND ae.del = 0 ORDER BY e.estilo";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
        return;
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idArtistaEstilo' => $linha['idArtistaEstilo'],
                'estilo' => $linha['estilo']
            );
        }
    
        echo json_encode($json);
    }
    $db->close();
}

function ExcluirEstilo() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE artistas_estilos SET del = 1, dataDel = NOW(), 
           idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
           WHERE idArtistaEstilo = " . $_POST['idArtistaEstilo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        echo '1';
    }

    $db->close();
}

function MostrarObrasArtista() {

    $db = ConectaDB();

    $sql = "SELECT ao.idArtistaObra, ao.dataCadastro, IF(ao.ativo = 1, 'SIM', 'NÃO') AS ativo ,ao.nomeObra, ao.descricao, 
            ao.imagem, e.estilo,
            (SELECT IFNULL(SUM(tiragemAtual), 0) 
                FROM artistas_obras_tamanhos 
                WHERE idObra = idArtistaObra AND del = 0) AS qtdeVendidos
            FROM artistas_obras AS ao 
            LEFT JOIN estilos AS e
            ON e.idEstilo = ao.idEstilo
            WHERE ao.idArtista = " . $_POST['idArtista'] . " 
            AND ao.del = 0 
            ORDER BY ao.nomeObra";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idArtistaObra' => $linha['idArtistaObra'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'ativo' => $linha['ativo'],
                'estilo' => $linha['estilo'],
                'nomeObra' => $linha['nomeObra'],
                'descricao' => $linha['descricao'],
                'imagem' => $linha['imagem'],
                'imagemMini' => 'imagens/obras/mini_64_' . $linha['imagem'],
                'imagemOriginal' => 'imagens/obras/' . $linha['imagem'],
                'qtdeVendidos' => $linha['qtdeVendidos']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

/**
 *
 */
function GravarObra() {

    inicia_sessao();

    $db = ConectaDB();

    if ($_POST['nome'] != '') {
        $sql = "SELECT COUNT(*) AS total 
                FROM artistas_obras 
                WHERE idArtista = " . $_POST['idArtista'] . " 
                AND nomeObra='" . $db->escapesql($_POST['nome']) . "' 
                AND idArtistaObra <> " . $_POST['idArtistaObra'];

        $db->query( $sql );
        $result = $db->fetch();   

        if($result["total"] > 0){
            echo "-1";
            return;
        }
    }

    $sql = "artistas_obras SET 
            ativo = " . $_POST['ativo'] . ", 
            idArtista = " . $_POST['idArtista'] . ", 
            nomeObra = UCASE('" . $db->escapesql($_POST['nome']) . "'), 
            idEstilo = " . $_POST['estilo'] . ",    
            descricao = '" . $db->escapesql($_POST['descricao']) . "', 
            imagem = '" . $db->escapesql($_POST['imagem']) . "', 
            dataAtualizacao=NOW()";

    if ($_POST['idArtistaObra'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idArtistaObra = " . $_POST['idArtistaObra'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUsuarioCadastro=" . $_SESSION['photoarts_codigo'] . ", dataCadastro=NOW()";
    }

    $db->query( $sql );
 
    if($db->n_rows <= 0){
        echo "0";
        $db->close();
        return;
    } else {

        if ($_POST['idArtistaObra'] > 0) {
            GravarTamanhosObraArtista($db, $_POST['tamanhos'], $_POST['idArtistaObra'], $_POST['idArtista'], $_POST['alturas'], $_POST['larguras'], $_POST['tiragens'], $_POST['qtdeVendidos'], $_POST['ids']);
            echo $_POST['idArtistaObra'];
        } else {
            $id = UltimoRegistroInserido($db);
            GravarTamanhosObraArtista($db, $_POST['tamanhos'], $id, $_POST['idArtista'], $_POST['alturas'], $_POST['larguras'], $_POST['tiragens'], $_POST['qtdeVendidos'], $_POST['ids']);
            echo $id;
        }

// VERIFICA SE O ARTISTA JÁ TEM CADASTRADO O ESTILO, SE NAO GRAVA O NOVO ESTILO DO ARTISTA

        $sql = "SELECT * FROM artistas_estilos WHERE idArtista = " . $_POST['idArtista'] . " AND idEstilo = " . $_POST['estilo'];

        $db->query( $sql );
        $result = $db->fetch();   

        if($result["idArtista"] > 0){
            return;
        } else {
            $sql = "INSERT INTO artistas_estilos SET dataCadastro = NOW() , idUsuarioCadastro = " . $_SESSION['photoarts_codigo']
                    . ", idArtista = " . $_POST['idArtista'] . ", idEstilo = " . $_POST['estilo'];

            $db->query( $sql );

            if($db->n_rows <= 0){
                echo '0';
                $db->close();
                return;
            }
        }
//FIM DA VERIFICAÇÃO DE ESTILO
    }
    $db->close();
}

function GerarMiniaturaObra() {

    Redimensionar("../imagens/obras/" . $_POST['imagem'], 175, 125, "mini_", 80);
    if (file_exists("../imagens/obras/" . $_POST['imagem'])) {

        $json = array(
            'foto' => "imagens/obras/mini_" . $_POST['imagem']
        );

        echo json_encode($json);

        Redimensionar("../imagens/obras/" . $_POST['imagem'], 64, 64, "mini_64_", 80);
    } else {
        echo "0";
    }
}

function MostraMedidasTamanho() {

    $db = ConectaDB();

    $sql = "SELECT altura, largura,
           (SELECT COUNT(*) FROM vendas_comp WHERE 
           idTamanho = " . $_POST['idTamanho'] . " AND idObra= " . ValorE($_POST['idObra']) . ") AS qtdeVendida 
           FROM tamanhos WHERE idTamanho = " . $_POST['idTamanho'];

    /* $sql = "SELECT aot.idArtistaObraTamanho, aot.idTamanho, t.altura,  t.largura,  
      (SELECT COUNT(*) FROM vendas_comp WHERE idTamanho = aot.idArtistaObraTamanho AND idObra = aot.idObra AND del = 0) AS qtdeVendida
      FROM tamanhos AS t
      LEFT JOIN artistas_obras_tamanhos AS aot  ON t.idTamanho = aot.idTamanho AND aot.idObra = 9  AND aot.del = 0
      WHERE  t.idTamanho =  " . $_POST['idTamanho']; */

// gravaErro($ArqT, $sql);
    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {
            $json = array(
                'altura' => FormatMoeda($linha['altura']),
                'largura' => FormatMoeda($linha['largura']),
                'qtdeVendida' => $linha['qtdeVendida']
            );

        }
        echo json_encode($json);
    }
    $db->close();
}

function GravarTamanhosObraArtista($ArqT, $arrayTamanhos, $idObra, $idArtista, $arrayAlturas, $arrayLarguras, $arrayTiragens, $arrayVendidos, $arrayIds) {
    inicia_sessao();

    $id = explode(",", $arrayIds);
    $tamanhos = explode(",", $arrayTamanhos);
    $alturas = explode(",", $arrayAlturas);
    $larguras = explode(",", $arrayLarguras);
    $tiragens = explode(",", $arrayTiragens);
    $vendidos = explode(",", $arrayVendidos);

    for ($i = 0; $i < count($tamanhos); $i++) {

        $sql = " artistas_obras_tamanhos SET               
               idObra = " . $idObra . ", 
               idTamanho = " . $tamanhos[$i] . ", 
               idArtista = " . $idArtista . ", 
               altura = '" . $alturas[$i] . "', 
               largura = '" . $larguras[$i] . "', 
               tiragemMaxima = '" . $tiragens[$i] . "' ";

        if ($_SESSION['photoarts_admin'] == '1') {
            $sql .= ", tiragemAtual ='" . $vendidos[$i] . "' ";
        }

        if ($id[$i] > 0) {
            $sql = "UPDATE " . $sql . ", dataAtualizacao=Now(), "
                    . "idUsuarioAtualizacao=" . $_SESSION['photoarts_codigo'] . " "
                    . "WHERE idArtistaObraTamanho =" . $id[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), 
               idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
        }


        $ArqT->query( $sql );
    }
}

function EditarTamanhoObra() {
    $db = ConectaDB();

    $sql = "UPDATE artistas_obras_tamanhos SET 
           idTamanho = " . $_POST['idTamanho'] . ", 
           altura = '" . $_POST['altura'] . "', 
           largura = '" . $_POST['largura'] . "', 
           tiragemMaxima = '" . $_POST['tiragemMaxima'] . "', dataAtualizacao = NOW() 
           WHERE idArtistaObraTamanho = " . $_POST['idArtistaObraTamanho'];

    $db->query( $sql );
}

function ExcluirTamanhoObra() {
    $db = ConectaDB();

    $sql = "UPDATE artistas_obras_tamanhos SET 
           del = 1 WHERE idArtistaObraTamanho = " . $_POST['idArtistaObraTamanho'];

    $db->query( $sql );
}

function getObra() {
    $db = ConectaDB();

    $sql = "SELECT ativo, nomeObra, idEstilo, descricao, imagem FROM artistas_obras 
            WHERE idArtistaObra = " . $_POST['idObra'];

    $db->query( $sql );
    $linha = $db->fetch();   

     if($db->n_rows <= 0){
        echo '0';
        return;
    }

    $json = array(
        'ativo' => $linha['ativo'],
        'nomeObra' => $linha['nomeObra'],
        'descricao' => $linha['descricao'],
        'estilo' => $linha['idEstilo'],
        'imagem' => $linha['imagem'],
        'imagemMini' => 'imagens/obras/mini_' . $linha['imagem']
    );

    echo json_encode($json);
    $db->close();
}

function MostraTamanhosObra() {
    inicia_sessao();

    $db = ConectaDB();

    /* $sql = "SELECT aot.idArtistaObraTamanho, t.nomeTamanho, aot.idObra, aot.idTamanho, 
      CONCAT(aot.altura, ' x ', aot.largura) AS medidas, aot.tiragemMaxima,
      (SELECT COUNT(*) FROM vendas_comp WHERE idTamanho = aot.idArtistaObraTamanho AND idObra = aot.idObra AND del = 0) AS qtdeVendidas
      FROM artistas_obras_tamanhos AS aot
      INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
      WHERE aot.idObra = " . $_POST['idObra'] . " AND aot.del = 0"; */

    $sql = "SELECT aot.idArtistaObraTamanho, t.nomeTamanho, aot.idObra, aot.idTamanho, 
            CONCAT(aot.altura, ' x ', aot.largura) AS medidas, aot.tiragemMaxima, 
            tiragemAtual AS qtdeVendidas
            FROM artistas_obras_tamanhos AS aot 
            INNER JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            WHERE aot.idObra = " . $_POST['idObra'] . " AND aot.del = 0";

    //gravaErro($db,$sql);

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idArtistaObraTamanho' => $linha['idArtistaObraTamanho'],
                'nomeTamanho' => $linha['nomeTamanho'],
                'idObra' => $linha['idObra'],
                'idTamanho' => $linha['idTamanho'],
                'medidas' => str_replace('.', ',', $linha['medidas']),
                'tiragemMaxima' => $linha['tiragemMaxima'],
                'qtdeVendidas' => $linha['qtdeVendidas'],
                'admin' => $_SESSION['photoarts_admin']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function AtualizarImagemObra() {

    $db = ConectaDB();

    $sql = "UPDATE artistas_obras SET imagem = '" . $_POST['imagem'] . "' 
            WHERE idArtistaObra = " . $_POST['idObra'];
    $db->query( $sql );
}

function ExcluirImagemObra() {

    $db = ConectaDB();

    $sql = "UPDATE artistas_obras SET imagem = '' WHERE idArtistaObra = " . $_POST['idObra'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {

        if (file_exists("../imagens/obras/" . $_POST['imagem'])) {

            if (unlink("../imagens/obras/" . $_POST['imagem'])) {

                unlink("../imagens/obras/mini_" . $_POST['imagem']);
                echo '1';
            } else {
                echo '0';
                return;
            }
        }
    } else {

        echo '0';
        return;
    }

    $db->close();
}

function ExcluirObra() {

    $db = ConectaDB();

    $sql = "SELECT COUNT(*) AS total FROM vendas_comp WHERE idObra = " . $_POST['idObra'] . " AND del = 0";

    $db->query( $sql );
    $result = $db->fetch();   

    if($result["total"] > 0){
        echo '-1';
        return;
    }

    inicia_sessao();

    $sql = "UPDATE artistas_obras SET 
           del = 1, dataDel = NOW(), 
           idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
           WHERE idArtistaObra = " . $_POST['idObra'];

    $db->query( $sql );

    if ( $db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function GravarConsignacao() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT COUNT(*) AS total FROM artistas_consignacoes WHERE TRUE";

    if ($_POST['nome'] != '') {

        $sql .= " AND nome='" . $db->escapesql($_POST['nome']) . "' 
                AND idArtistaConsignacao <> " . $_POST['idArtistaConsignacao'];
  
  
        $db->query( $sql );
        $result = $db->fetch();   
      
        if($result["total"] > 0){
            echo "-1";
            return;
        }
    }

    $sql = "artistas_consignacoes SET 
            ativo = " . $_POST['ativo'] . ", 
            idArtista = " . $_POST['idArtista'] . ", 
            nome = UCASE('" . $db->escapesql($_POST['nome']) . "'), 
            descricao = '" . $db->escapesql($_POST['descricao']) . "', 
            idEstilo = " . $_POST['estilo'] . " ,    
            tamanho = '" . $db->escapesql($_POST['tamanho']) . "', 
            valorConsignacao = '" . ValorE($_POST['valorConsignacao']) . "', 
            valorVenda = '" . ValorE($_POST['valorVenda']) . "', 
            imagem = '" . $db->escapesql($_POST['imagem']) . "', 
            quantidade = " . $_POST['qtde'] . ", 
            dataAtualizacao=NOW()";

    if ($_POST['idArtistaConsignacao'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idArtistaConsignacao = " . $_POST['idArtistaConsignacao'];
    } else {
        $sql = "INSERT INTO " . $sql . ", idUsuarioCadastro=" . $_SESSION['photoarts_codigo'] . ", dataCadastro=NOW()";
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {

        if ($_POST['idArtistaConsignacao'] > 0) {
            echo $_POST['idArtistaConsignacao'];
        } else {
            echo UltimoRegistroInserido($db);
        }

// VERIFICA SE O ARTISTA JÁ TEM CADASTRADO O ESTILO, SE NAO GRAVA O NOVO ESTILO DO ARTISTA

        $sql = "SELECT * FROM artistas_estilos WHERE idArtista = " . $_POST['idArtista'] . " AND idEstilo = " . $_POST['estilo'];
        
        $db->query( $sql );
        $result = $db->fetch();   

        if($result["idArtista"] > 0){
            return;
        } else {
            $sql = "INSERT INTO artistas_estilos SET dataCadastro = NOW() , idUsuarioCadastro = " . $_SESSION['photoarts_codigo']
                    . ", idArtista = " . $_POST['idArtista'] . ", idEstilo = " . $_POST['estilo'];

            $db->query( $sql );

            if ( $db->n_rows <= 0) {
                echo '0';
            }
        }
//FIM DA VERIFICAÇÃO DE ESTILO
    }
            
    $db->close();
}

function AtualizarImagemConsignacao() {

    $db = ConectaDB();

    $sql = "UPDATE artistas_consignacoes SET imagem = '" . $_POST['imagem'] . "' 
            WHERE idArtistaConsignacao = " . $_POST['idConsignacao'];
    $db->query( $sql );
}

function GerarMiniaturaConsignacao() {

    Redimensionar("../imagens/obras/consignacoes/" . $_POST['imagem'], 175, 125, "mini_", 80);
    if (file_exists("../imagens/obras/consignacoes/" . $_POST['imagem'])) {

        $json = array(
            'foto' => "imagens/obras/consignacoes/mini_" . $_POST['imagem']
        );

        echo json_encode($json);
    } else {
        echo "0";
    }
}

function MostrarConsignacoesArtista() {

    $db = ConectaDB();

    $sql = "SELECT ac.idArtistaConsignacao, ac.dataCadastro, IF(ac.ativo = 1, 'SIM', 'NÃO') AS ativo, ac.nome, ac.descricao, e.estilo,
            ac.tamanho, ac.valorConsignacao, ac.valorVenda, ac.imagem, ac.quantidade, 
            (SELECT COUNT(*) FROM vendas_comp WHERE idObra = idArtistaConsignacao AND del = 0) AS qtdeVendidas
            FROM artistas_consignacoes AS ac
            LEFT JOIN estilos AS e
            ON ac.idEstilo = e.idEstilo
            WHERE idArtista = " . $_POST['idArtista'] . " AND ac.del = 0 ORDER BY ac.nome";

    $db->query( $sql );
      
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idArtistaConsignacao' => $linha['idArtistaConsignacao'],
                'ativo' => $linha['ativo'],
                'nome' => $linha['nome'],
                'estilo' => $linha['estilo'],
                'descricao' => $linha['descricao'],
                'imagem' => $linha['imagem'],
                'imagemMini' => 'imagens/obras/consignacoes/mini_' . $linha['imagem'],
                'imagemOriginal' => 'imagens/obras/consignacoes/' . $linha['imagem'],
                'qtdeVendidas' => $linha['qtdeVendidas'],
                'tamanho' => $linha['tamanho'],
                'valorConsignacao' => FormatMoeda($linha['valorConsignacao']),
                'valorVenda' => FormatMoeda($linha['valorVenda']),
                'quantidade' => $linha['quantidade']
            );
        }
        
        echo json_encode($json);
    }
        
    $db->close();
}

function getConsignacao() {

    $db = ConectaDB();

    $sql = "SELECT ativo, nome, descricao, idEstilo, tamanho, valorConsignacao, valorVenda, imagem, quantidade 
            FROM artistas_consignacoes 
            WHERE idArtistaConsignacao = " . $_POST['idConsignacao'];
    
    $db->query( $sql );
    $linha = $db->fetch();   
       
    if($db->n_rows > 0){

        $json = ['ativo' => $linha['ativo'],
            'nome' => $linha['nome'],
            'estilo' => $linha['idEstilo'],
            'descricao' => $linha['descricao'],
            'tamanho' => $linha['tamanho'],
            'valorConsignacao' => FormatMoeda($linha['valorConsignacao']),
            'valorVenda' => FormatMoeda($linha['valorVenda']),
            'quantidade' => $linha['quantidade'],
            'imagem' => $linha['imagem'],
            'imagemMini' => 'imagens/obras/consignacoes/mini_' . $linha['imagem']
            ];

        echo json_encode($json);
    }

    $db->close();
}

function ExcluirConsignacao() {
    inicia_sessao();
    
    $db = ConectaDB();

    /* $sql = "SELECT COUNT(*) AS total FROM vendas_comp 
      WHERE idConsignacao = " . $_POST['idConsignacao'] . " AND del = 0";
      $Tb = ConsultaSQL($sql, $ArqT);

      if (mysqli_result($Tb, 0, "total") > 0) {
      echo '-1';
      return;
      } */

    $sql = "UPDATE artistas_consignacoes SET 
           del = 1, dataDel = NOW(), 
           idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
           WHERE idArtistaConsignacao = " . $_POST['idConsignacao'];

    $db->query( $sql );

    if ($db->n_rows > 0) {
        echo '1';
    } else {
        echo '0';
    }

    $db->close();
}

function getQtdeTamanhosVendidos() {

    $db = ConectaDB();

    /* $sql = "SELECT idVendaComp, t.nomeTamanho, CONCAT(vc.altura, 'x', vc.largura) AS medidas, aot.tiragemMaxima,
      (SELECT COUNT(*) FROM vendas_comp WHERE idObra = 1 AND idTamanho = vc.idTamanho) AS qtdeVendidos
      FROM vendas_comp AS vc
      INNER JOIN tamanhos AS t ON t.idTamanho = vc.idTamanho
      INNER JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = vc.idTamanho
      WHERE vc.idObra = " . $_POST['idObra'] . " AND vc.del = 0"; */

    $sql = "SELECT t.nomeTamanho, CONCAT(CAST(aot.altura AS UNSIGNED), 'x', CAST(aot.largura AS UNSIGNED)) AS medidas,
        aot.tiragemMaxima, aot.tiragemAtual
        FROM artistas_obras_tamanhos AS aot
        INNER JOIN tamanhos AS t USING(idTamanho)
        WHERE aot.del=0 AND idObra=" . $_POST['idObra'];

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                //'idVendaComp' => $linha['idVendaComp'],
                'nomeTamanho' => $linha['nomeTamanho'],
                'medidas' => $linha['medidas'],
                'tiragemMaxima' => $linha['tiragemMaxima'],
                'qtdeVendidos' => $linha['tiragemAtual']
            );
        }

        echo json_encode($json);
    }
            
    $db->close();
}

function ExcluirImagemConsignacao() {

    $db = ConectaDB();

    $sql = "UPDATE artistas_consignacoes SET imagem = '' WHERE idArtistaConsignacao = " . $_POST['idConsignacao'];
   
    $db->query( $sql );

    if($db->n_rows > 0){

        if (file_exists("../imagens/obras/consignacoes/" . $_POST['imagem'])) {

            if (unlink("../imagens/obras/consignacoes/" . $_POST['imagem'])) {

                unlink("../imagens/obras/consignacoes/mini_" . $_POST['imagem']);
                echo '1';
            } else {
                echo '0';
                return;
            }
        }
    } else {
        echo '0';
        return;
    }

    $db->close();
}

function MostrarPagamentosArtista() {

    $db = ConectaDB();

    $sql = "SELECT c.idConpag, c.descricao, c.valorTotal, 
            ROUND(((c.valorTotal * (SELECT comissao FROM artistas WHERE idArtista = " . $_POST['idArtista'] . ")) / 100), 2) AS comissao, 
            (SELECT comissao FROM artistas WHERE idArtista = " . $_POST['idArtista'] . ") AS comissaoPercentual, 
            (SELECT COUNT(*) FROM conpagparcelas WHERE idConpag = c.idConpag) AS qtdParcelas, cp.valor,
            (SELECT SUM(valorPago) FROM conpagparcelas WHERE idConpag = c.idConpag AND pago = 1 AND del = 0) AS valorTotalPago,
            (SELECT IFNULL(SUM(valor), 0.00) FROM conpagparcelas WHERE idConpag = c.idConpag AND pago = 0 AND del = 0) AS valorAPagar
            FROM conpag AS c
            INNER JOIN conpagparcelas AS cp ON cp.idConpag = c.idConpag
            WHERE c.idArtista = " . $_POST['idArtista'] . " AND c.del = 0";

    if ($_POST['tipo'] === '1') {

        $sql .= " AND cp.pago = 1";
    }

    if ($_POST['tipo'] === '2') {

        $sql .= " AND cp.pago = 0";
    }

    $sql .= " GROUP BY c.idConpag";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = [
                'idConpag' => $linha['idConpag'],
                'descricao' => $linha['descricao'],
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'comissao' => FormatMoeda($linha['comissao']) . " (" . FormatMoeda($linha['comissaoPercentual']) . "%)",
                'qtdeParcelas' => $linha['qtdParcelas'] . "x de " . FormatMoeda($linha['valor']),
                'valorTotalPago' => FormatMoeda($linha['valorTotalPago']),
                'valorAPagar' => FormatMoeda($linha['valorAPagar'])
            ];
        }

        echo json_encode($json);
        $db->close();
    }

}

function CompleteTipoPagamento() {

    $db = ConectaDB();

    $sql = "SELECT DISTINCT(tipoPagamento) FROM artistas ORDER BY tipoPagamento";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'tipoPagamento' => $linha['tipoPagamento']
            );
        }

        echo json_encode($json);
        $db->close();
    }

}

function TabelaDeVendas() {

    $db = ConectaDB();

    $sql = "SELECT v.idVenda, v.dataVenda, c.cliente, IFNULL(op.idOrdemProducao, '') AS idOp, 
            IFNULL(opc.numeroSerie, '') AS numeroSerie, IFNULL(aot.tiragemAtual, 0) AS tiragemAtual, v.valorTotal
            FROM vendas AS v
            LEFT JOIN vendas_comp AS vc ON vc.idVenda=v.idVenda
            LEFT JOIN clientes AS c ON c.idCliente=v.idCliente
            LEFT JOIN ordem_producao AS op ON op.idVenda=v.idVenda
            LEFT JOIN ordem_producao_comp AS opc ON opc.idOrdemProducao=op.idOrdemProducao
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtista=vc.idArtista AND aot.idTamanho=vc.idTamanho AND aot.idObra=vc.idObra
            WHERE vc.idArtista= " . $_POST['idArtista'] . " AND v.del=0
            ORDER BY v.dataVenda DESC";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){

            $json[] = array(
                'data' => FormatData($linha['dataVenda']),
                'pedido' => $linha['idVenda'],
                'cliente' => $db->escapesql($linha['cliente']),
                'op' => $linha['idOp'],
                'serie' => $linha['numeroSerie'],
                'tiragem' => $linha['tiragemAtual'],
                'valor' => FormatMoeda($linha['valorTotal']),
                'pagamento' => getPagamentoVenda($db, $linha['idVenda'])
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function ExportarVendas() {

    $db = ConectaDB();

    $sql = "SELECT v.idVenda, v.dataVenda, c.cliente, IFNULL(op.idOrdemProducao, '') AS idOp, IFNULL(opc.numeroSerie, '') AS numeroSerie,
        IFNULL(aot.tiragemAtual, 0) AS tiragemAtual, v.valorTotal
        FROM vendas AS v
        LEFT JOIN vendas_comp AS vc ON vc.idVenda=v.idVenda
        LEFT JOIN clientes AS c ON c.idCliente=v.idCliente
        LEFT JOIN ordem_producao AS op ON op.idVenda=v.idVenda
        LEFT JOIN ordem_producao_comp AS opc ON opc.idOrdemProducao=op.idOrdemProducao
        LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtista=vc.idArtista AND aot.idTamanho=vc.idTamanho AND aot.idObra=vc.idObra
        WHERE vc.idArtista=" . $_POST['idArtista'] . " AND v.del=0
        ORDER BY v.dataVenda DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '-1';
        return;
    }

    $newPath = '../vendas-artistas-' . $_POST['idArtista'] . '.xls';
    $newPathReturn = 'vendas-artistas-' . $_POST['idArtista'] . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ( $excel->error == false){

        $arr = array('DATA', 'PEDIDO', 'CLIENTE', 'OP', 'Nº SÉRIE', 'TIRAGEM', 'VALOR', 'COND. PAGAMENTO');

        $excel->writeLine($arr);

        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){
    //Data | Pedido | Cliente | OP | Nº Série | Tiragem | Valor | Cond. Pagamento | Ver

            $arr = array(
                FormatData($linha['dataVenda']),
                $linha['idVenda'],
                $db->escapesql($linha['cliente']),
                $linha['idOp'],
                $linha['numeroSerie'],
                $linha['tiragemAtual'],
                FormatMoeda($linha['valorTotal']),
                getPagamentoVenda($db, $linha['idVenda'])
            );

            $excel->writeLine($arr);
        }

    }
    
    $excel->close();

    echo $newPathReturn;
    $db->close();
}
