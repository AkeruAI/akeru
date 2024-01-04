import { type Driver, type Session } from "neo4j-driver-lite";
// @ts-ignore https://github.com/neo4j/neo4j-javascript-driver/issues/1140
import neo4j from "neo4j-driver/lib/browser/neo4j-web.esm.js";

import { neo4jConfig } from "../config/neo4jConfig";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      neo4jConfig.uri,
      neo4j.auth.basic(neo4jConfig.user, neo4jConfig.password)
    ) as Driver;
  }
  driver.getServerInfo();
  return driver as Driver;
}

export function getNeo4jSession(): Session {
  return getNeo4jDriver().session();
}
