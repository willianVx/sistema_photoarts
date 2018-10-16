<?php

include './photoarts-pdv.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Alterar':
            Alterar();
            break;
    }
}

function Alterar() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT IF(senha = MD5('" . $_POST['senha'] . "'),1,0) AS senha FROM vendedores 
            WHERE idVendedor = " . $_SESSION['photoarts_pdv_idVendedor'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '-2';
        return;
    }

    if (mysqli_result($Tb, 0, "senha") == "0") {
        echo '-1';
        return;
    }

    $sql = "UPDATE vendedores SET senha = MD5('" . $_POST['novasenha'] . "') 
            WHERE idVendedor = " . $_SESSION['photoarts_pdv_idVendedor'];
   
   mysqli_query($ArqT, $sql);    
        
    if (mysqli_affected_rows($ArqT) > 0) {
        $_SESSION['photoarts_pdv_senhaPadrao'] = 0;
        echo '1';
    } else {
        echo '0';
    }

   mysqli_close($ArqT);
}
