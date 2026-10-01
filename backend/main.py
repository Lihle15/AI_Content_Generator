from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from generator import ContentGenerator

load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI(title="AI Content Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = ContentGenerator()


class GenerateRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    content_type: str
    tone: str
    platform: str


class GenerateResponse(BaseModel):
    content: str


@app.post("/api/generate", response_model=GenerateResponse)
def generate_content(payload: GenerateRequest) -> GenerateResponse:
    topic = payload.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Please enter a topic.")

    try:
        content = generator.generate(
            topic=topic,
            content_type=payload.content_type,
            tone=payload.tone,
            platform=payload.platform,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Generation failed. Please try again.") from exc

    if not content:
        raise HTTPException(status_code=502, detail="No content was returned. Please try again.")

    return GenerateResponse(content=content)
