<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarVendas':
            MostrarVendas();
            break;

        case 'ExportarPlanilha':
            ExportarPlanilha();
            break;
        
        case 'getP':
            getP();
            break;
    }
}

function MostrarVendas() {

    $db = ConectaDB();

    $sql = "SELECT v.idVenda, LPAD(v.idVenda, 5, 0) AS numeroVenda, v.dataVenda, v.dataEntrega, c.cliente, 
            ve.vendedor, tt.tipoTransporte, vs.status, v.obs, v.valorTotal, DAYOFWEEK(v.dataEntrega) AS diaSemana, 
            tp.produto AS tipoProduto, IFNULL(p.nomeProduto, '') AS produto, IFNULL(ao.nomeObra, '') AS nomeObra, 
            IFNULL(a.artista, '') AS artista, IFNULL(ac.nomeAcabamento, '') AS nomeAcabamento, 
            IFNULL(t.nomeTamanho, '') AS nomeTamanho, IFNULL(ta.nomeTamanho, '') AS nomeTamanhoInsta, 
            IFNULL(m.moldura, '') AS moldura, vc.altura, vc.largura, vc.qtd, vc.valorTotal AS valorTotalObra, 
            vc.pesoObra, vc.prontaEntrega, vc.estoqueOutrasLojas, DAY(v.dataEntrega) AS dia, l.loja, 
            vc.obs AS obsObra, tp.pasta, vc.imagemObra, v.consignacao
            FROM vendas AS v 
            INNER JOIN clientes AS c USING(idCliente)
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja 
            INNER JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor
            INNER JOIN transportes_tipos AS tt ON tt.idTransporteTipo = v.idTipoEntrega
            INNER JOIN v_status AS vs ON vs.idVStatus = v.idUltimoStatus
            INNER JOIN vendas_comp AS vc ON vc.idVenda = v.idVenda
            INNER JOIN tipos_produtos AS tp ON tp.idTipoProduto = vc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto = vc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = vc.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = vc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = vc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS ta ON ta.idTamanho = vc.idTamanho
            LEFT JOIN molduras AS m ON m.idMoldura = vc.idMoldura
            WHERE v.del = 0 AND vc.del = 0 
            AND v.dataEntrega >= CURDATE() 
            AND v.dataEntrega <= DATE_ADD(CURDATE(), INTERVAL " . $_POST['dias'] . " DAY)";
    
    if($_POST['statusTipo'] > 0){
        $sql .= " AND v.consignacao = " . ($_POST['statusTipo'] == '1' ? '0' : '1') . " ";
    }
    
    if($_POST['idLoja'] > 0){

        $sql .= " AND v.idLoja = " . $_POST['idLoja'];
    }

    $sql .= " ORDER BY v.dataEntrega";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
        return;
    }
    
    saveP();

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        if($linha['prontaEntrega'] == '1'){

            $obs = 'PE';
        }else{

            $obs = 'OP';

            if($linha['estoqueOutrasLojas'] == '1'){

                $obs .= ' ou EOL';                    
            }
        }

        if($linha['obsObra'] == $obs){
            $obs = $linha['obsObra'];
        }else{

            if($linha['obsObra'] != ''){
                $obs .= ' ' . $linha['obsObra'];
            }
        }

        $json[] = array(
            'idVenda' => $linha['idVenda'],
            'numeroVenda' => $linha['numeroVenda'],
            'dataVenda' => FormatData($linha['dataVenda']),
            'dataEntrega' => FormatData($linha['dataEntrega']),
            'cliente' => $linha['cliente'],
            'vendedor' => $linha['vendedor'],
            'tipoTransporte' => $linha['tipoTransporte'],
            'status' => $linha['status'],
            'obs' => $linha['obs'],
            'consignacao' => $linha['consignacao'],
            'valorTotal' => FormatMoeda($linha['valorTotal']),
            'diaSemana' => getNomeDiaSemana($linha['diaSemana']),
            'tipoProduto' => $linha['tipoProduto'],
            'produto' => $linha['produto'],
            'nomeObra' => $linha['nomeObra'],
            'artista' => $linha['artista'],
            'nomeAcabamento' => $linha['nomeAcabamento'],
            'nomeTamanho' => $linha['nomeTamanho'],
            'nomeTamanhoInsta' => $linha['nomeTamanhoInsta'],
            'moldura' => $linha['moldura'],
            'altura' => FormatMoeda($linha['altura']),
            'largura' => FormatMoeda($linha['largura']),
            'qtd' => $linha['qtd'],
            'valorTotalObra' => FormatMoeda($linha['valorTotalObra']),
            'pesoObra' => FormatMoeda($linha['pesoObra']) . ' Kg',
            'prontaEntrega' => $linha['prontaEntrega'],
            'estoqueOutrasLojas' => $linha['estoqueOutrasLojas'],
            'dia' => $linha['dia'],
            'loja' => $linha['loja'],
            'obsObra' => $obs,
            'pasta' => $linha['pasta'],
            'imagem' => $linha['imagemObra']
        );
    }

    echo json_encode($json);
    $db->close();
}

function getNomeDiaSemana($dia) {

    switch ($dia) {
        case '1':
            return "Domingo";
        case '2':
            return "Segunda";
        case '3':
            return "Terça";
        case '4':
            return "Quarta";
        case '5':
            return "Quinta";
        case '6':
            return "Sexta";
        case '7':
            return "Sábado";
    }
}

function ExportarPlanilha() {

    $db = ConectaDB();

    $sql = "SELECT v.idVenda, LPAD(v.idVenda, 5, 0) AS numeroVenda, v.dataVenda, v.dataEntrega, c.cliente, 
            ve.vendedor, tt.tipoTransporte, vs.status, v.obs, v.valorTotal, DAYOFWEEK(v.dataEntrega) AS diaSemana, 
            tp.produto AS tipoProduto, IFNULL(p.nomeProduto, '') AS produto, IFNULL(ao.nomeObra, '') AS nomeObra, 
            IFNULL(a.artista, '') AS artista, IFNULL(ac.nomeAcabamento, '') AS nomeAcabamento, 
            IFNULL(t.nomeTamanho, '') AS nomeTamanho, IFNULL(ta.nomeTamanho, '') AS nomeTamanhoInsta, 
            IFNULL(m.moldura, '') AS moldura, vc.altura, vc.largura, vc.qtd, vc.valorTotal AS valorTotalObra, 
            vc.pesoObra, vc.prontaEntrega, vc.estoqueOutrasLojas, DAY(v.dataEntrega) AS dia, l.loja, 
            vc.obs AS obsObra, tp.pasta, vc.imagemObra 
            FROM vendas AS v 
            INNER JOIN clientes AS c USING(idCliente)
            INNER JOIN lojas AS l ON l.idLoja = v.idLoja 
            INNER JOIN vendedores AS ve ON ve.idVendedor = v.idVendedor
            INNER JOIN transportes_tipos AS tt ON tt.idTransporteTipo = v.idTipoEntrega
            INNER JOIN v_status AS vs ON vs.idVStatus = v.idUltimoStatus
            INNER JOIN vendas_comp AS vc ON vc.idVenda = v.idVenda
            INNER JOIN tipos_produtos AS tp ON tp.idTipoProduto = vc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto = vc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = vc.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = vc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = vc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS ta ON ta.idTamanho = vc.idTamanho
            LEFT JOIN molduras AS m ON m.idMoldura = vc.idMoldura
            WHERE v.del = 0 AND vc.del = 0 
            AND v.dataEntrega >= CURDATE() 
            AND v.dataEntrega <= DATE_ADD(CURDATE(), INTERVAL " . $_POST['dias'] . " DAY)";

    if($_POST['idLoja'] > 0){

        $sql .= " AND v.idLoja = " . $_POST['idLoja'];
    }

    $sql .= " ORDER BY v.dataEntrega";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $db->close();
        echo '-1';
        return;
    }

    session_start();
    $_SESSION['sql_rel'] = $sql;
    //saveP();

    $num = $_SESSION['photoarts_codigo'];
    $newPath = '../relatorio-de-panorama-de-vendas-user-' . $num . '.xls';
    $newPathReturn = 'relatorio-de-panorama-de-vendas-user-' . $num . '.xls';

    if (file_exists($newPath)) {
        unlink($newPath); //APAGAR
    }

    $excel = new ExcelWriter($newPath);

    if ($excel == false)
        echo $excel->error;

    $arr = array('N° PEDIDO', 'DATA PEDIDO', 'DATA ENTREGA', 'LOJA', 'COLECIONADOR', 'MARCHAND', 'TIPO ENTREGA', 'STATUS', 'VALOR TOTAL', 'OBS', 'OBRAS');

    $excel->writeLine($arr);
    $idVenda = 0;

    $linhas = $db->fetch_all();
    foreach ($linhas as $linha){

        if($idVenda != $linha['idVenda']){
            
            $idVenda = $linha['idVenda'];

            $arr = array(
                $linha['numeroVenda'],
                FormatData($linha['dataVenda']),
                FormatData($linha['dataEntrega']),
                $linha['loja'],
                $linha['cliente'],
                $linha['vendedor'],
                $linha['tipoTransporte'],
                FormatMoeda($linha['valorTotal']),
                $linha['obs'],
                ''
            );

            $excel->writeLine($arr);
        }

        $arr = array(
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '(' . $linha['tipoProduto'] . ') ' . $linha['artista'] . ' - ' . $linha['nomeObra'] . ' - ' . $linha['altura'] . 'x' . $linha['largura'] . ' - ' . $linha['nomeAcabamento'] . ($linha['moldura'] != '' ? ' (' . $linha['moldura'] . ')' : '') . ' - Qtde: ' . $linha['qtd'] . ' - Valor: R$ ' . FormatMoeda($linha['valorTotalObra']) . ' - Peso: ' . FormatMoeda($linha['pesoObra']) . 'Kg'
        );

        $excel->writeLine($arr);
    }

    $excel->close();
    echo $newPathReturn;
    $db->close();
}

function getP() {
    inicia_sessao();
    echo $_SESSION['p'];
}

function saveP() {

    $x = Array(
        'dias' => $_POST['dias'],
        'idLoja' => $_POST['idLoja']
    );

    inicia_sessao();

    $_SESSION['p'] = json_encode($x);
   
}