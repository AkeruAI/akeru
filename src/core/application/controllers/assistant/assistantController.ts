import { Elysia, t } from "elysia";
import { ulid } from "ulid";

import { parseToken } from "../../services/tokenService";
import {
  assignRole,
  createUser,
} from "@/core/application/services/userService";
import { createAssistant } from "@/core/application/services/assistantService";
import { AuthMiddleware } from "../../middlewares/authorizationMiddleware";

type AssistantDecorator = {
  request: {
    bearer: string | undefined;
  };
  store: {};
  derive: {};
  resolve: {};
};

export const assistants = new Elysia<"/assistant", AssistantDecorator>();

assistants.post(
  "/assistant",
  async ({ bearer, body }) => {
    const decodedToken = await parseToken(bearer!);

    if (decodedToken) {
      const { userId } = decodedToken;
      const assistantId = ulid();

      const { name } = body;

      // create user for assistant
      await createUser(assistantId, {});
      // give user the proper role
      await assignRole(assistantId, "agent");

      // creat assistant in db
      await createAssistant({
        userId,
        id: assistantId,
        model: "gpt-4",
        name,
        fileIds: [],
        tools: [],
      });

      return {
        id: assistantId,
        name,
      };
    }
  },
  {
    body: t.Object({
      name: t.String(),
    }),
    beforeHandle: AuthMiddleware(["create_assistant", "*"]),
  },
);
