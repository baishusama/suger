<?php
  require '../config/DatabaseDevOnly.class.php';
  require '../book/newDefault.php';
  require 'mail.php';
  // require '../config/curl.php';
  $db = new Database();

  // fortest
  // $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // 第一部分数据

  // json_encode / json_decode OTZ
  $data = json_decode(file_get_contents('php://input'));
  $username = $data->username;
  $password = password_hash($data->password, PASSWORD_BCRYPT);
  $email = $data->email;

  // 对“第一部分数据”的检查 Check

  // Check empty (Back-End again)
  if(empty($username) || empty($password) || empty($email)) {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
    exit();
  }

  // Check duplicate (Back-End again)
  $query = "SELECT * FROM `user` WHERE uname=:uname OR email=:email;";
  $check = $db->prepare($query);
  $check->execute(array(
    ':uname' => $username,
    ':email' => $email
  ));
  if($check->rowCount() > 0){
    // $duplicat = $check->fetchAll();
    header('HTTP/1.1 409 Conflict');
    header('Content-Type: application/json; charset=UTF-8');
    exit();
  }

  // 第二部分数据

  $avatar = 'public/image/default/avatar/persona5-' . rand(0,8) . '.jpg';
  // $role = '1'; // default
  $hash = md5( rand(0,1000) );

  // “注册”到数据库

  // Insert to DB
  $sql = "INSERT INTO `user` (uname,password,email,avatar,hash) VALUES (:uname,:password,:email,:avatar,:hash);";
  $stmt = $db->prepare($sql);
  $stmt->execute(array(
    ':uname' => $username,
    ':password' => $password,
    ':email' => $email,
    ':avatar' => $avatar,
    // ':role' => $role,
    ':hash' => $hash
  ));

  // Result
  if($stmt->rowCount() > 0){ // 插入到数据：成功！
    // 创建默认 book 日记本 & 随笔集
    $author = $db->lastInsertId();
    // $ROOT = 'http://baishu.applinzi.com/blog/';
    // $NEWBOOKURL = 'api/book/new.php';
    // $post_arr_1 = array(
    //   'author' => $author,
    //   'title' => "随笔集"
    // );
    // $post_arr_2 = array(
    //   'author' => $author,
    //   'title' => "随笔集"
    // );
    // // $post_string_1 = "author=$author&title=随笔集";
    // // $post_string_2 = "author=$author&title=日记本";
    // post_by_curl($ROOT . $NEWBOOKURL, $post_arr_1);
    // post_by_curl($ROOT . $NEWBOOKURL, $post_arr_2);
    new_default_books($author);

    send_mail_to($username, $email, $hash);
  } else { // 插入到数据：失败……
    // 响应
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
  }
?>
