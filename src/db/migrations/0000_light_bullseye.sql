CREATE TABLE `lehrer_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`coolness` int NOT NULL,
	CONSTRAINT `lehrer_table_id` PRIMARY KEY(`id`)
);
