<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Gravar':
            Gravar();
            break;

        case 'Mostrar':
            Mostrar();
            break;

        case 'PesquisarFuncionarios':
            PesquisarFuncionarios();
            break;

        case 'SalvarFotoFuncionario':
            SalvarFotoFuncionario();
            break;

        case 'GeraMiniaturaFuncionario':
            GeraMiniaturaFuncionario();
            break;

        case 'getPermissoes':
            getPermissoes();
            break;

        case 'DeletaPermissoes':
            DeletaPermissoes();
            break;

        case 'GravarPermissoes':
            GravarPermissoes();
            break;

        case 'MostraPermissoes':
            MostraPermissoes();
            break;

        case 'MostrarAcessos':
            MostrarAcessos();
            break;

        case 'ExcluirFotoFuncionario':
            ExcluirFotoFuncionario();
            break;

        case 'DesbloquearUsuario':
            DesbloquearUsuario();
            break;

        case 'ResetarSenhaUsuario':
            ResetarSenhaUsuario();
            break;

        case 'MostrarFuncionarios':
            MostrarFuncionarios();
            break;

        case 'GravarAviso':
            GravarAviso();
            break;

        case 'MostraAvisos':
            MostraAvisos();
            break;

        case 'ExcluirAviso':
            ExcluirAviso();
            break;
    }
}

function Gravar() {
    inicia_sessao();

    $db = ConectaDB();
    
    if($_POST['login'] !== '') {
        $sql = "SELECT * FROM funcionarios 
                WHERE login='" . $db->escapesql($_POST['login']) . "' 
                OR idFuncionario != " . $_POST['codigo'];
        
        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo '-1';
            $db->close();
            return;
        }
    }
    
    $sql = " funcionarios SET 
            ativo = " . $_POST['ativo'] . ", 
            admin = " . $_POST['admin'] . ", 
            usuario = " . $_POST['usuario'] . ", 
            funcionario = UCASE('" . $db->escapesql($_POST['nome']) . "'), 
            dataNascimento = '" . DataSSql($_POST['dataNascimento']) . "', 
            cpf = '" . $_POST['cpf'] . "', 
            rg = '" . $_POST['rg'] . "', 
            cep = '" . $_POST['cep'] . "',
            endereco = '" . $_POST['endereco'] . "',
            numero = '" . $_POST['numero'] . "',
            complemento = '" . $_POST['complemento'] . "',
            bairro = '" . $_POST['bairro'] . "',
            cidade = '" . $_POST['cidade'] . "',
            estado = '" . $_POST['estado'] . "',                                             
            telefone = '" . $_POST['telefone'] . "',
            celular = '" . $_POST['celular'] . "',
            email = LCASE('" . $_POST['email'] . "'), 
            emailCorporativo = LCASE('" . $_POST['emailCorporativo'] . "'), 
            idPerfil = " . $_POST['idPerfil'] . ", 
            idBanco = " . $_POST['idBanco'] . ", 
            agencia = '" . $_POST['agencia'] . "', 
            conta = '" . $_POST['contaCorrente'] . "', 
            login = '" . $_POST['login'] . "', 
            " .
            "idDepartamento = " . $_POST['idDepartamento'] . ", 
            idCargo = " . $_POST['idCargo'] . ", 
            obs = '" . $db->escapesql($_POST['obs']) . "', 
            dataAtualizacao= NOW(), 
            idUsuarioAtualizacao= " . $_SESSION['photoarts_codigo'];

    if ($_POST['codigo'] > 0) {
        $sql = "UPDATE " . $sql . " WHERE idFuncionario =" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'] . ", 
               senha = MD5('" . $db->escapesql($_POST['login']) . "')";
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

    $sql = "SELECT f.*, 
           IFNULL(CONCAT((SELECT funcionario FROM funcionarios WHERE idFuncionario = f.idUsuarioAtualizacao),'') ,'') AS usuario2 
           FROM funcionarios AS f 
           WHERE f.idFuncionario = " . $_POST['codigo'];
    
    $db->query( $sql );
                  
    if ( $db->n_rows <= 0 ) {                   
        echo '0';
        return;
    }
    
    $linha = $db->fetch();
    
    if (file_exists('../imagens/usuarios/' . $linha['imagem'])) {

        $imagem = $linha['imagem'];
    } else {
        $imagem = '';
    }
    
    $json = array(
        'codigo' => $linha['idFuncionario'],
        'ativo' => $linha['ativo'],
        'admin' => $linha['admin'],
        'usuario' => $linha['usuario'],
        'dataCadastro' => FormatData($linha['dataCadastro'], false),
        'funcionario' => $linha['funcionario'],
        'dataNascimento' => FormatData($linha['dataNascimento'], false),
        'cpf' => $linha['cpf'],
        'rg' => $linha['rg'],
        'cep' => $linha['cep'],
        'endereco' => $linha['endereco'],
        'numero' => $linha['numero'],
        'complemento' => $linha['complemento'],
        'bairro' => $linha['bairro'],
        'cidade' => $linha['cidade'],
        'estado' => $linha['estado'],
        'telefone' => $linha['telefone'],
        'celular' => $linha['celular'],
        'email' => $linha['email'],
        'emailCorporativo' => $linha['emailCorporativo'],
        'idPerfil' => $linha['idPerfil'],
        'idBanco' => $linha['idBanco'],
        'agencia' => $linha['agencia'],
        'conta' => $linha['conta'],
        'login' => $linha['login'],
        'idDepartamento' => $linha['idDepartamento'],
        'idCargo' => $linha['idCargo'],
        'usuario2' => ($linha['usuario2'] !== "" ? "Última Atualização em " . FormatData($linha['dataAtualizacao'], true) .
                " por " . $linha['usuario2'] : ""),
        'obs' => $linha['obs'],
        'imagem' => $imagem,
        'tentativas' => $linha['tentativas']
    );

    echo json_encode($json);
    //$db->close();


}

function PesquisarFuncionarios() {

    $db = ConectaDB();

    $sql = "SELECT idFuncionario AS codigo, funcionario, cpf, ativo FROM funcionarios WHERE TRUE ";

    if ($_POST['nome'] != '') {
        $sql .= " AND UCASE(funcionario) LIKE UCASE('%" . $_POST['nome'] . "%') OR UCASE(funcionario) LIKE UCASE('%" . $_POST['nome'] . "%')";
    }

    $sql .= "ORDER BY ativo DESC, funcionario";

    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['codigo'],
                'funcionario' => $linha['funcionario'],
                'cpf' => $linha['cpf'],
                'ativo' => $linha['ativo']
            );
        }

        echo json_encode($json);
    }
}

function ExcluirFotoFuncionario() {

    if (file_exists("../imagens/usuarios/" . $_POST['foto'])) {
        unlink("../imagens/usuarios/" . $_POST['foto']);
        unlink("../imagens/usuarios/mini_" . $_POST['foto']);
    }
}

function SalvarFotoFuncionario() {

    $db = ConectaDB();
    $sql = "UPDATE funcionarios SET imagem = '" . $_POST['foto'] . "' WHERE idFuncionario = " . $_POST['idFuncionario'];
    $db->query( $sql );
}

function GeraMiniaturaFuncionario() {

    Redimensionar("../imagens/usuarios/" . $_POST['foto'], 180, 175, "mini_", 80);
    if (file_exists("../imagens/usuarios/" . $_POST['foto'])) {

        $json = array(
            'foto' => "../imagens/usuarios/mini_" . $_POST['foto']
        );

        echo json_encode($json);
    } else {
        echo "0";
    }
}

function getPermissoes() {

    $db = ConectaDB();

    $sql = "SELECT * FROM chaves ORDER BY menu, tela, funcionalidade";

    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idChave' => $linha['idChave'],
                'tela' => $linha['tela'],
                'funcionalidade' => $linha['funcionalidade'],
                'chave' => $linha['chave'],
                'permissao' => $linha['permissao']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function DeletaPermissoes() {

    $db = ConectaDB();

    $sql = "DELETE FROM funcionarios_permissoes WHERE idFuncionario = " . $_POST['codigo'];

    $db->query( $sql );
}

function GravarPermissoes() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "INSERT INTO funcionarios_permissoes SET idFuncionario = " . $_POST['codigo'] . ", 
            idChave = " . $_POST['chave'] . ", 
            dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['photoarts_codigo'];

    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        if ($_POST['codigo'] > 0) {
            echo $_POST['codigo'];
        } else {
            echo UltimoRegistroInserido($db);
        }
    }
}

function MostraPermissoes() {

    $db = ConectaDB();

    $sql = "SELECT * FROM funcionarios_permissoes WHERE idFuncionario = " . $_POST['codigo'];

    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'codigo' => $linha['idPermissao'],
                'id_usuario' => $linha['idFuncionario'],
                'id_chave' => $linha['idChave']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function MostrarAcessos() {

    $db = ConectaDB();

    $sql = "SELECT * FROM funcionarios_acessos WHERE idFuncionario = " . $_POST['idFuncionario'] . " ORDER BY dataAcesso DESC";

    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idFuncionarioAcesso' => $linha['idFuncionarioAcesso'],
                'ip' => $linha['ip'],
                'browser' => $linha['browser'],
                'status' => $linha['status'],
                'data' => FormatData($linha['dataAcesso'], true),
                'mobile' => $linha['mobile']
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function DesbloquearUsuario() {

    $db = ConectaDB();

    $sql = "UPDATE funcionarios SET tentativas = 0 
            WHERE idFuncionario = " . $_POST['idFuncionario'];
    
    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function ResetarSenhaUsuario() {

    $db = ConectaDB();

    $sql = "UPDATE funcionarios SET tentativas = 0, senha = MD5('" . $_POST['login'] . "') 
            WHERE idFuncionario = " . $_POST['idFuncionario'];

    $db->query( $sql );
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function MostrarFuncionarios(){

    $db = ConectaDB();

    $sql = "SELECT * FROM funcionarios WHERE TRUE";

    if($_POST['busca'] != ''){

        $sql .= " AND (UCASE(funcionario) LIKE UCASE('%" . $_POST['busca'] . "%')
                OR cpf LIKE '%" . $_POST['busca'] . "%' 
                OR telefone LIKE '%" . $_POST['busca'] . "%' 
                OR celular LIKE '%" . $_POST['busca'] . "%' 
                OR LCASE(email) LIKE LCASE('%" . $_POST['busca'] . "%'))";
    }

    $sql .= " ORDER BY ativo DESC, funcionario";

    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while($linha = $db->fetch()){

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
                'idFuncionario' => $linha['idFuncionario'],
                'funcionario' => $linha['funcionario'],
                'cpf' => $linha['cpf'],
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

function GravarAviso() {
    
    inicia_sessao();
    
    $db = ConectaDB();
    
    if($_POST['idFuncionario'] == '0') {
        $sql = "SELECT * FROM funcionarios WHERE ativo = 1";
        $db->query( $sql );

        $linhas = $db->fetch_all();
        foreach ($linhas as $linha){
            $sql = 'INSERT INTO funcionarios_avisos SET dataCadastro=NOW(), idUsuarioCadastro=' . $_SESSION["photoarts_codigo"] . ', 
                    idFuncionario=' . $linha["idFuncionario"]. ', dataAviso="' . DataSSql($_POST["dataAviso"], false) . '", 
                    horaAviso="' . $_POST["horaAviso"] . '", descricao=UCASE("' . $db->escapesql($_POST["descricao"]) . '"), 
                    link="' . $db->escapesql($_POST["link"]) . '", ok=' . $_POST["ok"];
            
            if($_POST['ok'] == 1)
                $sql .= ", dataOk=NOW()";
            
            $db->query( $sql );
          
            if ( $db->n_rows <= 0 ) {
                echo $linha['funcionario'];   
                $db->close();
                return;
            }
        }
    } else {
        $sql = 'funcionarios_avisos SET dataAviso="' . DataSSql($_POST["dataAviso"], false) . '", 
                horaAviso="' . $_POST["horaAviso"] . '", descricao=UCASE("' . $db->escapesql( $_POST["descricao"]) . '"), 
                link="' . $db->escapesql( $_POST["link"]) . '", ok=' . $_POST["ok"];
            
            if($_POST['ok'] == 1)
                $sql .= ", dataOk=NOW()";
        
        if($_POST['idFuncionarioAviso'] == '0') {
            $sql = 'INSERT INTO ' . $sql . ', idFuncionario=' . $_POST["idFuncionario"] . ', 
                    idUsuarioCadastro=' . $_SESSION["photoarts_codigo"] . ', dataCadastro=NOW()';
        } else {
            $sql = 'UPDATE ' . $sql . ' WHERE idFuncionarioAviso=' . $_POST["idFuncionarioAviso"];
        }
        
        $db->query( $sql );

        if ( $db->n_rows <= 0 ) {
            echo '-1';
            $db->close();
            return;
        }
    }
    
    echo '1';
    $db->close();
}

function MostraAvisos() {
    
    $db = ConectaDB();
    
    $sql = "SELECT * FROM funcionarios_avisos WHERE idFuncionario = " . $_POST['idFuncionario'] . " AND del=0 
            ORDER BY ok, dataAviso DESC";
    $db->query( $sql );
            
    $linhas = $db->fetch();
          
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {
        
            $json[] = array(
                'idFuncionarioAviso' => $linha['idFuncionarioAviso'], 
                'dataAviso' => FormatData($linha['dataAviso'], false),
                'horaAviso' => substr($linha['horaAviso'], -8, 5),
                'descricao' => $linha['descricao'], 
                'link' => $linha['link'], 
                'ok' => $linha['ok'], 
                'del' => $linha['del']
            );    
        }

        echo json_encode($json);
    }
    $db->close();
}

function ExcluirAviso() {
    
    inicia_sessao();
    
    $db = ConectaDB();

    $sql = "UPDATE funcionarios_avisos SET del=1, dataDel=NOW(), idUsuarioDel=" . $_SESSION['photoarts_codigo'] . " 
            WHERE idFuncionarioAviso=" . $_POST['idFuncionarioAviso'];
    
    $db->query( $sql );

    if ( $db->n_rows <= 0 ) {
        echo '0';
    }
    
    $db->close();
}

?>
