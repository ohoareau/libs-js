
# Table: `wpc1_options`
# Approximate rows expected in table: 752

# Delete any existing table `wpc1_options`

DROP TABLE IF EXISTS `wpc1_options`;

# Table structure of table `wpc1_options`

CREATE TABLE `wpc1_options` (
  `option_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `option_value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `autoload` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_name` (`option_name`),
  KEY `autoload` (`autoload`)
) ENGINE=InnoDB AUTO_INCREMENT=137884 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

# Data contents of table `wpc1_options`

 
INSERT INTO `wpc1_options` VALUES (1, 'siteurl', 'https://depassezvous.fr', 'yes'),
 (2, 'home', 'https://depassezvous.fr', 'yes'),
 (3, 'blogname', 'Challenge #dépassezvous', 'yes'),
 (4, 'blogdescription', 'Devenez une meilleure version de vous-même', 'yes'),
 (5, 'users_can_register', '0', 'yes'),
 (6, 'admin_email', 'julien.redelsperger@gmail.com', 'yes'),
 (7, 'start_of_week', '1', 'yes'),
 (8, 'use_balanceTags', '0', 'yes'),
 (9, 'use_smilies', '1', 'yes'),
 (10, 'require_name_email', '1', 'yes');