CREATE TABLE "article" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"pic_path" varchar,
	"author" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
