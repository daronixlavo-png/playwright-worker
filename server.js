require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { runAutomation, startSessions } = require('./automation');

const app = express();
app.use(bodyParser.json());

app.get('/ping', (req, res) => res.send('Server is alive'));

// Start sessions for ChatGPT, Instagram & InstantDM
app.get('/startDT', async (req, res) => {
  try {
    await startSessions();
    res.send('All sessions saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error starting sessions');
  }
});

// Run full automation workflow
app.post('/runDT', async (req, res) => {
  const { mp4Url, affiliateLink } = req.body;
  if (!mp4Url || !affiliateLink) return res.status(400).send('Missing parameters');

  try {
    await runAutomation(mp4Url, affiliateLink);
    res.send('Automation completed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error running automation');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
