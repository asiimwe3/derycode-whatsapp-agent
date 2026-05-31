const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ─── DERYCODE AGENT CONFIG ───────────────────────────────
const AGENT = {
  name: 'Derick',
  company: 'Derycode',
  phone: '256762306675',
  services: [
    'Mobile & Web App Development',
    'Crypto & Blockchain Platforms',
    'Digital Library Systems',
    'Management & ERP Software',
    'Banking & Financial Systems',
    'Full-Stack Development',
    'Enterprise Software Solutions',
  ],
};

const WABLAS_TOKEN = process.env.WABLAS_TOKEN || '';
const WABLAS_URL = 'https://solo.wablas.com/api';

// ─── MESSAGE TEMPLATES ───────────────────────────────────
const introMessage = (name = '') =>
  `Hey${name ? ' ' + name : ''}! 👋 I'm Derick, a software engineer at Derycode.\n\nWe build apps, websites, banking systems, management software and crypto platforms for businesses across Africa and beyond.\n\nJust dropping by to say hi — is there anything tech-related we can help you with? 😊`;

const followUpMessage = () =>
  `At Derycode we handle everything from scratch:\n\n1. Web & Mobile Apps\n2. Banking & Fintech Systems\n3. Management Software\n4. Crypto Platforms\n5. Digital Libraries\n6. Full-Stack Development\n\nWe offer free consultation for new clients. Want to chat about a project? 🚀`;

const replyMessage = (msg) => {
  const lower = msg.toLowerCase();
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return `Great question! 💡 Pricing depends on the project scope. We offer flexible packages for startups and enterprises alike.\n\nLet's hop on a quick call so I can give you an accurate quote. WhatsApp me directly: 0762306675 😊`;
  }
  if (lower.includes('yes') || lower.includes('interested') || lower.includes('sure') || lower.includes('okay')) {
    return `Awesome! 🙌 Tell me a bit about your project — what are you trying to build? We'll figure out the best approach together.`;
  }
  if (lower.includes('no') || lower.includes('not interested')) {
    return `No worries at all! 😊 Feel free to reach out anytime if you ever need tech help. Have a great day!`;
  }
  return `Thanks for the reply! 😊 At Derycode we love solving tough tech problems. Whether it's an app, website, banking system or management software — we've got you covered. Want to know more about any specific service?`;
};

// ─── SEND MESSAGE VIA WABLAS ─────────────────────────────
async function sendMessage(phone, message) {
  try {
    const res = await axios.post(
      `${WABLAS_URL}/send-message`,
      { phone, message },
      { headers: { Authorization: WABLAS_TOKEN } }
    );
    return res.data;
  } catch (err) {
    console.error('Send error:', err.response?.data || err.message);
  }
}

// ─── SEND BULK OUTREACH ──────────────────────────────────
async function sendBulkOutreach(numbers) {
  const results = [];
  for (const number of numbers) {
    const res = await sendMessage(number, introMessage());
    results.push({ number, status: res?.status || 'sent' });
    // Delay between messages to avoid ban
    await new Promise(r => setTimeout(r, 3000));
  }
  return results;
}

// ─── ROUTES ──────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ agent: AGENT.name, company: AGENT.company, status: 'running' });
});

// Send outreach to a list of numbers
app.post('/outreach', async (req, res) => {
  const { numbers } = req.body;
  if (!numbers || !Array.isArray(numbers)) {
    return res.status(400).json({ error: 'Provide an array of numbers' });
  }
  const results = await sendBulkOutreach(numbers);
  res.json({ sent: results.length, results });
});

// Send single message
app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: 'phone and message required' });
  }
  const result = await sendMessage(phone, message);
  res.json(result);
});

// Webhook — receive incoming messages and auto-reply
app.post('/webhook', async (req, res) => {
  const { data } = req.body;
  if (!data) return res.sendStatus(200);

  const incoming = Array.isArray(data) ? data : [data];

  for (const msg of incoming) {
    const phone = msg.phone;
    const text = msg.message || '';
    console.log(`Incoming from ${phone}: ${text}`);

    // Auto-reply
    const reply = replyMessage(text);
    await sendMessage(phone, reply);
  }

  res.sendStatus(200);
});

// ─── START ───────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Derycode Agent running on port ${PORT}`));
