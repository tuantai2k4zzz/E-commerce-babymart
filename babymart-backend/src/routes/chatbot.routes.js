// src/routes/chatbot.routes.js
import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * POST /api/chatbot
 * body: { message }
 */
router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful e-commerce shopping assistant for a baby products store called Babymart. Answer in Vietnamese if the user speaks Vietnamese."
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Chatbot error" });
  }
});

export default router;
