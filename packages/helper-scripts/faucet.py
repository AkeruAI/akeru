import re
import pexpect
import os
import argparse
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Define the password
PASSWORD = os.getenv('WALLET_PASSWORD', '')

# Set up logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Define the faucet function


def run_faucet(wallet_name):
    logging.info(f"Running faucet for wallet: {wallet_name}")
    # Define the command without the environment variable part
    command = f"btcli wallet faucet --wallet.name {wallet_name} --subtensor.chain_endpoint ws://127.0.0.1:9946"
    # Prepare the environment
    env = os.environ.copy()
    env["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    try:
        # Start the command with the modified environment
        child = pexpect.spawn(command, encoding='utf-8', timeout=300, env=env)
        yn_prompt = re.compile(r'\[y/n\]')
        child.expect(yn_prompt, timeout=120)
        child.sendline('y')
        # Wait for the password prompt and respond with the password
        child.expect('Enter password to unlock key:', timeout=120)
        child.sendline(PASSWORD)
        # Wait for the process to complete. This waits until the child process exits.
        child.expect(pexpect.EOF)
        logging.info(f"Command executed successfully for {wallet_name}")
    except pexpect.exceptions.TIMEOUT:
        logging.error(
            f"A timeout occurred while waiting for a prompt for {wallet_name}. The command might have taken too long or failed unexpectedly.")
    except pexpect.exceptions.EOF:
        logging.error(
            f"Unexpected end of file for {wallet_name}. Check if the command executed correctly.")
    # Close the Pexpect instance
    child.close()


if __name__ == '__main__':
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Run the faucet command for a wallet.')
    parser.add_argument('--wallet', type=str, required=True,
                        help='The name of the wallet to run the faucet for.')
    args = parser.parse_args()

    # Run the faucet for the specified wallet
    run_faucet(args.wallet)
