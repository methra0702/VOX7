# VOX7 — Your Voice. Your Intelligence.

### A Multilingual AI Voice Companion Built for Natural Human–AI Interaction

VOX7 is an AI-powered multilingual voice companion that transforms natural speech into intelligent, spoken conversations. It combines speech recognition, generative AI, and neural text-to-speech to create an accessible and conversational experience.

**Speak naturally. Think beyond limits.**

---

## Overview

Communication with AI should feel natural, intuitive, and accessible.

VOX7 aims to make that possible by allowing users to communicate through their voice rather than relying entirely on typing. Users can speak in their preferred language, receive an AI-generated response, and hear that response spoken aloud.

VOX7 integrates three core AI capabilities:

- **Speech Recognition:** Gnani Prisma converts spoken audio into text.
- **Artificial Intelligence:** Google Gemini understands the recognised text and generates a conversational response.
- **Speech Generation:** Gnani Timbre converts the AI response into natural-sounding audio.

The result is an integrated voice-to-voice conversational experience.

## Key Features

### 1. Voice-Based Interaction
- Browser-based microphone recording.
- Start and stop recording controls.
- Real-time interaction feedback and processing states.

### 2. Multilingual Speech Recognition
- Powered by Gnani Prisma v3.0.
- Supports multilingual speech recognition.
- Uses code-mixed transcription to accommodate natural language mixing.

### 3. Intelligent AI Conversations
- Powered by Google Gemini.
- Generates contextually relevant conversational responses.
- Designed to respond in the language used by the user whenever possible.
- Optimised for clear, conversational answers.

### 4. AI-Powered Voice Responses
- Powered by Gnani Timbre v2.5.
- Converts AI-generated answers into audio.
- Supports configurable voice and language settings.
- Includes automatic voice playback.

### 5. Interactive User Interface
- Modern dark-themed interface.
- VOX7 branding and visual identity.
- Separate transcription and AI response sections.
- Clear processing and error indicators.

---

## How VOX7 Works

The application follows a four-stage voice processing pipeline.

**Stage 1 — Listen**

The user speaks through the browser microphone. The frontend records the audio.

**Stage 2 — Understand**

Gnani Prisma processes the audio and returns the recognised transcript.

**Stage 3 — Think**

The transcript is sent to Google Gemini, which generates an intelligent response.

**Stage 4 — Respond**

The AI-generated response is sent to Gnani Timbre, which generates audio for playback.

### System Architecture

```text
              USER
                |
                v
       Browser Microphone
                |
                v
        React Frontend
                |
                v
       FastAPI Backend
                |
                v
       GNANI PRISMA
       Speech-to-Text
                |
                v
        Recognised Text
                |
                v
        GOOGLE GEMINI
        AI Conversation
                |
                v
       AI-Generated Answer
                |
                v
        GNANI TIMBRE
        Text-to-Speech
                |
                v
        Generated Audio
                |
                v
         USER HEARS
          VOX7 ANSWER
```

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend tooling | Vite |
| Backend | Python |
| API framework | FastAPI |
| HTTP requests | HTTPX |
| Speech recognition | Gnani Prisma v3.0 |
| Generative AI | Google Gemini |
| Text-to-speech | Gnani Timbre v2.5 |
| Environment configuration | Python dotenv |
| Data validation | Pydantic |

---

## Project Structure

```text
VOX7/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
├── .venv/
│
├── .env
│
├── .gitignore
│
└── README.md
```

---

## Installation and Setup

### Prerequisites

Install the following:

- Python 3.11 or newer
- Node.js and npm
- Git
- Gnani API credentials
- Google Gemini API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd VOX7
```

### 2. Set up the Python environment

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install fastapi uvicorn python-dotenv httpx python-multipart
```

### 3. Configure API credentials

Create a `.env` file in the project root directory.

Add your credentials:

```env
GNANI_API_KEY=your_gnani_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Never publish your actual API keys.

### 4. Start the backend

From the project root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000
```

The backend will be available at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

Health check:

`http://127.0.0.1:8000/health`

### 5. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local development URL displayed by Vite, normally:

`http://localhost:5173`

Allow microphone access when your browser requests permission.

---

## Backend API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome response |
| GET | `/health` | Backend health check |
| POST | `/api/transcribe` | Speech-to-text |
| POST | `/api/chat` | AI conversation |
| POST | `/api/speak` | Text-to-speech |

### Voice Conversation Request Flow

1. The frontend records user audio.
2. `/api/transcribe` sends the audio to Gnani Prisma.
3. `/api/chat` sends the recognised text to Gemini.
4. `/api/speak` sends the generated AI answer to Gnani Timbre.
5. The browser plays the generated audio.

---

## Security and Configuration

VOX7 uses environment variables to protect API credentials.

Security practices include:

- API keys are stored in a local `.env` file.
- Credentials are not intended to be committed to GitHub.
- Backend services handle external AI API requests.
- The backend validates empty and oversized audio uploads.
- The backend validates empty and oversized text inputs.

The included development configuration uses a local frontend origin. Production deployment requires appropriate CORS, HTTPS, secret management, and access-control configuration.

---

## Potential Applications

VOX7 has potential applications in:

- Multilingual digital assistance.
- Educational support and learning.
- Voice-first human–AI interaction.
- Accessibility-oriented interfaces.
- Conversational information systems.
- Language learning and communication.

These are potential application areas rather than claims of existing production deployment.

---

## Future Scope

VOX7 can be extended through:

- Automatic language detection and matching voice output.
- Conversation memory and personalised interactions.
- Additional Indian language support.
- Streaming speech recognition and speech synthesis.
- Voice activity detection and interruption handling.
- Mobile application support.
- Cloud deployment and scalable infrastructure.
- Improved accessibility and multilingual UI support.

---

## Project Vision

VOX7 is built around a simple idea:

**Technology should understand people in the language they naturally speak.**

By bringing speech recognition, generative AI, and speech synthesis together, VOX7 explores a more natural and inclusive way for people to interact with artificial intelligence.

---

## Acknowledgements

VOX7 integrates the following AI technologies:

- Gnani AI — Prisma Speech Recognition.
- Google — Gemini Generative AI.
- Gnani AI — Timbre Text-to-Speech.

## Project Information

**Project Name:** VOX7  
**Category:** Artificial Intelligence / Voice Technology  
**Application Type:** Multilingual AI Voice Companion  
**Challenge:** Great Indian AI Internship Challenge

**Built with curiosity, innovation, and the belief that every voice deserves to be understood.**

---

*VOX7 — Your Voice. Your Intelligence.*