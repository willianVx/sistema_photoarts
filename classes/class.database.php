<?php

class _DB {

    /**
     * @uses Enable or Disable Debug Mode
     */
    public $debug = false;

    /**
     * @uses Set to true to print the query executed
     */
    public $show_query = false;

    /**
     * @uses Database Instance
     */
    private static $instance;

    /**
     * @uses Database Variables for Establishing Connection
     */
    private $server = ""; //database server
    private $user = ""; //database login name
    private $pass = ""; //database login password
    private $database = ""; //database name

    /**
     * @uses Stores Error Count
     * @var Int
     */
    private $error = 0;

    /**
     * @uses Number of Rows affected by previous query
     */
    public $n_rows = 0;
    public $affected_rows = 0;

    /**
     * @uses Database Connection Link ID & Query Return ID
     */
    private $link_id;
    private $query_id;

    /**
     * @uses Enable or Disable Transaction
     */
    private $transactionMode = false;

    /**
     * @uses Enable or Disable Transaction Debug Info on Screen
     */
    public $transactionDebug = false;


    public function __construct($server, $user, $pass, $database) {
        $this->server = $server;
        $this->user = $user;
        $this->pass = $pass;
        $this->database = $database;
       
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        
        $this->link_id = mysqli_connect($this->server, $this->user, $this->pass, $this->database);        
       
        //$this->link_id = mysqli_connect( 'localhost', 'root', '', "photoarts_crio");
                     
        if (!$this->link_id) {
            $this->oops("Database Connect error : " . mysqli_connect_errno(), "db_error");
            return false;
        }                
        mysqli_set_charset($this->link_id, 'utf8');

        return $this;
    }

//constructor

    /**
     * Singleton Initialization of the Database Variable
     * @param null $server
     * @param null $user
     * @param null $pass
     * @param null $database
     * @return Database
     */
    public static function obtain($server = null, $user = null, $pass, $database = null) {
        if (!self::$instance) {
            self::$instance = new _DB($server, $user, $pass, $database);
        }

        return self::$instance;
    }

//obtain

    /**
     * @uses close the connection
     */
    public function close() {
        if (!mysqli_close($this->link_id)) {
            $this->oops("Connection close failed.", "db_error");
        }
    }

//close
        /**
     * @uses free the result
     */
    public function free() {
        if (!mysqli_free_result($this->query_id)) {
            $this->oops("Result free failed.", "db_error");
        }
    }

//free
    
    public function toJSON($data) {
        header("Content-Type: application/json;charset=utf-8");
        echo json_encode($data);
    }

    /**
     * @uses escapes characters to be mysql ready
     * @param string
     * @return string
     */
    public function escape($string) {
        if (get_magic_quotes_gpc())
            $string = stripslashes($string);
        return mysqli_real_escape_string($this->link_id, $string);
    }

//escape

    /**
     * @uses escapes characters to be mysql ready
     * @param string
     * @return string
     */
    public function escapesql($string) {
        if (get_magic_quotes_gpc())
            $string = stripslashes($string);
        return mysqli_real_escape_string($this->link_id, $string);
        //$str = mysqli_real_escape_string($this->link_id, $string);
        //return $str;
    }

//escape

    /**
     * Runs a Raw / Named Query query of raw SQL
     * @param $sql
     * @return $this|int
     */
    public function query($sql, $params = null) {
        if ($params != null) {
            $safe = array();
            foreach ($params as $key => $param) {
                $safe[':' . $key] = $this->escape($param);
            }
            $sql = strtr($sql, $safe);
        }

        // Display Query
        if ($this->show_query === true) {
            $this->oops('Query >> ' . $sql, 'db_info');
        }
                        
        $this->query_id = mysqli_query($this->link_id, $sql);
                             
        if (!$this->query_id) {
            $this->error++;
            $this->oops("<b>MySQL Query fail:</b> $sql", "db_error");
            return 0;
        }       
       
        $this->affected_rows = mysqli_affected_rows($this->link_id);
        if (is_bool($this->query_id) ) {
            $this->query_ok = $this->show_query;
            $this->n_rows = $this->affected_rows;
        }else{
            $this->n_rows = $this->query_id->num_rows; 
        }        
    
        //print_r($sql);
        //print_r($this);
        
        return $this;
    }

//query
    
    public function result( $row=0, $col=0){
        
        if ($this->num_rows && $row <= ($this->num_rows - 1) && $row >= 0) {
            
            mysqli_data_seek($this->query_id, $row);

            /* fetch row */
            $resrow = (is_numeric($col)) ? mysqli_fetch_row( $this->query_id ) : mysqli_fetch_assoc($this->query_id);
            if (isset($resrow[$col])) {
                return $resrow[$col];
            }
        }
        return false;
    }
    
    public function myresult($res, $row, $field=0) { 
        $res->data_seek($row); 
        $datarow = $res->fetch_array(); 
        return $datarow[$field]; 
    } 
    
    public function UltimoRegistro() {
        $sql = "SELECT LAST_INSERT_ID() AS id";

        $rs = _DB::query( $sql );
        
        return myresult($rs, 0, 'id');
    }
    
    /**
     * fetches and returns results one line at a time
     * @param int $type
     * @return array|null
     */
    public function fetch($type = MYSQLI_ASSOC) {
        $record = [];       
        if (isset($this->query_id)) {
            $record = mysqli_fetch_array($this->query_id, $type);            
        } else {
            $this->oops("Invalid query_id. Records could not be fetched.", "db_error");
        }        
        return $record;
    }

// fetch

    /**
     * returns all the results of the current query
     * @param int $type
     * @return array
     */
    public function fetch_all($type = MYSQLI_ASSOC) {

        $out = array();

        while ($row = mysqli_fetch_array($this->query_id, $type)) {
            $out[] = $row;
        }

        return $out;
    }

//fetch_array

    /**
     * returns all columns by id (Column name should be id)
     * @param $table
     * @param $id
     * @return Database
     */
    public function findById($table, $id) {
        return $this->query("SELECT * FROM $table WHERE `id` = ':id'", ['id' => $id])->fetch();
    }

    /**
     * returns single row of a table search by column
     * @param $table
     * @param $col_name
     * @param $col_val
     * @return Database
     */
    public function findByCol($table, $col_name, $col_val) {
        return $this->query("SELECT * FROM $table WHERE `:col` = ':val'", ['col' => $col_name, 'val' => $col_val])->fetch();
    }

    /**
     * Count rows of a table
     * @param $table
     * @param string $where
     * @return mixed
     */
    public function count($table, $where = " 1 ") {
        $sql = "SELECT COUNT(*) as row_cnt FROM `$table` WHERE " . $where;
        $data = $this->query($sql)->fetch();
        return $data['row_cnt'];
    }

    /**
     * does an update query with an array
     * @param $table
     * @param $data
     * @param string $where
     * @param array $filter
     * @return bool
     */
    public function update($table, $data, $where = '1', $filter = array()) {
        $q = "UPDATE `$table` SET ";

        foreach ($data as $key => $val) {
            if (!empty($filter) && !in_array($key, $filter, true)) {
                continue;
            }
            if (strtolower($val) == 'null')
                $q .= "`$key` = NULL, ";
            elseif (strtolower($val) == 'now()')
                $q .= "`$key` = NOW(), ";
            elseif (preg_match("/^increment\((\-?[\d\.]+)\)$/i", $val, $m))
                $q .= "`$key` = `$key` + $m[1], ";
            else
                $q .= "`$key`='" . $this->escape($val) . "', ";
        }

        $q = rtrim($q, ', ') . ' WHERE ' . $where . ';';

        $this->query($q);

        if ($this->query_id) {
            return true;
        }

        return false;
    }

    /**
     * Bulk update entries
     * @param $table
     * @param $data_arr
     * @param array $filter
     * @param bool|false $use_tr
     * @return bool
     */
    public function bulk_update($table, $data_arr, $filter = array(), $use_tr = false) {

        if ($use_tr === true)
            $this->start_transaction();

        foreach ($data_arr as $key => $data) {
            if (!$this->update($table, $data, " `id` = '$key'", $filter))
                $this->error++;
        }

        if ($use_tr === true)
            return $this->stop_transaction();

        if ($this->error <= 0)
            return true;

        return false;
    }

//bulk_insert

    /**
     * does an insert query with an array
     * @param $table
     * @param $data
     * @param array $filter
     * @return bool|int|string
     */
    public function insert($table, $data, $filter = array()) {
        $q = "INSERT INTO `$table` ";
        $v = '';
        $n = '';

        foreach ($data as $key => $val) {
            if (!empty($filter) && !in_array($key, $filter, true)) {
                continue;
            }
            $n .= "`$key`, ";
            if (strtolower($val) == 'null')
                $v .= "NULL, ";
            elseif (strtolower($val) == 'now()')
                $v .= "NOW(), ";
            else
                $v .= "'" . $this->escape($val) . "', ";
        }

        $q .= "(" . rtrim($n, ', ') . ") VALUES (" . rtrim($v, ', ') . ");";
        //echo $q;
        $this->query($q);
        if ($this->query_id) {
            return mysqli_insert_id($this->link_id);
        }

        return false;
    }

//insert

    /**
     * Bulk insert
     * @param $table
     * @param $data_arr
     * @param bool|false $use_tr
     * @return bool
     */
    public function bulk_insert($table, $data_arr, $use_tr = false) {
        if ($use_tr === true)
            $this->start_transaction();

        foreach ($data_arr as $key => $data) {
            if (!$this->insert($table, $data))
                $this->error++;
        }

        if ($use_tr === true)
            return $this->stop_transaction();

        if ($this->error <= 0)
            return true;

        return false;
    }

//bulk_insert

    /**
     * Delete Query
     * @param $table
     * @param string $where
     * @return bool
     */
    public function delete($table, $where = " id = 'NaN'") {
        $q = "DELETE FROM `$table` WHERE " . $where;
        $this->query($q);
        if ($this->query_id) {
            return true;
        }

        return false;
    }

//delete


    /*     * *************************************************************
     * **************** Transactions *********************************
     * ************************************************************* */

    /**
     * @uses Starts a Transaction
     * @return Bool
     */
    public function start_transaction() {

        if ($this->transactionDebug === true) {
            $this->oops('Starting Transaction.', 'db_info');
        }

        $this->transactionMode = true;
        $this->error = 0;
        return mysqli_autocommit($this->link_id, FALSE);
    }

//start_transaction

    /**
     * @uses Commits a Transaction ie saves all the changes
     * @return Bool
     */
    public function commit() {
        if ($this->transactionDebug === true) {
            $this->oops('Commiting Transaction.', 'db_success');
        }

        $return = mysqli_commit($this->link_id);
        mysqli_autocommit($this->link_id, TRUE);
        return $return;
    }

//commit

    /**
     * @uses Roolback a Transaction ie discard all the changes
     * @return Bool
     */
    public function rollback() {
        if ($this->transactionDebug === true) {
            $this->oops('Rolling Back Transaction.', 'db_warning');
        }
        $return = mysqli_rollback($this->link_id);
        mysqli_autocommit($this->link_id, TRUE);
        return $return;
    }

//rollback

    /**
     * @uses Stop and Process a Transaction
     * @return Bool (True: Transaction Commited)/(False: Transaction Rolled Back)
     */
    public function stop_transaction() {
        if ($this->transactionDebug === true) {
            $this->oops('Stoping Transaction. Error Count: ' . $this->error, 'db_info');
        }

        if ($this->transactionMode && $this->error <= 0) {
            $this->commit();
            $this->transactionMode = false;
            $this->error = 0;
            return true;
        } else {
            $this->rollback();
            $this->transactionMode = false;
            $this->error = 0;
            return false;
        }
    }

//stop_transaction

    public function fields() {
        return mysqli_num_fields($this->query_id);
    }

    /**
     * @uses backups the database tables to file specified(Sql Dump)
     * @params: $folder,$table
     * @return: true/false
     */
    public function backup_tables($folder, $tables = '*') {
        $return = '';
        //get all of the tables
        if ($tables == '*') {
            $tables = array();
            $table_rows = $this->query('SHOW TABLES')->fetch_all(MYSQLI_NUM);
            foreach ($table_rows as $table_row) {
                $tables[] = $table_row[0];
            }
        } else {
            $tables = is_array($tables) ? $tables : explode(',', $tables);
        }


        //cycle through
        foreach ($tables as $table) {
            $result = $this->query('SELECT * FROM ' . $table);
            $num_fields = $result->fields();

            $return .= 'DROP TABLE ' . $table . ';';
            $row2 = $this->query('SHOW CREATE TABLE ' . $table)->fetch(MYSQLI_NUM);
            $return .= "\n\n" . $row2[1] . ";\n\n";

            for ($i = 0; $i < $num_fields; $i++) {
                $rows = $result->fetch_all(MYSQLI_NUM);
                foreach ($rows as $row) {
                    $return .= 'INSERT INTO ' . $table . ' VALUES(';
                    for ($j = 0; $j < $num_fields; $j++) {
                        $row[$j] = addslashes($row[$j]);
                        $row[$j] = ereg_replace("\n", "\\n", $row[$j]);
                        if (isset($row[$j])) {
                            $return .= '"' . $row[$j] . '"';
                        } else {
                            $return .= '""';
                        }
                        if ($j < ($num_fields - 1)) {
                            $return .= ',';
                        }
                    }
                    $return .= ");\n";
                }
            }
            $return .= "\n\n\n";
        }

        //save file
        $handle = fopen($folder . 'backup-' . time() . '-db.sql', 'w+');
        $state = fwrite($handle, $return);
        fclose($handle);

        return $state;
    }

//backup_tables

    /**
     * @uses throw an error message in debug mode only
     * @param [optional] any custom error to display
     */
    private function oops($msg='',$type='db_error'){
	if(!empty($this->link_id)){
		$error = mysqli_error($this->link_id);
	}
	else{
		$error="<b>WARNING:</b> No link_id found. Not connected to any Database.<br />$msg";
	}
    
        $db_title = array('db_info'=>'Database Information',
                        'db_success'=>'Database Success',
                        'db_warning'=>'Database Warning',
                        'db_error'=>'Database Error'
                    );

	// if no debug, done here
        if(!$this->debug) {return;}
	?>
        <style type="text/css">
        <!--
            
        	.db_info, .db_success, .db_warning, .db_error {
                margin: 10px 0px;
                padding:12px;
                border-radius:.5em;
                border: 1px solid;
            }
            .db_info li, .db_success li, .db_warning li, .db_error li {
                margin: 0px 22px;
                padding:5px;
                border-bottom: 1px dotted;
            }
            .db_info {
                color: #00529B;
                background-color: #BDE5F8;
            }
            .db_success {
                color: #4F8A10;
                background-color: #DFF2BF;
            }
            .db_warning {
                color: #9F6000;
                background-color: #FEEFB3;
            }
            .db_error {
                color: #D8000C;
                background-color: #FFBABA;
            }
            
        -->
        </style>
        
        <div class="<?php echo $type; ?>">
           <div><strong><?php echo $db_title[$type]; ?></strong></div>
           <div>
                <li><span>Message: </span> <?php echo $msg; ?></li>
                <?php if(!empty($error)) echo '<li><span>MySQL Error:</span> '.$error.'</li>'; ?>
                <li><span>Date:</span> <?php echo date("l, F j, Y \a\\t g:i:s A"); ?></li>
                <?php if(!empty($_SERVER['REQUEST_URI'])) echo '<li><span>Script:</span> <a href="'.$_SERVER['REQUEST_URI'].'">'.$_SERVER['REQUEST_URI'].'</a></li>'; ?>
                <?php if(!empty($_SERVER['HTTP_REFERER'])) echo '<li><span>Referer:</span> <a href="'.$_SERVER['HTTP_REFERER'].'">'.$_SERVER['HTTP_REFERER'].'</a></li>'; ?>
           </div>
           
        </div>
		
	<?php
    }   //oops


    public function dd($var) {
        var_dump($var);
        die();
    }

}


?>       