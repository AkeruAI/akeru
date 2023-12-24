import { createSuperAdminForTesting } from "@/__tests__/utils";
import { app } from "@/index";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";
import { test, expect, describe } from "bun:test";
import { UNAUTHORIZED_MISSING_TOKEN } from "./returnValues";

describe("threadController", async () => {
  const token = await createSuperAdminForTesting();

  test("allows creating a thread and the thread is saved in the database", async () => {
    const request = new Request("http://localhost:3000/thread", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "POST",
    });

    const response = await app.handle(request);
    const responseJson: any = await response.json();

    expect(responseJson).toHaveProperty("id");

    const id = responseJson.id;

    const session = getNeo4jSession();

    const result = await session.run("MATCH (t:Thread {id: $id}) RETURN t", {
      id,
    });

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);
    const idInDb = node.properties.id;

    expect(idInDb).toEqual(id);
  });

  test("prevents from creating a test if there is no api token present", async () => {
    const request = new Request("http://localhost:3000/thread", {
      method: "POST",
    });

    const response: any = await app
      .handle(request)
      .then((response) => response.json());

    expect(response.message).toBe(UNAUTHORIZED_MISSING_TOKEN.message);
  });
});
