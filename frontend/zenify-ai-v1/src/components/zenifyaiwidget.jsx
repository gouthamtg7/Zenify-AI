import { useEffect } from 'react';

function ZenifyWidget() {
  useEffect(() => {
    // 💬 CHAT BOT
    const chatWidget = document.createElement("div");
    chatWidget.id = "zen-chat";
    chatWidget.innerHTML = `
      <style>
        /* All your chat styles here (same as widget.js) */
      </style>
      <div id="zen-chat-header">💬 Chat with Zen</div>
      <div id="zen-chat-body"></div>
      <div id="zen-chat-input">
        <input type="text" placeholder="Ask me anything..." />
        <button>➤</button>
      </div>
    `;
    document.body.appendChild(chatWidget);

    const chatBody = chatWidget.querySelector("#zen-chat-body");
    const chatInput = chatWidget.querySelector("input");
    const chatSendBtn = chatWidget.querySelector("button");

    const socket = new WebSocket("ws://localhost:4000/chat");
    let botMsg;

    socket.onmessage = (event) => {
      if (botMsg) {
        botMsg.textContent += event.data;
      } else {
        botMsg = document.createElement("div");
        botMsg.className = "zen-msg zen-bot";
        botMsg.textContent = event.data;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    };

    chatSendBtn.onclick = () => {
      const userText = chatInput.value.trim();
      if (!userText) return;

      const msg = document.createElement("div");
      msg.className = "zen-msg zen-user";
      msg.textContent = userText;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;

      socket.send(userText);
      chatInput.value = "";
      botMsg = null;
    };

    // 🎙️ VOICE BOT
    const voiceButton = document.createElement("button");
    voiceButton.id = "zenify-button";
    voiceButton.textContent = "🎙️";
    voiceButton.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4b7bec;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 28px;
      cursor: pointer;
      z-index: 9999;
    `;

    voiceButton.onclick = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);
        formData.append("prompt", "You are a friendly assistant for this website");

        const res = await fetch("http://localhost:4000/process", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        if (data.gpt_reply) {
          const utter = new SpeechSynthesisUtterance(data.gpt_reply);
          speechSynthesis.speak(utter);
        }
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 5000);
    };

    document.body.appendChild(voiceButton);

    return () => {
      // Clean up when component unmounts
      document.body.removeChild(chatWidget);
      document.body.removeChild(voiceButton);
      socket.close();
    };
  }, []);

  return null; // This component manipulates DOM directly
}

export default ZenifyWidget;
