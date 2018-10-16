<?php

include('photoarts.php');

if (isset($_POST['action'])) {
    switch ($_POST['action']) {

        case 'MostraPacoteComposicao':
            MostraPacoteComposicao();
            break;

        case 'GravarFollowUp':
            GravarFollowUp();
            break;

        case 'MostrarFollowUp':
            MostrarFollowUp();
            break;

        case 'getFollowUp':
            getFollowUp();
            break;

        case 'ExcluirFollowUp':
            ExcluirFollowUp();
            break;

        case 'CancelarCotacao':
            CancelarCotacao();
            break;

        case 'VerificaDisponibilidadeDaData':
            VerificaDisponibilidadeDaData();
            break;

        case 'VerificaReservasExistentes':
            VerificaReservasExistentes();
            break;

        case 'BuscaPeloId':
            BuscaPeloId();
            break;

        case 'lista':
            Lista();
            break;

        case 'GravaNoBanco':
            GravaNoBanco();
            break;

        case 'AtualizaNoBanco':
            AtualizaNoBanco();
            break;

        case 'BuscaClientePeloId':
            BuscaClientePeloId();
            break;

        case 'getPeriodoDeValidade':
            getPeriodoDeValidade();
            break;

        case 'CancelaPeloId':
            CancelaPeloId();
            break;

        case 'getPrioridadeDaReserva':
            getPrioridadeDaReserva();
            break;

        /*case 'validaHorario':
            validaHorario();
            break; */
        
        case 'dataValida':
            dataValida();
            break;
    }
}

function BuscaPeloId() {

    $db = ConectaDB();

    $reserva = $_POST['reserva'];

    $sql = "SELECT co.idCotacao AS id, co.idCliente AS cliente, co.contatoCliente AS contatos, co.emailCliente AS email, 
            DATE_ADD(DATE(co.dataCadastro), INTERVAL 7 DAY) AS dataValidade, co.idContrato AS idContrato, co.cancelada AS cancelada,
            IF(DATE(NOW()) < DATE_ADD(co.dataCadastro, INTERVAL 7 DAY) , 0, 1) AS vencida,
            co.idLocal AS `local`, co.dataFesta AS dataFesta, LEFT(co.horaDe, 5) AS horarioDe, LEFT(co.horaAte, 5) AS horarioAte, co.obs AS obs
            FROM cotacoes AS co WHERE idCotacao = " . $reserva;

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{

        $json = $db->fetch();
        $json['dataFesta'] = FormatData($json['dataFesta']);
        $json['dataValidade'] = FormatData($json['dataValidade']);

        if ($json['cancelada'] == '1') {
            $json['situacao'] = 'Cancelada';
        } else if ($json['idContrato'] == '0') {

            $json['vencida'] == '1' ? $json['situacao'] = 'Vencida' : $json['situacao'] = 'Aberta';
        } else {
            $json['situacao'] = 'Contrato Gerado';
        };

        echo json_encode($json);
    }
    $db->close();
}

function Lista() {

    $db = ConectaDB();

    $busca = $_POST['busca'];

    $sql = "SELECT co.idCotacao AS id, co.dataCadastro, LPAD(co.idCotacao,5,0) AS codigo, cl.razaoSocial AS cliente, co.contatoCliente AS contatos, co.emailCliente AS email, 
                DATE_ADD(DATE(co.dataCadastro), INTERVAL 7 DAY) AS dataValidade, co.cancelada AS cancelada,
                IF(DATE(NOW()) > DATE_ADD(co.dataCadastro, INTERVAL 7 DAY) AND co.idContrato = 0 AND co.cancelada = 0, 1, 0) AS vencida, co.idContrato AS idContrato,
                co.idLocal AS `local`, co.dataFesta AS dataFesta, LEFT(co.horaDe, 5) AS horarioDe, LEFT(co.horaAte, 5) AS horarioAte, co.obs AS obs
                FROM cotacoes AS co 
                INNER JOIN clientes AS cl ON cl.idCliente = co.idCliente 
                WHERE TRUE";

    if ($_POST['situacao'] === '1') {
        $sql .= " AND co.idContrato <= 0 AND co.cancelada = 0 AND DATE(NOW()) < DATE_ADD(co.dataCadastro, INTERVAL 7 DAY) ";
    } else if ($_POST[situacao] === '2') {
        $sql .= " AND co.idContrato > 0 AND co.cancelada = 0 ";
    } else if ($_POST[situacao] === '4') {
        $sql .= " AND co.cancelada = 1 ";
    } else if ($_POST[situacao] === '3') {
        $sql .= " AND co.idContrato = 0 AND co.cancelada = 0 AND DATE(NOW()) > DATE_ADD(co.dataCadastro, INTERVAL 7 DAY) ";
    }

    if ($_PSOT['busca'] !== '') {

        $sql .= " AND ( cl.razaoSocial LIKE '%$_POST[busca]%' 
                OR co.emailCliente LIKe '%$_POST[busca]%' ";

        if (isDate(DataSSql($_POST['busca']))) {
            $sql .= " OR co.dataFesta = '" . DataSSql($_POST['busca']) . "' ";
        }

        if (strlen($_POST['busca']) < 10) {
            $sql .= " OR co.idCotacao = '$_POST[busca]'  ";
        }

        $sql .= ' )';
    }

    $sql .= " ORDER BY co.idCotacao DESC LIMIT 50";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            if ($linha['cancelada'] == '1') {
                $linha['situacao'] = 'Cancelada';
            } else if ($linha['idContrato'] == '0') {
                $linha['vencida'] == '1' ? $linha['situacao'] = 'Vencida' : $linha['situacao'] = 'Aberta';
            } else {
                $linha['situacao'] = 'Contrato Gerado';
            };

            $json[] = array(
                'id' => $linha['id'],
                'codigo' => $linha['codigo'],
                'cliente' => $linha['cliente'],
                'contatos' => $linha['contatos'],
                'email' => $linha['email'],
                'local' => $linha['local'],
                'horarioDe' => $linha['horarioDe'],
                'horarioAte' => $linha['horarioAte'],
                'dataFesta' => FormatData($linha['dataFesta']),
                'situacao' => $linha['situacao'],
                'dataValidade' => FormatData($linha['dataValidade']),
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'obs' => $linha['obs']
            );
        }

        echo json_encode($json);
    }
    mysqli_close($ArqT);
}

function GravaNoBanco() {

    $db = ConectaDB();

    $reserva = json_decode($_POST[reserva], true);

    $reserva[dataFesta] = DataSSql($reserva[dataFesta], false);
    $reserva[obs] = $db->escapesql($reserva[obs]);

    $sql = "INSERT INTO cotacoes SET dataCadastro = NOW(), idCliente = $reserva[cliente] , contatoCliente = '$reserva[contatos]', 
            emailCliente = '$reserva[email]', idLocal = $reserva[local] , dataFesta = '$reserva[dataFesta]', 
            horaDe = '$reserva[horarioDe]', horaAte = '$reserva[horarioAte]', obs = '$reserva[obs]'";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        $reserva[id] = UltimoRegistroInserido($db);
        echo json_encode($reserva);
    }

    $db->close();
}

function AtualizaNoBanco() {
    $db = ConectaDB();

    $reserva = json_decode($_POST[reserva], true);

    $reserva[dataFesta] = DataSSql($reserva[dataFesta], false);
    $reserva[obs] = $db->escapesql($reserva[obs]);

    $sql = "UPDATE cotacoes SET idCliente = $reserva[cliente] , contatoCliente = '$reserva[contatos]', 
            emailCliente = '$reserva[email]', idLocal = $reserva[local] , dataFesta = '$reserva[dataFesta]', 
            horaDe = '$reserva[horarioDe]', horaAte = '$reserva[horarioAte]', obs = '$reserva[obs]' WHERE idCotacao = $reserva[id]";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo json_encode($reserva);
    }
    $db->close();
}

function getPrioridadeDaReserva() {

    $db = ConectaDB();

    $reserva = json_decode($_POST['reserva'], true);


    $sql = "SELECT COUNT(*) AS reservasNaFrente FROM cotacoes 
            WHERE  idLocal = " . $reserva['local'] . " AND dataFesta = '" . ($reserva['dataFesta']) . "' 
            AND (horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "' 
            OR horaAte BETWEEN '" . $reserva['horarioDe'] . "' AND TIME(TIME('" . $reserva['horarioAte'] . "') + TIME('01:00'))) 
            AND  idCotacao < " . $reserva[id] . " AND cancelada = 0";

    $db->query( $sql );

    $json = $db->fetch();

    echo $json['reservasNaFrente'];
    $db->close();
}

function GravarFollowUp() {

    $followup = json_decode($_POST[followup], true);
    $followup['dataRetorno'] = DataSSql($followup['dataRetorno'], true);

    inicia_sessao();

    $db = ConectaDB();

    $sql = "contatos SET
            idCotacao = " . $followup['idCotacao'] . ",
            idContatoTipo = " . $followup['tipoContato'] . ",
            obs = UCASE('" . $db->escapesql($followup['obs']) . "'),
            dataRetorno = '" . $followup['dataRetorno'] . "'";

    if ($followup['id'] > 0) {
        $sql = "UPDATE " . $sql . ", dataAtualizacao = NOW(), 
                idUsuarioAtualizacao = " . $_SESSION['jujuba_codigo'] . " 
                WHERE idContato = " . $followup['id'];
    } else {
        $sql = "INSERT INTO " . $sql . ", dataCadastro = NOW(), idUsuarioCadastro = " . $_SESSION['jujuba_codigo'];
    }

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{

        if ($followup['id'] > 0) {
            $idFollowUp = $followup['id'];
        } else {
            $idFollowUp = UltimoRegistroInserido($db);
        }

        if ($followup['dataRetorno'] !== '') {
            GerarAvisoFollowUp($ArqT, $followup['obs'], $followup['dataRetorno'], ($followup['id'] > 0 ? $followup['idAviso'] : 0), $idFollowUp, 'cadastro-de-cotacoes.html?follow=true&c=' . $followup['idCotacao']);
        }

        echo $idFollowUp;
    }

    $db->close();
}

function BuscaClientePeloId() {

    $db = ConectaDB();
    $cliente = $_POST['cliente'];
    $sql = "SELECT telefone1, telefone2, telefone3, email, email2, email3 FROM clientes WHERE idCliente = " . $cliente;
    
    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{

        $linha = $db->fetch();

        $contatos = $linha['telefone1'];

        if ($linha['telefone2'] !== '') {

            $contatos .= " / " . $linha['telefone2'];
        }

        if ($linha['telefone3'] != '') {
            $contatos .= " / " . $linha['telefone3'];
        }

        $emails = $linha['email'];

        if ($linha['email2'] != '') {
            $emails .= ' / ' . $linha['email2'];
        }

        if ($linha['email3'] != '') {
            $emails .= ' / ' . $linha['email3'];
        }

        $json = array(
            'cliente' => $cliente,
            'contatos' => $contatos,
            'email' => $emails
        );

        echo json_encode($json);
    }

    $db->close();
}

function MostrarFollowUp() {

    $db = ConectaDB();

    $sql = "SELECT c.idContato, ct.tipoContato, LEFT(c.dataCadastro, 10) AS dataCadastro, c.obs, LEFT(c.dataRetorno, 10) AS dataRetorno,
            LEFT(RIGHT(c.dataRetorno, 8), 5) AS horaRetorno
           FROM contatos AS c
           INNER JOIN contatos_tipos AS ct ON ct.idContatoTipo = c.idContatoTipo
           WHERE c.idCotacao = " . $_POST['idCotacao'] . " AND c.del = 0 ORDER BY c.dataCadastro";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) { 

            if ($linha['dataRetorno'] === '0000-00-00') {
                $dataRetorno = '';
            } else {
                $dataRetorno = FormatData($linha['dataRetorno']) . " às " . $linha['horaRetorno'];
            }

            $json[] = array(
                'idContato' => $linha['idContato'],
                'tipoContato' => $linha['tipoContato'],
                'dataCadastro' => FormatData($linha['dataCadastro'], false),
                'obs' => $linha['obs'],
                'dataRetorno' => $dataRetorno
            );
        }

        echo json_encode($json);
    }
    $db->close();
}

function getFollowUp() {

    $db = ConectaDB();

    $sql = "SELECT idContatoTipo, obs, LEFT(dataRetorno, 16) AS dataRetorno, idAviso
            FROM contatos
            WHERE idContato = " . $_POST['idFollowUp'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{
        while ($linha = $db->fetch()) {

            $json = array(
                'tipoContato' => $linha['idContatoTipo'],
                'obs' => $linha['obs'],
                'dataRetorno' => FormatData($linha['dataRetorno'], true),
                'idAviso' => $linha['idAviso']
            );

            echo json_encode($json);
        }
    }

    $db->close();
}

function ExcluirFollowUp() {
    inicia_sessao();
    
    $db = ConectaDB();

    $sql = "UPDATE contatos SET
            del = 1, 
            dataDel = NOW(), 
            idUsuarioDel = " . $_SESSION['jujuba_codigo'] . "
            WHERE idContato = " . $_POST['idFollowUp'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    }else{

        $sql = "SELECT idAviso FROM contatos WHERE idContato = " . $_POST['idFollowUp'];
        
        $db->query( $sql );
        $result = $db->fetch();

        if ($result["idAviso"] > 0) {

            $sql = "UPDATE funcionarios_avisos SET
                    del = 1,
                    dataDel = NOW(),
                    idUsuarioDel = " . $_SESSION['jujuba_codigo'] . "
                    WHERE idFuncionarioAviso = " . $result["idAviso"];
            $db->query( $sql );
        }

        echo '1';
    }

    $db->close();
}

function CancelarCotacao() {

    inicia_sessao();
    $db = ConectaDB();

    $sql = "UPDATE cotacoes SET cancelada = 1, dataCancelada = NOW(), idUsuarioCancelada = " . $_SESSION['jujuba_codigo'] . "
            WHERE idCotacao = " . $_POST['idCotacao'];

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function CancelaPeloId() {
    inicia_sessao();
    $db = ConectaDB();

    $sql = "UPDATE cotacoes SET cancelada = 1, dataCancelada = NOW(), idUsuarioCancelada = " . $_SESSION['jujuba_codigo'] . " 
            WHERE idCotacao =  $_POST[id]";

    $db->query( $sql );
    
    if ( $db->n_rows <= 0 ) {
        echo '0';
    } else {
        echo '1';
    }

    $db->close();
}

function VerificaDisponibilidadeDaData() {

    $db = ConectaDB();

    $reserva = json_decode($_POST[reserva], true);
    
    $sql = "SELECT COUNT(*) AS contador 
            FROM cotacoes AS co
            INNER JOIN contratos AS c ON c.idContrato = co.idContrato
            WHERE co.idLocal = " . $reserva['local'] . " AND co.dataFesta = '" . DataSSql($reserva['dataFesta']) . "' 
            AND (co.horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "')
            AND co.cancelada = 0 AND co.idCotacao <> " . $reserva['id'] . " AND co.idContrato > 0 
            AND c.cancelado = 0";
    
    $db->query( $sql );   
    $result = $db->fetch();

    if($result['contador'] >= '1') {
        echo '1';
        $db->close();
        return;
    }
    
    $sql = "SELECT COUNT(*) AS contador 
            FROM cotacoes AS co 
            INNER JOIN contratos AS c ON c.idContrato = co.idContrato
            WHERE co.idLocal = " . $reserva['local'] . " AND co.dataFesta = '" . DataSSql($reserva['dataFesta']) . "' 
            AND (co.horaAte BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "')
            AND co.cancelada = 0 AND co.idCotacao <> " . $reserva['id'] . " co.AND idContrato > 0 AND c.cancelado = 0";
    
    $db->query( $sql );
    $result = $db->fetch();

    if($result['contador'] >= '1') {
        echo '1';
        $db->close();
        return;
    }
    
    $sql = "SELECT COUNT(*) AS contador
            FROM contratos 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . DataSSql($reserva['dataFesta']) . "' 
            AND
            (
                (
                    (horaDe BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $reserva['horarioDe'] . "')
                    OR (horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
                ) OR ( 
                    (horaAte BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $reserva['horarioDe'] . "')
                    OR (horaAte BETWEEN '" . $reserva['horarioDe'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioDe'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
		)
		OR (horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND '" .$reserva['horarioAte'] . "')
            )
            AND cancelado = 0 AND idContrato <> " . $reserva['idContrato'];
    
    $db->query( $sql );
    $result = $db->fetch();

    if($result['contador'] >= '1') {
        echo '2';
        $db->close();
        return;
    }
    
    $sql = "SELECT COUNT(*) AS contador
            FROM contratos 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . DataSSql($reserva['dataFesta']) . "' 
            AND
            (
		(
                    (horaAte BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $reserva['horarioAte'] . "')
                    OR (horaAte BETWEEN '" . $reserva['horarioAte'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
		) OR ( 
                    (horaDe BETWEEN TIME(DATE_SUB(DATE_SUB(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)) AND '" . $reserva['horarioAte'] . "')
                    OR (horaDe BETWEEN '" . $reserva['horarioAte'] . "' AND TIME(DATE_ADD(DATE_ADD(CONCAT('" . DataSSql($reserva['dataFesta']) . "', ' " . $reserva['horarioAte'] . "'), INTERVAL 1 HOUR), INTERVAL 59 MINUTE)))
		)
		OR (horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "')
            )
            AND cancelado = 0 AND idContrato <> " . $reserva['idContrato'];
    
    $db->query( $sql );
    $result = $db->fetch();

    if($result['contador'] >= '1') {
        echo '2';
        $db->close();
        return;
    }

    echo '0';
    $db->close();
    
    /*$sql = "SELECT COUNT(*) AS totalDiaTodo 
            FROM contratos 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . DataSSql($reserva['dataFesta']) . "' 
            AND horaDe >= '15:00:00' AND horaDe <= '16:00:00' AND horaAte <= '21:00:00'"
         . " AND (SELECT COUNT(*) FROM cotacoes WHERE idCotacao = ".$reserva['id']." AND idContrato > 0) <= 0 AND cancelado = 0";
    
    $Tb = ConsultaSQL($sql, $ArqT);
    
    if (mysqli_result($Tb, 0, "totalDiaTodo") >= '1') {
        echo '0';
        mysqli_close($ArqT);
        return;
    } 
        
    $sql = "SELECT getNovoPeriodo('" . $reserva['horarioDe'] . "', '" . $reserva['horarioAte'] . "') AS periodo";
    $Tb = ConsultaSQL($sql, $ArqT);
    

    if (mysqli_result($Tb, 0, "periodo") == '000') {
        echo '0';
        mysqli_close($ArqT);
        return;
    }

    $horaDePadrao1 = date("H:i", strtotime('18:00'));
    $horaAtePadrao1 = date("H:i", strtotime('23:00'));
    $horaDePadrao2 = date("H:i", strtotime('11:00'));
    $horaAtePadrao2 = date("H:i", strtotime('17:00'));

    $horaDe = date("H:i", strtotime($reserva['horarioDe']));
    $horaAte = date("H:i", strtotime($reserva['horarioAte']));

    $sql = "SELECT COUNT(*) AS total FROM contratos 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . DataSSql($reserva['dataFesta']) . "'";
    
    if ($horaDe >= $horaDePadrao1 && $horaAte <= $horaAtePadrao1) {
        $sql .= " AND (horaDe >= '18:00' AND horaAte <= '23:00')";
    } else if ($horaDe >= $horaDePadrao2 && $horaAte <= $horaAtePadrao2) {
        $sql .= " AND (horaDe >= '11:00' AND horaAte <= '17:00')";
    }
    
    $sql .= " AND cancelado = 0 AND idContrato <> " . $reserva['idContrato'];
    
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, "total") <= 0) {
        echo '1';
    } else {
        echo '0';
    }
    mysqli_close($ArqT);*/
}

function VerificaReservasExistentes() {
    $db = ConectaDB();

    $reserva = json_decode($_POST[reserva], true);
    
    $sql = "SELECT COUNT(*) AS total FROM cotacoes 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . ($reserva['dataFesta']) . "' 
            AND (horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "' 
            OR horaAte BETWEEN '" . $reserva['horarioDe'] . "' AND TIME(TIME('" . $reserva['horarioAte'] . "') + TIME('01:00')))
                AND idCotacao <> " . $reserva['id'] . " AND cancelada = 0";

    $db->query( $sql );
    $result = $db->fetch();

    if($result['total'] <= 0) {
        echo '0';
    } else {
        echo '1';
    }
    
    $db->close();

    /*$sql = "SELECT COUNT(*) AS totalDiaTodo 
            FROM cotacoes 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . ($reserva['dataFesta']) . "' 
            AND horaDe >= '15:00:00' AND horaDe <= '16:00:00' AND horaAte <= '21:00:00'"
            . "AND idCotacao <> " . $reserva['id'] . " AND cancelada = 0";

    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, "totalDiaTodo") >= '1') {
        echo '1';
    } else {

        $sql = "SELECT COUNT(*) AS total FROM cotacoes 
            WHERE idLocal = " . $reserva['local'] . " AND dataFesta = '" . ($reserva['dataFesta']) . "' 
            AND (horaDe BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "' 
            OR horaAte BETWEEN '" . $reserva['horarioDe'] . "' AND '" . $reserva['horarioAte'] . "' + '01:00') "
                . "AND idCotacao <> " . $reserva['id'] . " AND cancelada = 0";

        $Tb = ConsultaSQL($sql, $ArqT);

        if (mysqli_result($Tb, 0, "total") <= 0) {
            echo '0';
        } else {
            echo '1';
        }
    }
    mysqli_close($ArqT);*/
}

/*function validaHorario() {

    $ArqT = AbreBancoJujuba();

    $reserva = json_decode($_POST[reserva], true);

    $sql = "SELECT getNovoPeriodo('" . $reserva['horarioDe'] . "', '" . $reserva['horarioAte'] . "') AS periodo";
    $Tb = ConsultaSQL($sql, $ArqT);

    if (mysqli_result($Tb, 0, "periodo") == '000') {
        echo '0';
    } else {
        echo '1';
    }
    mysqli_close($ArqT);
} */

function getPeriodoDeValidade() {

    $db = ConectaDB();

    $sql = "SELECT DATE_ADD(DATE(NOW()), INTERVAL 7 DAY) as dataValidade";

    $db->query( $sql );

    $dataValidade = $db->fetch();
    $dataValidade = FormatData($dataValidade['dataValidade']);

    echo $dataValidade;

    $db->close();
}

function dataValida(){
    
    $db = ConectaDB();

    $reserva = json_decode($_POST[reserva], true);

    $sql = "SELECT IF(NOW() <= '".DataSSql($reserva[dataFesta])."' , 1, 0) AS valida";

    $db->query( $sql );
    $result = $db->fetch();

    echo $result["valida"];
    
    $db->close();
    
}