import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";

import { threads } from "@/core/application/controllers/thread/threadController";

export const name = "Sprout";

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
  .use(bearer())
  .use(threads)
  .get("/", healthCheck)
  .listen(process.env.PORT || 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
