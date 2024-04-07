import pydantic
import bittensor as bt

from typing import List
from starlette.responses import StreamingResponse


class StreamPrompting(bt.StreamingSynapse):
    messages: List[dict] = pydantic.Field(
        [
            {"role": "system", "content": "You are a friendly assistant"},
            {"role": "user", "content": "hello this is a test of a streaming response. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        ],
        title="Messages",
        description="A list of messages in the StreamPrompting scenario. Immutable.",
        allow_mutation=False,
    )

    required_hash_fields: List[str] = pydantic.Field(
        ["messages"],
        title="Required Hash Fields",
        description="A list of required fields for the hash.",
        allow_mutation=False,
    )

    completion: str = pydantic.Field(
        "",
        title="Completion",
        description="Completion status of the current StreamPrompting object. This attribute is mutable and can be updated.",
    )

    model: str = pydantic.Field(
        "llama-2-7b-chat-int8",
        title="Model",
        description="The model to use for StreamPrompting. Currently, only 'llama-2-7b-chat-int8' is supported.",
    )

    async def process_streaming_response(self, response: StreamingResponse):
        """
        ... (method docstring remains the same)
        """
        if self.completion is None:
            self.completion = ""
        bt.logging.debug(
            "Processing streaming response (StreamingSynapse base class)."
        )
        async for chunk in response.content.iter_any():
            tokens = chunk.decode("utf-8").split("\n")
            for token in tokens:
                if token:
                    self.completion += token
            yield tokens

    def deserialize(self) -> str:
        """
        ... (method docstring remains the same)
        """
        return self.completion

    def extract_response_json(self, response: StreamingResponse) -> dict:
        """
        ... (method docstring remains the same)
        """
        headers = {
            k.decode("utf-8"): v.decode("utf-8")
            for k, v in response.__dict__["_raw_headers"]
        }

        def extract_info(prefix):
            return {
                key.split("_")[-1]: value
                for key, value in headers.items()
                if key.startswith(prefix)
            }

        return {
            "name": headers.get("name", ""),
            "timeout": float(headers.get("timeout", 0)),
            "total_size": int(headers.get("total_size", 0)),
            "header_size": int(headers.get("header_size", 0)),
            "dendrite": extract_info("bt_header_dendrite"),
            "axon": extract_info("bt_header_axon"),
            "prompts": self.prompts,
            "completion": self.completion,
        }
