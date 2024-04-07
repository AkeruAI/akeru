import {
  createHumanUserForTesting,
  createSuperAdminForTesting,
} from "@/__tests__/utils";
import { app } from "@/index";
import { test, expect, describe, beforeAll } from "bun:test";
import { UNAUTHORIZED_MISSING_TOKEN } from "../../ports/returnValues";
import { getThread } from "../../services/threadService";
import { parseToken } from "../../services/tokenService";
import { Thread } from "@/core/domain/thread";
import { getUser } from "../../services/userService";

describe.only("userController", async () => {
  let superAdminToken: string | null;
  let humanUserToken: string | null;

  beforeAll(async () => {
    superAdminToken = await createSuperAdminForTesting();
    humanUserToken = await createHumanUserForTesting();
  });

  test("allows creating a user and the user is saved in the database", async () => {
    const request = new Request("http://localhost:8080/users", {
      headers: {
        authorization: `Bearer ${superAdminToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: "Mr. Akeru",
        email: "wagmi@akeru.com",
      }),
    });

    const response = await app.handle(request);
    const responseJson: any = await response.json();

    expect(responseJson).toHaveProperty("token");
    const apiToken = responseJson.token;
    expect(apiToken).not.toBeNull();

    // From api token we can get the user id
    const parsedToken = await parseToken(apiToken);

    if (parsedToken) {
      const user = await getUser(parsedToken.userId);
      expect(user).not.toBeNull();
      expect(user?.name).toEqual("Mr. Akeru");
      expect(user?.email).toEqual("wagmi@akeru.com");
    }
  });

  test("prevents from creating a user if there is no api token present", async () => {
    const request = new Request("http://localhost:8080/users", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: "Mr. Akeru",
        email: "wagmi@akeru.com",
      }),
    });

    const response: any = await app
      .handle(request)
      .then((response) => response.json());
    expect(response.message).toBe(UNAUTHORIZED_MISSING_TOKEN.message);
  });

  test("prevents from creating a user if the user does not have create_user permission", async () => {
    const request = new Request("http://localhost:8080/users", {
      headers: {
        authorization: `Bearer ${humanUserToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: "Jr. Akeru",
        email: "ishouldnotexist@akeru.com",
      }),
    });

    const response: any = await app.handle(request);
    const responseJson = await response.json();
    expect(responseJson.message).toBe(
      "You do not have permission to perform create_user action"
    );
  });

  test("allows a human user to create a thread", async () => {
    const request = new Request("http://localhost:8080/thread", {
      headers: {
        authorization: `Bearer ${humanUserToken}`,
        "Content-type": "application/json",
      },
      method: "POST",
    });

    const response = await app.handle(request);
    const responseJson: any = await response.json();

    expect(responseJson).toHaveProperty("id");

    const id = responseJson.id;

    const thread = await getThread(id);

    expect(thread).not.toBeNull();
    expect(thread?.id).toEqual(id);
  });

  test("allows a human user to add messages to a thread they created", async () => {
    // Creating a thread for the test
    const createThreadResponse = await app.handle(
      new Request("http://localhost:8080/thread", {
        headers: {
          authorization: `Bearer ${humanUserToken}`,
          "Content-type": "application/json",
        },
        method: "POST",
      })
    );
    const thread: Thread = (await createThreadResponse.json()) as Thread;
    expect(thread).toHaveProperty("id");

    // Adding a message to the thread
    const response = await app.handle(
      new Request(`http://localhost:8080/thread/${thread.id}/message`, {
        headers: {
          authorization: `Bearer ${humanUserToken}`,
          "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          message: "Human user from userController test!",
        }),
      })
    );
    const messageResponse = (await response.json()) as any;

    expect(messageResponse).toHaveProperty("content");
    expect(messageResponse.content).toBe(
      "Human user from userController test!"
    );
  });
});
