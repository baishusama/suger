<?php
class Database extends PDO {

    function __construct() {
      // parent::__construct(DB_TYPE . ':host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PWD);
      parent::__construct('mysql:host=localhost;dbname=blog', 'root', 'root');
      // parent::__construct('mysql:host='.SAE_MYSQL_HOST_M.';port='.SAE_MYSQL_PORT.';dbname='.SAE_MYSQL_DB, SAE_MYSQL_USER, SAE_MYSQL_PASS);
    }

}
