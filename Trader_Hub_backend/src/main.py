from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn 
import json
from dotenv import load_dotenv
import os 
import requests
from aiagent import normal_chat, structured_rag_output


bitscrunch_api_key = os.environ.get("BITSCRUNCH_API_KEY")  
load_dotenv()
app = FastAPI()
port = os.environ.get("PORT")

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


documents = []


@app.post("/stream_chat")
async def stream_chat(request: Request):
    data = await request.json()
    prompt = data["prompt"]
    res = await normal_chat(prompt)
    return res

@app.post("/stream_rag_output")
async def stream_rag_output(request: Request):
    data = await request.json()
    prompt = data["prompt"]
    res = await structured_rag_output(prompt, documents)
    print(documents)
    return res

if __name__ == "__main__":
    uvicorn.run("main:app", port=port, reload=True, log_level="info")   