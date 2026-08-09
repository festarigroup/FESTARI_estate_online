CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'sms', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."notification_frequency" AS ENUM('daily', 'weekly', 'monthly', 'never');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'failed', 'read');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('wallet', 'rewards', 'subscription', 'scheduled_pickups', 'arrival_pickups', 'system');--> statement-breakpoint
ALTER TYPE "public"."otp_purpose" ADD VALUE 'update_old' BEFORE 'email_verification';--> statement-breakpoint
ALTER TYPE "public"."otp_purpose" ADD VALUE 'update_new' BEFORE 'email_verification';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'mobile_money';--> statement-breakpoint
ALTER TYPE "public"."request_status" ADD VALUE 'paid' BEFORE 'accepted';--> statement-breakpoint
ALTER TYPE "public"."transaction_type" ADD VALUE 'withdrawal';--> statement-breakpoint
CREATE TABLE "bin_full_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"pickup_address" text,
	"pickup_location" geometry(point),
	"request_id" uuid,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"retry_at" timestamp,
	"last_error" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bin_full_signals_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"status" "notification_status" DEFAULT 'pending' NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"data" jsonb,
	"sent_at" timestamp,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paystack_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"reference" text,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paystack_webhook_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"product_id" text NOT NULL,
	"purchase_token" text,
	"status" text NOT NULL,
	"expires_at" timestamp,
	"auto_renewing" boolean DEFAULT false,
	"started_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"frequency" "notification_frequency" DEFAULT 'weekly' NOT NULL,
	"in_app_enabled" boolean DEFAULT true NOT NULL,
	"email_enabled" boolean DEFAULT true NOT NULL,
	"sms_enabled" boolean DEFAULT false NOT NULL,
	"whatsapp_enabled" boolean DEFAULT false NOT NULL,
	"wallet_enabled" boolean DEFAULT true NOT NULL,
	"rewards_enabled" boolean DEFAULT true NOT NULL,
	"subscription_enabled" boolean DEFAULT true NOT NULL,
	"scheduled_pickups_enabled" boolean DEFAULT true NOT NULL,
	"arrival_pickups_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_id" uuid,
	"expo_push_token" text NOT NULL,
	"platform" text,
	"device_name" text,
	"app_version" text,
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "device_name" text;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "platform" text;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "last_active_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "rewards_granted_at" timestamp;--> statement-breakpoint
ALTER TABLE "bin_full_signals" ADD CONSTRAINT "bin_full_signals_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bin_full_signals" ADD CONSTRAINT "bin_full_signals_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_refresh_token_id_refresh_tokens_id_fk" FOREIGN KEY ("refresh_token_id") REFERENCES "public"."refresh_tokens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bin_full_signals_customer_idx" ON "bin_full_signals" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "bin_full_signals_active_idx" ON "bin_full_signals" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "bin_full_signals_retry_idx" ON "bin_full_signals" USING btree ("retry_at");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_status_idx" ON "notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "paystack_webhook_reference_idx" ON "paystack_webhook_events" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "userIdUnique" ON "user_notification_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_devices_user_idx" ON "user_devices" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_devices_token_unique" ON "user_devices" USING btree ("user_id","expo_push_token");