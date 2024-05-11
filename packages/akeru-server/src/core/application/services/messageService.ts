import { v4 as uuidv4 } from "uuid";
import { Message } from "@/core/domain/messages";
import dayjs from "dayjs";
import { getUserRole } from "./userService";
import { redis } from "@/infrastructure/adapters/redisAdapter";

export async function createMessage(
  userId: string,
  threadId: string,
  messageContent: string
): Promise<Message> {
  const messageId = uuidv4();
  const timestamp = Date.now();
  const userRole = await getUserRole(userId) // denormalize role information when creating messages for adapter

  // if no userRole, throw because cannot create message
  if(!userRole) throw new Error("User roles missing")

  // Create a pipeline for atomic operations
  const pipeline = redis.pipeline();

  // Store the message data
  pipeline.set(
    `message:${messageId}`,
    JSON.stringify({
      id: messageId,
      content: messageContent,
      senderId: userId,
      role: userRole.role,
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
    role: userRole.role
  };
}

export async function getAllMessage(threadId: string) {
  // Get all the message IDs for the thread
  const messageIds = await redis.smembers(`thread:${threadId}:messages`);

  // If there are no messages, return null
  if (messageIds.length === 0)  return [];

  // Get the data for all messages
  const messages = await Promise.all(
    messageIds.map(async (messageId) => {
      const messageData = await redis.get(`message:${messageId}`) as string;
      return JSON.parse(messageData) as Message;
    })
  );

  // Sort the messages by timestamp in descending order
  const allMessages = messages.sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));

  return allMessages;
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
