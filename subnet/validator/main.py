import argparse
import asyncio
import os
import bittensor as bt
import torch
from miner_manager import MinerManager
from validator import BaseValidatorNeuron
from fastapi import FastAPI, Request
import aiohttp
import random
from reward import calculate_total_message_length, get_reward
from typing import TypedDict, Union, List
from urllib.parse import urljoin, urlencode
from dotenv import load_dotenv

load_dotenv()


api_only = os.getenv('API_ONLY')
miner_manager = MinerManager(api_only=api_only == 'True')


async def run_miner_manager():
    while True:
        await miner_manager.run()
        await asyncio.sleep(10)


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

        api_only = self.subtensor_connected == False
        service_map_url = os.getenv('SERVICE_MESH_URL')
        secret = os.getenv('SECRET_KEY')
        # for now miners are allow listed manually and given a secret key to identify
        headers = {'Content-Type': 'application/json',
                   'Authorization': f'Bearer {secret}'}

        base_url = urljoin(service_map_url, '/api/miner')
        params = {'model': model_name,
                  'api-only': 'true' if api_only else 'false'}

        request_url = f"{base_url}?{urlencode(params)}"

        async with aiohttp.ClientSession() as session:
            async with session.get(request_url, headers=headers) as resp:
                data = await resp.json()

                if isinstance(data, list) and data:
                    return random.choice(data)

                return data


app = FastAPI()
validator = Validator()


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    print('hello')
    model = data['model']
    test = miner_manager.get_miners()
    print(test)
    miner = miner_manager.get_fastest_miner_for_model(model=model)
    print(miner)
    miner_id = miner["id"]
    prompt_len = calculate_total_message_length(data)

    async with aiohttp.ClientSession() as session:
        url = miner['address']
        async with session.post(f'{url}/chat', json=data) as resp:
            response = await resp.json()
            completion_len = len(response[-1])

            reward = get_reward(
                model=model, completion_len=completion_len, prompt_len=prompt_len)
            print(f'reward for prompt: {reward}')
            if (validator.subtensor_connected):
                validator.update_scores(
                    torch.FloatTensor([reward]), [int(miner_id)])

            return response


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_miner_manager())

# The main function parses the configuration and runs the validator.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
