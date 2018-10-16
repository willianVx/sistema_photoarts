<?php

//echo file_exists('../imagens/obras/cervidae.jpg') . '<br />';
//echo validarext("http://www.photoarts.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/g/o/gotham_city_i_60x90.jpg");
//echo url_exists("http://www.photoarts.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/g/o/gotham_city_i_60x90.jpg");
//return;
/* $ch = curl_init();
  $timeout = 0;
  curl_setopt($ch, CURLOPT_URL, 'http://www.photoarts.com.br/fotografos/brasil/adriano-gambarini.html?limit=25&mode=list');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
  $conteudo = curl_exec($ch);
  curl_close($ch);

  echo $conteudo; */


/* $a = file_get_contents('http://www.photoarts.com.br/fotografos/brasil/adriano-gambarini.html?limit=25&mode=list');
  echo $a; */

$dom = new DOMDocument();

$dom->loadHTMLFile('http://www.photoarts.com.br');

$divs = $dom->getElementsByTagName('div');

foreach ($divs as $div) {
    if ($div->getAttribute('class') == 'mega-mobile-container') {
        $divs2 = $div->getElementsByTagName('div');

        foreach ($divs2 as $div2) {
            if ($div2->getAttribute('id') == 'cssmenu') {
                //Consultando os links
                echo 'LINKS DOS ARTISTAS<br />';
                $links = $div2->getElementsByTagName('a');
                foreach ($links as $link) {
                    if (strpos($link->getAttribute('href') . PHP_EOL, 'fotografos') != false || strpos($link->getAttribute('href') . PHP_EOL, 'ilustradores') != false) {
                        $aux = explode('/', $link->getAttribute('href'));
                        if (count($aux) > 5) {
                            //PASSA LINK POR LINK PARA IMPORAR 
                            if (VarrerObras($link->getAttribute('href') . '?limit=25&mode=list&p=1', 1)) {
                                //VARRE A PÁGINA 2
                                if (VarrerObras($link->getAttribute('href') . '?limit=25&mode=list&p=2', 2)) {
                                    VarrerObras($link->getAttribute('href') . '?limit=25&mode=list&p=3', 3);
                                }
                            }

                            echo '<br /><br /><br />';
                        }
                    }
                }
            }
        }
    }
}

function VarrerObras($url, $page) {
    require_once 'photoarts.php';
    inicia_sessao();

    $db = ConectaDB();
    set_time_limit(0);

    $dom2 = new DOMDocument();
    $dom2->loadHTMLFile($url);

    if ($page == 1) {
        echo $url . '<br />';
    }

    $divs3 = $dom2->getElementsByTagName('div');

    foreach ($divs3 as $div3) {
        if ($div3->getAttribute('class') == 'page-title') {
            if ($page == 1) {
                echo 'NOME DO ARTISTA: ' . utf8_decode($div3->nodeValue) . '<br />';

                if (is_resource($connection) && get_resource_type($connection) === 'mysqli link') {
                    //esta conectado.
                } else {
                    //não está conectado, reconecta
                    $ArqT = AbreBancoPhotoarts();
                }
                $inserir = true;
                $sql = "INSERT INTO artistas SET dataCadastro=Now(), idUsuarioCadastro=1, "
                        . "artista ='" . $db->escapesql( trim($div3->nodeValue)) . "' ";
            }
        }

        if ($div3->getAttribute('class') == 'category-description std') {
            if ($page == 1) {
                echo utf8_decode('DESCRIÇÃO ARTISTA: ' . $div3->nodeValue) . '<br /><hr><hr>';
            }

            $sql .= ", obs ='" . $db->escapesql( trim($div3->nodeValue)) . "' ";
        }

        if ($page == 1) {
            if ($inserir) {
                $db->query( $sql );

                if ( $db->n_rows <= 0) {
                    echo 'ERRO AO INSERIR O ARTISTA';
                    exit;
                } else {
                    $idArtista = UltimoRegistroInserido($db);
                    $_SESSION['idArtista'] = $idArtista;
                    $inserir = false;
                }
            } else {
                $idArtista = $_SESSION['idArtista'];
            }
        } else {
            $idArtista = $_SESSION['idArtista'];
        }
    }
    //Consultando as div
    $divs3 = $dom2->getElementsByTagName('ul');

    foreach ($divs3 as $div3) {

        if ($div3->getAttribute('class') == 'products-list') {
            $lis = $div3->getElementsByTagName('li');
            if ($page == 1) {
                $cont = 1;
            } else if ($page == 2) {
                $cont = 26;
            } else {
                $cont = 51;
            }
            foreach ($lis as $li) {
                if (substr($li->getAttribute('class'), 0, 4) == 'item') {
                    $links = $li->getElementsByTagName('a');

                    foreach ($links as $link) {
                        if ($link->getAttribute('class') == 'product-image') {
                            echo 'ITEM: ' . $cont . '<br />';
                            $cont++;
                            echo 'NOME OBRA: ' . utf8_decode($link->getAttribute('title')) . '<br />';
                            echo 'LINK SITE: ' . $link->getAttribute('href') . PHP_EOL . '<br />';

                            if (is_resource($connection) && get_resource_type($connection) === 'mysql link') {
                                //esta conectado.
                            } else {
                                //não está conectado, reconecta
                                $db = ConectaDB();
                            }

                            $sql = "INSERT INTO artistas_obras SET dataCadastro=Now(), idUsuarioCadastro=1, "
                                    . "idArtista=" . $idArtista . ", "
                                    . "nomeObra ='" . $db->escapesql($link->getAttribute('title')) . "', "
                                    . "linkSite ='" . $link->getAttribute('href') . "' ";
                        }
                    }

                    $imgs = $li->getElementsByTagName('img');
                    foreach ($imgs as $img) {
                        echo 'IMAGEM: ' . $img->getAttribute('src') . PHP_EOL . '<br />';

                        $sql .= ", imagemSite ='" . $img->getAttribute('src') . "' ";

                        $imm = explode('/', $img->getAttribute('src'));
                        $nomeJPG = $imm[count($imm) - 1];


                        if (!file_exists("../imagens/obras/" . $nomeJPG)) {
                            if (url_exists(str_replace("small_image/540x720", "image", $img->getAttribute('src')))) {
                                if (!copy(str_replace("small_image/540x720", "image", $img->getAttribute('src')), '../imagens/obras/' . $nomeJPG)) {
                                    echo 'ERRO AO COPIAR A IMAGEM FULL';                                    
                                } else {
                                    GerarMiniaturaObra($nomeJPG);
                                    $sql .= ", imagem ='" . $nomeJPG . "' ";
                                }
                            } else {
                                if (url_exists($img->getAttribute('src'))) {
                                    if (!copy($img->getAttribute('src'), '../imagens/obras/' . $nomeJPG)) {
                                        echo 'ERRO AO COPIAR A IMAGEM SMALL';                                        
                                    } else {
                                        GerarMiniaturaObra($nomeJPG);
                                        $sql .= ", imagem ='" . $nomeJPG . "' ";
                                    }
                                }
                            }
                        } else {
                            $sql .= ", imagem ='" . $nomeJPG . "' ";
                        }
                    }

                    $diivs = $li->getElementsByTagName('div');
                    foreach ($diivs as $diiv) {
                        if ($diiv->getAttribute('class') == 'desc std') {
                            $aux = explode('Disponível nos tamanhos:', $diiv->nodeValue);
                            echo utf8_decode('DESCRIÇÃO OBRA: ' . $aux[0]) . '<br />';

                            $sql .= ", descricao ='" . $db->escapesql( trim($aux[0])) . "' ";
                            $db->query( $sql );

                            if ( $db->n_rows <= 0) {
                                echo 'ERRO AO INSERIR OBRAS DO ARTISTA';
                                echo '<br />' . $sql;
                                exit;
                            } else {
                                $idArtistaObra = UltimoRegistroInserido($db);
                            }

                            $aux2 = explode('Acabamento:', $aux[1]);
                            echo utf8_decode('TAMANHOS: ' /* . $aux2[0] */) . '<br />';

                            //FAZER EXPLODE NOS TAMANHOS
                            //E INCLUIR - CEZAR - 29/07
                            $aux2[0] = str_replace(' e ', ', ', $aux2[0]);
                            $tam = explode(',', $aux2[0]);
                            foreach ($tam as $t) {

                                $auxT = explode('(', $t);

                                $nomeTamanho = trim($auxT[0]);
                                $auxT[1] = trim(str_replace('cm)', '', $auxT[1]));

                                $auxM = explode('x', $auxT[1]);
                                $altura = strval(intval(str_replace('o', '0', $auxM[0])));
                                $largura = strval(intval(str_replace('o', '0', $auxM[1])));

                                if (is_resource($connection) && get_resource_type($connection) === 'mysqli link') {
                                    //esta conectado.
                                } else {
                                    //não está conectado, reconecta
                                    $db = ConectaDB();
                                }

                                $codTamanho = getCodigoTamanho($db, $nomeTamanho, $altura, $largura);

                                $sql = "INSERT INTO artistas_obras_tamanhos SET dataCadastro=Now(), idUsuarioCadastro=1, "
                                        . "ativo=1, idObra =" . $idArtistaObra . ", "
                                        . "idTamanho =" . $codTamanho . ", "
                                        . "idArtista =" . $idArtista . ", "
                                        . "altura =" . $altura . ", "
                                        . "largura =" . $largura . ", "
                                        . "tiragemMaxima =" . (strtolower(substr($nomeTamanho, 0, 4)) == 'cole' || strtolower(substr($nomeTamanho, 0, 4)) == 'extr' ? '50' : '100');

                                $db->query( $sql );

                                if ( $db->n_rows <= 0) {
                                    'ERRO AO INSERIR O TAMANHO DA OBRA DO ARTISTA';
                                    exit;
                                }

                                echo utf8_decode($t) . ' - OK<br />';
                            }

                            //ACAMENTOS NÃO SERÃO UTILIZADOS
                            //echo htmlentities('ACABAMENTOS: ' . $aux2[1]) . '<br />';
                        }
                    }

                    echo '<hr>';
                    flush();
                }
            }
        }
    }

    $db->close();
    if ($page == 1 && $cont >= 25) {
        return true;
    } else if ($page == 2 && $cont >= 50) {
        return true;
    } else {
        return false;
    }
}

function getCodigoTamanho($ArqT, $nomeTamanho, $altura, $largura) {
    $sql = "SELECT idTamanho FROM tamanhos WHERE UCASE(nomeTamanho) ='" . strtoupper($nomeTamanho) . "' "
            . "AND altura =" . $altura . " "
            . "AND largura =" . $largura;

        $db->query( $sql );

        if ( $db->n_rows <= 0) {
        $sql = "INSERT INTO tamanhos SET dataCadastro=Now(), idUsuarioCadastro=1, "
                . "nomeTamanho =UCASE('" . trim(strtoupper($nomeTamanho)) . "'), "
                . "altura =" . $altura . ", "
                . "largura =" . $largura;

        $db->query( $sql );

        if ( $db->n_rows > 0) {
            return UltimoRegistroInserido($db);
        } else {
            echo 'ERRO AO INSERIR O TAMANHO SQL: ' . $largura;
            exit;
        }
    } else {
        $linha = $db->fetch($Tb);
        return $linha['idTamanho'];
    }
}

/* $divs = $dom->getElementsByTagName('div');

  foreach ($divs as $div) {
  if ($div->getAttribute('class') == 'page-title') {
  echo 'NOME DO ARTISTA: ' . htmlentities($div->nodeValue) . '<br />';
  }

  if ($div->getAttribute('class') == 'category-description std') {
  echo htmlentities('DESCRIÇÃO ARTISTA: ' . $div->nodeValue) . '<br /><hr><hr>';
  }
  }
  //Consultando as div
  $divs = $dom->getElementsByTagName('ul');

  foreach ($divs as $div) {

  if ($div->getAttribute('class') == 'products-list') {
  $lis = $div->getElementsByTagName('li');
  foreach ($lis as $li) {
  if (substr($li->getAttribute('class'), 0, 4) == 'item') {
  $links = $li->getElementsByTagName('a');
  foreach ($links as $link) {
  if ($link->getAttribute('class') == 'product-image') {
  echo 'NOME OBRA: ' . htmlentities($link->getAttribute('title')) . '<br />';
  echo 'LINK SITE: ' . $link->getAttribute('href') . PHP_EOL . '<br />';
  }
  }

  $imgs = $li->getElementsByTagName('img');
  foreach ($imgs as $img) {
  echo 'IMAGEM: ' . $img->getAttribute('src') . PHP_EOL . '<br />';
  }

  $diivs = $li->getElementsByTagName('div');
  foreach ($diivs as $diiv) {
  if ($diiv->getAttribute('class') == 'desc std') {
  $aux = explode('Disponível nos tamanhos:', $diiv->nodeValue);
  echo htmlentities('DESCRIÇÃO OBRA: ' . $aux[0]) . '<br />';

  $aux2 = explode('Acabamento:', $aux[1]);
  echo htmlentities('TAMANHOS: ' . $aux2[0]) . '<br />';
  //echo htmlentities('ACABAMENTOS: ' . $aux2[1]) . '<br />';
  }
  }

  echo '<hr>';
  }
  }
  }
  } */

function GerarMiniaturaObra($nomeImg) {

    Redimensionar("../imagens/obras/" . $nomeImg, 175, 125, "mini_", 80);
    if (file_exists("../imagens/obras/" . $nomeImg)) {

        $json = array(
            'foto' => "imagens/obras/mini_" . $nomeImg
        );

        echo json_encode($json);

        Redimensionar("../imagens/obras/" . $nomeImg, 64, 64, "mini_64_", 80);
    } else {
        echo "0";
    }
}

function url_exists($url) {

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($code == 200); // verifica se recebe "status OK"
}
function validarext($url)
{
    $validar = get_headers($url);
    $validar = explode(" ",$validar[0]);
    $validar = $validar[1];
    if($validar == "302" || $validar == "200")
        return true;
    else
        return false;
}
