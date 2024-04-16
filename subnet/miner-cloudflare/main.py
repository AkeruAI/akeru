import argparse
import os
import aiohttp
import bittensor as bt
from flask.cli import load_dotenv
from protocol import StreamPrompting
from fastapi import FastAPI
from pydantic import BaseModel

from stream_miner import StreamMiner

load_dotenv()


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


app = FastAPI()
miner = Miner()


class ChatRequest(BaseModel):
    messages: list
    model: str


@app.get("/")
def index():
    print('index')
    return "ok"


@app.post("/chat")
async def chat(request: ChatRequest):
    messages = request.messages
    model = request.model

    response = await miner.prompt(messages=messages, model=model)
    messages.append({"role": "system", "content": response})

    return messages


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=os.getenv('PORT', 9000))
