<?php
session_start();
include('rotinaspadrao.php');

header('Content-Type: text/html; charset=iso8859-1');

// NOME
if (isset($_GET['nome'])) {
    $nome = $_GET['nome'];
    $path = $_GET['path'];
    $funcao = $_GET['funcao'];
    $tema = $_GET['tema'];
} else {
    $nome = $_POST['nome'];
    $path = $_POST['path'];
    $funcao = $_POST['funcao'];
    $tema = $_POST['tema'];
}

$variables = "<script type='text/javascript'>                       
                   Selector.$('nome').value = '" . $nome . "';
                   Selector.$('path').value = '" . $path . "';
                   Selector.$('funcao').value = '" . $funcao . "';
                   Selector.$('tema').value = '" . $tema . "';
                   Selector.$('conteudo').setAttribute('class', '" . $tema . "');
              </script>";

// Pasta onde o arquivo vai ser salvo
$_UP['pasta'] = $path;

// Tamanho máximo do arquivo (em Bytes)
$_UP['tamanho'] = 1024 * 1024 * 2; // 2Mb
// Array com as extenções permitidas
$_UP['extensoes'] = array('jpg', 'bmp', 'png', 'gif', 'swf');

// Renomeia o arquivo? (Se true, o arquivo será salvo como .jpg e um nome único)
$_UP['renomeia'] = true;

// Array com os tipos de erros de upload do PHP
$_UP['erros'][0] = 'Não houve erro';

$_UP['erros'][1] = 'A imagem no upload é maior do que o limite';

$_UP['erros'][2] = 'A imagem ultrapassa o limite de tamanho especificado no HTML';

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

if (array_search($extensao, $_UP['extensoes']) === false) {
    $msgEx = '<font>Envie imagens com as seguintes extenções: .jpg, .bmp, .png , .gif ou swf. até 2Mb.</font>';
}
// Faz a verificação do tamanho do arquivo
else if ($_UP['tamanho'] < $_FILES['fileUpload']['size']) {
    $msgTa = '<font color="#ff0000">O arquivo enviado é muito grande, envie arquivos de até 2Mb.</font>';
}
// O arquivo passou em todas as verificações, hora de tentar movê-lo para a pasta
else {
    // Primeiro verifica se deve trocar o nome do arquivo
    if ($_UP['renomeia'] == true) {

        // Cria um nome baseado no UNIX TIMESTAMP atual e com extensÃ£o .doc
        //$nome_final = time() . '.doc';
        $nome_final = $nome . '.' . $extensao;
    } else {

        // Mantém o nome original do arquivo
        $nome_final = $_FILES['fileUpload']['name'];
    }

    // Depois verifica se é possível mover o arquivo para a pasta escolhida   
    if (move_uploaded_file($_FILES['fileUpload']['tmp_name'], $_UP['pasta'] . $nome_final)) {
        /* $ArqT = AbreBancoVishop();

          $sql = "INSERT INTO produtos_imagens SET idProduto =" . $idProduto . ", " .
          "referencia =" . $referencia . ", " .
          "pathImg ='" . $_UP['pasta'] . $nome_final . "', " .
          "dataCadastro = Now(), idUsuario =" . $_SESSION['codUsuario'];

          if ($referencia == 1)
          $sql .= ", principal = -1 ";

          mysql_query($sql, $ArqT);

          if (mysql_affected_rows($ArqT) > 0) { */
        $msgOk = '<center><img src="imagens/success.gif" alt="Sucess" />&nbsp;&nbsp;
          <font color="green">Imagem enviada com sucesso!</font>
          </center>';
        $msgOk .= "<script type='text/javascript'>
            Selector.$('imgAdd').src = '" . $_UP['pasta'] . $nome_final . "';
            window.parent." . $funcao . "('" . $_UP['pasta'] . $nome_final . "');
          </script>";
        /* } else {
          $msgEr = '<font color="#ff0000">Não foi possível enviar a imagem, tente novamente</font>';
          } */
    } else {

        // Não foi possível fazer o upload, provavelmente a pasta está incorreta
        $msgEr = '<font color="#ff0000">Não foi possível enviar o arquivo, tente novamente</font>';
    }
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso8859-1" />
        <title>Adicionar Imagem (Jpg, PNG, Bmp, Gif)</title>

        <!--style type="text/css">@import "../index.css";</style-->
       
         <style type="text/css">
		 	.tema01{
				font-family:Verdana, Geneva, sans-serif;
				font-size:10px;	
			}
			.tema01 input{
					border-bottom:#900 1px solid;
					border-left:#900 1px solid;
					border-right:#900 1px solid;
					border-top:#900 1px solid;
					color:#FFF;
					background-color:#DA251D;
					font-size:13px;
					text-align:left;
					cursor:pointer;
					font-weight:bold;
				}
			.tema01 input:hover{
					border-bottom:#039 1px solid;
					border-left:#039 1px solid;
					border-right:#039 1px solid;
					border-top:#039 1px solid;
					color:#FFF;
					background-color:#36C;
					font-size:13px;
					text-align:left;
					cursor:pointer;
					font-weight:bold;
				}	
		    .tema02{
				font-family:Verdana, Geneva, sans-serif;
				font-size:10px;	
				color:#000;
			}
			.tema02 input{
					border-bottom:#333 1px solid;
					border-left:#333 1px solid;
					border-right:#333 1px solid;
					border-top:#333 1px solid;
					background-color:#CCC;
					font-size:13px;
					text-align:left;
					cursor:pointer;
					font-weight:bold;
				}
			.tema02 input:hover{
					border-bottom:#333 1px solid;
					border-left:#333 1px solid;
					border-right:#333 1px solid;
					border-top:#333 1px solid;
					background-color:#E8E8E8;
					font-size:13px;
					text-align:left;
					cursor:pointer;
					font-weight:bold;
				}

		    .tema03{
				font-family:Verdana, Geneva, sans-serif;
				font-size:10px;	
				color:#666;
			
			}
			.tema03 input{
			    	border-bottom:#FC9 1px solid;
					border-left:#FC9 1px solid;
					border-right:#FC9 1px solid;
					border-top:#FC9 1px solid;
					color:#000;
					background-color:#FAECE2;
					font-size:13px;
					text-align:left;
					cursor:pointer;
					font-weight:bold;
				}
			.tema03 input:hover{
				border-bottom:#060 1px solid;
				border-left:#060 1px solid;
				border-right:#060 1px solid;
				border-top:#060 1px solid;
				color:#000;
				background-color:#9CD933;
				font-size:13px;
				text-align:left;
				cursor:pointer;
				font-weight:bold;
				}
         </style>
        
        
        <script type="text/javascript" src="utils.js"></script>
        <script type="text/javascript" src="json2.js"></script>        

        <script type="text/javascript">
            
            function CarregaImg(){                
                var img = Selector.$('imgAdd');
                var x = Selector.$('fileUpload');

                img.src = x.value;
                img.alt = x.value;
            }

            function Valida(){           
                if(Selector.$('fileUpload').value.trim() == ''){
                    return false;
                }
                else{                    
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
            <div id="conteudo" align="left">
                <br />
                <div style="width: 300px; text-align: center">
                    <img id="imgAdd" src="imagens/semfoto.png" alt="" width="200" height="200"/>
                </div>
                <br />
                Arquivo:&nbsp;<input class="botao6" name="fileUpload" id="fileUpload" type="file" size="22" onchange="CarregaImg();"/>
                <br />
                <br />
                <div style="width: 300px; text-align: center">
                    <input type="submit" value="Enviar Imagem" class="botao3" onclick="return Valida();"/>&nbsp;<input type="button" value="Fechar" class="botao3" onclick="window.parent.dialog.Close();"/>
                </div>
                
                
<br />
<div style="width: 300px; text-align: center">
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