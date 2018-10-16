 
<?php

include './photoarts-pdv.php';

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
            $ArqT = AbreBancoPhotoarts();
            echo RegistroPrimeiro($ArqT, 'clientes', 'idCliente', false);
            break;

        case 'GetRegistroAnterior':
            $ArqT = AbreBancoPhotoarts();
            echo RegistroAnterior($ArqT, 'clientes', $_POST['atual'], 'idCliente', false);
            break;

        case 'GetRegistroProximo':
            $ArqT = AbreBancoPhotoarts();
            echo RegistroProximo($ArqT, 'clientes', $_POST['atual'], 'idCliente', false);
            break;

        case 'GetRegistroUltimo':
            $ArqT = AbreBancoPhotoarts();
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
    }
}

function MostraClientes(){

    $ArqT = AbreBancoPhotoartsPdv();
    
    $sql = "SELECT idCliente, dataCadastro, cliente, tipo, telefone, celular, email, ativo, premium, 
            (SELECT COUNT(*) FROM clientes_enderecos WHERE idCliente = c.idCliente AND del = 0) AS qtdEnderecos,
            c.arquiteto, c.arquitetoComissao
            FROM clientes AS c
            WHERE TRUE ";

    if($_POST['busca'] !== ''){

        $sql .= " AND (idCliente LIKE '%" . $_POST['busca'] . "%' 
                OR cliente LIKE '%" . $_POST['busca'] . "%' 
                OR apelido LIKE '%" . $_POST['busca'] . "%' 
                OR telefone LIKE '%" . $_POST['busca'] . "%' 
                OR celular LIKE '%" . $_POST['busca'] . "%' 
                OR email LIKE '%" . $_POST['busca'] . "%')";
    } 

    if($_POST['mostraClientesPremium'] == 'true'){
        $sql .= " AND premium = 1";
    }
    
    if($_POST['mostraArquitetos'] == 'true'){
        $sql .= " AND c.arquiteto = 1";
    }

    $sql .= " ORDER BY ativo DESC, cliente ";
    
    if($_POST['todos'] !== 'true'){
       $sql .= " LIMIT 50 ";
    }
     
    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysqli_num_rows($Tb) <= 0){
        echo '0';
    }else{

        while($linha =mysqli_fetch_assoc($Tb)){

            $telefones = '';
            if($linha['telefone'] != ''){
                $telefones = $linha['telefone'];
            }
            
            if($linha['celular'] != ''){
                $telefones .= ($telefones != '' ? ', ' : '') . $linha['celular'];
            }

            $json[] = array(
                'idCliente' => $linha['idCliente'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'numeroCliente' => number_format_complete($linha['idCliente'], '0', 4),                
                'cliente' => $linha['cliente'],
                'tipo' => $linha['tipo'],
                'qtdEnderecos' => $linha['qtdEnderecos'],
                'telefones' => $telefones,
                'email' => $linha['email'],
                'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÂO'),
                'premium' => ($linha['premium'] == 1 ? 'SIM' : 'NÃO'),
                'arquiteto' => ($linha['arquiteto'] == 1 ? 'SIM (' . intval($linha['arquitetoComissao']) . '%)' : 'NÃO')
            );
        }

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function ExcluirFollowUP() {
    
    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "UPDATE contatos SET del = 1, 
            dataDel = NOW() WHERE idContato = " . $_POST['codigo'];


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

    $sql = "contatos SET idCliente = " . $_POST['cliente'] . ",
            idContatoTipo = " . $_POST['tipo'] . ", 
            obs = UCASE('" . TextoSSql($ArqT, $_POST['obs']) . "'), 
            dataAtualizacao = NOW() ";

    $data = $_POST['retorno'] . " " . $_POST['horaretorno'] . ":00";

    if ($_POST['checkretorno'] == true) {
        $sql .= ", dataRetorno = '" . DataSSql($data, true) . "'";
    } else {
        $sql .= ", dataRetorno = '0000-00-00 00:00:00' ";
    }

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idContato =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , dataCadastro = NOW()";
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
            LEFT(TIME(dataRetorno),5) AS horaretorno FROM contatos WHERE idContato =" . $_POST['codigo'];

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

    $sql = "SELECT  c.idContato AS codigo, c.dataCadastro AS data, t.tipoContato AS tipo, 
            IFNULL(f.funcionario, '') AS funcionario, c.obs, c.dataRetorno FROM contatos AS c 
            LEFT JOIN contatostipos AS t ON t.idContatoTipo = c.idContatoTipo
            LEFT JOIN funcionarios AS f ON f.idFuncionario = c.idUsuarioCadastro 
            WHERE c.del = 0 AND idCliente =  " . $_POST['codigo'];

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

function getPropostas() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idOrcamento AS codigo, dataOrcamento AS DATA, '' AS situacao, e.nomeEvento AS evento,  
            IFNULL((SELECT versao FROM orcamentos_versoes WHERE  idOrcamentoVersao =  o.idUltimaVersao  ORDER BY idOrcamentoVersao DESC LIMIT 1),'') AS versao,
            IFNULL(v.vendedor,'') AS vendedor, o.valorTotal AS valor 
            FROM orcamentos AS o
            LEFT JOIN eventos AS e ON e.idEvento = o.idEvento
            LEFT JOIN vendedores AS v ON v.idVendedor = o.idVendedor
            WHERE idCliente = " . $_POST['codigo'];

    $sql .= " ORDER BY DATA ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

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

function Gravar() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = " clientes SET 
            cliente =UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "'), 
            apelido =UCASE('" . TextoSSql($ArqT, $_POST['apelido']) . "'), 
            dataCadastro ='" . DataSSql($_POST['cadastro']) . "', 
            cpfCnpj='" . $_POST['cpf'] . "', 
            ativo=" . $_POST['ativo'] . ", 
            premium = " . $_POST['premium'] . ", 
            arquiteto = " . $_POST['arquiteto'] . ", 
            arquitetoComissao = " . ValorE($_POST['arquitetoComissao']) . ", 
            rgIE ='" . $_POST['rg'] . "',
            dataNascimento ='" . DataSSql($_POST['dataNasc']) . "',
            sexo ='" . ($_POST['sexoM'] == 'true' ? 'M' : 'F') . "',                                             
            responsavel=UCASE('" . TextoSSql($ArqT, $_POST['responsavel']) . "'), 
            telefone='" . $_POST['telefone'] . "',
            celular='" . $_POST['celular'] . "',
            email=LCASE('" . TextoSSql($ArqT, $_POST['email']) . "'),
            site=LCASE('" . TextoSSql($ArqT, $_POST['site']) . "'),     
            obs='" . TextoSSql($ArqT, $_POST['obs']) . "',
            tipo='" . $_POST['tipo'] . "', dataAtualizacao= NOW()";

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idCliente =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . "";
    }

   mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        if ($_POST['codigo'] > 0) {
            $codigo = $_POST['codigo'];
        } else {
            $codigo = UltimoRegistroInserido($ArqT);
        }
    } else {
        echo '0';
        return;
    }

    if ($_POST['idsClientesEstilos'] != '') {
        $arrayEstilos = array($_POST['idsClientesEstilos'], $_POST['idsEstilos']);
        GravarEstilos($ArqT, $codigo, $arrayEstilos);
    }

    if($_POST['idsClienteEnderecos'] != ''){
        $arrayEnderecos = array($_POST['idsClienteEnderecos'], $_POST['tiposEnderecos'], $_POST['ceps'], 
                        $_POST['enderecos'], $_POST['numeros'], $_POST['complementos'], $_POST['bairros'], 
                        $_POST['cidades'], $_POST['estados']);
        GravarEnderecos($ArqT, $codigo, $arrayEnderecos);
    }

    echo $codigo;
   mysqli_close($ArqT);
}

function GravarEnderecos($ArqT, $idCliente, $arrays) {

    session_start();

    $sql = "UPDATE clientes_enderecos SET del=1, dataDel=Now() WHERE idCliente = " . $idCliente;

   mysqli_query($ArqT, $sql);

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
                endereco = '" . TextoSSql($ArqT, $endereco[$i]) . "', 
                numero = '" . TextoSSql($ArqT, $numero[$i]) . "', 
                complemento = '" . TextoSSql($ArqT, $complemento[$i]) . "', 
                bairro = '" . TextoSSql($ArqT, $bairro[$i]) . "', 
                cidade = '" . TextoSSql($ArqT, $cidade[$i]) . "', 
                estado = '" . TextoSSql($ArqT, $estado[$i]) . "', 
                dataAtualizacao = NOW() ";

        if ($idClienteEndereco[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del = 0, idUsuarioDel = 0 
                    WHERE idClienteEndereco =" . $idClienteEndereco[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now()";
        }

       mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0) {

            $json = array(
                'status' => 'ERROR_SET_CLI_ENDERECOS'
            );

            echo json_encode($json);
           mysqli_close($ArqT);
            return;
        }
    }
}

function GravarEstilos($ArqT, $idCliente, $arrays) {
    
    session_start();

    //DELETA TODOS OS LOCAIS SALVOS
    $sql = "UPDATE clientes_estilos SET del=1, dataDel=Now() WHERE idCliente =" . $idCliente;

   mysqli_query($ArqT, $sql);
    //=====

    $idEstiloCliente = explode(',', $arrays[0]);
    $idEstilo = explode(',', $arrays[1]);

    for ($i = 0; $i < count($idEstiloCliente); $i++) {
        $sql = " clientes_estilos SET idCliente =" . $idCliente . ", " .
                "idEstilo =" . $idEstilo[$i] . ", "
                . "dataAtualizacao=Now() ";

        if ($idEstiloCliente[$i] > 0) {
            $sql = "UPDATE " . $sql . ", del=0 WHERE idClienteEstilo =" . $idEstiloCliente[$i];
        } else {
            $sql = "INSERT INTO " . $sql . ", dataCadastro=Now()";
        }

       mysqli_query($ArqT, $sql);

        if (mysqli_affected_rows($ArqT) <= 0) {
            $json = array(
                'status' => 'ERROR_SET_CLI_ESTILOS'
            );
            echo json_encode($json);
           mysqli_close($ArqT);
            return;
        }
    }
}

function Mostrar() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT *, "
            . "IFNULL(CONCAT((SELECT funcionario FROM funcionarios WHERE idFuncionario = clientes.idUsuarioAtualizacao),'') ,'') AS usuario "
            . "FROM clientes WHERE idCliente = " . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
        return;
    }

    $linha =mysqli_fetch_assoc($Tb);

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
        'usuario' => ($linha['usuario'] !== "" ? "Última Atualização em " . FormatData($linha['dataAtualizacao'], true) .
                " por " . $linha['usuario'] : ""),
        'site' => $linha['site'],
        'arrayEstilos' => MostrarEstilos($ArqT, $linha['idCliente']),
        'premium' => $linha['premium'],
        'arquiteto' => $linha['arquiteto'],
        'arquitetoComissao' => FormatMoeda($linha['arquitetoComissao']),
        'arrayEnderecos' => MostrarEnderecos($ArqT, $linha['idCliente']),
        'arrayOrcamentos' => MostrarOrcamentos($ArqT, $linha['idCliente']),
        'arrayVendas' => MostrarVendas($ArqT, $linha['idCliente'])
    );

    echo json_encode($json);
   mysqli_close($ArqT);
}

function MostrarEstilos($ArqT, $idCliente) {

    $sql = "SELECT ec.idClienteEstilo, ec.idEstilo, e.estilo "
            . "FROM clientes_estilos AS ec "
            . "INNER JOIN estilos AS e USING(idEstilo) "
            . "WHERE ec.del=0 AND ec.idCliente =" . $idCliente . " "
            . "ORDER BY estilo ";

    $Tb =mysqli_query($ArqT, $sql);


    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {
        while ($linha =mysqli_fetch_assoc($Tb)) {
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

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

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
            INNER JOIN formaspagamentos AS f USING(idFormaPagamento)
            INNER JOIN vendedores AS v USING(idVendedor)
            LEFT JOIN vendas AS ve ON ve.idOrcamento = o.idOrcamento
            WHERE o.idCliente = " . $idCliente . " ORDER BY dataOrcamento DESC ";

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {

        $status = '';
        while ($linha =mysqli_fetch_assoc($Tb)) {

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

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        return '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

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

    $ArqT = AbreBancoPhotoartsPdv();

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

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        $status = '';
        while ($linha =mysqli_fetch_assoc($Tb)) {

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
                'obras' => getObrasComposicao($ArqT, $linha['idVenda'], 1),
                'valor' => FormatMoeda($linha['valor']),
                'status' => $status
            );
        }

        echo json_encode($json);
    }
}

function PesquisarClientes() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT idCliente AS codigo, cliente AS nome, apelido, ativo FROM clientes WHERE TRUE ";

    if ($_POST['nome'] != '') {
        $sql .= " AND UCASE(cliente) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(apelido) LIKE UCASE('%" . $_POST['nome'] . "%')";
    }

    $sql .= "ORDER BY ativo DESC, apelido";

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
            'ativo' => $linha['ativo']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function getEnderecos(){

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT te.tipoEndereco, cep, endereco, numero, complemento, bairro, cidade, estado 
            FROM clientes_enderecos AS ce
            INNER JOIN tipos_enderecos AS te USING(idTipoEndereco)
            WHERE idCliente = " . $_POST['idCliente'] . " AND del = 0"; 

    $Tb =mysqli_query($ArqT, $sql);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
    } else {

        while ($linha =mysqli_fetch_assoc($Tb)) {

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

   mysqli_close($ArqT);
}

?>
