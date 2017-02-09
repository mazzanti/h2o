<?php
/*
 * @Author: giulio
 * @Date:   2016-02-10 20:11:13
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 14:25:01
 */

namespace nsNessuno;

include("config.php");
include("classes/cDatabase.php");
include("classes/cBaseComponent.php");

// EXTRA SETTINGS!!!
$_GLOBAL["MAX_DBCONNECTIONS"] = 9999;
$_GLOBAL["MAX_TERMINALS"] = 9999;

//
$db1 = new cDatabase();
$bc1 = new cBaseComponent();

$db1->loadConfig($_GLOBAL["config"]["connectionstring"]);
$db1->setDataFormat($_GLOBAL["config"]["dataformat"]);
$db1->openDb();
$db1->setJson(0);

// compression start
// if(!ob_start("ob_gzhandler")) ob_start();

$param = $_REQUEST['param'];
$param = base64_decode($param);
$param = json_decode($param);

writeLog($param);

$sql = "SELECT * FROM snterminal WHERE ip = '*' OR ip = '" . addslashes(trim($_SERVER["REMOTE_ADDR"])) . "'";
$rs = $db1->eS($sql);

// limit connections
$sql = "SHOW STATUS WHERE `variable_name` = 'Threads_connected'";
$rsc = $db1->eS($sql);
if($rsc["aRows"][0]["Value"] > $_GLOBAL["MAX_DBCONNECTIONS"]) {
  exit;
}

if($rs["aRows"]) {
  $sql = "SELECT * FROM snvar WHERE idvar = '" . addslashes(trim($param->idvar)) . "'";
  $rs = $db1->eS($sql);
}

writeLog($rs);

if($rs["aRows"]) {
  $rs = $rs["aRows"][0];

  // if exec
  if($rs["type"] == "EXEC") {
    include("classes/cExec.php");
    $exec1 = new cExec();

    //echo shell_exec("uptime");
    $exec1->setData($rs["sqlfile"], $param);
    $res = $exec1->execute();
    writeLog($res);
    unset($exec1);

    $res = $db1->getStandardResponse($res);

    echo ($res);
  }//if exec

  // if email
  if($rs["type"] == "EMAIL") {
    include("common/class.phpmailer.php");
    include("classes/cEmail.php");

    $mail1 = new cEmail();
    $mail1->setData($rs["sqlfile"], $param);
    $mail1->execute();

    unset($mail1);
  }// if email

  // if query
  if($rs["type"] == "SQL_QUERY") {
    if($rs["sqlfile"]) {
      $db1->setColNames(1);
      $db1->setJson(1);
      $res = $db1->eSfile($rs["sqlfile"], $param);

      echo ($res);
    }
  }// if query

  // if stored
  if($rs["type"] == "SQL_STORED") {
    if($rs["sqlfile"]) {
      $db1->setColNames(1);
      $db1->setJson(1);
      $res = $db1->eSproc($rs["sqlfile"], $param);

      echo ($res);
    }
  }// if stored
}

// other usages:
// $rs = $db1->eS("SELECT * FROM user");
// $rs = $db1->eSMulti("SELECT * FROM user;");
// $rs = $db1->eSfile("../sqlroutines/FormGenericFill.sql",null);

$db1->closeDb();
unset($rs);
unset($db1);
unset($bc1);
?>
