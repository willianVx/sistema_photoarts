<?php

// Database Settings
define('DB_SERVER', "localhost");           // Database Host
define('DB_USER', "criodigital");                  // Databse User
define('DB_PASS', "quebracrio774763");                      // Database Password
define('DB_DATABASE', "PHOTOARTS_CRIO");   		// Database Name

class config {

    /*private $endereco = 'localhost';
    private $login = 'photoarts';
    private $pass = 'photoarts774763';
    private $banco = 'PHOTOARTS';*/
    
    private $endereco = 'localhost';
    private $login = 'criodigital';
    private $pass = 'quebracrio774763';
    private $banco = 'PHOTOARTS_CRIO';

    /*
    private $endereco = 'localhost';
    private $login = 'root';
    private $pass = '';
    private $banco = 'photoarts_crio';*/

    function get_host() {
        return $this->endereco;
    }

    function get_login() {
        return $this->login;
    }

    function get_pass() {
        return $this->pass;
    }

    function get_banco() {
        return $this->banco;
    }

}
