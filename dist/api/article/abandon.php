<?php
  require '../config/Database.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $aid = $data->aid;
  $abandoned = $data->abandoned;

  // Update
  date_default_timezone_set('Asia/Shanghai');
  $now = date('Y-m-d H:i:s');
  if($abandoned === '1' || $abandoned === 1) {
    // 丢弃文章
    $sql = "UPDATE `article` SET abandoned=:abandoned,abandontime=:abandontime WHERE aid=:aid";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':abandoned' => 1,
      ':aid' => $aid,
      ':abandontime' => $now
    ));
  } else {
    // 取消丢弃文章
    $sql = "UPDATE `article` SET abandoned=:abandoned,abandontime=0 WHERE aid=:aid";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':abandoned' => 0,
      ':aid' => $aid
    ));
  }

  // 响应
  if($status){
    if($stmt->rowCount() > 0){
      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
      echo $aid;
    } else {
      header('HTTP/1.1 400 Bad Request');
      header('Content-Type: application/json; charset=UTF-8');
      // header('HTTP/1.1 204 No Content');
      // header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
  }
