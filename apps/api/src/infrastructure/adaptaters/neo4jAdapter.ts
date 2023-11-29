import neo4j, { type Driver, type Session } from "neo4j-driver";

import { neo4jConfig } from "../config/neo4jConfig";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      neo4jConfig.uri,
      neo4j.auth.basic(neo4jConfig.user, neo4jConfig.password)
    );
  }
  return driver as Driver;
}

export function getNeo4jSession(): Session {
  return getNeo4jDriver().session();
}
