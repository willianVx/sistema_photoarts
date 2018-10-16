<?php
session_start();
include('rotinaspadrao.php');
include("UploadFiles.php");


header('Content-Type: text/html; charset=utf-8');

// NOME
if (isset($_GET["nome"])) { 
    $nome = $_GET['nome'];
    $path = $_GET['path'];
    $funcao = $_GET['funcao'];
    $tema = $_GET['tema'];
    $arquivotipo = $_GET['arquivotipo'];
    $msg = "";
    
 
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

 
if (isset($_GET["enviar"]))
 { 
     
    $up = new upfiles\UploadFiles();
 
    $up->file($_FILES["fileUpload"]);
    $up->folder($path);
    $up->maxSize(50);
    $up->extensions(array("png","gif","jpg"));
    
    if ($up->getErrors() == 1) {
        
        $msg = '<font>Envie arquivos com as seguintes extensões: ' . $arquivotipo . '. até 50Mb.</font>';
        
        echo "Formato não esperado";
        return false;
    }

    if ($up->getErrors() == 2) {
       
        $msg = '<font color="#ff0000">O arquivo enviado é muito grande, envie arquivos de até 50Mb.</font>';
        
        echo "O tamanho limite para Upload é de 4MB";
        return false;
    }

    try {
        $up->move();
      
        $msg = '<center><img src="imagens/success.gif" alt="Sucess" />&nbsp;&nbsp;
          <font color="green">Arquivo enviado com sucesso!</font>
          </center>';
         
        $msg .= "<script type='text/javascript'>
            window.parent." . $funcao . "('" . $up->nameFinalFile() . "');
          </script>";
        
    } catch(\Exception $e) {
        $msg = '<font color="#ff0000">Não foi possivel enviar o arquivo, tente novamente</font>';
        echo "Ocorreu um erro ao tentar fazer o Upload: " . $e->getMessage();
    }
       
}

?>

<!DOCTYPE html>

<html>

    <head>

        <title>UPLOAD</title>

        <style type="text/css">@import "css/componentes.css";</style>


        <style type="text/css">

        </style>


        <script type="text/javascript" src="utils.js"></script>
        <script type="text/javascript" src="json2.js"></script>        

        <script type="text/javascript">

            function CarregaImg() {
                              
                //var img = Selector.$('imgAdd');
                var x = Selector.$('fileUpload');
                              
                //img.src = x.value;
                //img.alt = x.value;
            }

            function Valida() {
                
                if (Selector.$('fileUpload').value.trim() == '') {
                    return false;
                }
                else {
                    //Selector.$('imgAdd').src = 'imagens/loading-2.gif';
                    Selector.$('bt_upload_enviar').value = 'Enviando...';
                    return true;
                }
            }


        </script>
    </head>
    
<body style="font-family: Arial;">
    <form method="post" enctype="multipart/form-data" action="upFiles.php?enviar" name="upload" >
    <input type="hidden" name="nome" id="nome" />
    <input type="hidden" name="path" id="path" />
    <input type="hidden" name="funcao" id="funcao" />
    <input type="hidden" name="tema" id="tema" />     
    <input type="hidden" name="arquivotipo" id="arquivotipo" />

    <div id="conteudo" align="left">
        <br />
        <!--<div style="width: 380px; text-align: center">
            <img id="imgAdd" src="imagens/semfoto.png" alt="" width="250" />
        </div>-->
        <br />
        <span class="texto_titulo">Arquivo</span> &nbsp;<input class="botao_div_cinza_com_sombra" name="fileUpload" id="fileUpload" type="file" size="22" onchange="CarregaImg();"/>
        <br />
        <br />
        <div style="width: 380px; text-align: center">
            <input type="submit" id="bt_upload_enviar" value="Enviar arquivo" class="botao_div_cinza_com_sombra" onclick="return Valida();"/>&nbsp;
            <input type="button" value="Fechar" class="botao_div_cinza_com_sombra" onclick="window.parent.dialog.Close();"/>
        </div>


        <br />
        <div style="width: 380px; text-align: center">
            <?php
            echo $msg;
            echo $variables;
            ?>
        </div>


    </div>
    <br />

</form>
</body>
</html>