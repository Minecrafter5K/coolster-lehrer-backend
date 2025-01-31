CREATE TABLE `lehrer_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `lehrer_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vote_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`lehrer_id` int NOT NULL,
	`vote` int NOT NULL,
	CONSTRAINT `vote_table_id` PRIMARY KEY(`id`)
);
