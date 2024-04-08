import { app } from "@/index";
import { test, expect, describe } from "bun:test";
import { getLastMessage } from "../../services/messageService";
import { Message } from "@/core/domain/messages";
import { createHumanUserForTesting } from "@/__tests__/utils";

describe.only("threadController", async () => {
  const token = await createHumanUserForTesting();

  test("Run a created thread with a created assistant and save response from assistant", async () => {
    // Creating a new thread
    const thread_request = new Request("http://localhost:8080/thread", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const thread_response = await app.handle(thread_request);
    const thread_response_json: any = await thread_response.json();
    expect(thread_response_json).toHaveProperty('id')
    const thread_id = thread_response_json.id 

    // Creating a new assistant
    const assistant_name = "Skater Assistant"
    const assistant_request = new Request("http://localhost:8080/assistant", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: assistant_name,
        model: 'gpt-4',
        instruction: "You are a pro skater, give very short skating tips. Always respond with 'skate on'."
      }),
    });
    const assistant_req = await app.handle(assistant_request)
    const assistant_req_json = await assistant_req.json()
    expect(assistant_req_json).toHaveProperty("id")
    const assistant_id = assistant_req_json.id 
    
    // Running a thread 
    const thread_run_request = new Request(`http://localhost:8080/thread/${thread_id}/run`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        assistant_id: assistant_id
      }),
    });
    const run_response = await app.handle(thread_run_request)
    const run_json = await run_response.json()

    // expect run_response to have thread_id, and thread_id's latest message to be from assistant, with the content of 'skate on' 
    expect(run_json).toHaveProperty('thread_id')
    expect(run_json).toHaveProperty('assistant_id')

    // get the latest message from thread id
    const lastMessage: Message = await getLastMessage(run_json.thread_id)
    expect(lastMessage.role).toBe('assistant')
    expect(lastMessage.content.toLocaleLowerCase()).toContain('skate on')
  })


});
