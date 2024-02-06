import { test, expect, describe } from "bun:test";
import { gpt4Adapter } from "./gpt4Adapter";

interface resultType {
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
  }[];
}

describe("GPT-4 Adapter", () => {
  test("Returns GPT-4 chat completions response", async () => {
    // Arrange
    const messages =
      "This is a test, I need you to answer only this specific phrase: Hello, I'm doing well. How can I help you today?, anything else, just that";
    const SYSTEM_PROMPT =
      "You're an AI assistant. You're job is to help the user.";
    const expected = {
      finish_reason: "stop",
      index: 0,
      logprobs: null,
      message: {
        content: "Hello, I'm doing well. How can I help you today?",
        role: "assistant",
      },
    };
    // Act
    const result = (await gpt4Adapter(messages, SYSTEM_PROMPT)) as resultType;

    // Assert
    expect(result.choices[0]).toEqual(expected);
  });
});
