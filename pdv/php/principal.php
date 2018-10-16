<?php

include './photoarts-pdv.php';

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

	session_start();
	$ArqT = AbreBancoPhotoartsPdv();

	$sql = "SELECT v.idVenda, v.dataVenda, c.cliente, v.dataEntrega, 
			CONCAT(vs.status, ' - ETAPA ', vs.ordem) AS situacao, l.loja 
			FROM vendas AS v
			INNER JOIN clientes AS c USING(idCliente)
			LEFT JOIN vendas_status AS vt ON vt.idVenda = v.idVenda
			INNER JOIN v_status AS vs ON vs.idVStatus = vt.idVStatus
			INNER JOIN lojas AS l ON l.idLoja = v.idLoja 
			WHERE vt.idVStatus NOT IN(6,7) ";

	if($_POST['idLoja'] != '0'){

		$sql .= " AND v.idLoja = " . $_POST['idLoja'];
	}

	if($_SESSION['photoarts_pdv_gerente'] == '0'){

		$sql .= " AND v.idVendedor = " . $_SESSION['photoarts_pdv_idVendedor'];
	}

	$sql .= " ORDER BY dataVenda DESC ";

	$Tb = ConsultaSQL($sql, $ArqT);

	if(mysqli_num_rows($Tb) <= 0) {
		echo '0';
	}else{

		while($linha =mysqli_fetch_assoc($Tb)){

			$json[] = array(
				'idVenda' => $linha['idVenda'],
				'dataVenda' => FormatData($linha['dataVenda']),
				'cliente' => $linha['cliente'],
				'dataEntrega' => FormatData($linha['dataEntrega']),
				'situacao' => $linha['situacao'],
				'loja' => $linha['loja']
			);
		}

		echo json_encode($json);
	}

	mysqli_close($ArqT);
}

function MostrarObrasPedido(){

	$ArqT = AbreBancoPhotoartsPdv();

	/*$sql = "SELECT vc.imagemObra, tp.produto AS tipoProduto, ao.nomeObra, a.artista, ac.nomeAcabamento, 
			t.nomeTamanho, vc.altura, vc.largura, vc.valor, vc.qtd, vc.valorTotal
			FROM vendas_comp AS vc
			INNER JOIN tipos_produtos AS tp USING(idTipoProduto)
			INNER JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
			INNER JOIN artistas AS a ON a.idArtista = ao.idArtista
			INNER JOIN acabamentos AS ac USING(idAcabamento)
			INNER JOIN tamanhos AS t USING(idTamanho)
			WHERE idVenda = " . $_POST['idVenda'];*/

	$sql = "SELECT vc.imagemObra, tp.produto AS tipoProduto, IFNULL(ao.nomeObra, '- - -') AS nomeObra, 
			IFNULL(a.artista, '- - -') AS artista, IFNULL(ac.nomeAcabamento, '- - -') AS nomeAcabamento, 
			IFNULL(t.nomeTamanho, '- - -') AS nomeTamanho, vc.altura, vc.largura, vc.valor, vc.qtd, vc.valorTotal 
            FROM vendas_comp AS vc
            LEFT JOIN tipos_produtos AS tp ON tp.idTipoProduto = vc.idTipoProduto
            LEFT JOIN produtos AS p ON p.idProduto = vc.idProduto
            LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = vc.idObra
            LEFT JOIN artistas AS a ON a.idArtista = ao.idArtista
            LEFT JOIN acabamentos AS ac ON ac.idAcabamento = vc.idAcabamento
            LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idArtistaObraTamanho = vc.idTamanho
            LEFT JOIN tamanhos AS t ON t.idTamanho = aot.idTamanho
            LEFT JOIN tamanhos AS tt ON tt.idTamanho = vc.idTamanho
            WHERE vc.idVenda = " . $_POST['idVenda'] . " AND vc.del = 0";

	$Tb = ConsultaSQL($sql, $ArqT);

	if(mysqli_num_rows($Tb) <= 0){
		echo '0';
	}else{

		while($linha =mysqli_fetch_assoc($Tb)){

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

	mysqli_close($ArqT);
}