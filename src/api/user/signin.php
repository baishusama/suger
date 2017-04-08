<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $account = $data->account;
  $password = $data->password;

  // Check empty (Back-End only)
  if(empty($account) || empty($password)) {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
    exit();
  }

  if(preg_match('/@/', $account)){ // 简单地区分用户名和邮箱
    $colName = 'email';
    $colPlaceholder =':email';
  } else {
    $colName = 'uname';
    $colPlaceholder =':uname';
  }

  $sql = "SELECT * FROM `user` WHERE $colName=$colPlaceholder;";
  $stmt = $db->prepare($sql);
  $stmt->execute(array(
    $colPlaceholder => $account
  ));

  // $sql = "SELECT * FROM `user` WHERE uname=:uname;";
  // $stmt = $db->prepare($sql);
  // $stmt->execute(array(
  //   ':uname' => 'admin'
  // ));

  if($stmt->rowCount() > 0){
    $result = $stmt->fetch();
    if(password_verify($password, $result['password'])){
      $databack = array(
        'id' => $result['uid'],
        'name' => $result['uname'],
        'avatar' => $result['avatar'],
        'role' => $result['role'],
        'active' => $result['active']
      );

      // 登录成功
      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode($databack);
      exit();
    }
  }

  // 登录失败
  header('HTTP/1.1 400 Bad Request');
  header('Content-Type: application/json; charset=UTF-8');
?>
