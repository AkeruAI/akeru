import { createSuperAdminForTesting } from "@/__tests__/utils";
import { app } from "@/index";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";
import { test, expect, describe } from "bun:test";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";

describe("assistantController", async () => {
  const token = await createSuperAdminForTesting();

  test("allows creating a assistant and the assistant is saved in the database", async () => {
    const name = "test assistant";
    const request = new Request("http://localhost:8080/assistant", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    });

    const response = await app.handle(request);
    const responseJson: any = await response.json();

    expect(responseJson).toHaveProperty("id");

    const id = responseJson.id;

    const session = getNeo4jSession();

    const result = await session.run("MATCH (t:Assistant {id: $id}) RETURN t", {
      id,
    });

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);
    const idInDb = node.properties.id;
    const nameInDb = node.properties.name;

    expect(idInDb).toEqual(id);
    expect(nameInDb).toBe(name);
  });

  test("prevents from creating a test if there is no api token present", async () => {
    const request = new Request("http://localhost:3000/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test assistant",
      }),
    });

    const response: any = await app
      .handle(request)
      .then((response) => response.json());

    expect(response.message).toBe(UNAUTHORIZED_MISSING_TOKEN.message);
  });
});
