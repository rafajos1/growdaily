import sounddevice as sd
import numpy as np
import queue, time, sys
import whisper
from termcolor import colored
import webrtcvad

# ------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------
DEVICE_INDEX = 2          # MacBook Air Microphone
SAMPLE_RATE = 16000       # stable rate for Whisper
FRAME_DURATION = 30       # ms per frame for VAD
BLOCK_SIZE = int(SAMPLE_RATE * FRAME_DURATION / 1000)
WAKE_WORD = "hey bible"
EXIT_PHRASE = "stop"

# ------------------------------------------------------------
# INITIALIZE
# ------------------------------------------------------------
print(colored("🎧 Initializing VoiceBible v11...", "cyan"))
model = whisper.load_model("base")
vad = webrtcvad.Vad(1)
audio_q = queue.Queue()
active_session = True

# ------------------------------------------------------------
# STREAM CALLBACK
# ------------------------------------------------------------
def audio_callback(indata, frames, time_info, status):
    if status:
        print(colored(f"⚠️ Audio status: {status}", "yellow"))
    try:
        # Convert to bytes for VAD
        audio_q.put(indata.copy())
    except Exception as e:
        print(colored(f"❌ Frame error: {e}", "red"))

# ------------------------------------------------------------
# RECORD AUDIO
# ------------------------------------------------------------
def record_audio(duration=6):
    print(colored("🎙️ Listening...", "cyan"))
    frames = []
    try:
        with sd.InputStream(samplerate=SAMPLE_RATE,
                            blocksize=BLOCK_SIZE,
                            device=DEVICE_INDEX,
                            dtype='int16',
                            channels=1,
                            callback=audio_callback):
            start = time.time()
            while time.time() - start < duration:
                try:
                    data = audio_q.get(timeout=1)
                    data_bytes = data.tobytes()
                    if len(data_bytes) < 480:  # skip undersized frames
                        continue
                    is_speech = vad.is_speech(data_bytes, SAMPLE_RATE)
                    vol = np.abs(np.frombuffer(data_bytes, np.int16)).mean()
                    bar = "█" * int(vol / 500)
                    sys.stdout.write(f"\r🎤 {bar:<40} {vol/1000:.3f}")
                    sys.stdout.flush()
                    if is_speech:
                        frames.append(data)
                except queue.Empty:
                    pass
            print()
    except Exception as e:
        print(colored(f"❌ Audio error: {e}", "red"))
        return ""
    if not frames:
        print(colored("🤔 No speech detected.", "yellow"))
        return ""
    # concatenate frames and normalize
    audio = np.concatenate(frames).astype(np.float32) / 32768.0
    result = model.transcribe(audio, fp16=False, language="en")
    text = result["text"].strip().lower()
    print(colored(f"\n🗣️ You said: {text}", "magenta"))
    return text

# ------------------------------------------------------------
# HANDLE COMMANDS
# ------------------------------------------------------------
def handle_command(cmd):
    global active_session
    if not cmd:
        return
    if WAKE_WORD in cmd:
        print(colored("💬 VoiceBible: Yes, I'm listening.", "green"))
    elif EXIT_PHRASE in cmd:
        print(colored("🙏 VoiceBible: Goodbye, God bless you.", "yellow"))
        active_session = False
    elif "read" in cmd:
        print(colored("📖 VoiceBible: I’ll read continuously until you say pause or stop.", "blue"))
    elif "pause" in cmd:
        print(colored("⏸️ Paused reading.", "yellow"))
    else:
        print(colored("🤔 VoiceBible: I didn't quite get that.", "yellow"))

# ------------------------------------------------------------
# MAIN LOOP
# ------------------------------------------------------------
def start_loop():
    global active_session
    print(colored(f"\n🎧 Listening for '{WAKE_WORD.title()}' … (stable mode)\n", "cyan"))
    while active_session:
        cmd = record_audio(duration=6)
        if cmd:
            handle_command(cmd)
        time.sleep(0.5)
    print(colored("\n✅ VoiceBible session ended gracefully.\n", "green"))

# ------------------------------------------------------------
# RUN
# ------------------------------------------------------------
if __name__ == "__main__":
    print(colored("🚀 VoiceBible Ready — say 'Hey Bible' to begin!", "cyan"))
    try:
        start_loop()
    except KeyboardInterrupt:
        print(colored("\n🛑 Manual exit. Goodbye!\n", "red"))
