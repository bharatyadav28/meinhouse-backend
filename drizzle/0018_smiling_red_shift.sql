CREATE TYPE "public"."service_status" AS ENUM('active', 'inactive', 'draft');--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon_path" varchar(255) NOT NULL,
	"image_path" varchar(255) NOT NULL,
	"min_hours_required" integer NOT NULL,
	"price" integer NOT NULL,
	"additional_hour_price" integer NOT NULL,
	"intro_title" varchar(255),
	"introduction" text,
	"why_choose_us" text,
	"description" text,
	"meta_title" varchar(255),
	"meta_description" text,
	"status" "service_status" DEFAULT 'active' NOT NULL,
	"is_license_required" boolean DEFAULT false NOT NULL,
	"slug" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
