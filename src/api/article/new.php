<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $uid = $data->uid;
  $bid = $data->bid;
  $title = "无标题文章";
  $content = "";

  // Insert to DB
  $sql = "INSERT INTO `article` (author,frombook,title,content) VALUES (:author,:frombook,:title,:content);";
  $stmt = $db->prepare($sql);
  $status = $stmt->execute(array(
    ':author' => $uid,
    ':frombook' => $bid,
    ':title' => $title,
    ':content' => $content
  ));

  // 响应
  if($status && $stmt->rowCount() > 0){
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/json; charset=UTF-8');
    $result = array(
      newAid => $db->lastInsertId()
    );
    echo json_encode($result);
  } else {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
  }
