ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "terms_accepted_at" timestamp;

ALTER TABLE "refresh_tokens" ADD COLUMN IF NOT EXISTS "login_auth_key" text;
ALTER TABLE "refresh_tokens" ADD COLUMN IF NOT EXISTS "login_auth_value" text;

ALTER TABLE "subscriptions" ALTER COLUMN "product_id" DROP NOT NULL;
ALTER TABLE "subscriptions" ALTER COLUMN "purchase_token" DROP NOT NULL;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "plan_code" text;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "subscription_code" text;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paystack_customer_code" text;
