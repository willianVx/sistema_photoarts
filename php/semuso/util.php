<?php
    require_once './photoarts.php';
    
    $ArqT = AbreBancoPhotoarts();
    echo 'Consultando os clientes duplicados...<br />';
    $sql = "SELECT idCliente, cliente, COUNT(*) AS total FROM clientes GROUP BY cliente HAVING total>1";
    
    $tb = mysqli_query($ArqT, $sql);
    
    if(!$Tb){
        echo 'erro';
        return;
    }
    
    echo 'Varrendo os clientes duplicados...<br />';
    
    while($linha = mysqli_fetch_assoc($tb)){
        $sql = "DELETE FROM clientes WHERE cliente ='" . $linha['cliente'] . "' "
                . "AND idCliente<>" . $linha['idCliente'];
        
        mysqli_query($ArqT, $sql);
        
        if(mysqli_affected_rows($ArqT) > 0){
            echo 'Duplicidade do cliente ' . $linha['cliente'] . ' eliminada.<br />';
        }
        else{
            echo 'Erro ao eliminar duplicidade do cliente ' . $linha['cliente'] . '.<br />';
        }
            
    }
