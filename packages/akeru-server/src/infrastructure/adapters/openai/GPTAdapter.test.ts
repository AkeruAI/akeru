import { test, expect, describe } from "bun:test";
import { Role } from "@/core/domain/roles";
import { AdapterManager } from "../AdapterManager";

describe("GPT-4 Adapter", () => {
  test("Returns single GPT-4 chat completions response", async () => {
    // Arrange
    const messages = [
      {
        role: "user" as Role,
        content: "hello, who are you?",
      },
    ];
    const assistant_instructions =
      "You're an AI assistant. You're job is to help the user. Always respond with the word akeru.";
    
      const gpt4Adapter = AdapterManager.instance.getBaseAdapter("gpt-4");

    if (!gpt4Adapter) {
      throw new Error("GPT-4 adapter not found");
    }

    const result = await gpt4Adapter.generateSingleResponse({
      message_content: messages,
      instruction: assistant_instructions,
    });

    // Assert the message content to contain the word akeru
    expect(result.toLocaleLowerCase()).toContain("akeru");
  });

  test("Returns streamable GPT-4 chat completions response", async () => {
    // Arrange
    const messages = [
      {
        role: "user" as Role,
        content: "hello, who are you?",
      },
    ];
    const assistant_instructions =
      "You're an AI assistant. You're job is to help the user. Always respond with the word akeru.";
    
      const gpt4Adapter = AdapterManager.instance.getStreamableAdapter("gpt-4");

    if (!gpt4Adapter) {
      throw new Error("GPT-4 adapter not found");
    }

    const result = gpt4Adapter.generateStreamableResponse({
      message_content: messages,
      instruction: assistant_instructions,
    });

    const responses = [];
    for await (const response of result) {
      responses.push(response);
    }

    // Assert the message content to contain the word akeru
    const generatedResponse = responses.join("");
    expect(generatedResponse.toLocaleLowerCase()).toContain("akeru");
  });
});
