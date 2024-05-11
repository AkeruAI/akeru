import { Message } from "@/core/domain/messages";
import { ValidatorModels } from "./models";

type ChatMessage = Pick<Message, "role" | "content">;

interface ChatResponseChoice {
  finish_reason: string;
  index: number;
  message: ChatMessage;
}

export interface ValidatorResponse {
  choices: ChatResponseChoice[];
}

export async function validatorAdapter(
  messages: Pick<Message, "role" | "content">[],
  model: ValidatorModels,
  assistant_instructions: string
): Promise<unknown> {
  // System will always be the assistant_instruction that created the assistant
  const validator_messages = [
    { role: "system", content: assistant_instructions },
  ].concat(messages);
  try {
    const res = await fetch("https://akeru-validator.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: validator_messages,
      }),
    });

    const data: ValidatorResponse = await res.json();
    return data;
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
