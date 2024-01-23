import OpenAI from "openai";
import type { ChatCompletionChunk } from "openai/resources";
import type { Stream } from "openai/streaming";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type gpt4Adapter = (
  messages: string,
  SYSTEM_PROMPT: string
) => Promise<Stream<ChatCompletionChunk> | Response>;

export const gpt4Adapter: gpt4Adapter = async (messages, SYSTEM_PROMPT) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: messages,
            },
          ],
        },
      ],
    });
    return response;
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 500 });
  }
};
