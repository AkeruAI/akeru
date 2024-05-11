import aiohttp
import os
import asyncio
from .hash import hash_multiple_files
from dotenv import load_dotenv
import urllib.parse


class CertificationManager:
    current_hash: str
    image_signature: str
    service_mesh_url: str
    _certificate: str = None

    def __init__(self):
        """ Initialize the CertificationManager class. """
        load_dotenv()
        self.current_hash = hash_multiple_files(['main.py', 'protocol.py', './api/api.py'])
        self.image_signature = os.getenv("DOCKER_IMAGE_SIGNATURE", '')
        self.service_mesh_url = os.getenv('SERVICE_MESH_URL')

    async def run(self):
        """ Run the CertificationManager and start the certification process """
        await self._get_certificate()

    async def _get_certificate(self):
        """ Get the renewed certificate """
        try:
            async with aiohttp.ClientSession() as session:

                # we must get the certificate for the current docker image and proove the right code is present.
                params = {
                    "hash": self.current_hash,
                    "imageSignature": self.image_signature
                }
                # encode parameters
                search = urllib.parse.urlencode(params)

                async with session.get(f"{self.service_mesh_url}/api/certification?{search}", ) as response:
                    if response.status == 200:
                        self._certificate = await response.text()
                    else:
                        print(f"Error getting certificate")
        except aiohttp.ClientError as e:
            # Handle any errors that occur during the request
            print(f"Error discovering miners: {e}")
        except Exception as e:
            # Handle any other unexpected errors
            print(f"Unexpected error: {e}")

    @property
    def certificate(self):
        return self._certificate



certification_manager = CertificationManager()


async def run_certification_manager():
    while True:
        await certification_manager.run()
        # get recertified often to avoid getting the wrong rotation of certificate
        await asyncio.sleep(120)

