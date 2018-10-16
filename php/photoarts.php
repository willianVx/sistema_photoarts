<?php

include('../classes/config.php');
include('../classes/class.database.php');
include('../classes/class.send.php');
include('../classes/excelwriter.inc.php');
include('../padrao/rotinaspadrao.php');


function gravaErro($ArqT, $sql) {
    $sql = "INSERT INTO erro SET erro.sql = '" . TextoSSql($ArqT, $sql) . "'";
    mysqli_query($ArqT, $sql);
}

function AbreBancoPhotoarts() { 
        $con = new config();
        $id = AbreBanco($con->get_host(), $con->get_login(), $con->get_pass(), $con->get_banco());
        mysqli_set_charset($id, 'utf8');
        
        return $id;

}

function inicia_sessao(){
    if(!isset($_SESSION)) 
    {
        session_start();
    }
}

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'getDadosUsuario':
            getDadosUsuario();
            break;

        case 'checkSessao':
            checkSessao();
            break;

        case 'destroySessao':
            destroySessao();
            break;

        case 'BuscarCEP':
            BuscarCEP();
            break;

        case 'getBancos':
            getBancos();
            break;

        case 'getDepartamentos':
            getDepartamentos();
            break;

        case 'getCargos':
            getCargos();
            break;

        case 'getClientes':
            getClientes();
            break;

        case 'getVendedores':
            getVendedores();
            break;

        case 'getMarchands':
            getMarchands();
            break;

        case 'LoadDadosCliente':
            LoadDadosCliente();
            break;

        case 'VerificarCpfCnpjIgual':
            VerificarCpfCnpjIgual();
            break;
        
        case 'VerificarNomeIgual':
            VerificarNomeIgual();
            break;

        case 'getCentrosCusto':
            getCentrosCusto();
            break;

        case 'getNaturezas':
            getNaturezas();
            break;

        case 'getFornecedores':
            getFornecedores();
            break;

        case 'getFuncionarios':
            getFuncionarios();
            break;

        case 'getFormasPagamentos':
            getFormasPagamentos();
            break;

        case 'getContasBancarias':
            getContasBancarias();
            break;

        case 'getTiposTransportes':
            getTiposTransportes();
            break;

        case 'getDeAte':
            getDeAte();
            break;

        case 'getEstilos':
            getEstilos();
            break;

        case 'getUnidadesMedidas':
            getUnidadesMedidas();
            break;

        case 'getTamanhos':
            getTamanhos();
            break;

        case 'getArtistas':
            getArtistas();
            break;

        case 'getProdutos':
            getProdutos();
            break;

        case 'getGruposMolduras':
            getGruposMolduras();
            break;

        case 'getMolduras':
            getMolduras();
            break;

        case 'getAcabamentos':
            getAcabamentos();
            break;

        case 'MostraResultadoClientes':
            MostraResultadoClientes();
            break;

        case 'GravarClienteRapido':
            GravarClienteRapido();
            break;

        case 'getStatusOrcamento':
            getStatusOrcamento();
            break;

        case 'getStatusPedido2':
            getStatusPedido2();
            break;

        case 'getTitulosVencidos':
            getTitulosVencidos();
            break;

        case 'CheckPermissao':
            CheckPermissao();
            break;

        case 'getComissaoMarchand':
            getComissaoMarchand();
            break;

        case 'getLojas':
            getLojas();
            break;

        case 'getComboMateriais':
            getComboMateriais();
            break;

        case 'getEtapasOrdensProducao':
            getEtapasOrdensProducao();
            break;

        case 'getComboProdutos':
            getComboProdutos();
            break;

        case 'getNumerosOrdensCompras':
            getNumerosOrdensCompras();
            break;

        case 'getNumerosOrdensProducao':
            getNumerosOrdensProducao();
            break;

        case 'getImagemProduto':
            getImagemProduto();
            break;

        case 'BaixarImagemReal':
            BaixarImagemReal();
            break;

        case 'LoadAvisos':
            LoadAvisos();
            break;
        
        case 'MarcarAviso':
            MarcarAviso();
            break;

        case 'getClientesPremium':
            getClientesPremium();
            break;

        case 'getTiposEnderecos':
            getTiposEnderecos();
            break;

        case 'ExcluirEnderecoColecionador':
            ExcluirEnderecoColecionador();
            break;

        case 'getEnderecosColecionador':
            getEnderecosColecionador();
            break;

        case 'GravarEnderecoColecionador':
            GravarEnderecoColecionador();
            break;

        case 'VerificarAdmin':
            VerificarAdmin();
            break;

        case 'CalcularPrecoPrazoCorreios':
            CalcularPrecoPrazoCorreios();
            break;

        case 'getMarchandsGerentes':
            getMarchandsGerentes();
            break;

        case 'SubtrairData':
            SubtrairData();
            break;

        case 'LoadAniversariantes':
            LoadAniversariantes();
            break;

        case 'getSemanaDeAte':
            getSemanaDeAte();
            break;

        case 'getTiposProdutos':
            getTiposProdutos();
            break;
        case 'checkMarchand':
            checkMarchand();
            break;

        case 'checkLoja':
            checkLoja();
            break;

        case 'getArquitetos':
            getArquitetos();
            break;
    }
}


class REQUEST implements \ArrayAccess {
    private $request = array();

    public function __construct() {
        $this->request = $_REQUEST;
    }

    public function offsetSet($offset, $value) {
        if (is_null($offset)) {
            $this->request[] = $value;
        } else {
            $this->request[$offset] = $value;
        }
    }

    public function offsetExists($offset) {
        return isset($this->request[$offset]);
    }

    public function offsetUnset($offset) {
        unset($this->request[$offset]);
    }

    public function offsetGet($offset) {
        return isset($this->request[$offset]) ? $this->request[$offset] : null;
    }
}



function getEtapasOrdensProducao() {

    $db = ConectaDB();

    $sql = "SELECT idEtapa AS codigo, CONCAT(etapa, ' - ', descricaoEtapa) AS nome FROM etapas 
            WHERE ativo = 1 ORDER BY ordem";
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

function getComboMateriais() {

    $db = ConectaDB();

    $sql = "SELECT idMaterial AS codigo, nomeMaterial AS nome FROM materiais WHERE ativo = 1 ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

function getComboProdutos() {
    $db = ConectaDB();

    $sql = "SELECT idProduto AS codigo, nomeProduto AS nome FROM produtos WHERE ativo = 1 ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

function Erros($texto) {
    $db = ConectaDB();
    $sql = "INSERT INTO erros SET texto = '" . $db->escapesql($texto) . "' ";
    $db->query( $sql );
    $db->close();
}

function getTitulosVencidos() {

    $db = ConectaDB();

    $sql = "SELECT c.idConpag, p.idConpagParcela AS idParcela, 
            CONCAT(LPAD(p.numero, 2, '0'), '/', LPAD(c.qtdeParcelas, 2, '0')) AS parcela,    
            p.dataVencimento, 
            p.valor, IF(DATEDIFF(CURDATE(), p.dataVencimento) > 0, 1, 0) AS vencido FROM conpag AS c 
            INNER JOIN conpagparcelas AS p ON p.idConpag = c.idConpag
            WHERE c.del = 0 AND p.del = 0 AND p.dataVencimento <= CURDATE() AND p.pago = 0 
            ORDER BY p.dataVencimento, vencido DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo'        => $linha['idConpag'],
                'idParcela'     => $linha['idParcela'],
                'titulo'        => number_format_complete($linha['idConpag'], '0', '5'),
                'parcela'       => $linha['parcela'],
                'data'          => FormatData($linha['dataVencimento'], false),
                'valor'         => FormatMoeda($linha['valor']),
                'vencido'       => $linha['vencido']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getDadosUsuario() {
    inicia_sessao();

    $json = array( 'codigo' => $_SESSION['photoarts_codigo'],
        'funcionario'   => $_SESSION['photoarts_funcionario'],
        'email'         => $_SESSION['photoarts_email'],
        'imagem'        => $_SESSION['photoarts_imagem'],
        'senhaPadrao'   => $_SESSION['photoarts_senhaPadrao'],
        'idPerfil'      => $_SESSION['photoarts_idPerfil']
        );

    echo json_encode($json);
    
    return;
}

function checkSessao() {
    inicia_sessao();

    if (isset($_SESSION['photoarts_codigo'])) {
        echo '1';
    } else {
        echo '0';
    }
}

function destroySessao() {
    inicia_sessao();
    session_destroy();
}

function BuscarCEP() {

    $db = ConectaDB();

    $sql = "SELECT r.rua, b.nome AS bairro, c.nome AS cidade, u.sigla AS estado FROM CEPS.ruas AS r 
            INNER JOIN CEPS.bairros AS b ON b.codigo = r.id_bairro
            INNER JOIN CEPS.cidades AS c ON c.id_cidade = b.id_cidade
            INNER JOIN CEPS.uf AS u ON u.codigo = c.id_uf
            WHERE r.CEP2 = '" . $_POST['cep'] . "'";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'rua' => $linha['rua'],
            'bairro' => $linha['bairro'],
            'cidade' => $linha['cidade'],
            'estado' => $linha['estado']
        );

    }
    echo json_encode($json);
    $db->close();
}

function getBancos() {

    $db = ConectaDB();

    $sql = "SELECT idBanco, CONCAT(LPAD(codigoBanco,3,0), ' - ', banco) AS banco 
            FROM bancos ORDER BY TRIM(banco)";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idBanco' => $linha['idBanco'],
                'banco' => $linha['banco']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getDepartamentos() {

    $db = ConectaDB();

    $sql = "SELECT idDepartamento, departamento FROM departamentos WHERE ativo = 1 AND del = 0 
            ORDER BY departamento";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idDepartamento' => $linha['idDepartamento'],
                'departamento' => $linha['departamento']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getCargos() {

    $db = ConectaDB();

    $sql = "SELECT idCargo, cargo FROM cargos WHERE del = 0 AND ativo = 1";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idCargo' => $linha['idCargo'],
                'cargo' => $linha['cargo']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getClientes() {

    $db = ConectaDB();

    $sql = "SELECT idCliente AS codigo, CONCAT(cliente, ' (', apelido, ')') AS nome
            FROM clientes 
            WHERE ativo = 1             
            ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => number_format_complete($linha['codigo'], '0', 4) . ' - ' . $linha['nome']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getMarchands() {

    $db = ConectaDB();

    $sql = "SELECT v.idVendedor AS codigo, v.vendedor AS nome, 
            IF(v.gerente = 1 , 'GERENTES' , 'MARCHANDS') AS tipo, l.loja	
            FROM vendedores AS v
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            WHERE v.ativo = 1
            ORDER BY loja, tipo, nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome'],
                'tipo' => $linha['tipo'],
                'loja' => $linha['loja']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getVendedores() {

    $db = ConectaDB();

    $sql = "SELECT idVendedor AS codigo, vendedor AS nome, IF(gerente = 1 , 'GERENTES' , 'MARCHANDS') AS tipo		
            FROM vendedores 
            WHERE ativo = 1 ";

    if($_POST['idLoja'] != ''){
        $sql .= " AND idLoja = " . $_POST['idLoja'] . " ";
    }

    $sql .= " ORDER BY nome";
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome'],
                'tipo' => $linha['tipo']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getTiposTransportes() {

    $db = ConectaDB();

    $sql = "SELECT idTransporteTipo AS codigo, tipoTransporte AS nome
            FROM transportes_tipos 
            WHERE ativo = 1            
            ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

function LoadDadosCliente() {

    $db = ConectaDB();

    $sql = "SELECT IF(responsavel='', IF(apelido='', cliente, apelido), responsavel) AS responsavel, arquiteto, 
            telefone, celular, email, arquitetoComissao
            FROM clientes 
            WHERE idCliente =" . $_POST['idCliente'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $linha = $db->fetch();

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
            'email' => $linha['email'], 
            'arquiteto' => $linha['arquiteto'], 
            'arquitetoComissao' => FormatMoeda($linha['arquitetoComissao'])
        );
        echo json_encode($json);
    }
    $db->close();
}

function VerificarCpfCnpjIgual() {

    if ($_POST['cpf'] == '') {
        return;
    }
    
    $db = ConectaDB();
    
    if ($_POST['codigo'] == '0') {
        $sql = "SELECT " . $_POST['nomeCampo'] . " FROM " . $_POST['tabela'] . " 
                WHERE " . $_POST['nomeCampo'] . " = '" . $_POST['cpf'] . "'";
    } else {
        $sql = "SELECT " . $_POST['nomeCampo'] . " FROM " . $_POST['tabela'] . " 
                WHERE " . $_POST['nomeCampo'] . " = '" . $_POST['cpf'] . "' AND 
                " . $_POST['pk'] . " <> " . $_POST['codigo'];
    }
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }    
    $db->close();

}

function VerificarNomeIgual() {

    if ($_POST['nome'] == '') {
        return;
    }
    $db = ConectaDB();

    if ($_POST['codigo'] == '0') {
        $sql = "SELECT " . $_POST['nomeCampo'] . " FROM " . $_POST['tabela'] . " 
                WHERE TRIM(" . $_POST['nomeCampo'] . ") = TRIM('" . $_POST['nome'] . "')";
    } else {
        $sql = "SELECT " . $_POST['nomeCampo'] . " FROM " . $_POST['tabela'] . " 
                WHERE TRIM(" . $_POST['nomeCampo'] . ") = TRIM('" . $_POST['nome'] . "') AND 
                " . $_POST['pk'] . " <> " . $_POST['codigo'];
    }

    $linhas = $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }    
    $db->close();
}

function getCentrosCusto() {

    $db = ConectaDB();

    $sql = "SELECT idCentroCusto, centrocusto FROM centro_custos 
            WHERE ativo = 1 AND del = 0 ORDER BY centrocusto";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idCentroCusto' => $linha['idCentroCusto'],
                'centroCusto' => $linha['centrocusto']
            );
        }
    }
    echo json_encode($json);
    $db->close();
}

function getNaturezas() {

    $db = ConectaDB();

    $sql = "SELECT idNatureza, natureza FROM naturezas 
            WHERE ativo = 1 AND del = 0 ORDER BY natureza";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idNatureza' => $linha['idNatureza'],
                'natureza' => $linha['natureza']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getFornecedores() {

    $db = ConectaDB();

    $sql = "SELECT idFornecedor, IF(razaoFornecedor = '', fornecedor, razaoFornecedor) AS fornecedor 
            FROM fornecedores 
            WHERE ativo = 1 ORDER BY IF(razaoFornecedor = '', fornecedor, razaoFornecedor)";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idFornecedor' => $linha['idFornecedor'],
                'fornecedor' => $linha['fornecedor']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getFuncionarios() {

    $db = ConectaDB();

    $sql = "SELECT idFuncionario, funcionario FROM funcionarios 
            WHERE ativo = 1 ORDER BY funcionario";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idFuncionario' => $linha['idFuncionario'],
                'funcionario' => $linha['funcionario']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getFormasPagamentos() {

    $db = ConectaDB();

    $sql = "SELECT idFormaPagamento, formaPagamento FROM formaspagamentos 
            WHERE ativo = 1 AND del = 0 ORDER BY formaPagamento";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idFormaPagamento' => $linha['idFormaPagamento'],
                'formaPagamento' => $linha['formaPagamento']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getContasBancarias() {

    $db = ConectaDB();

    $sql = "SELECT idConta, conta FROM contas 
            WHERE ativo = 1 AND del = 0 ORDER BY conta";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idConta' => $linha['idConta'],
                'conta' => $linha['conta']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getDeAte() { 
    $data = getdate();

    $de = $data['year'] . '-' . sprintf('%002s', $data['mon']) . '-01';
    $ate = add_date($de, -1, 1, 0);

    $json = array(
        'de' => FormatData($de),
        'ate' => FormatData($ate, false)
    );

    echo json_encode($json);
    
    
}

function getEstilos() {

    $db = ConectaDB();

    $sql = "SELECT idEstilo, estilo FROM estilos WHERE ativo = 1 AND del = 0 ORDER BY estilo";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idEstilo' => $linha['idEstilo'],
                'estilo' => $linha['estilo']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getUnidadesMedidas() {

    $db = ConectaDB();

    $sql = "SELECT idUnidadeMedida, unidadeMedida FROM unidades_medidas "
            . "WHERE ativo = 1 ORDER BY unidadeMedida";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idUnidadeMedida'],
                'nome' => $linha['unidadeMedida']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getTamanhos() {

    $db = ConectaDB();

    $sql = "SELECT idTamanho, 
        CONCAT(nomeTamanho, ' (', TRUNCATE(altura, 0), 'x', TRUNCATE(largura, 0), ')') AS nome
        FROM tamanhos WHERE ativo = 1 ORDER BY nomeTamanho DESC, altura, largura";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idTamanho' => $linha['idTamanho'],
                'nomeTamanho' => $linha['nome']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getArtistas() {

    $db = ConectaDB();

    $sql = "SELECT idArtista, artista FROM artistas WHERE ativo = 1 ORDER BY artista";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idArtista' => $linha['idArtista'],
                'artista' => $linha['artista']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getProdutos() {

    $db = ConectaDB();

    $sql = "SELECT idProduto, nomeProduto, valorProduto, imagem "
            . "FROM produtos "
            . "WHERE ativo = 1 ORDER BY nomeProduto";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idProduto'],
                'nome' => $linha['nomeProduto'] . ' - ' . FormatMoeda($linha['valorProduto']),
                'imagem' => $linha['imagem']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getGruposMolduras() {

    $db = ConectaDB();

    $sql = "SELECT idMolduraGrupo, molduraGrupo "
            . "FROM molduras_grupos "
            . "WHERE ativo = 1 ORDER BY molduraGrupo";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idMolduraGrupo'],
                'nome' => $linha['molduraGrupo']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getMolduras() {

    $db = ConectaDB();

    $sql = "SELECT idMoldura, moldura, imagem "
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

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idMoldura'],
                'nome' => $linha['moldura'],
                'imagem' => $linha['imagem']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getAcabamentos() {

    $db = ConectaDB();

    $sql = "SELECT idAcabamento, nomeAcabamento, bloquearVendaUltrapassou1M 
            FROM acabamentos WHERE ativo = 1 ";

    if ($_POST['tipo'] == 'p') {
        $sql .= "AND photoArts=1 ";
    } elseif ($_POST['tipo'] == 'i') {
        $sql .= "AND instaArts=1 ";
    }

    $sql .= "ORDER BY nomeAcabamento";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idAcabamento'],
                'nome' => $linha['nomeAcabamento'],
                'bloquearVendaUltrapassou1M' => $linha['bloquearVendaUltrapassou1M']
            );
        }    
        echo json_encode($json);
    }

    $db->close();
}

function MostraResultadoClientes() {

    $db = ConectaDB();

    $sql = "SELECT idCliente AS codigo, cliente AS nome, apelido, cpfCnpj, telefone, celular FROM clientes WHERE TRUE";
    
    if($_POST['tipoPessoa'] == "F") {
        //$sql .= " AND (tipo = 'F' OR tipo = '')";
    } else {
        //$sql .= " AND (tipo = 'J' OR tipo = '')";
    }
    
    if ($_POST['nome'] != '') {
        $sql .= " AND (UCASE(cliente) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(apelido) LIKE UCASE('%" . $_POST['nome'] . "%'))";
    }

    if ($_POST['ativo'] === 'true') {

        $sql.= " AND ativo = 1";
    } else {
        $sql.= " AND ativo = 0";
    }

    if ($_POST['cpfCnpj'] !== '') {
        $sql .= " AND cpfCnpj LIKE '%" . $_POST['cpfCnpj'] . "%'";
    }

    if ($_POST['telefone'] !== '') {
        $sql .= " AND telefone LIKE '%" . $_POST['telefone'] . "%'";
    }

    if ($_POST['celular'] !== '') {
        $sql .= " AND celular LIKE '%" . $_POST['celular'] . "%'";
    }

    $sql .= " ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

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
    }
    $db->close();
}

function GravarClienteRapido() {

    $db = ConectaDB();

    /*$sql = "INSERT INTO clientes SET 
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

    $sql = "INSERT INTO clientes SET 
            cliente = UCASE('" . $db->escapesql($_POST['nome']) . "'), 
            apelido = UCASE('" . $db->escapesql($_POST['apelido']) . "'), 
            dataCadastro ='" . DataSSql($_POST['cadastro']) . "', 
            cpfCnpj='" . $_POST['cpf'] . "', 
            ativo=" . $_POST['ativo'] . ", 
            premium=" . $_POST['premium'] . ", 
            rgIE ='" . $_POST['rg'] . "',
            dataNascimento ='" . DataSSql($_POST['dataNasc']) . "',
            sexo ='" . ($_POST['sexoM'] == 'true' ? 'M' : 'F') . "', 
            responsavel=UCASE('" . $db->escapesql( $_POST['responsavel']) . "'), 
            telefone='" . $_POST['telefone'] . "',
            celular='" . $_POST['celular'] . "',
            email=LCASE('" . $db->escapesql( $_POST['email']) . "'),
            site=LCASE('" . $db->escapesql( $_POST['site']) . "'),     
            obs='" . $db->escapesql( $_POST['obs']) . "',
            arquiteto = " . $_POST['arquiteto'] . ", 
            arquitetoComissao = " . ValorE($_POST['arquitetoComissao']) . ", 
            tipo='" . $_POST['tipo'] . "'";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        echo UltimoRegistroInserido($db);
    }
    $db->close();
}

function getStatusOrcamento() {

    $db = ConectaDB();

    $sql = "SELECT idOStatus, status 
            FROM o_status WHERE ativo = 1 ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idOStatus' => $linha['idOStatus'],
                'status' => $linha['status']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getStatusPedido2() {

    $db = ConectaDB();

    $sql = "SELECT idVStatus, status 
            FROM v_status WHERE ativo = 1 ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idVStatus' => $linha['idVStatus'],
                'status' => $linha['status']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getPagamentoVenda($ArqT, $idVenda) {

    $sql = "SELECT COUNT(*) AS total FROM vendas_parcelas WHERE idVenda = " . $idVenda . " AND del = 0";

    $ArqT->query( $sql );
    $result = $ArqT->fetch();

    if ( $result['total'] > 0){

        $sql = "SELECT v.valor AS valorPago, MAX(v.parcela) AS qtdVezes, f.formaPagamento
                FROM vendas_parcelas AS v         
                INNER JOIN formaspagamentos AS f ON f.idFormaPagamento = v.idFormaPagamento
                WHERE v.del = 0 AND v.idVenda =" . $idVenda;

        $ArqT->query( $sql );

        if ( $ArqT->n_rows <= 0) {
            echo '0';
        }else{
            $texto = '';
            while ($linha = $ArqT->fetch()) {
                if ($texto != '') {
                    $texto .= '<br />';
                }
                $texto .= 'R$ ' . FormatMoeda($linha['valorPago']) . ' pago em ' . $linha['qtdVezes'] . 'x com ' . $linha['formaPagamento'];
            }
        
            return $texto;
        }
    }
    return 'Nenhum pagamento lançado';
}

function AtualizarStatusOrcamento($ArqT, $idOSStatus, $idOrcamento) {

    inicia_sessao();

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

    $ArqT->query( $sql );

    if ( $ArqT->n_rows > 0) {

        $sql = "UPDATE orcamentos SET idUltimoStatus = " . $idOSStatus . " WHERE idOrcamento = " . $idOrcamento;
        $ArqT->query( $sql );
    }
}

function getObrasComposicao($ArqT, $id, $tipo) {

    if ($tipo == 0) {
        $sql = "SELECT oc.idTipoProduto, IF(ISNULL(ao.nomeObra), 
                     IF(ISNULL(a.nomeAcabamento), 'Produtos', 'InstaArts'), 'PhotoArts') AS tipo, ao.nomeObra, a.nomeAcabamento, oc.altura, oc.largura, p.nomeProduto, 
                     IFNULL(m.moldura, '') AS moldura
                FROM orcamentos_comp AS oc            
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra            
                LEFT JOIN acabamentos AS a ON a.idAcabamento = oc.idAcabamento     
                LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto 
                LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura 
                WHERE oc.del=0 AND oc.selecionado = 1 AND oc.idOrcamento =" . $id;
    } else {
        $sql = "SELECT oc.idTipoProduto, IF(ISNULL(ao.nomeObra), 
                     IF(ISNULL(a.nomeAcabamento), 'Produtos', 'InstaArts'), 'PhotoArts') AS tipo, ao.nomeObra, a.nomeAcabamento, oc.altura, oc.largura, p.nomeProduto,
                     IFNULL(m.moldura, '') AS moldura        
                FROM vendas_comp AS oc            
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = oc.idObra            
                LEFT JOIN acabamentos AS a ON a.idAcabamento = oc.idAcabamento     
                LEFT JOIN produtos AS p ON p.idProduto=oc.idProduto 
                LEFT JOIN molduras AS m ON m.idMoldura = oc.idMoldura 
                WHERE oc.del=0 AND oc.idVenda =" . $id;
    }

    $ArqT->query( $sql );

    if ( $ArqT->n_rows <= 0){
        return 'Nenhuma obra encontrada/cadastrada';
    }
    
    $texto = '';
    while ($res = $ArqT->fetch()) {
        if ($texto != '') {
            $texto.= '<br />';
        }

        if ($res['idTipoProduto'] == '1') {
            $aux = 'PhotoArts - ' . $res['nomeObra'] . ' (' . 
                    FormatMoeda(round($res['altura'])) . 'x' . 
                    FormatMoeda(round($res['largura'])) . ') em ' . 
                    $res['nomeAcabamento'] . 
                    ($res['moldura'] == '' ? '' : ' - Mold.: ' . $res['moldura']);
            
        } else if ($res['idTipoProduto'] == '2') {
            $aux = 'InstaArts - (' . FormatMoeda(round($res['altura'])) . 'x' . 
                    FormatMoeda(round($res['largura'])) . ') em ' . 
                    $res['nomeAcabamento'] . 
                    ($res['moldura'] == '' ? '' : ' - Mold.: ' . $res['moldura']);
        } else {
            $aux = 'Produtos - ' . $res['nomeProduto'];
        }

        $texto.= $aux;
    }

    return $texto;
    
}

function CheckPermissao() {
    inicia_sessao();

    $pAdmin = $_SESSION['photoarts_admin'];
    $pChave = $_POST['chave'];
    $pCodigo = $_SESSION['photoarts_codigo'];
    
    if ($pAdmin == '1') {
        echo '1';
        return;
    }

    $db = ConectaDB();

    $sql = "SELECT COUNT(*) AS total FROM funcionarios_permissoes 
            WHERE idFuncionario = " . $pCodigo . " AND idChave = " . $pChave;

    $db->query( $sql );
    
    $result = $db->fetch();
            
    if ( $result['total'] == 0){
        echo '0';
    }else{
        echo '1';
    }


    $db->close();
    
}

function getComissaoMarchand() {

    $db = ConectaDB();

    $sql = "SELECT descontoMaximo, descontoMaximoObras FROM vendedores WHERE idVendedor = " . $_POST['idVendedor'];
    
    $db->query( $sql );

    if ( $db->n_rows <= 0){
        echo '0';
    } else {

        $linha = $db->fetch();

        $json = array(
            'descontoMaximo' => FormatMoeda($linha['descontoMaximo']),
            'descontoMaximoObras' => FormatMoeda($linha['descontoMaximoObras'])
        );
        echo json_encode($json);
    }
    $db->close();
}

function EnvioDeEmailsPhotoarts($nomeEmail, $paraEmail, $remetenteEmail, $remetenteNome, $copiaEmail, $copiaNome, $responderPara, $nomeResponderPara, $assuntoEmail, $msgEmail, $anexoArquivo, $tipoProduto) {

    $contato = new SendEmail();
    $contato->nomeEmail = $nomeEmail; // Nome do Responsavel que vai receber o E-Mail
    $contato->paraEmail = $paraEmail; // Email que vai receber a mensagem

    //$contato->configHost = 'mail.photoarts.com.br'; // Endereço do seu SMTP
    $contato->configHost = 'mail.photoarts.com.br';//'webcrio.criodigital.com';
    //$contato->configSecureSMTP = 'ssl'; // Tipo de criptografia usada '', ssl ou tls
    //$contato->configPort = 587; // Porta usada pelo seu servidor. Padrão 587 ou google 465
    $contato->configPort = 587; // Porta usada pelo seu servidor. Padrão 587 ou google 465
    $contato->configSMTPAuth = true; // Usa autenticação SMTP? (opcional) true ou false

    if ($tipoProduto == '1' || $tipoProduto == '3') {
        $contato->configUsuario = 'atendimento@photoarts.com.br';
        $contato->configSenha = 'photoarts731';
        //$contato->configUsuario = 'siscrio@criodigital.com.br';
        //$contato->configSenha = 'Sisc@21538';
    } else {
        $contato->configUsuario = 'contato@instaarts.com.br';
        $contato->configSenha = 'Arteref731';
        //$contato->configUsuario = 'siscrio@criodigital.com.br';
        //$contato->configSenha = 'Sisc@21538';
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

function getLojas() {

    $db = ConectaDB();

    $sql = "SELECT idLoja, loja, cep FROM lojas WHERE ativo = 1 AND del = 0 ORDER BY loja";

    $db->query( $sql );
                    
    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ( $linha = $db->fetch() ) {
            $json[] = array(
                'idLoja' => $linha['idLoja'],
                'loja' => $linha['loja'],
                'cep' => $linha['cep']
            );                    
        }        
        echo json_encode($json);
    }
    $db->close();
}

function getNumerosOrdensCompras() {

    $db = ConectaDB();

    $sql = "SELECT idOrdemCompra, LPAD(idOrdemCompra, 5, '0') AS numero 
            FROM ordem_compras 
            WHERE cancelada = 0 AND finalizada = 0 
            ORDER BY idOrdemCompra DESC";
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idOrdemCompra' => $linha['idOrdemCompra'],
                'numero' => $linha['numero']
            );
        }
        echo json_encode($json);
    }

    $db->close();
}

function getNumerosOrdensProducao() {

    $db = ConectaDB();

    $sql = "SELECT idOrdemProducao, LPAD(idOrdemProducao, 5, '0') AS numero 
            FROM ordem_producao
            WHERE cancelada = 0 AND finalizada = 0 
            ORDER BY idOrdemProducao DESC";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idOrdemProducao' => $linha['idOrdemProducao'],
                'numero' => $linha['numero']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function getImagemProduto() {

    $db = ConectaDB();

    $sql = "SELECT imagem FROM produtos WHERE idProduto = " . $_POST['idProduto'];
    
    $db->query( $sql );
            
    $result= $db->fetch();

    echo $result["imagem"];

    $db->close();
}

function BaixarImagemReal() {

    $filenameIn  = $_POST['src'];
    $filenameOut = __DIR__ . '/images/' . basename($_POST['text']);

    $contentOrFalseOnFailure   = file_get_contents($filenameIn);
    $byteCountOrFalseOnFailure = file_put_contents($filenameOut, $contentOrFalseOnFailure);

}

function LoadAvisos() {
    inicia_sessao();
    
    $db = ConectaDB();

    $periodo = $_POST['idPeriodo'];
    $codigo = $_SESSION['photoarts_codigo']; 

    $sql = "SELECT idFuncionarioAviso, a.dataAviso, a.link, a.horaAviso, a.descricao, a.ok
            FROM funcionarios_avisos AS a
            WHERE a.del = 0  
            AND (a.idFuncionario=0 OR a.idFuncionario= " . ($codigo > 0 ? $codigo : 0) . ")
            AND a.dataAviso >= CURDATE()
            AND a.dataAviso <= DATE_ADD(CURDATE(), INTERVAL  " . $periodo . " DAY) 
            ORDER BY ok ASC, dataAviso " . ($periodo > 0 ? 'DESC' : 'ASC') . ", horaAviso DESC";
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idFuncionarioAviso'],
                'dataAviso' => FormatData($linha['dataAviso']),
                'horaAviso' => substr($linha['horaAviso'], 0, 5),
                'aviso' => $linha['descricao'],
                'ok' => $linha['ok'],
                'link' => $linha['link']
            );
        }
        echo json_encode($json);
    }

    $db->close();
}

function MarcarAviso() {
    inicia_sessao();
    
    $db = ConectaDB();

    $sql = "UPDATE funcionarios_avisos SET ok = " . $_POST['ok'] . " 
            WHERE idFuncionarioAviso = " . $_POST['codigo'];
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        echo '1';
    }
    
    $db->close();
}

function getClientesPremium() {

    $db = ConectaDB();

    $sql = "SELECT idCliente AS codigo, cliente AS nome, premium, arquiteto 
            FROM clientes 
            WHERE ativo = 1
            ORDER BY premium DESC, arquiteto DESC, nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome'],
                'premium' => $linha['premium'],
                'arquiteto' => $linha['arquiteto']
            );
        }
        echo json_encode($json);
    }

    $db->close();
}

function getTiposEnderecos(){

    $db = ConectaDB();

    $sql = "SELECT * FROM tipos_enderecos";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idTipoEndereco' => $linha['idTipoEndereco'],
                'tipoEndereco' => $linha['tipoEndereco']
            );
        }
        echo json_encode($json);
    }

    $db->close();
}

// Revisar
function ExcluirEnderecoColecionador(){

    inicia_sessao();
    $db = ConectaDB();

    $sql = "UPDATE clientes_enderecos SET del = 1, idUsuarioDel = " . $_SESSION['photoarts_codigo'] . ", 
            dataDel = NOW() WHERE idClienteEndereco = " . $_POST['idClienteEndereco'];
    $db->query( $sql );
}

function getEnderecosColecionador(){

    $db = ConectaDB();

    $sql = "SELECT idClienteEndereco, cep, endereco, numero, complemento, bairro, cidade, estado 
            FROM clientes_enderecos WHERE idCliente = " . $_POST['idColecionador'] . " AND del = 0 
            AND idTipoEndereco IN(2,3)";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        $endereco = '';
        while ($linha = $db->fetch()) {

            $endereco = $linha['cep'] . ' - ' . $linha['endereco'] . ', ' . $linha['numero'] . ($linha['complemento'] == '' ? '' : ' ' . $linha['complemento']) . ' - ' . $linha['bairro'] . ' - ' . $linha['cidade'] . '/' . $linha['estado'];

            $json[] = array(
                'idClienteEndereco' => $linha['idClienteEndereco'],
                'endereco' => $endereco,
                'cep' => $linha['cep']
            );
        }
        echo json_encode($json);
    }
    $db->close();
}

function GravarEnderecoColecionador(){

    inicia_sessao();
    $db = ConectaDB();

    $sql = "SELECT COUNT(*) AS total FROM clientes_enderecos 
            WHERE idTipoEndereco IN(1,3) AND idCliente = " . $_POST['idColecionador'] . " AND del = 0";

    $db->query( $sql );
    $result = $db->fetch();

    if($result["total"] > 0 && $_POST['idTipoEndereco'] != '2'){
        echo '-1';
    }else{

        $sql = "INSERT INTO clientes_enderecos SET 
                idCliente = " . $_POST['idColecionador'] . ",
                idTipoEndereco = " . $_POST['idTipoEndereco'] . ", 
                cep = '" . $_POST['cep'] . "', 
                endereco = '" . $db->escapesql($_POST['endereco']) . "', 
                numero = '" . $db->escapesql($_POST['numero']) . "', 
                complemento = '" . $db->escapesql($_POST['complemento']) . "', 
                bairro = '" . $db->escapesql($_POST['bairro']) . "', 
                cidade = '" . $db->escapesql($_POST['cidade']) . "', 
                estado = '" . $db->escapesql($_POST['estado']) . "', 
                dataCadastro = NOW(), 
                idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '0';
        }else{
            $db->fetch();
            echo UltimoRegistroInserido( $db );
        }
    }
    
    $db->close();
}

function VerificarAdmin(){
    inicia_sessao();

    if(isset($_SESSION['photoarts_admin'])){
        echo $_SESSION['photoarts_admin'];
    }else{
        echo '0';
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
    $erro = '';
    $msgErro = '';
    $xPeso = count($peso);

    for ($i = 0; $i < $xPeso; $i++) {

        $xmlCorreios = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?nCdEmpresa=" . $_POST['nCdEmpresa'] . 
                "&sDsSenha=" . $_POST['sDsSenha'] . 
                "&nCdServico=" . $_POST['nCdServico'] . 
                "&sCepOrigem=" . $_POST['sCepOrigem'] . 
                "&sCepDestino=" . $_POST['sCepDestino'] . 
                "&nVlPeso=" . $peso[$i] . 
                "&nCdFormato=" . intval($_POST['nCdFormato']) . 
                "&nVlComprimento=" . $_POST['nVlComprimento'] . 
                "&nVlAltura=" . $altura[$i] . 
                "&nVlLargura=" . $largura[$i] . 
                "&nVlDiametro=" . ValorE($_POST['nVlDiametro']) . 
                "&sCdMaoPropria=" . $_POST['sCdMaoPropria'] . 
                "&nVlValorDeclarado=" . ValorE($_POST['nVlValorDeclarado']) . 
                "&sCdAvisoRecebimento=" . $_POST['sCdAvisoRecebimento'] . "";

        $xml = simplexml_load_file($xmlCorreios);
        
        //0 = Processamento feito com sucesso
        if($xml->Servicos->cServico->Erro == '0'){
            $qtdOk++;
            $valorTotal += intval( $xml->Servicos->cServico->Valor );
            $totalDias += intval( $xml->Servicos->cServico->PrazoEntrega );
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
            'prazoEntrega' => round( ($totalDias / $qtdOk ) + 1 ) . ' dia(s)'          
        );
            
        echo json_encode($json);
    }
    
    //$ArqT->close();
}

function getMarchandsGerentes(){

    $db = ConectaDB();

    $sql = "SELECT idVendedor, vendedor FROM vendedores WHERE ativo = 1 AND gerente = " . $_POST['gerentes'];

    if($_POST['idLoja'] != '0'){

        $sql .= " AND idLoja = " . $_POST['idLoja'];
    }

    $sql .= " ORDER BY vendedor";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idVendedor' => $linha['idVendedor'],
                'vendedor' => $linha['vendedor']
            );
        }
        echo json_encode($json);

    }
    $db->close();
}

function SubtrairData(){

    $db = ConectaDB();

    $sql = "SELECT DATE_SUB('" . DataSSql($_POST['data']) . "', INTERVAL " . $_POST['periodoMeses'] . " MONTH) AS data";

    $db->query( $sql );
    
    $result = $db->fetch();

    echo FormatData($result["data"]);
    
    $db->close();
}

function LoadAniversariantes(){

    $db = ConectaDB();

    $sql = "SELECT IF(cliente = '', apelido, cliente) AS nome FROM clientes 
            WHERE DAY(dataNascimento) BETWEEN DAY(DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE()) -1 DAY)) AND DAY(DATE_ADD(CURDATE(), INTERVAL 8-DAYOFWEEK(CURDATE()) DAY)) 
            AND MONTH(dataNascimento) BETWEEN MONTH(DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE()) -1 DAY)) AND MONTH(DATE_ADD(CURDATE(), INTERVAL 8-DAYOFWEEK(CURDATE()) DAY))";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'nome' => $linha['nome']
            );
        }
        echo json_encode($json);
    }

    $db->close();
}

function getSemanaDeAte(){

    $db = ConectaDB();

    $sql = "SELECT 
            (DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE()) -1 DAY)) AS de,
            (DATE_ADD(CURDATE(), INTERVAL 8-DAYOFWEEK(CURDATE()) DAY)) AS ate";

    $db->query( $sql );
            
    $result = $db->fetch();   

    $json = array(
        'de' => FormatData($result["de"]),
        'ate' => FormatData($result["ate"])
    );

    echo json_encode($json);
    $db->close();
}

function getTiposProdutos(){

    $db = ConectaDB();

    $sql = "SELECT idTipoProduto, produto FROM tipos_produtos WHERE TRUE ";

    if($_POST['mostraProduto'] == 'false'){

        $sql .= " AND idTipoProduto IN(1,2)";
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idTipoProduto' => $linha['idTipoProduto'],
                'produto' => $linha['produto']
            );
        }
        echo json_encode($json);
    }

    $db->close();
}

function checkMarchand() {

    inicia_sessao();

    if (isset($_SESSION['photoarts_idVendedor'])) {
        echo $_SESSION['photoarts_idVendedor'];
    } else {
        echo '0';
    }
}

function checkLoja() {

    inicia_sessao();

    if (isset($_SESSION['photoarts_idLoja_vendedor'])) {
        echo $_SESSION['photoarts_idLoja_vendedor'];
    } else {
        echo '0';
    }
}

function getImagemMoldura($ArqT, $idMoldura){

    $sql = "SELECT imagem FROM molduras WHERE idMoldura = " . $idMoldura;

    $ArqT->query( $sql );
    
    if( $ArqT->n_rows <= 0){
        return '0';
    }else{           
        $result = $ArqT->fetch();   
        return $result['imagem'];
    }
}

function getArquitetos() {

    $db = ConectaDB();

    $sql = "SELECT idCliente, cliente FROM clientes WHERE arquiteto=1 AND del=0 ORDER BY cliente";
    
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {
            $json[] = array(
                'codigo' => $linha['idCliente'], 
                'nome' => $linha['cliente']
            );
        }
        echo json_encode($json);

    }

    $db->close();

}