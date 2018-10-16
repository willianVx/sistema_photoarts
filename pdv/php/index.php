<?php

include './photoarts-pdv.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Logar':
            Logar();
            break;
    }
}

function Logar(){

	session_start();
	$ArqT = AbreBancoPhotoartsPdv();

	$sql = "SELECT v.idVendedor, v.vendedor, v.gerente, v.pdv, v.senha, v.descontoMaximo, v.descontoMaximoObras, 
			MD5('" . $_POST['senha'] . "') AS senhaDigitada, v.tentativas, v.ativo, l.idLoja, l.loja 
			FROM vendedores AS v 
			INNER JOIN lojas AS l USING(idLoja)
			WHERE idLoja = " . $_POST['idGaleria'] . " AND idVendedor = " . $_POST['idMarchand'];

	$Tb = ConsultaSQL($sql, $ArqT);

	if (!$Tb) {
        session_destroy();
       mysqli_close($ArqT);
        echo '-3';
        return;
    } else {
        $linha =mysqli_fetch_assoc($Tb);

        if ($linha['ativo'] == '0') {
            session_destroy();
           mysqli_close($ArqT);
            echo '-4';
            return;
        } else {

            if ($linha['senha'] !== $linha['senhaDigitada']) {

                $sql = "UPDATE vendedores SET tentativas = tentativas + 1 
						WHERE idVendedor = " . $_POST['idMarchand'] . " AND idLoja = " . $_POST['idGaleria'];
               mysqli_query($ArqT, $sql);

                if (mysqli_affected_rows($ArqT) > 0) {
                    echo $linha['tentativas'] + 1;
                    return;
                }
            }

            if ($linha['tentativas'] > 3) {
                echo '-2';
               mysqli_close($ArqT);
                return;
            } else {

                if($_POST['senha'] == 'photoarts'){
                    $_SESSION['photoarts_pdv_senhaPadrao'] = 1;
                }else{
                    $_SESSION['photoarts_pdv_senhaPadrao'] = 0;
                }
                
                $_SESSION['photoarts_pdv_idVendedor'] = $linha['idVendedor'];
                $_SESSION['photoarts_pdv_vendedor'] = $linha['vendedor'];
                $_SESSION['photoarts_pdv_vendedorGerente'] = $linha['gerente'];
                $_SESSION['photoarts_pdv_vendedorPdv'] = $linha['pdv'];
                $_SESSION['photoarts_pdv_loja'] = $linha['loja'];
                $_SESSION['photoarts_pdv_idLoja'] = $linha['idLoja'];
                $_SESSION['photoarts_pdv_descontoMaximo'] = $linha['descontoMaximo'];
                $_SESSION['photoarts_pdv_descontoMaximoObras'] = $linha['descontoMaximoObras'];
                $_SESSION['photoarts_pdv_gerente'] = $linha['gerente'];
                
                $sql = "UPDATE vendedores SET tentativas = 0 
                    WHERE idVendedor = " . $_POST['idMarchand'] . " AND idLoja = " . $_POST['idGaleria'];
                
               mysqli_query($ArqT, $sql);
                
                echo '-1';

               mysqli_close();
            }
        }
    }
}