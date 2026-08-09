ALTER TABLE "requests" ALTER COLUMN "pickup_price" SET DATA TYPE numeric(6, 2);--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "pickup_price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "service_price" SET DATA TYPE numeric(6, 2);--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "service_price" SET DEFAULT '0';