const { OpenAI } = require("openai");
const ZenAgent = require("../models/transcript");
require("dotenv").config();

const openai = new OpenAI({ apiKey: "your_api_key" });

const summarizePrompt = async (req, res) => {
  try {
    const data = req.body;

    const summary = `
You are a ${data.tone || 'friendly'} AI ${data.agentRole} working for a ${data.businessType}.
The business offers: ${data.services}.
You often get questions like: ${data.questions}.
Please respond in ${data.languages.join(', ')}.
Your main goal is to: ${data.goal}.
${data.avoid ? "You should avoid: " + data.avoid : ""}
    `;

    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Summarize the following into a usable prompt for an AI voice assistant:",
        },
        {
          role: "user",
          content: summary,
        },
      ],
    });

    const summarizedPrompt = chat.choices?.[0]?.message?.content;

    // ✅ Save to MongoDB
    const agent = await ZenAgent.create({
      businessType: data.businessType,
      agentRole: data.agentRole,
      services: data.services,
      questions: data.questions,
      tone: data.tone,
      languages: data.languages,
      goal: data.goal,
      avoid: data.avoid,
      prompt: summarizedPrompt,
    });

    res.json({
      message: "Prompt summarized and saved",
      agentId: agent._id,
      prompt: summarizedPrompt,
    });

  } catch (err) {
    console.error("❌ Error summarizing prompt:", err.message);
    res.status(500).json({ error: "Could not summarize or save prompt." });
  }
};

module.exports = { summarizePrompt };
