import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export const firecrawlResearchTool = createTool({
  id: 'firecrawl-deep-research',
  description: 'Perform deep research on a topic using Firecrawl to gather comprehensive information from multiple sources',
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
      // Use Firecrawl's search functionality to find relevant sources
      const searchResults = await firecrawl.search(`${context.topic} ${context.query}`, {
        limit: 10,
      });

      if (!searchResults || !Array.isArray(searchResults)) {
        throw new Error('Failed to perform research');
      }

      const results = searchResults.map((result: any) => ({
        url: result.url || '',
        title: result.title || result.metadata?.title || 'No title',
        content: result.content || result.markdown || 'No content available',
        metadata: result.metadata || {},
      }));

      // Create a summary of findings
      const summary = `Research on "${context.topic}" with query "${context.query}" found ${results.length} relevant sources covering various aspects of the topic.`;

      return {
        results,
        summary,
        totalResults: results.length,
      };
    } catch (error) {
      console.error('Firecrawl research error:', error);
      return {
        results: [],
        summary: `Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalResults: 0,
      };
    }
  },
});