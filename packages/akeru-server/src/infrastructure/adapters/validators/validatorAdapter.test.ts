import { test, expect, describe } from "bun:test";

import { Role } from "@/core/domain/roles";
import { ValidatorResponse, validatorAdapter } from "./validatorAdapter";
import { ValidatorModels } from "./models";

describe("Validator Adapter", () => {
  test("Returns validator chat completions response", async () => {
    // Arrange
    const messages = [
      {
        role: "user" as Role,
        content: "hello, who are you?",
      },
    ];
    const model: ValidatorModels = "llama-2-7b-chat-int8";
    const assistant_instructions =
      "You're an AI assistant. You're job is to help the user. Always respond with the word akeru.";
    // Act
    const result = (await validatorAdapter(
      messages,
      model,
      assistant_instructions
    )) as ValidatorResponse;

    // Assert the message content to contain the word akeru
    expect(result.choices[0].message.content.toLocaleLowerCase()).toContain(
      "akeru"
    );
  });
});
