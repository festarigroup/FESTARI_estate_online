CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "user_roles_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
ALTER TABLE "ratings" RENAME COLUMN "rated_user" TO "rated_for";--> statement-breakpoint
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_rated_user_users_id_fk";
--> statement-breakpoint
DROP INDEX "ratings_rated_user_idx";--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rated_for_users_id_fk" FOREIGN KEY ("rated_for") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ratings_rated_user_idx" ON "ratings" USING btree ("rated_for");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";