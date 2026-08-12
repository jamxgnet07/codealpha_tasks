const express = require("express");
const cors = require("cors");
const path = require("path");
const { findBestResponse } = require("./chatbot-data");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Message cannot be empty."
      });
    }

    const reply = findBestResponse(message);

    res.json({
      success: true,
      userMessage: message,
      reply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      reply: "Something went wrong on the server."
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});