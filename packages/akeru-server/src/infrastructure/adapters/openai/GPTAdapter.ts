import { Message } from "@/core/domain/messages";
import {
  BaseAdapter,
  StreamableAdapter,
} from "@/infrastructure/adapters/BaseAdapter";
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
export class GPTAdapter extends BaseAdapter implements StreamableAdapter {
  adapterName: string;
  adapterDescription = "This adapter supports all adapter models from OpenAI";
  private OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

  constructor(gptModel: GPTModels) {
    super();
    this.adapterName = gptModel;
  }

  async generateSingleResponse(args: AdapterRequest): Promise<string> {
    const gpt_messages = [{ role: "system", content: args.instruction }].concat(
      args.message_content
    );
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
      const finished_inference = data.choices[0].message.content;
      return Promise.resolve(finished_inference);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async *chunksToLines(chunksAsync: any) {
    let previous = "";
    for await (const chunk of chunksAsync) {
      const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      previous += bufferChunk;
      let eolIndex;
      while ((eolIndex = previous.indexOf("\n")) >= 0) {
        // line includes the EOL
        const line = previous.slice(0, eolIndex + 1).trimEnd();
        if (line === "data: [DONE]") break;
        if (line.startsWith("data: ")) yield line;
        previous = previous.slice(eolIndex + 1);
      }
    }
  }
  
  async *linesToMessages(linesAsync: any) {
    for await (const line of linesAsync) {
      const message = line.substring("data :".length);
  
      yield message;
    }
  }

  async *generateStreamableResponse(
    args: AdapterRequest
  ): AsyncGenerator<string> {
    const gpt_messages = [{ role: "system", content: args.instruction }].concat(
      args.message_content
    );
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
          stream: true,
        }),
      });

      // This section of the code is taken from...
      /// https://github.com/openai/openai-node/issues/18
      const reader = res.body?.getReader();
      while (true && reader) {
        const { done, value } = await reader.read();
        if (done) break; 
        
        const data = new TextDecoder().decode(value); 
        const chunkToLines = this.chunksToLines(data);
        const linesToMessages = this.linesToMessages(chunkToLines);

        for await (const message of linesToMessages) {
          const messageObject: any = JSON.parse(message);

          // MessageObject is the response from the OpenAI API streams
          const messageToYield = messageObject.choices[0].delta.content;
          if (messageToYield) yield messageToYield;
        }
      }
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
