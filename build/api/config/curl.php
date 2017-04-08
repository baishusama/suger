<?php
function post_by_curl($remote_server, $post_arr){
  $author = $post_arr->author;
  $title = $post_arr->title;
  $fields = array(
    'author' => urlencode($author),
    'title' => urlencode($title)
  );
  //url-ify the data for the POST
  foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
  $fields_string = rtrim($fields_string,'&');

  $options = array(
    // CURLOPT_RETURNTRANSFER => false,
    // CURLOPT_HEADER         => true,         // return headers
    // CURLOPT_ENCODING       => "",           // handle all encodings
    CURLOPT_URL => $remote_server,
    CURLOPT_POST => count($fields),                      // i am sending post data
    CURLOPT_POSTFIELDS => $fields_string
    // CURLOPT_RETURNTRANSFER => true,
    // CURLOPT_USERAGENT => "Suger's CURL beta"
  );

  //open connection
  $ch = curl_init();
  curl_setopt_array($ch, $options);
  $data = curl_exec($ch);
  curl_close($ch);

  return $data;
}
?>
