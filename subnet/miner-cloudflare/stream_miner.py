import copy
import json
import os
import time
import asyncio
import argparse
import threading
import traceback
from abc import ABC, abstractmethod
from urllib.parse import urlencode, urljoin
import uuid


import bittensor as bt
from typing import Dict, Tuple

from protocol import StreamPrompting

from config import check_config, get_config, get_ip_address
from dotenv import load_dotenv
from requests import post


class StreamMiner(ABC):
    @property
    def subtensor_connected(self):
        return hasattr(self, 'subtensor') and self.subtensor is not None

    def __init__(self, config=None, axon=None, wallet=None, subtensor=None):
        # load env variables
        load_dotenv()
        self.api_only = os.getenv('API_ONLY', 'True')

        self.CLOUDFLARE_AUTH_TOKEN = os.getenv('CLOUDFLARE_AUTH_TOKEN')
        self.CLOUDFLARE_ACCOUNT_ID = os.getenv('CLOUDFLARE_ACCOUNT_ID')
        # Setup base config from Miner.config() and merge with subclassed config.
        base_config = copy.deepcopy(config or get_config())
        self.config = self.config()
        self.config.merge(base_config)

        self.miner_services = {
            "type": 'cloudflare',
            "models": ['llama-2-7b-chat-int8', 'mistral-7b-instruct-v0.1'],
            "MINER_ADDRESS": os.getenv('MINER_ADDRESS')
        }

        check_config(StreamMiner, self.config)
        bt.logging.info(self.config)

        self.prompt_cache: Dict[str, Tuple[str, int]] = {}

        if self.api_only != 'True':
            # Activating Bittensor's logging with the set configurations.
            bt.logging(config=self.config, logging_dir=self.config.full_path)
            bt.logging.info("Setting up bittensor objects.")

            # Wallet holds cryptographic information, ensuring secure transactions and communication.
            self.wallet = wallet or bt.wallet(config=self.config)
            bt.logging.info(f"Wallet {self.wallet}")

            # subtensor manages the blockchain connection, facilitating interaction with the Bittensor blockchain.
            self.subtensor = subtensor or bt.subtensor(config=self.config)
            bt.logging.info(f"Subtensor: {self.subtensor}")
            bt.logging.info(
                f"Running miner for subnet: {self.config.netuid} on network: {self.subtensor.chain_endpoint} with config:"
            )

            # metagraph provides the network's current state, holding state about other participants in a subnet.
            self.metagraph = self.subtensor.metagraph(self.config.netuid)
            bt.logging.info(f"Metagraph: {self.metagraph}")

            if self.wallet.hotkey.ss58_address not in self.metagraph.hotkeys:
                bt.logging.error(
                    f"\nYour validator: {self.wallet} if not registered to chain connection: {self.subtensor} \nRun btcli register and try again. "
                )
                exit()
            else:
                # Each miner gets a unique identity (UID) in the network for differentiation.
                self.my_subnet_uid = self.metagraph.hotkeys.index(
                    self.wallet.hotkey.ss58_address
                )

                # identify to the edge compute network service discovery

                # TODO replace with hosted endpoint of service map
                url = os.getenv('SERVICE_MESH_URL')
                secret = os.getenv('SECRET_KEY')
                # for now miners are allow listed manually and given a secret key to identify
                headers = {'Content-Type': 'application/json',
                           'Authorization': f'Bearer {secret}'}

                service_map_dict = {
                    # must map the netuid for validation by validators later
                    "netuid": self.my_subnet_uid,
                    "hotkey": self.wallet.hotkey.ss58_address,
                    **self.miner_services
                }

                # send to the service map
                post(f'{url}/api/miner',
                     data=json.dumps(service_map_dict), headers=headers)
                bt.logging.info(f"Running miner on uid: {self.my_subnet_uid}")

        else:
            self.uuid = os.getenv('UUID') or uuid.uuid4()
            url = os.getenv('SERVICE_MESH_URL')
            secret = os.getenv('SECRET_KEY')
            # for now miners are allow listed manually and given a secret key to identify
            headers = {'Content-Type': 'application/json',
                       'Authorization': f'Bearer {secret}'}

            service_map_dict = {
                # must map the netuid for validation by validators later
                "uid": str(self.uuid),
                **self.miner_services
            }

            # Base URL
            base_url = urljoin(url, '/api/miner')

            # Query parameters
            params = {'api-only': 'true'}

            # Construct the full URL with query parameters
            full_url = f"{base_url}?{urlencode(params)}"
            data = json.dumps(service_map_dict)
            # send to the service map
            post(full_url, data=data, headers=headers)

        # Instantiate runners
        self.should_exit: bool = False
        self.is_running: bool = False
        self.thread: threading.Thread = None
        self.lock = asyncio.Lock()
        self.request_timestamps: Dict = {}

    @ abstractmethod
    def config(self) -> "bt.Config":
        ...

    @ classmethod
    @ abstractmethod
    def add_args(cls, parser: argparse.ArgumentParser):
        ...

    def verify_fn(self, synapse: StreamPrompting) -> None:
        return True

    def _prompt(self, synapse: StreamPrompting) -> StreamPrompting:
        print('received a prompt')
        messages = synapse.messages
        prompt_key = ''.join(prompt['content'] for prompt in messages)
        print(messages)

        if prompt_key in self.prompt_cache:
            response, timestamp = self.prompt_cache[prompt_key]
            if time.time() - timestamp < 60:
                raise ValueError(
                    f"Prompt '{prompt_key}' was sent recently and is cached. Skipping processing.")

        synapse = self.prompt(synapse)

        self.prompt_cache[prompt_key] = (synapse.completion, time.time())
        return synapse

    @ abstractmethod
    def prompt(self, synapse: StreamPrompting) -> StreamPrompting:
        ...

    def run(self):
        """
        Runs the miner logic. This method starts the miner's operations, including
        listening for incoming requests and periodically updating the miner's knowledge
        of the network graph.
        """
        if not self.subtensor.is_hotkey_registered(
            netuid=self.config.netuid,
            hotkey_ss58=self.wallet.hotkey.ss58_address,
        ):
            bt.logging.error(
                f"Wallet: {self.wallet} is not registered on netuid {self.config.netuid}"
                f"Please register the hotkey using `btcli subnets register` before trying again"
            )
            exit()

        # --- Run until should_exit = True.
        self.last_epoch_block = self.subtensor.get_current_block()
        bt.logging.info(f"Miner starting at block: {self.last_epoch_block}")

        # This loop maintains the miner's operations until intentionally stopped.
        bt.logging.info(f"Starting main loop")
        step = 0
        try:
            while not self.should_exit:
                start_epoch = time.time()

                # --- Wait until next epoch.
                current_block = self.subtensor.get_current_block()
                while (
                    current_block - self.last_epoch_block
                    < self.config.miner.blocks_per_epoch
                ):
                    # --- Wait for next bloc.
                    time.sleep(1)
                    current_block = self.subtensor.get_current_block()

                    # --- Check if we should exit.
                    if self.should_exit:
                        break

                # --- Update the metagraph with the latest network state.
                self.last_epoch_block = self.subtensor.get_current_block()

                metagraph = self.subtensor.metagraph(
                    netuid=self.config.netuid,
                    lite=True,
                    block=self.last_epoch_block,
                )
                log = (
                    f"Step:{step} | "
                    f"Block:{metagraph.block.item()} | "
                    f"Stake:{metagraph.S[self.my_subnet_uid]} | "
                    f"Rank:{metagraph.R[self.my_subnet_uid]} | "
                    f"Trust:{metagraph.T[self.my_subnet_uid]} | "
                    f"Consensus:{metagraph.C[self.my_subnet_uid] } | "
                    f"Incentive:{metagraph.I[self.my_subnet_uid]} | "
                    f"Emission:{metagraph.E[self.my_subnet_uid]}"
                )
                bt.logging.info(log)

                step += 1

        # If someone intentionally stops the miner, it'll safely terminate operations.
        except KeyboardInterrupt:
            bt.logging.success("Miner killed by keyboard interrupt.")
            exit()

        # In case of unforeseen errors, the miner will log the error and continue operations.
        except Exception as e:
            bt.logging.error(traceback.format_exc())

    def run_in_background_thread(self):
        """
        Starts the miner's operations in a separate background thread.
        This is useful for non-blocking operations.
        """
        if not self.is_running:
            bt.logging.debug("Starting miner in background thread.")
            self.should_exit = False
            self.thread = threading.Thread(target=self.run, daemon=True)
            self.thread.start()
            self.is_running = True
            bt.logging.debug("Started")

    def stop_run_thread(self):
        """
        Stops the miner's operations that are running in the background thread.
        """
        if self.is_running:
            bt.logging.debug("Stopping miner in background thread.")
            self.should_exit = True
            self.thread.join(5)
            self.is_running = False
            bt.logging.debug("Stopped")

    def __enter__(self):
        """
        Starts the miner's operations in a background thread upon entering the context.
        This method facilitates the use of the miner in a 'with' statement.
        """
        self.run_in_background_thread()

    def __exit__(self, exc_type, exc_value, traceback):
        self.stop_run_thread()
