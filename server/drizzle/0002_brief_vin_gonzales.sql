CREATE TYPE "public"."price_unit" AS ENUM('plot', 'unit', 'month', 'night');--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "price_unit" "price_unit" DEFAULT 'plot' NOT NULL;