const express = require('express');
const fetch = require('node-fetch'); // or native fetch
const app = express();
app.use(express.json());

// Fetch from environment variables
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;
const WP_URL = process.env.WP_URL; // e.g. https://gorgeous-straw.localsite.io/wp-json/mpesa/v1/callback

if (!WP_USERNAME || !WP_PASSWORD || !WP_URL) {
  console.error('Missing environment variables! Please set WP_USERNAME, WP_PASSWORD, WP_URL');
  process.exit(1);
}

app.post('/', async (req, res) => {
  try {
    console.log('Received callback from Daraja:', JSON.stringify(req.body, null, 2));

    // Basic Auth header
    const authHeader = 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64');

    // Forward the callback to your live WP site
    const wpRes = await fetch(WP_URL, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const wpBody = await wpRes.text();
    console.log('Forwarded to WP, response:', wpBody);

    res.status(200).send('OK');
  } catch (err) {
    console.error('Error forwarding callback:', err);
    res.status(500).send('Error forwarding callback');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MPesa relay running on port ${PORT}`));
