CREATE TABLE `abstimmungen_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `abstimmungen_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `vote_table` ADD `abstimmung_id` int NOT NULL;