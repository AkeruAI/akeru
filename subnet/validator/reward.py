import torch
from typing import List

text_completion_models = {
    "llama-2-7b-chat-int8": {
        "name": "llama-2-7b-chat-int8",
        "demand_multiplier": 0.8,
    },
    "llama-2-7b-chat-fp16": {
        "name": "llama-2-7b-chat-fp16",
        "demand_multiplier": 0.85
    },
    "mistral-7b-instruct-v0.1": {
        "name": "mistral-7b-instruct-v0.1",
        "demand_multiplier": 0.85
    }
}


def calculate_total_message_length(data):
    total_length = 0
    for message in data["messages"]:
        total_length += len(message["content"])
    return total_length


def get_reward(model, completion_len, prompt_len) -> float:
    print(model, completion_len, prompt_len)
    # Define the maximum and minimum completion lengths in characters
    max_completion_len = 4000
    min_completion_len = 200

    # Define the maximum and minimum prompt lengths in characters
    max_prompt_len = 2000
    min_prompt_len = 50

    # Normalize the completion length
    normalized_completion_len = float((
        completion_len - min_completion_len) / (max_completion_len - min_completion_len))

    # Normalize the prompt length
    normalized_prompt_len = float((prompt_len - min_prompt_len) /
                                  (max_prompt_len - min_prompt_len))

    # Get the demand multiplier for the model
    demand_multiplier = text_completion_models[model]["demand_multiplier"]

    # Calculate the reward
    reward = (demand_multiplier * 0.5) + \
        (normalized_completion_len * 0.3) + (normalized_prompt_len * 0.2)

    # Ensure the reward is between 0 and 1
    reward = max(0, min(1, reward))

    return reward


def get_rewards(
    self,
    query: int,
    responses: List[float],
) -> torch.FloatTensor:
    """
    Returns a tensor of rewards for the given query and responses.

    Args:
    - query (int): The query sent to the miner.
    - responses (List[float]): A list of responses from the miner.

    Returns:
    - torch.FloatTensor: A tensor of rewards for the given query and responses.
    """
    # Get all the reward results by iteratively calling your reward() function.
    return torch.FloatTensor(
        [reward(query, response) for response in responses]
    ).to(self.device)
