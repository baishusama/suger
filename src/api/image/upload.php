<?php
  require '../config/DatabaseDevOnly.class.php';
  $db = new Database();

  date_default_timezone_set('Asia/Shanghai');

  // print_r($_FILES);
  // Array
  // (
  //     [file] => Array
  //         (
  //             [name] => chitanta.jpg
  //             [type] => image/jpeg
  //             [tmp_name] => /Applications/MAMP/tmp/php/phpqtbsI0
  //             [error] => 0
  //             [size] => 45191
  //         )
  // )
  //

  // print_r($_POST);
  $uid = $_POST['uid'];
  $aid = $_POST['aid'];

  // 1. 检查图片格式——放在前端啦/w\
  // foreach($_FILES as $img){
  //   if(!preg_match("!image!", $img['type'])){
  //     die("图片格式非法 :("); // test
  //   }
  // }

  // 2.
  // 创建目录
  $detailurl = "image/user/u$uid/a$aid";
  $ROOTDIR = 'http://baishu.applinzi.com/blog/public/' . $detailurl; // tobetested..

  $dir = "../../public/" . $detailurl;
  if (!file_exists($dir)) {
    // echo 'is going to mkdir..$dir : ' . $dir;
    mkdir($dir, 0777, true); // 第三个参数表示递归
    chmod($dir, 0777);
  }


  $flag = true;
  $insertFlag = false;
  $response = array();
  foreach($_FILES as $img){
    $img_dir = $dir . '/' . $img['name']; // 图片存放路径/图片名
    // 数据库操作需要的字段
    $url = $ROOTDIR . '/' . $img['name'];
    $lastuploadtime = date('Y-m-d H:i:s');
    // 如果图片已存在，做替换，不需要对数据库做改动
    if(file_exists($img_dir)){
      // 替换服务器上原有图片
      unlink($img_dir);
      if(move_uploaded_file($img['tmp_name'], $img_dir)){
        // 这里要先查询数据库
        $sql_slt_img = "SELECT * FROM `image` WHERE url=:url;";
        $stmt = $db->prepare($sql_slt_img);
        $stmt->execute(array(
          ':url' => $url
        ));

        // 如果数据库中已经存在记录，做更新
        if($stmt->rowCount() > 0){ // 这里简单起见，暂不考虑查询失败的情况。。
          // 更新数据库上的时间
          $sql_upd_img = "UPDATE `image` SET lastuploadtime=:lastuploadtime WHERE url=:url;";
          $stmt = $db->prepare($sql_upd_img);
          $status = $stmt->execute(array(
            ':lastuploadtime' => $lastuploadtime,
            ':url' => $url
          ));

          if($status){
            array_push($response, array(
              'name' => $img['name'],
              'url' => $url
            ));
          } else {
            array_push($response, array(
              'name' => "图片 " . $img['name'] . " 更新到数据库失败QvQ（但是替换成功，不妨碍使用～）",
              'url' => $url
            ));
            // $flag = false;
          }
        } else {
          // 如果数据库中尚未存在记录，做插入
          $insertFlag = true;
        }
      } else {
        array_push($response, array(
          'name' => "图片 " . $img['name'] . " 替换服务器上原有图片失败，请重试QAQ",
          'url' => ''
        ));
        $flag = false;
      }
    } else {
      // 如果图片不存在，上传到服务器，且添加到数据库
      // 上传图片到服务器
      if(copy($img['tmp_name'], $img_dir)){
        $insertFlag = true;
      } else {
        array_push($response, array(
          'name' => "图片 " . $img['name'] . " 上传到服务器失败，请重试QAQ",
          'url' => ''
        ));
        $flag = false;
        // die("图片上传到服务器失败 :(");
      }
    }
  }

  // 添加到数据库
  if($insertFlag){
    $sql_add_img = "INSERT INTO `image` (articleid,url,lastuploadtime) VALUES (:articleid,:url,:lastuploadtime);";
    $stmt = $db->prepare($sql_add_img);
    $status = $stmt->execute(array(
      ':articleid' => $aid,
      ':url' => $url,
      ':lastuploadtime' => $lastuploadtime
    ));

    // 响应
    if($status){
      array_push($response, array(
        'name' => $img['name'],
        'url' => $url
      ));
    } else {
      array_push($response, array(
        'name' => "图片 " . $img['name'] . " 插入到数据库失败，请重试QAQ",
        'url' => ''
      ));
      $flag = false;
    }
  }

  if($flag){
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/json; charset=UTF-8');
  } else {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
  }

  echo json_encode($response);
?>
