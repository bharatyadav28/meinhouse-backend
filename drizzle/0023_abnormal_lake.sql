CREATE TYPE "public"."address_type" AS ENUM('home', 'work', 'other');--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "type" "address_type" DEFAULT 'home';