import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const runtime = "edge";

const generateId = () => Math.random().toString(36).slice(2, 15);

const systemPrompt = (documentContext) => ({
  role: "system",
  content: `You are a helpful AI assistant capable of document, text, image analysis and can also handle general queries. Here's how you should operate:

For Document Analysis:
  - Here's the document content I'd like to discuss: ${documentContext}. Analayze and understand this document to answer user 
    queries related to it.
  - Unless specified, this is a draft
  - Do not add any supplementary text, as everything you say might be placed into a document.
  - Don't add bold styling to headings.
  - Keep explanations straightforward and to the point
  - Ask for clarification if needed
  - Maintain a helpful and conversational tone

For General Queries Interactions:
  - Provide clear, concise responses
  - Keep explanations straightforward and to the point
  - Ask for clarification if needed
  - Maintain a helpful and conversational tone

For Image Analysis:
  - Describe what you see in detail when asked about images
  - Focus on relevant details the user asks about
  - If no specific question is asked about an image, provide a general description
  - Be precise about colors, objects, text, and other visible elements
  - If an image is unclear or you're unsure about certain details, say so

General Guidelines:
  - You can handle both document-related questions and general queries
  - No supplementary formatting or styling
  - Keep responses focused and relevant to the user's query
  - If you can't see an image that's referenced, let the user know
  - If you're unsure about anything, ask for clarification`,
});

const formatPrompt = (messages, documentContext) => {
  const formattedMessages = [systemPrompt(documentContext)];

  messages.forEach((msg) => {
    formattedMessages.push({
      role: msg.role,
      content: msg.content,
      id: msg.id || generateId(),
    });
  });

  return formattedMessages;
};

export async function POST(req) {
  const { messages, documentContext } = await req.json();

  try {
    const formattedMessages = formatPrompt(messages, documentContext);

    const stream = await streamText({
      model: google("gemini-2.5-pro"),
      messages: formattedMessages,
      temperature: 0.7,
    });

    return stream?.toDataStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred during the chat request",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
