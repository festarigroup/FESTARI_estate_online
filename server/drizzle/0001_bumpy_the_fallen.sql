CREATE TYPE "public"."hotel_category" AS ENUM('hotel', 'resort', 'apartment', 'event_venue', 'short_stay');--> statement-breakpoint
ALTER TYPE "public"."post_kind" ADD VALUE 'venue';--> statement-breakpoint
CREATE TABLE "hotel_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hotel_reviews_rating_range" CHECK ("hotel_reviews"."rating" >= 1 AND "hotel_reviews"."rating" <= 5)
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "linked_hotel_id" uuid;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "category" "hotel_category" DEFAULT 'hotel' NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "rooms" integer;--> statement-breakpoint
ALTER TABLE "hotel_reviews" ADD CONSTRAINT "hotel_reviews_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reviews" ADD CONSTRAINT "hotel_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotel_reviews_hotel_idx" ON "hotel_reviews" USING btree ("hotel_id");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_linked_hotel_id_hotels_id_fk" FOREIGN KEY ("linked_hotel_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotels_category_idx" ON "hotels" USING btree ("category");