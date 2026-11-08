import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel


# --------------------------------------------------
# ENVIRONMENT CONFIGURATION
# --------------------------------------------------

# Load VOX7/.env
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

GNANI_API_KEY = os.getenv("GNANI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# --------------------------------------------------
# API ENDPOINTS
# --------------------------------------------------

# Gnani APIs
STT_URL = "https://api.vachana.ai/stt/v3"
TTS_URL = "https://api.vachana.ai/api/v1/tts/inference"

# Gemini API
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-3.5-flash-lite:generateContent"
)


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="VOX7 API",
    description="Multilingual Voice Intelligence Platform",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class ChatRequest(BaseModel):
    question: str


# --------------------------------------------------
# API KEY VALIDATION
# --------------------------------------------------

def get_api_key():
    if not GNANI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GNANI_API_KEY is missing from .env"
        )

    return GNANI_API_KEY


def get_gemini_key():
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is missing from .env"
        )

    return GEMINI_API_KEY


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
async def home():
    return {
        "message": "Welcome to VOX7!",
        "status": "running",
        "version": "2.0.0"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "project": "VOX7",
        "speech_model": "Prisma v3.0",
        "voice_model": "Timbre v2.5",
        "conversation_model": "Gemini 3.8 Flash"
    }


# --------------------------------------------------
# PRISMA - SPEECH TO TEXT
# --------------------------------------------------

@app.post("/api/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language_code: str = Form("indic-auto")
):
    api_key = get_api_key()

    audio_data = await audio.read()

    if not audio_data:
        raise HTTPException(
            status_code=400,
            detail="Audio file is empty"
        )

    if len(audio_data) > 15 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Audio file is too large"
        )

    filename = audio.filename or "recording.wav"

    headers = {
        "X-API-Key-ID": api_key
    }

    files = {
        "audio_file": (
            filename,
            audio_data,
            audio.content_type or "audio/wav"
        )
    }

    data = {
        "model": "prisma-v3.0",
        "language_code": language_code,
        "format": "codemix"
    }

    try:
        async with httpx.AsyncClient(timeout=90) as client:
            result = await client.post(
                STT_URL,
                headers=headers,
                files=files,
                data=data
            )

        if result.status_code != 200:
            raise HTTPException(
                status_code=result.status_code,
                detail="Gnani transcription failed: "
                + result.text[:500]
            )

        return result.json()

    except httpx.RequestError as exc:
        print(
            f"Gnani STT connection error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail="Could not connect to Gnani STT"
        )


# --------------------------------------------------
# GEMINI - AI CONVERSATION
# --------------------------------------------------

@app.post("/api/chat")
async def chat(request: ChatRequest):

    api_key = get_gemini_key()

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    if len(question) > 10000:
        raise HTTPException(
            status_code=400,
            detail="Question is too long"
        )

    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "systemInstruction": {
            "parts": [{
                "text": (
                    "You are VOX7, a friendly multilingual AI "
                    "voice companion created for the Great Indian "
                    "AI Internship Challenge. "
                    "Understand the user's question and provide "
                    "helpful, accurate and natural responses. "
                    "Respond in the language used by the user "
                    "whenever possible. "
                    "Keep responses conversational and easy to "
                    "understand when spoken aloud."
                )
            }]
        },
        "contents": [{
            "role": "user",
            "parts": [{
                "text": question
            }]
        }],
        "generationConfig": {
    "maxOutputTokens": 400
}
    }

    try:
        async with httpx.AsyncClient(timeout=45) as client:
            result = await client.post(
                GEMINI_URL,
                headers=headers,
                json=payload
            )

        if result.status_code != 200:
            print(
                f"Gemini API error: "
                f"{result.status_code}: {result.text[:500]}"
            )

            raise HTTPException(
                status_code=result.status_code,
                detail="AI generation failed: "
                + result.text[:500]
            )

        data = result.json()

        candidates = data.get("candidates", [])

        if not candidates:
            raise HTTPException(
                status_code=502,
                detail="AI did not return an answer"
            )

        answer = "".join(
            part.get("text", "")
            for part in candidates[0]
            .get("content", {})
            .get("parts", [])
        ).strip()

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="AI returned an empty answer"
            )

        return {
            "success": True,
            "question": question,
            "answer": answer,
            "model": "Gemini 3.8 Flash",
            "project": "VOX7"
        }

    except httpx.RequestError as exc:
        print(
            f"Gemini connection error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail="Could not connect to AI service. "
            "Check backend terminal."
        )


# --------------------------------------------------
# TIMBRE - TEXT TO SPEECH
# --------------------------------------------------

@app.post("/api/speak")
async def speak(
    text: str = Form(...),
    language: str = Form("en-IN"),
    voice: str = Form("")
):
    api_key = get_api_key()

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )

    if len(text) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Text is too long"
        )

    payload = {
        "text": text,
        "model": "timbre-v2.5",
        "language": language,
        "audio_config": {
            "encoding": "linear_pcm",
            "container": "wav",
            "num_channels": 1,
            "sample_rate": 48000,
            "sample_width": 2
        }
    }

    if voice.strip():
        payload["voice"] = voice.strip()

    headers = {
        "X-API-Key-ID": api_key,
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=90) as client:
            result = await client.post(
                TTS_URL,
                headers=headers,
                json=payload
            )

        if result.status_code != 200:
            raise HTTPException(
                status_code=result.status_code,
                detail="Gnani speech generation failed: "
                + result.text[:500]
            )

        return Response(
            content=result.content,
            media_type="audio/wav",
            headers={
                "Content-Disposition":
                'inline; filename="vox7-speech.wav"'
            }
        )

    except httpx.RequestError as exc:
        print(
            f"Gnani TTS connection error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail="Could not connect to Gnani TTS"
        )


# --------------------------------------------------
# END OF VOX7 API
# --------------------------------------------------