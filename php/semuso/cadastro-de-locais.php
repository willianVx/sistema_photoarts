<?php
include('photoarts.php');

if (isset($_POST['action'])) {
    
    switch ($_POST['action']) {
        case 'Mostrar':
            Mostrar();
            break;
        
        case 'Editar':
            Editar();
            break;
        
        case 'Gravar':
            Gravar();
            break;
        
    }
}

function Mostrar() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT l.idEventoLocal, l.nomeLocal, l.cep, l.ativo, l.endereco, l.numero, l.complemento, l.bairro, 
            l.cidade, l.estado, l.email, l.telefone, 
            (SELECT COUNT(*) FROM orcamentos_locais WHERE idLocal = l.idEventoLocal) AS qtdPropostas,     
            '0' AS qtdOS FROM locais AS l";

    if ($_POST['nome'] !== '') {
        $sql .= " WHERE l.nomeLocal LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= " ORDER BY l.ativo DESC, l.nomeLocal ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['idEventoLocal'],
            'nomeLocal' => $linha['nomeLocal'], 
            'endereco' => 
                ($linha['endereco'] == '' ? '' : $linha['endereco']) . 
                ($linha['numero'] == '0' ? '' : ', ' . $linha['numero']) .   
                ($linha['complemento'] == '' ? '' : ', ' . $linha['complemento']) . 
                ($linha['bairro'] == '' ? '' : ' - ' . $linha['bairro'] . ' - ') .
                ($linha['cidade'] == '' ? '' : $linha['cidade'] . ' - ' ) .
                ($linha['estado'] == '' ? '' : $linha['estado'] . ' - ' ) .
                ($linha['cep'] == '' ? '' : $linha['cep']),
            'telefone' => $linha['telefone'],
            'email' => $linha['email'],
            'qtdPropostas' => $linha['qtdPropostas'],
            'qtdOS' => $linha['qtdOS'], 
            'ativo' => $linha['ativo']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function Editar() {
    
    $ArqT = AbreBancoFocoVideo();
    
    $sql = "SELECT idEventoLocal, nomeLocal, cep, ativo, endereco, numero, complemento, bairro, 
            cidade, estado, email, telefone, site, dataCadastro FROM locais WHERE idEventoLocal=" . $_POST['codigo'];
    
    $Tb = ConsultaSQL($sql, $ArqT);
    
    if(!$Tb) {   
        echo '0';
        mysqli_close($ArqT);
        return;
    }
    
    $linha = mysqli_fetch_assoc($Tb);
    
    $json = array(
        'codigo' => $linha['idEventoLocal'],
        'nomeLocal' => $linha['nomeLocal'], 
        'ativo' => $linha['ativo'],
        'cep' => $linha['cep'],
        'endereco' => $linha['endereco'],
        'bairro' => $linha['bairro'],
        'cidade' => $linha['cidade'],
        'estado' => $linha['estado'],
        'numero' => $linha['numero'],
        'complemento' => $linha['complemento'],
        'telefone' => $linha['telefone'],
        'email' => $linha['email'],
        'site' => $linha['site'],
        'data' => FormatData($linha['dataCadastro'],false)
    );
    
    echo json_encode($json);
    mysqli_close($ArqT);
}

function Gravar() {
    
    inicia_sessao();
    
    $ArqT = AbreBancoFocoVideo();
    
    $sql = "SELECT * FROM locais WHERE nomeLocal = '" . TextoSSql($ArqT, $_POST['nomeLocal']) . "' AND idEventoLocal <> " . $_POST['codigo'];
    
    $Tb = ConsultaSQL($sql, $ArqT);
    
    if(mysqli_num_rows($Tb) > 0) {
        echo '-1';
        mysqli_close($ArqT);
        return;
    }
    
    $sql = " locais SET nomeLocal=UCASE('" . TextoSSql($ArqT, $_POST['nomeLocal']) . "'), cep='" . $_POST['cep'] . "', 
        ativo=" . $_POST['ativo'] . ", endereco=UCASE('" . TextoSSql($ArqT, $_POST['endereco']) . "'), 
        numero='" . $_POST['numero'] . "', complemento=UCASE('" . TextoSSql($ArqT, $_POST['complemento']) . "'), 
        bairro=UCASE('" . TextoSSql($ArqT, $_POST['bairro']) . "'), 
        cidade=UCASE('" . TextoSSql($ArqT, $_POST['cidade']) . "'), estado=UCASE('" . $_POST['estado'] . "'), 
        email=LCASE('" . TextoSSql($ArqT, $_POST['email']) . "'), telefone='" . $_POST['telefone'] . "', 
        site=LCASE('" . TextoSSql($ArqT, $_POST['site']) . "'), dataAtualizacao=NOW(), idUsuarioAtualizacao=" . $_SESSION['foco_codigo'];
    
    if($_POST['codigo'] > 0){
        $sql = "UPDATE " . $sql . " WHERE idEventoLocal=" . $_POST['codigo'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro=NOW(), idUsuarioCadastro=" . $_SESSION['foco_codigo'];
    }
    
    mysqli_query($ArqT, $sql);
    
    if(mysqli_affected_rows($ArqT) <= 0) {
        echo '0';
        mysqli_close($ArqT);
        return;
    } else {
        echo '1';
        mysqli_close($ArqT);
    }
}