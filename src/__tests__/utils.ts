import {
  createApiToken,
  createSuperAdmin,
} from "@/core/application/controllers/userController";

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
