# VOX7 — Your Voice. Your Intelligence.

### A Multilingual AI Voice Companion Built for Natural Human–AI Interaction

VOX7 is an AI-powered voice companion that transforms natural speech into intelligent, spoken conversations. By combining speech recognition, generative AI, and neural text-to-speech, VOX7 creates a voice-first experience designed to make human–AI interaction more natural, accessible, and engaging.

**Speak naturally. Think beyond limits.**

---

## Overview

Communication with AI should feel natural, intuitive, and accessible.

VOX7 explores this idea by allowing users to communicate through their voice rather than relying entirely on typing. Users can speak, receive an AI-generated response, and hear that response spoken aloud.

The application integrates three core AI capabilities:

- **Speech Recognition:** Gnani Prisma converts spoken audio into text.
- **Artificial Intelligence:** Google Gemini processes the recognised text and generates conversational responses.
- **Speech Generation:** Gnani Timbre converts AI-generated responses into audio.

Together, these technologies create an integrated voice-to-voice conversational experience.

VOX7 also introduces **VOXIE**, an interactive companion that brings personality and playful visual interactions into the voice experience.

## Key Features

### 1. Voice-Based Interaction

- Browser-based microphone recording.
- Start and stop recording controls.
- Audio submission to the backend.
- Processing feedback and error indicators.
- Automated voice conversation workflow.

### 2. Multilingual Speech Recognition

- Powered by Gnani Prisma v3.0.
- Designed for multilingual speech input.
- Supports multilingual and code-mixed transcription capabilities offered by the speech service.
- Intended to make voice interaction more accessible across Indian languages.

Actual language recognition depends on provider configuration and the selected language. End-to-end support should be validated for each target language.

### 3. Intelligent AI Conversations

- Powered by Google Gemini.
- Generates contextually relevant conversational responses.
- Designed to respond in the user's language whenever possible.
- Supports natural conversational interaction.
- Optimised for clear and understandable answers.

### 4. AI-Powered Voice Responses

- Powered by Gnani Timbre v2.5.
- Converts AI-generated text into audio.
- Supports configurable voice and language settings.
- Enables automatic audio playback.
- Connects generated speech to the conversation workflow.

### 5. Meet VOXIE — The Interactive AI Companion

VOXIE adds a playful personality to the VOX7 experience.

- Interactive animated cat companion.
- Click and touch-based reactions.
- Expressive visual animations.
- Mood-inspired reactions.
- Dance-style interactions.
- Singing-style responses with generated lyrics and spoken audio.
- Playful visual effects and character feedback.

VOXIE uses lightweight interaction and keyword-based logic for some reactions. Singing-style interactions generate lyrics and use speech synthesis; they are not a dedicated melodic singing engine.

### 6. Modern User Interface

- Modern pastel pink-and-white visual design.
- VOX7 branding and visual identity.
- Overview, Voice Studio, and Conversations navigation.
- Separate transcription and AI response sections.
- Interactive VOXIE companion.
- Clear processing and error indicators.
- Voice playback controls.

---

## How VOX7 Works

VOX7 follows a four-stage voice processing pipeline.

**Stage 1 — LISTEN**

The user speaks through the browser microphone. The React frontend records the audio and sends it to the backend.

**Stage 2 — UNDERSTAND**

Gnani Prisma processes the audio and returns the recognised transcript.

**Stage 3 — THINK**

The transcript is sent to Google Gemini, which generates a conversational response.

**Stage 4 — RESPOND**

The AI-generated response is sent to Gnani Timbre, which generates speech audio for playback in the browser.

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
| Backend language | Python |
| API framework | FastAPI |
| HTTP requests | HTTPX |
| Speech recognition | Gnani Prisma v3.0 |
| Generative AI | Google Gemini |
| Text-to-speech | Gnani Timbre v2.5 |
| Environment configuration | Python dotenv |
| Data validation | Pydantic |
| Local data storage | SQLite |

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

The `.venv/` and `.env` entries are local development resources and are not intended to be committed to the repository.

---

## Installation and Setup

### Prerequisites

Install the following:

- Python 3.11 or newer
- Node.js and npm
- Git
- Gnani API credentials
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/methra0702/VOX7.git
cd VOX7
```

### 2. Set Up the Python Environment

From the project root, create a virtual environment:

```powershell
py -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install fastapi uvicorn python-dotenv httpx python-multipart
```

### 3. Configure API Credentials

Create a `.env` file in the root `VOX7` directory.

Add the following:

```env
GNANI_API_KEY=your_gnani_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Replace the example values with your actual API credentials.

**Security note:** Never publish your real API keys or commit your `.env` file to GitHub.

### 4. Start the Backend

Run this command from the project root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000
```

The backend will be available at:

- **Backend:** http://127.0.0.1:8000
- **API documentation:** http://127.0.0.1:8000/docs
- **Health check:** http://127.0.0.1:8000/health

Keep this terminal running.

### 5. Start the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local development URL displayed by Vite, normally:

http://localhost:5173/

Allow microphone access when your browser requests permission.

Both the frontend and backend must be running for the complete voice conversation workflow.

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

1. The frontend records the user's audio.
2. `/api/transcribe` sends the audio to Gnani Prisma.
3. The recognised text is passed to `/api/chat`.
4. Google Gemini generates the conversational response.
5. `/api/speak` sends the generated answer to Gnani Timbre.
6. The browser plays the generated audio.

This pipeline connects speech recognition, AI reasoning, and speech generation into one conversational experience.

---

## Security and Configuration

VOX7 uses environment variables to protect API credentials.

Security considerations include:

- API keys are stored in a local `.env` file.
- Sensitive environment files are excluded through `.gitignore`.
- External AI service requests are handled by the backend.
- Input validation is implemented for supported API requests.
- Audio and text inputs are subject to backend validation.

The current configuration is intended for local development.

Production deployment requires additional security measures, including HTTPS, appropriate CORS restrictions, secure secret management, access control, and production-ready infrastructure.

**Authentication note:** The current sign-in interface is a demonstration experience, not production-grade account authentication.

---

## Testing and Current Implementation

The core voice conversation workflow has been tested during development.

| Component | Development status |
|---|---|
| FastAPI backend health check | Tested |
| Gnani Prisma transcription API | Tested |
| Google Gemini conversation API | Tested |
| Gnani Timbre speech generation API | Tested |
| Browser microphone recording | Tested |
| Integrated voice-to-voice workflow | Tested |
| VOXIE interactive character | Implemented |
| VOXIE mood and playful interactions | Implemented |
| End-to-end validation across all target languages | Further testing required |
| Production deployment | Future work |

These statuses describe development testing and implementation, not independent benchmarking or production certification.

---

## Potential Applications

VOX7 explores several potential application areas:

- **Multilingual Digital Assistance:** Voice-based interaction with AI.
- **Education and Learning:** Conversational learning experiences.
- **Accessibility:** Alternative interaction through spoken language.
- **Language Learning:** Opportunities for conversational language practice.
- **Human–AI Interaction:** More natural voice-first communication.
- **Conversational Information Systems:** Spoken access to AI-generated information.

These are potential use cases rather than claims of existing production deployment.

---

## Future Scope

VOX7 can be extended through:

- Broader end-to-end Indian-language validation.
- Automatic language detection and matching voice output.
- Conversation memory and personalised interactions.
- Streaming speech recognition and speech synthesis.
- Voice activity detection and interruption handling.
- Improved emotion and intent recognition.
- More expressive and natural voice responses.
- Mobile application support.
- Secure user authentication and account management.
- Cloud deployment and scalable infrastructure.
- Improved accessibility and multilingual interface support.

---

## Project Vision

VOX7 is built around a simple idea:

**Technology should understand people in the language they naturally speak.**

By bringing speech recognition, generative AI, and speech synthesis together, VOX7 explores a more natural and inclusive way for people to interact with artificial intelligence.

It aims to make AI conversations feel less like interacting with software and more like having a natural conversation.

---

## Acknowledgements

VOX7 integrates the following technologies and services:

- **Gnani AI** — Prisma Speech Recognition.
- **Google** — Gemini Generative AI.
- **Gnani AI** — Timbre Text-to-Speech.
- **React and Vite** — Frontend development.
- **FastAPI** — Backend API development.

---

## Project Information

| Field | Details |
|---|---|
| Project Name | VOX7 |
| Category | Artificial Intelligence / Voice Technology |
| Application Type | Multilingual AI Voice Companion |
| Challenge | Great Indian AI Internship Challenge |
| Repository | [GitHub — VOX7](https://github.com/methra0702/VOX7) |

---

**Built with curiosity, innovation, and the belief that every voice deserves to be understood.**

*VOX7 — Your Voice. Your Intelligence.*