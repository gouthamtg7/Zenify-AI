(() => {
    // --- 🔊 Voice Assistant (Talk to Zen) ---
    const scriptTag = document.currentScript;
    const mountId = scriptTag.getAttribute("data-mount") || "zenify-widget-root";
  
    const root = document.createElement("div");
    root.id = mountId;
    document.body.appendChild(root);
  
    root.innerHTML = `
      <style>
        #${mountId} {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }
        #zenify-button {
          background-color: #4b7bec;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      </style>
      <button id="zenify-button">🎙️</button>
    `;
  
    const backendURL = "https://your-backend.com/process"; // replace with your real backend
  
    document.getElementById("zenify-button").onclick = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
  
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);
        formData.append("prompt", "You are a friendly assistant for this website");
  
        const res = await fetch(backendURL, {
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
  
    // --- 💬 Chat Assistant (Chat with Zen) ---
    const chatWidget = document.createElement("div");
    chatWidget.id = "zen-chat";
    chatWidget.innerHTML = `
      <style>
        #zen-chat {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 320px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border-radius: 10px;
          overflow: hidden;
          font-family: sans-serif;
          z-index: 9999;
        }
        #zen-chat-header {
          background: #4b7bec;
          color: white;
          padding: 10px;
          font-weight: bold;
          font-size: 16px;
        }
        #zen-chat-body {
          padding: 10px;
          max-height: 300px;
          overflow-y: auto;
          font-size: 14px;
        }
        .zen-msg { margin-bottom: 10px; }
        .zen-user { text-align: right; color: #333; }
        .zen-bot { text-align: left; color: #4b7bec; }
        #zen-chat-input {
          border-top: 1px solid #ccc;
          display: flex;
        }
        #zen-chat-input input {
          flex: 1;
          padding: 8px;
          border: none;
          outline: none;
        }
        #zen-chat-input button {
          background: #4b7bec;
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
        }
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
  
    const socket = new WebSocket("ws://localhost:4000/chat"); // Replace with production URL
  
    let botMsg;
  
    socket.onopen = () => console.log("🧠 Connected to Zen Chat");
  
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
  
    socket.onclose = () => {
      const end = document.createElement("div");
      end.className = "zen-msg zen-bot";
      end.textContent = "[Chat ended]";
      chatBody.appendChild(end);
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
  })();
  