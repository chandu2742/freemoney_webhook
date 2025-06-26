const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

const VERIFY_TOKEN = "freemoneyautodm123";
const PAGE_ACCESS_TOKEN = "PASTE_YOUR_PAGE_ACCESS_TOKEN_HERE";

const sentUsers = new Set();

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Webhook receiver
app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("📩 Webhook received:", JSON.stringify(body, null, 2));

  if (body.object === "instagram") {
    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const comment = change.value.text?.toLowerCase();
        const igUserId = change.value.from?.id;

        console.log("👉 Comment:", comment);
        console.log("👤 User ID:", igUserId);

        if (comment === "loot" && !sentUsers.has(igUserId)) {
          sentUsers.add(igUserId);
          console.log("✅ LOOT detected — sending DM...");

          try {
            await axios.post(
              `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
              {
                recipient: { id: igUserId },
                message: {
                  text:
                    "🔥 FLASH SALE ₹200 INSTANT CASHBACK\n\n⚡ Open Free Account & Get Instant ₹200 in UPI\n⬇️ Link : https://rfox.in/d72c77a\n\n• Enter your UPI ID and Submit.\n• Install App in Fresh Device\n• Then open 2nd link & enter same UPI ID: https://tracker.rfox.in/upxapptrack\n• Complete KYC with Aadhar & PAN\n✅ Cashback in 24-48 hrs\n\n💎 Don’t use WiFi. Use mobile data only."
                }
              }
            );
            console.log("📤 Message sent!");
          } catch (err) {
            console.error("❌ DM failed:", err.response?.data || err.message);
          }
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
