import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { swagger } from "@elysiajs/swagger";

import { threads } from "@/core/application/controllers/thread/threadController";
import { assistants } from "@/core/application/controllers/assistant/assistantController";
import { users } from "./core/application/controllers/user/userController";

export const name = "Akeru";

export const healthCheck = async () => {
  return {
    name: "Your API Name",
    description:
      "This is an open-source alternative to OpenAI's Assistant API. It provides a powerful, flexible AI model for generating human-like text based on the input provided. It's designed to assist developers in creating applications that require natural language processing and generation, from chatbots to content creators and more.",
    message: "API is up and running",
    timestamp: Date.now(),
  };
};

export const app = new Elysia()
  .use(swagger())
  .use(bearer())
  .use(assistants)
  .use(threads)
  .use(users)
  .get("/", healthCheck)
  .listen(process.env.PORT || 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
