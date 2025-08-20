CREATE TABLE "query" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "valid_email" CHECK ("query"."email" ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
