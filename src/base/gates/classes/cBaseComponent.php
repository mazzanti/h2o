<?php
/*
 * @Author: giulio
 * @Date:   2016-02-10 20:11:13
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 14:25:28
 */

namespace nsNessuno;

class cBaseComponent {
  var $dbconnections = array();

  function addDbConnection($v) {
    $this->dbconnections[] = $v;
  }
}
?>
