<?php

require_once 'photoarts.php';

$path = 'acervo-zoltan.csv';

$fp = fopen($path, 'r');

/* while ($data = fgetcsv($fp, 0, ';')) {
  $num = count($data);
  echo "<p> $num campos na linha $row: <br /></p>\n";
  $row++;
  for ($c = 0; $c < $num; $c++) {
  echo $data[$c] . "<br />\n";
  }
  }

  return; */

$db = ConectaDB();

while ($data = fgetcsv($fp, 0, ';')) {
    $num = count($data);
    $row++;

    //for ($c = 0; $c < $num; $c++) {
    //BUSCA O ID DO ARTISTA
    if(trim(strtolower($data[0])) == ''){        
        continue;
    }
    
    $sql = "SELECT idArtista FROM artistas WHERE LCASE(artista) = '" . trim(strtolower($data[0])) . "'";

    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $sql = "SELECT idArtista FROM artistas WHERE LCASE(artista) LIKE '%" . substr(trim(strtolower($data[0]), 0, 14)) . "%'";

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
            echo '[Alerta] ' . $row . ' - Artista ' . $data[0] . ' nao encontrado<br />';
            continue;
        }
    }
    $result = $db->fetch();
    $idArtista = $result['idArtista'];       

    //BUSCA O ID DA OBRA DO ARTISTA
    $sql = "SELECT idArtistaObra "
            . "FROM artistas_obras "
            . "WHERE idArtista=" . $idArtista . " "
            . "AND LCASE(nomeObra) = LCASE('" . trim(strtolower( $db->escapesql($data[1]))) . "') ";
        
    $db->query( $sql );

    if ( $db->n_rows <= 0) {
        $result = $db->fetch();
        $idObra = $result['idArtistaObra'];

        //BUSCA O ID DO TAMANHO DA OBRA DO ARTISTA            

        $al = explode("x", $data[3]);

        $sql = "SELECT idArtistaObraTamanho "
                . "FROM artistas_obras_tamanhos "
                . "WHERE idArtista=" . $idArtista . " "
                . "AND idObra =" . $idObra . " "
                . "AND altura =" . intval($al[0]) . " "
                . "AND largura =" . intval($al[1]) . " ";

        $db->query( $sql );

        if ( $db->n_rows > 0) {
            $result = $db->fetch();
            $idObraTamanho = $result['idArtistaObraTamanho'];

            //INCREMENTA A QUANTIDADE VENDIDA
            $sql = "UPDATE artistas_obras_tamanhos "
                    . "SET tiragemAtual=tiragemAtual+1 WHERE idArtistaObraTamanho=" . $idObraTamanho;

            $db->query( $sql );

            if ( $db->n_rows > 0) {
                echo 'Obra ' . $data[1] . ' do artista ' . $data[0] . ' atualizada! <br />';
            } else {
                echo '[Erro] ao atualizar a obra ' . $data[1] . ' do artista ' . $data[0] . ' <br />';
            }

            flush();
        }
        else{
            //INVERTE A ALTURA E LARGURA AFIM DE LOCALIZAR
            $sql = "SELECT idArtistaObraTamanho "
                . "FROM artistas_obras_tamanhos "
                . "WHERE idArtista=" . $idArtista . " "
                . "AND idObra =" . $idObra . " "
                . "AND altura =" . intval($al[1]) . " "
                . "AND largura =" . intval($al[0]) . " ";

            $db->query( $sql );

            if ( $db->n_rows > 0) {
                $result = $db->fetch();
                $idObraTamanho = $result['idArtistaObraTamanho'];

                //INCREMENTA A QUANTIDADE VENDIDA
                $sql = "UPDATE artistas_obras_tamanhos "
                        . "SET tiragemAtual=tiragemAtual+1 WHERE idArtistaObraTamanho=" . $idObraTamanho;

                $db->query( $sql );

                if ( $db->n_rows > 0) {
                    echo 'Obra "' . $data[1] . '" do artista "' . $data[0] . '" atualizada! <br />';
                } else {
                    echo '[Erro] ao atualizar a obra "' . $data[1] . '" do artista "' . $data[0] . '" <br />';
                }

                flush();
            }
            else{
                echo '[Alerta] Tamanho "' . $data[3] . '" da Obra "' . $data[1] . '" do artista ' . $data[0] . ' nao localizada <br />';
            }
        }
        //}
    }
    else{
        echo '[Alerta] Obra ' . trim(strtolower($data[1])) . ' do artista ' . $data[0] . ' nao localizada <br />';
        Erros($sql);
    }
    
}

fclose($fp);
