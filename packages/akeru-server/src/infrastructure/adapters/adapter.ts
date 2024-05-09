import { Message } from "@/core/domain/messages"
import { GPTModels } from "./openai/models"
import { ValidatorModels } from "./validators/models"

/**
 * AdapterMessageContent will be part of the prompt for the ai adapter to generate a response
 * @param content: string The content of the message
 * @param role: Role This role is stringified 
 */
export type AdapterMessageContent = Pick<Message, "content" | "role">

/**
 * AdapterRequest is the prompt to the adapter to generate a response
 * @param message_content: AdapterMessageContent The content of the message
 * @param instruction: string The instruction for the adapter to follow based on the selected assistant
 */
export interface AdapterRequest {
  message_content: AdapterMessageContent[],
  instruction: string 
}

export type SupportedModels = GPTModels | ValidatorModels

