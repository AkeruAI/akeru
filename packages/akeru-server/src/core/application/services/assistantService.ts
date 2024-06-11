import type { Assistant } from "@/core/domain/assistant";
import { User } from "@/core/domain/user";
import { redis } from "@/infrastructure/adapters/redisAdapter";

/**
 * Creates an assistant in Redis if it does not exist and adds a 'CREATED_BY' relationship to the user.
 *
 * @param {Assistant & { userId: string }} args - The assistant details and the user ID.
 * @returns {Promise<Record<string, any>>} The properties of the created assistant.
 * @throws {Error} If there is an error creating the assistant or adding the relationship.
 */
export async function createAssistant(args: Assistant & { userId: string }) {
  const { id, fileIds, tools, userId, model, name, instruction } = args;

  // Create a pipeline for atomic operations
  const pipeline = redis.pipeline();

  // Store the assistant data
  pipeline.set(
    `assistant:${id}`,
    JSON.stringify({ tools, model, name, instruction, id })
  );

  // Store the relationship between the assistant and the user
  pipeline.sadd(`user:${userId}:assistants`, id);

  // Execute the operations
  await pipeline.exec();

  // Retrieve the assistant data
  const assistantData = await redis.get(`assistant:${id}`);

  if (!assistantData) {
    throw new Error("Failed to create assistant");
  }

  // Parse the assistant data from JSON
  return JSON.parse(assistantData) as Assistant;
}

export async function getAssistantData(args: {
  query: Assistant["id"] | "ALL";
  userId: User["id"];
}) {
  const { query, userId } = args;

  // if query is ALL then fetch all relevant assistant data
  if (query === "ALL") {
    const allAssistantData = await redis.smembers(`user:${userId}:assistants`);
    return Promise.all(
      allAssistantData.map(async (assistantId) => {
        const assistantData = await redis.get(`assistant:${assistantId}`);
        if (!assistantData) {
          throw new Error("Failed to get assistant");
        }
        return JSON.parse(assistantData) as Assistant;
      })
    );
  }

  const assistantData = await redis.get(`user:${userId}:assistant:${query}`);
  if (!assistantData) {
    throw new Error("Failed to get assistant");
  }

  // Parse the assistant data from JSON
  return JSON.parse(assistantData) as Assistant;
}
