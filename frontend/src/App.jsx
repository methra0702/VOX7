
import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: `${(i % 8) * -0.7}s`,
  duration: `${9 + (i % 7) * 2}s`,
  size: `${3 + (i % 4)}px`
}));

function Brand() {
  return (
    <div className="brand-mark">
      <span className="brand-symbol">V</span>
      <span className="brand-name">VOX<span>7</span></span>
    </div>
  );
}

function FloatingArtwork() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-grid" />
      <div className="art-sun" />
      <div className="art-orbit orbit-a" />
      <div className="art-orbit orbit-b" />

      <div className="art-card art-card-one">
        <span className="art-card-dot" />
        <span>VOICE</span>
        <strong>01</strong>
      </div>

      <div className="art-card art-card-two">
        <span className="art-wave">〰</span>
        <span>LISTENING</span>
      </div>

      <div className="art-flower">
        <i /><i /><i /><i /><i /><i />
        <b />
      </div>

      <div className="art-star star-one">✳</div>
      <div className="art-star star-two">✦</div>
      <div className="art-star star-three">✳</div>

      <div className="art-character">
        <div className="character-shadow" />
        <div className="character-body">
          <div className="character-eye eye-left" />
          <div className="character-eye eye-right" />
          <div className="character-smile" />
          <div className="character-cheek cheek-left" />
          <div className="character-cheek cheek-right" />
        </div>
        <div className="character-antenna" />
        <div className="character-arm arm-left" />
        <div className="character-arm arm-right" />
      </div>

      <div className="art-caption">A NEW WAY TO SPEAK</div>
    </div>
  );
}



function detectVoxieBehavior(text = "") {
  const value = text.toLowerCase();

  const sing = /\b(sing|singing|song|karaoke)\b|ഗാനം|പാട്ട്|పాట|పాడ|ಹಾಡು|ಹಾಡು|பாட்டு|பாட|गाना|गाओ/.test(value);
  const dance = /\b(dance|dancing|dance for me)\b|നൃത്തം|ഡാൻസ്|డాన్స్|నాట్యం|ನೃತ್ಯ|ಡ್ಯಾನ್ಸ್|நடனம்|ஆடு|नाच/.test(value);

  const sad = /\b(sad|unhappy|upset|lonely|depressed|down|heartbroken|crying|bad day|stressed|anxious)\b|ദുഃഖം|സങ്കടം|വിഷമം|బాధ|దుఃఖం|కష్టం|ದುಃಖ|ಬೇಸರ|ದುಃಖ|சோகம்|கவலை|வருத்தம்|उदास|दुखी/.test(value);
  const happy = /\b(happy|excited|great|awesome|joyful|celebrate|good mood)\b|സന്തോഷം|ఆనందం|సంతోషం|ಸಂತೋಷ|மகிழ்ச்சி|खुश/.test(value);

  return {
    action: sing ? "sing" : dance ? "dance" : "none",
    mood: sad ? "comfort" : happy ? "happy" : "neutral"
  };
}

function Voxie({ listening, thinking, speaking, mood = "neutral", action = "none" }) {
  const [petted, setPetted] = useState(false);
  const petTimerRef = useRef(null);

  function petVoxie() {
    setPetted(false);
    if (petTimerRef.current) clearTimeout(petTimerRef.current);
    requestAnimationFrame(() => setPetted(true));
    petTimerRef.current = setTimeout(() => setPetted(false), 1250);
  }

  const mode = speaking
    ? "speaking"
    : thinking
    ? "thinking"
    : listening
    ? "listening"
    : "idle";

  const caption = {
    idle: "HAPPY TO SEE YOU",
    listening: "I'M LISTENING",
    thinking: "LET ME THINK",
    speaking: "HERE'S YOUR ANSWER"
  }[mode];

  return (
    <div
      className={`voxie-stage voxie-${mode} voxie-mood-${mood} voxie-action-${action} ${petted ? "voxie-petted" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Pet VOXIE. Current state: ${mode}`}
      title="Tap or click VOXIE to pet her"
      onClick={petVoxie}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          petVoxie();
        }
      }}
    >
      {petted && <span className="voxie-pet-hearts" aria-hidden="true">💗 ✨ 💕</span>}
      {action === "sing" && <div className="voxie-concert-lights" aria-hidden="true"><i /><i /><i /><i /></div>}
      {action === "sing" && <span className="voxie-microphone" aria-hidden="true">🎤</span>}
      {action === "dance" && <span className="voxie-dance-note" aria-hidden="true">🎵</span>}
      <span className="voxie-spark spark-left">✦</span>
      <span className="voxie-spark spark-right">✧</span>
      <div className="voxie-shadow" />
      <div className="voxie">
        <div className="voxie-tail" />
        <div className="voxie-ear ear-left"><i /></div>
        <div className="voxie-ear ear-right"><i /></div>
        <div className="voxie-body">
          <div className="voxie-face">
            <span className="voxie-eye eye-left" />
            <span className="voxie-eye eye-right" />
            <span className="voxie-blush blush-left" />
            <span className="voxie-blush blush-right" />
            <span className="voxie-mouth" />
            <span className="voxie-whisker whisker-left" />
            <span className="voxie-whisker whisker-right" />
          </div>
        </div>
        <div className="voxie-feet"><i /><i /></div>
      </div>
      <p className="voxie-caption">
        {action === "sing" ? "VOXIE'S MINI CONCERT 🎤" :
         action === "dance" ? "DANCE PARTY! 💃" :
         mood === "comfort" ? "I'M HERE WITH YOU 💗" :
         mood === "happy" ? "LET'S CELEBRATE! ✨" : caption}
      </p>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("vox7_demo_session") === "active"
  );

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("en-IN");
  const [status, setStatus] = useState("READY");
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [voxieMood, setVoxieMood] = useState("neutral");
  const [voxieAction, setVoxieAction] = useState("none");
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [search, setSearch] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (loggedIn) loadHistory();
  }, [loggedIn]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());

      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  function handleHeroPointer(event) {
    const element = heroRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    element.style.setProperty("--pointer-x", `${x}`);
    element.style.setProperty("--pointer-y", `${y}`);
  }

  function resetHeroPointer() {
    heroRef.current?.style.setProperty("--pointer-x", "0");
    heroRef.current?.style.setProperty("--pointer-y", "0");
  }

  async function loadHistory() {
    setLoadingHistory(true);

    try {
      const response = await fetch(`${API_URL}/api/history`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Could not load history");
      }

      setHistory(data.conversations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }

  function loginDemo() {
    localStorage.setItem("vox7_demo_session", "active");
    setLoggedIn(true);
    setPage("home");
  }

  function logout() {
    stopAudio();
    stopRecordingTracks();
    localStorage.removeItem("vox7_demo_session");
    setLoggedIn(false);
    setPage("home");
  }

  function stopRecordingTracks() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setListening(false);
  }

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

      const response = await fetch(`${API_URL}/api/transcribe`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Transcription failed."
        );
      }

      const recognizedText = data.transcript?.trim();
      const detectedCode = data.detected_language_code || data.language_code || "en-IN";
      setDetectedLanguage(detectedCode);

      if (!recognizedText) {
        throw new Error("No speech was recognised.");
      }

      setTranscript(recognizedText);
      const behavior = detectVoxieBehavior(recognizedText);
      setVoxieMood(behavior.mood);
      setVoxieAction(behavior.action);
      await generateAIResponse(recognizedText, detectedCode);
    } catch (err) {
      setError(err.message);
      setStatus("ERROR");
    }
  }

  async function generateAIResponse(question, language = detectedLanguage) {
    try {
      setStatus("VOX7 THINKING");

      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question, language })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.detail || "VOX7 could not respond."
        );
      }

      const aiAnswer = data.answer?.trim();

      if (!aiAnswer) {
        throw new Error("VOX7 returned an empty response.");
      }

      setAnswer(aiAnswer);

      try {
        await fetch(`${API_URL}/api/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            transcript: question,
            answer: aiAnswer,
            language
          })
        });

        await loadHistory();
      } catch (historyError) {
        console.error("History save failed:", historyError);
      }

      await speakText(aiAnswer, language);
    } catch (err) {
      setError(err.message);
      setStatus("ERROR");
    }
  }

  async function speakText(text, language = detectedLanguage) {
    if (!text?.trim()) return;

    try {
      setError("");
      stopAudio();
      setSpeaking(false);
      setStatus("TIMBRE GENERATING VOICE");

      const params = new URLSearchParams();

      params.append("text", text);
      params.append("language", language || "en-IN");
      params.append("voice", "Nalini");

      const response = await fetch(`${API_URL}/api/speak`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.detail || "Voice generation failed."
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
        setError("Audio playback failed.");
      };

      setStatus("VOX7 SPEAKING");
      setSpeaking(true);
      await audio.play();
    } catch (err) {
      setSpeaking(false);
      setStatus("VOICE READY");
      setError(err.message);
    }
  }

  async function deleteConversation(id) {
    if (!window.confirm("Delete this conversation?")) return;

    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Could not delete conversation");
      }

      setSelectedHistory(null);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    }
  }

  async function clearHistory() {
    if (!window.confirm("Delete all conversation history?")) return;

    try {
      const response = await fetch(`${API_URL}/api/history`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Could not clear history");
      }

      setSelectedHistory(null);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    }
  }

  function navigate(nextPage) {
    setPage(nextPage);
    setSelectedHistory(null);
    setError("");

    if (nextPage === "history") {
      loadHistory();
    }
  }

  const filteredHistory = history.filter(item =>
    `${item.transcript} ${item.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const busy = [
    "PROCESSING",
    "PRISMA TRANSCRIBING",
    "VOX7 THINKING",
    "TIMBRE GENERATING VOICE"
  ].includes(status);

  if (!loggedIn) {
    return (
      <div className="login-screen">
        <div className="particle-field" aria-hidden="true">
          {PARTICLES.map((particle, index) => (
            <i
              key={index}
              className="particle"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                width: particle.size,
                height: particle.size
              }}
            />
          ))}
        </div>

        <div className="login-glow" />
        <div className="login-card">
          <Brand />

          <p className="eyebrow">YOUR VOICE. YOUR INTELLIGENCE.</p>

          <h1>
            A different way
            <br />
            to <span>be heard.</span>
          </h1>

          <p className="muted">
            Speak naturally. Think beyond limits.
            Experience multilingual AI conversations.
          </p>

          <div className="login-character" aria-label="VOXIE, your voice companion">
            <Voxie listening={false} thinking={false} speaking={false} />
          </div>

          <button className="primary-button login-button" onClick={loginDemo}>
            Sign in <span>↗</span>
          </button>

          <p className="demo-note">
            Demo sign-in · No account or password required
          </p>

          <p className="powered">POWERED BY GNANI AI · GEMINI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="particle-field dashboard-particles" aria-hidden="true">
        {PARTICLES.map((particle, index) => (
          <i
            key={index}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
      </div>

      <main className="main-panel">
        <header className="topbar topbar-navigation">
          <Brand />
          <nav className="top-navigation" aria-label="Main navigation">
            <button
              className={page === "home" ? "top-nav-item selected" : "top-nav-item"}
              onClick={() => navigate("home")}
            >
              <span className="nav-icon">⌂</span>
              <span>Overview</span>
            </button>
            <button
              className={page === "voice" ? "top-nav-item selected" : "top-nav-item"}
              onClick={() => navigate("voice")}
            >
              <span className="nav-icon">◉</span>
              <span>Voice Studio</span>
            </button>
            <button
              className={page === "history" ? "top-nav-item selected" : "top-nav-item"}
              onClick={() => navigate("history")}
            >
              <span className="nav-icon">▤</span>
              <span>Conversations</span>
              <small>{history.length}</small>
            </button>
          </nav>
          <div className="topbar-status">
            <span className="topbar-right">MULTILINGUAL AI <span>✦</span></span>
            <button className="top-exit" onClick={logout} title="Sign out" aria-label="Sign out">
              <span className="signout-icon">↪</span>
              <span>Sign out</span>
            </button>
          </div>
        </header>

        {page === "home" && (
          <section
            className="content home-content fade-in"
            ref={heroRef}
            onPointerMove={handleHeroPointer}
            onPointerLeave={resetHeroPointer}
          >
            <div className="hero-copy">
              <p className="eyebrow">YOUR PERSONAL VOICE COMPANION</p>

              <h1 className="kinetic-heading">
                Intelligence
                <br />
                that <span>listens.</span>
              </h1>

              <p className="muted intro">
                Your voice is the interface. Start a conversation
                and let VOX7 understand, think and respond.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={() => navigate("voice")}
                >
                  Enter voice studio <span>↗</span>
                </button>
                <span className="hero-note">
                  <i /> MADE FOR EVERY VOICE
                </span>
              </div>
            </div>

            <FloatingArtwork />

            <div className="hero-marquee" aria-hidden="true">
              <div className="marquee-track">
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i}>
                    SPEAK YOUR WORLD <b>✳</b> THINK WITHOUT LIMITS <b>✳</b>
                    VOICE IS POWER <b>✳</b>
                  </span>
                ))}
              </div>
            </div>

            <div className="overview-grid">
              <div className="feature-card featured">
                <div className="mini-orb">V</div>
                <p className="card-kicker">VOICE INTELLIGENCE</p>
                <h2>Talk to VOX7</h2>
                <p>
                  Speak naturally in your language and hear an AI response.
                </p>
                <button
                  className="primary-button"
                  onClick={() => navigate("voice")}
                >
                  Open voice studio <span>→</span>
                </button>
              </div>

              <div className="feature-card journey-card">
                <span className="feature-icon">◷</span>
                <p className="card-kicker">YOUR JOURNEY</p>
                <h2>{history.length}</h2>
                <p>Saved conversations</p>
                <button
                  className="text-button"
                  onClick={() => navigate("history")}
                >
                  View history →
                </button>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <p className="card-kicker">RECENT CONVERSATIONS</p>
                <h2>Pick up where you left off</h2>
              </div>
              <button
                className="text-button"
                onClick={() => navigate("history")}
              >
                View all →
              </button>
            </div>

            {history.slice(0, 3).length === 0 ? (
              <div className="empty-state">
                Your conversations will appear here after your first session.
              </div>
            ) : (
              history.slice(0, 3).map(item => (
                <button
                  className="recent-row"
                  key={item.id}
                  onClick={() => {
                    setSelectedHistory(item);
                    setPage("history");
                  }}
                >
                  <span className="recent-icon">◉</span>
                  <span className="recent-copy">
                    <strong>{item.transcript}</strong>
                    <small>
                      {new Date(item.created_at).toLocaleString()}
                    </small>
                  </span>
                  <span>→</span>
                </button>
              ))
            )}
          </section>
        )}

        {page === "voice" && (
          <section className="content voice-content fade-in">
            <p className="eyebrow">LIVE VOICE EXPERIENCE</p>
            <h1>
              Speak. <span>We'll listen.</span>
            </h1>
            <p className="muted intro">
              Your multilingual conversation starts here.
            </p>

            <Voxie
              listening={listening}
              thinking={
                status === "VOX7 THINKING" ||
                status === "TIMBRE GENERATING VOICE"
              }
              speaking={speaking}
              mood={voxieMood}
              action={voxieAction}
            />

            <p className="voice-status">
              {listening
                ? "LISTENING TO YOU"
                : speaking
                ? "VOX7 IS SPEAKING"
                : status}
            </p>

            <p className="muted">
              {listening
                ? "Speak clearly, then tap stop."
                : busy
                ? "VOX7 is preparing your response..."
                : "Tap the microphone to begin."}
            </p>

            <button
              className={`mic-button ${listening ? "active" : ""}`}
              onClick={listening ? stopRecording : startRecording}
              disabled={!listening && (busy || speaking)}
            >
              {listening ? "■" : "🎙"}
            </button>

            <div className="voice-columns">
              <div className="conversation-card">
                <p className="card-kicker">YOU SAID</p>
                <p>
                  {transcript || "Your recognised speech will appear here."}
                </p>
              </div>

              <div className="conversation-card ai-card">
                <p className="card-kicker">VOX7 RESPONDS</p>
                <p>
                  {answer || "Your AI response will appear here."}
                </p>
                {answer && (
                  <button
                    className="text-button"
                    onClick={() => speakText(answer)}
                    disabled={speaking}
                  >
                    ▶ Play response
                  </button>
                )}
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <p className="powered">PRISMA · GEMINI · TIMBRE</p>
          </section>
        )}

        {page === "history" && (
          <section className="content fade-in">
            <p className="eyebrow">YOUR PERSONAL ARCHIVE</p>
            <h1>
              Conversation <span>history.</span>
            </h1>
            <p className="muted intro">
              Your previous conversations, saved in your VOX7 workspace.
            </p>

            {selectedHistory ? (
              <div className="history-detail">
                <button
                  className="text-button"
                  onClick={() => setSelectedHistory(null)}
                >
                  ← Back to all conversations
                </button>

                <p className="card-kicker">
                  CONVERSATION ·{" "}
                  {new Date(selectedHistory.created_at).toLocaleString()}
                </p>

                <div className="conversation-card">
                  <p className="card-kicker">YOU SAID</p>
                  <p>{selectedHistory.transcript}</p>
                </div>

                <div className="conversation-card ai-card">
                  <p className="card-kicker">VOX7 RESPONDED</p>
                  <p>{selectedHistory.answer}</p>
                  <button
                    className="text-button"
                    onClick={() => speakText(selectedHistory.answer)}
                  >
                    ▶ Listen to response
                  </button>
                </div>

                <button
                  className="danger-button"
                  onClick={() => deleteConversation(selectedHistory.id)}
                >
                  Delete conversation
                </button>
              </div>
            ) : (
              <>
                <div className="history-toolbar">
                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search conversations..."
                  />
                  <button className="text-button" onClick={loadHistory}>
                    ↻ Refresh
                  </button>
                  {history.length > 0 && (
                    <button className="danger-button" onClick={clearHistory}>
                      Clear all
                    </button>
                  )}
                </div>

                {loadingHistory && (
                  <p className="muted">Loading conversations...</p>
                )}

                {filteredHistory.length === 0 ? (
                  <div className="empty-state">
                    No conversations found. Start speaking with VOX7 to build
                    your history.
                  </div>
                ) : (
                  filteredHistory.map(item => (
                    <div className="history-row" key={item.id}>
                      <button
                        className="history-open"
                        onClick={() => setSelectedHistory(item)}
                      >
                        <span className="recent-icon">◉</span>
                        <span className="recent-copy">
                          <strong>{item.transcript}</strong>
                          <small>
                            {new Date(item.created_at).toLocaleString()}
                          </small>
                          <small className="answer-preview">
                            {item.answer}
                          </small>
                        </span>
                        <span>→</span>
                      </button>
                      <button
                        className="icon-button"
                        title="Delete"
                        onClick={() => deleteConversation(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </>
            )}

            {error && <p className="error-message">{error}</p>}
          </section>
        )}



        <footer className="footer">
          VOX7 <span>·</span> POWERED BY GNANI AI AND GOOGLE GEMINI
        </footer>
      </main>
    </div>
  );
}

export default App;
