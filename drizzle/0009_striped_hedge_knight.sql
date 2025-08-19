CREATE TABLE "comp_services" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"pic_path" varchar NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp
);
