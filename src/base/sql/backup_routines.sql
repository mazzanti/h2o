-- MySQL dump 10.13  Distrib 5.7.11, for Linux (i686)
--
-- Host: localhost    Database: jstest
-- ------------------------------------------------------
-- Server version	5.7.11
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'jstest'
--
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `StpAnagraficaSelect`(IN `params` TEXT)
BEGIN
	
	-- ------------------------------
	-- JSON structure
    -- ------------------------------

    SET @jsonParams = CAST(FROM_BASE64(params) AS CHAR);
    SET @jsonParams = CAST(@jsonParams as JSON);
    
    -- extract parameters JSON
    SET @id_form = JSON_EXTRACT(@jsonParams, '$.id_form');
    
    -- ------------------------------
    SET @id = JSON_EXTRACT(@jsonParams, '$.id');
    

    /*
	-- ------------------------------
	-- XML structure
    -- ------------------------------
    -- extract parameters XML
    SET @xmlParams = CAST(FROM_BASE64(params) AS CHAR(254));
    -- SET @xmlParams = CAST(@xmlParams as XML);
    
    -- SET @id_form = EXTRACTVALUE(@xmlParams, 'root/id_form/value[@columntype=0]');
    SET @id_form = EXTRACTVALUE(@xmlParams, '//@id_form');
	*/
	

    
	SELECT 
    *
FROM
    Anagrafica
    WHERE 1
    AND CASE
        WHEN '' <> @id THEN id LIKE @id
        ELSE TRUE
    END;

	
 	-- ------------------------------
	SELECT 'READY' as 'sMessage';
    
    -- ------------------------------
    SELECT sys_exec("uptime");
    SELECT sys_eval("uptime");
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `StpFormMainFill`(IN `p0` INT(11))
BEGIN
	SELECT *
	FROM snform;

	SELECT
	'i_alert.png' as 'icon',
	'WELCOME' as 'sMessage';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-01 16:34:57
