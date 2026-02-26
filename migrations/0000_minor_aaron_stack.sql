CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`jalali_month` integer NOT NULL,
	`jalali_day` integer NOT NULL,
	`content_title` text NOT NULL,
	`content_text` text NOT NULL,
	`historical_year` text NOT NULL,
	`image_url` text,
	`is_approved` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`joined_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
