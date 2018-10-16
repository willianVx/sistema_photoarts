<?php

//require_once '../rotinaspadrao.php';
require_once 'source/PagSeguroLibrary/PagSeguroLibrary.php';
session_start();

/*
 * Description of pagseguro
 * @author Cezar
 * @version 1.0.0
 */

class pagseguro {

    protected $Moeda = 'BRL';
    protected $Itens = array();
    protected $dadosComprador = array();
    protected $dadosEntrega = array();
    protected $urlRetorno = '';
    protected $urlNotificacao = '';
    protected $emailPagSeguro = '';
    protected $tokenPagSeguro = '';
    protected $tipoFrete = 3; //1 = PAC, 2 = SEDEX E 3 NÃO ESPECIFICADO

    public function __construct() {
        if (isset($_SESSION['psItens'])) {
            $this->Itens = $_SESSION['psItens'];
        }
    }

    public function setPagamento($id) {
        //Instantiate a new payment request
        $paymentRequest = new PagSeguroPaymentRequest();

        //DEFINE A MOEDA (BRL = REAL BRASIL)
        $paymentRequest->setCurrency($this->Moeda);

        //DEFINE A REFERÊNCIA (ID = CÓDIGO DO PEDIDO, DA NF, ETC)
        $paymentRequest->setReference($id);

        //DEFINE OS DADOS DO COMPRADOR (NOME, EMAI, DDD, TELEFONE, TIPO DOC (CPF OU CNPJ) E DOC
        $paymentRequest->setSender($this->dadosComprador[0]['nome'], $this->dadosComprador[0]['email'], $this->dadosComprador[0]['ddd'], $this->dadosComprador[0]['telefone'], $this->dadosComprador[0]['tipoDoc'], $this->dadosComprador[0]['doc']);

        $paymentRequest->setShippingType($this->tipoFrete);
        $paymentRequest->setShippingAddress($this->dadosEntrega[0]['cep'], $this->dadosEntrega[0]['rua'], $this->dadosEntrega[0]['numero'], $this->dadosEntrega[0]['complemento'], $this->dadosEntrega[0]['bairro'], $this->dadosEntrega[0]['cidade'], $this->dadosEntrega[0]['uf']
        );

        $this->Itens = $_SESSION['psItens'];

        //DEFINE OS ITENS ADQUIRIDOS
        unset($_SESSION['psItens']);

        for ($i = 0; $i < count($this->Itens); $i++) {
            $paymentRequest->addItem($this->Itens[$i]['codigo'], $this->Itens[$i]['nome'], intval($this->Itens[$i]['qtde']), floatval($this->Itens[$i]['valor'])
            );
        }

        //DEFINE QUAL A URL QUE O PAGSEGURO DIRECIONARÁ AO FINALIZAR O PAGAMENTO
        $paymentRequest->setRedirectUrl($this->urlRetorno);

        //DEFINE QUAL A URL QUE O PAGSEGURO CHAMARÁ SEMPRE QUE ALTERAR O STATUS DE ALGUM PAGAMENTO
        $paymentRequest->setNotificationURL($this->urlNotificacao);

        //$paymentRequest->setParameter($parameter);
        //FAZ A REQUISIÇÃO PARA O PAGSEGURO PARA REGISTRAR OS DADOS DO PAGAMENTOS
        //E RECEBEMOS O CÓDIGO
        try {
            $credentials = new PagSeguroAccountCredentials($this->emailPagSeguro, $this->tokenPagSeguro);

            $onlyCheckoutCode = true;

            $code = $paymentRequest->register($credentials, $onlyCheckoutCode);

            return $code;
        } catch (PagSeguroServiceException $e) {
            $_SESSION['ps_erro'] = $e->getMessage();
            return false;
        }
    }

    public function getError() {
        if (isset($_SESSION['ps_erro'])) {
            return $_SESSION['ps_erro'];
        } else {
            return '';
        }
    }

    public function setMoeda($valor) {
        $this->Moeda = $valor;
    }

    public function setTipoFrete($valor) {
        $this->tipoFrete = $valor;
    }

    public function setURLRetorno($valor) {
        $this->urlRetorno = $valor;
    }

    public function setURLNotificacao($valor) {
        $this->urlNotificacao = $valor;
    }

    public function setEmailPagSeguro($valor) {
        $this->emailPagSeguro = $valor;
    }

    public function setTokenPagSeguro($valor) {
        $this->tokenPagSeguro = $valor;
    }

    public function addItem($codigo, $nome, $qtde, $valor) {
        array_push($this->Itens, array(
            'codigo' => $codigo,
            'nome' => $nome,
            'qtde' => $qtde,
            'valor' => $valor
                )
        );

        $_SESSION['psItens'] = $this->Itens;
    }

    public function setComprador($nome, $email, $ddd, $telefone, $tipoDoc, $doc) {
        array_push($this->dadosComprador, array('nome' => $nome,
            'email' => $email,
            'ddd' => $ddd,
            'telefone' => $telefone,
            'tipoDoc' => $tipoDoc,
            'doc' => $doc
                )
        );

        $_SESSION['psDadosComprador'] = $this->dadosComprador;
    }

    public function setEnderecoEntrega($cep, $rua, $numero, $complemento, $bairro, $cidade, $uf) {
        array_push($this->dadosEntrega, array('cep' => $cep,
            'rua' => $rua,
            'numero' => $numero,
            'complemento' => $complemento,
            'bairro' => $bairro,
            'cidade' => $cidade,
            'uf' => $uf
                )
        );

        $_SESSION['psDadosComprador'] = $this->dadosComprador;
    }

    public function getDetalhesPagamento($code) {
        try {
            $credentials = new PagSeguroAccountCredentials($this->emailPagSeguro, $this->tokenPagSeguro);

            $transaction = PagSeguroTransactionSearchService::searchByCode($credentials, $code);

            //Verifica se existe os dados do comprador
            if ($transaction->getSender()) {
                $nome = $transaction->getSender()->getName();
                $email = $transaction->getSender()->getEmail();

                if ($transaction->getSender()->getPhone()) {
                    $telefone = "(" . $transaction->getSender()->getPhone()->getAreaCode() . ") " .
                            $transaction->getSender()->getPhone()->getNumber();
                }
            }

            $json = array(
                'code' => $transaction->getCode(),
                'dataPagamento' => substr($transaction->getDate(), 0, 10) . ' ' . substr($transaction->getDate(), 11, 8),
                'data' => substr($transaction->getLastEventDate(), 0, 10) . ' ' . substr($transaction->getLastEventDate(), 11, 8),
                'referencia' => $transaction->getReference(),
                'idTipoPagamento' => $transaction->getPaymentMethod()->getType()->getValue(),
                'idMeioPagamento' => $transaction->getPaymentMethod()->getCode()->getValue(),
                'idStatus' => $transaction->getStatus()->getValue(),
                'status' => $transaction->getStatus()->getTypeFromValue(),
                'valorBruto' => $transaction->getGrossAmount(),
                'valorTaxas' => $transaction->getFeeAmount(),
                'valorLiquido' => $transaction->getNetAmount(),
                'qtdeParcelas' => $transaction->getInstallmentCount(),
                'nomeComprador' => $nome,
                'emailComprador' => $email,
                'telComprador' => $telefone
            );

            return $json;
        } catch (PagSeguroServiceException $e) {
            $_SESSION['ps_erro'] = $e->getMessage();
            return false;
        }
    }

    public function getDetalhesPagamentoPorData($de, $ate) {

        try {
            //$de = '2014-07-04T09:00';
            //$ate = '2014-07-15T16:00';

            $pageNumber = 1;
            $maxPageResults = 50;

            $credentials = new PagSeguroAccountCredentials($this->emailPagSeguro, $this->tokenPagSeguro);

            $result = PagSeguroTransactionSearchService::searchByDate(
                            $credentials, $pageNumber, $maxPageResults, $de, $ate
            );
            
            $transactions = $result->getTransactions();  
                                
            if (is_array($transactions) && count($transactions) > 0) {
                foreach ($transactions as $key => $transactionSummary){
                    /*echo "<br>Code: " . $transactionSummary->getCode() . "<br>";
                    echo "Reference: " . $transactionSummary->getReference() . "<br>";
                    //echo "Method Code: " . $transactionSummary->getPaymentMethod()->getCode()->getValue() . "<br>";
                    echo "Method Type: " . $transactionSummary->getPaymentMethod()->getType()->getValue() . "<br>";
                    echo "Status ID: " . $transactionSummary->getStatus()->getValue() . "<br>";
                    echo "Status: " . $transactionSummary->getStatus()->getTypeFromValue() . "<br>";
                    echo "amount: " . $transactionSummary->getGrossAmount() . "<br>";
                    echo "taxas: " . $transactionSummary->getFeeAmount() . "<br>";
                    echo "liquido: " . $transactionSummary->getNetAmount() . "<br>";
                    echo "recovery code: " . $transactionSummary->getRecoveryCode() . "<br>";
                    echo "date: " . $transactionSummary->getDate() . "<br>";
                    echo "<hr>"; */
                    $json[] = array(
                        'code' => $transactionSummary->getCode(),
                        'referencia' => $transactionSummary->getReference()/*,
                        'dataPagamento' => substr($transactionSummary->getDate(), 0, 10) . ' ' . substr($transactionSummary->getDate(), 11, 8),
                        //'data' => substr($transactionSummary->getLastEventDate(), 0, 10) . ' ' . substr($transactionSummary->getLastEventDate(), 11, 8),                        
                        'idTipoPagamento' => $transactionSummary->getPaymentMethod()->getType()->getValue(),
                        //'idMeioPagamento' => $transactionSummary->getPaymentMethod()->getCode()->getValue(),
                        'idStatus' => $transactionSummary->getStatus()->getValue(),
                        'status' => $transactionSummary->getStatus()->getTypeFromValue(),
                        'valorBruto' => $transactionSummary->getGrossAmount(),
                        'valorTaxas' => $transactionSummary->getFeeAmount(),
                        'valorLiquido' => $transactionSummary->getNetAmount(),
                        //'qtdeParcelas' => $transactionSummary->getInstallmentCount()/*,
                        'nomeComprador' => $nome,
                        'emailComprador' => $email,
                        'telComprador' => $telefone*/
                    );
                }
            }
           
                                  
            return $json;
        } catch (PagSeguroServiceException $e) {
            $_SESSION['ps_erro'] = $e->getMessage();
            return false;
        }
    }

    public function addLog($arqt, $log) {
        $sql = "INSERT INTO ps_log SET dataLog=Now(), log ='" . mysql_real_escape_string($log, $arqt) . "'";
        mysql_query($sql, $arqt);
    }

}
