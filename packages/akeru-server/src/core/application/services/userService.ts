// userService.js

import { Role, getRolePermissions } from "@/core/domain/roles";
import { HumanUserBody, User, UserRole } from "@/core/domain/user";
import { redis } from "@/infrastructure/adapters/redisAdapter";
import { ulid } from "ulid";

/**
 * Function to create a new user
 * @param {string} userId - The ID of the user to create
 * @param {Object} userData - The data of the user to create
 * @returns {Promise<boolean>} A promise that resolves to true if the user was created successfully, false otherwise
 */
export const createUser = async (
  userId: string,
  userData: object
): Promise<boolean> => {
  try {
    await redis.hset("users", userId, JSON.stringify(userData));
    return true;
  } catch (err) {
    console.error("Error creating user:", err);
    return false;
  }
};

/**
 * Function to assign a role to a user
 * @param {string} userId - The ID of the user to assign the role to
 * @param {string} roleName - The name of the role to assign
 * @returns {Promise<boolean>} A promise that resolves to true if the role was assigned successfully, false otherwise
 */
export const assignRole = async (
  userId: string,
  roleName: Role
): Promise<boolean> => {
  try {
    const permissions = getRolePermissions(roleName);
    await redis.hset(
      "user_roles",
      userId,
      JSON.stringify({ role: roleName, permissions })
    );
    return true;
  } catch (err) {
    console.error("Error assigning role:", err);
    return false;
  }
};

/**
 * Function to check if a user has a specific permission
 * @param {string} userId - The ID of the user to check the permission for
 * @param {string} permission - The permission to check
 * @returns {Promise<boolean>} A promise that resolves to true if the user has the permission, false otherwise
 */
export const checkUserPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  try {
    const roleData = await redis.hget("user_roles", userId);
    if (!roleData) {
      return false;
    }

    const { permissions } = JSON.parse(roleData);
    return permissions.includes(permission);
  } catch (err) {
    console.error("Error checking user permission:", err);
    return false;
  }
};

/**
 * Function to remove a specific permission from a user
 * @param {string} userId - The ID of the user to remove the permission from
 * @param {string} permission - The permission to remove
 * @returns {Promise<boolean>} A promise that resolves to true if the permission was removed successfully, false otherwise
 */
export const removePermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  try {
    const roleData = await redis.hget("user_roles", userId);
    if (!roleData) {
      return false;
    }

    const { permissions } = JSON.parse(roleData);
    const newPermissions = permissions.filter((p: string) => p !== permission);
    await redis.hset(
      "user_roles",
      userId,
      JSON.stringify({ permissions: newPermissions })
    );
    return true;
  } catch (err) {
    console.error("Error removing permission:", err);
    return false;
  }
};

/**
 * Function to get all permissions of a user
 * @param {string} userId - The ID of the user to get the permissions for
 * @returns {Promise<string[]>} A promise that resolves to an array of permissions
 */
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const roleData = await redis.hget("user_roles", userId);
    if (!roleData) {
      return [];
    }

    const { permissions } = JSON.parse(roleData);
    return permissions;
  } catch (err) {
    console.error("Error getting user permissions:", err);
    return [];
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userData = await redis.hget("users", userId);
  if (!userData) return null

  return JSON.parse(userData)
}

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  const roleData = await redis.hget("user_roles", userId);
  if (!roleData) return null

  return JSON.parse(roleData) as UserRole
}

/**
 * Creates a new human user with a unique identifier and assigns them a 'user' role.
 * If the user cannot be created or the role cannot be assigned, the function returns `null`.
 *
 * @param {User} userData - An object containing the data of the user to be created.
 * @returns {Promise<string|null>} A promise that resolves to the user ID of the newly created user,
 * or `null` if the user could not be created or the role could not be assigned.
 */
export const createHumanUser = async (userData: HumanUserBody): Promise<string | null> => {
  const userId = ulid();

  const userCreated = await createUser(userId, userData);
  if (!userCreated) return null

  const roleAssigned = await assignRole(userId, "user");
  if (!roleAssigned) return null

  return userId
}
