import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const KLAVIS_MCP_ENDPOINT = process.env.KLAVIS_MCP_ENDPOINT;
const KLAVIS_API_KEY = process.env.KLAVIS_API_KEY;

export const firecrawlResearchTool = createTool({
  id: 'firecrawl-deep-research',
  description: 'Perform deep research on a topic using KlavisAI Firecrawl MCP server to gather comprehensive information from multiple sources',
  inputSchema: z.object({
    topic: z.string().describe('The topic or business area to research'),
    query: z.string().describe('Specific research query or question'),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      url: z.string(),
      title: z.string(),
      content: z.string(),
      metadata: z.record(z.any()).optional(),
    })),
    summary: z.string(),
    totalResults: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      if (!KLAVIS_MCP_ENDPOINT || !KLAVIS_API_KEY) {
        throw new Error('KlavisAI MCP endpoint or API key not configured');
      }

      const searchQuery = `${context.topic} ${context.query}`;
      
      // Call KlavisAI MCP server for deep research
      const response = await fetch(KLAVIS_MCP_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KLAVIS_API_KEY}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'firecrawl_deep_research',
            arguments: {
              query: searchQuery,
              limit: 10,
            },
          },
          id: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`KlavisAI MCP server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`MCP error: ${data.error.message}`);
      }

      const searchResults = data.result?.content || [];
      
      const results = Array.isArray(searchResults) ? searchResults.map((result: any) => ({
        url: result.url || '',
        title: result.title || result.metadata?.title || 'No title',
        content: result.content || result.markdown || 'No content available',
        metadata: result.metadata || {},
      })) : [];

      // Create a summary of findings
      const summary = `Research on "${context.topic}" with query "${context.query}" found ${results.length} relevant sources covering various aspects of the topic.`;

      return {
        results,
        summary,
        totalResults: results.length,
      };
    } catch (error) {
      console.error('KlavisAI Firecrawl research error:', error);
      return {
        results: [],
        summary: `Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalResults: 0,
      };
    }
  },
});