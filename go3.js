const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const https = require('https');

const app = express();
const PORT = 3000;

/* =========================
   HTTPS AGENT (KEEP ALIVE)
========================= */
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 15000,
  maxSockets: 50
});

/* =========================
   LOGIN
========================= */
app.get('/login', async (req, res) => {
  const { user, pass } = req.query;

  if (!user || !pass) {
    return res.status(400).json({ error: 'user y pass son requeridos' });
  }

  try {
    const response = await axios.post(
      'https://go3.lv/api/subscribers/login?tenant=OM_LV&lang=LV&platform=ANDROID',
      {
        login: user,
        password: pass,
        captcha: '',
        rememberMe: true
      },
      {
        httpsAgent,
        timeout: 15000,
        validateStatus: s => s < 500,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'okhttp/4.12.0',
          'API-DeviceUid': crypto.randomUUID(),
          'API-CorrelationId': `mobile_${crypto.randomBytes(16).toString('hex')}`,
          'API-DeviceInfo': 'SM-S9180;32;android;12;samsung;'
        }
      }
    );

    res.status(response.status).json(response.data);

  } catch (err) {
    res.status(500).json({
      error: 'Error interno',
      message: err.message
    });
  }
});

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Servidor Actualizado 07/02/26 http://localhost:${PORT}/login`);
});