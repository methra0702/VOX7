
import os
import json
import sqlite3
from pathlib import Path
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
DB_PATH = BASE_DIR / "backend" / "vox7_history.db"

load_dotenv(ENV_PATH)

GNANI_API_KEY = os.getenv("GNANI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

STT_URL = "https://api.vachana.ai/stt/v3"
TTS_URL = "https://api.vachana.ai/api/v1/tts/inference"

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-3.5-flash-lite:generateContent"
)


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transcript TEXT NOT NULL,
                answer TEXT NOT NULL,
                language TEXT DEFAULT 'indic-auto',
                events TEXT DEFAULT '[]',
                created_at TEXT NOT NULL
            )
        """)


initialize_database()


# --------------------------------------------------
# APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="VOX7 API",
    description="Multilingual Voice Intelligence Platform",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class ChatRequest(BaseModel):
    question: str
    language: str = "en-IN"


class HistoryRequest(BaseModel):
    transcript: str
    answer: str
    language: str = "indic-auto"


# --------------------------------------------------
# API KEY HELPERS
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
# HOME AND HEALTH
# --------------------------------------------------

@app.get("/")
async def home():
    return {
        "message": "Welcome to VOX7!",
        "status": "running",
        "version": "3.0.0"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "project": "VOX7",
        "speech_model": "Prisma v3.0",
        "voice_model": "Timbre v2.5",
        "conversation_model": "Gemini 3.5 Flash-Lite",
        "history": "SQLite enabled"
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
        raise HTTPException(400, "Audio file is empty")

    if len(audio_data) > 15 * 1024 * 1024:
        raise HTTPException(413, "Audio file is too large")

    filename = audio.filename or "recording.wav"

    headers = {"X-API-Key-ID": api_key}

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
                result.status_code,
                "Gnani transcription failed: " + result.text[:500]
            )

        transcription = result.json()
        # Prisma v3 returns detected_language_code when indic-auto is used.
        supported_languages = {
            "en-IN", "hi-IN", "bn-IN", "mr-IN", "gu-IN",
            "pa-IN", "kn-IN", "te-IN", "ta-IN", "ml-IN"
        }
        detected_language = (
            transcription.get("detected_language_code")
            or transcription.get("language_code")
            or ("en-IN" if language_code == "indic-auto" else language_code)
        )
        if detected_language not in supported_languages:
            detected_language = "en-IN"
        if isinstance(transcription, dict):
            transcription["detected_language_code"] = detected_language
        return transcription

    except httpx.RequestError as exc:
        print(f"Gnani STT connection error: {exc}")
        raise HTTPException(502, "Could not connect to Gnani STT")


# --------------------------------------------------
# GEMINI - AI CONVERSATION
# --------------------------------------------------

@app.post("/api/chat")
async def chat(request: ChatRequest):
    api_key = get_gemini_key()
    question = request.question.strip()
    language_names = {
        "en-IN": "English",
        "hi-IN": "Hindi",
        "bn-IN": "Bengali",
        "mr-IN": "Marathi",
        "gu-IN": "Gujarati",
        "pa-IN": "Punjabi",
        "kn-IN": "Kannada",
        "te-IN": "Telugu",
        "ta-IN": "Tamil",
        "ml-IN": "Malayalam",
    }
    requested_language = request.language.strip()
    supported_languages = {
        "en-IN", "hi-IN", "bn-IN", "mr-IN", "gu-IN",
        "pa-IN", "kn-IN", "te-IN", "ta-IN", "ml-IN"
    }
    if requested_language not in supported_languages:
        requested_language = "en-IN"
    response_language = language_names.get(requested_language, "English")

    if not question:
        raise HTTPException(400, "Question cannot be empty")

    if len(question) > 10000:
        raise HTTPException(400, "Question is too long")

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
                    "AI Internship Challenge. Understand the user's "
                    "question and provide helpful, accurate and "
                    "natural responses. The detected speech language is "
                    f"{response_language} ({requested_language}). "
                    "Respond in that language. Preserve natural code-mixing "
                    "when the user mixes languages. Do not switch to English "
                    "unless the user does. Keep responses conversational "
                    "and easy to understand when spoken aloud. "
                    "If the user asks you to sing, write a short original "
                    "song or playful lyrics in the requested language. "
                    "Never copy existing copyrighted song lyrics. "
                    "Use emojis naturally when they add warmth, emotion, "
                    "or clarity; support Unicode emojis in your replies."
                )
            }]
        },
        "contents": [{
            "role": "user",
            "parts": [{"text": question}]
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
                result.status_code,
                "AI generation failed: " + result.text[:500]
            )

        data = result.json()
        candidates = data.get("candidates", [])

        if not candidates:
            raise HTTPException(502, "AI did not return an answer")

        answer = "".join(
            part.get("text", "")
            for part in candidates[0]
            .get("content", {})
            .get("parts", [])
        ).strip()

        if not answer:
            raise HTTPException(502, "AI returned an empty answer")

        return {
            "success": True,
            "question": question,
            "answer": answer,
            "language": requested_language,
            "model": "Gemini 3.5 Flash-Lite",
            "project": "VOX7"
        }

    except httpx.RequestError as exc:
        print(f"Gemini connection error: {exc}")
        raise HTTPException(
            502,
            "Could not connect to AI service. Check backend terminal."
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

    supported_languages = {
        "en-IN", "hi-IN", "bn-IN", "mr-IN", "gu-IN",
        "pa-IN", "kn-IN", "te-IN", "ta-IN", "ml-IN"
    }
    if language not in supported_languages:
        language = "en-IN"

    if not text.strip():
        raise HTTPException(400, "Text cannot be empty")

    if len(text) > 2000:
        raise HTTPException(400, "Text is too long")

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
                result.status_code,
                "Gnani speech generation failed: " + result.text[:500]
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
        print(f"Gnani TTS connection error: {exc}")
        raise HTTPException(502, "Could not connect to Gnani TTS")


# --------------------------------------------------
# CONVERSATION HISTORY
# --------------------------------------------------

@app.post("/api/history")
async def save_history(request: HistoryRequest):
    transcript = request.transcript.strip()
    answer = request.answer.strip()

    if not transcript or not answer:
        raise HTTPException(
            400,
            "Transcript and answer are required"
        )

    now = datetime.now(timezone.utc).isoformat()

    events = [
        {"label": "Voice recording completed", "time": now},
        {"label": "Prisma speech transcription completed", "time": now},
        {"label": "Gemini generated a response", "time": now},
        {"label": "VOX7 conversation saved", "time": now}
    ]

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO conversations
            (transcript, answer, language, events, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                transcript,
                answer,
                request.language,
                json.dumps(events),
                now
            )
        )

        conversation_id = cursor.lastrowid

    return {
        "success": True,
        "id": conversation_id,
        "created_at": now
    }


@app.get("/api/history")
async def get_history():
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT * FROM conversations
            ORDER BY id DESC
            """
        ).fetchall()

    conversations = []

    for row in rows:
        item = dict(row)
        item["events"] = json.loads(item["events"] or "[]")
        conversations.append(item)

    return {
        "success": True,
        "conversations": conversations,
        "total": len(conversations)
    }


@app.delete("/api/history/{conversation_id}")
async def delete_history(conversation_id: int):
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM conversations WHERE id = ?",
            (conversation_id,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(404, "Conversation not found")

    return {"success": True, "message": "Conversation deleted"}


@app.delete("/api/history")
async def clear_history():
    with get_connection() as connection:
        connection.execute("DELETE FROM conversations")

    return {"success": True, "message": "History cleared"}
