// run the thread with the associated assistant

import { ThreadRun, ThreadRunRequest } from "@/core/domain/run";
import { getAssistantData } from "./assistantService";
import { getThread } from "./threadService";
import { getAllMessage } from "./messageService";

import { Role } from "@/core/domain/roles";

import {
  AdapterManager,
  GPT4AdapterManager,
  ValidatorAdapterManager,
} from "@/infrastructure/adaptaters/adaptermanager";

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

  let adapterManager: AdapterManager;

  // Calls the appropriate adapter based on what model the assistant uses
  if (assistantData.model === "gpt-4") {
    adapterManager = new GPT4AdapterManager();
  } else if (assistantData.model === "llama-2-7b-chat-int8") {
    adapterManager = new ValidatorAdapterManager("llama-2-7b-chat-int8");
  } else {
    throw new Error("Unsupported assistant model");
  }

  // Generate response using the appropriate adapter
  const assistantResponse: string = await adapterManager.generateResponse(
    everyRoleAndContent,
    assistantData.instruction
  );

  // Add assistant response to the thread
  await adapterManager.createUserMessage(
    assistant_id,
    thread_id,
    assistantResponse
  );

  // Create thread run response
  const threadRunResponse: ThreadRun =
    await adapterManager.createThreadRunResponse(assistant_id, thread_id);

  return threadRunResponse;
}
