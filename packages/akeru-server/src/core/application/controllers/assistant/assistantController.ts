import { Elysia, t } from "elysia";
import { ulid } from "ulid";

import { parseToken } from "../../services/tokenService";
import {
  assignRole,
  createUser,
} from "@/core/application/services/userService";
import {
  createAssistant,
  getAssistantData,
} from "@/core/application/services/assistantService";
import { AuthMiddleware } from "../../middlewares/authorizationMiddleware";
import bearer from "@elysiajs/bearer";

export const assistants = new Elysia().use(bearer());
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
      await assignRole(assistantId, "assistant");

      // creat assistant in db
      await createAssistant({
        userId,
        id: assistantId,
        model: body.model,
        name,
        fileIds: [],
        tools: [],
        instruction: body.instruction,
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
      model: t.Literal("gpt-4"), // add more models here
      instruction: t.String(),
    }),
    beforeHandle: AuthMiddleware(["create_assistant", "*"]),
  }
);

/**
 * Based on the query for the endpoint fetch the appropriate details about the users assistants
 */
assistants.get(
  "/assistant",
  async ({ query, bearer }) => {
    console.info("hit")
    // only support ALL query for now
    const decodedToken = await parseToken(bearer!);
    if (!decodedToken) return;

    const { userId } = decodedToken;

    const assistantData = await getAssistantData({
      query: query.query,
      userId: userId,
    });

    return assistantData;
  },
  {
    query: t.Object({
      query: t.Literal("ALL"),
    }),
    beforeHandle: AuthMiddleware(["view_assistants", "*"]),
  }
);
