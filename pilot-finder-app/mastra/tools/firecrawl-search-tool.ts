import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const KLAVIS_MCP_ENDPOINT = process.env.KLAVIS_MCP_ENDPOINT;
const KLAVIS_API_KEY = process.env.KLAVIS_API_KEY;

export const firecrawlSearchTool = createTool({
  id: 'firecrawl-web-search',
  description: 'Search the web for specific information using KlavisAI Firecrawl MCP server',
  inputSchema: z.object({
    query: z.string().describe('Search query to find relevant web content'),
    limit: z.number().optional().describe('Maximum number of results to return (default: 5)'),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      url: z.string(),
      title: z.string(),
      content: z.string(),
      snippet: z.string(),
    })),
    query: z.string(),
    totalResults: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      if (!KLAVIS_MCP_ENDPOINT || !KLAVIS_API_KEY) {
        throw new Error('KlavisAI MCP endpoint or API key not configured');
      }

      // Call KlavisAI MCP server for web search
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
            name: 'firecrawl_web_search',
            arguments: {
              query: context.query,
              limit: context.limit || 5,
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
        snippet: (result.content || result.markdown) ? 
          (result.content || result.markdown).substring(0, 200) + '...' : 
          'No snippet available',
      })) : [];

      return {
        results,
        query: context.query,
        totalResults: results.length,
      };
    } catch (error) {
      console.error('KlavisAI Firecrawl search error:', error);
      return {
        results: [],
        query: context.query,
        totalResults: 0,
      };
    }
  },
});