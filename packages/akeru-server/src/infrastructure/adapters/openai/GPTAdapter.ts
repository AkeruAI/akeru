import { Message } from "@/core/domain/messages";
import { BaseAdapter, StreamableAdapter } from "@/infrastructure/adapters/BaseAdapter";
import { AdapterRequest } from "../adapter";
import { GPTModels } from "./models";

interface ChatMessage {
  content: string;
  role: "assistant" | "system" | "user";
}

interface ChatResponseChoice {
  finish_reason: string;
  index: number;
  message: ChatMessage;
}

export interface OpenAIResponse {
  choices: ChatResponseChoice[];
}

// export async function gpt4Adapter(
//   messages: Pick<Message, "role" | "content">[],
//   assistant_instructions: string
// ): Promise<unknown> {
//   // System will always be the assistant_instruction that created the assistant
//   const gpt_messages = [
//     { role: "system", content: assistant_instructions },
//   ].concat(messages);
//   try {
//     const res = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: gpt_messages,
//       }),
//     });

//     const data: OpenAIResponse = await res.json();
//     return data;
//   } catch (error) {
//     return new Response("Error", { status: 500 });
//   }
// }

export class GPTAdapter extends BaseAdapter implements StreamableAdapter {
  adapterName: string;
  adapterDescription = "This adapter supports all adapter models from OpenAI";
  private OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

  constructor(gptModel: GPTModels) {
    super();
    this.adapterName = gptModel;
  }

  async generateSingleResponse(args: AdapterRequest): Promise<string> {
    const gpt_messages = [{ role: "system", content: args.instruction }].concat(args.message_content);
    try {
      const res = await fetch(this.OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.adapterName,
          messages: gpt_messages,
        }),
      });

      const data: OpenAIResponse = await res.json();
      const finished_inference = data.choices[0].message.content
      return Promise.resolve(finished_inference);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async generateStreamableResponse(args: AdapterRequest): Promise<string> {
    const gpt_messages = [{ role: "system", content: args.instruction }].concat(args.message_content);
    try {
      const res = await fetch(this.OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.adapterName,
          messages: gpt_messages,
          stream: true
        }),
      });

      const data: OpenAIResponse = await res.json();
      const finished_inference = data.choices[0].message.content
      return Promise.resolve(finished_inference);
    } catch (error) {
      return Promise.reject(error);
    }
  
  }

  getAdapterInformation(): Object {
    return {
      adapterName: this.adapterName,
      adapterDescription: this.adapterDescription,
    };
  }
}
