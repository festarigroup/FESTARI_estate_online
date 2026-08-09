ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_wallet_id_wallets_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "wallet_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "is_premium" boolean DEFAULT false NOT NULL;