CREATE TABLE `wpc1_mepr_tax_rate_locations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tax_rate_id` bigint(20) NOT NULL,
  `location_code` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_tax_rate_id` (`tax_rate_id`),
  KEY `mp_location_type` (`location_type`),
  KEY `mp_location_code` (`location_code`(191)),
  KEY `mp_location_type_code` (`location_type`,`location_code`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci