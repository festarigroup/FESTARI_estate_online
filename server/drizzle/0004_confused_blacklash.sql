ALTER TABLE "subscription_plans" RENAME COLUMN "packages" TO "description";--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD COLUMN "interval" text NOT NULL;