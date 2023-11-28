import { redis } from "@/infrastructure/adaptaters/redisAdapter";
import { getUserPermissions } from "@/core/application/services/userService";
import jwt from "jsonwebtoken";

/**
 * Creates a new API token for a user with their associated permissions.
 * @param {string} userId - The ID of the user to create the token for.
 * @returns {Promise<string>} A promise that resolves to the new token.
 */
export async function createToken(userId: string): Promise<string> {
  const permissions = await getUserPermissions(userId);
  const tokenData = { userId, permissions };

  console.log(process.env.API_ENCRYPTION_KEY);

  // Sign the token data with a secret key to create the JWT
  const token = jwt.sign(tokenData, process.env.API_ENCRYPTION_KEY!);

  await redis.hset("api_tokens", token, JSON.stringify(tokenData));
  return token;
}

/**
 * Retrieves the permissions associated with a specific API token.
 * @param {string} token - The API token to retrieve permissions for.
 * @returns {Promise<string[]|null>} A promise that resolves to an array of permissions, or null if the token was not found.
 */
export async function getTokenPermissions(
  token: string
): Promise<string[] | null> {
  const tokenData = await redis.hget("api_tokens", token);
  if (!tokenData) {
    return null;
  }
  const { permissions } = JSON.parse(tokenData);
  return permissions;
}
