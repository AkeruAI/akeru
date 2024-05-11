import { BaseAdapter, StreamableAdapter } from "./BaseAdapter";
import { SupportedModels } from "./adapter";
import { GPTAdapter } from "./openai/GPTAdapter";
import { GPTModels } from "./openai/models";

/**
 * The AdapterManager is used to decide what adapter to use for a given assistant
 * @param StreamableAdapter - The adapter that is used to generate a streamable response
 * @param Adapters - The adapter that is used to generate a single response
 * @returns The AdapterManager instance
 */
export class AdapterManager {

  private StreamableAdapter: Map<SupportedModels, StreamableAdapter> = new Map();
  private Adapters: Map<SupportedModels, BaseAdapter> = new Map();
  public static instance: AdapterManager = new AdapterManager();

  constructor(){
    this.initStreamableAdapter();
    this.initAdapters();
  }

  /**
   * Initialize the StreamableAdapter
   * Sets all the streamable adapters that are available
   */
  private initStreamableAdapter() {
    this.StreamableAdapter.set("gpt-4", new GPTAdapter("gpt-4"));
    this.StreamableAdapter.set("gpt-3.5-turbo", new GPTAdapter("gpt-3.5-turbo"));
    this.StreamableAdapter.set("gpt-4-turbo-preview", new GPTAdapter("gpt-4-turbo-preview"));
  }

  /**
   * Initialize the Adapters
   * Sets all the adapters that are available, that does not support streamable responses
   */
  private initAdapters() {
    this.Adapters.set("gpt-4", new GPTAdapter("gpt-4"));
    this.Adapters.set("gpt-3.5-turbo", new GPTAdapter("gpt-3.5-turbo"));
    this.Adapters.set("gpt-4-turbo-preview", new GPTAdapter("gpt-4-turbo-preview"));
  }

  public getStreamableAdapter(adapterName: SupportedModels): StreamableAdapter | undefined {
    return this.StreamableAdapter.get(adapterName);
  }
  public getBaseAdapter(adapterName: SupportedModels): BaseAdapter | undefined {
    return this.Adapters.get(adapterName);
  }
}
