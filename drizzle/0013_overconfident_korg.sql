CREATE TYPE "public"."pages_status" AS ENUM('active', 'inactive');

CREATE TABLE "pages" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"status" "pages_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
