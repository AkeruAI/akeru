import { Elysia, t } from "elysia";
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
  UNAUTHORIZED_NO_PERMISSION_DELETE,
  UNAUTHORIZED_USER_NOT_OWNER,
  UNAUTHORIZED_USER_NOT_PARTICIPANT,
} from "./returnValues";
import { createMessage } from "../../services/messageService";
import { AuthMiddleware } from "../../middlewares/authorizationMiddleware";

type ThreadDecorator = {
  request: {
    bearer: string | undefined;
  };
  store: {};
  derive: {};
  resolve: {};
};

export const threads = new Elysia<"/thread", ThreadDecorator>();

threads.post(
  "/thread",
  async ({ bearer }) => {
    const decodedToken = await parseToken(bearer!);

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
  },
  {
    beforeHandle: AuthMiddleware(["create_thread", "*"]),
  },
);

threads.delete(
  "/thread/:id",
  async ({ params, bearer, set }) => {
    const decodedToken = await parseToken(bearer!);

    if (decodedToken) {
      const { userId, permissions } = decodedToken;
      const threadId = params.id;
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
    }
  },
  {
    beforeHandle: AuthMiddleware(["delete_own_thread", "*"]),
  },
);

threads.get(
  "/thread/:id",
  async ({ params, bearer, set }) => {
    const decodedToken = await parseToken(bearer!);

    if (decodedToken) {
      const { userId } = decodedToken;
      const threadId = params.id;
      const isParticipant = await userOwnsOrParticipatesInThread(
        threadId,
        userId,
      );
      const isSuperUser = decodedToken.permissions.some((p) => p.key === "*");

      // If the user has * permission or is a participant in the thread, get the thread
      if (isParticipant || isSuperUser) {
        const thread = await getThread(threadId);
        return thread;
      } else {
        set.status = 403;
        return UNAUTHORIZED_USER_NOT_PARTICIPANT;
      }
    }
  },
  {
    beforeHandle: AuthMiddleware(["view_own_threads", "*"]),
  },
);

threads.post(
  "/thread/:id/message",
  async ({ params, bearer, set, body }) => {
    const decodedToken = await parseToken(bearer!);

    if (decodedToken) {
      const { userId, permissions } = decodedToken;
      const threadId = params.id;
      const isSuperUser = permissions.some((p) => p.key === "*");
      const isParticipant = await userOwnsOrParticipatesInThread(
        threadId,
        userId,
      );

      // Check if the user has the permission to add a message
      // if the user has * they can send a message anywhere, if not they need to be in conversation
      if (isSuperUser || isParticipant) {
        const { message } = body;
        const res = await createMessage(userId, threadId, message);
        set.status = 200;
        return res;
      } else {
        set.status = 403;
        return UNAUTHORIZED_USER_NOT_PARTICIPANT;
      }
    }
  },
  {
    body: t.Object({
      message: t.String(),
    }),
    beforeHandle: AuthMiddleware(["create_message_in_own_thread", "*"]),
  },
);
