const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/login', async (req, res) => {
  try {
    // 1️⃣ Leer query
    const username = decodeURIComponent(req.query.user ?? '');
    const password = decodeURIComponent(req.query.pass ?? '');

    if (!username || !password) {
      return res.status(400).json({
        error: 'user y pass son requeridos'
      });
    }

    // 2️⃣ Body JSON (ANDROID)
    const body = {
      login: username,
      password: password,
      captcha: '',
      rememberMe: true
    };

    // 3️⃣ Headers ANDROID reales
    const headers = {
      Host: 'go3.lv',
      Accept: 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
      'API-CorrelationId': 'mobile_4f6f74f3c7bf8f1f61f7e0b515f4b97c',
      'API-DeviceUid': '629085d9dbedcb88',
      'API-DeviceInfo': 'SM-S9180;32;android;12;samsung;2.2.2.471;',
      'User-Agent': 'okhttp/4.12.0',
      'Connection': 'keep-alive'
    };

    // 4️⃣ POST directo a GO3 (ANDROID)
    const response = await axios.post(
      'https://go3.lv/api/subscribers/login?tenant=OM_LV&lang=LV&platform=ANDROID',
      body,
      {
        headers,
        validateStatus: () => true
      }
    );

    // 5️⃣ Respuesta cruda
    res.status(response.status).json({
      request: {
        username,
        body
      },
      go3Status: response.status,
      go3Headers: response.headers,
      go3Response: response.data
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error interno',
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Server listo en http://localhost:${PORT}/login`);
});