CREATE TABLE "categoryAssignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryId" uuid NOT NULL,
	"staffUserId" uuid NOT NULL,
	"isPrimary" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categoryAssignments" ADD CONSTRAINT "categoryAssignments_categoryId_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categoryAssignments" ADD CONSTRAINT "categoryAssignments_staffUserId_fk" FOREIGN KEY ("staffUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cartId_productId_unique" UNIQUE("cartId","productId");