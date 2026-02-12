const express = require('express');
const bodyParser = require('body-parser');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const RECORDINGS_DIR = path.join(__dirname, 'recordings');
if (!fs.existsSync(RECORDINGS_DIR)) fs.mkdirSync(RECORDINGS_DIR);

let guiBrowser = null;
let currentRecordingId = null;

// Ping endpoint
app.get('/ping', (req, res) => res.send('Server alive'));

// Start recording GUI
app.get('/start', async (req, res) => {
  if (guiBrowser) return res.send('GUI already running');
  currentRecordingId = uuidv4();
  const filePath = path.join(RECORDINGS_DIR, `${currentRecordingId}.js`);

  guiBrowser = await chromium.launch({ headless: false });
  const page = await guiBrowser.newPage();

  // Simple recorder logic (just demo: record URL visit)
  page.on('framenavigated', frame => {
    const content = `module.exports = async (page) => { await page.goto('${frame.url()}'); }`;
    fs.writeFileSync(filePath, content);
  });

  res.send({ message: 'GUI started for recording', recordingId: currentRecordingId });
});

// Stop recording GUI
app.get('/stop', async (req, res) => {
  if (!guiBrowser) return res.send('No GUI running');
  await guiBrowser.close();
  guiBrowser = null;
  res.send({ message: 'GUI stopped', recordingId: currentRecordingId });
  currentRecordingId = null;
});

// Run recorded automation headless
app.get('/run', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send('Missing id');
  const filePath = path.join(RECORDINGS_DIR, `${id}.js`);
  if (!fs.existsSync(filePath)) return res.status(404).send('Recording not found');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const automation = require(filePath);
  await automation(page);
  await browser.close();

  res.send({ message: `Automation ${id} executed headless` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
