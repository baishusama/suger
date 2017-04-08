<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  if(isset($_GET['uid']) && !empty($_GET['uid'])){
    $uid = $_GET['uid'];

    // 首先获得用户信息
    $sql = "SELECT * FROM `user` WHERE uid=:uid;";
    $stmt = $db->prepare($sql);
    $status = $stmt->execute(array(
      ':uid' => $uid
    ));

    $no_article_flag = false; // 失败的 flag // ???
    // 如果执行成功
    if($status){
      // 如果用户存在
      if($stmt->rowCount() > 0){
        $data = $stmt->fetch();
        $author = array(
          'uid' => $data['uid'],
          'username' => $data['uname'],
          'avatar' => $data['avatar'],
          'gender' => $data['gender'],
          'role' => $data['role']
        );

        // 查询作者（uid）的所有已发布文章
        $get_publish = "SELECT * FROM `article` WHERE author=:author AND published=1 AND abandoned=0 ORDER BY publishtime DESC;";
        $get_publish_stmt = $db->prepare($get_publish);
        $get_publish_status = $get_publish_stmt->execute(array(
          ':author' => $uid
        ));

        // 如果执行成功
        if($get_publish_status){
          // 如果这个用户有已发表的文章
          if($art_data = $get_publish_stmt->fetch()){
            $results = array();
            do {
              $result = array(
                'aid' => $art_data['aid'],
                'title' => $art_data['title'],
                'content' => $art_data['content'],
                'publishtime' => $art_data['publishtime']
              );
              array_push($results, $result);
            } while($art_data = $get_publish_stmt->fetch());

            $allRes = array(
              'author' => $author,
              'articles' => $results
            );

            // 200
            header('HTTP/1.1 200 OK');
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($allRes);
          } else {
            $no_article_flag = true;
          }
        } else {
          $no_article_flag = true;
        }

        if($no_article_flag){
          // 200 - 但是用户未发表任何文章
          header('HTTP/1.1 200 OK');
          header('Content-Type: application/json; charset=UTF-8');

          $allRes = array(
            'author' => $author,
            'articles' => array()
          );

          echo json_encode($allRes);
        }
      } else {
        // 404 - 用户不存在
        header('HTTP/1.1 404 Not Found');
        header('Content-Type: application/json; charset=UTF-8');
      }
    } else {
      // 404 - 非法参数
      header('HTTP/1.1 404 Not Found');
      header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    // 404 - 非法参数
    header('HTTP/1.1 404 Not Found');
    header('Content-Type: application/json; charset=UTF-8');
  }
