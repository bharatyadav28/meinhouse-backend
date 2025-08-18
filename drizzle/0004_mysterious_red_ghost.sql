CREATE TABLE "client_reviews" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0.0',
	"review" varchar(1000),
	"name" varchar(50),
	"company" varchar(100),
	"country" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
