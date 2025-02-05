ALTER TABLE `abstimmungen_table` ADD `status` enum('running','finished') NOT NULL;--> statement-breakpoint
ALTER TABLE `abstimmungen_table` ADD `end_date` timestamp NOT NULL;