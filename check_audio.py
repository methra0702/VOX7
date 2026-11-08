import wave
from pathlib import Path

path = Path.home() / "Downloads" / "vox7-speech.wav"

try:
    with wave.open(str(path), "rb") as audio:
        print("VOX7 AUDIO CHECK")
        print("Channels:", audio.getnchannels())
        print("Sample rate:", audio.getframerate())
        print("Duration:", audio.getnframes() / audio.getframerate(), "seconds")
        print("Audio format: Valid WAV")
except Exception as e:
    print("Audio verification failed:", e)
