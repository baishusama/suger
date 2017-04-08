<?php
  require '../config/Database.class.php';
  $db = new Database();

  if(isset($_GET['aid']) && !empty($_GET['aid'])){
    $aid = (int)$_GET['aid'];

    $sql = "SELECT * FROM `article` WHERE aid=:aid;";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':aid' => $aid
    ));

    if($status){
      if($stmt->rowCount() > 0){
        $article = $stmt->fetch();
        if($article['published'] === 1 || $article['published'] === '1'){
          // 已发布的文章
          $result = array(
            'aid' => $article['aid'],
            'author' => $article['author'],
            'frombook' => $article['frombook'],
            'title' => $article['title'],
            'content' => $article['content'],
            'publishtime' => $article['publishtime'],
            'time' => $article['time']
          );

          header('HTTP/1.1 200 OK');
          header('Content-Type: application/json; charset=UTF-8');
          echo json_encode($result);
        } else {
          // 未发布的和已删除的文章
          header('HTTP/1.1 404 Not Found');
          header('Content-Type: application/json; charset=UTF-8');
        }
      } else {
        // 数据库中不存在相关文章的话
        header('HTTP/1.1 404 Not Found');
        header('Content-Type: application/json; charset=UTF-8');
      }
    } else {
      // 数据库查询失败的话
      header('HTTP/1.1 500 Internal Server Error');
      header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    die('In article/single.php, one of parameters of $_GET is undefined or empty..');
  }
