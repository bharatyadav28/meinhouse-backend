ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "valid_email" CHECK ("user"."email" ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');