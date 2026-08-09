ALTER TABLE "requests" ALTER COLUMN "payment_method" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "profile_picture" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "is_premium" boolean DEFAULT false NOT NULL;