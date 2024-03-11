export type Assistant = {
  id: string;
  name: string;
  model: "gpt-4";
  tools: { type: string }[];
  fileIds: string[];
  instruction: string
};
