const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 10000;

const VERIFY_TOKEN = "freemoneyautodm123";
const PAGE_ACCESS_TOKEN = "YOUR_PAGE_ACCESS_TOKEN"; // Replace this!

const sentUsers = new Set(); // To store users who already got DM

app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "instagram") {
    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const comment = change.value.text?.toLowerCase();
        const igUserId = change.value.from?.id;

        if (comment === "loot" && !sentUsers.has(igUserId)) {
          sentUsers.add(igUserId);
          console.log("LOOT detected, sending DM...");

          try {
            await axios.post(
              `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
              {
                recipient: { id: igUserId },
                message: {
                  text: `🔥 FLASH SALE ₹200 INSTANT CASHBACK \n\n⚡ Open Free Account & Get Instant ₹200 in UPI\n\n⬇️ Link : https://rfox.in/d72c77a\n\n• Enter your UPI ID and Submit.\n• Install App in Fresh Device\n\n(inthavaraku Upstox App download cheyaledho aa mobile lo chesi number & otp enter chesaka e 2nd link 👇🏻lo same upi id evandi tracked ani vastene kyc cheyandi)\n\nthen check your Tracking Here:- https://tracker.rfox.in/upxapptrack\n\n• If TRACKED, then Register Using NEW NUMBER.\n• Enter KYC Details and Verify Bank.\n• Cashback will come in 24–48hrs.\n\n💎 Don’t use Wi-Fi. Use Mobile Data only.`
                }
              }
            );
          } catch (err) {
            console.error("DM sending failed:", err.response?.data || err.message);
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
