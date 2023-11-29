import { Thread } from "@/core/domain/thread";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";

/**
 * Creates a new thread in Neo4j.
 * @param {Thread} thread - The thread data.
 * @returns {Promise<Thread>} A promise that resolves to the created thread.
 */
export async function createThread(thread: Thread): Promise<Thread> {
  const session = getNeo4jSession();

  try {
    thread.startDate = new Date();

    // Automatically add the user creating the thread to the participants list
    if (!thread.participants.includes(thread.createdBy)) {
      thread.participants.push(thread.createdBy);
    }

    const result = await session.run(
      `
            MERGE (u:User {id: $userId})
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
      thread
    );

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    return node.properties as Thread;
  } finally {
    session.close();
  }
}
