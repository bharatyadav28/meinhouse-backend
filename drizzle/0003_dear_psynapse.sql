CREATE TABLE "carousal" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"image_path" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
