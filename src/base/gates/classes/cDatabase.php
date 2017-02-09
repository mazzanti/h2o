<?php
/*
 * @Author: giulio
 * @Date:   2016-02-10 20:11:13
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 14:23:28
 */

namespace nsNessuno;

//SHOW STATUS WHERE `variable_name` = 'Threads_connected'
class cDatabase {
  var $aFields = array();
  var $rsConnection = null;
  var $iJson = 0;
  var $iColNames = 0;
  var $iSqli = 0;
  var $varPrefix = "%";
  var $varSuffix = "%";
  var $sDataFormat = "json";

  //TODO: add support to stored procedures
  /**
   * open database
   */
  function openDb() {
    $this->rsConnection = mysqli_connect($this->aFields["sHost"], $this->aFields["sUser"], $this->aFields["sPasswd"],$this->aFields["sSchema"]);
    $this->rsConnection->set_charset("utf8");
    if(!$this->rsConnection) $this->rsConnection = null;
  }//dbOpen

  /**
   * close database
   */
  function closeDb() {
   $this->rsConnection->close();
    }//dbClose

  /**
   * select a db
   */
  function selectDb($v) {
   $this->rsConnection->select_db($v);
  }//selectDb

  /**
   * load configuration in url style
   */
  function loadConfig($v) {
    parse_str($v, $parts);

    $this->aFields["sHost"] = $parts['host'];
    $this->aFields["sUser"] = $parts['user'];
    $this->aFields["sPasswd"] = $parts['passwd'];
    $this->aFields["sSchema"] = $parts['schema'];
   }//loadConfig

  /*
   * get with col names
   */
  function getColNames( $row ) {
    $rs = array();
    foreach ($row as $k => $v) {
      $rs[]=($k);
    }
    return $rs;
  }//getColNames

  /*
   * get row values
   */
  function getRowValues( $row ) {
    $rs = array();
    foreach ($row as $k => $v) {
      $rs[]=($v);
    }
    return $rs;
  }//getRowValues

  /**
   * execute sql
   */
  function eS($sql) {
    $result = $this->rsConnection->query($sql );

    $rs = array();

    $rs["error"]["code"] = 0;
    $rs["iRows"] = 0;

    if ($result) {
      // $rs["iRows"] = $result->num_rows;
      // if(is_null($rs["iRows"])) {
      $rs["iRows"] = mysqli_affected_rows($this->rsConnection);
      // }
      while($row = mysqli_fetch_assoc($result)) {
        if($this->iColNames == 1) {
          $rs["aColNames"] = $this->getColNames($row);
          $rs["aRows"][] = $this->getRowValues($row);
        } else {

          $rs["aRows"][] = $row;
        }

      }
    } else {
      $rs["error"]["code"] = 1;
      $rs["error"]["msg"] = mysqli_error($this->rsConnection);
    }

    if($this->iJson == 1) {
      return json_encode($rs);
    }

    return $rs;
   }//eS

  /**
   * execute sql
   */
  function eSMulti($sql) {
    $rs = [];
    $icount=0;
    $rs['error']['code'] = '';
    $rs['error_list'] = '';

    if ($this->rsConnection->multi_query($sql)) {
      do {
        if ($result = $this->rsConnection->store_result()) {
          $rs["aRes"][$icount]["iRows"] =$result->num_rows;
          while ($row = $result->fetch_assoc()) {
            if($this->iColNames == 1) {
              $rs["aRes"][$icount]["aColNames"] = $this->getColNames($row);
              $rs["aRes"][$icount]["aRows"][] = $this->getRowValues($row);
            } else {
              $rs["aRes"][$icount]["aRows"][] = $row;
            }

          }
          $result->free();
        }
        $icount++;
        $gonext = false;
        if ($this->rsConnection->more_results()) {
          $gonext = true;
          $this->rsConnection->next_result();
        }
      } while ($gonext);
    }

    $rs['error']['code'] = $this->rsConnection->errno;
    $rs['error_list'] = $this->rsConnection->error_list;

    if($this->iJson == 1) {
      return json_encode($rs);
    }

    return $rs;
   }//eSMulti

  /**
   * execute sql from file
   */
  function eSfile($fp, $params = null) {
    $data = file_get_contents($fp);
    if(!is_null($params)&&!empty($params)) {
      foreach($params as $k => $v) {
        $data = str_replace($this->varPrefix . $k . $this->varSuffix, $this->cleanSql($v) , $data);
      }
    }

    $data = $this->cleanOtherVariables($data);

    return $this->eSMulti($data);
    // return $this->eS($data);
  }//eSfile

  /**
   * get params in json string
   */
  function getStpJsonParams($params) {
    $sparams = "";
    $c = 0;
    if( !is_null($params) && !empty($params) ) {
      $sparams = "{";
      foreach($params as $k => $v) {
        if($c) {
          $sparams .= ",";
        }
        $sparams .= "\"" . $this->cleanSql($k) . "\":";
        $sparams .= "\"" . $this->cleanSql($v) . "\"";
        $c++;
      }

      $sparams .= "}";
    }

    return base64_encode($sparams);
      // return base64_encode($this->cleanSql($sparams));
      // return $this->cleanSql($sparams);
  }//getStpJsonParams

  /**
   * [getStpParamsString description]
   * @param  [type] $params [description]
   * @return [type]         [description]
   */
  function getStpParamsString($params) {
    $sparams = "";
    $c = 0;
    if( !is_null($params) && !empty($params) ) {
      foreach($params as $k => $v) {
        if($c) {
          $sparams .= ",";
        }
        $sparams .= "\"" . $this->cleanSql($v) . "\"";
        $c++;
      }
    }
    return $sparams;
  }//getStpParamsString

  /**
   * get params in xml string
   */
  function getStpXmlParams($params) {
    return base64_encode($this->array2xml($params));
  }//getStpXmlParams

  /**
   * execute stored procedure
   */
  function eSproc($name, $params = null) {
    // call stored procedure with parameter

   // params separated by ,
   // $sparams = $this->getStpParamsString($params);

    if($this->getDataFormat() == "json") {
      //json string params
      $sparams = $this->getStpJsonParams($params);
    }

    if($this->getDataFormat() == "xml") {
      //xml string params
      $sparams = $this->getStpXmlParams($params);
    }

    $sql = "CALL {$name} (\"{$sparams}\");";
    return $this->eSmulti($sql);

    // $rs = $db1->eS("CALL StpAnagraficaSelect (2);");
    // return $this->eS($sql);
  }//eSproc

  /**
   * set json output
   */
  function setJson($v) {
    $this->iJson = $v || 0;
  }//setJson

  /**
   * set colnames
   */
  function setColNames($v) {
    $this->iColNames = $v || 0;
  }//setColNames

/**
 * set the data format
 */
function setDataFormat($v) {
  $this->sDataFormat = $v;
}//setDataFormat

/**
 * get the data format
 */
function getDataFormat() {
  return $this->sDataFormat;
}//getDataFormat

  /**
   * clean sql
   */
  function cleanSql($v) {
    return addslashes(trim($v));
  }//cleanSql

  /**
   * clean other variables
   */
  function cleanOtherVariables($v) {
    $pattern = '/\%(\w+)\%/i';
    return preg_replace($pattern, "", $v);
  }// cleanOtherVariables

  /**
   * convert array to an xml structure
   */
  function array2xml($array, $node_name="root") {
    $dom = new DOMDocument('1.0', 'UTF-8');
    $dom->formatOutput = true;
    $root = $dom->createElement($node_name);
    $dom->appendChild($root);

    $array2xml = function ($node, $array) use ($dom, &$array2xml) {
      foreach($array as $key => $value){
        if ( is_array($value) ) {
          $n = $dom->createElement($key);
          $node->appendChild($n);
          $array2xml($n, $value);
        }else{
          $attr = $dom->createAttribute($key);
          $attr->value = $value;
          $node->appendChild($attr);
        }
      }
    };

    $array2xml($root, $array);

    return $dom->saveXML();
  }//array2xml

  /**
   * return a standard response
   */
  function getStandardResponse($v) {
    $json["aRes"][0]["iRows"] = "1";
    $json["aRes"][0]["aColNames"] = array("sValue");
    $json["aRes"][0]["aRows"] = array(array($v));
    return json_encode($json);
  }//getStandardResponse

}//cDatabase
?>
