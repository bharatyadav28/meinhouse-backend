ALTER TABLE "query" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "query" ADD COLUMN "deleted_at" timestamp;