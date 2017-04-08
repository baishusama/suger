<?php
  // function removeDirectory($path){
  //   $i = new DirectoryIterator($path);
  //
  //   foreach($i as $f){
  //     if($f->isFile()){
  //       unlink($f->getRealPath());
  //     } else if (!$f>isDot() && $f->isDir()){
  //       rmdir($f->getRealPath());
  //     }
  //   }
  //   rmdir($path);
  // }

  // a NOT recursive way (tobetested)
  // array_map('unlink', glob("$dirname/*.*"));
  // rmdir($dirname);

  function rrmdir($dir){
    if(is_dir($dir)){
      $objects = scandir($dir);
      foreach($objects as $obj){
        if($obj !== '.' && $obj !== '..'){
          $tmp = $dir . '/' . $obj;
          if(is_dir($tmp))
            rrmdir($tmp);
          else
            unlink($tmp);
        }
      }
      rmdir($dir);
    }
  }
