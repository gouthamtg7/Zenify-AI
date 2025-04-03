import { useEffect, useRef, useState } from "react";

function TalkToZen() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      sendAudioToBackend(blob);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();

    setInterval(() => {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.start();
      }
    }, 5000);

    setIsRecording(true);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
  };

  const sendAudioToBackend = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    formData.append('prompt', "You are a friendly AI assistant for a website"); // hardcoded

    try {
      const res = await fetch('http://localhost:4000/talktozen', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log("🎧 AI Transcript:", data.transcript);
      console.log("🧠 GPT Reply:", data.gpt_reply);

      const utter = new SpeechSynthesisUtterance(data.gpt_reply);
      speechSynthesis.speak(utter);
    } catch (err) {
      console.error("🚨 Error sending audio:", err);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="zenify-call-box">
      <h3>🎙️ Talk to Zen AI</h3>
      <p className="zen-subtext">Speak to your AI assistant. We'll reply in voice!</p>
      <p>NOTE : This version may have a slight delay – but it works!</p>

      {isRecording && (
        <p className="zen-timer">⏱️ Duration: {formatDuration(duration)}</p>
      )}

      <div className="zen-buttons">
        <button
          className={`zen-btn start-btn ${isRecording ? 'transparent' : ''}`}
          onClick={startRecording}
          disabled={isRecording}
        >
          🔵 Start Call
        </button>
        <button
          className={`zen-btn stop-btn ${!isRecording ? 'transparent' : ''}`}
          onClick={stopRecording}
          disabled={!isRecording}
        >
          🔴 End Call
        </button>
      </div>
    </div>
  );
}

export default TalkToZen;
