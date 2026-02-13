const { chromium, devices } = require('playwright');
require('dotenv').config();
const iPhone = devices['iPhone 13'];

async function startSessions() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ ...iPhone, userAgent: iPhone.userAgent });
  const page = await context.newPage();

  // ----- ChatGPT login -----
  await page.goto('https://chat.openai.com/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);
  await page.fill('input[name="username"]', process.env.CHATGPT_USER);
  await page.fill('input[name="password"]', process.env.CHATGPT_PASS);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  // Save ChatGPT session
  await context.storageState({ path: './sessions/chatgpt.json' });

  // ----- InstantDM + Instagram login -----
  await page.goto('https://app.instantdm.com/login');
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);
  await page.click('button:has-text("Continue with Instagram")');
  await page.waitForTimeout(5000);
  await page.fill('input[name="username"]', process.env.INSTA_USER);
  await page.fill('input[name="password"]', process.env.INSTA_PASS);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  await page.click('button:has-text("Allow")');

  // Save InstantDM + Instagram session
  await context.storageState({ path: './sessions/instantdm.json' });

  await browser.close();
}

async function runAutomation(mp4Url, affiliateLink) {
  const browser = await chromium.launchPersistentContext({
    userDataDir: './sessions',
    headless: true
  });
  const page = await browser.newPage();

  // ----- ChatGPT Automation -----
  await page.goto('https://chat.openai.com/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);
  // Navigate to specific chat/folder
  await page.setInputFiles('input[type="file"]', mp4Url);
  await page.waitForTimeout(5000);
  const chatResponse = await page.locator('div.message:last-child').innerText();

  // ----- Instagram Automation -----
  await page.goto('https://www.instagram.com/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);
  await page.click('button:has-text("Create")');
  await page.waitForTimeout(5000);
  await page.setInputFiles('input[type="file"]', mp4Url);
  await page.fill('textarea[aria-label="Caption"]', chatResponse);
  await page.waitForTimeout(5000);
  await page.click('button:has-text("Share")');

  // ----- InstantDM Automation -----
  await page.goto('https://app.instantdm.com/dashboard');
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);
  await page.click('text=Instagram Automation');

  const postSelector = 'div.post:first-of-type';
  await page.locator(postSelector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(5000);
  await page.click(postSelector);
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);
  await page.locator('div.send-area').scrollIntoViewIfNeeded();
  await page.waitForTimeout(5000);
  await page.click('div.toggle-upper');
  await page.fill('textarea.affiliate-input', affiliateLink);
  await page.waitForTimeout(5000);
  await page.click('button:has-text("Publish")');

  await browser.close();
}

module.exports = { startSessions, runAutomation };
