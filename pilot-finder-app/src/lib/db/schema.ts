import { pgTable, uuid, varchar, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const onboardingSessions = pgTable('onboarding_sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  businessDescription: text('business_description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('processing'), // processing, completed, failed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const businessAnalysis = pgTable('business_analysis', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id').references(() => onboardingSessions.id).notNull(),
  marketViability: varchar('market_viability', { length: 50 }).notNull(), // viable, oversaturated, pivot_needed
  marketSize: varchar('market_size', { length: 50 }), // small, medium, large
  competitorAnalysis: jsonb('competitor_analysis'), // Array of competitor data
  customerSegments: jsonb('customer_segments'), // Array of identified segments
  painPoints: jsonb('pain_points'), // Array of pain points found
  marketTrends: jsonb('market_trends'), // Array of trends
  brutHonestAssessment: text('brutal_honest_assessment').notNull(),
  recommendations: text('recommendations').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pilotLeads = pgTable('pilot_leads', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id').references(() => onboardingSessions.id).notNull(),
  leadSource: varchar('lead_source', { length: 100 }).notNull(), // reddit, twitter, forum, etc
  leadUrl: text('lead_url'),
  leadTitle: varchar('lead_title', { length: 255 }),
  leadDescription: text('lead_description'),
  contactInfo: text('contact_info'),
  painPointMatch: text('pain_point_match'), // Why this is a good lead
  outreachStrategy: text('outreach_strategy'),
  priority: integer('priority').notNull().default(1), // 1-5 scale
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const researchResults = pgTable('research_results', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id').references(() => onboardingSessions.id).notNull(),
  toolUsed: varchar('tool_used', { length: 100 }).notNull(), // firecrawl_search, firecrawl_research
  query: text('query').notNull(),
  results: jsonb('results').notNull(), // Raw results from the tool
  summary: text('summary'),
  totalResults: integer('total_results').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types for TypeScript
export type OnboardingSession = typeof onboardingSessions.$inferSelect;
export type NewOnboardingSession = typeof onboardingSessions.$inferInsert;

export type BusinessAnalysis = typeof businessAnalysis.$inferSelect;
export type NewBusinessAnalysis = typeof businessAnalysis.$inferInsert;

export type PilotLead = typeof pilotLeads.$inferSelect;
export type NewPilotLead = typeof pilotLeads.$inferInsert;

export type ResearchResult = typeof researchResults.$inferSelect;
export type NewResearchResult = typeof researchResults.$inferInsert;