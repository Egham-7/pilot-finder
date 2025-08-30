import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export const firecrawlSearchTool = createTool({
  id: 'firecrawl-web-search',
  description: 'Search the web for specific information using Firecrawl',
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
      const searchResults = await firecrawl.search(context.query, {
        limit: context.limit || 5,
      });

      if (!searchResults || !Array.isArray(searchResults)) {
        throw new Error('Search failed');
      }

      const results = searchResults.map((result: any) => ({
        url: result.url || '',
        title: result.title || result.metadata?.title || 'No title',
        content: result.content || result.markdown || 'No content available',
        snippet: (result.content || result.markdown) ? 
          (result.content || result.markdown).substring(0, 200) + '...' : 
          'No snippet available',
      }));

      return {
        results,
        query: context.query,
        totalResults: results.length,
      };
    } catch (error) {
      console.error('Firecrawl search error:', error);
      return {
        results: [],
        query: context.query,
        totalResults: 0,
      };
    }
  },
});