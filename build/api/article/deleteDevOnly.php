<?php
  require '../config/DatabaseDevOnly.class.php';
  require '../config/rrmdir.php';
  $db = new Database();

  $data = json_decode(file_get_contents('php://input'));
  $aid = $data->aid;
  // $aid = $_POST['aid'];

  // 在 delete 之前，先获取图片路径中的 $uid
  $sel_sql = "SELECT * FROM `article` WHERE aid=:aid;";
  $sel_stmt = $db->prepare($sel_sql);
  $sel_status = $sel_stmt->execute(array(
    ':aid' => $aid
  ));
  if($sel_status){
    if($sel_stmt->rowCount() > 0){
      $to_be_deleted = $sel_stmt->fetch();
      $uid = $to_be_deleted['author'];
    } else {
      // 400
      header('HTTP/1.1 400 Bad Request');
      header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    // 500
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
  }

  // Delete from `article`
  $del_sql = "DELETE FROM `article` WHERE aid=:aid;";
  $del_stmt = $db->prepare($del_sql);
  $del_status = $del_stmt->execute(array(
    ':aid' => $aid
  ));

  // Delete from `image`
  $del_img_sql = "DELETE FROM `image` WHERE articleid=:articleid;";
  $del_img_stmt = $db->prepare($del_img_sql);
  $del_img_status = $del_img_stmt->execute(array(
    ':articleid' => $aid
  ));

  if($del_status && $del_img_status){
    if($del_stmt->rowCount() > 0){
      $detailurl = "image/user/u$uid/a$aid";

      // for 本地预编译机制（上线后需要删除）
      $DirDevOnly = "../../../src/" . $detailurl; // todo..后期上线需要修改
      if(file_exists($DirDevOnly)){
        echo '$DirDevOnly : ' . $DirDevOnly;
        rrmdir($DirDevOnly);
      }

      // 手动删除服务器上的图片文件（夹）
      $dir = "../../public/" . $detailurl;
      if(file_exists($dir)){
        echo '$dir : ' . $dir;
        rrmdir($dir);
      }

      header('HTTP/1.1 200 OK');
      header('Content-Type: application/json; charset=UTF-8');
      echo $aid;
    } else {
      header('HTTP/1.1 400 Bad Request');
      header('Content-Type: application/json; charset=UTF-8');
    }
  } else {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
  }
?>
