const axios = require("axios");

const sentUsers = new Set(); // Track users already messaged

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "instagram") {
    body.entry.forEach(async (entry) => {
      const changes = entry.changes || [];

      for (let change of changes) {
        const value = change.value;

        if (
          value &&
          value.comment_id &&
          value.text &&
          value.media &&
          value.media.id &&
          value.text.toLowerCase().includes("loot")
        ) {
          const mediaId = value.media.id;
          const userId = value.from.id;

          // Only respond once per user
          if (sentUsers.has(userId)) {
            console.log("Already messaged user:", userId);
            continue;
          }

          // Optional: Check if mediaId matches your target Reel ID (DLUbbsCopqC)
          // You can prefetch and match against expected mediaId once available

          // Send DM using Graph API
          try {
            await axios.post(
              `https://graph.facebook.com/v18.0/${userId}/messages`,
              {
                recipient: { id: userId },
                message: {
                  text: `🔥 FLASH SALE ₹200 INSTANT CASHBACK

⚡ Open Free Account & Get Instant ₹200 in UPI

⬇️ Link: https://rfox.in/d72c77a

• Enter your UPI ID and Submit.

• Install App in Fresh Device

• Then check your Tracking: https://tracker.rfox.in/upxapptrack

• Complete KYC only if it shows "Tracked". Don't proceed if not.

💎 Use only Mobile Data, not WiFi or Hotspot.`,
                },
              },
              {
                headers: {
                  Authorization: `Bearer YOUR_PAGE_ACCESS_TOKEN`,
                },
              }
            );

            sentUsers.add(userId);
            console.log(`✅ Sent DM to user ${userId}`);
          } catch (error) {
            console.error("❌ DM sending failed:", error.response?.data || error.message);
          }
        }
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});
