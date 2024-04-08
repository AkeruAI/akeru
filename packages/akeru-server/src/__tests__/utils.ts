import {
  createApiToken,
  createSuperAdmin,
} from "@/core/application/controllers/userController";
import { createHumanUser } from "@/core/application/services/userService";
import { ulid } from "ulid";

export async function createSuperAdminForTesting(): Promise<string | null> {
  const userData = {
    // Add any necessary user data here
  };

  const userId = await createSuperAdmin(userData);
  if (!userId) {
    throw new Error("Failed to create super admin user");
  }

  const apiKey = await createApiToken(userId);
  if (!apiKey) {
    throw new Error("Failed to create API key for super admin user");
  }

  return apiKey;
}

export async function createHumanUserForTesting(): Promise<string | null> {
  const userData = {
    name: "Akeru Tester",
    email: "tester@akeru.com",
  };

  const humanUserId = await createHumanUser(userData);
  if (!humanUserId) {
    throw new Error("Failed to create human user");
  }

  const apiKey = await createApiToken(humanUserId);
  if (!apiKey) {
    throw new Error("Failed to create API key for human user");
  }

  return apiKey;
}
