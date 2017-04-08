<?php
  require '../config/Database.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $aid = $data->aid;
  $title = $data->title;
  $content = $data->content;

  // Update
  $sql = "UPDATE `article` SET title=:title,content=:content WHERE aid=:aid";
  $stmt = $db->prepare($sql);
  $status = $stmt->execute(array(
    ':title' => $title,
    ':content' => $content,
    ':aid' => $aid
  ));

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
