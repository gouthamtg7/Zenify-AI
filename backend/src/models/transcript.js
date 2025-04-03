// ✅ models/ZenAgent.js
const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userInput: String,
  gptReply: String,
  audioDuration: Number, // in seconds
});

const zenAgentSchema = new mongoose.Schema({
  // Setup Info
  businessType: String,
  agentRole: String,
  services: String,
  questions: String,
  tone: String,
  languages: [String],
  goal: String,
  avoid: String,

  // Core Prompt
  prompt: { type: String, required: true },

  // Transcripts
  transcripts: [transcriptSchema],

  // Usage Stats
  totalCalls: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },

  // Optional Identity (email or sessionId)
  userEmail: { type: String, default: "demo@zenify.ai" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ZenAgent", zenAgentSchema);
