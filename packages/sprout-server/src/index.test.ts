// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { app } from ".";

describe("Elysia", () => {
  it("returns a health check message", async () => {
    const response = await await app
      .handle(new Request("http://localhost:3000"))
      .then((res) => res.json());

    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("message");
  });
});
