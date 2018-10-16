<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Pesquisar':
            Pesquisar();
            break;

        case 'GravarMovimentoEstoque':
            GravarMovimentoEstoque();
            break;

        case 'ExcluirLancamento':
            ExcluirLancamento();
            break;

        case 'TransferirEstoque':
            TransferirEstoque();
            break;
    }
}

function TransferirEstoque() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = "INSERT INTO estoque_produtos SET 
            dataMovimento = NOW(), 
            idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
            tipoMovimento = 'S', 
            idLoja = " . $_POST['galeriaDe'] . ", 
            idTipoProduto = " . ValorE($_POST['idTipoProduto']) . ", 
            idProduto = " . ValorE($_POST['produto']) . ", 
            idObra = " . ValorE($_POST['obra']) . ", 
            idArtista = " . ValorE($_POST['artista']) . ", 
            idAcabamento = " . ValorE($_POST['acabamento']) . ", 
            idTamanho = " . ValorE($_POST['tamanho']) . ", 
            altura = " . ValorE($_POST['altura']) . ", 
            largura = " . ValorE($_POST['largura']) . ", 
            qtd = " . $_POST['qtd'] . ", 
            obs = 'Transferência de estoque para " . $_POST['galeriaNomePara'] . "'";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        $sql = "INSERT INTO estoque_produtos SET 
                dataMovimento = NOW(), 
                idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
                tipoMovimento = 'E', 
                idLoja = " . $_POST['galeriaPara'] . ", 
                idTipoProduto = " . ValorE($_POST['idTipoProduto']) . ", 
                idProduto = " . ValorE($_POST['produto']) . ", 
                idObra = " . ValorE($_POST['obra']) . ", 
                idArtista = " . ValorE($_POST['artista']) . ", 
                idAcabamento = " . ValorE($_POST['acabamento']) . ", 
                idTamanho = " . ValorE($_POST['tamanho']) . ", 
                altura = " .  ValorE($_POST['altura']) . ", 
                largura = " . ValorE($_POST['largura']) . ", 
                qtd = " . $_POST['qtd'] . ", 
                obs = 'Transferência de estoque, recebido de " . $_POST['galeriaNomeDe'] . "'";
        
        $db->query( $sql );

        echo '1';
    }
    $db->close();
}

function Pesquisar() {

    $db = ConectaDB();

    if ($_POST['detalhado'] == 'true') {

        $sql = "SELECT ep.idLoja, ep.idTipoProduto, ep.idProduto, ep.idObra, ep.idArtista,
                ep.idAcabamento, aot.idTamanho, ep.altura, ep.largura, IFNULL(t.nomeTamanho,'') AS nomeTamanho, 
                ep.idEstoqueProduto, l.loja, tp.produto AS tipoProduto, ep.obs, 
		            LEFT(ep.dataMovimento, 10) AS dataMovimento, 
                LEFT(RIGHT(ep.dataMovimento, 8), 5) AS horaMovimento, ep.qtd, 
                IFNULL(a.artista, '') AS artista, IFNULL(ao.nomeObra,'') AS nomeObra, 
                IFNULL(ac.nomeAcabamento, '') AS nomeAcabamento, IFNULL(p.nomeProduto,'') AS nomeProduto, 
                ep.tipoMovimento, 0 AS totalMovimentos, 0 AS totalQtd, ep.holograma 
                FROM estoque_produtos AS ep 
                INNER JOIN lojas AS l USING(idLoja)
                INNER JOIN tipos_produtos AS tp USING(idTipoProduto)
                LEFT JOIN produtos AS p USING(idProduto)
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = ep.idObra
                LEFT JOIN artistas AS a ON a.idArtista = ep.idArtista
                LEFT JOIN acabamentos AS ac ON ac.idAcabamento = ep.idAcabamento
                LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = ep.idTamanho
                LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
                WHERE ep.del = 0 AND ep.idTipoProduto != 2";

        if ($_POST['de'] != '') {
            $sql .= " AND DATE(dataMovimento) >= '" . DataSSql($_POST['de']) . "' ";
        }

        if ($_POST['ate'] != '') {
            $sql .= " AND DATE(dataMovimento) <= '" . DataSSql($_POST['ate']) . "' ";
        }

        if ($_POST['idGaleria'] > 0) {
            $sql .= " AND ep.idLoja = " . $_POST['idGaleria'];
        }

        if ($_POST['idArtista'] > 0) {
            $sql .= " AND ep.idArtista = " . $_POST['idArtista'];
        }

        if ($_POST['idObra'] > 0) {
            $sql .= " AND ep.idObra = " . $_POST['idObra'];
        }

        if ($_POST['idTamanho'] > 0) {
            $sql .= " AND ep.idTamanho = " . $_POST['idTamanho'];
        }

        if ($_POST['idAcabamento'] > 0) {
            $sql .= " AND ep.idAcabamento = " . $_POST['idAcabamento'];
        }

        if ($_POST['holograma'] != '') {
            $sql .= " AND ep.holograma LIKE '%" . $_POST['holograma'] . "%'";
        }

        if ($_POST['idProduto'] > 0) {
            $sql .= " AND ep.idProduto = " . $_POST['idProduto'];
        }

        if ($_POST['tipoProduto'] > 0) {
            $sql .= " AND ep.idTipoProduto = " . $_POST['tipoProduto'];
            
        }
        $sql .= " ORDER BY artista, nomeObra, ep.idEstoqueProduto DESC ";
    } else {

        $sql = "SELECT 
               ep.idLoja, ep.idTipoProduto, ep.idProduto, ep.idObra, ep.idArtista,
                ep.idAcabamento, aot.idTamanho, ep.altura, ep.largura, IFNULL(t.nomeTamanho,'') AS nomeTamanho, 
                ep.idEstoqueProduto, l.loja, tp.produto AS tipoProduto, ep.obs,
            		LEFT(ep.dataMovimento, 10) AS dataMovimento, 
            		LEFT(RIGHT(ep.dataMovimento, 8), 5) AS horaMovimento, 0 AS qtd, 
            	        IFNULL(a.artista, '') AS artista, IFNULL(ao.nomeObra,'') AS nomeObra,  
            		IFNULL(ac.nomeAcabamento, '') AS nomeAcabamento, IFNULL(p.nomeProduto,'') AS nomeProduto, 
                'T' AS tipoMovimento, GROUP_CONCAT(ep.tipoMovimento) AS totalMovimentos, GROUP_CONCAT(ep.qtd) AS totalQtd, 
                ep.holograma 
                FROM estoque_produtos AS ep 
                INNER JOIN lojas AS l USING(idLoja)
                INNER JOIN tipos_produtos AS tp USING(idTipoProduto)
                LEFT JOIN produtos AS p USING(idProduto)
                LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = ep.idObra
                LEFT JOIN artistas AS a ON a.idArtista = ep.idArtista
                LEFT JOIN acabamentos AS ac ON ac.idAcabamento = ep.idAcabamento
                LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = ep.idTamanho 
                LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho 
                WHERE ep.del = 0 AND ep.idTipoProduto != 2";

        if ($_POST['de'] != '') {
            $sql .= " AND DATE(dataMovimento) >= '" . DataSSql($_POST['de']) . "' ";
        }

        if ($_POST['ate'] != '') {
            $sql .= " AND DATE(dataMovimento) <= '" . DataSSql($_POST['ate']) . "' ";
        }

        if ($_POST['idGaleria'] > 0) {
            $sql .= " AND ep.idLoja = " . $_POST['idGaleria'];
        }

        if ($_POST['idArtista'] > 0) {
            $sql .= " AND ep.idArtista = " . $_POST['idArtista'];
        }

        if ($_POST['idObra'] > 0) {
            $sql .= " AND ep.idObra = " . $_POST['idObra'];
        }

        if ($_POST['idTamanho'] > 0) {
            $sql .= " AND ep.idTamanho = " . $_POST['idTamanho'];
        }

        if ($_POST['idAcabamento'] > 0) {
            $sql .= " AND ep.idAcabamento = " . $_POST['idAcabamento'];
        }

        if ($_POST['holograma'] != '') {
            $sql .= " AND ep.holograma LIKE '%" . $_POST['holograma'] . "%'";
        }

        if ($_POST['idProduto'] > 0) {
            $sql .= " AND ep.idProduto = " . $_POST['idProduto'];
        }

         if ($_POST['tipoProduto'] > 0) {
            $sql .= " AND ep.idTipoProduto = " . $_POST['tipoProduto'];
            
        }

        $sql .= " GROUP BY ep.idLoja, ep.idProduto, ep.idObra,  ep.idArtista, ep.idAcabamento, ep.idTamanho, ep.altura, ep.largura 
			ORDER BY artista, nomeObra, ep.idEstoqueProduto DESC ";
    }

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {
            $total = 0;
            if ($linha['totalMovimentos'] !== '0') {
                $arrayMov = explode(',', $linha['totalMovimentos']);
                $arrayTotal = explode(',', $linha['totalQtd']);
                for ($i = 0; $i < count($arrayMov); $i++) {
                    if ($arrayMov[$i] == "E") {
                        $total = $total + intval($arrayTotal[$i]);
                    } else {
                        $total = $total - intval($arrayTotal[$i]);
                    }
                }
            } else {
                $total = $linha['qtd'];
            }
            if ($linha['altura'] != '0' && $linha['largura'] != '0') {
                if ($linha['idObra'] != "0") {
                    $descricao = $linha['artista'] . " - " . $linha['nomeObra'] . " - " . $linha['nomeAcabamento'] . " - " . $linha['nomeTamanho'] . " - " . str_replace('.', ',', round($linha['altura'], 2)) . "x" . str_replace('.', ',', round($linha['largura'], 2));
                } else {
                    $descricao = $linha['nomeProduto'] . " (" . str_replace('.', ',', round($linha['altura'], 2)) . 'x' . str_replace('.', ',', round($linha['largura'], 2)) . ")";
                }
            } else {
                $descricao = $linha['nomeProduto'];
            }

            $json[] = array(
                'idLoja' => $linha['idLoja'],
                'idTipoProduto' => $linha['idTipoProduto'],
                'idProduto' => $linha['idProduto'],
                'idObra' => $linha['idObra'],
                'idArtista' => $linha['idArtista'],
                'idAcabamento' => $linha['idAcabamento'],
                'idTamanho' => $linha['idTamanho'],
                'nomeTamanho' => $linha['nomeTamanho'],
                'nomeProduto' => $linha['nomeProduto'],
                'largura' => FormatMoeda($linha['largura']),
                'altura' => FormatMoeda($linha['altura']),
                'idEstoqueProduto' => $linha['idEstoqueProduto'],
                'dataMovimento' => FormatData($linha['dataMovimento'], false),
                'horaMovimento' => $linha['horaMovimento'],
                'qtd' => FormatMoeda($total),
                'tipoMovimento' => $linha['tipoMovimento'],
                'loja' => $linha['loja'],
                'tipoProduto' => $linha['tipoProduto'],
                //'descricao' => $linha['descricao'],
                'descricao' => $descricao,
                'obs' => $linha['obs'],
                'holograma' => $linha['holograma']
            );
        }

        echo json_encode($json);
    }

    $db->close();
}

function GravarMovimentoEstoque() {

    inicia_sessao();
    $db = ConectaDB();

    if ($_POST['tipoMovimento'] == 'S') {

        if ($_POST['idTipoProduto'] == '3') {

            $sql = "SELECT * FROM estoque_produtos 
                    WHERE idLoja = " . $_POST['idGaleria'] . " AND idProduto = " . $_POST['idProduto'] . " 
                    AND getQtdEstoque(3," . $_POST['idProduto'] . ",0,0,0," . $_POST['idGaleria'] . ") > 0 AND del = 0";
        } else {

            $sql = "SELECT * FROM estoque_produtos 
                    WHERE idLoja = " . $_POST['idGaleria'] . " AND idObra = " . $_POST['idObra'] . " 
                    AND idArtista = " . $_POST['idArtista'] . " AND idAcabamento = " . $_POST['idAcabamento'] . " 
                    AND idTamanho = " . $_POST['idTamanho'] . " 
                    AND getQtdEstoque(1,0," . $_POST['idObra'] . "," . $_POST['idTamanho'] . "," . $_POST['idAcabamento'] . ", " . $_POST['idGaleria'] . ") > 0 
                    AND del = 0";
        }

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '2';
            $db->close();
            return;
        }

        $sql = "SELECT getQtdEstoque(3," . $_POST['idProduto'] . ",0,0,0," . $_POST['idGaleria'] . ") AS qtdTotalProduto, 
            getQtdEstoque(1,0," . $_POST['idObra'] . "," . $_POST['idTamanho'] . "," . $_POST['idAcabamento'] . ", " . $_POST['idGaleria'] . ") AS qtdTotalObra";

        $db->query( $sql );

        if ($_POST['idTipoProduto'] == '3') {

            if ($_POST['qtd'] > mysqli_result($Tb, 0, "qtdTotalProduto")) {
                echo '3';
                return;
            }
        } else {

            if ($_POST['qtd'] > mysqli_result($Tb, 0, "qtdTotalObra")) {
                echo '3';
                return;
            }
        }
    }

    $sql = "INSERT INTO estoque_produtos SET 
            dataMovimento = NOW(), 
            idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
            tipoMovimento = '" . $_POST['tipoMovimento'] . "', 
            idLoja = " . $_POST['idGaleria'] . ", 
            idTipoProduto = " . $_POST['idTipoProduto'] . ", 
            idProduto = " . $_POST['idProduto'] . ", 
            idObra = " . $_POST['idObra'] . ", 
            idArtista = " . $_POST['idArtista'] . ", 
            idAcabamento = " . $_POST['idAcabamento'] . ", 
            idTamanho = " . $_POST['idTamanho'] . ", 
            altura = " . ValorE($_POST['altura']) . ", 
            largura = " . ValorE($_POST['largura']) . ", 
            qtd = " . $_POST['qtd'] . ", 
            holograma = '" . $db->escapesql($_POST['holograma']) . "', 
            obs = '" . $db->escapesql($_POST['obs']) . "'";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function ExcluirLancamento() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = "UPDATE estoque_produtos SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idEstoqueProduto = " . $_POST['idEstoqueProduto'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}