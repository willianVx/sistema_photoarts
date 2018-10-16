<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarAniversariantes':
            MostrarAniversariantes();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;

        case 'EnviarEmailParabens':
            EnviarEmailParabens();
            break;
    }
}

function MostrarAniversariantes(){

    $db = ConectaDB();

    $sql = "SELECT idCliente, IF(cliente = '', apelido, cliente) AS nome, dataNascimento, email 
            FROM clientes WHERE del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND DAY(dataNascimento) >= DAY('" . DataSSql($_POST['de']) . "') ";
        $sql .= " AND MONTH(dataNascimento) >= MONTH('" . DataSSql($_POST['de']) . "') ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND DAY(dataNascimento) <= DAY('" . DataSSql($_POST['ate']) . "') ";
        $sql .= " AND MONTH(dataNascimento) <= MONTH('" . DataSSql($_POST['ate']) . "') ";
    }
    
    $sql .= " ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json[] = array(
                'idCliente' => $linha['idCliente'],
                'nome' => $linha['nome'],
                'dataNascimento' => FormatData($linha['dataNascimento'], true),
                'email' => $linha['email']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT idCliente, IF(cliente = '', apelido, cliente) AS nome, dataNascimento, email 
            FROM clientes WHERE del = 0";

    if($_POST['de'] != ''){
        $sql .= " AND DAY(dataNascimento) >= DAY('" . DataSSql($_POST['de']) . "') ";
        $sql .= " AND MONTH(dataNascimento) >= MONTH('" . DataSSql($_POST['de']) . "') ";
    }
    
    if($_POST['ate'] != ''){
        $sql .= " AND DAY(dataNascimento) <= DAY('" . DataSSql($_POST['ate']) . "') ";
        $sql .= " AND MONTH(dataNascimento) <= MONTH('" . DataSSql($_POST['ate']) . "') ";
    }
    
    $sql .= " ORDER BY nome";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    inicia_sessao();
    $_SESSION['sql_rel'] = $sql;
    //saveP();

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-aniversariantes-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-aniversariantes-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('NOME', 'DATA NASCIMENTO', 'EMAIL');

    $excel->writeLine($arr);

    while ($linha = $db->fetch()) {

        $arr = array(
            $linha['nome'],
            FormatData($linha['dataNascimento'], true),
            $linha['email']
        );

        $excel->writeLine($arr);
    }

    $excel->close();
    echo $newPathReturn;
    $db->close();
}

function EnviarEmailParabens(){

    $assunto = 'Feliz Aniversário, ' . $_POST['cliente'] . ' | Photoarts';

    $html = ' <html>
            <head>
            </head>
            <body style="background:#F3F3F3; text-align:center">
            <div style="text-align:center; width:100%; max-width:600px; display:inline-block; background-color:#FFF; min-height:300px; border-radius:15px ;-moz-border-radius:15px;-webkit-border-radius:15px; overflow:hidden;">
              <div style="background:#1CAFF6; background-image:url(http://www.photoarts.com.br/sistema/imagens/fundobolo.png); background-repeat:no-repeat; background-position:right center; min-height:60px; padding-top:40px; text-align:left; padding-left: 35px;"> <img src="http://www.photoarts.com.br/sistema/imagens/logobranco.png" /> </div>
              <div style="text-align:left; padding:40px">
                <h1 style="color:#404040; font-family:Arial, Helvetica, sans-serif; font-size:20px">Parabéns, ' . $_POST['cliente'] . '!</h1>
                <h2 style="color:#888888; font-weight:100;  font-family:Arial, Helvetica, sans-serif; font-size:15px; padding-top:10px ; line-height:27px">Nós da Photoarts desejamos muitas felicidades para você neste dia especial, que você tenha bastante saúde, paz e alegria.<br><br>Feliz Aniversário!
                <div style="text-align:center"></div>  </div></div>
                <div style="text-align:center; margin-top:50px; font-family:Arial, Helvetica, sans-serif; color:#999; font-size:14px; line-height:20px">www.photoarts.com.br</div>
            </body>
            </html>';

    if (EnvioDeEmailsPhotoarts($_POST['cliente'], $_POST['email'], 'atendimento@photoarts.com.br', 'Photoarts', '', '', 'atendimento@photoarts.com.br', 'Photoarts', $assunto, $html, '', 1)) {
        echo '1';
    } else {
        echo '0';
    }
}