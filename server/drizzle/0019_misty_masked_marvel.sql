ALTER TABLE "ratings" ALTER COLUMN "score" SET DATA TYPE numeric(3, 1);--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "service_rating" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "professionalism_rating" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "eco_friendly_rating" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "ratings_request_idx" ON "ratings" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "ratings_rated_by_idx" ON "ratings" USING btree ("rated_by");