import { createSuperAdminForTesting } from "@/__tests__/utils";
import { app } from "@/index";
import { redis } from "@/infrastructure/adapters/redisAdapter";
import { test, expect, describe } from "bun:test";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";

describe("assistantController", async () => {
  const token = await createSuperAdminForTesting();

  test("allows creating an assistant and the assistant is saved in the database", async () => {
    const name = "test assistant";
    const request = new Request("http://localhost:8080/assistant", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name,
        model: "gpt-4",
        instruction: 'You are a plant teacher. Always respond with "akeru"',
      }),
    });

    const response = await app.handle(request);
    const responseJson: any = await response.json();

    expect(responseJson).toHaveProperty("id");

    const id = responseJson.id;

    // Retrieve the assistant data from Redis
    const assistantData = await redis.get(`assistant:${id}`);

    expect(assistantData).not.toBeNull();

    const assistant = JSON.parse(assistantData!);

    expect(assistant.name).toBe(name);
  });

  test("prevents from creating an assistant if there is no api token present", async () => {
    const request = new Request("http://localhost:3000/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "akeru_assistant",
        model: "gpt-4",
        instruction: "You are a plant teacher. Always respond with 'akeru'",
      }),
    });

    const response: any = await app
      .handle(request)

      .then((response) => response.json());

    expect(response.message).toBe(UNAUTHORIZED_MISSING_TOKEN.message);
  });
});
