import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Create search query combining business name and description
    const searchQuery = `${businessName} ${businessDescription} competitors customer pain points market analysis`;

    // Use OpenAI to perform web search analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a web search and market research assistant. Based on your knowledge of current web data and market trends, provide comprehensive analysis about businesses, competitors, and market opportunities. Always provide factual, data-driven insights."
        },
        {
          role: "user",
          content: `Please provide a comprehensive market analysis for the business "${businessName}" with description: "${businessDescription}". Include:

1. KEY COMPETITORS - Who are the main players in this space?
2. MARKET SIZE & TRENDS - What's the current market size and growth trajectory?
3. CUSTOMER PAIN POINTS - What problems do customers face that this business could solve?
4. COMPETITIVE ADVANTAGES - What makes this business unique?
5. OPPORTUNITIES & CHALLENGES - What's working well and what obstacles exist?
6. RECENT DEVELOPMENTS - Any notable news, funding, or industry changes?

Format your response as a structured, easy-to-read string with clear section headers. Be specific and data-driven where possible.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const resultString = response.choices[0]?.message?.content || "No analysis available.";

    return NextResponse.json({
      result: resultString,
      businessName,
      businessDescription,
    });
  } catch (error) {
    console.error("Web search API error:", error);
    return NextResponse.json(
      { error: "Internal server error during web search" },
      { status: 500 }
    );
  }
}