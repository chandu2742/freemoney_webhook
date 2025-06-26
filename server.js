app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("📩 Webhook received:", JSON.stringify(body, null, 2));

  if (body.object === "instagram") {
    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const comment = change.value.text?.toLowerCase();
        const igUserId = change.value.from?.id;
        const reelId = change.value.media?.id;

        console.log("👉 Comment:", comment);
        console.log("👤 User ID:", igUserId);
        console.log("🎥 Reel ID:", reelId);

        if (comment === "loot" && !sentUsers.has(igUserId)) {
          sentUsers.add(igUserId);
          console.log("✅ LOOT detected — sending DM...");

          try {
            await axios.post(
              `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
              {
                recipient: { id: igUserId },
                message: { text: "🔥 FLASH SALE ₹200 INSTANT CASHBACK ... [your offer message here]" }
              }
            );
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
