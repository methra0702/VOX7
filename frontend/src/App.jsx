
import { useRef, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("READY");
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setSpeaking(false);
  }

  async function startRecording() {
    setError("");
    setTranscript("");
    setAnswer("");
    stopAudio();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      streamRef.current = stream;

      const formats = [
        "audio/mp4",
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus"
      ];

      const mimeType = formats.find(type =>
        MediaRecorder.isTypeSupported(type)
      );

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType
        });

        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        if (!blob.size) {
          setError("No audio recorded.");
          setStatus("ERROR");
          return;
        }

        await transcribeAudio(blob, recorder.mimeType);
      };

      recorder.start();
      setListening(true);
      setStatus("RECORDING");

    } catch (err) {
      setError(err.message);
      setStatus("ERROR");

      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      setListening(false);
      setStatus("PROCESSING");
    }
  }

  async function transcribeAudio(blob, mimeType) {
    try {
      setStatus("PRISMA TRANSCRIBING");

      const extension = mimeType.includes("mp4")
        ? "m4a"
        : mimeType.includes("ogg")
        ? "ogg"
        : "webm";

      const formData = new FormData();

      formData.append(
        "audio",
        blob,
        `vox7-recording.${extension}`
      );

      formData.append("language_code", "indic-auto");

      const response = await fetch(
        `${API_URL}/api/transcribe`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Transcription failed."
        );
      }

      const recognizedText = data.transcript?.trim();

      if (!recognizedText) {
        throw new Error("No speech was recognised.");
      }

      setTranscript(recognizedText);

      // Send the recognised speech to Gemini.
      await generateAIResponse(recognizedText);

    } catch (err) {
      setError(err.message);
      setStatus("ERROR");
    }
  }

  async function generateAIResponse(question) {
    try {
      setStatus("VOX7 THINKING");

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: question
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.detail || "VOX7 could not generate a response."
        );
      }

      const aiAnswer = data.answer?.trim();

      if (!aiAnswer) {
        throw new Error("VOX7 returned an empty response.");
      }

      setAnswer(aiAnswer);

      // Automatically send the AI answer to Timbre.
      await speakText(aiAnswer);

    } catch (err) {
      setError(err.message);
      setStatus("ERROR");
    }
  }

  async function speakText(text) {
    if (!text?.trim()) return;

    try {
      setError("");
      setSpeaking(true);
      setStatus("TIMBRE GENERATING VOICE");

      stopAudio();

      setSpeaking(true);
      setStatus("TIMBRE GENERATING VOICE");

      const params = new URLSearchParams();

      params.append("text", text);
      params.append("language", "en-IN");
      params.append("voice", "Nalini");

      const response = await fetch(
        `${API_URL}/api/speak`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params
        }
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(
          result.detail || "Timbre voice generation failed."
        );
      }

      const audioBlob = await response.blob();

      if (!audioBlob.size) {
        throw new Error("Timbre returned empty audio.");
      }

      audioUrlRef.current = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrlRef.current);
      audioRef.current = audio;

      audio.onended = () => {
        setSpeaking(false);
        setStatus("COMPLETED");
      };

      audio.onerror = () => {
        setSpeaking(false);
        setStatus("VOICE READY");
        setError("Audio playback failed. Try playing the response again.");
      };

      setStatus("VOX7 SPEAKING");

      await audio.play();

    } catch (err) {
      setSpeaking(false);
      setStatus("VOICE READY");
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>VOX<span>7</span></h1>

        <div className="status">
          <span className="dot"></span>
          SYSTEM ONLINE
        </div>
      </nav>

      <main className="hero">
        <p className="eyebrow">
          YOUR VOICE. YOUR INTELLIGENCE.
        </p>

        <h2>
          Speak naturally.
          <br />
          <span>Think beyond limits.</span>
        </h2>

        <p className="subtitle">
          Your multilingual AI voice companion.
          Speak in your language and let VOX7 understand you.
        </p>

        <button
          className={`mic-button ${listening ? "active" : ""}`}
          onClick={listening ? stopRecording : startRecording}
          disabled={
            status === "PROCESSING" ||
            status === "PRISMA TRANSCRIBING" ||
            status === "VOX7 THINKING" ||
            status === "TIMBRE GENERATING VOICE" ||
            speaking
          }
        >
          {listening ? "⏹" : "🎙️"}
        </button>

        <p className="mic-label">
          {listening
            ? "Recording... tap to stop"
            : status === "PRISMA TRANSCRIBING"
            ? "Prisma is recognising your speech..."
            : status === "VOX7 THINKING"
            ? "VOX7 is thinking..."
            : status === "TIMBRE GENERATING VOICE"
            ? "Preparing your voice response..."
            : speaking
            ? "VOX7 is speaking..."
            : "Tap to start speaking"}
        </p>

        <section className="transcript">
          <div className="transcript-header">
            <span>VOICE TRANSCRIPTION</span>
            <span className="live">● {status}</span>
          </div>

          <p>
            {transcript ||
              "Your recognised words will appear here..."}
          </p>
        </section>

        {answer && (
          <section className="transcript ai-response">
            <div className="transcript-header">
              <span>VOX7 AI RESPONSE</span>
              <span className="live">● AI</span>
            </div>

            <p>{answer}</p>

            <button
              className="speak-button"
              onClick={() => speakText(answer)}
              disabled={speaking}
            >
              {speaking
                ? "🔊 Speaking..."
                : "🔊 Hear VOX7's response"}
            </button>
          </section>
        )}

        {error && (
          <p style={{ color: "#ff8b9c" }}>
            Error: {error}
          </p>
        )}

        <p className="powered">
          POWERED BY GNANI AI · PRISMA · GEMINI · TIMBRE
        </p>
      </main>
    </div>
  );
}

export default App;
