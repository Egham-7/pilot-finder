CREATE TABLE "business_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"market_viability" varchar(50) NOT NULL,
	"market_size" varchar(50),
	"competitor_analysis" jsonb,
	"customer_segments" jsonb,
	"pain_points" jsonb,
	"market_trends" jsonb,
	"brutal_honest_assessment" text NOT NULL,
	"recommendations" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"business_description" text NOT NULL,
	"status" varchar(50) DEFAULT 'processing' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pilot_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"lead_source" varchar(100) NOT NULL,
	"lead_url" text,
	"lead_title" varchar(255),
	"lead_description" text,
	"contact_info" text,
	"pain_point_match" text,
	"outreach_strategy" text,
	"priority" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"tool_used" varchar(100) NOT NULL,
	"query" text NOT NULL,
	"results" jsonb NOT NULL,
	"summary" text,
	"total_results" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_analysis" ADD CONSTRAINT "business_analysis_session_id_onboarding_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."onboarding_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_leads" ADD CONSTRAINT "pilot_leads_session_id_onboarding_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."onboarding_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_results" ADD CONSTRAINT "research_results_session_id_onboarding_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."onboarding_sessions"("id") ON DELETE no action ON UPDATE no action;