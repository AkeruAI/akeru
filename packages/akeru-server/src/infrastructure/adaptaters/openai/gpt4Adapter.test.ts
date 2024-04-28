import { test, expect, describe } from "bun:test";
import { OpenAIResponse, gpt4Adapter } from "./gpt4Adapter";
import { Role } from "@/core/domain/roles";

describe("GPT-4 Adapter", () => {
  test("Returns GPT-4 chat completions response", async () => {
    // Arrange
    const messages = [
      {
        role: "user" as Role,
        content: "hello, who are you?",
      },
    ];
    const assistant_instructions =
      "You're an AI assistant. You're job is to help the user. Always respond with the word akeru.";
    // Act
    const result = (await gpt4Adapter(
      messages,
      assistant_instructions
    )) as OpenAIResponse;

    // Assert the message content to contain the word akeru
    expect(result.choices[0].message.content.toLocaleLowerCase()).toContain(
      "akeru"
    );
  });
});


