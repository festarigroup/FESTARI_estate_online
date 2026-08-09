ALTER TABLE "payment_transactions" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "request_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "provider_name" text;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "paystack_data" jsonb;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "paid_at" timestamp;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "transaction_reference" text;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "payment_date" timestamp;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_transactions_user_idx" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_request_idx" ON "payment_transactions" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_reference_idx" ON "payment_transactions" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "requests_transaction_ref_idx" ON "requests" USING btree ("transaction_reference");--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_reference_unique" UNIQUE("reference");