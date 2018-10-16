
<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostraClientes':
            MostraClientes();
            break;
        
        case 'Mostra':
            Mostra();
            break;

        case 'Gravar':
            Gravar();
            break;

        case 'GetRegistroPrimeiro':
            $ArqT = ConectaDB();
            echo RegistroPrimeiro($ArqT, 'clientes', 'idCliente', false);
            break;

        case 'GetRegistroAnterior':
            $ArqT = ConectaDB();
            echo RegistroAnterior($ArqT, 'clientes', $_POST['atual'], 'idCliente', false);
            break;

        case 'GetRegistroProximo':
            $ArqT = ConectaDB();
            echo RegistroProximo($ArqT, 'clientes', $_POST['atual'], 'idCliente', false);
            break;

        case 'GetRegistroUltimo':
            $ArqT = ConectaDB();
            echo RegistroUltimo($ArqT, 'clientes', 'idCliente', false);
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'PesquisarClientes':
            PesquisarClientes();
            break;

        case 'getPropostas':
            getPropostas();
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

        case 'getEnderecos':
            getEnderecos();
            break;

        case 'MostrarFinanceiro':
            MostrarFinanceiro();
            break;

        case 'ExcluirColecionador':
            ExcluirColecionador();
            break;
    }
}

function MostraClientes(){

    $db = ConectaDB();
    
    $sql = "SELECT c.idCliente, c.dataCadastro, c.cliente, c.tipo, c.telefone, c.celular, c.email, c.ativo, c.premium, 
            (SELECT COUNT(*) FROM clientes_enderecos WHERE idCliente = c.idCliente AND del = 0) AS qtdEnderecos,
			(SELECT IFNULL(GROUP_CONCAT(DISTINCT l.loja SEPARATOR ', '), '') 
				FROM vendas AS v
				INNER JOIN lojas AS l USING(idLoja)
				WHERE v.idCliente=c.idCliente AND v.del = 0) AS galerias,
            c.arquiteto, c.arquitetoComissao
            FROM clientes AS c
			LEFT JOIN vendas AS vv USING(idCliente)
            WHERE c.del = 0 ";

    if($_POST['busca'] !== ''){

        $sql .= " AND (idCliente LIKE '%" . $_POST['busca'] . "%' 
                OR cliente LIKE '%" . $_POST['busca'] . "%' 
                OR apelido LIKE '%" . $_POST['busca'] . "%' 
                OR telefone LIKE '%" . $_POST['busca'] . "%' 
                OR celular LIKE '%" . $_POST['busca'] . "%' 
                OR email LIKE '%" . $_POST['busca'] . "%')";
    } 
	
	if($_POST['idLoja'] > 0) {
		$sql .= " AND vv.idLoja =" . $_POST['idLoja'] . " ";
	}

    if($_POST['mostraClientesPremium'] == 'true'){
        $sql .= " AND c.premium = 1";
    }
    
    if($_POST['mostraArquitetos'] == 'true'){
        $sql .= " AND c.arquiteto = 1";
    }

    $sql .= " GROUP BY c.idCliente ORDER BY c.ativo DESC, c.cliente ";
    
    if($_POST['todos'] !== 'true'){
       $sql .= " LIMIT 50 ";
    }

    $linha = $db->query( $sql );

    if ( $db->n_rows <= 0 ){
        echo '0';
    }else{

        while ($linha = $db->fetch()) {
            
            $telefones = '';
            if($linha['telefone'] != ''){
                $telefones = $linha['telefone'];
            }
            
            if($linha['celular'] != ''){
                $telefones .= ($telefones != '' ? ', ' : '') . $linha['celular'];
            }
            
            /*$endereco = '';             
            if($linha['endereco'] != ''){
                $endereco = $linha['endereco'] . 
                        ($linha['numero']>0 ? ', ' . $linha['numero'] : '') . 
                        ($linha['complemento'] != '' ? ' - ' . $linha['complemento'] : '') . 
                        ($linha['bairro'] != '' ? ' - ' . $linha['bairro'] : '') . 
                        ($linha['cidade'] != '' ? ' - ' . $linha['cidade'] : '') .
                        ($linha['estado'] != '' ? '/' . $linha['estado'] : '') . 
                        ($linha['cep'] != '' ? ' - ' . $linha['cep'] : '');
            }*/

            $json[] = array(
                'idCliente' => $linha['idCliente'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'numeroCliente' => number_format_complete($linha['idCliente'], '0', 4),                
                'cliente' => $linha['cliente'],
                //'sexo' => $linha['sexo'],
                'tipo' => $linha['tipo'],
                //'endereco' => $endereco,
                'qtdEnderecos' => $linha['qtdEnderecos'],
				'galerias' => $linha['galerias'],
                'telefones' => $telefones,
                'email' => $linha['email'],
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÂO'),
                'premium' => ($linha['premium'] == 1 ? 'SIM' : 'NÃO'),
                'arquiteto' => ($linha['arquiteto'] == 1 ? 'SIM (' . intval($linha['arquitetoComissao']) . '%)' : 'NÃO')
            );
        }
        echo json_encode($json);

    }

    $db->close();
}

function ExcluirFollowUP() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = "UPDATE contatos SET del = 1, 
            dataDel = NOW(),
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . "  WHERE idContato = " . $_POST['codigo'];


    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function GravarFollow() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "contatos SET idCliente = " . $_POST['cliente'] . ",
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
        $sql = "UPDATE " . $sql . " WHERE idContato =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    }

    $db->query( $sql );

    if (  $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function pesquisarFollow() {

    $db = ConectaDB();

    $sql = "SELECT idContatoTipo AS tipo, obs, DATE(dataRetorno) AS retorno, 
            LEFT(TIME(dataRetorno),5) AS horaretorno FROM contatos WHERE idContato =" . $_POST['codigo'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

function getFollow() {

    $db = ConectaDB();

    $sql = "SELECT  c.idContato AS codigo, c.dataCadastro AS data, t.tipoContato AS tipo, 
            IFNULL(f.funcionario, '') AS funcionario, c.obs, c.dataRetorno FROM contatos AS c 
            LEFT JOIN contatostipos AS t ON t.idContatoTipo = c.idContatoTipo
            LEFT JOIN funcionarios AS f ON f.idFuncionario = c.idUsuarioCadastro 
            WHERE c.del = 0 AND idCliente =  " . $_POST['codigo'];

    $sql .= " ORDER BY c.dataCadastro DESC  ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
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

function getPropostas() {


    $db = ConectaDB();

    $sql = "SELECT idOrcamento AS codigo, dataOrcamento AS DATA, '' AS situacao, e.nomeEvento AS evento,  
            IFNULL((SELECT versao FROM orcamentos_versoes WHERE  idOrcamentoVersao =  o.idUltimaVersao  ORDER BY idOrcamentoVersao DESC LIMIT 1),'') AS versao,
            IFNULL(v.vendedor,'') AS vendedor, o.valorTotal AS valor 
            FROM orcamentos AS o
            LEFT JOIN eventos AS e ON e.idEvento = o.idEvento
            LEFT JOIN vendedores AS v ON v.idVendedor = o.idVendedor
            WHERE idCliente = " . $_POST['codigo'];

    $sql .= " ORDER BY DATA ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'data' => FormatData($linha['data'], false),
                'situacao' => $linha['situacao'],
                'evento' => $linha['evento'],
                'versao' => $linha['versao'],
                'vendedor' => $linha['vendedor'],
                'valor' => FormatMoeda($linha['valor'])
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {
    inicia_sessao();

    $db = ConectaDB();

    $sql = " clientes SET 
            cliente =UCASE('" . $db->escapesql($_POST['nome']) . "'), 
            apelido =UCASE('" . $db->escapesql($_POST['apelido']) . "'), 
            dataCadastro ='" . DataSSql($_POST['cadastro']) . "', 
            cpfCnpj='" . $_POST['cpf'] . "', 
            ativo=" . $_POST['ativo'] . ", 
            premium = " . $_POST['premium'] . ", 
            arquiteto = " . $_POST['arquiteto'] . ", 
            arquitetoComissao = " . ValorE($_POST['arquitetoComissao']) . ", 
            rgIE ='" . $_POST['rg'] . "',
            dataNascimento ='" . DataSSql($_POST['dataNasc']) . "',
            sexo ='" . ($_POST['sexoM'] == 'true' ? 'M' : 'F') . "',                                             
            responsavel=UCASE('" . $db->escapesql( $_POST['responsavel']) . "'), 
            telefone='" . $_POST['telefone'] . "',
            celular='" . $_POST['celular'] . "',
            email=LCASE('" . $db->escapesql( $_POST['email']) . "'),
            site=LCASE('" . $db->escapesql( $_POST['site']) . "'),     
            obs='" . $db->escapesql( $_POST['obs']) . "',
            tipo='" . $_POST['tipo'] . "', dataAtualizacao= NOW(), idUsuarioAtualizacao= " . $_SESSION['photoarts_codigo'];

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idCliente =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
        return;
    }
    
    if ($_POST['codigo'] > 0) {
        $codigo = $_POST['codigo'];
    } else {
        $codigo = UltimoRegistroInserido($db);
    }

    if ($_POST['idsClientesEstilos'] != '') {
        $arrayEstilos = array($_POST['idsClientesEstilos'], $_POST['idsEstilos']);
        GravarEstilos($db, $codigo, $arrayEstilos);
    }

    if($_POST['idsClienteEnderecos'] != ''){
        $arrayEnderecos = array($_POST['idsClienteEnderecos'], $_POST['tiposEnderecos'], $_POST['ceps'], 
                        $_POST['enderecos'], $_POST['numeros'], $_POST['complementos'], $_POST['bairros'], 
                        $_POST['cidades'], $_POST['estados']);
        GravarEnderecos($db, $codigo, $arrayEnderecos);
    }

    echo $codigo;
    $db->close();
}

function GravarEnderecos($ArqT, $idCliente, $arrays) {

    inicia_sessao();

    $sql = "UPDATE clientes_enderecos SET del=1, dataDel=Now(), idUsuarioDel =" . $_SESSION['photoarts_codigo'] . " " .
            "WHERE idCliente =" . $idCliente;

    $ArqT->query( $sql );

    $idClienteEndereco = explode(',', $arrays[0]);
    $idTipoEndereco = explode(',', $arrays[1]);
    $cep = explode(',', $arrays[2]);
    $endereco = explode(',', $arrays[3]);
    $numero = explode(',', $arrays[4]);
    $complemento = explode(',', $arrays[5]);
    $bairro = explode(',', $arrays[6]);
    $cidade = explode(',', $arrays[7]);
    $estado = explode(',', $arrays[8]);

    for ($i = 0; $i < count($idClienteEndereco); $i++) {

        if($idTipoEndereco[$i] == 'Cobrança'){
            $tipoEndereco = 1;
        }else if($idTipoEndereco[$i] == 'Entrega'){
            $tipoEndereco = 2;
        }else{
            $tipoEndereco = 3;
        }

        $sql = " clientes_enderecos SET 
                idCliente = " . $idCliente . ", 
                idTipoEndereco = " . $tipoEndereco . ", 
                cep = '" . $cep[$i] . "', 
                endereco = '" . $ArqT->escapesql($endereco[$i]) . "', 
                numero = '" . $ArqT->escapesql($numero[$i]) . "', 
                complemento = '" . $ArqT->escapesql( $complemento[$i]) . "', 
                bairro = '" . $ArqT->escapesql($bairro[$i]) . "', 
                cidade = '" . $ArqT->escapesql( $cidade[$i]) . "', 
                estado = '" . $ArqT->escapesql($estado[$i]) . "', 
                dataAtualizacao = NOW(), 
                idUsuarioAtualizacao = " . $_SESSION['photoarts_codigo'] . " ";

        if ($idClienteEndereco[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del = 0, idUsuarioDel = 0 
                    WHERE idClienteEndereco =" . $idClienteEndereco[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), idUsuarioCadastro =" . $_SESSION['photoarts_codigo'];
        }

        $ArqT->query( $sql );

        if ($ArqT->n_rows <= 0) {

            $json = array(
                'status' => 'ERROR_SET_CLI_ENDERECOS'
            );

            echo json_encode($json);
            $ArqT->close();
            return;
        }
    }
}

function GravarEstilos($ArqT, $idCliente, $arrays) {
    inicia_sessao();

    //DELETA TODOS OS LOCAIS SALVOS
    $sql = "UPDATE clientes_estilos SET del=1, dataDel=Now(), idUsuarioDel =" . $_SESSION['photoarts_codigo'] . " " .
            "WHERE idCliente =" . $idCliente;

    $ArqT->query( $sql );
    //=====

    $idEstiloCliente = explode(',', $arrays[0]);
    $idEstilo = explode(',', $arrays[1]);

    for ($i = 0; $i < count($idEstiloCliente); $i++) {
        $sql = " clientes_estilos SET idCliente =" . $idCliente . ", " .
                "idEstilo =" . $idEstilo[$i] . ", "
                . "dataAtualizacao=Now(), "
                . "idUsuarioAtualizacao =" . $_SESSION['photoarts_codigo'] . " ";

        if ($idEstiloCliente[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del=0 WHERE idClienteEstilo =" . $idEstiloCliente[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now(), idUsuarioCadastro =" . $_SESSION['photoarts_codigo'];
        }

        $ArqT->query( $sql );

        if ($ArqT->n_rows <= 0) {
            $json = array(
                'status' => 'ERROR_SET_CLI_ESTILOS'
            );
            echo json_encode($json);
            $ArqT->close();
            return;
        }
    }
}

function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT *, "
            . "IFNULL(CONCAT((SELECT funcionario FROM funcionarios WHERE idFuncionario = clientes.idUsuarioAtualizacao),'') ,'') AS usuario "
            . "FROM clientes WHERE idCliente = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch(); 

        $json = array(
            'codigo' => $linha['idCliente'],
            'nome' => $linha['cliente'],
            'rg' => $linha['rgIe'],
            'dataNasc' => FormatData($linha['dataNascimento'], false),
            'apelido' => $linha['apelido'],
            'sexoM' => $linha['sexo'],
            'cadastro' => FormatData($linha['dataCadastro'], false),
            'tipo' => $linha['tipo'],
            'cpf' => $linha['cpfCnpj'],
            'ativo' => $linha['ativo'],
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
            'obs' => $linha['obs'],
            'arquiteto' => $linha['arquiteto'],
            'arquitetoComissao' => FormatMoeda($linha['arquitetoComissao']),
            'usuario' => ($linha['usuario'] !== "" ? "Última Atualização em " . FormatData($linha['dataAtualizacao'], true) .
                    " por " . $linha['usuario'] : ""),
            'site' => $linha['site'],
            'arrayEstilos' => MostrarEstilos($db, $linha['idCliente']),
            'premium' => $linha['premium'],
            'arrayEnderecos' => MostrarEnderecos($db, $linha['idCliente']),
            'arrayOrcamentos' => MostrarOrcamentos($db, $linha['idCliente']),
            'arrayVendas' => MostrarVendas($db, $linha['idCliente'])
        );

        echo json_encode($json);
    }
}

function MostrarEstilos($ArqT, $idCliente) {

    $sql = "SELECT ec.idClienteEstilo, ec.idEstilo, e.estilo "
            . "FROM clientes_estilos AS ec "
            . "INNER JOIN estilos AS e USING(idEstilo) "
            . "WHERE ec.del=0 AND ec.idCliente =" . $idCliente . " "
            . "ORDER BY estilo ";

    $ArqT->query( $sql );
    
    if ( $ArqT->n_rows <= 0 ) {
        return '0';
    } else {
        while ($linha = $ArqT->fetch()) {
            $json[] = array(
                'idClienteEstilo' => $linha['idClienteEstilo'],
                'idEstilo' => $linha['idEstilo'],
                'estilo' => $linha['estilo']
            );
        }

        return json_encode($json);
    }
}

function MostrarEnderecos($ArqT, $idCliente){

    $sql = "SELECT idClienteEndereco, te.tipoEndereco, cep, endereco, numero, complemento, bairro, cidade, estado 
            FROM clientes_enderecos AS ce
            INNER JOIN tipos_enderecos AS te USING(idTipoEndereco)
            WHERE idCliente = " . $idCliente . " AND del = 0";

    $ArqT->query( $sql );
    
    if ( $ArqT->n_rows <= 0 ) {
        return '0';
    }else{
        while ($linha = $ArqT->fetch()) { 

            $json[] = array(
                'idClienteEndereco' => $linha['idClienteEndereco'],
                'tipoEndereco' => $linha['tipoEndereco'],
                'cep' => $linha['cep'],
                'endereco' => $linha['endereco'],
                'numero' => $linha['numero'],
                'complemento' => $linha['complemento'],
                'bairro' => $linha['bairro'],
                'cidade' => $linha['cidade'],
                'estado' => $linha['estado']
            );
        }

        return json_encode($json);
    }
}

function MostrarOrcamentos($ArqT, $idCliente){
    $sql = "SELECT o.idOrcamento, LPAD(o.idOrcamento, 5, '0') AS numeroOrcamento, l.loja, o.dataOrcamento, 
            o.valorTotal, o.qtdParcelas, f.formaPagamento, v.vendedor, IFNULL(ve.idVenda, '') AS idVenda, o.del, 
            o.dataDel, ve.dataVenda, DATEDIFF(DATE_ADD(o.dataOrcamento, INTERVAL 30 DAY), CURDATE()) AS validade
            FROM orcamentos AS o
            INNER JOIN lojas AS l USING(idLoja)
            LEFT JOIN formaspagamentos AS f USING(idFormaPagamento)
            INNER JOIN vendedores AS v USING(idVendedor)
            LEFT JOIN vendas AS ve ON ve.idOrcamento = o.idOrcamento
            WHERE o.idCliente = " . $idCliente . " ORDER BY o.dataOrcamento DESC ";

    $ArqT->query( $sql );
    
    if ( $ArqT->n_rows <= 0 ) {
        return '0';
    }else{
        $status = '';
        
        $linhas = $ArqT->fetch_all();
        foreach ($linhas as $linha){

            if ($linha['idVenda'] != '') {
                $status = 'Gerado venda ' . number_format_complete($linha['idVenda'], '0', 4) . ' em ' . substr(FormatData($linha['dataVenda']), 0, 16);
            } else {
                if ($linha['del'] == '1') {
                    $status = 'Cancelado em ' . substr(FormatData($linha['dataDel']), 0, 16);
                } else {
                    if ($linha['validade'] < 0) {
                        $status = 'Não concretizado (vencido)';
                    } else {
                        $status = 'Em aberto';
                    }
                }
            }

            $json[] = array(
                'idOrcamento' => $linha['idOrcamento'],
                'numeroOrcamento' => $linha['numeroOrcamento'],
                'loja' => $linha['loja'],
                'dataOrcamento' => FormatData($linha['dataOrcamento']),
                'obras' => getObrasComposicao($ArqT, $linha['idOrcamento'], 0),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'qtdParcelas' => $linha['qtdParcelas'], 
                'formaPagamento' => $linha['formaPagamento'],
                'vendedor' => $linha['vendedor'],
                'status' => $status
            );
        }

        return json_encode($json);
    }
}

function MostrarVendas($ArqT, $idCliente){

    $sql = "SELECT v.idVenda, LPAD(v.idVenda, 5, '0') AS numeroVenda, l.loja, v.dataVenda, 
            v.valorTotal, 
            (SELECT COUNT(*) FROM vendas_parcelas WHERE idVenda = v.idVenda AND del = 0) AS qtdParcelas, 
            (SELECT fp.formaPagamento FROM vendas_parcelas AS vp
            INNER JOIN formaspagamentos AS fp USING(idFormaPagamento)
            WHERE vp.idVenda = v.idVenda AND vp.del = 0 LIMIT 1) AS formaPagamento, 
            ve.vendedor, vs.descricaoStatus 
            FROM vendas AS v
            INNER JOIN lojas AS l USING(idLoja)
            INNER JOIN vendedores AS ve USING(idVendedor) 
            INNER JOIN vendas_status AS vs ON vs.idVStatus = v.idUltimoStatus 
            WHERE v.idCliente = " . $idCliente . " GROUP BY v.idVenda ORDER BY v.dataVenda DESC";

    $ArqT->query( $sql );
    
    if ( $ArqT->n_rows <= 0 ) {
        return '0';
    }else{
        $status = '';
        $linhas = $ArqT->fetch_all();
        foreach ($linhas as $linha){

            $json[] = array(
                'idVenda' => $linha['idVenda'],
                'numeroVenda' => $linha['numeroVenda'],
                'loja' => $linha['loja'],
                'dataVenda' => FormatData($linha['dataVenda']),
                'obras' => getObrasComposicao($ArqT, $linha['idVenda'], 1),
                'valorTotal' => FormatMoeda($linha['valorTotal']),
                'qtdParcelas' => $linha['qtdParcelas'], 
                'formaPagamento' => $linha['formaPagamento'],
                'vendedor' => $linha['vendedor'],
                'status' => $linha['descricaoStatus']
            );
        }

        return json_encode($json);
    }
}

function MostrarFinanceiro(){

    $db = ConectaDB();

    $sql = "SELECT v.idVenda, LPAD(v.idVenda, 5, '0') AS numeroVenda, vp.idVendaParcela, l.loja, vp.parcela, 
            vp.dataVencimento, vp.valor, vp.valorPago, LEFT(vp.dataPagamento, 10) AS dataPagamento, 
            CURDATE() AS dataAtual 
            FROM vendas_parcelas AS vp 
            INNER JOIN vendas AS v USING(idVenda)
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja
            WHERE v.idCliente = " . $_POST['idCliente'] . " AND vp.del = 0";

    if($_POST['situacaoFinanceiro'] == '1'){
        $sql .= " AND vp.valorPago > 0";
    }else if($_POST['situacaoFinanceiro'] == '2'){
        $sql .= " AND vp.valorPago <= 0";
    }

    $sql .= " ORDER BY vp.dataVencimento DESC ";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $status = '';
        
        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){
            if ($linha['valorPago'] > 0) {
                $status = 'Pago em ' . FormatData($linha['dataPagamento']);
            } else {
                if ($linha['dataAtual'] > $linha['dataVencimento'] && $linha['valorPago'] <= 0){
                    $status = 'Vencido';
                } else {
                    $status = 'Em aberto';
                }
            }

            $json[] = array(
                'idVenda' => $linha['idVenda'],
                'numeroVenda' => $linha['numeroVenda'],
                'loja' => $linha['loja'],
                'parcela' => $linha['parcela'],
                'dataVencimento' => FormatData($linha['dataVencimento']),
                'obras' => getObrasComposicao($db, $linha['idVenda'], 1),
                'valor' => FormatMoeda($linha['valor']),
                'status' => $status
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function PesquisarClientes() {

    $db = ConectaDB();

    $sql = "SELECT idCliente AS codigo, cliente AS nome, apelido, ativo FROM clientes WHERE TRUE ";

    if ($_POST['nome'] != '') {
        $sql .= " AND UCASE(cliente) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(apelido) LIKE UCASE('%" . $_POST['nome'] . "%')";
    }

    $sql .= "ORDER BY ativo DESC, apelido";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            $json[] = array(
                'codigo' => $linha['codigo'],
                'nome' => $linha['nome'],
                'apelido' => $linha['apelido'],
                'ativo' => $linha['ativo']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function getEnderecos(){

    $db = ConectaDB();

    $sql = "SELECT te.tipoEndereco, cep, endereco, numero, complemento, bairro, cidade, estado 
            FROM clientes_enderecos AS ce
            INNER JOIN tipos_enderecos AS te USING(idTipoEndereco)
            WHERE idCliente = " . $_POST['idCliente'] . " AND del = 0"; 

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            $json[] = array(
                'tipoEndereco' => $linha['tipoEndereco'],
                'cep' => $linha['cep'],
                'endereco' => $linha['endereco'],
                'numero' => $linha['numero'],
                'complemento' => $linha['complemento'],
                'bairro' => $linha['bairro'],
                'cidade' => $linha['cidade'],
                'estado' => $linha['estado']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function ExcluirColecionador(){

    inicia_sessao();
    $db = ConectaDB();

    $sql = "UPDATE clientes SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idCliente = " . $_POST['idCliente'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '1';
    }else{
        echo '0';
    }

    $db->close();
}


