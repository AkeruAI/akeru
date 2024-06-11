import { assignRole, createUser } from "core/application/services/userService";
import { createToken } from "@/core/application/services/tokenService";
import { redis } from "@/infrastructure/adapters/redisAdapter";
import { ulid } from "ulid";

/**
 * Creates a new user with a random ID and assigns them the "super admin" role.
 * Also creates the user in Redis.
 * WARNING: This function should only be used in seeding scripts.
 * @param {Object} userData - The data of the user to create.
 * @returns {Promise<string>} A promise that resolves to the ID of the new user if the user was created and assigned the role successfully, or null otherwise.
 */
export async function createSuperAdmin(
  userData: Object
): Promise<string | null> {
  try {
    const userId = ulid();
    const userCreated = await createUser(userId, userData);
    if (!userCreated) {
      return null;
    }

    const roleAssigned = await assignRole(userId, "super_admin");
    if (!roleAssigned) {
      return null;
    }

    // Create the user in Redis
    await redis.set(`user:${userId}`, JSON.stringify(userData));

    return userId;
  } catch (err) {
    console.error("Error creating super admin:", err);
    return null;
  }
}

/**
 * Creates a new user with a random ID and assigns them the "super admin" role.
 * Also creates the user in Redis.
 * WARNING: This function should only be used in seeding scripts.
 * @param {Object} userData - The data of the user to create.
 * @returns {Promise<string>} A promise that resolves to the ID of the new user if the user was created and assigned the role successfully, or null otherwise.
 */
export async function createHumanUser(
  userData: Object
): Promise<string | null> {
  try {
    const userId = ulid();
    const userCreated = await createUser(userId, userData);
    if (!userCreated) {
      return null;
    }

    const roleAssigned = await assignRole(userId, "user");
    if (!roleAssigned) {
      return null;
    }

    // Create the user in Redis
    await redis.set(`user:${userId}`, JSON.stringify(userData));

    return userId;
  } catch (err) {
    console.error("Error creating super admin:", err);
    return null;
  }
}

/**
 * Creates a new API token for a user.
 * WARNING: This function should only be used in seeding scripts.
 * @param {string} userId - The ID of the user to create the token for.
 * @returns {Promise<string | null>} A promise that resolves to the new token if it was created successfully, or null otherwise.
 */
export async function createApiToken(userId: string): Promise<string | null> {
  try {
    const token = await createToken(userId);
    return token;
  } catch (err) {
    console.error("Error creating API token:", err);
    throw err;
  }
}
