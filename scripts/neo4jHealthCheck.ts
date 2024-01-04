// @ts-ignore https://github.com/neo4j/neo4j-javascript-driver/issues/1140
import neo4j from "neo4j-driver/lib/browser/neo4j-web.esm.js";

(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = process.env.NEO4J_URI || "bolt://localhost:7687";
  const USER = process.env.NEO4J_USER || "neo4j";
  const PASSWORD = process.env.NEO4J_PASSWORD || "neo4j";
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log(serverInfo);
    console.log("Neo4j healthcheck passes");
    process.exit();
  } catch (err) {
    console.log(err);
  }
})();
