ALTER TABLE `passkey_table` MODIFY COLUMN `cred_public_key` blob NOT NULL;--> statement-breakpoint
ALTER TABLE `user_table` ADD CONSTRAINT `user_table_username_unique` UNIQUE(`username`);