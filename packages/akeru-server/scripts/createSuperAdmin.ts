import {
  createApiToken,
  createSuperAdmin,
} from "@/core/application/controllers/userController";

async function createSuperAdminWithApiKey() {
  const userData = {
  };

  const userId = await createSuperAdmin(userData);
  if (!userId) {
    console.error("Failed to create super admin user");
    return;
  }

  const apiKey = await createApiToken(userId);

  if (!apiKey) {
    console.error("Failed to create API key for super admin user");
    return;
  }

  console.log(`Super admin user created with ID: ${userId}`);
  console.log(`API key for super admin user: ${apiKey}`);
  process.exit();
}

createSuperAdminWithApiKey().catch((err) => {
  console.error("Error creating super admin user with API key:", err);
});
