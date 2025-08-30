// app/api/news/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in your .env.local
});

export async function GET() {
  try {
    const response = await client.responses.create({
      model: "gpt-5",
      tools: [{ type: "web_search" }],
      input:
        "Do reasearch on the best customers and find the right product fit for this company. Adaptive. Seamless llm integration for developers and organizations.",
    });

    return NextResponse.json({ answer: response.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
