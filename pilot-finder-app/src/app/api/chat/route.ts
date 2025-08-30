import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import Firecrawl from "@mendable/firecrawl-js";
import { z } from "zod";

export const maxDuration = 30;

// Initialize Firecrawl client
const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

// Log Firecrawl initialization
console.log(
  "Firecrawl initialized with API key:",
  process.env.FIRECRAWL_API_KEY ? "Present" : "Missing",
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(messages),
      system: `You are an AI assistant specialized in finding real customers by discovering people complaining about pain points on social media and online platforms. Your primary goal is to help entrepreneurs find potential customers who are actively expressing frustration about problems that the user's product might solve.

Core Mission: Find complainers, validate pain points, create customer profiles with outreach strategies.

Primary Workflow:
1. **Understand the Problem**: Ask about the user's product and the specific pain point it solves
2. **Strategic Search**: Use search and deepResearch tools to find social platforms where people complain about this pain point
3. **Platform Analysis**: Use crawl and scrape tools to analyze the most promising platforms and discussions
4. **Customer Profile Creation**: Identify specific individuals expressing these pain points
5. **Outreach Strategy**: Provide personalized contact methods and messaging approaches

Key Focus Areas:
- Reddit (subreddits related to the problem space)
- Twitter/X (complaint threads and discussions)
- Facebook groups (community discussions)
- Industry forums and communities
- Review sites (negative reviews of competing solutions)
- LinkedIn (professional pain points)
- YouTube comments (frustrations with current solutions)
- Discord servers (niche community complaints)

For each potential customer found:
- Extract their username/handle
- Summarize their specific complaint
- Note the platform they're active on
- Suggest personalized outreach approach
- Provide draft message template

Tools Usage Strategy:
1. **search**: Find initial platforms and communities discussing the pain point
2. **deepResearch**: Comprehensive analysis of the most promising platforms
3. **crawl**: Deep dive into specific forums or community sites
4. **scrape**: Analyze individual threads, posts, or pages with complaints

Output Format for Customer Profiles:

Customer Profile #1:
- Platform: Reddit
- Username: @username
- Pain Point: "Specific quote of their complaint"
- Context: Brief background about their situation
- Outreach Method: Direct message / Comment reply / Email
- Message Template: "Hi [name], I saw your post about [specific problem]..."

Be brutally honest about market validation. If you can't find people complaining about the problem, the market might not exist. Focus on finding REAL people with REAL complaints, not theoretical customers.

IMPORTANT: Take as many research steps as needed to provide comprehensive, in-depth responses. Don't rush - use multiple search, deepResearch, crawl, and scrape operations to thoroughly investigate each platform and find the best customer prospects. Quality over speed. Be exhaustive in your research to deliver maximum value.

Keep responses action-oriented and focused on finding actual humans who need the solution.`,
      temperature: 0.7,
      tools: {
        scrape: tool({
          description:
            "Scrape and extract clean data from a single website URL. Perfect for analyzing specific pages like competitor sites, forum posts, reviews, or landing pages.",
          inputSchema: z.object({
            url: z.string().describe("The URL to scrape"),
            includeHtml: z
              .boolean()
              .optional()
              .describe("Whether to include HTML content (default: false)"),
          }),
          execute: async ({ url, includeHtml = false }) => {
            console.log("🔍 Scrape tool called with:", { url, includeHtml });
            try {
              console.log("📡 Calling Firecrawl scrape API...");
              const doc = await firecrawl.scrape(url, {
                formats: includeHtml ? ["markdown", "html"] : ["markdown"],
              });
              console.log("✅ Scrape successful:", {
                url,
                hasTitle: !!doc.metadata?.title,
                contentLength: doc.markdown?.length || 0,
                hasMetadata: !!doc.metadata,
              });
              return {
                url,
                title: doc.metadata?.title || "No title",
                content: doc.markdown || doc.html || "No content extracted",
                metadata: doc.metadata,
              };
            } catch (error) {
              console.error("❌ Scrape failed:", error);
              return {
                url,
                error: `Failed to scrape: ${error instanceof Error ? error.message : "Unknown error"}`,
              };
            }
          },
        }),
        crawl: tool({
          description:
            "Crawl and extract data from an entire website or domain. Ideal for comprehensive market research, competitor analysis, or understanding customer discussions across a site.",
          inputSchema: z.object({
            url: z.string().describe("The starting URL to crawl"),
            limit: z
              .number()
              .min(1)
              .max(100)
              .optional()
              .describe("Maximum pages to crawl (default: 10, max: 100)"),
            includePaths: z
              .array(z.string())
              .optional()
              .describe("Paths to include (e.g., ['/blog/*', '/reviews/*'])"),
            excludePaths: z
              .array(z.string())
              .optional()
              .describe("Paths to exclude (e.g., ['/admin/*', '/login'])"),
          }),
          execute: async ({ url, limit = 10, includePaths, excludePaths }) => {
            console.log("🕷️ Crawl tool called with:", {
              url,
              limit,
              includePaths,
              excludePaths,
            });
            try {
              console.log("📡 Calling Firecrawl crawl API...");
              const response = await firecrawl.crawl(url, {
                limit,
                scrapeOptions: { formats: ["markdown"] },
                ...(includePaths && { includePaths }),
                ...(excludePaths && { excludePaths }),
              });

              console.log("📊 Crawl API response:", {
                hasData: !!response.data,
                dataLength: response.data?.length || 0,
                responseKeys: Object.keys(response),
              });

              if (!response.data || response.data.length === 0) {
                console.log("⚠️ No crawl data found");
                return {
                  url,
                  error: "No data found or crawl failed",
                };
              }

              const result = {
                url,
                pages: response.data.length,
                data: response.data.map((page) => ({
                  url: page.metadata?.sourceURL || "Unknown URL",
                  title: page.metadata?.title || "No title",
                  content: page.markdown?.substring(0, 1000) || "No content", // Truncate for token efficiency
                  metadata: page.metadata,
                })),
              };

              console.log("✅ Crawl successful:", {
                url,
                pagesFound: result.pages,
                sampleTitles: result.data.slice(0, 3).map((p) => p.title),
              });

              return result;
            } catch (error) {
              console.error("❌ Crawl failed:", error);
              return {
                url,
                error: `Failed to crawl: ${error instanceof Error ? error.message : "Unknown error"}`,
              };
            }
          },
        }),
        search: tool({
          description:
            "Search the web to find relevant websites and pages about specific topics, problems, or markets. Great for discovering forums, communities, and discussion sites where target customers gather.",
          inputSchema: z.object({
            query: z
              .string()
              .describe("The search query to find relevant websites"),
            limit: z
              .number()
              .min(1)
              .max(10)
              .optional()
              .describe("Number of search results to return (default: 5)"),
          }),
          execute: async ({ query, limit = 5 }) => {
            console.log("🔍 Search tool called with:", { query, limit });
            try {
              console.log("📡 Calling Firecrawl search API...");
              const response = await firecrawl.search(query, { limit });

              console.log("📊 Search API response:", {
                responseType: typeof response,
                hasWeb: response && response.web ? "Yes" : "No",
                webDataLength:
                  response && response.web ? response.web.length : "N/A",
              });

              // Check if response has web results (actual Firecrawl format)
              if (!response || !response.web || !Array.isArray(response.web)) {
                console.log("⚠️ No search results or invalid response format");
                console.log("Response structure:", response);
                return {
                  query,
                  results: [],
                  message: "No search results found",
                };
              }

              console.log("✅ Search successful:", {
                query,
                resultCount: response.web.length,
              });

              return {
                query,
                results: response.web,
              };
            } catch (error) {
              console.error("❌ Search failed:", error);
              return {
                query,
                error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              };
            }
          },
        }),
        deepResearch: tool({
          description:
            "Conduct comprehensive deep research on a specific topic, question, or market. This tool will search the web, scrape relevant sources, and synthesize findings into a detailed research report. Perfect for market research, competitor analysis, and customer discovery.",
          inputSchema: z.object({
            query: z
              .string()
              .describe(
                "The research question or topic to investigate thoroughly",
              ),
            maxResults: z
              .number()
              .min(5)
              .max(20)
              .optional()
              .describe("Maximum number of sources to research (default: 10)"),
            focus: z
              .enum([
                "market-research",
                "competitor-analysis",
                "customer-pain-points",
                "general",
              ])
              .optional()
              .describe("Focus area for the research (default: general)"),
          }),
          execute: async ({ query, maxResults = 10, focus = "general" }) => {
            console.log("🔬 Deep research tool called with:", {
              query,
              maxResults,
              focus,
            });
            try {
              // For now, we'll implement this using the available Firecrawl methods
              // In the future, this could use Firecrawl's dedicated research endpoint when available

              console.log("📡 Starting deep research - first searching...");
              // First, search for relevant sources
              const searchResponse = await firecrawl.search(query, {
                limit: Math.min(maxResults, 10),
              });

              console.log("📊 Deep research search response:", {
                hasResponse: !!searchResponse,
                hasWeb: searchResponse && searchResponse.web ? "Yes" : "No",
                webDataLength:
                  searchResponse && searchResponse.web
                    ? searchResponse.web.length
                    : "N/A",
              });

              if (
                !searchResponse ||
                !searchResponse.web ||
                !Array.isArray(searchResponse.web) ||
                searchResponse.web.length === 0
              ) {
                console.log("⚠️ No search results for deep research");
                console.log("Search response structure:", searchResponse);
                return {
                  query,
                  focus,
                  error: "No search results found for deep research",
                };
              }

              // Scrape the most relevant sources
              const sources = searchResponse.web.slice(
                0,
                Math.min(5, maxResults),
              );

              console.log(
                `🔍 Scraping ${sources.length} sources for deep research...`,
              );

              console.log("✅ Deep research successful:", {
                query,
                focus,
                totalSources: sources.length,
              });

              return {
                query,
                focus,
                totalSources: sources.length,
                scrapedSources: sources.length,
                sources: sources,
                summary: `Deep research completed on "${query}" with focus on ${focus}. Found ${sources.length} sources.`,
              };
            } catch (error) {
              console.error("❌ Deep research failed:", error);
              return {
                query,
                focus,
                error: `Deep research failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              };
            }
          },
        }),
      },
      stopWhen: stepCountIs(50),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
