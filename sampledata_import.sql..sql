CREATE DATABASE  IF NOT EXISTS `school_resources_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `school_resources_db`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'Water Lilies','Arts','Biography','','','','','','',1,1),(2,'Mona Lisa','Arts','Painting','1503-1506','Oil on poplar panel','77cm x53 cm','Musee du Louvre, Paris','','',1,2),(3,'Pythagorean theorem','Mathematics','Theorem','','','','','','',2,NULL),(4,'Euclidean geometry','Mathematics','Biography','','','','','','',2,3),(5,'Quicksort','Mathematics','Algorithm','','','','','','',2,NULL),(6,'Bill Gates','Technology','Biography','','','','','','',3,4),(7,'Steve Jobs','Technology','Biography','','','','','','',3,5),(8,'Java','Technology','Programming Language','','','','','James Gosling','Sun Microsystems',3,6);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
INSERT INTO `people` VALUES (1,'Claude Monet','1840','1926','French','Painter','Water Lilies','Oscar-Claude Monet was a French painter, a founder of French Impressionist painting and the most consistent and prolific practitioner of the movement\'s philosophy of expressing one\'s perceptions before nature, especially as applied to plein air landscape painting.'),(2,'Leonardo da Vinci','1452','1519','Italian','Art and Science','Mona Lisa, The Last Supper','Leonardo di ser Piero da Vinci was an Italian polymath of the Renaissance whose areas of interest included invention, painting, sculpting, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, writing, history, and cartography.'),(3,'Euclid','4th century BC','3rd century BC','','Euclidean geometry','','Euclid, sometimes given the name Euclid of Alexandria, was a Greek mathematician, often referred to as the \"founder of geometry\". His Elements is one of the most influential works in the history of mathematics.'),(4,'Bill Gates','1955','','USA','Founder of the Microsoft Corporation','','William Henry Gates III is an American business magnate, investor, author, philanthropist, humanitarian, and principal founder of Microsoft Corporation.'),(5,'Steve Jobs','1955','2011','USA','Co-creator of the Macintosh, iPod, iPhone, iPad, and first Apple Stores','','Steven Paul Jobs was an American entrepreneur and business magnate. He was the co-founder, chairman, and CEO of Apple Inc.'),(6,'James Gosling','','','','','','James Gosling is the creator of the Java programming language.'),(7,'Claude Monet','1840','1926','French','Painter','Water Lilies','Oscar-Claude Monet was a French painter, a founder of French Impressionist painting and the most consistent and prolific practitioner of the movement\'s philosophy of expressing one\'s perceptions before nature, especially as applied to plein air landscape painting.'),(8,'Leonardo da Vinci','1452','1519','Italian','Art and Science','Mona Lisa, The Last Supper','Leonardo di ser Piero da Vinci was an Italian polymath of the Renaissance whose areas of interest included invention, painting, sculpting, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, writing, history, and cartography.'),(9,'Euclid','4th century BC','3rd century BC','','Euclidean geometry','','Euclid, sometimes given the name Euclid of Alexandria, was a Greek mathematician, often referred to as the \"founder of geometry\". His Elements is one of the most influential works in the history of mathematics.'),(10,'Bill Gates','1955','','USA','Founder of the Microsoft Corporation','','William Henry Gates III is an American business magnate, investor, author, philanthropist, humanitarian, and principal founder of Microsoft Corporation.'),(11,'Steve Jobs','1955','2011','USA','Co-creator of the Macintosh, iPod, iPhone, iPad, and first Apple Stores','','Steven Paul Jobs was an American entrepreneur and business magnate. He was the co-founder, chairman, and CEO of Apple Inc.'),(12,'James Gosling','','','','','','James Gosling is the creator of the Java programming language.');
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'Arts'),(2,'Mathematics'),(3,'Technology'),(4,'Arts'),(5,'Mathematics'),(6,'Technology'),(7,'Arts'),(8,'Mathematics'),(9,'Technology');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'school_resources_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-02  1:55:33
