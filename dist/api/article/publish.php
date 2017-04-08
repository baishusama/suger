<?php
  require '../config/Database.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $aid = $data->aid;
  $published = $data->published;

  // Update
  date_default_timezone_set('Asia/Shanghai');
  $now = date('Y-m-d H:i:s');
  if($published === '1' || $published === 1) {
    // 发布文章
    $sql = "UPDATE `article` SET published=:published,publishtime=:publishtime WHERE aid=:aid";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':published' => 1,
      ':aid' => $aid,
      ':publishtime' => $now
    ));
  } else {
    // 取消发布文章
    $sql = "UPDATE `article` SET published=:published,publishtime=0 WHERE aid=:aid";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':published' => 0,
      ':aid' => $aid
    ));
  }

  // 响应
  if($status){
    if($stmt->rowCount() > 0){
      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
    } else {
      header('HTTP/1.1 204 No Content');
      header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
  }
