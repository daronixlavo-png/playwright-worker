const { chromium } = require('playwright');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function startSessions() {
    // Launch browser in headless mode
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
        storageState: path.resolve('./sessions/session.json') // Session file
    });

    const page = await context.newPage();

    // Example: Instant DM login flow
    await page.goto('https://app.instantdm.com/login', { waitUntil: 'load' });
    await page.waitForTimeout(5000); // Wait 5s after full load

    // Continue with Instagram
    await page.click('text=Continue with Instagram');
    await page.fill('input[name="username"]', process.env.INSTA_USERNAME);
    await page.fill('input[name="password"]', process.env.INSTA_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'load' });
    
    // Accept permissions if shown
    const allowBtn = await page.$('text=Allow');
    if (allowBtn) await allowBtn.click();

    // Example: navigate dashboard -> Insta automation
    await page.click('text=Instagram Automation');

    console.log('Automation started successfully.');
}

module.exports = { startSessions };
