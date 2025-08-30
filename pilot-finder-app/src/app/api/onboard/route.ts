import { NextRequest, NextResponse } from "next/server";
import { db, onboardingSessions, businessAnalysis, pilotLeads } from "@/lib/db";
import { eq } from "drizzle-orm";
import { onboardingAgent } from "../../../../mastra/agents/onboarding-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, businessDescription } = body;

    if (!businessName || !businessDescription) {
      return NextResponse.json(
        { error: "Business name and description are required" },
        { status: 400 }
      );
    }

    // Create onboarding session
    const [session] = await db
      .insert(onboardingSessions)
      .values({
        businessName,
        businessDescription,
        status: "processing",
      })
      .returning();

    // Run the onboarding agent asynchronously
    processOnboardingSession(session.id, businessName, businessDescription);

    return NextResponse.json({
      sessionId: session.id,
      status: "processing",
      message: "Onboarding analysis started. This may take a few minutes.",
    });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get session status and results
    const session = await db.query.onboardingSessions.findFirst({
      where: eq(onboardingSessions.id, sessionId),
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    let analysis = null;
    let leads: any[] = [];

    if (session.status === "completed") {
      analysis = await db.query.businessAnalysis.findFirst({
        where: eq(businessAnalysis.sessionId, sessionId),
      });

      leads = await db.query.pilotLeads.findMany({
        where: eq(pilotLeads.sessionId, sessionId),
        orderBy: (pilotLeads, { desc }) => [desc(pilotLeads.priority)],
      });
    }

    return NextResponse.json({
      session,
      analysis,
      leads,
    });
  } catch (error) {
    console.error("Get onboarding status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Process onboarding session with the AI agent
async function processOnboardingSession(
  sessionId: string,
  businessName: string,
  businessDescription: string
) {
  try {
    // Update session status
    await db
      .update(onboardingSessions)
      .set({ status: "processing" })
      .where(eq(onboardingSessions.id, sessionId));

    // Run the onboarding agent
    const prompt = `
      Analyze this business for pilot customer discovery:
      
      Business Name: ${businessName}
      Business Description: ${businessDescription}
      
      Please:
      1. Assess market viability (viable/oversaturated/pivot_needed)
      2. Research competitors and market trends
      3. Find potential pilot customers and their pain points
      4. Provide brutal honest assessment and recommendations
      5. Generate specific pilot customer leads with outreach strategies
      
      Be thorough and use the research tools to gather real market data.
    `;

    const response = await onboardingAgent.generate(prompt);
    const agentResponse = response.text;

    // Parse the agent response and extract structured data
    // This is a simplified version - in production you'd want more sophisticated parsing
    const analysis = await parseAgentResponse(agentResponse);

    // Save analysis to database
    await db.insert(businessAnalysis).values({
      sessionId,
      marketViability: analysis.marketViability || "unknown",
      marketSize: analysis.marketSize || "unknown",
      competitorAnalysis: analysis.competitors || [],
      customerSegments: analysis.customerSegments || [],
      painPoints: analysis.painPoints || [],
      marketTrends: analysis.marketTrends || [],
      brutHonestAssessment: analysis.assessment || agentResponse,
      recommendations: analysis.recommendations || "See assessment for details",
    });

    // Save pilot leads if any were found
    if (analysis.leads && analysis.leads.length > 0) {
      await db.insert(pilotLeads).values(
        analysis.leads.map((lead: any) => ({
          sessionId,
          leadSource: lead.source || "research",
          leadUrl: lead.url || "",
          leadTitle: lead.title || "Potential Lead",
          leadDescription: lead.description || "",
          contactInfo: lead.contact || "",
          painPointMatch: lead.painPointMatch || "",
          outreachStrategy: lead.outreachStrategy || "",
          priority: lead.priority || 3,
        }))
      );
    }

    // Update session status to completed
    await db
      .update(onboardingSessions)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(onboardingSessions.id, sessionId));
  } catch (error) {
    console.error("Process onboarding session error:", error);

    // Update session status to failed
    await db
      .update(onboardingSessions)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(onboardingSessions.id, sessionId));
  }
}

// Parse agent response into structured data
async function parseAgentResponse(response: string) {
  // This is a simplified parser - in production you'd want more sophisticated NLP
  // or structure the agent to return JSON

  const analysis = {
    marketViability: "unknown",
    marketSize: "unknown",
    competitors: [],
    customerSegments: [],
    painPoints: [],
    marketTrends: [],
    assessment: response,
    recommendations: "See full assessment for details",
    leads: [],
  };

  // Extract market viability
  if (
    response.toLowerCase().includes("viable") &&
    !response.toLowerCase().includes("not viable")
  ) {
    analysis.marketViability = "viable";
  } else if (response.toLowerCase().includes("oversaturated")) {
    analysis.marketViability = "oversaturated";
  } else if (response.toLowerCase().includes("pivot")) {
    analysis.marketViability = "pivot_needed";
  }

  // Extract market size
  if (response.toLowerCase().includes("large market")) {
    analysis.marketSize = "large";
  } else if (
    response.toLowerCase().includes("medium market") ||
    response.toLowerCase().includes("moderate market")
  ) {
    analysis.marketSize = "medium";
  } else if (
    response.toLowerCase().includes("small market") ||
    response.toLowerCase().includes("niche")
  ) {
    analysis.marketSize = "small";
  }

  return analysis;
}
