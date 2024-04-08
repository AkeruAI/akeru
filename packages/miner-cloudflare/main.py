import json
import time
import argparse
import aiohttp
import bittensor as bt
from protocol import StreamPrompting
import requests

from stream_miner import StreamMiner
from flask import Flask, current_app, jsonify, request, make_response


class Miner(StreamMiner):
    def config(self) -> "bt.Config":

        parser = argparse.ArgumentParser(description="Streaming Miner Configs")
        self.add_args(parser)
        return bt.config(parser)

    def add_args(cls, parser: argparse.ArgumentParser):
        pass

    async def prompt(self, messages, model) -> StreamPrompting:
        async with aiohttp.ClientSession() as session:
            response = await session.post(
                f"https://api.cloudflare.com/client/v4/accounts/{self.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/{model}",
                headers={"Authorization": f"Bearer {self.CLOUDFLARE_AUTH_TOKEN}"},
                json={
                    "messages": messages
                }
            )
            json_resp = await response.json()

            return json_resp['result']['response']


app = Flask(__name__)
app.miner = Miner()


@app.route("/", methods=['POST'])
async def chat():
    data = request.get_json()
    miner = current_app.miner
    messages = data['messages']
    model = data['model']

    response = await miner.prompt(messages=messages, model=model)
    messages.append({"role": "system", "content": response})
    return jsonify(messages)


# The main function parses the configuration and runs the validator.
if __name__ == "__main__":

    app.run(host='0.0.0.0', port=9000)
