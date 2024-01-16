import type { Assistant } from "@/core/domain/assistant";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";

/**
 * Creates an assistant in Neo4j if it does not exist and adds a 'CREATED_BY' relationship to the user.
 *
 * @param {Assistant & { userId: string }} args - The assistant details and the user ID.
 * @returns {Promise<Record<string, any>>} The properties of the created assistant.
 * @throws {Error} If there is an error creating the assistant or adding the relationship.
 */
export async function createAssistant(args: Assistant & { userId: string }) {
  const { id, fileIds, tools, userId, model, name } = args;

  const session = getNeo4jSession();

  // implenting file ids and tools will happen later. They should be relations
  try {
    const result = await session.run(
      `
      MERGE (a:Assistant {id: $assistantId})
      ON CREATE SET a.tools = $assistantTools, a.model = $assistantModel, a.name = $assistantName
      WITH a
      MATCH (u:User {id: $userId})
      MERGE (a)-[:CREATED_BY]->(u)
      RETURN a
      `,
      {
        assistantId: id,
        assistantTools: tools,
        assistantModel: model,
        userId: userId,
        assistantName: name,
      }
    );

    return result.records[0].get("a").properties;
  } finally {
    await session.close();
  }
}
