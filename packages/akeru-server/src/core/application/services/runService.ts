// run the thread with the associated assistant

import { ThreadRun, ThreadRunRequest } from "@/core/domain/run";
import { getAssistantData } from "./assistantService";
import { getThread } from "./threadService";
import { createMessage, getAllMessage } from "./messageService";
import { gpt4Adapter } from "@/infrastructure/adaptaters/openai/gpt4Adapter";
import { Role } from "@/core/domain/roles";
import { v4 as uuidv4 } from "uuid";
import {
  ValidatorAIModel,
  validatorAdapter,
} from "@/infrastructure/adaptaters/validators/validatorAdapter";

export async function runAssistantWithThread(runData: ThreadRunRequest) {
  // get all messages from the thread, and run it over to the assistant to get a response
  const { assistant_id, thread_id } = runData;
  const [assistantData, threadData] = await Promise.all([
    getAssistantData(assistant_id),
    getThread(thread_id),
  ]);

  // If no thread data or assistant data, an error should be thrown as we need both to run a thread
  if (!threadData || !assistantData)
    throw new Error("No thread or assistant found.");

  const everyMessage = await getAllMessage(threadData.id);
  // only get role and content from every message for context.
  // TODO: We should truncate the context to fit context window for selected model.
  const everyRoleAndContent = everyMessage.map((message) => {
    // special case for super_admin, which really should just be user
    return {
      role: message.role === "super_admin" ? "user" : ("assistant" as Role),
      content: message.content,
    };
  });

  // Calls the appropriate adapter based on what model the assistant uses
  if (assistantData.model === "gpt-4") {
    const gpt4AdapterRes: any = await gpt4Adapter(
      everyRoleAndContent,
      assistantData.instruction
    );

    const assistantResponse: string = gpt4AdapterRes.choices[0].message.content;

    // add assistant response to the thread
    await createMessage(assistant_id, thread_id, assistantResponse);

    const threadRunResponse: ThreadRun = {
      id: uuidv4(),
      assistant_id: assistant_id,
      thread_id: thread_id,
      created_at: new Date(),
    };

    return threadRunResponse;
  }

  if (assistantData.model === "llama-2-7b-chat-int8") {
    const validatorAdapterRes: any = await validatorAdapter(
      everyRoleAndContent,
      "llama-2-7b-chat-int8",
      assistantData.instruction
    );

    const assistantResponse: string =
      validatorAdapterRes.choices[0].message.content;

    // add assistant response to the thread
    await createMessage(assistant_id, thread_id, assistantResponse);

    const threadRunResponse: ThreadRun = {
      id: uuidv4(),
      assistant_id: assistant_id,
      thread_id: thread_id,
      created_at: new Date(),
    };

    return threadRunResponse;
  }
}
