import { Elysia } from "elysia";
import { createThread } from "../services/threadService"; // Import the createThread function

import { getTokenPermissions, parseToken } from "../services/tokenService";

type ThreadDecorator = {
  request: {
    bearer: string | undefined;
  };
  store: {};
};

export const threads = new Elysia<"/thread", ThreadDecorator>();

threads.post("/thread", async ({ bearer, set }) => {
  const permissions = await getTokenPermissions(bearer!);
  const decodedToken = await parseToken(bearer!);

  if (decodedToken) {
    const { userId } = decodedToken;

    // Create a new thread
    const thread = await createThread({
      id: uuidv4(), // Generate a unique ID for the thread
      userId,
      participants: [], // Initialize the participants list
      messageIds: [], // Initialize the message IDs list
    });

    // If the thread was created successfully, return it in the response
    if (thread) {
      return thread;
    }
  }

  if (!permissions?.includes("create_thread") || !permissions?.includes("*")) {
    set.status = 403;
    return "Unauthorized";
  }
});
