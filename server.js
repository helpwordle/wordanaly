const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle word analysis request
app.post('/analyze', async (req, res) => {
  const word = req.body.word;
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(apiUrl, {
      contents: [{
        parts: [{ text: word }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const analysis = response.data.candidates?.map(c => c.content).join('<br>') || 'No analysis available';
    res.json({ analysis });
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || 'API request failed';
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});