<?php

include( 'photoarts-pdv.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostrarPedidosAndamento':
            MostrarPedidosAndamento();
            break;

        case 'MostrarObrasPedido':
        	MostrarObrasPedido();
        	break;
    }
}

function MostrarPedidosAndamento(){

    inicia_sessao();

    $db = ConectaDB();

    $sql = "SELECT v.idVenda, v.dataVenda, c.cliente, v.dataEntrega, 
                    CONCAT(vs.status, ' - ETAPA ', vs.ordem) AS situacao 
                    FROM vendas AS v
                    INNER JOIN clientes AS c USING(idCliente)
                    LEFT JOIN vendas_status AS vt ON vt.idVenda = v.idVenda
                    INNER JOIN v_status AS vs ON vs.idVStatus = vt.idVStatus
                    WHERE vt.idVStatus NOT IN(6,7) ";

    if($_SESSION['photoarts_pdv_gerente'] == '0'){

            $sql .= " AND v.idVendedor = " . $_SESSION['photoarts_pdv_idVendedor'];
    }

    $sql .= " ORDER BY dataVenda DESC ";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        echo '0';
    }else{

        while ($linha = $db->fetch()) {

                $json[] = array(
                        'idVenda' => $linha['idVenda'],
                        'dataVenda' => FormatData($linha['dataVenda']),
                        'cliente' => $linha['cliente'],
                        'dataEntrega' => FormatData($linha['dataEntrega']),
                        'situacao' => $linha['situacao']
                );
        }

        echo json_encode($json);
    }

    $db->close();
}

function MostrarObrasPedido(){

    $db = ConectaDB();

    $sql = "SELECT vc.imagemObra, tp.produto AS tipoProduto, ao.nomeObra, a.artista, ac.nomeAcabamento, 
                    t.nomeTamanho, vc.altura, vc.largura, vc.valor, vc.qtd, vc.valorTotal
                    FROM vendas_comp AS vc
                    INNER JOIN tipos_produtos AS tp USING(idTipoProduto)
                    INNER JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
                    INNER JOIN artistas AS a ON a.idArtista = ao.idArtista
                    INNER JOIN acabamentos AS ac USING(idAcabamento)
                    INNER JOIN tamanhos AS t USING(idTamanho)
                    WHERE idVenda = " . $_POST['idVenda'];

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
            echo '0';
    }else{

            while ($linha = $db->fetch()) {

                    $json[] = array(
                            'imagemObra' => './../imagens/obras/' . $linha['imagemObra'],
                            'imagemObraMini' => './../imagens/obras/mini_' . $linha['imagemObra'],
                            'tipoProduto' => $linha['tipoProduto'],
                            'nomeObra' => $linha['nomeObra'],
                            'artista' => $linha['artista'],
                            'nomeAcabamento' => $linha['nomeAcabamento'],
                            'tamanho' => $linha['nomeTamanho'] . ' (' . $linha['altura'] . 'x' . $linha['largura'] .')',
                            'valor' => FormatValor($linha['valor']),
                            'qtd' => $linha['qtd'],
                            'valorTotal' => FormatValor($linha['valorTotal'])
                    );
            }

            echo json_encode($json);
    }

    $db->close();
}