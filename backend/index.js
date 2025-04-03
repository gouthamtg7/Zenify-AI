const express = require("express");
const http = require("http");
const {WebSocketServer} = require("ws");
const cors = require("cors");
const aiRoutes = require("./src/routes/aiRoutes");



const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders : ['ContentType']
}));

app.use(express.json());
app.use(express.static('static'));

const server = http.createServer(app);

const wss = new WebSocketServer({server : server});

wss.on("connection",(ws)=>{
    console.log("🚀 WebSocket Connection Established! ⚙️")

    ws.on('message',(message)=>{
        console.log("Recieved : ", message.toString());
        ws.send("Echo : ", message.toString());
    });

    ws.on('close', () => {
        console.log('❌ WebSocket connection closed');
      });
});

//Routes
app.use(aiRoutes);

const createChatSocketServer = require("./src/services/openai.js");
createChatSocketServer(server); // 💬 Mounts the WebSocket


const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 HTTP + WebSocket server running on http://localhost:${PORT}`);
});