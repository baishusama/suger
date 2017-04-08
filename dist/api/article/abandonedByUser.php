<?php
  require '../config/Database.class.php';
  $db = new Database();

  if(isset($_GET['uid']) && !empty($_GET['uid'])){
    $author = (int)$_GET['uid'];

    $sql = "SELECT * FROM `article` WHERE author=:author AND abandoned=1 ORDER BY abandontime DESC;";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':author' => $author
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
    die('In article/abandonedByUser.php, one of parameters of $_GET is undefined or empty..');
  }
