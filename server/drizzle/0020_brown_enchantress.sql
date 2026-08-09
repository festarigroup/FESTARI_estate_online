ALTER TABLE "ratings" ALTER COLUMN "score" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "processed_at" timestamp;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "retry_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "retry_at" timestamp;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "last_error" text;--> statement-breakpoint
CREATE INDEX "schedules_processed_idx" ON "schedules" USING btree ("processed_at");--> statement-breakpoint
CREATE INDEX "schedules_retry_idx" ON "schedules" USING btree ("retry_at");