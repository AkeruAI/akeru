import { SupportedModels } from "@/infrastructure/adapters/adapter";

export type Assistant = {
  id: string;
  name: string;
  model: SupportedModels;
  tools: { type: string }[];
  fileIds: string[];
  instruction: string;
};
