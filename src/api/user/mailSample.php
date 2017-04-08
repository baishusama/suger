<?php
  /**
   * mailSample.php 是 mail.php 的一个示意。
   * 前者隐藏了后者中包含的敏感信息（我真实使用中的邮箱的用户名密码等）。
   * 请求的两个文件来自 PHPMailer @GitHub：
   * 1. https://github.com/PHPMailer/PHPMailer/blob/master/class.phpmailer.php
   * 2. https://github.com/PHPMailer/PHPMailer/blob/master/class.smtp.php
   * 由于这两个文件体积较大且与核心代码无关，故在 .gitignore 中做了忽略处理。
   */
  require_once '../config/class.phpmailer.php';
  require_once '../config/class.smtp.php';

  function send_mail_to($username, $email, $hash){
    // // 发送验证邮件到邮箱
    $to = $email;
    $subject = "账号认证（ 来自 Suger ）";
    $message_alt_body = '
    <p>你好 '.$username.'，</p>
    <p>感谢你在 Suger 上的注册～</p>
    <p>请点击下面的链接来激活你的账户:</p>
    <p><a href="http://baishu.applinzi.com/blog/#!/verify/'.$email.'/'.$hash.'" target="_blank">点我激活 Suger 上的账号～</a></p>
    <p>P.S. 如非本人操作，请忽略本邮件。</p>
    <p>---</p>
    <p>Suger - 白鼠のBLOG</p>
    <p>（这是一封自动产生的email，请勿回复。）</p>';

    // <p>http://baishu.applinzi.com/blog/#!/verify?email='.$email.'&hash='.$hash.'</p>

    // // Way 1. PHP 原生
    // mail( $to, $subject, $message_body ); // todo.. 需要等上线进行测试。。

    // // Way 2. SAE 云邮件 API
    // $mail = new SaeMail();
    // $smtpaccount = "myEmail@163.com";
    // $smtppwd = "myEmailPassword";
    // // $smtphost = "smtp.163.com";
    // // $smtpport = 25;
    // $result = $mail->quickSend($to,$subject,$message_body,$smtpaccount,$smtppwd);
    // // 发送失败时输出错误码和错误信息
    // if ($ret === false){
    //   var_dump($mail->errno(), $mail->errmsg());
    // } else {}

    // Way 3. 一个 php mail 的第三方
    // https://github.com/PHPMailer/PHPMailer/

    $mail = new PHPMailer;

    $mail->CharSet ="UTF-8";                                 // 邮件包含中文信息
    $mail->isSMTP();                                         // Set mailer to use SMTP
    $mail->Host = 'smtp.163.com';                            // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                                  // Enable SMTP authentication
    $mail->Username = 'myEmail@163.com';                   // SMTP username
    $mail->Password = 'myEmailPassword';                        // SMTP password
    $mail->SMTPSecure = 'ssl';                               // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;                                       // TCP port to connect to

    $mail->setFrom('myEmail@163.com', 'myEmailName');
    $mail->addAddress($to);                                  // Name is optional

    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = $subject;
    $mail->Body    = $message_alt_body;
    $mail->AltBody = $message_alt_body;

    if(!$mail->send()) {
        echo json_encode("但是验证邮件发送失败 Orz.. Mailer Error: " . $mail->ErrorInfo);

        // 响应
        header('HTTP/1.1 201 Created'); // 为了区分 200，可能有更好的解决方案？
        header('Content-Type: application/json; charset=UTF-8');
    } else {
        echo json_encode("请尽快查收验证邮件～");

        // 响应
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=UTF-8');
    }
  }
?>
