import { ValidatorAIModel } from "@/infrastructure/adaptaters/validators/validatorAdapter";

export type Assistant = {
  id: string;
  name: string;
  model: "gpt-4" | ValidatorAIModel;
  tools: { type: string }[];
  fileIds: string[];
  instruction: string;
};
