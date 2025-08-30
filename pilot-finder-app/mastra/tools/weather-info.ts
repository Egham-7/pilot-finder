import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherInfo = createTool({
  id: "Get Weather Information",
  inputSchema: z.object({
    city: z.string(),
  }),
  description: `Fetches the current weather information for a given city`,
  execute: async ({ context: { city } }) => {
    // Tool logic here (e.g., API call)
    console.log("Using tool to fetch weather information for", city);
    return { temperature: 20, conditions: "Sunny" }; // Example return
  },
});
