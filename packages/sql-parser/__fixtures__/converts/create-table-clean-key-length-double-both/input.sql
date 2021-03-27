CREATE TABLE `wpc1_wpforo_logs` (
  `logid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sessionid` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  PRIMARY KEY (`logid`),
  KEY `sessionid_key` (`sessionid`(20),`key`(160))
) ENGINE=InnoDB AUTO_INCREMENT=353 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci