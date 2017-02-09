/*
* @Author: giulio
* @Date:   2016-03-08 20:55:44
* @Last Modified by:   giulio
* @Last Modified time: 2016-03-19 20:56:59
*/

SELECT *
FROM snformvar
WHERE id_form = '%id_form%'
ORDER BY isequence;

SELECT
'i_alert.png' as 'icon',
'Form %id_form% loaded' as 'sMessage';
