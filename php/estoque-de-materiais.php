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

        case 'getUnidadeMedidaMaterial':
            getUnidadeMedidaMaterial();
            break;

        case 'TransferirEstoque':
            TransferirEstoque();
            break;
    }
}

function TransferirEstoque() {

    inicia_sessao();

    $db = ConectaDB();

    $sql = "INSERT INTO estoque_materiais SET 
            dataMovimento = NOW(), 
            idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
            tipoMovimento = 'S', 
            idLoja = " . $_POST['galeriaDe'] . ", 
            idMaterial = " . $_POST['codigo'] . ", 
            altura = " . $_POST['altura'] . ", 
            largura = " . $_POST['largura'] . ", 
            qtd = " . $_POST['qtd'] . ", 
            obs = 'Transferência de estoque para " . $_POST['galeriaNomePara'] . "'";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {

        $sql = "INSERT INTO estoque_materiais SET 
            dataMovimento = NOW(), 
            idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
            tipoMovimento = 'E', 
            idLoja = " . $_POST['galeriaPara'] . ", 
            idMaterial = " . $_POST['codigo'] . ", 
            altura = " . $_POST['altura'] . ", 
            largura = " . $_POST['largura'] . ", 
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

        /* $sql = "SELECT em.idEstoqueMaterial, LEFT(em.dataMovimento, 10) AS dataMovimento, 
          LEFT(RIGHT(em.dataMovimento, 8), 5) AS horaMovimento, em.qtd, l.loja,
          em.tipoMovimento, IFNULL(em.obs, '') AS obs, 0 AS totalMovimentos, 0 AS totalQtd,
          IF(em.altura <> 0 AND em.largura <> 0, CONCAT(m.nomeMaterial, ' (', em.altura, 'x', em.largura, ')'), m.nomeMaterial) AS material,
          FROM estoque_materiais AS em
          INNER JOIN lojas AS l USING(idLoja)
          INNER JOIN materiais AS m USING(idMaterial)
          WHERE em.del = 0"; */

        $sql = "SELECT m.idMaterial, em.idEstoqueMaterial, LEFT(em.dataMovimento, 10) AS dataMovimento, 
                LEFT(RIGHT(em.dataMovimento, 8), 5) AS horaMovimento, em.qtd, l.idLoja, l.loja, 
                em.tipoMovimento, IFNULL(em.obs, '') AS obs, 0 AS totalMovimentos, 0 AS totalQtd, 
                m.nomeMaterial, em.altura, em.largura
                FROM estoque_materiais AS em 
                INNER JOIN lojas AS l USING(idLoja)
                INNER JOIN materiais AS m USING(idMaterial)
                WHERE em.del = 0";

        if ($_POST['de'] != '') {
            $sql .= " AND dataMovimento >= '" . DataSSql($_POST['de']) . "' ";
        }

        if ($_POST['ate'] != '') {
            $sql .= " AND dataMovimento <= '" . DataSSql($_POST['ate']) . "' ";
        }

        if ($_POST['idGaleria'] > 0) {
            $sql .= " AND em.idLoja = " . $_POST['idGaleria'];
        }

        if ($_POST['idMaterial'] > 0) {
            $sql .= " AND em.idMaterial = " . $_POST['idMaterial'];
        }

        $sql .= " ORDER BY idEstoqueMaterial DESC ";
    } else {

        /* $sql = "SELECT em.idEstoqueMaterial, LEFT(em.dataMovimento, 10) AS dataMovimento, 
          LEFT(RIGHT(em.dataMovimento, 8), 5) AS horaMovimento, l.loja,
          'T' AS tipoMovimento, IFNULL(em.obs, '') AS obs,
          IF(em.altura <> 0 AND em.largura <> 0, CONCAT(m.nomeMaterial, ' (', em.altura, 'x', em.largura, ')'), m.nomeMaterial) AS material,
          GROUP_CONCAT(em.tipoMovimento) AS totalMovimentos, GROUP_CONCAT(em.qtd) AS totalQtd, 0 AS qtd
          FROM estoque_materiais AS em
          INNER JOIN lojas AS l USING(idLoja)
          INNER JOIN materiais AS m USING(idMaterial)
          WHERE em.del = 0"; */

        $sql = "SELECT m.idMaterial, em.idEstoqueMaterial, LEFT(em.dataMovimento, 10) AS dataMovimento, 
                LEFT(RIGHT(em.dataMovimento, 8), 5) AS horaMovimento, l.idLoja, l.loja, 
                'T' AS tipoMovimento, IFNULL(em.obs, '') AS obs, m.nomeMaterial, em.altura, em.largura,
                GROUP_CONCAT(em.tipoMovimento) AS totalMovimentos, GROUP_CONCAT(em.qtd) AS totalQtd, 0 AS qtd
                FROM estoque_materiais AS em 
                INNER JOIN lojas AS l USING(idLoja)
                INNER JOIN materiais AS m USING(idMaterial)
                WHERE em.del = 0";

        if ($_POST['de'] != '') {
            $sql .= " AND dataMovimento >= '" . DataSSql($_POST['de']) . "' ";
        }

        if ($_POST['ate'] != '') {
            $sql .= " AND dataMovimento <= '" . DataSSql($_POST['ate']) . "' ";
        }

        if ($_POST['idGaleria'] > 0) {
            $sql .= " AND em.idLoja = " . $_POST['idGaleria'];
        }

        if ($_POST['idMaterial'] > 0) {
            $sql .= " AND em.idMaterial = " . $_POST['idMaterial'];
        }

        //$sql .= " GROUP BY material, l.loja ORDER BY material";
        //$sql .= " GROUP BY m.nomeMaterial, em.altura, em.largura, l.loja ORDER BY m.nomeMaterial";
        $sql .= " GROUP BY  l.idLoja,  m.idMaterial, em.altura, em.largura ORDER BY m.nomeMaterial";
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
                $material = $linha['nomeMaterial'] . " (" . str_replace('.', ',', round($linha['altura'], 2)) . 'x' . str_replace('.', ',', round($linha['largura'], 2)) . ")";
            } else {
                $material = $linha['nomeMaterial'];
            }

            $json[] = array(
                'idMaterial' => $linha['idMaterial'],
                'idEstoqueMaterial' => $linha['idEstoqueMaterial'],
                'dataMovimento' => FormatData($linha['dataMovimento']),
                'horaMovimento' => $linha['horaMovimento'],
                'qtd' => FormatMoeda($total),
                'tipoMovimento' => $linha['tipoMovimento'],
                'idLoja' => $linha['idLoja'],
                'loja' => $linha['loja'],
                'altura' => $linha['altura'],
                'largura' => $linha['largura'],
                'material' => $material,
                'obs' => $linha['obs']
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

        /*  $sql = "SELECT * FROM estoque_materiais 
          WHERE idLoja = " . $_POST['idGaleria'] . " AND idMaterial = " . $_POST['idMaterial'] . "
          AND getQtdEstoqueMateriais(" . $_POST['idMaterial'] . ", " . $_POST['idLoja'] . ") > 0 AND del = 0";
         */
        $sql = "SELECT getQtdEstoqueMateriais(" . $_POST['idMaterial'] . "," . $_POST['idGaleria'] . "," . ValorE($_POST['largura']) . "," . ValorE($_POST['altura']) . ") AS total";
        
        $db->query( $sql );
        $result = $db->fetch();
        
        if ($result["total"] < $_POST['qtd']) {
            echo '3';
            $db->close();
            return;
        }

        /*  $sql = "SELECT getQtdEstoqueMateriais(" . $_POST['idMaterial'] . ", " . $_POST['idLoja'] . ") AS qtdTotalMaterial";

          $Tb = ConsultaSQL($sql, $ArqT);

          if ($_POST['qtd'] > mysqli_result($Tb, 0, "qtdTotalMaterial")) {
          echo '3';
          return;
          } */
    }

    $sql = "INSERT INTO estoque_materiais SET 
            dataMovimento = NOW(), 
            idUsuarioMovimento = " . $_SESSION['photoarts_codigo'] . ", 
            tipoMovimento = '" . $_POST['tipoMovimento'] . "', 
            idLoja = " . $_POST['idGaleria'] . ", 
            idMaterial = " . $_POST['idMaterial'] . ", 
            altura = " . ValorE($_POST['altura']) . ", 
            largura = " . ValorE($_POST['largura']) . ", 
            qtd = " . $_POST['qtd'] . ", 
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

    $sql = "UPDATE estoque_materiais SET 
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['photoarts_codigo'] . " 
            WHERE idEstoqueMaterial = " . $_POST['idEstoqueMaterial'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function getUnidadeMedidaMaterial() {

    $db = ConectaDB();

    $sql = "SELECT um.UnidadeMedida 
            FROM materiais AS m
            INNER JOIN unidades_medidas AS um USING(idUnidadeMedida)
            WHERE idMaterial = " . $_POST['idMaterial'];

    $db->query( $sql );
    $result = $db->fetch();

    if ( $db->n_rows <= 0) {
        echo '0';
    } else {
        echo $result["UnidadeMedida"];
    }

    $db->close();
}
