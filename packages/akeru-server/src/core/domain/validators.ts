// types for all the models we'll have on the subnet
// chaining like this: "BtModels & Models" gives a type of never

type BtModels = "bt-gpt-4";
type Models = "gpt-4" | "gpt-3.5" | "llama-2-7b-chat-int8";

export type ModelsType = BtModels | Models;
