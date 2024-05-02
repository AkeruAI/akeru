import { ModelsType } from "./validators";

export type Assistant = {
  id: string;
  name: string;
  model: ModelsType;
  tools: { type: string }[];
  fileIds: string[];
  instruction: string;
};
