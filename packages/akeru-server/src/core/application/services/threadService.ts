import { Thread } from "@/core/domain/thread";
import { redis } from "@/infrastructure/adapters/redisAdapter";

/**
 * Creates a new thread in Redis.
 * @param {Thread} thread - The thread data.
 * @returns {Promise<string>} A promise that resolves to the created thread.
 */
export async function createThread(thread: Thread): Promise<string> {
  // Create a pipeline for atomic operations
  const pipeline = redis.pipeline();

  // Store the thread data
  pipeline.set(`thread:${thread.id}`, JSON.stringify(thread));

  // Store the relationship between the thread and its creator
  pipeline.sadd(`user:${thread.createdBy}:threads`, thread.id);

  // Store the relationship between the thread and its participants
  thread.participants.forEach((participantId) => {
    pipeline.sadd(`user:${participantId}:threads`, thread.id);
  });

  // Execute the operations
  await pipeline.exec();

  return thread.id;
}

/**
 * Deletes a thread from Redis if the user is the owner of the thread.
 * @param {string} threadId - The ID of the thread to delete.
 * @param {string} userId - The ID of the user attempting to delete the thread.
 * @returns {Promise<void>} A promise that resolves when the thread is deleted.
 */
export async function deleteThread(
  threadId: string,
  userId: string
): Promise<void> {
  // Create a pipeline for atomic operations
  const pipeline = redis.pipeline();

  // Delete the thread data
  pipeline.del(`thread:${threadId}`);

  // Remove the relationship between the thread and its creator
  pipeline.srem(`user:${userId}:threads`, threadId);

  // Execute the operations
  await pipeline.exec();
}

/**
 * Retrieves all threads created by a user from Redis.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of thread IDs.
 */
export async function getUserThreads(userId: string): Promise<string[]> {
  // Fetch the set of thread IDs associated with the user
  const threadIds = await redis.smembers(`user:${userId}:threads`);

  return threadIds;
}

/**
 * Checks if a user created a thread or is a participant in it.
 * @param {string} threadId - The ID of the thread.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the user created the thread or is a participant in it.
 */
export async function userOwnsOrParticipatesInThread(
  threadId: string,
  userId: string
): Promise<boolean> {
  // Check if the user is the creator of the thread
  const isCreator = await redis.sismember(`user:${userId}:threads`, threadId);

  // Check if the user is a participant in the thread
  const isParticipant = await redis.sismember(
    `thread:${threadId}:participants`,
    userId
  );

  return Boolean(isCreator || isParticipant);
}

/**
 * Retrieves a thread from Redis.
 * @param {string} threadId - The ID of the thread to retrieve.
 * @returns {Promise<Thread | null>} A promise that resolves to the thread or null if not found.
 */
export async function getThread(threadId: string): Promise<Thread | null> {
  const threadData = await redis.get(`thread:${threadId}`);

  if (!threadData) {
    return null;
  }

  return JSON.parse(threadData);
}
