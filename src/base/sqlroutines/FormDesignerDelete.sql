/*
* @Author: giulio
* @Date:   2016-03-08 20:55:44
* @Last Modified by:   giulio
* @Last Modified time: 2016-03-12 00:25:04
*/

-- INSERT INTO snform SET ;
-- FROM_BASE64(TO_BASE64('abc'));
-- SET @p=FROM_BASE64('%param%');

DELETE FROM snformvar
WHERE id_form = '%id_form%';

SELECT 'Items deleted' as 'sMessage';
