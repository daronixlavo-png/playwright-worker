const express = require('express');
const { chromium } = require('playwright');
const app = express();
const PORT = process.env.PORT || 6080;

let browserContext = null;

app.get('/ping', (req, res) => {
    res.send('Server alive');
});

app.get('/start', async (req, res) => {
    if (browserContext) {
        return res.send('GUI already running');
    }
    try {
        const userDataDir = '/app/user-data';
        browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
        res.send('GUI started temporarily via Xvfb');
    } catch (err) {
        console.error('Error starting GUI:', err);
        res.status(500).send('Failed to start GUI');
    }
});

app.get('/stop', async (req, res) => {
    if (browserContext) {
        await browserContext.close();
        browserContext = null;
        res.send('GUI stopped');
    } else {
        res.send('GUI not running');
    }
});

app.get('/run', async (req, res) => {
    try {
        const page = await browserContext.newPage();
        await page.goto('https://example.com'); // Replace with your workflow
        console.log('Page title:', await page.title());
        await page.close();
        res.send('Automation run completed');
    } catch (err) {
        console.error('Error running automation:', err);
        res.status(500).send('Automation failed');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
