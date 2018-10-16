<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'getData':
            getData();
            break;

        case 'visualizarVendasDia':
            visualizarVendasDia();
            break;
    }
}

function visualizarVendasDia() {

    $db = ConectaDB();

    $sql = "SELECT v.idVenda AS codigo, v.idUltimoStatus AS idStatus, s.imagem, s.status, 
            v.dataEntrega AS 'data', DAY(v.dataEntrega) AS dia, c.cliente FROM vendas AS v 
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente
            LEFT JOIN v_status AS s ON s.idVStatus = v.idUltimoStatus
            WHERE v.del = 0 
            AND LEFT(v.dataEntrega,7) = LEFT(DATE_ADD(CURDATE(), INTERVAL " . $_POST['qtdmes'] . " MONTH),7)  
            AND DAY(v.dataEntrega) = " . $_POST['dia'] . " 
            ORDER BY v.dataEntrega";

    $db->query( $sql );
    
    if ( $db->n_rows > 0) {
        while ($linha = $db->fetch()) {
            $json[] = array(
                'codigo' => $linha['codigo'],
                'data' => FormatData($linha['data']),
                'idStatus' => $linha['idStatus'],
                'status' => $linha['status'],
                'dia' => $linha['dia'],
                'imagem' => $linha['imagem'],
                'cliente' => $linha['cliente']
            );
        }


        echo json_encode($json);
    }else{
        echo '0';
    }
    $db->close();
}

function getData() {

    $db = ConectaDB();

    $sql = "SELECT  YEAR(CONCAT(LEFT(DATE_ADD(CURDATE(),INTERVAL " . $_POST['qtdmes'] . " MONTH),8),'01')) AS ano,
            MONTH(CONCAT(LEFT(DATE_ADD(CURDATE(),INTERVAL " . $_POST['qtdmes'] . " MONTH),8),'01')) AS mes,
            DAY(CONCAT(LEFT(DATE_ADD(CURDATE(),
            INTERVAL " . $_POST['qtdmes'] . " MONTH),8),'01')) AS primeirodia,
            DAY(LAST_DAY(DATE_ADD(CURDATE(), INTERVAL " . $_POST['qtdmes'] . " MONTH))) AS ultimodia,
            DATE_FORMAT(CONCAT(LEFT(DATE_ADD(CURDATE(), INTERVAL " . $_POST['qtdmes'] . " MONTH),8),'01'),'%w') diasemana";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
        $db->close();
        return;
    }
     
    $linha = $db->fetch();

    $json[] = array(
        'primeiro' => $linha['primeirodia'],
        'ultimo' => $linha['ultimodia'],
        'diasemana' => $linha['diasemana'],
        'mes' => getNomeMes($linha['mes']) . " " . $linha['ano']
    );

    $sql = "SELECT v.idVenda AS codigo, v.idUltimoStatus AS idStatus, s.imagem, s.status, 
            v.dataEntrega AS 'data', DAY(v.dataEntrega) AS dia, SUBSTRING_INDEX(c.cliente,' ',1) AS cliente FROM vendas AS v 
            INNER JOIN clientes AS c ON c.idCliente = v.idCliente
            LEFT JOIN v_status AS s ON s.idVStatus = v.idUltimoStatus
            WHERE v.del = 0
            AND LEFT(v.dataEntrega,7) = LEFT(DATE_ADD(CURDATE(), INTERVAL " . $_POST['qtdmes'] . " MONTH),7)  
            ORDER BY v.dataEntrega";


    $db->query($sql);
    if ($db->n_rows > 0) {
        while ($linha = $db->fetch()) {
            $json[] = array(
                'codigo' => $linha['codigo'],
                'data' => FormatData($linha['data']),
                'idStatus' => $linha['idStatus'],
                'status' => $linha['status'],
                'dia' => $linha['dia'],
                'imagem' => $linha['imagem'],
                'cliente' => $linha['cliente']
            );
        }
    }  
    echo json_encode($json);

    $db->close();
}

function getNomeMes($mes) {

    switch ($mes) {
        case '1':
            return "Janeiro";
        case '2':
            return "Fevereiro";
        case '3':
            return "Março";
        case '4':
            return "Abril";
        case '5':
            return "Maio";
        case '6':
            return "Junho";
        case '7':
            return "Julho";
        case '8':
            return "Agosto";
        case '9':
            return "Setembro";
        case '10':
            return "Outubro";
        case '11':
            return "Novembro";
        case '12':
            return "Dezembro";
    }
}