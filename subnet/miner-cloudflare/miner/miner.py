import argparse
import aiohttp
import bittensor as bt
from dotenv import load_dotenv
from protocol import StreamPrompting

from miner.stream_miner import StreamMiner

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

miner = Miner()
