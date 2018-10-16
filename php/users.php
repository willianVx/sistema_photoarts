<?php

require('photoarts.php');
require("w2db.php");
require("w2lib.php");

$cmd = json_decode($_REQUEST['request']);

$db = ConectaDB();

switch ($cmd->{'cmd'}) {

    case 'get':
        //if ( true ) {  // if true , then is a 'get-record' only one record with recid array_key_exists('recid', $_REQUEST)
            $sql = 'SELECT v.idVendedor, v.idFuncionario, v.vendedor, v.tentativas,  v.pdv, v.gerente, v.ativo, v.descontoMaximo AS descontomaximo,
                    v.descontoMaximoObras, v.comissao, l.loja 
                    FROM vendedores AS v
                    INNER JOIN lojas AS l ON l.idLoja = v.idLoja';
        
            if ($_POST['nome'] !== '') {
                $sql .= " WHERE v.vendedor LIKE '%" . $_POST['nome'] . "%'";
            }
        
            $sql .= ' ORDER BY v.vendedor, v.ativo DESC ';
        
            $db->query( $sql );
        
            if ( $db->n_rows <= 0) {
                echo '0';
            }else{
                while ($linha = $db->fetch()) {
        
                    $json[] = array(
                        'idVendedor' => $linha['idVendedor'],
                        'idFuncionario' => $linha['idFuncionario'],
                        'vendedor' => $linha['vendedor'],
                        'ativo' => ($linha['ativo'] == 1 ? 'SIM' : 'NÃO'),
                        'tentativas' => $linha['tentativas'],
                        'descontomaximo' => FormatMoeda($linha['descontomaximo']),
                        'descontomaximoobras' => FormatMoeda($linha['descontoMaximoObras']),
                        'comissao' => FormatMoeda($linha['comissao']),
                        'gerente' => ($linha['gerente'] == 1 ? 'SIM' : 'NÃO'),
                        'pdv' => ($linha['pdv'] == 1 ? 'SIM' : 'NÃO'),
                        'loja' => $linha['loja']
                    );
                }
        
            }


            //$res = json_encode($json);
            $db->toJSON($json); 
        //}
        //else{        
        //    $sql  = "SELECT * FROM users       
        //             WHERE ~search~ ORDER BY ~sort~";
        //    $res = $w2grid->getRecords($sql, null, $_REQUEST);
        //    $w2grid->outputJSON($res);
        //} 
        break;

    case 'delete':
        $res = $w2grid->deleteRecords("users", "userid", $_REQUEST);
        $w2grid->outputJSON($res);
        break;

    //case 'get-record':
    //    break;

    case 'save':
        $res = $w2grid->saveRecord('users', 'userid', $_REQUEST);
        $w2grid->outputJSON($res);
        break;

    default:
        //$res = Array();
        //$res['status']  = 'error';
        //$res['message'] = 'Command "'.$_REQUEST['cmd'].'" is not recognized.';
        //$res['postData']= $_REQUEST;
        //$w2grid->outputJSON($res);
        
        //$res = json_encode($json);
        $w2grid->outputJSON($json);
        
        break;
}
