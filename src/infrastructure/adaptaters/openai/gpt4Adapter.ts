import { Message } from "@/core/domain/messages";

interface ChatMessage {
  content: string,
  role: "assistant" | "system" | "user"
}

interface ChatResponseChoice{
  finish_reason: string, 
  index: number,
  message: ChatMessage
}

export interface OpenAIResponse {
  choices: ChatResponseChoice[]
}

export async function gpt4Adapter(
  messages: Pick<Message, 'role' | 'content'>[],
  assistant_instructions: string
): Promise<unknown> {
  // System will always be the assistant_instruction that created the assistant
  const gpt_messages = [{role: "system", content: assistant_instructions}].concat(messages)
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: gpt_messages
      }),
    });

    const data: OpenAIResponse = await res.json();
    return data;
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}