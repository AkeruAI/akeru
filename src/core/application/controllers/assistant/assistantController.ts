import { Elysia, t } from "elysia";
import { ulid } from "ulid";

import { getTokenPermissions, parseToken } from "../../services/tokenService";
import { UNAUTHORIZED_NO_PERMISSION_CREATE_ASSISTANT } from "./returnValues";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";
import {
  assignRole,
  createUser,
} from "@/core/application/services/userService";
import { createAssistant } from "@/core/application/services/assistantService";

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
  async ({ bearer, set, body }) => {
    if (!bearer) {
      set.status = 401;
      return UNAUTHORIZED_MISSING_TOKEN;
    }
    const permissions = await getTokenPermissions(bearer!);
    const decodedToken = await parseToken(bearer!);

    if (
      !permissions?.some((p) => p.key === "create_assistant" || p.key === "*")
    ) {
      set.status = 403;
      return UNAUTHORIZED_NO_PERMISSION_CREATE_ASSISTANT;
    }

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
  }
);
