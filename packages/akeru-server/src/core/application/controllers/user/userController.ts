import Elysia, { t } from "elysia";
import { createToken } from "@/core/application/services/tokenService";
import {
  UNSUCCESSFUL_USER_CREATION,
  USER_CREATED_SUCCESSFULLY,
} from "./returnValues";
import { createHumanUser } from "../../services/userService";
import { AuthMiddleware } from "../../middlewares/authorizationMiddleware";
import bearer from "@elysiajs/bearer";

type UserDecorator = {
  request: {
    bearer: string | undefined;
  };
  store: {};
  derive: {};
  resolve: {};
};

export const users = new Elysia<"/users">().use(bearer());

/**
 * Guard for the user controller.
 * @param {string | undefined} bearer - The bearer token.
 * @returns {Promise<Error | undefined>} - Returns an error if the token is missing, invalid or does not have CREATE_USER.
 */
users.post(
  "/users",
  async ({ set, body }) => {
    // Human user uses the User role
    const humanUserId = await createHumanUser(body);
    if (humanUserId) {
      const humanUserToken = await createToken(humanUserId);
      
      set.status = USER_CREATED_SUCCESSFULLY.code;
      return {
        ...USER_CREATED_SUCCESSFULLY,
        token: humanUserToken,
      };
    }

    set.status = UNSUCCESSFUL_USER_CREATION.code;
    return UNSUCCESSFUL_USER_CREATION;
  },
  {
    body: t.Object({
      email: t.String(),
      name: t.String(),
    }),
    beforeHandle: AuthMiddleware(["create_user", "*"]),
  },
);
