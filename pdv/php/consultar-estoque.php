<?php

include './photoarts-pdv.php';

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'Pesquisar':
            Pesquisar();
            break;
    }
}

function Pesquisar(){

	$ArqT = AbreBancoPhotoartsPdv();

	$sql = "SELECT ep.idEstoqueProduto, l.loja, IF(ep.idObra <> 0, a.artista, '- - -') AS artista, 
			IFNULL(p.nomeProduto, ao.nomeObra) AS obraProduto, ep.qtd, 
			IF(ep.idObra <> 0, CONCAT(ep.altura, 'x', ep.largura), '- - -') AS tamanho, 
			IF(ep.idObra <> 0, ac.nomeAcabamento, '- - -') AS acabamento,
			IFNULL(p.valorProduto, '0.00') AS valor, 
			IF(ep.idObra <> 0, ao.imagem, '- - -') AS imagem, tp.produto AS tipoProduto, ep.altura, ep.largura, 
			IFNULL(ac.indiceAte1MSemEstrela, '') AS indiceAte1MSemEstrela, 
			IFNULL(ac.indiceAte1MComEstrela, '') AS indiceAte1MComEstrela, 
			IFNULL(ac.indiceAcima1MSemEstrela, '') AS indiceAcima1MSemEstrela, 
			IFNULL(ac.indiceAcima1MComEstrela, '') AS indiceAcima1MComEstrela, 
			IFNULL(ac.precoBase, '0.00') AS precoBase, aot.tiragemAtual,
			(SELECT estrelas FROM estrelas WHERE ativo=1 AND tiragemAtual BETWEEN de AND ate) AS estrelas
			FROM estoque_produtos AS ep 
			INNER JOIN lojas AS l USING(idLoja)
			LEFT JOIN tipos_produtos AS tp USING(idTipoProduto)
			LEFT JOIN produtos AS p USING(idProduto)
			LEFT JOIN artistas_obras AS ao ON ao.idArtistaObra = ep.idObra
			LEFT JOIN artistas AS a ON a.idArtista = ep.idArtista
			LEFT JOIN acabamentos AS ac ON ac.idAcabamento = ep.idAcabamento
			LEFT JOIN artistas_obras_tamanhos AS aot ON aot.idObra = ep.idObra AND aot.altura = ep.altura 
			AND aot.largura = ep.largura
			WHERE ep.qtd > 0 AND ep.del = 0 AND ep.idTipoProduto <> 2";

	if($_POST['galeria'] > 0){

		$sql .= " AND idLoja = " . $_POST['galeria'];
	}

	if($_POST['busca'] != ''){

		$sql .= " AND (UCASE(artista) LIKE UCASE('%" . $_POST['busca'] . "%') 
				OR UCASE(ao.nomeObra) LIKE UCASE('%" . $_POST['busca'] . "%')
				OR UCASE(p.nomeProduto) LIKE UCASE('%" . $_POST['busca'] . "%'))";
	}

	$sql .= " ORDER BY l.loja, artista, obraProduto";

	$Tb = ConsultaSQL($sql, $ArqT);

	if(mysqli_num_rows($Tb) <= 0){
		echo '0';
	}else{

		while($linha =mysqli_fetch_assoc($Tb)){

			$valorBase = $linha['precoBase'];
			$indiceAte1MSemEstrela = $linha['indiceAte1MSemEstrela'];
		    $indiceAte1MComEstrela = $linha['indiceAte1MComEstrela'];
		    $indiceAcima1MSemEstrela = $linha['indiceAcima1MSemEstrela'];
		    $indiceAcima1MComEstrela = $linha['indiceAcima1MComEstrela'];
			$altura = $linha['altura'];
			$largura = $linha['largura'];
			$estrelas = $linha['estrelas'];

			if($linha['tipoProduto'] == 'PhotoArts'){

				//ACIMA DE 1 M²
		        if(($altura * $largura) > 10000){
		            if($estrelas < 1){
		                $indice = $indiceAcima1MSemEstrela;
		            }
		            else{
		                //CALCULAR O REAUSTE DO INDICE
		                if($estrelas > 1){
		                    $indice = $indiceAcima1MComEstrela + (($estrelas-1)*150);
		                }
		                else{
		                    $indice = $indiceAcima1MComEstrela;
		                }
		            }
		        }        
		        //ATÉ 1 M²
		        else{            
		            if($estrelas < 1){
		                $indice = $indiceAte1MSemEstrela;
		            }
		            else{
		                //CALCULAR O REAJUSTE DO INDICE
		                if($estrelas > 1){
		                    $indice = $indiceAte1MComEstrela + (($estrelas-1)*150);
		                }
		                else{
		                    $indice = $indiceAte1MComEstrela;
		                }
		            }
		        }

		        $valor = round((($altura * $largura)/10000) * $indice, 2);
			}else if($linha['tipoProduto'] == 'InstaArts'){

				$valor = round(((0.000000006 * (pow($altura*$largura, 2))) - (0.00012*($altura*$largura)) + 1.6)*(($valorBase*$altura*$largura)/10000), 2);
			}else{

				$valor = $linha['valor'];
			}

			$json[] = array(
				'idEstoqueProduto' => $linha['idEstoqueProduto'],
				'loja' => $linha['loja'],
				'artista' => $linha['artista'],
				'obraProduto' => $linha['obraProduto'],
				'tamanho' => $linha['tamanho'],
				'acabamento' => $linha['acabamento'],
				'valor' => FormatMoeda($valor),
				'qtd' => FormatMoeda($linha['qtd']),
				'imagem' => $linha['imagem'],
				'tipoProduto' => $linha['tipoProduto']
			);
		}

		echo json_encode($json);
	}

	mysqli_close($ArqT);
}