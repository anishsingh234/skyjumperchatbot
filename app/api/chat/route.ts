import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { searchDocuments } from "@/lib/search";
import z from "zod";

const tools = {
  searchKnowledgeBase: tool({
    description: "Search the trampoline park knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("Search query related to park rules, pricing, timings, safety, events, or bookings"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 5, 0.6);

        if (results.length === 0) {
          return "No relevant information found in the trampoline park knowledge base.";
        }

        return results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join("\n\n");

      } catch (error) {
        console.error("Search error:", error);
        return "Error searching the knowledge base.";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      tools,
      system: `
You are a friendly and helpful Trampoline Park Assistant.

You have access to a trampoline park knowledge base.

Rules:
- Always search the knowledge base before answering.
- Base your answers strictly on retrieved information.
- If information is not found, say:
  "I don’t have that information in the trampoline park knowledge base."
- Keep responses clear, short, and easy to understand.
- Maintain an energetic, welcoming, and family-friendly tone.
- Help with:
  • Ticket pricing
  • Opening hours
  • Safety rules
  • Age restrictions
  • Birthday parties
  • Group bookings
  • Waiver requirements
  • Special events
- Do not invent policies or pricing.
- If a user asks something unrelated to the park, politely redirect them.
`,
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Failed to stream response", { status: 500 });
  }
}
