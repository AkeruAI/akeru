import { Thread } from "@/core/domain/thread";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";

/**
 * Creates a new thread in Neo4j.
 * @param {Thread} thread - The thread data.
 * @returns {Promise<string>} A promise that resolves to the created thread.
 */
export async function createThread(thread: Thread): Promise<string> {
  const session = getNeo4jSession();

  try {
    // Automatically add the user creating the thread to the participants list
    if (!thread.participants.includes(thread.createdBy)) {
      thread.participants.push(thread.createdBy);
    }

    await session.run(
      `
      MERGE (u:User {id: $createdBy}) 
      CREATE (t:Thread {id: $id, startDate: $startDate}) 
      CREATE (u)-[:CREATED]->(t)  
      
      WITH t 
      UNWIND $participants AS participantId 
      MERGE (p:User {id: participantId})
      CREATE (p)-[:PARTICIPATES_IN]->(t)  
      
      WITH t
      UNWIND $messageIds AS messageId  
      MERGE (m:Message {id: messageId})
      CREATE (t)-[:HAS_MESSAGE]->(m)
      
      RETURN t
      `,
      {
        ...thread,
        startDate: new Date().toString(),
      }
    );

    return thread.id;
  } catch (err) {
    throw err;
  } finally {
    session.close();
  }
}

/**
 * Deletes a thread from Neo4j if the user is the owner of the thread.
 * @param {string} threadId - The ID of the thread to delete.
 * @param {string} userId - The ID of the user attempting to delete the thread.
 * @returns {Promise<void>} A promise that resolves when the thread is deleted.
 */
export async function deleteThread(
  threadId: string,
  userId: string
): Promise<void> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED]->(t:Thread {id: $threadId})
      WITH t
      DETACH DELETE t
      RETURN COUNT(t) as deletedCount
      `,
      {
        threadId,
        userId,
      }
    );

    if (result.records[0].get("deletedCount") === 0) {
      throw new Error(
        "Unauthorized: User does not own the thread or thread does not exist"
      );
    }
  } catch (err) {
    throw err;
  } finally {
    session.close();
  }
}

/**
 * Retrieves all threads created by a user from Neo4j.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of thread IDs.
 */
export async function getUserThreads(userId: string): Promise<string[]> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED]->(t:Thread)
      RETURN t.id
      `,
      {
        userId,
      }
    );

    return result.records.map((record) => record.get("t.id"));
  } catch (err) {
    throw err;
  } finally {
    session.close();
  }
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
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED|:PARTICIPATES_IN]->(t:Thread {id: $threadId})
      RETURN COUNT(t) as threadCount
      `,
      {
        threadId,
        userId,
      }
    );

    return result.records[0].get("threadCount") > 0;
  } catch (err) {
    throw err;
  } finally {
    session.close();
  }
}

/**
 * Retrieves a thread from Neo4j.
 * @param {string} threadId - The ID of the thread to retrieve.
 * @returns {Promise<any>} A promise that resolves to the thread.
 */
export async function getThread(threadId: string): Promise<any> {
  const session = getNeo4jSession();

  console.log(threadId);

  try {
    const result = await session.run(
      `
      MATCH (t:Thread {id: $threadId})
      RETURN t
      `,
      {
        threadId,
      }
    );

    if (result.records.length === 0) {
      throw new Error("Thread not found");
    }

    return result.records[0].get("t");
  } catch (err) {
    throw err;
  } finally {
    session.close();
  }
}
