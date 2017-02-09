/*
* @Author: giulio
* @Date:   2016-03-08 20:55:44
* @Last Modified by:   giulio
* @Last Modified time: 2016-03-29 20:26:21
*/

-- INSERT INTO snform SET ;
-- FROM_BASE64(TO_BASE64('abc'));
-- SET @p=FROM_BASE64('%param%');

INSERT INTO snformvar SET
id_form = '%id_form%',
id_parent = '%id_parent%',
isequence = '%isequence%',
stype = '%stype%',
sname = '%sname%',
sproperties = '%sproperties%';

SELECT 'SAVE OK' as 'sMessage';
