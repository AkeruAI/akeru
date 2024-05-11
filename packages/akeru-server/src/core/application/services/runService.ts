// run the thread with the associated assistant

import { ThreadRun, ThreadRunRequest } from "@/core/domain/run";
import { getAssistantData } from "./assistantService";
import { getThread } from "./threadService";
import { createMessage, getAllMessage } from "./messageService";

import { Role } from "@/core/domain/roles";
import { AdapterManager } from "@/infrastructure/adapters/AdapterManager";

import { v4 as uuidv4 } from "uuid";

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

  const adapter = AdapterManager.instance.getBaseAdapter(assistantData.model);

  if (!adapter) {
    throw new Error("Adapter not found");
  }

  // Generate response using the appropriate adapter
  const assistantResponse: string = await adapter.generateSingleResponse({
    message_content: everyRoleAndContent,
    instruction: assistantData.instruction,
  });

  // Add assistant response to the thread
  await createMessage(assistant_id, thread_id, assistantResponse);

  // Return the thread run response
  const threadRunResponse: ThreadRun = {
    assistant_id: assistant_id,
    thread_id: thread_id,
    id: uuidv4(),
    created_at: new Date(),
  };

  return threadRunResponse;
}
