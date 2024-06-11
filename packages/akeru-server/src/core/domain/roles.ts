/**
 * @fileoverview This file defines a set of roles and a function to retrieve their permissions.
 */

import { getPermissions, type Permission } from "./permissions";

export type Role = "super_admin" | "user" | "assistant";

const roles: Record<Role, { permissions: Permission[] }> = {
  super_admin: {
    permissions: ["*"],
  },
  user: {
    permissions: [
      "view_own_records",
      "create_thread",
      "view_own_threads",
      "create_message_in_own_thread",
      "create_assistant",
      "view_assistants"
    ],
  },
  assistant: {
    permissions: [
      "view_own_records",
      "create_thread",
      "view_own_threads",
      "create_message_in_own_thread",
    ],
  },
};

/**
 * Type guard to check if a string is a valid Role.
 * @param {string} roleName - The string to check.
 * @returns {roleName is Role} True if the string is a valid Role, false otherwise.
 */
function isRole(roleName: string): roleName is Role {
  return roleName in roles;
}

export function getRolePermissions(roleName: string) {
  if (!isRole(roleName)) {
    throw new Error(`Role not found: ${roleName}`);
  }
  const role = roles[roleName];
  return getPermissions(role.permissions);
}
