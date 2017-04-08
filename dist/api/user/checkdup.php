<?php
  require '../config/Database.class.php';
  $db = new Database();

  // $data = json_decode(file_get_contents('php://input'));
  if(isset($_GET['key']) && !empty($_GET['key']) AND isset($_GET['value']) && !empty($_GET['value'])){
    $key = $_GET['key'];
    $value = $_GET['value'];

    // fortest
    // echo ' ---- In checkdup.php, $key : ';
    // print_r($key);
    // echo ' ---- In checkdup.php, $value : ';
    // print_r($value);

    // “用户名”还是“邮箱”
    switch ($key) {
      case 'username':
        $colName = 'uname';
        $colPlaceholder = ':uname';
        break;
      case 'email':
        $colName = 'email';
        $colPlaceholder = ':email';
        break;
    }

    // Check duplicate
    $query = "SELECT * FROM `user` WHERE $colName=$colPlaceholder;";
    $check = $db->prepare($query);
    $check->execute(array(
      $colPlaceholder => $value
    ));

    // 响应暂定如下（需要搞一下状态码了。。）
    if($check->rowCount() > 0){
      // 如果存在重复的话，返回一个请求失败的响应（让 promise 的 catch 捕获）
      header('HTTP/1.1 409 Conflict');
      // die(json_encode(array('message' => 'ERROR: Exists duplicat :(.', 'code' => 1337)));
    } else {
      // 如果不存在重复的话，返回一个请求成功的响应（让 promise 的 then 捕获）
      // $duplicat = $check->fetchAll();
      header('HTTP/1.1 204 No Content');
      // echo "It's allowed to use, because there's no duplication :).";
    }
    header('Content-Type: application/json; charset=UTF-8');
  } else {
    die('In checkdup.php, one of parameters of $_GET is undefined or empty..');
  }
