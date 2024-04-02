import time
import argparse
import bittensor as bt
from protocol import StreamPrompting
import requests

from stream_miner import StreamMiner


class Miner(StreamMiner):
    def config(self) -> "bt.Config":

        parser = argparse.ArgumentParser(description="Streaming Miner Configs")
        self.add_args(parser)
        return bt.config(parser)

    def add_args(cls, parser: argparse.ArgumentParser):
        pass

    def prompt(self, synapse: StreamPrompting) -> StreamPrompting:
        response = requests.post(
            f"https://api.cloudflare.com/client/v4/accounts/{self.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/{synapse.model}",
            headers={"Authorization": f"Bearer {self.CLOUDFLARE_AUTH_TOKEN}"},
            json={
                "messages": synapse.messages
            }
        )
        json_resp = response.json()

        synapse.completion = json_resp['result']['response']
        return synapse


# This is the main function, which runs the miner.
if __name__ == "__main__":
    with Miner():
        while True:
            time.sleep(1)
