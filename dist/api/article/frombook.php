<?php
  require '../config/Database.class.php';
  $db = new Database();

  if(isset($_GET['bid']) && !empty($_GET['bid'])){
    $book = (int)$_GET['bid'];

    $sql = "SELECT * FROM `article` WHERE frombook=:frombook AND abandoned=0 ORDER BY lastedittime DESC;";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':frombook' => $book
    ));

    if($status){
      // 响应
      if($data = $stmt->fetch()){
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=UTF-8');

        // way 1:
        // echo json_encode($stmt->fetchAll());

        // way 2:
        // $results = $stmt->fetch(PDO::FETCH_ASSOC);

        // way 3:
        $results = array();
        do {
          $result = array(
            'aid' => $data['aid'],
            'title' => $data['title'],
            'content' => $data['content'],
            'published' => $data['published']
            // , 'abandoned' => $data['abandoned']
          );
          array_push($results, $result);
        } while($data = $stmt->fetch());
        echo json_encode($results);
      } else {
        header('HTTP/1.1 204 No Content');
        header('Content-Type: application/json; charset=UTF-8');
        // echo json_encode(array(
        //   'testtext' => 'hello world'
        // )); // 返回不了空值。。// 不管 echo 啥 data 都是一个空字符串？
      }
    }
    else {
      header('HTTP/1.1 400 Bad Request');
      header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    die('In article/frombook.php, one of parameters of $_GET is undefined or empty..');
  }
