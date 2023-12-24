import { assignRole, createUser } from "core/application/services/userService";
import { createToken } from "@/core/application/services/tokenService";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";
import { ulid } from "ulid";

/**
 * Creates a new user with a random ID and assigns them the "super admin" role.
 * Also creates the user in Neo4j.
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

    // Create the user in Neo4j
    const session = getNeo4jSession();
    await session.run(
      `
      CREATE (u:User {id: $userId, data: CASE WHEN size(keys($userData)) > 0 THEN $userData ELSE null END})
      `,
      { userId, userData }
    );
    session.close();

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
    return null;
  }
}
