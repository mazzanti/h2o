/*
* @Author: giulio
* @Date:   2016-03-08 20:55:44
* @Last Modified by:   giulio
* @Last Modified time: 2016-04-09 18:32:52
*/

-- INSERT INTO snform SET ;
-- FROM_BASE64(TO_BASE64('abc'));
-- SET @p=FROM_BASE64('%param%');

UPDATE Anagrafica SET
var1 = '%var1%',
var2 = '%var2%',
var3 = '%var3%'
WHERE id = '%id%';

SELECT 'SAVE OK' as 'sMessage';
