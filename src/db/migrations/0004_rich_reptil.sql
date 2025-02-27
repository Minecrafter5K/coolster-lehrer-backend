CREATE TABLE `passkey_table` (
	`cred_id` varchar(255) NOT NULL,
	`cred_public_key` BLOB NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`webauthn_user_id` varchar(255) NOT NULL,
	`counter` int NOT NULL,
	`backup_eligible` boolean NOT NULL,
	`backup_status` boolean NOT NULL,
	`transports` varchar(512) NOT NULL,
	`created_at` timestamp NOT NULL,
	`last_used` timestamp NOT NULL,
	CONSTRAINT `passkey_table_cred_id` PRIMARY KEY(`cred_id`)
);
--> statement-breakpoint
CREATE TABLE `user_table` (
	`id` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`current_challenge` varchar(255),
	CONSTRAINT `user_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `abstimmungen_table` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `lehrer_table` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `vote_table` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `passkey_table` ADD CONSTRAINT `passkey_table_user_id_user_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_table`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vote_table` ADD CONSTRAINT `vote_table_lehrer_id_lehrer_table_id_fk` FOREIGN KEY (`lehrer_id`) REFERENCES `lehrer_table`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vote_table` ADD CONSTRAINT `vote_table_abstimmung_id_abstimmungen_table_id_fk` FOREIGN KEY (`abstimmung_id`) REFERENCES `abstimmungen_table`(`id`) ON DELETE cascade ON UPDATE cascade;