import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json()); // parse JSON body

const TARGET_URL = process.env.TARGET_URL || "https://eo3nbtii3r4ehzm.m.pipedream.net";

app.post("/", async (req, res) => {
  try {
    // Forward the incoming request body to your Pipedream URL
    await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    res.status(200).send("Webhook forwarded!");
  } catch (err) {
    console.error("Forwarding error:", err);
    res.status(500).send("Error forwarding webhook");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook forwarder running on port ${PORT}`));
