<?php

include('foco.php');

if (isset($_POST['action'])) {
    
    switch ($_POST['action']) {
        case 'Mostra':
            Mostra();
            break;

        case 'Gravar':
            Gravar();
            break;
        
        case 'ExcluirEvento':
            ExcluirEvento();
            break;
    }
}

function Mostra() {

    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT e.idEvento AS codigo, e.nomeEvento, e.ativo, 
            (SELECT COUNT(*) FROM orcamentos WHERE idEvento = e.idEvento) AS qtdPropostas,     
            '0' AS qtdOS FROM eventos AS e
                WHERE e.del = 0";

    if ($_POST['nome'] !== '') {
        $sql .= " AND e.nomeEvento LIKE '%" . $_POST['nome'] . "%'";
    }

    $sql .= " ORDER BY e.ativo DESC, e.nomeEvento ";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (!$Tb) {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    while ($linha = mysqli_fetch_assoc($Tb)) {

        $json[] = array(
            'codigo' => $linha['codigo'],
            'nome' => $linha['nomeEvento'],
            'qtdPropostas' => $linha['qtdPropostas'],
            'qtdOS' => $linha['qtdOS'], 
            'ativo' => $linha['ativo']
        );
    }

    echo json_encode($json);
    mysqli_close($ArqT);
}

function Gravar() {
    
    inicia_sessao();
    
    $ArqT = AbreBancoFocoVideo();

    $sql = "SELECT * FROM eventos WHERE nomeEvento = '" . TextoSSql($ArqT, $_POST['nome']) . "' AND idEvento <> " . $_POST['codigo'];

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_num_rows($Tb) > 0) {
        echo '2';
        mysqli_close($ArqT);
        return;
    }
    
    $sql = "eventos SET nomeEvento = UCASE('" . TextoSSql($ArqT, $_POST['nome']) . "') , ativo = " . $_POST['ativo'] . ", 
            dataAtualizacao = NOW(), idUsuarioAtualizacao = " . $_SESSION['foco_codigo'];

    if ($_POST['codigo'] <= 0) {

        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['foco_codigo'];
    } else {

        $sql = "UPDATE " . $sql . " WHERE idEvento = " . $_POST['codigo'];
    }

    mysqli_query($ArqT, $sql);

    if (mysqli_affected_rows($ArqT) > 0) {
        echo '-1';
        mysqli_close($ArqT);
        return;
    } else {
        echo '0';
        mysqli_close($ArqT);
    }
}

function ExcluirEvento() {
    
    inicia_sessao();
    
    $ArqT = AbreBancoFocoVideo();
    
    $sql = "UPDATE eventos SET del = 1, dataDel = NOW(), idUsuarioDel = " . $_SESSION['foco_codigo'] . "
            WHERE idEvento = " . $_POST['codigo'];
    
    mysqli_query($ArqT, $sql);
    
    if(mysqli_affected_rows($ArqT) <= 0){
        echo '0';
        mysqli_close($ArqT);
        return;
    } else {
        echo '1';
        mysqli_close($ArqT);
    }
}

?>