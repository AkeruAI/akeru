import { Elysia, type PreHandler } from "elysia";
import { bearer } from "@elysiajs/bearer";
import neo4j from "neo4j-driver";
import { OpenAI } from "langchain/llms/openai";
import {
  getTokenPermissions,
  handleBearer,
} from "@/core/application/services/tokenService";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";

const llm = new OpenAI({
  temperature: 0.9,
  openAIApiKey: process.env.OPEN_AI_API_KEY!,
});

const text =
  "What would be a good company name for a company that makes colorful socks?";

const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "your_password")
);

const app = new Elysia()
  .use(bearer())
  .get(
    "/",
    async ({ bearer }) => {
      const tokenPermissions = await getTokenPermissions(bearer!);

      console.log(tokenPermissions);

      const session = getNeo4jSession();

      try {
        // Run a Cypher statement, creating a new node
        const statement = 'MERGE (n:Message {text: "Hello World"}) RETURN n';
        const result = await session.run(statement);
        // const llmResult = await llm.predict(text);

        return result.records[0].get(0).properties.text;
      } finally {
        // Close the session and driver connections
        await session.close();
        await driver.close();
      }
    },
    {
      beforeHandle: ({ bearer, set }) => {
        if (!bearer) {
          set.status = 400;
          set.headers[
            "WWW-Authenticate"
          ] = `Bearer realm='sign', error="invalid_request"`;

          return "Unauthorized";
        }
      },
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
