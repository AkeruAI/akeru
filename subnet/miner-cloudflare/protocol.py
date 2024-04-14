import pydantic
import bittensor as bt
import json

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
        ["messages", "model"],
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

    def to_dict(self):
        """
        Converts the class to a dictionary.

        Returns:
            dict: A dictionary representation of the class.
        """
        return {
            "messages": self.messages,
            "required_hash_fields": self.required_hash_fields,
            "completion": self.completion,
            "model": self.model,
        }

    def to_json(self):
        """
        Converts the class to a JSON string.

        Returns:
            str: A JSON string representation of the class.
        """
        return json.dumps(self.to_dict())
