const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

const VERIFY_TOKEN = "freemoneyautodm123";
const PAGE_ACCESS_TOKEN = "your_page_access_token_here"; // Replace this later

app.use(bodyParser.json());

// ✅ Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle Instagram comment events
app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry;

    if (entry && Array.isArray(entry)) {
      entry.forEach((item) => {
        const changes = item.changes || [];
        changes.forEach((change) => {
          const comment = change.value;

          if (
            comment &&
            comment.message &&
            (comment.message.toLowerCase().includes("loot") ||
              comment.message.toLowerCase().includes("cash"))
          ) {
            const commentId = comment.comment_id;
            const igUserId = comment.from.id;

            console.log(`🔥 New comment from user ${igUserId}: ${comment.message}`);
          }
        });
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    res.sendStatus(500);
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
