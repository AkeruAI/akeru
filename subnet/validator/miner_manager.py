import os
from urllib.parse import urlencode
import aiohttp
import asyncio
import time
from dotenv import load_dotenv


class MinerManager:
    def __init__(self, api_only):
        """
        Initialize the MinerManager class.

        Args:
            api_only (bool): If True, we are running without bittensor operatons.
        """
        load_dotenv()
        self.miners = {}  # Dictionary to store miners
        self.api_only = api_only
        self.bearer_token = os.getenv('SECRET_KEY')

    async def run(self):
        """
        Run the MinerManager and start the discovery and ping process.
        """
        await self._discover_and_ping_miners()

    async def _discover_and_ping_miners(self):
        """
        Discover and ping miners periodically.
        """
        while True:
            try:
                async with aiohttp.ClientSession() as session:
                    url = os.getenv('SERVICE_MESH_URL')
                    headers = {"Authorization": f"Bearer {self.bearer_token}"}
                    params = {'api-only': 'true' if self.api_only else 'false'}
                    async with session.get(f"{url}/api/miner?{urlencode(params)}", headers=headers) as response:
                        if response.status == 200:
                            miners_data = await response.json()
                            for miner_data in miners_data:
                                miner_id = miner_data["uid"] if "uid" in miner_data else miner_data["netuid"]
                                miner_address = miner_data["address"]
                                miner_models = miner_data.get("models")
                                if miner_id not in self.miners:
                                    self.miners[miner_id] = {
                                        "address": miner_address,
                                        "models": miner_models,
                                        "id": miner_id,
                                        "last_ping": None,
                                        "ping_time": None
                                    }

                            # Ping all the miners
                            ping_tasks = []
                            for miner_id in list(self.miners.keys()):
                                ping_task = asyncio.create_task(
                                    self._ping_miner(session, miner_id))
                                ping_tasks.append(ping_task)
                            self._update_model_miners()

                            # Wait for all the ping tasks to complete
                            await asyncio.gather(*ping_tasks)

                        else:
                            print(
                                f"Error discovering miners: {response.status}")

                # Sleep for 10 minutes before the next discovery and ping iteration
                await asyncio.sleep(600)

            except aiohttp.ClientError as e:
                # Handle any errors that occur during the request
                print(f"Error discovering miners: {e}")
                await asyncio.sleep(60)  # Sleep for 1 minute before retrying

            except Exception as e:
                # Handle any other unexpected errors
                print(f"Unexpected error: {e}")
                await asyncio.sleep(60)  # Sleep for 1 minute before retrying

    async def _ping_miner(self, session, miner_id):
        """
        Ping a miner to check its availability and update its ping time.

        Args:
            session (aiohttp.ClientSession): The session to use for the request.
            miner_id (str): The ID of the miner to ping.
        """
        try:
            start_time = time.time()
            async with session.get(f"{self.miners[miner_id]['address']}/") as response:
                if response.status == 200:
                    end_time = time.time()
                    ping_time = end_time - start_time
                    self.miners[miner_id]["last_ping"] = end_time
                    self.miners[miner_id]["ping_time"] = ping_time
                else:
                    print(f"Error pinging miner {miner_id}: {response.status}")
                    # Remove the miner if the ping is unsuccessful
                    del self.miners[miner_id]

        except aiohttp.ClientError as e:
            # Handle any errors that occur during the ping request
            print(f"Error pinging miner {miner_id}: {e}")
            del self.miners[miner_id]  # Remove the miner if the ping fails

        except Exception as e:
            # Handle any other unexpected errors
            print(f"Unexpected error: {e}")
            # Remove the miner if an unexpected error occurs
            del self.miners[miner_id]

    def _update_model_miners(self):
        """
        Update the model_miners dictionary with the available miners and their ping times.
        """
        self.model_miners = {}
        for miner_id, miner_data in self.miners.items():
            models = miner_data.get("models")
            ping_time = miner_data.get("ping_time")
            if models:
                for model in models:
                    if model not in self.model_miners:
                        self.model_miners[model] = []
                    self.model_miners[model].append({
                        "id": miner_id,
                        "ping_time": ping_time
                    })

    def get_fastest_miner_for_model(self, model):
        """
        Get the fastest miner for a given model.

        Args:
            model (str): The name of the model.

        Returns:
            dict: The details of the fastest miner for the given model, or None if no miner is available.
        """
        if model in self.model_miners:
            miners = self.model_miners[model]
            fastest_miner = min(miners, key=lambda x: x['ping_time'])
            print(fastest_miner)
            id = fastest_miner['id']
            miner_details = self.miners[id]
            return miner_details
        else:
            return None

    def get_miners(self):
        """
        Get the dictionary of all miners.

        Returns:
            dict: The dictionary of all miners, with their details.
        """
        return self.miners
