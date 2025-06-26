const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");

const VERIFY_TOKEN = "freemoneyautodm123";
const PAGE_ACCESS_TOKEN = "your_page_access_token_here"; // You’ll get this from Meta

app.use(bodyParser.json());

// Verification endpoint for webhook setup
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

// Listener for Instagram comment events
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry;
  if (entry && Array.isArray(entry)) {
    entry.forEach(async (item) => {
      const changes = item.changes || [];
      changes.forEach(async (change) => {
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

         
