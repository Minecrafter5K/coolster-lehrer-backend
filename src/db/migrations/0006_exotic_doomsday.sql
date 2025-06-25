CREATE TABLE `lehrer_photo_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photo` mediumblob NOT NULL,
	CONSTRAINT `lehrer_photo_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lehrer_table` ADD `photo_id` int;--> statement-breakpoint
ALTER TABLE `lehrer_table` ADD CONSTRAINT `lehrer_table_photo_id_lehrer_photo_table_id_fk` FOREIGN KEY (`photo_id`) REFERENCES `lehrer_photo_table`(`id`) ON DELETE set null ON UPDATE cascade;