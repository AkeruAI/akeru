/**
 * @fileoverview This file defines a set of permissions and a function to retrieve them.
 */

export type Permission =
  | "*"
  | "manage_users"
  | "create_user"
  | "view_all_records"
  | "edit_system_settings"
  | "view_own_records"
  | "create_thread"
  | "add_user_to_thread"
  | "view_own_threads"
  | "delete_own_thread"
  | "create_message_in_own_thread"
  | "create_document"
  | "view_own_documents"
  | "edit_own_documents"
  | "link_own_documents"
  | "create_assistant"
  | "delete_assistant"
  | "view_assistants";

export type PermissionDetails = {
  description: string;
};

export type PermissionDetailArray = {
  key: keyof typeof permissions;
  description: string;
}[];

/**
 * An object that defines a set of permissions.
 * @type {Object.<string, {description: string}>}
 */
export const permissions: Record<Permission, PermissionDetails> = {
  "*": {
    description: "Allows the user to perform any action.",
  },
  manage_users: {
    description: "Allows the user to manage other users.",
  },
  create_user: {
    description: "Allows the user to create a new user.",
  },
  view_all_records: {
    description: "Allows the user to view all records in the system.",
  },
  edit_system_settings: {
    description: "Allows the user to edit system-wide settings.",
  },
  view_own_records: {
    description: "Allows the user to view their own records.",
  },
  create_thread: {
    description:
      "Allows the user to create a new thread. A thread can be shared with other users.",
  },
  add_user_to_thread: {
    description: "Allows the user to add other users to a thread.",
  },
  view_own_threads: {
    description: "Allows the user to view their own threads.",
  },
  delete_own_thread: {
    description: "Allows the user to delete their own thread.",
  },
  create_message_in_own_thread: {
    description: "Allows the user to create a message in their own thread.",
  },
  create_document: {
    description:
      "Allows the user to create a document. A document can be shared with other users.",
  },
  view_own_documents: {
    description: "Allows the user to view their own documents.",
  },
  edit_own_documents: {
    description: "Allows the user to edit their own documents.",
  },
  link_own_documents: {
    description: "Allows the user to link their own documents to a thread.",
  },
  create_assistant: {
    description: "Allows the user to create an assistant.",
  },
  delete_assistant: {
    description: "Allows the user to delete an assistant.",
  },
  view_assistants: {
    description: "Allows the user to view all assistants.",
  },
};

/**
 * Retrieves the details of the specified permissions.
 * @param {string[]} permissionKeys - An array of keys representing the permissions to retrieve.
 * @returns {Object[]} An array of objects, each containing the key and details of a permission.
 * @throws {Error} Will throw an error if a permission key is not found.
 */
export function getPermissions(permissionKeys: string[]): object[] {
  return permissionKeys.map((key) => {
    const permission = permissions[key as Permission];
    if (!permission) {
      throw new Error(`Permission not found: ${key}`);
    }
    return { key, ...permission };
  });
}
