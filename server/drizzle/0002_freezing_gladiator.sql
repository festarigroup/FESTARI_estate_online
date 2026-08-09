ALTER TABLE "users" RENAME COLUMN "username" TO "firstname";--> statement-breakpoint
DROP INDEX "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastname" text;