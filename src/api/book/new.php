<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $author = $data->uid;
  $title = $data->title;

  // Insert to DB
  $sql = "INSERT INTO `book` (author,title) VALUES (:author,:title);";
  $stmt = $db->prepare($sql);
  $stmt->execute(array(
    ':author' => $author,
    ':title' => $title
  ));

  // 响应
  if($stmt->rowCount() > 0){
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/json; charset=UTF-8');
    $result = array(
      newBid => $db->lastInsertId()
    );
    echo json_encode($result);
  } else {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
  }
