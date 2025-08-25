CREATE TABLE "education" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"heading" varchar(255) NOT NULL,
	"online_course_names" json,
	"partnership_title" varchar(255),
	"description" text,
	"services" json,
	"mobile" varchar(20),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
