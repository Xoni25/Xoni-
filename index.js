const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors()); // 🔥 Hozzáadva!

const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1387068338223452211/or5BSRceIA78g02wyyjeiXKfEoFyk77WOTPLxuF2oyO19JHSTzO4_lTkslk_ThG5s5XQ";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const msg = req.query.msg || "📡 Üzenet érkezett a GET / végpontra";
  await sendToDiscord(msg, res);
});

app.post('/send', async (req, res) => {
  const msg = req.body.msg || "📡 Üzenet érkezett a POST /send végpontra";
  await sendToDiscord(msg, res);
});

async function sendToDiscord(message, res) {
  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });

    if (response.status === 204) {
      res.send("✅ Üzenet sikeresen elküldve a Discordra.");
    } else {
      res.status(500).send("❌ Hiba történt. HTTP kód: " + response.status);
    }
  } catch (error) {
    res.status(500).send("❌ Hálózati hiba: " + error.message);
  }
}

app.listen(PORT, () => {
  console.log(`🌐 Webhook proxy elindult a ${PORT} porton.`);
});
