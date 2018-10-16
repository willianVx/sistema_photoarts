<?php

include './photoarts-pdv.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Mostra':
            Mostra();
            break;

        case 'Gravar':
            Gravar();
            break;

        case 'getValePresenteTroca':
            getValePresenteTroca();
            break;

        case 'ExcluirVale':
            ExcluirVale();
            break;
    }
}

function Mostra() {

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = 'SELECT vpt.idValePresenteTroca, vpt.dataCadastro, vpt.codigo, IFNULL(l.loja, "Todas") AS loja, 
            vpt.dataValidade, vpt.valor, 
            LPAD(vpt.idVenda, 5, "0") AS idVenda, c.cliente 
            FROM vales_presentes_trocas AS vpt
            LEFT JOIN lojas AS l ON l.idLoja = vpt.idGaleria 
            INNER JOIN clientes AS c ON c.idCliente = vpt.idCliente
            WHERE vpt.del = 0';

    if($_POST['tipoData'] == 'D'){
        if($_POST['de'] != ''){
            $sql .= " AND vpt.dataCadastro >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
            $sql .= " AND vpt.dataCadastro <= '" . DataSSql($_POST['ate']) . "' ";
        }
    }else{
        if($_POST['de'] != ''){
            $sql .= " AND vpt.dataValidade >= '" . DataSSql($_POST['de']) . "' ";
        }

        if($_POST['ate'] != ''){
            $sql .= " AND vpt.dataValidade <= '" . DataSSql($_POST['ate']) . "' ";
        }
    }

    if($_POST['idGaleria'] != '0'){
        $sql .= " AND vpt.idGaleria = " . $_POST['idGaleria'];
    }

    if($_POST['idCliente'] != '0'){
        $sql .= " AND vpt.idCliente = " . $_POST['idCliente'];
    }

    if($_POST['situacao'] == '2'){
        $sql .= " AND vpt.idVenda > 0";
    }else if($_POST['situacao'] == '3'){
        $sql .= " AND vpt.idVenda = 0";
    }

    if ($_POST['codigo'] !== '') {
        $sql .= " AND vpt.codigo LIKE '%" . $_POST['codigo'] . "%'";
    }

    if($_POST['tipoData']  == 'D'){
        $sql .= ' ORDER BY vpt.dataCadastro DESC';
    }else{
        $sql .= ' ORDER BY vpt.dataValidade DESC';
    }

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) <= 0) {
        echo '0';
       mysqli_close($ArqT);
        return;
    }

    while ($linha =mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'idValePresenteTroca' => $linha['idValePresenteTroca'],
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'codigo' => $linha['codigo'],
            'loja' => $linha['loja'],
            'dataValidade' => FormatData($linha['dataValidade']),
            'valor' => FormatMoeda($linha['valor']),
            'idVenda' => $linha['idVenda'],
            'cliente' => $linha['cliente']
        );
    }

    echo json_encode($json);
   mysqli_close($ArqT);
}

function Gravar() {

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    if ($_POST['idValePresenteTroca'] <= 0) {

        $sql = 'SELECT codigo FROM vales_presentes_trocas WHERE codigo = "' . TextoSSql($ArqT, $_POST['codigo']) . '" 
                AND idValePresenteTroca <> ' . $_POST['idValePresenteTroca'];

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_num_rows($Tb) >= 1) {
            echo '2';
           mysqli_close($ArqT);
            return;
        }
    }

    $sql = ' vales_presentes_trocas SET '
            . ' codigo = "' . $_POST['codigo'] . '"' 
            . ', idGaleria = ' . $_POST['idGaleria']
            . ', idCliente = ' . $_POST['idColecionador']
            . ', dataValidade = DATE_ADD("' .  DataSSql($_POST['dataCadastro']) . '", INTERVAL ' . $_POST['validade'] . ' DAY) '
            . ', valor = ' . ValorE($_POST['valor']);

    if ($_POST['idValePresenteTroca'] <= 0) {
        $sql = 'INSERT INTO ' . $sql . ', 
                dataCadastro = "' . DataSSql($_POST['dataCadastro']) . '"';
    } else {
        $sql = 'UPDATE ' . $sql . ', 
                dataAtualizacao = NOW() WHERE idValePresenteTroca = ' . $_POST['idValePresenteTroca'];
    }

   mysqli_query($ArqT, $sql);

    if ($_POST['idValePresenteTroca'] <= 0) {
        $idValePresenteTroca = UltimoRegistroInserido($ArqT);
    }else{
        $idValePresenteTroca = $_POST['idValePresenteTroca'];
    }

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '1';
    } else {
        echo '0';
    }

    for($i = 0; $i < $_POST['qtdParcelas']; $i++){

        $sql = "INSERT INTO vales_presentes_trocas_parcelas SET 
                idValePresenteTroca = " . $idValePresenteTroca . ", 
                valor = " . (ValorE($_POST['valor']) / $_POST['qtdParcelas']) . ", 
                parcela = " . ($i + 1) . ", 
                dataVencimento = DATE_ADD('" .  DataSSql($_POST['dataCadastro']) . "', INTERVAL " . ($i + 1) . " MONTH),
                idFormaPagamento = " . $_POST['idFormaPagamento'] . ", 
                recibo = '" . $_POST['recibo'] . "'";
       mysqli_query($ArqT, $sql);
    }

   mysqli_close($ArqT);
}

function getValePresenteTroca(){

    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "SELECT dataCadastro, codigo, idGaleria, idCliente, DATEDIFF(dataValidade, dataCadastro) AS validade, valor,  
            (SELECT idFormaPagamento FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0 LIMIT 1) AS idFormaPagamento, 
            (SELECT recibo FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0 LIMIT 1) AS recibo, 
            (SELECT COUNT(*) FROM vales_presentes_trocas_parcelas WHERE idValePresenteTroca = vpt.idValePresenteTroca AND del = 0) AS qtdParcelas
            FROM vales_presentes_trocas AS vpt
            WHERE vpt.idValePresenteTroca = " . $_POST['idValePresenteTroca'];
    $Tb = ConsultaSQL($sql, $ArqT);

    if(mysqli_num_rows($Tb) <= 0){
        echo '0';
    }else{

        $linha =mysqli_fetch_assoc($Tb);

        $json = array(
            'dataCadastro' => FormatData($linha['dataCadastro']),
            'codigo' => $linha['codigo'],
            'idGaleria' => $linha['idGaleria'],
            'idCliente' => $linha['idCliente'],
            'validade' => $linha['validade'],
            'valor' => FormatMoeda($linha['valor']),
            'idFormaPagamento' => $linha['idFormaPagamento'],
            'recibo' => $linha['recibo'],
            'qtdParcelas' => $linha['qtdParcelas']
        );

        echo json_encode($json);
    }

   mysqli_close($ArqT);
}

function ExcluirVale(){

    session_start();
    $ArqT = AbreBancoPhotoartsPdv();

    $sql = "UPDATE vales_presentes_trocas SET 
            del = 1, 
            dataDel = NOW()
            WHERE idValePresenteTroca = " . $_POST['idValePresenteTroca'];
   mysqli_query($ArqT, $sql);

    if(mysqli_affected_rows($ArqT) <= 0){
        echo '0';
    }else{
        echo '1';
    }

   mysqli_close($ArqT);
}

?>