import { Validator } from "./validators";

export type Assistant = {
  id: string;
  name: string;
  model: Validator;
  tools: { type: string }[];
  fileIds: string[];
  instruction: string;
};
