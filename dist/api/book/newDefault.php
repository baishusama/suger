<?php
function new_default_books($uid){
  // require '../config/Database.class.php';
  $db = new Database();

  $author = (int)$uid;
  $titles = array(
    'title1' => '随笔集',
    'title2' => '日记本'
  );

  $flag = true;
  foreach($titles as $title){
    // Insert to DB
    $sql = "INSERT INTO `book` (author,title,state) VALUES (:author,:title,:state);";
    $stmt = $db->prepare($sql);
    $stmt->execute(array(
      ':author' => $author,
      ':title' => $title,
      ':state' => 1
    ));
    if($stmt->rowCount() > 0){
      // echo '(test flag)In newDefault, $author : ' . $author;
      // do nothing (Otherwise it will affect the caller page - signup.php)
    } else {
      $flag = false;
    }
  }

  // 响应
  if($flag){
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/json; charset=UTF-8');
  } else {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
  }
}
