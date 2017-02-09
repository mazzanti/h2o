<?php
/*
 * @Author: giulio
 * @Date:   2016-02-10 20:11:13
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 14:24:21
 */

namespace nsNessuno;

$_GLOBAL["config"] = array(
  "dbtype" => "mysql",
  "connectionstring" => "host=127.0.0.1&schema=jstest&user=root&passwd=",
  "win_connectionstring" => "host=127.0.0.1&schema=jstest&user=root&passwd=",
  "linux_connectionstring" => "host=127.0.0.1&schema=jstest&user=root&passwd=",
  "id" => "0",
  "dataformat" => "json", //format data between stored procedure [json|xml]
  "debug" => "0" // enables logging
  );

$jsonConfig = json_encode($_GLOBAL["config"]);


/**
 * dump a string or object
 */
function jstest_dump($v) {
  echo "<code><pre>";
  print_r($v);
  echo "</pre></code>";
}//jstest_dump

/**
 * write to a log
 */
function writeLog($v) {
  global $_GLOBAL;

  if($_GLOBAL["config"]["debug"] == "1") {
    // debug mode
    if(is_string($v)) {
      $results = $v;
    } else{
      $results = print_r($v, true);
    }

    $sRow = sprintf("[%s%s %s %s %s %s %s]",
        date("Y-m-d H:i:s"),
        substr((string)microtime(), 1, 8),
        posix_getpid(),
        "TRACE",
        "app.php",
        $_SERVER['REMOTE_ADDR'],
        $results
    );

    $fp = fopen('app.log', 'a');
    fwrite($fp, $sRow);
    fwrite($fp, "\n");
    fclose($fp);
  }
}//writeLog
?>
