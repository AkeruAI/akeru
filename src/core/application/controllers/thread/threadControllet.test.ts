import { createSuperAdminForTesting } from "@/__tests__/utils";
import { app } from "@/index";
import { getNeo4jSession } from "@/infrastructure/adaptaters/neo4jAdapter";
import { test, expect, describe } from "bun:test";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";

describe("threadController", async () => {
  const token = await createSuperAdminForTesting();

  test("allows creating a thread and the thread is saved in the database", async () => {
    const request = new Request("http://localhost:8080/thread", {
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
    const request = new Request("http://localhost:8080/thread", {
      method: "POST",
    });

    const response: any = await app
      .handle(request)
      .then((response) => response.json());

    expect(response.message).toBe(UNAUTHORIZED_MISSING_TOKEN.message);
  });

  test("should add a message to a thread", async () => {
    const createThreadRequest = new Request("http://localhost:8080/thread", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "POST",
    });

    const createThreadResponse = await app.handle(createThreadRequest);
    const createThreadResponseJson: any = await createThreadResponse.json();

    expect(createThreadResponseJson).toHaveProperty("id");

    const id = createThreadResponseJson.id;

    const message = "why are cats cute?";

    const request = new Request(`http://localhost:8080/thread/${id}/message`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        message,
      }),
    });

    const response: any = await app
      .handle(request)
      .then((response) => response.json());

    expect(response.content).toBe(message);
  });
});
