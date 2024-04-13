import os
import bittensor as bt

from validator import BaseValidatorNeuron
from flask import Flask, current_app, jsonify, request, make_response
import aiohttp
import random

import bittensor as bt
from reward import get_reward
from uids import get_random_uids
from requests_async import get
from typing import TypedDict, Union, List
from urllib.parse import urljoin, urlencode


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

        api_only = self.subtensor_connected
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


# The main function parses the configuration and runs the validator.
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
