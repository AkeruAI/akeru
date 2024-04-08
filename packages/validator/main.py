import os
import bittensor as bt
from protocol import StreamPrompting

from validator import BaseValidatorNeuron
from flask import Flask, current_app, jsonify, request, make_response
import aiohttp
import random

import asyncio
import bittensor as bt
import torch
from reward import get_reward
from uids import get_random_uids
import json
from requests_async import get
from typing import TypedDict, Union, List


class Miner(TypedDict):
    address: str
    hotkey: str
    models: List[str]
    netuid: str
    type: str


class Validator(BaseValidatorNeuron):
    def __init__(self, config=None):
        super(Validator, self).__init__(config=config)

        bt.logging.info("load_state()")
        self.load_state()

    async def get_miner_with_model(self, model_name) -> Union[Miner, dict]:
        """
        Asynchronously fetches a miner with a specific model from the service mesh.

        Args:
            model_name (str): The name of the model to search for.

        Returns:
            dict: If the response data is a list, it returns a random miner from the list.
                  If the response data is not a list, it returns the data as is.
        """
        async with aiohttp.ClientSession() as session:
            url = os.getenv('SERVICE_MESH_URL')
            async with session.get(f'{url}/api/miner?model={model_name}') as resp:
                data = await resp.json()

                if isinstance(data, list) and data:
                    return random.choice(data)

                return data

    async def forward(self, messages, model):
        miner_uids = get_random_uids(self, k=self.config.neuron.sample_size)

        synapse = StreamPrompting(
            messages=messages,
            model=model
        )

        responses = await self.dendrite(
            axons=[self.metagraph.axons[uid] for uid in miner_uids],
            synapse=synapse,
            deserialize=True,
            streaming=True,
        )

        rewards = []
        processed_responses = []

        async def process_response(response, model, messages):
            i = 0
            async for chunk in response:
                i += 1
                if i % 5 == 0:
                    print()
                if isinstance(chunk, list):
                    print(chunk[0], end="", flush=True)
                else:
                    processed_responses.append(chunk)
                    res = json.loads(chunk)

                    # parameters used for the reward
                    completion_len = len(res['completion'])
                    model_used = model
                    prompt_len = sum(len(message['content'])
                                     for message in messages)

                    reward = get_reward(
                        model=model_used, completion_len=completion_len, prompt_len=prompt_len)

                    rewards.append(reward)
                    break

        await asyncio.gather(process_response(responses[0], model, messages))

        # format rewards to bittensor format
        bt_rewards = torch.FloatTensor(rewards).to(self.device)
        bt.logging.info(f"Scored responses: {rewards}")
        # update subnet rewards
        self.update_scores(bt_rewards, miner_uids)
        # return the response to the API func
        return processed_responses[0]

    async def run(self, inputs):
        # Provide your implementation here
        pass


app = Flask(__name__)
app.validator = Validator()


@app.post("/chat")
async def chat():
    data = request.get_json()
    validator = current_app.validator

    model = data['model']
    miner = await validator.get_miner_with_model(model_name=model)

    async with aiohttp.ClientSession() as session:
        url = miner['address']
        async with session.post(url, json=data) as resp:
            response = await resp.json()
            return jsonify(response)

    return "hello"


# The main function parses the configuration and runs the validator.
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
