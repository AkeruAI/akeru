import type { Message } from "@/core/domain/messages";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";

export async function createMessage(
  userId: string,
  threadId: string,
  messageContent: string
): Promise<Message> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      MATCH (t:Thread {id: $threadId})
      CREATE (m:Message {id: randomUUID(), content: $messageContent, timestamp: timestamp()})
      CREATE (u)-[:POSTS]->(m)
      CREATE (m)-[:BELONGS_TO]->(t)
      RETURN m
      `,
      {
        userId,
        threadId,
        messageContent,
      }
    );

    if (result.records.length === 0) {
      throw new Error("Failed to create message");
    }

    const record = result.records[0];
    const message = record.get("m").properties;
    console.log(message);

    return {
      id: message.id,
      content: message.content,
      senderId: userId,
      timestamp: new Date(Number(message.timestamp)),
    };
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    session.close();
  }
}

export async function getLastMessage(threadId: string) {
  const session = getNeo4jSession();
  const query = `
  MATCH (u:User)-[:POSTS]->(m:Message)-[:BELONGS_TO]->(t:Thread {threadId: $threadId})
  RETURN u, m
  ORDER BY m.timestamp DESC
  LIMIT 1
`;

  try {
    const result = await session.run(query, { threadId });
    const singleRecord = result.records[0];
    const user = singleRecord.get("u");
    const message = singleRecord.get("m");

    return {
      user: user.properties,
      message: message.properties,
    };
  } finally {
    await session.close();
  }
}
