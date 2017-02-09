/*
* @Author: giulio
* @Date:   2016-03-08 20:55:44
* @Last Modified by:   giulio
* @Last Modified time: 2016-04-03 20:10:44
*/

-- SELECT * FROM Anagrafica;

SELECT * FROM Anagrafica WHERE 1
AND
CASE
  WHEN '' <> '%id%' THEN id LIKE '%id%'
  ELSE TRUE
END;

SELECT 'READY' as 'sMessage';
