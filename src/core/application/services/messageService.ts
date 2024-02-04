import { v4 as uuidv4 } from "uuid";
import { redis } from "@/infrastructure/adaptaters/redisAdapter";
import { Message } from "@/core/domain/messages";

export async function createMessage(
  userId: string,
  threadId: string,
  messageContent: string
): Promise<Message> {
  const messageId = uuidv4();
  const timestamp = Date.now();

  // Create a pipeline for atomic operations
  const pipeline = redis.pipeline();

  // Store the message data
  pipeline.set(
    `message:${messageId}`,
    JSON.stringify({
      id: messageId,
      content: messageContent,
      senderId: userId,
      timestamp,
    })
  );

  // Store the relationship between the user and the message
  pipeline.sadd(`user:${userId}:messages`, messageId);

  // Store the relationship between the message and the thread
  pipeline.sadd(`thread:${threadId}:messages`, messageId);

  // Execute the operations
  await pipeline.exec();

  return {
    id: messageId,
    content: messageContent,
    senderId: userId,
    timestamp: new Date(timestamp),
  };
}

export async function getLastMessage(threadId: string) {
  // Get all the message IDs for the thread
  const messageIds = await redis.smembers(`thread:${threadId}:messages`);

  // If there are no messages, return null
  if (messageIds.length === 0) {
    return null;
  }

  // Get the data for all messages
  const messages = await Promise.all(
    messageIds.map(async (messageId) => {
      const messageData = await redis.get(`message:${messageId}`);
      return JSON.parse(messageData as string);
    })
  );

  // Sort the messages by timestamp in descending order and return the first one
  const lastMessage = messages.sort((a, b) => b.timestamp - a.timestamp)[0];

  return lastMessage;
}
