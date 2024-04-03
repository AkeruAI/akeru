# Sprout Compute Subnet

The Sprout Compute Subnet is a market place incentivizing compute resources to the most in demand open source AI models.

## Getting started

## Development Requirements:

You will need to setup and install a few tools to work on the subnet code.

1. [Install bittensor CLI](https://github.com/opentensor/bittensor#install)

TODO: review step 2 will full isntruction to download and install

2. Create wallets for the subnet owner, a validator and a miner

You will need wallets for the different roles, i.e., subnet owner, subnet validator and subnet miner, in the subnet.

The owner wallet creates and controls the subnet.
The validator and miner will be registered to the subnet created by the owner. This ensures that the validator and miner can run the respective validator and miner scripts.
Create a coldkey for the owner role:

```
btcli wallet new_coldkey --wallet.name owner
```

Set up the miner's wallets:

```
btcli wallet new_coldkey --wallet.name miner
btcli wallet new_hotkey --wallet.name miner --wallet.hotkey default
```

Set up the validator's wallets:

```
btcli wallet new_coldkey --wallet.name validator
btcli wallet new_hotkey --wallet.name validator --wallet.hotkey default
```

## Start a development environment

after having installed the requirements and creating wallets, we'll start the network and create the subnet. These steps will be repeated each time you restart your development environment:

1. From the subtensor repo start a test chain

```
BUILD_BINARY=0 ./scripts/localnet.sh
```

2. Create a [`.env`](./scripts/.env) file in `/scripts`, the content can be shown from [`./scripts/.env.example`](./scripts/.env.example), replace with your wallets password

3. install dependencies:

```
python -m pip install -e .
```

4. Mint Tokens for each wallet. The mint script will give a total of 300 test TAO each run

The owner needs a total of 1,000,000 Tao tokens. Run the script 4 times

```
python scripts/faucet.py --wallet owner
```

The validator needs only 1 run of the script

```
python scripts/faucet.py --wallet validator
```

same thing for the miner

```
python scripts/faucet.py --wallet miner
```

5. create the subnet:

```
btcli subnet create --wallet.name owner --subtensor.chain_endpoint ws://127.0.0.1:9946
```

6. Register the miner and validator:

```
btcli subnet register --wallet.name miner --wallet.hotkey default --subtensor.chain_endpoint ws://127.0.0.1:9946
```

```
btcli subnet register --wallet.name validator --wallet.hotkey default --subtensor.chain_endpoint ws://127.0.0.1:9946
```

7. Add a stake to the subnet:

```
btcli stake add --wallet.name validator --wallet.hotkey default --subtensor.chain_endpoint ws://127.0.0.1:9946
```

8. Start the miner:

```
python neurons/miner/miner.py --netuid 1 --subtensor.chain_endpoint ws://127.0.0.1:9946 --wallet.name miner --wallet.hotkey default --logging.debug
```

9. Start the validator:

```
 python neurons/validator.py --netuid 1 --subtensor.chain_endpoint ws://127.0.0.1:9946 --wallet.name validator --wallet.hotkey default --logging.debug
```
