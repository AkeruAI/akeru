import asyncio
from fastapi import FastAPI
from pydantic import BaseModel
from miner.miner import miner
from certification.certification_manager import run_certification_manager


class ChatRequest(BaseModel):
    messages: list
    model: str

app = FastAPI()

@app.get("/")
def index():
    return "ok"


@app.post("/chat")
async def chat(request: ChatRequest):
    print(request)
    messages = request.messages
    model = request.model

    response = await miner.prompt(messages=messages, model=model)
    messages.append({"role": "system", "content": response})

    return messages


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_certification_manager())
