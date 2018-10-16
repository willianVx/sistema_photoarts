<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Gravar':
            Gravar();
            break;

        case 'GetRegistroPrimeiro':
            $ArqT = ConectaDB();
            echo RegistroPrimeiro($ArqT, 'fornecedores', 'idFornecedor', false);
            break;

        case 'GetRegistroAnterior':
            $ArqT = ConectaDB();
            echo RegistroAnterior($ArqT, 'fornecedores', $_POST['atual'], 'idFornecedor', false);
            break;
            
        case 'GetRegistroProximo':
            $ArqT = ConectaDB();
            echo RegistroProximo($ArqT, 'fornecedores', $_POST['atual'], 'idFornecedor', false);
            break;

        case 'GetRegistroUltimo':
            $ArqT = ConectaDB();
            echo RegistroUltimo($ArqT, 'fornecedores', 'idFornecedor', false);
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'PesquisarFornecedores':
            PesquisarFornecedores();
            break;

        case 'MostraFinanceiro':
            MostraFinanceiro();
            break;

        case 'MostrarFornecedores':
            MostrarFornecedores();
            break;
    }
}

function MostraFinanceiro() {

    $db = ConectaDB();

    $sql = "SELECT c.idConpag, c.descricao, cp.idConpagParcela, cp.numero, cp.dataVencimento, cp.valor, cp.pago, 
            cp.valorPago, cp.dataPago, IF(DATEDIFF(CURDATE(), cp.dataVencimento) > 0, 1, 0) AS vencido, 
            f.funcionario AS usuarioPago
            FROM conpag AS c
            INNER JOIN conpagparcelas AS cp ON cp.idConpag = c.idConpag
            LEFT JOIN funcionarios AS f ON f.idFuncionario = cp.idUsuarioPago
            WHERE c.idFornecedor  = " . $_POST['codigo'];

    if ($_POST['tipo'] === '1') {

        $sql .= " AND cp.pago = 1";
    }

    if ($_POST['tipo'] === '2') {

        $sql .= " AND cp.pago = 0";
    }

    $sql .= " ORDER BY cp.dataVencimento DESC";
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {   

            if ($linha['pago'] === '0') {

                $situacao = "Em aberto";
            } else {

                $situacao = "Pago em " . FormatData($linha['dataPago'], false) . " por " . $linha['usuarioPago'];
            }

            $json[] = array(
                'idConpag' => $linha['idConpag'],
                'descricao' => $linha['descricao'],
                'idConpagParcela' => $linha['idConpagParcela'],
                'numero' => $linha['numero'],
                'dataVencimento' => FormatData($linha['dataVencimento'], false),
                'valor' => FormatMoeda($linha['valor']),
                'situacao' => $situacao,
                'valorPago' => FormatMoeda($linha['valorPago']),
                'vencido' => $linha['vencido']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function Gravar() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = " fornecedores SET 
            razaoFornecedor = UCASE('" . $db->escapesql($_POST['razaoSocial']) . "'), 
            fornecedor = UCASE('" . $db->escapesql( $_POST['nome']) . "'), 
            dataCadastro ='" . DataSSql($_POST['cadastro']) . "', 
            cpfCnpj='" . $_POST['cpf'] . "', 
            rgIe='" . $_POST['rgIe'] . "', 
            ativo=" . $_POST['ativo'] . ",
            cep='" . $_POST['cep'] . "',
            endereco=UCASE('" . $db->escapesql($_POST['endereco']) . "'),
            numero='" . $_POST['numero'] . "',
            complemento=UCASE('" . $db->escapesql( $_POST['complemento']) . "'),
            bairro=UCASE('" . $db->escapesql($_POST['bairro']) . "'),
            cidade=UCASE('" . $db->escapesql( $_POST['cidade']) . "'),
            estado=UCASE('" . $db->escapesql($_POST['estado']) . "'),                                             
            responsavel=UCASE('" . $db->escapesql( $_POST['responsavel']) . "'),
            telefone='" . $_POST['telefone'] . "',
            celular='" . $_POST['celular'] . "',
            email=LCASE('" . $db->escapesql($_POST['email']) . "'),
            site=LCASE('" . $db->escapesql($_POST['site']) . "'),                                     
            obs=UCASE('" . $db->escapesql($_POST['obs']) . "'), 
            tipoPessoa='" . $_POST['tipo'] . "', dataAtualizacao= NOW(), idUsuarioAtualizacao= " . $_SESSION['photoarts_codigo'];

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idFornecedor =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . " , idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];
    }
    
    $db->query( $sql );
    
    if ( $db->n_rows > 0 ) {
        if ($_POST['codigo'] > 0) {
            echo $_POST['codigo'];
        } else {
            echo UltimoRegistroInserido($db);
        }
    } else {
        echo '0';
    }

    $db->close();
}


function Mostrar() {

    $db = ConectaDB();

    $sql = "SELECT *, IFNULL(CONCAT((SELECT funcionario FROM funcionarios WHERE idFuncionario = fornecedores.idUsuarioAtualizacao),'') ,'') AS usuario FROM fornecedores WHERE idFornecedor = " . $_POST['codigo'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $linha = $db->fetch();

        $json = array(
            'codigo' => $linha['idFornecedor'],
            'razaoFornecedor' => $linha['razaoFornecedor'],
            'fornecedor' => $linha['fornecedor'],
            'cadastro' => FormatData($linha['dataCadastro'], false),
            'tipo' => $linha['tipoPessoa'],
            'cpfCnpj' => $linha['cpfCnpj'],
            'rgIe' => $linha['rgIe'],
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
            'usuario' => ($linha['usuario'] !== "" ? "Última Atualização em " . FormatData($linha['dataAtualizacao'], true) .
                    " por " . $linha['usuario'] : ""),
            'site' => $linha['site'],
            'obs' => $linha['obs']
        );

        echo json_encode($json);
    }
    //$db->close();
}

function PesquisarFornecedores() {

    $db = ConectaDB();

    $sql = "SELECT idFornecedor AS codigo, razaoFornecedor, fornecedor, ativo FROM fornecedores WHERE TRUE ";

    if ($_POST['nome'] != '') {
        $sql .= " AND UCASE(razaoFornecedor) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(fornecedor) LIKE UCASE('%" . $_POST['nome'] . "%')";
    }

    $sql .= "ORDER BY ativo DESC, fornecedor";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {  

            $json[] = array(
                'codigo' => $linha['codigo'],
                'razaoFornecedor' => $linha['razaoFornecedor'],
                'fornecedor' => $linha['fornecedor'],
                'ativo' => $linha['ativo']
            );
        }

        echo json_encode($json);
    }
}

function MostrarFornecedores(){

    $db = ConectaDB();

    $sql = "SELECT * FROM fornecedores WHERE TRUE";

    if($_POST['busca'] != ''){

        $sql .= " AND (UCASE(razaoFornecedor) LIKE UCASE('%" . $_POST['busca'] . "%')
                OR UCASE(fornecedor) LIKE UCASE('%" . $_POST['busca'] . "%')
                OR cpfCnpj LIKE '%" . $_POST['busca'] . "%' 
                OR telefone LIKE '%" . $_POST['busca'] . "%' 
                OR celular LIKE '%" . $_POST['busca'] . "%' 
                OR LCASE(email) LIKE LCASE('%" . $_POST['busca'] . "%'))";
    }

    $sql .= " ORDER BY ativo DESC, razaoFornecedor";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            $endereco = '';

            if($linha['endereco'] != ''){

                $endereco = $linha['endereco'];

                if($linha['numero'] != ''){
                    $endereco .= ', ' . $linha['numero'];
                }

                if($linha['complemento'] != ''){
                    $endereco .= ' ' . $linha['complemento'];
                }

                if($linha['bairro'] != ''){
                    $endereco .= ' - ' . $linha['bairro'];
                }

                if($linha['cidade'] != ''){
                    $endereco .= ' - ' . $linha['cidade'];
                }

                if($linha['estado'] != ''){
                    $endereco .= '/' . $linha['estado'];
                }

                if($linha['cep'] != ''){
                    $endereco .= ' - ' . $linha['cep'];
                }
            }

            $json[] = array(
                'idFornecedor' => $linha['idFornecedor'],
                'razaoFornecedor' => $linha['razaoFornecedor'],
                'fornecedor' => $linha['fornecedor'],
                'cpfCnpj' => $linha['cpfCnpj'],
                'ativo' => ($linha['ativo'] == '1' ? 'SIM' : 'NÃO'),
                'endereco' => $endereco,
                'telefone' => $linha['telefone'],
                'celular' => $linha['celular'],
                'email' => $linha['email']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

?>
