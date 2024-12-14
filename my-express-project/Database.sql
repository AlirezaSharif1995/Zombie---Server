CREATE DATABASE  IF NOT EXISTS `zombie-city-database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `zombie-city-database`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: zombie-city-database
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` varchar(255) DEFAULT NULL,
  `receiver` varchar(255) DEFAULT NULL,
  `message` text,
  `timestamp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (17,'98722','23441','idid','10 , 41 , 12 , 12 , 2024'),(18,'23441','98722','   ','10 , 41 , 12 , 12 , 2024'),(19,'98722','23441','ii','10 , 41 , 12 , 12 , 2024'),(20,'98722','23441','    ','10 , 41 , 12 , 12 , 2024'),(21,'98722','23441','oslzkz','10 , 41 , 12 , 12 , 2024'),(22,'23441','98722',',,??','12 , 6 , 12 , 12 , 2024'),(23,'23441','98722','????????','12 , 6 , 12 , 12 , 2024');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roomsockets`
--

DROP TABLE IF EXISTS `roomsockets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roomsockets` (
  `id` int NOT NULL,
  `roomName` varchar(45) NOT NULL,
  `location` int NOT NULL,
  `socketPort` varchar(250) NOT NULL,
  `playersCount` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `roomName_UNIQUE` (`roomName`),
  UNIQUE KEY `socketPort_UNIQUE` (`socketPort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roomsockets`
--

LOCK TABLES `roomsockets` WRITE;
/*!40000 ALTER TABLE `roomsockets` DISABLE KEYS */;
INSERT INTO `roomsockets` VALUES (1,'tehranRoom1',1,'5000',0),(2,'tehranRoom2',1,'5010',0),(3,'tehranRoom3',1,'5020',0),(4,'isfahanRoom1',2,'5030',0),(5,'isfahanRoom2',2,'5040',0),(6,'isfahanRoom3',2,'5050',0),(7,'khorasanRoom1',3,'5060',0),(8,'rashtRoom1',4,'5070',0),(9,'khozestanRoom1',5,'5080',0),(10,'kermanRoom1',6,'5090',0),(11,'tabrizRoom1',7,'5100',0),(12,'semnanRoom1',8,'5110',0),(13,'shirazRoom1',9,'5120',0),(14,'shirazRoom2',9,'5130',0),(15,'zahedanRoom1',10,'5140',0),(16,'globalRoom1',0,'37.255.218.236:3000',0),(17,'globalRoom2',0,'5160',0),(18,'globalRoom3',0,'5170',0),(19,'globalRoom4',0,'5180',0),(20,'globalRoom5',0,'5190',0);
/*!40000 ALTER TABLE `roomsockets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT 'Fighter',
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(45) DEFAULT 'Iran',
  `friendsList` varchar(255) DEFAULT NULL,
  `recivedRequests` varchar(255) DEFAULT NULL,
  `characterId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=98723 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (19,'alireza','alireza@gmail.com','$2b$10$GfUJAw9kfd7bbsLpWcKvauYo5AQfrHafqsypgKZAZp4kGqMYJDbHe','2024-04-22 08:17:53','2',NULL,'',NULL),(20,'alireza','123@123.com','$2b$10$AzueD6TGPWhoiuilcSG.cOYi0zJdddRwQ.sJz6u9o/Ba.kJ55Ll02','2024-04-22 09:03:08','1','[31,31,29,25]',NULL,NULL),(21,'nader','ali@ee.com','$2b$10$0yYVbKMCX.b17TrIegujyeA1.zhUb4JoQsTeIdgrpb.MUY./zYdPW','2024-04-22 09:10:34','8','[60748]','[]',NULL),(22,NULL,'ss@dd.com','$2b$10$hNf21Z6YVRSPSKq5CKjreOLuKm5gCuGDpEXv5N/ZspM9pdiORuFau','2024-04-22 09:29:40','0',NULL,NULL,NULL),(23,NULL,'asd@dsa.c','$2b$10$PE.ZmTeO1Bd8taDHCelwCe2pdanlB3oRrpIFhFKzae4gjrauHVds6','2024-04-22 09:35:17','0',NULL,NULL,NULL),(24,'ramin','ali@dd.c','$2b$10$hUh1jQxy2HOa4NxNNXkOouVQmvjL/7vpoo/SdClK8zhWYiJSNU2Ta','2024-04-22 10:10:02','0',NULL,'[34]',NULL),(25,'armin','ds@dsa.c','$2b$10$qpEbpNEeNdbYhCpNUxVofubFTsvoG6vxtjm7WmCPWzO.El4cWCMFS','2024-04-22 10:27:07','0','[]','[]',NULL),(26,'mahan','sad@da.com','$2b$10$xiEvHMo/TtkPtwH.L0tpf.UQy.OnM6PdCH8RTpEQ1.77fOWG26mjq','2024-04-22 11:19:11','0',NULL,NULL,NULL),(27,'asdsa','ali@r.v','$2b$10$mmnQ5fAri3lzrRCO4yozD.LaLLgiPgB5zUro8N7/lO3gWdH.BAYw6','2024-04-22 12:42:08','0',NULL,NULL,NULL),(28,'amin','rsad@sac.sa','$2b$10$1jRRKMnPkfoNmNBKDKXYO.3NVwKO22PXQtW3Go9HRyiWbRB7XAa3O','2024-04-22 13:02:53','0','[25,35]','[34]',NULL),(29,'gh','asdasd@das.asd','$2b$10$ZP5DALGtKoOJkFqcL6oAs.NNUlxFzAGCKziIu3A18AQhXMyCRdiSG','2024-04-22 13:06:14','1','[]',NULL,NULL),(30,'ali','ali@asda.c','$2b$10$GNrNKn/RgmiGA4g6CkVOI..ahpIz7322QhigshRbVAO0Cx..nepii','2024-04-23 09:43:11','2','[]','[34]',NULL),(31,'t','uu@qq.m','$2b$10$PY3uYxNiS9Tm4F2F.wPzCu/.CLILR/NBoh2TuTIfHpVZ9YmrauPOu','2024-04-23 09:45:50','3',NULL,NULL,NULL),(32,NULL,'user1@u.c','$2b$10$jptC3RZ5or/wcTI51Dpbt.fkL69a5u9co3Z7CjDqQiq2pkPL2a3Gu','2024-04-24 10:43:43','4',NULL,NULL,NULL),(33,'reza','user2@u.c','$2b$10$kIgaayRyuQ1KFdKkANY7DedNTNsTyBMaf1SCutrffSzzGUnWAEpje','2024-04-24 10:44:18','5',NULL,'[29]',NULL),(34,'ali','ali@o.o','$2b$10$r62el0cpW1pFYASOa5qs9.CW.1P9XdYGqgLQ1mCuB3DMgxSsvjKVy','2024-04-27 13:46:10','6','[28]','[]',NULL),(35,'alireza','ali@alif.com','$2b$10$3qrs1WxBvKt80uLEOTjNaeZd6E00O7BCbIwz6VXWAU0wDCeDAJ9iO','2024-04-28 08:16:46','7','[28]','[]',NULL),(23441,'amir4k','a.a@gmail.com','$2b$10$urVaolfXI33kIBw7sK3B5.29EwOwTd3UAKGkd5asOICytpbT7xfvC','2024-12-12 07:00:33','0','[98722]',NULL,20),(34886,'ty','sdfsdfsdf@dasf.cvom','$2b$10$uaPyrtmzAr9IdpeuCvfSM.n7YcNKGEjlBmsGTKGzKfEOsMv99jMZK','2024-12-12 06:16:54','0',NULL,NULL,11),(53922,'ali2','ali2@ali2.com','$2b$10$.o/aQUcrgd4BrRtN9gP9gezCFRZae.RmSpoJW1OJP2pH/JHheU3fG','2024-12-12 06:15:29','0',NULL,NULL,NULL),(60748,'username','sample@sample.com','$2b$10$hfoYSg1XaTVgzbDZqmvFleX4gIQpEWbz4cC2zUcuwJwsPgvNyGyhC','2024-05-19 08:41:34','0','[21]','[]',NULL),(98722,'salam','uhhufd4ese3@rxdrr.com','$2b$10$9gZEjwyCF3vPexyKrZDMrOIPSzilwY83e37c3mXVgTa05HajP6An.','2024-12-12 06:54:50','0','[23441]',NULL,10);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'zombie-city-database'
--

--
-- Dumping routines for database 'zombie-city-database'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-14 12:09:00
