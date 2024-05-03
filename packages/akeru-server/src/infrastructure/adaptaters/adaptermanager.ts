import { ThreadRun } from "@/core/domain/run";
import { v4 as uuidv4 } from "uuid";
import { gpt4Adapter } from "./openai/gpt4Adapter";
import { validatorAdapter } from "./validators/validatorAdapter";

import { createMessage } from "@/core/application/services/messageService";
import { ModelsType } from "@/core/domain/validators";

export abstract class AdapterManager {
  abstract generateResponse(
    everyRoleAndContent: { role: string; content: string }[],
    instruction: any
  ): Promise<string>;

  async createUserMessage(
    assistant_id: string,
    thread_id: string,
    assistantResponse: string
  ): Promise<void> {
    await createMessage(assistant_id, thread_id, assistantResponse);
  }

  async createThreadRunResponse(
    assistant_id: string,
    thread_id: string
  ): Promise<ThreadRun> {
    const threadRunResponse: ThreadRun = {
      id: uuidv4(),
      assistant_id: assistant_id,
      thread_id: thread_id,
      created_at: new Date(),
    };
    return threadRunResponse;
  }
}

export class GPT4AdapterManager extends AdapterManager {
  async generateResponse(
    everyRoleAndContent: any,
    instruction: any
  ): Promise<string> {
    const gpt4AdapterRes: any = await gpt4Adapter(
      everyRoleAndContent,
      instruction
    );
    return gpt4AdapterRes.choices[0].message.content;
  }
}

export class ValidatorAdapterManager extends AdapterManager {
  private modelName: ModelsType;

  constructor(modelName: ModelsType) {
    super();
    this.modelName = modelName;
  }

  async generateResponse(
    everyRoleAndContent: any,
    instruction: any
  ): Promise<string> {
    const validatorAdapterRes: any = await validatorAdapter(
      everyRoleAndContent,
      this.modelName,
      instruction
    );
    return validatorAdapterRes.choices[0].message.content;
  }
}
