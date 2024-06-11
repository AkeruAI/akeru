import {
  createApiToken,
  createHumanUser,
} from "@/core/application/controllers/userController";
import { createAssistant } from "@/core/application/services/assistantService";
import { createThread } from "@/core/application/services/threadService";
import { ulid } from "ulid";

async function createHumanUserWithApiKey() {
  const userData = {
    name: "Mr. Akeru Human User",
    email: "thisistesting@akeru.com",
  };

  // Creating the human user for id
  const userId = await createHumanUser(userData);
  if (!userId) {
    console.error("Failed to create super admin user");
    return;
  }

  // creating user bearer token
  const apiKey = await createApiToken(userId);
  if (!apiKey) {
    console.error("Failed to create API key for super admin user");
    return;
  }

  // creating assistants associated with the user, creating three assistants
  const { id: id_1 } = await createAssistant({ userId, id: ulid(), model: "gpt-4", name: "Homework assistant", fileIds: [], tools: [], instruction: "You are a homework helper. Do not answer irrelevant questions." });
  const { id: id_2 } = await createAssistant({ userId, id: ulid(), model: "gpt-4", name: "Tropical Plant Expert", fileIds: [], tools: [], instruction: "You specialise in tropical plants. Do not answer irrelevant questions." });
  const { id: id_3 } = await createAssistant({ userId, id: ulid(), model: "gpt-4", name: "Marine Biologist", fileIds: [], tools: [], instruction: "You specialise in Marine Biology. Do not answer irrelevant questions." });

  // creating a few threads associated with said assistants 
  await createThread({ id: ulid(), createdBy: userId, participants: [], messageIds: [], name: 'Homework on Science' })
  await createThread({ id: ulid(), createdBy: userId, participants: [], messageIds: [], name: 'What are fishes?' })
  await createThread({ id: ulid(), createdBy: userId, participants: [], messageIds: [], name: 'Why do plants commonly die?' })

  console.log(`human user created with ID: ${userId}`);
  console.log(`API key for human user: ${apiKey}`);

  console.log(`assistant_id 1 created with ID: ${id_1}`);
  console.log(`assistant_id 2 created with ID: ${id_2}`);
  console.log(`assistant_id 3 created with ID: ${id_3}`);

  process.exit();
}

createHumanUserWithApiKey().catch((err) => {
  console.error("Error creating super admin user with API key:", err);
});
