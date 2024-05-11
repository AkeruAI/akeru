import { Assistant } from "./assistant";
import { Thread } from "./thread";

/**
 * Running a thread to get a response
 */
export interface ThreadRun {
  id: string;
  created_at: Date;
  assistant_id: Assistant["id"];
  thread_id: Thread["id"];
  stream?: boolean
}

export type ThreadRunRequest = Pick<ThreadRun, "thread_id" | "assistant_id" | 'stream'>;
