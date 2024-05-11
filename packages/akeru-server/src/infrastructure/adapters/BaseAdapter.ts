import { AdapterRequest } from "./adapter";

export interface StreamableAdapter {
  generateStreamableResponse(args: AdapterRequest): AsyncGenerator<string>;
}

/**
 * BaseAdapter defines the interface for any Adapters that we have without defining the implementation.
 */
export abstract class BaseAdapter {

  abstract adapterName: string;
  abstract adapterDescription: string;

  /**
   * Based on a set of roles and content, generate a response.
   * @param everyRoleAndContent - An array of roles and content.
   * @param instruction - The instruction given to the assistant.
   */
  abstract generateSingleResponse(args: AdapterRequest): Promise<string>;

  /**
   * Based on the attributes of the adapter return the response of the adapter.
   * This implementation can vary from adapters, for instance OpenAI adapters have their own endpoints that can be called.
   * @returns Any object that contains the information of the adapter.
   */
  abstract getAdapterInformation(): Object;
}
