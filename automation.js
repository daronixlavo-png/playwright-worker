const { chromium } = require('playwright');

(async () => {
    try {
        // Launch browser in headed mode (GUI visible)
        const browser = await chromium.launch({ headless: false });

        // Open new page
        const page = await browser.newPage();

        // Example: Navigate to Instagram login page
        await page.goto('https://www.instagram.com/accounts/login/');

        console.log('Login page loaded');

        // Wait for login fields
        await page.waitForSelector('input[name="username"]');
        await page.waitForSelector('input[name="password"]');

        // Example: fill username & password (replace with env variables!)
        await page.fill('input[name="username"]', process.env.IG_USERNAME || 'your_username');
        await page.fill('input[name="password"]', process.env.IG_PASSWORD || 'your_password');

        // Click login
        await page.click('button[type="submit"]');

        // Wait for main page to load
        await page.waitForTimeout(5000); // adjust as needed

        console.log('Logged in successfully');

        // Example: navigate to create post
        // (Instagram web upload button)
        // await page.click('[aria-label="New Post"]');  // selector may vary

        // Add your automation workflow here
        console.log('Ready to perform post automation');

        // Keep browser open for interaction
        // GUI will remain until /stop is hit
        // await browser.close(); // DO NOT close here if you want GUI interactable

    } catch (err) {
        console.error('Automation error:', err);
    }
})();
