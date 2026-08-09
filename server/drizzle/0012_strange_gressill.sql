CREATE TYPE "public"."schedule_frequency" AS ENUM('one_time', 'daily', 'weekly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."schedule_status" AS ENUM('scheduled', 'paused', 'cancelled', 'completed');--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"driver_id" uuid,
	"pickup_address" text NOT NULL,
	"pickup_location" geometry(point),
	"phone" text,
	"note" text,
	"frequency" "schedule_frequency" DEFAULT 'one_time' NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"start_time" time,
	"end_time" time,
	"status" "schedule_status" DEFAULT 'scheduled' NOT NULL,
	"estimated_price" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"cancelled_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "schedule_id" uuid;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedules_customer_idx" ON "schedules" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "schedules_driver_idx" ON "schedules" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "schedules_date_idx" ON "schedules" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "schedules_status_idx" ON "schedules" USING btree ("status");--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "requests_schedule_idx" ON "requests" USING btree ("schedule_id");