CREATE TABLE `wpc1_wpforo_post_revisions` (
  `revisionid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userid` bigint(20) unsigned NOT NULL DEFAULT 0,
  `textareaid` varchar(50) NOT NULL,
  `postid` bigint(20) unsigned NOT NULL DEFAULT 0,
  `body` longtext DEFAULT NULL,
  `created` int(10) unsigned NOT NULL DEFAULT 0,
  `version` smallint(6) NOT NULL DEFAULT 0,
  `email` varchar(50) NOT NULL DEFAULT '',
  `url` text DEFAULT NULL,
  PRIMARY KEY (`revisionid`),
  KEY `userid_textareaid_postid_email` (`userid`,`textareaid`,`postid`,`email`,`url`(70))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci