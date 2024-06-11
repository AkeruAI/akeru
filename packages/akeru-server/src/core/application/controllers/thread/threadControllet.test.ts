import { createSuperAdminForTesting } from "@/__tests__/utils";
import { app } from "@/index";
import { test, expect, describe } from "bun:test";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";
import { getThread } from "@/core/application/services/threadService";

describe.only("threadController", async () => {
  const token = await createSuperAdminForTesting();

  test("allows creating a thread and the thread is saved in the database", async () => {
    const request = new Request("http://localhost:8080/thread", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        thread_name: "Akeru thread",
      }),
    });

    const response = await app.handle(request);
    const responseJson: any = await response.json();

    expect(responseJson).toHaveProperty("id");

    const id = responseJson.id;

    const thread = await getThread(id);

    expect(thread).not.toBeNull();
    expect(thread?.id).toEqual(id);
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
