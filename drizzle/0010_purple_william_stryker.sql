CREATE TYPE "public"."comp_service_status " AS ENUM('pending', 'contacted', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "comp_services_req" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"comp_service_id" varchar(21) NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(15),
	"address" text NOT NULL,
	"notes" text,
	"status" "comp_service_status " DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	CONSTRAINT "valid_email" CHECK ("comp_services_req"."email" ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
--> statement-breakpoint
ALTER TABLE "comp_services_req" ADD CONSTRAINT "comp_services_req_comp_service_id_comp_services_id_fk" FOREIGN KEY ("comp_service_id") REFERENCES "public"."comp_services"("id") ON DELETE no action ON UPDATE no action;