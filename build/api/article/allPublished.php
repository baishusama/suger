<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  // 选取数据库中已经发布的文章，按照发布时间降序
  $sql = "SELECT * FROM `article` WHERE published=1 AND abandoned=0 ORDER BY publishtime DESC;";
  $stmt = $db->prepare($sql);
  $status = $stmt->execute();

  // $fail_flag = false; // 失败的 flag
  if($status && $stmt->rowCount() > 0){
    // 响应
    if($data = $stmt->fetch()){
      $results = array();

      // 循环文章们
      do {
        // 获取文章的作者信息
        $get_author = "SELECT * FROM `user` WHERE uid=:uid;";
        $get_author_stmt = $db->prepare($get_author);
        $get_author_status = $get_author_stmt->execute(array(
          ':uid' => $data['author']
        ));

        if($get_author_status) {
          $author_data = $get_author_stmt->fetch();
        } else {
          // temp
          header('HTTP/1.1 404 Not Found');
          header('Content-Type: application/json; charset=UTF-8');
        }

        // // 获取文章的首图（可能不存在）
        // $get_cover = "SELECT * FROM `image` WHERE articleid=:articleid; ORDER BY i;";
        // $get_cover_stmt = $db->prepare($get_cover);
        // $get_cover_status = $get_cover_stmt->execute(array(
        //   ':articleid' => $data['aid']
        // ));
        //
        // if($get_cover_status){
        //   if($get_cover_stmt->rowCount() > 0){
        //     $cover_data = $get_cover_stmt->fetch();
        //   } else {
        //     // 空处理
        //     $cover_data = array(
        //       'url' => ""
        //     );
        //   }
        // } else {
        //   $fail_flag = true; // 失败了！
        // }

        $result = array(
          'aid' => $data['aid'],
          'title' => $data['title'],
          'content' => $data['content'],
          'publishtime' => $data['publishtime'],
          // 'cover' => $cover_data['url'], // 交给 content 渲染得到
          'uid' => $author_data['uid'],
          'author' => $author_data['uname'],
          'avatar' => $author_data['avatar'],
          'role' => $author_data['role']
        );
        array_push($results, $result);
      } while($data = $stmt->fetch());

      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
      echo json_encode($results);
    } else {
      // no need to (because $status===false means nothing is selected)
    }
  } else {
    header('HTTP/1.1 204 No Content');
    header('Content-Type: application/json; charset=UTF-8');
  }
