import { Permission } from "@/core/domain/permissions";
import { Context } from "elysia";
import { UNAUTHORIZED_MISSING_TOKEN } from "../ports/returnValues";
import { getTokenPermissions } from "../services/tokenService";
import { UNAUTHORIZED_INVALID_TOKEN } from "./returnValues";

// Only need set and bearer from the context.
type AuthContext = Pick<Context, "set"> & {
  bearer: string | undefined;
};

/**
 * Middleware to check if the user has the required permissions.
 * Middleware will ignore the required permissions if the user has the wildcard permission.
 * @param {Permission[]} requiredPermissions - The required permissions.
 * @returns {Promise<Error | undefined>} - Returns an error if the user does not have the required permissions.
 */
export function AuthMiddleware(requiredPermissions: Permission[]) {
  return async (context: AuthContext) => {
    const { bearer, set } = context;
    if (!bearer) {
      set.status = 401;
      return UNAUTHORIZED_MISSING_TOKEN;
    }

    // Check that the token is valid and has the required permission.
    const tokenPermissions = await getTokenPermissions(bearer);
    if (!tokenPermissions) {
      set.status = UNAUTHORIZED_INVALID_TOKEN.code;
      return UNAUTHORIZED_INVALID_TOKEN;
    }

    const userPermissionKeys = tokenPermissions.map(
      (permission) => permission.key,
    );
    const hasWildcardPermission = userPermissionKeys.includes("*");

    const invalidPermission = requiredPermissions.find((permission) => {
      // If the user has wildcard, or required permission is '*', it's never invalid.
      if (hasWildcardPermission || permission === "*") return false;

      // If the required permission is not included in the user's permissions, it's invalid.
      return !userPermissionKeys.includes(permission);
    });

    if (invalidPermission) {
      set.status = 403;
      return {
        code: 403,
        message: `You do not have permission to perform ${invalidPermission} action`,
      };
    }
  };
}
