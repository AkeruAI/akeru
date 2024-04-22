import asyncio
import os
import bittensor as bt
import torch
from miner_manager import MinerManager
from validator import BaseValidatorNeuron
from fastapi import FastAPI, Request
import aiohttp
from reward import calculate_total_message_length, get_reward
from typing import TypedDict, List
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
        if api_only == 'False':
            self.load_state()


app = FastAPI()
validator = Validator()


@app.get('/')
async def index():
    return "OK"


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    model = data['model']
    miner = miner_manager.get_fastest_miner_for_model(model=model)
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
    uvicorn.run(app, host="0.0.0.0", port=os.getenv('PORT', 8080))
