const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: "your_api_key",
});

exports.processAudio = async (req, res) => {
  try {
    const audioPath = req.file?.path;
    const prompt = req.body?.prompt || "You are a helpful, friendly AI assistant for customer support.";

    if (!audioPath) {
      return res.status(400).json({ error: "Audio file is missing." });
    }

    const extName = path.extname(audioPath);
    const correctPath = extName !== ".webm"
      ? path.join(path.dirname(audioPath), `${path.basename(audioPath, extName)}.webm`)
      : audioPath;

    if (extName !== ".webm") {
      fs.renameSync(audioPath, correctPath);
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(correctPath),
      model: "whisper-1",
      response_format: "text",
    });

    console.log("✅ Transcript:", transcription);

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: transcription },
      ],
    });

    const gptReply = chatResponse.choices?.[0]?.message?.content;
    console.log("✅ GPT Reply:", gptReply);

    return res.json({
      transcript: transcription,
      gpt_reply: gptReply || "Sorry, I didn't get that.",
      audio_url: null,
    });

  } catch (err) {
    console.error("❌ Error in processAudio:", err.message);
    return res.status(500).json({
      error: "AI processing failed.",
      transcript: null,
      gpt_reply: null,
      audio_url: null,
    });
  }
};
