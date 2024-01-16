import { Elysia } from "elysia";
import { ulid } from "ulid";

import { getTokenPermissions, parseToken } from "../../services/tokenService";
import {
  createThread,
  deleteThread,
  userOwnsOrParticipatesInThread,
  getThread,
} from "@/core/application/services/threadService";
import {
  THREAD_DELETED_SUCCESSFULLY,
  UNAUTHORIZED_NO_PERMISSION_CREATE,
  UNAUTHORIZED_NO_PERMISSION_DELETE,
  UNAUTHORIZED_NO_PERMISSION_READ,
  UNAUTHORIZED_USER_NOT_OWNER,
  UNAUTHORIZED_USER_NOT_PARTICIPANT,
} from "./returnValues";
import { UNAUTHORIZED_MISSING_TOKEN } from "@/core/application/ports/returnValues";

type ThreadDecorator = {
  request: {
    bearer: string | undefined;
  };
  store: {};
  derive: {};
  resolve: {};
};

export const threads = new Elysia<"/thread", ThreadDecorator>();

threads.post("/thread", async ({ bearer, set }) => {
  if (!bearer) {
    set.status = 401;
    return UNAUTHORIZED_MISSING_TOKEN;
  }
  const permissions = await getTokenPermissions(bearer!);
  const decodedToken = await parseToken(bearer!);

  if (!permissions?.some((p) => p.key === "create_thread" || p.key === "*")) {
    set.status = 403;
    return UNAUTHORIZED_NO_PERMISSION_CREATE;
  }

  if (decodedToken) {
    const { userId } = decodedToken;
    // // Create a new thread
    const threadId = await createThread({
      id: ulid(), // Generate a unique ID for the thread
      createdBy: userId,
      participants: [], // Initialize the participants list
      messageIds: [], // Initialize the message IDs list
    });

    // If the thread was created successfully, return it in the response
    if (threadId) {
      return {
        id: threadId,
      };
    }
  }
});

threads.delete("/thread/:id", async ({ params, bearer, set }) => {
  const permissions = await getTokenPermissions(bearer!);
  const decodedToken = await parseToken(bearer!);

  if (decodedToken) {
    const { userId } = decodedToken;
    const threadId = params.id;

    // Check if the user has the permission to delete their own thread or * permission
    if (
      permissions?.some((p) => p.key === "delete_own_thread" || p.key === "*")
    ) {
      // If the user has * permission, delete the thread without checking ownership
      if (permissions.some((p) => p.key === "*")) {
        await deleteThread(threadId, userId);
        return THREAD_DELETED_SUCCESSFULLY;
      }
      // If the user has delete_thread permission, check if they own the thread
      else if (await userOwnsOrParticipatesInThread(threadId, userId)) {
        await deleteThread(threadId, userId);
        return THREAD_DELETED_SUCCESSFULLY;
      } else {
        set.status = 403;
        return UNAUTHORIZED_USER_NOT_OWNER;
      }
    } else {
      set.status = 403;
      return UNAUTHORIZED_NO_PERMISSION_DELETE;
    }
  }
  set.status = 401;
  return { message: "Unauthorized: Invalid or missing token", code: 401 };
});

threads.get("/thread/:id", async ({ params, bearer, set }) => {
  const permissions = await getTokenPermissions(bearer!);
  const decodedToken = await parseToken(bearer!);

  if (decodedToken) {
    const { userId } = decodedToken;
    const threadId = params.id;

    // Check if the user has the permission to see their own threads or * permission
    if (
      permissions?.some((p) => p.key === "view_own_threads" || p.key === "*")
    ) {
      // If the user has * permission or is a participant in the thread, get the thread
      if (
        permissions.some((p) => p.key === "*") ||
        (await userOwnsOrParticipatesInThread(threadId, userId))
      ) {
        const thread = await getThread(threadId);
        return thread;
      } else {
        set.status = 403;
        return UNAUTHORIZED_USER_NOT_PARTICIPANT;
      }
    } else {
      set.status = 403;
      return UNAUTHORIZED_NO_PERMISSION_READ;
    }
  }

  set.status = 401;
  return UNAUTHORIZED_MISSING_TOKEN;
});
