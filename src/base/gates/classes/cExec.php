<?php
/*
 * @Author: giulio
 * @Date:   2016-04-03 10:00:00
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 14:25:48
 */

namespace nsNessuno;

class cExec {
  var $data = "";
  var $varPrefix = "%";
  var $varSuffix = "%";

  /**
   * setData
   */
  function setData($data, $params = null) {
    $this->data = $data;
    if(!is_null($params)&&!empty($params)) {
      foreach($params as $k => $v) {
        $this->data = str_replace($this->varPrefix . $k . $this->varSuffix, ($v) , $this->data);
      }
    }
  }//setData

  /**
   * get data
   */
  function getData() {
    return $this->data;
  }// getData

  /**
   * execute the command
   */
  function execute() {
    $rs = shell_exec($this->data);
    // $rs = shell_exec($rs["sqlfile"],$param);
    return $rs;
  }//execute
}//cExec
?>
