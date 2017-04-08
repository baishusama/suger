<?php
  require '../config/Database.class.php';
  $db = new Database();

  if(isset($_GET['uid']) && !empty($_GET['uid'])){
    $uid = (int)$_GET['uid'];

    $sql = "SELECT * FROM `user` WHERE uid=:uid;";
    $stmt = $db->prepare($sql);
    $stmt->execute(array(
      ':uid' => $uid
    ));

    if($stmt->rowCount() > 0){
      $author = $stmt->fetch();
      $result = array(
        'uid' => $author['uid'],
        'username' => $author['uname'],
        'avatar' => $author['avatar'],
        'role' => $author['role']
      );

      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode($result);
    }
    else {
      // 数据库中不存在作者的话
      header('HTTP/1.1 404 Not Found');
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode($uid);
    }
  } else {
    die('In user/author.php, one of parameters of $_GET is undefined or empty..');
  }
