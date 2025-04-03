// services/chatgptSocketService.js

const { OpenAI } = require("openai");
const WebSocket = require("ws");

const openai = new OpenAI({
  apiKey: "your_api_key",
});

function createChatSocketServer(server) {
  const wss = new WebSocket.Server({ server, path: "/chat" });

  wss.on("connection", (ws) => {
    console.log("🧠 ChatGPT WebSocket connected");

    let chatHistory = [
      { role: "system", content: "You are a helpful, friendly assistant." }
    ];

    ws.on("message", async (message) => {
      const userMessage = message.toString();
      console.log("📨 User:", userMessage);

      chatHistory.push({ role: "user", content: userMessage });

      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: chatHistory,
          stream: true
        });

        let fullReply = "";

        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            ws.send(delta); // send token by token
            fullReply += delta;
          }
        }

        chatHistory.push({ role: "assistant", content: fullReply });
      } catch (err) {
        console.error("❌ GPT Error:", err.message);
        ws.send("[Error from AI: " + err.message + "]");
      }
    });

    ws.on("close", () => {
      console.log("❌ ChatGPT WebSocket closed");
    });
  });
}

module.exports = createChatSocketServer;