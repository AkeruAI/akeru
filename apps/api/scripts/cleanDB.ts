import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";
import { redis } from "@/infrastructure/adaptaters/redisAdapter";

const script = async () => {
  const session = getNeo4jSession();
  await redis.flushdb();
  console.log("cleaned redis db");
  await session.run("MATCH (n) DETACH DELETE n");
  console.log("cleaned neo4j db");
  console.log("done");
  process.exit();
};

script();
