import Elysia, { t } from "elysia";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";
import { createToken, getTokenPermissions } from "@/core/application/services/tokenService";
import { UNAUTHORIZED_INVALID_TOKEN } from "../thread/returnValues";
import { UNAUTHORIZED_NO_PERMISSION_CREATE, UNSUCCESSFUL_USER_CREATION, USER_CREATED_SUCCESSFULLY } from "./returnValues";
import { createHumanUser } from "../../services/userService";

type UserDecorator = {
  request: {
    bearer: string | undefined;
  };
  store: {};
  derive: {};
  resolve: {};
};

export const users = new Elysia<"/users", UserDecorator>();

/**
 * Guard for the user controller.
 * @param {string | undefined} bearer - The bearer token.
 * @returns {Promise<Error | undefined>} - Returns an error if the token is missing, invalid or does not have CREATE_USER.
 */
users.guard({
  beforeHandle: [async ({ bearer, set }) => {
    if (!bearer) {
      set.status = UNAUTHORIZED_MISSING_TOKEN.code;
      return UNAUTHORIZED_MISSING_TOKEN;
    }

    // Check that the token is valid and has the required permission.
    const permissions = await getTokenPermissions(bearer);
    if (!permissions) {
      set.status = UNAUTHORIZED_INVALID_TOKEN.code;
      return UNAUTHORIZED_INVALID_TOKEN;
    }

    if (!permissions.some(p => ["create_user", "*"].includes(p.key))) {
      set.status = UNAUTHORIZED_NO_PERMISSION_CREATE.code;
      return UNAUTHORIZED_NO_PERMISSION_CREATE;
    }
  }],
})


users.post("/users", async ({ set, body }) => {
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
}, {
  body: t.Object({
    email: t.String(),
    name: t.String(),
  }),
});
