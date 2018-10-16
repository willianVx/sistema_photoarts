<?php
session_start();
include('rotinaspadrao.php');

header('Content-Type: text/html; charset=utf-8');

// NOME
if (isset($_GET['nome'])) {
    $nome = $_GET['nome'];
    $path = $_GET['path'];
    $funcao = $_GET['funcao'];
    $tema = $_GET['tema'];
    $arquivotipo = $_GET['arquivotipo'];
} else {
    $nome = $_POST['nome'];
    $path = $_POST['path'];
    $funcao = $_POST['funcao'];
    $tema = $_POST['tema'];
    $arquivotipo = $_POST['arquivotipo'];
}

//echo $arquivotipo;

$variables = "<script type='text/javascript'>                       
                   Selector.$('nome').value = '" . $nome . "';
                   Selector.$('path').value = '" . $path . "';
                   Selector.$('funcao').value = '" . $funcao . "';
                   Selector.$('tema').value = '" . $tema . "';
                   Selector.$('arquivotipo').value = '" . $arquivotipo . "';
                   Selector.$('conteudo').setAttribute('class', '" . $tema . "');
              </script>";

// Pasta onde o arquivo vai ser salvo
$_UP['pasta'] = $path;

// Tamanho m�ximo do arquivo (em Bytes)
$_UP['tamanho'] = 1024 * 1024 * 2; // 2Mb
// Array com as exten��es permitidas
//$_UP['extensoes'] = array('jpg', 'bmp', 'png', 'gif', 'swf', 'doc', 'docx', 'txt', 'jpeg');
// Renomeia o arquivo? (Se true, o arquivo ser� salvo como .jpg e um nome �nico)
$_UP['renomeia'] = true;

// Array com os tipos de erros de upload do PHP
$_UP['erros'][0] = 'Não houve erro';

$_UP['erros'][1] = 'O arquivo no upload é maior do que o limite';

$_UP['erros'][2] = 'O arquivo ultrapassa o limite de tamanho especificado no HTML';

$_UP['erros'][3] = 'O upload do arquivo foi feito parcialmente';

$_UP['erros'][4] = 'Não foi feito o upload do arquivo';


// Verifica se houve algum erro com o upload. Se sim, exibe a mensagem do erro
if ($_FILES['fileUpload']['error'] != 0) {
    die($msgEx4 = "Não foi possível fazer o upload, erro:<br />" . $_UP['erros'][$_FILES['fileUpload']['error']]);
    exit; // Para a execução do script
}

// Caso script chegue a esse ponto, não houve erro com o upload e o PHP pode continuar
// Faz a verificação da extensão do arquivo
$extensao = strtolower(end(explode('.', $_FILES['fileUpload']['name'])));
$_SESSION['nome_original'] = $_FILES['fileUpload']['name'];

if ($extensao != '') {

    $vetor = split(",", strtolower($arquivotipo));

    $size = sizeof($vetor) - 1;
    $nalista = false;

    For ($i = 0; $i <= $size; $i++) {

        if (trim($vetor[$i]) == $extensao) {
            $nalista = true;
        }
    }

    if ($nalista == false) {
        $msgEx = '<font>Envie arquivos com as seguintes extensões: ' . $arquivotipo . '. até 2Mb.</font>';
    }
// Faz a verifica��o do tamanho do arquivo
    else if ($_UP['tamanho'] < $_FILES['fileUpload']['size']) {
        $msgTa = '<font color="#ff0000">O arquivo enviado é muito grande, envie arquivos de até 2Mb.</font>';
    }
// O arquivo passou em todas as verifica��es, hora de tentar mov�-lo para a pasta
    else {
        // Primeiro verifica se deve trocar o nome do arquivo
        if ($_UP['renomeia'] == true) {

            // Cria um nome baseado no UNIX TIMESTAMP atual e com extensão .doc
            //$nome_final = time() . '.doc';
            $nome_final = $nome . '.' . $extensao;
        } else {

            // Mantém o nome original do arquivo
            $nome_final = $_FILES['fileUpload']['name'];
        }
        
                echo $_FILES['fileUpload']['tmp_name'] . '/' . $_FILES['fileUpload']['name'];
        echo '<BR>' . $_UP['pasta'] . $nome_final;
        
        // Depois verifica se � poss�vel mover o arquivo para a pasta escolhida   
        if (move_uploaded_file($_FILES['fileUpload']['tmp_name'], $_UP['pasta'] . $nome_final)) {

            $msgOk = '<center><img src="imagens/success.gif" alt="Sucess" />&nbsp;&nbsp;
          <font color="green">arquivo enviado com sucesso!</font>
          </center>';
            $msgOk .= "<script type='text/javascript'>
            //Selector.$('imgAdd').src = '" . $_UP['pasta'] . $nome_final . "';
            window.parent." . $funcao . "('" . $_UP['pasta'] . $nome_final . "');
          </script>";
        } else {

            $msgEr = '<font color="#ff0000">Não foi possivel enviar o arquivo, tente novamente</font>';
        }
    }
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso8859-1" />
        <title>UPLOAD</title>

        <style type="text/css">@import "css/componentes.css";</style>


        <style type="text/css">

        </style>


        <script type="text/javascript" src="utils.js"></script>
        <script type="text/javascript" src="json2.js"></script>        

        <script type="text/javascript">

            function CarregaImg() {
                var img = Selector.$('imgAdd');
                var x = Selector.$('fileUpload');

                img.src = x.value;
                img.alt = x.value;
            }

            function Valida() {
                if (Selector.$('fileUpload').value.trim() == '') {
                    return false;
                }
                else {
                    Selector.$('imgAdd').src = 'imagens/loading-2.gif';
                    return true;
                }
            }


        </script>
    </head>

    <body style="font-family: Arial;">
        <form method="post" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>" name="upload" >
            <input type="hidden" name="nome" id="nome" />
            <input type="hidden" name="path" id="path" />
            <input type="hidden" name="funcao" id="funcao" />
            <input type="hidden" name="tema" id="tema" />     
            <input type="hidden" name="arquivotipo" id="arquivotipo" />

            <div id="conteudo" align="left">
                <br />
                <div style="width: 380px; text-align: center">
                    <img id="imgAdd" src="imagens/semfoto.png" alt="" width="250" />
                </div>
                <br />
                <span class="texto_titulo">Arquivo</span> &nbsp;<input class="botao_div_cinza_com_sombra" name="fileUpload" id="fileUpload" type="file" size="22" onchange="CarregaImg();"/>
                <br />
                <br />
                <div style="width: 380px; text-align: center">
                    <input type="submit" value="Enviar arquivo" class="botao_div_cinza_com_sombra" onclick="return Valida();"/>&nbsp;
                    <input type="button" value="Fechar" class="botao_div_cinza_com_sombra" onclick="window.parent.dialog.Close();"/>
                </div>


                <br />
                <div style="width: 380px; text-align: center">
                    <?php
                    echo $msg;
                    echo $msgEx;
                    echo $msgOk;
                    echo $msgTa;
                    echo $msgEr;
                    echo $msgEx4;
                    echo $variables;
                    ?>
                </div>


            </div>
            <br />

        </form>
    </body>
</html>