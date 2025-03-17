import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import { match } from "ts-pattern";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "") {
    return new Response("Missing GOOGLE_API_KEY - make sure to add it to your .env file.", {
      status: 400,
    });
  }

  const { prompt, option, command } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const messages = match(option)
    .with("continue", () => ({
      prompt: `You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.
        
        Existing text to continue: ${prompt}`,
    }))
    .with("improve", () => ({
      prompt: `You are an AI writing assistant that improves existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.
        
        Existing text to improve: ${prompt}`,
    }))
    .with("shorter", () => ({
      prompt: `You are an AI writing assistant that shortens existing text.
        Use Markdown formatting when appropriate.
        
        Existing text to shorten: ${prompt}`,
    }))
    .with("longer", () => ({
      prompt: `You are an AI writing assistant that lengthens existing text.
        Use Markdown formatting when appropriate.
        
        Existing text to lengthen: ${prompt}`,
    }))
    .with("fix", () => ({
      prompt: `You are an AI writing assistant that fixes grammar and spelling errors in existing text.
        Limit your response to no more than 200 characters, but make sure to construct complete sentences.
        Use Markdown formatting when appropriate.
        
        Existing text to fix: ${prompt}`,
    }))
    .with("summarize", () => ({
      prompt: `You are an AI writing assistant that summarizes the existing text clearly and concisely. "
          "Provide a brief summary in under 200 characters while preserving the key points. " 
          "Use complete sentences and Markdown formatting when needed.
        
        Existing text to summarize: ${prompt}`,
    }))
    .with("translate", () => ({
      prompt: `You are an AI writing assistant that translates the existing text into the specified target language accurately"
        "Translate the existing text while preserving its original meaning and tone." 
        "Respond only with the translated text.
        
        Existing text to translate: ${prompt}`,
    }))
    .with("paraphrase", () => ({
      prompt: `You are an AI writing assistant that paraphrases the existing text to make it more clear and concise."
        "Paraphrase the existing text while preserving its original meaning and tone."
        "Respond only with the paraphrased text.
        
        Existing text to paraphrase: ${prompt}`,
    }))
    .with("elaborate", () => ({
      prompt: `You are an AI writing assistant that elaborates on the existing text to provide more context and detail."
        "Elaborate on the existing text while preserving its original meaning and tone."
        "Respond only with the elaborated text.
        
        Existing text to elaborate: ${prompt}`,
    }))
    .with("bloggify", () => ({
      prompt: `You are an AI writing assistant that converts the existing text into a blog post."
        "Convert the existing text into a blog post format with an engaging introduction, body, and conclusion."
        "Use Markdown formatting when appropriate.

        Existing text to bloggify: ${prompt}`,
    }))
    .with("prose", () => ({
      prompt: `You are an AI writing assistant that changes the prose style of the existing text."
        "Change the prose style of the existing text to make it more engaging and readable."
        "Use Markdown formatting when appropriate.

        Existing text: ${prompt}`,
    }))
    .with("explain", () => ({
      prompt: `You are an AI writing assistant that explains the existing text in more detail."
        "Explain the existing text in a way that provides more context and information."
        "Use Markdown formatting when appropriate.

        Existing text to explain: ${prompt}`,
    }))
    .with("zap", () => ({
      prompt: `You area an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text" +
          "Use Markdown formatting when appropriate.
        
        For this text: ${prompt}
        Command to follow: ${command}`,
    }))
    .run();

  const response = await model.generateContentStream(messages.prompt);

  const stream = GoogleGenerativeAIStream(response);

  return new StreamingTextResponse(stream);
}