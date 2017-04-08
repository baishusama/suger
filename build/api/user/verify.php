<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $email = $data->email;
  $hash = $data->hash;

  // 空值检查
  if(empty($email) || empty($hash)){
    // 检查失败
    header('HTTP/1.1 404 Not Found');
    header('Content-Type: application/json; charset=UTF-8');
    exit();
  }

  // 验证账户
  $sql = "SELECT * FROM `user` WHERE email=:email AND hash=:hash;";
  $stmt = $db->prepare($sql);
  $stmt->execute(array(
    ':email' => $email,
    ':hash' => $hash
  ));

  // 验证成功 - 合法的验证（即数据库中存在对应的条目）
  if($row = $stmt->fetch()){
    if($row['active'] === 1 || $row['active'] === '1'){
      // 已激活
      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode("已激活 :)");
    } else {
      // 未激活 => 激活账户
      $active = 1;
      $verify = "UPDATE `user` SET active=:active WHERE email=:email";
      $stmt = $db->prepare($verify);
      $stmt->execute(array(
        ':active' => $active,
        ':email' => $email
      ));

      // print_r($stmt);

      if($stmt->rowCount() > 0){
        // 激活成功
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("恭喜你！激活成功 :)");
      } else {
        // 激活失败
        header('HTTP/1.1 400 Bad Request');
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("激活失败 QAQQ 请刷新页面以重试");
      }
    }
  } else {
    // 验证失败 - 非法的验证（即数据库中不存在对应的条目）
    header('HTTP/1.1 404 Not Found');
    header('Content-Type: application/json; charset=UTF-8');
  }
?>
